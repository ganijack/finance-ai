import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { store, date, total, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Save Receipt and Expenses in a transaction
    const receipt = await prisma.$transaction(async (tx) => {
      const parsedDate = date ? new Date(date) : new Date();

      const newReceipt = await tx.receipt.create({
        data: {
          userId: user.id,
          store,
          date: parsedDate,
          total: Number(total),
          status: "PROCESSED",
        },
      });

      // Create expenses and link them to the receipt
      await Promise.all(
        items.map((item: { title: string; amount: number | string; category?: string; notes?: string }) =>
          tx.expense.create({
            data: {
              userId: user.id,
              title: item.title,
              amount: Number(item.amount),
              category: item.category || "Other",
              date: parsedDate,
              notes: item.notes,
              receiptId: newReceipt.id,
            },
          })
        )
      );

      return newReceipt;
    });

    return NextResponse.json({ success: true, data: receipt });
  } catch (error) {
    console.error("[RECEIPT_SAVE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to save receipt" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;

    const receipts = await prisma.receipt.findMany({
      where: {
        userId: user.id,
      },
      include: {
        expenses: true,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    return NextResponse.json({ data: receipts });
  } catch (error) {
    console.error("[RECEIPTLIST_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}
