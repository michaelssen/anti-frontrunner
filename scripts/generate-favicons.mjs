import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'assets/favicon-sign-processed.png');

/** @param {Buffer} input @param {number} size @param {boolean} white */
async function renderIcon(input, size, white) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  if (white) {
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
      }
    }
  }

  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

const sourceBuffer = await sharp(source).png().toBuffer();

const sizes = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(await renderIcon(sourceBuffer, size, true)).toFile(join(root, 'assets', name));
  console.log(`Wrote assets/${name}`);
}

await sharp(await renderIcon(sourceBuffer, 32, true)).toFile(join(root, 'assets/favicon.png'));
console.log('Wrote assets/favicon.png');

writeFileSync(
  join(root, 'assets/favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
  <image href="favicon-32.png" width="32" height="32" preserveAspectRatio="xMidYMid meet"/>
</svg>`,
  'utf8',
);
console.log('Wrote assets/favicon.svg');
