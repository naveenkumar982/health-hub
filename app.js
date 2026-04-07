/* ============================================
   HealthHub — App Core
   ============================================ */
'use strict';

// ---- STATE ----
const S = {
  role: localStorage.getItem('hh_role') || null,
  user: JSON.parse(localStorage.getItem('hh_user') || 'null'),
  tab: 0,
  consent: true,
  queueToken: 21,
  currentServing: 18,
  highContrast: false,
  auditLog: [],
  loading: true
};

// ---- ICONS (inline SVG) ----
const IC = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  queue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  rx: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>',
};

// ---- MOCK DATA ----
const USERS = {
  patient: { name: 'Arjun Mehta', email: 'arjun@mail.com', avatar: 'AM', dob: '1992-05-14', blood: 'B+', clinic: 'CityMed Clinic', pid: 'PTN-20487', phone: '+91 98765 43210' },
  doctor: { name: 'Dr. Priya Sharma', email: 'priya@citymed.com', avatar: 'PS', specialty: 'General Medicine', clinic: 'CityMed Clinic', empId: 'DOC-301' },
  pharmacist: { name: 'Rahul Verma', email: 'rahul@citymed.com', avatar: 'RV', clinic: 'CityMed Clinic', empId: 'PHR-105' },
  receptionist: { name: 'Sneha Patil', email: 'sneha@citymed.com', avatar: 'SP', clinic: 'CityMed Clinic', empId: 'REC-042' },
  admin: { name: 'Vikram Singh', email: 'vikram@citymed.com', avatar: 'VS', clinic: 'CityMed Clinic', empId: 'ADM-001' }
};

const APPOINTMENTS = [
  { id: 'APT-1001', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '10:30 AM', fee: 500, status: 'confirmed', token: 24 },
  { id: 'APT-1002', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Kavita Rao', specialty: 'Dermatology', clinic: 'CityMed Clinic', date: '2026-04-10', time: '02:00 PM', fee: 800, status: 'confirmed', token: null },
  { id: 'APT-1003', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-03-20', time: '11:00 AM', fee: 500, status: 'completed', token: 12 },
  { id: 'APT-1004', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Nikhil Joshi', specialty: 'Cardiology', clinic: 'CityMed Clinic', date: '2026-03-15', time: '09:30 AM', fee: 1200, status: 'cancelled', token: null },
  { id: 'APT-2001', patient: 'Meera Nair', pid: 'PTN-20501', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '09:00 AM', fee: 500, status: 'confirmed', token: 18 },
  { id: 'APT-2002', patient: 'Ravi Kumar', pid: 'PTN-20512', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '09:30 AM', fee: 500, status: 'confirmed', token: 19 },
  { id: 'APT-2003', patient: 'Sita Devi', pid: 'PTN-20523', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '10:00 AM', fee: 500, status: 'confirmed', token: 20 },
  { id: 'APT-2004', patient: 'Ankit Patel', pid: 'PTN-20534', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '10:15 AM', fee: 500, status: 'no-show', token: 21 },
  { id: 'APT-2005', patient: 'Pooja Reddy', pid: 'PTN-20545', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '11:00 AM', fee: 500, status: 'confirmed', token: 22 },
  { id: 'APT-2006', patient: 'Deepak Gupta', pid: 'PTN-20556', doctor: 'Dr. Priya Sharma', specialty: 'General Medicine', clinic: 'CityMed Clinic', date: '2026-04-07', time: '11:30 AM', fee: 500, status: 'waiting', token: 23 },
];

const PRESCRIPTIONS = [
  { id: 'RX-5001', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Priya Sharma', date: '2026-03-20', status: 'dispensed', diagnosis: 'Seasonal Allergies', meds: [{ name: 'Cetirizine 10mg', dosage: '1 tablet', freq: 'Once daily', dur: '7 days' }, { name: 'Montelukast 10mg', dosage: '1 tablet', freq: 'At bedtime', dur: '14 days' }], notes: 'Avoid cold beverages. Follow up in 2 weeks.' },
  { id: 'RX-5002', patient: 'Arjun Mehta', pid: 'PTN-20487', doctor: 'Dr. Kavita Rao', date: '2026-03-10', status: 'dispensed', diagnosis: 'Mild Eczema', meds: [{ name: 'Betamethasone Cream', dosage: 'Apply thin layer', freq: 'Twice daily', dur: '10 days' }], notes: 'Moisturize frequently.' },
  { id: 'RX-5003', patient: 'Meera Nair', pid: 'PTN-20501', doctor: 'Dr. Priya Sharma', date: '2026-04-06', status: 'pending', diagnosis: 'Upper Respiratory Infection', meds: [{ name: 'Amoxicillin 500mg', dosage: '1 capsule', freq: 'Three times daily', dur: '5 days' }, { name: 'Paracetamol 500mg', dosage: '1 tablet', freq: 'As needed', dur: '3 days' }], notes: 'Complete full course of antibiotics.' },
  { id: 'RX-5004', patient: 'Ravi Kumar', pid: 'PTN-20512', doctor: 'Dr. Priya Sharma', date: '2026-04-06', status: 'pending', diagnosis: 'Hypertension', meds: [{ name: 'Amlodipine 5mg', dosage: '1 tablet', freq: 'Once daily', dur: '30 days' }], notes: 'Monitor BP weekly.' },
  { id: 'RX-5005', patient: 'Sita Devi', pid: 'PTN-20523', doctor: 'Dr. Priya Sharma', date: '2026-04-05', status: 'partial', diagnosis: 'Type 2 Diabetes', meds: [{ name: 'Metformin 500mg', dosage: '1 tablet', freq: 'Twice daily', dur: '30 days' }, { name: 'Glimepiride 1mg', dosage: '1 tablet', freq: 'Before breakfast', dur: '30 days' }], notes: 'Fasting glucose check in 2 weeks.' },
];

const STAFF = [
  { name: 'Dr. Priya Sharma', role: 'doctor', status: 'active' },
  { name: 'Dr. Kavita Rao', role: 'doctor', status: 'active' },
  { name: 'Dr. Nikhil Joshi', role: 'doctor', status: 'inactive' },
  { name: 'Rahul Verma', role: 'pharmacist', status: 'active' },
  { name: 'Sneha Patil', role: 'receptionist', status: 'active' },
  { name: 'Amit Das', role: 'receptionist', status: 'active' },
];

const INVOICES = [
  { id: 'INV-3001', aptId: 'APT-1003', patient: 'Arjun Mehta', services: ['Consultation', 'Blood Test'], fee: 500, tax: 90, total: 590, payStatus: 'paid', date: '2026-03-20' },
  { id: 'INV-3002', aptId: 'APT-2001', patient: 'Meera Nair', services: ['Consultation'], fee: 500, tax: 90, total: 590, payStatus: 'pending', date: '2026-04-07' },
  { id: 'INV-3003', aptId: 'APT-2002', patient: 'Ravi Kumar', services: ['Consultation', 'ECG'], fee: 500, tax: 90, total: 590, payStatus: 'partial', date: '2026-04-07' },
];

const AUDIT_INIT = [
  { ts: '2026-04-06 08:02', user: 'Sneha Patil', role: 'receptionist', action: 'LOGIN', pid: '—', purpose: 'Session Start' },
  { ts: '2026-04-06 08:15', user: 'Dr. Priya Sharma', role: 'doctor', action: 'READ', pid: 'PTN-20501', purpose: 'Appointment Review' },
  { ts: '2026-04-06 08:30', user: 'Dr. Priya Sharma', role: 'doctor', action: 'WRITE', pid: 'PTN-20501', purpose: 'Prescription Created' },
  { ts: '2026-04-06 08:45', user: 'Rahul Verma', role: 'pharmacist', action: 'DISPENSE', pid: 'PTN-20501', purpose: 'Medication Dispensed' },
  { ts: '2026-04-06 09:00', user: 'Arjun Mehta', role: 'patient', action: 'READ', pid: 'PTN-20487', purpose: 'View Own Records' },
  { ts: '2026-04-05 17:00', user: 'Arjun Mehta', role: 'patient', action: 'CONSENT', pid: 'PTN-20487', purpose: 'Consent Captured', type: 'consent-captured' },
];
S.auditLog = [...AUDIT_INIT];

const CLINIC = { name: 'CityMed Clinic', address: '42 MG Road, Bengaluru 560001', hours: 'Mon–Sat: 8:00 AM – 8:00 PM', feeDefault: 500 };

// Navigation config per role
const NAV = {
  patient: [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'queue', label: 'Live Queue', icon: 'queue' },
    { id: 'teleconsult', label: 'Teleconsult', icon: 'video' },
    { id: 'records', label: 'Records', icon: 'file' },
  ],
  doctor: [
    { id: 'todayqueue', label: "Today's Queue", icon: 'queue' },
    { id: 'teleconsult', label: 'Teleconsult Room', icon: 'video' },
    { id: 'eprescription', label: 'E-Prescription', icon: 'rx' },
    { id: 'patientrecord', label: 'Patient Record', icon: 'file' },
  ],
  pharmacist: [
    { id: 'rxinbox', label: 'Rx Inbox', icon: 'inbox' },
  ],
  receptionist: [
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'queuedisplay', label: 'Queue Display', icon: 'queue' },
    { id: 'billing', label: 'Billing', icon: 'dollar' },
  ],
  admin: [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'staff', label: 'Staff', icon: 'users' },
    { id: 'audit', label: 'Consent & Audit', icon: 'shield' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ],
};

// ---- UTILITIES ----
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

function toast(msg, type = 'info') {
  const t = el('div', `toast ${type}`, `${type === 'success' ? IC.check : type === 'error' ? '⚠' : 'ℹ'} <span>${msg}</span>`);
  $('#toastContainer').appendChild(t);
  setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 300); }, 4000);
}

