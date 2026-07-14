import { ai, MODEL_NAME } from "./gemini";

export interface ReceiptItem {
  title: string;
  amount: number;
  category: string;
  notes?: string;
}

export interface ParsedReceipt {
  store: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  confidence: number;
}

const RECEIPT_SYSTEM_PROMPT = `You are a financial AI assistant specialized in scanning and extracting data from receipts and invoices.
Your goal is to parse the image or PDF provided and extract structured financial data into a precise JSON format.

RULES:
1. Return ONLY valid JSON. No markdown formatting, no backticks, no explanations.
2. Extract the overall store/merchant name.
3. Extract the date of the transaction (format as YYYY-MM-DD if possible, otherwise use the exact date string).
4. Extract the total amount of the receipt as a number. Remove any currency symbols (e.g. "$", "Rp", "IDR").
5. Extract each individual line item purchased.
   - For each item, provide a "title" (e.g., "Latte", "Printer Paper").
   - For each item, provide the "amount" (price).
   - For each item, intelligently assign a "category" (e.g., "Food", "Office Supplies", "Transport", "Utilities", "Entertainment", "Shopping", "Other").
6. Provide a "confidence" score between 0.0 and 1.0 representing how legible the receipt was.

EXPECTED JSON SCHEMA:
{
  "store": "string (or empty string if not found)",
  "date": "string (YYYY-MM-DD) (or empty string if not found)",
  "total": number (or 0 if not found),
  "items": [
    {
      "title": "string",
      "amount": number,
      "category": "string",
      "notes": "string (optional details)"
    }
  ],
  "confidence": number
}`;

export async function parseReceiptWithAI(
  base64Data: string,
  mimeType: string
): Promise<ParsedReceipt> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        "Extract the details from this receipt.",
      ],
      config: {
        systemInstruction: RECEIPT_SYSTEM_PROMPT,
        temperature: 0.1, // Low temp for more deterministic parsing
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(responseText) as ParsedReceipt;

    // Basic validation
    if (!Array.isArray(parsedData.items)) {
      parsedData.items = [];
    }
    
    // Ensure numbers are actually numbers
    parsedData.total = Number(parsedData.total) || 0;
    parsedData.items = parsedData.items.map(item => ({
      ...item,
      amount: Number(item.amount) || 0
    }));

    return parsedData;
  } catch (error: unknown) {
    console.error("AI Receipt Parsing Error:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to parse receipt using AI. The image may be blurry or unreadable.");
  }
}
