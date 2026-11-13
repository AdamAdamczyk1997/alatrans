# Publikacja i rollback

Produkcja: [alatrans.pl](https://alatrans.pl/) → projekt Netlify
`magenta-sundae-24831c`, połączony z `AdamAdamczyk1997/alatrans`.
Gałąź produkcyjna: `main`; DNS domeny jest zarządzany w SEOHOST.
Repozytoryjny `netlify.toml` jest źródłem ustawień buildu:

| Ustawienie | Wartość |
| --- | --- |
| Katalog projektu | Główny katalog repozytorium |
| Build command | `node scripts/netlify-release-gate.mjs` |
| Publish directory | `dist` |
| Node | `22.23.4` |
| Produkcja | `CONTEXT=production`, `PREVIEW_NOINDEX` nieustawione lub dokładnie `false` |
| Deploy Preview / Branch Deploy | `PREVIEW_NOINDEX=true`, ustawione dla tych kontekstów w TOML |

Bramka sprawdza kontekst i flagę indeksowania przed uruchomieniem npm, odrzuca
nieznane konteksty i przerywa po błędzie dowolnego kroku. Wykonuje
`npm run check` → `npm run build` → `npm test`; dla podglądu ostatnim krokiem
jest `npm test -- --preview`. `npm run build` zachowuje prebuild i postbuild.
Testy kontraktu samej bramki uruchamia się osobno — nie należą do tego ciągu.

## Zmiana produkcyjna

1. Przygotuj zmianę na gałęzi roboczej, sprawdź diff i wykonaj lokalne testy
   opisane w [WERYFIKACJA.md](WERYFIKACJA.md).
2. Wypchnij zatwierdzone commity i otwórz PR do `main`; poczekaj na Netlify
   Deploy Preview, sprawdź wynik gate oraz podgląd na telefonie i desktopie.
3. Przed zatwierdzonym merge zapisz identyfikator aktualnego poprawnego
   produkcyjnego deploya Netlify; jest punktem szybkiego powrotu.
4. Merge do `main` uruchamia produkcyjny build; sprawdź jego log i publikację
   na domenie, sześć stron, 404, telefon, menu, galerię oraz mapę.

Preview musi mieć meta `noindex`, robots `Disallow: /` oraz rzeczywisty nagłówek
`X-Robots-Tag: noindex, nofollow`. Produkcja ma być indeksowalna na sześciu
stronach publicznych; techniczna strona 404 pozostaje `noindex`.
Sprawdź też `/robots.txt`, `/sitemap.xml`, canonical oraz HTTPS.

## Kontrakty do zachowania

- Sześć tras z README, ukośnik kończący URL i canonical `https://alatrans.pl`.
- Unikalne title/description, Open Graph, LocalBusiness z danymi `site.ts`, sitemap.
- Siedem reguł 301 `/photos/laweta_car_1.jpg`–`laweta_car_7.jpg` do odpowiednich
  WebP oraz dostępność ich celów, logo i faviconów.
- Wizytówki i dawne kotwice jednoplikowej strony nie są automatycznie przywracane;
  zmiana ich obsługi wymaga osobnej decyzji. Tak samo ponowne dodanie SMS/e-mail.

GitHub Pages jest oddzielnym, historycznym hostingiem; konfiguracja Netlify nie
potwierdza jego aktualnego stanu. Publikowanie źródeł Astro z głównego katalogu
repozytorium nie zastępuje publikacji zbudowanego `dist/`.

## Szybki powrót

W Netlify otwórz poprzedni poprawny deploy i wybierz **Publish Deploy**.
Zablokuj automatyczną publikację (**Lock to stop auto publishing**), aby kolejny
build produkcyjny nie nadpisał przywróconej wersji; sprawdź domenę i kontakt.
Rollback w tym samym projekcie nie wymaga zmiany DNS.
Naprawę kodu przygotuj potem w osobnej gałęzi i PR, bez force push lub
przepisywania historii.

Źródła: [konfiguracja Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/),
[rollback i blokada publikacji](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/#rollbacks).
