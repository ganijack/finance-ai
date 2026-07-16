"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "./topbar";

const routeConfig: Record<string, { title: string; description?: string }> = {
  "/dashboard": { title: "Dashboard", description: "Your financial overview at a glance" },
  "/ai": { title: "AI Input", description: "Interact with FinanceAI" },
  "/receipts": { title: "Receipts", description: "Manage your scanned receipts" },
  "/receipts/scan": { title: "Receipt Scanner", description: "Upload and let AI automatically extract the items" },
  "/expenses": { title: "Expenses", description: "View and manage all your expenses" },
  "/spendings": { title: "Spendings", description: "Track your spending habits" },
  "/budgets": { title: "Budgets", description: "Manage your monthly budgets" },
  "/goals": { title: "Savings Goals", description: "Track your financial goals" },
  "/recurring": { title: "Recurring", description: "Manage subscriptions and recurring bills" },
  "/calendar": { title: "Calendar", description: "View your expenses over time" },
  "/insights": { title: "AI Insights", description: "Personalized financial recommendations" },
  "/chat": { title: "Ask AI", description: "Chat with your AI financial assistant" },
  "/analytics": { title: "Analytics", description: "Deep dive into your financial data" },
  "/reports": { title: "Reports", description: "Monthly and yearly financial reports" },
  "/settings": { title: "Settings", description: "Manage your account preferences" },
  "/settings/profile": { title: "Edit Profile", description: "Update your personal information" },
  "/admin/dashboard": { title: "Admin Panel", description: "Manage the FinanceAI platform" },
  "/feedback": { title: "Feedback", description: "Share your thoughts on FinanceAI" }
};

export function DashboardHeader() {
  const pathname = usePathname();
  const config = routeConfig[pathname] || { title: "Dashboard", description: "FinanceAI" };

  return <Topbar title={config.title} description={config.description} />;
}
