import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { calculateAnalytics } from "@/services/analytics";
import { generateFinancialInsights } from "@/services/ai/insights";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch expenses for the current year (to give enough data for insights without overloading)
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    if (expenses.length === 0) {
      return NextResponse.json({
        stats: null,
        insights: null,
        message: "Not enough data to generate insights."
      });
    }

    const stats = calculateAnalytics(expenses);
    const insights = await generateFinancialInsights(stats);

    return NextResponse.json({ stats, insights });
  } catch (error: unknown) {
    console.error("[INSIGHTS_API_ERROR]", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred while generating insights." },
      { status: 500 }
    );
  }
}
