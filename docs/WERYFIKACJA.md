# Weryfikacja AlaTrans 2.0 — iteracja 2, 1.11.2026

Wyniki dotyczą kodu po dopracowaniu UX/UI, potwierdzeniu danych i uporządkowaniu zasobów. Zakres zmian: [ITERACJA_2.md](ITERACJA_2.md), lista plików: [ZMIANY.md](ZMIANY.md). Raport i screenshoty zastępują wyniki poprzedniej iteracji; historyczne materiały pozostają w commicie 172c85c.

## Wymagane skrypty

| Kontrola | Wynik |
| --- | --- |
| npm run check | PASS, 26 plików, zero błędów/ostrzeżeń/hints |
| npm run build | PASS, Astro static, sześć stron i techniczne 404 |
| npm test | PASS, 176 odnośników/zasobów, dane firmy, kanały, sitemap/robots/SEO, unikalne ID i pięć sekcji |
| npm run test:browser | PASS, Chromium + WebKit, 72 kombinacje, 19 nowych screenshotów |
| npm run test:lighthouse | PASS, trzy pomiary mobile bez równoległego obciążenia |
| npm audit | Zero podatności, bez dodawania zależności |
| Dodatkowy build Node 22.23.4 | PASS: sync, Astro build, finalizacja indeksowania i ponowny npm test |
| Preview noindex | PASS: rzeczywisty lokalny build PREVIEW_NOINDEX=true, test --preview |
| Przywrócony wariant produkcyjny | PASS, brak noindex/blokady robots; ten wariant pozostaje w dist |

npm build przetestowano na lokalnym Node 26.8.1, a dodatkowo całą generację i synchronizację na docelowym Node 22.23.4. Netlify TOML, dist jako publish i przypięte zależności pozostają bez zmian. Weryfikacja preview dotyczy wygenerowanych meta, robots.txt i _headers, nie panelu Netlify.

## Przeglądarki i funkcje

Aktualny `qa-browser.json` ma passed=true, contract iteracji 2 i datę 1.11.2026. Wynik: **72 kombinacje** (6 stron × 320, 375, 390, 768, 1024, 1440 × Chromium 156.0.8078.4 / WebKit 27.2), zero błędów JS/konsoli i poziomego scrolla. Środowisko: locale pl-PL, DPR 1, reduced-motion.

Sprawdzono statusy 200 oraz rzeczywiste lokalne 404, obrazy, pojedynczy H1, unikalne ID również w 404, aktywną nawigację i dokładne linki. Menu przechodzi Enter/Escape/kliknięcie i powrót fokusu. Galeria przechodzi Enter, Escape, zamknięcie i powrót fokusu do miniatury. Sticky pozostaje dostępny i nie zakrywa końca stopki.

Nowe asercje potwierdzają pełną nazwę, adres i telefon w JSON-LD, hasMap/sameAs, nazwy w treści oraz stopce, jedną parę WhatsApp/Messenger na każdej stronie, pięć sekcji głównej, brak starych powtarzalnych bloków, identyczne style/hover/focus przycisków obu usług, opisany i leniwy iframe właściwej bazy. Na Kontakcie nie ma drugiego ContactBand.

Dodatkowa punktowa kontrola tabletu przy 768 px: zdjęcie znajduje się pod tekstem, ma 640 px szerokości i właściwy sizes. Poprawiony układ obejrzano w przeglądarce; 390/1440 oraz 320/768 przeszły także niezależny przegląd wizualny.

## Dostępność i kontrast

Axe uruchomiono **24 razy** (6 stron × 390/1440 × dwa silniki): zero wykrytych violations WCAG A/AA. Pozostało 20 grup incomplete color-contrast, łącznie 60 wskazań w wariantach; są zachowane w raporcie. Automatyczny wynik nie jest pełną certyfikacją WCAG. Istniejące symbole/strzałki i dekoracje wymagają interpretacji, a zewnętrzny komponent Google nie jest kontrolowany przez CSS serwisu.

Dodatkowa kontrola par kolorów nowego UI z CSS znajduje się w `qa-contrast-iteracja-2.json`. Nagłówki obszaru: 13,06:1; jego opisy: 8,97:1; opis kontaktu: 9,13:1; etykiety komunikatorów: 12,60:1 na graficie i 15,89:1 na jasnym tle. Ikony WhatsApp/Messenger na bieli: 5,80:1 / 5,90:1. Wszystkie te pary przekraczają 4,5:1. Focus na ciemnych sekcjach ma jasny żółty obrys, a odnośniki posiadają nazwy i odpowiednie obszary klikania.

## Lighthouse mobile

Trzy kolejne pomiary strony głównej w Lighthouse 13.5.0 na statycznym localhost preview, po zamknięciu innych przeglądarek QA. Domyślna symulacja mobile/throttling; pełne ustawienia w `qa-lighthouse.json`.

| Próba | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 100 | 100 | 100 | 100 | 1.37 s | 0 | 9 ms |
| 2 | 100 | 100 | 100 | 100 | 1.36 s | 0 | 0 ms |
| 3 | 100 | 100 | 100 | 100 | 1.39 s | 0 | 0 ms |