function openModal(html) {
  $('#modalContent').innerHTML = html;
  $('#modalOverlay').classList.add('active');
}
function closeModal() { $('#modalOverlay').classList.remove('active'); }

function addAudit(action, pid, purpose, type) {
  const now = new Date();
  const ts = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
  S.auditLog.unshift({ ts, user: S.user.name, role: S.role, action, pid: pid || '—', purpose, type });
}

function chipClass(status) {
  const m = { confirmed: 'chip-teal', completed: 'chip-green', dispensed: 'chip-green', cancelled: 'chip-coral', 'no-show': 'chip-coral', pending: 'chip-amber', partial: 'chip-amber', waiting: 'chip-amber', paid: 'chip-green', active: 'chip-teal', inactive: 'chip-coral' };
  return m[status] || 'chip-violet';
}

function countUp(element, target, duration = 1200) {
  let start = 0; const step = target / (duration / 16);
  const tick = () => { start = Math.min(start + step, target); element.textContent = Math.floor(start).toLocaleString(); if (start < target) requestAnimationFrame(tick); };
  tick();
}

function skeleton(n = 3) {
  return Array(n).fill('<div class="skeleton skeleton-card"></div>').join('');
}

// ---- PARTICLES ----
function initParticles() {
  const c = document.getElementById('particleCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, particles = [];
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for (let i = 0; i < 50; i++) particles.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*2+0.5, dx: (Math.random()-0.5)*0.3, dy: (Math.random()-0.5)*0.3, o: Math.random()*0.4+0.1 });
  (function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(0,212,170,${p.o})`; ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>W) p.dx*=-1; if(p.y<0||p.y>H) p.dy*=-1;
    });
    requestAnimationFrame(draw);
  })();
}

// ---- LOGIN ----
function initLogin() {
  const pills = $$('.role-pill');
  let selectedRole = 'patient';
  pills.forEach(p => p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    selectedRole = p.dataset.role;
  }));

  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const pass = $('#loginPassword').value.trim();
    let valid = true;
    // Validate
    $('#emailField').classList.remove('error');
    $('#passwordField').classList.remove('error');
    if (!email || !email.includes('@')) {
      $('#emailField').classList.add('error');
      $('#emailError').textContent = 'Please enter a valid email';
      valid = false;
    }
    if (!pass || pass.length < 3) {
      $('#passwordField').classList.add('error');
      $('#passwordError').textContent = 'Password is required';
      valid = false;
    }
    if (!valid) return;
    // Login
    S.role = selectedRole;
    S.user = USERS[selectedRole];
    localStorage.setItem('hh_role', S.role);
    localStorage.setItem('hh_user', JSON.stringify(S.user));
    addAudit('LOGIN', S.user.pid || '—', 'Session Start');
    enterApp();
  });
}

// ---- APP ENTRY ----
function enterApp() {
  $('#loginScreen').classList.remove('active');
  $('#appScreen').classList.add('active');
  buildNav();
  S.tab = 0;
  switchTab(0);
  $('#userName').textContent = S.user.name;
  $('#userRole').textContent = S.role;
  $('#userAvatar').textContent = S.user.avatar;
  startQueueSimulation();
}

function logout() {
  localStorage.removeItem('hh_role');
  localStorage.removeItem('hh_user');
  S.role = null; S.user = null;
  $('#appScreen').classList.remove('active');
  $('#loginScreen').classList.add('active');
  clearInterval(S.queueInterval);
  toast('Logged out successfully', 'info');
}

// ---- NAVIGATION ----
function buildNav() {
  const items = NAV[S.role] || [];
  // Sidebar
  const sn = $('#sidebarNav');
  sn.innerHTML = items.map((it, i) =>
    `<button class="nav-item${i===0?' active':''}" data-idx="${i}">${IC[it.icon]}<span>${it.label}</span></button>`
  ).join('');
  sn.querySelectorAll('.nav-item').forEach(b => b.addEventListener('click', () => switchTab(+b.dataset.idx)));

  // Bottom bar
  const bb = $('#bottomBar');
  bb.innerHTML = items.map((it, i) =>
    `<button class="bottom-item${i===0?' active':''}" data-idx="${i}">${IC[it.icon]}<span>${it.label}</span></button>`
  ).join('');
  bb.querySelectorAll('.bottom-item').forEach(b => b.addEventListener('click', () => switchTab(+b.dataset.idx)));

  // Tab nav
  const tn = $('#tabNav');
  tn.innerHTML = items.map((it, i) =>
    `<button class="tab-btn${i===0?' active':''}" data-idx="${i}">${it.label}</button>`
  ).join('');
  tn.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => switchTab(+b.dataset.idx)));
}

function switchTab(idx) {
  S.tab = idx;
  // Update active states
  $$('.nav-item').forEach((n,i) => n.classList.toggle('active', i===idx));
  $$('.bottom-item').forEach((n,i) => n.classList.toggle('active', i===idx));
  $$('.tab-btn').forEach((n,i) => n.classList.toggle('active', i===idx));
  // Render content
  const panels = $('#contentPanels');
  panels.innerHTML = skeleton();
  S.loading = true;
  setTimeout(() => {
    S.loading = false;
    renderPanel();
  }, 800);
}

// ---- QUEUE SIMULATION ----
function startQueueSimulation() {
  clearInterval(S.queueInterval);
  S.queueInterval = setInterval(() => {
    if (S.currentServing < 30) {
      S.currentServing++;
      // Update any visible queue display
      const tokenEl = document.getElementById('servingToken');
      if (tokenEl) tokenEl.textContent = S.currentServing;
      const etaEl = document.getElementById('etaDisplay');
      if (etaEl) {
        const diff = S.queueToken - S.currentServing;
        etaEl.textContent = diff > 0 ? `~${diff * 5} min` : 'Your turn!';
      }
      const awayEl = document.getElementById('awayCount');
      if (awayEl) {
        const diff = S.queueToken - S.currentServing;
        awayEl.textContent = diff > 0 ? `You're ${diff} away` : "It's your turn!";
      }
      const progEl = document.getElementById('queueProgress');
      if (progEl) {
        const pct = Math.min(100, (S.currentServing / S.queueToken) * 100);
        progEl.style.width = pct + '%';
      }
      // Receptionist queue
      const rqToken = document.getElementById('rqCurrentToken');
      if (rqToken) rqToken.textContent = S.currentServing;
    }
  }, 5000);
}

// ============= PANEL RENDERER =============
function renderPanel() {
  const p = $('#contentPanels');
  const items = NAV[S.role];
  const tabId = items[S.tab].id;
  const R = {
    // Patient
    'patient:home': renderPatientHome,
    'patient:appointments': renderPatientAppointments,
    'patient:queue': renderPatientQueue,
    'patient:teleconsult': renderPatientTeleconsult,
    'patient:records': renderPatientRecords,
    // Doctor
    'doctor:todayqueue': renderDoctorQueue,
    'doctor:teleconsult': renderDoctorTeleconsult,
    'doctor:eprescription': renderDoctorRx,
    'doctor:patientrecord': renderDoctorPatientRecord,
    // Pharmacist
    'pharmacist:rxinbox': renderPharmacistInbox,
    // Receptionist
    'receptionist:appointments': renderReceptionistAppts,
    'receptionist:queuedisplay': renderReceptionistQueue,
    'receptionist:billing': renderReceptionistBilling,
    // Admin
    'admin:overview': renderAdminOverview,
    'admin:staff': renderAdminStaff,
    'admin:audit': renderAdminAudit,
    'admin:settings': renderAdminSettings,
  };
  const fn = R[S.role + ':' + tabId];
  if (fn) fn(p); else p.innerHTML = '<div class="empty-state"><p>Section coming soon</p></div>';
}

