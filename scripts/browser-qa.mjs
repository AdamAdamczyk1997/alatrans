import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, extname, relative } from 'node:path';
import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {
  responsiveWidths,
  captureWidths,
  captureRoutes,
  textScenarios,
  nativeFontScenarios,
  textScaleMethods,
  nextLayoutFrame,
  markJavaScriptDisabled,
  installNativeFontPreference,
  applyTextMode,
  assertRenderedTextScale,
  assertLayoutGeometry,
  assertPhoneAndFooter,
  assertControlInViewport,
} from './responsive-qa.mjs';

const dist = resolve('dist');
const routes = ['/', '/pomoc-drogowa/', '/transport-pojazdow/', '/realizacje/', '/o-firmie/', '/kontakt/'];
const widths = responsiveWidths;
const confirmed = {
  companyName: 'AlaTrans – P.P.H.U. Artur Adamczyk',
  whatsapp: 'https://wa.me/48880887092',
  messenger: 'https://m.me/61574526132487',
  facebook: 'https://www.facebook.com/61574526132487/',
  map: 'https://maps.app.goo.gl/wpTjFzKYmChzWnn86',
  mapEmbed: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s11387420831993348612',
  address: 'Łącko 984, 33-390 Łącko',
};
const homeSections = ['hero', 'contact-section'];
// Independent acceptance contract; production order and descriptions live in realizacje.ts.
const newGalleryIds = [
  'laweta-czarny-samochod-na-parkingu',
  'laweta-niebieski-motocykl-na-platformie',
  'laweta-bialy-samochod-w-zimie-przod',
  'laweta-szary-minivan-na-platformie',
  'laweta-niebieskie-kombi-na-platformie',
  'laweta-przy-przyczepie-kempingowej-na-placu',
  'laweta-ciemne-auto-przy-zabudowaniach',
  'laweta-szary-suv-na-platformie',
  'laweta-ciemny-sedan-na-placu',
  'laweta-przy-przyczepie-kempingowej-pobocze-ujecie-2',
  'laweta-bialy-samochod-w-zimie-tyl',
];
const galleryIds = [...newGalleryIds, 'laweta_car_1', 'laweta_car_3', 'laweta_car_4', 'laweta_car_5', 'laweta_car_7'];
const portraitGalleryIds = [
  'laweta-szary-suv-na-platformie',
  'laweta-przy-przyczepie-kempingowej-pobocze-ujecie-2',
  'laweta-bialy-samochod-w-zimie-tyl',
];
const verifiedGalleryAssetUrls = new Set();
// Keep generated QA evidence separate from historical documentation by default.
const outputDirectory = process.env.QA_OUTPUT_DIR ? resolve(process.env.QA_OUTPUT_DIR) : resolve('.artifacts/qa');
const artifactPath = (directory, filename) => relative(process.cwd(), join(directory, filename));
const screenshots = join(outputDirectory, 'screenshots');
const responsiveDirectory = join(outputDirectory, 'responsive');
const afterScreenshots = resolve(responsiveDirectory, 'screenshots/after');
const screenshotsOnly = process.argv.includes('--screenshots-only');
const continueOnFailure = process.env.QA_CONTINUE_ON_FAILURE === 'true';
const reportPath = join(outputDirectory, 'qa-browser.json');
if (screenshotsOnly) assert(existsSync(reportPath), 'Tryb screenshots-only wymaga wcześniejszego raportu pełnych testów.');
mkdirSync(screenshots, { recursive: true });
mkdirSync(afterScreenshots, { recursive: true });
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
  testContract: 'AlaTrans 2.0 — rozbudowa Realizacji: 168 smoke, powiększenie tekstu, landscape; 16 zdjęć, pionowe kadry i fallback bez JS; zachowane kontrole UX/UI i dane firmy',
  matrix: { routes, widths, engines: ['chromium', 'webkit'], expectedSmokeCases: 168 },
  textScaleMethods,
  browserContext: { locale: 'pl-PL', reducedMotion: 'reduce', deviceScaleFactor: 1 },
  target: 'lokalny build dist, serwer statyczny z rzeczywistym statusem 404',
  limitations: ['WebKit Playwright nie zastępuje Safari na fizycznym iPhonie.', 'Nie wykonuje połączeń ani nie wysyła wiadomości WhatsApp i Messenger. Bezpośredni URL Messengera i fallback Facebook są sprawdzane lokalnie; rozpoczęcie rozmowy i zachowanie po zalogowaniu wymagają ręcznego potwierdzenia. Osobny raport MESSENGER.md dokumentuje przekierowania Meta.', 'Nie potwierdza nagłówków i routingu rzeczywistego Deploy Preview Netlify.', 'Pełne screenshoty celowo ukrywają przypięty pasek telefonu, aby nie zasłaniał treści w długim obrazie. Osobne screenshoty viewport 390 px oraz menu/modal pokazują naturalny układ; testy interakcji i stopki zachowują widoczny pasek.'],
  browsers: [],
  pages: [],
  textAndOrientation: [],
  withoutJavaScript: [],
  interactions: [],
  screenshots: [],
  responsiveScreenshots: [],
  mapRenders: [],
  galleryAssets: [],
  galleryAssetVerificationMethod: 'Jawne żądania HTTP testu do lightboxów i wariantów miniatur; ich suma nie jest początkowym transferem strony.',
  failurePolicy: continueOnFailure ? 'Run all functional cases; any failed assertion still fails the full run.' : 'Fail on the first failed assertion.',
  attemptedCases: 0,
  caseFailures: [],
  errors: [],
};
const browsers = [];
const pendingScreenshots = [];
const captureMethod = 'Osobny proces WebKit Playwright i świeży kontekst każdej fotografowanej strony, bez testów fokusu i axe. Kontakt przewijany do rzeczywistej lazy mapy; capture czeka na DOM Google, komplet widocznych kafelków z potwierdzonym miejscem, zakończenie przejścia ze statycznego podglądu oraz fonty i malowanie — bez networkidle Google. Obrazy eager wyłącznie w kontekście capture, decode + fonty + dwa RAF + stabilizacja. Najpierw viewport, potem full-page. Full-page ukrywa wyłącznie pasek mobile-cta; viewport zachowuje naturalny fixed. WebKit omija zaobserwowany artefakt rasteryzacji hero w pełnych zrzutach Chromium.';
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

