import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield } from 'react-icons/fi';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup'); // Redirect back if no email is found in state
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/signin', { state: { message: 'Account verified successfully! Please sign in.' } });
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem', textAlign: 'center' }}>
        <div className="info-icon" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px', fontSize: '1.8rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <FiShield />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Verify Email</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          We've sent a 6-digit confirmation code to<br/>
          <strong style={{ color: 'var(--text-main)' }}>{email}</strong>
        </p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              className="premium-input" 
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: '700' }}
              placeholder="000000" 
              maxLength={6}
              required 
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only numbers
            />
          </div>

          <button type="submit" className="analyze-btn" disabled={loading || otp.length < 6} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 5px 20px rgba(16, 185, 129, 0.3)' }}>
            {loading ? 'Verifying...' : (
              <><span>Verify Account</span> <FiCheckCircle /></>
            )}
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Check your terminal/console for the Mock OTP.
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;
