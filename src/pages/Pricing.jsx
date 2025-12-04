import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    product: "Standard",
    description: "Essential royalty reporting for growing franchises",
    monthlyPrice: 39,
    features: [
      "Automated royalty calculations",
      "QuickBooks integration",
      "Monthly reports",
      "Email support",
      "Secure cloud storage",
    ],
    variations: [
      { label: "Monthly", price: 39, period: "/mo", priceId: "price_1SHskmLByti58Oj8nuGBedKQ", discount: 0 },
      { label: "6-Month", price: 37, period: "/mo", priceId: "price_1SHslKLByti58Oj83fqBaoFZ", discount: 5 },
      { label: "Annual", price: 34, period: "/mo", priceId: "price_1SHslhLByti58Oj8LrGoCKbd", discount: 13 },
    ],
    popular: false,
  },
  {
    product: "Pro",
    description: "Advanced automation with priority support",
    monthlyPrice: 45,
    features: [
      "Everything in Standard",
      "Advanced analytics dashboard",
      "SFTP file delivery",
      "Priority support",
      "Dedicated account manager",
    ],
    variations: [
      { label: "Monthly", price: 45, period: "/mo", priceId: "price_1SHsmhLByti58Oj8lHK4IN1A", discount: 0 },
      { label: "6-Month", price: 43, period: "/mo", priceId: "price_1SHsmzLByti58Oj8giCRcZBl", discount: 4 },
      { label: "Annual", price: 40, period: "/mo", priceId: "price_1SHsnRLByti58Oj8tssO47kg", discount: 11 },
    ],
    popular: true,
  },
];

