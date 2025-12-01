import React, { useState, useEffect } from "react";
import LicenseSelection from "../components/LicenseSelection";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const realmId = localStorage.getItem("realm_id");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!realmId) {
      window.location.href = "/";
      return;
    }
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendURL}/api/quickbooks/company-info/${realmId}`
      );

      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data);
        setCurrentStep(2); // Move to license selection
      } else {
        // If company info doesn't exist, fetch it from QuickBooks
        const fetchResponse = await fetch(
          `${backendURL}/api/quickbooks/fetch-company-info/${realmId}`,
          { method: "POST" }
        );
        
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setCompanyInfo(data.company_info);
          setCurrentStep(2);
        } else {
          throw new Error("Failed to fetch company info");
        }
      }
    } catch (err) {
      console.error("❌ Error fetching company info:", err);
      alert("Failed to load company information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLicenseSelectionComplete = (data) => {
    console.log("✅ License selection completed:", data);
    // Move to final step or dashboard
    setCurrentStep(3);
  };

  const handleCompletionRedirect = () => {
    // Redirect to subscribe page or dashboard
    const hasSubscription = localStorage.getItem("has_subscription") === "true";
    if (hasSubscription) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/subscribe";
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}>
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        <div style={styles.progressSteps}>
          <div style={{ ...styles.step, ...(currentStep >= 1 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepLabel}>QuickBooks</div>
          </div>
          <div style={styles.stepLine}></div>
          <div style={{ ...styles.step, ...(currentStep >= 2 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepLabel}>Select Licenses</div>
          </div>
          <div style={styles.stepLine}></div>
          <div style={{ ...styles.step, ...(currentStep >= 3 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepLabel}>Complete</div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div style={styles.stepContent}>
          <h2>Connecting to QuickBooks...</h2>
        </div>
      )}

      {currentStep === 2 && (
        <LicenseSelection
          realmId={realmId}
          onComplete={handleLicenseSelectionComplete}
        />
      )}

      {currentStep === 3 && (
        <div style={styles.completionCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.completionTitle}>Setup Complete!</h2>
          <p style={styles.completionText}>
            Your account has been successfully set up. You're ready to start managing your franchise royalties.
          </p>
          <button onClick={handleCompletionRedirect} style={styles.continueButton}>
            Continue to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  progressContainer: {
    backgroundColor: "white",
    padding: "30px 20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  progressSteps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "600px",
    margin: "0 auto",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    opacity: 0.4,
  },
  stepActive: {
    opacity: 1,
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  stepLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
  },
  stepLine: {
    flex: 1,
    height: "2px",
    backgroundColor: "#e5e7eb",
    margin: "0 15px",
  },
  stepContent: {
    textAlign: "center",
    padding: "60px 20px",
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  completionCard: {
    maxWidth: "500px",
    margin: "60px auto",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  successIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  completionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "15px",
  },
  completionText: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  continueButton: {
    padding: "15px 40px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

