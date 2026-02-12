document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-pdf-btn');
    const cvContainer = document.getElementById('cv-container');
    
    // Funkcja wykrywająca czy używamy drukowania (Ctrl+P) czy pobierania PDF
    let isPrinting = false;
    
    // Nasłuchiwanie na zdarzenie drukowania (Ctrl+P lub Drukuj z menu)
    window.addEventListener('beforeprint', () => {
        isPrinting = true;
        console.log('Przygotowanie do drukowania...');
        
        // Dodaj klasę dla trybu drukowania
        if (cvContainer) {
            cvContainer.classList.add('printing-mode');
        }
    });
    
    window.addEventListener('afterprint', () => {
        isPrinting = false;
        console.log('Drukowanie zakończone');
        
        // Usuń klasę po drukowaniu
        if (cvContainer) {
            cvContainer.classList.remove('printing-mode');
        }
    });
    
    // Wykrywanie media queries dla druku
    if (window.matchMedia) {
        const printMediaQuery = window.matchMedia('print');
        
        printMediaQuery.addListener((mql) => {
            if (mql.matches) {
                console.log('Tryb drukowania aktywny');
            } else {
                console.log('Tryb ekranowy aktywny');
            }
        });
    }
    
    // Pobieranie PDF przyciskiem
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            // Sprawdź czy biblioteka jest załadowana
            if (typeof html2pdf === 'undefined') {
                alert('Błąd: Biblioteka html2pdf nie została załadowana. Sprawdź połączenie z internetem.');
                return;
            }

            const element = document.getElementById('cv-container');
            const button = document.getElementById('download-pdf-btn');

            // Ukryj przycisk
            button.style.display = 'none';

            // Zapamiętaj style
            const originalShadow = element.style.boxShadow;
            const originalMargin = element.style.margin;
            const originalWidth = element.style.width;
            const originalMaxWidth = element.style.maxWidth;
            
            // Zapamiętaj style body (bo to one centrują CV)
            const originalBodyAlign = document.body.style.alignItems;
            const originalBodyJustify = document.body.style.justifyContent;

            // Usuń cienie i marginesy dla czystego PDF
            element.style.boxShadow = 'none';
            element.style.margin = '0';
            element.style.width = '780px'; // Sztywna szerokość 780px (zgodnie z Twoją obserwacją)
            element.style.maxWidth = 'none'; // Zdejmij ograniczenie szerokości
            
            // Przewiń na górę strony, aby uniknąć błędów renderowania
            window.scrollTo(0, 0);

            // Format A4 w pikselach (72 DPI): 595 x 842 px
            // Ale używamy większej skali dla lepszej jakości
            const a4Width = 210; // mm
            const a4Height = 297; // mm
            
            // Tymczasowo przesuń wszystko do lewego górnego rogu, aby html2canvas widział to od 0,0
            document.body.style.alignItems = 'flex-start';
            document.body.style.justifyContent = 'flex-start';

            const opt = {
                margin: [0, 2, 0, 0], // [Góra, Lewo, Dół, Prawo] - 15mm marginesu z lewej przesuwa treść w prawo
                filename: 'CV_Anna_Szczesna.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true, 
                    scrollY: 0,
                    scrollX: 0,
                    logging: false,
                    backgroundColor: '#ffffff',
                
                    allowTaint: false,
                    dpi: 300,
                    letterRendering: true,
                    windowWidth: 780, // Symulacja okna 780px
                    width: 780, // Sztywne wymuszenie szerokości canvasa
                    x: 0, // Wymuś start od współrzędnej X=0
                    y: 0  // Wymuś start od współrzędnej Y=0
                },
                jsPDF: { 
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: {
                    mode: 'legacy',
                    before: '.force-break'
                }
            };

            html2pdf()
                .from(element)
                .set(opt)
                .save()
                .then(() => {
                    // Przywróć style i przycisk
                    element.style.boxShadow = originalShadow;
                    element.style.margin = originalMargin;
                    element.style.width = originalWidth;
                    element.style.maxWidth = originalMaxWidth;
                    document.body.style.alignItems = originalBodyAlign;
                    document.body.style.justifyContent = originalBodyJustify;
                    button.style.display = 'flex';
                    console.log('PDF wygenerowany pomyślnie');
                })
                .catch(err => {
                    console.error('Błąd podczas generowania PDF:', err);
                    alert('Błąd podczas generowania PDF: ' + (err.message || err));
                    // Przywróć w razie błędu
                    element.style.boxShadow = originalShadow;
                    element.style.margin = originalMargin;
                    element.style.width = originalWidth;
                    element.style.maxWidth = originalMaxWidth;
                    document.body.style.alignItems = originalBodyAlign;
                    document.body.style.justifyContent = originalBodyJustify;
                    button.style.display = 'flex';
                });
        });
    }
    
    // Dodatkowa funkcja: Dodanie przycisku "Drukuj" (opcjonalne)
    // Możesz dodać drugi przycisk do drukowania bezpośredniego
    const addPrintButton = () => {
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Drukuj';
        printBtn.style.cssText = downloadButton.style.cssText;
        printBtn.style.right = '180px'; // Umieść obok przycisku PDF
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        // Możesz odkomentować poniższą linię aby dodać przycisk drukowania
        // document.body.appendChild(printBtn);
    };
    
    // addPrintButton(); // Odkomentuj jeśli chcesz przycisk drukowania
    
    console.log('CV Script załadowany pomyślnie');
    console.log('Tryb wyświetlania:', window.matchMedia('print').matches ? 'DRUK' : 'EKRAN');
});