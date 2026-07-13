import { Sidebar } from "@/components/layout/sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <Sidebar />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  );
}
