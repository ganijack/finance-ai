import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseExpenseWithAI } from "@/services/ai/parser";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    // 3. Process with AI
    const parsedData = await parseExpenseWithAI(text);

    return NextResponse.json(parsedData);
  } catch (error: unknown) {
    console.error("[AI_PARSE_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
