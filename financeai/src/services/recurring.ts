import { prisma } from "@/lib/prisma";
import { addDays, addWeeks, addMonths, addYears, isBefore, isEqual } from "date-fns";

export async function processRecurringExpenses(userId: string) {
  try {
    const now = new Date();
    
    // Find all active recurring expenses that are due
    const recurring = await prisma.recurringExpense.findMany({
      where: {
        userId,
        active: true,
        nextDate: {
          lte: now
        }
      }
    });

    if (recurring.length === 0) return;

    for (const sub of recurring) {
      let currentDate = new Date(sub.nextDate);
      let newExpenses = [];

      // Create expenses for all missed cycles up to now
      while (isBefore(currentDate, now) || isEqual(currentDate, now)) {
        newExpenses.push({
          userId: sub.userId,
          title: `${sub.title} (Auto)`,
          amount: sub.amount,
          category: sub.category,
          date: currentDate,
        });

        // Calculate next date
        switch (sub.interval) {
          case 'DAILY':
            currentDate = addDays(currentDate, 1);
            break;
          case 'WEEKLY':
            currentDate = addWeeks(currentDate, 1);
            break;
          case 'MONTHLY':
            currentDate = addMonths(currentDate, 1);
            break;
          case 'YEARLY':
            currentDate = addYears(currentDate, 1);
            break;
          default:
            currentDate = addMonths(currentDate, 1); // fallback
        }
      }

      // Batch insert the new expenses
      if (newExpenses.length > 0) {
        await prisma.expense.createMany({
          data: newExpenses
        });
        
        // Notify the user
        await prisma.notification.create({
          data: {
            userId: sub.userId,
            title: "Recurring Expense Processed",
            message: `Processed ${newExpenses.length} transaction(s) for ${sub.title}.`,
            type: "INFO"
          }
        });
      }

      // Update the recurring expense's next date
      await prisma.recurringExpense.update({
        where: { id: sub.id },
        data: { nextDate: currentDate }
      });
    }
  } catch (error) {
    console.error("[PROCESS_RECURRING_ERROR]", error);
  }
}
