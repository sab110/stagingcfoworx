import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const realmId = localStorage.getItem("realm_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(
          `${backendURL}/api/subscriptions/company/${realmId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === "active" || data.status === "trialing") {
            localStorage.setItem("has_subscription", "true");
            setVerifying(false);
          } else if (data.status === "no_subscription") {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const retryResponse = await fetch(
              `${backendURL}/api/subscriptions/company/${realmId}`
            );
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              if (retryData.status === "active" || retryData.status === "trialing") {
                localStorage.setItem("has_subscription", "true");
              }
            }
            setVerifying(false);
          } else {
            setVerifying(false);
          }
        } else {
          setVerifying(false);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [backendURL, realmId, searchParams]);

  useEffect(() => {
    if (verifying) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, verifying]);

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.checkIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        
        <h1 style={styles.title}>Payment Successful!</h1>
        
        <p style={styles.subtitle}>
          Thank you for subscribing. Your account has been activated.
        </p>

        {verifying ? (
          <div style={styles.verifyingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.verifyingText}>Verifying your subscription...</p>
          </div>
        ) : (
          <>
            <div style={styles.confirmationBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <p style={styles.confirmationText}>
                You'll receive a confirmation email shortly with your subscription details.
              </p>
            </div>

            <p style={styles.redirectText}>
              Redirecting to dashboard in <span style={styles.countdown}>{countdown}</span> seconds...
            </p>

            <button onClick={() => navigate("/dashboard")} style={styles.button}>
              Go to Dashboard Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "60px 48px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 40px rgba(44, 160, 28, 0.1)",
    border: "1px solid #A7F3D0",
  },
  iconContainer: {
    marginBottom: "28px",
  },
  checkIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#2CA01C",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(44, 160, 28, 0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#065F46",
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#047857",
    margin: "0 0 32px 0",
  },
  verifyingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #E2E8F0",
    borderTopColor: "#2CA01C",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  verifyingText: {
    color: "#64748B",
    fontSize: "14px",
    margin: 0,
  },
  confirmationBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ECFDF5",
    border: "1px solid #A7F3D0",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "28px",
    textAlign: "left",
  },
  confirmationText: {
    color: "#065F46",
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
    color: "#2CA01C",
    fontWeight: "700",
    fontSize: "18px",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#2CA01C",
    color: "white",
    border: "none",
    padding: "16px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(44, 160, 28, 0.3)",
  },
};
