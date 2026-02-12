document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-pdf-btn');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const element = document.getElementById('cv-container');
            const button = document.getElementById('download-pdf-btn');

            // Ukryj przycisk
            button.style.display = 'none';

            // Zapamiętaj style
            const originalShadow = element.style.boxShadow;
            const originalMargin = element.style.margin;

            // Usuń cienie i marginesy dla czystego PDF
            element.style.boxShadow = 'none';
            element.style.margin = '0';

            // Pobierz wymiary
            const width = element.offsetWidth;
            const height = element.scrollHeight;

            const opt = {
                margin: 0,
                filename: 'CV_Anna_Szczesna.pdf',
                image: { type: 'jpeg', quality: 0.88 },
                html2canvas: { 
                    scale: 3, 
                    useCORS: true, 
                    scrollY: 0,
                    logging: false,
                    backgroundColor: '#ffffff',
                    allowTaint: true,
                    dpi: 300,
                    letterRendering: true
                },
                jsPDF: { 
                    unit: 'px', 
                    format: [width, height], 
                    orientation: 'portrait',
                    compress: true
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
                    button.style.display = 'flex';
                })
                .catch(err => {
                    console.error(err);
                    // Przywróć w razie błędu
                    element.style.boxShadow = originalShadow;
                    element.style.margin = originalMargin;
                    button.style.display = 'flex';
                });
        });
    }
});