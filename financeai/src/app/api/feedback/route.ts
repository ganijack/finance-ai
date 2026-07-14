import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, category, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        subject,
        category: category || "FEATURE",
        content,
      }
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
