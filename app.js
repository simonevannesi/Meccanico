/**
 * MotoSAG & Service - Application Logic
 * Supporta YZ250, KTM 65 SX e Moto Custom (Cross / Enduro)
 * Dati estratti direttamente dai manuali ufficiali d'officina
 */

const STORAGE_KEY = 'motosag_app_data_v1';

// Database dei modelli preimpostati con dati estratti dai manuali
const DEFAULT_PRESETS = {
  'yz250': {
    id: 'yz250',
    name: 'Yamaha YZ 250 (2-Stroke)',
    type: 'hours',
    unit: 'h',
    hours: 28.5,
    specs: {
      engine: '249 cc 2T a liquido con valvola YPVS',
      sparkPlug: 'NGK BR8EG (gap: 0.5 - 0.6 mm)',
      transOil: '750 ml (800 ml a secco) - Yamalube 4 10W-30 o SAE 10W-30',
      chainSlack: '48 – 58 mm (al centro del forcellone)',
      tirePressure: 'Ant: 1.0 bar (15 psi) | Post: 1.0 bar (15 psi)',
      forkOil: 'Suspension Oil S1 (~330-360 cc per stelo)',
      fuelRatio: 'Miscela 1:30 (3.3%) o 1:40 (2.5%) olio sintetico 2T racing'
    },
    sagSpecs: {
      riderSagTarget: 95, // mm
      riderSagMin: 90,
      riderSagMax: 100,
      staticSagTarget: 35,
      staticSagMin: 25,
      staticSagMax: 40,
      forkSagTarget: 40,
      forkSagMin: 35,
      forkSagMax: 45,
      rearMethod: "Perno ruota posteriore fino al bullone parafango/fianchetto",
      notes: "Misurare A (sul cavalletto ruota libera), B (a terra senza pilota), C (con pilota in piedi/seduto in posizione di guida)."
    },
    defaultClickers: {
      forkCompression: 10, // clicks da tutto chiuso
      forkRebound: 10,     // clicks da tutto chiuso
      forkHeight: 5,       // mm sfilamento dalla piastra
      forkAirBleed: 'Spurgata prima di ogni manche',
      shockPreload: 255,   // mm lunghezza molla montata
      shockLSC: 11,        // Low speed comp (click)
      shockHSC: 1.25,      // High speed comp (giri)
      shockRebound: 11,    // Ritorno (click)
      trackNote: 'Assetto Standard Manuale YZ250'
    },
    tasks: [
      {
        id: 'yz_air_filter',
        name: 'Pulizia e oliatura Filtro Aria',
        interval: 3,
        lastDone: 27.0,
        critical: true,
        desc: 'Lavare con solvente specifico per filtri in spugna, asciugare e oliare uniformemente con olio adesivo per filtri.',
        manualRef: 'Manuale YZ250 Sez. 3-2'
      },
      {
        id: 'yz_chain_lube',
        name: 'Lubrificazione e Tensione Catena',
        interval: 3,
        lastDone: 27.0,
        critical: false,
        desc: 'Verificare gioco catena tra 48 e 58 mm. Ingrassare con spray per catene da fuoristrada.',
        manualRef: 'Manuale YZ250 Sez. 3-2'
      },
      {
        id: 'yz_bleed_forks',
        name: 'Spurgo Aria Steli Forcella',
        interval: 3,
        lastDone: 27.0,
        critical: false,
        desc: 'Con ruota anteriore sollevata dal suolo, svitare la vite di sfiato superiore per scaricare la pressione interna accumulata.',
        manualRef: 'Manuale YZ250 Sez. 3-3'
      },
      {
        id: 'yz_trans_oil',
        name: 'Sostituzione Olio Cambio (Trasmissione)',
        interval: 10,
        lastDone: 20.0,
        critical: true,
        desc: '750 ml olio Yamalube 4 (10W-30) o SAE 10W-30 SE. Serrare vite di scolo a 20 Nm.',
        manualRef: 'Manuale YZ250 Sez. 3-1'
      },
      {
        id: 'yz_spark_plug',
        name: 'Ispezione / Pulizia Candela',
        interval: 10,
        lastDone: 20.0,
        critical: false,
        desc: 'Candela NGK BR8EG. Verificare colore elettrodo e distanza corretta: 0.5 - 0.6 mm. Serrare a 28 Nm.',
        manualRef: 'Manuale YZ250 Sez. 3-2'
      },
      {
        id: 'yz_brakes_fluid',
        name: 'Controllo Freni e Pastiglie',
        interval: 10,
        lastDone: 20.0,
        critical: true,
        desc: 'Spessore materiale d\'attrito min. 1.0 mm. Controllo livello liquido freni DOT 4.',
        manualRef: 'Manuale YZ250 Sez. 3-3'
      },
      {
        id: 'yz_piston_check',
        name: 'Ispezione Pistone & Fasce Elastiche',
        interval: 25,
        lastDone: 0.0,
        critical: true,
        desc: 'Rimuovere testa e cilindro. Verificare usura mantello pistone, gioco fascia elastica (limite 0.65 mm) e usura cromatura cilindro.',
        manualRef: 'Manuale YZ250 Sez. 3-1 & 4-17'
      },
      {
        id: 'yz_ypvs_clean',
        name: 'Pulizia Valvola Scarico YPVS',
        interval: 25,
        lastDone: 0.0,
        critical: false,
        desc: 'Rimuovere i coperchi laterali e il cilindro, pulire le scorie carboniose dai condotti e dalle ghigliottine senza rigarle.',
        manualRef: 'Manuale YZ250 Sez. 4-45'
      },
      {
        id: 'yz_clutch_plates',
        name: 'Controllo Dischi e Molle Frizione',
        interval: 25,
        lastDone: 10.0,
        critical: false,
        desc: 'Spessore dischi guarniti (min 2.7 mm), curvatura dischi in acciaio (max 0.1 mm), lunghezza libera molle (min 49.0 mm).',
        manualRef: 'Manuale YZ250 Sez. 4-31'
      },
      {
        id: 'yz_fork_service',
        name: 'Revisione Forcelle (Olio e Paraoli)',
        interval: 40,
        lastDone: 0.0,
        critical: true,
        desc: 'Sostituzione olio interno ed esterno (KYB Suspension Oil S1), sostituzione paraoli e parapolvere, pulizia lamelle.',
        manualRef: 'Manuale YZ250 Sez. 5-22'
      },
      {
        id: 'yz_shock_linkage',
        name: 'Ingrassaggio Forcellone e Leveraggi Mono',
        interval: 40,
        lastDone: 0.0,
        critical: true,
        desc: 'Smontaggio cuscinetti a rullini forcellone, relay arm e bielle. Lubrificare con grasso al bisolfuro di molibdeno (MoS2).',
        manualRef: 'Manuale YZ250 Sez. 5-46'
      },
      {
        id: 'yz_piston_replace',
        name: 'Sostituzione Completa Pistone e Gabbia a Rulli',
        interval: 50,
        lastDone: 0.0,
        critical: true,
        desc: 'Pistone nuovo, gabbia rulli argentata spinotto, spinotto, seeger e guarnizioni nuove OEM.',
        manualRef: 'Manuale YZ250 Sez. 4-17'
      }
    ]
  },

  'ktm65': {
    id: 'ktm65',
    name: 'KTM 65 SX (2007)',
    type: 'hours',
    unit: 'h',
    hours: 18.0,
    specs: {
      engine: '64.9 cc 2T raffreddato a liquido',
      sparkPlug: 'NGK LR8A',
      transOil: '300 ml - Olio cambio 15W-50 o ATF Dexron III',
      chainSlack: 'Catenella tesa con 2 dita di gioco sopra il forcellone',
      tirePressure: 'Ant: 1.0 bar | Post: 1.0 bar',
      forkOil: 'SAE 5 (~160 cc per stelo)',
      fuelRatio: 'Miscela 1:60 (1.6%) con olio 100% sintetico 2T raccomandato KTM'
    },
    sagSpecs: {
      riderSagTarget: 90, // mm
      riderSagMin: 85,
      riderSagMax: 95,
      staticSagTarget: 12,
      staticSagMin: 8,
      staticSagMax: 18,
      forkSagTarget: 45,
      forkSagMin: 40,
      forkSagMax: 50,
      rearMethod: "Perno ruota posteriore a punto fisso sul codino/fianchetto",
      notes: "KTM 65 SX 2007: Sag mono target 90 mm (±5 mm) con bambino vestito completo (35-45 kg). Sag forcella target 45 mm (±5 mm)."
    },
    defaultClickers: {
      forkCompression: 0,
      forkRebound: 0,
      forkHeight: 0,
      forkAirBleed: 'Spurgo aria eseguito regolarmente',
      shockPreload: 6, // mm precarico molla
      shockLSC: 0,
      shockHSC: 0,
      shockRebound: 0,
      trackNote: 'Setup originale KTM 65 SX per pilota 35-45kg'
    },
    tasks: [
      {
        id: 'ktm_filter',
        name: 'Pulizia Filtro Aria e Cassa Filtro',
        interval: 2,
        lastDone: 17.0,
        critical: true,
        desc: 'Pulire spugna con detergente specifico, asciugare e trattare con olio liquido per filtri.',
        manualRef: 'Manuale KTM 65 Pag. 15'
      },
      {
        id: 'ktm_chain',
        name: 'Pulizia, Tensione e Ingrassaggio Catena',
        interval: 2,
        lastDone: 17.0,
        critical: false,
        desc: 'Verificare tensione, pulire con spazzola e lubrificare prima di ogni sessione.',
        manualRef: 'Manuale KTM 65 Pag. 15'
      },
      {
        id: 'ktm_fork_bleed',
        name: 'Spurgo Aria Steli Forcella',
        interval: 2,
        lastDone: 17.0,
        critical: false,
        desc: 'Aprire la vite di spurgo su ciascun tappo forcella con moto sul cavalletto.',
        manualRef: 'Manuale KTM 65 Pag. 15'
      },
      {
        id: 'ktm_trans_oil',
        name: 'Sostituzione Olio Trasmissione',
        interval: 10,
        lastDone: 10.0,
        critical: true,
        desc: 'Sostituire 300 ml di olio motore per 2T SAE 15W-50 o Dexron III.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_carb_float',
        name: 'Pulizia e Spurgo Vaschetta Carburatore',
        interval: 10,
        lastDone: 10.0,
        critical: false,
        desc: 'Spurgare la vaschetta del carburatore per rimuovere condensa e sedimenti.',
        manualRef: 'Manuale KTM 65 Pag. 15'
      },
      {
        id: 'ktm_reed_valve',
        name: 'Controllo Pacco Lamellare',
        interval: 20,
        lastDone: 0.0,
        critical: true,
        desc: 'Verificare integrità e planarità delle lamelle d\'aspirazione in carbonio/fibra.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_clutch_check',
        name: 'Controllo Dischi e Molle Frizione',
        interval: 20,
        lastDone: 0.0,
        critical: true,
        desc: 'Misurare spessore dischi frizione e lunghezza molle di compressione.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_piston_check',
        name: 'Controllo Gioco Pistone e Biella',
        interval: 20,
        lastDone: 0.0,
        critical: true,
        desc: 'Ispezionare cilindro, mantello pistone e verificare gioco radiale gabbia a rulli biella.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_piston_replace',
        name: 'Sostituzione Pistone e Cuscinetti di Banco',
        interval: 40,
        lastDone: 0.0,
        critical: true,
        desc: 'Sostituire pistone completo di fasce e spinotto. Verificare albero e cuscinetti di banco.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_suspension_full',
        name: 'Revisione Completa Forcella e Monoammortizzatore',
        interval: 40,
        lastDone: 0.0,
        critical: true,
        desc: 'Cambio olio forcelle, sostituzione paraoli, revisione ammortizzatore posteriore WP.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      },
      {
        id: 'ktm_fluids',
        name: 'Cambio Fluido Frizione Idraulica e Freni',
        interval: 40,
        lastDone: 0.0,
        critical: true,
        desc: 'Spurgo e cambio olio minerale frizione idraulica Magura e liquido freni DOT 5.1.',
        manualRef: 'Manuale KTM 65 Pag. 16'
      }
    ]
  }
};

// Stato dell'applicazione
let appData = {
  currentBikeId: 'yz250',
  bikes: JSON.parse(JSON.stringify(DEFAULT_PRESETS)),
  history: [],
  suspensionProfiles: []
};

// Inizializzazione al caricamento
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  renderAll();
  registerServiceWorker();
});

