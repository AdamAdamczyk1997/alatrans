import assert from 'node:assert/strict';

export const responsiveWidths = [
  320, 360, 375, 390, 412, 430, 600, 760, 768, 820, 1024, 1280, 1440, 1920,
];

export const captureWidths = [320, 390, 768, 1024, 1440, 1920];
export const captureRoutes = ['/', '/pomoc-drogowa/', '/transport-pojazdow/', '/kontakt/'];

export const textScenarios = [
  { id: 'root-font-200-mobile', width: 390, height: 844, textMode: 'root-font' },
  { id: 'root-font-200-desktop', width: 1440, height: 900, textMode: 'root-font' },
  { id: 'text-only-200-mobile', width: 390, height: 844, textMode: 'text-only' },
  { id: 'text-only-200-desktop', width: 1440, height: 900, textMode: 'text-only' },
  { id: 'landscape', width: 844, height: 390, textMode: 'normal' },
  { id: 'landscape-root-font-200', width: 844, height: 390, textMode: 'root-font' },
];

export const nativeFontScenarios = [
  { id: 'browser-default-font-32-mobile', width: 390, height: 844, textMode: 'browser-default-font' },
  { id: 'browser-default-font-32-desktop', width: 1440, height: 900, textMode: 'browser-default-font' },
];

export const textScaleMethods = {
  rootFont: 'CSS html font-size = 200% zmierzonej wartości bazowej (zwykle 16 → 32 CSS px); rem i jednostki układu zależne od root mogą rosnąć.',
  textOnly: 'Jednorazowa migawka computed font-size wszystkich elementów HTML w body, następnie każda wartość ×2 jako inline important. Root font i DPR pozostają bez zmian; nie ma kaskadowego ×4. WebKit odświeża computed font ukrytych elementów po ich wyrenderowaniu, dlatego assignment sprawdzany jest od razu, a computed ×2 także po otwarciu menu i modalu.',
  browserPreference: 'Chromium CDP Page.setFontSizes standard=32, fixed=26 przed nawigacją; rzeczywista domyślna preferencja fontu, weryfikowana computed root=32 i media query w em. Metoda eksperymentalna, Chromium-only.',
  browserPreferenceSource: 'https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json',
  limitations: [
    'Żaden z tych scenariuszy nie jest pełnym zoomem przeglądarki z jej interfejsu.',
    'deviceScaleFactor pozostaje 1. Zwiększenie DPR nie jest używane jako zamiennik zoomu.',
    'Powiększenie fontów CSS obejmuje dokument AlaTrans, nie kod zewnętrznego iframe Google.',
    'WebKit automatyczny nie zastępuje fizycznego Safari ani ustawień dostępności iOS.',
  ],
};

// Browser callbacks are disabled in a no-JS context, including callbacks created by evaluate.
// Keep that context disabled; orchestrate its rendering waits from Node instead.
const javaScriptDisabledPages = new WeakSet();

export function markJavaScriptDisabled(page) {
  javaScriptDisabledPages.add(page);
}

export async function nextLayoutFrame(page) {
  if (javaScriptDisabledPages.has(page)) {
    await page.evaluate(() => document.documentElement.getBoundingClientRect().height);
    await new Promise((done) => setTimeout(done, 32));
    return;
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  });
}

export async function installNativeFontPreference(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
  return session;
}

export async function assertRenderedTextScale(page, label) {
  await nextLayoutFrame(page);
  const result = await page.evaluate(() => {
    const baseline = window.__qaTextFontSnapshot;
    if (!baseline) return null;
    const rendered = baseline.filter(({ element }) => element.isConnected && element.getClientRects().length > 0);
    return {
      verifiedElements: rendered.length,
      deferredHiddenElements: baseline.length - rendered.length,
      mismatches: rendered
        .filter(({ element, fontSize }) => Math.abs(parseFloat(getComputedStyle(element).fontSize) - fontSize * 2) > 0.1)
        .map(({ element, fontSize }) => ({
          element: element.tagName.toLowerCase(),
          text: element.textContent.trim().slice(0, 60),
          expected: fontSize * 2,
          actual: getComputedStyle(element).fontSize,
        })),
    };
  });
  if (result) assert.deepEqual(result.mismatches, [], `${label}: rendered text is exactly 200%`);
  return result;
}

