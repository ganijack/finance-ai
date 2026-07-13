"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS, getCategoryConfig } from "@/lib/constants";
import type { CategoryBreakdown, ExpenseCategory } from "@/types";

interface CategoryChartProps {
  data: CategoryBreakdown[];
  loading: boolean;
}

export function CategoryChart({ data, loading }: CategoryChartProps) {
  if (loading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No expense data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-base">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category as ExpenseCategory]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as CategoryBreakdown;
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
                            {item.percentage.toFixed(1)}%
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
          <div className="flex-1 space-y-2 w-full">
            {data
              .sort((a, b) => b.amount - a.amount)
              .map((item) => {
                const config = getCategoryConfig(
                  item.category as ExpenseCategory
                );
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[
                              item.category as ExpenseCategory
                            ],
                        }}
                      />
                      <span className="text-sm font-medium">
                        {config.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
