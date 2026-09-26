import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css';

const MASTER_DATA = {
  basicRate: 0.01,
  sefRate: 0.01,
  discountAdvance: 0.2,
  discountQ1: 0.1,
  penaltyPerMonth: 0.02,
  penaltyStartMonth: 4,
  penaltyEndMonth: 12,
};

const CURRENT_YEAR = new Date().getFullYear();

const INITIAL_PROPERTIES = [
  {
    pin: '002-040',
    owner: 'TIMONER Y RAMOS, LOURDES C.',
    spouseRelatives: ['TIMONER, RICARDO S. (Spouse)'],
    address: 'Brgy. Binanuaan, Talisay, Camarines Norte',
    location: 'Brgy. Binanuaan (Lot 14, Cad-291-D)',
    area: '5,000 sqm',
    kind: 'Agricultural Land',
    cd1: 'A-1',
    barangay: 'Binanuaan',
    classification: 'Agricultural',
    fairMarketValue: 480000,
    assessmentLevel: 0.4,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0021',
    owner: 'DELA CRUZ, MARIA L.',
    spouseRelatives: ['DELA CRUZ, JUAN P. (Spouse)'],
    address: 'Brgy. San Isidro, Talisay, Camarines Norte',
    location: 'Brgy. San Isidro (Lot 7, Blk 2)',
    area: '350 sqm',
    kind: 'Residential Land & Bldg.',
    cd1: 'R-1',
    barangay: 'San Isidro',
    classification: 'Residential',
    fairMarketValue: 1200000,
    assessmentLevel: 0.2,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0028',
    owner: 'REYES, ANTONIO B.',
    spouseRelatives: [],
    address: 'Brgy. Poblacion, Talisay, Camarines Norte',
    location: 'Brgy. Poblacion (Lot 3, Blk 5)',
    area: '620 sqm',
    kind: 'Commercial Land & Bldg.',
    cd1: 'C-1',
    barangay: 'Poblacion',
    classification: 'Commercial',
    fairMarketValue: 3500000,
    assessmentLevel: 0.5,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0018',
    owner: 'RAMOS, JOSEFINA M.',
    spouseRelatives: ['RAMOS, PEDRO T. (Spouse)'],
    address: 'Brgy. Fabrica, Talisay, Camarines Norte',
    location: 'Brgy. Fabrica (Lot 9)',
    area: '480 sqm',
    kind: 'Residential Land & Bldg.',
    cd1: 'R-2',
    barangay: 'Fabrica',
    classification: 'Residential',
    fairMarketValue: 850000,
    assessmentLevel: 0.2,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0035',
    owner: 'SANGGUNIANG BARANGAY NG POBLACION',
    spouseRelatives: [],
    address: 'Brgy. Poblacion, Talisay, Camarines Norte',
    location: 'Brgy. Poblacion (Barangay Hall Site)',
    area: '900 sqm',
    kind: 'Government Bldg.',
    cd1: 'SP-1',
    barangay: 'Poblacion',
    classification: 'Special/Exempt',
    fairMarketValue: 2000000,
    assessmentLevel: 0,
    taxExempt: true,
    remarks: 'Barangay Hall — tax-exempt under RA 7160',
  },
  {
    pin: '002-0042',
    owner: 'PARISH OF ST. JOHN THE BAPTIST',
    spouseRelatives: [],
    address: 'Brgy. Poblacion, Talisay, Camarines Norte',
    location: 'Brgy. Poblacion (Church Compound)',
    area: '1,500 sqm',
    kind: 'Religious Land & Bldg.',
    cd1: 'SP-2',
    barangay: 'Poblacion',
    classification: 'Special/Exempt',
    fairMarketValue: 4500000,
    assessmentLevel: 0,
    taxExempt: true,
    remarks: 'Church — tax-exempt under RA 7160',
  },
  {
    pin: '002-0051',
    owner: 'GARCIA, ROBERTO S.',
    spouseRelatives: ['GARCIA, ELENA V. (Spouse)'],
    address: 'Brgy. Binanuaan, Talisay, Camarines Norte',
    location: 'Brgy. Binanuaan (Lot 21)',
    area: '3,000 sqm',
    kind: 'Industrial Land & Bldg.',
    cd1: 'I-1',
    barangay: 'Binanuaan',
    classification: 'Industrial',
    fairMarketValue: 6200000,
    assessmentLevel: 0.5,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0063',
    owner: 'MENDOZA, CARMEN D.',
    spouseRelatives: [],
    address: 'Brgy. San Isidro, Talisay, Camarines Norte',
    location: 'Brgy. San Isidro (Lot 33, Cad-291)',
    area: '4,200 sqm',
    kind: 'Agricultural Land',
    cd1: 'A-2',
    barangay: 'San Isidro',
    classification: 'Agricultural',
    fairMarketValue: 320000,
    assessmentLevel: 0.4,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0074',
    owner: 'DELA CRUZ, MARIA L.',
    spouseRelatives: ['DELA CRUZ, JUAN P. (Spouse)'],
    address: 'Brgy. Poblacion, Talisay, Camarines Norte',
    location: 'Brgy. Poblacion (Lot 11, Blk 4)',
    area: '540 sqm',
    kind: 'Commercial Land & Bldg.',
    cd1: 'C-2',
    barangay: 'Poblacion',
    classification: 'Commercial',
    fairMarketValue: 1800000,
    assessmentLevel: 0.5,
    taxExempt: false,
    remarks: '',
  },
  {
    pin: '002-0088',
    owner: 'GARCIA, ROBERTO S.',
    spouseRelatives: ['GARCIA, ELENA V. (Spouse)'],
    address: 'Brgy. Fabrica, Talisay, Camarines Norte',
    location: 'Brgy. Fabrica (Lot 18)',
    area: '2,800 sqm',
    kind: 'Agricultural Land',
    cd1: 'A-3',
    barangay: 'Fabrica',
    classification: 'Agricultural',
    fairMarketValue: 950000,
    assessmentLevel: 0.4,
    taxExempt: false,
    remarks: '',
  },
];

let PAYMENTS = [
  {
    or: '2026-0001',
    date: '2026-01-15',
    pin: '002-0021',
    taxpayer: 'DELA CRUZ, MARIA L.',
    year: 2026,
    basic: 2400,
    sef: 2400,
    discount: 480,
    penalty: 0,
    total: 4320,
    encodedBy: 'Treasurer IT Staff',
    remarks: 'Paid in advance — Q1 discount',
  },
  {
    or: '2026-0002',
    date: '2026-02-20',
    pin: '002-0028',
    taxpayer: 'REYES, ANTONIO B.',
    year: 2026,
    basic: 17500,
    sef: 17500,
    discount: 3500,
    penalty: 0,
    total: 31500,
    encodedBy: 'Treasurer IT Staff',
    remarks: 'Paid within Q1 — 10% discount',
  },
  {
    or: '2026-0003',
    date: '2026-06-10',
    pin: '002-0018',
    taxpayer: 'RAMOS, JOSEFINA M.',
    year: 2026,
    basic: 1700,
    sef: 1700,
    discount: 0,
    penalty: 306,
    total: 3706,
    encodedBy: 'Treasurer IT Staff',
    remarks: 'June payment — 3 months penalty',
  },
];

const AUDIT_LOG_INITIAL = [
  {
    ts: '2026-01-15 09:12',
    user: 'treasurer',
    action: 'PAYMENT_RECORDED',
    ref: 'OR 2026-0001',
    remarks: 'Advance payment — 20% discount applied',
  },
  {
    ts: '2026-02-20 14:05',
    user: 'treasurer',
    action: 'PAYMENT_RECORDED',
    ref: 'OR 2026-0002',
    remarks: 'Q1 payment — 10% discount applied',
  },
  {
    ts: '2026-06-10 10:41',
    user: 'treasurer',
    action: 'PAYMENT_RECORDED',
    ref: 'OR 2026-0003',
    remarks: 'June payment — 2% × 3 months penalty',
  },
];

const ASSESSMENT_CHANGES_INITIAL = [
  {
    id: 'AC-2026-0003',
    changedAt: '2026-09-22 09:40',
    changedBy: 'Assessor\'s Office',
    pin: '002-0028',
    owner: 'REYES, ANTONIO B.',
    changeType: 'REASSESSMENT',
    field: 'Fair Market Value',
    previousValue: '₱3,200,000.00',
    newValue: '₱3,500,000.00',
    status: 'Latest assessment',
  },
  {
    id: 'AC-2026-0002',
    changedAt: '2026-08-14 15:20',
    changedBy: 'Assessor\'s Office',
    pin: '002-0074',
    owner: 'DELA CRUZ, MARIA L.',
    changeType: 'CLASSIFICATION_CHANGE',
    field: 'Property Classification',
    previousValue: 'Residential',
    newValue: 'Commercial',
    status: 'Latest assessment',
  },
  {
    id: 'AC-2026-0001',
    changedAt: '2026-07-02 10:05',
    changedBy: 'Assessor\'s Office',
    pin: '002-0018',
    owner: 'RAMOS, JOSEFINA M.',
    changeType: 'OWNER_CHANGE',
    field: 'Registered Owner',
    previousValue: 'RAMOS, PEDRO T.',
    newValue: 'RAMOS, JOSEFINA M.',
    status: 'Latest assessment',
  },
];

