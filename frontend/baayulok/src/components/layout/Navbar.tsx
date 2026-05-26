import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────
interface NavbarProps {
  expanded: boolean;
  onToggle: () => void;
}

// ─── Route → page title ───────────────────────────────────────────
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

// ─── Initials avatar ──────────────────────────────────────────────
function Avatar({ name, email }: { name?: string; email?: string }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : email?.[0]?.toUpperCase() ?? '?';

  return (
    <div style={{
      width: '30px', height: '30px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
      color: '#fff', fontSize: '11.5px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, letterSpacing: '0.02em', userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

// ─── Toggle icon ──────────────────────────────────────────────────
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


// ─── Component ────────────────────────────────────────────────────
export default function Navbar({ expanded, onToggle }: NavbarProps) {
  const { user, logout } = useAuth();
  const pageTitle   = usePageTitle();
  const displayName  = (user as any)?.fullName ?? (user as any)?.name ?? '';
  const displayEmail = user?.email ?? '';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 80,   /* below sidebar (90) */
      background: '#FFF',
      borderBottom: '1px solid #E8E5DF',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: '12px',
      height: '57px', flexShrink: 0,
    }}>

      {/* Toggle */}
      <button
        onClick={onToggle}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        style={{
          width: '32px', height: '32px', borderRadius: '7px',
          border: '1px solid #E8E5DF', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#6B6860', flexShrink: 0,
          transition: 'background 0.15s, color 0.15s',
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

      {/* Current page title */}
      <h2 style={{
        fontSize: '13.5px', fontWeight: 500, color: '#6B6860',
        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {pageTitle}
      </h2>

      <div style={{ flex: 1 }} />

      {/* Avatar + name/email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <Avatar name={displayName} email={displayEmail} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
          {/* {displayName && (
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A1917', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
          )}
          {displayEmail && (
            <span style={{
              fontSize: displayName ? '11px' : '12.5px',
              color: '#9B978F', whiteSpace: 'nowrap',
              maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {displayEmail}
            </span>
          )} */}
        </div>
      </div>


      {/* Sign out */}
      <button
        onClick={logout}
        style={{
          padding: '6px 13px', borderRadius: '7px',
          border: '1px solid #E8E5DF', background: 'transparent',
          color: '#6B6860', fontSize: '12.5px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
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

    </header>
  );
}