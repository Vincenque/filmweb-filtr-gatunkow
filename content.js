/*
 * Treści są generowane przez AI na podstawie promptów Vincenque (https://github.com/Vincenque)
 */
const znacznikCzasu = new Date().toISOString();
let trybWykluczania = false;
const wykluczoneGatunki = new Set();
let obserwatorInterfejsu;

console.log(`[${znacznikCzasu}] Uruchomiono Filmweb Wykluczacz Kategorii (V0.01)`);

function wstrzyknijPrzelacznik() {
    if (document.getElementById('fw-przelacznik-trybu')) return;

    // Szukamy nagłówka "Gatunki", który ma obok przycisk zamknięcia (to gwarantuje, że jesteśmy w panelu)
    const spany = Array.from(document.querySelectorAll('span'));
    const naglowekGatunki = spany.find(s => s.textContent.trim() === 'Gatunki' && s.parentElement.querySelector('button'));
    
    if (!naglowekGatunki) return;

    // Bierzemy główny kontener panelu (rodzic rodzica)
    const panelGatunkow = naglowekGatunki.parentElement.parentElement;
    if (!panelGatunkow) return;

    // Szukamy pola wyszukiwania wewnątrz tego panelu
    const poleSzukaj = panelGatunkow.querySelector('input[placeholder="Szukaj"]');
    if (!poleSzukaj) return;
    const pojemnikSzukaj = poleSzukaj.parentElement;

    // Budujemy przełącznik
    const kontenerPrzelacznika = document.createElement('div');
    kontenerPrzelacznika.id = 'fw-przelacznik-trybu';

    const etykietaWlacz = document.createElement('span');
    etykietaWlacz.textContent = 'Zaznaczaj';
    etykietaWlacz.className = trybWykluczania ? 'fw-etykieta' : 'fw-etykieta fw-aktywna';
    etykietaWlacz.id = 'fw-etykieta-wlacz';

    const etykietaWylacz = document.createElement('span');
    etykietaWylacz.textContent = 'Wykluczaj';
    etykietaWylacz.className = trybWykluczania ? 'fw-etykieta fw-aktywna-wyklucz' : 'fw-etykieta';
    etykietaWylacz.id = 'fw-etykieta-wylacz';

    const przyciskPrzelacznika = document.createElement('button');
    przyciskPrzelacznika.id = 'fw-suwak';
    przyciskPrzelacznika.className = trybWykluczania ? 'fw-suwak-wyklucz' : '';

    kontenerPrzelacznika.appendChild(etykietaWlacz);
    kontenerPrzelacznika.appendChild(przyciskPrzelacznika);
    kontenerPrzelacznika.appendChild(etykietaWylacz);

    // Wklejamy go zaraz po pojemniku z wyszukiwarką
    pojemnikSzukaj.insertAdjacentElement('afterend', kontenerPrzelacznika);

    // Akcja przełączania
    przyciskPrzelacznika.addEventListener('click', () => {
        trybWykluczania = !trybWykluczania;
        przyciskPrzelacznika.className = trybWykluczania ? 'fw-suwak-wyklucz' : '';
        etykietaWlacz.className = trybWykluczania ? 'fw-etykieta' : 'fw-etykieta fw-aktywna';
        etykietaWylacz.className = trybWykluczania ? 'fw-etykieta fw-aktywna-wyklucz' : 'fw-etykieta';
        aktualizujWygladGatunkow();
    });
}

