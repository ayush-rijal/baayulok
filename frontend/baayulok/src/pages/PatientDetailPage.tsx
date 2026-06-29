// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { usePatients } from '../hooks/usePatients';
// import PatientDetail from '../components/patients/PatientDetail';
// import DocumentsPanel from '../components/patients/DocumentsPanel';
// import DonationsPanel from '../components/patients/DonationsPanel';
// import Spinner from '../components/ui/Spinner';
// import Alert from '../components/ui/Alert';
// import Button from '../components/ui/Button';

// // ─── Types ────────────────────────────────────────────────────────
// type Tab = 'overview' | 'documents' | 'donations';

// const TABS: { key: Tab; label: string }[] = [
//   { key: 'overview',   label: 'Overview'  },
//   { key: 'documents',  label: 'Documents' },
//   { key: 'donations',  label: 'Donations' },
// ];

// // ─── Page ─────────────────────────────────────────────────────────
// export default function PatientDetailPage() {
//   const { id }       = useParams<{ id: string }>();
//   const navigate     = useNavigate();
//   const { fetchOne, fetchDocuments, addDocument, fetchDonations, addDonation } = usePatients();

//   const [patient, setPatient] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string | null>(null);
//   const [tab, setTab]         = useState<Tab>('overview');

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await fetchOne(id);
//         if (!data) throw new Error('Patient not found.');
//         setPatient(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   return (
//     <div style={{ maxWidth: '800px' }}>

//       {/* Header */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
//         <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
//           ← Back
//         </Button>
//         <div>
//           <h1 style={{ fontSize: '24px', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#1A1917' }}>
//             {patient?.name ?? 'Patient detail'}
//           </h1>
//           {patient && (
//             <p style={{ fontSize: '13px', color: '#6B6860', marginTop: '2px' }}>
//               {patient.age} yrs · {patient.gender} · {patient.district}
//             </p>
//           )}
//         </div>
//       </div>

//       {loading && <Spinner />}
//       <Alert type="error" message={error} />

//       {!loading && patient && (
//         <>
//           {/* Tabs */}
//           <div style={{ display: 'flex', borderBottom: '1px solid #E2DDD6', marginBottom: '28px', gap: '4px' }}>
//             {TABS.map(({ key, label }) => (
//               <button
//                 key={key}
//                 onClick={() => setTab(key)}
//                 style={{
//                   padding: '9px 18px',
//                   fontSize: '13.5px',
//                   fontWeight: tab === key ? 600 : 400,
//                   cursor: 'pointer',
//                   border: 'none',
//                   borderBottom: tab === key ? '2px solid #1D9E75' : '2px solid transparent',
//                   background: 'transparent',
//                   color: tab === key ? '#1D9E75' : '#6B6860',
//                   fontFamily: 'inherit',
//                   transition: 'all 0.15s',
//                 }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           {/* Panel */}
//           <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '10px', padding: '28px' }}>
//             {tab === 'overview' && <PatientDetail patient={patient} />}

//             {tab === 'documents' && (
//               <DocumentsPanel
//                 patientId={id!}
//                 fetchDocuments={fetchDocuments}
//                 addDocument={addDocument}
//               />
//             )}

//             {tab === 'donations' && (
//               <DonationsPanel
//                 patientId={id!}
//                 fetchDonations={fetchDonations}
//                 addDonation={addDonation}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }