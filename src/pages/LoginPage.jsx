import React, { useState } from "react";

function LoginPage() {
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      // Simply redirect to backend /connect endpoint
      window.location.href = `${backendURL}/api/quickbooks/connect`;
    } catch (err) {
      console.error("❌ Login redirect failed:", err);
      setError("Something went wrong during login. Please try again.");
    }
  };

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "100px",
      fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif"
    }}>
      <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#393A3D" }}>
        Welcome back!
      </h2>
      <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}>
        Connect your QuickBooks account to securely access your data.
      </p>

      <button
        onClick={handleLogin}
        style={{
          backgroundColor: "#0077C5",
          color: "white",
          padding: "14px 32px",
          fontSize: "16px",
          fontWeight: "600",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
          marginBottom: "20px"
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#0062A3";
          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#0077C5";
          e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        Sign in with Intuit
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <div style={{
        marginTop: "20px",
        marginBottom: "30px",
      }}>
        <a 
          href="/pricing" 
          style={{ 
            color: "#0077C5", 
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "15px",
          }}
          onMouseOver={(e) => e.target.style.textDecoration = "underline"}
          onMouseOut={(e) => e.target.style.textDecoration = "none"}
        >
          View Pricing Plans →
        </a>
      </div>

      <div style={{ 
        marginTop: "30px",
        fontSize: "13px",
        color: "#666",
        lineHeight: "1.6"
      }}>
        <p style={{ marginBottom: "8px" }}>
          By signing in, you agree to our{" "}
          <a 
            href="/terms" 
            style={{ 
              color: "#0077C5", 
              textDecoration: "none",
              fontWeight: "500"
            }}
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >
            End-User License Agreement
          </a>
          {" "}and{" "}
          <a 
            href="/privacy" 
            style={{ 
              color: "#0077C5", 
              textDecoration: "none",
              fontWeight: "500"
            }}
            onMouseOver={(e) => e.target.style.textDecoration = "underline"}
            onMouseOut={(e) => e.target.style.textDecoration = "none"}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
