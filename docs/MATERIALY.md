# Fotografie i materiały firmy

## Aktywne źródła

| Materiał | Rola |
| --- | --- |
| `photos/realizacje/*.webp` — 11 zatwierdzonych plików | Nowe pozycje galerii |
| `photos/laweta_car_1.webp`–`laweta_car_7.webp` | Starsze fotografie i cele historycznych URL |
| `photos/logo.png` | Wykorzystywany znak firmy, rzeczywisty PNG |
| `favicon/` | Siedem źródłowych wariantów favicon |

Galeria `/realizacje/` zawiera **16 zdjęć**: 11 nowych i pięć starszych
(1, 3, 4, 5, 7). Kolejność, importy i alty określa `src/data/realizacje.ts`;
`src/data/photos.ts` udostępnia starsze fotografie. WebP 2 i 6 pozostają wymagane
dla stałych adresów, mimo że nie są pozycjami galerii.
Właściciel zatwierdził publikację 11 nowych WebP również w publicznym GitHub.

Skrypt `scripts/sync-public-assets.mjs` odtwarza z jawnej listy **15 kopii**:
siedem starych WebP, logo i siedem faviconów. Powstają w ignorowanych
`public/photos/` i `public/favicon/`; nie edytować ich ręcznie ani nie commitować.
Nowe fotografie są importowane przez Astro, które generuje warianty w
`dist/_astro/`; nie dodaje się ich do publicznej listy kopii.

## Prywatne i historyczne źródła

Oryginały JPG, trzy wykluczone WebP, starsze wizytówki, pełny prywatny manifest
oraz materiały pochodzenia pozostają w prywatnym archiwum poza repozytorium.
Archiwum zawiera również oryginalny projekt logo PDF, wcześniej błędnie nazwany
jako PNG; nie jest to wykorzystywany przez stronę `photos/logo.png`.
Inwentarz archiwum i sumy SHA-256 przechowuje się razem z archiwum, nie w Git.
Usunięcie dawniej śledzonego pliku z bieżącego drzewa nie usuwa go z historii Git.

## Aktualizowanie galerii

1. Zachowaj oryginał i jego sumę SHA-256 w prywatnym archiwum; przed dodaniem
   uzyskaj zgodę właściciela na publikację zdjęcia i treści opisu.
2. Przygotuj zatwierdzony WebP bez nadpisywania oryginału; do repo dodaj wyłącznie
   wersję przeznaczoną do publikacji. Projekt nie ma osobnego skryptu konwersji
   oryginałów do kanonicznych WebP.
3. Dodaj import, stabilny identyfikator i opis widocznej sceny w
   `src/data/realizacje.ts`; zachowaj proporcje i orientację kadru.
4. Zaktualizuj świadomie kontrakty galerii w `scripts/check-build.mjs` i
   `scripts/browser-qa.mjs`, jeżeli zmienia się liczba lub kolejność zdjęć;
   wykonaj build, testy i przegląd galerii zgodnie z [WERYFIKACJA.md](WERYFIKACJA.md).
5. Sprawdź diff oraz listę plików przeznaczonych do commita: oryginały,
   wykluczone ujęcia i prywatny manifest mają pozostać poza publicznym Git.

Obecne kadry przyczep opisują scenę, nie ofertę ich transportu lub holowania.
Nie dopisywać historii zdarzeń, marek ani usług na podstawie samego zdjęcia.
Potwierdzone dane firmy i kontaktów są w `src/data/site.ts`; ceny, parametry
sprzętu, opinie i obietnice czasu dojazdu wymagają rzeczywistych danych oraz
osobnej akceptacji. Baza firmy nie jest instrukcją przyjazdu do niej po awarii.
