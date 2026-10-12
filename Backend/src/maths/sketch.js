import { deflateSync } from 'node:zlib';

// ---------------------------------------------------------------------------
// Drawing the player's handwriting as a picture, so the AI can read it.
//
// The app sends the pen strokes (lists of x, y points), not a picture: that
// is much smaller, and it needs no extra library on the phone. Here they are
// drawn as thick black lines on white and saved as a PNG.
//
//   strokesToPng([[10,10, 40,60, 70,10]])  -> Buffer (PNG)
// ---------------------------------------------------------------------------

const MAX_WIDTH = 900;
const MAX_HEIGHT = 320;
const PAD = 24;

// Check what the app sent: up to 200 strokes and 6000 points in all.
export function cleanStrokes(strokes) {
  if (!Array.isArray(strokes)) return [];
  let points = 0;
  const out = [];
  for (const stroke of strokes.slice(0, 200)) {
    if (!Array.isArray(stroke)) continue;
    const nums = stroke.map(Number).filter(Number.isFinite);
    const even = nums.slice(0, nums.length - (nums.length % 2));
    if (!even.length) continue;
    points += even.length / 2;
    if (points > 6000) break;
    out.push(even);
  }
  return out;
}

export function strokesToPng(strokes) {
  const all = strokes.flat();
  const xs = all.filter((_, i) => i % 2 === 0);
  const ys = all.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const inkW = Math.max(1, Math.max(...xs) - minX);
  const inkH = Math.max(1, Math.max(...ys) - minY);

  // Make the writing a good size: at least as big as on the phone, at most
  // the size of the picture
  const scale = Math.max(0.5, Math.min(3, (MAX_WIDTH - PAD * 2) / inkW, (MAX_HEIGHT - PAD * 2) / inkH));
  const width = Math.round(inkW * scale) + PAD * 2;
  const height = Math.round(inkH * scale) + PAD * 2;
  const radius = Math.max(2.5, 2.2 * scale);
  const pixels = Buffer.alloc(width * height, 255);

  const dot = (cx, cy) => {
    const r = Math.ceil(radius);
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(height - 1, Math.ceil(cy + r)); y++) {
      for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(width - 1, Math.ceil(cx + r)); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= radius * radius) pixels[y * width + x] = 0;
      }
    }
  };
  const at = (stroke, i) => [(stroke[i] - minX) * scale + PAD, (stroke[i + 1] - minY) * scale + PAD];

  for (const stroke of strokes) {
    let [px, py] = at(stroke, 0);
    dot(px, py);
    for (let i = 2; i < stroke.length; i += 2) {
      const [x, y] = at(stroke, i);
      const steps = Math.max(1, Math.ceil(Math.hypot(x - px, y - py) / (radius / 2)));
      for (let s = 1; s <= steps; s++) dot(px + ((x - px) * s) / steps, py + ((y - py) * s) / steps);
      [px, py] = [x, y];
    }
  }
  return encodePng(pixels, width, height);
}

// --- a tiny PNG writer (8-bit greyscale) ----------------------------------------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

export function encodePng(pixels, width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bits per pixel
  header[9] = 0; // greyscale
  const rows = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) pixels.copy(rows, y * (width + 1) + 1, y * width, (y + 1) * width);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
