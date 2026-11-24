// OCR every extracted page JPEG with tesseract.js (English).
// Usage: node ocr.mjs <rawUnitDir> <outJsonFile>
import { readdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createWorker } from "tesseract.js";

const [, , rawDir, outFile] = process.argv;
const files = readdirSync(rawDir).filter((f) => f.endsWith(".jpg")).sort();
const result = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const worker = await createWorker("eng");

for (const f of files) {
  if (result[f]) continue;
  const { data } = await worker.recognize(join(rawDir, f));
  result[f] = data.text.trim();
  writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(`${f} ${result[f].length} chars`);
}
await worker.terminate();
console.log(`done ${rawDir}`);
