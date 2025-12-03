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
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>CFO Worx</span>
          </div>
          <div style={styles.navLinks}>
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/pricing" style={styles.navLink}>Pricing</a>
            <a href="/contact" style={styles.navLink}>Contact</a>
            <button 
              onClick={() => navigate("/login")} 
              style={styles.loginBtn}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>🚀 Trusted by 500+ Franchise Owners</div>
          <h1 style={styles.heroTitle}>
            Streamline Your
            <span style={styles.gradientText}> Royalty Management</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Automate royalty calculations, generate reports, and sync seamlessly with QuickBooks. 
            CFO Worx makes franchise financial management effortless.
          </p>
          <div style={styles.heroCta}>
            <button 
              onClick={() => navigate("/login")} 
              style={styles.primaryBtn}
            >
              Get Started Free →
            </button>
            <button 
              onClick={() => navigate("/pricing")} 
              style={styles.secondaryBtn}
            >
              View Pricing
            </button>
          </div>
          <div style={styles.trustBadges}>
            <span style={styles.trustItem}>✓ No credit card required</span>
            <span style={styles.trustItem}>✓ 14-day free trial</span>
            <span style={styles.trustItem}>✓ Cancel anytime</span>
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
              <span style={styles.previewTitle}>Dashboard Preview</span>
            </div>
            <div style={styles.previewContent}>
              <div style={styles.previewCard}>
                <div style={styles.previewCardIcon}>📊</div>
                <div style={styles.previewCardLabel}>Total Royalties</div>
                <div style={styles.previewCardValue}>$124,500</div>
              </div>
              <div style={styles.previewCard}>
                <div style={styles.previewCardIcon}>🏢</div>
                <div style={styles.previewCardLabel}>Active Franchises</div>
                <div style={styles.previewCardValue}>12</div>
              </div>
              <div style={styles.previewCard}>
                <div style={styles.previewCardIcon}>📈</div>
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
            <div style={styles.featureIcon}>🔗</div>
            <h3 style={styles.featureTitle}>QuickBooks Integration</h3>
            <p style={styles.featureDesc}>
              Connect your QuickBooks account and automatically sync your financial data in real-time.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Automated Reports</h3>
            <p style={styles.featureDesc}>
              Generate detailed royalty reports with one click. Export to Excel or PDF format.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏢</div>
            <h3 style={styles.featureTitle}>Multi-Franchise Support</h3>
            <p style={styles.featureDesc}>
              Manage multiple franchise locations from a single dashboard with ease.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔔</div>
            <h3 style={styles.featureTitle}>Email Notifications</h3>
            <p style={styles.featureDesc}>
              Get notified about important events - reports, payments, and subscription updates.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Secure & Compliant</h3>
            <p style={styles.featureDesc}>
              Enterprise-grade security with encrypted data and secure OAuth connections.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💳</div>
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
            Join hundreds of franchise owners who trust CFO Worx for their financial operations.
          </p>
          <button 
            onClick={() => navigate("/login")} 
            style={styles.ctaBtn}
          >
            Start Your Free Trial →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>⚡</div>
              <span style={styles.logoText}>CFO Worx</span>
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
          <p>© 2024 CFO Worx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    minHeight: "100vh",
  },
  // Navigation
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
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
    gap: "10px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
  },
  navLinks: {
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
  loginBtn: {
    backgroundColor: "#10b981",
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
    display: "inline-block",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
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
    color: "#fff",
    marginBottom: "24px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    lineHeight: "1.7",
    marginBottom: "32px",
  },
  heroCta: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  primaryBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "16px 32px",
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
    color: "#64748b",
    fontSize: "14px",
  },
  heroVisual: {
    display: "flex",
    justifyContent: "center",
  },
  dashboardPreview: {
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    width: "100%",
    maxWidth: "480px",
  },
  previewHeader: {
    backgroundColor: "#0f172a",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
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
    color: "#64748b",
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
    backgroundColor: "#0f172a",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
  },
  previewCardIcon: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  previewCardLabel: {
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "4px",
  },
  previewCardValue: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "700",
  },
  // Features
  features: {
    backgroundColor: "#1e293b",
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
    color: "#fff",
    marginBottom: "16px",
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "#94a3b8",
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
    backgroundColor: "#0f172a",
    borderRadius: "16px",
    padding: "32px",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
  },
  featureDesc: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  // CTA Section
  ctaSection: {
    padding: "100px 24px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  ctaContent: {
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "20px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    marginBottom: "32px",
  },
  ctaBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "18px 40px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 30px rgba(16, 185, 129, 0.4)",
  },
  // Footer
  footer: {
    backgroundColor: "#0f172a",
    borderTop: "1px solid rgba(255,255,255,0.1)",
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
    color: "#64748b",
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
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.2s",
  },
  footerBottom: {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "30px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
};

