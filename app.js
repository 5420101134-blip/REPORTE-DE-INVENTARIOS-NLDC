import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch, getDocs, addDoc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQykxeMYM9zLkG_zKHMzbB5oZoofxhvfg",
  authDomain: "logistica-msm.firebaseapp.com",
  projectId: "logistica-msm",
  storageBucket: "logistica-msm.firebasestorage.app",
  messagingSenderId: "55217121587",
  appId: "1:55217121587:web:ead0f6ece5a47d2be8b646"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AUTHORIZED_USERS = {
  "Erick M": "reportevenus",
  "Alejandro G": "medline2026",
  "Ruben V": "papa",
  "Abril V": "medline2026",
  "Felipe H (sistemas)": "Sistemas2026",
  "Veronica P": "NLDCMSM26",
  "Jgrimaldo": "Aitana13"
};

const catalogNLDC = [
  '529953','536393','538338','538351','538612','538638','539124','539199','539705','547006',
  '523003','523962','524194','529581','529940','538206','539568','546991','547002','561003',
  '536536','537981','537983','538144','538180','538614','538823','539581','539867','563904',
  '563913','563949','564066','564081','564085','564249','564263','564272','564630','564640'
];

const catalogMSM = [
  '530020','536507','536544','546962','546985','520795','536640','537959','538189','538386',
  '546973','547033','560954','564036','536521','536633','537969','530010','530018','539051',
  '551168','536649','537986','564092','564240','546995','564173','564123','539222','564105',
  '563872','564070','564028','564237','538618','538641','564650','564033','564273','563915'
];

const rawPlacasData = [
  { caja: '520795', placas: '6380KI', estado: 'OK', mfgYear: '2015', make: 'Vanguard' },
  { caja: '523003', placas: '25523AB', estado: 'WA', mfgYear: '2012', make: 'Wabash' },
  { caja: '523962', placas: '25605AB', estado: 'WA', mfgYear: '2013', make: 'Wabash' },
  { caja: '524194', placas: '47509AB', estado: 'WA', mfgYear: '2014', make: 'Wabash' },
  { caja: '529581', placas: '28132AD', estado: 'WA', mfgYear: '2013', make: 'Wabash' },
  { caja: '529940', placas: '29599AD', estado: 'WA', mfgYear: '2013', make: 'Wabash' },
  { caja: '529953', placas: '29607AD', estado: 'WA', mfgYear: '2013', make: 'Wabash' },
  { caja: '530010', placas: '4NL1001', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '530018', placas: '4NL1016', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '530020', placas: '4NL1017', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '536393', placas: '4MB9100', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '536507', placas: '4MZ8702', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '536521', placas: '4MZ8727', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '536536', placas: '4MZ8724', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '536544', placas: '4MZ8739', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '536633', placas: '18085AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '536640', placas: '18092AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '536649', placas: '19001AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '537959', placas: '18026AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '537969', placas: '18036AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '537981', placas: '18048AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '537983', placas: '18050AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '537986', placas: '18053AH', estado: 'WA', mfgYear: '2015', make: 'Utility' },
  { caja: '538144', placas: '4XK7881', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '538180', placas: '4ND3466', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '538189', placas: '4ND3460', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '538206', placas: '4ND3430', estado: 'CA', mfgYear: '2015', make: 'Hyundai' },
  { caja: '538338', placas: '4MH2678', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538351', placas: '4MH2680', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538386', placas: '4MH2812', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538612', placas: '4MK5533', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538614', placas: '4MK5535', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538618', placas: '4MK5540', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538638', placas: '4MK5507', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538641', placas: '4MK5510', estado: 'CA', mfgYear: '2013', make: 'Hyundai' },
  { caja: '538823', placas: '4MM5007', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539051', placas: '4MM5125', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539124', placas: '4MP5213', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539199', placas: '4WD8659', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539222', placas: '4WP3642', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539568', placas: '4MV3553', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539581', placas: '4MV3399', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '539705', placas: '3580LI', estado: 'OK', mfgYear: '2015', make: 'Utility' },
  { caja: '539867', placas: '4MW4065', estado: 'CA', mfgYear: '2014', make: 'Hyundai' },
  { caja: '546962', placas: '9026JK', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '546973', placas: 'BU8212', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '546985', placas: '9049JK', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '546991', placas: '3968JS', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '546995', placas: '3972JS', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '547002', placas: '3979JS', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '547006', placas: '3983JS', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '547033', placas: 'CS4479', estado: 'OK', mfgYear: '2012', make: 'Hyundai' },
  { caja: '551168', placas: '63895AD', estado: 'WA', mfgYear: '2012', make: 'Great Dane' },
  { caja: '560954', placas: '4XD5946', estado: 'CA', mfgYear: '2013', make: 'Road Systems' },
  { caja: '561003', placas: '4XA7331', estado: 'CA', mfgYear: '2013', make: 'Road Systems' },
  { caja: '563872', placas: '4XU1412', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '563904', placas: '4XN1615', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '563913', placas: '4XN1616', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '563915', placas: '4XU1626', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '563949', placas: '4XN1641', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564028', placas: '4XU1415', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564033', placas: '4XU1629', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564036', placas: '4XN1618', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564066', placas: '4xn1619', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564070', placas: '4XN1620', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564081', placas: '4XN1621', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564085', placas: '4XN1642', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564092', placas: '4XN1643', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564105', placas: '4XN1644', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564123', placas: '4XN1645', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564173', placas: '4XN1648', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564237', placas: '4XU1421', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564240', placas: '4XN1650', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564249', placas: '4XN1651', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564263', placas: '4XN1653', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564272', placas: '4XN1654', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564273', placas: '4XU1634', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564630', placas: '4XN1622', estado: 'CA', mfgYear: '2015', make: 'Conway' },
  { caja: '564640', placas: '4XN1623', estado: 'CA', mfgYear: '2015', make: 'Road Systems' },
  { caja: '564650', placas: '4XU1423', estado: 'CA', mfgYear: '2015', make: 'Road Systems' }
];

const placasMap = {};
rawPlacasData.forEach(item => {
  placasMap[item.caja] = `${item.placas} ${item.estado}`;
});

const placasReportData = rawPlacasData.map(item => {
  const mod = catalogMSM.includes(item.caja) ? 'MSM' : catalogNLDC.includes(item.caja) ? 'NLDC' : '—';
  return { ...item, modulo: mod };
});

let recorridoDataMap = {};
let pdmBoxesList = [];
let html5QrCodeScanner = null;

let boxes = [];
let movements = [];
let view = 'dashboard';
let editingDocId = null;
let editingPdmDocId = null;
let currentUser = null;
let activeDamageCaja = null;
let activeModalMode = 'comments';
let activeTimerBox = null; 

let sortColumn = null;
let sortAsc = true;

const locationColors = {
  'Venus': '#078779',
  'Milton': '#42658d',
  'ISC': '#e19a68',
  'McKinney': '#8f7ac8',
  'PDM': '#3b82f6',
  'Otro': '#81a9d1'
};

function detectModuleByBoxNumber(boxNum) {
  if (!boxNum) return null;
  const cleanNum = boxNum.trim().toUpperCase();
  const foundInBoxes = boxes.find(b => b.number === cleanNum);
  if (foundInBoxes && foundInBoxes.module) return foundInBoxes.module;
  if (catalogMSM.includes(cleanNum)) return 'MSM';
  if (catalogNLDC.includes(cleanNum)) return 'NLDC';
  return null;
}

// CALCULAR TIEMPO TRANSCURRIDO ÚNICAMENTE EN DÍAS
function formatElapsedTime(timestampMillis) {
  if (!timestampMillis) return '0 días';
  const now = Date.now();
  let diffMs = now - timestampMillis;
  if (diffMs < 0) diffMs = 0;

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days === 1) {
    return `⏱️ 1 día`;
  } else {
    return `⏱️ ${days} días`;
  }
}

const savedUser = localStorage.getItem('medline_user');
if (savedUser) {
  currentUser = savedUser;
  updateUserUI();
  document.getElementById('login-screen').classList.add('hidden');
}

document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const selectedUser = document.getElementById('user-select').value;
  const pwd = document.getElementById('password-input').value.trim();
  const errEl = document.getElementById('login-error');

  if (selectedUser && AUTHORIZED_USERS[selectedUser]) {
    if (pwd === AUTHORIZED_USERS[selectedUser]) {
      errEl.style.display = 'none';
      currentUser = selectedUser;
      localStorage.setItem('medline_user', currentUser);
      updateUserUI();

      document.getElementById('login-screen').classList.add('hidden');

      const welcomeOverlay = document.getElementById('welcome-overlay');
      document.getElementById('welcome-title').textContent = `¡Bienvenido, ${currentUser}!`;
      welcomeOverlay.classList.add('active');

      setTimeout(() => {
        welcomeOverlay.classList.remove('active');
        showToast(`Sesión iniciada como ${currentUser}`);
      }, 2200);

    } else {
      errEl.textContent = 'Contraseña incorrecta';
      errEl.style.display = 'block';
    }
  }
};

