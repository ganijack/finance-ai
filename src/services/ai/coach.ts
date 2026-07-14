import { ai, MODEL_NAME } from "./gemini";

const COACH_SYSTEM_PROMPT = `You are a strict but encouraging AI financial coach. You are provided with a user's budget and current spending data.

RULES:
1. Return ONLY valid JSON.
2. Provide an "analysis" string (2-3 sentences max) evaluating their budget discipline.
3. Provide a list of "recommendations" (between 2 and 4 items).
   - "title": Short action title.
   - "description": Why they should do this based strictly on their budget data.
   - "impact": High, Medium, or Low.
4. Do NOT hallucinate data. Only reference the categories provided.

EXPECTED JSON SCHEMA:
{
  "analysis": "string",
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "impact": "High" | "Medium" | "Low"
    }
  ]
}`;

export interface BudgetStatusData {
  category: string;
  budgetAmount: number;
  currentSpending: number;
  percentageUsed: number;
}

export interface CoachResponse {
  analysis: string;
  recommendations: {
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
  }[];
}

export async function generateBudgetCoaching(
  budgetData: BudgetStatusData[]
): Promise<CoachResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (budgetData.length === 0) {
    return {
      analysis: "You haven't set up any budgets yet! Create some budgets so I can help you track your spending.",
      recommendations: []
    };
  }

  try {
    const promptData = JSON.stringify(budgetData, null, 2);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        "Please act as my financial coach and analyze my budget adherence:\n" + promptData,
      ],
      config: {
        systemInstruction: COACH_SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for more analytical advice
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(responseText) as CoachResponse;
    return parsedData;
  } catch (error: unknown) {
    console.error("AI Coach Error:", error);
    throw new Error("Failed to generate AI coaching.");
  }
}
