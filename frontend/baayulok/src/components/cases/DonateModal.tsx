import { useState, type FormEvent, type MouseEvent, type CSSProperties } from 'react';
import { createDonation } from '../../api/patients';
import type { CreateDonationPayload, Patient, PaymentMethod } from '../../types';
import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_METHODS: PaymentMethod[] = [
  'Esewa', 'Khalti', 'BankTransfer', 'Cash', 'ConnectIPS', 'Other',
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

// ─── Types ────────────────────────────────────────────────────────────────────

interface DonateModalProps {
  patient: Patient;
  onClose: () => void;
}

interface DonateForm {
  amount: string;
  paymentMethod: PaymentMethod | '';
  donorUserId: string;
  gatewayReference: string;
  message: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlay: CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 500,
  background: 'rgba(26,25,23,0.65)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px',
};

const sheet: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '20px',
  width: '100%',
  maxWidth: '480px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
  overflow: 'hidden',
};

const closeBtn: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#6B6860', padding: '6px', lineHeight: 0,
  borderRadius: '6px', flexShrink: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DonateModal({ patient, onClose }: DonateModalProps) {
  const [form, setForm] = useState<DonateForm>({
    amount: '', paymentMethod: '', donorUserId: '',
    gatewayReference: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  const raised    = patient.costRaised ?? 0;
  const pct       = patient.costTotal > 0
    ? Math.min(100, Math.round((raised / patient.costTotal) * 100))
    : 0;
  const remaining = Math.max(0, patient.costTotal - raised);

  function fmtNPR(n: number) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  }

  function set<K extends keyof DonateForm>(key: K, value: DonateForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleOverlay(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0)
      return setError('Please enter a valid amount.');
    if (!form.paymentMethod)
      return setError('Please select a payment method.');

    const payload: CreateDonationPayload = {
      amount,
      paymentMethod: form.paymentMethod as PaymentMethod,
      donorUserId:      form.donorUserId.trim()      || null,
      gatewayReference: form.gatewayReference.trim() || null,
      message:          form.message.trim()          || null,
    };

    setSubmitting(true);
    try {
      await createDonation(patient.id, payload);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={overlay} onClick={handleOverlay}>
      <div style={sheet}>

        {/* ── Header ── */}
        <div style={{ padding: '22px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1917', margin: 0 }}>
                Donate to {patient.name}
              </h2>
              <p style={{ fontSize: '12.5px', color: '#6B6860', margin: '3px 0 0' }}>
                {patient.disease} · {patient.district}
              </p>
            </div>
            <button style={closeBtn} onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ background: '#F5F3EE', borderRadius: '12px', padding: '12px 14px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: '#1D9E75' }}>NPR {fmtNPR(raised)} raised</span>
              <span style={{ color: '#9B978F' }}>NPR {fmtNPR(remaining)} to go</span>
            </div>
            <div style={{ height: '6px', background: '#E2DDD6', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#1D9E75', borderRadius: '99px', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#6B6860', textAlign: 'right' }}>
              {pct}% of NPR {fmtNPR(patient.costTotal)} goal
            </div>
          </div>
        </div>

        {/* ── Scrollable form / success ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>

          {success ? (
            /* ── Success state ── */
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>
                ✓
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1917', marginBottom: '8px' }}>
                Thank you for your donation!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#6B6860', lineHeight: 1.6, marginBottom: '24px' }}>
                Your contribution to {patient.name}'s treatment has been recorded.
                Every rupee makes a difference.
              </p>
              <button
                onClick={onClose}
                style={{ padding: '10px 28px', borderRadius: '10px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Donation form ── */
            <form onSubmit={handleSubmit}>

              {/* Error banner */}
              {error && (
                <div style={{ background: '#FCEBEB', border: '1px solid #F09595', color: '#791F1F', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}

              {/* Quick-pick amount buttons */}
              <div style={{ marginBottom: '16px' }}>
                <label style={LABEL_STYLE}>Amount (NPR) *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => set('amount', String(amt))}
                      style={{
                        padding: '6px 14px', borderRadius: '99px', fontSize: '12.5px',
                        fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        border: '1px solid',
                        background: form.amount === String(amt) ? '#1D9E75' : '#FFFFFF',
                        borderColor: form.amount === String(amt) ? '#1D9E75' : '#E2DDD6',
                        color: form.amount === String(amt) ? '#FFFFFF' : '#6B6860',
                        transition: 'all 0.15s',
                      }}
                    >
                      {fmtNPR(amt)}
                    </button>
                  ))}
                </div>
                <input
                  style={INPUT_STYLE}
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Or enter custom amount…"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                />
              </div>

              {/* Payment method */}
              <div style={{ marginBottom: '16px' }}>
                <label style={LABEL_STYLE}>Payment method *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => set('paymentMethod', method)}
                      style={{
                        padding: '8px 6px', borderRadius: '8px', fontSize: '12px',
                        fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        border: '1px solid', textAlign: 'center',
                        background: form.paymentMethod === method ? '#E1F5EE' : '#FFFFFF',
                        borderColor: form.paymentMethod === method ? '#1D9E75' : '#E2DDD6',
                        color: form.paymentMethod === method ? '#0F6E56' : '#6B6860',
                        transition: 'all 0.15s',
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateway reference */}
              <div style={{ marginBottom: '16px' }}>
                <label style={LABEL_STYLE}>Transaction reference (optional)</label>
                <input
                  style={INPUT_STYLE}
                  placeholder="e.g. TXN-20240501-001"
                  value={form.gatewayReference}
                  onChange={(e) => set('gatewayReference', e.target.value)}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={LABEL_STYLE}>Leave a message (optional)</label>
                <textarea
                  style={{ ...INPUT_STYLE, minHeight: '72px', resize: 'vertical' }}
                  placeholder="Words of encouragement for the patient…"
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  border: 'none', background: '#1D9E75', color: '#FFFFFF',
                  fontSize: '15px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'opacity 0.15s',
                }}
              >
                {submitting && (
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                )}
                {submitting ? 'Processing…' : `Donate NPR ${form.amount ? fmtNPR(parseFloat(form.amount) || 0) : '—'}`}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#9B978F', marginTop: '12px' }}>
                100% of your donation goes directly to the patient's treatment.
              </p>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}