import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>RoyaltiesAgent</span>
          </div>
          <div style={styles.navLinks}>
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/pricing" style={styles.navLink}>Pricing</a>
            <a href="/contact" style={styles.navLink}>Contact</a>
            <button onClick={() => navigate("/login")} style={styles.loginBtn}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Trusted by 500+ Franchise Owners
          </div>
          <h1 style={styles.heroTitle}>
            Streamline Your
            <span style={styles.gradientText}> Royalty Management</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Automate royalty calculations, generate reports, and sync seamlessly with QuickBooks. 
            RoyaltiesAgent makes franchise financial management effortless.
          </p>
          <div style={styles.heroCta}>
            <button onClick={() => navigate("/login")} style={styles.primaryBtn}>
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={() => navigate("/pricing")} style={styles.secondaryBtn}>
              View Pricing
            </button>
          </div>
          <div style={styles.trustBadges}>
            <span style={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              No credit card required
            </span>
            <span style={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              14-day free trial
            </span>
            <span style={styles.trustItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.dashboardPreview}>
            <div style={styles.previewHeader}>
              <div style={styles.previewDots}>
                <span style={{...styles.dot, backgroundColor: "#ff5f56"}}></span>
                <span style={{...styles.dot, backgroundColor: "#ffbd2e"}}></span>
                <span style={{...styles.dot, backgroundColor: "#27ca40"}}></span>
              </div>
              <span style={styles.previewTitle}>Dashboard</span>
            </div>
            <div style={styles.previewContent}>
              <div style={styles.previewCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6"/>
                </svg>
                <div style={styles.previewCardLabel}>Total Royalties</div>
                <div style={styles.previewCardValue}>$124,500</div>
              </div>
              <div style={styles.previewCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                </svg>
                <div style={styles.previewCardLabel}>Active Franchises</div>
                <div style={styles.previewCardValue}>12</div>
              </div>
              <div style={styles.previewCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <div style={styles.previewCardLabel}>This Month</div>
                <div style={styles.previewCardValue}>+18.5%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything You Need</h2>
          <p style={styles.sectionSubtitle}>
            Powerful features to manage your franchise royalties efficiently
          </p>
        </div>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#ECFDF5'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>QuickBooks Integration</h3>
            <p style={styles.featureDesc}>
              Connect your QuickBooks account and automatically sync your financial data in real-time.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#EFF6FF'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>Automated Reports</h3>
            <p style={styles.featureDesc}>
              Generate detailed royalty reports with one click. Export to Excel or PDF format.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#F5F3FF'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>Multi-Franchise Support</h3>
            <p style={styles.featureDesc}>
              Manage multiple franchise locations from a single dashboard with ease.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#FEF3C7'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>Email Notifications</h3>
            <p style={styles.featureDesc}>
              Get notified about important events - reports, payments, and subscription updates.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#FEE2E2'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>Secure & Compliant</h3>
            <p style={styles.featureDesc}>
              Enterprise-grade security with encrypted data and secure OAuth connections.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#E0F2FE'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 style={styles.featureTitle}>Flexible Billing</h3>
            <p style={styles.featureDesc}>
              Choose monthly or annual plans. Pay only for the licenses you need.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Simplify Your Royalty Management?</h2>
          <p style={styles.ctaSubtitle}>
            Join hundreds of franchise owners who trust RoyaltiesAgent for their financial operations.
          </p>
          <button onClick={() => navigate("/login")} style={styles.ctaBtn}>
            Start Your Free Trial
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={styles.logoText}>RoyaltiesAgent</span>
            </div>
            <p style={styles.footerTagline}>Royalty Management Made Simple</p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerColTitle}>Product</h4>
              <a href="/pricing" style={styles.footerLink}>Pricing</a>
              <a href="/about" style={styles.footerLink}>Features</a>
            </div>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerColTitle}>Company</h4>
              <a href="/about" style={styles.footerLink}>About Us</a>
              <a href="/contact" style={styles.footerLink}>Contact</a>
            </div>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerColTitle}>Legal</h4>
              <a href="/privacy-policy" style={styles.footerLink}>Privacy Policy</a>
              <a href="/terms-of-service" style={styles.footerLink}>Terms of Service</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 RoyaltiesAgent by CFOWORX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#fff",
    color: "#0F172A",
    minHeight: "100vh",
  },
  
  // Navigation
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #E2E8F0",
    zIndex: 1000,
  },
  navContent: {
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
    gap: "12px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #2CA01C 0%, #1E7A14 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLink: {
    color: "#64748B",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  loginBtn: {
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  
  // Hero
  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "140px 24px 80px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },
  heroContent: {
    maxWidth: "540px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ECFDF5",
    color: "#065F46",
    padding: "8px 16px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "52px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#0F172A",
    marginBottom: "24px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #2CA01C 0%, #0EA5E9 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#64748B",
    lineHeight: "1.7",
    marginBottom: "32px",
  },
  heroCta: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
  },
  primaryBtn: {
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    padding: "16px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 14px rgba(44, 160, 28, 0.3)",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#0F172A",
    border: "1px solid #E2E8F0",
    padding: "16px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  trustBadges: {
    display: "flex",
    gap: "24px",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748B",
    fontSize: "14px",
  },
  heroVisual: {
    display: "flex",
    justifyContent: "center",
  },
  dashboardPreview: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "480px",
  },
  previewHeader: {
    backgroundColor: "#F8FAFC",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #E2E8F0",
  },
  previewDots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  previewTitle: {
    color: "#64748B",
    fontSize: "12px",
    fontWeight: "500",
  },
  previewContent: {
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  previewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #E2E8F0",
  },
  previewCardLabel: {
    color: "#64748B",
    fontSize: "11px",
    marginTop: "12px",
    marginBottom: "4px",
  },
  previewCardValue: {
    color: "#0F172A",
    fontSize: "18px",
    fontWeight: "700",
  },
  
  // Features
  features: {
    backgroundColor: "#F8FAFC",
    padding: "100px 24px",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 60px",
  },
  sectionTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "16px",
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "#64748B",
    lineHeight: "1.6",
  },
  featureGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "32px",
    border: "1px solid #E2E8F0",
    transition: "all 0.3s",
  },
  featureIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "12px",
  },
  featureDesc: {
    fontSize: "15px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
  },
  
  // CTA Section
  ctaSection: {
    padding: "100px 24px",
    background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
  },
  ctaContent: {
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: "20px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "#047857",
    marginBottom: "32px",
  },
  ctaBtn: {
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    padding: "18px 36px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(44, 160, 28, 0.3)",
  },
  
  // Footer
  footer: {
    backgroundColor: "#fff",
    borderTop: "1px solid #E2E8F0",
    padding: "60px 24px 30px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 3fr",
    gap: "60px",
    marginBottom: "40px",
  },
  footerBrand: {},
  footerTagline: {
    color: "#64748B",
    fontSize: "14px",
    marginTop: "12px",
  },
  footerLinks: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerColTitle: {
    color: "#0F172A",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#64748B",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s",
  },
  footerBottom: {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "30px",
    borderTop: "1px solid #E2E8F0",
    textAlign: "center",
    color: "#64748B",
    fontSize: "14px",
  },
};