// Salvataggio e Caricamento
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appData = {
        currentBikeId: parsed.currentBikeId || 'yz250',
        bikes: parsed.bikes || JSON.parse(JSON.stringify(DEFAULT_PRESETS)),
        history: parsed.history || [],
        suspensionProfiles: parsed.suspensionProfiles || []
      };

      // Rimuovi Kymco se era salvato in precedenza
      if (appData.bikes['agility125']) {
        delete appData.bikes['agility125'];
      }
      if (appData.currentBikeId === 'agility125') {
        appData.currentBikeId = 'yz250';
      }

      // Assicura che le moto default esistano anche se salvate in precedenza
      for (const key of Object.keys(DEFAULT_PRESETS)) {
        if (!appData.bikes[key]) {
          appData.bikes[key] = JSON.parse(JSON.stringify(DEFAULT_PRESETS[key]));
        }
      }
    } catch (e) {
      console.error('Errore ripristino dati:', e);
    }
  } else {
    // Profilo sospensioni iniziale demo per la moto corrente
    appData.suspensionProfiles.push({
      id: 'prof_' + Date.now(),
      bikeId: 'yz250',
      name: 'Assetto Standard Manuale',
      date: new Date().toLocaleDateString('it-IT'),
      notes: 'Setup di riferimento consigliato dalla casa madre.',
      forkComp: 10,
      forkReb: 10,
      forkHeight: 5,
      shockPreload: 255,
      shockLSC: 11,
      shockHSC: 1.25,
      shockReb: 11
    });
    saveData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// Accesso alla moto attiva
function getCurrentBike() {
  return appData.bikes[appData.currentBikeId] || appData.bikes['yz250'];
}

// Configurazione Event Listener
function setupEventListeners() {
  // Cambio Moto
  const bikeSelect = document.getElementById('bikeSelect');
  if (bikeSelect) {
    bikeSelect.addEventListener('change', (e) => {
      appData.currentBikeId = e.target.value;
      saveData();
      renderAll();
    });
  }

  // Pulsanti navigazione Tab
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Aggiornamento Ore Rapido
  document.getElementById('btnSaveHours')?.addEventListener('click', () => {
    const input = document.getElementById('inputBikeHours');
    const newHours = parseFloat(input.value);
    if (!isNaN(newHours) && newHours >= 0) {
      getCurrentBike().hours = newHours;
      saveData();
      renderAll();
      showToast(`Ore aggiornate a ${newHours} ${getCurrentBike().unit}!`);
    }
  });

  // Pulsanti incrementali (+0.5h, +1.0h, +2.0h)
  document.querySelectorAll('.btn-quick-hour').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseFloat(btn.dataset.delta);
      const bike = getCurrentBike();
      bike.hours = Math.round((bike.hours + delta) * 10) / 10;
      saveData();
      renderAll();
      showToast(`+${delta} ${bike.unit} registrate! Totale: ${bike.hours} ${bike.unit}`);
    });
  });

  // Calcolo SAG
  document.getElementById('btnCalcSag')?.addEventListener('click', calculateSag);
  ['sagA', 'sagB', 'sagC'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateSag);
  });

  // Calcolo SAG Forcella
  document.getElementById('btnCalcSagFork')?.addEventListener('click', calculateForkSag);
  ['sagForkC', 'sagForkD'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateForkSag);
  });

  // Salvataggio Profilo Sospensioni
  document.getElementById('btnSaveProfile')?.addEventListener('click', saveSuspensionProfile);

  // Aggiunta Nuova Manutenzione Personalizzata
  document.getElementById('btnOpenAddModal')?.addEventListener('click', () => {
    document.getElementById('addTaskModal').classList.add('active');
  });
  document.getElementById('btnCloseTaskModal')?.addEventListener('click', () => {
    document.getElementById('addTaskModal').classList.remove('active');
  });
  document.getElementById('formAddTask')?.addEventListener('submit', handleAddTaskSubmit);

  // Backup & Ripristino
  document.getElementById('btnExportJson')?.addEventListener('click', exportData);
  document.getElementById('btnImportJson')?.addEventListener('click', () => {
    document.getElementById('fileImportInput').click();
  });
  document.getElementById('fileImportInput')?.addEventListener('change', importData);
  document.getElementById('btnResetDefaults')?.addEventListener('click', resetDefaults);

  // Aggiungi Nuova Moto
  document.getElementById('btnOpenAddBike')?.addEventListener('click', () => {
    document.getElementById('addBikeModal').classList.add('active');
  });
  document.getElementById('btnCloseBikeModal')?.addEventListener('click', () => {
    document.getElementById('addBikeModal').classList.remove('active');
  });
  document.getElementById('formAddBike')?.addEventListener('submit', handleAddBikeSubmit);

  // Modal Guida GitHub
  document.getElementById('btnHelpGithub')?.addEventListener('click', () => {
    document.getElementById('githubModal').classList.add('active');
  });
  document.getElementById('btnCloseGithubModal')?.addEventListener('click', () => {
    document.getElementById('githubModal').classList.remove('active');
  });
}

