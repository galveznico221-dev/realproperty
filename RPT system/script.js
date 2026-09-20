/* ============================================================
   RPT SYSTEM — TREASURER'S OFFICE
   LGU Talisay, Camarines Norte
   Transaction Encoding Interface
   ============================================================ */

'use strict';

/* ============================================================
   1. MASTER DATA — per Section VI-A-3 of the proposal
   ============================================================ */
const MASTER_DATA = {
  basicRate:       0.01,   // Provincial Basic Rate (1%)
  sefRate:         0.01,   // Special Education Fund rate
  discountAdvance: 0.20,   // 20% — paid before start of tax year
  discountQ1:      0.10,   // 10% — paid Jan to Mar
  penaltyPerMonth: 0.02,   // 2% per month, April to December
  penaltyStartMonth: 4,    // April
  penaltyEndMonth:  12     // December
};

const CURRENT_YEAR = new Date().getFullYear();

/* ============================================================
   2. SEED DATA
   ============================================================ */
const PROPERTIES = [
  { pin:'002-040',  owner:'TIMONER Y RAMOS, LOURDES C.',
    spouseRelatives:['TIMONER, RICARDO S. (Spouse)'],
    address:'Brgy. Binanuaan, Talisay, Camarines Norte',
    location:'Brgy. Binanuaan (Lot 14, Cad-291-D)', area:'5,000 sqm', kind:'Agricultural Land', cd1:'A-1',
    barangay:'Binanuaan', classification:'Agricultural',
    fairMarketValue:480000, assessmentLevel:0.40, taxExempt:false, remarks:'' },

  { pin:'002-0021', owner:'DELA CRUZ, MARIA L.',
    spouseRelatives:['DELA CRUZ, JUAN P. (Spouse)'],
    address:'Brgy. San Isidro, Talisay, Camarines Norte',
    location:'Brgy. San Isidro (Lot 7, Blk 2)', area:'350 sqm', kind:'Residential Land & Bldg.', cd1:'R-1',
    barangay:'San Isidro', classification:'Residential',
    fairMarketValue:1200000, assessmentLevel:0.20, taxExempt:false, remarks:'' },

  { pin:'002-0028', owner:'REYES, ANTONIO B.',
    spouseRelatives:[],
    address:'Brgy. Poblacion, Talisay, Camarines Norte',
    location:'Brgy. Poblacion (Lot 3, Blk 5)', area:'620 sqm', kind:'Commercial Land & Bldg.', cd1:'C-1',
    barangay:'Poblacion', classification:'Commercial',
    fairMarketValue:3500000, assessmentLevel:0.50, taxExempt:false, remarks:'' },

  { pin:'002-0018', owner:'RAMOS, JOSEFINA M.',
    spouseRelatives:['RAMOS, PEDRO T. (Spouse)'],
    address:'Brgy. Fabrica, Talisay, Camarines Norte',
    location:'Brgy. Fabrica (Lot 9)', area:'480 sqm', kind:'Residential Land & Bldg.', cd1:'R-2',
    barangay:'Fabrica', classification:'Residential',
    fairMarketValue:850000, assessmentLevel:0.20, taxExempt:false, remarks:'' },

  { pin:'002-0035', owner:'SANGGUNIANG BARANGAY NG POBLACION',
    spouseRelatives:[],
    address:'Brgy. Poblacion, Talisay, Camarines Norte',
    location:'Brgy. Poblacion (Barangay Hall Site)', area:'900 sqm', kind:'Government Bldg.', cd1:'SP-1',
    barangay:'Poblacion', classification:'Special/Exempt',
    fairMarketValue:2000000, assessmentLevel:0.00, taxExempt:true,
    remarks:'Barangay Hall — tax-exempt under RA 7160' },

  { pin:'002-0042', owner:'PARISH OF ST. JOHN THE BAPTIST',
    spouseRelatives:[],
    address:'Brgy. Poblacion, Talisay, Camarines Norte',
    location:'Brgy. Poblacion (Church Compound)', area:'1,500 sqm', kind:'Religious Land & Bldg.', cd1:'SP-2',
    barangay:'Poblacion', classification:'Special/Exempt',
    fairMarketValue:4500000, assessmentLevel:0.00, taxExempt:true,
    remarks:'Church — tax-exempt under RA 7160' },

  { pin:'002-0051', owner:'GARCIA, ROBERTO S.',
    spouseRelatives:['GARCIA, ELENA V. (Spouse)'],
    address:'Brgy. Binanuaan, Talisay, Camarines Norte',
    location:'Brgy. Binanuaan (Lot 21)', area:'3,000 sqm', kind:'Industrial Land & Bldg.', cd1:'I-1',
    barangay:'Binanuaan', classification:'Industrial',
    fairMarketValue:6200000, assessmentLevel:0.50, taxExempt:false, remarks:'' },

  { pin:'002-0063', owner:'MENDOZA, CARMEN D.',
    spouseRelatives:[],
    address:'Brgy. San Isidro, Talisay, Camarines Norte',
    location:'Brgy. San Isidro (Lot 33, Cad-291)', area:'4,200 sqm', kind:'Agricultural Land', cd1:'A-2',
    barangay:'San Isidro', classification:'Agricultural',
    fairMarketValue:320000, assessmentLevel:0.40, taxExempt:false, remarks:'' },

  { pin:'002-0074', owner:'DELA CRUZ, MARIA L.',
    spouseRelatives:['DELA CRUZ, JUAN P. (Spouse)'],
    address:'Brgy. Poblacion, Talisay, Camarines Norte',
    location:'Brgy. Poblacion (Lot 11, Blk 4)', area:'540 sqm', kind:'Commercial Land & Bldg.', cd1:'C-2',
    barangay:'Poblacion', classification:'Commercial',
    fairMarketValue:1800000, assessmentLevel:0.50, taxExempt:false, remarks:'' },

  { pin:'002-0088', owner:'GARCIA, ROBERTO S.',
    spouseRelatives:['GARCIA, ELENA V. (Spouse)'],
    address:'Brgy. Fabrica, Talisay, Camarines Norte',
    location:'Brgy. Fabrica (Lot 18)', area:'2,800 sqm', kind:'Agricultural Land', cd1:'A-3',
    barangay:'Fabrica', classification:'Agricultural',
    fairMarketValue:950000, assessmentLevel:0.40, taxExempt:false, remarks:'' }
];

let PAYMENTS = [
  { or:'2026-0001', date:'2026-01-15', pin:'002-0021', taxpayer:'DELA CRUZ, MARIA L.',
    year:2026, basic:2400, sef:2400, discount:480, penalty:0, total:4320,
    encodedBy:'Treasurer IT Staff', remarks:'Paid in advance — Q1 discount' },
  { or:'2026-0002', date:'2026-02-20', pin:'002-0028', taxpayer:'REYES, ANTONIO B.',
    year:2026, basic:17500, sef:17500, discount:3500, penalty:0, total:31500,
    encodedBy:'Treasurer IT Staff', remarks:'Paid within Q1 — 10% discount' },
  { or:'2026-0003', date:'2026-06-10', pin:'002-0018', taxpayer:'RAMOS, JOSEFINA M.',
    year:2026, basic:1700, sef:1700, discount:0, penalty:306, total:3706,
    encodedBy:'Treasurer IT Staff', remarks:'June payment — 3 months penalty' }
];

let AUDIT_LOG = [
  { ts:'2026-01-15 09:12', user:'treasurer', action:'PAYMENT_RECORDED',
    ref:'OR 2026-0001', remarks:'Advance payment — 20% discount applied' },
  { ts:'2026-02-20 14:05', user:'treasurer', action:'PAYMENT_RECORDED',
    ref:'OR 2026-0002', remarks:'Q1 payment — 10% discount applied' },
  { ts:'2026-06-10 10:41', user:'treasurer', action:'PAYMENT_RECORDED',
    ref:'OR 2026-0003', remarks:'June payment — 2% × 3 months penalty' }
];

