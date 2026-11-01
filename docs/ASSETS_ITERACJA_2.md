# Zasoby graficzne — iteracja 2, 1.11.2026

## Zakres i dowód zachowania materiałów

Przeczytano brief iteracji 2, dotychczasowe dokumenty `docs/`, importy Astro,
komponent zdjęcia, layout SEO, galerię, konfigurację Astro i siedem przekierowań
JPG w `netlify.toml`. Audyt SHA-256 objął **wszystkie 67 plików graficznych**
znalezionych poza `node_modules/`, `dist/` i `.git/`: fotografie, logo, favicony,
cztery referencje i 19 dotychczasowych screenshotów. Wykryto **50 różnych treści**.
Pełne ścieżki, wielkości i sumy kontrolne sprzed porządków znajdują się w
[`assets-audit-iteracja-2.json`](assets-audit-iteracja-2.json).

Manifest jest datowanym zapisem audytu przed wykonaniem nowych screenshotów
iteracji 2. Późniejsze screenshoty są osobnymi wynikami QA i mogą mieć nowe sumy.
Nie zmieniano ani nie usuwano żadnych unikalnych fotografii, referencji,
wizytówek, wersji logo ani screenshotów. Nie odczytywano plików z sekretami.

## Organizacja źródeł i stałych URL

- `photos/`: jedna kanoniczna kopia każdego źródła zdjęcia i logo, importowana
  przez Astro. Galeria nadal wybiera zdjęcia 1, 3, 4, 5 i 7, a hero zdjęcie 4.
- `favicon/`: kanoniczne siedem plików favicon. Każdy ma odmienną treść;
  różnych rozdzielczości nie traktujemy jako duplikatów.
- `public/photos/` i `public/favicon/`: wyłącznie odtwarzalne kopie publikowane
  pod dotychczasowymi URL, ignorowane w Git. Nie edytować ich ręcznie.
- Warianty responsywne obrazów generuje Astro do `dist/_astro/` z importów
  źródłowych. Publiczne oryginały nie zastępują tej optymalizacji.
- `reference/` i `docs/screenshots/`: materiały referencyjne oraz wyniki QA,
  poza katalogiem publikowanym.

Skrypt [`sync-public-assets.mjs`](../scripts/sync-public-assets.mjs) korzysta
wyłącznie z Node i jawnej listy: `laweta_car_1.webp` do `laweta_car_7.webp`,
`logo.png`, sześć PNG favicon oraz ICO. Nie kopiuje całego katalogu `photos/`;
JPG, starsze logo i wizytówki nie trafiają do publicznego buildu. Skrypt najpierw
czyta wszystkie źródła, a następnie zapisuje jedynie brakujące lub odmienne
kopie. Nie usuwa nieznanych plików ani katalogów.

Hooki `predev`, `prebuild` i `prepreview` uruchamiają synchronizację automatycznie
przy `npm run dev`, `npm run build` i `npm run preview`. Istniejący `postbuild`
pozostaje bez zmian. Przy bezpośrednim wywołaniu CLI Astro z pominięciem npm
trzeba wcześniej wykonać `node scripts/sync-public-assets.mjs`.

## Dokładnie usunięte duplikaty

Usunięto dwie bitowo identyczne kopie z dawnego `assets/`; katalog stał się pusty:

| Usunięta kopia | Zachowany oryginał | Bajty | SHA-256 |
| --- | --- | ---: | --- |
| `assets/laweta_car_4.webp` | `photos/laweta_car_4.webp` | 243 556 | `b2b90b57343ad0b241142959483cdd30fc1df92b0cba00461f3736bc853cdb87` |
| `assets/logo.png` | `photos/logo.png` | 242 478 | `07746735915f22d31d425adaa1205933acccdd2c7c6ff6453efad7c918746981` |

Import zdjęcia 4 w `src/data/photos.ts` i import logo w
`src/components/SiteHeader.astro` wskazują teraz zachowane pliki w `photos/`.
Żaden obraz nie został przeskalowany, retuszowany ani ponownie skompresowany.

