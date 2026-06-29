import type { CSSProperties } from 'react';

type AlertType = 'error' | 'success' | 'info';

interface AlertProps {
  type?: AlertType;
  message?: string | null;
  style?: CSSProperties;
}

const typeStyles: Record<AlertType, CSSProperties> = {
  error:   { background: '#FCEBEB', color: '#791F1F', border: '1px solid #F09595' },
  success: { background: '#E1F5EE', color: '#0F6E56', border: '1px solid #5DCAA5' },
  info:    { background: '#E6F1FB', color: '#185FA5', border: '1px solid #85B7EB' },
};

export default function Alert({ type = 'info', message, style: extra = {} }: AlertProps) {
  if (!message) return null;
  return (
    <div style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', ...typeStyles[type], ...extra }}>
      {message}
    </div>
  );
}