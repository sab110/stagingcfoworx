import React, { useState, useEffect } from "react";

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
  const [userEmail, setUserEmail] = useState("");
  const [realmId, setRealmId] = useState("");

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

  const handleCheckout = async (priceId) => {
    if (!userEmail || !realmId) {
      alert("Please connect your QuickBooks account first.");
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          email: userEmail,
          realm_id: realmId, // Required for company-level subscriptions
        }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.detail || "Checkout failed");
        console.error("Stripe Error:", data);
      }
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Error creating checkout session.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        marginTop: "40px",
        padding: "20px",
      }}
    >
      <h1>Choose Your Subscription Plan</h1>
      <p style={{ color: "#555" }}>Welcome, {userEmail}</p>

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
            {plan.variations.map((variant) => (
              <div
                key={variant.priceId}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "20px",
                  width: "180px",
                  textAlign: "center",
                }}
              >
                <h3>{variant.label}</h3>
                <p style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}>
                  {variant.price}
                </p>
                <button
                  onClick={() => handleCheckout(variant.priceId)}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => (window.location.href = "/dashboard")}
        style={{
          marginTop: "30px",
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
  );
}
