import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { addAmount, currentAmount } = body;

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.savingGoal.findUnique({
      where: { id }
    });

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    let newAmount = existingGoal.currentAmount;
    if (addAmount !== undefined) {
      newAmount += Number(addAmount);
    } else if (currentAmount !== undefined) {
      newAmount = Number(currentAmount);
    }

    const updatedGoal = await prisma.savingGoal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status: newAmount >= existingGoal.targetAmount ? "COMPLETED" : "ACTIVE"
      }
    });

    return NextResponse.json(updatedGoal);
  } catch (error: any) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.savingGoal.findUnique({
      where: { id }
    });

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.savingGoal.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
