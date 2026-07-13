"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Expense,
  ExpenseFormData,
  ExpenseStats,
  DateFilter,
  SortField,
  SortOrder,
} from "@/types";

interface UseExpensesOptions {
  search?: string;
  dateFilter?: DateFilter;
  customStartDate?: Date;
  customEndDate?: Date;
  category?: string;
  sortField?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  page: number;
  totalPages: number;
}

export function useExpenses(options: UseExpensesOptions = {}) {
  const [data, setData] = useState<ExpensesResponse>({
    expenses: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.search) params.set("search", options.search);
      if (options.dateFilter) params.set("dateFilter", options.dateFilter);
      if (options.category) params.set("category", options.category);
      if (options.sortField) params.set("sortField", options.sortField);
      if (options.sortOrder) params.set("sortOrder", options.sortOrder);
      if (options.page) params.set("page", options.page.toString());
      if (options.limit) params.set("limit", options.limit.toString());
      if (options.customStartDate)
        params.set("customStart", options.customStartDate.toISOString());
      if (options.customEndDate)
        params.set("customEnd", options.customEndDate.toISOString());

      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [
    options.search,
    options.dateFilter,
    options.category,
    options.sortField,
    options.sortOrder,
    options.page,
    options.limit,
    options.customStartDate,
    options.customEndDate,
  ]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (formData: ExpenseFormData) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create expense");
    }

    await fetchExpenses();
    return res.json();
  };

  const updateExpense = async (id: string, formData: Partial<ExpenseFormData>) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update expense");
    }

    await fetchExpenses();
    return res.json();
  };

  const deleteExpense = async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete expense");
    }

    await fetchExpenses();
  };

  return {
    expenses: data.expenses,
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useExpenseStats() {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/expenses/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");

      const json = await res.json();
      setStats(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