// ========== PATIENT DASHBOARD ==========
function renderPatientHome(p) {
  const u = S.user;
  const nextApt = APPOINTMENTS.find(a => a.status === 'confirmed' && a.patient === u.name);
  p.innerHTML = `
    <div class="data-card patient-card mb-24">
      <div class="patient-avatar-lg">${u.avatar}</div>
      <div class="patient-details">
        <div class="patient-name">${u.name}</div>
        <div class="patient-meta">
          <span>DOB: ${u.dob}</span><span>Blood: ${u.blood}</span><span>${u.clinic}</span>
        </div>
      </div>
      <div class="patient-badge">${u.pid}</div>
    </div>

    <div class="section-header"><h3 class="section-title">Health Vitals</h3><span class="fs-sm text-muted">Last recorded: Apr 5, 2026</span></div>
    <div class="vitals-grid">
      ${renderVitalCard('❤️', 'bp', 'Blood Pressure', '120/80', 'mmHg', 75, 'normal', 'var(--coral)')}
      ${renderVitalCard('💓', 'hr', 'Heart Rate', '72', 'bpm', 72, 'normal', 'var(--teal)')}
      ${renderVitalCard('🫁', 'spo2', 'SpO2', '98', '%', 98, 'normal', 'var(--violet)')}
      ${renderVitalCard('⚖️', 'bmi', 'BMI', '23.1', 'kg/m²', 77, 'normal', 'var(--amber)')}
    </div>

    ${nextApt ? `
    <div class="section-header"><h3 class="section-title">Upcoming Appointment</h3></div>
    <div class="data-card mb-24" style="border-left:3px solid var(--teal)">
      <div class="card-row">
        <div>
          <div class="card-title">${nextApt.doctor}</div>
          <div class="card-subtitle">${nextApt.specialty} · ${nextApt.clinic}</div>
          <div class="card-meta"><span>${nextApt.date}</span><span>${nextApt.time}</span><span class="chip ${chipClass(nextApt.status)}">${nextApt.status}</span></div>
        </div>
        <div class="card-actions"><span class="chip chip-teal">₹${nextApt.fee}</span></div>
      </div>
    </div>` : ''}

    <div class="section-header"><h3 class="section-title">Health Tips</h3></div>
    <div class="mb-24">
      <div class="health-tip"><span class="tip-icon">💧</span><div class="tip-text"><strong>Stay Hydrated</strong> — Drink at least 8 glasses of water daily for optimal health.</div></div>
      <div class="health-tip"><span class="tip-icon">🏃</span><div class="tip-text"><strong>Move More</strong> — 30 minutes of moderate exercise can improve your cardiovascular health.</div></div>
      <div class="health-tip"><span class="tip-icon">😴</span><div class="tip-text"><strong>Sleep Well</strong> — Aim for 7-9 hours of quality sleep every night.</div></div>
    </div>

    <div class="section-header"><h3 class="section-title">Quick Actions</h3></div>
    <div class="quick-actions mb-24">
      <button class="action-btn" onclick="switchTab(1)">${IC.calendar}<span>Book Appointment</span></button>
      <button class="action-btn" onclick="switchTab(2)">${IC.queue}<span>Queue Status</span></button>
      <button class="action-btn" onclick="switchTab(3)">${IC.video}<span>Teleconsult</span></button>
      <button class="action-btn" onclick="switchTab(4)">${IC.file}<span>My Records</span></button>
    </div>
    <div class="consent-toggle mt-16">
      <div class="toggle-switch ${S.consent?'active':''}" id="consentToggle"></div>
      <div><strong>Data Sharing Consent</strong><br><span class="fs-sm text-muted">Allow doctors and pharmacists to view your health records</span></div>
    </div>`;

  // Animate radial gauges
  setTimeout(() => {
    p.querySelectorAll('.gauge-fill').forEach(g => {
      g.style.strokeDashoffset = g.dataset.target;
    });
  }, 100);

  document.getElementById('consentToggle')?.addEventListener('click', () => {
    S.consent = !S.consent;
    document.getElementById('consentToggle').classList.toggle('active', S.consent);
    addAudit('CONSENT', u.pid, S.consent ? 'Consent Captured' : 'Consent Revoked', S.consent ? 'consent-captured' : 'consent-revoked');
    toast(S.consent ? 'Consent granted' : 'Consent revoked — records hidden from providers', S.consent ? 'success' : 'error');
  });
}

function renderVitalCard(emoji, cls, label, value, unit, pct, status, color) {
  const circ = 2 * Math.PI * 27;
  const offset = circ - (pct / 100) * circ;
  return `<div class="vital-card">
    <div class="radial-gauge">
      <svg viewBox="0 0 64 64"><circle class="gauge-bg" cx="32" cy="32" r="27"/><circle class="gauge-fill" cx="32" cy="32" r="27" stroke="${color}" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" data-target="${offset}"/></svg>
      <div class="gauge-center">${emoji}</div>
    </div>
    <div class="vital-label">${label}</div>
    <div class="vital-value" style="color:${color}">${value}</div>
    <div class="fs-sm text-muted">${unit}</div>
    <div class="vital-status ${status}">${status}</div>
  </div>`;
}

