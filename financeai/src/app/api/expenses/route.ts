import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getStartOfMonth,
} from "@/lib/utils";

// GET /api/expenses — List expenses with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const dateFilter = searchParams.get("dateFilter") || "this-month";
    const category = searchParams.get("category") || "";
    const sortField = searchParams.get("sortField") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const customStart = searchParams.get("customStart");
    const customEnd = searchParams.get("customEnd");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build date filter
    const now = new Date();
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    switch (dateFilter) {
      case "today":
        dateFrom = getStartOfDay(now);
        dateTo = getEndOfDay(now);
        break;
      case "this-week":
        dateFrom = getStartOfWeek(now);
        dateTo = getEndOfDay(now);
        break;
      case "this-month":
        dateFrom = getStartOfMonth(now);
        dateTo = getEndOfDay(now);
        break;
      case "custom":
        if (customStart) dateFrom = new Date(customStart);
        if (customEnd) dateTo = getEndOfDay(new Date(customEnd));
        break;
    }

    // Build where clause
    const where: Record<string, unknown> = {
      userId: user.id,
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = category;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = dateFrom;
      if (dateTo) (where.date as Record<string, unknown>).lte = dateTo;
    }

    // Build sort
    const orderBy: Record<string, string> = {};
    orderBy[sortField] = sortOrder;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/expenses — Create a new expense
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
    const { title, amount, category, date, notes } = body;

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        notes: notes || null,
        userId: user.id,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
