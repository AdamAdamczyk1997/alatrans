# AlaTrans 2.0 — iteracja 2, 1.11.2026

Zakres: dopracowanie istniejącej implementacji z commita `172c85c`, na tej samej gałęzi `feat/alatrans-2-redesign`. Nowszy brief właściciela zastępuje wcześniejsze ograniczenia dotyczące nazwy, adresu i komunikatorów. Astro static, sześć podstron, szeroki kadr zdjęcia 4 i lekki frontend pozostają.

## Zmiany UX/UI

- Główna ma pięć sekcji: jasny hero, delikatnie szare usługi, grafitowy obszar działania, jasna firma, grafitowy kontakt. Usunięto pasek trzech faktów i trzy kroki, bez dodawania galerii.
- Oba przyciski wyboru usługi są grafitowe i mają te same style normalne, hover oraz focus. Dotyczy to także wyboru usług na O firmie. Przyciski mapy zachowują drugorzędną hierarchię.
- Mniej drobnych etykiet i podpisów; bez podpisu powtarzającego zawartość hero, bez małych kickerów przed każdym nagłówkiem. Sekcje mają dopasowane odstępy zamiast wcześniejszych 88 px wszędzie na desktopie: baza 68 px, hero 64/72, kontakt 64, usługi od góry 60; na telefonie łagodna redukcja do 52 px.
- Obszary pomocy i transportu tworzą dwa bloki rozdzielone linią, bez kolejnej pary kart. Grafit #293238 ma jasną typografię.
- Hero zachowuje dokładny H1 i zdjęcie 16:9. Dla 761–900 px układ jest pionowy z fotografią do 640 px i właściwym sizes. Poprawia to ciasny wcześniejszy układ przy 768 px bez zmiany headera ani pozostałych stron.
- Kontakt: dominujący telefon, potem dwa nazwane komunikatory z lokalnymi SVG. Pasek dzwonienia mobile pozostaje jedynym pływającym CTA.
- Kontakt ma dwa spójne obszary: kanały i zasięg, następnie baza i mapa. Wspólny ContactBand jest tam wyłączony, aby nie powtarzać tej samej sekcji.

## Potwierdzone dane i odnośniki

`src/data/site.ts` jest wspólnym źródłem danych dla stopki, Kontakt, O firmie, komponentów i JSON-LD.

| Pole | Wartość |
| --- | --- |
| Firma | AlaTrans – P.P.H.U. Artur Adamczyk |
| Telefon | 880 887 092; `tel:+48880887092` |
| Baza | Łącko 984, 33-390 Łącko |
| WhatsApp | https://wa.me/48880887092 |
| Messenger | https://m.me/61574526132487 |
| Profil Facebook | https://www.facebook.com/61574526132487/ |
| Google Maps | https://maps.app.goo.gl/wpTjFzKYmChzWnn86 |

Pełna nazwa jest w stopce i treści Kontakt/O firmie. Header zachowuje sam logotyp. LocalBusiness ma pełną potwierdzoną nazwę, legalName, alternateName AlaTrans, adres, telefon, hasMap i sameAs. Nie dodano NIP, cen, ładowności ani niepotwierdzonych usług. Pomoc drogowa pozostaje lokalna i 24/7; transport obejmuje Polskę i samochody z Niemiec.

## Weryfikacja mapy i kanałów

Nowy shortlink Google zwraca HTTP 200 i prowadzi do miejsca „Pomoc Drogowa Laweta Łącko AlaTrans”. Jego pin pochodzi z parametrów !3d/!4d i danych odpowiedzi: **49.57244, 20.4280569**, CID **11387420831993348612**, Place ID **ChIJCURTcQD_PUcRBMLY3uk-CJ4**. To inny obiekt niż mapa sprawdzana w iteracji 1. Nie użyto współrzędnych starego audytu ani centrum viewportu z parametru @.

Osadzenie `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s11387420831993348612` zwróciło 200, a dane embed potwierdziły adres, nazwę, telefon i domenę. Render w rzeczywistym iframe Chromium pokazał prawidłowy pin i kartę firmy, bez błędu klucza. W serwisie jest loading=lazy, title opisujący bazę, jawne wymiary oraz niezależny przycisk do zatwierdzonego Google Maps. Nie kierujemy osoby z awarią do osobistego przyjazdu do bazy.

WhatsApp zwraca 200 i przekierowuje do api.whatsapp.com/send z właściwym numerem. Messenger przekierowuje do messenger.com/t/61574526132487/, następnie do logowania (200). Facebook przekierowuje do profilu i zwraca 200. Meta przy pierwszych automatycznych próbach przejściowo zwracała 400. Działanie kont i rozmowy potwierdził właściciel; nie wysyłano wiadomości ani nie wykonywano połączeń.

## Zasoby

Pełny audyt: [ASSETS_ITERACJA_2.md](ASSETS_ITERACJA_2.md) oraz manifest SHA-256. Zachowano wszystkie unikalne źródła. Usunięto 17 śledzonych duplikatów (4 846 562 B), w tym 15 odtwarzanych kopii publicznych. `photos/` i `favicon/` są kanoniczne; npm dev/build/preview synchronizują allowlistę do public/. Wszystkie dawne URL WebP, OG, favicony i siedem przekierowań JPG działają po buildzie. Nie zmieniano Netlify TOML ani zależności.

## Testy i materiały do odbioru

Aktualne wyniki, nowe screenshoty i ograniczenia: [WERYFIKACJA.md](WERYFIKACJA.md). Pełna lista plików bieżącej iteracji: [ZMIANY.md](ZMIANY.md).

## Granice i pozostałe kwestie

Nie wykonano push, merge, publikacji ani zmian DNS/domen/SeoHost/Netlify. `main` pozostaje na `c8ac902`. Nie odczytywano poświadczeń ani Notes.txt; dwa zastane nieśledzone dokumenty użytkownika pozostają bez zmian. Nowa wersja jest przygotowana wyłącznie lokalnie.

Do przyszłego odbioru pozostają zgody na zdjęcia/ewentualna anonimizacja, fizyczny telefon i Safari oraz kontrola realnego Deploy Preview po osobnej autoryzacji. Parametry lawety, dostawczaki, przyczepy i opinie nadal są pominięte. Nie należy uznawać testów localhost za pomiar produkcyjnych CWV. Los dodatkowego starego GitHub Pages nie był zmieniany.
