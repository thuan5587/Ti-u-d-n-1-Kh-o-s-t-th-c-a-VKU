import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(size, primaryColor = [2, 132, 199, 255]) {
  const width = size;
  const height = size;
  
  // Create RGBA buffer
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  const center = size / 2;
  const radius = size * 0.44;
  const cornerRadius = size * 0.22;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      // Rounded rect background
      const dx = Math.max(0, Math.abs(x - center) - (center - cornerRadius));
      const dy = Math.max(0, Math.abs(y - center) - (center - cornerRadius));
      const isInsideCard = (dx * dx + dy * dy) <= (cornerRadius * cornerRadius);

      if (isInsideCard) {
        // Gradient effect from #0284c7 to #0369a1
        const gradRatio = y / height;
        const r = Math.round(2 + gradRatio * (3 - 2));
        const g = Math.round(132 - gradRatio * (132 - 105));
        const b = Math.round(199 - gradRatio * (199 - 161));
        
        // Draw clipboard icon shape in center (white)
        const inClipX = x >= center - size * 0.22 && x <= center + size * 0.22;
        const inClipY = y >= center - size * 0.24 && y <= center + size * 0.26;
        const inClipHole = x >= center - size * 0.08 && x <= center + size * 0.08 && y >= center - size * 0.28 && y <= center - size * 0.18;

        // Checkmark coordinates
        const isCheckmark = (
          (x >= center - size * 0.12 && x <= center - size * 0.04 && Math.abs((x - (center - size * 0.12)) - (y - (center + size * 0.02))) < size * 0.035) ||
          (x >= center - size * 0.04 && x <= center + size * 0.12 && Math.abs((x - (center - size * 0.04)) + (y - (center + size * 0.10))) < size * 0.035)
        );

        if (inClipHole) {
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
        } else if (inClipX && inClipY) {
          if (isCheckmark) {
            // VKU Blue checkmark inside white clipboard
            rawData[offset++] = 2;
            rawData[offset++] = 132;
            rawData[offset++] = 199;
            rawData[offset++] = 255;
          } else {
            // White clipboard sheet
            rawData[offset++] = 255;
            rawData[offset++] = 255;
            rawData[offset++] = 255;
            rawData[offset++] = 255;
          }
        } else {
          rawData[offset++] = r;
          rawData[offset++] = g;
          rawData[offset++] = b;
          rawData[offset++] = 255;
        }
      } else {
        // Transparent outside
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      }
    }
  }

  // Deflate
  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bit per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // Compression method
  ihdr.writeUInt8(0, 11); // Filter method
  ihdr.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[i] = c;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const outDir = path.resolve('public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPNG(512));
fs.writeFileSync(path.join(outDir, 'icon-maskable.png'), createPNG(512));
console.log('Icons generated successfully!');
