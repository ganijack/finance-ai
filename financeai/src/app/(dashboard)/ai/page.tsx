"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { useExpenses } from "@/hooks/use-expenses";
import type { Expense, ExpenseFormData } from "@/types";

export default function AIInputPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedExpense, setParsedExpense] = useState<Expense | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createExpense } = useExpenses();

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze text");
      }

      // Map parsed data into an Expense-like object for the dialog
      // The dialog only needs title, amount, category, date, notes
      const mockExpense = {
        id: "temp",
        title: data.title,
        amount: data.amount,
        category: data.category.toLowerCase(),
        date: data.date,
        notes: data.notes,
        userId: "temp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Expense;

      setParsedExpense(mockExpense);
      
      if (data.confidence < 0.6) {
        toast.warning("Low confidence parsing. Please double check the fields.");
      } else {
        toast.success("Successfully analyzed your input!");
      }
      
      setDialogOpen(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to analyze input";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
  }) => {
    try {
      // Cast the string date to Date object for the hook
      await createExpense({
        ...data,
        category: data.category as ExpenseFormData["category"],
        date: new Date(data.date),
      });
      toast.success("Expense added successfully");
      setInput(""); // Clear input on success
    } catch {
      toast.error("Failed to add expense");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Expense Input
        </h1>
        <p className="text-muted-foreground mt-2">
          Describe your expenses naturally. Our AI will automatically categorize and structure them for you.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-indigo-500/20 bg-card p-4 sm:p-6 shadow-lg shadow-indigo-500/5"
      >
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. "I bought coffee at Starbucks for 45k this morning"'
            className="w-full min-h-[160px] p-4 sm:p-6 rounded-xl border border-border bg-background/50 text-base sm:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-muted-foreground/60"
            disabled={loading}
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              Powered by Gemini
            </span>
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground py-1 mr-2">Try saying:</span>
          {[
            "Netflix subscription 65000",
            "Grab to campus 42k",
            "Beli nasi padang 25 ribu",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:border-indigo-500/30 transition-colors"
            >
              &quot;{suggestion}&quot;
            </button>
          ))}
        </div>
      </motion.div>

      {/* Expense Dialog */}
      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expense={parsedExpense}
        onSubmit={handleSaveExpense}
      />
    </div>
  );
}
