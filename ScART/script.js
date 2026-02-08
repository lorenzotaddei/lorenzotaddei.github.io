/* 1. NAVIGAZIONE E INIZIALIZZAZIONE */
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pages.forEach(p => {
                p.classList.remove('active');
                if (p.id === target) p.classList.add('active');
            });
            if (navigator.vibrate) navigator.vibrate(15);
        });
    });

    // Carichiamo i progetti iniziali "di serie"
    mieCreazioni = [
        {
            titolo: "Memory Pasta",
            data: "18 Gennaio 2026",
            eta: "3-5",
            materiali: ["Vasetto di sugo", "Pacco di pasta"],
            utensili: ["Forbici"]
        },
        {
            titolo: "Treno cartoni di latte",
            data: "24 Gennaio 2026",
            eta: "3-5",
            materiali: ["Cartone del latte", "Cartone del latte", "Cartone del latte", "Scatola di cereali"],
            utensili: ["Forbici"]
        }
    ];

    popolaDatabaseManuale();
    aggiornaListaCreazioniUI(); // Mostra subito i progetti iniziali
});

/* 2. DATABASE E STATO APP */
const databaseProdotti = {
    "8003170039582": { nome: "SCATOLA DI CEREALI - muesli croccante" },
    "8001120448033": { nome: "VASETTO DI MARMELLATA - Fragola Light" }
};

const databaseCategorie = {
    "📦 CARTONE E CARTA": ["Cartone del latte", "Cartone del succo", "Scatola dei cereali", "Scatola della pasta", "Confezione uova", "Scatola dei biscotti", "Scatola del tè", "Tubo patatine", "Anima rotolo carta"],
    "🥤 PLASTICA": ["Bottiglia acqua/bibita", "Vasetto yogurt", "Flacone detersivo", "Bottiglia latte (rigida)", "Vaschetta frutta", "Contenitore gelato"],
    "🥫 METALLO E VETRO": ["Barattolo conserve (latta)", "Lattina bibita", "Barattolo marmellata", "Bottiglia olio/aceto"],
    "🥖 ALTRO": ["Sacchetto pane", "Rete arance/patate", "Vaschetta alluminio"]
};

let prodottiSelezionati = [];
let mieCreazioni = []; 
let prodottoInAttesa = null;
let creazCorrenteIndex = null;
let html5QrCode;

/* 3. FUNZIONI SCANNER */
async function iniziaScansione() {
    if (html5QrCode && html5QrCode.isScanning) return;
    html5QrCode = new Html5Qrcode("reader");
    try {
        await html5QrCode.start(
            { facingMode: "environment" }, 
            { fps: 20, qrbox: { width: 250, height: 150 } },
            (t) => mostraRisultato(t)
        );
        document.getElementById('scan-btn').innerText = "FOTOCAMERA ON";
    } catch (err) { alert("Permesso negato o errore camera."); }
}

function mostraRisultato(codice) {
    const resDiv = document.getElementById('scan-result');
    const resText = document.getElementById('result-text');
    const choices = document.getElementById('action-choices');
    resDiv.style.display = 'block';

    if (databaseProdotti[codice]) {
        prodottoInAttesa = databaseProdotti[codice];
        resDiv.style.backgroundColor = "var(--accent)";
        resText.innerHTML = `🌟 RILEVATO: ${prodottoInAttesa.nome}`;
        choices.style.display = 'flex';
    } else {
        resText.innerHTML = `Codice: ${codice}<br>Prodotto non a catalogo.`;
        choices.style.display = 'none';
        resDiv.style.backgroundColor = "#f0f0f0";
    }
}

/* 4. GESTIONE LISTA PRODOTTI */
function confermaAggiunta() {
    if (prodottoInAttesa) {
        prodottiSelezionati.push(prodottoInAttesa.nome);
        aggiornaUIProdotti();
        annullaScansione();
        if (navigator.vibrate) navigator.vibrate(20);
    }
}

function aggiungiManualmente(nomeProdotto) {
    prodottiSelezionati.push(nomeProdotto);
    aggiornaUIProdotti();
    if (navigator.vibrate) navigator.vibrate(20);
    const btn = event.target;
    const txt = btn.innerText;
    btn.innerText = "OK!";
    setTimeout(() => btn.innerText = txt, 800);
}

function aggiornaUIProdotti() {
    const count = prodottiSelezionati.length;
    document.getElementById('count-prodotti').innerText = count;
    document.getElementById('btn-ready-scan-page').style.display = count > 0 ? 'block' : 'none';

    const listaUl = document.getElementById('lista-prodotti-ul');
    listaUl.innerHTML = "";
    prodottiSelezionati.forEach(p => {
        const li = document.createElement('li');
        li.style.cssText = "background:white; padding:10px; margin-bottom:5px; border-radius:10px; display:flex; justify-content:space-between;";
        li.innerHTML = `<span>${p}</span>`;
        listaUl.appendChild(li);
    });
    document.getElementById('empty-msg').style.display = count > 0 ? 'none' : 'block';
}

