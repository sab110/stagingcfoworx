import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    description: "Essential royalty reporting for growing franchises",
    features: [
      "Automated royalty calculations",
      "QuickBooks integration",
      "Monthly reports",
      "Email support",
    ],
    variations: [
      { label: "Monthly", price: "$39", period: "/mo", priceId: "price_1SHskmLByti58Oj8nuGBedKQ" },
      { label: "6-Month", price: "$222", period: "/6mo", priceId: "price_1SHslKLByti58Oj83fqBaoFZ", save: "5%" },
      { label: "Annual", price: "$408", period: "/yr", priceId: "price_1SHslhLByti58Oj8LrGoCKbd", save: "13%" },
    ],
  },
  {
    product: "Pro",
    description: "Advanced automation with priority support",
    badge: "Most Popular",
    features: [
      "Everything in Standard",
      "Advanced analytics",
      "SFTP file delivery",
      "Priority support",
    ],
    variations: [
      { label: "Monthly", price: "$45", period: "/mo", priceId: "price_1SHsmhLByti58Oj8lHK4IN1A" },
      { label: "6-Month", price: "$258", period: "/6mo", priceId: "price_1SHsmzLByti58Oj8giCRcZBl", save: "4%" },
      { label: "Annual", price: "$480", period: "/yr", priceId: "price_1SHsnRLByti58Oj8tssO47kg", save: "11%" },
    ],
  },
];

