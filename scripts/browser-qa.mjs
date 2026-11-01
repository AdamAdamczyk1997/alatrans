import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const dist = resolve('dist');
const routes = ['/', '/pomoc-drogowa/', '/transport-pojazdow/', '/realizacje/', '/o-firmie/', '/kontakt/'];
const widths = [320, 375, 390, 768, 1024, 1440];
const confirmed = {
  companyName: 'AlaTrans – P.P.H.U. Artur Adamczyk',
  whatsapp: 'https://wa.me/48880887092',
  messenger: 'https://m.me/61574526132487',
  facebook: 'https://www.facebook.com/61574526132487/',
  map: 'https://maps.app.goo.gl/wpTjFzKYmChzWnn86',
  mapEmbed: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s11387420831993348612',
  address: 'Łącko 984, 33-390 Łącko',
};
const homeSections = ['hero', 'home-services', 'home-area', 'home-about', 'contact-section'];
const screenshots = resolve('docs/screenshots');
const screenshotsOnly = process.argv.includes('--screenshots-only');
const reportPath = resolve('docs/qa-browser.json');
if (screenshotsOnly) assert(existsSync(reportPath), 'Tryb screenshots-only wymaga wcześniejszego raportu pełnych testów.');
mkdirSync(screenshots, { recursive: true });
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = resolve(dist, `.${decodeURIComponent(url.pathname)}`);
    if (file !== dist && !file.startsWith(`${dist}/`)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    const found = existsSync(file) && statSync(file).isFile();
    if (!found) file = join(dist, '404.html');
    res.writeHead(found ? 200 : 404, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(existsSync(file) ? readFileSync(file) : '404');
  } catch { res.writeHead(400).end(); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const report = screenshotsOnly ? JSON.parse(readFileSync(reportPath, 'utf8')) : {
  testedAt: new Date().toISOString(),
  testContract: 'AlaTrans 2.0 — iteracja 2: potwierdzone dane, kanały kontaktu i pięć sekcji głównej',
  browserContext: { locale: 'pl-PL', reducedMotion: 'reduce', deviceScaleFactor: 1 },
  target: 'lokalny build dist, serwer statyczny z rzeczywistym statusem 404',
  limitations: ['WebKit Playwright nie zastępuje Safari na fizycznym iPhonie.', 'Nie wykonuje połączeń ani nie wysyła wiadomości WhatsApp i Messenger; konta i wskazane bezpośrednie linki potwierdził właściciel.', 'Nie potwierdza nagłówków i routingu rzeczywistego Deploy Preview Netlify.', 'Pełne screenshoty 390 px celowo ukrywają przypięty pasek telefonu, aby nie zasłaniał treści w długim obrazie. Osobne screenshoty viewport 390 px pokazują jego naturalne położenie; testy interakcji i stopki zachowują widoczny pasek.'],
  browsers: [], pages: [], interactions: [], screenshots: [], errors: [],
};
const browsers = [];
const captureMethod = 'Osobny proces WebKit Playwright i świeży kontekst każdej fotografowanej strony, bez testów fokusu i axe. Kontakt przewijany do rzeczywistej lazy mapy; capture czeka na DOM Google, komplet widocznych kafelków z potwierdzonym miejscem, zakończenie przejścia ze statycznego podglądu oraz fonty i malowanie — bez networkidle Google. Obrazy eager wyłącznie w kontekście capture, decode + fonty + dwa RAF + stabilizacja. Najpierw viewport, potem full-page. Full-page 390 px ukrywa wyłącznie pasek mobile-cta; viewport zachowuje naturalny fixed. WebKit omija zaobserwowany artefakt rasteryzacji hero w pełnych zrzutach Chromium.';
let screenshotBrowser;

async function getScreenshotBrowser() {
  if (!screenshotBrowser) {
    const executablePath = process.env.WEBKIT_EXECUTABLE_PATH;
    screenshotBrowser = await webkit.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    browsers.push(screenshotBrowser);
    report.captureBrowser = { name: 'webkit', version: screenshotBrowser.version() };
  }
  return screenshotBrowser;
}

async function stabilizePaint(page, delay = 125) {
  await page.evaluate(async (paintDelay) => {
    scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all([...document.images]
      .filter((img) => img.getAttribute('src') || img.currentSrc)
      .map((img) => img.decode()));
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    await new Promise((done) => setTimeout(done, paintDelay));
  }, delay);
}

async function waitForAppReady(page) {
  // A third-party map can keep making requests after the application's DOM is ready.
  await page.waitForFunction(() => {
    const button = document.querySelector('.menu-button');
    const navigation = document.querySelector('#site-navigation');
    return button && !button.hidden && navigation?.classList.contains('is-enhanced');
  }, null, { timeout: 15000 });
}

async function settleImages(page) {
  // Exercise native lazy loading before full-page screenshots and image assertions.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(250, innerHeight - 100)) {
      scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 25));
    }
    scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].filter((img) => img.getAttribute('src') || img.currentSrc).every((img) => img.complete), null, { timeout: 15000 });
  await stabilizePaint(page);
}

