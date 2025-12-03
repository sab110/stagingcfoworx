import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    description: "Perfect for small businesses with basic needs",
    variations: [
      { label: "Monthly", price: "$39/mo", priceId: "price_1SHskmLByti58Oj8nuGBedKQ" },
      { label: "6-Month", price: "$222/6mo", priceId: "price_1SHslKLByti58Oj83fqBaoFZ", save: "5%" },
      { label: "Annual", price: "$408/yr", priceId: "price_1SHslhLByti58Oj8LrGoCKbd", save: "13%" },
    ],
  },
  {
    product: "Pro",
    description: "Advanced features for growing franchises",
    badge: "Popular",
    variations: [
      { label: "Monthly", price: "$45/mo", priceId: "price_1SHsmhLByti58Oj8lHK4IN1A" },
      { label: "6-Month", price: "$258/6mo", priceId: "price_1SHsmzLByti58Oj8giCRcZBl", save: "4%" },
      { label: "Annual", price: "$480/yr", priceId: "price_1SHsnRLByti58Oj8tssO47kg", save: "11%" },
    ],
  },
];

export default function Subscribe() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [realmId, setRealmId] = useState("");
  const [licenseCount, setLicenseCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

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
    
    fetchLicenseCount(realm);
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

  const fetchLicenseCount = async (realm) => {
    try {
      const response = await fetch(`${backendURL}/api/licenses/company/${realm}/selected`);
      
      if (response.ok) {
        const data = await response.json();
        const count = data.licenses?.length || 1;
        setLicenseCount(count);
      } else {
        setLicenseCount(1);
      }
    } catch (err) {
      setLicenseCount(1);
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

    if (licenseCount < 1) {
      alert("Please select at least one franchise before subscribing.");
      navigate("/onboarding");
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
          quantity: licenseCount
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
    return numericPrice * licenseCount;
  };

  if (loading) {
    return (
      <>
        <style>{subscribeStyles}</style>
        <div className="loading-page">
          <div className="loading-spinner"></div>
          <p>Loading subscription options...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{subscribeStyles}</style>
      <div className="subscribe-page">
        {/* Header */}
        <header className="header">
          <div className="logo" onClick={() => navigate("/dashboard")}>
            <div className="logo-icon">CW</div>
            <span className="logo-text">CFO Worx</span>
          </div>
        </header>

        <main className="main">
          {/* Alert */}
          {showRedirectMessage && (
            <div className="alert alert-warning">
              <span>{location.state?.message || "A subscription is required to access the dashboard."}</span>
              <button onClick={() => setShowRedirectMessage(false)} className="alert-close">×</button>
            </div>
          )}

          {/* Title */}
          <div className="page-title">
            <h1>Choose Your Plan</h1>
            <p>Welcome, {userEmail}</p>
          </div>

          {/* License Info */}
          <div className="license-info">
            <div className="license-count">
              <span className="count-value">{licenseCount}</span>
              <span className="count-label">{licenseCount === 1 ? 'Franchise' : 'Franchises'}</span>
            </div>
            <p>Subscription cost = Price per license × {licenseCount}</p>
          </div>

          {/* Plans */}
          <div className="plans-container">
            {plans.map((plan) => (
              <div key={plan.product} className={`plan-card ${plan.badge ? 'featured' : ''}`}>
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                <div className="plan-header">
                  <h2>{plan.product}</h2>
                  <p>{plan.description}</p>
                </div>
                <div className="plan-options">
                  {plan.variations.map((variant) => {
                    const total = calculateTotal(variant.price);
                    const period = variant.label === "Monthly" ? "/mo" : variant.label === "6-Month" ? "/6mo" : "/yr";
                    const isLoading = checkoutLoading === variant.priceId;
                    
                    return (
                      <div key={variant.priceId} className="plan-option">
                        <div className="option-header">
                          <span className="option-label">{variant.label}</span>
                          {variant.save && <span className="option-save">Save {variant.save}</span>}
                        </div>
                        <div className="option-price">
                          <span className="per-license">{variant.price} per license</span>
                          <span className="total">${total.toFixed(2)}{period}</span>
                          <span className="total-label">Total for {licenseCount} {licenseCount === 1 ? 'license' : 'licenses'}</span>
                        </div>
                        <button
                          onClick={() => handleCheckout(variant.priceId)}
                          disabled={isLoading}
                          className="btn btn-primary"
                        >
                          {isLoading ? (
                            <>
                              <div className="btn-spinner"></div>
                              Processing...
                            </>
                          ) : (
                            `Subscribe`
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="footer-actions">
            <button onClick={() => navigate("/pricing")} className="btn btn-secondary">
              View Full Pricing Details
            </button>
            <button onClick={() => navigate("/dashboard")} className="btn btn-outline">
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

const subscribeStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .subscribe-page {
    min-height: 100vh;
    background: #0f1419;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #e7e9ea;
  }

  .loading-page {
    min-height: 100vh;
    background: #0f1419;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #e7e9ea;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  .loading-page p {
    color: #71767b;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Header */
  .header {
    padding: 20px 32px;
    border-bottom: 1px solid #2f3336;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    color: white;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
  }

  /* Main */
  .main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  /* Alert */
  .alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-radius: 10px;
    margin-bottom: 32px;
    font-size: 14px;
  }

  .alert-warning {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #fbbf24;
  }

  .alert-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s;
  }

  .alert-close:hover {
    opacity: 1;
  }

  /* Title */
  .page-title {
    text-align: center;
    margin-bottom: 32px;
  }

  .page-title h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .page-title p {
    color: #71767b;
    font-size: 15px;
  }

  /* License Info */
  .license-info {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    margin-bottom: 40px;
  }

  .license-count {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .count-value {
    font-size: 48px;
    font-weight: 700;
    color: #818cf8;
  }

  .count-label {
    font-size: 20px;
    font-weight: 600;
    color: #a5b4fc;
  }

  .license-info p {
    color: #a5b4fc;
    font-size: 14px;
  }

  /* Plans */
  .plans-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 40px;
  }

  .plan-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .plan-card.featured {
    border-color: #6366f1;
  }

  .plan-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .plan-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #2f3336;
  }

  .plan-header h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .plan-header p {
    color: #71767b;
    font-size: 14px;
  }

  .plan-options {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .plan-option {
    background: #0f1419;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 20px;
  }

  .option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .option-label {
    font-size: 14px;
    font-weight: 600;
    color: #e7e9ea;
  }

  .option-save {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }

  .option-price {
    text-align: center;
    margin-bottom: 16px;
  }

  .per-license {
    display: block;
    color: #71767b;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .total {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 4px;
  }

  .total-label {
    display: block;
    color: #71767b;
    font-size: 12px;
  }

  /* Buttons */
  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  .btn-secondary {
    background: #2f3336;
    color: #e7e9ea;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #3a3d41;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #2f3336;
    color: #e7e9ea;
  }

  .btn-outline:hover:not(:disabled) {
    background: #2f3336;
  }

  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Footer */
  .footer-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .plans-container {
      grid-template-columns: 1fr;
    }

    .page-title h1 {
      font-size: 28px;
    }

    .count-value {
      font-size: 36px;
    }
  }

  @media (max-width: 480px) {
    .main {
      padding: 24px 16px;
    }

    .license-info {
      padding: 20px;
    }

    .footer-actions {
      flex-direction: column;
    }

    .footer-actions .btn {
      width: 100%;
    }
  }
`;
