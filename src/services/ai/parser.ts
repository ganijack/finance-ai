import { ai, MODEL_NAME } from "./gemini";
import { PARSE_EXPENSE_SYSTEM_PROMPT, getExpensePrompt } from "./prompts";
import { format } from "date-fns";

export interface ParsedExpense {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  confidence: number;
}

export async function parseExpenseWithAI(text: string): Promise<ParsedExpense[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const currentDate = format(new Date(), "yyyy-MM-dd");
  const prompt = getExpensePrompt(text, currentDate);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: PARSE_EXPENSE_SYSTEM_PROMPT,
        temperature: 0.1, // Low temperature for more deterministic JSON output
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // Attempt to parse the JSON
    // responseMimeType: "application/json" guarantees a JSON string return
    const parsedData = JSON.parse(responseText) as ParsedExpense[];

    // Basic validation
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("Invalid JSON structure returned by AI: Expected an array of expenses");
    }

    return parsedData.map(expense => ({
      ...expense,
      notes: expense.notes || "",
    }));
  } catch (error: unknown) {
    console.error("AI Parsing Error:", error);
    
    // Surface the actual error message for better debugging
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to parse expense using AI. Please try again or enter manually.");
  }
}
