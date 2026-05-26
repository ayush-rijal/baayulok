import { NavLink } from 'react-router-dom';

// ─── Nav items ────────────────────────────────────────────────────
const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/patients',
    label: 'Patients',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
] as const;

// ─── Props ────────────────────────────────────────────────────────
interface SidebarProps {
  expanded: boolean;
}

// ─── Component ────────────────────────────────────────────────────
export default function Sidebar({ expanded }: SidebarProps) {
  const W = expanded ? '224px' : '60px';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: W,
        height: '100vh',          /* full viewport height always */
        background: '#FFF',
        borderRight: '1px solid #E8E5DF',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        transition: 'width 0.22s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* ── Brand (top of sidebar, height matches navbar) ── */}
      <div
        style={{
          height: '57px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: expanded ? '0 18px' : '0',
          justifyContent: expanded ? 'flex-start' : 'center',
          borderBottom: '1px solid #E8E5DF',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: '30px', height: '30px',
            background: '#1D9E75', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
        {expanded && (
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1917', whiteSpace: 'nowrap' }}>
            Bayu<span style={{ color: '#1D9E75' }}>Lok</span>
          </span>
        )}
      </div>

      {/* ── Nav items ── */}
      <div style={{ flex: 1, padding: expanded ? '16px 12px' : '16px 0', overflowY: 'auto' }}>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!expanded ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: expanded ? '10px' : '0',
              justifyContent: expanded ? 'flex-start' : 'center',
              padding: expanded ? '8px 10px' : '11px 0',
              borderRadius: '8px',
              marginBottom: '2px',
              fontSize: '13.5px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#1D9E75' : '#4A4740',
              background: isActive ? '#E8F7F2' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            })}
            onMouseEnter={(e) => {
              const a = e.currentTarget;
              if (a.getAttribute('aria-current') !== 'page') a.style.background = '#F3F2EE';
            }}
            onMouseLeave={(e) => {
              const a = e.currentTarget;
              if (a.getAttribute('aria-current') !== 'page') a.style.background = 'transparent';
            }}
          >
            {item.icon}
            {expanded && item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}