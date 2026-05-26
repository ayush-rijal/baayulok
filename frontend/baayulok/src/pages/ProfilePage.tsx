// import { useAuth } from '../hooks/useAuth';
// import Button from '../components/ui/Button';

// interface AuthUser {
//   fullName?: string;
//   email?: string;
// }

// const fieldLabel: React.CSSProperties = {
//   fontSize: '11.5px', fontWeight: 600, color: '#6B6860',
//   textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px',
// };

// export default function ProfilePage() {
//   const { user, token, logout } = useAuth() as { user: AuthUser | null; token: string | null; logout: () => void };

//   return (
//     <div style={{ maxWidth: '520px' }}>
//       <div style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontSize: '26px', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#1A1917' }}>Profile</h1>
//         <p style={{ fontSize: '13.5px', color: '#6B6860', marginTop: '3px' }}>Your account details</p>
//       </div>

//       <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '10px', padding: '28px' }}>

//         <div style={{ marginBottom: '20px' }}>
//           <div style={fieldLabel}>Full name</div>
//           <div style={{ fontSize: '15px', fontWeight: 500, color: '#1A1917' }}>{user?.fullName || '—'}</div>
//         </div>

//         <div style={{ marginBottom: token ? '20px' : '0' }}>
//           <div style={fieldLabel}>Email</div>
//           <div style={{ fontSize: '15px', color: '#1A1917' }}>{user?.email || '—'}</div>
//         </div>

//         {token && (
//           <div style={{ marginBottom: '4px' }}>
//             <div style={fieldLabel}>Access token (JWT)</div>
//             <div style={{ background: '#EEF5FC', border: '1px solid #C3DAF2', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#185FA5', wordBreak: 'break-all', lineHeight: 1.6 }}>
//               {token.slice(0, 80)}…
//             </div>
//           </div>
//         )}

//         <div style={{ paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #E2DDD6' }}>
//           <Button variant="danger" onClick={logout}>Sign out</Button>
//         </div>
//       </div>
//     </div>
//   );
// }