async function waitForMapPaint(page) {
  const map = page.locator('#baza iframe');
  await map.scrollIntoViewIfNeeded();
  const handle = await map.elementHandle();
  const frame = await handle.contentFrame();
  assert(frame, 'Screenshot Kontakt: prawdziwa ramka mapy');
  await frame.waitForURL((url) => url.hostname === 'www.google.com' && url.pathname === '/maps/embed', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await frame.waitForFunction(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight) return false;
      for (let parent = element; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    const tiles = [...document.images].filter((image) => {
      try { return new URL(image.src).pathname === '/maps/vt' && image.complete && image.naturalWidth >= 128 && visible(image); }
      catch { return false; }
    });
    // The selected place and its pin are rasterized in Google's POI tiles.
    // Inspect the confirmed public place ID, not translated labels or private marker markup.
    const selectedPlace = tiles.some((image) => image.src.includes('11387420831993348612'));
    const rects = tiles.map((image) => image.getBoundingClientRect());
    const coverage = [.05, .25, .5, .75, .95].every((x) => [.05, .25, .5, .75, .95].every((y) => rects.some((rect) => rect.left <= innerWidth * x && rect.right >= innerWidth * x && rect.top <= innerHeight * y && rect.bottom >= innerHeight * y)));
    const staticPreview = [...document.images].some((image) => image.src.includes('StaticMapService.GetMapImage') && visible(image));
    return selectedPlace && coverage && !staticPreview;
  }, null, { polling: 100, timeout: 30000 });
  await frame.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((image) => {
      try { return new URL(image.src).pathname === '/maps/vt' && image.complete && image.naturalWidth > 0; }
      catch { return false; }
    }).map((image) => image.decode()));
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

async function captureScreenshots(browser, route, width) {
  // Keep capture independent from scrolling, focus tests and accessibility tooling.
  const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, locale: 'pl-PL', deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const files = [];
  try {
    const page = await context.newPage();
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200, `Screenshot ${route}: status 200`);
    await waitForAppReady(page);
    await page.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
    await page.waitForFunction(() => [...document.images].filter((img) => img.getAttribute('src') || img.currentSrc).every((img) => img.complete), null, { timeout: 15000 });
    if (route === '/kontakt/') await waitForMapPaint(page);
    await stabilizePaint(page, 200);
    const slug = route === '/' ? 'glowna' : route.split('/').filter(Boolean)[0];
    const viewportFile = route === '/' ? `glowna-hero-${width}.png` : width === 390 ? `${slug}-viewport-${width}.png` : null;
    // A viewport capture also commits the initial compositor paint before full-page capture.
    await page.screenshot({ ...(viewportFile ? { path: join(screenshots, viewportFile) } : {}), fullPage: false });
    if (viewportFile) files.push(`docs/screenshots/${viewportFile}`);
    await stabilizePaint(page);
    const filename = `${slug}-${width}.png`;
    await page.screenshot({
      path: join(screenshots, filename),
      fullPage: true,
      ...(width === 390 ? { style: '.mobile-cta { visibility: hidden !important; }' } : {}),
    });
    files.push(`docs/screenshots/${filename}`);
    return files;
  } finally {
    await context.close();
  }
}

