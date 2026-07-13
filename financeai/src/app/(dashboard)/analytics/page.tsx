"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS, getCategoryConfig } from "@/lib/constants";
import type { CategoryBreakdown, ExpenseCategory, MonthlyTrend } from "@/types";

export default function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/expenses/stats");
        if (res.ok) {
          const data = await res.json();
          setCategoryData(data.categoryBreakdown || []);
          setMonthlyData(data.monthlyTrend || []);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Weekly aggregation for bar chart
  const weeklyData = monthlyData.reduce<{ week: string; amount: number }[]>(
    (acc, item, index) => {
      const weekIndex = Math.floor(index / 7);
      const weekLabel = `Week ${weekIndex + 1}`;
      const existing = acc.find((w) => w.week === weekLabel);
      if (existing) {
        existing.amount += item.amount;
      } else {
        acc.push({ week: weekLabel, amount: item.amount });
      }
      return acc;
    },
    []
  );

  const topCategories = [...categoryData].sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col">
      <Topbar
        title="Analytics"
        description="Visualize your spending patterns"
      />
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <Card className="border-border/40 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[320px] w-full" />
              ) : categoryData.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No expense data to display
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="h-[280px] w-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="amount"
                          nameKey="category"
                          strokeWidth={0}
                        >
                          {categoryData.map((entry) => (
                            <Cell
                              key={entry.category}
                              fill={
                                CATEGORY_COLORS[
                                  entry.category as ExpenseCategory
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const item =
                                payload[0].payload as CategoryBreakdown;
                              const config = getCategoryConfig(
                                item.category as ExpenseCategory
                              );
                              return (
                                <div className="rounded-xl border bg-popover p-3 shadow-lg">
                                  <p className="text-xs font-medium">
                                    {config.label}
                                  </p>
                                  <p className="text-sm font-semibold">
                                    {formatCurrency(item.amount)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.percentage.toFixed(1)}% of total
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Bar Chart */}
          <Card className="border-border/40 animate-fade-in stagger-1">
            <CardHeader>
              <CardTitle className="text-base">
                Weekly Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[320px] w-full" />
              ) : weeklyData.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No expense data to display
                  </p>
                </div>
              ) : (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="week"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border bg-popover p-3 shadow-lg">
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-semibold">
                                  {formatCurrency(
                                    payload[0].value as number
                                  )}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="amount"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="border-border/40 animate-fade-in stagger-2">
          <CardHeader>
            <CardTitle className="text-base">
              Top Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topCategories.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No categories to display
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topCategories.map((item, index) => {
                  const config = getCategoryConfig(
                    item.category as ExpenseCategory
                  );
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.category}
                      className="flex items-center gap-4 rounded-xl p-3 hover:bg-accent/50 transition-all duration-200"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} {item.count === 1 ? "transaction" : "transactions"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-24 hidden sm:block">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor:
                                CATEGORY_COLORS[
                                  item.category as ExpenseCategory
                                ],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
