import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recurring = await prisma.recurringExpense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(recurring);
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

    const { title, amount, category, interval, nextDate } = await req.json();

    if (!title || amount === undefined || !category || !interval || !nextDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recurring = await prisma.recurringExpense.create({
      data: {
        userId: user.id,
        title,
        amount: parseFloat(amount),
        category,
        interval,
        nextDate: new Date(nextDate),
        active: true
      }
    });

    return NextResponse.json(recurring);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, active } = await req.json();

    if (!id || active === undefined) {
      return NextResponse.json({ error: "ID and active status are required" }, { status: 400 });
    }

    const recurring = await prisma.recurringExpense.update({
      where: { id, userId: user.id },
      data: { active }
    });

    return NextResponse.json(recurring);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