// Rendering Completo
function renderAll() {
  renderBikeSelector();
  renderDashboard();
  renderSagTab();
  renderSuspensionsTab();
  renderHistoryTab();
}

// Rendering Selettore Moto
function renderBikeSelector() {
  const select = document.getElementById('bikeSelect');
  if (!select) return;
  select.innerHTML = '';
  
  Object.keys(appData.bikes).forEach(id => {
    const bike = appData.bikes[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${bike.name} (${bike.hours} ${bike.unit})`;
    if (id === appData.currentBikeId) opt.selected = true;
    select.appendChild(opt);
  });

  const bike = getCurrentBike();
  const inputHours = document.getElementById('inputBikeHours');
  if (inputHours) inputHours.value = bike.hours;
  
  const unitLabel = document.getElementById('currentUnitLabel');
  if (unitLabel) unitLabel.textContent = bike.unit === 'h' ? 'Ore totali' : 'Km totali';
}

// Rendering Dashboard Manutenzione
function renderDashboard() {
  const bike = getCurrentBike();
  const tasksContainer = document.getElementById('tasksList');
  if (!tasksContainer) return;
  tasksContainer.innerHTML = '';

  // Calcolo statistiche
  let dueCount = 0;
  let upcomingCount = 0;
  let okCount = 0;

  // Analisi e ordinamento task per urgenza
  const tasksWithStatus = (bike.tasks || []).map(task => {
    const hoursSinceLast = bike.hours - (task.lastDone || 0);
    const hoursRemaining = Math.round((task.interval - hoursSinceLast) * 10) / 10;
    const progressPercent = Math.min(100, Math.max(0, (hoursSinceLast / task.interval) * 100));

    let status = 'ok'; // ok, warning, danger
    if (hoursRemaining <= 0) {
      status = 'danger';
      dueCount++;
    } else if (hoursRemaining <= task.interval * 0.25 || hoursRemaining <= 3) {
      status = 'warning';
      upcomingCount++;
    } else {
      okCount++;
    }

    return {
      ...task,
      hoursSinceLast,
      hoursRemaining,
      progressPercent,
      status
    };
  });

  // Ordina: prima le scadenze superate (danger), poi warning, poi ok
  tasksWithStatus.sort((a, b) => {
    const statusOrder = { danger: 0, warning: 1, ok: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.hoursRemaining - b.hoursRemaining;
  });

  // Aggiorna Badge del Contatore
  document.getElementById('statDueCount').textContent = dueCount;
  document.getElementById('statUpcomingCount').textContent = upcomingCount;
  document.getElementById('statOkCount').textContent = okCount;

  // Se ci sono interventi urgenti, mostra alert prominente
  const urgentBanner = document.getElementById('urgentBanner');
  if (urgentBanner) {
    if (dueCount > 0) {
      urgentBanner.style.display = 'flex';
      urgentBanner.innerHTML = `
        <div class="urgent-icon">⚠️</div>
        <div class="urgent-text">
          <strong>${dueCount} INTERVENTO/I SCADUTO/I!</strong>
          <span>La manutenzione programmata dal manuale richiede interventi immediati.</span>
        </div>
      `;
    } else {
      urgentBanner.style.display = 'none';
    }
  }

  // Schede dei singoli task
  tasksWithStatus.forEach(t => {
    const card = document.createElement('div');
    card.className = `task-card status-${t.status}`;
    
    let statusBadgeText = '';
    let statusClass = '';
    if (t.status === 'danger') {
      const overdueBy = Math.abs(t.hoursRemaining);
      statusBadgeText = overdueBy === 0 ? 'DA FARE ADESSO' : `SCADUTO DA ${overdueBy} ${bike.unit}`;
      statusClass = 'badge-danger';
    } else if (t.status === 'warning') {
      statusBadgeText = `Scade tra ${t.hoursRemaining} ${bike.unit}`;
      statusClass = 'badge-warning';
    } else {
      statusBadgeText = `OK (tra ${t.hoursRemaining} ${bike.unit})`;
      statusClass = 'badge-success';
    }

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title-wrap">
          <span class="task-title">${t.name}</span>
          ${t.critical ? '<span class="badge-critical" title="Critico per affidabilità motore">CRITICO</span>' : ''}
        </div>
        <span class="task-status-badge ${statusClass}">${statusBadgeText}</span>
      </div>

      <p class="task-desc">${t.desc || ''}</p>
      
      <div class="task-progress-wrap">
        <div class="task-progress-bar">
          <div class="task-progress-fill status-fill-${t.status}" style="width: ${t.progressPercent}%"></div>
        </div>
        <div class="task-progress-labels">
          <span>Ultimo: <strong>${t.lastDone || 0} ${bike.unit}</strong> (fatti ${t.hoursSinceLast.toFixed(1)} ${bike.unit})</span>
          <span>Intervallo: <strong>ogni ${t.interval} ${bike.unit}</strong></span>
        </div>
      </div>

      <div class="task-footer">
        <small class="task-ref">📖 ${t.manualRef || 'Manuale d\'officina'}</small>
        <button class="btn-done" data-id="${t.id}" data-name="${t.name}">
          ✅ Segna come Fatto (${bike.hours} ${bike.unit})
        </button>
      </div>
    `;

    tasksContainer.appendChild(card);
  });

  // Assegna click ai pulsanti "Segna come Fatto"
  document.querySelectorAll('.btn-done').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = btn.dataset.id;
      const taskName = btn.dataset.name;
      markTaskAsDone(taskId, taskName);
    });
  });

  // Render specifiche veloci della moto
  renderBikeSpecs();
}

