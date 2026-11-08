# AlaTrans 2.0 — specyfikacja przebudowy dla Agenta Codex

**Status:** specyfikacja wykonawcza v1.0, 31 października 2026 r.  
**Język serwisu:** polski (`lang="pl"`).  
**Projekt:** AlaTrans / P.P.H.U. Artur Adamczyk, pomoc drogowa i transport pojazdów, Łącko.  
**Docelowa domena:** `https://alatrans.pl/`.  
**Repozytorium:** `https://github.com/AdamAdamczyk1997/alatrans`.  
**Załączone materiały:** `reference/makieta_strony_glownej.html`, zrzuty ekranów w `reference/`, zdjęcie `assets/laweta_car_4.webp`, logo `assets/logo.png`.

> **INSTRUKCJA NADRZĘDNA DLA CODEXA:** Przebuduj istniejący serwis w **tym samym repozytorium**, zachowując istniejącą domenę i hosting. Nie publikuj samodzielnie na produkcji, nie zmieniaj DNS ani ustawień domen. Pracuj na nowej gałęzi i przygotuj Pull Request (jeżeli masz uprawnienia), aby właściciel mógł ocenić podgląd Netlify. Nie wymyślaj usług, danych firmy, czasów dojazdu, opinii, cen ani parametrów lawety. Najpierw wykonaj audyt rzeczywistego repozytorium (punkt 2); przesłane pliki są materiałami referencyjnymi, nie gwarantowanym obrazem aktualnej produkcji.

---

## 1. Cel projektu i kolejność ważności

### 1.1. Cel biznesowy

Odbudować witrynę AlaTrans tak, by mała, lokalna firma wyglądała **solidnie, nowocześnie, wiarygodnie**, bez sugerowania rozmiaru przedsiębiorstwa, którego nie ma. Dwie równorzędne usługi: **pomoc drogowa 24/7** oraz **transport pojazdów**. Potencjalny klient ma od razu zrozumieć ofertę i łatwo nawiązać kontakt.

- **Podstawowa konwersja:** połączenie telefoniczne `tel:+48880887092`.
- **Dodatkowa konwersja:** kontakt przez rzeczywisty profil Facebook/Messenger.
- **Priorytet mobile:** klient po awarii może być zdenerwowany, w ruchu lub przy drodze — szybkie działanie bez szukania numeru.
- **Priorytet wizerunkowy:** autentyczne zdjęcia, rzeczowe treści, porządek, brak nachalnego marketingu.
- **Minimalizm:** niewiele podstron, brak tekstów pisanych wyłącznie „pod SEO”, brak bloga lub formularzy bez potrzeby.

### 1.2. Źródła prawdy (w przypadku konfliktu)

1. **Najnowsze decyzje właścicieli/koordynatora (w tej specyfikacji)** — są nadrzędne wobec starszych makiet oraz obecnych treści.
2. **Aktualny kod z gałęzi produkcyjnej w repozytorium** — punkt wyjścia do migracji, nazwy zasobów, istniejące poprawki i integracje.
3. **Załączona zaakceptowana makieta** — główne źródło układu, charakteru wizualnego i proporcji. Traktuj jako wzorzec, NIE jako kod produkcyjny; ma tymczasowe odsyłacze `#...`.
4. **Zdjęcia i dane w repozytorium** — materiały do wykorzystania po zweryfikowaniu aktualności.
5. `alatrans.zip` z lipca 2025 r. i luźne pliki HTML/CSS/JS — materiały archiwalne, nie używaj ich do bezrefleksyjnego nadpisywania aktualnej gałęzi.

**Ważna ewolucja decyzji:** wcześniejszy pomysł „tekst na pełnoekranowym zdjęciu” został zastąpiony i **ostatecznie odrzucony** na rzecz jasnego, dwukolumnowego hero: **tekst osobno, zdjęcie obok**; na mobile tekst i przyciski nad zdjęciem. Jasny motyw jest zatwierdzony przez właściciela i żonę oraz osobę prowadzącą projekt. Nie wracaj do ciemnej wersji A ani foto-tła z tekstem.

### 1.3. Poza zakresem

Nie budować sklepu, CMS-a, bloga, panelu użytkownika, kont, koszyka, płatności, systemu rezerwacji, chatbota, formularza zbierającego dane, mapy tras użytkownika, wyszukiwarki usług, animacji 3D ani sztucznych sekcji „statystyki/lat doświadczenia”. Nie dodawać obrazów AI lub stockowych zamiast zdjęć AlaTrans. Nie zmieniać logotypu ani domeny.

---

## 2. Obowiązkowy audyt repozytorium i infrastruktury — PRZED zmianami

1. Ustal gałąź produkcyjną, aktualny commit i zawartość katalogu głównego repozytorium. Zweryfikuj, czy są `netlify.toml`, `CNAME`, `_redirects`, konfiguracje GitHub Pages, pliki projektu, workflow, zdjęcia, fonty, favicony oraz `.gitignore`.
2. Sprawdź faktyczną konfigurację budowania repozytorium i aktualne linki w działającej witrynie. Nie zakładaj, że pliki dostarczone obok specyfikacji odpowiadają 1:1 ostatniemu deployowi.
3. Zidentyfikuj już działające: kontakt telefoniczny, stronę FB, mapę bazy, favicon, Open Graph, dane strukturalne, zdjęcia i galerię. Zachowaj działające funkcje, jeśli nadal służą uzgodnionemu UX.
4. Sprawdź dostępne zdjęcia `photos/laweta_car_1...7`, ewentualne `info_card_*` oraz legalność/autentyczność opisów. Nie zmieniaj zawartości zdjęć ani nie twórz sztucznych realizacji.
5. Sprawdź `git status`, przygotuj osobną gałąź (przykładowo `feat/alatrans-2-redesign`), nie pracuj na `main`.
6. Sporządź krótki raport z audytu w PR: stan zastany, proponowany stack, pliki zmienione i istotne ryzyka. Jeśli odkryjesz integrację lub regułę wdrożeniową, której specyfikacja nie przewiduje, nie usuwaj jej w ciemno.
7. **Bezpieczeństwo:** nie kopiuj do nowych plików `Notes.txt`, haseł, tokenów GitHub, kluczy API ani sekretów. Nie dodawaj ich do commita, logów lub wyników PR. Nie umieszczaj plików konfiguracyjnych z poświadczeniami w `public/`.

### 2.1. Potwierdzona infrastruktura — NIE zmieniać

- Repozytorium GitHub `AdamAdamczyk1997/alatrans` połączone z Netlify przez Continuous Deployment.
- Właściwy, istniejący projekt Netlify (nie tworzyć drugiego projektu dla tej domeny).
- Główna domena `alatrans.pl`; `www.alatrans.pl` przekierowuje do wersji bez `www`.
- HTTPS: aktywny certyfikat Let's Encrypt zarządzany przez Netlify.
- SeoHost jest rejestratorem domeny; domena jest delegowana do Netlify DNS przez serwery `dns1.p02.nsone.net` do `dns4.p02.nsone.net`.
- Stan początkowy z panelu Netlify: statyczna publikacja, brak komendy build i katalogu publish; przy przejściu na generator statyczny trzeba ustawić build i publish, ale **nie ruszać repozytorium/domeny/DNS**.
- Produkcyjne aktualizacje gałęzi `main` mogą uruchamiać automatyczny deploy. **Bez merge do `main` bez zgody właściciela.**

### 2.2. Technologia — rekomendacja i reguła wyboru

**Preferowany stack: Astro jako generator statycznego HTML + zwykły CSS + minimalny JS (menu, galeria).** Dlaczego: sześć stron dzielących nagłówek, stopkę, style i dane kontaktowe bez powielania; HTML generowany w buildzie, bez konieczności SSR i ciężkiego JavaScriptu na telefonie. Nie używać React, Next.js, Tailwind, dużej biblioteki komponentów ani Netlify Functions bez jednoznacznej korzyści.

Jeżeli audyt pokaże, że repozytorium ma sensowną, utrzymywaną architekturę bez Astro, można ją zachować **tylko jeśli** zapewnia strony z prawdziwymi URL, współdzielone komponenty, SEO i łatwe utrzymanie. W raporcie PR wyjaśnij wybór. Nie zmieniaj technologii dla samej zmiany.

Dla Astro static: `npm run build`, folder `dist/`, deklaratywny `netlify.toml` na poziomie repozytorium lub równoważne ustawienia. Nie jest potrzebny adapter SSR. Wybierz wersję Astro i Node zgodną z aktualną dokumentacją, utrwal wersje w lockfile i określ wersję Node; panel Netlify obecnie wskazuje serię Node 22.x, ale zgodność minimalnej wersji trzeba sprawdzić przed buildem.

Proponowany układ przy Astro (dopasuj do istniejącego repo):

```text
src/
  components/
    SiteHeader.astro
    SiteFooter.astro
    MobileCallBar.astro
    ServiceCard.astro
    ContactActions.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    pomoc-drogowa/index.astro
    transport-pojazdow/index.astro
    realizacje/index.astro
    o-firmie/index.astro
    kontakt/index.astro
  styles/
    global.css
  data/
    site.ts
public/
  photos/ ...
  favicon/ ...
  robots.txt
astro.config.mjs
netlify.toml
package.json
```

Powyższe to sugestia struktury, nie wymóg co do nazw. Wszelkie linki i SEO muszą działać na gotowym statycznym deployu Netlify, nie tylko w trybie `dev`.

---

## 3. Potwierdzone dane biznesowe (nie zgadywać pozostałych)

| Obszar | Informacja / status |
|---|---|
| Nazwa marki | **AlaTrans** |
| Nazwa firmy | **P.P.H.U. Artur Adamczyk** (obecnie widoczna w kodzie; zweryfikować oficjalną pisownię przed wydaniem) |
| Numer telefonu | **880 887 092**; technicznie `tel:+48880887092` |
| Dostępność pomocy drogowej | **24/7**, także nocą i w święta — potwierdzone |
| Baza | **Łącko**, adres używany dotychczas: **Łącko 984, 33-390 Łącko** — przed wydaniem potwierdzić format i aktualność |
| Obszar pomocy drogowej | **Łącko, Nowy Sącz, Stary Sącz i szersze okolice** — potwierdzone |
| Obszar transportu | **Cała Polska, transport samochodów z Niemiec** — potwierdzone |
| Ceny | **Wycena indywidualna** po kontakcie; nie publikować zmyślonych cenników |
| Kontakt główny | Telefon |
| Kontakt alternatywny | Facebook/Messenger — istniejący profil: `https://www.facebook.com/profile.php?id=61574526132487`; **sprawdź działanie i właściwy sposób otwierania rozmowy** |
| Lokalizacja bazy | Istniejący link do mapy `https://maps.app.goo.gl/oMyGTvmxW8kohAQW8` — sprawdź przed wydaniem |
| E-mail | W starszej stronie występuje adres e-mail, ale uzgodnione główne kanały to telefon i Messenger; nie eksponuj e-maila bez akceptacji |
| Opinie | Sekcja tylko po pozyskaniu prawdziwych, zweryfikowanych opinii; na dziś **nie wstawiać** |

### 3.1. Potwierdzone usługi pomocy drogowej

- Holowanie pojazdów (usługa podstawowa).
- Wymiana koła na miejscu.
- Wyciąganie pojazdów z rowu.
- Uruchamianie samochodów z kabli.
- Dowóz paliwa.

Nie pisać „dojazd w 15 minut”, „najtańszy”, „gwarantowany czas”, „zawsze wolny termin” itp. Dojazd zależy od miejsca, warunków i dostępności, mimo dyżuru 24/7.

### 3.2. Potwierdzone rodzaje transportu

