"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/components/providers/currency-provider";
import {
  CalendarDays,
  CalendarRange,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface StatCardsProps {
  today: number;
  thisMonth: number;
  thisYear: number;
  dailyAverage: number;
  loading: boolean;
}

const cards = [
  {
    key: "today",
    label: "Today's Expense",
    icon: CalendarDays,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    key: "thisMonth",
    label: "Monthly Expense",
    icon: CalendarRange,
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    key: "thisYear",
    label: "Yearly Expense",
    icon: Calendar,
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    key: "dailyAverage",
    label: "Daily Average",
    icon: TrendingUp,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
];

export function StatCards({
  today,
  thisMonth,
  thisYear,
  dailyAverage,
  loading,
}: StatCardsProps) {
  const values: Record<string, number> = {
    today,
    thisMonth,
    thisYear,
    dailyAverage,
  };
  const { format } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.key}
          className={`relative overflow-hidden border-border/40 bg-gradient-to-br ${card.gradient} animate-fade-in stagger-${i + 1}`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight">
                    {format(values[card.key])}
                  </p>
                )}
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
