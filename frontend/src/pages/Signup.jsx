import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail[0]?.msg : detail;
      setError(msg || 'Failed to issue credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '75vh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}
      >
        <div className="flex-center" style={{ marginBottom: '2rem', gap: '10px' }}>
          <UserPlus size={40} color="var(--color-primary)" />
          <h2 className="serif">Agent Registration</h2>
        </div>

        <form onSubmit={handleSignup}>
          {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.7, fontSize: '0.8rem', letterSpacing: '1px' }}>FULL NAME</label>
            <input
              type="text"
              required
              className="glass"
              style={{ width: '100%', padding: '12px', color: 'white' }}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.7, fontSize: '0.8rem', letterSpacing: '1px' }}>AGENT EMAIL</label>
            <input
              type="email"
              required
              className="glass"
              style={{ width: '100%', padding: '12px', color: 'white' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.7, fontSize: '0.8rem', letterSpacing: '1px' }}>SECRET CLEARANCE (PASSWORD)</label>
            <input
              type="password"
              required
              className="glass"
              style={{ width: '100%', padding: '12px', color: 'white' }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Issue Credentials'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already briefed? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Authorize here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
