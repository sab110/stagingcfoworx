import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../components/ui";

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
                <Spinner size="sm" color="white" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span>Sign in with Intuit</span>
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
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
    width: 55%;
    height: 100%;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(99, 102, 241, 0.03) 100%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(203, 213, 225, 0.4) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.35;
  }

  /* Left Panel - Immersive Gradient */
  .login-panel-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 70px;
    background: linear-gradient(145deg, #10B981 0%, #059669 50%, #047857 100%);
    position: relative;
    overflow: hidden;
  }

  .login-panel-left::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -40%;
    width: 100%;
    height: 180%;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.12) 0%, transparent 65%);
    pointer-events: none;
  }

  .login-panel-left::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.08) 100%);
    pointer-events: none;
  }

  .panel-content {
    position: relative;
    max-width: 500px;
    z-index: 1;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    margin-bottom: 70px;
  }

  .logo-icon {
    width: 58px;
    height: 58px;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .logo-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .logo-text {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .logo-subtext {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.02em;
  }

  .panel-title {
    font-size: 46px;
    font-weight: 700;
    color: #fff;
    line-height: 1.12;
    margin: 0 0 24px;
    letter-spacing: -0.03em;
  }

  .panel-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.88);
    line-height: 1.75;
    margin: 0 0 52px;
    font-weight: 400;
  }

  .panel-features {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 52px;
  }

  .panel-feature {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    backdrop-filter: blur(8px);
  }

  .panel-trust {
    padding-top: 36px;
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }

  .trust-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  /* Right Panel - Clean & Centered */
  .login-panel-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
    position: relative;
    background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 52px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.04), 0 16px 32px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(226, 232, 240, 0.6);
  }

  .card-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .card-title {
    font-size: 30px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 14px;
    letter-spacing: -0.02em;
  }

  .card-subtitle {
    font-size: 15px;
    color: #64748B;
    line-height: 1.6;
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
    padding: 18px 28px;
    background: linear-gradient(135deg, #0077C5 0%, #005A94 100%);
    color: #fff;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 18px rgba(0, 119, 197, 0.28), 0 2px 4px rgba(0, 0, 0, 0.05);
    letter-spacing: -0.01em;
    position: relative;
    overflow: hidden;
  }

  .btn-quickbooks::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .btn-quickbooks:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 119, 197, 0.38), 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  .btn-quickbooks:hover::before {
    opacity: 1;
  }

  .btn-quickbooks:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 22px;
    height: 22px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 32px 0;
    color: #94A3B8;
    font-size: 13px;
    font-weight: 500;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
  }

  .divider span {
    padding: 0 18px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 32px;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 14px;
    background: linear-gradient(180deg, #FAFBFC 0%, #F8FAFC 100%);
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    text-align: center;
    transition: all 0.2s ease;
  }

  .feature-item:hover {
    background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
    border-color: rgba(203, 213, 225, 0.8);
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
    color: #10B981;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 12px 0;
  }

  .pricing-link:hover {
    color: #059669;
    gap: 12px;
  }

  .login-footer {
    margin-top: 36px;
    text-align: center;
  }

  .login-footer p {
    font-size: 13px;
    color: #64748B;
    line-height: 1.7;
    margin: 0;
  }

  .footer-link {
    color: #10B981;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .footer-link:hover {
    color: #059669;
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
