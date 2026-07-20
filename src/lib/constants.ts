import { ExpenseCategory } from "@/types";
import {
  UtensilsCrossed,
  Coffee,
  Car,
  ShoppingBag,
  Gamepad2,
  GraduationCap,
  Receipt,
  Heart,
  CreditCard,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "food",
    label: "Food",
    icon: UtensilsCrossed,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    value: "drink",
    label: "Drink",
    icon: Coffee,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    value: "transportation",
    label: "Transportation",
    icon: Car,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: Gamepad2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    value: "education",
    label: "Education",
    icon: GraduationCap,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    value: "bills",
    label: "Bills",
    icon: Receipt,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "health",
    label: "Health",
    icon: Heart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "subscription",
    label: "Subscription",
    icon: CreditCard,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    value: "other",
    label: "Other",
    icon: MoreHorizontal,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "#f97316",
  drink: "#f59e0b",
  transportation: "#3b82f6",
  shopping: "#ec4899",
  entertainment: "#a855f7",
  education: "#6366f1",
  bills: "#ef4444",
  health: "#10b981",
  subscription: "#06b6d4",
  other: "#64748b",
};

export const getCategoryConfig = (category: ExpenseCategory) => {
  return CATEGORIES.find((c) => c.value === category) || CATEGORIES[9];
};