async function settleImagesWithoutJavaScript(page) {
  // With javaScriptEnabled:false, evaluate may read/scroll synchronously but its timers
  // and rAF callbacks never run. Trigger lazy loading and poll readiness from Node.
  for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight);) {
    await page.evaluate((position) => scrollTo(0, position), y);
    await new Promise((done) => setTimeout(done, 25));
    y += await page.evaluate(() => Math.max(250, innerHeight - 100));
  }
  await page.evaluate(() => scrollTo(0, 0));
  const deadline = Date.now() + 15000;
  while (true) {
    const ready = await page.evaluate(() =>
      document.fonts.status === 'loaded' &&
      [...document.images]
        .filter((img) => img.getAttribute('src') || img.currentSrc)
        .every((img) => img.complete && img.naturalWidth > 0),
    );
    if (ready) break;
    assert(Date.now() < deadline, 'No-JS: source images and fonts ready within 15 seconds');
    await new Promise((done) => setTimeout(done, 100));
  }
  await nextLayoutFrame(page);
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
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await captureScreenshotAttempt(browser, route, width);
    } catch (error) {
      // Retry only a transport failure of the real third-party map. Keep every
      // screenshot/map assertion, and fail normally if three attempts fail.
      const networkFailure = /Network is unreachable|Could not connect to www\.google\.com|ERR_(?:NETWORK|CONNECTION|INTERNET|NAME_NOT_RESOLVED)/i.test(String(error));
      if (route !== '/kontakt/' || !networkFailure || attempt === 3) throw error;
      report.externalCaptureRetries ??= [];
      report.externalCaptureRetries.push({ route, width, attempt, error: String(error) });
      console.warn(`RETRY Google map network ${width}px: attempt ${attempt} failed`);
    }
  }
}

