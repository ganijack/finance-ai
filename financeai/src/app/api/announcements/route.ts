import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { 
        active: true,
        OR: [
          { validUntil: null },
          { validUntil: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(announcements);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
