import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await apiClient.post('/auth/login', { email: email, password });
      login(resp.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail[0]?.msg : detail;
      setError(msg || 'Identity verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '70vh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}
      >
        <div className="flex-center" style={{ marginBottom: '2rem', gap: '10px' }}>
          <ShieldCheck size={40} color="var(--color-primary)" />
          <h2 className="serif">Officer Checkpoint</h2>
        </div>

        <form onSubmit={handleLogin}>
          {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.7, fontSize: '0.8rem', letterSpacing: '1px' }}>AGENT EMAIL</label>
            <input
              type="email"
              required
              className="glass"
              style={{ width: '100%', padding: '12px', color: 'white' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.7, fontSize: '0.8rem', letterSpacing: '1px' }}>SECURITY CLEARANCE (PASSWORD)</label>
            <input
              type="password"
              required
              className="glass"
              style={{ width: '100%', padding: '12px', color: 'white' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          New agent? <Link to="/signup" style={{ color: 'var(--color-primary)' }}>Register for credentials</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
