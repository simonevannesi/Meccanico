# 🏁 MotoSAG & Service - WebApp Manutenzione & Sospensioni Moto

Una WebApp leggera, moderna e autonoma (funziona al 100% offline) per la gestione della manutenzione programmata ad ore/km della moto, il calcolo e la diagnostica del **SAG (Static e Rider Sag)** e l'annotazione dei settaggi delle sospensioni (clicker e precarico).

Progettata per essere usata comodamente da **iPhone** (tramite Safari come WebApp a tutto schermo o segnalibro) e ospitata gratuitamente su **GitHub Pages**.

---

## 🚀 Caratteristiche Principali

### 1. ⏱️ Manutenzione Programmata ad Ore & Km
- **Preset Ufficiali Precaricati dai Manuali d'Officina**:
  - **Yamaha YZ 250 (2-Stroke)**: intervalli 3h (ogni manche/uscita), 10h (olio cambio Yamalube 10W-30, candela BR8EG), 25h (controllo pistone, pulizia valvola YPVS, dischi frizione), 40h (revisione forcelle KYB SSS, ingrassaggio leveraggi MoS2), 50h (sostituzione pistone).
  - **KTM 65 SX (2007)**: intervalli 2h (filtro, catena, spurgo forcelle), 10h (olio cambio 15W-50 / ATF Dexron III), 20h (pacco lamellare, dischi frizione, usura pistone), 40h (sostituzione pistone e cuscinetti di banco, revisione mono WP, fluido frizione Magura).
  - **Moto Personalizzate**: possibilità di aggiungere qualsiasi moto (es. KTM EXC, Honda CRF, Beta RR...) con conteggio a ore o km e scadenze personalizzate.
- **Calcolo Dinamico Scadenze**: inserendo le ore totali attuali, l'app calcola istantaneamente:
  - 🔴 **Scaduti**: lavori da fare subito (con badge e avviso prioritario).
  - 🟡 **In Scadenza**: componenti prossimi al termine delle ore utili.
  - 🟢 **In Regola**: ore rimanenti e percentuale di vita utile residua con barra grafica.
- **Pulsante rapido "✅ Segna come Fatto a [X] ore"**: registra l'intervento e aggiorna istantaneamente lo storico.
- **Tasti rapidi ore**: pulsanti `+0.5h`, `+1.0h`, `+2.0h` per aggiornare al volo il contaore al rientro dalla manche in pista.

---

### 2. 📏 Calcolatore & Diagnostica SAG (Assetto)
- **Guida Grafica alle Misurazioni**:
  - **Misura A**: Moto sul cavalletto centrale con ruota posteriore completamente sollevata dal suolo.
  - **Misura B**: Moto a terra con il proprio peso (senza pilota).
  - **Misura C**: Moto a terra con il pilota a bordo in abbigliamento completo da gara.
- **Calcolo Automatico**:
  - **Static Sag (Free Sag)** = `A - B` (Target YZ250: 25 - 40 mm | Target KTM 65: 8 - 18 mm)
  - **Rider Sag (Race Sag / Sunken Length)** = `A - C` (Target YZ250: 90 - 100 mm | Target KTM 65: 90 ± 5 mm)
- **Diagnosi Intelligente della Molla e del Precarico**:
  - L'app valuta i millimetri inseriti e ti dice esattamente cosa fare:
    - Se stringere o allentare la ghiera di precarico.
    - Se la molla è troppo morbida (es. Rider Sag corretto ma Static Sag scarso < 25 mm).
    - Se la molla è troppo dura (Static Sag eccessivo > 40 mm).
- **Modulo SAG Forcella Anteriore**: con calcolo dell'affondamento steli `C - D`.

---

### 3. ⚙️ Scheda Settaggi Sospensioni (Clicker Sheet)
- **Forcella Anteriore**:
  - Click Compressione (da tutto chiuso)
  - Click Ritorno / Estensione
  - Sfilamento steli dalla piastra (mm)
- **Mono Posteriore**:
  - Precarico molla (lunghezza libera/montata in mm)
  - Compressione Basse Velocità (LSC - click)
  - Compressione Alte Velocità (HSC - giri)
  - Ritorno / Estensione (clicks)
- **Salvataggio Profili Assetto**:
  - Salva setup specifici con note sul fondo della pista (es. *"Viterbo - Fango Pesante"*, *"Pista Dura e Secca"*, *"Sabbia"*).
  - Ricarica qualsiasi assetto con un solo tocco.

---

### 4. 📋 Storico Interventi & Note
- Registro cronologico completo di ogni lavoro eseguito con data e ore moto.
- Esportazione e importazione file di backup `.json`.

---

## 📲 Come Usarla su iPhone (WebApp / Segnalibro)

Puoi utilizzarla su iPhone come se fosse un'app installata dall'App Store:

1. Apri **Safari** sul tuo iPhone e naviga all'indirizzo dell'app (oppure il link di GitHub Pages).
2. Tocca l'icona di **Condivisione** in basso (il quadrato con la freccia in su ⬆️).
3. Scorri le opzioni e tocca **"Aggiungi alla schermata Home"** (o "Aggiungi ai preferiti").
4. Clicca su **Aggiungi** in alto a destra.
5. Sulla schermata Home comparirà l'icona con il monoammortizzatore e la chiave inglese! Toccandola si aprirà a schermo intero senza barre del browser, funzionando anche in **modalità OFFLINE** (in pista senza campo).

---

## 🌐 Come Pubblicarla GRATIS su GitHub Pages in 2 Minuti

1. Crea un repository su [GitHub](https://github.com/new) (es. `Meccanico` o `motosag`).
2. Fai il push o carica i file di questa cartella:
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `icon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
3. Nel repository su GitHub, vai su **Settings** > **Pages** (nel menu a sinistra).
4. Alla voce **Branch**, seleziona `main` (oppure `master`) e lascia la cartella `/ (root)`.
5. Clicca su **Save**.
6. Dopo circa 60 secondi la tua app sarà attiva all'indirizzo:
   `https://TUO-USERNAME.github.io/NOME-REPO/`

---

## 💻 Come Provarla Subito in Locale sul Tuo PC

Fai semplicemente doppio click sul file [index.html](file:///c:/Users/simov/Meccanico/index.html) per aprirla direttamente nel tuo browser preferito (Chrome, Edge, Safari).
