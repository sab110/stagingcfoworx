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
    <>
      <style>{loginStyles}</style>
      <div className="login-page">
        <div className="login-container">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">CW</div>
            <span className="logo-text">CFO Worx</span>
          </div>

          {/* Card */}
          <div className="login-card">
            <h1>Welcome back</h1>
            <p className="subtitle">
              Connect your QuickBooks account to securely access your franchise data.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <button onClick={handleLogin} disabled={loading} className="btn btn-intuit">
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  Sign in with Intuit
                </>
              )}
            </button>

            <Link to="/pricing" className="pricing-link">
              View Pricing Plans
            </Link>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              By signing in, you agree to our{" "}
              <Link to="/terms">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="bg-decoration"></div>
      </div>
    </>
  );
}

const loginStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .login-page {
    min-height: 100vh;
    background: #0f1419;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    overflow: hidden;
  }

  .bg-decoration {
    position: absolute;
    top: -50%;
    right: -30%;
    width: 80%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: 20px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 40px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    color: white;
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #e7e9ea;
  }

  .login-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
  }

  .login-card h1 {
    font-size: 28px;
    font-weight: 700;
    color: #e7e9ea;
    margin-bottom: 12px;
  }

  .subtitle {
    color: #71767b;
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 32px;
  }

  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .alert-error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .btn {
    width: 100%;
    padding: 14px 24px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-intuit {
    background: linear-gradient(135deg, #0077C5 0%, #0062A3 100%);
    color: white;
    margin-bottom: 20px;
  }

  .btn-intuit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 119, 197, 0.4);
  }

  .btn-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .pricing-link {
    display: inline-block;
    color: #818cf8;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s;
  }

  .pricing-link:hover {
    color: #a5b4fc;
  }

  .login-footer {
    margin-top: 32px;
    text-align: center;
  }

  .login-footer p {
    font-size: 13px;
    color: #71767b;
    line-height: 1.6;
  }

  .login-footer a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 500;
  }

  .login-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 32px 24px;
    }

    .login-card h1 {
      font-size: 24px;
    }
  }
`;
