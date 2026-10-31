import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';

const dist = resolve('dist');
const origin = 'https://alatrans.pl';
const routes = ['/', '/pomoc-drogowa/', '/transport-pojazdow/', '/realizacje/', '/o-firmie/', '/kontakt/'];
const preview = process.argv.includes('--preview');
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map((m) => [m[1].toLowerCase(), decode(m[2] ?? m[3] ?? m[4])]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))].map((m) => attrs(m[0]));
const text = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const pageFile = (route) => join(dist, route, 'index.html');
const titles = new Set();
const descriptions = new Set();
let references = 0;

function assertLocalResource(value, pageRoute) {
  if (!value || /^(?:data:|tel:|mailto:|sms:|https?:\/\/(?!alatrans\.pl(?:\/|$))|\/\/)/i.test(value)) return;
  const url = new URL(value, `${origin}${pageRoute}`);
  if (url.origin !== origin) return;
  assert(!url.pathname.split('/').includes('..'), `Nieprawidłowa ścieżka: ${value}`);
  let file = resolve(dist, `.${decodeURIComponent(url.pathname)}`);
  assert(file === dist || file.startsWith(`${dist}/`), `Ścieżka poza dist: ${value}`);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  assert(existsSync(file), `${pageRoute}: brak pliku dla ${value}`);
  if (url.hash) {
    const target = decodeURIComponent(url.hash.slice(1));
    const body = readFileSync(file, 'utf8');
    assert(tags(body, '[a-z][\\w:-]*').some((entry) => entry.id === target), `${pageRoute}: brak celu ${value}`);
  }
  references += 1;
}

