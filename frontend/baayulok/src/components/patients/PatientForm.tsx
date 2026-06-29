import { useState, type FormEvent, type ChangeEvent } from 'react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import type { CreatePatientPayload, UpdatePatientPayload, Gender, Patient } from '../../types';
import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';

type FormData = {
  name: string;
  age: string;
  gender: Gender | '';
  district: string;
  disease: string;
  departmentId: string;
  createdByOfficerId: string;
  criticalityScore: string;
  costTotal: string;
  photoUrl: string;
  medicalSummary: string;
  bipannaVerified: boolean;
  isEmergency: boolean;
};

interface PatientFormProps {
  initial?: Partial<Patient>;
  onSubmit: (data: CreatePatientPayload | UpdatePatientPayload) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

function FieldWrapper({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={LABEL_STYLE}>{label}{required && ' *'}</label>
      {children}
    </div>
  );
}

export default function PatientForm({ initial = {}, onSubmit, onCancel, isEdit = false }: PatientFormProps) {
  const [form, setForm] = useState<FormData>({
    name:               initial.name               ?? '',
    age:                initial.age?.toString()     ?? '',
    gender:             initial.gender              ?? '',
    district:           initial.district            ?? '',
    disease:            initial.disease             ?? '',
    departmentId:       initial.departmentId        ?? '',
    createdByOfficerId: initial.createdByOfficerId  ?? '',
    criticalityScore:   initial.criticalityScore?.toString() ?? '',
    costTotal:          initial.costTotal?.toString() ?? '',
    photoUrl:           initial.photoUrl            ?? '',
    medicalSummary:     initial.medicalSummary      ?? '',
    bipannaVerified:    initial.bipannaVerified      ?? false,
    isEmergency:        initial.isEmergency          ?? false,
  });
  const [error, setError]       = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set(key: keyof FormData) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function setCheck(key: keyof FormData) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.checked }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError('Patient name is required.');
    if (!form.age || Number(form.age) <= 0) return setError('Age must be greater than 0.');
    if (!['Male','Female','Other'].includes(form.gender)) return setError('Gender must be Male, Female, or Other.');
    if (!form.district.trim()) return setError('District is required.');
    if (!form.disease.trim()) return setError('Disease is required.');
    if (!form.departmentId.trim()) return setError('Department ID is required.');
    const cs = Number(form.criticalityScore);
    if (cs < 0 || cs > 100) return setError('Criticality score must be 0–100.');
    if (!form.costTotal || Number(form.costTotal) <= 0) return setError('Cost total must be greater than 0.');
    if (!isEdit && !form.createdByOfficerId.trim()) return setError('Officer ID is required.');

    setSubmitting(true);
    try {
      const base = {
        name: form.name, age: parseInt(form.age), gender: form.gender as Gender,
        district: form.district, disease: form.disease, departmentId: form.departmentId,
        criticalityScore: parseInt(form.criticalityScore),
        costTotal: parseFloat(form.costTotal),
        photoUrl: form.photoUrl || null, medicalSummary: form.medicalSummary || null,
        bipannaVerified: form.bipannaVerified, isEmergency: form.isEmergency,
      };
      await onSubmit(isEdit ? base : { ...base, createdByOfficerId: form.createdByOfficerId });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert type="error" message={error} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Full name" required><input style={INPUT_STYLE} value={form.name} onChange={set('name')} placeholder="Patient full name" /></FieldWrapper>
        <FieldWrapper label="Age" required><input style={INPUT_STYLE} type="number" value={form.age} onChange={set('age')} placeholder="e.g. 35" /></FieldWrapper>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Gender" required>
          <select style={INPUT_STYLE} value={form.gender} onChange={set('gender')}>
            <option value="">Select…</option>
            {(['Male','Female','Other'] as Gender[]).map((g) => <option key={g}>{g}</option>)}
          </select>
        </FieldWrapper>
        <FieldWrapper label="District" required><input style={INPUT_STYLE} value={form.district} onChange={set('district')} placeholder="e.g. Kathmandu" /></FieldWrapper>
      </div>
      <FieldWrapper label="Disease" required><input style={INPUT_STYLE} value={form.disease} onChange={set('disease')} placeholder="e.g. Acute lymphoblastic leukemia" /></FieldWrapper>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Department ID" required><input style={INPUT_STYLE} value={form.departmentId} onChange={set('departmentId')} placeholder="UUID" /></FieldWrapper>
        {!isEdit && <FieldWrapper label="Officer ID" required><input style={INPUT_STYLE} value={form.createdByOfficerId} onChange={set('createdByOfficerId')} placeholder="Officer UUID" /></FieldWrapper>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <FieldWrapper label="Criticality (0–100)" required><input style={INPUT_STYLE} type="number" min={0} max={100} value={form.criticalityScore} onChange={set('criticalityScore')} placeholder="e.g. 75" /></FieldWrapper>
        <FieldWrapper label="Total cost (Rs.)" required><input style={INPUT_STYLE} type="number" min={0.01} step={0.01} value={form.costTotal} onChange={set('costTotal')} placeholder="e.g. 500000" /></FieldWrapper>
      </div>
      <FieldWrapper label="Photo URL"><input style={INPUT_STYLE} type="url" value={form.photoUrl} onChange={set('photoUrl')} placeholder="https://…" /></FieldWrapper>
      <FieldWrapper label="Medical summary"><textarea style={{ ...INPUT_STYLE, minHeight: '80px', resize: 'vertical' }} value={form.medicalSummary} onChange={set('medicalSummary')} /></FieldWrapper>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.bipannaVerified} onChange={setCheck('bipannaVerified')} style={{ accentColor: '#1D9E75' }} /> Bipanna verified
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isEmergency} onChange={setCheck('isEmergency')} style={{ accentColor: '#E24B4A' }} /> Emergency case
        </label>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2DDD6' }}>
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create patient'}</Button>
      </div>
    </form>
  );
}