/* 5. FLUSSO COSTRUZIONE PROGETTI */
function apriSetupCostruzione() {
    chiudiModaleLista();
    document.getElementById('modal-setup').style.display = 'block';
}

function mostraProgettiSuggeriti() {
    chiudiModale('modal-setup');
    document.getElementById('modal-progetti').style.display = 'block';
}

function selezionaProgetto(nome) {
    const utensili = Array.from(document.querySelectorAll('#checklist-setup input:checked')).map(i => i.value);
    const nuovaCreazione = {
        titolo: nome,
        data: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long' }),
        eta: document.getElementById('eta-bambino').value,
        materiali: [...prodottiSelezionati],
        utensili: utensili
    };
    
    mieCreazioni.push(nuovaCreazione);
    prodottiSelezionati = []; 
    aggiornaUIProdotti();
    aggiornaListaCreazioniUI();
    
    chiudiModale('modal-progetti');
    document.querySelector('[data-target="creazioni"]').click();
}

/* 6. GESTIONE CREAZIONI E DETTAGLI */
function aggiornaListaCreazioniUI() {
    const container = document.getElementById('main-creation-list');
    container.innerHTML = ""; 
    
    // Mostriamo i progetti dal più recente al più vecchio
    [...mieCreazioni].reverse().forEach((c) => {
        // Troviamo l'indice originale nell'array mieCreazioni per il dettaglio
        const originalIndex = mieCreazioni.indexOf(c);
        const li = document.createElement('li');
        li.style.cursor = "pointer";
        li.innerHTML = `<span class="item-name">${c.titolo}</span><span class="item-date">${c.data}</span>`;
        li.onclick = () => apriDettaglioModale(originalIndex);
        container.appendChild(li);
    });
}

function apriDettaglioModale(index) {
    creazCorrenteIndex = index;
    const c = mieCreazioni[index];
    document.getElementById('det-titolo').innerText = c.titolo;
    document.getElementById('det-data').innerText = "Progetto del " + c.data;
    document.getElementById('det-prodotti').innerText = c.materiali.join(", ");
    document.getElementById('det-eta').value = c.eta;

    const utensiliList = ["Colla", "Forbici", "Scotch", "Pennarelli", "Filo", "Pinzatrice"];
    const utCont = document.getElementById('det-utensili');
    utCont.innerHTML = "";
    utensiliList.forEach(u => {
        const checked = c.utensili.includes(u) ? "checked" : "";
        utCont.innerHTML += `<label><input type="checkbox" value="${u}" ${checked}> ${u}</label>`;
    });

    document.getElementById('modal-dettaglio').style.display = 'block';
}

function salvaModificheDettaglio() {
    const c = mieCreazioni[creazCorrenteIndex];
    c.eta = document.getElementById('det-eta').value;
    c.utensili = Array.from(document.querySelectorAll('#det-utensili input:checked')).map(i => i.value);
    alert("Modifiche salvate con successo!");
    chiudiModale('modal-dettaglio');
}

// Funzione per le creazioni degli altri
function apriInfoAltri(titolo) {
    document.getElementById('altri-titolo').innerText = titolo;
    document.getElementById('modal-altri').style.display = 'block';
}

/* 7. UTILITY */
function popolaDatabaseManuale() {
    const container = document.getElementById('database-manuale-ul');
    container.innerHTML = "";
    Object.keys(databaseCategorie).forEach(cat => {
        const li = document.createElement('li');
        li.className = "accordion-item";
        li.style.marginBottom = "10px";
        li.innerHTML = `
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')" style="background:#eee; padding:10px; border-radius:10px; display:flex; justify-content:space-between; cursor:pointer;">
                <strong>${cat}</strong> <span>▼</span>
            </div>
            <div class="accordion-content" style="display:none; padding:10px; background:#f9f9f9;">
                ${databaseCategorie[cat].map(prod => `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                        <span style="font-size:0.9rem;">${prod}</span>
                        <button class="btn-add-small" onclick="aggiungiManualmente('${prod.replace(/'/g, "\\'")}')">AGGIUNGI</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(li);
    });
}

function toggleAccordion(element) {
    element.parentElement.classList.toggle('open');
}

function chiudiModale(id) { document.getElementById(id).style.display = 'none'; }
function apriModaleManuale() { document.getElementById('modal-manuale').style.display = 'block'; }
function chiudiModaleManuale() { document.getElementById('modal-manuale').style.display = 'none'; }
function apriModaleLista() { document.getElementById('modal-lista').style.display = 'block'; }
function chiudiModaleLista() { document.getElementById('modal-lista').style.display = 'none'; }
function annullaScansione() { document.getElementById('scan-result').style.display = 'none'; }