function renderBikeSpecs() {
  const bike = getCurrentBike();
  const specsContainer = document.getElementById('bikeSpecsBox');
  if (!specsContainer || !bike.specs) return;

  let html = '<div class="specs-grid">';
  Object.entries(bike.specs).forEach(([k, val]) => {
    const labels = {
      engine: '🔧 Motore',
      sparkPlug: '⚡ Candela',
      transOil: '🛢️ Olio Cambio',
      engineOil: '🛢️ Olio Motore',
      chainSlack: '⛓️ Gioco Catena',
      tirePressure: '🛞 Pressioni Gomme',
      forkOil: '🧪 Olio Forcelle',
      fuelRatio: '⛽ Miscela Raccomandata',
      valveClearance: '📏 Gioco Valvole'
    };
    html += `
      <div class="spec-item">
        <div class="spec-label">${labels[k] || k}</div>
        <div class="spec-val">${val}</div>
      </div>
    `;
  });
  html += '</div>';
  specsContainer.innerHTML = html;
}

// Azione: Segna task come completato
function markTaskAsDone(taskId, taskName) {
  const bike = getCurrentBike();
  const task = bike.tasks.find(t => t.id === taskId);
  if (!task) return;

  const prevDone = task.lastDone || 0;
  task.lastDone = bike.hours;

  // Aggiungi a storico
  const historyEntry = {
    id: 'hist_' + Date.now(),
    bikeId: bike.id,
    bikeName: bike.name,
    taskId: taskId,
    taskName: taskName,
    hours: bike.hours,
    unit: bike.unit,
    date: new Date().toLocaleDateString('it-IT') + ' ' + new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'}),
    note: `Completato a ${bike.hours} ${bike.unit} (intervallo ogni ${task.interval} ${bike.unit}). Precedente a ${prevDone} ${bike.unit}.`
  };
  appData.history.unshift(historyEntry);

  saveData();
  renderAll();
  showToast(`🎉 "${taskName}" completato e registrato nello storico a ${bike.hours} ${bike.unit}!`);
}

