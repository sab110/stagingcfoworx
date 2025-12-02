import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Subscribe from "./pages/Subscribe.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import QuickBooksOAuthCallback from "./components/QuickBooksOAuthCallback.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import SubscriptionProtectedRoute from "./components/SubscriptionProtectedRoute.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import Pricing from "./pages/Pricing.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Payment Result Routes */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        
        {/* Subscribe - requires auth but not subscription */}
        <Route
          path="/subscribe"
          element={
            <PrivateRoute>
              <Subscribe />
            </PrivateRoute>
          }
        />
        
        {/* Onboarding - requires auth but not subscription */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />
        
        {/* Dashboard - requires both auth AND active subscription */}
        <Route
          path="/dashboard"
          element={
            <SubscriptionProtectedRoute>
              <Dashboard />
            </SubscriptionProtectedRoute>
          }
        />
        
        {/* OAuth Callback */}
        <Route path="/quickbooks-oauth-callback" element={<QuickBooksOAuthCallback />} />
      </Routes>
    </Router>
  );
}
