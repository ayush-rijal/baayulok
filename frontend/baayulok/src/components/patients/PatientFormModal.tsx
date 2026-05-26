import { useEffect, useState, type MouseEvent, type CSSProperties } from 'react';
import { usePatients } from '../../hooks/usePatients';
import PatientForm from './PatientForm';
import Spinner from '../ui/Spinner';
import type { CreatePatientPayload, UpdatePatientPayload, Patient } from '../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PatientFormModalProps {
  /**
   * Pass a patient ID to open in edit mode.
   * Omit (or pass undefined) to open in create mode.
   */
  patientId?: string;
  onClose: () => void;
  /** Called after a successful create or update so the list can be refreshed. */
  onSaved: () => void;
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
  maxHeight: '92vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  overflow: 'hidden',
};

const closeBtn: CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#6B6860', padding: '6px', lineHeight: 0, borderRadius: '6px',
  flexShrink: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatientFormModal({
  patientId,
  onClose,
  onSaved,
}: PatientFormModalProps) {
  const isEdit = Boolean(patientId);
  const { fetchOne, create, update } = usePatients();

  const [initial, setInitial]   = useState<Partial<Patient>>({});
  const [loading, setLoading]   = useState(isEdit);

  // Load existing patient data when editing
  useEffect(() => {
    if (!isEdit || !patientId) return;
    let cancelled = false;
    setLoading(true);
    fetchOne(patientId).then((data) => {
      if (cancelled) return;
      setInitial(data ?? {});
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [patientId]);

  // Close on overlay click
  function handleOverlay(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(data: CreatePatientPayload | UpdatePatientPayload) {
    if (isEdit && patientId) {
      await update(patientId, data as UpdatePatientPayload);
    } else {
      await create(data as CreatePatientPayload);
    }
    onSaved();
    onClose();
  }

  return (
    <div style={overlay} onClick={handleOverlay}>
      <div style={sheet}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #E2DDD6', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1917', margin: 0 }}>
              {isEdit ? 'Edit patient' : 'New patient'}
            </h2>
            <p style={{ fontSize: '12px', color: '#6B6860', margin: '2px 0 0' }}>
              {isEdit ? 'Update the patient case details below.' : 'Fill in the details to create a new patient case.'}
            </p>
          </div>
          <button style={closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading
            ? <Spinner text="Loading patient data…" />
            : (
              <PatientForm
                initial={initial}
                isEdit={isEdit}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            )
          }
        </div>

      </div>
    </div>
  );
}