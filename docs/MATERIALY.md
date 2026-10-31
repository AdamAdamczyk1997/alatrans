# Materiały i decyzje redakcyjne

Przeczytano całą specyfikację i HTML makiety (bez przenoszenia obrazów base64). Obejrzano cztery referencyjne screenshoty, oba assets, siedem zdjęć lawety i obie wizytówki. Pliki wejściowe pozostają bez zmian.

`assets/laweta_car_4.webp` jest bitowo identyczny z `photos/laweta_car_4.webp` (1600×900). Także `assets/logo.png` i `photos/logo.png` są identyczne (5036×3583, biały prostokąt RGB). Nie zmieniano znaku, nie retuszowano zdjęć. Astro generuje mniejsze warianty WebP; oryginały pozostają w repo.

| Zdjęcie | Wymiary źródła | Decyzja |
| --- | --- | --- |
| laweta_car_1 | 4160×3120 | Galeria; jasny samochód osobowy na platformie; źródło ok. 1,82 MB, wariant 480 px ok. 31 kB |
| laweta_car_2 | 4160×3120 | Pominięte w galerii: bus/minivan, ryzyko sugerowania niepotwierdzonej usługi |
| laweta_car_3 | 1600×1200 | Galeria; laweta z uszkodzonym autem nocą |
| laweta_car_4 | 1600×900 | Hero i galeria; kabina i pusta platforma, pełne 16:9 |
| laweta_car_5 | 1600×900 | O firmie i galeria; inny, szeroki widok pustej lawety |
| laweta_car_6 | 260×195 | Pominięte: mała rozdzielczość i podobny temat nocny jak zdjęcie 3 |
| laweta_car_7 | 2048×1536 | Galeria; niebieski samochód osobowy na platformie |
| info_card_1 | 2048×1116 | Pominięte: niezaakceptowany do eksponowania e-mail |
| info_card_2 | 2048×1140 | Pominięte: niepotwierdzone przyczepy i starsza oferta |

Galeria ma pięć zdjęć i wyłącznie opisy widocznej zawartości. Nie dopisywano dat, miejsc, historii ani opinii klientów. Nie ma galerii na głównej. Powiększenia również korzystają z wariantu maks. 1600 px. Starsze adresy zdjęć WebP zachowano w public/photos dla zgodności; nie są wszystkie promowane w nowym serwisie.

## Kadr i zgodność z makietą

Kontener 1160 px, marginesy 140 px przy 1440, na mobile 18 px. Zachowano kolejność sekcji, kolory, typografię systemową, obrysy i żółty detal za zdjęciem. Usunięto baner i dopiski demonstracyjne. Dopracowano kontrast drobnych podpisów i obszary interakcji.

Hero używa pełnych proporcji 16:9, height:auto i object-fit:contain zamiast referencyjnego wysokiego cover. Widać platformę po lewej i kabinę po prawej. Sam oryginał minimalnie ucina skrajny tył platformy; nie odtwarzano brakujących fragmentów. Zmniejszenie wysokości fotografii i jej wyśrodkowanie w prawej kolumnie to zamierzona realizacja poprawki briefu.

## Do potwierdzenia przez właściciela

Na części zdjęć są tablice rejestracyjne, prywatne posesje i auta osób trzecich; zdjęcie nocne przedstawia uszkodzony pojazd. Nie stwierdzono wyraźnych twarzy w obejrzanych kadrach, ale nie jest to potwierdzenie praw do publikacji. W odczytanym EXIF JPG nie było GPS; nie oznacza to pełnego audytu wszystkich metadanych. Bez decyzji właściciela niczego nie zamazywano ani nie retuszowano.
