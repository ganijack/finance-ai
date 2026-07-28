"use client";

import { useEffect, useState } from "react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { useExpenseStats } from "@/hooks/use-expenses";
import type { Expense } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useExpenseStats();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/expenses?limit=5&sortField=date&sortOrder=desc&dateFilter=this-month");
        if (res.ok) {
          const data = await res.json();
          setRecentExpenses(data.expenses);
        }
      } catch (error) {
        console.error("Error fetching recent expenses:", error);
      } finally {
        setRecentLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        <Card className="col-span-full lg:col-span-1 shadow-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-lg">AI Financial Coach</CardTitle>
            <CardDescription>Recommendations based on your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 p-4 rounded-xl text-sm border border-indigo-500/20 mb-4 flex gap-3 items-start">
              <Sparkles className="h-5 w-5 shrink-0 mt-0.5" />
              <p>Your expenses are on track this month! Keep up the good work and stay disciplined with your spending.</p>
            </div>
          </CardContent>
        </Card>
        {/* Stat Cards */}
        <StatCards
          totalBalance={stats?.totalBalance ?? 0}
          totalIncome={stats?.totalIncome ?? 0}
          totalExpense={stats?.totalExpense ?? 0}
          thisMonth={stats?.thisMonth ?? 0}
          today={stats?.today ?? 0}
          thisYear={stats?.thisYear ?? 0}
          loading={statsLoading}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SpendingChart
            data={stats?.monthlyTrend ?? []}
            loading={statsLoading}
          />
          <CategoryChart
            data={stats?.categoryBreakdown ?? []}
            loading={statsLoading}
          />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions
          expenses={recentExpenses}
          loading={recentLoading}
        />
      </div>
    </div>
  );
}
