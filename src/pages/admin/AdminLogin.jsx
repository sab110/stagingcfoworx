import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Verify token is still valid
      fetch(`${backendURL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) {
            navigate("/admin/dashboard");
          } else {
            localStorage.removeItem("admin_token");
          }
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
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoIcon}>🔐</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>CFO Worx Administration</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errorIcon: {
    fontSize: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#cbd5e1",
  },
  input: {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  footer: {
    marginTop: "32px",
    textAlign: "center",
  },
  backLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s",
  },
};

