import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch(`${backendURL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) navigate("/admin/dashboard");
          else localStorage.removeItem("admin_token");
        })
        .catch(() => localStorage.removeItem("admin_token"));
    }
  }, [backendURL, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.access_token);
        localStorage.setItem("admin_username", data.admin_username);
        navigate("/admin/dashboard");
      } else {
        setError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="admin-login">
        <div className="login-container">
          <div className="logo">
            <div className="logo-icon">CW</div>
            <span className="logo-text">CFO Worx</span>
          </div>

          <div className="login-card">
            <div className="card-header">
              <div className="admin-badge">Admin Portal</div>
              <h1>Sign In</h1>
              <p>Access the administration dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {error && (
                <div className="alert alert-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="card-footer">
              <Link to="/" className="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to main site
              </Link>
            </div>
          </div>
        </div>

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

  .admin-login {
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
    left: -30%;
    width: 80%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.08) 0%, transparent 70%);
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
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
    overflow: hidden;
  }

  .card-header {
    padding: 32px 32px 24px;
    text-align: center;
    border-bottom: 1px solid #2f3336;
  }

  .admin-badge {
    display: inline-block;
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .card-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #e7e9ea;
    margin-bottom: 8px;
  }

  .card-header p {
    color: #71767b;
    font-size: 14px;
  }

  .login-form {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
  }

  .alert-error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #a1a1aa;
  }

  .form-group input {
    background: #0f1419;
    border: 1px solid #2f3336;
    border-radius: 8px;
    padding: 14px 16px;
    font-size: 15px;
    color: #e7e9ea;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-group input:focus {
    border-color: #ef4444;
  }

  .form-group input::placeholder {
    color: #71767b;
  }

  .btn {
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 15px;
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

  .btn-primary {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
  }

  .btn-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .card-footer {
    padding: 20px 32px;
    border-top: 1px solid #2f3336;
    text-align: center;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #71767b;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
  }

  .back-link:hover {
    color: #e7e9ea;
  }

  @media (max-width: 480px) {
    .login-form {
      padding: 24px;
    }
  }
`;
