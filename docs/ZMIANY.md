# Lista zmian AlaTrans 2.0

Zakres: fazy 0–4 oraz lokalny pakiet do PR. Dokumenty briefu, reference/ i assets/ dodano jako dostarczone materiały źródłowe bez edycji; nie są publikowane przez build. START_TUTAJ_PROMPT_DLA_CODEX.md pozostaje niezmienionym, nieśledzonym plikiem wejściowym użytkownika. Notes.txt nie jest częścią zmian.

## Główne grupy

- Nowe źródła src/: layout, komponenty, dane, CSS, sześć stron, 404 i endpoint sitemap.
- Konfiguracja Astro/TypeScript/Node/npm i Netlify static.
- Publiczne zdjęcia WebP, logo, favicony i robots. Warianty responsywne generuje Astro do dist.
- Powtarzalne testy statyczne, browser QA, Lighthouse i ochrona indeksowania preview.
- Dokumentacja audytu, materiałów, testów, PR, wdrożenia i screenshoty.
- Usunięte stare index.html, script.js, style.css; dostępne w poprzednim commicie.

## Pliki w końcowym commicie

Status A: nowy, M: zmieniony, D: usunięty.

- `M` `.gitignore`
- `A` `.nvmrc`
- `M` `README.md`
- `A` `SPECYFIKACJA_ALATRANS_2_0_DLA_CODEX.md`
- `A` `assets/laweta_car_4.webp`
- `A` `assets/logo.png`
- `A` `astro.config.mjs`
- `A` `docs/AUDYT.md`
- `A` `docs/MATERIALY.md`
- `A` `docs/PR_BODY.md`
- `A` `docs/WDROZENIE.md`
- `A` `docs/WERYFIKACJA.md`
- `A` `docs/ZMIANY.md`
- `A` `docs/qa-browser.json`
- `A` `docs/qa-lighthouse-initial.json`
- `A` `docs/qa-lighthouse.json`
- `A` `docs/screenshots/glowna-1440.png`
- `A` `docs/screenshots/glowna-390.png`
- `A` `docs/screenshots/glowna-hero-1440.png`
- `A` `docs/screenshots/glowna-hero-390.png`
- `A` `docs/screenshots/kontakt-1440.png`
- `A` `docs/screenshots/kontakt-390.png`
- `A` `docs/screenshots/kontakt-viewport-390.png`
- `A` `docs/screenshots/o-firmie-1440.png`
- `A` `docs/screenshots/o-firmie-390.png`
- `A` `docs/screenshots/o-firmie-viewport-390.png`
- `A` `docs/screenshots/pomoc-drogowa-1440.png`
- `A` `docs/screenshots/pomoc-drogowa-390.png`
- `A` `docs/screenshots/pomoc-drogowa-viewport-390.png`
- `A` `docs/screenshots/realizacje-1440.png`
- `A` `docs/screenshots/realizacje-390.png`
- `A` `docs/screenshots/realizacje-viewport-390.png`
- `A` `docs/screenshots/transport-pojazdow-1440.png`
- `A` `docs/screenshots/transport-pojazdow-390.png`
- `A` `docs/screenshots/transport-pojazdow-viewport-390.png`
- `D` `index.html`
- `A` `netlify.toml`
- `A` `package-lock.json`
- `A` `package.json`
- `A` `public/favicon/favicon-128x128.png`
- `A` `public/favicon/favicon-16x16.png`
- `A` `public/favicon/favicon-256x256.png`
- `A` `public/favicon/favicon-32x32.png`
- `A` `public/favicon/favicon-48x48.png`
- `A` `public/favicon/favicon-64x64.png`
- `A` `public/favicon/favicon.ico`
- `A` `public/photos/laweta_car_1.webp`
- `A` `public/photos/laweta_car_2.webp`
- `A` `public/photos/laweta_car_3.webp`
- `A` `public/photos/laweta_car_4.webp`
- `A` `public/photos/laweta_car_5.webp`
- `A` `public/photos/laweta_car_6.webp`
- `A` `public/photos/laweta_car_7.webp`
- `A` `public/photos/logo.png`
- `A` `public/robots.txt`
- `A` `reference/makieta_desktop_cala.png`
- `A` `reference/makieta_desktop_hero.png`
- `A` `reference/makieta_mobile_cala.png`
- `A` `reference/makieta_mobile_hero.png`
- `A` `reference/makieta_strony_glownej.html`
- `D` `script.js`
- `A` `scripts/browser-qa.mjs`
- `A` `scripts/check-build.mjs`
- `A` `scripts/finalize-build.mjs`
- `A` `scripts/lighthouse-qa.mjs`
- `A` `src/components/ContactBand.astro`
- `A` `src/components/MobileCallBar.astro`
- `A` `src/components/PhoneIcon.astro`
- `A` `src/components/SiteFooter.astro`
- `A` `src/components/SiteHeader.astro`
- `A` `src/components/VehiclePhoto.astro`
- `A` `src/data/photos.ts`
- `A` `src/data/site.ts`
- `A` `src/layouts/BaseLayout.astro`
- `A` `src/pages/404.astro`
- `A` `src/pages/index.astro`
- `A` `src/pages/kontakt/index.astro`
- `A` `src/pages/o-firmie/index.astro`
- `A` `src/pages/pomoc-drogowa/index.astro`
- `A` `src/pages/realizacje/index.astro`
- `A` `src/pages/sitemap.xml.ts`
- `A` `src/pages/transport-pojazdow/index.astro`
- `A` `src/styles/global.css`
- `D` `style.css`
- `A` `tsconfig.json`