/* ============================================================
   3. UTILITIES
   ============================================================ */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const peso = n => '₱' + Number(n || 0).toLocaleString('en-PH',
  { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const peso0 = n => '₱' + Number(n || 0).toLocaleString('en-PH',
  { maximumFractionDigits: 0 });

function esc(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-show'), 2800);
}

function nowStamp(){
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ` +
         `${p(d.getHours())}:${p(d.getMinutes())}`;
}

function todayISO(){
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}

function pushAudit(action, ref, remarks){
  AUDIT_LOG.unshift({ ts: nowStamp(), user: state.user || 'treasurer', action, ref, remarks });
  renderAudit();
}

function nextOR(){
  const yr = new Date().getFullYear();
  const seq = PAYMENTS.filter(p => String(p.or).startsWith(String(yr))).length + 1;
  return `${yr}-${String(seq).padStart(4, '0')}`;
}

/* ============================================================
   4. APP STATE
   ============================================================ */
const state = {
  user: null,
  view: 'dashboard',
  selectedPin: null,
  currentSOA: null,
  lastReceipt: null
};

const PAGE_META = {
  dashboard:   ['Dashboard', 'Collection monitoring & transaction encoding'],
  search:      ['Property & Taxpayer Search', 'Search PIN, owner, spouse or relative'],
  transaction: ['Statement of Account', 'Request form and automated tax computation'],
  collections: ['Collections', 'All recorded payments and official receipts'],
  reports:     ['Reports', 'Certified lists, RPT register, notices, and certifications'],
  audit:       ['Audit Trail', 'Remarks and change history'],
  uiflow:      ['UI Flow', 'Proposed user interface flow and wireframe']
};

/* ============================================================
   5. TAX COMPUTATION ENGINE
   ============================================================ */
function computeTax(property, paymentDate, taxYear){
  if (property.taxExempt){
    return {
      exempt:true, assessedValue:0, basic:0, sef:0,
      discountRate:0, discount:0, discountLabel:'Tax-exempt',
      penaltyMonths:0, penaltyRate:0, penalty:0, penaltyLabel:'—',
      total:0, paymentDate, taxYear
    };
  }

  const d = new Date(paymentDate + 'T00:00:00');
  const payMonth = d.getMonth() + 1;
  const payYear  = d.getFullYear();

  const assessedValue = property.fairMarketValue * property.assessmentLevel;
  const basic = assessedValue * MASTER_DATA.basicRate;
  const sef   = assessedValue * MASTER_DATA.sefRate;

  let discountRate = 0;
  let discountLabel = 'No discount';
  if (payYear < taxYear){
    discountRate = MASTER_DATA.discountAdvance;
    discountLabel = '20% advance payment';
  } else if (payYear === taxYear && payMonth <= 3){
    discountRate = MASTER_DATA.discountQ1;
    discountLabel = '10% (paid Jan–Mar)';
  }
  const discount = (basic + sef) * discountRate;

  let penaltyMonths = 0;
  if (payYear > taxYear){
    penaltyMonths = 9;
  } else if (payYear === taxYear && payMonth >= MASTER_DATA.penaltyStartMonth){
    penaltyMonths = Math.min(payMonth - MASTER_DATA.penaltyStartMonth + 1, 9);
  }
  const penaltyRate = penaltyMonths * MASTER_DATA.penaltyPerMonth;
  const penalty = basic * penaltyRate;
  const penaltyLabel = penaltyMonths
    ? `${penaltyMonths} month${penaltyMonths > 1 ? 's' : ''} × 2%`
    : 'None';

  const total = basic + sef - discount + penalty;

  return {
    exempt:false, assessedValue, basic, sef,
    discountRate, discount, discountLabel,
    penaltyMonths, penaltyRate, penalty, penaltyLabel,
    total, paymentDate, taxYear
  };
}

/* ============================================================
   6. LOGIN
   ============================================================ */
const DEMO_USERS = {
  treasurer: { password:'talisay123', name:'Treasurer IT Staff' }
};

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = $('#loginUser').value.trim().toLowerCase();
  const p = $('#loginPass').value;
  const err = $('#loginError');

  if (!u || !p){
    err.textContent = 'Please enter both username and password.';
    err.hidden = false;
    return;
  }
  const acct = DEMO_USERS[u];
  if (!acct || acct.password !== p){
    err.textContent = 'Invalid username or password. Please try again.';
    err.hidden = false;
    $('#loginPass').value = '';
    $('#loginPass').focus();
    return;
  }

  err.hidden = true;
  state.user = u;
  $('#userName').textContent = acct.name;
  $('#userAvatar').textContent = acct.name.charAt(0).toUpperCase();

  $('#loginScreen').classList.add('is-hidden');
  $('#app').classList.remove('is-hidden');

  initApp();
  toast(`Welcome, ${acct.name}`);
});

$('#togglePass').addEventListener('click', () => {
  const inp = $('#loginPass');
  const btn = $('#togglePass');
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.textContent = show ? 'Hide' : 'Show';
  btn.setAttribute('aria-pressed', String(show));
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

$('#btnLogout').addEventListener('click', () => {
  if (!confirm('Sign out of the Treasurer\'s Office interface?')) return;
  location.reload();
});

/* ============================================================
   7. NAVIGATION
   ============================================================ */
function setView(name){
  state.view = name;

  $$('.view').forEach(v => v.classList.remove('is-active'));
  const target = $('#view-' + name);
  if (target) target.classList.add('is-active');

  $$('.nav__item').forEach(b => {
    const on = b.dataset.view === name;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-current', on ? 'page' : 'false');
  });

  const [title, sub] = PAGE_META[name] || ['', ''];
  $('#pageTitle').textContent = title;
  $('#pageSub').textContent = sub;
  document.title = `${title} — RPT System | LGU Talisay`;

  if (window.innerWidth <= 900) $('#sidebar').classList.add('is-collapsed');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav__item');
  if (!btn) return;
  setView(btn.dataset.view);
});

document.addEventListener('click', e => {
  const goto = e.target.closest('[data-goto]');
  if (goto) setView(goto.dataset.goto);
});

$('#menuToggle').addEventListener('click', () => {
  const sb = $('#sidebar');
  sb.classList.toggle('is-collapsed');
  $('#menuToggle').setAttribute('aria-expanded',
    String(!sb.classList.contains('is-collapsed')));
});

/* ============================================================
   8. CLOCK
   ============================================================ */
function tickClock(){
  const d = new Date();
  const opts = { weekday:'short', month:'short', day:'numeric' };
  $('#clock').textContent =
    d.toLocaleDateString('en-PH', opts) + ' · ' +
    d.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' });
}
setInterval(tickClock, 1000);
tickClock();

/* ============================================================
   9. DASHBOARD
   ============================================================ */
function renderStats(){
  const today = todayISO().slice(0, 10);
  const todayTotal = PAYMENTS
    .filter(p => p.date === today)
    .reduce((s, p) => s + p.total, 0);

  const yearTotal = PAYMENTS
    .filter(p => p.year === CURRENT_YEAR)
    .reduce((s, p) => s + p.total, 0);

  const taxable = PROPERTIES.filter(p => !p.taxExempt);
  const unpaid = taxable.filter(p =>
    !PAYMENTS.some(pay => pay.pin === p.pin && pay.year === CURRENT_YEAR));

  const stats = [
    { label:"Today's Collections", value: peso(todayTotal),
      sub: today, cls:'stat--green' },
    { label:`Collections ${CURRENT_YEAR}`, value: peso(yearTotal),
      sub: `${PAYMENTS.filter(p => p.year === CURRENT_YEAR).length} transactions`, cls:'stat--blue' },
    { label:'Taxable Properties', value: taxable.length.toLocaleString(),
      sub: `${PROPERTIES.length} total records`, cls:'stat--gold' },
    { label:'Delinquent Accounts', value: unpaid.length.toLocaleString(),
      sub:'No payment for current year', cls:'stat--red' }
  ];

  $('#statCards').innerHTML = stats.map(s => `
    <div class="stat ${s.cls}">
      <div class="stat__label">${esc(s.label)}</div>
      <div class="stat__value">${esc(s.value)}</div>
      <div class="stat__sub">${esc(s.sub)}</div>
    </div>`).join('');
}

function renderRecent(){
  const rows = [...PAYMENTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  $('#recentTable').innerHTML = rows.length
    ? rows.map(p => `
        <tr>
          <td class="mono">${esc(p.or)}</td>
          <td>${esc(p.date)}</td>
          <td class="mono">${esc(p.pin)}</td>
          <td>${esc(p.taxpayer)}</td>
          <td class="ta-r"><b>${peso(p.total)}</b></td>
        </tr>`).join('')
    : `<tr><td colspan="5" class="empty">No transactions recorded yet.</td></tr>`;
}

function renderBarangayChart(){
  const totals = {};
  PAYMENTS.forEach(p => {
    const prop = PROPERTIES.find(x => x.pin === p.pin);
    const brgy = prop ? prop.barangay : 'Unassigned';
    totals[brgy] = (totals[brgy] || 0) + p.total;
  });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!entries.length){
    $('#barangayChart').innerHTML =
      '<div class="empty">No collection data available.</div>';
    return;
  }

  const max = Math.max(...entries.map(e => e[1]));
  $('#barangayChart').innerHTML = entries.map(([brgy, amt]) => `
    <div class="chart__row">
      <span>${esc(brgy)}</span>
      <div class="chart__bar">
        <div class="chart__fill" style="width:${(amt / max) * 100}%"></div>
      </div>
      <span class="chart__val">${peso0(amt)}</span>
    </div>`).join('');
}

function renderDelinquent(){
  $('#delinquentYearLabel').textContent = `Tax Year ${CURRENT_YEAR}`;

  const today = todayISO();
  const rows = PROPERTIES
    .filter(p => !p.taxExempt)
    .filter(p => !PAYMENTS.some(pay => pay.pin === p.pin && pay.year === CURRENT_YEAR))
    .map(p => {
      const c = computeTax(p, today, CURRENT_YEAR);
      return { p, c };
    });

  $('#delinquentTable').innerHTML = rows.length
    ? rows.map(({ p, c }) => `
        <tr>
          <td class="mono">${esc(p.pin)}</td>
          <td>${esc(p.owner)}</td>
          <td>${esc(p.barangay)}</td>
          <td>${esc(p.classification)}</td>
          <td class="ta-r">${peso(c.assessedValue)}</td>
          <td class="ta-r"><b>${peso(c.total)}</b></td>
          <td><span class="badge badge--unpaid">UNPAID</span></td>
        </tr>`).join('')
    : `<tr><td colspan="7" class="empty">All taxable properties have recorded payments. 🎉</td></tr>`;
}

/* ============================================================
   10. SEARCH
   ============================================================ */
function populateFilters(){
  const brgys = [...new Set(PROPERTIES.map(p => p.barangay))].sort();
  const classes = [...new Set(PROPERTIES.map(p => p.classification))].sort();

  $('#filterBarangay').innerHTML =
    '<option value="">All Barangays</option>' +
    brgys.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');

  $('#filterClass').innerHTML =
    '<option value="">All Classifications</option>' +
    classes.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
}

function getFilteredProperties(){
  const q = $('#searchInput').value.trim().toLowerCase();
  const brgy = $('#filterBarangay').value;
  const cls = $('#filterClass').value;
  const exemptOnly = $('#filterExempt').checked;

  return PROPERTIES.filter(p => {
    if (brgy && p.barangay !== brgy) return false;
    if (cls && p.classification !== cls) return false;
    if (exemptOnly && !p.taxExempt) return false;

    if (!q) return true;
    const haystack = [
      p.pin, p.owner, p.address, p.barangay, p.classification,
      ...(p.spouseRelatives || [])
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function renderSearch(){
  const list = getFilteredProperties();
  $('#searchCount').textContent = `${list.length} record${list.length !== 1 ? 's' : ''}`;

  $('#searchTable').innerHTML = list.length
    ? list.map(p => {
        const av = p.fairMarketValue * p.assessmentLevel;
        const status = p.taxExempt
          ? '<span class="badge badge--exempt">EXEMPT</span>'
          : '<span class="badge badge--unpaid">TAXABLE</span>';
        return `
          <tr data-pin="${esc(p.pin)}" class="${state.selectedPin === p.pin ? 'is-selected' : ''}"
              tabindex="0" role="button" aria-label="View record for ${esc(p.owner)}">
            <td class="mono">${esc(p.pin)}</td>
            <td>${esc(p.owner)}</td>
            <td>${esc(p.barangay)}</td>
            <td>${esc(p.classification)}</td>
            <td class="ta-r">${peso0(av)}</td>
            <td>${status}</td>
          </tr>`;
      }).join('')
    : `<tr><td colspan="6" class="empty">No records match your search.</td></tr>`;
}

function findOwnerGroup(prop){
  const key = prop.owner.toUpperCase();
  const relatives = (prop.spouseRelatives || []).map(r => r.toUpperCase());

  return PROPERTIES.filter(p => {
    if (p.pin === prop.pin) return false;
    if (p.owner.toUpperCase() === key) return true;
    return (p.spouseRelatives || []).some(r =>
      relatives.includes(r.toUpperCase()) || r.toUpperCase() === key);
  });
}

function renderDetail(pin){
  const p = PROPERTIES.find(x => x.pin === pin);
  if (!p){
    $('#detailPanel').innerHTML = '<div class="empty">Record not found.</div>';
    return;
  }
  state.selectedPin = pin;

  const today = todayISO();
  const c = computeTax(p, today, CURRENT_YEAR);
  const linked = findOwnerGroup(p);
  const av = p.fairMarketValue * p.assessmentLevel;

  $('#detailPanel').innerHTML = `
    <div class="detail">
      <h4>Property Record</h4>
      <dl class="dl">
        <dt>PIN</dt><dd class="mono">${esc(p.pin)}</dd>
        <dt>Owner</dt><dd>${esc(p.owner)}</dd>
        <dt>Address</dt><dd>${esc(p.address)}</dd>
        <dt>Barangay</dt><dd>${esc(p.barangay)}</dd>
        <dt>Classification</dt><dd>${esc(p.classification)}</dd>
      </dl>
      ${(p.spouseRelatives || []).length ? `
        <div class="owner-chips">
          ${p.spouseRelatives.map(r => `<span class="chip">${esc(r)}</span>`).join('')}
        </div>` : ''}
    </div>

    <div class="detail">
      <h4>Assessment (from Assessor's Office)</h4>
      <dl class="dl">
        <dt>Fair Market Value</dt><dd>${peso(p.fairMarketValue)}</dd>
        <dt>Assessment Level</dt><dd>${(p.assessmentLevel * 100).toFixed(0)}%</dd>
        <dt>Assessed Value</dt><dd><b>${peso(av)}</b></dd>
      </dl>
      ${p.remarks ? `<p class="muted small" style="margin-top:10px">${esc(p.remarks)}</p>` : ''}
    </div>

    <div class="detail">
      <h4>Computed Tax — ${CURRENT_YEAR}</h4>
      ${c.exempt
        ? `<div class="soa__exempt" style="margin:0">This property is <b>tax-exempt</b>. No tax is due.</div>`
        : `<dl class="dl">
            <dt>Basic RPT Tax</dt><dd>${peso(c.basic)}</dd>
            <dt>SEF Tax</dt><dd>${peso(c.sef)}</dd>
            <dt>Penalty (${esc(c.penaltyLabel)})</dt><dd>${peso(c.penalty)}</dd>
           </dl>
           <div class="comp-row comp-row--total" style="margin-top:10px">
             <span>Total Tax Due</span><span>${peso(c.total)}</span>
           </div>`}
    </div>

    ${linked.length ? `
      <div class="detail">
        <h4>Other Properties Under This Owner / Relative (${linked.length})</h4>
        <div class="linked-list">
          ${linked.map(l => `
            <div class="linked-item" data-pin="${esc(l.pin)}" tabindex="0" role="button">
              <div>
                <b>${esc(l.owner)}</b>
                <span class="mono">${esc(l.pin)} · ${esc(l.barangay)}</span>
              </div>
              <span class="badge ${l.taxExempt ? 'badge--exempt' : 'badge--unpaid'}">
                ${l.taxExempt ? 'EXEMPT' : 'TAXABLE'}
              </span>
            </div>`).join('')}
        </div>
      </div>` : ''}

    <div class="btn-row">
      <button class="btn btn--primary btn--sm" data-goto="transaction">Open in SOA Form</button>
    </div>
  `;

  // re-render selection highlight
  $$('#searchTable tr').forEach(tr =>
    tr.classList.toggle('is-selected', tr.dataset.pin === pin));

  // linked-item click
  $$('#detailPanel .linked-item').forEach(el => {
    el.addEventListener('click', () => {
      renderDetail(el.dataset.pin);
      const row = document.querySelector(`#searchTable tr[data-pin="${el.dataset.pin}"]`);
      if (row) row.scrollIntoView({ block:'nearest', behavior:'smooth' });
    });
  });
}