Po sprawdzeniu identyczności bajtowej usunięto z indeksu Git 15 kopii:

- `public/photos/laweta_car_1.webp`, `laweta_car_2.webp`, `laweta_car_3.webp`,
  `laweta_car_4.webp`, `laweta_car_5.webp`, `laweta_car_6.webp`,
  `laweta_car_7.webp`, `logo.png`;
- `public/favicon/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`,
  `favicon-64x64.png`, `favicon-128x128.png`, `favicon-256x256.png`, `favicon.ico`.

Te 15 plików odtworzono lokalnie ze źródeł; nadal powstają w buildzie. Łącznie
eliminujemy **17 powielonych kopii z wersjonowanego drzewa, 4 846 562 bajty**
(około 4,62 MiB). Nie przepisujemy historii Git: poprzednie commity i rozmiar
istniejącego `.git/` pozostają bez zmian. Po tej operacji 50 wersjonowanych
plików graficznych z migawki audytu ma 50 różnych sum SHA-256. Fizyczne kopie
robocze w `public/` są celowym wynikiem generatora.

## Materiały unikalne pozostawione bez zmian

- Wszystkie siedem źródeł `photos/laweta_car_1.jpg`–`laweta_car_7.jpg`.
  Różne formaty JPG/WebP nie mają tych samych sum, więc nie są duplikatami
  bitowymi i nie zostały usunięte.
- Wszystkie siedem źródłowych WebP, także zdjęcia 2 i 6 niewybrane do galerii.
- `photos/logo.png` oraz unikalny `photos/ALATRANS LOGO.png`.
- `photos/info_card_1.jpg`, `info_card_1.webp`, `info_card_2.jpg`,
  `info_card_2.webp`. Wizytówki mają starszą ofertę i nie są publikowane.
- Wszystkie siedem oryginałów w `favicon/`, cztery PNG w `reference/`,
  referencyjny HTML i dotychczasowe screenshoty w `docs/screenshots/`.

Jeżeli właściciel później zechce odchudzić repo, unikalne ciężkie oryginały JPG
i historyczne materiały można zarchiwizować poza repo dopiero po sprawdzeniu
kopii zapasowej i osobnej decyzji. W tej iteracji nie są przenoszone ani kasowane.

## Zgodność URL i kontrola lokalna

Zachowane są `/photos/laweta_car_1.webp`–`/photos/laweta_car_7.webp`,
`/photos/logo.png` oraz wszystkie siedem `/favicon/...`. Pozostają poprawne
odnośniki Open Graph, logo i zdjęcie w JSON-LD oraz wersja galerii bez JS.
Nie zmieniano `netlify.toml`: wszystkie siedem reguł 301 z dawnych JPG nadal
wskazuje odpowiedni WebP. Nie dodano SPA catch-all ani zmian domeny/hostingu.

Weryfikacja samego porządkowania:

- `node --check scripts/sync-public-assets.mjs`: PASS.
- Próba odtworzenia po usunięciu wyłącznie 15 kopii, których bajty wcześniej
  potwierdzono jako identyczne: PASS, odtworzono wszystkie 15.
- Ponowne uruchomienie: PASS, 0 zapisanych plików; synchronizacja jest idempotentna.
- SHA-256 wszystkich 15 wyników odpowiada oryginałom sprzed porządków.
- Wszystkie 31 kanonicznych źródeł, faviconów i referencyjnych PNG ma te same
  sumy jak przed porządkami. `public/photos/` i `public/favicon/` są ignorowane
  i nie są już śledzone przez Git.

Build, sprawdzenie endpointów HTTP i pełne QA całej iteracji są opisane w
dokumentacji weryfikacji po zakończeniu równoległych zmian UI. Ten raport
nie zastępuje testu rzeczywistego Deploy Preview. Sam etap porządkowania nie wykonywał commita. Wynik został przekazany do lokalnej integracji i końcowego commita całej iteracji; nie wykonano push, merge ani publikacji i nie zmieniono gałęzi `main`.
