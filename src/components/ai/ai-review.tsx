"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import { ParsedExpense } from "@/services/ai/parser";
import { useExpenses } from "@/hooks/use-expenses";
import type { ExpenseFormData } from "@/types";

interface AiReviewProps {
  initialData: ParsedExpense[];
  onCancel: () => void;
  onSuccess: () => void;
}

export function AiReview({ initialData, onCancel, onSuccess }: AiReviewProps) {
  const router = useRouter();
  const { createExpense } = useExpenses();
  const [items, setItems] = useState<ParsedExpense[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleItemChange = (index: number, field: keyof ParsedExpense, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([...items, { 
      title: "New Item", 
      amount: 0, 
      category: "other", 
      date: new Date().toISOString().split('T')[0], 
      notes: "", 
      confidence: 1 
    }]);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("At least one item is required");
      return;
    }

    setIsSaving(true);
    try {
      // Create via API route directly to set source="AI"
      const promises = items.map(item => 
        fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title,
            amount: Number(item.amount),
            category: item.category,
            date: new Date(item.date).toISOString(),
            notes: item.notes,
            source: "AI"
          }),
        })
      );
      
      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.ok);
      
      if (failed.length > 0) {
        toast.error(`Failed to save ${failed.length} expenses`);
      } else {
        toast.success(`Successfully saved ${items.length} expenses!`);
        onSuccess();
      }
    } catch (error: unknown) {
      toast.error("Failed to save some expenses");
    } finally {
      setIsSaving(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Review Parsed Expenses</h3>
        <p className="text-muted-foreground">
          Total: <span className="font-bold text-foreground">Rp {formatCurrency(total)}</span>
        </p>
      </div>

      <div className="rounded-md border border-border/40 bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[120px] text-right">Amount</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input 
                    value={item.title} 
                    onChange={(e) => handleItemChange(index, "title", e.target.value)} 
                    className="h-8 min-w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={item.category.toLowerCase()} 
                    onValueChange={(value) => handleItemChange(index, "category", value)}
                  >
                    <SelectTrigger className="h-8 min-w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    type="date"
                    value={item.date} 
                    onChange={(e) => handleItemChange(index, "date", e.target.value)} 
                    className="h-8 min-w-[130px]"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    value={item.amount} 
                    onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)} 
                    className="h-8 text-right min-w-[100px]"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={handleAddItem} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || items.length === 0} className="w-full sm:w-auto bg-gradient-to-r from-zinc-600 to-zinc-600">
            {isSaving ? "Saving..." : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save {items.length} Expenses
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
