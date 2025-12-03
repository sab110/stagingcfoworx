import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

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
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/pricing" style={styles.navLink}>Pricing</a>
            <a href="/contact" style={{...styles.navLink, color: "#10b981"}}>Contact</a>
            <button onClick={() => navigate("/login")} style={styles.loginBtn}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Get in Touch</h1>
        <p style={styles.heroSubtitle}>
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Contact Section */}
      <section style={styles.contactSection}>
        <div style={styles.contactGrid}>
          {/* Contact Info */}
          <div style={styles.contactInfo}>
            <h2 style={styles.infoTitle}>Contact Information</h2>
            <p style={styles.infoSubtitle}>
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div style={styles.infoItems}>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>📧</div>
                <div>
                  <div style={styles.infoLabel}>Email</div>
                  <div style={styles.infoValue}>support@cfoworx.com</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>📞</div>
                <div>
                  <div style={styles.infoLabel}>Phone</div>
                  <div style={styles.infoValue}>+1 (555) 123-4567</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>📍</div>
                <div>
                  <div style={styles.infoLabel}>Office</div>
                  <div style={styles.infoValue}>123 Business Ave, Suite 100<br />San Francisco, CA 94102</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>🕐</div>
                <div>
                  <div style={styles.infoLabel}>Business Hours</div>
                  <div style={styles.infoValue}>Mon - Fri: 9AM - 6PM PST</div>
                </div>
              </div>
            </div>

            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>Twitter</a>
              <a href="#" style={styles.socialLink}>LinkedIn</a>
              <a href="#" style={styles.socialLink}>Facebook</a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={styles.formCard}>
            {submitted ? (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>✅</div>
                <h3 style={styles.successTitle}>Message Sent!</h3>
                <p style={styles.successText}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  style={styles.resetBtn}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                    placeholder="John Doe"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={styles.input}
                    placeholder="john@example.com"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    style={styles.select}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    style={styles.textarea}
                    placeholder="How can we help you?"
                    rows={5}
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p style={styles.sectionSubtitle}>Quick answers to common questions</p>
        </div>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>How do I connect my QuickBooks account?</h3>
            <p style={styles.faqAnswer}>
              Simply click "Connect QuickBooks" from your dashboard and follow the secure OAuth flow. 
              Your credentials are never stored on our servers.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>Can I cancel my subscription anytime?</h3>
            <p style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time from your dashboard. 
              You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>Is my financial data secure?</h3>
            <p style={styles.faqAnswer}>
              Absolutely. We use bank-level encryption (AES-256) and never store your QuickBooks 
              credentials. All data is transmitted over secure HTTPS connections.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>Do you offer custom plans for large franchises?</h3>
            <p style={styles.faqAnswer}>
              Yes! Contact us for enterprise pricing if you have more than 50 franchise locations 
              or need custom features.
            </p>
          </div>
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
    padding: "160px 24px 60px",
    textAlign: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "16px",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    maxWidth: "600px",
    margin: "0 auto",
  },
  contactSection: {
    padding: "80px 24px",
    backgroundColor: "#1e293b",
  },
  contactGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "60px",
  },
  contactInfo: {
    padding: "40px",
    backgroundColor: "#0f172a",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  infoTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
  },
  infoSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  infoItems: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  infoItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  infoIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "15px",
    color: "#e2e8f0",
    lineHeight: "1.5",
  },
  socialLinks: {
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "20px",
  },
  socialLink: {
    color: "#10b981",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "#0f172a",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#1e293b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#1e293b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#1e293b",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  successMessage: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  successTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px",
  },
  successText: {
    fontSize: "16px",
    color: "#94a3b8",
    marginBottom: "32px",
  },
  resetBtn: {
    padding: "14px 28px",
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  faqSection: {
    padding: "100px 24px",
    backgroundColor: "#0f172a",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 60px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "12px",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#94a3b8",
  },
  faqGrid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  faqItem: {
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  faqQuestion: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "12px",
  },
  faqAnswer: {
    fontSize: "14px",
    color: "#94a3b8",
    lineHeight: "1.6",
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

