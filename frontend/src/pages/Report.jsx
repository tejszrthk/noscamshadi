import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, Search, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resp = await apiClient.get(`/reports/${id}`);
      setReport(resp.data);
    } catch (err) {
      console.error('Failed to fetch report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      const s = report?.status?.toUpperCase();
      if (s === 'PENDING' || s === 'RUNNING') {
        fetchData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, report?.status]);

  if (loading && !report) {
    return (
      <div className="flex-center" style={{ height: '70vh', flexDirection: 'column', gap: '20px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        <h3 className="serif">Accessing Secure Vault...</h3>
      </div>
    );
  }

  const out = report?.output_data;

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="dossier-card"
        style={{ padding: '0', overflow: 'hidden' }}
      >
        {/* Header Section */}
        <div style={{ backgroundColor: 'var(--color-bg)', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="serif" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>CONFIDENTIAL DOSSIER</h1>
            <p style={{ opacity: 0.6, fontSize: '0.8rem', letterSpacing: '2px' }}>CASE ID: {report?.report_code || id.toString().toUpperCase()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '5px' }}>INVESTIGATION STATUS</div>
            <StatusBadgeLarge status={report?.status} />
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '3rem', color: 'var(--color-text-dark)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '180px', height: '180px', backgroundColor: '#eee', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                marginBottom: '1rem', position: 'relative'
              }}>
                <Search size={64} style={{ opacity: 0.1 }} />
                <div style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'var(--color-accent)', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <ShieldCheck size={24} />
                </div>
              </div>
              <p className="serif" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{report?.subject_name}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>PRIMARY SUBJECT</p>
            </div>

            <div>
              <h3 className="serif" style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>KNOWN ATTRIBUTES</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem' }}>
                <Param label="Current City" value={report?.input_data?.current_city || 'UNKNOWN'} />
                <Param label="Employer" value={report?.input_data?.employer_name || 'NOT PROVIDED'} />
                <Param label="Mobile" value={report?.input_data?.mobile || 'NOT PROVIDED'} />
                <Param label="Native City" value={report?.input_data?.native_city || 'NOT PROVIDED'} />
                <Param label="Investigation Start" value={new Date(report?.created_at).toLocaleString()} />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {report?.status?.toUpperCase() === 'RUNNING' || report?.status?.toUpperCase() === 'PENDING' ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '2rem 3rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '3rem' }}>
                  <div className="animate-spin" style={{ position: 'relative' }}>
                    <Loader2 size={32} />
                    <motion.div 
                      animate={{ y: [0, 32, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ position: 'absolute', top: 0, left: -5, right: -5, height: '1.5px', background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }}
                    />
                  </div>
                  <h4 className="serif" style={{ fontSize: '1.5rem' }}>Intelligence Gathering in Progress...</h4>
                </div>

                <InvestigationTimeline currentStatus={report?.status} />

                <div style={{ marginTop: '3rem', opacity: 0.6, fontSize: '0.8rem', textAlign: 'center', fontStyle: 'italic' }}>
                  "Verify everything, trust nothing until the evidence dictates otherwise." — Internal Protocol 142
                </div>
              </motion.div>
            ) : out ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ borderTop: '2px solid var(--color-bg)', paddingTop: '3rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText color="var(--color-primary)" />
                    <h3 className="serif">PIPELINE VERDICT</h3>
                  </div>
                  <div style={{ padding: '5px 15px', border: '2px solid var(--color-bg)', fontWeight: 'bold', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                    {out.overall_flag}
                  </div>
                  
                  {/* Digital Stamp */}
                  <motion.div 
                    initial={{ scale: 2, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: -15 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{ 
                      position: 'absolute', right: '-20px', top: '-40px',
                      border: `4px double ${out.high_priority > 0 ? '#f44336' : '#4caf50'}`,
                      color: out.high_priority > 0 ? '#f44336' : '#4caf50',
                      padding: '5px 15px', borderRadius: '4px',
                      fontSize: '1.2rem', fontWeight: '900',
                      transform: 'rotate(-15deg)', textTransform: 'uppercase',
                      opacity: 0.8, pointerEvents: 'none', zIndex: 10,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {out.high_priority > 0 ? 'FLAGGED' : 'VERIFIED'}
                  </motion.div>
                </div>

                {/* Background Watermark */}
                <div style={{ 
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
                  fontSize: '8rem', fontWeight: '900', color: 'rgba(0,0,0,0.03)',
                  pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0, userSelect: 'none'
                }}>
                  TOP SECRET
                </div>

                <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
                  <StatCard title="Total Findings" count={out.total_findings} color="var(--color-bg)" />
                  <StatCard title="High Priority" count={out.high_priority} color="#f44336" />
                  <StatCard title="Medium Priority" count={out.medium_priority} color="#ff9800" />
                </div>

                <div style={{ marginBottom: '3rem' }}>
                  <h3 className="serif" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>DETAILED MODULE ANALYSIS</h3>
                  {Object.entries(out.modules_run || {}).map(([name, m]) => (
                    <div key={name} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fcfcfc', border: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h4 className="serif" style={{ color: 'var(--color-bg)' }}>{name.toUpperCase()}</h4>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{m.duration_sec}s scan</span>
                      </div>
                      
                      {m.skipped ? (
                        <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                          Module Skipped: {m.skip_reason}
                        </div>
                      ) : m.findings.length === 0 ? (
                        <div style={{ color: '#4caf50', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                          <CheckCircle2 size={16} /> No disparities found in this module.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {m.findings.map((f, i) => (
                            <div key={i} style={{ paddingLeft: '1rem', borderLeft: `3px solid ${f.priority === 'HIGH' ? '#f44336' : f.priority === 'MEDIUM' ? '#ff9800' : '#4caf50'}` }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{f.title}</div>
                              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{f.detail}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '4rem', padding: '2rem', background: '#1a1a1a', color: 'white', borderRadius: '4px' }}>
                  <h4 className="serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>LEGAL PROTOCOL & DISCLAIMER</h4>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, lineHeight: 1.8 }}>
                    <p>{out.legal_disclaimer?.as_is_nature}</p>
                    <p style={{ marginTop: '10px' }}>{out.legal_disclaimer?.data_currency_warning}</p>
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Report subject to automatic erasure on: {out.deletion_scheduled_at?.split('T')[0]}</p>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button className="btn-primary" style={{ background: 'var(--color-bg)', color: 'white' }}>
                    Download Official Dossier (PDF)
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const Param = ({ label, value }) => (
  <div>
    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '900', opacity: 0.5, letterSpacing: '1px' }}>{label.toUpperCase()}</span>
    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{value}</span>
  </div>
);

const StatCard = ({ title, count, color }) => (
  <div style={{ padding: '1.5rem', background: '#f9f9f9', border: '1px solid #eee', textAlign: 'center' }}>
    <div style={{ fontSize: '0.75rem', fontWeight: '900', opacity: 0.6, marginBottom: '0.5rem' }}>{title.toUpperCase()}</div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color }}>{count}</div>
  </div>
);

const StatusBadgeLarge = ({ status }) => {
  const s = status?.toUpperCase();
  let color = '#999';
  if (s === 'COMPLETED') color = '#4caf50';
  if (s === 'RUNNING') color = '#ff9800';
  if (s === 'FAILED') color = '#f44336';

  return (
    <div style={{ backgroundColor: color, color: 'white', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-block' }}>
      {s || 'OFFLINE'}
    </div>
  );
};

const InvestigationTimeline = ({ currentStatus }) => {
  const steps = [
    { id: 1, label: "Initializing Global Search", detail: "Connecting to secure nodes..." },
    { id: 2, label: "LegalKart Judicial Review", detail: "Scrubbing high-court records and pending litigation." },
    { id: 3, label: "MCA & Business Deep-Scan", detail: "GSTIN validation and directorship verification." },
    { id: 4, label: "Social Footprint Analysis", detail: "Aggregating LinkedIn, Instagram, and web mentions." },
    { id: 5, label: "Disparity Processing", detail: "Matching claims against statutory data." },
    { id: 6, label: "Final Dossier Generation", detail: "Compiling legal advisory and risk stamps." }
  ];

  // Since we don't have real module-level progress from backend yet, 
  // we simulate a cycle based on the "RUNNING" state duration.
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (currentStatus?.toUpperCase() === 'RUNNING') {
      const interval = setInterval(() => {
        setActiveStep(prev => (prev < steps.length ? prev + 1 : prev));
      }, 7000); // Progress roughly every 7 seconds for visual effect
      return () => clearInterval(interval);
    }
  }, [currentStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {steps.map((step) => {
        const isActive = activeStep === step.id;
        const isComplete = activeStep > step.id;
        
        return (
          <div key={step.id} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', height: '12px', borderRadius: '50%', 
                background: isComplete ? 'var(--color-primary)' : isActive ? 'var(--color-accent)' : '#ddd',
                boxShadow: isActive ? '0 0 10px var(--color-accent)' : 'none',
                transition: 'all 0.5s ease'
              }} />
              {step.id < steps.length && (
                <div style={{ width: '1px', height: '30px', background: '#ddd' }} />
              )}
            </div>
            <div style={{ opacity: isComplete ? 0.5 : 1, transition: 'opacity 0.5s ease' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', color: isActive ? 'var(--color-primary)' : 'inherit' }}>
                {step.label.toUpperCase()} {isActive && "..."}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{step.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Report;
