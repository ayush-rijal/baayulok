import type { ReactNode, MouseEvent } from 'react';
import Button from './Button';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ title, onClose, children, footer }: ModalProps) {
  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,25,23,0.55)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '640px',
          /* Fixed viewport-relative height — modal never grows or shrinks between tabs */
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden',   /* clip children — scrolling is handled inside */
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #E2DDD6',
            background: '#FFFFFF',
            flexShrink: 0,   /* never shrink — always visible */
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>{title}</h3>
          <Button variant="secondary" size="sm" onClick={onClose}>✕ Close</Button>
        </div>

        {/* Scrollable body — fills all remaining space */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {children}
        </div>

        {/* Optional sticky footer */}
        {footer && (
          <div
            style={{
              display: 'flex', gap: '10px', justifyContent: 'flex-end',
              padding: '14px 24px',
              borderTop: '1px solid #E2DDD6',
              background: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}