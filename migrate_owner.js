const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const target = 'dd05bc85-50cd-4dd1-8282-373d83d49cfe'; // thorikabdillah12@gmail.com
  const r1 = await p.product.updateMany({ data: { userId: target } });
  console.log('Products moved:', r1.count);
  const r2 = await p.order.updateMany({ data: { userId: target } });
  console.log('Orders moved:', r2.count);
}
main().catch(console.error).finally(() => p.$disconnect());
