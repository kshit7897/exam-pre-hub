// Resize extracted slide JPEGs to a web-friendly width and write them into the app's public folder.
// Usage: node resize.mjs <rawUnitDir> <outDir> [maxWidth]
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const [, , rawDir, outDir, maxArg] = process.argv;
const maxW = Number(maxArg ?? 1400);
mkdirSync(outDir, { recursive: true });

const files = readdirSync(rawDir).filter((f) => f.endsWith(".jpg")).sort();
for (const f of files) {
  const img = await loadImage(join(rawDir, f));
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  writeFileSync(join(outDir, f), canvas.toBuffer("image/jpeg", 74));
}
console.log(`${rawDir}: ${files.length} pages -> ${outDir}`);
