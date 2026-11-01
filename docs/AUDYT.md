# AlaTrans 2.0 — faza 0, 31.10.2026

> Raport historyczny pierwszej iteracji. Potwierdzenia firmy, adresu i kanałów kontaktu z 1.11.2026 zastępują dawne ograniczenia; aktualny stan: ITERACJA_2.md i WERYFIKACJA.md.

## Stan potwierdzony przed implementacją

- Repo: `AdamAdamczyk1997/alatrans`, gałąź domyślna i produkcyjna `main`.
- `git ls-remote` oraz lokalne `origin/main`: `c8ac902cd737fae5678378d9d2d3a966f57d2a78`.
- HTTP GET `https://alatrans.pl/`: 200, serwer Netlify; treść identyczna bajtowo z `index.html` w tym commicie (SHA-256 porównany lokalnie).
- `https://www.alatrans.pl/` przekierowuje do `https://alatrans.pl/`. Nie zmieniano DNS, certyfikatów, domen ani projektu Netlify.
- Repo zawiera jeden HTML, CSS, JS lightboxa, zdjęcia JPG/WebP, logo i favicony. Brak package.json, zależności, frameworka, fontów zewnętrznych, workflow, CNAME, _redirects i netlify.toml. README wspomina GitHub Pages; dodatkowy odczyt publicznych metadanych potwierdził, że istnieje również drugi adres serwisu (szczegóły poniżej).
- `robots.txt` oraz `sitemap.xml` na produkcji zwracają 404.
- Potwierdzone w kodzie: dwa meta description, H1 w brandingu zamiast hero, względne OG, AutoRepair i priceRange bez potwierdzenia, lazy hero, błędne domknięcie div i lista w p, ogólne alty, lightbox bez przycisku i obsługi fokusu, galeria na głównej, dodatkowe niepotwierdzone usługi oraz obietnice.
- Telefon ma prawidłowy tel. Obecne SMS i e-mail nie należą do zatwierdzonych kanałów nowej strony.
- Link Google Maps zwrócił 200 i przekierował do miejsca „Pomoc drogowa Łącko AlaTrans”. Stary iframe OSM wskazuje inne współrzędne; nie przenosimy go.
- Facebook zwrócił 200 i przekierował do profilu „Artur Adamczyk”. To nie potwierdza rozmowy Messenger ani tożsamości profilu; zachowujemy zatwierdzony URL, opisany jako profil Facebook. Weryfikacja właściciela i realnego telefonu pozostaje konieczna.
- Brak lokalnego gh, Netlify CLI oraz skonfigurowanego Git credential helpera. Dostęp do panelu i identyfikator ostatniego deployu nie zostały potwierdzone. Nie odczytywano Notes.txt ani poświadczeń.
- Początkowe nieśledzone pliki użytkownika: specyfikacja, START_TUTAJ_PROMPT_DLA_CODEX.md, assets/, reference/. Zachowane bez modyfikacji.
- Utworzono gałąź `feat/alatrans-2-redesign`; main pozostaje bez zmian.

## Dodatkowe ustalenie publicznej infrastruktury GitHub

Publiczne API check-runs dla c8ac902 wskazuje udany build/deploy GitHub Pages. Ostatni wpis deployment (ID 3471820073, 13.12.2025) dotyczy środowiska **github-pages**, NIE Netlify. Adres `https://adamadamczyk1997.github.io/alatrans/` nadal zwraca 200 i bajtowo ten sam HTML co zbadana produkcja Netlify. API ustawień Pages bez autoryzacji zwróciło 404, więc nie potwierdzono obecnego trybu/source z panelu.

Nie zmieniano tej integracji. Po przyszłym merge projekt Astro wymaga builda do dist; stary sposób publikacji root repo w Pages może przestać działać lub nadal pokazywać poprzednią wersję. To dodatkowy adres zduplikowanej strony, poza uzgodnionym celem alatrans.pl/Netlify. Właściciel powinien świadomie zdecydować o jego przyszłości; nie należy uznawać jego deployment ID za punkt rollback Netlify. Nie dodano workflow ani nie wyłączono Pages.

## Decyzja i migracja

Astro static + zwykły CSS + JS menu i dostępnej galerii. Obecny jednoplikowy serwis nie zapewnia wspólnych komponentów ani sześciu URL. Nie ma integracji wymagającej zachowania starej architektury. Brak React, SSR, funkcji i skryptów analitycznych.

Aktualne wymagania zweryfikowane w npm i dokumentacji: Astro 7.4.4 wymaga Node >=22.23.4 i npm >=9.6.5. Przypięte wersje, lockfile i .nvmrc. Deklaratywny netlify.toml wyłącznie w gałęzi: npm run build / dist; bez edycji panelu. Generator musi wytworzyć i przejść testy, zanim usuniemy stare trzy pliki produkcyjne. Historia Git zachowuje wersję poprzednią.

Zachowujemy: logo, favicony, telefon, zatwierdzony FB, autentyczne zdjęcia, indywidualną wycenę i 24/7 pomocy. Dawne ścieżki JPG lawety mają siedem przekierowań 301 do zachowanych WebP; wizytówki z niezatwierdzonymi treściami świadomie nie trafiają do dist. Zmieniamy: sześć prawdziwych stron, jasny zaakceptowany układ, pełniejszy kadr hero, obszary pomocy i transportu rozdzielone, galeria tylko na Realizacjach. Pomijamy: SMS/e-mail, niepotwierdzone usługi, parametry sprzętu, opinie, staż, obietnice czasu dojazdu, pełną nazwę prawną i dokładny adres do czasu potwierdzenia. Publiczna lokalizacja i schema: tylko Łącko / PL.

## Ryzyka i granica weryfikacji

Nie da się potwierdzić panelowych ustawień Netlify, praw do zdjęć, danych prawnych ani działania dialera i Messengera na fizycznym telefonie samym odczytem repo. Weryfikacja zdjęć, wyniki testów i instrukcja wdrożenia znajdują się w pozostałych dokumentach docs/. Nie wykonujemy produkcyjnego deployu ani merge.

## Źródła techniczne

- https://docs.astro.build/en/install-and-setup/
- https://docs.astro.build/en/guides/deploy/netlify/
- https://docs.netlify.com/build/configure-builds/file-based-configuration/
- https://docs.netlify.com/deploy/deploy-types/deploy-previews/