async function captureScreenshotAttempt(browser, route, width) {
  const context = await browser.newContext({
    viewport: standardViewport(width),
    locale: 'pl-PL',
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  context.setDefaultTimeout(15000);
  context.setDefaultNavigationTimeout(30000);
  const legacy = [];
  const responsive = [];
  const legacyWidth = [390, 1440].includes(width);
  const afterWidth = captureWidths.includes(width) && captureRoutes.includes(route);
  try {
    const page = await context.newPage();
    // Preserve existing mobile viewport artifacts independently of layout breakpoints.
    if (width === 390) await page.setViewportSize({ width, height: 844 });
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200, `Screenshot ${route}: status 200`);
    await waitForAppReady(page);
    await page.evaluate(() => {
      for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() => [...document.images]
      .filter((image) => image.getAttribute('src') || image.currentSrc)
      .every((image) => image.complete), null, { timeout: 15000 });
    if (route === '/kontakt/') {
      await waitForMapPaint(page);
      if (!screenshotsOnly) report.mapRenders.push({ engine: 'webkit', width, route, realTiles: true });
    }
    await stabilizePaint(page, 200);
    const slug = route === '/' ? 'glowna' : route.split('/').filter(Boolean)[0];
    const viewportFile = legacyWidth
      ? route === '/' ? `glowna-hero-${width}.png` : width === 390 ? `${slug}-viewport-${width}.png` : null
      : null;
    await page.screenshot({
      ...(viewportFile ? { path: join(screenshots, viewportFile) } : {}),
      fullPage: false,
    });
    if (viewportFile) legacy.push(artifactPath(screenshots, viewportFile));
    await stabilizePaint(page);
    // Hide only the fixed call bar in long captures; viewport artifacts retain it.
    const buffer = await page.screenshot({
      fullPage: true,
      style: '.mobile-cta { visibility: hidden !important; }',
    });
    const filename = `${slug}-${width}.png`;
    if (legacyWidth) {
      writeFileSync(join(screenshots, filename), buffer);
      legacy.push(artifactPath(screenshots, filename));
    }
    if (afterWidth) {
      writeFileSync(join(afterScreenshots, filename), buffer);
      responsive.push(artifactPath(afterScreenshots, filename));
    }
    return { legacy, responsive };
  } finally {
    await context.close();
  }
}

async function captureInteraction(page, filename) {
  await nextLayoutFrame(page);
  await page.screenshot({ path: join(afterScreenshots, filename), fullPage: false });
  report.responsiveScreenshots.push(artifactPath(afterScreenshots, filename));
}

async function testMenu(page, label, onOpen = null) {
  const menu = page.locator('button.menu-button');
  if (!(await menu.isVisible())) return;
  await menu.focus();
  await assertControlInViewport(menu, page, `${label}: menu button`);
  await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true', `${label}: menu otwarte klawiaturą`);
  const nav = page.locator('#site-navigation');
  assert.equal(await nav.locator('a:visible').count(), 5, `${label}: pięć widocznych pozycji menu`);
  await assertRenderedTextScale(page, `${label}: open menu`);
  await assertLayoutGeometry(page, `${label}: open menu`);
  const sticky = page.locator('.mobile-cta');
  if (await sticky.isVisible()) {
    await assertControlInViewport(sticky, page, `${label}: call bar with menu open`);
  } else {
    await assertControlInViewport(page.locator('.top-call'), page, `${label}: phone with menu open`);
  }
  if (onOpen) await onOpen();
  // A vertically scrollable menu may reveal its links one by one on a short screen.
  for (const link of await nav.locator('a').all()) {
    await link.focus();
    await link.scrollIntoViewIfNeeded();
    await assertControlInViewport(link, page, `${label}: menu item`);
  }
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false', `${label}: Escape zamyka menu`);
  assert(await menu.evaluate((element) => element === document.activeElement), `${label}: focus wraca do menu`);
  await menu.click();
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false', `${label}: ponowne kliknięcie zamyka menu`);
  await page.evaluate(() => scrollTo(0, 0));
  report.interactions.push({ label, test: 'menu Enter / all links reachable / Escape / focus / click / phone', passed: true });
}

async function testGallery(page, label, onOpen = null) {
  for (const [id, key] of [[galleryIds[0], 'Enter'], [portraitGalleryIds[0], 'Space']]) {
    const opener = page.locator(`.gallery-open[data-photo-id="${id}"]`);
    const caseLabel = `${label}: ${id}`;
    assert.equal(await opener.count(), 1, `${caseLabel}: przycisk powiększenia zdjęcia`);
    const expected = await opener.evaluate((element) => ({
      src: element.dataset.src,
      alt: element.dataset.alt,
      width: Number(element.dataset.width),
      height: Number(element.dataset.height),
    }));
    await opener.focus();
    await page.keyboard.press(key);
    const dialog = page.locator('dialog#gallery-dialog');
    await dialog.waitFor({ state: 'visible' });
    assert(await dialog.evaluate((element) => element.open), `${caseLabel}: otwarty dialog`);
    const image = dialog.locator('img');
    await image.evaluate((element) => element.decode());
    await assertRenderedTextScale(page, `${caseLabel}: open gallery`);
    assert.equal(await image.getAttribute('alt'), expected.alt, `${caseLabel}: opis powiększenia zgodny z aktywowanym kafelkiem`);
    assert.equal(await image.getAttribute('src'), expected.src, `${caseLabel}: właściwy URL powiększenia`);
    const dimensions = await image.evaluate((element) => ({
      width: element.naturalWidth,
      height: element.naturalHeight,
      widthAttribute: Number(element.getAttribute('width')),
      heightAttribute: Number(element.getAttribute('height')),
      objectFit: getComputedStyle(element).objectFit,
    }));
    assert.deepEqual({ width: dimensions.width, height: dimensions.height }, { width: expected.width, height: expected.height }, `${caseLabel}: fizyczne wymiary zasobu zgodne z rejestrem lightboxa`);
    assert.deepEqual({ width: dimensions.widthAttribute, height: dimensions.heightAttribute }, { width: expected.width, height: expected.height }, `${caseLabel}: dialog korzysta z wymiarów zasobu, nie przyciętej miniatury`);
    assert(Math.max(dimensions.width, dimensions.height) <= 1600, `${caseLabel}: dłuższy bok lightboxa <= 1600 px`);
    assert.equal(dimensions.objectFit, 'contain', `${caseLabel}: cały kadr w lightboxie`);
    if (portraitGalleryIds.includes(id)) assert(dimensions.height > dimensions.width, `${caseLabel}: zachowany pionowy kadr`);
    assert(await page.locator('body').evaluate((element) => element.classList.contains('dialog-open') && getComputedStyle(element).overflow === 'hidden'), `${caseLabel}: przewijanie tła zablokowane tylko dla otwartego dialogu`);
    assert(await dialog.evaluate((element) => element.contains(document.activeElement)), `${caseLabel}: focus w dialogu`);
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize();
    assert(box && box.x >= -1 && box.y >= -1 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1, `${caseLabel}: modal fits actual viewport`);
    await assertLayoutGeometry(page, `${caseLabel}: open gallery`, { dialogOnly: true });
    await assertControlInViewport(dialog.locator('.dialog-close'), page, `${caseLabel}: modal close button`);
    if (onOpen && id === galleryIds[0]) await onOpen();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert(await opener.evaluate((element) => element === document.activeElement), `${caseLabel}: focus po Escape wraca do miniatury`);
    // Native close removes [open] before dispatching the queued close event.
    // Wait for the page's cleanup handler, then assert the unchanged postcondition.
    await page.waitForFunction(() => !document.body.classList.contains('dialog-open') && getComputedStyle(document.body).overflow !== 'hidden', null, { timeout: 1500 });
    assert(await page.locator('body').evaluate((element) => !element.classList.contains('dialog-open') && getComputedStyle(element).overflow !== 'hidden'), `${caseLabel}: Escape odblokowuje przewijanie strony`);
    await opener.click();
    await dialog.waitFor({ state: 'visible' });
    await dialog.locator('.dialog-close').click();
    await dialog.waitFor({ state: 'hidden' });
    assert(await opener.evaluate((element) => element === document.activeElement), `${caseLabel}: focus po zamknięciu wraca do miniatury`);
    await page.waitForFunction(() => !document.body.classList.contains('dialog-open') && getComputedStyle(document.body).overflow !== 'hidden', null, { timeout: 1500 });
    assert(await page.locator('body').evaluate((element) => !element.classList.contains('dialog-open') && getComputedStyle(element).overflow !== 'hidden'), `${caseLabel}: zamknięcie odblokowuje przewijanie strony`);
    report.interactions.push({ label: caseLabel, test: `gallery ${key} / source dimensions / contain / close reachability / Escape / close / focus return / scroll unlock`, passed: true });
  }
  await page.evaluate(() => scrollTo(0, 0));
}

async function testGalleryAssets(page, label) {
  const entries = await page.locator('.gallery-open').evaluateAll((buttons) => buttons.map((button) => {
    const image = button.querySelector('img');
    return {
      id: button.dataset.photoId,
      src: button.dataset.src,
      alt: button.dataset.alt,
      width: Number(button.dataset.width),
      height: Number(button.dataset.height),
      image: image ? {
        src: image.getAttribute('src'),
        srcset: image.getAttribute('srcset'),
        sizes: image.getAttribute('sizes'),
        alt: image.alt,
        loading: image.getAttribute('loading'),
        fetchpriority: image.getAttribute('fetchpriority'),
        decoding: image.decoding,
        objectFit: getComputedStyle(image).objectFit,
      } : null,
    };
  }));
  assert.deepEqual(entries.map((entry) => entry.id), galleryIds, `${label}: 11 nowych zdjęć i pięć dotychczasowych w zatwierdzonej kolejności`);
  for (const [index, entry] of entries.entries()) {
    assert(entry.image?.src && entry.image.srcset && entry.image.sizes, `${label}: ${entry.id}: responsywne źródła miniatury`);
    assert(entry.alt?.length > 20 && entry.image.alt === entry.alt, `${label}: ${entry.id}: opisowe i zgodne alty`);
    assert.equal(entry.image.decoding, 'async', `${label}: ${entry.id}: dekodowanie asynchroniczne`);
    assert(entry.width > 0 && entry.height > 0 && Math.max(entry.width, entry.height) <= 1600, `${label}: ${entry.id}: rzeczywiste wymiary lightboxa z limitem 1600 px`);
    if (index === 0) assert.notEqual(entry.image.loading, 'lazy', `${label}: pierwszy kadr bez lazy loading`);
    else {
      assert.equal(entry.image.loading, 'lazy', `${label}: ${entry.id}: miniatura ładowana leniwie`);
      assert.notEqual(entry.image.fetchpriority, 'high', `${label}: ${entry.id}: brak niepotrzebnego wysokiego priorytetu`);
    }
    if (portraitGalleryIds.includes(entry.id)) {
      assert(entry.height > entry.width, `${label}: ${entry.id}: zachowana orientacja pionowa`);
      assert.equal(entry.image.objectFit, 'contain', `${label}: ${entry.id}: cały pionowy kadr w miniaturze`);
    }
    const assets = [entry.src, entry.image.src, ...entry.image.srcset.split(',').map((candidate) => candidate.trim().split(/\s+/)[0])];
    for (const value of assets) {
      const url = new URL(value, origin);
      assert.equal(url.origin, origin, `${label}: ${entry.id}: lokalny zasób`);
      assert.match(url.pathname, /^\/_astro\/.+\.webp$/, `${label}: ${entry.id}: zoptymalizowany URL Astro`);
      if (verifiedGalleryAssetUrls.has(url.href)) continue;
      const response = await page.request.get(url.href);
      try {
        assert.equal(response.status(), 200, `${label}: HTTP 200 ${url.pathname}`);
        assert.match(response.headers()['content-type'] || '', /^image\/webp(?:;|$)/i, `${label}: rzeczywisty typ obrazu ${url.pathname}`);
        const bytes = await response.body();
        assert(bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP', `${label}: poprawny zasób WebP ${url.pathname}`);
        verifiedGalleryAssetUrls.add(url.href);
        report.galleryAssets.push({ url: url.pathname, status: response.status(), type: 'image/webp', bytes: bytes.length });
      } finally {
        await response.dispose();
      }
    }
  }
  return entries;
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
    const contrast = await link.evaluate((element) => {
      const rgb = (value) => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const luminance = (color) => rgb(color).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
      const ratio = (first, second) => {
        const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
        return (values[0] + 0.05) / (values[1] + 0.05);
      };
      const style = getComputedStyle(element);
      const icon = getComputedStyle(element.querySelector('.channel-icon'));
      const iconBackground = icon.backgroundColor === 'rgba(0, 0, 0, 0)' ? style.backgroundColor : icon.backgroundColor;
      return { text: ratio(style.color, style.backgroundColor), icon: ratio(icon.color, iconBackground), textColor: rgb(style.color), iconColor: rgb(icon.color), background: rgb(style.backgroundColor) };
    });
    assert(contrast.text >= 4.5, `${label}: ${name} kontrast napisu AA >= 4.5:1 (${contrast.text})`);
    assert(contrast.icon >= 3, `${label}: ${name} kontrast ikony >= 3:1 (${contrast.icon})`);
    assert(contrast.textColor.every((channel) => channel === 255) && contrast.background.every((channel) => channel < 100), `${label}: ${name} biały napis na grafitowym przycisku`);
    const [red, green, blue] = contrast.iconColor;
    assert(name === 'WhatsApp' ? green > red && green > blue : blue > red && blue > green, `${label}: ${name} rozpoznawalny kolor ikony`);
  }
  const fallback = page.locator('main a.messenger-fallback');
  assert.equal(await fallback.count(), 1, `${label}: jeden fallback Messengera bez dublowania`);
  assert.equal(await fallback.getAttribute('href'), confirmed.facebook, `${label}: fallback prowadzi do potwierdzonego profilu Facebooka`);
  assert.match(await fallback.innerText(), /profilu firmy na Facebooku/, `${label}: jasna etykieta fallbacku`);
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

async function testApprovedRefinements(page, route, label) {
  const brand = page.locator('a.brand');
  assert.equal(await brand.count(), 1, `${label}: jeden brand block`);
  assert.equal(await brand.getAttribute('href'), '/', `${label}: marka prowadzi na stronę główną`);
  assert.equal(await brand.getAttribute('aria-label'), 'AlaTrans — strona główna', `${label}: dostępna nazwa marki`);
  assert.equal(await brand.locator('img').count(), 1, `${label}: zachowane pojedyncze oryginalne logo`);
  await page.keyboard.press('Tab');
  await brand.focus();
  assert(await brand.evaluate((element) => {
    const style = getComputedStyle(element);
    return element.matches(':focus-visible') && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2;
  }), `${label}: widoczny fokus klawiatury marki`);
  const kickers = {
    '/pomoc-drogowa/': 'Pomoc na drodze · 24/7',
    '/transport-pojazdow/': 'Transport krajowy i zagraniczny',
    '/realizacje/': 'Nasza laweta i przewozy',
    '/o-firmie/': 'Poznaj AlaTrans',
    '/kontakt/': 'Kontakt z AlaTrans',
  };
  if (kickers[route]) {
    const kicker = page.locator('.page-intro .section-kicker');
    assert.equal(await kicker.count(), 1, `${label}: spójna etykieta nad H1`);
    assert.equal((await kicker.innerText()).toLocaleLowerCase('pl'), kickers[route].toLocaleLowerCase('pl'), `${label}: zatwierdzony kicker`);
    assert(await kicker.evaluate((element) => element.tagName === 'P' && element.compareDocumentPosition(document.querySelector('h1')) & Node.DOCUMENT_POSITION_FOLLOWING), `${label}: etykieta jest akapitem przed H1`);
  }
  if (route === '/') {
    assert.equal((await page.locator('.hero .lead').innerText()).replace(/\s+/g, ' '), 'Zapewniamy całodobową pomoc drogową, holowanie oraz transport pojazdów. Szybki kontakt, indywidualna wycena i realna pomoc wtedy, gdy naprawdę jej potrzebujesz.', `${label}: dokładny zaakceptowany lead`);
  }
  if (route === '/transport-pojazdow/') assert.equal(await page.locator('h1').innerText(), 'Transport pojazdów — w Polsce i za granicą', `${label}: zaakceptowany H1 transportu`);
  if (route === '/realizacje/') {
    assert.equal(await page.locator('.gallery-item figcaption:visible').count(), 0, `${label}: brak widocznych podpisów miniatur`);
    assert.equal(await page.locator('.page-intro .back-link').count(), 0, `${label}: brak breadcrumbu galerii`);
    assert.equal(await page.locator('.gallery-open').count(), galleryIds.length, `${label}: 11 nowych oraz 5 zachowanych zdjęć galerii`);
  }
  if (route !== '/kontakt/') {
    const call = page.locator('.contact-section .contact-call');
    assert.equal(await call.count(), 1, `${label}: jedno główne CTA w kontakcie`);
    assert.equal((await call.innerText()).trim(), 'Zadzwoń teraz', `${label}: zaakceptowana etykieta CTA`);
    assert.equal(await call.getAttribute('href'), 'tel:+48880887092', `${label}: poprawny numer CTA`);
    assert(!(await page.locator('.contact-section').innerText()).includes('880 887 092'), `${label}: brak dekoracyjnego numeru w pasie kontaktowym`);
  }
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); scrollTo(0, 0); });
}

