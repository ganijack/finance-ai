export async function generateMidtransPayment(
  orderId: string,
  grossAmount: number,
  customerDetails: {
    first_name: string;
    phone: string;
  },
  itemDetails: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[]
) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  if (!serverKey) {
    console.error("Midtrans credentials are not configured");
    return null;
  }

  const url = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const authString = Buffer.from(`${serverKey}:`).toString("base64");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        item_details: itemDetails,
        customer_details: customerDetails,
        expiry: {
          unit: "minutes",
          duration: 30,
        },
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Failed to generate Midtrans transaction:", data);
      return null;
    }

    return data.redirect_url; // Link to Snap payment page
  } catch (error) {
    console.error("Error generating Midtrans transaction:", error);
    return null;
  }
}
