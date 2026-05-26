// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StatusBadge from './StatusBadge';
// import Button from '../ui/Button';
// import Spinner from '../ui/Spinner';
// import { formatMoney, critColor, ALL_STATUSES } from '../../styles/utils';
// import type { Patient } from '../../types';

// interface PatientTableProps {
//   patients: Patient[];
//   loading: boolean;
//   onStatusChange: (id: string, status: string) => Promise<void>;
//   onViewDetail?: (id: string) => void;
// }

// const TH_STYLE: React.CSSProperties = {
//   fontSize: '11.5px', fontWeight: 600, color: '#6B6860',
//   textTransform: 'uppercase', letterSpacing: '0.04em',
//   padding: '10px 16px', textAlign: 'left',
//   borderBottom: '1px solid #E2DDD6', background: '#F5F3EE',
// };

// export default function PatientTable({ patients, loading, onStatusChange, onViewDetail }: PatientTableProps) {
//   const navigate     = useNavigate();
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   async function handleStatusChange(id: string, newStatus: string) {
//     setUpdatingId(id);
//     try { await onStatusChange(id, newStatus); }
//     finally { setUpdatingId(null); }
//   }

//   if (loading) return <Spinner />;

//   if (!patients.length) {
//     return (
//       <div style={{ textAlign: 'center', padding: '60px 20px' }}>
//         <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏥</div>
//         <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '6px' }}>No patients found</h3>
//         <p style={{ fontSize: '13.5px', color: '#6B6860' }}>Try a different filter or add a new case.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ overflowX: 'auto' }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             {['Patient', 'Disease', 'Status', 'Criticality', 'Cost', 'Actions'].map((h) => (
//               <th key={h} style={TH_STYLE}>{h}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {patients.map((p) => (
//             <tr key={p.id} style={{ borderBottom: '1px solid #E2DDD6' }}>

//               {/* Patient */}
//               <td style={{ padding: '12px 16px' }}>
//                 <strong style={{ fontSize: '13.5px' }}>{p.name}</strong>
//                 <div style={{ fontSize: '12px', color: '#6B6860', marginTop: '2px' }}>
//                   {p.district} · {p.age}y · {p.gender}
//                 </div>
//                 {p.isEmergency && (
//                   <div style={{ fontSize: '11px', color: '#E24B4A', fontWeight: 600, marginTop: '2px' }}>
//                     🚨 Emergency
//                   </div>
//                 )}
//               </td>

//               {/* Disease */}
//               <td style={{ padding: '12px 16px', fontSize: '13.5px' }}>{p.disease}</td>

//               {/* Status */}
//               <td style={{ padding: '12px 16px' }}>
//                 <StatusBadge status={p.status} />
//                 <div style={{ marginTop: '6px' }}>
//                   <select
//                     value={p.status}
//                     disabled={updatingId === p.id}
//                     onChange={(e) => handleStatusChange(p.id, e.target.value)}
//                     style={{ fontSize: '11px', padding: '2px 4px', border: '1px solid #E2DDD6', borderRadius: '4px', background: '#F5F3EE', cursor: 'pointer', fontFamily: 'inherit' }}
//                   >
//                     {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                 </div>
//                 {p.bipannaVerified && (
//                   <div style={{ fontSize: '11px', color: '#1D9E75', fontWeight: 600, marginTop: '4px' }}>✓ Bipanna</div>
//                 )}
//               </td>

//               {/* Criticality */}
//               <td style={{ padding: '12px 16px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <div style={{ width: '80px', height: '6px', borderRadius: '99px', background: '#E2DDD6', overflow: 'hidden' }}>
//                     <div style={{ height: '100%', width: `${p.criticalityScore || 0}%`, background: critColor(p.criticalityScore || 0), borderRadius: '99px' }} />
//                   </div>
//                   <span style={{ fontSize: '12px' }}>{p.criticalityScore}/100</span>
//                 </div>
//               </td>

//               {/* Cost */}
//               <td style={{ padding: '12px 16px' }}>
//                 <div style={{ fontSize: '13.5px' }}>{formatMoney(p.costTotal)}</div>
//                 <div style={{ fontSize: '11.5px', color: '#1D9E75', marginTop: '2px' }}>
//                   Raised: {formatMoney(p.costRaised)}
//                 </div>
//               </td>

//               {/* Actions */}
//               <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => onViewDetail ? onViewDetail(p.id) : navigate(`/patients/${p.id}`)}
//                   >
//                     View
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => navigate(`/patients/${p.id}/edit`)}
//                   >
//                     Edit
//                   </Button>
//                 </div>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }