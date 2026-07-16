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
import { DatePicker } from "@/components/ui/date-picker";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-border/40 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteItem(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input 
              value={item.title} 
              onChange={(e) => handleItemChange(index, "title", e.target.value)} 
              className="h-9"
              placeholder="Item name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={item.category.toLowerCase()} 
                onValueChange={(value) => handleItemChange(index, "category", value)}
              >
                <SelectTrigger className="h-9">
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
              <DatePicker
                date={item.date ? new Date(item.date) : undefined}
                setDate={(newDate) => handleItemChange(index, "date", newDate ? newDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])}
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                value={item.notes || ""} 
                onChange={(e) => handleItemChange(index, "notes", e.target.value)} 
                className="h-9"
                placeholder="Notes (optional)"
              />
              <Input 
                type="number"
                value={item.amount} 
                onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)} 
                className="h-9 text-right"
                placeholder="Amount"
              />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={handleAddItem} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block rounded-md border border-border/40 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
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
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={item.category.toLowerCase()} 
                    onValueChange={(value) => handleItemChange(index, "category", value)}
                  >
                    <SelectTrigger className="h-8">
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
                  <DatePicker
                date={item.date ? new Date(item.date) : undefined}
                setDate={(newDate) => handleItemChange(index, "date", newDate ? newDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])}
                className="h-8"
              />
                </TableCell>
                <TableCell>
                  <Input 
                    value={item.notes || ""} 
                    onChange={(e) => handleItemChange(index, "notes", e.target.value)} 
                    className="h-8"
                    placeholder="Optional"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    value={item.amount} 
                    onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)} 
                    className="h-8 text-right"
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
        <div className="flex items-center p-2 border-t border-border/40">
          <Button variant="ghost" size="sm" onClick={handleAddItem} className="text-muted-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-4">
        <div className="flex items-center justify-between font-medium">
          <span>Sum of Items:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving || items.length === 0}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : `Save ${items.length} Expenses`}
        </Button>
      </div>
    </div>
  );
}
