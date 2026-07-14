import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
// Make sure to never expose this client to the browser directly
// It should only be used in server actions or API routes
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const MODEL_NAME = "gemini-3.1-flash-lite";
