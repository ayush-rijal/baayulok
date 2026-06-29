import { useEffect, useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { PatientCard } from '../components/patients/PatientCard';
import PatientDetailModal from '../components/patients/PatientDetailModal';
import PatientFormModal from '../components/patients/PatientFormModal';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { ALL_STATUSES } from '../styles/utils';
import type { Patient } from '../types';

// ─── Modal state machine ──────────────────────────────────────────────────────
//   null          → no modal open
//   { type: 'detail', id }  → PatientDetailModal
//   { type: 'form', id? }   → PatientFormModal (id = edit, undefined = create)

type ModalState =
  | null
  | { type: 'detail'; id: string }
  | { type: 'form';   id?: string };

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const {
    patients, loading, error,
    fetchAll, updateStatus,
  } = usePatients();

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [modal, setModal]             = useState<ModalState>(null);

  useEffect(() => { void fetchAll(); }, []);

  // ── Derived list ─────────────────────────────────────────────────────────────
  const filtered = patients.filter((p) => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.disease.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // ── Status change ─────────────────────────────────────────────────────────────
  async function handleStatusChange(id: string, status: string) {
    setStatusError(null);
    setUpdatingId(id);
    try {
      await updateStatus(id, status);
    } catch (err) {
      setStatusError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  function closeModal() { setModal(null); }

  function handleViewDetail(patient: Patient) {
    setModal({ type: 'detail', id: patient.id });
  }

  function handleEdit(patient: Patient) {
    setModal({ type: 'form', id: patient.id });
  }

  function handleNewPatient() {
    setModal({ type: 'form' });
  }

  // After save: close modal + refresh list
  function handleSaved() {
    void fetchAll();
  }

  // When "Edit patient" is clicked inside the detail modal:
  // switch from detail → form modal without closing the overlay
  function handleEditFromDetail(patient: Patient) {
    setModal({ type: 'form', id: patient.id });
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px' }}>

      {/* ── Modals ── */}
      {modal?.type === 'detail' && (
        <PatientDetailModal
          patientId={modal.id}
          onClose={closeModal}
          onEdit={handleEditFromDetail}
        />
      )}

      {modal?.type === 'form' && (
        <PatientFormModal
          patientId={modal.id}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#1A1917' }}>
            Patients
          </h1>
          <p style={{ fontSize: '13.5px', color: '#6B6860', marginTop: '3px' }}>
            {loading
              ? 'Loading…'
              : `${filtered.length} case${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Button onClick={handleNewPatient}>+ New patient</Button>
      </div>

      <Alert type="error" message={error ?? statusError} />

      {/* ── Search + status chips ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#9B978F', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, disease, or district…"
            style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1px solid #E2DDD6', borderRadius: '6px', background: '#FFFFFF', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* Status filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(['All', ...ALL_STATUSES] as string[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '5px 13px', borderRadius: '99px', fontSize: '12px',
                fontWeight: 500, cursor: 'pointer', border: '1px solid',
                fontFamily: 'inherit', transition: 'all 0.15s',
                background:  statusFilter === s ? '#E1F5EE' : '#FFFFFF',
                borderColor: statusFilter === s ? '#1D9E75' : '#E2DDD6',
                color:       statusFilter === s ? '#0F6E56' : '#6B6860',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card grid / empty / loading ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9B978F', fontSize: '14px' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid #E2DDD6', borderTopColor: '#1D9E75', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 14px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading patients…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>🏥</div>
          <h3 style={{ fontSize: '17px', fontWeight: 500, marginBottom: '6px' }}>No patients found</h3>
          <p style={{ fontSize: '13.5px', color: '#6B6860', marginBottom: '20px' }}>
            {search || statusFilter !== 'All'
              ? 'Try a different search term or status filter.'
              : 'Add the first patient case to get started.'}
          </p>
          {!search && statusFilter === 'All' && (
            <Button onClick={handleNewPatient}>+ New patient</Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              updatingStatus={updatingId === p.id}
              allStatuses={ALL_STATUSES}
              onStatusChange={handleStatusChange}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

    </div>
  );
}