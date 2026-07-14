import { redirect } from "next/navigation";
import { checkRole } from "@/lib/rbac";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  ToggleLeft, 
  MessageSquareCode, 
  ShieldCheck, 
  LogOut,
  Activity,
  FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkRole('ADMIN');

  if (!isAdmin) {
    redirect('/dashboard');
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/ai-monitoring", label: "AI Monitoring", icon: Activity },
    { href: "/admin/prompts", label: "Prompt Manager", icon: MessageSquareCode },
    { href: "/admin/features", label: "Feature Flags", icon: ToggleLeft },
    { href: "/admin/audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 fixed inset-y-0 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-3">
          <ShieldCheck className="h-6 w-6 text-indigo-500" />
          <span className="font-bold tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">System Management</div>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors">
            <LogOut className="h-4 w-4" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
