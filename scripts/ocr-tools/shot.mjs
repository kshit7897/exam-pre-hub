// Usage: node shot.mjs <url> <outPng> <light|dark> [width] [fullpage]
import puppeteer from "puppeteer-core";
const [, , url, out, scheme = "light", w = "390", full = "1"] = process.argv;
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: 844, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
await page.goto(url, { waitUntil: "networkidle0" });
const info = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  theme: document.documentElement.getAttribute("data-theme"),
}));
console.log(JSON.stringify(info));
await new Promise(r=>setTimeout(r,1500));
await page.screenshot({ path: out, fullPage: full === "1" });
await browser.close();