// Sezione SAG e Calcolatore
function renderSagTab() {
  const bike = getCurrentBike();
  const sagSpecs = bike.sagSpecs;
  if (!sagSpecs) return;

  document.getElementById('sagBikeName').textContent = bike.name;
  document.getElementById('sagTargetRider').textContent = `${sagSpecs.riderSagMin} - ${sagSpecs.riderSagMax} mm (Ideale: ${sagSpecs.riderSagTarget} mm)`;
  document.getElementById('sagTargetStatic').textContent = `${sagSpecs.staticSagMin} - ${sagSpecs.staticSagMax} mm (Ideale: ${sagSpecs.staticSagTarget} mm)`;
  document.getElementById('sagMethodNotes').textContent = sagSpecs.notes || '';
  
  if (sagSpecs.forkSagTarget) {
    document.getElementById('forkSagSection').style.display = 'block';
    document.getElementById('sagTargetFork').textContent = `${sagSpecs.forkSagMin} - ${sagSpecs.forkSagMax} mm (Ideale: ${sagSpecs.forkSagTarget} mm)`;
  } else {
    document.getElementById('forkSagSection').style.display = 'none';
  }
}

function calculateSag() {
  const a = parseFloat(document.getElementById('sagA').value);
  const b = parseFloat(document.getElementById('sagB').value);
  const c = parseFloat(document.getElementById('sagC').value);

  const resultBox = document.getElementById('sagResultBox');
  const bike = getCurrentBike();
  const specs = bike.sagSpecs;

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    resultBox.style.display = 'none';
    return;
  }

  if (a <= b || a <= c || b <= c) {
    resultBox.style.display = 'block';
    resultBox.className = 'sag-result-box warning';
    resultBox.innerHTML = `
      <h4>⚠️ Errore nelle misure inserite</h4>
      <p>La misura A (ruota alzata) deve essere la più alta, seguita da B (moto a terra) e poi C (moto con pilota). Ricontrolla i millimetri!</p>
    `;
    return;
  }

  const staticSag = Math.round(a - b);
  const riderSag = Math.round(a - c);

  // Diagnosi tecnica in base alle tabelle manuale da motocross
  let riderDiag = '';
  let staticDiag = '';
  let overallVerdict = '';
  let boxClass = 'success';

  // Rider SAG check
  if (riderSag < specs.riderSagMin) {
    riderDiag = `🔴 Rider Sag TROPPO BASSO (${riderSag} mm < ${specs.riderSagMin} mm): la sospensione è troppo dura o compressa, il retrotreno resta troppo alto.`;
    boxClass = 'warning';
  } else if (riderSag > specs.riderSagMax) {
    riderDiag = `🔴 Rider Sag TROPPO ALTO (${riderSag} mm > ${specs.riderSagMax} mm): la moto si schiaccia troppo, avantreno leggero e tendenza ad andare a pacco.`;
    boxClass = 'warning';
  } else {
    riderDiag = `🟢 Rider Sag PERFETTO (${riderSag} mm): rientra nel range ottimale (${specs.riderSagMin}-${specs.riderSagMax} mm).`;
  }

  // Static SAG check
  if (staticSag < specs.staticSagMin) {
    staticDiag = `⚠️ Static Sag troppo scarso (${staticSag} mm < ${specs.staticSagMin} mm): indica che hai dovuto dare troppo precarico per sostenere il pilota.`;
  } else if (staticSag > specs.staticSagMax) {
    staticDiag = `⚠️ Static Sag troppo abbondante (${staticSag} mm > ${specs.staticSagMax} mm): la molla è troppo rigida e ha poco precarico.`;
  } else {
    staticDiag = `🟢 Static Sag ottimale (${staticSag} mm nel range ${specs.staticSagMin}-${specs.staticSagMax} mm).`;
  }

  // Sintesi Meccanica Avanzata (Regola d'oro del Motocross)
  if (riderSag >= specs.riderSagMin && riderSag <= specs.riderSagMax) {
    if (staticSag >= specs.staticSagMin && staticSag <= specs.staticSagMax) {
      overallVerdict = `🏆 <strong>ASSETTO PERFETTO!</strong> Sia il precarico che la costante elastica (K) della molla sono ideali per il tuo peso.`;
      boxClass = 'success';
    } else if (staticSag < specs.staticSagMin) {
      overallVerdict = `🔧 <strong>MOLLA TROPPO MORBIDA:</strong> Il Rider Sag è corretto solo perché la molla è eccessivamente precaricata. Consigliato montare una molla con costante elastica (K) più rigida.`;
      boxClass = 'warning';
    } else {
      overallVerdict = `🔧 <strong>MOLLA TROPPO RIGIDA:</strong> Il Rider Sag è ottenuto con pochissimo precarico. Consigliato passare a una molla con K più tenera.`;
      boxClass = 'warning';
    }
  } else if (riderSag > specs.riderSagMax) {
    overallVerdict = `🛠️ <strong>AZIONE NECESSARIA:</strong> <u>Avvita la ghiera di precarico</u> del monoammortizzatore per comprimere la molla (aumentare precarico) finché il Rider Sag non scende attorno a ${specs.riderSagTarget} mm. Se comprimendo la molla lo Static Sag scende sotto ${specs.staticSagMin} mm, serve una molla più dura.`;
    boxClass = 'danger';
  } else {
    overallVerdict = `🛠️ <strong>AZIONE NECESSARIA:</strong> <u>Svita la ghiera di precarico</u> per allentare la molla (diminuire precarico) finché il Rider Sag non sale attorno a ${specs.riderSagTarget} mm.`;
    boxClass = 'danger';
  }

  resultBox.style.display = 'block';
  resultBox.className = `sag-result-box ${boxClass}`;
  resultBox.innerHTML = `
    <div class="sag-calc-numbers">
      <div class="calc-card">
        <span class="calc-label">Static Sag (Free Sag) [A - B]</span>
        <span class="calc-val">${staticSag} mm</span>
        <span class="calc-sub">Target: ${specs.staticSagMin}-${specs.staticSagMax} mm</span>
      </div>
      <div class="calc-card highlight">
        <span class="calc-label">Rider Sag (Race Sag) [A - C]</span>
        <span class="calc-val">${riderSag} mm</span>
        <span class="calc-sub">Target: ${specs.riderSagMin}-${specs.riderSagMax} mm</span>
      </div>
    </div>
    <div class="sag-feedback">
      <p>${riderDiag}</p>
      <p>${staticDiag}</p>
      <div class="verdict-banner">${overallVerdict}</div>
    </div>
  `;
}

