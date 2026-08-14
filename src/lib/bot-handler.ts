import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, sendWhatsAppInteractiveMessage } from "./whatsapp";
import { generateMidtransPayment } from "./midtrans";

export async function handleWhatsAppMessage(messageData: any) {
  const from = messageData.from;
  const type = messageData.type;

  // Link all WA commerce orders to the shop owner's account
  const adminUser = await prisma.user.findUnique({
    where: { email: "thorikabdillah12@gmail.com" },
  });
  if (!adminUser) {
    return sendWhatsAppMessage(from, "Sistem sedang dalam gangguan. Harap hubungi admin.");
  }

  if (type === "text") {
    // User sent a text message (e.g. "Halo")
    // Fetch active products
    const products = await prisma.product.findMany({
      where: { userId: adminUser.id, active: true },
      take: 10, // WA list supports max 10 rows per section
    });

    if (products.length === 0) {
      return sendWhatsAppMessage(from, "Maaf, toko kami belum memiliki produk yang aktif.");
    }

    const rows = products.map((p) => ({
      id: `ORDER_PRODUCT_${p.id}`,
      title: p.name,
      description: `Rp ${p.price.toLocaleString("id-ID")}`,
    }));

    return sendWhatsAppInteractiveMessage(
      from,
      "Halo! Selamat datang di toko kami. Silakan pilih menu di bawah ini untuk memesan:",
      "Pilih Menu",
      [{ title: "Menu Kami", rows }]
    );
  } else if (type === "interactive") {
    // User selected an item from the list
    const interactive = messageData.interactive;
    if (interactive.type === "list_reply") {
      const selectedId = interactive.list_reply.id;
      
      if (selectedId.startsWith("ORDER_PRODUCT_")) {
        const productId = selectedId.replace("ORDER_PRODUCT_", "");
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
          return sendWhatsAppMessage(from, "Produk tidak ditemukan.");
        }

        // Create Order in Database
        const order = await prisma.order.create({
          data: {
            userId: adminUser.id,
            customerPhone: from,
            totalAmount: product.price,
            status: "PENDING",
            items: {
              create: [
                {
                  productId: product.id,
                  quantity: 1,
                  price: product.price,
                }
              ]
            }
          }
        });

        // Generate Midtrans Payment Link
        const paymentLink = await generateMidtransPayment(
          order.id,
          order.totalAmount,
          { first_name: "Customer", phone: from },
          [
            {
              id: product.id,
              price: product.price,
              quantity: 1,
              name: product.name,
            }
          ]
        );

        if (paymentLink) {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentLink },
          });

          return sendWhatsAppMessage(
            from,
            `Pesanan *${product.name}* berhasil dibuat.\nTotal: Rp ${product.price.toLocaleString("id-ID")}\n\nSilakan selesaikan pembayaran Anda melalui link berikut:\n${paymentLink}`
          );
        } else {
          return sendWhatsAppMessage(from, "Maaf, terjadi kesalahan saat membuat link pembayaran.");
        }
      }
    }
  }

  return false;
}
