import { ai, MODEL_NAME } from "./gemini";
import { Expense } from "@prisma/client";

const CHAT_SYSTEM_PROMPT = `You are an expert AI financial assistant. Your job is to answer the user's questions about their finances based strictly on the transaction data provided.

RULES:
1. ONLY use the provided transaction data to answer questions. If the user asks something outside the scope of this data, politely inform them that you can only answer questions related to their stored transactions.
2. Be conversational, helpful, and concise.
3. If the user asks for a calculation (e.g., "How much did I spend on X?"), compute it accurately using the data provided.
4. Format currency appropriately.
5. Do NOT fabricate or hallucinate any financial data.`;

export async function generateChatResponse(
  userMessage: string,
  history: Expense[]
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    // Simplify the payload to reduce token count and improve focus
    const safeHistory = history.map(e => ({
      date: typeof e.date === 'string' ? e.date : e.date.toISOString().split('T')[0],
      title: e.title,
      amount: e.amount,
      category: e.category
    }));

    const promptData = JSON.stringify(safeHistory);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        `Here is my transaction data (JSON format):\n${promptData}\n\nUser Question: ${userMessage}`,
      ],
      config: {
        systemInstruction: CHAT_SYSTEM_PROMPT,
        temperature: 0.3,
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    return responseText;
  } catch (error: unknown) {
    console.error("AI Chat Error:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to generate AI chat response.");
  }
}