for (const route of routes) {
  const file = pageFile(route);
  assert(existsSync(file), `Brak wygenerowanej strony: ${route}`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<html\b[^>]*lang="pl"/i, `${route}: lang=pl`);
  assert(!html.includes('data:image/'), `${route}: bez osadzonych obrazów base64`);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${route}: dokładnie jeden H1`);
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(titleMatches.length, 1, `${route}: jeden title`);
  const title = text(titleMatches[0][1]);
  assert(title.length > 5 && !titles.has(title), `${route}: niepusty i unikalny title`);
  titles.add(title);
  const metas = tags(html, 'meta');
  const desc = metas.filter((meta) => meta.name === 'description');
  assert.equal(desc.length, 1, `${route}: dokładnie jeden meta description`);
  assert(desc[0].content?.length > 30 && !descriptions.has(desc[0].content), `${route}: niepusty i unikalny opis`);
  descriptions.add(desc[0].content);
  const canonical = tags(html, 'link').filter((link) => link.rel === 'canonical');
  assert.equal(canonical.length, 1, `${route}: jeden canonical`);
  assert.equal(canonical[0].href, `${origin}${route}`, `${route}: prawidłowy canonical`);
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    const entries = metas.filter((meta) => meta.property === property);
    assert.equal(entries.length, 1, `${route}: jeden ${property}`);
    assert(entries[0].content, `${route}: zawartość ${property}`);
    if (property === 'og:url') assert.equal(entries[0].content, `${origin}${route}`);
    if (property === 'og:image') {
      assert.match(entries[0].content, /^https:\/\/alatrans\.pl\//);
      assertLocalResource(entries[0].content, route);
    }
  }
  const noindex = metas.some((meta) => meta.name === 'robots' && /noindex/i.test(meta.content || ''));
  assert.equal(noindex, preview, `${route}: indeksowanie zgodne z kontekstem ${preview ? 'preview' : 'production'}`);
  const anchors = tags(html, 'a');
  assert(anchors.some((a) => a.href === '#main-content'), `${route}: skip link`);
  assert(anchors.some((a) => a.href === 'tel:+48880887092'), `${route}: prawidłowy telefon`);
  for (const a of anchors) {
    assert(a.href && a.href !== '#', `${route}: pusty link`);
    assert(!a.href.startsWith('#') || a.href === '#main-content', `${route}: demonstracyjny anchor ${a.href}`);
    if (a.href.startsWith('tel:')) assert.equal(a.href, 'tel:+48880887092');
    assert(!/^(?:mailto:|sms:|javascript:)/i.test(a.href), `${route}: niezatwierdzony kanał lub link`);
    if (a.target === '_blank') assert(/(?:^|\s)noopener(?:\s|$)/.test(a.rel || ''), `${route}: zewnętrzny link bez noopener`);
    assertLocalResource(a.href, route);
  }
  const nav = [...html.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/gi)].find((m) => attrs(m[1]).id === 'site-navigation');
  assert(nav, `${route}: wspólna nawigacja`);
  assert.deepEqual(tags(nav[2], 'a').map((a) => a.href), routes.slice(1), `${route}: pięć prawdziwych linków menu w ustalonej kolejności`);
  if (route !== '/') assert(tags(nav[2], 'a').some((a) => a.href === route && a['aria-current'] === 'page'), `${route}: aktywna pozycja menu`);
  for (const tag of tags(html, '(?:img|script|source|link)')) {
    if (tag.src) assertLocalResource(tag.src, route);
    if (tag.href) assertLocalResource(tag.href, route);
    if (tag.srcset) for (const candidate of tag.srcset.split(',')) assertLocalResource(candidate.trim().split(/\s+/)[0], route);
  }
  for (const img of tags(html, 'img')) {
    assert('alt' in img, `${route}: obraz bez alt`);
    assert(Number(img.width) > 0 && Number(img.height) > 0, `${route}: obraz bez wymiarów`);
  }
  const ld = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((m) => attrs(m[1]).type === 'application/ld+json').map((m) => JSON.parse(m[2]));
  assert(ld.length > 0, `${route}: JSON-LD`);
  const schema = JSON.stringify(ld);
  assert.match(schema, /LocalBusiness/);
  assert.match(schema.replace(/\s/g, ''), /\+48880887092/);
  assert(!/AutoRepair|aggregateRating|"review"|priceRange/.test(schema), `${route}: schema bez niepotwierdzonych danych`);
  const publicText = text(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ''));
  assert(!/dostawcz|przyczep(?:y|ę|a|\s)|najtańsz|dojazd w \d+|gwarantowany czas|zawsze wolny termin/i.test(publicText), `${route}: niepotwierdzone deklaracje`);
  if (route === '/') {
    assert.equal(text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1]), 'Pomoc drogowa 24/7 – holowanie i transport pojazdów');
    assert(!/gallery-open|id="gallery-dialog"/.test(html), 'Główna bez galerii');
    const hero = tags(html, 'img').find((img) => /laweta_car_4/.test(img.src || '') || /laweta_car_4/.test(img.srcset || ''));
    assert(hero, 'Hero używa laweta_car_4');
    assert.notEqual(hero.loading, 'lazy', 'Hero bez lazy loading');
    assert.equal(hero.fetchpriority, 'high', 'Hero pobierane priorytetowo');
    assert(hero.srcset && hero.sizes, 'Hero ma responsywny srcset/sizes');
  }
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1])).sort();
assert.deepEqual(locations, routes.map((route) => `${origin}${route}`).sort(), 'Sitemap ma dokładnie sześć kanonicznych URL');
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
assert.match(robots, /Sitemap:\s*https:\/\/alatrans\.pl\/sitemap\.xml/);
if (preview) {
  assert.match(robots, /Disallow:\s*\/\s*(?:\r?\n|$)/i, 'Preview blokuje roboty');
  assert.match(readFileSync(join(dist, '_headers'), 'utf8'), /X-Robots-Tag:\s*noindex, nofollow/i, 'Preview ma nagłówek noindex');
} else {
  assert(!/Disallow:\s*\/\s*(?:\r?\n|$)/i.test(robots), 'Produkcja bez blokady robotów');
  if (existsSync(join(dist, '_headers'))) assert(!/noindex/i.test(readFileSync(join(dist, '_headers'), 'utf8')), 'Produkcja bez nagłówka noindex');
}
assert(existsSync(join(dist, '404.html')), 'Własna strona 404');

// Validate CSS asset references as well as references found directly in HTML.
for (const route of routes) {
  const html = readFileSync(pageFile(route), 'utf8');
  for (const link of tags(html, 'link').filter((entry) => entry.rel === 'stylesheet')) {
    const url = new URL(link.href, origin);
    if (url.origin !== origin || extname(url.pathname) !== '.css') continue;
    const css = readFileSync(join(dist, url.pathname), 'utf8');
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) assertLocalResource(match[1], url.pathname);
  }
}
console.log(`PASS: 6 stron, SEO, schema, sitemap, robots, 404 i ${references} lokalnych odnośników/zasobów (${preview ? 'preview' : 'production'}).`);
