import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

/* Types Begins */
type ModalType = 'login' | 'register' | null;
/* Types Ends */

/* Data Begins */
const TRUST_ITEMS = [
  { icon: '🛡️', label: 'Bipanna Verified',   desc: 'Identity & need certified' },
  { icon: '🤝', label: 'Direct to Hospital', desc: 'Funds paid to providers'   },
  { icon: '✨', label: 'Transparent',        desc: 'Every transaction tracked' },
] as const;

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse cases',   desc: 'View verified patients who need urgent financial support for treatment.' },
  { step: '02', title: 'Choose to help', desc: 'Select a patient and contribute any amount via Esewa, Khalti, or bank transfer.' },
  { step: '03', title: 'Track impact',   desc: "Follow the patient's progress and see exactly how your contribution is used." },
] as const;
/* Data Ends */

/* Shared styles Begins */
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #E2DDD6',
  borderRadius: '6px', background: '#F5F3EE', fontSize: '14px',
  color: '#1A1917', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600, color: '#6B6860',
  marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const ghostBtn: React.CSSProperties = {
  background: 'none', border: 'none', padding: 0,
  color: '#1D9E75', fontWeight: 500, fontSize: '13px',
  cursor: 'pointer', fontFamily: 'inherit',
};
/* Shared styles Ends */


/* Modal Begins */
interface ModalProps { open: boolean; onClose: () => void; children: React.ReactNode; }

function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(26,25,23,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeIn 0.18s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2DDD6',
          padding: '40px', width: '100%', maxWidth: '400px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          position: 'relative', animation: 'slideUp 0.2s ease',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '17px', color: '#9B978F', padding: '4px 8px',
            borderRadius: '4px', fontFamily: 'inherit', lineHeight: 1,
          }}
        >✕</button>
        {children}
      </div>
    </div>
  );
}
/* Modal Ends */

/* Login */
interface LoginModalProps { onClose: () => void; onSwitch: () => void; }

function LoginModal({ onClose, onSwitch }: LoginModalProps) {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onClose();
      // navigate('/dashboard');
      navigate('/patients');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
        Welcome back
      </h2>
      <p style={{ fontSize: '13.5px', color: '#6B6860', marginBottom: '28px' }}>
        Sign in to your BayuLok account.
      </p>

      <form onSubmit={handleSubmit}>
        <Alert type="error" message={error} />
        <div style={{ marginBottom: '14px' }}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hospital.np" required />
        </div>
        <div style={{ marginBottom: '22px' }}>
          <label style={label}>Password</label>
          <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <Button type="submit" full disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6B6860' }}>
        New here?{' '}
        <button onClick={onSwitch} style={ghostBtn}>Create account</button>
      </p>
    </>
  );
}
/* Login Ends*/

/* Register Begins */
interface RegisterModalProps { onClose: () => void; onSwitch: () => void; }

function RegisterModal({ onClose, onSwitch }: RegisterModalProps) {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form.email, form.password, form.fullName, form.phone);
      setSuccess(true);
      setTimeout(() => { onClose(); navigate('/dashboard'); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '4px', fontFamily: 'Georgia, serif' }}>
        Create account
      </h2>
      <p style={{ fontSize: '13.5px', color: '#6B6860', marginBottom: '28px' }}>
        Register to access the BayuLok dashboard.
      </p>

      {success ? (
        <Alert type="success" message="Account created! Taking you to the dashboard…" />
      ) : (
        <form onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          {[
            { key: 'fullName', label: 'Full name', type: 'text',     placeholder: 'Dr. Ram Shrestha', required: true  },
            { key: 'phone',    label: 'Phone',     type: 'tel',      placeholder: '+977 98...',        required: false },
            { key: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@hospital.np',   required: true  },
            { key: 'password', label: 'Password',  type: 'password', placeholder: '••••••••',          required: true  },
          ].map(({ key, label: lbl, type, placeholder, required }) => (
            <div key={key} style={{ marginBottom: key === 'password' ? '22px' : '14px' }}>
              <label style={label}>{lbl}</label>
              <input
                style={input} type={type} value={form[key as keyof typeof form]}
                onChange={set(key as keyof typeof form)}
                placeholder={placeholder} required={required}
              />
            </div>
          ))}
          <Button type="submit" full disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      )}

      {!success && (
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6B6860' }}>
          Already have an account?{' '}
          <button onClick={onSwitch} style={ghostBtn}>Sign in</button>
        </p>
      )}
    </>
  );
}
/* Register Ends */

