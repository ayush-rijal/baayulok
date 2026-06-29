import {
  useEffect, useState,
  type MouseEvent, type CSSProperties,
  type FormEvent, type ChangeEvent,
} from 'react';
import { usePatients } from '../../hooks/usePatients';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { formatMoney, INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';
import type { Patient, CreateDonationPayload, PaymentMethod } from '../../types';

// ─── Constants ────────────────────────────────────────────────────
const PAYMENT_METHODS: PaymentMethod[] = [
  'Esewa', 'Khalti', 'BankTransfer', 'Cash', 'ConnectIPS', 'Other',
];

// ─── Types ────────────────────────────────────────────────────────
type Tab = 'details' | 'donate';

const TABS: { key: Tab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'donate',  label: 'Donate'  },
];

type DonationForm = {
  amount:           string;
  paymentMethod:    PaymentMethod | '';
  gatewayReference: string;
  message:          string;
};

const EMPTY_FORM: DonationForm = {
  amount: '', paymentMethod: '', gatewayReference: '', message: '',
};

export interface PublicPatientDetailModalProps {
  patientId:   string;
  defaultTab?: Tab;
  onClose:     () => void;
}

// ─── Overlay / sheet styles ───────────────────────────────────────
const overlay: CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 400,
  background: 'rgba(26,25,23,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px',
};

const sheet: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '640px',
  height: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  overflow: 'hidden',
};

// ─── Helper: label ────────────────────────────────────────────────
const fieldLabel: CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#9B978F',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  display: 'block', marginBottom: '3px',
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <span style={fieldLabel}>{label}</span>
      <span style={{ fontSize: '14px', color: '#1A1917' }}>{value ?? '—'}</span>
    </div>
  );
}

