import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    description: "Essential royalty reporting for growing franchises",
    features: [
      "Automated royalty calculations",
      "QuickBooks integration",
      "Monthly reports",
      "Email support",
      "Up to 10 franchises",
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
    description: "Advanced automation with priority support",
    features: [
      "Everything in Standard",
      "Advanced analytics",
      "SFTP file delivery",
      "Priority support",
      "Unlimited franchises",
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

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/subscribe");
    } else {
      navigate("/login");
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
          <div style={styles.logo} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>RoyaltiesAgent</span>
          </div>
          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/pricing" style={{ ...styles.navLink, color: '#2CA01C' }}>Pricing</a>
            <a href="/contact" style={styles.navLink}>Contact</a>
            {isAuthenticated ? (
              <button onClick={() => navigate("/dashboard")} style={styles.navButton}>
                Dashboard
              </button>
            ) : (
              <button onClick={() => navigate("/login")} style={styles.navButton}>
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
                  <span style={styles.perLicense}>per franchise</span>
                </div>

                {variation.savings && (
                  <div style={styles.savingsBadge}>{variation.savings}</div>
                )}

                <button
                  onClick={handleGetStarted}
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
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
            <h4 style={styles.faqQuestion}>What is a franchise license?</h4>
            <p style={styles.faqAnswer}>
              A license represents one franchise location that you want to track royalties for. 
              You only pay for active franchises in your account.
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
            <h4 style={styles.faqQuestion}>How does billing work when I add/remove franchises?</h4>
            <p style={styles.faqAnswer}>
              Changes to your active franchise count will be reflected on your next billing cycle. 
              We don't charge retroactively.
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
        <button onClick={() => navigate("/login")} style={styles.ctaSectionButton}>
          Get Started Today
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2024 RoyaltiesAgent by CFOWORX. All rights reserved.</p>
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
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#0F172A',
  },
  
  // Header
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  navButton: {
    backgroundColor: '#2CA01C',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  // Hero
  hero: {
    textAlign: 'center',
    padding: '80px 24px 60px',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 20px',
    color: '#0F172A',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#64748B',
    margin: '0 0 40px',
    lineHeight: '1.6',
  },
  billingToggle: {
    display: 'inline-flex',
    backgroundColor: '#F1F5F9',
    borderRadius: '12px',
    padding: '6px',
    gap: '4px',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    color: '#64748B',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    color: '#0F172A',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  bestValue: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#2CA01C',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  
  // Pricing Section
  pricingSection: {
    padding: '0 24px 80px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '32px',
  },
  pricingCard: {
    backgroundColor: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '40px 32px',
    position: 'relative',
    transition: 'all 0.3s',
  },
  pricingCardPopular: {
    border: '2px solid #2CA01C',
    boxShadow: '0 4px 20px rgba(44, 160, 28, 0.15)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#2CA01C',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '6px 20px',
    borderRadius: '20px',
  },
  planName: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 8px',
  },
  planDescription: {
    fontSize: '15px',
    color: '#64748B',
    margin: '0 0 28px',
  },
  priceContainer: {
    marginBottom: '8px',
  },
  priceAmount: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#0F172A',
  },
  pricePeriod: {
    fontSize: '18px',
    color: '#64748B',
    marginLeft: '4px',
  },
  perLicense: {
    display: 'block',
    fontSize: '14px',
    color: '#64748B',
    marginTop: '4px',
  },
  savingsBadge: {
    display: 'inline-block',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    fontSize: '13px',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '32px',
  },
  ctaButtonPopular: {
    backgroundColor: '#2CA01C',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(44, 160, 28, 0.3)',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    fontSize: '15px',
    color: '#374151',
    borderBottom: '1px solid #F1F5F9',
  },
  
  // FAQ Section
  faqSection: {
    backgroundColor: '#F8FAFC',
    padding: '80px 24px',
  },
  faqTitle: {
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#0F172A',
    margin: '0 0 48px',
  },
  faqGrid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '24px',
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '28px',
    border: '1px solid #E2E8F0',
  },
  faqQuestion: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    margin: '0 0 12px',
  },
  faqAnswer: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
    lineHeight: '1.6',
  },
  
  // CTA Section
  ctaSection: {
    textAlign: 'center',
    padding: '80px 24px',
    background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
  },
  ctaSectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#064E3B',
    margin: '0 0 16px',
  },
  ctaSectionSubtitle: {
    fontSize: '18px',
    color: '#047857',
    margin: '0 0 32px',
  },
  ctaSectionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#2CA01C',
    color: '#fff',
    border: 'none',
    padding: '16px 36px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(44, 160, 28, 0.3)',
  },
  
  // Footer
  footer: {
    borderTop: '1px solid #E2E8F0',
    padding: '32px 24px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: '14px',
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '14px',
  },
};
