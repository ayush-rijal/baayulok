import type { PatientStatus } from '../types';

export function formatMoney(amount: number): string {
  return 'Rs. ' + Number(amount || 0).toLocaleString('en-IN');
}

export function critColor(score: number): string {
  if (score >= 75) return '#E24B4A';
  if (score >= 50) return '#EF9F27';
  return '#1D9E75';
}

type BadgeKey =
  | 'badge-active'
  | 'badge-draft'
  | 'badge-pending'
  | 'badge-funded'
  | 'badge-closed'
  | 'badge-rejected';

const statusMap: Record<PatientStatus, BadgeKey> = {
  Active:        'badge-active',
  Draft:         'badge-draft',
  PendingReview: 'badge-pending',
  Funded:        'badge-funded',
  Closed:        'badge-closed',
  Rejected:      'badge-rejected',
};

export function badgeClass(status: string): BadgeKey {
  return statusMap[status as PatientStatus] ?? 'badge-draft';
}

export const ALL_STATUSES: PatientStatus[] = [
  'Draft',
  'PendingReview',
  'Active',
  'Funded',
  'Closed',
  'Rejected',
];

export const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #E2DDD6',
  borderRadius: '6px',
  background: '#F5F3EE',
  fontSize: '14px',
  color: '#1A1917',
  outline: 'none',
};

export const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: 500,
  color: '#6B6860',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};