import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRole } from "@/lib/rbac";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const params = await context.params;
    const { id } = params;
    const { role } = await req.json();
    
    if (!id || !role) return NextResponse.json({ error: "ID and role required" }, { status: 400 });

    if (role !== "ADMIN" && role !== "USER") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
