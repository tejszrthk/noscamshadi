import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, FileText, Fingerprint, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section style={{
        padding: '8rem 0',
        background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.1) 0%, transparent 70%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              Uncover the Truth <br />
              <span style={{ color: 'var(--color-primary)' }}>Before the Knot.</span>
            </h1>
            <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', fontSize: '1.2rem', opacity: 0.8 }}>
              No Scam Shaadi is India's most trusted matrimonial verification service. 
              We dig deep into statutory, social, and government records to ensure your future is secure.
            </p>
            <div className="flex-center" style={{ gap: '1.5rem' }}>
              <Link to="/signup" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                Start Investigation <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn-outline">Access Case Files</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="serif" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>
            Our Investigative Scope
          </h2>
          <div className="grid-cols-3">
            <FeatureCard 
              icon={<Fingerprint size={40} />}
              title="Identity Audit"
              desc="Comprehensive verification of statutory records, PAN, and Aadhar linked profiles."
            />
            <FeatureCard 
              icon={<Search size={40} />}
              title="Social Surveillance"
              desc="Deep-dive into digital footprints, employment history, and social reputation."
            />
            <FeatureCard 
              icon={<FileText size={40} />}
              title="Dossier Presentation"
              desc="A confidential, high-fidelity report detailing every verified and flagged detail."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="glass" style={{ margin: '4rem 20px', padding: '6rem 0', borderRadius: '24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
              Confidentiality is our <br />Second Name.
            </h2>
            <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
              Every investigation is conducted under strict privacy protocols. Our agents use automated pipelines to gather evidence without alerting the subject.
            </p>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--color-primary)' }}>
              <div className="flex-center" style={{ gap: '8px' }}><ShieldCheck size={20} /> 100% Private</div>
              <div className="flex-center" style={{ gap: '8px' }}><ShieldCheck size={20} /> Encrypted Reports</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <div className="dossier-card" style={{ transform: 'rotate(-2deg)' }}>
              <h3 className="serif" style={{ marginBottom: '1rem' }}>CASE #9921 - VERIFIED</h3>
              <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                <strong>Subject:</strong> Rahul M. <br />
                <strong>Status:</strong> COMPLETED
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Statutory records match. Employment history verified at Google India. No criminal flags found.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass" 
    style={{ padding: '3rem 2rem', border: '1px solid var(--glass-border)' }}
  >
    <div style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{icon}</div>
    <h3 className="serif" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
    <p style={{ opacity: 0.6 }}>{desc}</p>
  </motion.div>
);

export default LandingPage;
