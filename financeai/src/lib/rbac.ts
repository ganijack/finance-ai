import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function checkRole(requiredRole: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // Fetch user from Prisma DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) return false;

    return dbUser.role === requiredRole;
  } catch (error) {
    console.error("[RBAC_ERROR]", error);
    return false;
  }
}

export async function logAudit(userId: string, action: string, details?: string, ipAddress?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress
      }
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
