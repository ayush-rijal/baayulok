interface SpinnerProps {
  text?: string;
}

export default function Spinner({ text = 'Loading…' }: SpinnerProps) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B6860', fontSize: '14px' }}>
      <div style={{ width: '28px', height: '28px', border: '2px solid #E2DDD6', borderTopColor: '#1D9E75', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {text}
    </div>
  );
}