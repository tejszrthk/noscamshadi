import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={32} color="var(--color-primary)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="serif" style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>NO SCAM</span>
            <span className="serif" style={{ fontSize: '1.2rem', color: 'var(--color-accent)', letterSpacing: '2px' }}>SHAADI</span>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" className="btn-outline" style={{ border: 'none' }}>Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn-outline" style={{ border: 'none' }}>Investigations</Link>
              <Link to="/intake" className="btn-primary" style={{ padding: '8px 16px' }}>Open Case</Link>
              <button onClick={handleLogout} className="flex-center" style={{ background: 'transparent', color: 'var(--color-text)', gap: '5px' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn-primary">Join the Force</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