const faqs = [
  {
    question: "What is a franchise license?",
    answer: "A license represents one franchise location that you want to track royalties for. You only pay for active franchises in your account. There's no limit on the number of franchises you can add."
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes! You can upgrade, downgrade, or change your billing cycle anytime from your dashboard's billing portal. Changes take effect immediately."
  },
  {
    question: "How does billing work when I add/remove franchises?",
    answer: "Changes to your active franchise count will be reflected on your next billing cycle. We don't charge retroactively, and you'll only pay for franchises that are currently active."
  },
  {
    question: "How does QuickBooks integration work?",
    answer: "We connect securely to your QuickBooks account using OAuth 2.0. Your financial data stays in QuickBooks - we just read the information needed for royalty calculations. The connection is encrypted and secure."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure payment processor, Stripe. All transactions are encrypted and PCI compliant."
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No long-term contracts required. You can cancel anytime from your dashboard. If you cancel, you'll retain access until the end of your current billing period."
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={styles.page}>
      <style>{keyframes + responsiveCSS}</style>
      
      {/* Modern Navbar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <div style={styles.logo} onClick={() => navigate("/")}>
              <div style={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={styles.logoTextContainer}>
                <span style={styles.logoText}>RoyaltiesAgent</span>
                <span style={styles.logoSubtext}>by CFOWORX</span>
              </div>
            </div>
          </div>
          
          <nav style={styles.nav} className="nav">
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/pricing" style={styles.navLinkActive}>Pricing</a>
            <a href="/contact" style={styles.navLink}>Contact</a>
          </nav>
          
          <div style={styles.headerRight} className="header-right">
            {isAuthenticated ? (
              <button onClick={() => navigate("/dashboard")} style={styles.navButtonPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/login")} style={styles.navButtonSecondary}>
                  Sign In
                </button>
                <button onClick={() => navigate("/login")} style={styles.navButtonPrimary}>
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuBtn}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"/>
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu} className="mobile-menu">
            <a href="/" style={styles.mobileNavLink}>Home</a>
            <a href="/about" style={styles.mobileNavLink}>About</a>
            <a href="/pricing" style={styles.mobileNavLinkActive}>Pricing</a>
            <a href="/contact" style={styles.mobileNavLink}>Contact</a>
            <div style={styles.mobileMenuButtons}>
              {isAuthenticated ? (
                <button onClick={() => navigate("/dashboard")} style={styles.mobileNavButtonPrimary}>
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} style={styles.mobileNavButtonSecondary}>Sign In</button>
                  <button onClick={() => navigate("/login")} style={styles.mobileNavButtonPrimary}>Get Started</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Simple, Transparent Pricing
          </div>
          <h1 style={styles.heroTitle} className="hero-title">
            Choose the plan that
            <br />
            <span style={styles.heroTitleGradient}>fits your business</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Pay per franchise. No hidden fees. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div style={styles.billingToggleWrapper}>
            <div style={styles.billingToggle}>
              {["Monthly", "6-Month", "Annual"].map((cycle) => {
                const isActive = billingCycle === cycle;
                return (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    style={{
                      ...styles.toggleButton,
                      ...(isActive ? styles.toggleButtonActive : {}),
                    }}
                  >
                    {cycle}
                    {cycle === "Annual" && (
                      <span style={styles.saveBadgeInline}>Save 13%</span>
                    )}
                  </button>
                );
              })}
              <div style={{
                ...styles.toggleSlider,
                transform: `translateX(${billingCycle === "Monthly" ? 0 : billingCycle === "6-Month" ? 100 : 200}%)`,
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={styles.pricingSection}>
        <div style={styles.pricingGrid} className="pricing-grid">
          {plans.map((plan) => {
            const variation = getVariation(plan.variations);
            const showDiscount = variation.discount > 0;
            
            return (
              <div
                key={plan.product}
                style={{
                  ...styles.pricingCard,
                  ...(plan.popular ? styles.pricingCardPopular : {}),
                }}
              >
                {plan.popular && (
                  <div style={styles.popularBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Most Popular
                  </div>
                )}

                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>{plan.product}</h3>
                  <p style={styles.planDescription}>{plan.description}</p>
                </div>

                <div style={styles.priceContainer}>
                  {showDiscount && (
                    <div style={styles.originalPrice}>
                      <span style={styles.strikethrough}>${plan.monthlyPrice}</span>
                      <span style={styles.discountBadge}>-{variation.discount}%</span>
                    </div>
                  )}
                  <div style={styles.priceRow}>
                    <span style={styles.priceCurrency}>$</span>
                    <span style={styles.priceAmount}>{variation.price}</span>
                    <div style={styles.priceDetails}>
                      <span style={styles.pricePeriod}>/month</span>
                      <span style={styles.perLicense}>per franchise</span>
                    </div>
                  </div>
                  {billingCycle === "6-Month" && (
                    <div style={styles.billedNote}>Billed ${variation.price * 6} every 6 months</div>
                  )}
                  {billingCycle === "Annual" && (
                    <div style={styles.billedNote}>Billed ${variation.price * 12} annually</div>
                  )}
                </div>

                <button
                  onClick={handleGetStarted}
                  style={{
                    ...styles.ctaButton,
                    ...(plan.popular ? styles.ctaButtonPopular : {}),
                  }}
                >
                  Get Started
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>

                <div style={styles.featuresDivider}>
                  <span style={styles.featuresDividerText}>What's included</span>
                </div>

                <ul style={styles.featureList}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={styles.featureItem}>
                      <div style={styles.featureIcon}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span style={styles.featureText}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div style={styles.trustSection}>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <div style={styles.trustTitle}>Secure Payments</div>
              <div style={styles.trustDesc}>256-bit SSL encryption</div>
            </div>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div style={styles.trustTitle}>Cancel Anytime</div>
              <div style={styles.trustDesc}>No contracts or commitments</div>
            </div>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div style={styles.trustTitle}>Dedicated Support</div>
              <div style={styles.trustDesc}>We're here to help</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section style={styles.faqSection}>
        <div style={styles.faqContainer}>
          <div style={styles.faqHeader}>
            <span style={styles.faqBadge}>FAQ</span>
            <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
            <p style={styles.faqSubtitle}>
              Everything you need to know about RoyaltiesAgent
            </p>
          </div>

          <div style={styles.faqList}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.faqItem,
                  ...(openFaq === index ? styles.faqItemOpen : {}),
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={styles.faqQuestion}
                >
                  <span style={styles.faqQuestionText}>{faq.question}</span>
                  <div style={{
                    ...styles.faqIcon,
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </button>
                <div style={{
                  ...styles.faqAnswer,
                  maxHeight: openFaq === index ? '300px' : '0px',
                  opacity: openFaq === index ? 1 : 0,
                  padding: openFaq === index ? '0 24px 24px' : '0 24px',
                }}>
                  <p style={styles.faqAnswerText}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.faqCta}>
            <p style={styles.faqCtaText}>Still have questions?</p>
            <button onClick={() => navigate("/contact")} style={styles.faqCtaButton}>
              Contact Support
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaSectionInner} className="cta-section-inner">
          <div style={styles.ctaSectionContent}>
            <h2 style={styles.ctaSectionTitle}>
              Ready to streamline your franchise royalties?
            </h2>
            <p style={styles.ctaSectionSubtitle}>
              Join hundreds of franchise businesses already using RoyaltiesAgent to automate their royalty reporting.
            </p>
            <div style={styles.ctaButtons}>
              <button onClick={() => navigate("/login")} style={styles.ctaSectionButton}>
                Get Started Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={() => navigate("/contact")} style={styles.ctaSectionButtonSecondary}>
                Talk to Sales
              </button>
            </div>
          </div>
          <div style={styles.ctaSectionGraphic}>
            <div style={styles.ctaGraphicCard}>
              <div style={styles.ctaGraphicIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div style={styles.ctaGraphicText}>
                <div style={styles.ctaGraphicTitle}>Automated Reporting</div>
                <div style={styles.ctaGraphicDesc}>Save hours every month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop} className="footer-top">
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <div style={styles.footerLogoIcon}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={styles.footerLogoText}>RoyaltiesAgent</div>
                <div style={styles.footerLogoSubtext}>by CFOWORX</div>
              </div>
            </div>
            <p style={styles.footerBrandDesc}>
              Automated royalty reporting for franchise businesses. 
              Seamlessly integrated with QuickBooks.
            </p>
          </div>
          
          <div style={styles.footerLinks}>
            <div style={styles.footerLinkGroup}>
              <h4 style={styles.footerLinkTitle}>Product</h4>
              <a href="/pricing" style={styles.footerLink}>Pricing</a>
              <a href="/about" style={styles.footerLink}>About</a>
              <a href="/contact" style={styles.footerLink}>Contact</a>
            </div>
            <div style={styles.footerLinkGroup}>
              <h4 style={styles.footerLinkTitle}>Legal</h4>
              <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
              <a href="/terms" style={styles.footerLink}>Terms of Service</a>
            </div>
            <div style={styles.footerLinkGroup}>
              <h4 style={styles.footerLinkTitle}>Support</h4>
              <a href="/contact" style={styles.footerLink}>Help Center</a>
              <a href="mailto:support@cfoworx.com" style={styles.footerLink}>support@cfoworx.com</a>
            </div>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
            © {new Date().getFullYear()} RoyaltiesAgent by CFOWORX. All rights reserved.
          </p>
          <div style={styles.footerSocial}>
            <span style={styles.footerSecure}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secured by Stripe
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const keyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#0F172A',
  },
  
  // Modern Header
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(44, 160, 28, 0.25)',
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 1.2,
  },
  logoSubtext: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: '0.5px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    color: '#059669',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#ECFDF5',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navButtonSecondary: {
    backgroundColor: 'transparent',
    color: '#475569',
    border: '1px solid #E2E8F0',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navButtonPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(44, 160, 28, 0.25)',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  mobileMenu: {
    display: 'none',
  },
  mobileNavLink: {
    display: 'block',
    padding: '16px 24px',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    borderBottom: '1px solid #F1F5F9',
  },
  mobileNavLinkActive: {
    display: 'block',
    padding: '16px 24px',
    color: '#059669',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    borderBottom: '1px solid #F1F5F9',
    backgroundColor: '#ECFDF5',
  },
  mobileMenuButtons: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileNavButtonSecondary: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  mobileNavButtonPrimary: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  // Hero Section
  hero: {
    position: 'relative',
    textAlign: 'center',
    padding: '100px 24px 80px',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(44, 160, 28, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    padding: '8px 16px',
    borderRadius: '100px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    border: '1px solid #A7F3D0',
  },
  heroTitle: {
    fontSize: '56px',
    fontWeight: '800',
    margin: '0 0 24px',
    color: '#0F172A',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  heroTitleGradient: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#64748B',
    margin: '0 0 48px',
    lineHeight: '1.6',
  },
  billingToggleWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  billingToggle: {
    position: 'relative',
    display: 'inline-flex',
    backgroundColor: '#F1F5F9',
    borderRadius: '14px',
    padding: '6px',
    gap: '4px',
  },
  toggleButton: {
    position: 'relative',
    backgroundColor: 'transparent',
    color: '#64748B',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    color: '#0F172A',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  toggleSlider: {
    position: 'absolute',
    top: '6px',
    left: '6px',
    width: 'calc(33.33% - 4px)',
    height: 'calc(100% - 12px)',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease',
    zIndex: 0,
  },
  saveBadgeInline: {
    backgroundColor: '#059669',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  },
  
  // Pricing Section
  pricingSection: {
    padding: '0 24px 100px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
    marginBottom: '60px',
  },
  pricingCard: {
    backgroundColor: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '24px',
    padding: '40px',
    position: 'relative',
    transition: 'all 0.3s',
  },
  pricingCardPopular: {
    border: '2px solid #059669',
    boxShadow: '0 8px 40px rgba(44, 160, 28, 0.12)',
    transform: 'scale(1.02)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#059669',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '8px 20px',
    borderRadius: '100px',
    boxShadow: '0 4px 12px rgba(44, 160, 28, 0.3)',
  },
  planHeader: {
    marginBottom: '32px',
  },
  planName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 8px',
  },
  planDescription: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
    lineHeight: '1.5',
  },
  priceContainer: {
    marginBottom: '32px',
  },
  originalPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  strikethrough: {
    fontSize: '18px',
    color: '#94A3B8',
    textDecoration: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
  },
  priceCurrency: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    marginTop: '8px',
  },
  priceAmount: {
    fontSize: '64px',
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 1,
  },
  priceDetails: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '4px',
    marginTop: '12px',
  },
  pricePeriod: {
    fontSize: '16px',
    color: '#64748B',
    fontWeight: '500',
  },
  perLicense: {
    fontSize: '13px',
    color: '#94A3B8',
  },
  billedNote: {
    fontSize: '13px',
    color: '#64748B',
    marginTop: '12px',
  },
  ctaButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    border: 'none',
    padding: '18px 32px',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '32px',
  },
  ctaButtonPopular: {
    backgroundColor: '#059669',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(44, 160, 28, 0.3)',
  },
  featuresDivider: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  featuresDividerText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  featureIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#ECFDF5',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.5',
  },
  
  // Trust Section
  trustSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap',
    padding: '32px',
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  trustIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#ECFDF5',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '2px',
  },
  trustDesc: {
    fontSize: '13px',
    color: '#64748B',
  },
  
  // FAQ Section
  faqSection: {
    backgroundColor: '#F8FAFC',
    padding: '100px 24px',
  },
  faqContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  faqHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  faqBadge: {
    display: 'inline-block',
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontSize: '13px',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '100px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  faqTitle: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#0F172A',
    margin: '0 0 16px',
  },
  faqSubtitle: {
    fontSize: '18px',
    color: '#64748B',
    margin: 0,
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  faqItemOpen: {
    border: '1px solid #059669',
    boxShadow: '0 4px 16px rgba(44, 160, 28, 0.1)',
  },
  faqQuestion: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
  },
  faqQuestionText: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    paddingRight: '16px',
  },
  faqIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    transition: 'all 0.3s',
    flexShrink: 0,
  },
  faqAnswer: {
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
  },
  faqAnswerText: {
    fontSize: '15px',
    color: '#64748B',
    lineHeight: '1.7',
    margin: 0,
  },
  faqCta: {
    textAlign: 'center',
    marginTop: '48px',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  faqCtaText: {
    fontSize: '16px',
    color: '#64748B',
    margin: '0 0 16px',
  },
  faqCtaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0F172A',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  // CTA Section
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    overflow: 'hidden',
  },
  ctaSectionInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '60px',
  },
  ctaSectionContent: {
    flex: 1,
  },
  ctaSectionTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 20px',
    lineHeight: '1.2',
  },
  ctaSectionSubtitle: {
    fontSize: '18px',
    color: '#94A3B8',
    margin: '0 0 36px',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  ctaSectionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    padding: '18px 36px',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(44, 160, 28, 0.3)',
    transition: 'all 0.2s',
  },
  ctaSectionButtonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.2)',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ctaSectionGraphic: {
    flex: '0 0 auto',
  },
  ctaGraphicCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  ctaGraphicIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(44, 160, 28, 0.2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaGraphicText: {},
  ctaGraphicTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px',
  },
  ctaGraphicDesc: {
    fontSize: '14px',
    color: '#94A3B8',
  },
  
  // Footer
  footer: {
    backgroundColor: '#0F172A',
    color: '#fff',
    padding: '80px 24px 32px',
  },
  footerTop: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '60px',
    marginBottom: '60px',
    flexWrap: 'wrap',
  },
  footerBrand: {
    flex: '1',
    maxWidth: '300px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  footerLogoIcon: {
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
  },
  footerLogoSubtext: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#64748B',
  },
  footerBrandDesc: {
    fontSize: '14px',
    color: '#94A3B8',
    lineHeight: '1.7',
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap',
  },
  footerLinkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  footerLinkTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 4px',
  },
  footerLink: {
    fontSize: '14px',
    color: '#94A3B8',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '32px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  footerCopyright: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  footerSocial: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  footerSecure: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748B',
  },
};

// Add responsive styles via CSS
const responsiveCSS = `
  @media (max-width: 768px) {
    .hero-title { font-size: 36px !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .faq-grid { grid-template-columns: 1fr !important; }
    .cta-section-inner { flex-direction: column; text-align: center; }
    .footer-top { flex-direction: column; }
    .nav { display: none; }
    .header-right { display: none; }
    .mobile-menu-btn { display: block !important; }
    .mobile-menu { display: block !important; }
  }
`;
