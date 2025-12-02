import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const realmId = localStorage.getItem("realm_id");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    // Verify payment and subscription was created
    const verifyPayment = async () => {
      try {
        // Give webhook a moment to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check subscription status
        const response = await fetch(
          `${backendURL}/api/subscriptions/company/${realmId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === "active" || data.status === "trialing") {
            // Set subscription flag
            localStorage.setItem("has_subscription", "true");
            setVerifying(false);
          } else if (data.status === "no_subscription") {
            // Webhook might still be processing, wait and retry
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

  // Countdown timer for redirect
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

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <div style={styles.checkIcon}>✓</div>
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
              <p style={styles.confirmationText}>
                You'll receive a confirmation email shortly with your subscription details.
              </p>
            </div>

            <p style={styles.redirectText}>
              Redirecting to dashboard in <span style={styles.countdown}>{countdown}</span> seconds...
            </p>

            <button onClick={handleGoToDashboard} style={styles.button}>
              Go to Dashboard Now
            </button>
          </>
        )}
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
    backgroundColor: "#f0fdf4",
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
    boxShadow: "0 10px 40px rgba(16, 185, 129, 0.15)",
  },
  iconContainer: {
    marginBottom: "24px",
  },
  checkIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontSize: "40px",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#065f46",
    margin: "0 0 12px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0 0 30px 0",
  },
  verifyingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  verifyingText: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
  confirmationBox: {
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "15px 20px",
    marginBottom: "25px",
  },
  confirmationText: {
    color: "#047857",
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
    color: "#10b981",
    fontWeight: "700",
    fontSize: "18px",
  },
  button: {
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
};

// Add CSS animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