$('#searchTable').addEventListener('click', e => {
  const tr = e.target.closest('tr[data-pin]');
  if (tr) renderDetail(tr.dataset.pin);
});
$('#searchTable').addEventListener('keydown', e => {
  const tr = e.target.closest('tr[data-pin]');
  if (tr && (e.key === 'Enter' || e.key === ' ')){
    e.preventDefault();
    renderDetail(tr.dataset.pin);
  }
});

['#searchInput', '#filterBarangay', '#filterClass', '#filterExempt']
  .forEach(sel => {
    $(sel).addEventListener('input', renderSearch);
    $(sel).addEventListener('change', renderSearch);
  });

/* ============================================================
   11. TRANSACTION / SOA FORM
   ============================================================ */
function populateTxForm(){
  $('#txPin').innerHTML =
    '<option value="">— Select a property record —</option>' +
    PROPERTIES.map(p =>
      `<option value="${esc(p.pin)}">${esc(p.pin)} — ${esc(p.owner)}</option>`
    ).join('');

  const years = [];
  for (let y = CURRENT_YEAR + 1; y >= CURRENT_YEAR - 4; y--) years.push(y);
  $('#txYear').innerHTML = years
    .map(y => `<option value="${y}" ${y === CURRENT_YEAR ? 'selected' : ''}>${y}</option>`)
    .join('');

  $('#txDate').value = todayISO();
  $('#txDate').max = todayISO();
}

