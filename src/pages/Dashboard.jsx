import React, { useEffect, useState } from "react";
import ProfileWidget from "../components/ProfileWidget";

export default function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");
  const realmId = localStorage.getItem("realm_id");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !realmId) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendURL}/api/quickbooks/qbo-user/${realmId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Backend error:", text);
          throw new Error(
            text.includes("<!DOCTYPE") ? "Server returned an HTML error page" : text
          );
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("❌ Unexpected response:", text);
          throw new Error("Invalid JSON response from backend.");
        }

        const data = await res.json();
        console.log("✅ QuickBooks user data:", data);

        // Save email for Subscribe page
        if (data.email) localStorage.setItem("user_email", data.email);

        setUser(data);

        // Fetch selected licenses
        await fetchSelectedLicenses();
      } catch (err) {
        console.error("🚨 Error loading user data:", err);
        setError("Unable to load QuickBooks user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectedLicenses = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/licenses/company/${realmId}/selected`
        );
        
        if (response.ok) {
          const data = await response.json();
          setLicenses(data.licenses || []);
        }
      } catch (err) {
        console.error("Error fetching licenses:", err);
      }
    };

    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/subscriptions/company/${realmId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status !== "no_subscription") {
            setSubscription(data);
            console.log("✅ Subscription data:", data);
          }
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    };

    fetchUserData();
    fetchSubscription();
  }, [backendURL, token, realmId]);

  const handleLogout = () => {
    // Clear all stored tokens and user data
    localStorage.removeItem("access_token");
    localStorage.removeItem("realm_id");
    localStorage.removeItem("user_email");
    
    // Redirect to login page
    window.location.href = "/";
  };

  const handleManageBilling = async () => {
    if (!subscription || !subscription.stripe_customer_id) {
      alert("No subscription found. Please subscribe first.");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/stripe/create-customer-portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id
        })
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal");
      }
    } catch (err) {
      console.error("Error opening billing portal:", err);
      alert("Error opening billing portal");
    }
  };

  if (loading) return <div>Loading your QuickBooks data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Top Navigation Bar */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
        color: "white",
        padding: "12px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
          }}>
            ⚡
          </div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            CFO Worx
          </h2>
        </div>
        
        <ProfileWidget user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 30px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Header */}
        <div style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <h1 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "28px", 
            fontWeight: "700", 
            color: "#1e293b",
            letterSpacing: "-0.5px",
          }}>
            {user ? `👋 Welcome back, ${user.full_name?.split(' ')[0] || 'User'}!` : 'Dashboard'}
          </h1>
          {user && (
            <p style={{ margin: 0, color: "#64748b", fontSize: "15px" }}>
              Manage your franchises, subscriptions, and reports all in one place.
            </p>
          )}
        </div>

      {user ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
          
          {/* Account Info Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>👤</span> Account Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ color: "#64748b", fontSize: "14px" }}>Email</span>
                <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "500" }}>{user.email}</span>
              </div>
              {user.quickbooks && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>Realm ID</span>
                  <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "500", fontFamily: "monospace" }}>{user.quickbooks.realm_id}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ color: "#64748b", fontSize: "14px" }}>QuickBooks</span>
                <span style={{ 
                  backgroundColor: "#dcfce7", 
                  color: "#16a34a", 
                  padding: "4px 12px", 
                  borderRadius: "6px", 
                  fontSize: "12px", 
                  fontWeight: "600" 
                }}>Connected</span>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>💳</span> Subscription
            </h3>
            
            {subscription && subscription.plan ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>Plan</span>
                  <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>
                    {subscription.plan.name} ({subscription.plan.billing_cycle})
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>Per License</span>
                  <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "500" }}>{subscription.plan.price}</span>
                </div>
                {subscription.quantity && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Licenses</span>
                    <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "500" }}>{subscription.quantity}</span>
                  </div>
                )}
                {subscription.quantity && subscription.quantity > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Total Cost</span>
                    <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "600" }}>
                      {(() => {
                        const match = subscription.plan.price.match(/\$(\d+(?:\.\d+)?)/);
                        const basePrice = match ? parseFloat(match[1]) : 0;
                        const total = basePrice * subscription.quantity;
                        const period = subscription.plan.billing_cycle === "monthly" ? "/mo" : 
                                      subscription.plan.billing_cycle === "6-month" ? "/6mo" : "/yr";
                        return `$${total.toFixed(2)}${period}`;
                      })()}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b", fontSize: "14px" }}>Status</span>
                  <span style={{ 
                    backgroundColor: subscription.status === "active" ? "#dcfce7" : "#fef2f2", 
                    color: subscription.status === "active" ? "#16a34a" : "#dc2626", 
                    padding: "4px 12px", 
                    borderRadius: "6px", 
                    fontSize: "12px", 
                    fontWeight: "600" 
                  }}>
                    {subscription.status.toUpperCase()}
                  </span>
                </div>
                {subscription.end_date && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                    <span style={{ color: "#64748b", fontSize: "14px" }}>Next Billing</span>
                    <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: "500" }}>
                      {new Date(subscription.end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button
                    onClick={handleManageBilling}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Manage Billing
                  </button>
                  {subscription.status !== "active" && (
                    <button
                      onClick={() => (window.location.href = "/subscribe")}
                      style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#64748b", marginBottom: "16px" }}>No active subscription found.</p>
                <button
                  onClick={() => (window.location.href = "/subscribe")}
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            )}
          </div>

          {/* My Franchises Section - Full Width */}
          {licenses.length > 0 && (
            <div style={{
              gridColumn: "1 / -1",
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>🏢</span> My Franchises 
                  <span style={{ 
                    backgroundColor: "#eff6ff", 
                    color: "#2563eb", 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontSize: "13px", 
                    fontWeight: "600" 
                  }}>
                    {licenses.length}
                  </span>
                </h3>
                <button
                  onClick={() => (window.location.href = "/onboarding")}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e2e8f0";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                >
                  Manage Licenses
                </button>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                {licenses.map((license) => (
                  <div
                    key={license.franchise_number}
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#10b981";
                      e.currentTarget.style.backgroundColor = "#f0fdf4";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "15px", marginBottom: "4px" }}>
                        #{license.franchise_number} - {license.name}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "13px" }}>
                        📍 {license.city}, {license.state}
                        {license.quickbooks?.department_name && (
                          <span style={{ marginLeft: "8px" }}>
                            • {license.quickbooks.department_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      Active
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔗</div>
          <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "20px" }}>
            No Account Connected
          </h3>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Please reconnect your QuickBooks account to continue.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              background: "linear-gradient(135deg, #0077C5 0%, #005a9e 100%)",
              color: "white",
              border: "none",
              padding: "14px 32px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            Connect QuickBooks
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