- Samochody osobowe.
- Motocykle i quady.
- Maszyny i sprzęt budowlany/rolniczy — **tylko mieszczące się w możliwościach sprzętu**, bez twierdzeń o przewożeniu wszystkich maszyn.
- Zlecenia w Polsce; samochody z Niemiec.

### 3.3. NIEpotwierdzone — nie reklamuj jako pewnych

- Transport samochodów dostawczych.
- Transport przyczep kempingowych.
- Ładowność, dopuszczalna masa i wymiary platformy.
- Szczegółowe wyposażenie (np. wyciągarka, typ pasów, najazdy) bez sprawdzenia.
- Prawnie/technicznie szczegółowe ograniczenia realizacji zleceń.

**Reguła:** jeśli informacja jest niepotwierdzona, pomiń ją w publicznych treściach i wpisz na końcu raportu Codexa do „Pytania do właściciela”. Nie zastępuj jej wymyślonymi liczbami ani „placeholderem” widocznym na produkcji.

---

## 4. Architektura informacji i adresy URL

Docelowo **sześć stron**, bez kolejnych podstron na siłę:

| Strona | URL | Funkcja |
|---|---|---|
| Główna | `/` | Wizerunek + szybki wybór usługi + telefon |
| Pomoc drogowa | `/pomoc-drogowa/` | Zakres pomocy, gdzie działamy, 24/7, telefon |
| Transport pojazdów | `/transport-pojazdow/` | Co transportujemy, obszar Polska/Niemcy, wycena |
| Realizacje | `/realizacje/` | Galeria autentycznych zdjęć |
| O firmie | `/o-firmie/` | Krótka, wiarygodna historia firmy i sprzętu |
| Kontakt | `/kontakt/` | Telefon, Messenger, baza w Łącku, obszar działania |

**Menu desktop (dokładnie 5 pozycji):** Pomoc drogowa · Transport pojazdów · Realizacje · O firmie · Kontakt. Logo wraca na `/`; „Strona główna” nie musi zajmować szóstej pozycji. Na mobile burger z tymi samymi pięcioma pozycjami. Wszystkie linki prowadzą na prawdziwe ścieżki; żaden link nie może prowadzić do `#kontakt` tylko dlatego, że makieta tak robiła.

Główna ma samodzielnie odpowiadać na pytania klienta bez konieczności nawigowania po całym serwisie. Podstrony poszerzają szczegóły, nie duplikują 1:1 treści.

---

## 5. Zatwierdzony design system

### 5.1. Charakter wizualny

**Obowiązkowo jasny, minimalistyczny, autentyczny i lokalny.** Punktem odniesienia jest `reference/makieta_strony_glownej.html` oraz obrazy w `reference/`. Projekt desktop i mobile ma zachować ich rozpoznawalny charakter, układ, relacje typografii i białej przestrzeni.

- Tło: biel i bardzo jasna ciepła/off-white szarość; tekst grafitowy.
- Akcent: **oszczędna, ciepła żółć** nawiązująca do pasów na lawecie (np. okolice `#F3C749`; projekt może dopracować odcień pod kątem kontrastu).
- Delikatne obramowania, umiarkowane promienie zaokrągleń, bez ciężkich cieni i powtarzalnych „pudełek wszędzie”.
- Duże, czytelne, ale nie krzykliwe nagłówki; systemowa lub lekka font-family bez pobierania kilku fontów i ich odmian.
- Prawdziwe logo i fotografie. Bez animowanego tła, slidera/carousela w hero i stockowych ilustracji.
- Ciemny kontaktowy pas na końcu strony i ciemny główny przycisk są dopuszczalne także w **jasnym** motywie (jak na zaakceptowanej makiecie).
- Brak korporacyjnych claimów („lider”, „setki zadowolonych klientów”, „nowoczesna flota”), których nie da się udokumentować.

Przykładowe tokeny z makiety (wartości orientacyjne, nie sztywny pixel-perfect):

```css
:root {
  --bg: #fcfcfa;
  --surface: #ffffff;
  --surface-soft: #f6f7f5;
  --text: #1d2327;
  --muted: #61696e;
  --border: #e6e9e8;
  --accent: #f3c749;
  --radius-card: 20px;
  --container: 1160px;
}
```

### 5.2. Responsywność

- Desktop: szerokość treści około 1100–1160 px, hero w dwóch kolumnach: **tekst po lewej, zdjęcie po prawej**.
- Mobile: logo + menu, niżej nagłówek, opis, **dwa przyciski usług w pionie**, numer telefonu w treści, a dopiero potem zdjęcie lawety. Przypięty pasek z telefonem na dole.
- Tablet: naturalna adaptacja, bez poziomego przewijania; nie ściskaj pięciu elementów menu ponad miarę.
- Zadbaj o obszary dotykowe min. około 44×44 px, bezpieczny odstęp od krawędzi, `env(safe-area-inset-bottom)` dla dolnego paska na iPhone.
- Nagłówek, obraz i telefon są widoczne/osiągalne wcześnie na mobile, bez banerów zakrywających viewport.

### 5.3. Kluczowa poprawka względem ZAAKCEPTOWANEJ makiety — szerszy kadr zdjęcia

Użytkownik zaakceptował całą stronę **z jedną zmianą**: na zdjęciu w hero chce widzieć **więcej samochodu/lawety**, szczególnie nadwozia i platformy, a nie sam ciasno wycięty przód. **Preferowane zdjęcie:** `photos/laweta_car_4.webp` (w materiałach `assets/laweta_car_4.webp`, oryginalny kadr 1600×900).

