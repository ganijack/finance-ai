import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRole } from "@/lib/rbac";

export async function GET() {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const flags = await prisma.featureFlag.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(flags);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await checkRole('ADMIN');
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, enabled } = await req.json();
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const flag = await prisma.featureFlag.update({
      where: { id },
      data: { enabled }
    });

    return NextResponse.json(flag);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update feature" }, { status: 500 });
  }
}
