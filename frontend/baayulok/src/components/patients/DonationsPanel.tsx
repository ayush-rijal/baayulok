import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import { formatMoney } from '../../styles/utils';
import type { Donation, CreateDonationPayload, PaymentMethod } from '../../types';
import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';

const PAYMENT_METHODS: PaymentMethod[] = ['Esewa','Khalti','BankTransfer','Cash','ConnectIPS','Other'];

interface DonationsPanelProps {
  patientId: string;
  fetchDonations: (patientId: string) => Promise<Donation[]>;
  addDonation: (patientId: string, data: CreateDonationPayload) => Promise<unknown>;
}

type DonationForm = {
  donorUserId: string;
  amount: string;
  paymentMethod: PaymentMethod | '';
  gatewayReference: string;
  message: string;
};

export default function DonationsPanel({ patientId, fetchDonations, addDonation }: DonationsPanelProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<DonationForm>({ donorUserId: '', amount: '', paymentMethod: '', gatewayReference: '', message: '' });

  async function load() {
    setLoading(true);
    setDonations(await fetchDonations(patientId));
    setLoading(false);
  }

  useEffect(() => { void load(); }, [patientId]);

  function set(key: keyof DonationForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.paymentMethod)                      return setError('Payment method is required.');
    setSubmitting(true);
    try {
      await addDonation(patientId, {
        donorUserId: form.donorUserId || null,
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod as PaymentMethod,
        gatewayReference: form.gatewayReference || null,
        message: form.message || null,
      });
      setSuccess('Donation recorded successfully.');
      setForm({ donorUserId: '', amount: '', paymentMethod: '', gatewayReference: '', message: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Donations</h3>
          {donations.length > 0 && <div style={{ fontSize: '12px', color: '#1D9E75', fontWeight: 600, marginTop: '2px' }}>Total raised: {formatMoney(totalRaised)}</div>}
        </div>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setError(null); setSuccess(null); }}>
          {showForm ? 'Cancel' : '+ Add donation'}
        </Button>
      </div>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#F5F3EE', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid #E2DDD6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={LABEL_STYLE}>Amount (Rs.) *</label>
              <input style={INPUT_STYLE} type="number" min={0.01} step={0.01} value={form.amount} onChange={set('amount')} placeholder="e.g. 5000" />
            </div>
            <div>
              <label style={LABEL_STYLE}>Payment method *</label>
              <select style={INPUT_STYLE} value={form.paymentMethod} onChange={set('paymentMethod')}>
                <option value="">Select…</option>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}><label style={LABEL_STYLE}>Donor user ID (optional)</label><input style={INPUT_STYLE} value={form.donorUserId} onChange={set('donorUserId')} placeholder="UUID of donor" /></div>
          <div style={{ marginBottom: '12px' }}><label style={LABEL_STYLE}>Gateway reference (optional)</label><input style={INPUT_STYLE} value={form.gatewayReference} onChange={set('gatewayReference')} placeholder="e.g. TXN-20240501-001" /></div>
          <div style={{ marginBottom: '14px' }}><label style={LABEL_STYLE}>Message (optional)</label><textarea style={{ ...INPUT_STYLE, minHeight: '64px', resize: 'vertical' }} value={form.message} onChange={set('message')} placeholder="A kind message from the donor…" /></div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Record donation'}</Button>
        </form>
      )}

      {loading && <Spinner text="Loading donations…" />}
      {!loading && donations.length === 0 && <div style={{ textAlign: 'center', padding: '32px 20px', color: '#6B6860', fontSize: '13.5px' }}>💰 No donations recorded yet.</div>}
      {!loading && donations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {donations.map((d) => (
            <div key={d.id} style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1D9E75' }}>{formatMoney(d.amount)}</span>
                <span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '2px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>{d.paymentMethod}</span>
              </div>
              {d.message && <p style={{ fontSize: '13px', color: '#6B6860', fontStyle: 'italic', marginBottom: '4px' }}>"{d.message}"</p>}
              <div style={{ fontSize: '11.5px', color: '#9B9890' }}>
                {d.donorUserId ? `Donor: ${d.donorUserId}` : 'Anonymous'}
                {d.gatewayReference && ` · Ref: ${d.gatewayReference}`}
                {d.createdAt && ` · ${new Date(d.createdAt).toLocaleDateString()}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}