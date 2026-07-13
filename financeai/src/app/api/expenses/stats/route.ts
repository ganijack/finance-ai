import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getStartOfYear,
  getDaysInMonth,
} from "@/lib/utils";

// GET /api/expenses/stats — Aggregated stats
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfDay = getStartOfDay(now);
    const endOfDay = getEndOfDay(now);
    const startOfMonth = getStartOfMonth(now);
    const startOfYear = getStartOfYear(now);

    // Get aggregated totals
    const [todayResult, monthResult, yearResult] = await Promise.all([
      prisma.expense.aggregate({
        where: {
          userId: user.id,
          date: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: {
          userId: user.id,
          date: { gte: startOfMonth, lte: endOfDay },
        },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: {
          userId: user.id,
          date: { gte: startOfYear, lte: endOfDay },
        },
        _sum: { amount: true },
      }),
    ]);

    const today = todayResult._sum.amount || 0;
    const thisMonth = monthResult._sum.amount || 0;
    const thisYear = yearResult._sum.amount || 0;

    // Calculate daily average for this month
    const dayOfMonth = now.getDate();
    const dailyAverage = dayOfMonth > 0 ? thisMonth / dayOfMonth : 0;

    // Monthly trend — daily spending for the current month
    const monthExpenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        date: { gte: startOfMonth, lte: endOfDay },
      },
      select: { date: true, amount: true },
      orderBy: { date: "asc" },
    });

    const daysInMonth = getDaysInMonth(now);
    const dailyMap = new Map<string, number>();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), i);
      const key = d.toISOString().split("T")[0];
      dailyMap.set(key, 0);
    }

    monthExpenses.forEach((exp) => {
      const key = new Date(exp.date).toISOString().split("T")[0];
      dailyMap.set(key, (dailyMap.get(key) || 0) + exp.amount);
    });

    const monthlyTrend = Array.from(dailyMap.entries()).map(
      ([date, amount]) => ({
        date,
        amount,
      })
    );

    // Category breakdown
    const categoryData = await prisma.expense.groupBy({
      by: ["category"],
      where: {
        userId: user.id,
        date: { gte: startOfMonth, lte: endOfDay },
      },
      _sum: { amount: true },
      _count: true,
    });

    const categoryBreakdown = categoryData.map((cat) => ({
      category: cat.category,
      amount: cat._sum.amount || 0,
      percentage: thisMonth > 0 ? ((cat._sum.amount || 0) / thisMonth) * 100 : 0,
      count: cat._count,
    }));

    return NextResponse.json({
      today,
      thisMonth,
      thisYear,
      dailyAverage,
      monthlyTrend,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
