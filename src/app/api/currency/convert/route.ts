import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getExchangeRate } from "@/services/exchange-rate";

// POST /api/currency/convert — Convert all user expenses from one currency to another
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { from, to } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: "Both 'from' and 'to' currency codes are required" },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json({ message: "No conversion needed", converted: 0 });
    }

    // Get exchange rate
    let rate: number;
    try {
      rate = await getExchangeRate(from, to);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch exchange rate. Please try again later." },
        { status: 502 }
      );
    }

    // Get all user expenses
    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      select: { id: true, amount: true, currency: true },
    });

    // Convert each expense
    const updatePromises = expenses.map((expense) => {
      const convertedAmount = Math.round(expense.amount * rate * 100) / 100;
      return prisma.expense.update({
        where: { id: expense.id },
        data: {
          originalAmount: expense.amount,
          originalCurrency: expense.currency || from,
          amount: convertedAmount,
          currency: to,
        },
      });
    });

    await Promise.all(updatePromises);

    // Also convert budgets
    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      select: { id: true, amount: true },
    });

    const budgetUpdates = budgets.map((budget) => {
      const convertedAmount = Math.round(budget.amount * rate * 100) / 100;
      return prisma.budget.update({
        where: { id: budget.id },
        data: { amount: convertedAmount },
      });
    });

    await Promise.all(budgetUpdates);

    // Also convert saving goals
    const goals = await prisma.savingGoal.findMany({
      where: { userId: user.id },
      select: { id: true, targetAmount: true, currentAmount: true },
    });

    const goalUpdates = goals.map((goal) => {
      const convertedTarget = Math.round(goal.targetAmount * rate * 100) / 100;
      const convertedCurrent = Math.round(goal.currentAmount * rate * 100) / 100;
      return prisma.savingGoal.update({
        where: { id: goal.id },
        data: {
          targetAmount: convertedTarget,
          currentAmount: convertedCurrent,
        },
      });
    });

    await Promise.all(goalUpdates);

    // Also convert recurring expenses
    const recurring = await prisma.recurringExpense.findMany({
      where: { userId: user.id },
      select: { id: true, amount: true },
    });

    const recurringUpdates = recurring.map((item) => {
      const convertedAmount = Math.round(item.amount * rate * 100) / 100;
      return prisma.recurringExpense.update({
        where: { id: item.id },
        data: { amount: convertedAmount },
      });
    });

    await Promise.all(recurringUpdates);

    // Update user settings
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { currency: to },
      create: { userId: user.id, currency: to },
    });

    return NextResponse.json({
      message: `Successfully converted ${expenses.length} expenses, ${budgets.length} budgets, ${goals.length} goals, and ${recurring.length} recurring expenses`,
      rate,
      from,
      to,
      converted: expenses.length + budgets.length + goals.length + recurring.length,
    });
  } catch (error) {
    console.error("Error converting currency:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/currency/convert?from=IDR&to=USD — Get exchange rate only (no conversion)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Both 'from' and 'to' query params are required" },
      { status: 400 }
    );
  }

  try {
    const rate = await getExchangeRate(from, to);
    return NextResponse.json({ from, to, rate });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 502 }
    );
  }
}
