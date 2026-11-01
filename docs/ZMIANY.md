# Zmiany iteracji 2

Baza porównania: commit 172c85c. Wszystkie zmiany są lokalne na feat/alatrans-2-redesign; bez push, merge i publikacji.

## Zakres

- Dane firmy, pełny adres i bezpośrednie kanały w centralnej konfiguracji, stopce, treści i schema.
- Pięć sekcji głównej, równorzędne przyciski, celowany układ tabletowy, prostsza hierarchia i odstępy.
- Wspólny lekki komponent komunikatorów z lokalnymi SVG; jedna sekcja kontaktu na podstronie Kontakt.
- Zweryfikowana lazy mapa bazy z niezależnym odnośnikiem Google Maps.
- Pojedyncze źródła zdjęć/faviconów, generowane kopie publiczne i zachowane URL.
- Aktualne testy, raporty, dokumentacja i 19 nowych screenshotów.

Dane źródłowe photos/, favicon/, reference/ oraz unikalne fotografie pozostają bez zmiany bajtów. Nie zmieniono netlify.toml, zależności ani package-lock.json. Usunięcia public/photos i public/favicon dotyczą śledzonych kopii; npm odtwarza pliki do buildu. Dwa zastane nieśledzone pliki użytkownika (AUDYT_ALATRANS_2_0_PO_CODEX.md i START_TUTAJ_PROMPT_DLA_CODEX.md) nie należą do zmian.

## Pliki

M: zmodyfikowany; A: nowy; D: usunięta kopia z Git.

- `M` `.gitignore`
- `M` `README.md`
- `D` `assets/laweta_car_4.webp`
- `D` `assets/logo.png`
- `A` `docs/ASSETS_ITERACJA_2.md`
- `M` `docs/AUDYT.md`
- `A` `docs/ITERACJA_2.md`
- `M` `docs/MATERIALY.md`
- `M` `docs/PR_BODY.md`
- `M` `docs/WDROZENIE.md`
- `M` `docs/WERYFIKACJA.md`
- `M` `docs/ZMIANY.md`
- `A` `docs/assets-audit-iteracja-2.json`
- `M` `docs/qa-browser.json`
- `A` `docs/qa-contrast-iteracja-2.json`
- `M` `docs/qa-lighthouse.json`
- `M` `docs/screenshots/glowna-1440.png`
- `M` `docs/screenshots/glowna-390.png`
- `M` `docs/screenshots/glowna-hero-1440.png`
- `M` `docs/screenshots/glowna-hero-390.png`
- `M` `docs/screenshots/kontakt-1440.png`
- `M` `docs/screenshots/kontakt-390.png`
- `M` `docs/screenshots/kontakt-viewport-390.png`
- `M` `docs/screenshots/o-firmie-1440.png`
- `M` `docs/screenshots/o-firmie-390.png`
- `M` `docs/screenshots/o-firmie-viewport-390.png`
- `M` `docs/screenshots/pomoc-drogowa-1440.png`
- `M` `docs/screenshots/pomoc-drogowa-390.png`
- `M` `docs/screenshots/pomoc-drogowa-viewport-390.png`
- `M` `docs/screenshots/realizacje-1440.png`
- `M` `docs/screenshots/realizacje-390.png`
- `M` `docs/screenshots/transport-pojazdow-1440.png`
- `M` `docs/screenshots/transport-pojazdow-390.png`
- `M` `docs/screenshots/transport-pojazdow-viewport-390.png`
- `M` `package.json`
- `D` `public/favicon/favicon-128x128.png`
- `D` `public/favicon/favicon-16x16.png`
- `D` `public/favicon/favicon-256x256.png`
- `D` `public/favicon/favicon-32x32.png`
- `D` `public/favicon/favicon-48x48.png`
- `D` `public/favicon/favicon-64x64.png`
- `D` `public/favicon/favicon.ico`
- `D` `public/photos/laweta_car_1.webp`
- `D` `public/photos/laweta_car_2.webp`
- `D` `public/photos/laweta_car_3.webp`
- `D` `public/photos/laweta_car_4.webp`
- `D` `public/photos/laweta_car_5.webp`
- `D` `public/photos/laweta_car_6.webp`
- `D` `public/photos/laweta_car_7.webp`
- `D` `public/photos/logo.png`
- `M` `scripts/browser-qa.mjs`
- `M` `scripts/check-build.mjs`
- `A` `scripts/sync-public-assets.mjs`
- `A` `src/components/ChannelIcon.astro`
- `M` `src/components/ContactBand.astro`
- `A` `src/components/ContactChannels.astro`
- `M` `src/components/SiteFooter.astro`
- `M` `src/components/SiteHeader.astro`
- `M` `src/data/photos.ts`
- `M` `src/data/site.ts`
- `M` `src/layouts/BaseLayout.astro`
- `M` `src/pages/index.astro`
- `M` `src/pages/kontakt/index.astro`
- `M` `src/pages/o-firmie/index.astro`
- `M` `src/pages/pomoc-drogowa/index.astro`
- `M` `src/pages/transport-pojazdow/index.astro`
- `M` `src/styles/global.css`