export async function applyTextMode(page, mode) {
  if (mode === 'browser-default-font') {
    const result = await page.evaluate(() => ({
      mode: 'browser-default-font',
      rootFontAfter: parseFloat(getComputedStyle(document.documentElement).fontSize),
      devicePixelRatio,
      media20em: matchMedia('(max-width: 20em)').matches,
      viewportWidth: innerWidth,
    }));
    assert.equal(result.rootFontAfter, 32, 'Preferencja przeglądarki 32 px jest respektowana');
    assert.equal(result.media20em, result.viewportWidth <= 640, 'Media queries em respektują preferencję fontu 32 px');
    assert.equal(result.devicePixelRatio, 1, 'Preferencja fontu nie zmienia DPR');
    return result;
  }
  if (mode === 'normal') return { mode: 'normal', devicePixelRatio: 1 };

  const result = await page.evaluate((textMode) => {
    const root = document.documentElement;
    const rootFontBefore = parseFloat(getComputedStyle(root).fontSize);
    const elements = [document.body, ...document.body.querySelectorAll('*')]
      .filter((element) => element instanceof HTMLElement)
      .filter((element) => !element.matches('script, style, noscript, template'));
    const baseline = elements.map((element) => ({
      element,
      fontSize: parseFloat(getComputedStyle(element).fontSize),
    }));
    if (textMode === 'root-font') {
      window.__qaTextFontSnapshot = null;
      root.style.setProperty('font-size', `${rootFontBefore * 2}px`, 'important');
    } else {
      // All values are measured before the first mutation, including hidden dialog text.
      window.__qaTextFontSnapshot = baseline;
      for (const { element, fontSize } of baseline) {
        element.style.setProperty('font-size', `${fontSize * 2}px`, 'important');
      }
    }
    const mismatches = textMode === 'text-only'
      ? baseline.filter(({ element, fontSize }) => Math.abs(parseFloat(element.style.fontSize) - fontSize * 2) > 0.1 || element.style.getPropertyPriority('font-size') !== 'important')
        .map(({ element }) => element.tagName.toLowerCase()).slice(0, 10)
      : [];
    return {
      mode: textMode,
      rootFontBefore,
      rootFontAfter: parseFloat(getComputedStyle(root).fontSize),
      scaledElements: baseline.length,
      mismatches,
      devicePixelRatio,
    };
  }, mode);
  assert.deepEqual(result.mismatches, [], 'Tekst-only przypisuje każdej migawce fontu dokładnie ×2 important');
  assert.equal(result.devicePixelRatio, 1, 'Powiększenie tekstu nie zmienia DPR');
  assert.equal(
    result.rootFontAfter,
    result.rootFontBefore * (mode === 'root-font' ? 2 : 1),
    'Root font odpowiada wybranej metodzie powiększenia',
  );
  await nextLayoutFrame(page);
  if (mode === 'text-only') result.renderedFontCheck = await assertRenderedTextScale(page, 'Powiększenie tekstu-only');
  return result;
}

