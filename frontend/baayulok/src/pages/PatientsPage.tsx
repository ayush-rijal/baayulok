import { useEffect, useRef, useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { PatientCard } from '../components/patients/PatientCard';
import PatientDetailModal from '../components/patients/PatientDetailModal';
import PatientFormModal from '../components/patients/PatientFormModal';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { ALL_STATUSES } from '../styles/utils';
import type { Patient } from '../types';

/* Modal State Begins */
type ModalState =
  | null
  | { type: 'detail'; id: string }
  | { type: 'form';   id?: string };
  /* Modal State Ends */

/* Page-local Animation Styles Begins */
function PatientsMotionStyles() {
  return (
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: no-preference) {
        .pp-toolbar {
          animation: ppFadeDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ppFadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pp-search-input {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .pp-chip {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .pp-chip:hover {
          transform: translateY(-1px) scale(1.04);
        }
        .pp-chip:active {
          transform: scale(0.96);
        }

        .pp-chip-strip::-webkit-scrollbar {
          display: none;
        }

        .pp-newpatient-btn button {
          height: 46px;
          border-radius: 99px !important;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
        }

        .pp-grid > * {
          opacity: 0;
          transform: translateY(22px) scale(0.97);
          animation: ppCardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .pp-grid > *:nth-child(1)  { animation-delay: 0.02s; }
        .pp-grid > *:nth-child(2)  { animation-delay: 0.08s; }
        .pp-grid > *:nth-child(3)  { animation-delay: 0.14s; }
        .pp-grid > *:nth-child(4)  { animation-delay: 0.20s; }
        .pp-grid > *:nth-child(5)  { animation-delay: 0.26s; }
        .pp-grid > *:nth-child(6)  { animation-delay: 0.32s; }
        .pp-grid > *:nth-child(7)  { animation-delay: 0.38s; }
        .pp-grid > *:nth-child(8)  { animation-delay: 0.44s; }
        .pp-grid > *:nth-child(n+9) { animation-delay: 0.48s; }
        @keyframes ppCardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pp-empty, .pp-loading {
          animation: ppFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ppFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pp-empty-icon {
          animation: ppFloat 3s ease-in-out infinite;
        }
        @keyframes ppFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pp-toolbar, .pp-grid > *, .pp-empty, .pp-loading, .pp-empty-icon {
          animation: none !important; opacity: 1 !important; transform: none !important;
        }
      }
    `}</style>
  );
}
/* Page-local Animation Styles Ends */

/* Component Begins */
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
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { void fetchAll(); }, []);

  /* Derived List Begins */
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
  /* Derived List Ends */

  /* Status Change Begins */
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
  /* Status Change Ends */

  /* Modal Helpers Begins */
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

  /* After saving: Close modal and refresh list */
  function handleSaved() {
    void fetchAll();
  }

  /* When "Edit patient" is clicked inside detail modal, switching from detail from modal without closeing overlay. */
  function handleEditFromDetail(patient: Patient) {
    setModal({ type: 'form', id: patient.id });
  }
  /* Modal Helpers Ends */

  /* Render Begins */
  return (
    <div style={{ maxWidth: '1200px' }}>
      <PatientsMotionStyles />

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

      <Alert type="error" message={error ?? statusError} />

      {/* ── Search input + status chips Begins ── */}
      <div className="pp-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', alignItems: 'center', marginBottom: '31px' }}>

        <span className="pp-newpatient-btn">
          <Button onClick={handleNewPatient}>+ New patient</Button>
        </span>

        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '13px', flex: 1, minWidth: 0 }}>

          {/* Search input Begins */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '140px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px', color: '#9B978F', pointerEvents: 'none' }}>
              🔍
            </span>
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, disease, or district…"
              className="pp-search-input"
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2DDD6', borderRadius: '99px', background: '#FFFFFF', fontSize: '17.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E2DDD6'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          {/* Search input Ends */}

          {/* Status filter chips Begins */}
          <div
            className="pp-chip-strip"
            style={{
              display: 'flex', flexWrap: 'nowrap', gap: '8px',
              overflowX: 'auto', flexShrink: 0,
              scrollbarWidth: 'none', paddingBottom: '2px',
            }}
          >
            {(['All', ...ALL_STATUSES] as string[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="pp-chip"
                style={{
                  padding: '7px 17px', borderRadius: '99px', fontSize: '15.5px',
                  fontWeight: 500, cursor: 'pointer', border: '1px solid',
                  fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap',
                  background:  statusFilter === s ? '#E1F5EE' : '#FFFFFF',
                  borderColor: statusFilter === s ? '#1D9E75' : '#E2DDD6',
                  color:       statusFilter === s ? '#0F6E56' : '#6B6860',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Status filter chips Ends */}

        </div>
      </div>
      {/* Search input + status chips Ends */}

      {/* ── Card grid / empty / loading ── */}
      {loading ? (
        <div className="pp-loading" style={{ textAlign: 'center', padding: '104px 26px', color: '#9B978F', fontSize: '18px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2DDD6', borderTopColor: '#1D9E75', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 18px' }} />
          Loading patients…
        </div>
      ) : filtered.length === 0 ? (
        <div className="pp-empty" style={{ textAlign: 'center', padding: '104px 26px' }}>
          <div className="pp-empty-icon" style={{ fontSize: '57px', marginBottom: '18px' }}>🏥</div>
          <h3 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>No patients found</h3>
          <p style={{ fontSize: '17.5px', color: '#6B6860', marginBottom: '26px' }}>
            {search || statusFilter !== 'All'
              ? 'Try a different search term or status filter.'
              : 'Add the first patient case to get started.'}
          </p>
          {!search && statusFilter === 'All' && (
            <Button onClick={handleNewPatient}>+ New patient</Button>
          )}
        </div>
      ) : (
        <div className="pp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '26px' }}>
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
  /* Render Ends */
}
/* Component Ends */