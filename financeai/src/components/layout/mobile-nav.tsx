"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  LayoutDashboard, 
  Menu, 
  Receipt, 
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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useState } from "react";

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

export function MobileNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const filteredNavItems = isAdmin 
    ? navItems 
    : navItems.filter(item => item.href !== "/admin/dashboard");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <BrandLogo />
        </div>
          {/* Navigation */}
          <nav className="flex flex-col space-y-1 p-4">
            {filteredNavItems.map((item) => {
              const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
