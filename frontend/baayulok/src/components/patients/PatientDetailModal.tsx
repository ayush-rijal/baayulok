import { useEffect, useState, type MouseEvent, type CSSProperties } from 'react';
import { usePatients } from '../../hooks/usePatients';
import PatientDetail from './PatientDetail';
import DocumentsPanel from './DocumentsPanel';
import DonationsPanel from './DonationsPanel';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import type { Patient } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'documents' | 'donations';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',  label: 'Overview'  },
  { key: 'documents', label: 'Documents' },
  { key: 'donations', label: 'Donations' },
];

interface PatientDetailModalProps {
  patientId: string;
  onClose: () => void;
  /**
   * Called when the user clicks "Edit patient" in the Overview tab.
   * Wired in PatientsPage to handleEditFromDetail which switches the
   * modal state from detail → form — same path as PatientCard's Edit button.
   */
  onEdit?: (patient: Patient) => void;
  /** Which tab to open first. Defaults to 'overview'. */
  defaultTab?: Tab;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  maxWidth: '680px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  overflow: 'hidden',
};

const closeBtn: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#6B6860', padding: '6px', lineHeight: 0,
  borderRadius: '6px', flexShrink: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatientDetailModal({
  patientId,
  onClose,
  onEdit,
  defaultTab = 'overview',
}: PatientDetailModalProps) {
  const {
    fetchOne,
    fetchDocuments, addDocument,
    fetchDonations, addDonation,
  } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>(defaultTab);

  // ── Load patient on mount ─────────────────────────────────────────────────
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

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Close on overlay click ────────────────────────────────────────────────
  function handleOverlay(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div style={overlay} onClick={handleOverlay}>
      <div style={sheet}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 24px 0',
          flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1917', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? 'Loading…' : (patient?.name ?? 'Patient detail')}
            </h2>
            {/* Subtitle — shown once patient loads */}
            {patient && (
              <p style={{ fontSize: '13px', color: '#6B6860', margin: '3px 0 0' }}>
                {patient.age} yrs · {patient.gender} · {patient.district}
              </p>
            )}
          </div>

          {/* Close button */}
          <button style={closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Tab bar — sticky to the top of the scrollable body ── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2DDD6',
          padding: '4px 24px 0',
          flexShrink: 0,
          marginTop: '12px',
        }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '8px 18px',
                fontSize: '13.5px',
                fontWeight: tab === key ? 600 : 400,
                cursor: 'pointer',
                border: 'none',
                borderBottom: tab === key ? '2px solid #1D9E75' : '2px solid transparent',
                background: 'transparent',
                color: tab === key ? '#1D9E75' : '#6B6860',
                fontFamily: 'inherit',
                transition: 'color 0.15s',
                marginBottom: '-1px',   // sit on top of the border-bottom
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading && <Spinner />}
          <Alert type="error" message={error} />

          {!loading && patient && (
            <>
              {tab === 'overview' && (
                <PatientDetail
                  patient={patient}
                  // Always passes a handler — required prop.
                  // If PatientsPage provides onEdit (switches to form modal),
                  // use it; otherwise fall back to just closing this modal.
                  onEdit={() => onEdit ? onEdit(patient) : onClose()}
                />
              )}

              {tab === 'documents' && (
                <DocumentsPanel
                  patientId={patientId}
                  fetchDocuments={fetchDocuments}
                  addDocument={addDocument}
                />
              )}

              {tab === 'donations' && (
                <DonationsPanel
                  patientId={patientId}
                  fetchDonations={fetchDonations}
                  addDonation={addDonation}
                />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}