document.getElementById('logout-btn').onclick = function() {
  localStorage.removeItem('medline_user');
  currentUser = null;
  document.getElementById('password-input').value = '';
  document.getElementById('login-screen').classList.remove('hidden');
};

function updateUserUI() {
  if (currentUser) {
    document.getElementById('user-display-name').textContent = currentUser;
    document.getElementById('user-avatar').textContent = currentUser.charAt(0).toUpperCase();
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// LISTENERS EN TIEMPO REAL
onSnapshot(collection(db, "boxes"), (snapshot) => {
  if (!snapshot.empty) {
    boxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    render();
  }
});

onSnapshot(collection(db, "movements"), (snapshot) => {
  movements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  render();
});

onSnapshot(collection(db, "pdm_boxes"), (snapshot) => {
  pdmBoxesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  if (view === 'PDM' || view === 'dashboard') {
    render();
  }
});

onSnapshot(collection(db, "daily_tours"), (snapshot) => {
  recorridoDataMap = {};
  snapshot.docs.forEach(doc => {
    recorridoDataMap[doc.id] = doc.data();
  });
  if (view === 'recorrido') {
    renderTable();
  }
});

// ACTUALIZACIÓN GLOBAL DE ESTATUS EN FIREBASE (RESPETA "STORAGE")
async function updateGlobalStatusInFirebase(num, mod, newSt, commentsVal, locationVal) {
  const batch = writeBatch(db);
  const nowStr = new Date().toLocaleString('es-MX');
  const nowTs = Date.now();

  const matchingBoxes = boxes.filter(b => b.number === num);

  if (matchingBoxes.length > 0) {
    matchingBoxes.forEach(b => {
      const updateObj = { status: newSt, lastUpdatedTimestamp: nowTs };
      if (locationVal) updateObj.location = locationVal;
      if (newSt === 'mantenimiento') {
        updateObj.mantenimientoDate = b.mantenimientoDate || nowStr;
        updateObj.reportadoReparaciones = b.reportadoReparaciones || false;
        if (commentsVal) updateObj.comments = commentsVal;
      } else {
        updateObj.mantenimientoDate = null;
        updateObj.reportadoReparaciones = false;
      }
      batch.update(doc(db, "boxes", b.id), updateObj);
    });
  } else {
    const targetModule = mod || detectModuleByBoxNumber(num) || 'MSM';
    const newDocId = `${targetModule}_${num}`;
    
    const newBoxPayload = {
      number: num,
      module: targetModule,
      location: locationVal || 'Venus',
      comments: commentsVal || 'Reportado desde sistema',
      status: newSt,
      lastUpdatedTimestamp: nowTs,
      recordedBy: currentUser || 'Sistema'
    };

    if (newSt === 'mantenimiento') {
      newBoxPayload.mantenimientoDate = nowStr;
      newBoxPayload.reportadoReparaciones = false;
    }

    batch.set(doc(db, "boxes", newDocId), newBoxPayload, { merge: true });
  }

  await batch.commit();
}

async function updateRecorridoInFirebase(cajaNum, estatusVal, comentariosVal) {
  const docId = `REC_${cajaNum}`;
  const payload = {
    caja: cajaNum,
    updatedBy: currentUser || 'Sistema',
    updatedAt: new Date().toLocaleString('es-MX')
  };

  if (estatusVal !== null) {
    payload.estatusRecorrido = estatusVal;
  }
  if (comentariosVal !== undefined) {
    payload.comentarios = comentariosVal;
  }

  await setDoc(doc(db, "daily_tours", docId), payload, { merge: true });

  if (estatusVal === 'mantenimiento' || estatusVal === 'vacia' || estatusVal === 'cargada') {
    const targetMod = detectModuleByBoxNumber(cajaNum);
    await updateGlobalStatusInFirebase(cajaNum, targetMod, estatusVal, comentariosVal);
  }
}

async function createPdmBoxCopyFromMovement(movId) {
  const mov = movements.find(m => m.id === movId);
  if (!mov) return;

  const nowTs = Date.now();
  const nowStr = new Date().toLocaleString('es-MX');
  const newPdmDocId = `PDM_${mov.number}_${nowTs}`;

  await setDoc(doc(db, "pdm_boxes", newPdmDocId), {
    number: mov.number,
    comments: mov.comments || 'Copiado desde Movimientos Diarios',
    datetime: nowStr,
    timestamp: nowTs,
    status: 'vacia',
    recordedBy: currentUser || 'Sistema'
  });

  showToast(`Caja PDM ${mov.number} copiada al Módulo Cajas PDM`);
}

function getInverseMovementType(currentType) {
  switch (currentType) {
    case 'PATIO-RAMPA': return 'RAMPA-PATIO';
    case 'RAMPA-PATIO': return 'PATIO-RAMPA';
    case 'PDM-VENUS': return 'VENUS-PDM';
    case 'VENUS-PDM': return 'PDM-VENUS';
    default: return 'RAMPA-PATIO';
  }
}

function getMergedRecorridoList() {
  return rawPlacasData.map(item => {
    const mod = catalogMSM.includes(item.caja) ? 'MSM' : catalogNLDC.includes(item.caja) ? 'NLDC' : '—';
    const firebaseDoc = recorridoDataMap[`REC_${item.caja}`];
    return {
      id: `REC_${item.caja}`,
      caja: item.caja,
      placas: item.placas,
      estadoPlaca: item.estado,
      modulo: mod,
      estatusRecorrido: firebaseDoc ? firebaseDoc.estatusRecorrido : 'none',
      comentarios: firebaseDoc ? firebaseDoc.comentarios : ''
    };
  });
}

function render() {
  document.querySelectorAll('#navigation button').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-view') === view);
  });

  document.getElementById('view-title').textContent = 
    view === 'dashboard' ? 'Dashboard Resumen' : 
    view === 'recorrido' ? 'Recorrido Diario (Móvil)' :
    view === 'movimientos' ? 'Movimientos Diarios' : 
    view === 'mantenimiento' ? 'Módulo de Mantenimiento' : 
    view === 'PDM' ? 'Módulo Cajas PDM' :
    view === 'placas' ? 'Reporte de Placas General' : 'Módulo ' + view;

  if (view === 'dashboard') {
    document.getElementById('dashboard-view').style.display = 'block';
    document.getElementById('table-view').style.display = 'none';
    renderInactivityAlert();
    renderMantenimientoSummary();
    renderPdmSummary();
    renderMovimientosSummary();
    renderModule('MSM');
    renderModule('NLDC');
  } else {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('table-view').style.display = 'block';
    renderTable();
  }
}

