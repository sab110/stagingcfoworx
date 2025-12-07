import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen, ErrorScreen } from "./ui";

const QuickBooksOAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const exchangeTokens = async () => {
      // Prevent duplicate execution in React Strict Mode
      if (hasExchanged.current) return;
      hasExchanged.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get("code");
      const realmId = urlParams.get("realmId");

      if (!authCode || !realmId) {
        setError("Missing authorization code or company ID. Please try connecting again.");
        setLoading(false);
        return;
      }

      // Fallback user for demo purposes
      let userId = localStorage.getItem("user_id");
      if (!userId) {
        userId = 1;
        localStorage.setItem("user_id", userId);
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/quickbooks/store-qbo-oauth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              authCode,
              realm_id: realmId,
              user_id: parseInt(userId),
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Save tokens locally
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("realm_id", data.realm_id);
          localStorage.setItem("user_id", data.user_id || userId);

          // Check if company has completed onboarding
          const checkOnboardingResponse = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/quickbooks/qbo-user/${data.realm_id}`,
            { headers: { Authorization: `Bearer ${data.access_token}` } }
          );

          if (checkOnboardingResponse.ok) {
            const userData = await checkOnboardingResponse.json();
            
            // If company already completed onboarding, go to dashboard
            if (userData.onboarding_completed) {
              console.log("✅ Company onboarding already completed, redirecting to dashboard");
              window.history.replaceState({}, document.title, "/dashboard");
              navigate("/dashboard");
              return;
            }
          }

          // New company - redirect to onboarding
          console.log("🆕 New company, redirecting to onboarding");
          window.history.replaceState({}, document.title, "/onboarding");
          navigate("/onboarding");
        } else {
          console.error("Backend error:", data);
          const msg =
            data.detail ||
            data.error_description ||
            "Failed to connect to QuickBooks. Please try again.";
          setError(msg);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to connect to our servers. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    exchangeTokens();
  }, [navigate]);

  if (loading) {
    return (
      <LoadingScreen 
        message="Connecting to QuickBooks..."
        submessage="Please wait while we securely connect your account"
        showLogo={true}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen 
        title="Connection Failed"
        message={error}
        onRetry={() => {
          window.location.href = "/login";
        }}
        onBack={() => navigate("/")}
      />
    );
  }

  return null;
};

export default QuickBooksOAuthCallback;
