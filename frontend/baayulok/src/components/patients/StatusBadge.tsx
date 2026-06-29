import type { CSSProperties } from 'react';
import { badgeClass } from '../../styles/utils';

const badgeStyles: Record<string, CSSProperties> = {
  'badge-active':   { background: '#E1F5EE', color: '#0F6E56' },
  'badge-draft':    { background: '#F1EFE8', color: '#5F5E5A' },
  'badge-pending':  { background: '#FAEEDA', color: '#BA7517' },
  'badge-funded':   { background: '#E6F1FB', color: '#185FA5' },
  'badge-closed':   { background: '#F1EFE8', color: '#888780' },
  'badge-rejected': { background: '#FCEBEB', color: '#E24B4A' },
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = badgeClass(status);
  return (
    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.02em', ...badgeStyles[cls] }}>
      {status}
    </span>
  );
}