export async function assertLayoutGeometry(page, label, { dialogOnly = false } = {}) {
  const geometry = await page.evaluate(({ onlyDialog }) => {
    const tolerance = 2;
    const dialog = document.querySelector('dialog[open]');
    const scope = onlyDialog ? dialog : document.body;
    const clippedText = [];
    const overflowingControls = [];
    const smallTargets = [];
    const headerCollisions = [];
    const name = (element) => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${[...element.classList].slice(0, 2).map((entry) => `.${entry}`).join('')}`;
    const shown = (element) => {
      if (!element.getClientRects().length) return false;
      for (let current = element; current; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
      }
      return true;
    };
    const rectOutside = (inner, outer, axis) => axis === 'x'
      ? inner.left < outer.left - tolerance || inner.right > outer.right + tolerance
      : inner.top < outer.top - tolerance || inner.bottom > outer.bottom + tolerance;
    const remember = (list, item) => {
      if (list.length < 30 && !list.some((existing) => existing.element === item.element && existing.reason === item.reason)) list.push(item);
    };

    if (scope) {
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!node.textContent.trim() || !parent || !shown(parent)) continue;
        if (parent.closest('script, style, noscript, svg, .sr-only, [aria-hidden="true"]')) continue;
        if (parent.closest('.skip-link') && !parent.closest('.skip-link:focus')) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const lines = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
        for (const line of lines) {
          if (line.left < -tolerance || line.right > innerWidth + tolerance) {
            remember(clippedText, { element: name(parent), reason: 'text outside horizontal viewport', text: node.textContent.trim().slice(0, 90) });
          }
          const control = parent.closest('a, button');
          if (control && rectOutside(line, control.getBoundingClientRect(), 'x')) {
            remember(clippedText, { element: name(control), reason: 'label outside its interactive target', text: node.textContent.trim().slice(0, 90) });
          }
          for (let ancestor = parent; ancestor && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor);
            const box = ancestor.getBoundingClientRect();
            const clip = {
              left: box.left + ancestor.clientLeft,
              right: box.left + ancestor.clientLeft + ancestor.clientWidth,
              top: box.top + ancestor.clientTop,
              bottom: box.top + ancestor.clientTop + ancestor.clientHeight,
            };
            if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowX) && rectOutside(line, clip, 'x')) {
              remember(clippedText, { element: name(parent), reason: `horizontal clip by ${name(ancestor)}`, text: node.textContent.trim().slice(0, 90) });
            }
            // Vertical scrolling of a menu or modal is intentional; hidden/clip is not.
            if (['hidden', 'clip'].includes(style.overflowY) && rectOutside(line, clip, 'y')) {
              if (ancestor !== document.body || !dialog) {
                remember(clippedText, { element: name(parent), reason: `vertical clip by ${name(ancestor)}`, text: node.textContent.trim().slice(0, 90) });
              }
            }
          }
        }
      }

      const controls = scope.querySelectorAll('a, button, iframe');
      for (const control of controls) {
        if (!shown(control) || control.closest('.sr-only')) continue;
        if (control.matches('.skip-link') && control !== document.activeElement) continue;
        const rect = control.getBoundingClientRect();
        if (rect.left < -tolerance || rect.right > innerWidth + tolerance) {
          remember(overflowingControls, { element: name(control), reason: 'interactive element outside horizontal viewport' });
        }
        if (control.matches('.choice, .channel-link, .top-call, .menu-button, .mobile-cta, .dialog-close, .gallery-open, .brand, #site-navigation a, footer a, .hero-contact a, .text-link')) {
          if (rect.width < 44 - 0.5 || rect.height < 44 - 0.5) {
            remember(smallTargets, { element: name(control), reason: 'target below 44 CSS px', width: rect.width, height: rect.height });
          }
        }
      }
    }

    if (!onlyDialog) {
      const headerItems = [...document.querySelectorAll('.site-header .brand, .site-header .top-call, .site-header .menu-button, #site-navigation a')]
        .filter(shown);
      for (let first = 0; first < headerItems.length; first += 1) {
        const a = headerItems[first].getBoundingClientRect();
        for (let second = first + 1; second < headerItems.length; second += 1) {
          const b = headerItems[second].getBoundingClientRect();
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > tolerance && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > tolerance) {
            headerCollisions.push([name(headerItems[first]), name(headerItems[second])]);
          }
        }
      }
    }

    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      clippedText,
      overflowingControls,
      smallTargets,
      headerCollisions,
      rootFont: getComputedStyle(document.documentElement).fontSize,
      dialogOverflowX: dialog ? dialog.scrollWidth - dialog.clientWidth : 0,
    };
  }, { onlyDialog: dialogOnly });

  assert(geometry.documentWidth <= geometry.viewport.width + 1, `${label}: horizontal document overflow ${geometry.documentWidth}/${geometry.viewport.width}`);
  for (const key of ['clippedText', 'overflowingControls', 'smallTargets', 'headerCollisions']) {
    assert.deepEqual(geometry[key], [], `${label}: ${key}: ${JSON.stringify(geometry[key])}`);
  }
  if (dialogOnly) assert(geometry.dialogOverflowX <= 1, `${label}: modal has no horizontal scrolling`);
  return geometry;
}

export async function assertPhoneAndFooter(page, label, { allowScrollingHeader = false } = {}) {
  const sticky = page.locator('.mobile-cta');
  assert.equal(await sticky.count(), 1, `${label}: exactly one mobile call bar`);
  assert.equal(await sticky.getAttribute('href'), 'tel:+48880887092');
  const visible = await sticky.isVisible();
  const headerPhone = page.locator('.top-call');
  const headerPosition = await page.locator('.site-header').evaluate((element) => getComputedStyle(element).position);
  const scrollingHeader = !visible && allowScrollingHeader && headerPosition === 'static';
  assert(visible || await headerPhone.isVisible(), `${label}: phone available in header or call bar`);
  if (!visible) await assertControlInViewport(headerPhone, page, `${label}: header phone`);
  if (visible) {
    assert.equal(await sticky.getAttribute('href'), 'tel:+48880887092');
    const box = await sticky.boundingBox();
    const viewport = page.viewportSize();
    assert(box && box.width >= 44 && box.height >= 44, `${label}: call bar target at least 44 CSS px`);
    assert(box.y >= -1 && box.y + box.height <= viewport.height + 1, `${label}: call bar fits actual viewport height`);
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await nextLayoutFrame(page);
  const obscured = await page.locator('footer a').evaluateAll((links) => {
    const call = document.querySelector('.mobile-cta');
    const callStyle = call ? getComputedStyle(call) : null;
    const bar = callStyle && callStyle.display !== 'none' ? call.getBoundingClientRect() : null;
    return links.filter((link) => {
      const rect = link.getBoundingClientRect();
      return bar && rect.bottom > bar.top + 1 && rect.top < bar.bottom - 1 && rect.right > bar.left && rect.left < bar.right;
    }).map((link) => link.textContent.trim());
  });
  assert.deepEqual(obscured, [], `${label}: sticky CTA does not cover the last footer links`);
  if (visible) {
    const box = await sticky.boundingBox();
    assert(box && box.y + box.height <= page.viewportSize().height + 1, `${label}: call bar persists after scrolling`);
  } else {
    if (scrollingHeader) {
      await headerPhone.scrollIntoViewIfNeeded();
      await nextLayoutFrame(page);
    }
    await assertControlInViewport(headerPhone, page, `${label}: header phone after scrolling`);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await nextLayoutFrame(page);
  return {
    stickyVisible: visible,
    headerPosition,
    phonePersistence: visible ? 'fixed-call-bar' : scrollingHeader ? 'scrolling-header-in-short-landscape' : 'header-stays-in-viewport',
    footerObscured: obscured,
  };
}

export async function assertControlInViewport(locator, _page, label) {
  const result = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const hit = document.elementFromPoint(x, y);
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      hit: hit === element || element.contains(hit),
    };
  });
  assert(result.width >= 44 && result.height >= 44, `${label}: target at least 44 CSS px`);
  assert(result.x >= -1 && result.y >= -1 && result.x + result.width <= result.viewportWidth + 1 && result.y + result.height <= result.viewportHeight + 1, `${label}: control is within actual viewport`);
  assert(result.hit, `${label}: control is reachable by pointer and not covered`);
  return result;
}
