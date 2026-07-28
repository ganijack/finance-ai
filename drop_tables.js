const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Dropping tables...");
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Budget" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "SavingGoal" CASCADE;`);
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "RecurringExpense" CASCADE;`);
    console.log("Tables dropped successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
