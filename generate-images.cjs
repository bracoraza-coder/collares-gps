const sharp = require('sharp');
const fs = require('fs');

async function generate() {
  const input = 'src/assets/images/favicon_logo_1783588062124.jpg';
  
  await sharp(input)
    .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .jpeg({ quality: 80 })
    .toFile('public/social-preview.jpg');

  await sharp(input)
    .resize(256, 256)
    .png()
    .toFile('public/favicon.ico');
    
  await sharp(input)
    .resize(192, 192)
    .png()
    .toFile('public/favicon-192.png');
    
  await sharp(input)
    .resize(512, 512)
    .png()
    .toFile('public/favicon-512.png');
    
  await sharp(input)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
    
  console.log('Images generated successfully.');
}

generate().catch(console.error);
