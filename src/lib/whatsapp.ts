export async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WA_ACCESS_TOKEN;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("WhatsApp credentials are not configured");
    return false;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to send WA message:", data);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending WA message:", error);
    return false;
  }
}

export async function sendWhatsAppInteractiveMessage(
  to: string,
  bodyText: string,
  buttonText: string,
  sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]
) {
  const token = process.env.WA_ACCESS_TOKEN;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("WhatsApp credentials are not configured");
    return false;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "interactive",
          interactive: {
            type: "list",
            header: {
              type: "text",
              text: "Menu UMKM",
            },
            body: {
              text: bodyText,
            },
            footer: {
              text: "Powered by FinanceAI",
            },
            action: {
              button: buttonText,
              sections: sections,
            },
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Failed to send WA interactive message:", data);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending WA interactive message:", error);
    return false;
  }
}
