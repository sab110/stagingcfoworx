import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.bgPattern}></div>
      <div style={styles.bgGradient}></div>
      
      {/* Login Card */}
      <div style={styles.loginWrapper}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div style={styles.logoContainer}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#059669"/>
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="16" cy="16" r="3" fill="white"/>
            </svg>
            <span style={styles.logoText}>CFO Worx</span>
          </div>
        </div>

        <div style={styles.card}>
          {/* Card Header */}
          <div style={styles.cardHeader}>
            <span style={styles.adminBadge}>
              <LockIcon />
              Admin Portal
            </span>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.subtitle}>Sign in to access the RoyaltiesAgent administration dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={styles.form}>
            {error && (
              <div style={styles.errorAlert}>
                <AlertCircleIcon />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <UserIcon style={styles.inputIcon} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  style={styles.input}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <KeyIcon style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={styles.cardFooter}>
            <Link to="/" style={styles.backLink}>
              <ArrowLeftIcon />
              Return to main site
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div style={styles.securityNotice}>
          <ShieldIcon />
          <span>Protected by enterprise-grade security</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-login-input:focus {
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

// Icons
function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function KeyIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  bgPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.8,
  },
  bgGradient: {
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '80%',
    height: '100%',
    background: 'radial-gradient(ellipse at center, rgba(5, 150, 105, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  loginWrapper: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '440px',
    animation: 'fadeIn 0.5s ease-out',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: '-0.5px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 24px rgba(0, 0, 0, 0.06)',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '32px 32px 24px',
    textAlign: 'center',
    borderBottom: '1px solid #F1F5F9',
    background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
  },
  adminBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    color: '#FFFFFF',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
    lineHeight: '1.5',
  },
  form: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: '500',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px 44px',
    fontSize: '15px',
    color: '#0F172A',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  togglePassword: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    marginTop: '4px',
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  cardFooter: {
    padding: '20px 32px',
    borderTop: '1px solid #F1F5F9',
    textAlign: 'center',
    background: '#FAFBFC',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  securityNotice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
    color: '#94A3B8',
    fontSize: '13px',
  },
};
