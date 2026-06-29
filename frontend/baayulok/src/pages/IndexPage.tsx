import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

/* Types Begins */
type ModalType = 'login' | 'register' | null;
/* Types Ends */

/* Data Begins */
const TRUST_ITEMS = [
  { label: 'Bipanna Verified', desc: 'Identity & need certified' },
  { label: 'Direct to Hospital', desc: 'Funds paid to providers' },
  { label: 'Transparent', desc: 'Every transaction tracked' },
] as const;

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse cases', desc: 'View verified patients who need urgent financial support for treatment.' },
  { step: '02', title: 'Choose to help', desc: 'Select a patient and contribute any amount via Esewa, Khalti, or bank transfer.' },
  { step: '03', title: 'Track impact', desc: "Follow the patient's progress and see exactly how your contribution is used." },
] as const;
/* Data Ends */

/* Shared styles Begins */
const input: React.CSSProperties = {
  width: '100%', padding: '13px 16px', border: '1px solid #E2DDD6',
  borderRadius: '8px', background: '#F5F3EE', fontSize: '18px',
  color: '#1A1917', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: '15.5px', fontWeight: 600, color: '#6B6860',
  marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const ghostBtn: React.CSSProperties = {
  background: 'none', border: 'none', padding: 0,
  color: '#1D9E75', fontWeight: 500, fontSize: '17px',
  cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.25s ease',
};
/* Shared styles Ends */

/* Global animation styles Begins */
function GlobalMotionStyles() {
  return (
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-stagger > * {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-stagger.is-visible > *:nth-child(1) { transition-delay: 0.05s; }
        .reveal-stagger.is-visible > *:nth-child(2) { transition-delay: 0.15s; }
        .reveal-stagger.is-visible > *:nth-child(3) { transition-delay: 0.25s; }
        .reveal-stagger.is-visible > *:nth-child(4) { transition-delay: 0.35s; }
        .reveal-stagger.is-visible > * {
          opacity: 1;
          transform: translateY(0);
        }

        .float-blob {
          animation: floatBlob 9s ease-in-out infinite;
        }
        .float-blob-slow {
          animation: floatBlob 13s ease-in-out infinite reverse;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -22px) scale(1.06); }
        }

        .pulse-badge {
          animation: pulseBadge 3.2s ease-in-out infinite;
        }
        @keyframes pulseBadge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29,158,117,0.18); }
          50% { box-shadow: 0 0 0 7px rgba(29,158,117,0); }
        }

        .hero-title-gradient {
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 18px 40px rgba(26,25,23,0.10);
          border-color: #BFE8D8;
        }

        .btn-anim {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease, filter 0.3s ease;
        }
        .btn-anim:hover {
          transform: translateY(-2px) scale(1.035);
          filter: brightness(1.04);
        }
        .btn-anim:active {
          transform: translateY(0) scale(0.98);
        }

        .nav-link-anim {
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .nav-link-anim:hover {
          transform: translateY(-1px);
        }

        .modal-overlay-anim {
          animation: overlayFadeIn 0.3s ease;
        }
        .modal-overlay-anim.closing {
          animation: overlayFadeOut 0.25s ease forwards;
        }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayFadeOut { from { opacity: 1; } to { opacity: 0; } }

        .modal-card-anim {
          animation: modalIn 0.38s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-card-anim.closing {
          animation: modalOut 0.22s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(22px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(14px) scale(0.95); }
        }

        .step-number {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease;
        }
        .hover-lift:hover .step-number {
          transform: scale(1.12) translateX(2px);
        }

        html { scroll-behavior: smooth; }
      }

      @media (prefers-reduced-motion: reduce) {
        .reveal, .reveal-stagger > * { opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  );
}
/* Global animation styles Ends */

/* Hook: reveal-on-scroll Begins */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
/* Hook: reveal-on-scroll Ends */

/* Modal Begins */
interface ModalProps { open: boolean; onClose: () => void; children: React.ReactNode; }

function Modal({ open, onClose, children }: ModalProps) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  useEffect(() => {
    if (open) { setRendered(true); }
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && requestClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [rendered, requestClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open && !rendered) return null;
  if (!open && !closing) return null;

  return (
    <div
      onClick={requestClose}
      className={`modal-overlay-anim${closing ? ' closing' : ''}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(26,25,23,0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '26px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-card-anim${closing ? ' closing' : ''}`}
        style={{
          background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2DDD6',
          width: '100%', maxWidth: '520px',
          maxHeight: 'calc(100vh - 40px)',
          boxShadow: '0 32px 84px rgba(0,0,0,0.16)',
          position: 'relative', boxSizing: 'border-box', 
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <button
          onClick={requestClose}
          aria-label="Close"
          className="btn-anim"
          style={{
            position: 'absolute', top: '18px', right: '18px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '22px', color: '#9B978F', padding: '5px 10px',
            borderRadius: '6px', fontFamily: 'inherit', lineHeight: 1,
          }}
        >✕</button>

        <div style={{ padding: '52px', overflowY: 'auto', boxSizing: 'border-box' }}>
        {children}
        </div>
      </div>
    </div>
  );
}
/* Modal Ends */

/* Login Begins */
interface LoginModalProps { onClose: () => void; onSwitch: () => void; }

function LoginModal({ onClose, onSwitch }: LoginModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onClose();
      navigate('/patients');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 style={{ fontSize: '31px', fontWeight: 400, marginBottom: '5px', fontFamily: 'Georgia, serif' }}>
        Welcome back
      </h2>
      <p style={{ fontSize: '17.5px', color: '#6B6860', marginBottom: '36px' }}>
        Sign in to your BayuLok account.
      </p>

      <form onSubmit={handleSubmit}>
        <Alert type="error" message={error} />
        <div style={{ marginBottom: '18px' }}>
          <label style={label}>Email</label>
          <input
            style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@hospital.np" required
            onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E2DDD6'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <div style={{ marginBottom: '28px' }}>
          <label style={label}>Password</label>
          <input
            style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required
            onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E2DDD6'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
        <Button type="submit" full disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '26px', fontSize: '17px', color: '#6B6860' }}>
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
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
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
      <h2 style={{ fontSize: '31px', fontWeight: 400, marginBottom: '5px', fontFamily: 'Georgia, serif' }}>
        Create account
      </h2>
      <p style={{ fontSize: '17.5px', color: '#6B6860', marginBottom: '36px' }}>
        Register to access the BayuLok.
      </p>

      {success ? (
        <Alert type="success" message="Account created! Taking you to the dashboard…" />
      ) : (
        <form onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          {[
            { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'Dr. Ram Shrestha', required: true },
            { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+977 98...', required: false },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@hospital.np', required: true },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
          ].map(({ key, label: lbl, type, placeholder, required }) => (
            <div key={key} style={{ marginBottom: key === 'password' ? '28px' : '18px' }}>
              <label style={label}>{lbl}</label>
              <input
                style={input} type={type} value={form[key as keyof typeof form]}
                onChange={set(key as keyof typeof form)}
                placeholder={placeholder} required={required}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#1D9E75'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E2DDD6'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
          <Button type="submit" full disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      )}

      {!success && (
        <p style={{ textAlign: 'center', marginTop: '26px', fontSize: '17px', color: '#6B6860' }}>
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

  const openLogin = useCallback(() => setModal('login'), []);
  const openRegister = useCallback(() => setModal('register'), []);
  const closeModal = useCallback(() => setModal(null), []);

  const heroRef = useReveal<HTMLDivElement>();
  const trustRef = useReveal<HTMLDivElement>();
  const howRef = useReveal<HTMLDivElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const footerRef = useReveal<HTMLDivElement>();

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', display: 'flex', flexDirection: 'column' }}>
      <GlobalMotionStyles />

      <Modal open={modal === 'login'} onClose={closeModal}>
        <LoginModal onClose={closeModal} onSwitch={() => setModal('register')} />
      </Modal>
      <Modal open={modal === 'register'} onClose={closeModal}>
        <RegisterModal onClose={closeModal} onSwitch={() => setModal('login')} />
      </Modal>

      {/* Navbar Begins */}
      <header style={{ borderBottom: '1px solid #E2DDD6', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1404px', margin: '0 auto', padding: '0 31px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '39px', height: '39px', background: '#1D9E75', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(29,158,117,0.25)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <span style={{ fontSize: '21px', fontWeight: 700, color: '#1A1917' }}>
              Bayu<span style={{ color: '#1D9E75' }}>Lok</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openLogin} className="nav-link-anim" style={{ padding: '10px 23px', borderRadius: '9px', border: '1px solid #E2DDD6', background: '#FFFFFF', color: '#1A1917', fontSize: '17.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Login
            </button>
            <button onClick={openRegister} className="btn-anim" style={{ padding: '10px 23px', borderRadius: '9px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '17.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(29,158,117,0.25)' }}>
              Register
            </button>
          </div>
        </div>
      </header>
      {/* Navbar Ends */}

      <main style={{ flex: 1 }}>

        {/* Hero */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Layered ambient background */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', opacity: 0.05 }} />
          <div
            className="float-blob"
            style={{
              position: 'absolute', top: '-140px', right: '-120px', width: '480px', height: '480px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,158,117,0.16), transparent 70%)',
              filter: 'blur(10px)', pointerEvents: 'none',
            }}
          />
          <div
            className="float-blob-slow"
            style={{
              position: 'absolute', bottom: '-160px', left: '-140px', width: '420px', height: '420px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,110,86,0.14), transparent 70%)',
              filter: 'blur(10px)', pointerEvents: 'none',
            }}
          />

          <div ref={heroRef} className="reveal" style={{ position: 'relative', maxWidth: '1404px', margin: '0 auto', padding: '125px 31px 135px', textAlign: 'center' }}>

            <span className="pulse-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #E2DDD6', background: '#FFFFFF', borderRadius: '99px', padding: '7px 18px', fontSize: '16px', fontWeight: 500, color: '#6B6860', marginBottom: '36px' }}>
              Verified by partner hospitals
            </span>

            <h1 className="hero-title-gradient" style={{ fontSize: 'clamp(39px, 7.2vw, 70px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1917', marginBottom: '23px' }}>
              Hope, funded by{' '}
              <span style={{ background: 'linear-gradient(135deg, #1D9E75, #0F6E56, #1D9E75)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', animation: 'gradientShift 6s ease infinite' }}>
                Community.
              </span>
            </h1>

            <p style={{ fontSize: '21.5px', color: '#6B6860', maxWidth: '702px', margin: '0 auto 47px', lineHeight: 1.7 }}>
              BayuLok connects critically ill patients across Nepal with donors who care.
              Every case is verified, every rupee tracked.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '13px' }}>
              <button onClick={openRegister} className="btn-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 31px', borderRadius: '10px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '18.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 22px rgba(29,158,117,0.28)' }}>
                Join as a donor →
              </button>
              <button onClick={openLogin} className="btn-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 31px', borderRadius: '10px', border: '1px solid #E2DDD6', background: '#FFFFFF', color: '#1A1917', fontSize: '18.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                View patient cases
              </button>
            </div>

            {/* Trust strip */}
            <div ref={trustRef} className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(247px, 1fr))', gap: '16px', maxWidth: '936px', margin: '78px auto 0' }}>
              {TRUST_ITEMS.map(({ label: lbl, desc }) => (
                <div key={lbl} className="hover-lift" style={{ background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '13px', padding: '23px 26px', textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: '17.5px', fontWeight: 600, color: '#1A1917' }}>{lbl}</p>
                  <p style={{ fontSize: '15.5px', color: '#6B6860', marginTop: '3px' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ background: '#FFFFFF', borderTop: '1px solid #E2DDD6', borderBottom: '1px solid #E2DDD6' }}>
          <div ref={howRef} className="reveal" style={{ maxWidth: '1404px', margin: '0 auto', padding: '94px 31px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '34px', fontWeight: 600, marginBottom: '8px', color: '#1A1917' }}>How it works</h2>
            <p style={{ color: '#6B6860', fontSize: '18px', marginBottom: '57px' }}>Three simple steps to make a difference</p>
            <div className="reveal-stagger is-visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '26px' }}>
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div key={step} className="hover-lift" style={{ padding: '31px', background: '#F5F3EE', borderRadius: '13px', textAlign: 'left', border: '1px solid transparent' }}>
                  <div className="step-number" style={{ fontSize: '14px', fontWeight: 700, color: '#1D9E75', letterSpacing: '0.08em', marginBottom: '13px' }}>{step}</div>
                  <h3 style={{ fontSize: '18.5px', fontWeight: 600, marginBottom: '8px', color: '#1A1917' }}>{title}</h3>
                  <p style={{ fontSize: '16.5px', color: '#6B6860', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Begins */}
        <section style={{ background: '#1A1917', position: 'relative', overflow: 'hidden' }}>
          <div
            className="float-blob"
            style={{
              position: 'absolute', top: '-100px', right: '5%', width: '360px', height: '360px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,158,117,0.18), transparent 70%)',
              filter: 'blur(10px)', pointerEvents: 'none',
            }}
          />
          <div ref={ctaRef} className="reveal" style={{ position: 'relative', maxWidth: '1404px', margin: '0 auto', padding: '94px 31px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '34px', fontWeight: 600, color: '#FFFFFF', marginBottom: '13px' }}>
              Ready to make a difference?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginBottom: '42px' }}>
              Create a free account and start contributing today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '13px', flexWrap: 'wrap' }}>
              <button onClick={openRegister} className="btn-anim" style={{ padding: '14px 31px', borderRadius: '10px', border: 'none', background: '#1D9E75', color: '#FFFFFF', fontSize: '18.5px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 22px rgba(29,158,117,0.3)' }}>
                Create account →
              </button>
              <button onClick={openLogin} className="btn-anim" style={{ padding: '14px 31px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#FFFFFF', fontSize: '18.5px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Sign in
              </button>
            </div>
          </div>
        </section>
        {/* Bottom CTA Ends */}
      </main>

      {/* Footer Begins */}
      <footer ref={footerRef} className="reveal" style={{ borderTop: '1px solid #E2DDD6', background: '#FFFFFF', padding: '26px 31px' }}>
        <div style={{ maxWidth: '1404px', margin: '0 auto', textAlign: 'center', fontSize: '17px', color: '#9B978F' }}>
          © {new Date().getFullYear()} BayuLok
        </div>
      </footer>
      {/* Footer Ends */}

    </div>
  );
}
/* Index Page Ends */