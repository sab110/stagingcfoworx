import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Subscribe from "./pages/Subscribe.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import QuickBooksOAuthCallback from "./components/QuickBooksOAuthCallback.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/quickbooks-oauth-callback" element={<QuickBooksOAuthCallback />} />
      </Routes>
    </Router>
  );
}
