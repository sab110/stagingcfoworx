import React, { useEffect, useState } from "react";

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
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Top Navigation Bar with Logout */}
      <div style={{
        backgroundColor: "#0077C5",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          QuickBooks Dashboard
        </h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "white",
            color: "#0077C5",
            border: "2px solid white",
            padding: "10px 28px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "700",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>QuickBooks Connected Dashboard</h1>

      {user ? (
        <>
          <h3>👋 Welcome, {user.full_name || "QuickBooks User"}!</h3>
          <p><strong>Email:</strong> {user.email}</p>

          {user.quickbooks && (
            <>
              <hr />
              <h4>📊 QuickBooks Connection</h4>
              <p><strong>Realm ID:</strong> {user.quickbooks.realm_id}</p>
              <p>
                <strong>Access Token:</strong>{" "}
                {user.quickbooks.access_token
                  ? user.quickbooks.access_token.slice(0, 25) + "..."
                  : "Not available"}
              </p>
            </>
          )}

          <hr />
          <h4>💳 Subscription</h4>
          {subscription && subscription.plan ? (
            <>
              <p><strong>Plan:</strong> {subscription.plan.name} ({subscription.plan.billing_cycle})</p>
              <p><strong>Price:</strong> {subscription.plan.price}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{
                  color: subscription.status === "active" ? "#10b981" : "#ef4444",
                  fontWeight: "600"
                }}>
                  {subscription.status.toUpperCase()}
                </span>
              </p>
              
              {subscription.end_date && (
                <p><strong>Next Billing:</strong> {new Date(subscription.end_date).toLocaleDateString()}</p>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                <button
                  onClick={handleManageBilling}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Manage Billing
                </button>

                {subscription.status !== "active" && (
                  <button
                    onClick={() => (window.location.href = "/subscribe")}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p>No active subscription found.</p>
              <button
                onClick={() => (window.location.href = "/subscribe")}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Subscribe Now
              </button>
            </>
          )}

          {/* My Franchises Section */}
          {licenses.length > 0 && (
            <>
              <hr />
              <h4>🏢 My Franchises ({licenses.length})</h4>
              <div style={{
                maxWidth: "800px",
                margin: "20px auto",
                textAlign: "left"
              }}>
                {licenses.map((license) => (
                  <div
                    key={license.franchise_number}
                    style={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>#{license.franchise_number}</strong> - {license.name}
                      <br />
                      <small style={{ color: "#6b7280" }}>
                        {license.city}, {license.state}
                        {license.quickbooks?.department_name && (
                          <> • {license.quickbooks.department_name}</>
                        )}
                      </small>
                    </div>
                    <div style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      Active
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => (window.location.href = "/onboarding")}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "10px",
                    fontSize: "14px",
                  }}
                >
                  Manage Licenses
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <p>No user data found. Please reconnect your QuickBooks account.</p>
      )}
      </div>
    </div>
  );
}
