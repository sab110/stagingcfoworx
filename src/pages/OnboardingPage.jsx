import React, { useState, useEffect } from "react";
import LicenseSelection from "../components/LicenseSelection";
import { LoadingScreen, Spinner } from "../components/ui";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isManageMode, setIsManageMode] = useState(false);
  const realmId = localStorage.getItem("realm_id");
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!realmId) {
      window.location.href = "/";
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("manage") === "true") {
      setIsManageMode(true);
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
        
        if (data.onboarding_completed === "true" && !isManageMode) {
          window.location.href = "/dashboard";
          return;
        }
        
        setCompanyInfo(data);
        setLoading(false);
        setCurrentStep(2);
      } else if (response.status === 404) {
        const fetchResponse = await fetch(
          `${backendURL}/api/quickbooks/fetch-company-info/${realmId}`,
          { method: "POST" }
        );
        
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setCompanyInfo(data.company_info);
          setLoading(false);
          setCurrentStep(2);
        } else {
          setLoading(false);
          throw new Error(`Failed to fetch company info`);
        }
      } else {
        setLoading(false);
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching company info:", err);
      setLoading(false);
      
      const errorMessage = err.message.includes("Failed to fetch") 
        ? "Cannot connect to the server. Please check your internet connection."
        : `Failed to load company information: ${err.message}`;
      
      if (window.confirm(`${errorMessage}\n\nWould you like to retry?`)) {
        setLoading(true);
        fetchCompanyInfo();
      }
    }
  };

  const handleLicenseSelectionComplete = (data) => {
    if (data.onboarding_completed) {
      localStorage.setItem(`onboarding_completed_${realmId}`, "true");
    }
    
    if (isManageMode) {
      window.location.href = "/dashboard";
      return;
    }
    
    setCurrentStep(3);
  };

  const handleCompletionRedirect = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/subscriptions/company/${realmId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === "active" || data.status === "trialing") {
          localStorage.setItem("has_subscription", "true");
          window.location.href = "/dashboard";
          return;
        }
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
    
    window.location.href = "/subscribe";
  };

  if (loading) {
    return (
      <LoadingScreen 
        message="Setting up your account..."
        submessage="Connecting to QuickBooks"
        showLogo={true}
      />
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        <div style={styles.progressSteps}>
          <div style={{ ...styles.step, ...(currentStep >= 1 ? styles.stepActive : {}) }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 1 ? styles.stepNumberActive : {})
            }}>
              {currentStep > 1 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '1'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 1 ? styles.stepLabelActive : {})
            }}>QuickBooks</div>
          </div>
          
          <div style={styles.stepLine}>
            <div style={{
              ...styles.stepLineProgress,
              width: currentStep > 1 ? '100%' : '0%'
            }}></div>
          </div>
          
          <div style={{ ...styles.step, ...(currentStep >= 2 ? styles.stepActive : {}) }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 2 ? styles.stepNumberActive : {})
            }}>
              {currentStep > 2 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '2'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 2 ? styles.stepLabelActive : {})
            }}>Select Franchises</div>
          </div>
          
          <div style={styles.stepLine}>
            <div style={{
              ...styles.stepLineProgress,
              width: currentStep > 2 ? '100%' : '0%'
            }}></div>
          </div>
          
          <div style={{ ...styles.step, ...(currentStep >= 3 ? styles.stepActive : {}) }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 3 ? styles.stepNumberActive : {})
            }}>
              {currentStep >= 3 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '3'}
            </div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 3 ? styles.stepLabelActive : {})
            }}>Complete</div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div style={styles.stepContent}>
          <Spinner size="lg" color="primary" />
          <h2 style={styles.connectingTitle}>Connecting to QuickBooks...</h2>
        </div>
      )}

      {currentStep === 2 && (
        <LicenseSelection
          realmId={realmId}
          onComplete={handleLicenseSelectionComplete}
          isManageMode={isManageMode}
        />
      )}

      {currentStep === 3 && (
        <div style={styles.completionContainer}>
        <div style={styles.completionCard}>
            <div style={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          <h2 style={styles.completionTitle}>Setup Complete!</h2>
          <p style={styles.completionText}>
            Your account has been successfully set up. Now let's activate your subscription to start managing your franchise royalties.
          </p>
          <button onClick={handleCompletionRedirect} style={styles.continueButton}>
            Continue to Subscription
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
          </button>
          <p style={styles.subscriptionNote}>
            A subscription is required to access the dashboard.
          </p>
          </div>
        </div>
      )}
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
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E2E8F0',
    borderTopColor: '#059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#64748B',
  },
  
  progressContainer: {
    backgroundColor: '#fff',
    padding: '32px 24px',
    borderBottom: '1px solid #E2E8F0',
  },
  
  progressSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.4,
    transition: 'opacity 0.3s',
  },
  
  stepActive: {
    opacity: 1,
  },
  
  stepNumber: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#E2E8F0',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '10px',
    transition: 'all 0.3s',
  },
  
  stepNumberActive: {
    backgroundColor: '#059669',
    color: '#fff',
  },
  
  stepLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    transition: 'color 0.3s',
  },
  
  stepLabelActive: {
    color: '#0F172A',
  },
  
  stepLine: {
    flex: 1,
    height: '3px',
    backgroundColor: '#E2E8F0',
    margin: '0 20px',
    marginBottom: '30px',
    borderRadius: '2px',
    overflow: 'hidden',
    maxWidth: '100px',
  },
  
  stepLineProgress: {
    height: '100%',
    backgroundColor: '#059669',
    transition: 'width 0.5s ease',
  },
  
  stepContent: {
    textAlign: 'center',
    padding: '80px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  connectingTitle: {
    marginTop: '24px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F172A',
  },
  
  completionContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 24px',
  },
  
  completionCard: {
    maxWidth: '500px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '60px 48px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
  },
  
  successIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#059669',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 4px 20px rgba(44, 160, 28, 0.3)',
  },
  
  completionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '16px',
    marginTop: 0,
  },
  
  completionText: {
    fontSize: '16px',
    color: '#64748B',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  
  continueButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 32px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(44, 160, 28, 0.3)',
  },
  
  subscriptionNote: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
};