/* Index page Begins */
export default function IndexPage() {
  const [modal, setModal] = useState<ModalType>(null);

  const openLogin    = useCallback(() => setModal('login'),    []);
  const openRegister = useCallback(() => setModal('register'), []);
  const closeModal   = useCallback(() => setModal(null),       []);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', display: 'flex', flexDirection: 'column' }}>

      <Modal open={modal === 'login'} onClose={closeModal}>
        <LoginModal onClose={closeModal} onSwitch={() => setModal('register')} />
      </Modal>
      <Modal open={modal === 'register'} onClose={closeModal}>
        <RegisterModal onClose={closeModal} onSwitch={() => setModal('login')} />
      </Modal>

      {/* Navbar Begins */}
      <header style={{ borderBottom: '1px solid #E2DDD6', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '30px', height: '30px', background: '#1D9E75', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1917' }}>
              Bayu<span style={{ color: '#1D9E75' }}>Lok</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={openLogin} style={{ padding: '8px 18px', borderRadius: '7px', border: '1px solid #E2DDD6', background: '#FFFFFF', color: '#1A1917', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Login
            </button>
            <button onClick={openRegister} style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Register
            </button>
          </div>
        </div>
      </header>
      {/* Navbar Ends */}


      <main style={{ flex: 1 }}>

        {/* Hero */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', opacity: 0.05 }} />
          <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', padding: '96px 24px 104px', textAlign: 'center' }}>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #E2DDD6', background: '#FFFFFF', borderRadius: '99px', padding: '5px 14px', fontSize: '12.5px', fontWeight: 500, color: '#6B6860', marginBottom: '28px' }}>
              ✨ Verified by partner hospitals
            </span>

            <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 54px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1917', marginBottom: '18px' }}>
              Hope, funded by{' '}
              <span style={{ background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                community.
              </span>
            </h1>

            <p style={{ fontSize: '16.5px', color: '#6B6860', maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.7 }}>
              BayuLok connects critically ill patients across Nepal with donors who care.
              Every case is verified, every rupee tracked.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <button onClick={openRegister} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Join as a donor →
              </button>
              <button onClick={openLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '8px', border: '1px solid #E2DDD6', background: '#FFFFFF', color: '#1A1917', fontSize: '14.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                View patient cases
              </button>
            </div>

            {/* Trust strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', maxWidth: '720px', margin: '60px auto 0' }}>
              {TRUST_ITEMS.map(({ icon, label: lbl, desc }) => (
                <div key={lbl} style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '10px', padding: '18px 20px', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '19px' }}>{icon}</span>
                  <p style={{ marginTop: '10px', fontSize: '13.5px', fontWeight: 600, color: '#1A1917' }}>{lbl}</p>
                  <p style={{ fontSize: '12px', color: '#6B6860', marginTop: '2px' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ background: '#FFFFFF', borderTop: '1px solid #E2DDD6', borderBottom: '1px solid #E2DDD6' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '6px', color: '#1A1917' }}>How it works</h2>
            <p style={{ color: '#6B6860', fontSize: '14px', marginBottom: '44px' }}>Three simple steps to make a difference</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div key={step} style={{ padding: '24px', background: '#F5F3EE', borderRadius: '10px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D9E75', letterSpacing: '0.08em', marginBottom: '10px' }}>{step}</div>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 600, marginBottom: '6px', color: '#1A1917' }}>{title}</h3>
                  <p style={{ fontSize: '13px', color: '#6B6860', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ background: '#1A1917' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px' }}>
              Ready to make a difference?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
              Create a free account and start contributing today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={openRegister} style={{ padding: '11px 24px', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Create account →
              </button>
              <button onClick={openLogin} style={{ padding: '11px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#FFFFFF', fontSize: '14.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Sign in
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Begins */}
      <footer style={{ borderTop: '1px solid #E2DDD6', background: '#FFFFFF', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center', fontSize: '13px', color: '#9B978F' }}>
          © {new Date().getFullYear()} BayuLok · Built with care for Nepal.
        </div>
      </footer>
      {/* Footer Begins */}

    </div>
  );
}