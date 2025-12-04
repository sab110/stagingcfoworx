import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>RoyaltiesAgent</span>
          </div>
          <div style={styles.navLinks}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/about" style={{...styles.navLink, color: "#2CA01C"}}>About</a>
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
          <h1 style={styles.heroTitle}>About RoyaltiesAgent</h1>
          <p style={styles.heroSubtitle}>
            We're on a mission to simplify franchise financial management for business owners everywhere.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section style={styles.storySection}>
        <div style={styles.storyGrid}>
          <div style={styles.storyContent}>
            <h2 style={styles.storyTitle}>Our Story</h2>
            <p style={styles.storyText}>
              RoyaltiesAgent was born from a simple observation: franchise owners spend too much time 
              wrestling with spreadsheets and manual calculations instead of growing their business.
            </p>
            <p style={styles.storyText}>
              Founded by franchise operators who experienced these challenges firsthand, we built 
              the tool we wished existed. Today, RoyaltiesAgent helps hundreds of franchise owners 
              automate their royalty calculations and financial reporting.
            </p>
            <p style={styles.storyText}>
              Our platform seamlessly integrates with QuickBooks, eliminating data entry errors 
              and saving hours of manual work every week.
            </p>
          </div>
          <div style={styles.storyVisual}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>500+</div>
                <div style={styles.statLabel}>Active Users</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>2M+</div>
                <div style={styles.statLabel}>Reports Generated</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>99.9%</div>
                <div style={styles.statLabel}>Uptime</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>24/7</div>
                <div style={styles.statLabel}>Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={styles.valuesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Values</h2>
          <p style={styles.sectionSubtitle}>The principles that guide everything we do</p>
        </div>
        <div style={styles.valuesGrid}>
          <div style={styles.valueCard}>
            <div style={{...styles.valueIcon, background: '#ECFDF5'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 style={styles.valueTitle}>Simplicity First</h3>
            <p style={styles.valueDesc}>
              Complex problems deserve simple solutions. We obsess over making our platform 
              intuitive and easy to use.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={{...styles.valueIcon, background: '#EFF6FF'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h3 style={styles.valueTitle}>Customer Success</h3>
            <p style={styles.valueDesc}>
              Your success is our success. We're not happy until you're saving time and 
              getting accurate results.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={{...styles.valueIcon, background: '#FEE2E2'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style={styles.valueTitle}>Trust & Security</h3>
            <p style={styles.valueDesc}>
              We handle your financial data with the utmost care. Enterprise-grade security 
              is non-negotiable.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={{...styles.valueIcon, background: '#F5F3FF'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 style={styles.valueTitle}>Continuous Innovation</h3>
            <p style={styles.valueDesc}>
              We're always improving. Regular updates and new features based on user feedback.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join hundreds of franchise owners who trust RoyaltiesAgent.
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
            <a href="/privacy-policy" style={styles.footerLink}>Privacy Policy</a>
            <a href="/terms-of-service" style={styles.footerLink}>Terms of Service</a>
            <a href="/contact" style={styles.footerLink}>Contact Us</a>
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
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#fff",
    color: "#0F172A",
    minHeight: "100vh",
  },
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
    cursor: "pointer",
    textDecoration: "none",
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
  },
  hero: {
    padding: "160px 24px 80px",
    textAlign: "center",
    background: "linear-gradient(180deg, #F8FAFC 0%, #fff 100%)",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "20px",
    marginTop: 0,
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
  },
  storySection: {
    padding: "100px 24px",
    backgroundColor: "#F8FAFC",
  },
  storyGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },
  storyContent: {},
  storyTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "24px",
    marginTop: 0,
  },
  storyText: {
    fontSize: "16px",
    color: "#64748B",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid #E2E8F0",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#2CA01C",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748B",
  },
  valuesSection: {
    padding: "100px 24px",
    backgroundColor: "#fff",
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
    marginTop: 0,
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "#64748B",
    margin: 0,
  },
  valuesGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },
  valueCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: "16px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid #E2E8F0",
  },
  valueIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  valueTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  valueDesc: {
    fontSize: "14px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
  },
  ctaSection: {
    padding: "100px 24px",
    background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: "16px",
    marginTop: 0,
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "#047857",
    marginBottom: "32px",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    padding: "18px 36px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(44, 160, 28, 0.3)",
  },
  footer: {
    backgroundColor: "#fff",
    padding: "40px 24px 30px",
    borderTop: "1px solid #E2E8F0",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  footerBrand: {},
  footerTagline: {
    color: "#64748B",
    fontSize: "14px",
    marginTop: "8px",
  },
  footerLinks: {
    display: "flex",
    gap: "32px",
  },
  footerLink: {
    color: "#64748B",
    textDecoration: "none",
    fontSize: "14px",
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #E2E8F0",
    color: "#64748B",
    fontSize: "14px",
  },
};
