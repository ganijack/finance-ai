import { Expense } from "@prisma/client";

export interface AnalyticsSummary {
  currentMonthTotal: number;
  previousMonthTotal: number;
  percentageChange: number;
  dailyAverage: number;
  predictedEndOfMonth: number;
  highestCategory: { name: string; amount: number } | null;
  lowestCategory: { name: string; amount: number } | null;
  categoryBreakdown: { name: string; amount: number; percentage: number }[];
  topRecurring: { title: string; count: number; totalAmount: number }[];
  mostFrequent: { title: string; count: number } | null;
  financialScore: {
    score: number;
    reasons: string[];
  };
}

export function calculateAnalytics(expenses: Expense[], targetMonth: Date = new Date()): AnalyticsSummary {
  const currentMonth = targetMonth.getMonth();
  const currentYear = targetMonth.getFullYear();
  
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const previousMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === previousMonth && d.getFullYear() === previousYear;
  });

  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  let percentageChange = 0;
  if (previousMonthTotal > 0) {
    percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  } else if (currentMonthTotal > 0) {
    percentageChange = 100;
  }

  // Daily Average and Prediction
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = targetMonth.getDate();
  const dailyAverage = currentMonthTotal / (today || 1);
  const predictedEndOfMonth = dailyAverage * daysInMonth;

  // Category Breakdown
  const categoryMap = new Map<string, number>();
  currentMonthExpenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: currentMonthTotal > 0 ? (amount / currentMonthTotal) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;
  const lowestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[categoryBreakdown.length - 1] : null;

  // Recurring & Frequent Expenses (using titles)
  const titleMap = new Map<string, { count: number; totalAmount: number }>();
  currentMonthExpenses.forEach(e => {
    const title = e.title.toLowerCase().trim();
    const existing = titleMap.get(title) || { count: 0, totalAmount: 0 };
    titleMap.set(title, {
      count: existing.count + 1,
      totalAmount: existing.totalAmount + e.amount
    });
  });

  const frequencyArray = Array.from(titleMap.entries())
    .map(([title, data]) => ({ title, count: data.count, totalAmount: data.totalAmount }))
    .sort((a, b) => b.count - a.count);

  const mostFrequent = frequencyArray.length > 0 ? { title: frequencyArray[0].title, count: frequencyArray[0].count } : null;
  const topRecurring = frequencyArray.filter(f => f.count > 1).slice(0, 3);

  // Financial Health Score (0 - 100)
  let score = 70; // Baseline
  const reasons: string[] = [];

  if (percentageChange < -10) {
    score += 15;
    reasons.push("Spending is down significantly compared to last month.");
  } else if (percentageChange > 20) {
    score -= 20;
    reasons.push("Spending is significantly higher than last month.");
  } else {
    reasons.push("Spending is relatively stable compared to last month.");
  }

  // Penalty for high concentration in a single category
  if (highestCategory && highestCategory.percentage > 50) {
    score -= 10;
    reasons.push(`Over 50% of your budget went to a single category (${highestCategory.name}).`);
  } else {
    score += 10;
    reasons.push("Your spending is well diversified across categories.");
  }

  // Bonus for keeping daily average low (arbitrary threshold based on average users, dynamic would be better but this is a V4 start)
  if (topRecurring.length > 0) {
    const recurringTotal = topRecurring.reduce((sum, item) => sum + item.totalAmount, 0);
    if (recurringTotal > (currentMonthTotal * 0.4)) {
      score -= 10;
      reasons.push("A large portion of your budget is tied up in recurring expenses.");
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    currentMonthTotal,
    previousMonthTotal,
    percentageChange,
    dailyAverage,
    predictedEndOfMonth,
    highestCategory,
    lowestCategory,
    categoryBreakdown,
    topRecurring,
    mostFrequent,
    financialScore: {
      score,
      reasons
    }
  };
}