Wszystkie cztery kategorie mają 100 w każdym pomiarze; wymagane cele Performance/Accessibility >=90 są spełnione. To wyniki laboratoryjne głównej, nie pomiar realnych użytkowników, INP ani wydajności samej zewnętrznej mapy. Mapa ładuje się leniwie tylko na Kontakcie. Plik qa-lighthouse-initial.json jest historycznym pomiarem z pierwszej iteracji, nie aktualnym wynikiem.

Własny JS głównej pozostaje 765 B; galeria dokłada 668 B. Nowe kanały i ikony są statycznym HTML/SVG. Nie dodano bibliotek ani własnego JS do mapy. Google ładuje własne zasoby w iframe. Responsywne fotografie nadal generuje Astro; szeroki hero zachowuje eager/fetchpriority i jawne wymiary.

## Zasoby i bezpieczeństwo adresów

Pełny audyt SHA-256: [ASSETS_ITERACJA_2.md](ASSETS_ITERACJA_2.md) oraz manifest JSON. Niezależna końcowa kontrola potwierdziła 31/31 niezmienionych źródeł i referencji, 15/15 identycznych kopii w public i dist oraz siedem zachowanych redirectów JPG z istniejącymi celami. Usunięto wyłącznie 17 śledzonych duplikatów (4 846 562 B); unikalne źródła i historia Git pozostają. Hooki dev/build/preview odtwarzają stałe URL z jawnej allowlisty.

## Nowe screenshoty

Wszystkie 19 PNG pochodzą z WebKit 27.2. Pełne 390 px ukrywają pasek telefonu tylko w fotografowanym kadrze; osobne viewporty pokazują prawdziwy sticky. Obrazy w kontekście capture ładowane są eager, bez zmiany rzeczywistego loading produktu.

Capture mapy przewija ją do viewportu i czeka na rzeczywisty dokument Google, zakończenie przejścia ze statycznego podglądu, gotowe kafelki całej ramki i malowanie. Nie wymaga networkidle, bo Google utrzymuje własne żądania w tle. Nie używa makiety ani zastępczego obrazu mapy. Pełny Kontakt mobile i desktop obejrzano: mapa ma kompletne kafelki oraz właściwy pin. Szeroki hero i układ głównej również sprawdzono wizualnie.

- [glowna-hero-390.png](screenshots/glowna-hero-390.png)
- [glowna-390.png](screenshots/glowna-390.png)
- [pomoc-drogowa-viewport-390.png](screenshots/pomoc-drogowa-viewport-390.png)
- [pomoc-drogowa-390.png](screenshots/pomoc-drogowa-390.png)
- [transport-pojazdow-viewport-390.png](screenshots/transport-pojazdow-viewport-390.png)
- [transport-pojazdow-390.png](screenshots/transport-pojazdow-390.png)
- [realizacje-viewport-390.png](screenshots/realizacje-viewport-390.png)
- [realizacje-390.png](screenshots/realizacje-390.png)
- [o-firmie-viewport-390.png](screenshots/o-firmie-viewport-390.png)
- [o-firmie-390.png](screenshots/o-firmie-390.png)
- [kontakt-viewport-390.png](screenshots/kontakt-viewport-390.png)
- [kontakt-390.png](screenshots/kontakt-390.png)
- [glowna-hero-1440.png](screenshots/glowna-hero-1440.png)
- [glowna-1440.png](screenshots/glowna-1440.png)
- [pomoc-drogowa-1440.png](screenshots/pomoc-drogowa-1440.png)
- [transport-pojazdow-1440.png](screenshots/transport-pojazdow-1440.png)
- [realizacje-1440.png](screenshots/realizacje-1440.png)
- [o-firmie-1440.png](screenshots/o-firmie-1440.png)
- [kontakt-1440.png](screenshots/kontakt-1440.png)

## Potwierdzenia i ograniczenia

Nazwa i adres, telefon oraz WhatsApp/Messenger zostały potwierdzone przez właściciela w nowym briefie. Routing nowych linków odczytano HTTP; Google Maps potwierdził miejsce, adres, telefon i pin, następnie rzeczywisty render iframe. Szczegóły identyfikatorów i źródeł są w ITERACJA_2.md. Nie wysyłano wiadomości ani nie inicjowano połączeń. Meta może wymagać logowania i odmawiać części automatycznych odczytów.

Do osobnego odbioru pozostają fizyczny telefon/Safari, rzeczywisty Netlify Deploy Preview i jego nagłówki, zgody na fotografie oraz ewentualna anonimizacja. Parametry sprzętu, niepotwierdzone usługi i opinie nadal pominięto. Nie wykonano zewnętrznego Google Rich Results Test ani pomiaru produkcyjnych CWV.

Wszystkie wymagane skrypty wykonano. Nie wykonywano push, merge, publikacji ani zmian DNS/domen/SeoHost/Netlify. Lokalny main nadal c8ac902; produkcja alatrans.pl nie była modyfikowana. Niezwiązane dokumenty użytkownika pozostały bez zmian, Notes.txt i poświadczenia nie były odczytywane ani dodawane do Git.
