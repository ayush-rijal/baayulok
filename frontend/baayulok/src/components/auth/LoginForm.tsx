// import { useState, type FormEvent } from 'react';
// import Alert from '../ui/Alert';
// import Button from '../ui/Button';
// import { INPUT_STYLE, LABEL_STYLE } from '../../styles/utils';

// interface LoginFormProps {
//   onSubmit: (credentials: { email: string; password: string }) => void;
//   error?: string | null;
//   loading?: boolean;
// }

// export default function LoginForm({ onSubmit, error, loading }: LoginFormProps) {
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');

//   function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     onSubmit({ email, password });
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <Alert type="error" message={error} />
//       <div style={{ marginBottom: '16px' }}>
//         <label style={LABEL_STYLE}>Email</label>
//         <input style={INPUT_STYLE} type="email" placeholder="you@hospital.np" value={email} onChange={(e) => setEmail(e.target.value)} required />
//       </div>
//       <div style={{ marginBottom: '20px' }}>
//         <label style={LABEL_STYLE}>Password</label>
//         <input style={INPUT_STYLE} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
//       </div>
//       <Button type="submit" full disabled={loading}>
//         {loading ? 'Signing in…' : 'Sign in'}
//       </Button>
//     </form>
//   );
// }