import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    // Fetch user's data
    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        date: true,
        notes: true,
      }
    });

    if (format === "json") {
      return new NextResponse(JSON.stringify(expenses, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="financeai-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // For CSV and other formats, we can format them here or in the client.
    // Client-side export is actually easier and cheaper for CSV/Excel/PDF using the libraries we just installed.
    // But since the user asked for API routes, we provide JSON here and the client will use it.
    
    return NextResponse.json({ error: "Unsupported format via API. Use client-side generation." }, { status: 400 });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
