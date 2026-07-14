"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  "Food", "Drink", "Transportation", "Shopping", "Entertainment",
  "Education", "Bills", "Health", "Subscription", "Other"
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}`),
        fetch(`/api/expenses?dateFilter=this-month&limit=1000`)
      ]);
      
      const bData = await budgetsRes.json();
      const eData = await expensesRes.json();
      
      setBudgets(Array.isArray(bData) ? bData : []);
      setExpenses(Array.isArray(eData.expenses) ? eData.expenses : []);
    } catch (error) {
      toast.error("Failed to load budgets data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, month: currentMonth })
      });

      if (!res.ok) throw new Error("Failed to save budget");
      
      toast.success("Budget saved!");
      setAmount("");
      fetchData();
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  const getCategorySpending = (cat: string) => {
    return expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <p className="text-muted-foreground mt-1">Set limits and track your spending goals for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Set Budget Form */}
        <Card className="md:col-span-1 border-border/40 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-indigo-500" />
              Set Budget
            </CardTitle>
            <CardDescription>Allocate limits per category</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Amount</label>
                <Input 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="e.g. 500" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">Save Budget</Button>
            </form>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <div className="md:col-span-2 space-y-4">
          {budgets.length === 0 ? (
            <Card className="border-border/40 shadow-sm bg-muted/20 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No budgets set</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">Start by creating a budget limit for a category to track your financial discipline.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {budgets.map((budget) => {
                const spent = getCategorySpending(budget.category);
                const percent = (spent / budget.amount) * 100;
                
                let colorClass = "bg-green-500";
                let bgClass = "bg-green-500/10 text-green-700 dark:text-green-400";
                let Icon = TrendingUp;
                
                if (percent >= 100) {
                  colorClass = "bg-red-500";
                  bgClass = "bg-red-500/10 text-red-700 dark:text-red-400";
                  Icon = AlertTriangle;
                } else if (percent >= 70) {
                  colorClass = "bg-amber-500";
                  bgClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400";
                  Icon = AlertTriangle;
                }

                return (
                  <Card key={budget.id} className="border-border/40 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{budget.category}</CardTitle>
                        <div className={`p-1.5 rounded-md ${bgClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Spent: {formatCurrency(spent)}</span>
                        <span className="font-medium">Limit: {formatCurrency(budget.amount)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                      <p className="text-xs text-right mt-2 text-muted-foreground">{percent.toFixed(1)}% Used</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
