import { readFile, writeFile, mkdir } from "node:fs/promises";
import { loadEnv } from "vite";
import { render } from "../.prerender/entry-server.js";
const configuredDomain = process.env.SITE_URL ||
  loadEnv("production", process.cwd(), "SITE_").SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  "https://www.zakifx.com";
const siteUrl = new URL(configuredDomain.includes("://") ? configuredDomain : `https://${configuredDomain}`);
if (!["https:", "http:"].includes(siteUrl.protocol)) throw new Error("SITE_URL must use HTTP or HTTPS.");
const siteOrigin = siteUrl.origin;
const path = new URL("../dist/index.html", import.meta.url);
const html = (await readFile(path, "utf8")).replaceAll("https://www.zakifx.com", siteOrigin);
await writeFile(
  path,
  html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`),
);
console.log(
  "Prerendered complete public page: readable content and native course/FAQ disclosures work before JavaScript.",
);
for (const [slug, title] of [
  ["beginner-to-advanced", "Forex Beginner to Advanced"],
  ["advanced-strategies", "Advanced Trading Strategies"],
  ["vip-mentorship", "VIP 1-to-1 Mentorship"],
]) {
  const route = `/programmes/${slug}/`;
  const directory = new URL(`../dist${route}`, import.meta.url);
  await mkdir(directory, { recursive: true });
  const page = html
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${title} — ZAKI FX</title>`)
    .replace(
      /(rel="canonical"\s+href=")[^"]+/,
      `$1${siteOrigin}${route}`,
    )
    .replace(/(property="og:url"\s+content=")[^"]+/, `$1${siteOrigin}${route}`)
    .replace(/(property="og:title"\s+content=")[^"]+/, `$1${title} — ZAKI FX`);
  await writeFile(new URL("index.html", directory), page);
}
console.log("Prerendered all three programme detail routes.");