function renderTxPreview(){
  const pin = $('#txPin').value;
  const box = $('#txPropertyInfo');
  const comp = $('#computation');

  if (!pin){
    box.innerHTML = '<p class="muted">Select a property to preview the computation.</p>';
    comp.innerHTML = '';
    return;
  }

  const p = PROPERTIES.find(x => x.pin === pin);
  const date = $('#txDate').value || todayISO();
  const year = Number($('#txYear').value);
  const c = computeTax(p, date, year);

  box.innerHTML = `
    <div><b>${esc(p.owner)}</b></div>
    <div class="mono muted">${esc(p.pin)} · ${esc(p.barangay)} · ${esc(p.classification)}</div>
    <div style="margin-top:6px">
      FMV <b>${peso(p.fairMarketValue)}</b> ×
      Assessment Level <b>${(p.assessmentLevel * 100).toFixed(0)}%</b> =
      Assessed Value <b>${peso(c.assessedValue)}</b>
    </div>
  `;

  if (c.exempt){
    comp.innerHTML = `
      <div class="soa__exempt" style="margin:0">
        This property is <b>tax-exempt</b> under RA 7160.
        No basic tax, SEF, discount, or penalty applies.
      </div>`;
    return;
  }

  comp.innerHTML = `
    <div class="comp-row comp-row--sub">
      <span>Assessed Value</span><span>${peso(c.assessedValue)}</span>
    </div>
    <div class="comp-row">
      <span>Basic RPT Tax (1%)</span><span>${peso(c.basic)}</span>
    </div>
    <div class="comp-row">
      <span>SEF Tax</span><span>${peso(c.sef)}</span>
    </div>
    <div class="comp-row comp-row--discount">
      <span>Discount — ${esc(c.discountLabel)}</span>
      <span>− ${peso(c.discount)}</span>
    </div>
    <div class="comp-row comp-row--penalty">
      <span>Penalty — ${esc(c.penaltyLabel)}</span>
      <span>+ ${peso(c.penalty)}</span>
    </div>
    <div class="comp-row comp-row--total">
      <span>Total Tax Due</span><span>${peso(c.total)}</span>
    </div>
  `;
}

['#txPin', '#txDate', '#txYear'].forEach(sel =>
  $(sel).addEventListener('change', renderTxPreview));

$('#btnResetTx').addEventListener('click', () => {
  $('#txPin').value = '';
  $('#txYear').value = CURRENT_YEAR;
  $('#txDate').value = todayISO();
  $('#txRemarks').value = '';
  renderTxPreview();
  toast('Form cleared.');
});

$('#btnGenerateSOA').addEventListener('click', () => {
  const pin = $('#txPin').value;
  const date = $('#txDate').value;
  const year = Number($('#txYear').value);

  if (!pin){ toast('Please select a property record.'); $('#txPin').focus(); return; }
  if (!date){ toast('Please choose a payment date.'); $('#txDate').focus(); return; }
  if (!year){ toast('Please select a tax year.'); $('#txYear').focus(); return; }

  const p = PROPERTIES.find(x => x.pin === pin);
  const c = computeTax(p, date, year);

  state.currentSOA = { property: p, computation: c, remarks: $('#txRemarks').value.trim() };

  $('#soaContent').innerHTML = buildSOA(state.currentSOA);
  $('#btnRecordPayment').disabled = c.exempt;
  $('#btnRecordPayment').textContent = c.exempt
    ? 'Tax-Exempt — No Payment Required'
    : 'Record Payment & Issue OR';

  openModal('#soaModal');
  pushAudit('SOA_GENERATED', `PIN ${p.pin}`, `Statement generated for TY ${year}`);
});

/* ============================================================
   12. SOA DOCUMENT BUILDER
   ============================================================ */