const DEMO_USERS = {
  treasurer: { password: 'talisay123', name: "Treasurer IT Staff" },
  admin: { password: 'a123', name: 'System Administrator', role: 'System Administrator' },
};

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPesoSimple(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    maximumFractionDigits: 0,
  })}`;
}

function getTodayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isFutureDate(value) {
  return isValidISODate(value) && value > getTodayISO();
}

function LoadingButton({ loading, progress, children, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {children}
    </button>
  );
}

function FieldError({ message }) {
  return message ? <small className="field__error" role="alert">{message}</small> : null;
}

function LoadingScreen({ progress, message = 'Preparing property records, payments, and assessment data...' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen__panel">
        <div className="seal seal--sm" aria-hidden="true">LGU</div>
        <h1>Loading RPT Management System</h1>
        <p className="muted small">{message}</p>
        <div className="loading-screen__track" aria-hidden="true">
          <div className="loading-screen__bar" style={{ width: `${progress}%` }} />
        </div>
        <b className="loading-screen__percent">{progress}%</b>
        <span className="muted small">Please wait while the shared data is loaded.</span>
      </div>
    </div>
  );
}

function computeTax(property, paymentDate, taxYear) {
  if (property.taxExempt) {
    return {
      exempt: true,
      assessedValue: 0,
      basic: 0,
      sef: 0,
      discountRate: 0,
      discount: 0,
      discountLabel: 'Tax-exempt',
      penaltyMonths: 0,
      penaltyRate: 0,
      penalty: 0,
      penaltyLabel: '—',
      total: 0,
      paymentDate,
      taxYear,
    };
  }

  const d = new Date(`${paymentDate}T00:00:00`);
  const payMonth = d.getMonth() + 1;
  const payYear = d.getFullYear();

  const assessedValue = property.fairMarketValue * property.assessmentLevel;
  const basic = assessedValue * MASTER_DATA.basicRate;
  const sef = assessedValue * MASTER_DATA.sefRate;

  let discountRate = 0;
  let discountLabel = 'No discount';
  if (payYear < taxYear) {
    discountRate = MASTER_DATA.discountAdvance;
    discountLabel = '20% advance payment';
  } else if (payYear === taxYear && payMonth <= 3) {
    discountRate = MASTER_DATA.discountQ1;
    discountLabel = '10% (paid Jan–Mar)';
  }
  const discount = (basic + sef) * discountRate;

  let penaltyMonths = 0;
  if (payYear > taxYear) {
    penaltyMonths = 9;
  } else if (payYear === taxYear && payMonth >= MASTER_DATA.penaltyStartMonth) {
    penaltyMonths = Math.min(payMonth - MASTER_DATA.penaltyStartMonth + 1, 9);
  }

  const penaltyRate = penaltyMonths * MASTER_DATA.penaltyPerMonth;
  const penalty = basic * penaltyRate;
  const penaltyLabel = penaltyMonths
    ? `${penaltyMonths} month${penaltyMonths > 1 ? 's' : ''} × 2%`
    : 'None';

  const total = basic + sef - discount + penalty;

  return {
    exempt: false,
    assessedValue,
    basic,
    sef,
    discountRate,
    discount,
    discountLabel,
    penaltyMonths,
    penaltyRate,
    penalty,
    penaltyLabel,
    total,
    paymentDate,
    taxYear,
  };
}

function App() {
  const [assessmentRecords, setAssessmentRecords] = useState(INITIAL_PROPERTIES);
  const [assessmentChanges, setAssessmentChanges] = useState(ASSESSMENT_CHANGES_INITIAL);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [taxExemptOnly, setTaxExemptOnly] = useState(false);
  const [auditLog, setAuditLog] = useState(AUDIT_LOG_INITIAL);
  const [collectionsQuery, setCollectionsQuery] = useState('');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState({ action: '', progress: 0 });
  const [appLoading, setAppLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminUsers, setAdminUsers] = useState([
    { username: 'admin', name: 'System Administrator', role: 'System Administrator', status: 'Active' },
    { username: 'treasurer', name: 'Treasurer IT Staff', role: 'Treasurer IT Staff', status: 'Active' },
  ]);
  const [rateDraft, setRateDraft] = useState({
    basicRate: MASTER_DATA.basicRate * 100,
    sefRate: MASTER_DATA.sefRate * 100,
    discountAdvance: MASTER_DATA.discountAdvance * 100,
    discountQ1: MASTER_DATA.discountQ1 * 100,
    penaltyPerMonth: MASTER_DATA.penaltyPerMonth * 100,
  });
  const [clock, setClock] = useState('');
  const [txPin, setTxPin] = useState('');
  const [txYear, setTxYear] = useState(CURRENT_YEAR);
  const [txDate, setTxDate] = useState(getTodayISO());
  const [txRemarks, setTxRemarks] = useState('');
  const [soa, setSoa] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [reportType, setReportType] = useState('certified');
  const [reportTo, setReportTo] = useState(getTodayISO());
  const [reportPin, setReportPin] = useState('');
  const [reportYear, setReportYear] = useState(CURRENT_YEAR);
  const [reportQuarter, setReportQuarter] = useState(1);
  const [reportOutput, setReportOutput] = useState(null);
  const [paymentVersion, setPaymentVersion] = useState(0);
  const [assessmentDate, setAssessmentDate] = useState('');
  const properties = assessmentRecords;
  const processedAssessmentUpdates = useRef(new Set());

  const runRequest = (action, callback) => {
    setRequestError('');
    setLoading({ action, progress: 10 });
    let progress = 10;
    const progressId = window.setInterval(() => {
      progress = Math.min(progress + 15, 90);
      setLoading({ action, progress });
    }, 70);

    window.setTimeout(() => {
      window.clearInterval(progressId);
      setLoading({ action, progress: 100 });
      try {
        callback();
      } catch (requestFailure) {
        const duplicateMessage = requestFailure?.message?.startsWith('A payment already exists')
          ? requestFailure.message
          : null;
        setRequestError(duplicateMessage || `Couldn't complete ${action.toLowerCase()}. Check your connection and try again.`);
        addAudit('REQUEST_FAILED', action, 'User-facing request failure recorded.');
      } finally {
        window.setTimeout(() => setLoading({ action: '', progress: 0 }), 180);
      }
    }, 520);
  };

  useEffect(() => {
    const receiveAssessmentUpdates = () => {
      const raw = window.localStorage.getItem('rpt-assessment-changes');
      if (!raw) return;

      try {
        const incoming = JSON.parse(raw);
        const updates = Array.isArray(incoming) ? incoming : [incoming];
        const validUpdates = updates.filter((update) => {
          const updateKey = update?.id || JSON.stringify(update);
          return update && update.pin && update.changes && !processedAssessmentUpdates.current.has(updateKey);
        });
        if (!validUpdates.length) return;
        validUpdates.forEach((update) => processedAssessmentUpdates.current.add(update.id || JSON.stringify(update)));

        setAssessmentRecords((records) => records.map((record) => {
          const update = validUpdates.find((item) => item.pin === record.pin);
          return update ? { ...record, ...update.changes } : record;
        }));
        setAssessmentChanges((changes) => {
          const additions = validUpdates.map((update, index) => ({
            id: update.id || `LIVE-${Date.now()}-${index}`,
            changedAt: update.changedAt || new Date().toISOString().slice(0, 16).replace('T', ' '),
            changedBy: update.changedBy || "Assessor's Office",
            pin: update.pin,
            owner: update.changes.owner || properties.find((record) => record.pin === update.pin)?.owner || '—',
            changeType: update.changeType || 'ASSESSMENT_UPDATE',
            field: update.field || Object.keys(update.changes).join(', '),
            previousValue: update.previousValue || 'Previous value',
            newValue: update.newValue || 'Updated assessment record',
            status: 'Received just now',
          }));
          return [...additions, ...changes];
        });
      } catch {
        // Ignore malformed messages from an incomplete integration.
      }
    };

    receiveAssessmentUpdates();
    const intervalId = window.setInterval(receiveAssessmentUpdates, 2000);
    window.addEventListener('storage', receiveAssessmentUpdates);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', receiveAssessmentUpdates);
    };
  }, [properties]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const opts = { weekday: 'short', month: 'short', day: 'numeric' };
      setClock(
        `${d.toLocaleDateString('en-PH', opts)} · ${d.toLocaleTimeString('en-PH', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!appLoading) return undefined;

    const startedAt = Date.now();
    const duration = 4000;
    const updateProgress = () => {
      const progress = Math.min(100, Math.round(((Date.now() - startedAt) / duration) * 100));
      setLoading({ action: 'Loading application data', progress });
    };

    updateProgress();
    const intervalId = window.setInterval(updateProgress, 50);
    const finishId = window.setTimeout(() => {
      setLoading({ action: '', progress: 0 });
      setAppLoading(false);
    }, duration);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(finishId);
    };
  }, [appLoading]);

  const stats = useMemo(() => {
    const todayTotal = PAYMENTS.filter((p) => p.date === getTodayISO()).reduce(
      (sum, p) => sum + p.total,
      0
    );

    const yearTotal = PAYMENTS.filter((p) => p.year === CURRENT_YEAR).reduce(
      (sum, p) => sum + p.total,
      0
    );

    const taxable = properties.filter((p) => !p.taxExempt);
    const unpaid = taxable.filter(
      (p) => !PAYMENTS.some((pay) => pay.pin === p.pin && pay.year === CURRENT_YEAR)
    );

    return [
      { label: "Today's Collections", value: formatPeso(todayTotal), sub: getTodayISO(), className: 'stat--green' },
      { label: `Collections ${CURRENT_YEAR}`, value: formatPeso(yearTotal), sub: `${PAYMENTS.filter((p) => p.year === CURRENT_YEAR).length} transactions`, className: 'stat--blue' },
      { label: 'Taxable Properties', value: taxable.length.toLocaleString(), sub: `${properties.length} total records`, className: 'stat--gold' },
      { label: 'Delinquent Accounts', value: unpaid.length.toLocaleString(), sub: 'No payment for current year', className: 'stat--red' },
    ];
  }, [paymentVersion]);

  const recentTransactions = useMemo(
    () => [...PAYMENTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [paymentVersion]
  );

  const barangayTotals = useMemo(() => {
    const totals = {};
    PAYMENTS.forEach((p) => {
      const property = properties.find((x) => x.pin === p.pin);
      const barangay = property ? property.barangay : 'Unassigned';
      totals[barangay] = (totals[barangay] || 0) + p.total;
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [paymentVersion]);

  const delinquentRows = useMemo(() => {
    const today = getTodayISO();
    return properties.filter((p) => !p.taxExempt).filter(
      (p) => !PAYMENTS.some((pay) => pay.pin === p.pin && pay.year === CURRENT_YEAR)
    ).map((p) => ({ property: p, calc: computeTax(p, today, CURRENT_YEAR) }));
  }, [paymentVersion]);

  const allBarangays = useMemo(
    () => [...new Set(properties.map((p) => p.barangay))].sort(),
    []
  );

  const allClasses = useMemo(
    () => [...new Set(properties.map((p) => p.classification))].sort(),
    []
  );

  const filteredProperties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return properties.filter((p) => {
      if (filterBarangay && p.barangay !== filterBarangay) return false;
      if (filterClass && p.classification !== filterClass) return false;
      if (taxExemptOnly && !p.taxExempt) return false;

      if (!q) return true;

      const haystack = [
        p.pin,
        p.owner,
        p.address,
        p.barangay,
        p.classification,
        ...(p.spouseRelatives || []),
      ].join(' ').toLowerCase();

      return haystack.includes(q);
    });
  }, [searchQuery, filterBarangay, filterClass, taxExemptOnly]);

  useEffect(() => {
    if (selectedPin && !properties.some((p) => p.pin === selectedPin)) {
      setSelectedPin(null);
    }
  }, [selectedPin]);

  const details = useMemo(() => {
    if (!selectedPin) return null;
    const property = properties.find((p) => p.pin === selectedPin);
    if (!property) return null;

    const linked = properties.filter((p) => {
      if (p.pin === property.pin) return false;
      if (p.owner.toUpperCase() === property.owner.toUpperCase()) return true;
      const relatives = (property.spouseRelatives || []).map((r) => r.toUpperCase());
      return (p.spouseRelatives || []).some(
        (r) => relatives.includes(r.toUpperCase()) || r.toUpperCase() === property.owner.toUpperCase()
      );
    });

    return { property, linked, calc: computeTax(property, getTodayISO(), CURRENT_YEAR) };
  }, [selectedPin]);

  const filteredCollections = useMemo(() => {
    const q = collectionsQuery.trim().toLowerCase();
    return PAYMENTS.filter(
      (p) => !q || [p.or, p.pin, p.taxpayer, String(p.year)].join(' ').toLowerCase().includes(q)
    );
  }, [collectionsQuery]);

  const collectionsTotal = useMemo(
    () =>
      filteredCollections.reduce(
        (sum, p) => ({
          basic: sum.basic + p.basic,
          sef: sum.sef + p.sef,
          discount: sum.discount + p.discount,
          penalty: sum.penalty + p.penalty,
          total: sum.total + p.total,
        }),
        { basic: 0, sef: 0, discount: 0, penalty: 0, total: 0 }
      ),
    [filteredCollections]
  );

  const txPreview = useMemo(() => {
    if (!txPin) return null;
    const property = properties.find((p) => p.pin === txPin);
    return property ? { property, calc: computeTax(property, txDate || getTodayISO(), Number(txYear)) } : null;
  }, [properties, txPin, txDate, txYear]);

  const soaHistoryRows = useMemo(() => {
    if (!txPreview) return [];
    return Array.from({ length: 11 }, (_, index) => {
      const year = Number(txYear) - 5 + index;
      const payment = PAYMENTS.find((item) => item.pin === txPreview.property.pin && item.year === year);
      const calc = computeTax(txPreview.property, payment?.date || `${year}-12-31`, year);
      return { year, payment, calc };
    });
  }, [txPreview, txYear, paymentVersion]);

  const reportRows = useMemo(
    () => properties.map((property) => ({ property, calc: computeTax(property, reportTo || getTodayISO(), CURRENT_YEAR) })),
    [properties, reportTo]
  );

  const reportTaxNoPenalty = (calc) => (calc.exempt ? 0 : calc.basic + calc.sef - calc.discount);

  const filteredAssessmentChanges = useMemo(() => {
    if (!assessmentDate) return assessmentChanges;
    return assessmentChanges.filter((change) => change.changedAt.slice(0, 10) === assessmentDate);
  }, [assessmentChanges, assessmentDate]);

  const addAudit = (action, ref, remarks) => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setAuditLog((entries) => [{ ts: timestamp, user: user || 'system', action, ref, remarks }, ...entries]);
  };

  const saveRates = (event) => {
    event.preventDefault();
    const nextRates = Object.fromEntries(Object.entries(rateDraft).map(([key, value]) => [key, Number(value) / 100]));
    Object.assign(MASTER_DATA, nextRates);
    addAudit('MASTER_RATES_UPDATED', 'TAX_RATES', 'Tax rate and discount settings updated by system administrator.');
    setRequestError('Tax rates saved successfully. New calculations will use these settings.');
  };

  const toggleAdminUser = (username) => {
    setAdminUsers((items) => items.map((item) => item.username === username ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item));
    addAudit('USER_STATUS_UPDATED', username, 'Account status changed by system administrator.');
  };


  const buildSoa = () => {
    const nextErrors = {};
    if (!txPin) nextErrors.txPin = 'Select a property record.';
    if (!isValidISODate(txDate)) nextErrors.txDate = 'Enter a valid payment date.';
    if (isFutureDate(txDate)) nextErrors.txDate = 'Payment date cannot be in the future.';
    if (!Number.isInteger(Number(txYear)) || Number(txYear) < 2000 || Number(txYear) > CURRENT_YEAR) {
      nextErrors.txYear = 'Select a valid tax year.';
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length || !txPreview) return;

    runRequest('Generating statement', () => {
      setSoa({
        soaNo: `SOA-${Date.now().toString().slice(-8)}`,
        issueDate: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }),
        property: txPreview.property,
        calc: txPreview.calc,
        remarks: txRemarks.trim(),
      });
      addAudit('SOA_GENERATED', `PIN ${txPreview.property.pin}`, `Statement generated for TY ${txPreview.calc.taxYear}`);
    });
  };

  const recordPayment = () => {
    if (!soa || soa.calc.exempt || loading.action) return;
    if (!isValidISODate(soa.calc.paymentDate) || isFutureDate(soa.calc.paymentDate)) {
      setRequestError('This payment cannot be recorded because its date is invalid or future-dated.');
      return;
    }

    runRequest('Recording payment', () => {
      const duplicate = PAYMENTS.find((payment) => payment.pin === soa.property.pin && payment.year === soa.calc.taxYear);
      if (duplicate) {
        throw new Error(`A payment already exists for ${soa.property.pin} and tax year ${soa.calc.taxYear}.`);
      }
      const year = new Date().getFullYear();
      const sequence = PAYMENTS.filter((payment) => String(payment.or).startsWith(String(year))).length + 1;
      const payment = {
        or: `${year}-${String(sequence).padStart(4, '0')}`,
        date: soa.calc.paymentDate,
        pin: soa.property.pin,
        taxpayer: soa.property.owner,
        year: soa.calc.taxYear,
        basic: soa.calc.basic,
        sef: soa.calc.sef,
        discount: soa.calc.discount,
        penalty: soa.calc.penalty,
        total: soa.calc.total,
        encodedBy: user || 'Treasurer IT Staff',
        remarks: soa.remarks,
      };
      PAYMENTS = [...PAYMENTS, payment];
      setPaymentVersion((version) => version + 1);
      setReceipt(payment);
      setSoa(null);
      addAudit('PAYMENT_RECORDED', `OR ${payment.or}`, `${formatPeso(payment.total)} — PIN ${payment.pin} — TY ${payment.year}`);
      setView('collections');
    });
  };

  const generateReportNow = () => {
    const asOf = reportTo || getTodayISO();
    let output;

    if (reportType === 'certified' || reportType === 'certifiedNoPenalty') {
      const noPenalty = reportType === 'certifiedNoPenalty';
      output = {
        title: noPenalty ? 'Certified List (No Penalty)' : 'Certified List',
        subtitle: `All registered properties · Tax Year ${CURRENT_YEAR} · As of ${asOf}${noPenalty ? ' · Penalty excluded' : ''}`,
        columns: ['PIN', 'Owner', 'Location', 'Kind', 'Area', 'Taxability', noPenalty ? 'Tax Due (No Penalty)' : 'Total Tax Due'],
        rows: reportRows.map(({ property, calc }) => [property.pin, property.owner, property.location, property.kind, property.area, property.taxExempt ? 'Tax-Exempt' : 'Taxable', formatPeso(noPenalty ? reportTaxNoPenalty(calc) : calc.total)]),
        total: formatPeso(reportRows.reduce((sum, row) => sum + (noPenalty ? reportTaxNoPenalty(row.calc) : row.calc.total), 0)),
      };
    } else if (reportType === 'noticeDelinquency') {
      const rows = delinquentRows.map(({ property, calc }) => [property.pin, property.owner, property.location, property.kind, formatPeso(reportTaxNoPenalty(calc))]);
      output = {
        title: 'Notice of Delinquency (Less Penalty)',
        subtitle: `Tax Year ${CURRENT_YEAR} · As of ${asOf} · Amounts exclude accrued penalty`,
        columns: ['PIN', 'Owner', 'Location', 'Kind', 'Tax Due (Less Penalty)'],
        rows,
        total: formatPeso(delinquentRows.reduce((sum, row) => sum + reportTaxNoPenalty(row.calc), 0)),
      };
    } else if (reportType === 'listRPT') {
      const property = properties.find((item) => item.pin === reportPin);
      if (!property) return;
      const payments = PAYMENTS.filter((payment) => payment.pin === reportPin && payment.year === Number(reportYear));
      output = {
        title: 'List of RPT',
        subtitle: 'Real Property Tax Register Card',
        columns: ['Year', 'Basic/SEF', 'Discount/Penalty', 'Official Receipts', 'Date Paid', 'Amount Paid'],
        rows: [[String(reportYear), formatPeso(payments.reduce((sum, item) => sum + item.basic + item.sef, 0)), formatPeso(payments.reduce((sum, item) => sum + item.penalty - item.discount, 0)), payments.map((item) => item.or).join(', ') || '—', payments.map((item) => item.date).join(', ') || '—', formatPeso(payments.reduce((sum, item) => sum + item.total, 0))]],
        total: formatPeso(payments.reduce((sum, item) => sum + item.total, 0)),
        property,
      };
    } else if (reportType === 'certification' || reportType === 'certificationQuarter') {
      const property = properties.find((item) => item.pin === reportPin);
      if (!property) return;
      const calc = computeTax(property, asOf, reportType === 'certificationQuarter' ? Number(reportYear) : CURRENT_YEAR);
      const quarter = Number(reportQuarter);
      const range = [[1, 3], [4, 6], [7, 9], [10, 12]][quarter - 1];
      const match = PAYMENTS.find((payment) => {
        const month = new Date(`${payment.date}T00:00:00`).getMonth() + 1;
        return payment.pin === reportPin && payment.year === Number(reportYear) && reportType === 'certificationQuarter' && month >= range[0] && month <= range[1];
      });
      output = {
        title: reportType === 'certificationQuarter' ? 'Certification — Quarterly Payment Status' : 'Certification',
        subtitle: `${property.owner} · PIN ${property.pin}`,
        message: property.taxExempt
          ? 'This property is tax-exempt from Real Property Tax under Republic Act No. 7160.'
          : reportType === 'certificationQuarter'
            ? match ? `Paid under O.R. No. ${match.or} dated ${match.date}, in the amount of ${formatPeso(match.total)}.` : 'This quarter has not yet been paid.'
            : calc.total > 0 ? `Outstanding Real Property Tax obligation: ${formatPeso(calc.total)}.` : 'No outstanding Real Property Tax obligation.',
        property,
      };
    } else {
      output = { title: 'Statement of Account', subtitle: 'Use the Statement of Account form to generate a property-specific document.', message: 'Open Statement of Account from the navigation.' };
    }

    setReportOutput(output);
    addAudit('DOCUMENT_GENERATED', reportType.toUpperCase(), `As of ${asOf}`);
  };

  const generateReport = () => {
    const nextErrors = {};
    if (!isValidISODate(reportTo)) nextErrors.reportTo = 'Enter a valid report date.';
    if (isFutureDate(reportTo)) nextErrors.reportTo = 'Report date cannot be in the future.';
    if (['listRPT', 'certification', 'certificationQuarter'].includes(reportType) && !reportPin) {
      nextErrors.reportPin = 'Select a property record.';
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    runRequest('Generating report', generateReportNow);
  };

  const loginHandler = (event) => {
    event.preventDefault();
    const username = login.username.trim().toLowerCase();
    const password = login.password;

    if (!username || !password) {
      setError('Please complete the required fields.');
      setFieldErrors({
        loginUser: username ? '' : 'Username is required.',
        loginPass: password ? '' : 'Password is required.',
      });
      return;
    }

    const account = DEMO_USERS[username];
    const managedAccount = adminUsers.find((item) => item.username === username);
    if (!account || account.password !== password || managedAccount?.status === 'Inactive') {
      setError('Invalid username or password. Please try again.');
      setFieldErrors({ loginUser: 'Check your username and password.' });
      setLogin((s) => ({ ...s, password: '' }));
      return;
    }

    setError('');
    setFieldErrors({});
    runRequest('Signing in', () => {
      setUser(account.name);
      setUserRole(account.role || 'Treasurer IT Staff');
      setView(account.role === 'System Administrator' ? 'admin' : 'dashboard');
      setAppLoading(true);
    });
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setLogin({ username: '', password: '' });
    setError('');
    setFieldErrors({});
    setRequestError('');
    setAppLoading(false);
  };

  const pageMeta = {
    dashboard: ['Dashboard', 'Collection monitoring & transaction encoding'],
    search: ['Property & Taxpayer Search', 'Search PIN, owner, spouse or relative'],
    transaction: ['Statement of Account', 'Request form and automated tax computation'],
    collections: ['Collections', 'All recorded payments and official receipts'],
    reports: ['Reports', 'Certified lists, RPT register, notices, and certifications'],
    audit: ['Audit Trail', 'Remarks and change history'],
    assessments: ['Assessment Records', 'Read-only updates from the Assessor\'s Office'],
    admin: ['System Administration', 'Master data, users, roles, and audit controls'],
  };

  const renderView = () => {
    if (!user) {
      return (
        <div className="login" role="main">
          <div className="login__card">
            <div className="login__brand">
              <div className="seal" aria-hidden="true">LGU</div>
              <div>
                <h1>Real Property Tax Management System</h1>
                <p className="muted small">Municipality of Talisay &middot; Camarines Norte</p>
              </div>
            </div>

            <form className="form" onSubmit={loginHandler} noValidate>
              <div className="field">
                <label htmlFor="loginUser">Username</label>
                <input
                  id="loginUser"
                  className="input"
                  type="text"
                  placeholder="e.g. treasurer"
                  value={login.username}
                  onChange={(e) => setLogin((s) => ({ ...s, username: e.target.value }))}
                  required
                />
                <FieldError message={fieldErrors.loginUser} />
                <small className="field__help">Use your assigned LGU IT staff account.</small>
              </div>

              <div className="field">
                <label htmlFor="loginPass">Password</label>
                <div className="input-group">
                  <input
                    id="loginPass"
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={login.password}
                    onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                    required
                  />
                  <FieldError message={fieldErrors.loginPass} />
                  <button
                    type="button"
                    className="input-group__btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="form__error" role="alert">
                  {error}
                </div>
              ) : null}

              <button type="submit" className="btn btn--primary btn--block" disabled={loading.action === 'Signing in'}>
                Sign in to RPT System
              </button>

              <p className="form__hint">
                Staff demo: <b>treasurer</b> / <b>talisay123</b> · Admin: <b>admin</b> / <b>a123</b>
              </p>
            </form>
          </div>
          {loading.action ? <LoadingScreen progress={loading.progress} message={loading.action === 'Signing in' ? 'Signing in securely...' : `${loading.action}...`} /> : null}
        </div>
      );
    }

    return (
      <>
      <div className="app">
        <aside className={`sidebar ${sidebarOpen ? '' : 'is-collapsed'}`} aria-label="Main navigation">
          <div className="sidebar__brand">
            <div className="seal seal--sm" aria-hidden="true">LGU</div>
            <div>
              <b>RPT System</b>
              <span>Talisay, Cam. Norte</span>
            </div>
          </div>

          <div className="sidebar__office">
            <span className="dot" aria-hidden="true"></span> {userRole || "Treasurer's Office"}
          </div>

          <nav className="nav" aria-label="Main menu">
            {(userRole === 'System Administrator'
              ? [['admin', '⚙', 'System Administration']]
              : [
                ['dashboard', '▦', 'Dashboard'],
                ['search', '⌕', 'Property & Taxpayer Search'],
                ['transaction', '₱', 'Statement of Account'],
                ['collections', '▤', 'Collections'],
                ['reports', '▥', 'Reports'],
                ['audit', '✎', 'Audit Trail'],
                ['assessments', '▧', 'Assessment Records'],
              ]).map(([key, icon, label]) => (
              <button
                key={key}
                type="button"
                className={`nav__item ${view === key ? 'is-active' : ''}`}
                onClick={() => { setView(key); setSidebarOpen(false); }}
              >
                <span className="nav__ico" aria-hidden="true">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="sidebar__foot">
            <p>
              Assessment data is <b>read-only</b> — maintained by the Assessor's Office.
            </p>
          </div>
        </aside>

        <main className="main" id="mainContent">
          <header className="topbar">
            <div className="topbar__left">
              <button
                type="button"
                className="icon-btn"
                aria-label="Toggle navigation menu"
                onClick={() => setSidebarOpen((open) => !open)}
              >
                ☰
              </button>
              <div>
                <h1>{pageMeta[view][0]}</h1>
                <span className="muted small">{pageMeta[view][1]}</span>
              </div>
            </div>

            <div className="topbar__right">
              <div className="clock" aria-live="off">{clock}</div>
              <div className="user">
                <span className="user__avatar" aria-hidden="true">{user ? user.charAt(0).toUpperCase() : 'T'}</span>
                <div className="user__meta">
                  <b>{user || '—'}</b>
                  <span className="muted small">{userRole || "Treasurer's Office"}</span>
                </div>
              </div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>Sign out</button>
            </div>
          </header>

          <div className="content">
            {requestError ? <div className="form__error" role="alert">{requestError}</div> : null}
            {view === 'admin' && userRole === 'System Administrator' && (
              <section className="view is-active" aria-labelledby="adminTitle">
                <div className="admin-banner">
                  <div>
                    <span className="eyebrow">CONTROL CENTER</span>
                    <h2 id="adminTitle">System Administrator Console</h2>
                    <p className="muted">Manage the configuration and access that power the assessment-to-collection workflow.</p>
                  </div>
                  <span className="badge badge--advance">Administrator access</span>
                </div>

                <div className="stats stats--admin">
                  <div className="stat"><div className="stat__label">Active user accounts</div><div className="stat__value">{adminUsers.filter((item) => item.status === 'Active').length}</div><div className="stat__sub">of {adminUsers.length} configured accounts</div></div>
                  <div className="stat"><div className="stat__label">Basic RPT rate</div><div className="stat__value">{Number(rateDraft.basicRate).toFixed(2)}%</div><div className="stat__sub">Applied to assessed value</div></div>
                  <div className="stat"><div className="stat__label">SEF rate</div><div className="stat__value">{Number(rateDraft.sefRate).toFixed(2)}%</div><div className="stat__sub">Special Education Fund</div></div>
                  <div className="stat"><div className="stat__label">Audit entries</div><div className="stat__value">{auditLog.length}</div><div className="stat__sub">Recorded system activity</div></div>
                </div>

                <div className="grid grid--2">
                  <form className="card" onSubmit={saveRates}>
                    <div className="card__head"><div><h3>Tax rates &amp; policy</h3><p className="muted small">Changes apply to new calculations immediately.</p></div><span className="admin-card-icon">%</span></div>
                    <div className="admin-form-grid">
                      {[
                        ['basicRate', 'Basic RPT rate'],
                        ['sefRate', 'SEF rate'],
                        ['discountAdvance', 'Advance payment discount'],
                        ['discountQ1', 'Q1 payment discount'],
                        ['penaltyPerMonth', 'Monthly penalty rate'],
                      ].map(([key, label]) => (
                        <div className="field" key={key}>
                          <label htmlFor={`rate-${key}`}>{label}</label>
                          <div className="input-suffix"><input id={`rate-${key}`} type="number" min="0" max="100" step="0.01" value={rateDraft[key]} onChange={(event) => setRateDraft((draft) => ({ ...draft, [key]: event.target.value }))} /><span>%</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="btn-row"><button type="submit" className="btn btn--primary">Save tax settings</button><button type="button" className="btn btn--ghost" onClick={() => setRateDraft({ basicRate: MASTER_DATA.basicRate * 100, sefRate: MASTER_DATA.sefRate * 100, discountAdvance: MASTER_DATA.discountAdvance * 100, discountQ1: MASTER_DATA.discountQ1 * 100, penaltyPerMonth: MASTER_DATA.penaltyPerMonth * 100 })}>Reset</button></div>
                  </form>

                  <div className="card">
                    <div className="card__head"><div><h3>User &amp; role management</h3><p className="muted small">Control who can access the RPT system.</p></div><span className="admin-card-icon">✓</span></div>
                    <div className="admin-users">
                      {adminUsers.map((item) => (
                        <div className="admin-user" key={item.username}>
                          <span className="user__avatar">{item.username.charAt(0).toUpperCase()}</span>
                          <div className="admin-user__meta"><b>{item.name}</b><span className="muted small">@{item.username} · {item.role}</span></div>
                          <button type="button" className={`badge ${item.status === 'Active' ? 'badge--paid' : 'badge--unpaid'} admin-status`} onClick={() => item.username !== 'admin' && toggleAdminUser(item.username)} disabled={item.username === 'admin'}>{item.status}</button>
                        </div>
                      ))}
                    </div>
                    <p className="field__help admin-note">The administrator account cannot be disabled from this prototype.</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card__head"><div><h3>Recent administrative activity</h3><p className="muted small">Configuration changes are recorded in the audit trail.</p></div><button type="button" className="btn btn--ghost btn--sm" onClick={() => setView('audit')}>Open full audit trail</button></div>
                  <div className="table-wrap"><table className="table"><thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Reference</th><th>Remarks</th></tr></thead><tbody>{auditLog.filter((entry) => entry.user === 'admin' || entry.action.includes('MASTER') || entry.action.includes('USER_')).slice(0, 5).map((entry, index) => <tr key={`${entry.ts}-${index}`}><td className="mono">{entry.ts}</td><td>{entry.user}</td><td><span className="badge badge--advance">{entry.action}</span></td><td>{entry.ref}</td><td>{entry.remarks}</td></tr>)}{!auditLog.some((entry) => entry.user === 'admin' || entry.action.includes('MASTER') || entry.action.includes('USER_')) ? <tr><td colSpan="5" className="empty">No administrative changes recorded yet.</td></tr> : null}</tbody></table></div>
                </div>
              </section>
            )}
            {view === 'dashboard' && (
              <section className="view is-active" aria-labelledby="pageTitle">
                <div className="stats">
                  {stats.map((stat) => (
                    <div key={stat.label} className={`stat ${stat.className}`}>
                      <div className="stat__label">{stat.label}</div>
                      <div className="stat__value">{stat.value}</div>
                      <div className="stat__sub">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid--2">
                  <div className="card">
                    <div className="card__head">
                      <h3>Recent Transactions</h3>
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setView('collections')}>
                        View all
                      </button>
                    </div>
                    <div className="table-wrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">OR No.</th>
                            <th scope="col">Date</th>
                            <th scope="col">PIN</th>
                            <th scope="col">Taxpayer</th>
                            <th scope="col" className="ta-r">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions.map((row) => (
                            <tr key={row.or}>
                              <td className="mono">{row.or}</td>
                              <td>{row.date}</td>
                              <td className="mono">{row.pin}</td>
                              <td>{row.taxpayer}</td>
                              <td className="ta-r"><b>{formatPeso(row.total)}</b></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card__head">
                      <h3>Collections by Barangay</h3>
                    </div>
                    <div className="chart">
                      {barangayTotals.map(([barangay, amount]) => {
                        const max = Math.max(...barangayTotals.map(([, value]) => value));
                        return (
                          <div key={barangay} className="chart__row">
                            <span>{barangay}</span>
                            <div className="chart__bar">
                              <div className="chart__fill" style={{ width: `${(amount / max) * 100}%` }} />
                            </div>
                            <span className="chart__val">{formatPesoSimple(amount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card__head">
                    <h3>Delinquent / Unpaid Properties</h3>
                    <span className="muted small">Tax Year {CURRENT_YEAR}</span>
                  </div>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">PIN</th>
                          <th scope="col">Owner</th>
                          <th scope="col">Barangay</th>
                          <th scope="col">Classification</th>
                          <th scope="col" className="ta-r">Assessed Value</th>
                          <th scope="col" className="ta-r">Total Tax Due</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {delinquentRows.length ? (
                          delinquentRows.map(({ property, calc }) => (
                            <tr key={property.pin}>
                              <td className="mono">{property.pin}</td>
                              <td>{property.owner}</td>
                              <td>{property.barangay}</td>
                              <td>{property.classification}</td>
                              <td className="ta-r">{formatPeso(calc.assessedValue)}</td>
                              <td className="ta-r"><b>{formatPeso(calc.total)}</b></td>
                              <td><span className="badge badge--unpaid">UNPAID</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="empty">All taxable properties have recorded payments. 🎉</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {view === 'search' && (
              <section className="view is-active">
                <div className="grid grid--split">
                  <div className="card">
                    <div className="card__head">
                      <h3>Property / Owner Records</h3>
                      <span className="muted small" aria-live="polite">{filteredProperties.length} records</span>
                    </div>

                    <div className="filters">
                      <div className="field field--inline">
                        <label className="sr-only" htmlFor="searchInput">Search records</label>
                        <input
                          id="searchInput"
                          type="search"
                          className="input"
                          placeholder="Search by PIN, owner name, spouse / relative…"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="field field--inline">
                        <label className="sr-only" htmlFor="filterBarangay">Filter by barangay</label>
                        <select id="filterBarangay" className="input" value={filterBarangay} onChange={(e) => setFilterBarangay(e.target.value)}>
                          <option value="">All Barangays</option>
                          {allBarangays.map((barangay) => (
                            <option key={barangay} value={barangay}>{barangay}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field field--inline">
                        <label className="sr-only" htmlFor="filterClass">Filter by classification</label>
                        <select id="filterClass" className="input" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                          <option value="">All Classifications</option>
                          {allClasses.map((classification) => (
                            <option key={classification} value={classification}>{classification}</option>
                          ))}
                        </select>
                      </div>

                      <label className="check">
                        <input type="checkbox" checked={taxExemptOnly} onChange={(e) => setTaxExemptOnly(e.target.checked)} />
                        Tax-exempt only
                      </label>
                      <LoadingButton
                        type="button"
                        className="btn btn--primary btn--sm"
                        loading={loading.action === 'Searching properties'}
                        progress={loading.progress}
                        onClick={() => runRequest('Searching properties', () => addAudit('PROPERTY_SEARCH', searchQuery || 'ALL', `${filteredProperties.length} records matched.`))}
                      >
                        Search records
                      </LoadingButton>
                    </div>

                    <div className="table-wrap table-wrap--tall">
                      <table className="table table--hover">
                        <thead>
                          <tr>
                            <th scope="col">PIN</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Barangay</th>
                            <th scope="col">Class</th>
                            <th scope="col" className="ta-r">Assessed Value</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading.action === 'Searching properties' ? (
                            <tr><td colSpan="6" className="skeleton-row">Loading property records...</td></tr>
                          ) : filteredProperties.map((property) => {
                            const assessed = property.fairMarketValue * property.assessmentLevel;
                            return (
                              <tr
                                key={property.pin}
                                data-pin={property.pin}
                                className={selectedPin === property.pin ? 'is-selected' : ''}
                                onClick={() => setSelectedPin(property.pin)}
                              >
                                <td className="mono">{property.pin}</td>
                                <td>{property.owner}</td>
                                <td>{property.barangay}</td>
                                <td>{property.classification}</td>
                                <td className="ta-r">{formatPesoSimple(assessed)}</td>
                                <td>{property.taxExempt ? <span className="badge badge--exempt">EXEMPT</span> : <span className="badge badge--unpaid">TAXABLE</span>}</td>
                              </tr>
                            );
                          })}
                          {!loading.action && !filteredProperties.length ? <tr><td colSpan="6" className="empty">No property record was found. Check the PIN or taxpayer name.</td></tr> : null}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card" aria-live="polite">
                    {details ? (
                      <div className="detail">
                        <h4>Property Record</h4>
                        <dl className="dl">
                          <dt>PIN</dt><dd className="mono">{details.property.pin}</dd>
                          <dt>Owner</dt><dd>{details.property.owner}</dd>
                          <dt>Address</dt><dd>{details.property.address}</dd>
                          <dt>Barangay</dt><dd>{details.property.barangay}</dd>
                          <dt>Classification</dt><dd>{details.property.classification}</dd>
                        </dl>
                        {details.property.spouseRelatives && details.property.spouseRelatives.length ? (
                          <div className="owner-chips">
                            {details.property.spouseRelatives.map((relative) => (
                              <span key={relative} className="chip">{relative}</span>
                            ))}
                          </div>
                        ) : null}

                        <h4>Assessment (from Assessor's Office)</h4>
                        <dl className="dl">
                          <dt>Fair Market Value</dt><dd>{formatPeso(details.property.fairMarketValue)}</dd>
                          <dt>Assessment Level</dt><dd>{(details.property.assessmentLevel * 100).toFixed(0)}%</dd>
                          <dt>Assessed Value</dt><dd><b>{formatPeso(details.calc.assessedValue)}</b></dd>
                        </dl>

                        <h4>Computed Tax — {CURRENT_YEAR}</h4>
                        {details.calc.exempt ? (
                          <div className="soa__exempt">This property is <b>tax-exempt</b>. No tax is due.</div>
                        ) : (
                          <>
                            <dl className="dl">
                              <dt>Basic RPT Tax</dt><dd>{formatPeso(details.calc.basic)}</dd>
                              <dt>SEF Tax</dt><dd>{formatPeso(details.calc.sef)}</dd>
                              <dt>Penalty ({details.calc.penaltyLabel})</dt><dd>{formatPeso(details.calc.penalty)}</dd>
                            </dl>
                            <div className="comp-row comp-row--total" style={{ marginTop: 10 }}>
                              <span>Total Tax Due</span>
                              <span>{formatPeso(details.calc.total)}</span>
                            </div>
                          </>
                        )}

                        {details.linked.length ? (
                          <div className="detail">
                            <h4>Other Properties Under This Owner / Relative ({details.linked.length})</h4>
                            <div className="linked-list">
                              {details.linked.map((item) => (
                                <div key={item.pin} className="linked-item" onClick={() => setSelectedPin(item.pin)}>
                                  <div>
                                    <b>{item.owner}</b>
                                    <span className="mono">{item.pin} · {item.barangay}</span>
                                  </div>
                                  <span className={`badge ${item.taxExempt ? 'badge--exempt' : 'badge--unpaid'}`}>
                                    {item.taxExempt ? 'EXEMPT' : 'TAXABLE'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="empty">
                        <div className="empty__ico" aria-hidden="true">⌕</div>
                        <b>No record selected</b>
                        <p>Select a property from the list to view owner details, assessment data, and all linked properties.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {view === 'collections' && (
              <section className="view is-active">
                <div className="card">
                  <div className="card__head">
                    <h3>Recorded Payments / Collections</h3>
                    <div className="field field--inline">
                      <label className="sr-only" htmlFor="colSearch">Filter collections</label>
                      <input
                        id="colSearch"
                        type="search"
                        className="input input--sm"
                        placeholder="Filter by OR, PIN, owner…"
                        value={collectionsQuery}
                        onChange={(e) => setCollectionsQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="table-wrap table-wrap--tall">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">OR No.</th>
                          <th scope="col">Date</th>
                          <th scope="col">PIN</th>
                          <th scope="col">Taxpayer</th>
                          <th scope="col">Yr</th>
                          <th scope="col" className="ta-r">Basic</th>
                          <th scope="col" className="ta-r">SEF</th>
                          <th scope="col" className="ta-r">Disc.</th>
                          <th scope="col" className="ta-r">Penalty</th>
                          <th scope="col" className="ta-r">Total Paid</th>
                          <th scope="col">Encoded By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCollections.map((p) => (
                          <tr key={p.or}>
                            <td className="mono">{p.or}</td>
                            <td>{p.date}</td>
                            <td className="mono">{p.pin}</td>
                            <td>{p.taxpayer}</td>
                            <td>{p.year}</td>
                            <td className="ta-r">{formatPeso(p.basic)}</td>
                            <td className="ta-r">{formatPeso(p.sef)}</td>
                            <td className="ta-r">−{formatPeso(p.discount)}</td>
                            <td className="ta-r">+{formatPeso(p.penalty)}</td>
                            <td className="ta-r"><b>{formatPeso(p.total)}</b></td>
                            <td>{p.encodedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="5">TOTAL ({filteredCollections.length} transaction{filteredCollections.length !== 1 ? 's' : ''})</td>
                          <td className="ta-r">{formatPeso(collectionsTotal.basic)}</td>
                          <td className="ta-r">{formatPeso(collectionsTotal.sef)}</td>
                          <td className="ta-r">−{formatPeso(collectionsTotal.discount)}</td>
                          <td className="ta-r">+{formatPeso(collectionsTotal.penalty)}</td>
                          <td className="ta-r">{formatPeso(collectionsTotal.total)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {view === 'transaction' && (
              <section className="view is-active">
                <div className="grid grid--2">
                  <div className="card">
                    <div className="card__head">
                      <h3>Statement of Account — Request Form</h3>
                      <span className="step-pill">Step 1 of 2</span>
                    </div>

                    <div className="field">
                      <label htmlFor="txPin">Property Record (PIN — Owner)</label>
                      <select id="txPin" className="input" value={txPin} onChange={(e) => setTxPin(e.target.value)}>
                        <option value="">— Select a property record —</option>
                        {properties.map((property) => (
                          <option key={property.pin} value={property.pin}>{property.pin} — {property.owner}</option>
                        ))}
                      </select>
                      <FieldError message={fieldErrors.txPin} />
                    </div>

                    <div className="grid grid--2 grid--tight">
                      <div className="field">
                        <label htmlFor="txYear">Tax Year</label>
                        <select id="txYear" className="input" value={txYear} onChange={(e) => setTxYear(Number(e.target.value))}>
                          {Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <FieldError message={fieldErrors.txYear} />
                      </div>

                      <div className="field">
                        <label htmlFor="txDate">Payment Date</label>
                          <input id="txDate" type="date" className="input" value={txDate} onChange={(e) => setTxDate(e.target.value)} />
                          <FieldError message={fieldErrors.txDate} />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="txRemarks">Remarks / Notes</label>
                      <textarea id="txRemarks" className="input" rows="3" placeholder="e.g. Paid at counter by authorized representative…" value={txRemarks} onChange={(e) => setTxRemarks(e.target.value)}></textarea>
                    </div>

                    <div className="btn-row">
                      <LoadingButton type="button" className="btn btn--primary" onClick={buildSoa} disabled={!txPreview} loading={loading.action === 'Generating statement'} progress={loading.progress}>
                        Generate Statement of Account
                      </LoadingButton>
                      <button type="button" className="btn btn--ghost" onClick={() => { setTxPin(''); setTxYear(CURRENT_YEAR); setTxDate(getTodayISO()); setTxRemarks(''); }}>Clear form</button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card__head">
                      <h3>Automated Tax Computation</h3>
                      <span className="badge badge--advance">Live preview</span>
                    </div>
                    <div className="prop-mini">
                      {txPreview ? <><b>{txPreview.property.owner}</b><div className="mono muted">{txPreview.property.pin} · {txPreview.property.barangay}</div><div style={{ marginTop: 6 }}>FMV <b>{formatPeso(txPreview.property.fairMarketValue)}</b> × {(txPreview.property.assessmentLevel * 100).toFixed(0)}% = <b>{formatPeso(txPreview.calc.assessedValue)}</b></div></> : <p className="muted">Select a property to preview the computation.</p>}
                    </div>
                    {txPreview ? (
                      <div className="computation">
                        {txPreview.calc.exempt ? <div className="soa__exempt">This property is <b>tax-exempt</b> under RA 7160. No tax is due.</div> : <>
                          <div className="comp-row comp-row--sub"><span>Assessed Value</span><span>{formatPeso(txPreview.calc.assessedValue)}</span></div>
                          <div className="comp-row"><span>Basic RPT Tax (1%)</span><span>{formatPeso(txPreview.calc.basic)}</span></div>
                          <div className="comp-row"><span>SEF Tax</span><span>{formatPeso(txPreview.calc.sef)}</span></div>
                          <div className="comp-row comp-row--discount"><span>Discount — {txPreview.calc.discountLabel}</span><span>− {formatPeso(txPreview.calc.discount)}</span></div>
                          <div className="comp-row comp-row--penalty"><span>Penalty — {txPreview.calc.penaltyLabel}</span><span>+ {formatPeso(txPreview.calc.penalty)}</span></div>
                          <div className="comp-row comp-row--total"><span>Total Tax Due</span><span>{formatPeso(txPreview.calc.total)}</span></div>
                        </>}
                      </div>
                    ) : null}
                  </div>
                </div>
                {txPreview ? (
                  <div className="card soa-page-history">
                    <div className="card__head">
                      <div>
                        <h3>Past and Following Tax Years</h3>
                        <span className="muted small">Record preview for {txPreview.property.owner}</span>
                      </div>
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>Print preview</button>
                    </div>
                    <div className="soa-register-wrap">
                      <div className="soa-register-property">
                        <div><b>PROPERTY NAME</b><span>{txPreview.property.owner}</span></div>
                        <div><b>PIN</b><span className="mono">{txPreview.property.pin}</span></div>
                        <div><b>ADDRESS</b><span>{txPreview.property.address}</span></div>
                        <div><b>AREA</b><span>{txPreview.property.area}</span></div>
                      </div>
                      <table className="soa-register">
                        <thead><tr><th>ARP No.</th><th>Location</th><th>Kind</th><th>Assessed Value</th><th>Year</th><th>Basic</th><th>SEF</th><th>Penalty</th><th>Total</th></tr></thead>
                        <tbody>{soaHistoryRows.map(({ year, payment, calc }) => <tr key={year}><td className="mono">{txPreview.property.arpNo || `ARP-${txPreview.property.pin}`}</td><td>{txPreview.property.location}</td><td>{txPreview.property.kind}</td><td className="ta-r">{formatPeso(calc.assessedValue)}</td><td>{year}</td><td className="ta-r">{formatPeso(payment ? payment.basic : calc.basic)}</td><td className="ta-r">{formatPeso(payment ? payment.sef : calc.sef)}</td><td className="ta-r">{formatPeso(payment ? payment.penalty : calc.penalty)}</td><td className="ta-r"><b>{formatPeso(payment ? payment.total : calc.total)}</b></td></tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </section>
            )}

            {view === 'reports' && (
              <section className="view is-active">
                <div className="card no-print">
                  <div className="card__head"><h3>Report Generation</h3></div>
                  <div className="grid grid--3 grid--tight">
                    <div className="field">
                      <label htmlFor="reportType">Document / Report</label>
                        <select id="reportType" className="input" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="certified">Certified List</option>
                        <option value="certifiedNoPenalty">Certified List (No Penalty)</option>
                        <option value="listRPT">List of RPT</option>
                        <option value="noticeDelinquency">Notice of Delinquency (Less Penalty)</option>
                        <option value="soa">Statement of Account</option>
                        <option value="certification">Certification</option>
                          <option value="certificationQuarter">Certification (Quarterly)</option>
                      </select>
                    </div>
                      <div className="field">
                        <label htmlFor="reportTo">Date To / As of</label>
                        <input id="reportTo" type="date" className="input" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
                        <FieldError message={fieldErrors.reportTo} />
                      </div>
                      {['listRPT', 'certification', 'certificationQuarter'].includes(reportType) ? (
                        <div className="field">
                          <label htmlFor="reportPin">Property Record (PIN — Owner)</label>
                          <select id="reportPin" className="input" value={reportPin} onChange={(e) => setReportPin(e.target.value)}>
                            <option value="">— Select a property record —</option>
                            {properties.map((property) => <option key={property.pin} value={property.pin}>{property.pin} — {property.owner}</option>)}
                          </select>
                          <FieldError message={fieldErrors.reportPin} />
                        </div>
                      ) : null}
                      {['listRPT', 'certificationQuarter'].includes(reportType) ? (
                        <div className="field">
                          <label htmlFor="reportYear">Tax Year</label>
                          <select id="reportYear" className="input" value={reportYear} onChange={(e) => setReportYear(Number(e.target.value))}>
                            {Array.from({ length: 6 }, (_, index) => CURRENT_YEAR - index).map((year) => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>
                      ) : null}
                      {reportType === 'certificationQuarter' ? (
                        <div className="field">
                          <label htmlFor="reportQuarter">Quarter</label>
                          <select id="reportQuarter" className="input" value={reportQuarter} onChange={(e) => setReportQuarter(Number(e.target.value))}>
                            <option value="1">1st Quarter (Jan–Mar)</option>
                            <option value="2">2nd Quarter (Apr–Jun)</option>
                            <option value="3">3rd Quarter (Jul–Sep)</option>
                            <option value="4">4th Quarter (Oct–Dec)</option>
                          </select>
                        </div>
                      ) : null}
                  </div>
                  <div className="btn-row">
                    <LoadingButton type="button" className="btn btn--primary" onClick={generateReport} loading={loading.action === 'Generating report'} progress={loading.progress}>Generate</LoadingButton>
                    <button type="button" className="btn btn--ghost" onClick={() => window.print()}>Print</button>
                  </div>
                </div>
                  <div className="card" aria-live="polite">
                    {reportOutput ? (
                      <div className="soa">
                        <div className="soa__head">
                          <div className="seal" aria-hidden="true">LGU</div>
                          <div className="soa__head-text"><div className="rep">Republic of the Philippines</div><div className="muni">PROVINCE OF CAMARINES NORTE</div><div className="muni">MUNICIPALITY OF TALISAY</div><div className="office">OFFICE OF THE MUNICIPAL TREASURER</div></div>
                        </div>
                        <div className="soa__title">{reportOutput.title}</div>
                        <p className="muted small" style={{ textAlign: 'center' }}>{reportOutput.subtitle}</p>
                        {reportOutput.property ? <div className="soa__meta"><div><b>PIN</b><span className="mono">{reportOutput.property.pin}</span></div><div><b>Owner</b><span>{reportOutput.property.owner}</span></div><div><b>Location</b><span>{reportOutput.property.location}</span></div><div><b>Area</b><span>{reportOutput.property.area}</span></div></div> : null}
                        {reportOutput.message ? <p style={{ margin: '18px 0', lineHeight: 1.7 }}>{reportOutput.message}</p> : null}
                        {reportOutput.columns ? <div className="table-wrap"><table className="table"><thead><tr>{reportOutput.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{reportOutput.rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className={cellIndex === 0 ? 'mono' : cellIndex === row.length - 1 ? 'ta-r' : ''}>{cell}</td>)}</tr>)}</tbody><tfoot><tr><td colSpan={Math.max(1, reportOutput.columns.length - 1)}><b>TOTAL</b></td><td className="ta-r"><b>{reportOutput.total}</b></td></tr></tfoot></table></div> : null}
                        <div className="soa__sign"><div><div className="line">Prepared by — Treasurer's Office IT Staff</div></div><div><div className="line">Certified correct — Municipal Treasurer</div></div></div>
                      </div>
                    ) : (
                      <div className="empty"><div className="empty__ico" aria-hidden="true">▥</div><b>No report generated</b><p>Choose a report type and click Generate.</p></div>
                    )}
                  </div>
              </section>
            )}

            {view === 'assessments' && (
                <section className="view is-active">
                  <div className="card">
                    <div className="card__head">
                      <div>
                        <h3>Assessment Change Feed</h3>
                        <span className="muted small">Read-only feed from the Assessor's Office</span>
                      </div>
                      <span className="badge badge--paid">LIVE SYNC ENABLED</span>
                    </div>
                    <p className="assessment-note">
                      Changes to Fair Market Value, Assessment Level, classification, ownership, and related assessment fields appear here automatically. Treasurer users cannot edit assessment records.
                    </p>
                    <div className="assessment-filters">
                      <div className="field field--inline">
                        <label htmlFor="assessmentDate">Filter by date</label>
                        <input id="assessmentDate" type="date" className="input" value={assessmentDate} onChange={(event) => setAssessmentDate(event.target.value)} />
                      </div>
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAssessmentDate('')}>Show all dates</button>
                      <span className="muted small">{filteredAssessmentChanges.length} change{filteredAssessmentChanges.length === 1 ? '' : 's'} shown</span>
                    </div>
                    <div className="table-wrap table-wrap--tall">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Changed</th>
                            <th>PIN</th>
                            <th>Owner</th>
                            <th>Change Type</th>
                            <th>Field</th>
                            <th>Previous</th>
                            <th>New Value</th>
                            <th>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssessmentChanges.map((change) => (
                            <tr key={change.id}>
                              <td className="mono">{change.changedAt}</td>
                              <td className="mono">{change.pin}</td>
                              <td>{change.owner}</td>
                              <td><span className="badge badge--advance">{change.changeType}</span></td>
                              <td>{change.field}</td>
                              <td>{change.previousValue}</td>
                              <td><b>{change.newValue}</b></td>
                              <td>{change.changedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card__head">
                      <div>
                        <h3>Record of Assessment</h3>
                        <span className="muted small">Read-only register received from the Assessor's Office</span>
                      </div>
                      <span className="badge badge--paid">READ-ONLY</span>
                    </div>
                    <div className="table-wrap table-wrap--tall">
                      <table className="table assessment-register">
                        <thead><tr><th>Date</th><th>ARP No.</th><th>Index No.</th><th>Barangay</th><th>Name of Owner</th><th>PIN</th><th>Classification</th><th>Land Area</th><th>Market Value</th><th>Assessed Value</th><th>Tax Code</th><th>Remark</th></tr></thead>
                        <tbody>{properties.map((property) => <tr key={property.pin}><td>{assessmentChanges.find((change) => change.pin === property.pin)?.changedAt.slice(0, 10) || '—'}</td><td className="mono">{property.arpNo || `ARP-${property.pin}`}</td><td className="mono">{property.indexNo || `IDX-${property.pin}`}</td><td>{property.barangay}</td><td>{property.owner}</td><td className="mono">{property.pin}</td><td>{property.classification}</td><td>{property.area}</td><td className="ta-r">{formatPeso(property.fairMarketValue)}</td><td className="ta-r"><b>{formatPeso(property.fairMarketValue * property.assessmentLevel)}</b></td><td>{property.taxExempt ? 'EXEMPT' : property.cd1 || 'TAXABLE'}</td><td>{property.remarks || '—'}</td></tr>)}</tbody>
                      </table>
                    </div>
                  </div>

                </section>
              )}

              {view === 'audit' && (
              <section className="view is-active">
                <div className="card">
                  <div className="card__head">
                    <h3>Audit Trail / Remarks Log</h3>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAuditLog([])}>Clear log</button>
                  </div>
                  <div className="table-wrap table-wrap--tall">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Timestamp</th>
                          <th scope="col">User</th>
                          <th scope="col">Action</th>
                          <th scope="col">Ref.</th>
                          <th scope="col">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLog.length ? (
                          auditLog.map((entry, index) => (
                            <tr key={`${entry.ts}-${index}`}>
                              <td className="mono">{entry.ts}</td>
                              <td>{entry.user}</td>
                              <td><span className="badge badge--advance">{entry.action}</span></td>
                              <td className="mono">{entry.ref}</td>
                              <td>{entry.remarks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="empty">No audit entries yet.</td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

              {view === 'uiflow' && (
                <section className="view is-active">
                  <div className="card">
                    <div className="card__head"><h3>Proposed User Interface Flow — Treasurer's Office</h3><span className="muted small">Wireframe / navigation map</span></div>
                    <div className="flow">
                      {[
                        ['1', 'LOGIN', 'Username · Password · Validation'],
                        ['2', 'DASHBOARD', 'Stats · Recent · Delinquent'],
                        ['3', 'SEARCH', 'PIN · Owner · Spouse/Relative'],
                        ['4', 'PROPERTY DETAIL', 'Assessment · Linked properties'],
                        ['5', 'SOA REQUEST FORM', 'Property · Year · Date · Remarks'],
                        ['6', 'LIVE COMPUTATION', 'Basic · SEF · Discount · Penalty'],
                        ['7', 'SOA PREVIEW', 'Printable statement'],
                        ['8', 'CONFIRM PAYMENT?', 'Yes → Record OR · No → Back'],
                        ['9', 'CONFIRMATION', 'OR Number · Receipt'],
                        ['10', 'COLLECTIONS LOG', 'All recorded payments'],
                        ['11', 'REPORTS', 'Collection · Delinquent · Summary'],
                        ['12', 'AUDIT TRAIL', 'Remarks · Change history'],
                      ].map(([number, title, description]) => <div className="flow__node" key={number}><span className="flow__num">{number}</span><b>{title}</b><small>{description}</small></div>)}
                    </div>
                  </div>
                </section>
              )}
          </div>
        </main>
      </div>
      {soa ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="soaTitle">
          <div className="modal__backdrop" onClick={() => setSoa(null)} />
          <div className="modal__box">
            <div className="modal__actions no-print">
              <span className="muted small">Statement of Account — preview</span>
              <div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSoa(null)}>Close</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>Print SOA</button>
                <LoadingButton type="button" className="btn btn--primary btn--sm" onClick={recordPayment} loading={loading.action === 'Recording payment'} progress={loading.progress}>Record Payment &amp; Issue OR</LoadingButton>
              </div>
            </div>
            <div className="soa">
              <div className="soa__head"><div className="seal" aria-hidden="true">LGU</div><div className="soa__head-text"><div className="rep">Republic of the Philippines</div><div className="muni">PROVINCE OF CAMARINES NORTE</div><div className="muni">MUNICIPALITY OF TALISAY</div><div className="office">OFFICE OF THE MUNICIPAL TREASURER</div></div></div>
              <div className="soa__title" id="soaTitle">STATEMENT OF ACCOUNT</div>
              <div className="soa__meta"><div><b>SOA No.</b><span className="mono">{soa.soaNo}</span></div><div><b>Date Issued</b><span>{soa.issueDate}</span></div><div><b>Property PIN</b><span className="mono">{soa.property.pin}</span></div><div><b>Tax Year</b><span>{soa.calc.taxYear}</span></div><div><b>Owner</b><span>{soa.property.owner}</span></div><div><b>Barangay</b><span>{soa.property.barangay}</span></div><div><b>Location</b><span>{soa.property.address}</span></div><div><b>Classification</b><span>{soa.property.classification}</span></div><div><b>Payment Date</b><span>{soa.calc.paymentDate}</span></div><div><b>Assessed Value</b><span>{formatPeso(soa.calc.assessedValue)}</span></div></div>
              <div className="soa__note"><b>Note:</b> Please bring this Statement of Account when paying at the Municipal Treasurer's Office. Payments must be made on or before the deadline to avoid the 2% monthly penalty.{soa.remarks ? <><br /><b>Remarks:</b> {soa.remarks}</> : null}</div>
              <div className="soa__sign"><div><div className="line">Prepared by — Treasurer's Office IT Staff</div></div><div><div className="line">Approved by — Municipal Treasurer</div></div></div>
            </div>
          </div>
        </div>
      ) : null}
      {receipt ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="receiptTitle">
          <div className="modal__backdrop" onClick={() => setReceipt(null)} />
          <div className="modal__box modal__box--sm">
            <div className="modal__actions no-print"><span className="muted small">Official Receipt</span><div><button type="button" className="btn btn--ghost btn--sm" onClick={() => setReceipt(null)}>Close</button><button type="button" className="btn btn--ghost btn--sm" onClick={() => window.print()}>Print Receipt</button><button type="button" className="btn btn--primary btn--sm" onClick={() => { setReceipt(null); setView('transaction'); }}>New Transaction</button></div></div>
            <div className="receipt"><div className="receipt__check" aria-hidden="true">✓</div><div className="receipt__title" id="receiptTitle">Payment Recorded Successfully</div><div className="receipt__sub">Official Receipt generated on {new Date().toLocaleString('en-PH')}</div><div className="receipt__or"><span>Official Receipt No.</span><b>{receipt.or}</b></div><dl className="dl"><dt>Property PIN</dt><dd className="mono">{receipt.pin}</dd><dt>Taxpayer</dt><dd>{receipt.taxpayer}</dd><dt>Tax Year</dt><dd>{receipt.year}</dd><dt>Payment Date</dt><dd>{receipt.date}</dd><dt>Basic RPT Tax</dt><dd>{formatPeso(receipt.basic)}</dd><dt>SEF Tax</dt><dd>{formatPeso(receipt.sef)}</dd><dt>Discount Applied</dt><dd>− {formatPeso(receipt.discount)}</dd><dt>Penalty Applied</dt><dd>+ {formatPeso(receipt.penalty)}</dd><dt>Encoded By</dt><dd>{receipt.encodedBy}</dd></dl><div className="receipt__total"><span>Total Amount Paid</span><span>{formatPeso(receipt.total)}</span></div></div>
          </div>
        </div>
      ) : null}
      {loading.action ? <LoadingScreen progress={loading.progress} message={loading.action === 'Loading application data' ? 'Preparing property records, payments, and assessment data...' : `${loading.action}...`} /> : null}
      </>
    );
  };

  return renderView();
}

export default App;