async function testServiceChoices(page, label, enlargedText = false) {
  const choices = page.locator('main .choices > a.choice');
  assert.equal(await choices.count(), 2, `${label}: dwa przyciski wyboru usługi`);
  assert.deepEqual(await choices.evaluateAll((links) => links.map((link) => link.getAttribute('href'))), ['/pomoc-drogowa/', '/transport-pojazdow/'], `${label}: rzeczywiste ścieżki obu usług`);
  const styles = await choices.evaluateAll((links, largeText) => links.map((link) => {
    const style = getComputedStyle(link);
    const properties = ['backgroundColor', 'color', 'minHeight', 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'fontSize', 'fontWeight', 'paddingTop', 'paddingBottom'];
    // Preserve equal normal heights; enlarged labels may naturally wrap to different lines.
    if (!largeText) properties.push('height');
    return Object.fromEntries(properties.map((property) => [property, style[property]]));
  }), enlargedText);
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

async function auditAccessibility(page, label) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const accessibility = {
    violations: result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      nodes: violation.nodes.map((node) => node.target),
    })),
    incomplete: result.incomplete.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.length,
    })),
  };
  assert.deepEqual(accessibility.violations, [], `${label}: axe WCAG A/AA: ${JSON.stringify(accessibility.violations)}`);
  return accessibility;
}

