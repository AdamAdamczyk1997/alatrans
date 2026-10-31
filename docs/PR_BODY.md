## AlaTrans 2.0

Dotychczasowa strona była pojedynczym HTML z galerią na głównej, błędami SEO i szerszą ofertą niż zatwierdzona. Nowa wersja generuje sześć prawdziwych stron w Astro static, zachowuje jasny układ zaakceptowanej makiety i pokazuje pełniejsze zdjęcie `laweta_car_4` z platformą.

Telefon 880 887 092 pozostaje głównym działaniem: w hero, desktopowym headerze i mobilnym pasku. Dodano menu klawiaturowe, dostępną galerię na osobnej stronie, responsywne obrazy, unikalne SEO, LocalBusiness bez fikcyjnych danych, sitemap i prawdziwą stronę 404. Pomoc lokalna i transport po Polsce / samochodów z Niemiec mają odrębne opisy. Niepotwierdzonych usług, dokładnego adresu i nazwy prawnej nie opublikowano.

### Architektura i migracja

Astro 7.4.4 + zwykły CSS + 765 B wspólnego JS, na galerii dodatkowe 668 B. Node 22.23.4, przypięty lockfile. Bez React, SSR, funkcji i zewnętrznych skryptów marketingowych. `netlify.toml` deklaruje wyłącznie build statyczny, kontekst preview i siedem przekierowań starych JPG do WebP. Stare trzy pliki wejściowe usunięto po działającym buildzie; oryginały i punkt rollback zachowuje historia Git.

### Weryfikacja

- `astro check`, build na Node 22.23.4 i lokalnym 26.8.1 oraz test wygenerowanych stron: PASS.
- 72 kombinacje: Chromium / WebKit × 6 stron × 320, 375, 390, 768, 1024, 1440 px. Linki, obrazy, telefon, aktywna nawigacja, menu Enter/Escape/focus, galeria i powrót fokusu: PASS.
- 24 audyty axe przy 390/1440: zero violations; nierozstrzygnięte automatycznie kontrasty sprawdzono ręcznie. Nie jest to pełna certyfikacja WCAG ani test fizycznego Safari/iPhone.
- Lokalny status sześciu stron 200 i nieistniejącej 404; 173 odnośniki/zasoby istnieją. Produkcyjny i preview wariant indeksowania sprawdzone oddzielnie.
- `npm audit`: zero podatności.
- Lighthouse: dokładne końcowe wyniki i ograniczenia w `docs/WERYFIKACJA.md` oraz `docs/qa-lighthouse.json`; zachowano również wstępny pomiar z rozrzutem pod obciążeniem.

### Materiały do przeglądu

- [Desktop 1440](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/glowna-1440.png)
- [Mobile 390](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/glowna-390.png)
- [Pierwszy ekran mobile z telefonem](https://github.com/AdamAdamczyk1997/alatrans/blob/feat/alatrans-2-redesign/docs/screenshots/glowna-hero-390.png)
- Audyt i selekcja materiałów: `docs/AUDYT.md`, `docs/MATERIALY.md`.
- Wyniki i pełna lista screenshotów: `docs/WERYFIKACJA.md`, `docs/qa-browser.json`.
- Lista plików: `docs/ZMIANY.md`.
- Kroki odbioru, publikacji i rollback: `docs/WDROZENIE.md`.

### Przed merge

Gałąź przygotowano lokalnie bez dostępu do zapisu GitHub; PR i rzeczywisty Deploy Preview mają zostać utworzone przez właściciela zgodnie z instrukcją. Po utworzeniu PR należy wkleić tu rzeczywisty link podglądu z checka istniejącego Netlify i sprawdzić jego statusy HTTP oraz nagłówki noindex.

Dodatkowe ryzyko infrastruktury: stary adres adamadamczyk1997.github.io/alatrans/ nadal działa równolegle. Nie zmieniano Pages; jego przyszłość wymaga decyzji właściciela przed merge (audyt w docs/AUDYT.md).

Do potwierdzenia pozostają: nazwa prawna i dokładny adres, właściwy profil Facebook / możliwość rozmowy Messenger na telefonie, zgody na zdjęcia i ewentualna anonimizacja. Parametry lawety, dostawczaki, przyczepy i opinie są pominięte w publicznej ofercie.

**Nie wykonano zmian produkcyjnych, edycji DNS/domeny/projektu Netlify ani merge do main. Merge i publikacja wymagają wyraźnej zgody właściciela.**
