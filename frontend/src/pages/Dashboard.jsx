import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Clock, CheckCircle, AlertCircle, Search, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resp = await apiClient.get('/reports');
        if (Array.isArray(resp.data)) {
          setReports(resp.data);
        } else {
          console.error('API did not return an array of reports:', resp.data);
          setReports([]);
        }
      } catch (err) {
        console.error('Failed to fetch investigations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = filter === 'ALL' 
    ? reports 
    : reports.filter(r => r.status.toUpperCase() === filter);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return '#4caf50';
      case 'RUNNING': return '#ff9800';
      case 'FAILED': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ACTIVE INVESTIGATIONS</h1>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', letterSpacing: '2px' }}>VERIFICATION OFFICER DASHBOARD</p>
        </div>
        <button 
          onClick={() => navigate('/intake')}
          className="btn-primary" 
          style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Search size={18} /> OPEN NEW CASE
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '40vh' }}>
          <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
            {['ALL', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '5px 15px', border: '1px solid var(--color-primary)', 
                  background: filter === f ? 'var(--color-primary)' : 'transparent',
                  color: filter === f ? 'var(--color-bg)' : 'var(--color-primary)',
                  fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer',
                  borderRadius: '20px'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredReports.length === 0 ? (
            <div className="flex-center" style={{ flexDirection: 'column', padding: '6rem 0', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <ShieldAlert size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
              <p style={{ opacity: 0.4, letterSpacing: '2px' }}>NO MATCHING RECORDS IN DATABASE</p>
            </div>
          ) : (
            <div className="grid-cols-2">
              {filteredReports.map((report) => (
                <motion.div 
                  key={report.id}
                  className="dossier-card"
                  style={{ 
                    padding: '1.5rem', cursor: 'pointer', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(255,255,255,0.02)',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onClick={() => navigate(`/report/${report.id}`)}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-primary)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', opacity: 0.4, fontWeight: '900', display: 'block' }}>DOSSIER ID</span>
                      <span className="serif" style={{ color: 'var(--color-primary)', letterSpacing: '1px' }}>#{report.id.toString().slice(-6).toUpperCase()}</span>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                  
                  <h3 className="serif" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{report.subject_name}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.6, fontSize: '0.75rem' }}>
                    <span>CITY: {report.input_data?.current_city || 'NA'}</span>
                    <span>MODIFIED: {new Date(report.updated_at).toLocaleDateString()}</span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', opacity: 0.2 }}>
                    <Search size={32} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = status?.toUpperCase();
  let Icon = Clock;
  let color = '#999';
  
  if (s === 'COMPLETED') { Icon = CheckCircle; color = '#4caf50'; }
  if (s === 'FAILED') { Icon = AlertCircle; color = '#f44336'; }
  if (s === 'RUNNING') { color = '#ff9800'; }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: 'bold', color }}>
      <Icon size={14} /> {s}
    </div>
  );
};

export default Dashboard;
