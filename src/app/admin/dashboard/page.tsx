import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, Brain, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalUsers, totalReceipts, totalExpenses, activeAlerts] = await Promise.all([
    // Mock user count if not connected to Supabase Admin API, but we can count distinct users in expenses
    prisma.expense.groupBy({ by: ['userId'] }).then(res => res.length),
    prisma.receipt.count(),
    prisma.expense.count(),
    prisma.notification.count({ where: { type: 'ALERT', read: false } })
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-zinc-400 mt-1">High-level metrics for FinanceAI.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-zinc-500 mt-1">Based on recent activity</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Receipts Processed</CardTitle>
            <Receipt className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReceipts}</div>
            <p className="text-xs text-zinc-500 mt-1">Total documents parsed</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}</div>
            <p className="text-xs text-zinc-500 mt-1">Recorded across all users</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active AI Alerts</CardTitle>
            <Brain className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-zinc-500 mt-1">Unread system alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50 h-96">
          <CardHeader>
            <CardTitle>AI Usage Volume</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-zinc-500 border border-dashed border-zinc-800 rounded-lg m-6 mt-0">
            Chart Placeholder
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50 h-96">
          <CardHeader>
            <CardTitle>System Load</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-zinc-500 border border-dashed border-zinc-800 rounded-lg m-6 mt-0">
            Chart Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
