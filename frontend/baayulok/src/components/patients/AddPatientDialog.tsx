import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { getAllDepartments } from '../../api/departments';
import type { Department, Patient, Gender } from '../../types';

interface FormState {
  name: string;
  age: string;
  gender: Gender;
  district: string;
  disease: string;
  departmentId: string;
  criticalityScore: number;
  costTotal: string;
  isEmergency: boolean;
  medicalSummary: string;
  createdByOfficerId: string;
}

const empty: FormState = {
  name: '', age: '', gender: 'Male', district: '', disease: '',
  departmentId: '', criticalityScore: 50, costTotal: '',
  isEmergency: false, medicalSummary: '', createdByOfficerId: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #E2DDD6',
  borderRadius: '6px', background: '#F5F3EE', fontSize: '13.5px',
  color: '#1A1917', outline: 'none', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6860',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em',
};

interface ToastState { msg: string; type: 'success' | 'error' }

interface AddPatientDialogProps {
  onCreated?: (patient: Patient) => void;
}

export function AddPatientDialog({ onCreated }: AddPatientDialogProps) {
  const [open, setOpen]             = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState<FormState>(empty);
  const [error, setError]           = useState<string | null>(null);
  const [toast, setToast]           = useState<ToastState | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [depsLoading, setDepsLoading] = useState(false);
  const [depsError, setDepsError]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setDepsLoading(true);
      setDepsError(null);
      try {
        const data = await getAllDepartments();
        setDepartments(data);
        if (data.length > 0) setForm((f) => ({ ...f, departmentId: data[0].id }));
      } catch (err) {
        setDepsError((err as Error).message);
      } finally {
        setDepsLoading(false);
      }
    }
    load();
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleClose() {
    setOpen(false);
    setError(null);
    setForm((f) => ({ ...empty, departmentId: f.departmentId }));
  }

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) handleClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim())                          return setError('Patient name is required.');
    if (!form.age || Number(form.age) <= 0)          return setError('Age must be greater than 0.');
    if (!form.district.trim())                      return setError('District is required.');
    if (!form.disease.trim())                       return setError('Disease is required.');
    if (!form.departmentId)                         return setError('Please select a department.');
    if (!form.costTotal || Number(form.costTotal) <= 0) return setError('Cost total must be greater than 0.');
    if (form.criticalityScore < 0 || form.criticalityScore > 100) return setError('Criticality must be 0–100.');
    if (!form.createdByOfficerId.trim())            return setError('Officer ID is required.');

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE ?? 'http://localhost:5000'}/api/patients`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('bl_token')}` },
          body: JSON.stringify({
            name: form.name, age: parseInt(form.age), gender: form.gender,
            district: form.district, disease: form.disease,
            departmentId: form.departmentId,
            criticalityScore: form.criticalityScore,
            costTotal: parseFloat(form.costTotal),
            isEmergency: form.isEmergency,
            medicalSummary: form.medicalSummary || null,
            createdByOfficerId: form.createdByOfficerId,
            bipannaVerified: false,
          }),
        },
      );
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { message?: string; title?: string };
        throw new Error(errData.message ?? errData.title ?? 'Failed to create case.');
      }
      const data = (await res.json()) as { patientId: string };
      const deptName = departments.find((d) => d.id === form.departmentId)?.name;
      onCreated?.({
        id: data.patientId, name: form.name, age: parseInt(form.age),
        gender: form.gender, district: form.district, disease: form.disease,
        departmentId: form.departmentId, departmentName: deptName,
        criticalityScore: form.criticalityScore,
        costTotal: parseFloat(form.costTotal), costRaised: 0,
        isEmergency: form.isEmergency, bipannaVerified: false,
        medicalSummary: form.medicalSummary || null, status: 'PendingReview',
        createdByOfficerId: form.createdByOfficerId,
      });
      showToast('Patient case submitted for review.');
      handleClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, background: toast.type === 'success' ? '#1D9E75' : '#E24B4A', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'slideUp 0.2s ease' }}>
          {toast.msg}
        </div>
      )}

      <button onClick={() => setOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '7px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add patient case
      </button>

      {open && (
        <div onClick={handleOverlayClick} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(26,25,23,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #E2DDD6', position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 1 }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>New patient case</h2>
                <p style={{ fontSize: '12.5px', color: '#6B6860', marginTop: '2px' }}>Submit a verified patient case. It will enter PendingReview status.</p>
              </div>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6860', padding: '4px', lineHeight: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {error && <div style={{ gridColumn: '1 / -1', background: '#FCEBEB', border: '1px solid #F09595', color: '#791F1F', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>{error}</div>}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Patient name *</label>
                <input style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" required />
              </div>
              <div>
                <label style={labelStyle}>Age *</label>
                <input style={inputStyle} type="number" min={1} value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="e.g. 35" required />
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <select style={inputStyle} value={form.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>District *</label>
                <input style={inputStyle} value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="e.g. Kathmandu" required />
              </div>
              <div>
                <label style={labelStyle}>Department *</label>
                {depsLoading
                  ? <div style={{ ...inputStyle, color: '#6B6860' }}>Loading departments…</div>
                  : depsError
                    ? <div style={{ ...inputStyle, color: '#E24B4A', background: '#FCEBEB' }}>{depsError}</div>
                    : (
                      <select style={inputStyle} value={form.departmentId} onChange={(e) => set('departmentId', e.target.value)} required>
                        <option value="">Select department…</option>
                        {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    )
                }
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Diagnosis *</label>
                <input style={inputStyle} value={form.disease} onChange={(e) => set('disease', e.target.value)} placeholder="e.g. Acute lymphoblastic leukemia" required />
              </div>
              <div>
                <label style={labelStyle}>Total cost (NPR) *</label>
                <input style={inputStyle} type="number" min={0.01} step={0.01} value={form.costTotal} onChange={(e) => set('costTotal', e.target.value)} placeholder="e.g. 500000" required />
              </div>
              <div>
                <label style={labelStyle}>Criticality (0–100)</label>
                <input style={inputStyle} type="number" min={0} max={100} value={form.criticalityScore} onChange={(e) => set('criticalityScore', Number(e.target.value))} />
                <div style={{ marginTop: '6px', height: '4px', background: '#E2DDD6', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, form.criticalityScore))}%`, borderRadius: '99px', background: form.criticalityScore >= 85 ? '#E24B4A' : form.criticalityScore >= 70 ? '#EF9F27' : '#1D9E75', transition: 'width 0.2s, background 0.2s' }} />
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Officer ID *</label>
                <input style={inputStyle} value={form.createdByOfficerId} onChange={(e) => set('createdByOfficerId', e.target.value)} placeholder="Your officer UUID" required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Medical summary</label>
                <textarea style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }} value={form.medicalSummary} onChange={(e) => set('medicalSummary', e.target.value)} placeholder="Brief description of the case…" />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2DDD6', borderRadius: '8px', padding: '12px 14px' }}>
                <div>
                  <p style={{ fontSize: '13.5px', fontWeight: 500 }}>Mark as emergency</p>
                  <p style={{ fontSize: '12px', color: '#6B6860', marginTop: '2px' }}>Highlights the case for urgent attention.</p>
                </div>
                <button type="button" onClick={() => set('isEmergency', !form.isEmergency)} aria-pressed={form.isEmergency} style={{ width: '44px', height: '24px', borderRadius: '99px', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, background: form.isEmergency ? '#1D9E75' : '#E2DDD6', position: 'relative', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: '3px', left: form.isEmergency ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#FFFFFF', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button type="button" onClick={handleClose} style={{ padding: '9px 20px', borderRadius: '7px', border: '1px solid #E2DDD6', background: '#FFFFFF', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                <button type="submit" disabled={submitting || depsLoading} style={{ padding: '9px 20px', borderRadius: '7px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {submitting && <span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
                  {submitting ? 'Submitting…' : 'Submit case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}