- Nie stosuj pionowego `object-fit: cover` w wąskim i wysokim prostokącie, jeśli ucina większą część pojazdu.
- Dobierz szerszy format ramki lub `object-fit: contain` na odpowiednim tle, ewentualnie elastyczny `aspect-ratio` bliższy 16:9/16:10 i rozsądny `object-position`.
- Na desktopie pokaż czytelnie kabinę **i** istotną część platformy; na mobile również nie obcinaj przodu ani platformy bez powodu.
- Zachowaj spokojny wygląd, zaokrąglenia i delikatny żółty detal tła z makiety, chyba że przeszkadzają kadrowi.
- Zapewnij obraz responsywny, podaj `width`/`height` i priorytet pobrania hero. Nie lazy-loaduj obrazu LCP.
- Po zmianie kadrów **koniecznie porównaj screenshoty desktop/mobile** z załącznikami. To jedyne zaakceptowane odstępstwo układowe od makiety, poza technicznymi poprawkami UX i linków.

---

## 6. Strona główna — specyfikacja sekcja po sekcji

### 6.1. Header i nawigacja

- Logo `AlaTrans` po lewej, kliknięcie → `/`.
- Desktop: pięć pozycji menu w uzgodnionej kolejności + widoczny, klikalny przycisk z numerem telefonu po prawej.
- Mobile: logo, przycisk menu (`aria-expanded`, `aria-controls`, opis dostępny dla screen readerów); rozwijane pełne menu. Klawiatura/ESC, widoczny focus, brak zablokowania dolnego CTA.
- Header może być sticky, ale jego wysokość nie może zasłaniać głównej treści.

### 6.2. Hero — najważniejszy ekran

**Nagłówek H1 musi brzmieć dokładnie:**

> **Pomoc drogowa 24/7 – holowanie i transport pojazdów**

Mniejsza etykieta nad H1: **„Łącko i okolice · dostępność 24/7”**.

Zatwierdzony kierunek tekstu poniżej nagłówka (można redakcyjnie skrócić, bez zmiany sensu):

> „Pomagamy na drodze w Łącku, Nowym Sączu, Starym Sączu i okolicach. Transportujemy pojazdy na terenie całej Polski oraz samochody z Niemiec.”

**Dwa przyciski WYBORU USŁUGI** obok siebie desktop / jeden pod drugim mobile:

1. „Pomoc drogowa” → `/pomoc-drogowa/` (bardziej wyrazisty, ciemny).
2. „Transport pojazdów” → `/transport-pojazdow/` (jasny, obrysowany).

**Numer telefonu ma także występować w treści hero:** krótka etykieta „Potrzebujesz pomocy? Zadzwoń bezpośrednio” i duży klikalny numer **880 887 092** → `tel:+48880887092`.

Zdjęcie hero: zatwierdzony `laweta_car_4`, patrz **5.3**. **Bez tekstu na zdjęciu.**

### 6.3. Krótki pasek 3 faktów

Trzy krótkie komunikaty:

- Pomoc drogowa 24 godziny na dobę.
- Transport pojazdów po Polsce i z Niemiec.
- Indywidualna wycena.

Na mobile wyświetlać czytelnie jeden pod drugim; nie tworzyć logotypów/odznak certyfikatów bez potwierdzenia.

### 6.4. Sekcja „Dwie usługi. Prosty kontakt.”

Dwie lekkie karty, jak w makiecie:

**Pomoc drogowa:** „Holowanie, wyciąganie pojazdów z rowu, wymiana koła, dowóz paliwa i uruchamianie auta z kabli.” CTA „Poznaj pomoc drogową” → `/pomoc-drogowa/`.

**Transport pojazdów:** „Przewóz samochodów osobowych, motocykli, quadów oraz wybranych maszyn — na terenie Polski i samochodów z Niemiec.” CTA „Poznaj transport” → `/transport-pojazdow/`.

Obie usługi równorzędne. Nie dodawać kart usług, których nie potwierdzono.

### 6.5. Sekcja „Trzy proste kroki”

1. **Kontaktujesz się z nami** — dzwonisz i opisujesz sytuację lub planowany transport.
2. **Ustalamy szczegóły** — lokalizacja, rodzaj pojazdu, dostępność i indywidualna wycena.
3. **Realizujemy usługę** — po uzgodnieniu warunków przyjeżdżamy na miejsce lub odbieramy pojazd.

Nie obiecywać automatycznego przyjęcia każdego zlecenia.

### 6.6. Sekcja „Lokalnie i w trasie”

Dwa zrozumiałe bloki:

- **Pomoc drogowa:** Łącko, Nowy Sącz, Stary Sącz i szersze okolice. Dyżur 24/7.
- **Transport pojazdów:** cała Polska i transport samochodów z Niemiec, po ustaleniu warunków.

Nie używać komunikatu „dojedziemy wszędzie natychmiast” ani twierdzenia, że pomoc awaryjna działa na terenie całej Polski tak jak transport planowany.

### 6.7. Sekcja „O nas”

Nagłówek: **„AlaTrans — lokalna firma, konkretna pomoc”**.

Rzeczowy, krótki tekst: „AlaTrans to firma z Łącka zajmująca się pomocą drogową i transportem pojazdów. Stawiamy na bezpośredni kontakt i jasne ustalenie zakresu usługi.”

Wyróżniony odnośnik: „Chcesz zobaczyć naszą lawetę i wykonane przewozy? Przejdź do realizacji” → `/realizacje/`. Nie umieszczać tu mini-galerii — użytkownik **wyraźnie wybrał tylko osobną stronę Realizacje**. Można dodać dyskretny link do `/o-firmie/`.

### 6.8. Sekcja kontaktowa i stopka

- Ciemniejszy blok kontaktowy jak w makiecie, pomimo jasnego całego serwisu.
- Nagłówek: **„Potrzebujesz lawety albo wyceny transportu?”**
- Numer telefonu widoczny, duży i klikalny.
- Link do Facebooka/Messengera jako kanału alternatywnego — nie nazywać linku „Otwórz rozmowę”, jeśli nie prowadzi faktycznie do rozmowy.
- Lokalizacja oznaczona jednoznacznie jako **baza lawety w Łącku, a nie punkt przyjęć klientów**. Nie zachęcać osoby z awarią do nawigowania do bazy.
- Stopka: AlaTrans, nazwa prawna po weryfikacji, rok automatycznie lub aktualny, linki do kontaktu i usług, ewentualne niezbędne informacje prawne.
- Nie dodawać nadmiarowego przycisku „dojazd do nas” na głównej.

### 6.9. Sticky CTA dla mobile

Pasek widoczny przy dole ekranu na **każdej** podstronie: **„Zadzwoń: 880 887 092”**, całe pole klikalne jako `tel:+48880887092`. Wyraźny kontrast, żółty akcent dopasowany do stylu; zapas miejsca pod treścią i stopką, aby niczego nie zakrywać. Działa przy otwartym menu, przy lightboxie należy zachować właściwą kolejność warstw i unikać nakładania przycisków. Dla desktopu sticky pasek niepotrzebny, bo telefon jest w headerze.

---

## 7. Podstrony — docelowy zakres i treści

Wspólne: ten sam header, stopka, pas kontaktowy/dostępny telefon, identyfikacja wizualna, ścieżka powrotu lub czytelne menu, jeden H1 i własne title/description. Każda ma być wartościowa, ale krótka, bez ścian tekstu.

### 7.1. `/pomoc-drogowa/`

**H1:** „Pomoc drogowa 24/7 — Łącko i okolice”.

Zawartość w tej kolejności:

1. Krótkie intro: awarie i unieruchomione pojazdy, całodobowy kontakt.
2. Czytelna lista usług: holowanie, wyciąganie z rowu, wymiana koła, uruchamianie z kabli, dowóz paliwa.
3. Obszar: Łącko, Nowy Sącz, Stary Sącz i okolice.
4. Jak zgłosić: miejsce zdarzenia, marka/rodzaj pojazdu, rodzaj problemu; w razie niebezpieczeństwa priorytet bezpieczeństwa, a numer alarmowy 112 tylko jeśli sytuacja rzeczywiście tego wymaga (bez robienia „poradnika ratunkowego”).
5. Wyjaśnienie „cena ustalana indywidualnie” i CTA telefoniczny.

Bez deklarowania napraw mechanicznych czy transportu ciężarówek. **Uwaga:** pomoc drogowa i planowany transport mają odrębne komunikaty geograficzne.

### 7.2. `/transport-pojazdow/`

**H1:** „Transport pojazdów — Polska i samochody z Niemiec”.

Zawartość:

1. Krótkie intro transportu planowanego.
2. Kategorie: auta osobowe, motocykle i quady, wybrane maszyny/sprzęt budowlany lub rolniczy, z zastrzeżeniem doboru zlecenia do możliwości lawety.
3. Obszar: Polska, sprowadzanie/przewóz samochodów z Niemiec w uzgodnionym zakresie (nie obiecywać innych krajów).
4. Jak uzyskać wycenę: miejsce załadunku i rozładunku, typ pojazdu, orientacyjna masa/wymiary jeśli wymagane, termin; indywidualna wycena.
5. CTA telefon i FB/Messenger.

Nie podawać danych o ładowności, masie ani wymiarach, póki właściciel ich nie potwierdzi. Nie potwierdzać przewozu dostawczaków i przyczep.

### 7.3. `/realizacje/`

**H1:** „Realizacje AlaTrans”.

- Fotografie z repozytorium (np. `laweta_car_1...7` i inne rzeczywiście istniejące, po selekcji), pokazujące lawetę, pojazdy i wykonane zlecenia.
- Na desktopie estetyczna siatka, na telefonie jeden lub dwa elementy w rzędzie zależnie od rozdzielczości i czytelności.
- Obrazy dobrze wykadrowane; możliwość powiększenia jest opcjonalna, ale jeśli istnieje, musi być dostępna klawiaturą (Enter, Escape, powrót fokusu), z przyciskiem zamknięcia i sensownym opisem alternatywnym.
- Nie dopisywać wymyślonych dat, lokalizacji, relacji klientów, typów ładunków lub historii zleceń. Jeśli wiadomo tylko, że zdjęcie pokazuje lawetę, użyj neutralnego opisu.
- Uwaga na duplikaty i zbyt ciężkie obrazy; `loading="lazy"` dla zdjęć poza pierwszym ekranem, używaj WebP/AVIF z fallbackiem, gdzie to potrzebne.
- Kontakt na końcu, nie wbudowany feed z Facebooka i nie formularz.

### 7.4. `/o-firmie/`

**H1:** „O firmie AlaTrans”.

- Krótkie przedstawienie małej firmy z Łącka, nazwa prawna po weryfikacji.
- Oferta: pomoc drogowa i transport pojazdów, dwa filary.
- Wykorzystanie **autentycznego** zdjęcia lawety lub właściciela tylko jeśli jest dostępne i zatwierdzone.
- Krótkie informacje o sposobie ustalania warunków zlecenia, bez sztucznych „misji”, certyfikatów i wymyślonej historii/stażu.
- Linki do realizacji i kontaktu.

### 7.5. `/kontakt/`

**H1:** „Kontakt — AlaTrans”.

- Najważniejszy element: `880 887 092` i aktywny `tel:+48880887092`.
- Dodatkowy kanał: Facebook/Messenger, z faktycznie działającym odnośnikiem.
- Lokalizacja bazy: Łącko, adres po weryfikacji.
- Informacja „Baza sprzętu, nie punkt obsługi klienta” w przyjaznej formie; do klienta z awarią dojeżdża laweta.
- Rozróżnienie obszarów (pomoc drogowa w regionie; transport Polska/Niemcy).
- Mapa może być linkiem do Map Google lub oszczędnym osadzonym komponentem, ale nie jest warunkiem pierwszej publikacji i nie może pogarszać szybkości strony. Preferuj lekką miniaturę/link zamiast ciężkiego iframe startowego.
- Brak formularza kontaktowego, WhatsApp, publicznego czatu i nowych kanałów bez zgody właściciela.

---

## 8. UX, dostępność i wydajność — warunki jakości

