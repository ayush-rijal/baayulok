import { useEffect, useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { PublicPatientCard } from '../components/cases/PublicPatientCard';
import PublicPatientDetailModal from '../components/cases/PublicPatientDetailModal';
import Alert from '../components/ui/Alert';
import { ALL_STATUSES } from '../styles/utils';
import type { Patient } from '../types';

// ─── Modal state ──────────────────────────────────────────────────
type ModalState =
  | null
  | { patientId: string; tab: 'details' | 'donate' };

// ─── Component ────────────────────────────────────────────────────
export default function CasesPage() {
  const { patients, loading, error, fetchAll } = usePatients();
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal]               = useState<ModalState>(null);

  useEffect(() => { void fetchAll(); }, []);

  // ── Derived list ─────────────────────────────────────────────────
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

  // ── Handlers ──────────────────────────────────────────────────────
  function handleViewDetail(patient: Patient) {
    setModal({ patientId: patient.id, tab: 'details' });
  }

  function handleDonate(patient: Patient) {
    setModal({ patientId: patient.id, tab: 'donate' });
  }

  function closeModal() { setModal(null); }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px' }}>

      {/* Modal */}
      {modal && (
        <PublicPatientDetailModal
          patientId={modal.patientId}
          defaultTab={modal.tab}
          onClose={closeModal}
        />
      )}

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#1A1917', margin: 0 }}>
          Patient Cases
        </h1>
        <p style={{ fontSize: '13.5px', color: '#6B6860', marginTop: '4px' }}>
          {loading
            ? 'Loading…'
            : `${filtered.length} case${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      <Alert type="error" message={error} />

      {/* Search + filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9B978F', fontSize: '14px' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid #E2DDD6', borderTopColor: '#1D9E75', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 14px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading cases…
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '44px', marginBottom: '14px' }}>🏥</div>
          <h3 style={{ fontSize: '17px', fontWeight: 500, marginBottom: '6px', color: '#1A1917' }}>No cases found</h3>
          <p style={{ fontSize: '13.5px', color: '#6B6860' }}>
            {search || statusFilter !== 'All'
              ? 'Try a different search term or status filter.'
              : 'No patient cases are available yet.'}
          </p>
        </div>
      )}

      {/* Card grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((p) => (
            <PublicPatientCard
              key={p.id}
              patient={p}
              onViewDetail={handleViewDetail}
              onDonate={handleDonate}
            />
          ))}
        </div>
      )}

    </div>
  );
}