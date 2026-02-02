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


// QUESTA SEZIONE FA FUNZIONARE IL RICONOSCIMENTO DEI CODICI A BARRE NEL MVP

// Dizionario dei tuoi prodotti di prova
const prodottiEsempio = {
    "8003170039582": { nome: "SCATOLA DI CEREALI - muesli croccante", idea: "casetta per gli uccelli" },
    "8001120448033": { nome: "VASETTO DI MARMELLATA - Fragola Light", idea: "vasetto porta-matite" }
};

let html5QrCode;

async function iniziaScansione() {
    // Se lo scanner è già attivo, non fare nulla
    if (html5QrCode && html5QrCode.isScanning) return;

    html5QrCode = new Html5Qrcode("reader");
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 150 }, // Area di scansione per codici a barre (rettangolare)
        aspectRatio: 1.333334 
    };

    try {
        await html5QrCode.start(
            { facingMode: "environment" }, 
            config,
            (decodedText) => {
                // Azione quando trova un codice
                mostraRisultato(decodedText);
            }
        );
        document.getElementById('scan-btn').style.display = 'none'; // Nascondi bottone dopo avvio
    } catch (err) {
        alert("Errore fotocamera: " + err);
    }
}

function mostraRisultato(codice) {
    const resDiv = document.getElementById('scan-result');
    resDiv.style.display = 'block';

    if (prodottiEsempio[codice]) {
        const p = prodottiEsempio[codice];
        resDiv.style.backgroundColor = "var(--accent)";
        resDiv.innerHTML = `🌟 TROVATO: ${p.nome}<br>✨ IDEA: ${p.idea}`;
        
        // Vibrazione di successo
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    } else {
        resDiv.style.backgroundColor = "#f0f0f0";
        resDiv.innerHTML = `Codice: ${codice}<br>Prodotto non trovato... usa la fantasia!`;
    }
}