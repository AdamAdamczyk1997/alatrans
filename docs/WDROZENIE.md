# PR i bezpieczne wdrożenie

Prace pozostają na lokalnej gałęzi `feat/alatrans-2-redesign`. Nie zmieniono main, DNS, domeny, certyfikatów ani istniejącego projektu Netlify. Nie wykonano produkcyjnego deployu.

## Dlaczego PR nie został utworzony automatycznie

Brak lokalnego gh i skonfigurowanych poświadczeń GitHub. Bezpieczna próba `git push --dry-run` z wyłączonym pytaniem o hasło zakończyła się `could not read Username for 'https://github.com': terminal prompts disabled`. Nie pobierano tokenów z Notes.txt ani innych plików. Gałąź nie została wypchnięta; link Deploy Preview nie istnieje jeszcze i nie został zgadnięty.

## Otwarcie PR

1. W tym repozytorium uruchom `git status` i upewnij się, że aktywna jest gałąź `feat/alatrans-2-redesign` oraz że masz właściwy commit przebudowy.
2. Po zalogowaniu do GitHub swoim zwykłym sposobem:

   ```bash
   git push -u origin feat/alatrans-2-redesign
   ```

3. Otwórz https://github.com/AdamAdamczyk1997/alatrans/compare/main...feat/alatrans-2-redesign?expand=1 i utwórz **Draft Pull Request** do main. Tytuł: „AlaTrans 2.0 — statyczny serwis z sześcioma podstronami”. Wklej zawartość `docs/PR_BODY.md`. Jeżeli masz już gh, alternatywa:

   ```bash
   gh pr create --draft --base main --head feat/alatrans-2-redesign --title "AlaTrans 2.0 — statyczny serwis z sześcioma podstronami" --body-file docs/PR_BODY.md
   ```

4. Poczekaj na check istniejącego Netlify i skopiuj rzeczywisty URL Deploy Preview do PR. Nie twórz drugiego projektu. Repozytoryjny `netlify.toml` deklaruje `npm run build`, `dist` i Node 22.23.4. Nie wymaga zmian DNS ani domeny. Jeżeli panel blokuje Deploy Preview lub nadpisuje wersję Node, odnotuj to do właściciela zamiast zmieniać projekt bez upoważnienia.
5. Sprawdź podgląd na prawdziwym telefonie i desktopie. Każda z sześciu ścieżek ma zwracać 200; nieistniejąca ścieżka ma zwracać 404. Zweryfikuj `X-Robots-Tag: noindex, nofollow`, robots blokujący preview i meta noindex, np. `curl -I ADRES_PODGLADU/`. To musi być rzeczywisty nagłówek Netlify, nie tylko obecność pliku `_headers` lokalnie.
6. Sprawdź dialer, numer docelowy, profil Facebook i ewentualną możliwość wysłania wiadomości w aplikacji. Potwierdź zgody na fotografie oraz dane firmy wskazane niżej.
7. **Zatrzymaj się przed merge.** Dopiero wyraźna zgoda właściciela autoryzuje osobną czynność merge i produkcyjny deploy.

## Dodatkowy stary hosting

Publiczny adres `https://adamadamczyk1997.github.io/alatrans/` również odpowiada starym HTML. Publiczne check-runs potwierdzają historyczny GitHub Pages deploy, choć panelowa konfiguracja nie jest dostępna. To oddzielny adres; alatrans.pl potwierdzono na Netlify. Nie zmieniono Pages ani nie dodano dla niego workflow. Przed merge właściciel powinien zdecydować o tym drugim adresie — publikowanie root repo bez budowania Astro nie będzie obsługiwać nowej architektury. Nie trzeba w tym celu zmieniać domeny alatrans.pl. ID deployment GitHub Pages nie jest ID poprzedniego deployu Netlify.

## Informacje niepotwierdzone

- Oficjalna pisownia nazwy działalności `P.P.H.U. Artur Adamczyk` i aktualny adres `Łącko 984, 33-390 Łącko`. Publicznie i w schema jest tylko AlaTrans, Łącko, PL.
- Tożsamość i obsługa profilu FB: HTTP 200 przekierowuje do profilu „Artur Adamczyk”. Zachowano wskazany przez brief URL jako profil, bez obietnicy bezpośredniego Messengera. Właściciel powinien sprawdzić go po zalogowaniu i na telefonie.
- Mapa Google odpowiada i wskazuje AlaTrans, ale dokładny adres wymaga potwierdzenia. Mapę pominięto w publicznym UI; nie przeniesiono starego iframe OSM z innymi współrzędnymi.
- Prawa do publikacji zdjęć, auta osób trzecich, widoczne tablice i ewentualna potrzeba anonimizacji.
- Ładowność, wymiary platformy, wyposażenie, możliwość przewozu dostawczaków i przyczep. Nie są reklamowane w tej wersji.
- Autentyczne opinie: bez materiałów i zgody sekcja nie powstała. Brak zgadywanych cen, stażu i statystyk.

## Po zatwierdzonym merge (osobna autoryzacja)

Przed merge zapisz w panelu istniejącego Netlify ID ostatniego dobrego deployu. Punkt odniesienia Git: `c8ac902cd737fae5678378d9d2d3a966f57d2a78`; audyt potwierdził, że jego HTML odpowiadał produkcji. W tej sesji nie uzyskano ID deployu.

Po deployu sprawdź https://alatrans.pl/, przekierowanie www, HTTPS, sześć URL/200 i 404, telefon, FB, menu, galerię, favicony, canonical i OG. Potwierdź, że produkcja NIE zawiera noindex ani blokady robots. Sprawdź https://alatrans.pl/sitemap.xml i https://alatrans.pl/robots.txt. Jeśli właściciel ma dostęp do Google Search Console, prześlij sitemap i wykonaj inspekcję URL; nie twórz nowych kont bez zgody.

## Rollback

W istniejącym projekcie Netlify wybierz zapisany poprzedni poprawny deploy i użyj funkcji przywrócenia/publikacji tego deployu. Nie zmieniaj DNS. Jeżeli zespół wybierze cofnięcie kodu, przygotuj revert commita/merge przebudowy w osobnej gałęzi i PR; po zatwierdzeniu jego merge uruchomi CD. Nie stosuj force push do main. Po rollback sprawdź domenę, telefon i poprzedni serwis. Sam rollback produkcyjny również wymaga autoryzacji właściciela.