function calculateForkSag() {
  const c = parseFloat(document.getElementById('sagForkC').value);
  const d = parseFloat(document.getElementById('sagForkD').value);
  const resultBox = document.getElementById('forkSagResultBox');
  const bike = getCurrentBike();
  const specs = bike.sagSpecs;

  if (isNaN(c) || isNaN(d) || c <= d) {
    resultBox.style.display = 'none';
    return;
  }

  const forkSag = Math.round(c - d);
  let feedback = '';
  let boxClass = 'success';

  if (forkSag < specs.forkSagMin) {
    feedback = `La forcella affonda poco (${forkSag} mm < ${specs.forkSagMin} mm): l'avantreno resta alto, poco grip in curva. Riduci gli spessori di precarico o monta molle più morbide.`;
    boxClass = 'warning';
  } else if (forkSag > specs.forkSagMax) {
    feedback = `La forcella affonda troppo (${forkSag} mm > ${specs.forkSagMax} mm): rischio fondocorsa in staccata. Aumenta il precarico o passa a molle più dure.`;
    boxClass = 'warning';
  } else {
    feedback = `Sag forcella perfetto (${forkSag} mm)! Bilanciamento anteriore ottimale.`;
  }

  resultBox.style.display = 'block';
  resultBox.className = `sag-result-box ${boxClass}`;
  resultBox.innerHTML = `
    <div class="calc-card highlight">
      <span class="calc-label">Fork Sag Misurato [C - D]</span>
      <span class="calc-val">${forkSag} mm</span>
      <span class="calc-sub">Target: ${specs.forkSagMin} - ${specs.forkSagMax} mm</span>
    </div>
    <p style="margin-top:10px;">${feedback}</p>
  `;
}

