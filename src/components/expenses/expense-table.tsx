"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";
import { getCategoryConfig } from "@/lib/constants";
import { Pencil, Trash2 } from "lucide-react";
import type { Expense, ExpenseCategory } from "@/types";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

const DESKTOP_GRID_COLS = "36px 84px minmax(130px, 1fr) 110px 100px 120px 120px 64px";

export function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDelete,
  selectedIds = new Set(),
  onSelect,
  onSelectAll,
}: ExpenseTableProps) {
  const { format } = useCurrency();

  if (loading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/50 p-2.5 sm:px-4 sm:py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-border/50">
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <div className="rounded-xl bg-muted p-3 mb-3">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold">No transactions found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your filters or add a new transaction.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Desktop Table Header */}
      <div
        className="hidden md:grid gap-3 px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider items-center"
        style={{ gridTemplateColumns: DESKTOP_GRID_COLS }}
      >
        <div className="flex items-center justify-center">
          <Checkbox 
            checked={expenses.length > 0 && selectedIds.size === expenses.length}
            onCheckedChange={(checked) => onSelectAll?.(!!checked)}
            aria-label="Select all"
          />
        </div>
        <span>Type</span>
        <span>Title</span>
        <span>Category</span>
        <span>Date</span>
        <span className="text-right">Amount</span>
        <span>Notes</span>
        <span className="text-right pr-1">Actions</span>
      </div>

      {expenses.map((expense) => {
        const config = getCategoryConfig(expense.category as ExpenseCategory);
        const Icon = config.icon;
        const isIncome = expense.type === "INCOME";

        return (
          <Card
            key={expense.id}
            className={`border-border/50 hover:border-border transition-colors ${
              selectedIds.has(expense.id) ? "bg-primary/5 border-primary/30" : "bg-card"
            }`}
          >
            {/* Desktop View (Single compact row) */}
            <div
              className="hidden md:grid gap-3 items-center px-3 py-2 sm:px-4 sm:py-2 text-sm"
              style={{ gridTemplateColumns: DESKTOP_GRID_COLS }}
            >
              <div className="flex items-center justify-center">
                <Checkbox 
                  checked={selectedIds.has(expense.id)}
                  onCheckedChange={(checked) => onSelect?.(expense.id, !!checked)}
                  aria-label={`Select ${expense.title}`}
                />
              </div>
              <div>
                <Badge
                  variant={isIncome ? "default" : "destructive"}
                  className={`text-[10px] px-2 py-0.5 font-semibold w-fit tracking-wide ${
                    isIncome
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {isIncome ? "INCOME" : "EXPENSE"}
                </Badge>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <span className="font-medium truncate text-foreground text-sm">
                  {expense.title}
                </span>
              </div>
              <div>
                <Badge variant="secondary" className="w-fit text-xs px-2 py-0.5 truncate max-w-[100px]">
                  {config.label}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(expense.date)}
              </span>
              <span
                className={`text-sm font-semibold text-right tabular-nums whitespace-nowrap ${
                  isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                }`}
              >
                {isIncome ? "+" : "-"}{format(expense.amount)}
              </span>
              <span className="text-xs text-muted-foreground truncate" title={expense.notes || ""}>
                {expense.notes || "—"}
              </span>
              <div className="flex items-center justify-end gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(expense)}
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &quot;{expense.title}&quot;.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(expense.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Mobile View (Compact 2-line row) */}
            <div className="md:hidden px-3 py-2.5">
              {/* Row 1: Checkbox, Icon, Title, Amount */}
              <div className="flex items-center gap-2.5">
                <Checkbox 
                  checked={selectedIds.has(expense.id)}
                  onCheckedChange={(checked) => onSelect?.(expense.id, !!checked)}
                  aria-label={`Select ${expense.title}`}
                  className="shrink-0"
                />
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <p className="text-sm font-medium truncate flex-1 min-w-0 text-foreground">
                  {expense.title}
                </p>
                <p
                  className={`text-sm font-semibold tabular-nums shrink-0 whitespace-nowrap ${
                    isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  }`}
                >
                  {isIncome ? "+" : "-"}{format(expense.amount)}
                </p>
              </div>

              {/* Row 2: Badges, Date, and Actions */}
              <div className="flex items-center justify-between mt-1.5 pl-9 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant={isIncome ? "default" : "destructive"}
                    className={`text-[9px] px-1.5 py-0 font-semibold ${
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {isIncome ? "INCOME" : "EXPENSE"}
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                    {config.label}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatDate(expense.date)}
                  </span>
                  {expense.notes && (
                    <span className="text-[11px] text-muted-foreground truncate max-w-[80px]" title={expense.notes}>
                      • {expense.notes}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(expense)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{expense.title}&quot;.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(expense.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
