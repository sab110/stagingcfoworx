import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/subscribe");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.cancelIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>

        <h1 style={styles.title}>Payment Canceled</h1>

        <p style={styles.subtitle}>
          Your payment was not completed. No charges were made to your account.
        </p>

        <div style={styles.infoBox}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={styles.infoText}>
            Don't worry! You can try again whenever you're ready. 
            Your selected franchises and preferences have been saved.
          </p>
        </div>

        <p style={styles.redirectText}>
          Returning to subscription page in <span style={styles.countdown}>{countdown}</span> seconds...
        </p>

        <div style={styles.buttonContainer}>
          <button onClick={() => navigate("/subscribe")} style={styles.primaryButton}>
            Try Again
          </button>
          <button onClick={() => navigate("/")} style={styles.secondaryButton}>
            Return Home
          </button>
        </div>

        <div style={styles.helpSection}>
          <p style={styles.helpText}>
            Having trouble? <a href="mailto:support@cfoworx.com" style={styles.helpLink}>Contact Support</a>
          </p>
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
    background: "linear-gradient(180deg, #FEF2F2 0%, #FECACA 100%)",
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "60px 48px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 40px rgba(239, 68, 68, 0.1)",
    border: "1px solid #FECACA",
  },
  iconContainer: {
    marginBottom: "28px",
  },
  cancelIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#DC2626",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#991B1B",
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748B",
    margin: "0 0 28px 0",
  },
  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    backgroundColor: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "28px",
    textAlign: "left",
  },
  infoText: {
    color: "#92400E",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  redirectText: {
    color: "#64748B",
    fontSize: "14px",
    marginBottom: "24px",
  },
  countdown: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: "18px",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "28px",
  },
  primaryButton: {
    backgroundColor: "#059669",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(44, 160, 28, 0.3)",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#64748B",
    border: "1px solid #E2E8F0",
    padding: "14px 24px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  helpSection: {
    borderTop: "1px solid #E2E8F0",
    paddingTop: "24px",
  },
  helpText: {
    color: "#64748B",
    fontSize: "14px",
    margin: 0,
  },
  helpLink: {
    color: "#059669",
    textDecoration: "none",
    fontWeight: "600",
  },
};
