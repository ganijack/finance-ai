"use client";

import { useState, useCallback, useEffect } from "react";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseDialog } from "@/components/expenses/expense-dialog";
import { ExportButton } from "@/components/dashboard/export-button";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { Expense, DateFilter, SortField, SortOrder } from "@/types";

export default function AllTransactionsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-month");
  const [category, setCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt" as SortField);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      params.set("dateFilter", dateFilter);
      if (category && category !== "all") params.set("category", category);
      params.set("sortField", sortField);
      params.set("sortOrder", sortOrder);
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        // Reset selections when fetching new page or search
        setSelectedIds(new Set());
      }
    } catch {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, dateFilter, category, sortField, sortOrder, page]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFilter, category, sortField, sortOrder]);

  const handleCreate = async (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
  }) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.error || "Failed to create expense");
      throw new Error(error.error);
    }

    toast.success("Expense added successfully");
    fetchExpenses();
  };

  const handleUpdate = async (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
  }) => {
    if (!editingExpense) return;

    const res = await fetch(`/api/expenses/${editingExpense.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.error || "Failed to update expense");
      throw new Error(error.error);
    }

    toast.success("Expense updated successfully");
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Expense deleted");
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        fetchExpenses();
      } else {
        toast.error("Failed to delete expense");
      }
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeletingBulk(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success(`Deleted ${data.count} expenses`);
        setSelectedIds(new Set());
        fetchExpenses();
      } else {
        toast.error("Failed to delete selected expenses");
      }
    } catch {
      toast.error("Failed to delete selected expenses");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(expenses.map(e => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <ExpenseFilters
            search={search}
            onSearchChange={setSearch}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            category={category}
            onCategoryChange={setCategory}
          />
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
              >
                {isDeletingBulk ? "Deleting..." : `Delete Selected (${selectedIds.size})`}
              </Button>
            )}
            <ExportButton />
            <Button
              onClick={() => {
                setEditingExpense(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
          {!loading && (
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "expense" : "expenses"} found
            </p>
          )}
        </div>

        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingExpense(null);
        }}
        expense={editingExpense}
        onSubmit={editingExpense ? handleUpdate : handleCreate}
      />
    </div>
  );
}
