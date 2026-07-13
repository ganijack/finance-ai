"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { useExpenseStats } from "@/hooks/use-expenses";
import type { Expense } from "@/types";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useExpenseStats();
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
      <Topbar
        title="Dashboard"
        description="Your financial overview at a glance"
      />
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Stat Cards */}
        <StatCards
          today={stats?.today ?? 0}
          thisMonth={stats?.thisMonth ?? 0}
          thisYear={stats?.thisYear ?? 0}
          dailyAverage={stats?.dailyAverage ?? 0}
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
