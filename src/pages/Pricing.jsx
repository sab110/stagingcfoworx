import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    description: "Perfect for small franchises getting started",
    features: [
      "Basic royalty tracking",
      "QuickBooks integration",
      "Email support",
      "Monthly reports",
      "Up to 5 locations",
    ],
    variations: [
      { label: "Monthly", price: "$39", period: "/mo", priceId: "price_1SHskmLByti58Oj8nuGBedKQ", savings: null },
      { label: "6-Month", price: "$37", period: "/mo", priceId: "price_1SHslKLByti58Oj83fqBaoFZ", savings: "Save 5%" },
      { label: "Annual", price: "$34", period: "/mo", priceId: "price_1SHslhLByti58Oj8LrGoCKbd", savings: "Save 13%" },
    ],
    popular: false,
  },
  {
    product: "Pro",
    description: "Best for growing franchise operations",
    features: [
      "Advanced royalty analytics",
      "QuickBooks integration",
      "Priority support",
      "Real-time dashboards",
      "Unlimited locations",
      "Custom report builder",
      "API access",
    ],
    variations: [
      { label: "Monthly", price: "$45", period: "/mo", priceId: "price_1SHsmhLByti58Oj8lHK4IN1A", savings: null },
      { label: "6-Month", price: "$43", period: "/mo", priceId: "price_1SHsmzLByti58Oj8giCRcZBl", savings: "Save 4%" },
      { label: "Annual", price: "$40", period: "/mo", priceId: "price_1SHsnRLByti58Oj8tssO47kg", savings: "Save 11%" },
    ],
    popular: true,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const isAuthenticated = localStorage.getItem("access_token") && localStorage.getItem("realm_id");

  const handleGetStarted = (priceId) => {
    if (isAuthenticated) {
      // If logged in, go to subscribe page
      navigate("/subscribe");
    } else {
      // If not logged in, go to login page
      navigate("/", { state: { redirectTo: "/subscribe" } });
    }
  };

  const getVariation = (variations) => {
    return variations.find((v) => v.label === billingCycle) || variations[0];
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>📊</span>
            <span style={styles.logoText}>CFO Worx</span>
          </div>
          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/pricing" style={{ ...styles.navLink, ...styles.navLinkActive }}>Pricing</a>
            {isAuthenticated ? (
              <button onClick={() => navigate("/dashboard")} style={styles.navButton}>
                Dashboard
              </button>
            ) : (
              <button onClick={() => navigate("/")} style={styles.navButton}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Simple, Transparent Pricing</h1>
        <p style={styles.heroSubtitle}>
          Choose the plan that fits your franchise. All plans include QuickBooks integration.
        </p>

        {/* Billing Toggle */}
        <div style={styles.billingToggle}>
          {["Monthly", "6-Month", "Annual"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              style={{
                ...styles.toggleButton,
                ...(billingCycle === cycle ? styles.toggleButtonActive : {}),
              }}
            >
              {cycle}
              {cycle === "Annual" && <span style={styles.bestValue}>Best Value</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={styles.pricingSection}>
        <div style={styles.pricingGrid}>
          {plans.map((plan) => {
            const variation = getVariation(plan.variations);
            return (
              <div
                key={plan.product}
                style={{
                  ...styles.pricingCard,
                  ...(plan.popular ? styles.pricingCardPopular : {}),
                }}
              >
                {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}

                <h3 style={styles.planName}>{plan.product}</h3>
                <p style={styles.planDescription}>{plan.description}</p>

                <div style={styles.priceContainer}>
                  <span style={styles.priceAmount}>{variation.price}</span>
                  <span style={styles.pricePeriod}>{variation.period}</span>
                  <span style={styles.perLicense}>per license</span>
                </div>

                {variation.savings && (
                  <div style={styles.savingsBadge}>{variation.savings}</div>
                )}

                <button
                  onClick={() => handleGetStarted(variation.priceId)}
                  style={{
                    ...styles.ctaButton,
                    ...(plan.popular ? styles.ctaButtonPopular : {}),
                  }}
                >
                  Get Started
                </button>

                <ul style={styles.featureList}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={styles.featureItem}>
                      <span style={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>What is a license?</h4>
            <p style={styles.faqAnswer}>
              A license represents one franchise location or department that you want to track royalties for. 
              You pay per license you select during onboarding.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Can I change my plan later?</h4>
            <p style={styles.faqAnswer}>
              Yes! You can upgrade, downgrade, or change your billing cycle anytime from your dashboard's 
              billing portal.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>Is there a free trial?</h4>
            <p style={styles.faqAnswer}>
              Contact our sales team to discuss trial options for your specific needs.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h4 style={styles.faqQuestion}>How does QuickBooks integration work?</h4>
            <p style={styles.faqAnswer}>
              We connect securely to your QuickBooks account using OAuth. Your financial data stays 
              in QuickBooks - we just read the information needed for royalty calculations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaSectionTitle}>Ready to streamline your franchise royalties?</h2>
        <p style={styles.ctaSectionSubtitle}>
          Connect your QuickBooks account and start managing royalties in minutes.
        </p>
        <button onClick={() => navigate("/")} style={styles.ctaSectionButton}>
          Get Started Today
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2024 CFO Worx. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
            <a href="/terms" style={styles.footerLink}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    color: "#f8fafc",
  },
  // Header
  header: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "28px",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  navLinkActive: {
    color: "#38bdf8",
  },
  navButton: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  // Hero
  hero: {
    textAlign: "center",
    padding: "80px 24px 60px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    margin: "0 0 20px",
    background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#94a3b8",
    margin: "0 0 40px",
    lineHeight: "1.6",
  },
  billingToggle: {
    display: "inline-flex",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: "12px",
    padding: "6px",
    gap: "4px",
  },
  toggleButton: {
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  toggleButtonActive: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
  },
  bestValue: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    backgroundColor: "#22c55e",
    color: "white",
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  // Pricing Section
  pricingSection: {
    padding: "0 24px 80px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "32px",
  },
  pricingCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "20px",
    padding: "40px 32px",
    position: "relative",
    transition: "all 0.3s",
  },
  pricingCardPopular: {
    border: "2px solid #38bdf8",
    transform: "scale(1.02)",
    boxShadow: "0 0 60px rgba(56, 189, 248, 0.15)",
  },
  popularBadge: {
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: "700",
    padding: "6px 20px",
    borderRadius: "20px",
  },
  planName: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 8px",
  },
  planDescription: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: "0 0 28px",
  },
  priceContainer: {
    marginBottom: "8px",
  },
  priceAmount: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#f8fafc",
  },
  pricePeriod: {
    fontSize: "18px",
    color: "#64748b",
    marginLeft: "4px",
  },
  perLicense: {
    display: "block",
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
  savingsBadge: {
    display: "inline-block",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    color: "#22c55e",
    fontSize: "13px",
    fontWeight: "600",
    padding: "4px 12px",
    borderRadius: "6px",
    marginBottom: "24px",
  },
  ctaButton: {
    width: "100%",
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
    border: "2px solid #38bdf8",
    padding: "16px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "32px",
  },
  ctaButtonPopular: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    fontSize: "15px",
    color: "#cbd5e1",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
  },
  checkIcon: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "16px",
  },
  // FAQ Section
  faqSection: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    padding: "80px 24px",
  },
  faqTitle: {
    fontSize: "36px",
    fontWeight: "700",
    textAlign: "center",
    color: "#f8fafc",
    margin: "0 0 48px",
  },
  faqGrid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "32px",
  },
  faqItem: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  faqQuestion: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#f8fafc",
    margin: "0 0 12px",
  },
  faqAnswer: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0,
    lineHeight: "1.6",
  },
  // CTA Section
  ctaSection: {
    textAlign: "center",
    padding: "80px 24px",
    background: "linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.05) 100%)",
  },
  ctaSectionTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 16px",
  },
  ctaSectionSubtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    margin: "0 0 32px",
  },
  ctaSectionButton: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    border: "none",
    padding: "16px 48px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 20px rgba(56, 189, 248, 0.3)",
  },
  // Footer
  footer: {
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    padding: "32px 24px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  footerLinks: {
    display: "flex",
    gap: "24px",
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s",
  },
};

