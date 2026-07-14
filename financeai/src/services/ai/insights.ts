import { ai, MODEL_NAME } from "./gemini";
import { AnalyticsSummary } from "@/services/analytics";

export interface AIInsightsResponse {
  summaryText: string;
  recommendations: {
    title: string;
    description: string;
    actionable: boolean;
  }[];
}

const INSIGHTS_SYSTEM_PROMPT = `You are an expert AI financial advisor. Your job is to analyze the provided JSON containing a user's financial statistics for the month and generate personalized insights and actionable recommendations.

RULES:
1. Return ONLY valid JSON.
2. Provide a "summaryText" (2-3 sentences) summarizing their financial health and spending trend.
3. Provide a list of "recommendations" (between 3 and 5 items).
   - Each recommendation must have a "title" (e.g., "Optimize Subscription Costs").
   - Each recommendation must have a "description" explaining *why* based on their actual data.
   - Each recommendation must have an "actionable" boolean (true if it's something they can directly act on, false if it's just an observation).
4. Do NOT hallucinate data. Only reference the categories, amounts, and trends provided in the JSON.
5. Be encouraging but honest.

EXPECTED JSON SCHEMA:
{
  "summaryText": "string",
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "actionable": boolean
    }
  ]
}`;

export async function generateFinancialInsights(
  stats: AnalyticsSummary
): Promise<AIInsightsResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    const promptData = JSON.stringify(stats, null, 2);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        "Please analyze my financial statistics and provide insights and recommendations based on this data:\n" + promptData,
      ],
      config: {
        systemInstruction: INSIGHTS_SYSTEM_PROMPT,
        temperature: 0.4, // Slight creativity for human-like advice, but structured
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(responseText) as AIInsightsResponse;
    return parsedData;
  } catch (error: unknown) {
    console.error("AI Insights Error:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to generate AI insights.");
  }
}
