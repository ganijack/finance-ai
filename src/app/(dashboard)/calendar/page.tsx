"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Fetch more expenses to cover the calendar (e.g. limit 1000)
      const res = await fetch("/api/expenses?sortField=date&sortOrder=desc&limit=1000");
      const data = await res.json();
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (error) {
      console.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart; // For simplicity, not padding the grid with prev/next month days in this version
  const endDate = monthEnd;

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayExpenses = (day: Date) => {
    return expenses.filter(e => isSameDay(new Date(e.date), day));
  };

  const selectedExpenses = getDayExpenses(selectedDate);
  const selectedTotal = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar View</h1>
          <p className="text-muted-foreground mt-1">Visualize your spending patterns across the month.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-lg font-semibold min-w-[140px] text-center">{format(currentDate, "MMMM yyyy")}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-border/40">
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Pad start of month */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`pad-start-${i}`} className="h-24 rounded-lg bg-muted/10 border border-dashed border-border/20" />
              ))}
              
              {days.map((day, i) => {
                const dayExpenses = getDayExpenses(day);
                const isSelected = isSameDay(day, selectedDate);
                const hasExpenses = dayExpenses.length > 0;
                
                return (
                  <div 
                    key={day.toString()} 
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 rounded-lg p-2 border cursor-pointer transition-all flex flex-col ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500' 
                        : 'border-border/40 hover:border-indigo-500/50 hover:bg-muted/30'
                    } ${isToday(day) && !isSelected ? 'bg-muted' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${isToday(day) ? 'bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                        {format(day, dateFormat)}
                      </span>
                      {hasExpenses && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    {hasExpenses && (
                      <div className="mt-auto text-xs font-semibold text-red-500 dark:text-red-400">
                        {formatCurrency(dayExpenses.reduce((sum, e) => sum + e.amount, 0))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Details */}
        <Card className="md:col-span-1 shadow-sm border-border/40 h-fit sticky top-24">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-1">{format(selectedDate, "EEEE")}</h3>
            <p className="text-muted-foreground text-sm mb-6">{format(selectedDate, "MMMM d, yyyy")}</p>
            
            <div className="bg-muted/30 p-4 rounded-xl mb-6 flex justify-between items-center">
              <span className="font-medium text-sm text-muted-foreground">Total Daily Spent</span>
              <span className="text-xl font-bold">{formatCurrency(selectedTotal)}</span>
            </div>

            <h4 className="font-semibold text-sm mb-4 border-b pb-2">Transactions ({selectedExpenses.length})</h4>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {selectedExpenses.length === 0 ? (
                <div className="text-center py-10">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground opacity-20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No expenses recorded for this day.</p>
                </div>
              ) : (
                selectedExpenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center bg-card">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-indigo-500/10 p-2 rounded-full shrink-0">
                        <Receipt className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-sm truncate">{expense.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{expense.category}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm shrink-0 pl-3">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