// ─── Details panel ────────────────────────────────────────────────
function DetailsPanel({ patient }: { patient: Patient }) {
  const raised    = patient.costRaised ?? 0;
  const pct       = patient.costTotal > 0
    ? Math.min(100, Math.round((raised / patient.costTotal) * 100))
    : 0;
  const remaining = Math.max(0, patient.costTotal - raised);

  function critColor(score: number): string {
    if (score >= 85) return '#E24B4A';
    if (score >= 70) return '#EF9F27';
    return '#1D9E75';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {patient.isEmergency && (
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#E24B4A', background: '#FCEBEB', padding: '4px 12px', borderRadius: '99px' }}>
            ⚠ Emergency
          </span>
        )}
        {patient.bipannaVerified && (
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0F6E56', background: '#E1F5EE', padding: '4px 12px', borderRadius: '99px' }}>
            ✓ Bipanna Verified
          </span>
        )}
        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#185FA5', background: '#EEF5FC', padding: '4px 12px', borderRadius: '99px' }}>
          {patient.status}
        </span>
      </div>

      {/* Funding progress */}
      <div style={{ background: '#F5F3EE', borderRadius: '10px', padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1917' }}>Fundraising progress</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D9E75' }}>{pct}% funded</span>
        </div>
        <div style={{ height: '7px', background: '#E2DDD6', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#1D9E75', borderRadius: '99px', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
          <span style={{ fontWeight: 600, color: '#1A1917' }}>NPR {new Intl.NumberFormat('en-IN').format(raised)} raised</span>
          <span style={{ color: '#9B978F' }}>NPR {new Intl.NumberFormat('en-IN').format(remaining)} to go</span>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <InfoRow label="Full name"   value={patient.name} />
        <InfoRow label="Age"         value={`${patient.age} years`} />
        <InfoRow label="Gender"      value={patient.gender} />
        <InfoRow label="District"    value={patient.district} />
        <InfoRow label="Criticality" value={`${patient.criticalityScore}/100`} />
        <InfoRow label="Total cost"  value={formatMoney(patient.costTotal)} />
      </div>

      {/* Criticality bar */}
      <div>
        <span style={fieldLabel}>Criticality score</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <div style={{ flex: 1, height: '7px', borderRadius: '99px', background: '#E2DDD6', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${patient.criticalityScore}%`, background: critColor(patient.criticalityScore), borderRadius: '99px' }} />
          </div>
          <span style={{ fontSize: '12px', color: '#1A1917', flexShrink: 0 }}>{patient.criticalityScore}/100</span>
        </div>
      </div>

      {/* Diagnosis */}
      <div>
        <span style={fieldLabel}>Diagnosis</span>
        <div style={{ background: '#F5F3EE', borderRadius: '8px', padding: '12px 14px', marginTop: '4px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1917', margin: '0 0 4px' }}>{patient.disease}</p>
          {patient.medicalSummary && (
            <p style={{ fontSize: '13px', color: '#6B6860', margin: 0, lineHeight: 1.65 }}>{patient.medicalSummary}</p>
          )}
        </div>
      </div>

      {/* Cost summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#F5F3EE', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={fieldLabel}>Total cost</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1917' }}>{formatMoney(patient.costTotal)}</div>
        </div>
        <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ ...fieldLabel, color: '#0F6E56' }}>Raised so far</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F6E56' }}>{formatMoney(raised)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Donate panel ─────────────────────────────────────────────────
function DonatePanel({
  patientId,
  addDonation,
  onSuccess,
}: {
  patientId:   string;
  addDonation: (id: string, data: CreateDonationPayload) => Promise<unknown>;
  onSuccess:   () => void;
}) {
  const [form, setForm]             = useState<DonationForm>(EMPTY_FORM);
  const [error, setError]           = useState<string | null>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set(key: keyof DonationForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.paymentMethod)                      return setError('Payment method is required.');
    setSubmitting(true);
    try {
      await addDonation(patientId, {
        donorUserId:      null,
        amount:           parseFloat(form.amount),
        paymentMethod:    form.paymentMethod as PaymentMethod,
        gatewayReference: form.gatewayReference || null,
        message:          form.message || null,
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setTimeout(onSuccess, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎉</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1917', marginBottom: '6px' }}>Thank you!</h3>
        <p style={{ fontSize: '13.5px', color: '#6B6860' }}>Your donation has been recorded successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Alert type="error" message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={LABEL_STYLE}>Amount (NPR) *</label>
          <input style={INPUT_STYLE} type="number" min={1} step={1} value={form.amount} onChange={set('amount')} placeholder="e.g. 5000" required />
        </div>
        <div>
          <label style={LABEL_STYLE}>Payment method *</label>
          <select style={INPUT_STYLE} value={form.paymentMethod} onChange={set('paymentMethod')} required>
            <option value="">Select…</option>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={LABEL_STYLE}>Gateway reference (optional)</label>
        <input style={INPUT_STYLE} value={form.gatewayReference} onChange={set('gatewayReference')} placeholder="e.g. TXN-20240501-001" />
      </div>

      <div>
        <label style={LABEL_STYLE}>Message (optional)</label>
        <textarea
          style={{ ...INPUT_STYLE, minHeight: '76px', resize: 'vertical' } as React.CSSProperties}
          value={form.message} onChange={set('message')}
          placeholder="Leave a kind message for the patient…"
        />
      </div>

      <Button type="submit" full disabled={submitting}>
        {submitting ? 'Processing…' : '❤ Donate now'}
      </Button>
    </form>
  );
}

// ─── Main modal ───────────────────────────────────────────────────
export default function PublicPatientDetailModal({
  patientId,
  defaultTab = 'details',
  onClose,
}: PublicPatientDetailModalProps) {
  const { fetchOne, addDonation } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>(defaultTab);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOne(patientId).then((data) => {
      if (cancelled) return;
      if (!data) setError('Patient not found.');
      else setPatient(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [patientId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleOverlay(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  const isFunded = patient?.status === 'Funded';

  // Tabs available — hide Donate tab when fully funded
  const visibleTabs = isFunded
    ? TABS.filter((t) => t.key !== 'donate')
    : TABS;

  return (
    <div style={overlay} onClick={handleOverlay}>
      <div style={sheet}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 0', flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1917', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? 'Loading…' : (patient?.name ?? 'Patient detail')}
            </h2>
            {patient && (
              <p style={{ fontSize: '13px', color: '#6B6860', margin: '3px 0 0' }}>
                {patient.age} yrs · {patient.gender} · {patient.district}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6860', padding: '4px', lineHeight: 0, borderRadius: '6px', flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2DDD6', padding: '4px 24px 0', flexShrink: 0, marginTop: '12px' }}>
          {visibleTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '8px 18px', fontSize: '13.5px',
                fontWeight: tab === key ? 600 : 400,
                cursor: 'pointer', border: 'none',
                borderBottom: tab === key ? '2px solid #1D9E75' : '2px solid transparent',
                background: 'transparent',
                color: tab === key ? '#1D9E75' : '#6B6860',
                fontFamily: 'inherit', transition: 'color 0.15s',
                marginBottom: '-1px',
              }}
            >
              {label}
            </button>
          ))}
          {isFunded && (
            <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '11px', fontWeight: 600, color: '#0F6E56', background: '#E1F5EE', padding: '3px 10px', borderRadius: '99px' }}>
              Fully Funded
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading && <Spinner />}
          <Alert type="error" message={error} />

          {!loading && patient && (
            <>
              {tab === 'details' && <DetailsPanel patient={patient} />}
              {tab === 'donate' && !isFunded && (
                <DonatePanel
                  patientId={patientId}
                  addDonation={addDonation}
                  onSuccess={onClose}
                />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}