function buildSOA({ property:p, computation:c, remarks }){
  const soaNo = 'SOA-' + Date.now().toString().slice(-8);
  const issueDate = new Date().toLocaleDateString('en-PH',
    { year:'numeric', month:'long', day:'numeric' });

  const exemptBlock = c.exempt
    ? `<div class="soa__exempt">
         <b>TAX-EXEMPT PROPERTY.</b> This property is classified as
         <b>${esc(p.classification)}</b> and is exempt from Real Property Tax
         under Republic Act No. 7160. No basic tax, SEF, discount, or penalty is due.
       </div>`
    : '';

  const computeBlock = c.exempt ? '' : `
    <div class="soa__compute">
      <div class="comp-row comp-row--sub">
        <span>Assessed Value</span><span>${peso(c.assessedValue)}</span>
      </div>
      <div class="comp-row"><span>Basic RPT Tax (1%)</span><span>${peso(c.basic)}</span></div>
      <div class="comp-row"><span>SEF Tax</span><span>${peso(c.sef)}</span></div>
      <div class="comp-row comp-row--discount">
        <span>Discount — ${esc(c.discountLabel)}</span><span>− ${peso(c.discount)}</span>
      </div>
      <div class="comp-row comp-row--penalty">
        <span>Penalty — ${esc(c.penaltyLabel)}</span><span>+ ${peso(c.penalty)}</span>
      </div>
      <div class="comp-row comp-row--total">
        <span>TOTAL TAX DUE</span><span>${peso(c.total)}</span>
      </div>
    </div>`;

  return `
    <div class="soa__head">
      <div class="seal" aria-hidden="true">LGU</div>
      <div class="soa__head-text">
        <div class="rep">Republic of the Philippines</div>
        <div class="muni">PROVINCE OF CAMARINES NORTE</div>
        <div class="muni">MUNICIPALITY OF TALISAY</div>
        <div class="office">OFFICE OF THE MUNICIPAL TREASURER</div>
      </div>
      <div style="width:60px"></div>
    </div>

    <div class="soa__title" id="soaTitle">STATEMENT OF ACCOUNT</div>

    <div class="soa__meta">
      <div><b>SOA No.</b><span class="mono">${esc(soaNo)}</span></div>
      <div><b>Date Issued</b><span>${esc(issueDate)}</span></div>
      <div><b>Property PIN</b><span class="mono">${esc(p.pin)}</span></div>
      <div><b>Tax Year</b><span>${esc(c.taxYear)}</span></div>
      <div><b>Owner</b><span>${esc(p.owner)}</span></div>
      <div><b>Barangay</b><span>${esc(p.barangay)}</span></div>
      <div><b>Location</b><span>${esc(p.address)}</span></div>
      <div><b>Classification</b><span>${esc(p.classification)}</span></div>
      <div><b>Fair Market Value</b><span>${peso(p.fairMarketValue)}</span></div>
      <div><b>Assessment Level</b><span>${(p.assessmentLevel * 100).toFixed(0)}%</span></div>
      <div><b>Payment Date</b><span>${esc(c.paymentDate)}</span></div>
      <div><b>Assessed Value</b><span>${peso(c.assessedValue)}</span></div>
    </div>

    ${exemptBlock}

    ${c.exempt ? '' : `
      <table>
        <thead>
          <tr>
            <th scope="col">Tax Component</th>
            <th scope="col">Basis</th>
            <th scope="col" class="ta-r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Real Property Tax</td>
            <td>Assessed Value × 1% (RA 7160, Sec. 233)</td>
            <td class="ta-r">${peso(c.basic)}</td>
          </tr>
          <tr>
            <td>Special Education Fund (SEF)</td>
            <td>Assessed Value × SEF rate</td>
            <td class="ta-r">${peso(c.sef)}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td>${esc(c.discountLabel)}</td>
            <td class="ta-r">− ${peso(c.discount)}</td>
          </tr>
          <tr>
            <td>Penalty</td>
            <td>${esc(c.penaltyLabel)}</td>
            <td class="ta-r">+ ${peso(c.penalty)}</td>
          </tr>
        </tbody>
      </table>`}

    ${computeBlock}

    <div class="soa__note">
      <b>Note:</b> Please bring this Statement of Account when paying at the
      Municipal Treasurer's Office. Payments must be made on or before the
      deadline indicated in the notice to avoid the 2% monthly penalty.
      ${remarks ? `<br /><b>Remarks:</b> ${esc(remarks)}` : ''}
    </div>

    <div class="soa__sign">
      <div>
        <div class="line">Prepared by — Treasurer's Office IT Staff</div>
      </div>
      <div>
        <div class="line">Approved by — Municipal Treasurer</div>
      </div>
    </div>
  `;
}

/* ============================================================
   13. MODAL HELPERS
   ============================================================ */
function openModal(sel){
  const m = $(sel);
  m.classList.remove('is-hidden');
  m.querySelector('.modal__box').scrollTop = 0;
  const firstBtn = m.querySelector('button');
  if (firstBtn) firstBtn.focus();
}
function closeModal(sel){ $(sel).classList.add('is-hidden'); }

document.addEventListener('click', e => {
  if (e.target.closest('[data-close-modal]')){
    const m = e.target.closest('.modal');
    if (m) m.classList.add('is-hidden');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    $$('.modal').forEach(m => m.classList.add('is-hidden'));
  }
});

$('#btnPrintSOA').addEventListener('click', () => window.print());

/* ============================================================
   14. RECORD PAYMENT
   ============================================================ */
$('#btnRecordPayment').addEventListener('click', () => {
  const s = state.currentSOA;
  if (!s || s.computation.exempt) return;

  const { property:p, computation:c, remarks } = s;
  const or = nextOR();

  const payment = {
    or, date: c.paymentDate, pin: p.pin, taxpayer: p.owner,
    year: c.taxYear, basic: c.basic, sef: c.sef,
    discount: c.discount, penalty: c.penalty, total: c.total,
    encodedBy: $('#userName').textContent, remarks: remarks || ''
  };

  PAYMENTS.push(payment);
  state.lastReceipt = payment;

  pushAudit('PAYMENT_RECORDED', `OR ${or}`,
    `${peso(c.total)} — PIN ${p.pin} — TY ${c.taxYear}`);

  closeModal('#soaModal');
  $('#confirmContent').innerHTML = buildReceipt(payment);
  openModal('#confirmModal');

  renderAll();
  toast(`Payment recorded. OR No. ${or}`);
});

