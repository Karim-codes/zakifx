import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const routes = ['/', '/programmes/beginner-to-advanced/', '/programmes/advanced-strategies/', '/programmes/vip-mentorship/'];
const pages = new Map();
for (const route of routes) pages.set(route, new JSDOM(await readFile(resolve(root, '.' + route, 'index.html'), 'utf8')).window.document);
const checked = new Set();
async function asset(path) {
  if (checked.has(path)) return;
  checked.add(path);
  assert((await stat(resolve(root, '.' + path))).isFile(), `Missing asset ${path}`);
}
for (const [route, doc] of pages) {
  assert.equal(doc.querySelectorAll('h1').length, 1, `${route}: one main heading`);
  assert(doc.querySelector('meta[name="description"]').content.length > 50);
  assert(doc.querySelector('link[rel="canonical"]').href.endsWith(route));
  assert.equal(doc.querySelector('meta[property="og:url"]').content, doc.querySelector('link[rel="canonical"]').href);
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(ids.length, new Set(ids).size, `${route}: unique IDs`);
  for (const el of doc.querySelectorAll('[aria-controls], [aria-labelledby]')) {
    for (const key of ['aria-controls', 'aria-labelledby']) for (const id of (el.getAttribute(key) ?? '').split(' ').filter(Boolean)) assert(ids.includes(id), `Missing ${key}: ${id}`);
  }
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (href.startsWith('#')) assert(ids.includes(href.slice(1)), `${route}: missing ${href}`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const [path, hash] = href.split('#');
      if (pages.has(path)) { if (hash) assert(pages.get(path).getElementById(hash), `Missing ${href}`); }
      else await asset(path);
    }
    if (a.target === '_blank') assert(a.rel.includes('noopener'));
  }
  for (const el of doc.querySelectorAll('img[src], script[src], link[href]')) {
    const path = el.getAttribute('src') ?? el.getAttribute('href');
    if (path.startsWith('/') && !path.startsWith('//')) await asset(path);
  }
  for (const img of doc.querySelectorAll('img')) assert(img.alt && img.width && img.height, 'Images require alt and dimensions');
}
assert.equal(pages.get('/').querySelectorAll('img[src="/assets/zaki-portrait.webp"]').length, 1);
assert(pages.get('/').querySelector('.chart-fallback'), 'Static chart fallback required');
for (const path of checked) {
  if (extname(path) === '.js') execFileSync(process.execPath, ['--check', resolve(root, '.' + path)]);
  if (extname(path) !== '.css') continue;
  const css = await readFile(resolve(root, '.' + path), 'utf8');
  assert(css.includes('prefers-reduced-motion'));
  assert(css.includes(':focus-visible'));
  for (const match of css.matchAll(/url\(["']?(\/[^)'"\s]+)["']?\)/g)) await asset(match[1]);
}
console.log(`Passed ${pages.size} prerendered routes: headings, metadata, anchors, accessibility references, images, local assets, JavaScript syntax, reduced-motion and keyboard-focus styles.`);