function renderPatientAppointments(p) {
  const u = S.user;
  const apts = APPOINTMENTS.filter(a => a.pid === u.pid && a.status !== 'cancelled');
  const upcoming = apts.filter(a => a.status === 'confirmed');
  const past = apts.filter(a => a.status !== 'confirmed');
  
  const upcomingHtml = upcoming.length > 0 
    ? `<div class="cards-grid mb-24">${upcoming.map(a => aptCard(a, true)).join('')}</div>`
    : `<div class="empty-state" style="text-align:center;padding:30px;color:var(--text-light);background:var(--bg-light);border-radius:12px;margin-bottom:24px;">
        <div style="font-size:2.5rem;margin-bottom:12px;">🗓️</div>
        <h4>No upcoming appointments</h4>
        <p>You don't have any pending visits scheduled.</p>
      </div>`;

  const pastHtml = past.length > 0 
    ? `<div class="cards-grid">${past.map(a => aptCard(a, false)).join('')}</div>`
    : `<div class="empty-state" style="text-align:center;padding:20px;color:var(--text-light);border: 1px dashed var(--border-color);border-radius:12px;">
        <p>No past appointments found</p>
      </div>`;

  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Upcoming</h3><button class="btn-sm btn-teal" id="bookNewBtn">${IC.plus} Book New</button></div>
    ${upcomingHtml}
    <div class="section-header"><h3 class="section-title">Past</h3></div>
    ${pastHtml}`;
    
  document.getElementById('bookNewBtn')?.addEventListener('click', openBookingModal);
}

function aptCard(a, showActions) {
  return `<div class="data-card">
    <div class="card-row">
      <div>
        <div class="card-title">${a.doctor}</div>
        <div class="card-subtitle">${a.specialty} · ${a.clinic}</div>
        <div class="card-meta"><span>${a.date}</span><span>${a.time}</span><span class="chip ${chipClass(a.status)}">${a.status}</span><span class="chip chip-violet">₹${a.fee}</span></div>
      </div>
    </div>
    ${showActions ? `<div class="card-actions mt-16"><button class="btn-sm btn-amber" onclick="toast('Rescheduled to next slot','success')">Reschedule</button><button class="btn-sm btn-coral" onclick="cancelAppointment('${a.id}')">Cancel</button></div>` : ''}
  </div>`;
}

function cancelAppointment(id) {
  const apt = APPOINTMENTS.find(a => a.id === id);
  if (apt) {
    apt.status = 'cancelled';
    toast('Appointment cancelled', 'error');
    addAudit('WRITE', S.user.pid, 'Cancelled Appointment');
    if (S.tab === 1) renderPatientAppointments(document.getElementById('tabContent'));
  }
}

function openBookingModal() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10);
  openModal(`
    <h3 style="margin-bottom:20px">Book New Appointment</h3>
    <div id="bookingLocating" style="text-align:center; padding:30px; color:var(--text-light)">
       <div class="pulse-dot" style="display:inline-block; margin-right:8px; background:var(--teal)"></div> 
       <span>Locating nearby clinics & doctors...<br><small>(Checking access & routing)</small></span>
    </div>
    <div id="bookingForm" style="display:none;"></div>
  `);

  const fallbackToIPLocation = () => {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(r => r.json())
      .then(d => {
        if(d.latitude && d.longitude) {
           fetchNearbyClinicsAndDoctors(d.latitude, d.longitude, dateStr);
        } else {
           renderBookingForm([{name: "CityMed Clinic (Fallback)"}], [], dateStr);
        }
      })
      .catch(e => renderBookingForm([{name: "CityMed Clinic (Offline)"}], [], dateStr));
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchNearbyClinicsAndDoctors(pos.coords.latitude, pos.coords.longitude, dateStr),
      err => {
         console.warn("Geolocation denied/failed, falling back to IP:", err);
         fallbackToIPLocation();
      },
      { timeout: 5000 }
    );
  } else {
    fallbackToIPLocation();
  }
}

async function fetchNearbyClinicsAndDoctors(lat, lon, dateStr) {
  try {
    // Find hospitals, clinics, AND doctors within 10km
    const query = `[out:json];(node["amenity"~"clinic|hospital"](around:10000,${lat},${lon});way["amenity"~"clinic|hospital"](around:10000,${lat},${lon});node["amenity"="doctors"](around:10000,${lat},${lon});way["amenity"="doctors"](around:10000,${lat},${lon}););out body 25;`;
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });
    if (!res.ok) throw new Error("Overpass API error");
    const data = await res.json();
    
    let clinics = data.elements.filter(e => e.tags && e.tags.name && e.tags.amenity !== 'doctors').map(e => ({ name: e.tags.name }));
    let doctors = data.elements.filter(e => e.tags && e.tags.name && e.tags.amenity === 'doctors').map(e => ({ name: e.tags.name, spec: e.tags.healthcare || e.tags.speciality || 'General' }));
    
    // Deduplicate names
    const uniqueClinics = [...new Set(clinics.map(c => c.name))];
    clinics = uniqueClinics.map(name => ({ name }));
    
    const uniqueDocs = [...new Set(doctors.map(d => d.name + '|' + d.spec))];
    doctors = uniqueDocs.map(str => { const p = str.split('|'); return {name: p[0], spec: p[1]} });

    if (clinics.length === 0) {
       clinics = [{name: "No clinics found nearby - Using CityMed Area fallback"}];
    }
    
    renderBookingForm(clinics, doctors, dateStr);
  } catch(e) {
    console.error(e);
    renderBookingForm([{name: "CityMed Clinic (Offline)"}], [], dateStr);
  }
}

function renderBookingForm(clinics, doctors, dateStr) {
  const locHtml = document.getElementById('bookingLocating');
  const formHtml = document.getElementById('bookingForm');
  if (!locHtml || !formHtml) return;
  locHtml.style.display = 'none';
  
  const clinicOptions = clinics.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  
  let doctorOptions = '';
  if (doctors && doctors.length > 0) {
     doctorOptions = doctors.map(d => `<option value="${d.name} — ${d.spec}">${d.name} — ${d.spec}</option>`).join('');
  } else {
     // If we couldn't fetch real doctors, list generic location-based slots
     doctorOptions = `
      <option value="Available Duty Doctor — General Medicine">Available Duty Doctor — General Medicine</option>
      <option value="Senior Consultant — Dermatology">Senior Consultant — Dermatology</option>
      <option value="Specialist — ENT">Specialist — ENT</option>
      <option value="Available Duty Doctor — Cardiology">Available Duty Doctor — Cardiology</option>
     `;
  }
  
  formHtml.style.display = 'block';
  formHtml.innerHTML = `
    <div class="floating-input"><select id="bookClinic">${clinicOptions}</select><label>Clinic</label></div>
    <div class="floating-input"><select id="bookDoctor">${doctorOptions}</select><label>Doctor</label></div>
    <div class="floating-input"><input type="date" id="bookDate" value="${dateStr}" placeholder=" "><label>Date</label></div>
    <div class="floating-input"><select id="bookSlot"><option value="09:00 AM">09:00 AM</option><option value="09:30 AM">09:30 AM</option><option value="10:00 AM">10:00 AM</option><option value="10:30 AM">10:30 AM</option><option value="11:00 AM">11:00 AM</option><option value="02:00 PM">02:00 PM</option><option value="04:30 PM">04:30 PM</option></select><label>Time Slot</label></div>
    <button class="btn-primary" onclick="submitBooking()">Confirm Booking</button>
  `;
}

function submitBooking() {
  const docVal = document.getElementById('bookDoctor').value.split(' — ');
  const apt = {
    id: 'APT-' + Math.floor(Math.random() * 10000),
    patient: S.user.name,
    pid: S.user.pid,
    doctor: docVal[0],
    specialty: docVal[1] || 'General',
    clinic: document.getElementById('bookClinic').value,
    date: document.getElementById('bookDate').value,
    time: document.getElementById('bookSlot').value,
    fee: 500,
    status: 'confirmed',
    token: null
  };
  APPOINTMENTS.unshift(apt);
  closeModal();
  toast('Appointment booked successfully!', 'success');
  addAudit('WRITE', S.user.pid, 'Booked Appointment');
  if (S.tab === 1) renderPatientAppointments(document.getElementById('tabContent'));
}

function renderPatientQueue(p) {
  const diff = Math.max(0, S.queueToken - S.currentServing);
  const pct = Math.min(100, (S.currentServing / S.queueToken) * 100);
  p.innerHTML = `
    <div class="data-card queue-display">
      <div class="token-label">YOUR TOKEN</div>
      <div class="token-large">${S.queueToken}</div>
      <div style="margin:16px 0;color:var(--text-secondary)">Currently Serving: <strong id="servingToken" class="text-teal">${S.currentServing}</strong></div>
      <div class="progress-bar"><div class="progress-fill" id="queueProgress" style="width:${pct}%"></div></div>
      <div style="font-size:0.9rem;color:var(--text-secondary)">ETA: <strong id="etaDisplay">${diff > 0 ? `~${diff*5} min` : 'Your turn!'}</strong></div>
      <div class="queue-alert"><div class="pulse-dot"></div><span id="awayCount">${diff > 0 ? `You're ${diff} away` : "It's your turn!"}</span></div>
      <button class="action-btn mt-16" style="margin:16px auto 0" onclick="toast('Notification bell enabled','success')">${IC.bell}<span>Notify Me</span></button>
    </div>`;
}

function renderPatientTeleconsult(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Teleconsultation</h3></div>
    <div class="data-card mb-24">
      <div class="video-grid"><div class="video-tile">${IC.video}<span style="position:absolute;bottom:10px;font-size:0.75rem">Camera Preview</span></div><div class="video-tile" style="background:var(--glass-light)">${IC.users}<span style="position:absolute;bottom:10px;font-size:0.75rem">Doctor</span></div></div>
      <div class="card-row"><div><div class="card-title">Session with Dr. Priya Sharma</div><div class="card-subtitle">Scheduled: Apr 7, 2026 · 10:30 AM</div></div>
      <button class="btn-sm btn-teal" id="joinCallBtn" disabled>Join Call (at scheduled time)</button></div>
    </div>
    <div class="section-header"><h3 class="section-title">Upload Reports</h3></div>
    <div class="data-card">
      <div class="drop-zone" id="dropZone">${IC.upload}<p style="margin-top:8px">Drag & drop files here or click to browse</p><p class="fs-sm text-muted">PDF, JPG, PNG up to 10 MB</p></div>
      <div id="uploadList" class="mt-16"></div>
    </div>`;
  const dz = document.getElementById('dropZone');
  dz?.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
  dz?.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz?.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('dragover'); toast('File uploaded successfully','success'); document.getElementById('uploadList').innerHTML += '<div class="data-card" style="padding:10px 16px;margin-top:8px"><span class="fs-sm">📄 Report_scan.pdf</span> <span class="chip chip-green">Uploaded</span></div>'; });
  dz?.addEventListener('click', () => toast('File browser would open here','info'));
}

