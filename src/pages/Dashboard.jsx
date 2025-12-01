import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
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
      } catch (err) {
        console.error("🚨 Error loading user data:", err);
        setError("Unable to load QuickBooks user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendURL, token, realmId]);

  const handleLogout = () => {
    // Clear all stored tokens and user data
    localStorage.removeItem("access_token");
    localStorage.removeItem("realm_id");
    localStorage.removeItem("user_email");
    
    // Redirect to login page
    window.location.href = "/";
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
          {user.subscription ? (
            <>
              <p><strong>Plan:</strong> {user.subscription.plan}</p>
              <p><strong>Status:</strong> {user.subscription.status}</p>

              {user.subscription.status !== "active" && (
                <button
                  onClick={() => (window.location.href = "/subscribe")}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Reactivate / Upgrade
                </button>
              )}
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
        </>
      ) : (
        <p>No user data found. Please reconnect your QuickBooks account.</p>
      )}
      </div>
    </div>
  );
}