export default function Subscribe() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [realmId, setRealmId] = useState("");
  const [activeLicenseCount, setActiveLicenseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState({});

  useEffect(() => {
    if (location.state?.message) {
      setShowRedirectMessage(true);
      const timer = setTimeout(() => setShowRedirectMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const realm = localStorage.getItem("realm_id");
    
    if (!realm) {
      alert("Please connect your QuickBooks account first.");
      navigate("/login");
      return;
    }
    
    setRealmId(realm);
    
    if (email) {
      setUserEmail(email);
    } else {
      fetchUserEmail(realm);
    }
    
    fetchActiveLicenseCount(realm);
    
    // Set default billing cycle to Monthly for each plan
    const defaults = {};
    plans.forEach(plan => {
      defaults[plan.product] = 0;
    });
    setSelectedBilling(defaults);
  }, []);
  
  const fetchUserEmail = async (realm) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${backendURL}/api/quickbooks/qbo-user/${realm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.email) {
          setUserEmail(data.email);
          localStorage.setItem("user_email", data.email);
        }
      }
    } catch (err) {
      console.error("Error fetching user email:", err);
    }
  };

  const fetchActiveLicenseCount = async (realm) => {
    try {
      // Fetch only ACTIVE licenses for pricing
      const response = await fetch(`${backendURL}/api/licenses/company/${realm}/selected`);
      
      if (response.ok) {
        const data = await response.json();
        // Count only active licenses
        const activeCount = data.licenses?.filter(l => l.quickbooks?.is_active === "true").length || 0;
        setActiveLicenseCount(activeCount > 0 ? activeCount : 1);
      } else {
        setActiveLicenseCount(1);
      }
    } catch (err) {
      setActiveLicenseCount(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId) => {
    if (!userEmail || !realmId) {
      alert("Please connect your QuickBooks account first.");
      navigate("/login");
      return;
    }

    if (activeLicenseCount < 1) {
      alert("Please activate at least one franchise before subscribing.");
      navigate("/dashboard");
      return;
    }

    try {
      setCheckoutLoading(priceId);
      
      const response = await fetch(`${backendURL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          email: userEmail,
          realm_id: realmId,
          quantity: activeLicenseCount
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.detail || "Checkout failed");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating checkout session.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const calculateTotal = (basePrice) => {
    const match = basePrice.match(/\$(\d+(?:\.\d+)?)/);
    const numericPrice = match ? parseFloat(match[1]) : 0;
    return (numericPrice * activeLicenseCount).toFixed(2);
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading subscription options...</p>
        <style>{keyframes}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => navigate("/dashboard")}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>RoyaltiesAgent</span>
          </div>
          <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Alert */}
        {showRedirectMessage && (
          <div style={styles.alert}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>{location.state?.message || "A subscription is required to access the dashboard."}</span>
            <button onClick={() => setShowRedirectMessage(false)} style={styles.alertClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Choose Your Plan</h1>
          <p style={styles.heroSubtitle}>
            Simple, transparent pricing that scales with your business
          </p>
        </div>

        {/* License Count Card */}
        <div style={styles.licenseCard}>
          <div style={styles.licenseInfo}>
            <div style={styles.licenseIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
              </svg>
            </div>
            <div>
              <div style={styles.licenseCount}>
                <span style={styles.licenseNumber}>{activeLicenseCount}</span>
                <span style={styles.licenseLabel}>Active {activeLicenseCount === 1 ? 'Franchise' : 'Franchises'}</span>
              </div>
              <p style={styles.licenseNote}>
                Pricing is calculated per active franchise. Manage your franchises in the dashboard.
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard")} style={styles.manageFranchisesBtn}>
            Manage Franchises
          </button>
        </div>

        {/* Plans Grid */}
        <div style={styles.plansGrid}>
          {plans.map((plan) => {
            const billingIndex = selectedBilling[plan.product] || 0;
            const selectedVariant = plan.variations[billingIndex];
            const total = calculateTotal(selectedVariant.price);
            const isLoading = checkoutLoading === selectedVariant.priceId;
            
            return (
              <div 
                key={plan.product} 
                style={{
                  ...styles.planCard,
                  ...(plan.badge ? styles.planCardFeatured : {})
                }}
              >
                {plan.badge && (
                  <div style={styles.planBadge}>{plan.badge}</div>
                )}
                
                <div style={styles.planHeader}>
                  <h2 style={styles.planName}>{plan.product}</h2>
                  <p style={styles.planDesc}>{plan.description}</p>
                </div>

                {/* Billing Cycle Selector */}
                <div style={styles.billingSelector}>
                  {plan.variations.map((variant, idx) => (
                    <button
                      key={variant.priceId}
                      onClick={() => setSelectedBilling(prev => ({ ...prev, [plan.product]: idx }))}
                      style={{
                        ...styles.billingOption,
                        ...(billingIndex === idx ? styles.billingOptionActive : {})
                      }}
                    >
                      {variant.label}
                      {variant.save && (
                        <span style={styles.saveBadge}>-{variant.save}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Price Display */}
                <div style={styles.priceSection}>
                  <div style={styles.priceRow}>
                    <span style={styles.pricePerLicense}>{selectedVariant.price}</span>
                    <span style={styles.pricePeriod}>{selectedVariant.period} per franchise</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Your total:</span>
                    <span style={styles.totalPrice}>${total}</span>
                    <span style={styles.totalPeriod}>{selectedVariant.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul style={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={styles.featureItem}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleCheckout(selectedVariant.priceId)}
                  disabled={isLoading}
                  style={{
                    ...styles.ctaBtn,
                    ...(plan.badge ? styles.ctaBtnPrimary : styles.ctaBtnSecondary),
                    ...(isLoading ? styles.ctaBtnLoading : {})
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={styles.btnSpinner}></div>
                      Processing...
                    </>
                  ) : (
                    `Get ${plan.product}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div style={styles.trustSection}>
          <div style={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Secure checkout powered by Stripe</span>
          </div>
          <div style={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Cancel anytime, no hidden fees</span>
          </div>
          <div style={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span>Changes apply on next billing cycle</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Need help? Contact us at <a href="mailto:support@cfoworx.com" style={styles.footerLink}>support@cfoworx.com</a></p>
      </footer>
    </div>
  );
}

const keyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#0F172A',
  },
  
  loadingPage: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  spinner: {
    width: 48,
    height: 48,
    border: '3px solid #E2E8F0',
    borderTopColor: '#2CA01C',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 15,
  },
  
  // Header
  header: {
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  
  logoIcon: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0F172A',
  },
  
  backBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    color: '#64748B',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  
  // Main
  main: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  
  // Alert
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: 12,
    marginBottom: 32,
    fontSize: 14,
    color: '#92400E',
  },
  
  alertClose: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: '#92400E',
    cursor: 'pointer',
    padding: 4,
  },
  
  // Hero
  hero: {
    textAlign: 'center',
    marginBottom: 40,
  },
  
  heroTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 12,
  },
  
  heroSubtitle: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 400,
  },
  
  // License Card
  licenseCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: '24px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  
  licenseInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  
  licenseIcon: {
    width: 56,
    height: 56,
    background: '#ECFDF5',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  licenseCount: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  
  licenseNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2CA01C',
  },
  
  licenseLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
  },
  
  licenseNote: {
    fontSize: 14,
    color: '#64748B',
    margin: 0,
  },
  
  manageFranchisesBtn: {
    padding: '12px 24px',
    background: '#F1F5F9',
    border: 'none',
    borderRadius: 10,
    color: '#475569',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  
  // Plans Grid
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    marginBottom: 48,
  },
  
  planCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 32,
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
  },
  
  planCardFeatured: {
    borderColor: '#2CA01C',
    boxShadow: '0 4px 20px rgba(44, 160, 28, 0.15)',
  },
  
  planBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)',
    color: '#fff',
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  
  planHeader: {
    marginBottom: 24,
    textAlign: 'center',
  },
  
  planName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 8,
  },
  
  planDesc: {
    fontSize: 14,
    color: '#64748B',
    margin: 0,
  },
  
  // Billing Selector
  billingSelector: {
    display: 'flex',
    background: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  
  billingOption: {
    flex: 1,
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  
  billingOptionActive: {
    background: '#fff',
    color: '#0F172A',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  
  saveBadge: {
    background: '#DCFCE7',
    color: '#15803D',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
  },
  
  // Price Section
  priceSection: {
    textAlign: 'center',
    marginBottom: 24,
    padding: '20px 0',
    borderTop: '1px solid #F1F5F9',
    borderBottom: '1px solid #F1F5F9',
  },
  
  priceRow: {
    marginBottom: 12,
  },
  
  pricePerLicense: {
    fontSize: 14,
    color: '#64748B',
  },
  
  pricePeriod: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  
  totalRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  
  totalPrice: {
    fontSize: 36,
    fontWeight: 700,
    color: '#0F172A',
  },
  
  totalPeriod: {
    fontSize: 16,
    color: '#64748B',
  },
  
  // Features
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px 0',
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    fontSize: 14,
    color: '#374151',
    borderBottom: '1px solid #F8FAFC',
  },
  
  // CTA Button
  ctaBtn: {
    width: '100%',
    padding: '14px 24px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  ctaBtnPrimary: {
    background: 'linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)',
    color: '#fff',
  },
  
  ctaBtnSecondary: {
    background: '#F1F5F9',
    color: '#0F172A',
  },
  
  ctaBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  
  btnSpinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  // Trust Section
  trustSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: 40,
    flexWrap: 'wrap',
    paddingTop: 24,
    borderTop: '1px solid #E2E8F0',
  },
  
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: '#64748B',
  },
  
  // Footer
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid #E2E8F0',
    background: '#fff',
  },
  
  footerLink: {
    color: '#2CA01C',
    textDecoration: 'none',
    fontWeight: 500,
  },
};

// Add responsive styles via media query
const mediaStyles = `
  @media (max-width: 768px) {
    .plans-grid {
      grid-template-columns: 1fr !important;
    }
    
    .license-card {
      flex-direction: column !important;
      gap: 20px !important;
      text-align: center !important;
    }
    
    .license-info {
      flex-direction: column !important;
    }
    
    .hero-title {
      font-size: 28px !important;
    }
    
    .trust-section {
      flex-direction: column !important;
      align-items: center !important;
      gap: 16px !important;
    }
  }
`;