function standardViewport(width) {
  return { width, height: width <= 430 ? 844 : 900 };
}

async function createContext(browser, viewport, javaScriptEnabled = true) {
  const context = await browser.newContext({
    viewport,
    locale: 'pl-PL',
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    javaScriptEnabled,
  });
  context.setDefaultTimeout(15000);
  context.setDefaultNavigationTimeout(30000);
  if (javaScriptEnabled) {
    await context.addInitScript(() => {
      window.__qaInitialCLS = null;
      if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        window.__qaInitialCLS = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__qaInitialCLS += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      }
    });
  }
  return context;
}

function monitorRuntime(page) {
  const errors = [];
  const safeMessage = (message) => message.replace(/([?&](?:key|token)=)[^&\s'"<>]+/gi, '$1[redacted]');
  page.on('pageerror', (error) => errors.push(safeMessage(error.message)));
  page.on('console', (entry) => {
    if (entry.type() === 'error') errors.push(safeMessage(entry.text()));
  });
  return errors;
}

async function verifyPage(page, route, browserName, scenario, runtimeErrors) {
  const label = `${browserName} ${scenario.id} ${scenario.width}×${scenario.height} ${route}`;
  runtimeErrors.length = 0;
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200, `${label}: status 200`);
  await waitForAppReady(page);
  const textScale = await applyTextMode(page, scenario.textMode);
  await settleImages(page);
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    brokenImages: [...document.images]
      .filter((image) => image.getAttribute('src') || image.currentSrc)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
    h1: document.querySelectorAll('h1').length,
    phones: [...document.querySelectorAll('a[href^="tel:"]')].map((link) => link.getAttribute('href')),
    activeMenu: [...document.querySelectorAll('#site-navigation a[aria-current="page"]')]
      .map((link) => link.getAttribute('href')),
    duplicateIds: [...document.querySelectorAll('[id]')]
      .map((element) => element.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index),
    footerText: (document.querySelector('footer')?.innerText || '').replace(/\s+/g, ' '),
    mainText: (document.querySelector('main')?.innerText || '').replace(/\s+/g, ' '),
    homeSectionClasses: [...document.querySelectorAll('main > section')]
      .map((section) => [...section.classList]),
    retiredHomeBlocks: document.querySelectorAll('.divider-strip, .step-grid, .home-services, .home-area, .home-about, .gallery-open, #gallery-dialog').length,
    initialCLS: window.__qaInitialCLS,
    imageWidths: [...document.images]
      .filter((image) => image.getAttribute('src'))
      .map((image) => ({
        alt: image.alt,
        renderedWidth: image.getBoundingClientRect().width,
        sizes: image.sizes,
        currentSrc: image.currentSrc,
      })),
  }));
  assert(metrics.width <= metrics.viewport + 1, `${label}: poziomy overflow ${metrics.width}/${metrics.viewport}`);
  assert.deepEqual(metrics.brokenImages, [], `${label}: załadowane obrazy`);
  assert.equal(metrics.h1, 1, `${label}: jeden H1`);
  assert(metrics.phones.length > 0 && metrics.phones.every((href) => href === 'tel:+48880887092'), `${label}: telefon`);
  assert.deepEqual(metrics.activeMenu, route === '/' ? [] : [route], `${label}: aktywne menu`);
  assert.deepEqual(metrics.duplicateIds, [], `${label}: brak duplikatów ID`);
  assert(metrics.footerText.includes(confirmed.companyName), `${label}: pełna nazwa firmy w stopce`);
  assert(!/Niem(?:cy|iec|czech)|cał(?:a|ą)\s+Europ|dowoln(?:y|ego)\s+kraj/i.test(metrics.mainText), `${label}: brak starego copy i niepotwierdzonych deklaracji zasięgu`);
  if (route === '/kontakt/' || route === '/o-firmie/') {
    assert(metrics.mainText.includes(confirmed.companyName), `${label}: nazwa firmy w treści`);
  }
  if (route === '/') {
    assert.deepEqual(
      metrics.homeSectionClasses.map((classes) => homeSections.find((name) => classes.includes(name))),
      homeSections,
      `${label}: dokładnie dwie zatwierdzone sekcje głównej`,
    );
    assert.equal(metrics.retiredHomeBlocks, 0, `${label}: brak usuniętych sekcji i galerii na głównej`);
    assert.equal(
      (await page.locator('h1').innerText()).replace(/\s+/g, ' '),
      'Pomoc drogowa 24/7 – holowanie i transport pojazdów',
      `${label}: dokładny zatwierdzony H1`,
    );
    const image = await page.locator('.hero-art img').evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
      objectFit: getComputedStyle(element).objectFit,
    }));
    const naturalRatio = image.naturalWidth / image.naturalHeight;
    assert(image.objectFit === 'contain' || Math.abs(image.width / image.height - naturalRatio) < 0.02, `${label}: szeroki hero bez ucięcia lub rozciągnięcia zdjęcia`);
  }
  if (scenario.id === 'smoke' && metrics.initialCLS !== null) {
    assert(metrics.initialCLS <= 0.1, `${label}: initial own-document CLS ${metrics.initialCLS}`);
  }

  const geometry = await assertLayoutGeometry(page, label);
  if (route === '/realizacje/') await testGalleryAssets(page, label);
  await testApprovedRefinements(page, route, label);
  await testContactChannels(page, route, label);
  if (route === '/' || route === '/o-firmie/') {
    await testServiceChoices(page, label, scenario.textMode !== 'normal');
  }
  const extraMenu = browserName === 'webkit' && route === '/' && scenario.id === 'root-font-200-mobile';
  await testMenu(page, label, extraMenu ? async () => {
    await captureInteraction(page, 'menu-root-font-200-390.png');
    report.stateAccessibility.push({
      label: `${label}: open menu`,
      accessibility: await auditAccessibility(page, `${label}: open menu`),
    });
  } : null);

  const detailed = scenario.id !== 'smoke' || [390, 1440].includes(scenario.width);
  if (route === '/realizacje/' && detailed) {
    const extraModal = browserName === 'webkit' && ['landscape-root-font-200', 'text-only-200-mobile'].includes(scenario.id);
    await testGallery(page, label, extraModal ? async () => {
      await captureInteraction(page, `galeria-${scenario.id}.png`);
      report.stateAccessibility.push({
        label: `${label}: open modal`,
        accessibility: await auditAccessibility(page, `${label}: open modal`),
      });
    } : null);
  }
  const phoneAndFooter = await assertPhoneAndFooter(page, label, {
    allowScrollingHeader: scenario.id.startsWith('landscape'),
  });
  const accessibility = detailed ? await auditAccessibility(page, label) : null;
  assert.deepEqual(runtimeErrors, [], `${label}: błędy konsoli/JS`);

  return {
    browser: browserName,
    scenario: scenario.id,
    width: scenario.width,
    height: scenario.height,
    route,
    status: response.status(),
    overflow: false,
    images: 'loaded',
    imageWidths: metrics.imageWidths,
    duplicateIds: [],
    contactChannels: 'phone + confirmed WhatsApp URL + existing Messenger URL + confirmed Facebook fallback; conversation not verified',
    companyData: 'confirmed full name and address',
    homeSections: route === '/' ? homeSections : null,
    initialOwnDocumentCLS: scenario.id === 'smoke' ? metrics.initialCLS : null,
    geometry,
    phoneAndFooter,
    textScale,
    consoleErrors: [],
    accessibility,
  };
}