function renderPatientRecords(p) {
  addAudit('READ', S.user.pid, 'View Own Records');
  const myRx = PRESCRIPTIONS.filter(rx => rx.patient === S.user.name);
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Prescriptions</h3></div>
    <div class="cards-grid mb-24">${myRx.map(rx => `
      <div class="data-card">
        <div class="card-row"><div class="card-title">${rx.id}</div><span class="chip ${chipClass(rx.status)}">${rx.status}</span></div>
        <div class="card-subtitle">${rx.doctor} · ${rx.date}</div>
        <div class="mt-16">${rx.meds.map(m => `<div class="rx-med-row"><strong>${m.name}</strong><span class="text-muted">${m.dosage} · ${m.freq} · ${m.dur}</span></div>`).join('')}</div>
        ${rx.notes ? `<p class="fs-sm text-muted mt-16">${rx.notes}</p>` : ''}
      </div>`).join('')}</div>
    <div class="section-header"><h3 class="section-title">Visit Summaries</h3></div>
    <div class="cards-grid">${APPOINTMENTS.filter(a=>a.patient===S.user.name&&a.status==='completed').map(a=>`
      <div class="data-card"><div class="card-title">${a.doctor}</div><div class="card-subtitle">${a.specialty} · ${a.date} · ${a.time}</div><div class="card-meta"><span class="chip chip-green">Completed</span></div></div>`).join('')||'<div class="empty-state"><p>No visit summaries yet</p></div>'}</div>`;
}

// ========== DOCTOR DASHBOARD ==========
function renderDoctorQueue(p) {
  const todayApts = APPOINTMENTS.filter(a => a.date === '2026-04-07');
  const seen = todayApts.filter(a => a.status==='completed').length;
  const waiting = todayApts.filter(a => ['confirmed','waiting'].includes(a.status)).length;
  const noShow = todayApts.filter(a => a.status==='no-show').length;
  p.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card teal stagger-1"><div class="stat-label">Total</div><div class="stat-value" data-count="${todayApts.length}">0</div></div>
      <div class="stat-card green stagger-2"><div class="stat-label">Seen</div><div class="stat-value" data-count="${seen}">0</div></div>
      <div class="stat-card amber stagger-3"><div class="stat-label">Waiting</div><div class="stat-value" data-count="${waiting}">0</div></div>
      <div class="stat-card coral stagger-4"><div class="stat-label">No-Show</div><div class="stat-value" data-count="${noShow}">0</div></div>
    </div>
    <div class="section-header"><h3 class="section-title">Today's Appointments</h3></div>
    <div class="cards-grid">${todayApts.map(a => `
      <div class="data-card">
        <div class="card-row"><div><div class="card-title">${a.patient}</div><div class="card-subtitle">${a.pid} · Token: ${a.token||'—'}</div></div><span class="chip ${chipClass(a.status)}">${a.status}</span></div>
        <div class="card-actions mt-16">
          <button class="btn-sm btn-teal" onclick="toast('Calling next patient...','success');addAudit('READ','${a.pid}','Call Next')">Call Next</button>
          <button class="btn-sm btn-coral" onclick="toast('Marked as no-show','error');addAudit('WRITE','${a.pid}','Mark No-Show')">No-Show</button>
          <button class="btn-sm btn-green" onclick="toast('Visit completed','success');addAudit('WRITE','${a.pid}','Complete Visit')">Complete</button>
        </div>
      </div>`).join('')}</div>`;
  p.querySelectorAll('.stat-value[data-count]').forEach(el => countUp(el, +el.dataset.count));
}

function renderDoctorTeleconsult(p) {
  p.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 320px;gap:20px">
      <div>
        <div class="data-card mb-16">
          <div class="video-grid"><div class="video-tile">${IC.video}<span style="position:absolute;bottom:10px;font-size:0.75rem">You (Dr. Priya Sharma)</span></div><div class="video-tile">${IC.users}<span style="position:absolute;bottom:10px;font-size:0.75rem">Patient</span></div></div>
        </div>
        <div class="data-card">
          <h4 style="margin-bottom:12px">Chat</h4>
          <div class="chat-panel"><div class="chat-bubble received">Hello Doctor, I've been having headaches.</div><div class="chat-bubble sent">How long have you been experiencing this?</div><div class="chat-bubble received">About 3 days now.</div></div>
          <div style="display:flex;gap:8px;margin-top:12px"><input style="flex:1;padding:10px 14px;border-radius:8px;background:var(--glass-light);border:1px solid var(--glass-border);color:var(--text-primary);font-size:0.85rem" placeholder="Type a message..."><button class="btn-sm btn-teal" onclick="toast('Message sent','success')">Send</button></div>
        </div>
      </div>
      <div class="data-card" style="align-self:start">
        <h4 style="margin-bottom:12px">Current Patient</h4>
        <div class="patient-avatar-lg" style="width:48px;height:48px;font-size:1rem;margin-bottom:12px">AM</div>
        <div class="card-title">Arjun Mehta</div>
        <div class="card-subtitle">PTN-20487 · B+</div>
        <div class="card-meta"><span>DOB: 1992-05-14</span></div>
        <div style="margin-top:12px"><span class="chip chip-teal">In Session</span></div>
      </div>
    </div>`;
}

function renderDoctorRx(p) {
  p.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="data-card">
        <h3 style="margin-bottom:20px">New Prescription</h3>
        <div class="floating-input"><input id="rxDiag" placeholder=" " value=""><label>Diagnosis</label></div>
        <div id="rxMedRows"><div class="form-row"><div class="floating-input"><input class="rx-med-name" placeholder=" "><label>Medication</label></div><div class="floating-input"><input class="rx-med-dose" placeholder=" "><label>Dosage</label></div><div class="floating-input"><input class="rx-med-freq" placeholder=" "><label>Frequency</label></div><div class="floating-input"><input class="rx-med-dur" placeholder=" "><label>Duration</label></div></div></div>
        <button class="btn-sm btn-outline mb-16" onclick="addMedRow()">+ Add Medication</button>
        <div class="floating-input"><textarea id="rxNotes" placeholder=" " rows="3"></textarea><label>Notes</label></div>
        <button class="btn-primary" onclick="submitPrescription()">Submit Prescription</button>
      </div>
      <div>
        <h3 style="margin-bottom:20px">Live Preview</h3>
        <div class="rx-preview" id="rxPreview">
          <div class="rx-header"><div><strong>CityMed Clinic</strong><br><span class="fs-sm text-muted">Dr. Priya Sharma</span></div><div class="text-muted fs-sm">${new Date().toISOString().slice(0,10)}</div></div>
          <div class="mb-16"><strong>Diagnosis:</strong> <span id="rxPrevDiag" class="text-muted">—</span></div>
          <div id="rxPrevMeds" class="mb-16"><div class="text-muted fs-sm">No medications added</div></div>
          <div><strong>Notes:</strong> <span id="rxPrevNotes" class="text-muted">—</span></div>
        </div>
      </div>
    </div>`;
  // Live preview listeners
  const update = () => {
    const diag = document.getElementById('rxDiag');
    if (diag) document.getElementById('rxPrevDiag').textContent = diag.value || '—';
    const notes = document.getElementById('rxNotes');
    if (notes) document.getElementById('rxPrevNotes').textContent = notes.value || '—';
    const names = p.querySelectorAll('.rx-med-name');
    const doses = p.querySelectorAll('.rx-med-dose');
    const freqs = p.querySelectorAll('.rx-med-freq');
    const durs = p.querySelectorAll('.rx-med-dur');
    let html = '';
    names.forEach((n,i) => { if(n.value) html += `<div class="rx-med-row"><strong>${n.value}</strong><span class="text-muted">${doses[i]?.value||''} · ${freqs[i]?.value||''} · ${durs[i]?.value||''}</span></div>`; });
    document.getElementById('rxPrevMeds').innerHTML = html || '<div class="text-muted fs-sm">No medications added</div>';
  };
  p.addEventListener('input', update);
}
function addMedRow() {
  const c = document.getElementById('rxMedRows');
  if (c) c.innerHTML += '<div class="form-row"><div class="floating-input"><input class="rx-med-name" placeholder=" "><label>Medication</label></div><div class="floating-input"><input class="rx-med-dose" placeholder=" "><label>Dosage</label></div><div class="floating-input"><input class="rx-med-freq" placeholder=" "><label>Frequency</label></div><div class="floating-input"><input class="rx-med-dur" placeholder=" "><label>Duration</label></div></div>';
}

