import { NextResponse } from "next/server";
import { handleWhatsAppMessage } from "@/lib/bot-handler";

// Meta verification
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Receive messages
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=== WEBHOOK POST RECEIVED ===");
    console.log("Body object:", body.object);

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          console.log("Change field:", change.field);
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              console.log(">>> MESSAGE FROM:", message.from);
              console.log(">>> MESSAGE TYPE:", message.type);
              if (message.type === "text") {
                console.log(">>> TEXT:", message.text?.body);
              }
              const result = await handleWhatsAppMessage(message);
              console.log(">>> HANDLER RESULT:", result);
            }
          } else if (change.value && change.value.statuses) {
            console.log(">>> STATUS UPDATE (not a message, ignoring)");
          } else {
            console.log(">>> No messages in this change");
          }
        }
      }
    }

    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Error processing WA webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

