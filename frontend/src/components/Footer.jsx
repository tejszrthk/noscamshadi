import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      padding: '4rem 0 2rem',
      marginTop: '4rem',
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(0,0,0,0.3)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <ShieldAlert size={24} color="var(--color-accent)" />
              <h3 className="serif">No Scam Shaadi</h3>
            </div>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
              India's premier matrimonial verification agency. Uncovering the truth so you can say "I do" with confidence.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem' }}>The Agency</h4>
            <ul style={{ listStyle: 'none', opacity: 0.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>About Us</li>
              <li>Our Methodology</li>
              <li>Privacy Protocol</li>
              <li>Service Terms</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>Investigation</h4>
            <ul style={{ listStyle: 'none', opacity: 0.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Background Checks</li>
              <li>Social Audit</li>
              <li>Statutory Review</li>
              <li>Government Verification</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>Contact HQ</h4>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              Email: unit-01@noscamshaadi.com<br />
              Secure Line: 1-800-TRUTH
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          opacity: 0.5
        }}>
          <p>© {new Date().getFullYear()} NO SCAM SHAADI. ALL RIGHTS RESERVED. CONFIDENTIAL DATA ENCRYPTED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