function submitPrescription() {
  const diag = document.getElementById('rxDiag').value;
  const notes = document.getElementById('rxNotes').value;
  const names = document.querySelectorAll('.rx-med-name');
  const doses = document.querySelectorAll('.rx-med-dose');
  const freqs = document.querySelectorAll('.rx-med-freq');
  const durs = document.querySelectorAll('.rx-med-dur');
  
  const meds = [];
  names.forEach((n, i) => {
    if(n.value) meds.push({ name: n.value, dosage: doses[i]?.value, freq: freqs[i]?.value, dur: durs[i]?.value });
  });
  
  if (!diag || meds.length === 0) {
    toast('Diagnosis and at least one medication required', 'error');
    return;
  }
  
  PRESCRIPTIONS.unshift({
    id: 'RX-' + Math.floor(Math.random() * 10000 + 5000),
    patient: 'Arjun Mehta',
    pid: 'PTN-20487',
    doctor: S.user.name,
    date: new Date().toISOString().slice(0,10),
    status: 'pending',
    diagnosis: diag,
    meds: meds,
    notes: notes
  });
  
  toast('Prescription submitted', 'success');
  addAudit('WRITE', 'PTN-20487', 'Prescription Created');
  
  document.getElementById('rxDiag').value = '';
  document.getElementById('rxNotes').value = '';
  document.getElementById('rxMedRows').innerHTML = '<div class="form-row"><div class="floating-input"><input class="rx-med-name" placeholder=" "><label>Medication</label></div><div class="floating-input"><input class="rx-med-dose" placeholder=" "><label>Dosage</label></div><div class="floating-input"><input class="rx-med-freq" placeholder=" "><label>Frequency</label></div><div class="floating-input"><input class="rx-med-dur" placeholder=" "><label>Duration</label></div></div>';
  document.getElementById('rxPrevDiag').textContent = '—';
  document.getElementById('rxPrevMeds').innerHTML = '<div class="text-muted fs-sm">No medications added</div>';
  document.getElementById('rxPrevNotes').textContent = '—';
}

function renderDoctorPatientRecord(p) {
  // Only accessible via active appointment
  const activeApt = APPOINTMENTS.find(a => a.date === '2026-04-07' && (a.status === 'confirmed' || a.status === 'waiting'));
  if (!activeApt) {
    p.innerHTML = `<div class="data-card locked-card" style="position:relative;min-height:200px"><div class="lock-overlay"><div style="text-align:center">${IC.lock}<p class="mt-16">No active appointment linked</p><p class="fs-sm text-muted">Patient records can only be accessed via an active appointment</p></div></div></div>`;
    return;
  }
  if (!S.consent) {
    p.innerHTML = `<div class="data-card" style="position:relative;min-height:200px"><div class="consent-revoked-overlay">${IC.lock}<span>Consent Revoked</span><span class="fs-sm">Patient has revoked data sharing consent</span></div></div>`;
    return;
  }
  addAudit('READ', activeApt.pid, 'Patient Record Access');
  const patientRx = PRESCRIPTIONS.filter(rx => rx.pid === activeApt.pid);
  p.innerHTML = `
    <div class="data-card mb-16" style="border-left:3px solid var(--violet)">
      <span class="chip chip-amber" style="margin-bottom:12px">Access Logged</span>
      <div class="card-title">${activeApt.patient}</div><div class="card-subtitle">${activeApt.pid} · ${activeApt.specialty}</div>
    </div>
    <div class="section-header"><h3 class="section-title">Prescription History</h3></div>
    <div class="cards-grid">${patientRx.map(rx => `<div class="data-card"><div class="card-row"><div class="card-title">${rx.id}</div><span class="chip ${chipClass(rx.status)}">${rx.status}</span></div><div class="card-subtitle">${rx.doctor} · ${rx.date}</div><div class="mt-16">${rx.meds.map(m=>`<div class="rx-med-row"><strong>${m.name}</strong><span class="text-muted">${m.dosage} · ${m.freq}</span></div>`).join('')}</div></div>`).join('')||'<div class="empty-state"><p>No records found</p></div>'}</div>`;
}

// ========== PHARMACIST DASHBOARD ==========
function renderPharmacistInbox(p) {
  const rxList = PRESCRIPTIONS.filter(rx => rx.status !== 'dispensed' || rx.status === 'dispensed');
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Prescription Inbox — CityMed Clinic</h3></div>
    <div class="data-boundary mb-16">${IC.lock} Clinical notes hidden — data minimization policy</div>
    <div class="cards-grid">${rxList.map(rx => `
      <div class="data-card" style="cursor:pointer" onclick="openDispenseModal('${rx.id}')">
        <div class="card-row"><div class="card-title">${rx.id}</div><span class="chip ${chipClass(rx.status)}">${rx.status}</span></div>
        <div class="card-subtitle">${rx.patient} · ${rx.pid}</div>
        <div class="card-meta"><span>Dr. ${rx.doctor.replace('Dr. ','')}</span><span>${rx.date}</span></div>
        <div class="mt-16">${rx.meds.map(m => `<div class="fs-sm">💊 ${m.name} — ${m.dosage} · ${m.freq} · ${m.dur}</div>`).join('')}</div>
        <div class="data-boundary mt-16" style="font-size:0.68rem">${IC.shield} Clinical notes hidden</div>
      </div>`).join('')}</div>`;
}

function openDispenseModal(rxId) {
  const rx = PRESCRIPTIONS.find(r => r.id === rxId);
  if (!rx) return;
  openModal(`
    <h3 style="margin-bottom:20px">Dispense — ${rx.id}</h3>
    <div class="data-card mb-16">
      <div class="card-title">${rx.patient} · ${rx.pid}</div>
      <div class="card-subtitle">Prescribed by ${rx.doctor} on ${rx.date}</div>
      <div class="mt-16">${rx.meds.map(m => `<div class="rx-med-row"><strong>${m.name}</strong><span class="text-muted">${m.dosage} · ${m.freq} · ${m.dur}</span></div>`).join('')}</div>
      <div class="data-boundary mt-16">${IC.shield} Diagnosis & clinical notes not visible</div>
    </div>
    <div class="floating-input"><textarea id="subNote" placeholder=" " rows="2"></textarea><label>Substitution Notes (if partial)</label></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-sm btn-green" onclick="closeModal();toast('Marked as dispensed','success');addAudit('DISPENSE','${rx.pid}','Medication Dispensed')">Mark Dispensed</button>
      <button class="btn-sm btn-amber" onclick="closeModal();toast('Marked as partial','info');addAudit('DISPENSE','${rx.pid}','Partial Dispense')">Mark Partial</button>
      <button class="btn-sm btn-teal" onclick="toast('Patient notified','success')">Notify Patient</button>
      <button class="btn-sm btn-violet" onclick="toast('Doctor notified','success')">Notify Doctor</button>
    </div>
  `);
}



// ========== RECEPTIONIST DASHBOARD ==========
function renderReceptionistAppts(p) {
  const apts = APPOINTMENTS.filter(a => a.date === '2026-04-07');
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Appointments Manager</h3></div>
    <div class="filter-bar mb-16"><input type="date" value="2026-04-07"><select><option>All Doctors</option><option>Dr. Priya Sharma</option></select><select><option>All Statuses</option><option>Confirmed</option><option>Completed</option></select></div>
    <div class="data-card" style="overflow-x:auto">
      <table class="data-table"><thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Time</th><th>Token</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${apts.map(a => `<tr>
        <td>${a.id}</td><td>${a.patient}</td><td>${a.doctor.replace('Dr. ','')}</td><td>${a.time}</td><td>${a.token||'—'}</td>
        <td><span class="chip ${chipClass(a.status)}">${a.status}</span></td>
        <td><button class="btn-sm btn-teal" onclick="openCheckinModal('${a.id}','${a.patient}')">Check In</button></td>
      </tr>`).join('')}</tbody></table>
    </div>`;
}

function openCheckinModal(aptId, patient) {
  openModal(`
    <h3 style="margin-bottom:20px">Check-In — ${patient}</h3>
    <div class="data-card mb-16" style="text-align:center;padding:32px">
      <div style="width:120px;height:120px;margin:0 auto 16px;border:2px dashed var(--glass-border);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-muted)">
        <div>${IC.inbox}<p class="fs-sm mt-16">QR Scanner</p></div>
      </div>
      <p class="fs-sm text-muted">Scan patient QR code or enter ID manually</p>
    </div>
    <div class="floating-input"><input id="manualId" placeholder=" " value="${aptId}"><label>Appointment / Patient ID</label></div>
    <button class="btn-primary" onclick="closeModal();toast('Token generated: ${S.currentServing + 5}','success');addAudit('WRITE','—','Check-In: ${patient}')">Confirm Check-In & Generate Token</button>
  `);
}

