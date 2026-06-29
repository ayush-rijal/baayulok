import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../ui/Spinner';
import type { PatientDocument, CreateDocumentPayload, DocumentType } from '../../types';
import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';

const DOC_TYPES: DocumentType[] = ['MedicalReport','Prescription','LabResult','IDProof','BipannaCard','Other'];

interface DocumentsPanelProps {
  patientId: string;
  fetchDocuments: (patientId: string) => Promise<PatientDocument[]>;
  addDocument: (patientId: string, data: CreateDocumentPayload) => Promise<unknown>;
}

type DocForm = { type: DocumentType | ''; fileUrl: string; originalFileName: string };

export default function DocumentsPanel({ patientId, fetchDocuments, addDocument }: DocumentsPanelProps) {
  const [docs, setDocs]           = useState<PatientDocument[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState<DocForm>({ type: '', fileUrl: '', originalFileName: '' });

  async function load() {
    setLoading(true);
    setDocs(await fetchDocuments(patientId));
    setLoading(false);
  }

  useEffect(() => { void load(); }, [patientId]);

  function set(key: keyof DocForm) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!form.type)                      return setError('Document type is required.');
    if (!form.fileUrl.trim())            return setError('File URL is required.');
    if (!form.originalFileName.trim())   return setError('File name is required.');
    setSubmitting(true);
    try {
      await addDocument(patientId, form as CreateDocumentPayload);
      setSuccess('Document added successfully.');
      setForm({ type: '', fileUrl: '', originalFileName: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Documents</h3>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setError(null); setSuccess(null); }}>
          {showForm ? 'Cancel' : '+ Add document'}
        </Button>
      </div>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#F5F3EE', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid #E2DDD6' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={LABEL_STYLE}>Document type *</label>
            <select style={INPUT_STYLE} value={form.type} onChange={set('type')}>
              <option value="">Select type…</option>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={LABEL_STYLE}>File URL *</label>
            <input style={INPUT_STYLE} value={form.fileUrl} onChange={set('fileUrl')} placeholder="https://storage.example.com/file.pdf" />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={LABEL_STYLE}>Original file name *</label>
            <input style={INPUT_STYLE} value={form.originalFileName} onChange={set('originalFileName')} placeholder="medical-report.pdf" />
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Uploading…' : 'Save document'}</Button>
        </form>
      )}

      {loading && <Spinner text="Loading documents…" />}
      {!loading && docs.length === 0 && <div style={{ textAlign: 'center', padding: '32px 20px', color: '#6B6860', fontSize: '13.5px' }}>📄 No documents attached yet.</div>}
      {!loading && docs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {docs.map((doc) => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500 }}>{doc.originalFileName}</div>
                <div style={{ fontSize: '11.5px', color: '#6B6860', marginTop: '2px' }}>
                  <span style={{ background: '#E6F1FB', color: '#185FA5', padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>{doc.type}</span>
                  {doc.createdAt && <span style={{ marginLeft: '8px' }}>{new Date(doc.createdAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: '#1D9E75', fontWeight: 500, textDecoration: 'none' }}>View ↗</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}