async function testMenu(page, label) {
  const menu = page.locator('button.menu-button');
  if (!(await menu.isVisible())) return;
  await menu.focus();
  await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true', `${label}: menu otwarte klawiaturą`);
  const nav = page.locator('#site-navigation');
  assert.equal(await nav.locator('a:visible').count(), 5, `${label}: pięć widocznych pozycji menu`);
  const call = page.locator('.mobile-cta');
  if (page.viewportSize().width <= 760) assert(await call.isVisible(), `${label}: telefon dostępny przy otwartym menu`);
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false', `${label}: Escape zamyka menu`);
  assert(await menu.evaluate((el) => el === document.activeElement), `${label}: focus wraca do przycisku menu`);
  await menu.click();
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false', `${label}: menu zamyka się ponownym kliknięciem`);
  report.interactions.push({ label, test: 'mobile menu Enter / Escape / focus / click / CTA', passed: true });
}

async function testGallery(page, label) {
  const opener = page.locator('.gallery-open').first();
  assert(await opener.count(), `${label}: galeria posiada przycisk powiększenia`);
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog#gallery-dialog');
  await dialog.waitFor({ state: 'visible' });
  assert(await dialog.evaluate((el) => el.open), `${label}: otwarty dialog`);
  const image = dialog.locator('img');
  await image.evaluate((el) => el.decode());
  assert(await image.getAttribute('alt'), `${label}: opis powiększenia`);
  assert(await dialog.evaluate((el) => el.contains(document.activeElement)), `${label}: focus wewnątrz dialogu`);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert(await opener.evaluate((el) => el === document.activeElement), `${label}: focus wraca do miniatury po Escape`);
  await opener.click();
  await dialog.waitFor({ state: 'visible' });
  await dialog.locator('.dialog-close').click();
  await dialog.waitFor({ state: 'hidden' });
  assert(await opener.evaluate((el) => el === document.activeElement), `${label}: focus wraca po przycisku zamknięcia`);
  report.interactions.push({ label, test: 'gallery Enter / image / Escape / close / focus return', passed: true });
}

async function testContactChannels(page, route, label) {
  const channels = page.locator('.contact-channels');
  assert.equal(await channels.count(), 1, `${label}: jeden blok komunikatorów`);
  assert.deepEqual(await channels.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), [confirmed.whatsapp, confirmed.messenger], `${label}: bezpośrednie, zatwierdzone linki WhatsApp i Messenger`);
  for (const [href, name] of [[confirmed.whatsapp, 'WhatsApp'], [confirmed.messenger, 'Messenger']]) {
    const link = channels.locator(`a[href="${href}"]`);
    assert.equal(await page.locator(`a[href="${href}"]`).count(), 1, `${label}: kanał ${name} bez powtórzeń`);
    assert.match(await link.innerText(), new RegExp(name), `${label}: czytelna nazwa ${name}`);
    assert(/(?:^|\s)noopener(?:\s|$)/.test(await link.getAttribute('rel') || ''), `${label}: bezpieczny link ${name}`);
    const box = await link.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, `${label}: dostępny obszar ${name}`);
  }
  assert.equal(await page.locator('main .contact-section').count(), route === '/kontakt/' ? 0 : 1, `${label}: pas kontaktowy bez powtórzenia na Kontakcie`);
  if (route === '/kontakt/') {
    const base = page.locator('section#baza');
    assert.equal(await base.count(), 1, `${label}: jednoznaczna sekcja bazy`);
    assert((await base.locator('address').innerText()).replace(/\s+/g, ' ').trim() === confirmed.address, `${label}: pełny zatwierdzony adres`);
    for (const href of [confirmed.facebook, confirmed.map]) assert.equal(await page.locator(`main a[href="${href}"]`).count(), 1, `${label}: zatwierdzony link ${href}`);
    const frame = base.locator('iframe');
    assert.equal(await frame.count(), 1, `${label}: jedna mapa`);
    assert.equal(await frame.getAttribute('src'), confirmed.mapEmbed, `${label}: potwierdzony identyfikator osadzonej lokalizacji`);
    assert.equal(await frame.getAttribute('loading'), 'lazy', `${label}: mapa ładowana leniwie`);
    assert((await frame.getAttribute('title') || '').length >= 10, `${label}: opisowy tytuł mapy`);
  }
}

