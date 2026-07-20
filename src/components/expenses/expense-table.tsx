"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
}

export function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const { format } = useCurrency();
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-border/40 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card className="border-border/40">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-2xl bg-muted p-4 mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
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
          <h3 className="text-base font-semibold">No expenses found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or add a new expense.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table Header */}
      <div className="hidden md:grid md:grid-cols-[1fr,120px,120px,120px,140px,80px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Expense</span>
        <span>Category</span>
        <span>Date</span>
        <span className="text-right">Amount</span>
        <span>Notes</span>
        <span className="text-right">Actions</span>
      </div>

      {expenses.map((expense) => {
        const config = getCategoryConfig(expense.category as ExpenseCategory);
        const Icon = config.icon;

        return (
          <Card
            key={expense.id}
            className="border-border/40 hover:border-border/60 transition-all duration-200"
          >
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-[1fr,120px,120px,120px,140px,80px] gap-4 items-center p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <span className="text-sm font-medium truncate">
                  {expense.title}
                </span>
              </div>
              <Badge variant="secondary" className="w-fit text-xs">
                {config.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(expense.date)}
              </span>
              <span className="text-sm font-semibold text-right tabular-nums">
                {format(expense.amount)}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {expense.notes || "—"}
              </span>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(expense)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete expense?</AlertDialogTitle>
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

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {expense.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">
                    {format(expense.amount)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onEdit(expense)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete expense?</AlertDialogTitle>
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
            </div>
          </Card>
        );
      })}
    </div>
  );
}
