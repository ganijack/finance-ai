"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParsedReceipt, ReceiptItem } from "@/services/ai/receipt";
import { Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";

interface ReceiptReviewProps {
  initialData: ParsedReceipt;
  onCancel: () => void;
}

export function ReceiptReview({ initialData, onCancel }: ReceiptReviewProps) {
  const router = useRouter();
  const [store, setStore] = useState(initialData.store);
  const [date, setDate] = useState(initialData.date);
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items);
  const [isSaving, setIsSaving] = useState(false);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([...items, { title: "New Item", amount: 0, category: "Other" }]);
  };

  const handleSave = async () => {
    if (!store) {
      toast.error("Store name is required");
      return;
    }
    
    if (items.length === 0) {
      toast.error("At least one item is required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store,
          date,
          total: calculateTotal(),
          items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save receipt");
      }

      toast.success("Receipt saved successfully!");
      router.push("/receipts");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const computedTotal = calculateTotal();
  const discrepancy = Math.abs(computedTotal - initialData.total);
  const hasDiscrepancy = discrepancy > 0.1 && initialData.total > 0; // Floating point tolerance

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="store">Store Name</Label>
          <Input 
            id="store" 
            value={store} 
            onChange={(e) => setStore(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Transaction Date</Label>
          <Input 
            id="date" 
            type="date"
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </div>

      <div className="rounded-md border border-border/40 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
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
          <span>{formatCurrency(computedTotal)}</span>
        </div>
        {hasDiscrepancy && (
          <div className="flex items-center gap-2 text-sm text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <span>AI detected a total of {formatCurrency(initialData.total)} on the receipt. Please verify the items above.</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Save Expenses
        </Button>
      </div>
    </div>
  );
}
