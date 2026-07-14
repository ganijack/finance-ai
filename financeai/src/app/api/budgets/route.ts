import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // YYYY-MM

    if (!month) {
      return NextResponse.json({ error: "Month parameter is required" }, { status: 400 });
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        month,
      }
    });

    return NextResponse.json(budgets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, amount, month } = await req.json();

    if (!category || amount === undefined || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert budget (create if doesn't exist, update if it does)
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month: {
          userId: user.id,
          category,
          month
        }
      },
      update: {
        amount: parseFloat(amount)
      },
      create: {
        userId: user.id,
        category,
        amount: parseFloat(amount),
        month
      }
    });

    return NextResponse.json(budget);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
