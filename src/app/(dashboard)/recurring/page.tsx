"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Repeat, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  "Food", "Drink", "Transportation", "Shopping", "Entertainment",
  "Education", "Bills", "Health", "Subscription", "Other"
];

const INTERVALS = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export default function RecurringPage() {
  const [recurring, setRecurring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[8]); // Default to Subscription
  const [interval, setIntervalVal] = useState("MONTHLY");
  const [nextDate, setNextDate] = useState("");

  const fetchRecurring = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recurring");
      const data = await res.json();
      setRecurring(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load recurring expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !nextDate) return;

    try {
      const res = await fetch("/api/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          amount, 
          category,
          interval,
          nextDate
        })
      });

      if (!res.ok) throw new Error("Failed to save recurring expense");
      
      toast.success("Recurring expense created!");
      setTitle("");
      setAmount("");
      fetchRecurring();
    } catch (error) {
      toast.error("Failed to create recurring expense");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/recurring", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Expense ${!currentStatus ? 'activated' : 'paused'}`);
      fetchRecurring();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="md:col-span-2 h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
        <p className="text-muted-foreground mt-1">Automate your subscriptions and fixed bills.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Form */}
        <Card className="md:col-span-1 border-border/40 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-indigo-500" />
              Add Recurring
            </CardTitle>
            <CardDescription>We'll log it automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Netflix, Rent, Internet" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interval</label>
                <Select value={interval} onValueChange={setIntervalVal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Next Due Date</label>
                <Input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">Automate</Button>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {recurring.length === 0 ? (
            <Card className="border-border/40 shadow-sm bg-muted/20 border-dashed h-64">
              <CardContent className="flex flex-col items-center justify-center h-full text-center py-6">
                <Repeat className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No automated expenses</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">Set up your bills and subscriptions to have them logged automatically.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recurring.map((item) => (
                <Card key={item.id} className={`border-border/40 shadow-sm overflow-hidden ${!item.active ? 'opacity-60 grayscale' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-xs text-muted-foreground bg-muted inline-flex px-2 py-0.5 rounded-full mt-1">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">{formatCurrency(item.amount)}</span>
                        <p className="text-xs text-muted-foreground lowercase">/{item.interval}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Next: {new Date(item.nextDate).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 px-2 ${item.active ? 'text-amber-500 hover:text-amber-600' : 'text-green-500 hover:text-green-600'}`}
                        onClick={() => toggleActive(item.id, item.active)}
                      >
                        {item.active ? 'Pause' : 'Resume'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
