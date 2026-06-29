import { NavLink } from 'react-router-dom';

/* Nav Items Begins */
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
    to: '/cases',
    label: 'Cases',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
/* Nav Items Ends */

/* Props Begins */
interface SidebarProps {
  expanded: boolean;
}
/* Props Ends */

/* Sidebar-local animation styles Begins */
function SidebarMotionStyles() {
  return (
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        .sidebar-brand-icon {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sidebar-brand-icon:hover {
          transform: scale(1.08) rotate(-4deg);
        }

        .sidebar-nav-link {
          position: relative;
          transition: background 0.3s ease, color 0.3s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), padding 0.22s ease;
        }
        .sidebar-nav-link:hover {
          transform: translateX(2px);
        }
        .sidebar-nav-link svg {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sidebar-nav-link:hover svg {
          transform: scale(1.12);
        }
        .sidebar-nav-link.is-active {
          animation: navActivePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes navActivePop {
          0%   { transform: scale(0.96); }
          60%  { transform: scale(1.015); }
          100% { transform: scale(1); }
        }

        .sidebar-label-fade {
          animation: labelFadeIn 0.3s ease;
        }
        @keyframes labelFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .sidebar-nav-link, .sidebar-brand-icon, .sidebar-nav-link svg { transition: none !important; animation: none !important; }
      }
    `}</style>
  );
}
/* Sidebar-local animation styles Ends */

/* Component Begins */
export default function Sidebar({ expanded }: SidebarProps) {
  const W = expanded ? '224px' : '60px';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: W,
        height: '100vh', 
        background: '#FAFAF8',
        borderRight: '1px solid #E8E5DF',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <SidebarMotionStyles />

      {/* Brand Begins */}
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
          transition: 'padding 0.3s ease',
        }}
      >
        <span
          className="sidebar-brand-icon"
          style={{
            width: '30px', height: '30px',
            background: '#1D9E75', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 4px 12px rgba(29,158,117,0.25)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
        {expanded && (
          <span className="sidebar-label-fade" style={{ fontSize: '19.5px', fontWeight: 700, color: '#1A1917', whiteSpace: 'nowrap' }}>
            Bayu<span style={{ color: '#1D9E75' }}>Lok</span>
          </span>
        )}
      </div>
      {/* Brand Ends */}

      {/* Nav Items Begins */}
      <div style={{ flex: 1, padding: expanded ? '16px 12px' : '16px 0', overflowY: 'auto', transition: 'padding 0.3s ease' }}>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={!expanded ? item.label : undefined}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' is-active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: expanded ? '10px' : '0',
              justifyContent: expanded ? 'flex-start' : 'center',
              padding: expanded ? '8px 10px' : '11px 0',
              borderRadius: '8px',
              marginBottom: '2px',
              fontSize: '17.5px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#1D9E75' : '#4A4740',
              background: isActive ? '#E8F7F2' : 'transparent',
              textDecoration: 'none',
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
            {expanded && <span className="sidebar-label-fade">{item.label}</span>}
          </NavLink>
        ))}
      </div>
      {/* Nav Items Ends */}

    </nav>
  );
}
/* Component Ends */