# AlaTrans 2.0

Statyczna, polskojęzyczna strona pomocy drogowej i transportu pojazdów. Repozytorium i istniejący hosting Netlify pozostają te same; produkcja: https://alatrans.pl/.

## Uruchomienie lokalne

Node **22.23.4** (`.nvmrc`), npm >=9.6.5. Astro **7.4.4**, TypeScript, zwykły CSS. Bez React, SSR, adaptera Netlify i backendu. Zależności przypięte w `package-lock.json`.

```bash
nvm install
nvm use
npm ci
npm run dev
```

```bash
npm run check
npm run build
npm test
npm run preview
```

Build tworzy `dist/`, sześć stron HTML, techniczne `404.html`, sitemap i zoptymalizowane obrazy. `postbuild` ustawia indeksowanie zależnie od kontekstu. Astro 7 uruchamia podgląd w tle; zakończenie: `npx astro preview stop`.

## Strony i źródła

| URL | Plik |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/pomoc-drogowa/` | `src/pages/pomoc-drogowa/index.astro` |
| `/transport-pojazdow/` | `src/pages/transport-pojazdow/index.astro` |
| `/realizacje/` | `src/pages/realizacje/index.astro` |
| `/o-firmie/` | `src/pages/o-firmie/index.astro` |
| `/kontakt/` | `src/pages/kontakt/index.astro` |

- `src/data/site.ts`: wspólny telefon, marka i menu.
- `src/layouts/BaseLayout.astro`: SEO, JSON-LD i wspólna struktura.
- `src/components/`: header, telefon mobile, kontakt, stopka i responsywne obrazy.
- `src/styles/global.css`: tokeny i responsywny design zgodny z referencją.
- `photos/` i `favicon/`: pojedyncze źródła zasobów. Hooki predev/prebuild/prepreview synchronizują wybrane pliki do ignorowanych public/photos i public/favicon; Astro przetwarza importy bezpośrednio ze źródeł. Unikalne starsze JPG i wizytówki pozostają w photos/ jako materiały źródłowe.
- `reference/` i specyfikacja: materiały zatwierdzone przez właścicieli, nie są publikowane w `dist/`.

## Weryfikacja w przeglądarkach

```bash
npx playwright install chromium webkit
npm run test:browser
# Po zakończeniu QA, przy uruchomionym npm run preview:
npm run test:lighthouse
```

W systemie muszą być dostępne biblioteki wymagane przez Playwright. Opcjonalne `WEBKIT_EXECUTABLE_PATH` wskazuje lokalny wrapper WebKit w niestandardowym środowisku; nie jest wymagane na typowym wspieranym systemie. Skrypt sam uruchamia i zamyka serwer statyczny, generuje `docs/qa-browser.json` oraz zrzuty. Pełne obrazy mobile pomijają pasek fixed wyłącznie na screenshotach; osobne viewporty dokumentują jego faktyczne działanie.

```bash
PREVIEW_NOINDEX=true npm run build
node scripts/check-build.mjs --preview
npm run build
npm test
```

Ostatni build przywraca wariant produkcyjny. Preview ma meta noindex, blokadę robots i plik `_headers` z `X-Robots-Tag`. Produkcja pozostaje indeksowalna.

## Dokumentacja

- [Audyt przed przebudową](docs/AUDYT.md)
- [Selekcja fotografii](docs/MATERIALY.md)
- [Wyniki i ograniczenia testów](docs/WERYFIKACJA.md)
- [PR, bezpieczna publikacja i rollback](docs/WDROZENIE.md)
- [Gotowa treść PR](docs/PR_BODY.md)
- [Zmiany UX/UI i potwierdzenia z iteracji 2](docs/ITERACJA_2.md)
- [Audyt zasobów i checksumów](docs/ASSETS_ITERACJA_2.md)

Nie dodawać Notes.txt, sekretów, plików .env, node_modules ani dist. Nie wykonywać merge do main ani publikacji produkcyjnej bez wyraźnej zgody właściciela.

Bieżąca iteracja 2 jest wyłącznie lokalna: bez push, merge i publikacji. Potwierdzone dane oraz raport tej iteracji: docs/ITERACJA_2.md.
