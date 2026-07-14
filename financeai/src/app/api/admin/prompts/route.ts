import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRole, logAudit } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const prompts = await prisma.aIPrompt.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(prompts);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, prompt } = await req.json();
    
    if (!id || !prompt) return NextResponse.json({ error: "ID and prompt required" }, { status: 400 });

    const updated = await prisma.aIPrompt.update({
      where: { id },
      data: { 
        prompt,
        version: { increment: 1 } 
      }
    });

    // Log this action
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await logAudit(user.id, "PROMPT_UPDATED", `Prompt ${updated.name} updated to version ${updated.version}`);
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}
