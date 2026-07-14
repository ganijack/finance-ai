const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'logo');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1x1 transparent PNG base64
const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const pngBuffer = Buffer.from(transparentPngBase64, 'base64');

fs.writeFileSync(path.join(dir, 'logo.png'), pngBuffer);
fs.writeFileSync(path.join(dir, 'logo-light.png'), pngBuffer);
fs.writeFileSync(path.join(dir, 'logo-dark.png'), pngBuffer);
fs.writeFileSync(path.join(dir, 'favicon.ico'), pngBuffer);
fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), pngBuffer);

console.log("Placeholder images created successfully in public/logo/");
