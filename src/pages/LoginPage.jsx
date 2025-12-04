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
    <div className="login-page">
      <style>{styles}</style>

      {/* Background */}
      <div className="login-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="login-panel-left">
        <div className="panel-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="logo-text-wrap">
              <span className="logo-text">RoyaltiesAgent</span>
              <span className="logo-subtext">by CFOWORX</span>
            </div>
          </Link>

          <div className="panel-hero">
            <h1 className="panel-title">Streamline Your Franchise Royalty Management</h1>
            <p className="panel-subtitle">
              Automated calculations, seamless QuickBooks integration, and comprehensive reporting - all in one place.
            </p>
          </div>

          <div className="panel-features">
            <div className="panel-feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Real-time QuickBooks Sync</span>
            </div>
            <div className="panel-feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Automated Report Generation</span>
            </div>
            <div className="panel-feature">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <span>Multi-Franchise Dashboard</span>
            </div>
          </div>

          <div className="panel-trust">
            <span className="trust-text">Trusted by 500+ franchise owners</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-panel-right">
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">
              Connect your QuickBooks account to securely access your franchise data.
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="btn-quickbooks">
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span>Sign in with QuickBooks</span>
              </>
            )}
          </button>

          <div className="divider">
            <span>Quick access features</span>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Secure OAuth</span>
            </div>
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>No passwords stored</span>
            </div>
            <div className="feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>30-second setup</span>
            </div>
          </div>

          <Link to="/pricing" className="pricing-link">
            View Pricing Plans
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="login-footer">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .login-page {
    min-height: 100vh;
    display: flex;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    position: relative;
    background: #fff;
  }

  .login-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .bg-gradient {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.03) 0%, rgba(14, 165, 233, 0.03) 100%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(#E2E8F0 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.3;
  }

  /* Left Panel */
  .login-panel-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    position: relative;
    overflow: hidden;
  }

  .login-panel-left::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .panel-content {
    position: relative;
    max-width: 480px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    margin-bottom: 60px;
  }

  .logo-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .logo-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }

  .logo-subtext {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
  }

  .panel-title {
    font-size: 42px;
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .panel-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    margin: 0 0 48px;
  }

  .panel-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 48px;
  }

  .panel-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .panel-trust {
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .trust-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  /* Right Panel */
  .login-panel-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
    position: relative;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 24px;
    padding: 48px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
  }

  .card-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .card-title {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .card-subtitle {
    font-size: 15px;
    color: #64748B;
    line-height: 1.5;
    margin: 0;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }

  .alert-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #DC2626;
  }

  .btn-quickbooks {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 18px 24px;
    background: linear-gradient(135deg, #0077C5 0%, #005A94 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(0, 119, 197, 0.3);
  }

  .btn-quickbooks:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 119, 197, 0.4);
  }

  .btn-quickbooks:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 28px 0;
    color: #94A3B8;
    font-size: 13px;
    font-weight: 500;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E2E8F0;
  }

  .divider span {
    padding: 0 16px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    background: #F8FAFC;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    text-align: center;
  }

  .feature-item span {
    font-size: 12px;
    font-weight: 500;
    color: #475569;
  }

  .pricing-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #059669;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .pricing-link:hover {
    color: #047857;
  }

  .login-footer {
    margin-top: 32px;
    text-align: center;
  }

  .login-footer p {
    font-size: 13px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  .footer-link {
    color: #059669;
    text-decoration: none;
    font-weight: 500;
  }

  .footer-link:hover {
    text-decoration: underline;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .login-panel-left {
      display: none;
    }

    .login-panel-right {
      padding: 40px 24px;
    }
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 32px 24px;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .card-title {
      font-size: 24px;
    }
  }
`;
