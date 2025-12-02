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

  const handleTryAgain = () => {
    navigate("/subscribe");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.cancelIcon}>✕</div>
        </div>

        <h1 style={styles.title}>Payment Canceled</h1>

        <p style={styles.subtitle}>
          Your payment was not completed. No charges were made to your account.
        </p>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Don't worry! You can try again whenever you're ready. 
            Your selected licenses and preferences have been saved.
          </p>
        </div>

        <p style={styles.redirectText}>
          Returning to subscription page in <span style={styles.countdown}>{countdown}</span> seconds...
        </p>

        <div style={styles.buttonContainer}>
          <button onClick={handleTryAgain} style={styles.primaryButton}>
            Try Again
          </button>
          <button onClick={handleGoHome} style={styles.secondaryButton}>
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
    backgroundColor: "#fef2f2",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "50px 40px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 40px rgba(239, 68, 68, 0.1)",
  },
  iconContainer: {
    marginBottom: "24px",
  },
  cancelIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#fecaca",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontSize: "36px",
    color: "#dc2626",
    fontWeight: "bold",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#991b1b",
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 30px 0",
  },
  infoBox: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "8px",
    padding: "15px 20px",
    marginBottom: "25px",
  },
  infoText: {
    color: "#92400e",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  redirectText: {
    color: "#9ca3af",
    fontSize: "14px",
    marginBottom: "20px",
  },
  countdown: {
    color: "#dc2626",
    fontWeight: "700",
    fontSize: "18px",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "25px",
  },
  primaryButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#6b7280",
    border: "2px solid #e5e7eb",
    padding: "14px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  helpSection: {
    borderTop: "1px solid #f3f4f6",
    paddingTop: "20px",
  },
  helpText: {
    color: "#9ca3af",
    fontSize: "14px",
    margin: 0,
  },
  helpLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};
