import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      window.location.href = `${backendURL}/api/quickbooks/connect`;
    } catch (err) {
      console.error("Login redirect failed:", err);
      setError("Something went wrong during login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.logoText}>RoyaltiesAgent</span>
        </Link>

        {/* Card */}
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>
            Connect your QuickBooks account to securely access your franchise data.
          </p>

          {error && (
            <div style={styles.alert}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={styles.intuitBtn}>
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Connecting...
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                Sign in with QuickBooks
              </>
            )}
          </button>

          <Link to="/pricing" style={styles.pricingLink}>
            View Pricing Plans
          </Link>
        </div>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Secure OAuth connection</span>
          </div>
          <div style={styles.feature}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>No passwords stored</span>
          </div>
          <div style={styles.feature}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>Takes 30 seconds</span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '20px',
  },
  
  container: {
    width: '100%',
    maxWidth: '420px',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '40px',
    textDecoration: 'none',
  },
  
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
  },
  
  card: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '12px',
    marginTop: 0,
  },
  
  subtitle: {
    color: '#64748B',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '32px',
    marginTop: 0,
  },
  
  alert: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#DC2626',
  },
  
  intuitBtn: {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #0077C5 0%, #0062A3 100%)',
    color: 'white',
    boxShadow: '0 4px 14px rgba(0, 119, 197, 0.3)',
  },
  
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
    color: '#94A3B8',
    fontSize: '14px',
  },
  
  pricingLink: {
    display: 'inline-block',
    color: '#2CA01C',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#64748B',
  },
  
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  
  footerLink: {
    color: '#2CA01C',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
