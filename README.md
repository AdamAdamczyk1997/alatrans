# AlaTrans 2.0

Statyczna strona pomocy drogowej i transportu pojazdów: [alatrans.pl](https://alatrans.pl/).
Repozytorium `AdamAdamczyk1997/alatrans`, publikacja przez Netlify.

## Uruchomienie

Astro 7.4.4, TypeScript i zwykły CSS. Zalecany Node **22.23.4** z `.nvmrc`
(taki sam jak w Netlify), npm >=9.6.5; zależności są przypięte w lockfile.

```bash
nvm install
nvm use
npm ci
npm run dev
```

Przed przekazaniem zmiany:

```bash
npm run check
npm run build
npm test
node --test scripts/netlify-release-gate.test.mjs
```

`npm run preview` udostępnia wcześniej zbudowany `dist/`; adres wypisuje Astro.
Hooki npm synchronizują zasoby przed dev/build/preview, a `postbuild` ustawia
indeksowanie odpowiednie dla produkcji lub podglądu.

## Struktura

| Ścieżka | Przeznaczenie |
| --- | --- |
| `src/pages/` | Sześć stron, techniczne 404 i sitemap |
| `src/components/`, `src/layouts/`, `src/styles/` | Wspólny interfejs, SEO i style |
| `src/data/site.ts` | Dane firmy, telefon, komunikatory, mapa i nawigacja |
| `src/data/realizacje.ts`, `src/data/photos.ts` | Rejestry fotografii i kolejność galerii |
| `photos/`, `favicon/` | Zatwierdzone źródła zasobów |
| `public/robots.txt` | Źródłowy plik robots produkcji |
| `scripts/` | Synchronizacja zasobów, finalizacja, release gate i testy |
| `docs/` | Instrukcje utrzymania |

Strony: `/`, `/pomoc-drogowa/`, `/transport-pojazdow/`, `/realizacje/`,
`/o-firmie/`, `/kontakt/`. Serwis nie wymaga backendu ani SSR.

`dist/`, `.astro/`, `node_modules/`, `.artifacts/` oraz kopie `public/photos/`
i `public/favicon/` są generowane i pozostają poza Git. Historyczne raporty,
makiety, prompty i prywatne materiały źródłowe przechowuje prywatne archiwum
poza repozytorium; wcześniejsze wersje śledzonych plików pozostają w historii Git.

## Utrzymanie

- [Publikacja, kontrakty SEO i rollback](docs/WDROZENIE.md)
- [Fotografie, logo i aktualizowanie galerii](docs/MATERIALY.md)
- [Testy i lokalizacje wyników QA](docs/WERYFIKACJA.md)
