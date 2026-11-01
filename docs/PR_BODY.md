## AlaTrans 2.0

Serwis generuje sześć prawdziwych stron w Astro static. Zachowuje jasny styl i szerokie zdjęcie lawety, a główną upraszcza do pięciu sekcji z czytelnym rytmem jasnych i grafitowych teł. Dwa równorzędne przyciski prowadzą do dwóch usług. Kontakt eksponuje telefon, następnie bezpośrednie WhatsApp i Messenger; podstrona Kontakt pokazuje również potwierdzoną bazę i leniwie ładowaną mapę.

Potwierdzone przez właściciela dane „AlaTrans – P.P.H.U. Artur Adamczyk” oraz „Łącko 984, 33-390 Łącko” są spójne w treści, stopce i LocalBusiness. Pomoc lokalna 24/7 i transport po Polsce / samochodów z Niemiec mają odrębne opisy. Nie dodano niepotwierdzonych usług, parametrów sprzętu ani opinii.

### Architektura i zasoby

Astro 7.4.4, zwykły CSS, minimalny JS menu i galerii, Node 22.23.4, przypięty lockfile. Bez nowych zależności, React ani SSR. Zdjęcia i favicony mają pojedyncze źródła, a publiczne kopie generuje npm przed dev/build/preview. Usunięto 17 śledzonych duplikatów bitowych; wszystkie unikalne źródła i dawne URL zachowano. Netlify TOML nadal deklaruje statyczny dist i siedem przekierowań JPG → WebP.

### Weryfikacja i screenshoty

Aktualne wyniki wszystkich wymaganych skryptów, pomiary i 19 nowych screenshotów są w `docs/WERYFIKACJA.md`, `docs/qa-browser.json` i `docs/qa-lighthouse.json`. Testy obejmują sześć stron, Chromium/WebKit, szerokości 320–1440, Axe, metadane, kontakty, równe przyciski, unikalne ID, menu oraz galerię. Laboratorium localhost nie zastępuje fizycznego telefonu ani produkcyjnych CWV.

- [Desktop głównej](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/glowna-1440.png)
- [Mobile głównej](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/glowna-390.png)
- [Desktop Kontaktu](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/kontakt-1440.png)
- [Mobile Kontaktu](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/kontakt-390.png)

### Odbiór

W iteracji 2 nie wykonano push, merge ani publikacji. Ta treść jest przygotowana na przyszły, osobno autoryzowany etap PR; brak rzeczywistego Deploy Preview. Nie zmieniano main, DNS, domeny ani paneli hostingu. Instrukcja późniejszego odbioru i rollback: `docs/WDROZENIE.md`.

Przed publikacją wymagane są kontrola aplikacji na fizycznym telefonie, zgody na fotografie i rzeczywisty test Netlify (200/404, noindex preview, indeksowalna produkcja). Dodatkowy historyczny adres GitHub Pages pozostaje bez zmian. Szczegóły bieżącej iteracji: `docs/ITERACJA_2.md`, lista plików: `docs/ZMIANY.md`, audyt zasobów: `docs/ASSETS_ITERACJA_2.md`.