// Sezione Settaggi e Clicker Sospensioni
function renderSuspensionsTab() {
  const bike = getCurrentBike();
  const def = bike.defaultClickers || {};

  // Popola campi clicker correnti se vuoti
  if (!document.getElementById('setForkComp').value) document.getElementById('setForkComp').value = def.forkCompression ?? 10;
  if (!document.getElementById('setForkReb').value) document.getElementById('setForkReb').value = def.forkRebound ?? 10;
  if (!document.getElementById('setForkHeight').value) document.getElementById('setForkHeight').value = def.forkHeight ?? 5;
  if (!document.getElementById('setShockPreload').value) document.getElementById('setShockPreload').value = def.shockPreload ?? 255;
  if (!document.getElementById('setShockLSC').value) document.getElementById('setShockLSC').value = def.shockLSC ?? 11;
  if (!document.getElementById('setShockHSC').value) document.getElementById('setShockHSC').value = def.shockHSC ?? 1.25;
  if (!document.getElementById('setShockReb').value) document.getElementById('setShockReb').value = def.shockRebound ?? 11;

  renderSavedProfiles();
}

function saveSuspensionProfile() {
  const name = document.getElementById('setProfileName').value.trim() || 'Setup ' + new Date().toLocaleDateString('it-IT');
  const bike = getCurrentBike();

  const profile = {
    id: 'prof_' + Date.now(),
    bikeId: bike.id,
    name: name,
    date: new Date().toLocaleDateString('it-IT'),
    notes: document.getElementById('setNotes').value.trim(),
    forkComp: parseFloat(document.getElementById('setForkComp').value) || 0,
    forkReb: parseFloat(document.getElementById('setForkReb').value) || 0,
    forkHeight: parseFloat(document.getElementById('setForkHeight').value) || 0,
    shockPreload: parseFloat(document.getElementById('setShockPreload').value) || 0,
    shockLSC: parseFloat(document.getElementById('setShockLSC').value) || 0,
    shockHSC: parseFloat(document.getElementById('setShockHSC').value) || 0,
    shockReb: parseFloat(document.getElementById('setShockReb').value) || 0
  };

  appData.suspensionProfiles.unshift(profile);
  saveData();
  renderSavedProfiles();
  showToast(`💾 Assetto "${name}" salvato per ${bike.name}!`);
}

function renderSavedProfiles() {
  const container = document.getElementById('savedProfilesList');
  if (!container) return;
  container.innerHTML = '';

  const bike = getCurrentBike();
  const profiles = appData.suspensionProfiles.filter(p => p.bikeId === bike.id);

  if (profiles.length === 0) {
    container.innerHTML = `<div class="empty-state">Nessun assetto salvato per questa moto. Salva il tuo primo setup qui sopra!</div>`;
    return;
  }

  profiles.forEach(p => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
      <div class="profile-card-header">
        <h4>🏁 ${p.name}</h4>
        <span class="profile-date">${p.date}</span>
      </div>
      ${p.notes ? `<p class="profile-notes"><em>"${p.notes}"</em></p>` : ''}
      <div class="profile-specs-grid">
        <div class="spec-col">
          <strong>FOR FORCELLA</strong>
          <div>Comp: <b>${p.forkComp}</b> click</div>
          <div>Ritorno: <b>${p.forkReb}</b> click</div>
          <div>Sfilamento: <b>${p.forkHeight}</b> mm</div>
        </div>
        <div class="spec-col">
          <strong>MONO POSTERIORE</strong>
          <div>Precarico: <b>${p.shockPreload}</b> mm</div>
          <div>Comp Bassa: <b>${p.shockLSC}</b> click</div>
          <div>Comp Alta: <b>${p.shockHSC}</b> giri</div>
          <div>Ritorno: <b>${p.shockReb}</b> click</div>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn-sm btn-load-prof" data-id="${p.id}">📥 Carica questo Setup</button>
        <button class="btn-sm btn-del-prof" data-id="${p.id}">🗑️ Elimina</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Listener caricamento
  container.querySelectorAll('.btn-load-prof').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = appData.suspensionProfiles.find(x => x.id === btn.dataset.id);
      if (p) {
        document.getElementById('setForkComp').value = p.forkComp;
        document.getElementById('setForkReb').value = p.forkReb;
        document.getElementById('setForkHeight').value = p.forkHeight;
        document.getElementById('setShockPreload').value = p.shockPreload;
        document.getElementById('setShockLSC').value = p.shockLSC;
        document.getElementById('setShockHSC').value = p.shockHSC;
        document.getElementById('setShockReb').value = p.shockReb;
        document.getElementById('setNotes').value = p.notes || '';
        document.getElementById('setProfileName').value = p.name;
        showToast(`Assetto "${p.name}" caricato nei campi di regolazione!`);
      }
    });
  });

  // Listener eliminazione
  container.querySelectorAll('.btn-del-prof').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Vuoi davvero eliminare questo assetto salvato?')) {
        appData.suspensionProfiles = appData.suspensionProfiles.filter(x => x.id !== btn.dataset.id);
        saveData();
        renderSavedProfiles();
      }
    });
  });
}

