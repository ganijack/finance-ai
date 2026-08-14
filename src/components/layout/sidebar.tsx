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
  ShieldCheck,
  History,
  Store
} from "lucide-react";
import { NotificationsPanel } from "./notifications-panel";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useLanguage } from "@/components/providers/language-provider";
import { TranslationKey } from "@/lib/i18n/en";

type NavItem = {
  href: string;
  labelKey: TranslationKey;
  icon: any;
};

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/ai", labelKey: "nav.aiInput", icon: Sparkles },
  { href: "/receipts", labelKey: "nav.receiptScanner", icon: Scan },
  { href: "/expenses", labelKey: "nav.manualInput", icon: Receipt },
  { href: "/all-transactions", labelKey: "nav.allTransactions", icon: History },
  { href: "/calendar", labelKey: "nav.calendar", icon: CalendarDays },
  { href: "/insights", labelKey: "nav.aiInsights", icon: Lightbulb },
  { href: "/chat", labelKey: "nav.askAi", icon: MessageSquare },
  { href: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
  { href: "/wa-commerce", labelKey: "nav.waCommerce", icon: Store },
  { href: "/settings", labelKey: "nav.settings", icon: Settings },
  { href: "/admin/dashboard", labelKey: "nav.adminPanel", icon: ShieldCheck },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { t } = useLanguage();

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
              {t(item.labelKey)}
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