function buildReceipt(pay){
  const issue = new Date().toLocaleString('en-PH',
    { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

  return `
    <div class="receipt__check" aria-hidden="true">✓</div>
    <div class="receipt__title">Payment Recorded Successfully</div>
    <div class="receipt__sub">Official Receipt generated on ${esc(issue)}</div>

    <div class="receipt__or">
      <span>Official Receipt No.</span>
      <b>${esc(pay.or)}</b>
    </div>

    <dl class="dl">
      <dt>Property PIN</dt><dd class="mono">${esc(pay.pin)}</dd>
      <dt>Taxpayer</dt><dd>${esc(pay.taxpayer)}</dd>
      <dt>Tax Year</dt><dd>${esc(pay.year)}</dd>
      <dt>Payment Date</dt><dd>${esc(pay.date)}</dd>
      <dt>Basic RPT Tax</dt><dd>${peso(pay.basic)}</dd>
      <dt>SEF Tax</dt><dd>${peso(pay.sef)}</dd>
      <dt>Discount Applied</dt><dd>− ${peso(pay.discount)}</dd>
      <dt>Penalty Applied</dt><dd>+ ${peso(pay.penalty)}</dd>
      <dt>Encoded By</dt><dd>${esc(pay.encodedBy)}</dd>
    </dl>

    <div class="receipt__total">
      <span>Total Amount Paid</span>
      <span>${peso(pay.total)}</span>
    </div>

    <div class="soa__note">
      This serves as proof of payment. Please keep this receipt for your records.
      For inquiries, contact the Municipal Treasurer's Office, LGU Talisay,
      Camarines Norte.
      ${pay.remarks ? `<br /><b>Remarks:</b> ${esc(pay.remarks)}` : ''}
    </div>
  `;
}

$('#btnPrintReceipt').addEventListener('click', () => window.print());

$('#btnNewTransaction').addEventListener('click', () => {
  closeModal('#confirmModal');
  $('#btnResetTx').click();
  setView('transaction');
});

/* ============================================================
   15. COLLECTIONS
   ============================================================ */
function renderCollections(){
  const q = ($('#colSearch').value || '').trim().toLowerCase();
  const list = PAYMENTS.filter(p =>
    !q || [p.or, p.pin, p.taxpayer, String(p.year)]
      .join(' ').toLowerCase().includes(q));

  $('#collectionsTable').innerHTML = list.length
    ? list.map(p => `
        <tr>
          <td class="mono">${esc(p.or)}</td>
          <td>${esc(p.date)}</td>
          <td class="mono">${esc(p.pin)}</td>
          <td>${esc(p.taxpayer)}</td>
          <td>${esc(p.year)}</td>
          <td class="ta-r">${peso(p.basic)}</td>
          <td class="ta-r">${peso(p.sef)}</td>
          <td class="ta-r">−${peso(p.discount)}</td>
          <td class="ta-r">+${peso(p.penalty)}</td>
          <td class="ta-r"><b>${peso(p.total)}</b></td>
          <td>${esc(p.encodedBy)}</td>
        </tr>`).join('')
    : `<tr><td colspan="11" class="empty">No payments match your filter.</td></tr>`;

  const totals = list.reduce((a, p) => ({
    basic: a.basic + p.basic, sef: a.sef + p.sef,
    discount: a.discount + p.discount, penalty: a.penalty + p.penalty,
    total: a.total + p.total
  }), { basic:0, sef:0, discount:0, penalty:0, total:0 });

  $('#collectionsFoot').innerHTML = `
    <tr>
      <td colspan="5">TOTAL (${list.length} transaction${list.length !== 1 ? 's' : ''})</td>
      <td class="ta-r">${peso(totals.basic)}</td>
      <td class="ta-r">${peso(totals.sef)}</td>
      <td class="ta-r">−${peso(totals.discount)}</td>
      <td class="ta-r">+${peso(totals.penalty)}</td>
      <td class="ta-r">${peso(totals.total)}</td>
      <td></td>
    </tr>`;
}

$('#colSearch').addEventListener('input', renderCollections);

/* ============================================================
   16. REPORTS / OFFICIAL DOCUMENTS
   ------------------------------------------------------------
   Per client sign-off, only these 7 documents are in scope:
   Certified List · Certified List (No Penalty) · List of RPT ·
   Notice of Delinquency (Less Penalty) · Statement of Account ·
   Certification · Certification (Quarterly)
   ============================================================ */

/* Fields each document needs, used to show/hide the right inputs */
const REPORT_FIELDS = {
  certified:            ['to'],
  certifiedNoPenalty:   ['to'],
  listRPT:              ['pin', 'year'],
  noticeDelinquency:    ['to'],
  soa:                  [],
  certification:        ['pin'],
  certificationQuarter: ['pin', 'year', 'quarter']
};

function updateReportFields(){
  const type = $('#reportType').value;
  const need = REPORT_FIELDS[type] || [];
  const map = {
    to: 'reportToWrap', pin: 'reportPinWrap',
    year: 'reportYearWrap', quarter: 'reportQuarterWrap'
  };
  Object.entries(map).forEach(([key, id]) => {
    $('#' + id).style.display = need.includes(key) ? '' : 'none';
  });
  $('#reportFromWrap').style.display = 'none'; // superseded by "as of" (#reportTo)
}
$('#reportType').addEventListener('change', updateReportFields);

function populateReportForm(){
  $('#reportPin').innerHTML =
    '<option value="">— Select a property record —</option>' +
    PROPERTIES.map(p =>
      `<option value="${esc(p.pin)}">${esc(p.pin)} — ${esc(p.owner)}</option>`
    ).join('');

  const years = [];
  for (let y = CURRENT_YEAR + 1; y >= CURRENT_YEAR - 4; y--) years.push(y);
  $('#reportYear').innerHTML = years
    .map(y => `<option value="${y}" ${y === CURRENT_YEAR ? 'selected' : ''}>${y}</option>`)
    .join('');

  updateReportFields();
}

/* Tax due excluding penalty ("less penalty") — basic + SEF − discount */
function taxNoPenalty(c){
  return c.exempt ? 0 : (c.basic + c.sef - c.discount);
}

/* Signed peso display — keeps the ± sign in front of the ₱, e.g. "−₱480.00" */
function pesoSigned(n){
  if (n > 0) return '+' + peso(n);
  if (n < 0) return '−' + peso(Math.abs(n));
  return peso(0);
}

function docLetterhead(title, subtitle){
  return `
    <div class="soa__head">
      <div class="seal" aria-hidden="true">LGU</div>
      <div class="soa__head-text">
        <div class="rep">Republic of the Philippines</div>
        <div class="muni">PROVINCE OF CAMARINES NORTE</div>
        <div class="muni">MUNICIPALITY OF TALISAY</div>
        <div class="office">OFFICE OF THE MUNICIPAL TREASURER</div>
      </div>
      <div style="width:60px"></div>
    </div>
    <div class="soa__title">${esc(title)}</div>
    ${subtitle ? `<p class="muted small" style="text-align:center;margin-top:-10px">${esc(subtitle)}</p>` : ''}`;
}

function signBlock(left, right){
  return `
    <div class="soa__sign">
      <div><div class="line">${left}</div></div>
      <div><div class="line">${right}</div></div>
    </div>`;
}

$('#btnGenerateReport').addEventListener('click', () => {
  const type = $('#reportType').value;
  const asOf = $('#reportTo').value || todayISO();
  let html = '';

  /* ---------- 1. CERTIFIED LIST ---------- */
  if (type === 'certified'){
    const rows = PROPERTIES.map(p => ({ p, c: computeTax(p, asOf, CURRENT_YEAR) }));
    const grand = rows.reduce((s, r) => s + r.c.total, 0);

    html = reportHeader('Certified List',
      `All registered properties · Tax Year ${CURRENT_YEAR} · As of ${asOf}`) + `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>PIN</th><th>Owner</th><th>Location</th><th>Kind</th><th>Area</th>
              <th>Taxability</th><th class="ta-r">Total Tax Due</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(({p, c}) => `
              <tr>
                <td class="mono">${esc(p.pin)}</td><td>${esc(p.owner)}</td>
                <td>${esc(p.location)}</td><td>${esc(p.kind)}</td><td>${esc(p.area)}</td>
                <td>${p.taxExempt ? 'Tax-Exempt' : 'Taxable'}</td>
                <td class="ta-r"><b>${peso(c.total)}</b></td>
              </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr><td colspan="6"><b>GRAND TOTAL</b></td><td class="ta-r"><b>${peso(grand)}</b></td></tr>
          </tfoot>
        </table>
      </div>
      <p style="margin-top:18px;line-height:1.7">
        THIS IS TO CERTIFY that the foregoing is a true and correct list of registered real
        properties and their corresponding tax due, as reflected in the records of this office
        as of ${esc(asOf)}.
      </p>
      ${signBlock("Prepared by — Treasurer's Office IT Staff", 'Certified correct — Municipal Treasurer')}`;
  }

  /* ---------- 2. CERTIFIED LIST (NO PENALTY) ---------- */
  else if (type === 'certifiedNoPenalty'){
    const rows = PROPERTIES.map(p => ({ p, c: computeTax(p, asOf, CURRENT_YEAR) }));
    const grand = rows.reduce((s, r) => s + taxNoPenalty(r.c), 0);

    html = reportHeader('Certified List (No Penalty)',
      `All registered properties · Tax Year ${CURRENT_YEAR} · As of ${asOf} · Penalty excluded`) + `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>PIN</th><th>Owner</th><th>Location</th><th>Kind</th><th>Area</th>
              <th>Taxability</th><th class="ta-r">Tax Due (No Penalty)</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(({p, c}) => `
              <tr>
                <td class="mono">${esc(p.pin)}</td><td>${esc(p.owner)}</td>
                <td>${esc(p.location)}</td><td>${esc(p.kind)}</td><td>${esc(p.area)}</td>
                <td>${p.taxExempt ? 'Tax-Exempt' : 'Taxable'}</td>
                <td class="ta-r"><b>${peso(taxNoPenalty(c))}</b></td>
              </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr><td colspan="6"><b>GRAND TOTAL</b></td><td class="ta-r"><b>${peso(grand)}</b></td></tr>
          </tfoot>
        </table>
      </div>
      <p style="margin-top:18px;line-height:1.7">
        THIS IS TO CERTIFY that the foregoing is a true and correct list of registered real
        properties and their corresponding tax due — <b>exclusive of accrued penalty</b> — as
        reflected in the records of this office as of ${esc(asOf)}.
      </p>
      ${signBlock("Prepared by — Treasurer's Office IT Staff", 'Certified correct — Municipal Treasurer')}`;
  }

  /* ---------- 3. LIST OF RPT (per-property tax register card) ---------- */
  else if (type === 'listRPT'){
    const pin = $('#reportPin').value;
    if (!pin){ toast('Please select a property record.'); $('#reportPin').focus(); return; }
    const p = PROPERTIES.find(x => x.pin === pin);
    const all = PAYMENTS.filter(pay => pay.pin === pin);
    const years = [...new Set(all.map(r => r.year))].sort();
    const yearList = years.length ? years : [Number($('#reportYear').value) || CURRENT_YEAR];

    function half(list, h){
      const set = list.filter(r => {
        const m = new Date(r.date + 'T00:00:00').getMonth() + 1;
        return h === 1 ? m <= 6 : m > 6;
      });
      if (!set.length) return { amount: 0, discPen: 0, or: '—', datePaid: '—' };
      return {
        amount: set.reduce((s, r) => s + r.basic + r.sef, 0),
        discPen: set.reduce((s, r) => s + (r.penalty || 0) - (r.discount || 0), 0),
        or: set.map(r => r.or).join(', '),
        datePaid: set.map(r => r.date).sort().slice(-1)[0]
      };
    }

    const bodyRows = yearList.map(y => {
      const yp = all.filter(r => r.year === y);
      const h1 = half(yp, 1), h2 = half(yp, 2);
      const totBasicSef = yp.reduce((s, r) => s + r.basic + r.sef, 0);
      const totDiscPen  = yp.reduce((s, r) => s + (r.penalty || 0) - (r.discount || 0), 0);
      const totPaid     = yp.reduce((s, r) => s + r.total, 0);
      return `
        <tr>
          <td><b>${y}</b></td>
          <td class="ta-r">${peso(h1.amount)}</td><td class="ta-r">${pesoSigned(h1.discPen)}</td>
          <td class="mono">${esc(h1.or)}</td><td class="mono">${esc(h1.or)}</td><td>${esc(h1.datePaid)}</td>
          <td class="ta-r">${peso(h2.amount)}</td><td class="ta-r">${pesoSigned(h2.discPen)}</td>
          <td class="mono">${esc(h2.or)}</td><td class="mono">${esc(h2.or)}</td><td>${esc(h2.datePaid)}</td>
          <td class="ta-r">${peso(totBasicSef)}</td><td class="ta-r">${pesoSigned(totDiscPen)}</td>
          <td class="ta-r"><b>${peso(totPaid)}</b></td>
        </tr>`;
    }).join('');

    html = reportHeader('List of RPT', 'Real Property Tax Register Card') + `
      <div class="soa__meta" style="margin-bottom:18px">
        <div><b>Property</b><span>${esc(p.kind)}</span></div>
        <div><b>Location</b><span>${esc(p.location)}</span></div>
        <div><b>PIN</b><span class="mono">${esc(p.pin)}</span></div>
        <div><b>Address</b><span>${esc(p.address)}</span></div>
        <div><b>Area</b><span>${esc(p.area)}</span></div>
        <div><b>Kind</b><span>${esc(p.kind)}</span></div>
        <div><b>Taxability</b><span>${p.taxExempt ? 'Tax-Exempt' : 'Taxable'}</span></div>
        <div><b>Date</b><span>${esc(todayISO())}</span></div>
        <div><b>CD1</b><span class="mono">${esc(p.cd1)}</span></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th rowspan="2">Year</th>
              <th colspan="5">1st &amp; 3rd Quarter</th>
              <th colspan="5">2nd &amp; 4th Quarter</th>
              <th colspan="3">Totals</th>
            </tr>
            <tr>
              <th>Amount</th><th>Disct./Penalty</th><th>O.R.# (Basic)</th><th>O.R.# (SEF)</th><th>Date Paid</th>
              <th>Amount</th><th>Disct./Penalty</th><th>O.R.# (Basic)</th><th>O.R.# (SEF)</th><th>Date Paid</th>
              <th>Basic/SEF</th><th>Disct./Penalty</th><th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>${bodyRows || '<tr><td colspan="14" class="empty">No payments recorded for this property.</td></tr>'}</tbody>
        </table>
      </div>
      <p class="muted small" style="margin-top:10px">
        Note: quarters are grouped 1st/3rd and 2nd/4th per the legacy tax register card layout —
        amounts reflect payments posted in the first half (Jan–Jun) and second half (Jul–Dec)
        of each tax year respectively.
      </p>`;
  }

  /* ---------- 4. NOTICE OF DELINQUENCY (LESS PENALTY) ---------- */
  else if (type === 'noticeDelinquency'){
    const rows = PROPERTIES
      .filter(p => !p.taxExempt)
      .filter(p => !PAYMENTS.some(pay => pay.pin === p.pin && pay.year === CURRENT_YEAR))
      .map(p => ({ p, c: computeTax(p, asOf, CURRENT_YEAR) }));
    const grand = rows.reduce((s, r) => s + taxNoPenalty(r.c), 0);

    html = reportHeader('Notice of Delinquency (Less Penalty)',
      `Tax Year ${CURRENT_YEAR} · As of ${asOf} · Amounts shown exclude accrued penalty`) + `
      <p style="margin-bottom:18px;line-height:1.7">
        Pursuant to Sections 249–256 of Republic Act No. 7160 (Local Government Code), the
        property owners listed below are hereby notified of their <b>unpaid Real Property Tax</b>
        for CY ${CURRENT_YEAR}. The amounts below are <b>exclusive of penalty</b>; a surcharge of
        2% per month applies to any balance remaining unpaid, up to a maximum of 72%. Kindly
        settle at the Office of the Municipal Treasurer at the earliest to avoid further charges.
      </p>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>PIN</th><th>Owner</th><th>Location</th><th>Kind</th>
              <th class="ta-r">Tax Due (Less Penalty)</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map(({p, c}) => `
              <tr>
                <td class="mono">${esc(p.pin)}</td><td>${esc(p.owner)}</td>
                <td>${esc(p.location)}</td><td>${esc(p.kind)}</td>
                <td class="ta-r"><b>${peso(taxNoPenalty(c))}</b></td>
              </tr>`).join('') : '<tr><td colspan="5" class="empty">No delinquent accounts. 🎉</td></tr>'}
          </tbody>
          <tfoot>
            <tr><td colspan="4"><b>TOTAL</b></td><td class="ta-r"><b>${peso(grand)}</b></td></tr>
          </tfoot>
        </table>
      </div>
      ${signBlock("Prepared by — Treasurer's Office IT Staff", 'Noted by — Municipal Treasurer')}`;
  }

  /* ---------- 5. STATEMENT OF ACCOUNT (shortcut) ---------- */
  else if (type === 'soa'){
    html = `
      <div class="empty">
        <div class="empty__ico" aria-hidden="true">₱</div>
        <b>Statement of Account is generated per property</b>
        <p>Use the dedicated Statement of Account form to select a property, tax year, and
           payment date, preview the live computation, and print or record the payment.</p>
        <button class="btn btn--primary btn--sm" data-goto="transaction">Open Statement of Account</button>
      </div>`;
  }

  /* ---------- 6. CERTIFICATION ---------- */
  else if (type === 'certification'){
    const pin = $('#reportPin').value;
    if (!pin){ toast('Please select a property record.'); $('#reportPin').focus(); return; }
    const p = PROPERTIES.find(x => x.pin === pin);
    const today = todayISO();
    const c = computeTax(p, today, CURRENT_YEAR);
    const dueText = p.taxExempt
      ? 'is <b>tax-exempt</b> from Real Property Tax under Republic Act No. 7160'
      : (c.total > 0
          ? `has an outstanding Real Property Tax obligation of <b>${peso(c.total)}</b> for CY ${CURRENT_YEAR}`
          : `has <b>no outstanding</b> Real Property Tax obligation for CY ${CURRENT_YEAR}`);

    html = `
      <div class="soa">
        ${docLetterhead('CERTIFICATION')}
        <div class="soa__meta">
          <div><b>Cert. No.</b><span class="mono">CERT-${Date.now().toString().slice(-8)}</span></div>
          <div><b>Date Issued</b><span>${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}</span></div>
          <div><b>PIN</b><span class="mono">${esc(p.pin)}</span></div>
          <div><b>CD1</b><span class="mono">${esc(p.cd1)}</span></div>
        </div>
        <p style="margin:18px 0;line-height:1.7">
          THIS IS TO CERTIFY that, per records of this office, the real property described below
          is registered under the name of <b>${esc(p.owner)}</b>, located at ${esc(p.location)},
          classified as <b>${esc(p.kind)}</b> with an area of ${esc(p.area)}, and is
          <b>${p.taxExempt ? 'TAX-EXEMPT' : 'TAXABLE'}</b>. As of ${esc(today)}, the said property
          ${dueText}.
        </p>
        <p style="margin:18px 0;line-height:1.7">
          This certification is issued upon request of the owner/authorized representative for
          whatever legal purpose it may serve.
        </p>
        ${signBlock("Prepared by — Treasurer's Office IT Staff", 'HON. MUNICIPAL TREASURER<br><span class="muted small">Municipal Treasurer</span>')}
      </div>`;
  }

  /* ---------- 7. CERTIFICATION (QUARTERLY) ---------- */
  else if (type === 'certificationQuarter'){
    const pin = $('#reportPin').value;
    const year = Number($('#reportYear').value) || CURRENT_YEAR;
    const q = Number($('#reportQuarter').value) || 1;
    if (!pin){ toast('Please select a property record.'); $('#reportPin').focus(); return; }
    const p = PROPERTIES.find(x => x.pin === pin);
    const qLabel = ['1st', '2nd', '3rd', '4th'][q - 1];
    const range = [[1,3],[4,6],[7,9],[10,12]][q - 1];

    const match = PAYMENTS.find(pay => {
      if (pay.pin !== pin || pay.year !== year) return false;
      const m = new Date(pay.date + 'T00:00:00').getMonth() + 1;
      return m >= range[0] && m <= range[1];
    });

    const statusText = p.taxExempt
      ? 'is <b>tax-exempt</b> from Real Property Tax under Republic Act No. 7160 and therefore carries no quarterly obligation'
      : (match
          ? `has been <b>PAID</b> under O.R. No. <b>${esc(match.or)}</b> dated ${esc(match.date)}, in the amount of ${peso(match.total)}`
          : `has <b>NOT YET BEEN PAID</b> as of ${esc(todayISO())}`);

    html = `
      <div class="soa">
        ${docLetterhead('CERTIFICATION — QUARTERLY PAYMENT STATUS')}
        <div class="soa__meta">
          <div><b>Cert. No.</b><span class="mono">CERT-Q${Date.now().toString().slice(-8)}</span></div>
          <div><b>Date Issued</b><span>${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}</span></div>
          <div><b>PIN</b><span class="mono">${esc(p.pin)}</span></div>
          <div><b>Tax Year / Quarter</b><span>${year} — ${qLabel} Quarter</span></div>
        </div>
        <p style="margin:18px 0;line-height:1.7">
          THIS IS TO CERTIFY that, per records of this office, the Real Property Tax due for the
          <b>${qLabel} quarter of ${year}</b> on the property registered under
          <b>${esc(p.owner)}</b>, PIN <b>${esc(p.pin)}</b>, located at ${esc(p.location)}, ${statusText}.
        </p>
        <p style="margin:18px 0;line-height:1.7">
          This certification is issued upon request of the owner/authorized representative for
          whatever legal purpose it may serve.
        </p>
        ${signBlock("Prepared by — Treasurer's Office IT Staff", 'HON. MUNICIPAL TREASURER<br><span class="muted small">Municipal Treasurer</span>')}
      </div>`;
  }

  $('#reportOutput').innerHTML = html;
  pushAudit('DOCUMENT_GENERATED', type.toUpperCase(), `As of ${asOf}`);
  toast('Document generated.');
});

function reportHeader(title, subtitle){
  return `
    <div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid var(--navy)">
      <div style="font-size:11px;color:var(--muted);letter-spacing:.4px">Republic of the Philippines</div>
      <div style="font-size:12px;font-weight:700;color:var(--navy);letter-spacing:.5px">MUNICIPALITY OF TALISAY, CAMARINES NORTE</div>
      <div style="font-size:12px;font-weight:700;color:var(--navy);letter-spacing:.5px">OFFICE OF THE MUNICIPAL TREASURER</div>
      <div style="font-size:15px;font-weight:800;color:var(--navy);margin-top:12px;letter-spacing:1.2px">${esc(title.toUpperCase())}</div>
      <div style="font-size:11.5px;color:var(--muted);margin-top:4px">${esc(subtitle)}</div>
    </div>`;
}

$('#btnPrintReport').addEventListener('click', () => window.print());

/* ============================================================
   17. AUDIT TRAIL
   ============================================================ */
function renderAudit(){
  $('#auditTable').innerHTML = AUDIT_LOG.length
    ? AUDIT_LOG.map(a => `
        <tr>
          <td class="mono">${esc(a.ts)}</td>
          <td>${esc(a.user)}</td>
          <td><span class="badge badge--advance">${esc(a.action)}</span></td>
          <td class="mono">${esc(a.ref)}</td>
          <td>${esc(a.remarks)}</td>
        </tr>`).join('')
    : `<tr><td colspan="5" class="empty">No audit entries yet.</td></tr>`;
}

$('#btnClearAudit').addEventListener('click', () => {
  if (!confirm('Clear the entire audit log? This cannot be undone.')) return;
  AUDIT_LOG = [];
  renderAudit();
  toast('Audit log cleared.');
});

/* ============================================================
   18. RENDER ALL / INIT
   ============================================================ */
function renderAll(){
  renderStats();
  renderRecent();
  renderBarangayChart();
  renderDelinquent();
  renderSearch();
  renderCollections();
  renderAudit();
}

function initApp(){
  populateFilters();
  populateTxForm();
  populateReportForm();
  renderAll();
  renderTxPreview();
  setView('dashboard');

  // default report dates
  const first = new Date();
  first.setDate(1);
  $('#reportFrom').value = first.toISOString().slice(0, 10);
  $('#reportTo').value   = todayISO();
}