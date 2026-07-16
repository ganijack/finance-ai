import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRole } from "@/lib/rbac";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const params = await context.params;
    const { id } = params;
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // First delete related records if not using cascade delete in DB
    // Assuming Prisma schema handles cascading (e.g. expenses, goals) but just in case:
    await prisma.expense.deleteMany({ where: { userId: id } });
    await prisma.budget.deleteMany({ where: { userId: id } });
    await prisma.savingsGoal.deleteMany({ where: { userId: id } });
    await prisma.recurringExpense.deleteMany({ where: { userId: id } });

    // Then delete the user
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to ban and delete user" }, { status: 500 });
  }
}
