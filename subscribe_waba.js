// Subscribe app to WhatsApp Business Account for webhook events
require('dotenv').config({ path: '.env.local' });

const token = process.env.WA_ACCESS_TOKEN;
const wabaId = '930612819399560'; // From Meta dashboard

async function main() {
  // Step 1: Subscribe app to WABA
  console.log("=== Subscribing app to WABA ===");
  const subRes = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/subscribed_apps`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const subData = await subRes.json();
  console.log("Subscribe result:", JSON.stringify(subData, null, 2));

  // Step 2: Check current subscriptions
  console.log("\n=== Checking current subscriptions ===");
  const checkRes = await fetch(`https://graph.facebook.com/v19.0/${wabaId}/subscribed_apps`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const checkData = await checkRes.json();
  console.log("Current subscriptions:", JSON.stringify(checkData, null, 2));

  // Step 3: Check webhook status for the app
  console.log("\n=== Checking phone number webhook status ===");
  const phoneRes = await fetch(`https://graph.facebook.com/v19.0/${process.env.WA_PHONE_NUMBER_ID}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const phoneData = await phoneRes.json();
  console.log("Phone number info:", JSON.stringify(phoneData, null, 2));
}

main().catch(console.error);
