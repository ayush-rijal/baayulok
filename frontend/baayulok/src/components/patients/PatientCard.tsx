import type { CSSProperties } from 'react';
import type { Patient, PatientStatus } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtNPR = (n: number): string =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

function critColor(score: number): string {
  if (score >= 85) return '#E24B4A';
  if (score >= 70) return '#EF9F27';
  return '#1D9E75';
}

function statusBadgeStyle(status: PatientStatus): CSSProperties {
  const map: Record<PatientStatus, CSSProperties> = {
    Active:        { background: '#E1F5EE', color: '#0F6E56' },
    Draft:         { background: '#F1EFE8', color: '#5F5E5A' },
    PendingReview: { background: '#FAEEDA', color: '#92400E' },
    Funded:        { background: '#E1F5EE', color: '#0F6E56' },
    Closed:        { background: '#F1EFE8', color: '#888780' },
    Rejected:      { background: '#FCEBEB', color: '#E24B4A' },
  };
  return map[status] ?? map.Draft;
}

// ─── Fallback avatar (inline SVG data URI — no external dep) ─────────────────

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E" +
  "%3Crect width='400' height='250' fill='%23F5F3EE'/%3E" +
  "%3Ccircle cx='200' cy='95' r='36' fill='%23E2DDD6'/%3E" +
  "%3Cellipse cx='200' cy='185' rx='60' ry='40' fill='%23E2DDD6'/%3E%3C/svg%3E";

// ─── Shared sub-styles ────────────────────────────────────────────────────────

const ghostBtn: CSSProperties = {
  padding: '8px 14px',
  borderRadius: '10px',
  border: '1px solid #E2DDD6',
  background: '#FFFFFF',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  color: '#1A1917',
  transition: 'background 0.15s',
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PatientCardProps {
  /** Patient data, extended with an optional display image URL. */
  patient: Patient & { imageUrl?: string };
  /** True while a status-change request is in flight (disables dropdown). */
  updatingStatus?: boolean;
  /** Called when the user clicks "Details". */
  onViewDetail?: (patient: Patient) => void;
  /** Called when the user clicks "Edit". Hidden when omitted. */
  onEdit?: (patient: Patient) => void;
  /** Called on status-dropdown change. Dropdown hidden when omitted or empty. */
  onStatusChange?: (id: string, status: string) => Promise<void>;
  /** List of allowed status values for the dropdown. */
  allStatuses?: string[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PatientCard({
  patient,
  updatingStatus = false,
  onViewDetail,
  onEdit,
  onStatusChange,
  allStatuses = [],
}: PatientCardProps) {
  const raised    = patient.costRaised ?? 0;
  const pct       = patient.costTotal > 0
    ? Math.min(100, Math.round((raised / patient.costTotal) * 100))
    : 0;
  const remaining = Math.max(0, patient.costTotal - raised);

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '10px',
        border: '1px solid #EEECE7',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      }}
    >

      {/* ── Image banner ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: '14px' }}>
        <img
          src={patient.imageUrl ?? FALLBACK_IMG}
          alt={patient.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
        />

        {/* Emergency / verified icon badges */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
          {patient.isEmergency && (
            <span title="Emergency" style={{ background: '#E24B4A', color: '#fff', width: '24px', height: '24px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 8px rgba(226,75,74,0.35)' }}>
              ⚠
            </span>
          )}
          {patient.bipannaVerified && (
            <span title="Bipanna Verified" style={{ background: '#1D9E75', color: '#fff', width: '24px', height: '24px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 8px rgba(29,158,117,0.35)' }}>
              ✓
            </span>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '12px 8px 6px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Identity row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1A1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {patient.name}
          </h3>
          <span style={{ fontSize: '11px', fontWeight: 700, color: critColor(patient.criticalityScore), textTransform: 'uppercase', flexShrink: 0, marginLeft: '8px' }}>
            {patient.criticalityScore}% critical
          </span>
        </div>

        <p style={{ fontSize: '12px', color: '#6B6860', margin: '0 0 6px' }}>
          {patient.age}y · {patient.gender} · {patient.district}
        </p>

        {/* Criticality mini-bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '99px', background: '#E2DDD6', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${patient.criticalityScore}%`, background: critColor(patient.criticalityScore), borderRadius: '99px' }} />
          </div>
          <span style={{ fontSize: '11px', color: '#6B6860', flexShrink: 0 }}>{patient.criticalityScore}/100</span>
        </div>

        {/* Diagnosis pill */}
        <div style={{ background: '#F5F3EE', borderRadius: '10px', padding: '7px 11px', marginBottom: '10px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1917', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {patient.disease}
          </p>
          {patient.medicalSummary && (
            <p style={{ fontSize: '11.5px', color: '#6B6860', margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {patient.medicalSummary}
            </p>
          )}
        </div>

        {/* Status row — shown only when allStatuses is provided */}
        {allStatuses.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px', ...statusBadgeStyle(patient.status) }}>
              {patient.status}
            </span>

            <select
              value={patient.status}
              disabled={updatingStatus}
              onChange={(e) => void onStatusChange?.(patient.id, e.target.value)}
              style={{ fontSize: '11px', padding: '3px 6px', border: '1px solid #E2DDD6', borderRadius: '6px', background: '#F5F3EE', cursor: updatingStatus ? 'wait' : 'pointer', fontFamily: 'inherit', color: '#1A1917', opacity: updatingStatus ? 0.6 : 1 }}
            >
              {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {patient.bipannaVerified && (
              <span style={{ fontSize: '11px', color: '#1D9E75', fontWeight: 600, marginLeft: 'auto' }}>✓ Bipanna</span>
            )}
          </div>
        )}

        {/* Funding progress */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ height: '5px', background: '#E2DDD6', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#1D9E75', borderRadius: '99px', transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '11px', fontWeight: 600 }}>
            <span style={{ color: '#1D9E75' }}>{pct}% funded</span>
            <span style={{ color: '#9B978F' }}>NPR {fmtNPR(remaining)} to go</span>
          </div>
        </div>

        {/* Footer — raised amount + action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1917' }}>NPR {fmtNPR(raised)}</div>
            <div style={{ fontSize: '10px', color: '#9B978F', fontWeight: 600, textTransform: 'uppercase', marginTop: '1px' }}>Raised</div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {onEdit && (
              <button
                onClick={() => onEdit(patient)}
                style={ghostBtn}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F3EE')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                Edit
              </button>
            )}

            <button
              onClick={() => onViewDetail?.(patient)}
              style={ghostBtn}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F3EE')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}