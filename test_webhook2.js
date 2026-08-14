fetch('http://localhost:3000/api/webhook/whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{
      id: "930612819399560",
      changes: [{
        value: {
          messaging_product: "whatsapp",
          messages: [{
            from: "6283832742294",
            id: "wamid.ID2",
            timestamp: "TIMESTAMP",
            type: "text",
            text: { body: "Hallo" }
          }]
        },
        field: "messages"
      }]
    }]
  })
}).then(async res => {
  console.log(res.status, await res.text());
}).catch(console.error);