1. **Semantic HTML:** `header`, `nav`, `main`, `section`, `footer`; jeden H1 na stronę; poprawna kolejność nagłówków; karty linkujące jako prawidłowe elementy, nie klikalne `div` bez obsługi klawiatury.
2. **Nawigacja:** prawdziwe URL i działające menu mobile; aktywna strona `aria-current="page"`, `aria-expanded` na burgerze, link „Pomiń do treści” dla klawiatury, czytelny focus.
3. **Telefon:** w headerze desktop, w hero i przypięty na dole mobile na każdej stronie; `tel:` testowany na realnym telefonie. Unikaj konkurujących sticky przycisków.
4. **Dostępność:** teksty i kontrolki z kontrastem odpowiadającym WCAG 2.2 AA (tam, gdzie ma zastosowanie); odróżnienie linków nie tylko kolorem; alt opisujący zdjęcie; dekoracyjne tła bez `alt`; menu i galeria sterowalne klawiaturą; respektowanie `prefers-reduced-motion`.
5. **Wydajność:** zoptymalizowane zdjęcia, responsywne `srcset/sizes`, poprawne rozmiary zasobów i zapobieganie CLS; hero LCP nie lazy; żadnych zbędnych bibliotek czy zewnętrznych skryptów marketingowych. Cel audytowy Lighthouse mobile Performance ≥90 i Accessibility ≥90 **w stabilnych warunkach testu**, a nie jako obietnica, oraz orientacyjnie CWV LCP ≤2,5 s, CLS ≤0,1, INP ≤200 ms przy realnych pomiarach — z raportowaniem ograniczeń.
6. **Cross-device:** 320, 375/390, 768, 1024, 1440 px, Safari i Chrome; zero poziomego scrolla, czytelna typografia i CTA nie zakrywa treści.
7. **Rzeczywiste zasoby:** nie korzystać z makiety jako base64 w kodzie docelowym; zachować osobne zoptymalizowane pliki w `public/` lub w Astro assets.
8. **JS:** minimalny, defensywny; nie pozostawiać błędów w konsoli i martwych selektorów; obsługa otwarcia/zamknięcia menu.

---

## 9. SEO lokalne i techniczne

### 9.1. Metadane i indeksowalność

- Każda strona ma unikatowy, zwięzły `<title>` i `<meta name="description">`, odpowiadający treści; bez powielonych meta description (obecny upload ma dwie deklaracje).
- Jeden kanoniczny adres na podstronę, zawsze absolutny, np. `https://alatrans.pl/pomoc-drogowa/`.
- Poprawne Open Graph (`og:url`, `og:title`, `og:description`, absolutny `og:image`); sensowny obraz podglądu i istniejący favicon.
- `sitemap.xml` z sześcioma kanonicznymi stronami, `robots.txt` pozwalający indeksować produkcję, bez przypadkowego `noindex` przeniesionego z makiety.
- Domena z `www` przekierowuje do wersji bez `www` już na Netlify — nie twórz sprzecznych reguł.
- Strony mają HTML widoczny dla crawlera bez konieczności uruchamiania JS.
- Zachowaj istniejące adresy/odnośniki tak, by nie zrobić niepotrzebnych 404; jeśli zmienią się stare ścieżki, dodaj prawidłowe przekierowania 301. Nie ustawiaj catch-all SPA → `/`, bo ukrywa błędy 404.
- Weryfikuj `200` dla wszystkich sześciu URL i `404` dla nieistniejącego URL na buildzie Netlify.

### 9.2. Lokalne dane firmy i wiarygodność

- Dane strukturalne JSON-LD oparte na rzeczywistym `LocalBusiness` / właściwym typie, z numerem, domeną, adresem i godzinami 24/7. Obecne `AutoRepair` jest potencjalnie mylące, bo firma oferuje pomoc drogową i transport, nie potwierdzono warsztatu samochodowego; nie powielaj go bez analizy.
- Jedna spójna nazwa i dane kontaktowe w HTML, stopce, schema i metadanych. Przed wydaniem potwierdź oficjalną pisownię firmy i adres.
- Żadnych fikcyjnych `aggregateRating`, `review`, cen, obszarów czy wielu „stron miejscowości” z powieloną treścią.
- Zrób podstawową listę czynności ręcznych po publikacji: zweryfikuj Google Search Console i prześlij sitemap (tylko jeśli właściciel ma dostęp; nie twórz kont bez zgody).

Przykładowe, nieobowiązkowe kierunki tytułów (dopracować ręcznie pod długość i unikalność):

| URL | Kierunek title |
|---|---|
| `/` | AlaTrans — Pomoc drogowa 24/7 i transport pojazdów |
| `/pomoc-drogowa/` | Pomoc drogowa 24/7 — Łącko, Nowy Sącz \| AlaTrans |
| `/transport-pojazdow/` | Transport pojazdów — Polska i Niemcy \| AlaTrans |
| `/realizacje/` | Realizacje i zdjęcia lawety \| AlaTrans |
| `/o-firmie/` | O firmie — AlaTrans z Łącka |
| `/kontakt/` | Kontakt — Pomoc drogowa AlaTrans, Łącko |

**Uwaga:** w gotowych znacznikach `<title>` użyj zwykłego separatora `|`, bez znaków escape z tabeli Markdown.

---

## 10. Stabilność wdrożenia na GitHub + Netlify

### 10.1. Bezpieczny tryb pracy

1. Nowa gałąź — **nie wypychaj zmian bezpośrednio do produkcyjnego `main`**.
2. Lokalny build i testy. Nie kasuj istniejących plików produkcyjnych, dopóki generator nie produkuje kompletnego, działającego zestawu plików.
3. Otwórz PR do `main` (jeżeli masz dostęp). Netlify powinno wygenerować **Deploy Preview** dla PR. Użytkownik testuje na telefonie i komputerze.
4. Zrób porównanie z zaakceptowaną makietą i popraw kadr zdjęcia zgodnie z 5.3.
5. Zatwierdzenie człowieka → dopiero wtedy merge do `main`, monitorowanie deployu i kontrola wszystkich linków, domen, SEO i telefonu.
6. Plan rollback: zachowaj ID ostatniego poprawnego deployu/commit, aby dało się wrócić do poprzedniej wersji bez zmieniania DNS.

