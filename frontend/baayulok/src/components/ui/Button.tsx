import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';
type Size    = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  style?: CSSProperties;
}

const base: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  padding: '10px 18px', borderRadius: '6px', fontSize: '13.5px',
  fontWeight: 500, cursor: 'pointer', border: 'none',
  transition: 'all 0.15s', fontFamily: 'inherit',
};

const variants: Record<Variant, CSSProperties> = {
  primary:   { background: '#1D9E75', color: '#fff' },
  secondary: { background: '#FFFFFF', color: '#1A1917', border: '1px solid #E2DDD6' },
  danger:    { background: '#FCEBEB', color: '#E24B4A' },
};

export default function Button({
  children, variant = 'primary', size, full, disabled, style: extra = {}, ...rest
}: ButtonProps) {
  const combined: CSSProperties = {
    ...base,
    ...variants[variant],
    ...(size === 'sm' ? { padding: '6px 12px', fontSize: '12.5px' } : {}),
    ...(full ? { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' } : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...extra,
  };
  return (
    <button disabled={disabled} style={combined} {...rest}>
      {children}
    </button>
  );
}