import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/* Types Begins */
interface NavbarProps {
  expanded: boolean;
  onToggle: () => void;
}
/* Types Ends */

/* Route Begins */
function usePageTitle(): string {
  const { pathname } = useLocation();
  if (pathname.startsWith('/patients/new'))              return 'New Patient';
  if (pathname.match(/^\/patients\/.+\/edit$/))          return 'Edit Patient';
  if (pathname.match(/^\/patients\/.+/))                 return 'Patient Detail';
  if (pathname.startsWith('/patients'))                  return 'Patients';
  if (pathname.startsWith('/dashboard'))                 return 'Dashboard';
  if (pathname.startsWith('/profile'))                   return 'Profile';
  return 'BayuLok';
}
/* Route Ends */

/* Navbar-local animation styles Begins */
function NavbarMotionStyles() {
  return (
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        .navbar-toggle-btn {
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease;
        }
        .navbar-toggle-btn:hover {
          transform: scale(1.06);
        }
        .navbar-toggle-btn:active {
          transform: scale(0.94);
        }
        .navbar-toggle-btn svg {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar-avatar {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .navbar-avatar:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(29,158,117,0.3);
        }

        .navbar-signout-btn {
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.25s ease;
        }
        .navbar-signout-btn:hover {
          transform: translateY(-1px);
        }
        .navbar-signout-btn:active {
          transform: translateY(0) scale(0.97);
        }

        .navbar-title {
          animation: titleFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes titleFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .navbar-header {
          animation: navbarSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes navbarSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .navbar-toggle-btn, .navbar-avatar, .navbar-signout-btn, .navbar-title, .navbar-header {
          transition: none !important; animation: none !important;
        }
      }
    `}</style>
  );
}
/* Navbar-local animation styles Ends */

/* Initials Avatar Begins */
function Avatar({ name, email }: { name?: string; email?: string }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="navbar-avatar" style={{
      width: '30px', height: '30px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
      color: '#fff', fontSize: '15px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, letterSpacing: '0.02em', userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}
/* Initials Avatar Ends */

/* Toggle Icon Begins */
function MenuIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {expanded ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7"  x2="21" y2="7"  />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}
/* Toggle Icon Ends */


/* Component Begins */
export default function Navbar({ expanded, onToggle }: NavbarProps) {
  const { user, logout } = useAuth();
  const pageTitle   = usePageTitle();
  const displayName  = (user as any)?.fullName ?? (user as any)?.name ?? '';
  const displayEmail = user?.email ?? '';

  return (
    <header className="navbar-header" style={{
      position: 'sticky', top: 0, zIndex: 80,   /* below sidebar (90) */
      background: '#FFF',
      borderBottom: '1px solid #E8E5DF',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: '12px',
      height: '57px', flexShrink: 0,
    }}>
      <NavbarMotionStyles />

      {/* Toggle Begins */}
      <button
        onClick={onToggle}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="navbar-toggle-btn"
        style={{
          width: '32px', height: '32px', borderRadius: '7px',
          border: '1px solid #E8E5DF', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#6B6860', flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F5F3EE';
          e.currentTarget.style.color = '#1A1917';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#6B6860';
        }}
      >
        <MenuIcon expanded={expanded} />
      </button>
      {/* Toggle Ends */}

      {/* Current Page Title Begins */}
      <h2 key={pageTitle} className="navbar-title" style={{
        fontSize: '17.5px', fontWeight: 500, color: '#6B6860',
        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {pageTitle}
      </h2>
      {/* Current Page Title Ends */}

      <div style={{ flex: 1 }} />

      {/* Avatar Begins */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <Avatar name={displayName} email={displayEmail} />
      </div>
       {/* Avatat Ends */}


      {/* Sign Out Begins */}
      <button
        onClick={logout}
        className="navbar-signout-btn"
        style={{
          padding: '6px 13px', borderRadius: '7px',
          border: '1px solid #E8E5DF', background: 'transparent',
          color: '#6B6860', fontSize: '16.5px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FEF2F2';
          e.currentTarget.style.borderColor = '#FECACA';
          e.currentTarget.style.color = '#DC2626';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = '#E8E5DF';
          e.currentTarget.style.color = '#6B6860';
        }}
      >
        Sign out
      </button>
      {/* Sign Out Ends */}

    </header>
  );
}
/* Component Ends */