async function testServiceChoices(page, label) {
  const choices = page.locator('main .choices > a.choice');
  assert.equal(await choices.count(), 2, `${label}: dwa przyciski wyboru usługi`);
  assert.deepEqual(await choices.evaluateAll((links) => links.map((link) => link.getAttribute('href'))), ['/pomoc-drogowa/', '/transport-pojazdow/'], `${label}: rzeczywiste ścieżki obu usług`);
  const styles = await choices.evaluateAll((links) => links.map((link) => {
    const style = getComputedStyle(link);
    return Object.fromEntries(['backgroundColor', 'color', 'height', 'minHeight', 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'fontSize', 'fontWeight', 'paddingTop', 'paddingBottom'].map((property) => [property, style[property]]));
  }));
  assert.deepEqual(styles[0], styles[1], `${label}: identyczny wygląd równorzędnych przycisków usług`);
  assert.notEqual(styles[0].backgroundColor, styles[0].color, `${label}: czytelne przyciski usług`);
  const interactionStyles = [];
  for (let index = 0; index < 2; index++) {
    const choice = choices.nth(index);
    await choice.hover();
    await choice.focus();
    interactionStyles.push(await choice.evaluate((link) => {
      const style = getComputedStyle(link);
      return Object.fromEntries(['backgroundColor', 'color', 'outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset', 'boxShadow', 'translate'].map((property) => [property, style[property]]));
    }));
  }
  assert.deepEqual(interactionStyles[0], interactionStyles[1], `${label}: spójne hover i focus usług`);
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); scrollTo(0, 0); });
}

