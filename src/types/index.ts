export type ExpenseCategory =
  | "food"
  | "drink"
  | "transportation"
  | "shopping"
  | "entertainment"
  | "education"
  | "bills"
  | "health"
  | "subscription"
  | "other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes?: string;
}

export interface ExpenseStats {
  today: number;
  thisMonth: number;
  thisYear: number;
  dailyAverage: number;
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlyTrend {
  date: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface UserSettings {
  id: string;
  userId: string;
  currency: string;
  theme: string;
}

export type SortField = "date" | "amount" | "category";
export type SortOrder = "asc" | "desc";
export type DateFilter = "today" | "this-week" | "this-month" | "custom";

export interface ExpenseFilters {
  search: string;
  dateFilter: DateFilter;
  customStartDate?: Date;
  customEndDate?: Date;
  category?: ExpenseCategory;
  sortField: SortField;
  sortOrder: SortOrder;
}
