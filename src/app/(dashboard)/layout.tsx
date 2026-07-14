import { Sidebar } from "@/components/layout/sidebar";
import { AnnouncementBanner } from "@/components/shared/announcement-banner";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Sync user to our database so it appears in Prisma Studio
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email || "" },
    create: { 
      id: user.id, 
      email: user.email || "", 
      role: "USER" // Default to USER
    }
  });

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <div className="min-h-svh bg-background">
      <AnnouncementBanner />
      <Sidebar isAdmin={isAdmin} />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}
