import { prisma } from "@/lib/prisma";

export async function evaluateBudgetAlerts(userId: string, category: string, month: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        userId_category_month: {
          userId,
          category,
          month
        }
      }
    });

    if (!budget) return;

    // Calculate current spending for this category and month
    const [year, m] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(m), 0, 23, 59, 59);

    const expenses = await prisma.expense.aggregate({
      where: {
        userId,
        category,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    const totalSpent = expenses._sum.amount || 0;
    const percentage = (totalSpent / budget.amount) * 100;

    // Determine alert type based on percentage
    let alertType = null;
    let message = null;

    // Note: To avoid spamming, we should ideally track which thresholds have been notified.
    // For this V5, we will check if an identical notification was created today to debounce.
    
    if (percentage >= 100) {
      alertType = "ALERT";
      message = `You have exceeded your ${category} budget of ${budget.amount} for ${month}.`;
    } else if (percentage >= 90) {
      alertType = "WARNING";
      message = `You have reached 90% of your ${category} budget for ${month}.`;
    } else if (percentage >= 70) {
      alertType = "INFO";
      message = `You have reached 70% of your ${category} budget for ${month}.`;
    }

    if (alertType && message) {
      // Debounce logic: Check if a similar notification exists in the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existing = await prisma.notification.findFirst({
        where: {
          userId,
          message,
          createdAt: {
            gte: yesterday
          }
        }
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            userId,
            title: "Budget Alert",
            message,
            type: alertType
          }
        });
      }
    }
  } catch (error) {
    console.error("[BUDGET_ALERT_ERROR]", error);
  }
}

export async function evaluateAchievements(userId: string) {
  try {
    const expensesCount = await prisma.expense.count({ where: { userId } });
    
    const achievementsToUnlock = [];

    if (expensesCount >= 1) achievementsToUnlock.push("FIRST_EXPENSE");
    if (expensesCount >= 100) achievementsToUnlock.push("100_TRANSACTIONS");

    const receiptsCount = await prisma.receipt.count({ where: { userId } });
    if (receiptsCount >= 1) achievementsToUnlock.push("FIRST_RECEIPT");

    for (const badge of achievementsToUnlock) {
      const existing = await prisma.achievement.findUnique({
        where: {
          userId_badgeType: {
            userId,
            badgeType: badge
          }
        }
      });

      if (!existing) {
        await prisma.achievement.create({
          data: {
            userId,
            badgeType: badge
          }
        });

        await prisma.notification.create({
          data: {
            userId,
            title: "Achievement Unlocked! 🏆",
            message: `You unlocked the ${badge.replace('_', ' ')} badge!`,
            type: "SUCCESS"
          }
        });
      }
    }
  } catch (error) {
    console.error("[ACHIEVEMENT_ERROR]", error);
  }
}
