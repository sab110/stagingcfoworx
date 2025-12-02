import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    variations: [
      { label: "Monthly", price: "$39/mo", priceId: "price_1SHskmLByti58Oj8nuGBedKQ" },
      { label: "6-Month", price: "$222/6mo", priceId: "price_1SHslKLByti58Oj83fqBaoFZ" },
      { label: "Annual", price: "$408/yr", priceId: "price_1SHslhLByti58Oj8LrGoCKbd" },
    ],
  },
  {
    product: "Pro",
    variations: [
      { label: "Monthly", price: "$45/mo", priceId: "price_1SHsmhLByti58Oj8lHK4IN1A" },
      { label: "6-Month", price: "$258/6mo", priceId: "price_1SHsmzLByti58Oj8giCRcZBl" },
      { label: "Annual", price: "$480/yr", priceId: "price_1SHsnRLByti58Oj8tssO47kg" },
    ],
  },
];

export default function Subscribe() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [realmId, setRealmId] = useState("");
  const [licenseCount, setLicenseCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Check if redirected from dashboard due to no subscription
  useEffect(() => {
    if (location.state?.message) {
      setShowRedirectMessage(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowRedirectMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const realm = localStorage.getItem("realm_id");
    
    if (!realm) {
      console.error("No QuickBooks connection found");
      alert("Please connect your QuickBooks account first.");
      window.location.href = "/";
      return;
    }
    
    setRealmId(realm);
    
    // If no email in localStorage, fetch from backend
    if (email) {
      setUserEmail(email);
    } else {
      fetchUserEmail(realm);
    }
    
    // Fetch selected license count
    fetchLicenseCount(realm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const count = data.licenses?.length || 1; // Default to 1 if no licenses
        setLicenseCount(count);
        console.log(`📊 Selected licenses: ${count}`);
      } else {
        console.warn("Could not fetch license count, defaulting to 1");
        setLicenseCount(1);
      }
    } catch (err) {
      console.error("Error fetching license count:", err);
      setLicenseCount(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId) => {
    if (!userEmail || !realmId) {
      alert("Please connect your QuickBooks account first.");
      window.location.href = "/";
      return;
    }

    if (licenseCount < 1) {
      alert("Please select at least one license before subscribing.");
      window.location.href = "/onboarding";
      return;
    }

    try {
      console.log(`🛒 Creating checkout session:`);
      console.log(`   Price ID: ${priceId}`);
      console.log(`   Email: ${userEmail}`);
      console.log(`   Realm ID: ${realmId}`);
      console.log(`   Quantity (licenses): ${licenseCount}`);
      console.log(`   License count type: ${typeof licenseCount}`);
      
      const payload = {
        priceId,
        email: userEmail,
        realm_id: realmId,
        quantity: licenseCount
      };
      
      console.log(`📦 Full payload:`, JSON.stringify(payload, null, 2));
      
      const response = await fetch(`${backendURL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(`📥 Response from backend:`, data);
      
      if (response.ok && data.url) {
        console.log(`✅ Redirecting to Stripe checkout...`);
        window.location.href = data.url;
      } else {
        alert(data.detail || "Checkout failed");
        console.error("❌ Stripe Error:", data);
      }
    } catch (error) {
      console.error("❌ Error creating session:", error);
      alert("Error creating checkout session.");
    }
  };

  // Calculate total prices
  const calculateTotal = (basePrice) => {
    // Extract only the dollar amount (before the slash)
    // e.g., "$222/6mo" -> "222", "$39/mo" -> "39"
    const match = basePrice.match(/\$(\d+(?:\.\d+)?)/);
    const numericPrice = match ? parseFloat(match[1]) : 0;
    return numericPrice * licenseCount;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Loading your subscription options...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        marginTop: "40px",
        padding: "20px",
      }}
    >
      {showRedirectMessage && (
        <div style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          padding: "15px 20px",
          maxWidth: "600px",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <span style={{ color: "#92400e", fontWeight: "500" }}>
              {location.state?.message || "A subscription is required to access the dashboard."}
            </span>
          </div>
          <button 
            onClick={() => setShowRedirectMessage(false)}
            style={{
              background: "none",
              border: "none",
              color: "#92400e",
              cursor: "pointer",
              fontSize: "18px",
              padding: "0 5px",
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <h1>Choose Your Subscription Plan</h1>
      <p style={{ color: "#555" }}>Welcome, {userEmail}</p>
      
      <div style={{
        backgroundColor: "#eff6ff",
        border: "2px solid #3b82f6",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "600px",
        margin: "20px auto 40px",
      }}>
        <h3 style={{ color: "#1e40af", margin: "0 0 10px 0" }}>
          📊 Your Selected Licenses
        </h3>
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#1e3a8a", margin: "10px 0" }}>
          {licenseCount} {licenseCount === 1 ? 'License' : 'Licenses'}
        </p>
        <p style={{ color: "#4b5563", fontSize: "14px", margin: "5px 0" }}>
          Your subscription cost will be calculated as: <br />
          <strong>Price per license × {licenseCount} {licenseCount === 1 ? 'license' : 'licenses'}</strong>
        </p>
        {licenseCount < 1 && (
          <p style={{ color: "#dc2626", marginTop: "10px" }}>
            ⚠️ Please select at least one license in the onboarding process
          </p>
        )}
      </div>

      {plans.map((plan) => (
        <div
          key={plan.product}
          style={{
            margin: "40px auto",
            maxWidth: "700px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2>{plan.product}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {plan.variations.map((variant) => {
              const total = calculateTotal(variant.price);
              const period = variant.label === "Monthly" ? "/mo" : variant.label === "6-Month" ? "/6mo" : "/yr";
              
              return (
                <div
                  key={variant.priceId}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "20px",
                    width: "200px",
                    textAlign: "center",
                  }}
                >
                  <h3>{variant.label}</h3>
                  <div style={{ margin: "15px 0" }}>
                    <p style={{ fontSize: "14px", color: "#6b7280", margin: "5px 0" }}>
                      {variant.price} per license
                    </p>
                    <div style={{
                      borderTop: "1px solid #e5e7eb",
                      margin: "10px 0",
                      paddingTop: "10px"
                    }}>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0" }}>
                        × {licenseCount} {licenseCount === 1 ? 'license' : 'licenses'}
                      </p>
                      <p style={{ fontSize: "22px", fontWeight: "bold", color: "#059669", margin: "8px 0" }}>
                        ${total.toFixed(2)}{period}
                      </p>
                      <p style={{ fontSize: "10px", color: "#9ca3af", margin: "5px 0", fontStyle: "italic" }}>
                        (${(total / licenseCount).toFixed(2)} per license)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log(`🔘 Subscribe button clicked`);
                      console.log(`   Current licenseCount state: ${licenseCount}`);
                      console.log(`   Price ID: ${variant.priceId}`);
                      handleCheckout(variant.priceId);
                    }}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      width: "100%",
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#10b981"}
                  >
                    Subscribe ({licenseCount} {licenseCount === 1 ? 'license' : 'licenses'})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: "30px", 
        display: "flex", 
        gap: "15px", 
        justifyContent: "center",
        flexWrap: "wrap" 
      }}>
        <button
          onClick={() => (window.location.href = "/pricing")}
          style={{
            backgroundColor: "white",
            color: "#6b7280",
            border: "2px solid #e5e7eb",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          View Full Pricing Details
        </button>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
