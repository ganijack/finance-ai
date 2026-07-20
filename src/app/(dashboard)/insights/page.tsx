"use client";

import { useEffect, useState } from "react";
import { } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Target, 
  AlertCircle, 
  Activity,
  RefreshCw
} from "lucide-react";
import { AnalyticsSummary } from "@/services/analytics";
import { AIInsightsResponse } from "@/services/ai/insights";
import { useCurrency } from "@/components/providers/currency-provider";

export default function InsightsPage() {
  const { format } = useCurrency();
  const [data, setData] = useState<{ stats: AnalyticsSummary; insights: AIInsightsResponse } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/insights");
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }
      const result = await response.json();
      if (result.error || result.message) {
        setError(result.error || result.message);
      } else {
        setData(result);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Activity className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-xl font-semibold mb-2">No Insights Available</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{error || "We need more transaction data to generate meaningful insights."}</p>
        <Button onClick={fetchInsights}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  const { stats, insights } = data;
  const scoreColor = stats.financialScore.score >= 80 ? "text-green-500" : stats.financialScore.score >= 50 ? "text-amber-500" : "text-red-500";
  const scoreRing = stats.financialScore.score >= 80 ? "stroke-green-500" : stats.financialScore.score >= 50 ? "stroke-amber-500" : "stroke-red-500";
  const dashArray = 2 * Math.PI * 38;
  const dashOffset = dashArray - (dashArray * stats.financialScore.score) / 100;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground mt-1">
            Intelligent analysis of your spending habits and financial health.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchInsights}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Overview Top Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Financial Score Card */}
        <Card className="border-border/40 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5" />
          <CardHeader>
            <CardTitle className="text-lg">Financial Health Score</CardTitle>
            <CardDescription>Based on your current month's activity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center relative z-10">
            <div className="relative flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="38" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                <circle 
                  cx="64" cy="64" r="38" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={dashArray} strokeDashoffset={dashOffset} 
                  className={`transition-all duration-1000 ease-out ${scoreRing}`} 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{stats.financialScore.score}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">/ 100</span>
              </div>
            </div>
            <div className="text-sm text-center text-muted-foreground space-y-1">
              {stats.financialScore.reasons.slice(0, 2).map((reason, i) => (
                <p key={i}>• {reason}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gemini Summary Card */}
        <Card className="md:col-span-2 border-border/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Lightbulb className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{insights.summaryText}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Current Month Total</p>
                <p className="text-2xl font-bold">{format(stats.currentMonthTotal)}</p>
                <div className="flex items-center gap-1 mt-1 text-sm">
                  {stats.percentageChange <= 0 ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  )}
                  <span className={stats.percentageChange <= 0 ? "text-green-500" : "text-red-500"}>
                    {Math.abs(stats.percentageChange).toFixed(1)}% {stats.percentageChange <= 0 ? "less" : "more"}
                  </span>
                  <span className="text-muted-foreground ml-1">than last month</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Predicted End of Month</p>
                <p className="text-2xl font-bold">{format(stats.predictedEndOfMonth)}</p>
                <p className="text-sm text-muted-foreground mt-1">Based on daily avg of {format(stats.dailyAverage)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-border/40 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Actionable Recommendations
          </CardTitle>
          <CardDescription>Personalized advice generated by Gemini Vision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.recommendations.map((rec, i) => (
              <div key={i} className={`rounded-xl border p-5 ${rec.actionable ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-muted/30 border-border/40'}`}>
                <div className="flex items-start gap-3">
                  {rec.actionable ? (
                    <Target className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    {rec.actionable && (
                      <Badge variant="outline" className="mt-3 bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-border/40 shadow-xl">
        <CardHeader>
          <CardTitle>Spending Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Top Categories</h4>
              <div className="space-y-3">
                {stats.categoryBreakdown.slice(0, 4).map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="font-medium">{format(cat.amount)} ({cat.percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Most Frequent Purchases</h4>
              <div className="space-y-3">
                {stats.topRecurring.length > 0 ? (
                  stats.topRecurring.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Purchased {item.count} times</p>
                      </div>
                      <span className="font-semibold">{format(item.totalAmount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded-lg text-center">
                    No recurring expenses found yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
