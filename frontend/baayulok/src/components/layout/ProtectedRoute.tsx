import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SIDEBAR_EXPANDED  = '224px';
const SIDEBAR_COLLAPSED = '60px';

export default function ProtectedRoute() {
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(true);

  if (!token) return <Navigate to="/" replace />;

  const sidebarW = expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE' }}>

      {/* Sidebar — fixed, full height, always visible */}
      <Sidebar expanded={expanded} />

      {/* Right column — pushed right by sidebar width */}
      <div
        style={{
          marginLeft: sidebarW,
          transition: 'margin-left 0.22s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Sticky navbar — sits at top of right column */}
        <Navbar
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}