"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import type { DateFilter, SortField, SortOrder } from "@/types";

interface ExpenseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function ExpenseFilters({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  sortField,
  sortOrder,
  onSortChange,
  category,
  onCategoryChange,
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Date Filter */}
      <Select value={dateFilter} onValueChange={(v) => onDateFilterChange(v as DateFilter)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="custom">All Time</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onSortChange("date", "desc")}
            className={sortField === "date" && sortOrder === "desc" ? "bg-accent" : ""}
          >
            Date (Newest)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSortChange("date", "asc")}
            className={sortField === "date" && sortOrder === "asc" ? "bg-accent" : ""}
          >
            Date (Oldest)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onSortChange("amount", "desc")}
            className={sortField === "amount" && sortOrder === "desc" ? "bg-accent" : ""}
          >
            Amount (Highest)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSortChange("amount", "asc")}
            className={sortField === "amount" && sortOrder === "asc" ? "bg-accent" : ""}
          >
            Amount (Lowest)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onSortChange("category", "asc")}
            className={sortField === "category" ? "bg-accent" : ""}
          >
            Category (A-Z)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