function recordCaseFailure(label, error) {
  if (!continueOnFailure) throw error;
  report.caseFailures.push({ label, error: error.stack || String(error) });
  console.error(`FAIL ${label}: ${error.message || error}`);
}

async function runScenario(browser, browserName, scenario, output) {
  const context = await createContext(browser, { width: scenario.width, height: scenario.height });
  try {
    const page = await context.newPage();
    if (scenario.textMode === 'browser-default-font') await installNativeFontPreference(page);
    const errors = monitorRuntime(page);
    for (const route of routes) {
      report.attemptedCases++;
      try {
        const result = await verifyPage(page, route, browserName, scenario, errors);
        output.push(result);
        console.log(`PASS ${browserName} ${scenario.id} ${scenario.width}×${scenario.height} ${route}`);
        if (browserName === 'chromium' && scenario.id === 'smoke') {
          const legacy = [390, 1440].includes(scenario.width);
          const after = captureWidths.includes(scenario.width) && captureRoutes.includes(route);
          if (legacy || after) {
            pendingScreenshots.push({ route, width: scenario.width });
          }
        }
      } catch (error) {
        recordCaseFailure(`${browserName} ${scenario.id} ${scenario.width}×${scenario.height} ${route}`, error);
      }
    }
  } finally {
    await context.close();
  }
}

