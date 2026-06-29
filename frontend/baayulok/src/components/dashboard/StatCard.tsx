// import type { CSSProperties } from 'react';

// type TagColor = 'teal' | 'red' | 'blue' | 'gray';

// interface StatCardProps {
//   label: string;
//   value: number;
//   tagLabel?: string;
//   tagColor?: TagColor;
// }

// const tagStyles: Record<TagColor, CSSProperties> = {
//   teal: { background: '#E1F5EE', color: '#0F6E56' },
//   red:  { background: '#FCEBEB', color: '#E24B4A' },
//   blue: { background: '#E6F1FB', color: '#185FA5' },
//   gray: { background: '#F1EFE8', color: '#5F5E5A' },
// };

// export default function StatCard({ label, value, tagLabel, tagColor = 'teal' }: StatCardProps) {
//   return (
//     <div style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '10px', padding: '18px 20px' }}>
//       <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#6B6860', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</div>
//       <div style={{ fontSize: '26px', fontWeight: 300, color: '#1A1917' }}>{value}</div>
//       {tagLabel && (
//         <div style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', marginTop: '6px', ...tagStyles[tagColor] }}>
//           {tagLabel}
//         </div>
//       )}
//     </div>
//   );
// }