**Uwaga:** Deploy Preview to osobny adres, nie testuj tego przez zmianę domeny `alatrans.pl`. Nie włączaj globalnego `noindex` w produkcji. Osobne deploy previews Netlify mają odpowiednie mechanizmy ochrony przed indeksacją, ale sprawdź rzeczywisty nagłówek w podglądzie.

### 10.2. Konfiguracja Netlify dla Astro static (jeżeli wybrano Astro)

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Nie ustawiaj `NODE_VERSION` na zgadywaną wersję — zweryfikuj requirements użytej wersji Astro i ustaw zgodnie z nimi w projekcie/Netlify. Nie wprowadzaj funkcji serwerowych, adaptera SSR, rewrite `/foo` → `/index.html` bez potrzeby.

---

## 11. Plan implementacji w etapach i rezultat każdego etapu

### Faza 0 — audyt i zabezpieczenie [blokuje kolejne]

- Analiza repo, stanu produkcyjnego i plików.
- Ustalenie finalnego stacku i zależności.
- Gałąź robocza, niezależna od `main`.
- Raport stanu i ryzyk, spis treści zachowanych/usuniętych.

**Odbiór:** brak zmian produkcyjnych; jest zrozumiały raport, branch i plan migracji.

### Faza 1 — fundament [stack, layout, design tokens]

- Wspólny layout, komponenty header/footer/mobile call.
- System CSS, fonty, obrazki; pełne ścieżki do sześciu stron, nawet jeśli roboczo puste tylko na branchu.
- Konfiguracja Netlify static, skrypty build/test/preview i README.

**Odbiór:** build przechodzi; sześć URL działa lokalnie; wszystkie prowadzą do wspólnego header/footer; zachowany numer.

### Faza 2 — zaakceptowana strona główna [najważniejszy wizualnie]

- Implementacja układu `reference/makieta_strony_glownej.html` z prawdziwymi plikami i realnymi linkami.
- Zatwierdzona jasna kolorystyka; hero H1 i fotografie.
- **Szerszy kadr `laweta_car_4`**, zgodnie z jedyną zgłoszoną poprawką.
- Telefon w treści + header desktop + mobile sticky CTA.
- Sekcje z punktu 6.

**Odbiór:** screenshoty 390 px i 1440 px przypominają zaakceptowane makiety, z poprawionym kadrem; oba przyciski prowadzą do właściwych URL.

### Faza 3 — pięć podstron

- Zakres usług wg punktów 3 i 7, nie wymyślać szczegółów.
- Galeria wyłącznie `/realizacje/`, a nie na głównej.
- Kontakt z Messengerem i bazą, bez sugerowania przyjmowania klientów w Łącku.
- Spójna nawigacja i CTA na każdej stronie.

**Odbiór:** wszystkie podstrony mają własne treści, realne odnośniki, 1 H1, bez niesprawdzonych obietnic.

### Faza 4 — SEO, dostępność, wydajność

- Metadane, canonical, schema, sitemap, robots, OG.
- Optymalizacja zdjęć, alt, menu i lightboxa, test klawiatury.
- Audyty build i w przeglądarce w kilku rozmiarach.
- Dopracowanie układu, overflow, sticky telefonu, kontrastów.

**Odbiór:** wyniki testów spisane, brak błędów krytycznych i martwych linków.

### Faza 5 — PR, podgląd, odbiór, publikacja ręcznie autoryzowana

- Spis wszystkich zmian, screenshoty desktop/mobile, wyniki testów i lista spraw do potwierdzenia u właściciela.
- Deploy Preview w PR, bez zmiany DNS/produkcyjnego `main`.
- Dopiero po wyraźnej akceptacji właściciela — merge i kontrola live.

**Odbiór:** użytkownik widzi pełną nową stronę w podglądzie i może wyraźnie ją zatwierdzić.

---

## 12. Definition of Done — checklista do odhaczenia przez Codex

- [ ] Zmiany są na osobnej gałęzi, bez samodzielnego merge do `main`.
- [ ] Wciąż korzystamy z tego samego repozytorium, istniejącego Netlify i `alatrans.pl`.
- [ ] Wszystkie sześć adresów URL działa (HTML/200), nieistniejący adres daje sensowne 404.
- [ ] Na wszystkich stronach działa pięciopozycyjne menu oraz logo prowadzące na `/`.
- [ ] Hero ma **dokładny zatwierdzony H1** oraz dwa przyciski kierujące do **dwóch osobnych podstron**.
- [ ] Hero wykorzystuje prawdziwe `laweta_car_4`, z **szerszym kadrem** niż w mockupie (widać więcej całej lawety).
- [ ] Jasny, minimalistyczny wygląd odpowiada referencyjnej makiecie.
- [ ] Numer `880 887 092` jest w treści hero, w desktopowym headerze i jako sticky CTA mobile; linki mają prawidłowe `tel:`.
- [ ] Dwa obszary usług są opisane niezależnie: lokalna pomoc drogowa oraz transport po Polsce/z Niemiec.
- [ ] Informacje o usługach nie wykraczają poza potwierdzony zakres (brak dostawczaków/przyczep/ładowności bez weryfikacji).
- [ ] Na głównej nie ma galerii zdjęć; działa podstrona `/realizacje/`.
- [ ] Brak fikcyjnych opinii, cenników, statystyk, certyfikatów i marketingowych obietnic.
- [ ] Kontakt przez telefon i FB jest sprawdzony; baza Łącko nie jest przedstawiona jako punkt obsługi klienta.
- [ ] Menu mobile otwiera się/zamyka poprawnie, działa klawiatura i Escape, focus jest widoczny.
- [ ] Sticky CTA nie zasłania stopki ani interaktywnych elementów.
- [ ] Brak poziomego przewijania na szerokościach 320 / 390 / 768 / 1024 / 1440 px.
- [ ] Opisy zdjęć są adekwatne; zdjęcia są zoptymalizowane; hero nie jest lazy-loadowany.
- [ ] Każda strona ma 1 H1, unikalny `<title>`, jeden meta description, prawidłowy canonical i OG.
- [ ] Działają `robots.txt`, `sitemap.xml`, JSON-LD zgodny z faktami.
- [ ] Brak `noindex` w produkcji; preview nie powinien trafiać do indeksu.
- [ ] `npm run build` oraz testy repo przechodzą; brak błędów JS/konsoli.
- [ ] Codex przekazuje screenshoty dwóch viewportów (390 i 1440), podsumowanie, listę plików i testów oraz URL Deploy Preview/PR, gdy są dostępne.
- [ ] Codex wskazuje informacje **niepotwierdzone** i nie publikuje ich jako faktów.