// Sezione Storico
function renderHistoryTab() {
  const container = document.getElementById('historyList');
  if (!container) return;
  container.innerHTML = '';

  const bike = getCurrentBike();
  const entries = (appData.history || []).filter(h => h.bikeId === bike.id);

  if (entries.length === 0) {
    container.innerHTML = `<div class="empty-state">Nessun intervento registrato finora per ${bike.name}. Quando clicchi su "Segna come Fatto" comparirà qui il registro!</div>`;
    return;
  }

  entries.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-item-header">
        <span class="history-item-title">🛠️ ${entry.taskName}</span>
        <span class="history-item-hours">@ ${entry.hours} ${entry.unit}</span>
      </div>
      <div class="history-item-date">${entry.date}</div>
      <p class="history-item-note">${entry.note}</p>
      <button class="btn-text-danger btn-del-hist" data-id="${entry.id}">Elimina voce</button>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll('.btn-del-hist').forEach(btn => {
    btn.addEventListener('click', () => {
      appData.history = appData.history.filter(h => h.id !== btn.dataset.id);
      saveData();
      renderHistoryTab();
    });
  });
}

// Aggiungi Task Personalizzato
function handleAddTaskSubmit(e) {
  e.preventDefault();
  const bike = getCurrentBike();
  const name = document.getElementById('newTaskName').value.trim();
  const interval = parseFloat(document.getElementById('newTaskInterval').value);
  const lastDone = parseFloat(document.getElementById('newTaskLastDone').value) || 0;
  const critical = document.getElementById('newTaskCritical').checked;
  const desc = document.getElementById('newTaskDesc').value.trim();

  if (!name || isNaN(interval) || interval <= 0) {
    alert('Inserisci un nome e un intervallo valido in ' + bike.unit);
    return;
  }

  const newTask = {
    id: 'task_' + Date.now(),
    name: name,
    interval: interval,
    lastDone: lastDone,
    critical: critical,
    desc: desc,
    manualRef: 'Manutenzione personalizzata'
  };

  bike.tasks.push(newTask);
  saveData();
  renderAll();
  document.getElementById('addTaskModal').classList.remove('active');
  document.getElementById('formAddTask').reset();
  showToast(`Nuovo intervento "${name}" aggiunto!`);
}

// Aggiungi Nuova Moto
function handleAddBikeSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newBikeName').value.trim();
  const type = document.getElementById('newBikeType').value;
  const hours = parseFloat(document.getElementById('newBikeHours').value) || 0;
  const unit = type === 'km' ? 'km' : 'h';

  if (!name) {
    alert('Inserisci il nome della moto!');
    return;
  }

  const bikeId = 'custom_' + Date.now();
  appData.bikes[bikeId] = {
    id: bikeId,
    name: name,
    type: type,
    unit: unit,
    hours: hours,
    specs: {
      engine: 'Personalizzato',
      transOil: 'Vedi manuale specifico'
    },
    sagSpecs: {
      riderSagTarget: 95,
      riderSagMin: 90,
      riderSagMax: 100,
      staticSagTarget: 35,
      staticSagMin: 25,
      staticSagMax: 40,
      forkSagTarget: 40,
      forkSagMin: 35,
      forkSagMax: 45,
      rearMethod: "Perno ruota a punto fisso sul telaio/parafango",
      notes: "Valori medi standard da fuoristrada / motocross"
    },
    defaultClickers: {
      forkCompression: 10,
      forkRebound: 10,
      forkHeight: 5,
      shockPreload: 250,
      shockLSC: 10,
      shockHSC: 1.5,
      shockRebound: 10,
      trackNote: 'Setup iniziale'
    },
    tasks: [
      {
        id: 'c_filter_' + Date.now(),
        name: 'Pulizia Filtro Aria',
        interval: unit === 'h' ? 5 : 4000,
        lastDone: 0,
        critical: true,
        desc: 'Pulizia e oliatura elemento filtrante'
      },
      {
        id: 'c_oil_' + Date.now(),
        name: 'Sostituzione Olio Motore / Cambio',
        interval: unit === 'h' ? 15 : 5000,
        lastDone: 0,
        critical: true,
        desc: 'Sostituzione olio e filtro olio'
      },
      {
        id: 'c_chain_' + Date.now(),
        name: 'Tensione e Lubrificazione Catena',
        interval: unit === 'h' ? 5 : 1000,
        lastDone: 0,
        critical: false,
        desc: 'Ingrassa e controlla tolleranza catena'
      }
    ]
  };

  appData.currentBikeId = bikeId;
  saveData();
  renderAll();
  document.getElementById('addBikeModal').classList.remove('active');
  document.getElementById('formAddBike').reset();
  showToast(`Moto "${name}" creata con successo!`);
}

// Backup & Export JSON
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `motosag_backup_${new Date().toISOString().slice(0,10)}.json`);
  dlAnchorElem.click();
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.bikes) {
        appData = parsed;
        saveData();
        renderAll();
        showToast('✅ Dati ripristinati con successo!');
      } else {
        alert('File JSON non valido o non riconosciuto.');
      }
    } catch (err) {
      alert('Errore nella lettura del file JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function resetDefaults() {
  if (confirm('Vuoi ripristinare tutti i dati alle impostazioni di fabbrica dei manuali? Tutti i dati inseriti verranno sovrascritti.')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// Toast Notifiche
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = 'toast';
  }, 2800);
}

// Service Worker per Offline e PWA
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('ServiceWorker registrato:', reg.scope))
      .catch(err => console.log('SW registration error:', err));
  }
}
