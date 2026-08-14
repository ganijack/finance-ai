"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/components/providers/currency-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { TranslationKey } from "@/lib/i18n/en";
import {
  CalendarDays,
  CalendarRange,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface StatCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  today: number;
  thisMonth: number;
  thisYear: number;
  loading: boolean;
}

const cards = [
  {
    key: "totalBalance",
    labelKey: "dashboard.totalBalance" as TranslationKey,
    icon: TrendingUp,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    key: "totalIncome",
    labelKey: "dashboard.totalIncome" as TranslationKey,
    icon: TrendingUp,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    key: "totalExpense",
    labelKey: "dashboard.totalExpense" as TranslationKey,
    icon: Calendar,
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    key: "thisMonth",
    labelKey: "dashboard.monthlyExpense" as TranslationKey,
    icon: CalendarRange,
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    key: "today",
    labelKey: "dashboard.todayExpense" as TranslationKey,
    icon: CalendarDays,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    key: "thisYear",
    labelKey: "dashboard.yearlyExpense" as TranslationKey,
    icon: Calendar,
    gradient: "from-rose-500/10 to-red-500/10",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
  },
];

export function StatCards({
  totalBalance,
  totalIncome,
  totalExpense,
  today,
  thisMonth,
  thisYear,
  loading,
}: StatCardsProps) {
  const values: Record<string, number> = {
    totalBalance,
    totalIncome,
    totalExpense,
    today,
    thisMonth,
    thisYear,
  };
  const { format } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.key}
          className={`relative overflow-hidden border-border/40 bg-gradient-to-br ${card.gradient} animate-fade-in stagger-${i + 1}`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t(card.labelKey)}
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