---

## 13. Pytania przed ostatecznym opublikowaniem (nie blokują prac makietowych)

1. Czy oficjalna nazwa działalności i adres `Łącko 984, 33-390 Łącko` są aktualne i prawidłowe do publicznego pokazania?
2. Czy link do Facebooka otwiera właściwy profil i czy możliwy jest bezpośredni Messenger bez błędów na telefonie?
3. Jakie są rzeczywiste parametry lawety (ładowność, platforma, wyposażenie) — do ewentualnego przyszłego uzupełnienia, **nie warunek stworzenia obecnej wersji**.
4. Czy transport samochodów dostawczych i przyczep kempingowych jest rzeczywiście dostępny? Na razie bez tych deklaracji.
5. Czy dostępne zdjęcia mogą być opublikowane i czy wymagają zasłonięcia wrażliwych szczegółów (np. tablice rejestracyjne cudzych aut, osoby)? Nie retuszować ich automatycznie bez decyzji właściciela.
6. Czy są autentyczne opinie nadające się do publikacji? Bez odpowiedzi sekcja nie powstaje.

---

## 14. Konkretne znane problemy starszego uploadu — naprawić, o ile występują w aktualnym repo

- Dwa `<meta name="description">` na głównej.
- H1 umieszczony w brandingu headera, podczas gdy hero ma H2. Docelowo H1 to główne hasło hero.
- Potencjalnie nieprawidłowe zagnieżdżenia HTML (dodatkowe `</div>`, `<ul>` wewnątrz `<p>`).
- Powtarzające się reguły `.btn` i `.card` w CSS, niskie uporządkowanie styli.
- Deklaracje `AutoRepair` mimo braku potwierdzonego warsztatu naprawczego.
- Ogólne i powtarzające się alty typu „Laweta 6”.
- Bohater hero z `loading="lazy"`, co może pogorszyć LCP.
- Galeria/lightbox oparta tylko na kliknięciu zdjęcia — brak pełnej obsługi klawiatury i focusu.
- Zbyt długi układ jednostronicowy bez osobnych URL usług oraz niejednoznaczne komunikaty „cała Polska” przy pomocy awaryjnej.
- Wcześniejsza mapa z „otwórz trasę do naszej lokalizacji” może kierować człowieka z awarią do bazy zamiast pomóc mu zadzwonić.

**Nie zakładaj, że wszystkie te problemy są nadal w kodzie produkcyjnym**. Sprawdź najpierw obecny stan gałęzi i popraw to, co faktycznie występuje.

---

## 15. Materiały wizualne załączone do tej specyfikacji

| Plik | Do czego używać |
|---|---|
| `reference/makieta_strony_glownej.html` | Wzorzec układu i styli; **nie kopiować base64 ani atrap odsyłaczy** |
| `reference/makieta_desktop_cala.png` | Zatwierdzony pełny wygląd desktopowy |
| `reference/makieta_mobile_cala.png` | Zatwierdzony pełny wygląd mobilny |
| `reference/makieta_desktop_hero.png` | Porównanie pierwszego ekranu desktop (z poprawką kadru zdjęcia) |
| `reference/makieta_mobile_hero.png` | Porównanie pierwszego ekranu mobile (z poprawką kadru zdjęcia) |
| `assets/laweta_car_4.webp` | Wskazane zdjęcie główne, zachować więcej pojazdu w kadrze |
| `assets/logo.png` | Aktualne logo firmy, bez redesignu logo |

**Ważne:** w referencyjnej makiecie linki do realizacji i stron usług są demonstracyjnymi anchorami. W nowym serwisie **wszystkie** takie linki muszą prowadzić na prawdziwe podstrony z punktu 4.

---

## 16. Linki do zweryfikowanej dokumentacji technicznej

- Astro + Netlify (statyczne): https://docs.astro.build/en/guides/deploy/netlify/
- Netlify Deploy Previews z Pull Request: https://docs.netlify.com/deploy/deploy-types/deploy-previews/
- Netlify `netlify.toml`: https://docs.netlify.com/build/configure-builds/file-based-configuration/
- Google LocalBusiness JSON-LD: https://developers.google.com/search/docs/appearance/structured-data/local-business?hl=pl
- Google sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google canonical: https://developers.google.com/search/docs/crawling-indexing/canonicalization

---

## 17. Wymagana odpowiedź Agenta na koniec pracy

Codex powinien dostarczyć: **(a)** podsumowanie wykonanych zmian, **(b)** wybrany stack i powód, **(c)** listę zmienionych plików, **(d)** wynik `build` i testów, **(e)** screenshoty mobile/desktop z poprawionym kadrem hero, **(f)** link do PR i Deploy Preview, jeśli zostały utworzone, **(g)** listę rzeczy do potwierdzenia przez właściciela, **(h)** krótką instrukcję rollback i bezpiecznej publikacji.

**Nie twierdź, że wdrożono coś na produkcję, jeżeli nie wykonano i nie zweryfikowano prawdziwego deployu. Nie merge'uj bez zgody.**
