"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Wallet,
  Sparkles,
  Scan,
  Lightbulb,
  MessageSquare,
  FileText,
  Target,
  Repeat,
  CalendarDays,
  PieChart,
  MessageSquarePlus,
  ShieldCheck
} from "lucide-react";
import { NotificationsPanel } from "./notifications-panel";
import { BrandLogo } from "@/components/shared/brand-logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai", label: "AI Input", icon: Sparkles },
  { href: "/receipts", label: "Receipt Scanner", icon: Scan },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/goals", label: "Savings Goals", icon: Target },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/insights", label: "AI Insights", icon: Lightbulb },
  { href: "/chat", label: "Ask AI", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Monthly Report", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/feedback", label: "Feedback", icon: MessageSquarePlus },
  { href: "/admin/dashboard", label: "Admin Panel", icon: ShieldCheck },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const filteredNavItems = isAdmin 
    ? navItems 
    : navItems.filter(item => item.href !== "/admin/dashboard");

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border/40 bg-card/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex flex-col justify-center h-20 px-6 border-b border-border/40">
        <BrandLogo showSubtitle={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">
          FinanceAI v5.0
        </p>
        <NotificationsPanel />
      </div>
    </aside>
  );
}