// TARJETA DE ALERTA DE CAJAS SIN ACTUALIZAR > 3 DÍAS (SOLO PARA ESTATUS "CARGADA")
function renderInactivityAlert() {
  const now = Date.now();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  const inactiveBoxes = boxes.filter(b => {
    const isCargada = (b.status || '').toLowerCase() === 'cargada';
    if (!isCargada || !b.lastUpdatedTimestamp) return false;
    return (now - b.lastUpdatedTimestamp) > THREE_DAYS_MS;
  });

  const totalInactive = inactiveBoxes.length;
  const card = document.getElementById('inactivity-alert-card');

  if (totalInactive === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'flex';
  const boxPills = inactiveBoxes.map(b => `<span style="background:white; border:1px solid #fed7aa; border-radius:6px; padding:0.15rem 0.5rem; font-size:0.78rem; font-weight:800; color:#c2410c;">📦 ${b.number} (${b.module})</span>`).join(' ');

  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem;">
      <div style="background:#ffedd5; border-radius:12px; padding:0.75rem; font-size:1.5rem;">⚠️</div>
      <div>
        <div style="font-size:0.8rem; font-weight:800; color:#ea580c; text-transform:uppercase;">Alerta: Cajas Cargadas Inactivas (> 3 Días)</div>
        <div style="font-size:1.1rem; font-weight:800; color:#172b40; margin-top:0.1rem;">
          ${totalInactive} ${totalInactive === 1 ? 'caja en estatus CARGADA lleva' : 'cajas en estatus CARGADA llevan'} más de 3 días sin movimiento
        </div>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:0.5rem;">
          ${boxPills}
        </div>
      </div>
    </div>
  `;
}

function renderMantenimientoSummary() {
  const maintBoxes = boxes.filter(b => b.status === 'mantenimiento');
  const totalMaint = maintBoxes.length;
  const msmMaint = maintBoxes.filter(b => b.module === 'MSM').length;
  const nldcMaint = maintBoxes.filter(b => b.module === 'NLDC').length;
  const reportadas = maintBoxes.filter(b => b.reportadoReparaciones).length;
  const pendientes = totalMaint - reportadas;

  const card = document.getElementById('mantenimiento-summary-card');
  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem;">
      <div style="background:#fee2e2; border-radius:12px; padding:0.75rem; font-size:1.5rem;">🛠️</div>
      <div>
        <div style="font-size:0.8rem; font-weight:800; color:#991b1b; text-transform:uppercase;">Estatus Mantenimiento Global</div>
        <div style="font-size:1.1rem; font-weight:800; color:#172b40; margin-top:0.1rem;">
          ${totalMaint} ${totalMaint === 1 ? 'caja requiere' : 'cajas requieren'} reparación
        </div>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
      <div class="maint-stat-pill">🏢 MSM: <strong>${msmMaint}</strong></div>
      <div class="maint-stat-pill">🏭 NLDC: <strong>${nldcMaint}</strong></div>
      <div class="maint-stat-pill" style="background:#f0fdf4; border-color:#bbf7d0; color:#166534;">✅ Reportadas: <strong>${reportadas}</strong></div>
      <div class="maint-stat-pill" style="background:#fef2f2; border-color:#fecaca; color:#991b1b;">⏳ Pendientes: <strong>${pendientes}</strong></div>
    </div>
  `;
}

function renderPdmSummary() {
  const totalPdm = pdmBoxesList.length;
  const vaciasPdm = pdmBoxesList.filter(b => (b.status || 'vacia') === 'vacia').length;
  const cargadasPdm = pdmBoxesList.filter(b => b.status === 'cargada').length;

  const card = document.getElementById('pdm-summary-card');
  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem;">
      <div style="background:#f3e8ff; border-radius:12px; padding:0.75rem; font-size:1.5rem;">📦</div>
      <div>
        <div style="font-size:0.8rem; font-weight:800; color:#6b21a8; text-transform:uppercase;">Módulo Cajas PDM</div>
        <div style="font-size:1.1rem; font-weight:800; color:#172b40; margin-top:0.1rem;">
          ${totalPdm} ${totalPdm === 1 ? 'caja registrada' : 'cajas registradas'} en PDM
        </div>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
      <div class="maint-stat-pill" style="background:#f0fdf4; border-color:#bbf7d0; color:#166534;">🟢 Vacías: <strong>${vaciasPdm}</strong></div>
      <div class="maint-stat-pill" style="background:#fffbeb; border-color:#fde68a; color:#b45309;">🟡 Cargadas: <strong>${cargadasPdm}</strong></div>
    </div>
  `;
}

function renderMovimientosSummary() {
  const totalMovs = movements.length;
  const msmMovs = movements.filter(m => m.module === 'MSM').length;
  const nldcMovs = movements.filter(m => m.module === 'NLDC').length;
  const pdmMovs = movements.filter(m => m.module === 'PDM').length;

  const card = document.getElementById('movimientos-summary-card');
  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem;">
      <div style="background:#dbeafe; border-radius:12px; padding:0.75rem; font-size:1.5rem;">🔄</div>
      <div>
        <div style="font-size:0.8rem; font-weight:800; color:#1e40af; text-transform:uppercase;">Movimientos Diarios Registrados</div>
        <div style="font-size:1.1rem; font-weight:800; color:#172b40; margin-top:0.1rem;">
          ${totalMovs} ${totalMovs === 1 ? 'movimiento realizado' : 'movimientos realizados'}
        </div>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
      <div class="maint-stat-pill" style="background:#eff6ff; border-color:#bfdbfe; color:#1e40af;">🏢 MSM: <strong>${msmMovs}</strong></div>
      <div class="maint-stat-pill" style="background:#f0fdf4; border-color:#bbf7d0; color:#166534;">🏭 NLDC: <strong>${nldcMovs}</strong></div>
      <div class="maint-stat-pill" style="background:#fef3c7; border-color:#fde68a; color:#92400e;">📦 PDM: <strong>${pdmMovs}</strong></div>
    </div>
  `;
}

function renderModule(mod) {
  const prefix = mod.toLowerCase();
  const list = boxes.filter(b => b.module === mod);
  const total = list.length;
  document.getElementById(prefix + '-total-center').textContent = total;

  const locCounts = {};
  list.forEach(b => {
    const loc = b.location || 'Venus';
    locCounts[loc] = (locCounts[loc] || 0) + 1;
  });

  const group = document.getElementById(prefix + '-segments');
  group.innerHTML = '';
  const circumference = 2 * Math.PI * 46;
  let offset = 0;

  const locationsList = Object.keys(locCounts);

  locationsList.forEach(loc => {
    const count = locCounts[loc];
    const color = locationColors[loc] || '#81a9d1';
    if (count > 0 && total > 0) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '60'); circle.setAttribute('cy', '60'); circle.setAttribute('r', '46');
      circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', '13');
      circle.setAttribute('stroke-dasharray', ((count / total) * circumference) + ' ' + circumference);
      circle.setAttribute('stroke-dashoffset', -offset);
      group.appendChild(circle);
      offset += (count / total) * circumference;
    }
  });

  const legend = document.getElementById(prefix + '-legend');
  legend.innerHTML = '';
  locationsList.forEach(loc => {
    const count = locCounts[loc];
    const pct = total ? Math.round((count / total) * 100) : 0;
    const color = locationColors[loc] || '#81a9d1';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; background:#f5f8fa; padding:0.4rem 0.6rem; border-radius:8px;';
    row.innerHTML = `<span style="width:10px; height:10px; border-radius:50%; background:${color}"></span><span style="flex:1; font-weight:600;">${loc}</span><b>${count} (${pct}%)</b>`;
    legend.appendChild(row);
  });

  const vaciasList = list.filter(b => (b.status || '').toLowerCase() === 'vacia');
  const vaciasTotal = vaciasList.length;

  const vaciasLocCounts = {};
  vaciasList.forEach(b => {
    const loc = b.location || 'Venus';
    vaciasLocCounts[loc] = (vaciasLocCounts[loc] || 0) + 1;
  });

  let vaciasPillsHTML = '';
  const vaciasLocKeys = Object.keys(vaciasLocCounts);

  if (vaciasLocKeys.length === 0) {
    vaciasPillsHTML = `<span style="font-size:0.8rem; font-weight:600; color:#08765e;">No hay cajas vacías registradas.</span>`;
  } else {
    vaciasLocKeys.forEach(loc => {
      vaciasPillsHTML += `<div class="vacia-loc-pill"><span>${loc}:</span> <strong>${vaciasLocCounts[loc]}</strong></div>`;
    });
  }

  const vaciasContainer = document.getElementById(prefix + '-vacias-container');
  vaciasContainer.innerHTML = `
    <div class="vacias-card">
      <div class="vacias-header">
        <div>
          <div style="font-size:0.8rem; font-weight:800; color:#08765e; text-transform:uppercase;">Estatus Vacía</div>
          <div style="font-size:0.8rem; font-weight:600; color:#172b40;">Cajas disponibles para uso</div>
        </div>
        <div style="text-align:right;">
          <strong style="font-size:1.5rem; font-weight:800; color:#08765e;">${vaciasTotal}</strong>
          <span style="font-size:0.8rem; font-weight:700; color:#65778b;">/ ${total} totales</span>
        </div>
      </div>
      <div class="vacias-pills">
        ${vaciasPillsHTML}
      </div>
    </div>
  `;
}

