require('dotenv').config({ path: '.env.local' });
const { handleWhatsAppMessage } = require('./src/lib/bot-handler');

async function test() {
  const from = "6283832742294";
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const product = await prisma.product.findFirst();
  
  if (!product) {
    console.log("No product");
    return;
  }
  
  console.log("Testing interactive reply for product:", product.id);

  try {
    const res = await handleWhatsAppMessage({
      from: from,
      type: "interactive",
      interactive: {
        type: "list_reply",
        list_reply: {
          id: "ORDER_PRODUCT_" + product.id,
          title: product.name
        }
      }
    });
    console.log("Result:", res);
  } catch (err) {
    console.error("Error:", err);
  }
  await prisma.$disconnect();
}

test();
