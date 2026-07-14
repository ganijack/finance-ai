import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseReceiptWithAI } from "@/services/ai/receipt";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, or PDF." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const parsedData = await parseReceiptWithAI(base64Data, file.type);

    return NextResponse.json(parsedData);
  } catch (error: unknown) {
    console.error("[RECEIPT_PARSE_ERROR]", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred while parsing the receipt." },
      { status: 500 }
    );
  }
}
