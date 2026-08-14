const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({ select: { id: true, email: true, name: true } });
  console.log("ALL USERS:");
  users.forEach(x => console.log(x.id, "|", x.email, "|", x.name));

  const orders = await p.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { product: { select: { name: true } } } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log("\nRECENT ORDERS:");
  orders.forEach(o => {
    console.log(o.id, "| User:", o.user.email, "| Phone:", o.customerPhone, "| Total:", o.totalAmount, "| Status:", o.status, "| Items:", o.items.map(i => i.product.name).join(", "));
  });
}

main().catch(console.error).finally(() => p.$disconnect());
