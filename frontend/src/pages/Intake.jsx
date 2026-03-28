import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { FileSearch, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Intake = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    current_city: '',
    age: '',
    native_city: '',
    employer_name: '',
    business_name: '',
    company_name: '',
    education_college: '',
    education_year: '',
    linkedin_url: '',
    instagram_username: '',
    facebook_profile_id: '',
    mobile: '',
    known_property_areas: [],
    claims_finance_role: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clean data: convert strings to numbers where needed
    const submissionData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      education_year: formData.education_year ? parseInt(formData.education_year) : null,
      known_property_areas: formData.known_property_areas_str ? formData.known_property_areas_str.split(',').map(s => s.trim()) : []
    };

    try {
      const resp = await apiClient.post('/reports/run', submissionData);
      navigate(`/report/${resp.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Failed to initiate investigation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '850px', padding: '2rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dossier-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem', borderBottom: '2px solid var(--color-bg)', paddingBottom: '1rem' }}>
          <FileSearch size={32} color="var(--color-accent)" />
          <h2 className="serif" style={{ color: 'var(--color-text-dark)' }}>SUBJECT INVESTIGATION FILE</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 'bold', background: '#fff0f0', padding: '10px' }}>!! {error}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.5fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>SUBJECT FULL NAME*</label>
              <input 
                type="text" required style={inputStyle}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label style={labelStyle}>CURRENT CITY*</label>
              <input 
                type="text" required style={inputStyle}
                value={formData.current_city}
                onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                placeholder="Delhi / Mumbai / Bangalore"
              />
            </div>
            <div>
              <label style={labelStyle}>AGE (EST.)</label>
              <input 
                type="number" style={inputStyle}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>EMPLOYER / COMPANY NAME</label>
              <input 
                type="text" style={inputStyle}
                value={formData.employer_name}
                onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                placeholder="e.g. Google India / TCS"
              />
            </div>
            <div>
              <label style={labelStyle}>MOBILE NUMBER</label>
              <input 
                type="text" style={inputStyle}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>LINKEDIN URL</label>
              <input 
                type="url" style={inputStyle}
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>INSTAGRAM @</label>
              <input 
                type="text" style={inputStyle}
                value={formData.instagram_username}
                onChange={(e) => setFormData({ ...formData, instagram_username: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>FB PROFILE ID</label>
              <input 
                type="text" style={inputStyle}
                value={formData.facebook_profile_id}
                onChange={(e) => setFormData({ ...formData, facebook_profile_id: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={formData.claims_finance_role}
                onChange={(e) => setFormData({ ...formData, claims_finance_role: e.target.checked })}
              />
              SUBJECT CLAIMS TO BE IN A FINANCE/INVESTMENT ROLE (TRIGGERS SEBI AUDIT)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>
              * Data will be cross-referenced across 50+ statutory databases.
            </span>
            <button className="btn-primary" style={{ padding: '15px 40px', background: 'var(--color-accent)', color: 'white' }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Open Case <Send size={18} />
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: '900',
  color: '#444',
  marginBottom: '5px',
  letterSpacing: '1px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '0',
  backgroundColor: 'rgba(255,255,255,0.5)',
  fontFamily: 'monospace',
  fontSize: '1rem'
};

export default Intake;