function renderTable() {
  const isRecorrido = view === 'recorrido';
  const isMov = view === 'movimientos';
  const isMaint = view === 'mantenimiento';
  const isPdm = view === 'PDM';
  const isPlacas = view === 'placas';
  const isModuleView = view === 'MSM' || view === 'NLDC';

  const thead = document.getElementById('table-head');
  const tbody = document.getElementById('table-body');
  const search = document.getElementById('search').value.toLowerCase();
  const counterBadge = document.getElementById('movimientos-counter');
  const moduleCounterBadge = document.getElementById('module-counter');
  const clearBtn = document.getElementById('clear-button');
  const whatsappBtn = document.getElementById('whatsapp-button');
  const resetRecorridoBtn = document.getElementById('reset-recorrido-button');
  const scanQrBtn = document.getElementById('scan-qr-button');
  const printQrBtn = document.getElementById('print-qr-button');

  const getArrow = (colKey) => sortColumn === colKey ? (sortAsc ? ' ▲' : ' ▼') : ' ⇅';

  let columns = [];
  if (isRecorrido) {
    columns = [
      { key: 'caja', label: 'Caja / Placas / Módulo / Comentarios' }
    ];
  } else if (isPdm) {
    columns = [
      { key: 'number', label: 'Número de Caja' },
      { key: 'comments', label: 'Comentarios' },
      { key: 'status', label: 'Estatus' },
      { key: 'datetime', label: 'Fecha y Hora de Registro' },
      { key: 'timestamp', label: 'Antigüedad en Días (Clic p/ editar)' },
      { key: null, label: 'Acciones' }
    ];
  } else if (isMov) {
    columns = [
      { key: 'number', label: 'Caja' },
      { key: 'module', label: 'Módulo' },
      { key: 'type', label: 'Tipo' },
      { key: 'location', label: 'Ubicación' },
      { key: 'operator', label: 'Operador' },
      { key: 'comments', label: 'Comentarios' },
      { key: 'requestedBy', label: 'Solicitud de' },
      { key: 'datetime', label: 'Fecha y Hora' },
      { key: 'status', label: 'Estatus' },
      { key: null, label: 'Acciones' }
    ];
  } else if (isMaint) {
    columns = [
      { key: 'number', label: 'Caja' },
      { key: 'module', label: 'Módulo' },
      { key: 'location', label: 'Ubicación' },
      { key: 'comments', label: 'Comentarios' },
      { key: 'mantenimientoDate', label: 'Fecha de Registro' },
      { key: 'reportadoReparaciones', label: 'Reportado a Reparaciones' },
      { key: null, label: 'Acciones' }
    ];
  } else if (isPlacas) {
    columns = [
      { key: 'caja', label: 'Caja' },
      { key: 'placas', label: 'Placas' },
      { key: 'estado', label: 'Estado' },
      { key: 'mfgYear', label: 'MfgYear' },
      { key: 'make', label: 'Make' },
      { key: 'modulo', label: 'Módulo' }
    ];
  } else {
    columns = [
      { key: 'number', label: 'Caja' },
      { key: 'status', label: 'Estatus' },
      { key: 'location', label: 'Ubicación' },
      { key: 'comments', label: 'Comentarios' },
      { key: 'placasInfo', label: 'Placas' },
      { key: 'lastUpdatedTimestamp', label: 'Antigüedad en Días (Clic p/ editar)' },
      { key: null, label: 'Acciones' }
    ];
  }

  let thHTML = '<tr>';
  columns.forEach(col => {
    if (col.key) {
      thHTML += `<th data-col="${col.key}">${col.label}<span>${getArrow(col.key)}</span></th>`;
    } else {
      thHTML += `<th>${col.label}</th>`;
    }
  });
  thHTML += '</tr>';
  thead.innerHTML = thHTML;

  clearBtn.style.display = isMov ? 'inline-block' : 'none';
  whatsappBtn.style.display = isRecorrido ? 'inline-flex' : 'none';
  resetRecorridoBtn.style.display = isRecorrido ? 'inline-flex' : 'none';
  scanQrBtn.style.display = isRecorrido ? 'inline-flex' : 'none';
  printQrBtn.style.display = (isRecorrido || isPlacas) ? 'inline-flex' : 'none';

  if (isMov) {
    counterBadge.style.display = 'inline-flex';
    moduleCounterBadge.style.display = 'none';
    document.getElementById('movimientos-count-num').textContent = movements.length;
  } else if (isModuleView || isPdm) {
    counterBadge.style.display = 'none';
    moduleCounterBadge.style.display = 'inline-flex';
    document.getElementById('module-counter-label').textContent = `Total Registros Módulo ${view}`;
  } else if (isPlacas || isRecorrido) {
    counterBadge.style.display = 'none';
    moduleCounterBadge.style.display = 'inline-flex';
    document.getElementById('module-counter-label').textContent = isRecorrido ? 'Cajas en Recorrido' : 'Total Registros Placas';
  } else {
    counterBadge.style.display = 'none';
    moduleCounterBadge.style.display = 'none';
  }

  tbody.innerHTML = '';

  let dataset = [];
  if (isRecorrido) {
    dataset = getMergedRecorridoList();
  } else if (isPdm) {
    dataset = pdmBoxesList;
  } else if (isMov) {
    dataset = movements;
  } else if (isMaint) {
    dataset = boxes.filter(b => b.status === 'mantenimiento');
  } else if (isPlacas) {
    dataset = placasReportData;
  } else {
    dataset = boxes.filter(b => b.module === view).map(b => ({
      ...b,
      placasInfo: placasMap[b.number] || '—'
    }));
  }

  let filtered = dataset.filter(x => {
    if (isRecorrido) {
      return (x.caja && x.caja.toLowerCase().includes(search)) ||
             (x.placas && x.placas.toLowerCase().includes(search)) ||
             (x.modulo && x.modulo.toLowerCase().includes(search)) ||
             (x.comentarios && x.comentarios.toLowerCase().includes(search));
    }
    if (isPlacas) {
      return (x.caja && x.caja.toLowerCase().includes(search)) ||
             (x.placas && x.placas.toLowerCase().includes(search)) ||
             (x.estado && x.estado.toLowerCase().includes(search)) ||
             (x.mfgYear && x.mfgYear.toLowerCase().includes(search)) ||
             (x.make && x.make.toLowerCase().includes(search)) ||
             (x.modulo && x.modulo.toLowerCase().includes(search));
    }
    return (x.number && x.number.toLowerCase().includes(search)) || 
           (x.location && x.location.toLowerCase().includes(search)) ||
           (x.comments && x.comments.toLowerCase().includes(search)) ||
           (x.module && x.module.toLowerCase().includes(search)) ||
           (x.operator && x.operator.toLowerCase().includes(search)) ||
           (x.requestedBy && x.requestedBy.toLowerCase().includes(search)) ||
           (x.recordedBy && x.recordedBy.toLowerCase().includes(search)) ||
           (x.datetime && x.datetime.toLowerCase().includes(search)) ||
           (x.placasInfo && x.placasInfo.toLowerCase().includes(search));
  });

  if (isModuleView || isPdm || isPlacas || isRecorrido) {
    document.getElementById('module-count-num').textContent = filtered.length;
  }

  if (sortColumn) {
    filtered.sort((a, b) => {
      let valA = a[sortColumn] || 0;
      let valB = b[sortColumn] || 0;
      
      if (typeof valA === 'boolean') valA = valA ? 1 : 0;
      if (typeof valB === 'boolean') valB = valB ? 1 : 0;

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  if (isRecorrido) {
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const isVacia = item.estatusRecorrido === 'vacia';
      const isCargada = item.estatusRecorrido === 'cargada';
      const isMantenimiento = item.estatusRecorrido === 'mantenimiento' || item.estatusRecorrido === 'danos';
      const isNoEsta = item.estatusRecorrido === 'noesta';
      const hasComment = Boolean(item.comentarios);

      tr.innerHTML = `
        <td style="padding: 0;">
          <div class="recorrido-card-row">
            <div class="recorrido-card-top">
              <div class="recorrido-info-box">
                <strong style="font-size:1.15rem; color:var(--navy);">📦 ${item.caja}</strong>
                <span style="font-weight:700; color:#0e9f94; font-size:0.85rem; background:#f0fdf4; padding:0.2rem 0.5rem; border-radius:6px; border:1px solid #bbf7d0;">${item.placas} ${item.estadoPlaca}</span>
                <span class="pill ${item.modulo==='MSM'?'pill-cargada':'pill-vacia'}">${item.modulo}</span>
              </div>
              <div>
                ${hasComment ? `<div class="comment-preview-tag" title="${item.comentarios}">💬 ${item.comentarios}</div>` : '<span style="color:#cbd5e1; font-size:0.78rem;">Sin observaciones</span>'}
              </div>
            </div>

            <div class="touch-btn-group">
              <button type="button" class="touch-btn touch-vacia ${isVacia ? 'sel-vacia' : ''}" data-caja="${item.caja}">
                🟢 Vacía
              </button>
              <button type="button" class="touch-btn touch-cargada ${isCargada ? 'sel-cargada' : ''}" data-caja="${item.caja}">
                🟡 Cargada
              </button>
              <button type="button" class="touch-btn touch-danos ${isMantenimiento ? 'sel-mantenimiento' : ''}" data-caja="${item.caja}">
                🛠️ Mantenimiento
              </button>
              <button type="button" class="touch-btn touch-noesta ${isNoEsta ? 'sel-noesta' : ''}" data-caja="${item.caja}">
                ⚪ No está
              </button>
              <button type="button" class="touch-btn touch-comentarios ${hasComment ? 'btn-comments-active' : ''}" data-caja="${item.caja}">
                💬 Comentarios
              </button>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } else if (isPdm) {
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const elapsedTimeStr = formatElapsedTime(item.timestamp);
      const userTag = item.recordedBy ? `<span class="user-tag-subtle" title="Registrado por">👤 ${item.recordedBy}</span>` : '';

      tr.innerHTML = `
        <td><strong style="font-size:1.05rem; color:#005ac7;">📦 ${item.number}</strong></td>
        <td>${item.comments || '—'}</td>
        <td><span class="pill pill-${item.status || 'vacia'}">${item.status || 'vacia'}</span></td>
        <td><span style="font-size:0.8rem; font-weight:700; color:#475569;">${item.datetime || '—'}</span></td>
        <td><span class="timer-badge open-timer-btn" data-id="${item.id}" data-type="pdm" data-num="${item.number}">${elapsedTimeStr}</span></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="secondary edit-pdm-btn" data-id="${item.id}" style="padding:0.25rem 0.6rem; font-size:0.8rem;">✏️ Editar</button>
            <button type="button" class="danger delete-pdm-btn" data-id="${item.id}" data-num="${item.number}" style="padding:0.25rem 0.6rem; font-size:0.8rem;">🗑️ Eliminar</button>
            ${userTag}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } else if (isPlacas) {
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${item.caja}</b></td>
        <td><span style="font-weight:700; color:#0e9f94;">${item.placas}</span></td>
        <td>${item.estado}</td>
        <td>${item.mfgYear}</td>
        <td>${item.make}</td>
        <td><span class="pill ${item.modulo==='MSM'?'pill-cargada':'pill-vacia'}">${item.modulo}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    const numberCounts = {};
    filtered.forEach(x => {
      if (x.number) {
        numberCounts[x.number] = (numberCounts[x.number] || 0) + 1;
      }
    });
    const seenNumbers = new Set();
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const nowMs = Date.now();

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.setAttribute('id', `row-${item.id}`);
      
      const isStorage = (item.status || '').toLowerCase() === 'storage';
      const boxNumberClass = isStorage ? 'text-storage' : '';

      if (item.number && numberCounts[item.number] > 1) {
        if (seenNumbers.has(item.number)) {
          tr.classList.add('row-copia');
        } else {
          seenNumbers.add(item.number);
          tr.classList.add('row-original');
        }
      }

      let html = `<td class="${boxNumberClass}"><b>${item.number}</b></td>`;

      if (isMov) {
        html += `<td><b>${item.module}</b></td>`;
        html += `<td><b>${item.type || '—'}</b></td>`;
        html += `<td>${item.location || 'Venus'}</td>`;
        html += `<td><span style="color:#0e9f94; font-weight:700;">${item.operator || '—'}</span></td>`;
        html += `<td>${item.comments || '—'}</td>`;
        html += `<td><span style="color:#005ac7; font-weight:700;">${item.requestedBy || '—'}</span></td>`;
        html += `<td><span style="font-size:0.8rem; font-weight:700; color:#475569;">${item.datetime || '—'}</span></td>`;
        html += `<td><span class="pill pill-${item.status}">${item.status}</span></td>`;
      } else if (isMaint) {
        html += `<td><b>${item.module}</b></td>`;
        html += `<td>${item.location || 'Venus'}</td>`;
        html += `<td>${item.comments || '—'}</td>`;
        html += `<td><span style="font-size:0.8rem; font-weight:700; color:#627488;">${item.mantenimientoDate || 'No registrada'}</span></td>`;
        html += `<td>
                  <label class="check-label">
                    <input type="checkbox" class="maint-checkbox" data-id="${item.id}" ${item.reportadoReparaciones ? 'checked' : ''}>
                    <span>${item.reportadoReparaciones ? ' Reportado' : 'Pendiente'}</span>
                  </label>
                </td>`;
      } else {
        const isCargada = (item.status || '').toLowerCase() === 'cargada';
        const isWarning = isCargada && item.lastUpdatedTimestamp && (nowMs - item.lastUpdatedTimestamp) > THREE_DAYS_MS;
        const timerBadgeClass = isWarning ? 'timer-badge timer-badge-warning open-timer-btn' : 'timer-badge open-timer-btn';

        html += `<td><span class="pill pill-${item.status}">${item.status}</span></td>`;
        html += `<td>${item.location || 'Venus'}</td>`;
        html += `<td>${item.comments || '—'}</td>`;
        html += `<td><span style="font-weight:700; color:#0e9f94;">${item.placasInfo}</span></td>`;
        html += `<td><span class="${timerBadgeClass}" data-id="${item.id}" data-type="box" data-num="${item.number}">${formatElapsedTime(item.lastUpdatedTimestamp)}</span></td>`;
      }
      
      const userTag = item.recordedBy ? `<span class="user-tag-subtle" title="Modificado/Registrado por">👤 ${item.recordedBy}</span>` : '';
      const showPdmBtn = isMov && (item.module === 'PDM');

      html += `<td>
                <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                  ${isMov ? `<button type="button" class="action-btn finish-btn" data-id="${item.id}">🔚 Fin de tarea</button>` : ''}
                  ${showPdmBtn ? `<button type="button" class="action-pdm-btn create-pdm-btn" data-id="${item.id}">📦 PDM Vacía</button>` : ''}
                  <button type="button" class="secondary edit-btn" data-id="${item.id}" style="padding:0.25rem 0.6rem; font-size:0.8rem;">✏️ Editar</button>
                  ${isMov ? `<button type="button" class="danger delete-btn" data-id="${item.id}" style="padding:0.25rem 0.6rem; font-size:0.8rem;">🗑️ Eliminar</button>` : ''}
                  <select class="field st-select" data-id="${item.id}" style="padding:0.2rem; width:auto; font-size:0.8rem; margin-top:0;">
                    <option value="vacia" ${item.status==='vacia'?'selected':''}>vacia</option>
                    <option value="cargada" ${item.status==='cargada'?'selected':''}>cargada</option>
                    <option value="mantenimiento" ${item.status==='mantenimiento'?'selected':''}>mantenimiento</option>
                    <option value="storage" ${item.status==='storage'?'selected':''}>storage</option>
                  </select>
                  ${userTag}
                </div>
              </td>`;
      tr.innerHTML = html;
      tbody.appendChild(tr);
    });
  }

  if (isRecorrido) {
    document.querySelectorAll('.touch-vacia').forEach(b => {
      b.onclick = async function() {
        const cajaNum = this.getAttribute('data-caja');
        await updateRecorridoInFirebase(cajaNum, 'vacia');
        showToast(`Caja ${cajaNum} marcada como VACÍA`);
      };
    });

    document.querySelectorAll('.touch-cargada').forEach(b => {
      b.onclick = async function() {
        const cajaNum = this.getAttribute('data-caja');
        await updateRecorridoInFirebase(cajaNum, 'cargada');
        showToast(`Caja ${cajaNum} marcada como CARGADA`);
      };
    });

    document.querySelectorAll('.touch-danos').forEach(b => {
      b.onclick = function() {
        const cajaNum = this.getAttribute('data-caja');
        activeDamageCaja = cajaNum;
        activeModalMode = 'mantenimiento';
        const firebaseDoc = recorridoDataMap[`REC_${cajaNum}`];

        document.getElementById('comment-modal-title').textContent = '🛠️ Enviar a Mantenimiento';
        document.getElementById('comment-modal-title').style.color = '#dc2626';
        document.getElementById('damage-box-label').textContent = cajaNum;
        document.getElementById('damage-text-input').value = firebaseDoc ? firebaseDoc.comentarios : '';
        document.getElementById('save-damage-btn').style.background = '#dc2626';
        document.getElementById('save-damage-btn').textContent = 'Enviar a Mantenimiento';
        document.getElementById('damage-modal').style.display = 'flex';
      };
    });

    document.querySelectorAll('.touch-comentarios').forEach(b => {
      b.onclick = function() {
        const cajaNum = this.getAttribute('data-caja');
        activeDamageCaja = cajaNum;
        activeModalMode = 'comments';
        const firebaseDoc = recorridoDataMap[`REC_${cajaNum}`];

        document.getElementById('comment-modal-title').textContent = '💬 Agregar / Editar Comentario';
        document.getElementById('comment-modal-title').style.color = '#005ac7';
        document.getElementById('damage-box-label').textContent = cajaNum;
        document.getElementById('damage-text-input').value = firebaseDoc ? firebaseDoc.comentarios : '';
        document.getElementById('save-damage-btn').style.background = '#005ac7';
        document.getElementById('save-damage-btn').textContent = 'Guardar Nota';
        document.getElementById('damage-modal').style.display = 'flex';
      };
    });

    document.querySelectorAll('.touch-noesta').forEach(b => {
      b.onclick = async function() {
        const cajaNum = this.getAttribute('data-caja');
        await updateRecorridoInFirebase(cajaNum, 'noesta');
        showToast(`Caja ${cajaNum} marcada como NO ESTÁ`);
      };
    });
  }

  // ACCIÓN DE CLIC DIRECTO SOBRE EL CONTADOR PARA EDITAR FECHA/HORA
  document.querySelectorAll('.open-timer-btn').forEach(btn => {
    btn.onclick = function(e) {
      const targetId = e.currentTarget.getAttribute('data-id');
      const targetType = e.currentTarget.getAttribute('data-type');
      const num = e.currentTarget.getAttribute('data-num');

      activeTimerBox = { id: targetId, type: targetType, number: num };
      document.getElementById('timer-box-num').textContent = num;
      document.getElementById('custom-timer-input').value = '';
      document.getElementById('timer-edit-modal').style.display = 'flex';
    };
  });

  document.querySelectorAll('.create-pdm-btn').forEach(btn => {
    btn.onclick = async function(e) {
      const movId = e.target.getAttribute('data-id');
      await createPdmBoxCopyFromMovement(movId);
    };
  });

  if (isPdm) {
    document.querySelectorAll('.edit-pdm-btn').forEach(btn => {
      btn.onclick = function(e) {
        const pdmId = e.target.getAttribute('data-id');
        const item = pdmBoxesList.find(x => x.id === pdmId);
        if (item) {
          editingPdmDocId = pdmId;
          editingDocId = null;
          document.getElementById('modal-heading').textContent = 'Editar Caja PDM';
          document.getElementById('box-number').value = item.number;
          document.getElementById('box-number').disabled = true;
          document.getElementById('module').value = 'PDM';
          document.getElementById('module').disabled = true;
          document.getElementById('location-field-group').style.display = 'none';
          document.getElementById('comments').value = item.comments || '';
          document.getElementById('status').value = item.status || 'vacia';
          document.getElementById('movement-only').style.display = 'none';
          document.getElementById('delete-box-section').style.display = 'none';
          document.getElementById('form-modal').style.display = 'flex';
        }
      };
    });

    document.querySelectorAll('.delete-pdm-btn').forEach(b => {
      b.onclick = async function() {
        const docId = this.getAttribute('data-id');
        const num = this.getAttribute('data-num');
        if (confirm(`¿Deseas eliminar este registro de PDM para la caja ${num}?`)) {
          await deleteDoc(doc(db, "pdm_boxes", docId));
          showToast(`Registro PDM de caja ${num} eliminado`);
        }
      };
    });
  }

  document.querySelectorAll('#table-head th[data-col]').forEach(th => {
    th.onclick = function() {
      const colKey = this.getAttribute('data-col');
      if (sortColumn === colKey) {
        sortAsc = !sortAsc;
      } else {
        sortColumn = colKey;
        sortAsc = true;
      }
      renderTable();
    };
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = async function(e) {
      const docId = e.target.getAttribute('data-id');
      const item = movements.find(m => m.id === docId);
      if (item && confirm(`¿Deseas borrar permanentemente este registro de la caja ${item.number}?`)) {
        await deleteDoc(doc(db, "movements", docId));
        showToast(`Registro de caja ${item.number} eliminado`);
      }
    };
  });

  document.querySelectorAll('.finish-btn').forEach(btn => {
    btn.onclick = async function(e) {
      const docId = e.target.getAttribute('data-id');
      const original = movements.find(m => m.id === docId);

      if (original) {
        const num = original.number;
        const currentType = original.type || 'PATIO-RAMPA';
        const newType = getInverseMovementType(currentType);

        if (confirm(`¿Deseas terminar la tarea seleccionada para la caja ${num}?\n\nSe creará el registro inverso: ${newType}`)) {
          const rowEl = document.getElementById(`row-${docId}`);
          if (rowEl) rowEl.classList.add('row-finished');

          const newDocId = `MOV_${original.module}_${num}_${Date.now()}`;
          const nowStr = new Date().toLocaleString('es-MX');

          await setDoc(doc(db, "movements", newDocId), {
            number: num,
            module: original.module,
            location: original.location || 'Venus',
            comments: original.comments ? `[Fin de tarea] ${original.comments}` : '[Fin de tarea]',
            status: original.status || 'vacia',
            type: newType,
            operator: original.operator || '—',
            requestedBy: original.requestedBy || '—',
            recordedBy: currentUser || 'Sistema',
            datetime: nowStr,
            timestamp: Date.now()
          });

          updateGlobalStatusInFirebase(num, original.module, original.status || 'vacia');
          showToast(`Tarea de caja ${num} completada`);
        }
      }
    };
  });

  document.querySelectorAll('.maint-checkbox').forEach(chk => {
    chk.onchange = async function(e) {
      const docId = e.target.getAttribute('data-id');
      const isChecked = e.target.checked;
      await setDoc(doc(db, "boxes", docId), { reportadoReparaciones: isChecked }, { merge: true });
      showToast(isChecked ? 'Marcado como reportado' : 'Marcado como pendiente');
    };
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = function(e) {
      const docId = e.target.getAttribute('data-id');
      const isMovView = view === 'movimientos';
      const item = (isMovView ? movements : boxes).find(x => x.id === docId);
      
      if (item) {
        editingDocId = docId;
        editingPdmDocId = null;
        document.getElementById('modal-heading').textContent = 'Editar Registro';
        document.getElementById('box-number').value = item.number || '';
        document.getElementById('box-number').disabled = false;
        document.getElementById('location-field-group').style.display = 'block';
        document.getElementById('module').value = item.module || 'MSM';
        document.getElementById('location').value = item.location || 'Venus';
        document.getElementById('comments').value = item.comments || '';
        document.getElementById('status').value = item.status || 'vacia';
        
        checkAndAutoAssignModule(item.number || '');
        toggleStorageAlert(item.status);

        const deleteSection = document.getElementById('delete-box-section');
        if (view === 'MSM' || view === 'NLDC' || view === 'mantenimiento') {
          deleteSection.style.display = 'block';
        } else {
          deleteSection.style.display = 'none';
        }

        const movFields = document.getElementById('movement-only');
        if (isMovView) {
          movFields.style.display = 'block';
          document.getElementById('movement-type').value = item.type || 'PATIO-RAMPA';
          document.getElementById('movement-operator').value = item.operator || '';
          document.getElementById('movement-requested-by').value = item.requestedBy || '';
          document.getElementById('movement-datetime').value = item.datetime || new Date().toLocaleString('es-MX');
        } else {
          movFields.style.display = 'none';
        }
        
        document.getElementById('form-modal').style.display = 'flex';
      }
    };
  });

  document.querySelectorAll('.st-select').forEach(s => {
    s.onchange = async function(e) {
      const docId = e.target.getAttribute('data-id');
      const newSt = e.target.value;
      const isMovView = view === 'movimientos';
      
      if (isMovView && newSt === 'storage') {
        alert('⚠️ ATENCIÓN: Esta caja se ha marcado en estatus de STORAGE.');
      }

      if (isMovView) {
        await setDoc(doc(db, "movements", docId), { status: newSt, recordedBy: currentUser || 'Sistema' }, { merge: true });
        const targetDoc = movements.find(x => x.id === docId);
        if (targetDoc) {
          updateGlobalStatusInFirebase(targetDoc.number, targetDoc.module, newSt);
        }
      } else {
        const targetDoc = boxes.find(x => x.id === docId);
        if (targetDoc) {
          await setDoc(doc(db, "boxes", docId), { status: newSt, recordedBy: currentUser || 'Sistema' }, { merge: true });
          updateGlobalStatusInFirebase(targetDoc.number, targetDoc.module, newSt, targetDoc.comments, targetDoc.location);
        }
      }
      showToast('Estatus actualizado');
    };
  });
}

// ACCIONES DE EDICIÓN DEL CONTADOR EN EL MODAL DE TIEMPO
document.getElementById('save-timer-btn').onclick = async function() {
  const val = document.getElementById('custom-timer-input').value;
  if (!val) {
    alert('Por favor selecciona una fecha y hora válidas.');
    return;
  }
  if (activeTimerBox) {
    const customTs = new Date(val).getTime();
    if (activeTimerBox.type === 'pdm') {
      await setDoc(doc(db, "pdm_boxes", activeTimerBox.id), { timestamp: customTs }, { merge: true });
    } else {
      await setDoc(doc(db, "boxes", activeTimerBox.id), { lastUpdatedTimestamp: customTs }, { merge: true });
    }
    document.getElementById('timer-edit-modal').style.display = 'none';
    showToast(`Contador actualizado para caja ${activeTimerBox.number}`);
  }
};

document.getElementById('reset-timer-zero-btn').onclick = async function() {
  if (activeTimerBox) {
    const nowTs = Date.now();
    if (activeTimerBox.type === 'pdm') {
      await setDoc(doc(db, "pdm_boxes", activeTimerBox.id), { timestamp: nowTs }, { merge: true });
    } else {
      await setDoc(doc(db, "boxes", activeTimerBox.id), { lastUpdatedTimestamp: nowTs }, { merge: true });
    }
    document.getElementById('timer-edit-modal').style.display = 'none';
    showToast(`Contador de caja ${activeTimerBox.number} reiniciado a 0 días`);
  }
};

document.getElementById('close-timer-modal').onclick = () => document.getElementById('timer-edit-modal').style.display = 'none';
document.getElementById('cancel-timer-btn').onclick = () => document.getElementById('timer-edit-modal').style.display = 'none';

// BORRADO INDIVIDUAL DESDE MODAL DE EDICIÓN
document.getElementById('delete-single-box-btn').onclick = async function() {
  if (editingDocId) {
    const boxNum = document.getElementById('box-number').value;
    if (confirm(`¿Estás seguro de que deseas ELIMINAR INDIVIDUALMENTE la caja ${boxNum} del módulo ${view}?`)) {
      await deleteDoc(doc(db, "boxes", editingDocId));
      document.getElementById('form-modal').style.display = 'none';
      editingDocId = null;
      showToast(`Caja ${boxNum} eliminada de la base de datos`);
    }
  }
};

document.getElementById('print-qr-button').onclick = function() {
  const gridContainer = document.getElementById('qr-grid');
  gridContainer.innerHTML = '';

  rawPlacasData.forEach(item => {
    const mod = catalogMSM.includes(item.caja) ? 'MSM' : catalogNLDC.includes(item.caja) ? 'NLDC' : '—';
    const fullPayload = `CAJA: ${item.caja}\nMODULO: ${mod}\nPLACAS: ${item.placas} ${item.estado}\nMFG: ${item.mfgYear} (${item.make})`;

    const card = document.createElement('div');
    card.className = 'qr-card';
    card.innerHTML = `
      <h4>CAJA ${item.caja}</h4>
      <p>MÓDULO ${mod} | PLACAS ${item.placas}</p>
      <div class="qr-img-box" id="qr-target-${item.caja}"></div>
      <p style="font-size:0.65rem; color:#94a3b8; margin-top:2px;">MEDLINE LOGISTICS</p>
    `;
    gridContainer.appendChild(card);

    new QRCode(document.getElementById(`qr-target-${item.caja}`), {
      text: fullPayload,
      width: 120,
      height: 120,
      colorDark : "#00205b",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  });

  document.getElementById('qr-modal').style.display = 'flex';
};

document.getElementById('close-qr-modal').onclick = () => {
  document.getElementById('qr-modal').style.display = 'none';
};

document.getElementById('scan-qr-button').onclick = function() {
  document.getElementById('camera-modal').style.display = 'flex';

  if (!html5QrCodeScanner) {
    html5QrCodeScanner = new Html5Qrcode("qr-reader-box");
  }

  const config = { fps: 10, qrbox: { width: 220, height: 220 } };

  html5QrCodeScanner.start(
    { facingMode: "environment" }, 
    config,
    (decodedText) => {
      stopCamera();
      document.getElementById('camera-modal').style.display = 'none';

      let detectedCaja = null;
      const match = decodedText.match(/\d{6}/);
      if (match) {
        detectedCaja = match[0];
      } else {
        detectedCaja = decodedText.trim();
      }

      document.getElementById('search').value = detectedCaja;
      renderTable();
      showToast(`Caja ${detectedCaja} encontrada por QR`);
    },
    (errorMessage) => {}
  ).catch(err => {
    alert("No se pudo acceder a la cámara. Asegúrate de estar navegando sobre una conexión segura HTTPS y otorgar permisos.");
    document.getElementById('camera-modal').style.display = 'none';
  });
};

function stopCamera() {
  if (html5QrCodeScanner && html5QrCodeScanner.isScanning) {
    html5QrCodeScanner.stop().then(() => {
      console.log("Cámara detenida");
    }).catch(err => console.error(err));
  }
}

document.getElementById('close-camera-modal').onclick = () => {
  stopCamera();
  document.getElementById('camera-modal').style.display = 'none';
};

document.getElementById('stop-camera-btn').onclick = () => {
  stopCamera();
  document.getElementById('camera-modal').style.display = 'none';
};

document.getElementById('reset-recorrido-button').onclick = function() {
  document.getElementById('reset-user-display').textContent = currentUser || 'Usuario';
  document.getElementById('reset-password-input').value = '';
  document.getElementById('reset-password-error').style.display = 'none';
  document.getElementById('password-reset-modal').style.display = 'flex';
};

document.getElementById('cancel-reset-btn').onclick = () => {
  document.getElementById('password-reset-modal').style.display = 'none';
};

document.getElementById('confirm-reset-btn').onclick = async function() {
  const pwdInput = document.getElementById('reset-password-input').value.trim();
  const errorEl = document.getElementById('reset-password-error');

  if (currentUser && AUTHORIZED_USERS[currentUser] && pwdInput === AUTHORIZED_USERS[currentUser]) {
    errorEl.style.display = 'none';
    document.getElementById('password-reset-modal').style.display = 'none';

    const batch = writeBatch(db);

    rawPlacasData.forEach(item => {
      const docRef = doc(db, "daily_tours", `REC_${item.caja}`);
      batch.set(docRef, {
        caja: item.caja,
        estatusRecorrido: 'none',
        comentarios: '',
        updatedBy: currentUser || 'Sistema',
        updatedAt: new Date().toLocaleString('es-MX')
      });
    });

    await batch.commit();
    showToast('Estatus del recorrido reiniciados (desmarcados)');
  } else {
    errorEl.style.display = 'block';
  }
};

document.getElementById('close-damage-modal').onclick = () => document.getElementById('damage-modal').style.display = 'none';
document.getElementById('cancel-damage-btn').onclick = () => document.getElementById('damage-modal').style.display = 'none';

document.getElementById('save-damage-btn').onclick = async function() {
  if (activeDamageCaja) {
    const txt = document.getElementById('damage-text-input').value.trim();

    if (activeModalMode === 'mantenimiento') {
      await updateRecorridoInFirebase(activeDamageCaja, 'mantenimiento', txt);
      showToast(`Caja ${activeDamageCaja} enviada a Mantenimiento`);
    } else {
      await updateRecorridoInFirebase(activeDamageCaja, null, txt);
      showToast(`Comentario guardado para caja ${activeDamageCaja}`);
    }
  }
  document.getElementById('damage-modal').style.display = 'none';
};

function checkAndAutoAssignModule(val) {
  const cleanNum = val.trim().toUpperCase();
  const detectedMod = detectModuleByBoxNumber(cleanNum);
  const moduleSelect = document.getElementById('module');
  const hint = document.getElementById('module-auto-hint');

  if (detectedMod) {
    moduleSelect.value = detectedMod;
    moduleSelect.disabled = true;
    hint.style.display = 'block';

    const existingBox = boxes.find(b => b.number === cleanNum);
    if (existingBox && existingBox.status) {
      document.getElementById('status').value = existingBox.status;
      toggleStorageAlert(existingBox.status);
    }
  } else {
    moduleSelect.disabled = false;
    hint.style.display = 'none';
  }
}

function toggleStorageAlert(statusVal) {
  const alertBox = document.getElementById('storage-alert-box');
  if (statusVal === 'storage') {
    alertBox.style.display = 'block';
  } else {
    alertBox.style.display = 'none';
  }
}

document.getElementById('status').addEventListener('change', function(e) {
  toggleStorageAlert(e.target.value);
});

document.getElementById('box-number').addEventListener('input', function(e) {
  checkAndAutoAssignModule(e.target.value);
});

document.getElementById('navigation').onclick = function(e) {
  const btn = e.target.closest('button');
  if (btn) {
    view = btn.getAttribute('data-view');
    sortColumn = null;
    render();
  }
};

document.getElementById('open-form').onclick = function() {
  editingDocId = null;
  editingPdmDocId = null;
  document.getElementById('modal-heading').textContent = 'Registrar caja';
  document.getElementById('entry-form').reset();
  
  const moduleSelect = document.getElementById('module');
  moduleSelect.disabled = false;
  document.getElementById('box-number').disabled = false;
  document.getElementById('location-field-group').style.display = 'block';
  document.getElementById('module-auto-hint').style.display = 'none';
  document.getElementById('storage-alert-box').style.display = 'none';
  document.getElementById('delete-box-section').style.display = 'none';

  const isMovView = view === 'movimientos';
  document.getElementById('movement-only').style.display = isMovView ? 'block' : 'none';
  if (isMovView) {
    document.getElementById('movement-operator').value = '';
    document.getElementById('movement-requested-by').value = '';
    document.getElementById('movement-datetime').value = new Date().toLocaleString('es-MX');
  }
  document.getElementById('form-modal').style.display = 'flex';
};

document.getElementById('close-modal').onclick = () => document.getElementById('form-modal').style.display = 'none';
document.getElementById('cancel-form').onclick = () => document.getElementById('form-modal').style.display = 'none';

document.getElementById('entry-form').onsubmit = async function(e) {
  e.preventDefault();

  if (editingPdmDocId) {
    const comm = document.getElementById('comments').value.trim();
    const st = document.getElementById('status').value;
    await setDoc(doc(db, "pdm_boxes", editingPdmDocId), {
      comments: comm,
      status: st,
      recordedBy: currentUser || 'Sistema'
    }, { merge: true });

    editingPdmDocId = null;
    document.getElementById('form-modal').style.display = 'none';
    showToast('Registro de caja PDM actualizado');
    return;
  }

  const num = document.getElementById('box-number').value.trim().toUpperCase();
  const autoMod = detectModuleByBoxNumber(num);
  const mod = autoMod || document.getElementById('module').value;
  const loc = document.getElementById('location').value;
  const comm = document.getElementById('comments').value.trim();
  const st = document.getElementById('status').value;
  const type = document.getElementById('movement-type').value;
  const operatorVal = document.getElementById('movement-operator').value.trim() || '—';
  const requestedByVal = document.getElementById('movement-requested-by').value.trim() || '—';
  const dtVal = document.getElementById('movement-datetime').value.trim() || new Date().toLocaleString('es-MX');

  const isMovView = view === 'movimientos';

  if (isMovView && st === 'storage') {
    const confirmStorage = confirm(`🟣 ATENCIÓN DE STORAGE:\n\nLa caja ${num} está configurada con estatus STORAGE.\n¿Confirmas que deseas registrar este movimiento en almacenamiento?`);
    if (!confirmStorage) return;
  }

  const collectionName = isMovView ? 'movements' : 'boxes';
  const docId = editingDocId || (isMovView ? `MOV_${mod}_${num}_${Date.now()}` : `${mod}_${num}`);

  const payload = { 
    number: num, 
    module: mod, 
    location: loc, 
    comments: comm, 
    status: st,
    recordedBy: currentUser || 'Sistema'
  };

  if (isMovView) {
    payload.type = type;
    payload.operator = operatorVal;
    payload.requestedBy = requestedByVal;
    payload.datetime = dtVal;
    payload.timestamp = Date.now();
  }

  if (st === 'mantenimiento') {
    payload.mantenimientoDate = new Date().toLocaleString('es-MX');
  }

  await setDoc(doc(db, collectionName, docId), payload, { merge: true });
  updateGlobalStatusInFirebase(num, mod, st, comm, loc);
  
  editingDocId = null;
  document.getElementById('form-modal').style.display = 'none';
  showToast(`Registro guardado (${num} - Módulo: ${mod})`);
};

document.getElementById('search').oninput = renderTable;

document.getElementById('whatsapp-button').onclick = function() {
  const today = new Date().toLocaleDateString('es-MX');
  let text = `📦 *RECORRIDO DIARIO DE CAJAS - MEDLINE*\n📅 *Fecha:* ${today}\n👤 *Inspector:* ${currentUser || 'Sistema'}\n\n`;

  let countVacias = 0;
  let countCargadas = 0;
  let countMantenimiento = 0;
  let countNoEsta = 0;

  const currentList = getMergedRecorridoList();

  currentList.forEach(r => {
    if (r.estatusRecorrido === 'noesta') {
      countNoEsta++;
    } else if (r.estatusRecorrido !== 'none') {
      const isMaint = r.estatusRecorrido === 'mantenimiento' || r.estatusRecorrido === 'danos';
      const stLabel = r.estatusRecorrido === 'vacia' ? '🟢 Vacía' : r.estatusRecorrido === 'cargada' ? '🟡 Cargada' : '🛠️ Mantenimiento';
      
      if (r.estatusRecorrido === 'vacia') countVacias++;
      if (r.estatusRecorrido === 'cargada') countCargadas++;
      if (isMaint) countMantenimiento++;

      text += `• *Caja ${r.caja}* (${r.modulo}) | ${stLabel}`;
      if (r.comentarios) {
        text += ` 💬 _"${r.comentarios}"_`;
      }
      text += `\n`;
    }
  });

  text += `\n📊 *RESUMEN DEL DÍA:*\n• Vacías: ${countVacias}\n• Cargadas: ${countCargadas}\n• En Mantenimiento: ${countMantenimiento}\n• No en venus: ${countNoEsta}\n\n_Medline Control Logístico_`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
};

document.getElementById('export-button').onclick = function() {
  const todayDate = new Date().toISOString().split('T')[0];

  if (view === 'recorrido') {
    const currentList = getMergedRecorridoList();
    const headers = ['Caja', 'Placas', 'Módulo', 'Estatus Recorrido', 'Comentarios / Fallas', 'Inspector'];
    const rows = currentList.map(r => [
      r.caja,
      `${r.placas} ${r.estadoPlaca}`,
      r.modulo,
      r.estatusRecorrido === 'vacia' ? 'Vacía' : r.estatusRecorrido === 'cargada' ? 'Cargada' : (r.estatusRecorrido === 'mantenimiento' || r.estatusRecorrido === 'danos') ? 'Mantenimiento' : r.estatusRecorrido === 'noesta' ? 'No está' : 'Sin registrar',
      r.comentarios || 'Sin observaciones',
      currentUser || 'Sistema'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recorrido Diario');
    XLSX.writeFile(wb, `recorrido-diario-${todayDate}.xlsx`);

  } else if (view === 'PDM') {
    const headers = ['Número de Caja', 'Comentarios', 'Estatus', 'Fecha de Registro', 'Antigüedad en Días', 'Registrado Por'];
    const rows = pdmBoxesList.map(r => [
      r.number,
      r.comments || '',
      r.status || 'vacia',
      r.datetime || '',
      formatElapsedTime(r.timestamp),
      r.recordedBy || 'Sistema'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cajas PDM');
    XLSX.writeFile(wb, `cajas-pdm-${todayDate}.xlsx`);

  } else if (view === 'movimientos') {
    const headers = ['Caja', 'Módulo', 'Tipo', 'Ubicación', 'Operador', 'Comentarios', 'Solicitud de', 'Fecha y Hora', 'Estatus', 'Registrado Por'];
    const rows = movements.map(r => [
      r.number, 
      r.module, 
      r.type || '—', 
      r.location || 'Venus', 
      r.operator || '—',
      r.comments || '', 
      r.requestedBy || '—',
      r.datetime || '—',
      r.status,
      r.recordedBy || 'Sistema'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    XLSX.writeFile(wb, 'movimientos-diarios.xlsx');

  } else if (view === 'mantenimiento') {
    const maintBoxes = boxes.filter(b => b.status === 'mantenimiento');
    const headers = ['Caja', 'Módulo', 'Ubicación', 'Comentarios', 'Fecha de Registro', 'Reportado a Reparaciones', 'Registrado Por'];
    const rows = maintBoxes.map(r => [
      r.number, 
      r.module, 
      r.location || 'Venus', 
      r.comments || '', 
      r.mantenimientoDate || 'No registrada',
      r.reportadoReparaciones ? 'SI' : 'NO',
      r.recordedBy || 'Sistema'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mantenimiento');
    XLSX.writeFile(wb, 'reporte-mantenimiento.xlsx');

  } else if (view === 'placas') {
    const headers = ['Caja', 'Placas', 'Estado', 'MfgYear', 'Make', 'Módulo'];
    const rows = placasReportData.map(r => [
      r.caja,
      r.placas,
      r.estado,
      r.mfgYear,
      r.make,
      r.modulo
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Placas General');
    XLSX.writeFile(wb, 'reporte-placas-general.xlsx');

  } else {
    const moduleBoxes = boxes.filter(b => b.module === view);
    const headers = ['Caja', 'Estatus', 'Ubicación', 'Comentarios', 'Placas', 'Antigüedad en Días', 'Registrado Por'];
    const rows = moduleBoxes.map(r => [
      r.number, 
      r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'Vacia', 
      r.location || 'Venus', 
      r.comments || '',
      placasMap[r.number] || '—',
      formatElapsedTime(r.lastUpdatedTimestamp),
      r.recordedBy || 'Sistema'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Inventario ${view}`);
    XLSX.writeFile(wb, `inventario-${view}.xlsx`);
  }
};

document.getElementById('clear-button').onclick = async function() {
  if (confirm('¿Deseas eliminar TODOS los registros de Movimientos Diarios?')) {
    const querySnapshot = await getDocs(collection(db, 'movements'));
    const batch = writeBatch(db);

    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
    showToast('Movimientos reajustados');
  }
};