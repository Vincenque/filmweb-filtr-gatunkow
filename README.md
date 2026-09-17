<!-- 

&#x20; Treści są generowane przez AI na podstawie promptów Vincenque (https://github.com/Vincenque)

\-->



\# Filmweb Filtr Gatunków 🍿



Rozszerzenie do przeglądarki pozwalające na wygodne wykluczanie niechcianych gatunków filmowych w wynikach wyszukiwania na portalu Filmweb.pl. 



\## 🚀 Funkcje

\* \*\*Tryb wykluczania:\*\* Ukrywa filmy zawierające niechciane gatunki od razu po zatwierdzeniu przyciskiem "Pokaż wyniki".

\* \*\*Tryb zaznaczania:\*\* Działa w 100% spójnie z natywnym filtrem Filmwebu.

\* \*\*Neutralizacja kliknięć:\*\* Intuicyjne odznaczanie bez błędów wizualnych między trybami.

\* \*\*Pełna spójność UI:\*\* Rozszerzenie bezproblemowo współpracuje z natywnym panelem Filmwebu i w pełni obsługuje czyszczenie filtrów.

\* \*\*Lokalne działanie:\*\* Skrypt działa lekko i w pełni lokalnie w Twojej przeglądarce, modyfikując model DOM w locie.



\## 🛠 Instalacja (Wersja deweloperska / ręczna)

1\. Pobierz zawartość tego repozytorium (np. jako plik `.zip` i rozpakuj).

2\. Otwórz przeglądarkę opartą na Chromium (Chrome, Brave, Edge, Opera) i przejdź pod adres `chrome://extensions/`.

3\. Włącz \*\*Tryb dewelopera\*\* (zazwyczaj w prawym górnym rogu).

4\. Kliknij \*\*Załaduj rozpakowane\*\* (Load unpacked) i wskaż folder zawierający plik `manifest.json`.



\## 💡 Jak to działa?

Skrypt (`content.js`) wstrzykuje do natywnego panelu wyszukiwania Filmwebu dodatkowy przełącznik "Zaznaczaj / Wykluczaj". Po wybraniu trybu wykluczania, klikane gatunki podświetlają się na czerwono. Zapisanie formularza wyzwala iterację po zwróconej liście wyników i ukrywa (za pomocą CSS `display: none`) te karty, w których występuje zablokowany tag.

