# Testy i wyniki QA

Uruchamiaj polecenia w głównym katalogu repozytorium po `npm ci`, na wersji Node
zgodnej z `.nvmrc`. Poniższe instrukcje opisują kontrole, nie deklarują wyniku
PASS dla dowolnego późniejszego commita lub deploya.

## Kontrole przed wydaniem

```bash
npm run check
npm run build
npm test
node --test scripts/netlify-release-gate.test.mjs
git diff --check
```

`check` analizuje Astro i TypeScript. Pełny build wykonuje synchronizację zasobów,
generowanie Astro i finalizację indeksowania. `npm test` sprawdza istniejący
`dist/`: sześć tras, 404, SEO, dane i kontakty, linki, obrazy, 16 pozycji galerii,
sitemap, robots oraz kontrakty produkcyjne.

Oddzielny zestaw 24 testów bramki sprawdza kolejność poleceń, konteksty,
indeksowanie, przekazywanie środowiska i zatrzymanie po błędzie procesu.
Nie jest automatycznie uruchamiany przez `npm test` ani bramkę Netlify.
Wymaga środowiska POSIX; suite jest pomijana na Windows i nie należy wtedy
raportować jej jako zaliczonej.

## Browser QA i Lighthouse

Po zmianach interfejsu, galerii lub zachowania wykonaj pełne browser QA:

```bash
npx playwright install chromium webkit
npm run build
npm run test:browser
```

System musi mieć biblioteki wymagane przez Playwright. Browser QA sam uruchamia
i zamyka lokalny serwer `dist/`; obejmuje Chromium i WebKit, 168 przypadków
podstawowych, 84 powiększenia tekstu/orientacji i 12 bez JS — razem 264.
Sprawdza także menu, dialog galerii, mapę, geometrię i dostępność.
`WEBKIT_EXECUTABLE_PATH` pozwala wskazać niestandardowy plik wykonywalny WebKit.

Lighthouse wymaga osobnego serwera wcześniej zbudowanej strony; uruchom go
w jednym terminalu, a pomiar w drugim, bez równoległego browser QA:

```bash
npm run preview -- --port 8765
```

```bash
QA_URL=http://127.0.0.1:8765/ npm run test:lighthouse
```

`QA_URL` musi odpowiadać faktycznemu adresowi wypisanemu przez serwer.
Pomiar obejmuje trzy kolejne próby mobile strony głównej; `LIGHTHOUSE_PORT`
nadpisuje domyślny port debugowania 9223. Jeśli Astro pozostawi serwer w tle,
zakończ go poleceniem `npx astro preview stop`.

## Wyniki i podgląd

Domyślnie skrypty zapisują do ignorowanego `.artifacts/qa/`:

- `qa-browser.json`, `qa-lighthouse.json`, `screenshots/`;
- `responsive/qa-responsive.json` i `responsive/screenshots/after/`.

Jawne `QA_OUTPUT_DIR` ma pierwszeństwo; wybierz katalog ignorowany przez Git.
`npm run test:browser -- --screenshots-only` odświeża screenshoty, wymaga
wcześniejszego `qa-browser.json` w wybranym katalogu i nie zastępuje pełnych testów.
`QA_CONTINUE_ON_FAILURE=true` zbiera wszystkie porażki, lecz nadal kończy się FAIL.

Lokalny wariant preview: `PREVIEW_NOINDEX=true npm run build`, następnie
`npm test -- --preview`. Przed kolejną kontrolą produkcji usuń tę flagę oraz
`CONTEXT` z lokalnego środowiska i ponownie wykonaj pełne `npm run build` i `npm test`.
Sam test nie przebudowuje ani nie przywraca indeksowania.

Historyczne raporty i screenshoty są w prywatnym archiwum. Nowy wynik wiąż
z datą, commitem, środowiskiem i rzeczywistym kodem wyjścia; nie zastępuj FAIL
starszym PASS. Lighthouse jest pomiarem laboratoryjnym, a WebKit i axe nie
zastępują fizycznego telefonu, Safari ani ręcznego sprawdzenia komunikatorów.
Na Netlify osobno potwierdź rzeczywisty nagłówek noindex i routing preview.
