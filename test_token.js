const https = require('https');
const data = JSON.stringify({ messaging_product: 'whatsapp', to: '6283832742294', type: 'text', text: { body: 'Test permanent token dari FinanceAI Bot!' } });
const options = { hostname: 'graph.facebook.com', path: '/v19.0/1294612670395177/messages', method: 'POST', headers: { 'Authorization': 'Bearer EAAYyxNZA4jlwBSEgOX5lJveQS9kZAoTI953ZB0L1bq9eZBbfT3k7U6lswnZBBVgafyimmw2qipXx5OOe9JB3xXuQNqqNanFqTjMIrCgxSP2d8nvNbfBlXPNahTliz5vR2FZC2xAoUYA0kKoU9BZC1nNjZAr8hZAiwt5A0qnDiTD1bdbH5Gx89CgiZA5sNlfj2VZBQZDZD', 'Content-Type': 'application/json' } };
const req = https.request(options, res => { let d = ''; res.on('data', c => d+=c); res.on('end', () => console.log('RESPONSE:', d)); });
req.on('error', console.error);
req.write(data);
req.end();
