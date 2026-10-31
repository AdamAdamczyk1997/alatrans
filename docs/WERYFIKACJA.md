# Weryfikacja AlaTrans 2.0 — 31.10.2026

## Build i kontrola statyczna

| Kontrola | Wynik |
| --- | --- |
| Astro check (23 pliki) | PASS, 0 błędów, 0 ostrzeżeń, 0 hints |
| Build na Node 22.23.4 | PASS; oficjalne archiwum Node sprawdzone SHA-256 |
| npm run build na lokalnym Node 26.8.1 | PASS |
| Wygenerowane HTML | 6 stron + techniczne 404; sitemap oddzielnie |
| npm test | PASS, 173 odnośniki/zasoby istnieją |
| Metadane | 1 H1, unikalny title/description, canonical i absolutne OG na każdej z 6 stron |
| Sitemap / robots / JSON-LD | PASS; sześć URL, rzeczowy LocalBusiness, bez AutoRepair/cen/opinii |
| Wariant preview | PASS, meta noindex + robots Disallow + _headers X-Robots-Tag |
| Przywrócony wariant produkcyjny | PASS, indeksowalny; bez noindex i bez _headers blokującego roboty |
| Konfiguracja TOML | Poprawna; 7 przekierowań 301 JPG → istniejące WebP; bez SPA catch-all |
| npm audit | 0 podatności |
| Kontrola plików do commita | Bez Notes.txt, .env, sekretów, dist i node_modules |

Stare index.html/style.css/script.js usunięto dopiero po kompletnym buildzie i testach generatora. Materiały briefu zachowano bez edycji; końcowe spacje w pięciu liniach specyfikacji są oryginalnym formatowaniem Markdown. Kontrola whitespace kodu i nowych dokumentów przechodzi po wyłączeniu tego niezmienionego pliku źródłowego.

## Przeglądarki, linki i interakcje

`docs/qa-browser.json`: **passed=true**, 72 kombinacje, zero błędów JS/konsoli i brak poziomego scrolla.

- Chromium 156.0.8078.4 oraz WebKit 27.2.
- Sześć stron × szerokości 320, 375, 390, 768, 1024, 1440 px × dwa silniki.
- Każda strona: HTTP 200, obrazy załadowane, jeden H1, prawidłowy tel:+48880887092 i aktywna pozycja menu.
- Menu: Enter, Escape, ponowne kliknięcie, pięć pozycji, powrót fokusu i dostępny telefon.
- Galeria: Enter, dekodowanie obrazu, Escape, przycisk zamknięcia i powrót fokusu do miniatury.
- Sticky: widoczność, obszar dotykowy oraz brak zasłaniania końca stopki przy 320/375/390.
- Lokalny serwer statyczny zwraca rzeczywiste 404 dla nieistniejącej strony.
- Dodatkowy smoke test z wyłączonym JS przy 390: główna i galeria mają 200, pięć widocznych linków menu, brak overflow; galeria udostępnia pięć odnośników noscript.

WebKit wymagał lokalnych bibliotek ABI wypakowanych z oficjalnych paczek Ubuntu do /tmp. Nie instalowano ich systemowo. Opcjonalny WEBKIT_EXECUTABLE_PATH umożliwia użycie wrappera w tym niestandardowym środowisku. Wynik dotyczy silników automatycznych, nie fizycznego Safari/iPhone.

## Dostępność

Axe uruchomiono **24 razy** (6 stron × 390/1440 × dwa silniki), nie 72 razy. Zero wykrytych violations WCAG A/AA. W 20 raportach pozostały pozycje incomplete color-contrast (łącznie 64 wskazania w różnych wariantach); nie ukryto ich w JSON.