function renderReceptionistQueue(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Queue Display (Operator View)</h3><button class="btn-sm btn-outline" id="hcToggle">Toggle High Contrast</button></div>
    <div class="data-card queue-display ${S.highContrast?'high-contrast':''}" id="rqDisplay">
      <div class="token-label">NOW SERVING</div>
      <div class="token-large" id="rqCurrentToken">${S.currentServing}</div>
      <button class="btn-primary" style="max-width:240px;margin:24px auto 0" onclick="S.currentServing++;document.getElementById('rqCurrentToken').textContent=S.currentServing;toast('Next: Token '+S.currentServing,'success')">Next Token</button>
    </div>
    <div class="section-header mt-16"><h3 class="section-title">Queue List</h3></div>
    <div class="cards-grid">${APPOINTMENTS.filter(a=>a.date==='2026-04-07'&&a.token).sort((a,b)=>a.token-b.token).map(a=>`
      <div class="data-card" style="padding:14px 18px"><div class="card-row"><div><strong>Token ${a.token}</strong> — ${a.patient}</div><span class="chip ${a.token<=S.currentServing?'chip-green':'chip-amber'}">${a.token<=S.currentServing?'Served':'Waiting'}</span></div></div>`).join('')}</div>`;
  document.getElementById('hcToggle')?.addEventListener('click', () => {
    S.highContrast = !S.highContrast;
    document.getElementById('rqDisplay')?.classList.toggle('high-contrast', S.highContrast);
  });
}

function renderReceptionistBilling(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Billing & Invoices</h3></div>
    <div class="data-card" style="overflow-x:auto">
      <table class="data-table"><thead><tr><th>Invoice</th><th>Patient</th><th>Services</th><th>Fee</th><th>Tax</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${INVOICES.map(inv => `<tr>
        <td>${inv.id}</td><td>${inv.patient}</td><td>${inv.services.join(', ')}</td>
        <td>₹${inv.fee}</td><td>₹${inv.tax}</td><td class="fw-600">₹${inv.total}</td>
        <td><span class="chip ${chipClass(inv.payStatus)}">${inv.payStatus}</span></td>
        <td><button class="btn-sm btn-teal" onclick="openReceiptModal('${inv.id}')">Receipt</button></td>
      </tr>`).join('')}</tbody></table>
    </div>
    <p class="fs-sm text-muted mt-16">Note: Diagnosis and clinical notes are not available in billing view.</p>`;
}

function openReceiptModal(invId) {
  const inv = INVOICES.find(i => i.id === invId);
  if (!inv) return;
  openModal(`
    <div class="receipt-layout">
      <h3>CityMed Clinic</h3>
      <p style="color:#666;font-size:0.8rem;margin-bottom:16px">42 MG Road, Bengaluru 560001</p>
      <table><tr><td><strong>Invoice:</strong></td><td>${inv.id}</td></tr><tr><td><strong>Patient:</strong></td><td>${inv.patient}</td></tr><tr><td><strong>Date:</strong></td><td>${inv.date}</td></tr></table>
      <hr style="margin:12px 0;border-color:#ddd">
      <table>${inv.services.map(s => `<tr><td>${s}</td><td style="text-align:right">₹${inv.fee/inv.services.length}</td></tr>`).join('')}
      <tr><td>Tax (GST)</td><td style="text-align:right">₹${inv.tax}</td></tr>
      <tr class="total"><td><strong>Total</strong></td><td style="text-align:right"><strong>₹${inv.total}</strong></td></tr></table>
      <p style="text-align:center;margin-top:20px;color:#999;font-size:0.75rem">Thank you for choosing CityMed Clinic</p>
    </div>
    <button class="btn-primary mt-16" onclick="toast('Receipt sent to printer','success')">Print Receipt</button>
  `);
}

