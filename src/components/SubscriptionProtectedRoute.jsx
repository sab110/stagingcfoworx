// src/components/SubscriptionProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./ui";

/**
 * Protects routes that require both authentication AND an active subscription.
 * If no subscription, redirects to subscription page.
 */
const SubscriptionProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");
  const realmId = localStorage.getItem("realm_id");

  useEffect(() => {
    const checkSubscription = async () => {
      if (!token || !userId || !realmId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${backendURL}/api/subscriptions/company/${realmId}`
        );

        if (response.ok) {
          const data = await response.json();
          // Check for active or trialing subscription
          if (data.status === "active" || data.status === "trialing") {
            setHasSubscription(true);
            localStorage.setItem("has_subscription", "true");
          } else {
            setHasSubscription(false);
            localStorage.removeItem("has_subscription");
          }
        } else {
          setHasSubscription(false);
          localStorage.removeItem("has_subscription");
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        setHasSubscription(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [backendURL, token, userId, realmId]);

  // Show loading while checking subscription
  if (loading) {
    return (
      <LoadingScreen 
        message="Verifying subscription..."
        submessage="This will only take a moment"
        showLogo={true}
      />
    );
  }

  // Not authenticated - redirect to login
  if (!token || !userId) {
    return <Navigate to="/" replace />;
  }

  // No realm connected - redirect to login
  if (!realmId) {
    return <Navigate to="/" replace />;
  }

  // No subscription - redirect to subscribe page
  if (!hasSubscription) {
    return <Navigate to="/subscribe" replace state={{ message: "Please subscribe to access the dashboard." }} />;
  }

  return children;
};

export default SubscriptionProtectedRoute;