Punktowa kontrola ręczna strony głównej w 390 i 1440 ustaliła: podpis zdjęcia ma 5,11:1 (#626e74 / #fcfcfa), strzałki 15,89:1 na bieli i 14,78:1 na jasnoszarym tle. Axe myli zakres pseudo-elementu dekoracyjnego z tłem podpisu. Żółte tło kończy się przed podpisem. Symbole ✓ są redundantną dekoracją aria-hidden, z kontrastem 4,30:1 na bieli. Nie niosą samodzielnej informacji. Pozostałe niepewne wskazania dotyczą symboli/strzałek. Widoczny focus, etykiety, kolejność nagłówków i obsługa klawiatury zostały sprawdzone w kodzie oraz testach. Nie jest to pełny audyt ani deklaracja certyfikacji WCAG.

## Lighthouse mobile

Końcowe **trzy sekwencyjne** przebiegi Lighthouse 13.5.0 na lokalnym statycznym preview strony głównej, bez równoległych testów przeglądarek. Domyślna symulacja mobile i throttling; pełne ustawienia oraz metryki w `qa-lighthouse.json`.

| Przebieg | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 97 | 100 | 100 | 100 | 1.36 s | 0 | 196 ms |
| 2 | 100 | 100 | 100 | 100 | 1.36 s | 0 | 0 ms |
| 3 | 100 | 100 | 100 | 100 | 1.36 s | 0 | 0 ms |

Cel audytowy Performance i Accessibility >=90 spełniony w każdym z tych trzech przebiegów. To wyniki laboratoryjne z localhost; nie są pomiarem realnego ruchu, INP ani gwarancją CWV po wdrożeniu.

Wstępny pomiar uruchomiony podczas innych prac dawał 79/100/100 Performance (TBT pierwszej próby 924 ms). Zachowano go osobno w `qa-lighthouse-initial.json`, zamiast usuwać rozrzut. Dopiero końcowy pomiar wykonano bez równoległego obciążenia.

Strona główna ma 765 B własnego JS menu; galeria dodaje 668 B. Brak runtime React i zewnętrznych skryptów marketingowych. Responsywne zdjęcie hero: 480 px ok. 27 kB, 800 px ok. 68 kB; eager i fetchpriority=high, jawne wymiary. Pozostałe obrazy poza pierwszym ekranem lazy.

## Screenshoty i porównanie referencji

19 końcowych PNG pochodzi z **WebKit 27.2**. Funkcjonalne 72 testy obejmują oba silniki. Capture jest odseparowany od scrollowania i axe; przed zdjęciem czeka na decode i malowanie. Chromium sporadycznie pomijało warstwę zdjęcia w długim PNG mimo poprawnego viewportu. Zmiana silnika capture rozwiązała problem; nie zmieniano CSS produktu dla tego artefaktu.

Pełne 390 px ukrywają sticky WYŁĄCZNIE na czas zdjęcia, żeby nie zasłaniał środka długiego dokumentu. Osobne viewporty pokazują prawdziwy pasek fixed. Eager wymuszany w kontekście fotografowania nie zmienia realnego lazy loading strony.

Porównano końcowy desktop/mobile z reference/: kolejność sekcji, jasne tła, kontener, typografia i przyciski zachowane; pełne 16:9 hero pokazuje platformę i kabinę. Na głównej brak galerii. Usunięte są dopiski demonstracyjne i górny baner makiety. Root i niezależny reviewer obejrzeli artefakty; pełny desktop oraz oba kadry mobile pokazują rzeczywiste zdjęcie.

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

## Ograniczenia i odbiór przed produkcją

- Brak autoryzacji zapisu GitHub/Netlify: nie utworzono zdalnego PR ani Deploy Preview. Statusy i nagłówki na prawdziwym Netlify wymagają kontroli po otwarciu PR; lokalny test 404 nie dowodzi routingu podglądu.
- Prawidłowe href telefonu sprawdzone programowo. Połączenie i dialer trzeba sprawdzić na fizycznym telefonie.
- Facebook HTTP 200 przekierowuje do profilu Artur Adamczyk. Tożsamość biznesowa i rozmowa Messenger wymagają potwierdzenia właściciela; UI nie obiecuje bezpośredniego otwarcia rozmowy.
- Mapa Google HTTP 200 wskazuje AlaTrans, lecz pełny adres nie jest potwierdzony. Publiczny UI pomija mapę i dokładny adres.
- Nazwa prawna, adres, zgody na fotografie i parametry sprzętu wymagają decyzji właściciela. Niepotwierdzone usługi są pominięte.
- JSON-LD ma tylko potwierdzoną miejscowość/PL; nie zadeklarowano niezweryfikowanej ulicy ani kodu. Nie wykonano zewnętrznego Google Rich Results Test i nie gwarantuje się kwalifikacji do rich results.
- Nadal działa drugi, stary adres GitHub Pages. Nie zmieniono jego integracji; ryzyko przyszłego merge opisano w AUDYT.md i WDROZENIE.md.
- Brak zmian produkcyjnych, DNS/domeny i panelu projektu Netlify. Odbiór, wyraźna zgoda, merge i kontrola live są osobnym etapem.
