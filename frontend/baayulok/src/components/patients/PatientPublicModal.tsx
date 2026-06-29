import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { usePatients } from '../../hooks/usePatients';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';
import type { Patient, CreateDonationPayload, PaymentMethod } from '../../types';

// ─── Constants ────────────────────────────────────────────────────
const PAYMENT_METHODS: PaymentMethod[] = [
  'Esewa', 'Khalti', 'BankTransfer', 'Cash', 'ConnectIPS', 'Other',
];

// ─── Types ────────────────────────────────────────────────────────
interface PatientPublicModalProps {
  patientId: string;
  onClose:   () => void;
}

type DonationForm = {
  amount:           string;
  paymentMethod:    PaymentMethod | '';
  gatewayReference: string;
  message:          string;
};

const EMPTY_FORM: DonationForm = {
  amount: '', paymentMethod: '', gatewayReference: '', message: '',
};

// ─── Helpers ──────────────────────────────────────────────────────
const fmtNPR = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n ?? 0);

// ─── Patient summary strip ────────────────────────────────────────
function PatientSummary({ patient }: { patient: Patient }) {
  const raised    = patient.costRaised ?? 0;
  const pct       = patient.costTotal > 0
    ? Math.min(100, Math.round((raised / patient.costTotal) * 100))
    : 0;
  const remaining = Math.max(0, patient.costTotal - raised);

  return (
    <div style={{
      background: '#F5F3EE', borderRadius: '10px',
      padding: '16px 18px', marginBottom: '24px',
    }}>
      {/* Disease + badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1917' }}>
          {patient.disease}
        </span>
        {patient.isEmergency && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#E24B4A', background: '#FCEBEB', padding: '2px 8px', borderRadius: '99px' }}>
            ⚠ Emergency
          </span>
        )}
        {patient.bipannaVerified && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#0F6E56', background: '#E1F5EE', padding: '2px 8px', borderRadius: '99px' }}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: '#E2DDD6', borderRadius: '99px', overflow: 'hidden', marginBottom: '7px' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: '#1D9E75', borderRadius: '99px',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Amounts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ fontWeight: 600, color: '#1D9E75' }}>
          NPR {fmtNPR(raised)} raised ({pct}%)
        </span>
        <span style={{ color: '#9B978F' }}>
          NPR {fmtNPR(remaining)} to go
        </span>
      </div>
    </div>
  );
}

// ─── Donation form ────────────────────────────────────────────────
function DonationForm({
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

    if (!form.amount || Number(form.amount) <= 0)
      return setError('Amount must be greater than 0.');
    if (!form.paymentMethod)
      return setError('Payment method is required.');

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

  // ── Success state ──
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '52px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎉</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1917', marginBottom: '6px' }}>
          Thank you for your donation!
        </h3>
        <p style={{ fontSize: '13.5px', color: '#6B6860' }}>
          Your contribution has been recorded successfully.
        </p>
      </div>
    );
  }

  // ── Form ──
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Alert type="error" message={error} />

      {/* Amount + payment method */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={LABEL_STYLE}>Amount (NPR) *</label>
          <input
            style={INPUT_STYLE}
            type="number" min={1} step={1}
            value={form.amount}
            onChange={set('amount')}
            placeholder="e.g. 5000"
            required
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>Payment method *</label>
          <select
            style={INPUT_STYLE}
            value={form.paymentMethod}
            onChange={set('paymentMethod')}
            required
          >
            <option value="">Select…</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gateway reference */}
      <div>
        <label style={LABEL_STYLE}>Gateway reference (optional)</label>
        <input
          style={INPUT_STYLE}
          value={form.gatewayReference}
          onChange={set('gatewayReference')}
          placeholder="e.g. TXN-20240501-001"
        />
      </div>

      {/* Message */}
      <div>
        <label style={LABEL_STYLE}>Message (optional)</label>
        <textarea
          style={{ ...INPUT_STYLE, minHeight: '76px', resize: 'vertical' } as React.CSSProperties}
          value={form.message}
          onChange={set('message')}
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
export default function PatientPublicModal({ patientId, onClose }: PatientPublicModalProps) {
  const { fetchOne, addDonation } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchOne(patientId);
        if (!data) throw new Error('Patient not found.');
        setPatient(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientId]);

  const isFunded = patient?.status === 'Funded';

  return (
    <Modal title={patient ? `Donate to ${patient.name}` : 'Donate'} onClose={onClose}>

      {/* Patient subtitle */}
      {patient && (
        <p style={{ fontSize: '13px', color: '#6B6860', margin: '-8px 0 20px' }}>
          {patient.age} yrs · {patient.gender} · {patient.district}
        </p>
      )}

      {loading && <Spinner />}
      <Alert type="error" message={error} />

      {!loading && patient && (
        <>
          {/* Patient summary strip — always visible */}
          <PatientSummary patient={patient} />

          {/* Funded state */}
          {isFunded ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1917', marginBottom: '6px' }}>
                Fully Funded
              </h3>
              <p style={{ fontSize: '13.5px', color: '#6B6860' }}>
                This patient has already reached their fundraising goal. Thank you to all donors!
              </p>
            </div>
          ) : (
            <DonationForm
              patientId={patientId}
              addDonation={addDonation}
              onSuccess={onClose}
            />
          )}
        </>
      )}
    </Modal>
  );
}