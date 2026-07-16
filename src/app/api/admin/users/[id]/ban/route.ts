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

    // Soft ban the user by updating their role
    await prisma.user.update({
      where: { id },
      data: { role: "BANNED" }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to ban and delete user" }, { status: 500 });
  }
}
