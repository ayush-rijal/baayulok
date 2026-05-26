// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { usePatients } from '../hooks/usePatients';
// import PatientForm from '../components/patients/PatientForm';
// import Spinner from '../components/ui/Spinner';
// import Button from '../components/ui/Button';

// export default function PatientFormPage() {
//   const { id }   = useParams<{ id: string }>();
//   const isEdit   = Boolean(id);
//   const navigate = useNavigate();
//   const { fetchOne, create, update } = usePatients();

//   const [initial, setInitial] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(isEdit);

//   useEffect(() => {
//     if (!isEdit || !id) return;
//     fetchOne(id).then((data) => {
//       setInitial(data ?? {});
//       setLoading(false);
//     });
//   }, [id]);

//   async function handleSubmit(data: Record<string, any>) {
//     if (isEdit && id) {
//       await update(id, data);
//     } else {
//       await create(data);
//     }
//     navigate('/patients');
//   }

//   return (
//     <div style={{ maxWidth: '760px' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
//         <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
//           ← Back
//         </Button>
//         <h1 style={{ fontSize: '24px', fontWeight: 400, fontFamily: 'Georgia, serif', color: '#1A1917' }}>
//           {isEdit ? 'Edit patient' : 'New patient'}
//         </h1>
//       </div>

//       {loading && <Spinner />}

//       {!loading && (
//         <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '10px', padding: '28px' }}>
//           <PatientForm
//             initial={initial}
//             isEdit={isEdit}
//             onSubmit={handleSubmit}
//             onCancel={() => navigate('/patients')}
//           />
//         </div>
//       )}
//     </div>
//   );
// }