async function verifyWithoutJavaScript(browser, browserName) {
  const context = await createContext(browser, { width: 390, height: 844 }, false);
  try {
    const page = await context.newPage();
    markJavaScriptDisabled(page);
    for (const route of routes) {
      const label = `${browserName} no-JS 390×844 ${route}`;
      report.attemptedCases++;
      try {
        const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200, `${label}: status 200`);
        await settleImagesWithoutJavaScript(page);
        assert.equal(await page.locator('#site-navigation a:visible').count(), 5, `${label}: fallback menu has five real links`);
        for (const link of await page.locator('#site-navigation a').all()) {
          await link.focus();
          await link.scrollIntoViewIfNeeded();
          await assertControlInViewport(link, page, `${label}: no-JS navigation item`);
        }
        await page.evaluate(() => scrollTo(0, 0));
        const geometry = await assertLayoutGeometry(page, label);
        const phoneAndFooter = await assertPhoneAndFooter(page, label);
        if (route === '/realizacje/') {
          const entries = await testGalleryAssets(page, label);
          const fallbackLinks = await page.locator('noscript a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
          assert.equal(fallbackLinks.length, entries.length, `${label}: każde z 16 zdjęć ma link bez JS`);
          assert.deepEqual(fallbackLinks, entries.map((entry) => entry.src), `${label}: fallback prowadzi do rzeczywistych zasobów Astro używanych przez lightbox`);
        }
        report.withoutJavaScript.push({ browser: browserName, width: 390, height: 844, route, geometry, phoneAndFooter, passed: true });
        console.log(`PASS ${label}`);
      } catch (error) {
        recordCaseFailure(label, error);
      }
    }
  } finally {
    await context.close();
  }
}

try {
  if (screenshotsOnly) {
    const browser = await getScreenshotBrowser();
    const legacy = [];
    const responsive = [];
    for (const width of captureWidths) {
      const selectedRoutes = [390, 1440].includes(width) ? routes : captureRoutes;
      for (const route of selectedRoutes) {
        const files = await captureScreenshots(browser, route, width);
        legacy.push(...files.legacy);
        responsive.push(...files.responsive);
        console.log(`CAPTURE ${width}px ${route}`);
      }
    }
    report.screenshots = legacy;
    // Preserve previous menu/modal captures and all functional verification results.
    report.responsiveScreenshots = [
      ...responsive,
      ...(report.responsiveScreenshots || []).filter((file) => /menu-|galeria-/.test(file)),
    ];
    report.captureMethod = captureMethod;
    report.captureVerifiedAt = new Date().toISOString();
    delete report.captureErrors;
  } else {
    report.stateAccessibility = [];
    for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
      const executablePath = name === 'webkit' ? process.env.WEBKIT_EXECUTABLE_PATH : undefined;
      const browser = await engine.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
      browsers.push(browser);
      report.browsers.push({ name, version: browser.version() });
      for (const width of widths) {
        await runScenario(browser, name, {
          id: 'smoke',
          ...standardViewport(width),
          textMode: 'normal',
        }, report.pages);
      }
      const scenarios = [
        ...textScenarios,
        ...(name === 'chromium' ? nativeFontScenarios : []),
      ];
      for (const scenario of scenarios) {
        await runScenario(browser, name, scenario, report.textAndOrientation);
      }
      await verifyWithoutJavaScript(browser, name);
    }
    // Finish all functional cases before external map rendering can interrupt
    // the separate screenshot phase. Capture failures still fail the full run.
    for (const { route, width } of pendingScreenshots) {
      const files = await captureScreenshots(await getScreenshotBrowser(), route, width);
      report.screenshots.push(...files.legacy);
      report.responsiveScreenshots.push(...files.responsive);
      console.log(`CAPTURE ${width}px ${route}`);
    }
    assert.deepEqual(report.caseFailures, [], 'All functional cases must pass, including when collecting failures');
    assert.equal(report.attemptedCases, 264, 'All 264 functional cases were actually attempted');
    assert.equal(report.pages.length, 168, 'Full smoke matrix has 168 cases');
    assert.equal(report.textAndOrientation.length, 84, 'All text and landscape scenarios completed');
    assert.equal(report.withoutJavaScript.length, 12, 'All six no-JS pages completed in both engines');
    assert.equal(new Set(report.screenshots).size, 19, 'All 19 existing screenshot artifacts are retained');
    assert.equal(
      new Set(report.responsiveScreenshots.filter((file) => !/menu-|galeria-/.test(file))).size,
      24,
      'After captures include four pages at all six required widths',
    );
    assert.deepEqual(
      report.mapRenders.filter((render) => [390, 1440].includes(render.width)).map((render) => render.width).sort((a, b) => a - b),
      [390, 1440],
      'Real Google map rendering verified at 390 and 1440 CSS px',
    );
    const response = await fetch(`${origin}/nieistniejaca-strona/`);
    assert.equal(response.status, 404, 'Nonexistent URL returns real HTTP 404');
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
  if (!screenshotsOnly || report.matrix?.expectedSmokeCases === 168) {
    writeFileSync(join(responsiveDirectory, 'qa-responsive.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
}
console.log(`Raporty: ${relative(process.cwd(), reportPath)} i ${artifactPath(responsiveDirectory, 'qa-responsive.json')}; ${report.pages.length} smoke, ${(report.textAndOrientation || []).length} text/landscape, ${(report.withoutJavaScript || []).length} no-JS.`);