function podepnijWszystkieGatunki() {
    const spany = Array.from(document.querySelectorAll('span'));
    const naglowekGatunki = spany.find(s => s.textContent.trim() === 'Gatunki' && s.parentElement.querySelector('button'));
    if (!naglowekGatunki) return;
    
    const panelGatunkow = naglowekGatunki.parentElement.parentElement;
    if (!panelGatunkow) return;

    const przyciski = Array.from(panelGatunkow.querySelectorAll('button'));
    
    przyciski.forEach(przycisk => {
        // Ignorujemy przyciski z ikonami (np. X do zamknięcia)
        if (przycisk.querySelector('svg')) return;
        
        const tekst = przycisk.textContent.trim();
        const gatunek = tekst.toLowerCase();
        
        // Rozszerzona lista ignorowanych przycisków
        if (!tekst || ['zapisz', 'wyczyść', 'pokaż wyniki', 'wyczyść wszystko'].includes(gatunek)) return;

        // ZAWSZE odświeżamy wygląd. Filmweb działa na React, który ciągle
        // nadpisuje klasy, więc musimy to wymuszać przy każdej zmianie DOM.
        if (wykluczoneGatunki.has(gatunek)) {
             przycisk.classList.add('fw-wykluczony-przycisk');
        } else {
             przycisk.classList.remove('fw-wykluczony-przycisk');
        }

        // Podpinamy event tylko raz
        if (przycisk.dataset.fwPodpiety) return;
        przycisk.dataset.fwPodpiety = "true";

        przycisk.addEventListener('click', (e) => {
            if (trybWykluczania) {
                // Blokujemy domyślne zachowanie
                e.stopPropagation(); 
                e.preventDefault();

                if (wykluczoneGatunki.has(gatunek)) {
                    wykluczoneGatunki.delete(gatunek);
                    przycisk.classList.remove('fw-wykluczony-przycisk');
                } else {
                    wykluczoneGatunki.add(gatunek);
                    przycisk.classList.add('fw-wykluczony-przycisk');
                    
                    // Jeśli gatunek był zaznaczony normalnie, odznaczamy go w systemie Filmwebu
                    if(przycisk.getAttribute('type') === 'selected') {
                        // Wypuszczamy kliknięcie asynchronicznie, żeby odznaczyło się w tle
                        setTimeout(() => {
                            trybWykluczania = false;
                            przycisk.click();
                            trybWykluczania = true;
                        }, 10);
                    }
                }
                zastosujWykluczeniaWewnatrz(); 
            } else {
                if (wykluczoneGatunki.has(gatunek)) {
                    wykluczoneGatunki.delete(gatunek);
                    przycisk.classList.remove('fw-wykluczony-przycisk');
                    zastosujWykluczeniaWewnatrz();
                }
            }
        }, true);
    });
}

function aktualizujWygladGatunkow() {
    const przyciski = document.querySelectorAll('button[data-fw-podpiety="true"]');
    przyciski.forEach(przycisk => {
        const gatunek = przycisk.textContent.trim().toLowerCase();
        if (wykluczoneGatunki.has(gatunek)) {
             przycisk.classList.add('fw-wykluczony-przycisk');
        } else {
             przycisk.classList.remove('fw-wykluczony-przycisk');
        }
    });
}

function zastosujWykluczeniaWewnatrz() {
    setTimeout(() => {
        const dts = document.querySelectorAll('dt');
        dts.forEach(dt => {
            if (dt.textContent.trim().toLowerCase() === 'gatunek') {
                const dl = dt.parentElement; 
                const gatunkiFilmu = Array.from(dl.querySelectorAll('dd')).map(dd => dd.textContent.trim().toLowerCase());
                const czyUkryc = gatunkiFilmu.some(g => wykluczoneGatunki.has(g));

                let kartaFilmu = dl.closest('div');
                if (kartaFilmu && kartaFilmu.parentElement) {
                    kartaFilmu = kartaFilmu.parentElement;
                    if (kartaFilmu.parentElement) {
                        kartaFilmu = kartaFilmu.parentElement;
                        if (kartaFilmu.parentElement) {
                            kartaFilmu = kartaFilmu.parentElement;
                            kartaFilmu.style.display = czyUkryc ? 'none' : '';
                        }
                    }
                }
            }
        });
    }, 100); 
}

obserwatorInterfejsu = new MutationObserver(() => {
    wstrzyknijPrzelacznik();
    podepnijWszystkieGatunki();
    zastosujWykluczeniaWewnatrz();
});

obserwatorInterfejsu.observe(document.body, { childList: true, subtree: true });

// Wymuszenie na starcie
zastosujWykluczeniaWewnatrz();