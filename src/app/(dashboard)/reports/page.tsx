"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Calendar } from "lucide-react";
import { AnalyticsSummary } from "@/services/analytics";
import { AIInsightsResponse } from "@/services/ai/insights";

export default function ReportsPage() {
  const [data, setData] = useState<{ stats: AnalyticsSummary; insights: AIInsightsResponse } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/insights");
      if (!response.ok) {
        throw new Error("Failed to fetch report data");
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-xl font-semibold mb-2">No Report Available</h2>
        <p className="text-muted-foreground mb-6">{error || "We need more transaction data."}</p>
        <Button onClick={fetchInsights}>Try Again</Button>
      </div>
    );
  }

  const { stats, insights } = data;
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in print:max-w-none print:m-0 print:p-0">
      
      {/* Non-printable header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monthly Report</h1>
          <p className="text-muted-foreground mt-1">
            Generate and export your AI-powered financial report.
          </p>
        </div>
        <Button onClick={handlePrint} className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Download className="mr-2 h-4 w-4" />
          Export to PDF
        </Button>
      </div>

      {/* Printable Report Container */}
      <div className="bg-card text-card-foreground p-8 rounded-xl border border-border/40 shadow-sm print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Report Header */}
        <div className="border-b pb-6 mb-6 flex justify-between items-end print:border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2 print:text-black">
              <FileText className="h-6 w-6" />
              <h2 className="text-2xl font-bold">FinanceAI</h2>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Financial Report</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-muted-foreground print:text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{monthName}</span>
            </div>
            <p className="text-sm font-medium mt-1">Health Score: {stats.financialScore.score}/100</p>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 border-l-4 border-indigo-500 pl-3 print:border-gray-800">Executive Summary</h3>
          <p className="text-lg leading-relaxed print:text-gray-800">{insights.summaryText}</p>
        </section>

        {/* Key Metrics */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-indigo-500 pl-3 print:border-gray-800">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 print:bg-gray-50 print:border print:border-gray-200">
              <p className="text-sm text-muted-foreground print:text-gray-600">Total Spent This Month</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.currentMonthTotal)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 print:bg-gray-50 print:border print:border-gray-200">
              <p className="text-sm text-muted-foreground print:text-gray-600">Predicted End of Month</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.predictedEndOfMonth)}</p>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-indigo-500 pl-3 print:border-gray-800">Category Breakdown</h3>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center">
                <div className="w-1/3 font-medium">{cat.name}</div>
                <div className="w-2/3 flex items-center gap-3">
                  <div className="h-4 flex-1 bg-muted rounded-sm overflow-hidden print:bg-gray-200">
                    <div 
                      className="h-full bg-indigo-500 print:bg-gray-800" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-sm">
                    {formatCurrency(cat.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations */}
        <section>
          <h3 className="text-xl font-bold mb-4 border-l-4 border-indigo-500 pl-3 print:border-gray-800">Strategic Recommendations</h3>
          <div className="space-y-4">
            {insights.recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/50 print:border-gray-300">
                <h4 className="font-bold text-lg">{rec.title}</h4>
                <p className="mt-1 text-muted-foreground print:text-gray-700">{rec.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground print:border-gray-200 print:text-gray-500">
          Generated automatically by FinanceAI Assistant on {new Date().toLocaleDateString()}
        </div>

      </div>
    </div>
  );
}
