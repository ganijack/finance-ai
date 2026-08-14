const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@financeai.com",
        password: "hashedpassword",
      }
    });
    console.log("Created admin user");
  } else {
    console.log("Admin user exists:", user.id);
  }

  const products = await prisma.product.findMany();
  if (products.length === 0) {
    await prisma.product.createMany({
      data: [
        { name: "Kopi Susu Gula Aren", price: 20000, userId: user.id },
        { name: "Americano Dingin", price: 15000, userId: user.id },
        { name: "Roti Bakar Coklat Keju", price: 25000, userId: user.id }
      ]
    });
    console.log("Created dummy products");
  } else {
    console.log("Products exist");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