// ========== ADMIN DASHBOARD ==========
function renderAdminOverview(p) {
  const todayApts = APPOINTMENTS.filter(a => a.date === '2026-04-07');
  const activeDocs = STAFF.filter(s => s.role === 'doctor' && s.status === 'active').length;

  // Weekly appointment data
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weekData = days.map(d => ({ day: d, val: 0, color: 'var(--teal)' }));
  
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  
  APPOINTMENTS.forEach(a => {
    const ad = new Date(a.date);
    if (ad >= oneWeekAgo && ad <= now && a.status !== 'cancelled') {
      const di = ad.getDay();
      weekData[di].val++;
    }
  });

  // Provide fallback if no recent data (for demo purposes)
  if(weekData.reduce((s, d) => s + d.val, 0) === 0) {
     weekData[1].val = 18; weekData[2].val = 24; weekData[3].val = 21; 
     weekData[4].val = 28; weekData[5].val = 32; weekData[6].val = 15; weekData[0].val = 7;
  }

  // Shift to Mon-Sun
  const sun = weekData.shift(); 
  weekData.push(sun);
  
  const maxVal = Math.max(...weekData.map(d => d.val), 5);
  weekData.forEach(d => d.color = d.val >= (maxVal * 0.8) ? 'var(--violet)' : 'var(--teal)');

  // Revenue breakdown
  const revSegs = [
    { label: 'Consultations', val: 0, color: 'var(--teal)' },
    { label: 'Lab Tests', val: 0, color: 'var(--violet)' },
    { label: 'Pharmacy', val: 0, color: 'var(--amber)' },
    { label: 'Procedures', val: 0, color: 'var(--coral)' }
  ];
  const last30Days = new Date();
  last30Days.setDate(now.getDate() - 30);
  
  INVOICES.forEach(i => {
    // Assuming invoices don't have explicit date in mock yet, defaulting to recent
    const idat = new Date(i.date || '2026-04-06');
    if (idat >= last30Days) {
      i.services.forEach(s => {
        if (s.includes('Consultation')) revSegs[0].val += i.fee;
        else if (s.includes('Test') || s.includes('ECG') || s.includes('Scan') || s === 'Lab') revSegs[1].val += i.fee;
        else if (s.includes('Medicine') || s.includes('Pharmacy')) revSegs[2].val += i.fee;
        else revSegs[3].val += i.fee;
      });
    }
  });

  // Fallback for visual demo if calculation is empty
  if (revSegs.reduce((s, r) => s + r.val, 0) === 0) {
    revSegs[0].val = 142000; revSegs[1].val = 68000; revSegs[2].val = 45500; revSegs[3].val = 29000;
  }

  const totalRev = revSegs.reduce((s, r) => s + r.val, 0);
  revSegs.forEach(r => r.pct = (r.val / totalRev) * 100);
  const donutCirc = 2 * Math.PI * 45;

  // Build donut segments
  let donutOffset = 0;
  const donutPaths = revSegs.map(seg => {
    const segLen = (seg.pct / 100) * donutCirc;
    const gap = 4;
    const html = `<circle class="donut-segment" cx="65" cy="65" r="45" stroke="${seg.color}" stroke-dasharray="${segLen - gap} ${donutCirc - segLen + gap}" stroke-dashoffset="${-donutOffset}" />`;
    donutOffset += segLen;
    return html;
  }).join('');

  // Activity feed
  const activities = [
    { dot: 'green', text: '<strong>Dr. Priya Sharma</strong> completed appointment with Meera Nair', time: '2 min ago' },
    { dot: 'teal', text: '<strong>Sneha Patil</strong> checked in Ravi Kumar (Token 19)', time: '8 min ago' },
    { dot: 'amber', text: '<strong>Rahul Verma</strong> dispensed prescription RX-5003', time: '14 min ago' },
    { dot: 'violet', text: 'New patient <strong>Deepak Gupta</strong> registered via portal', time: '22 min ago' },
    { dot: 'coral', text: '<strong>Ankit Patel</strong> marked as no-show for Token 21', time: '31 min ago' },
    { dot: 'green', text: '<strong>Dr. Kavita Rao</strong> logged in for morning shift', time: '45 min ago' },
    { dot: 'teal', text: 'System backup completed successfully', time: '1 hr ago' },
  ];

  p.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card teal stagger-1">
        <div class="stat-label">Total Patients</div>
        <div class="stat-value" data-count="1247">0</div>
        <div class="stat-trend up">↑ 12% <span style="font-weight:400;opacity:0.7">vs last month</span></div>
      </div>
      <div class="stat-card violet stagger-2">
        <div class="stat-label">Appointments Today</div>
        <div class="stat-value" data-count="${todayApts.length}">0</div>
        <div class="stat-trend up">↑ 5%</div>
      </div>
      <div class="stat-card green stagger-3">
        <div class="stat-label">Active Doctors</div>
        <div class="stat-value" data-count="${activeDocs}">0</div>
        <div class="stat-trend flat">— steady</div>
      </div>
      <div class="stat-card amber stagger-4">
        <div class="stat-label">Revenue This Month</div>
        <div class="stat-value" data-count="284500">0</div>
        <div class="stat-trend up">↑ 18% <span style="font-weight:400;opacity:0.7">₹ value</span></div>
      </div>
    </div>

    <div class="perf-row">
      <div class="perf-meter">
        <div class="perf-label">Completion Rate</div>
        <div class="perf-value" style="color:var(--green)" data-count="94">0</div>
        <div class="fs-sm text-muted">%</div>
      </div>
      <div class="perf-meter">
        <div class="perf-label">Avg Wait Time</div>
        <div class="perf-value" style="color:var(--amber)" data-count="12">0</div>
        <div class="fs-sm text-muted">minutes</div>
      </div>
      <div class="perf-meter">
        <div class="perf-label">Patient Satisfaction</div>
        <div class="perf-value" style="color:var(--teal)" data-count="4.6">0</div>
        <div class="fs-sm text-muted">/ 5.0</div>
      </div>
      <div class="perf-meter">
        <div class="perf-label">No-Show Rate</div>
        <div class="perf-value" style="color:var(--coral)" data-count="8">0</div>
        <div class="fs-sm text-muted">%</div>
      </div>
    </div>

    <div class="dash-grid-2">
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title">Appointments This Week</div>
          <div class="chart-legend"><span><div class="dot" style="background:var(--teal)"></div>Normal</span><span><div class="dot" style="background:var(--violet)"></div>Peak</span></div>
        </div>
        <div class="bar-chart" id="adminBarChart">
          ${weekData.map(d => `<div class="bar-col">
            <div class="bar-fill" style="height:0;background:${d.color}" data-h="${(d.val / maxVal) * 100}%">
              <div class="bar-tooltip">${d.val} appointments</div>
            </div>
            <div class="bar-label">${d.day}</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title">Revenue Breakdown</div>
        </div>
        <div class="donut-wrap">
          <div class="donut-chart">
            <svg viewBox="0 0 130 130">${donutPaths}</svg>
            <div class="donut-center">
              <div class="donut-total">₹${(totalRev/1000).toFixed(0)}K</div>
              <div class="donut-sub">this month</div>
            </div>
          </div>
          <div class="donut-legend">
            ${revSegs.map(s => `<div class="donut-legend-item"><div class="dot" style="background:${s.color}"></div><span>${s.label}</span><span class="dl-val">₹${(s.val/1000).toFixed(0)}K</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="dash-grid-3">
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title">Department Performance</div>
        </div>
        <div class="data-card" style="overflow-x:auto;background:transparent;border:none;padding:0">
          <table class="data-table">
            <thead><tr><th>Department</th><th>Patients</th><th>Revenue</th><th>Satisfaction</th><th>Load</th></tr></thead>
            <tbody>
              <tr><td class="fw-600">General Medicine</td><td>423</td><td>₹84,600</td><td><span class="chip chip-green">4.7</span></td><td><div class="progress-bar" style="max-width:120px;display:inline-block;width:120px"><div class="progress-fill" style="width:78%"></div></div></td></tr>
              <tr><td class="fw-600">Dermatology</td><td>187</td><td>₹52,400</td><td><span class="chip chip-green">4.5</span></td><td><div class="progress-bar" style="max-width:120px;display:inline-block;width:120px"><div class="progress-fill" style="width:62%"></div></div></td></tr>
              <tr><td class="fw-600">Cardiology</td><td>134</td><td>₹96,200</td><td><span class="chip chip-teal">4.8</span></td><td><div class="progress-bar" style="max-width:120px;display:inline-block;width:120px"><div class="progress-fill" style="width:91%"></div></div></td></tr>
              <tr><td class="fw-600">Pediatrics</td><td>98</td><td>₹31,300</td><td><span class="chip chip-amber">4.2</span></td><td><div class="progress-bar" style="max-width:120px;display:inline-block;width:120px"><div class="progress-fill" style="width:45%"></div></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="chart-container" style="align-self:start">
        <div class="chart-header">
          <div class="chart-title">Live Activity</div>
          <div class="pulse-dot"></div>
        </div>
        <div class="activity-feed">
          ${activities.map((a, i) => `<div class="activity-item" style="animation-delay:${i * 0.06}s">
            <div class="activity-dot ${a.dot}"></div>
            <div class="activity-body">
              <div>${a.text}</div>
              <div class="activity-time">${a.time}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;

  // Animate countUp
  setTimeout(() => {
    p.querySelectorAll('.stat-value[data-count]').forEach(el => countUp(el, +el.dataset.count));
    p.querySelectorAll('.perf-value[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      if (Number.isInteger(target)) countUp(el, target);
      else { el.textContent = target; }
    });
  }, 100);

  // Animate bar chart
  setTimeout(() => {
    p.querySelectorAll('.bar-fill[data-h]').forEach(b => { b.style.height = b.dataset.h; });
  }, 200);
}

function renderAdminStaff(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Staff Management</h3><button class="btn-sm btn-teal" onclick="toast('Add staff form coming soon','info')">${IC.plus} Add Staff</button></div>
    <div class="data-card" style="overflow-x:auto">
      <table class="data-table"><thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
      <tbody>${STAFF.map(s => `<tr><td class="fw-600">${s.name}</td><td><span class="chip ${chipClass(s.role==='doctor'?'confirmed':'pending')}">${s.role}</span></td><td><span class="chip ${chipClass(s.status)}">${s.status}</span></td></tr>`).join('')}</tbody></table>
    </div>`;
}

function renderAdminAudit(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Consent & Audit Log</h3></div>
    <div class="filter-bar mb-16"><select id="auditRoleFilter"><option value="">All Roles</option><option>patient</option><option>doctor</option><option>pharmacist</option><option>receptionist</option></select><input type="date" id="auditDateFilter"></div>
    <div class="timeline" id="auditTimeline">${renderAuditItems(S.auditLog)}</div>`;
  const rf = document.getElementById('auditRoleFilter');
  const df = document.getElementById('auditDateFilter');
  const update = () => {
    let items = S.auditLog;
    if (rf.value) items = items.filter(i => i.role === rf.value);
    if (df.value) items = items.filter(i => i.ts.startsWith(df.value));
    document.getElementById('auditTimeline').innerHTML = renderAuditItems(items);
  };
  rf?.addEventListener('change', update);
  df?.addEventListener('change', update);
}

function renderAuditItems(items) {
  return items.map(i => {
    const cls = i.type === 'consent-captured' ? 'consent-captured' : i.type === 'consent-revoked' ? 'consent-revoked' : '';
    const tagCls = { READ:'read', WRITE:'write', DISPENSE:'dispense', LOGIN:'login', CONSENT:'write' }[i.action] || 'login';
    return `<div class="timeline-item ${cls}">
      <div class="tl-time">${i.ts}</div>
      <div class="tl-body"><div class="tl-action">${i.user} <span class="tl-tag ${tagCls}">${i.action}</span></div><div class="tl-detail">${i.purpose} ${i.pid!=='—'?'· Patient: '+i.pid:''}</div></div>
    </div>`;
  }).join('');
}

function renderAdminSettings(p) {
  p.innerHTML = `
    <div class="section-header"><h3 class="section-title">Clinic Settings</h3></div>
    <div class="data-card settings-form">
      <div class="floating-input"><input value="${CLINIC.name}" placeholder=" "><label>Clinic Name</label></div>
      <div class="floating-input"><input value="${CLINIC.address}" placeholder=" "><label>Address</label></div>
      <div class="floating-input"><input value="${CLINIC.hours}" placeholder=" "><label>Working Hours</label></div>
      <div class="floating-input"><input type="number" value="${CLINIC.feeDefault}" placeholder=" "><label>Default Consultation Fee (₹)</label></div>
      <button class="btn-primary" style="max-width:200px" onclick="toast('Settings saved','success')">Save Changes</button>
    </div>`;
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initLogin();

  // Modal close handlers
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', e => { if (e.target === $('#modalOverlay')) closeModal(); });

  // Logout
  $('#logoutBtn').addEventListener('click', logout);

  // Session restore
  if (S.role && S.user) {
    enterApp();
  }
});
