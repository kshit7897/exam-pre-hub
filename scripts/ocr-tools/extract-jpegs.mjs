// The AOC PDFs are scanned: each page is an embedded JPEG (/DCTDecode).
// This pulls those JPEGs out in file order, no rendering needed.
// Usage: node extract-jpegs.mjs <pdfPath> <outDir>
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , pdfPath, outDir] = process.argv;
mkdirSync(outDir, { recursive: true });

const buf = readFileSync(pdfPath);
const txt = buf.toString("latin1");
let count = 0;
let pos = 0;

while ((pos = txt.indexOf("/DCTDecode", pos)) !== -1) {
  const streamIdx = txt.indexOf("stream", pos);
  const endIdx = txt.indexOf("endstream", streamIdx);
  if (streamIdx === -1 || endIdx === -1) break;

  let start = streamIdx + "stream".length;
  if (txt[start] === "\r") start++;
  if (txt[start] === "\n") start++;

  // JPEG ends with FFD9; take the last one before endstream.
  let end = endIdx;
  while (end > start + 2 && !(buf[end - 2] === 0xff && buf[end - 1] === 0xd9)) end--;

  if (buf[start] === 0xff && buf[start + 1] === 0xd8 && end > start) {
    count++;
    const name = `p${String(count).padStart(3, "0")}.jpg`;
    writeFileSync(join(outDir, name), buf.subarray(start, end));
  }
  pos = endIdx;
}

console.log(`${pdfPath}: extracted ${count} JPEG images -> ${outDir}`);
