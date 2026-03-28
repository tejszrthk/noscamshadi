import React from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-center" style={{ height: '80vh', flexDirection: 'column', textAlign: 'center', color: 'white' }}>
          <ShieldAlert size={80} color="var(--color-accent)" style={{ marginBottom: '2rem' }} />
          <h1 className="serif" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>SYSTEM COMPROMISED</h1>
          <p style={{ opacity: 0.7, maxWidth: '500px', marginBottom: '2rem' }}>
            An unexpected breach has occurred in the data stream. Our agents are already investigating the source.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-accent)' }}
          >
            <RefreshCcw size={18} /> Restore Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