try {
  if (screenshotsOnly) {
    const browser = await getScreenshotBrowser();
    const captures = [];
    for (const width of [390, 1440]) for (const route of routes) {
      captures.push(...await captureScreenshots(browser, route, width));
      console.log(`CAPTURE ${width}px ${route}`);
    }
    report.screenshots = captures;
    report.captureMethod = captureMethod;
    report.captureVerifiedAt = new Date().toISOString();
    delete report.captureErrors;
  } else {
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const executablePath = name === 'webkit' ? process.env.WEBKIT_EXECUTABLE_PATH : undefined;
    const browser = await engine.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    browsers.push(browser);
    report.browsers.push({ name, version: browser.version() });
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, locale: 'pl-PL', deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (entry) => { if (entry.type() === 'error') runtimeErrors.push(entry.text()); });
      for (const route of routes) {
        const label = `${name} ${width}px ${route}`;
        runtimeErrors.length = 0;
        const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200, `${label}: status 200`);
        await waitForAppReady(page);
        await settleImages(page);
        const metrics = await page.evaluate(() => ({
          viewport: innerWidth,
          width: document.documentElement.scrollWidth,
          brokenImages: [...document.images].filter((img) => img.getAttribute('src') || img.currentSrc).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
          h1: document.querySelectorAll('h1').length,
          phones: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')),
          activeMenu: [...document.querySelectorAll('#site-navigation a[aria-current="page"]')].map((a) => a.getAttribute('href')),
          duplicateIds: [...document.querySelectorAll('[id]')].map((element) => element.id).filter((id, index, ids) => ids.indexOf(id) !== index),
          footerText: (document.querySelector('footer')?.innerText || '').replace(/\s+/g, ' '),
          mainText: (document.querySelector('main')?.innerText || '').replace(/\s+/g, ' '),
          homeSectionClasses: [...document.querySelectorAll('main > section')].map((section) => [...section.classList]),
          retiredHomeBlocks: document.querySelectorAll('.divider-strip, .step-grid, .gallery-open, #gallery-dialog').length,
        }));
        assert(metrics.width <= metrics.viewport + 1, `${label}: poziomy overflow ${metrics.width}/${metrics.viewport}`);
        assert.deepEqual(metrics.brokenImages, [], `${label}: załadowane obrazy`);
        assert.equal(metrics.h1, 1, `${label}: jeden H1`);
        assert(metrics.phones.length > 0 && metrics.phones.every((href) => href === 'tel:+48880887092'), `${label}: telefon`);
        assert.deepEqual(metrics.activeMenu, route === '/' ? [] : [route], `${label}: aktywne menu`);
        assert.deepEqual(metrics.duplicateIds, [], `${label}: brak duplikatów ID`);
        assert(metrics.footerText.includes(confirmed.companyName), `${label}: pełna nazwa przedsiębiorcy w stopce`);
        if (route === '/kontakt/' || route === '/o-firmie/') assert(metrics.mainText.includes(confirmed.companyName), `${label}: nazwa firmy w treści`);
        if (route === '/') {
          assert.deepEqual(metrics.homeSectionClasses.map((classes) => homeSections.find((name) => classes.includes(name))), homeSections, `${label}: dokładnie pięć sekcji w zatwierdzonej kolejności`);
          assert.equal(metrics.retiredHomeBlocks, 0, `${label}: brak powtarzalnych sekcji i galerii na głównej`);
          assert.equal((await page.locator('h1').innerText()).replace(/\s+/g, ' '), 'Pomoc drogowa 24/7 – holowanie i transport pojazdów', `${label}: zachowany dokładny H1`);
        }
        await testContactChannels(page, route, label);
        if (route === '/' || route === '/o-firmie/') await testServiceChoices(page, label);
        await testMenu(page, label);
        if (route === '/realizacje/' && [390, 1440].includes(width)) await testGallery(page, label);
        if (width < 768) {
          const sticky = page.locator('.mobile-cta');
          assert(await sticky.isVisible(), `${label}: mobile sticky telefon`);
          assert.equal(await sticky.getAttribute('href'), 'tel:+48880887092');
          const box = await sticky.boundingBox();
          assert(box.height >= 44 && box.y + box.height <= 846, `${label}: dostępny obszar sticky CTA`);
          await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
          const hiddenFooterLinks = await page.locator('footer a').evaluateAll((links) => links.filter((a) => {
            const r = a.getBoundingClientRect();
            const call = document.querySelector('.mobile-cta')?.getBoundingClientRect();
            return call && r.bottom > call.top && r.top < call.bottom;
          }).map((a) => a.textContent.trim()));
          assert.deepEqual(hiddenFooterLinks, [], `${label}: sticky nie zasłania końca stopki`);
          await page.evaluate(() => scrollTo(0, 0));
        }
        let accessibility = null;
        if ([390, 1440].includes(width)) {
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
          accessibility = { violations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map((n) => n.target) })), incomplete: axe.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })) };
          assert.deepEqual(accessibility.violations, [], `${label}: axe WCAG A/AA: ${JSON.stringify(accessibility.violations)}`);
        }
        assert.deepEqual(runtimeErrors, [], `${label}: błędy konsoli/JS`);
        if (name === 'chromium' && [390, 1440].includes(width)) {
          report.screenshots.push(...await captureScreenshots(await getScreenshotBrowser(), route, width));
        }
        report.pages.push({ browser: name, width, route, status: response.status(), overflow: false, images: 'loaded', duplicateIds: [], contactChannels: 'phone + confirmed WhatsApp + Messenger', companyData: 'confirmed full name and address', homeSections: route === '/' ? homeSections : null, consoleErrors: [], accessibility });
        console.log(`PASS ${label}`);
      }
      await context.close();
    }
  }
  const response = await fetch(`${origin}/nieistniejaca-strona/`);
  assert.equal(response.status, 404, 'Brak SPA fallback, nieistniejąca strona ma 404');
  report.interactions.push({ test: 'nonexistent URL returns HTTP 404', passed: true });
  report.passed = true;
  report.captureMethod = captureMethod;
  report.captureVerifiedAt = new Date().toISOString();
  }
} catch (error) {
  if (screenshotsOnly) report.captureErrors = [error.stack || String(error)];
  else {
    report.passed = false;
    report.errors.push(error.stack || String(error));
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  for (const browser of browsers) await browser.close();
  await new Promise((done) => server.close(done));
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(`Raport: docs/qa-browser.json; ${report.pages.length} ${screenshotsOnly ? 'zachowanych wyników wcześniejszych testów' : 'sprawdzonych kombinacji'}, ${report.screenshots.length} screenshotów.`);
