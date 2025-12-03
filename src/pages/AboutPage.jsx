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
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>CFO Worx</span>
          </div>
          <div style={styles.navLinks}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/about" style={{...styles.navLink, color: "#10b981"}}>About</a>
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
          <h1 style={styles.heroTitle}>About CFO Worx</h1>
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
              CFO Worx was born from a simple observation: franchise owners spend too much time 
              wrestling with spreadsheets and manual calculations instead of growing their business.
            </p>
            <p style={styles.storyText}>
              Founded by franchise operators who experienced these challenges firsthand, we built 
              the tool we wished existed. Today, CFO Worx helps hundreds of franchise owners 
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
            <div style={styles.valueIcon}>🎯</div>
            <h3 style={styles.valueTitle}>Simplicity First</h3>
            <p style={styles.valueDesc}>
              Complex problems deserve simple solutions. We obsess over making our platform 
              intuitive and easy to use.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🤝</div>
            <h3 style={styles.valueTitle}>Customer Success</h3>
            <p style={styles.valueDesc}>
              Your success is our success. We're not happy until you're saving time and 
              getting accurate results.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🔒</div>
            <h3 style={styles.valueTitle}>Trust & Security</h3>
            <p style={styles.valueDesc}>
              We handle your financial data with the utmost care. Enterprise-grade security 
              is non-negotiable.
            </p>
          </div>
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🚀</div>
            <h3 style={styles.valueTitle}>Continuous Innovation</h3>
            <p style={styles.valueDesc}>
              We're always improving. Regular updates and new features based on user feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.teamSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Leadership Team</h2>
          <p style={styles.sectionSubtitle}>Meet the people behind CFO Worx</p>
        </div>
        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👨‍💼</div>
            <h3 style={styles.teamName}>John Smith</h3>
            <p style={styles.teamRole}>CEO & Co-Founder</p>
            <p style={styles.teamBio}>Former franchise owner with 15+ years in the industry.</p>
          </div>
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👩‍💻</div>
            <h3 style={styles.teamName}>Sarah Johnson</h3>
            <p style={styles.teamRole}>CTO & Co-Founder</p>
            <p style={styles.teamBio}>Tech veteran with experience at Fortune 500 companies.</p>
          </div>
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👨‍🔬</div>
            <h3 style={styles.teamName}>Michael Chen</h3>
            <p style={styles.teamRole}>Head of Product</p>
            <p style={styles.teamBio}>Product leader passionate about user experience.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join hundreds of franchise owners who trust CFO Worx.
          </p>
          <button onClick={() => navigate("/login")} style={styles.ctaBtn}>
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
            <a href="/privacy-policy" style={styles.footerLink}>Privacy Policy</a>
            <a href="/terms-of-service" style={styles.footerLink}>Terms of Service</a>
            <a href="/contact" style={styles.footerLink}>Contact Us</a>
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
    cursor: "pointer",
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
  },
  hero: {
    padding: "160px 24px 80px",
    textAlign: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "52px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "24px",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  storySection: {
    padding: "100px 24px",
    backgroundColor: "#1e293b",
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
    color: "#fff",
    marginBottom: "24px",
  },
  storyText: {
    fontSize: "16px",
    color: "#94a3b8",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
  storyVisual: {},
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#0f172a",
    borderRadius: "16px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#10b981",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  valuesSection: {
    padding: "100px 24px",
    backgroundColor: "#0f172a",
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
  },
  valuesGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },
  valueCard: {
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  valueIcon: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  valueTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
  },
  valueDesc: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  teamSection: {
    padding: "100px 24px",
    backgroundColor: "#1e293b",
  },
  teamGrid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "32px",
  },
  teamCard: {
    backgroundColor: "#0f172a",
    borderRadius: "16px",
    padding: "40px 24px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  teamAvatar: {
    width: "80px",
    height: "80px",
    backgroundColor: "#1e293b",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    margin: "0 auto 20px",
  },
  teamName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px",
  },
  teamRole: {
    fontSize: "14px",
    color: "#10b981",
    marginBottom: "12px",
  },
  teamBio: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.5",
  },
  ctaSection: {
    padding: "100px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "16px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "32px",
  },
  ctaBtn: {
    backgroundColor: "#fff",
    color: "#059669",
    border: "none",
    padding: "18px 40px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "#0f172a",
    padding: "40px 24px 30px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
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
    color: "#64748b",
    fontSize: "14px",
    marginTop: "8px",
  },
  footerLinks: {
    display: "flex",
    gap: "32px",
  },
  footerLink: {
    color: "#64748b",
    textDecoration: "none",
    fontSize: "14px",
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    color: "#64748b",
    fontSize: "14px",
  },
};

