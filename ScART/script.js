document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            // Cambia stato ai bottoni
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Cambia visibilità alle pagine
            pages.forEach(p => {
                p.classList.remove('active');
                if (p.id === target) {
                    p.classList.add('active');
                }
            });

            // Feedback aptico per smartphone
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        });
    });
});

function toggleAccordion(element) {
    const item = element.parentElement;
    
    // Chiude altri eventuali accordion aperti (opzionale, toglilo se vuoi aprirli tutti insieme)
    /*
    document.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('open');
    });
    */

    item.classList.toggle('open');

    // Feedback tattile
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

/* JS per funzionamento della telecamera */
async function startCamera() {
    const video = document.getElementById('webcam');
    const errorMsg = document.getElementById('camera-error');

    try {
        // Chiede l'accesso alla fotocamera posteriore (environment)
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: false 
        });
        
        video.srcObject = stream;
        errorMsg.style.display = 'none'; // Nasconde il messaggio di errore
    } catch (err) {
        console.error("Errore fotocamera: ", err);
        errorMsg.innerText = "Impossibile accedere alla fotocamera. Assicurati di usare HTTPS.";
    }
}