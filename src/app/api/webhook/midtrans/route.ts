import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify signature to ensure it's from Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = body.signature_key;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;

    const hash = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex");

    if (hash !== signatureKey) {
      return new NextResponse("Invalid signature", { status: 403 });
    }

    const transactionStatus = body.transaction_status;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      // Find the order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (order && order.status !== "PAID") {
        // Mark order as PAID
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID", paymentId: body.transaction_id },
        });

        // Add to FinanceAI as Income
        await prisma.expense.create({
          data: {
            userId: order.userId,
            title: `Pesanan WA #${orderId.substring(0, 8)}`,
            amount: parseFloat(grossAmount),
            category: "Sales",
            date: new Date(),
            source: "WA_COMMERCE",
            type: "INCOME",
          },
        });

        // Notify customer
        await sendWhatsAppMessage(
          order.customerPhone,
          `✅ Pembayaran berhasil!\n\nPesanan Anda dengan kode #${orderId.substring(0, 8)} telah lunas dan akan segera diproses. Terima kasih telah berbelanja.`
        );
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "expire") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      if (order && order.status === "PENDING") {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELED" },
        });

        const productNames = order.items
          .map((item) => `${item.product.name} x${item.quantity}`)
          .join(", ");

        await sendWhatsAppMessage(
          order.customerPhone,
          `❌ Pesanan *${productNames}* (kode #${orderId.substring(0, 8)}) telah dibatalkan karena melewati batas waktu pembayaran 30 menit.\n\nSilakan pesan kembali jika masih berminat. Terima kasih! 🙏`
        );
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error processing Midtrans webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
