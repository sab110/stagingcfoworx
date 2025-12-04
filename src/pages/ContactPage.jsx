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
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

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
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/pricing" style={styles.navLink}>Pricing</a>
            <a href="/contact" style={{...styles.navLink, color: "#2CA01C"}}>Contact</a>
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
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div style={styles.infoLabel}>Email</div>
                  <div style={styles.infoValue}>support@cfoworx.com</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style={styles.infoLabel}>Phone</div>
                  <div style={styles.infoValue}>+1 (555) 123-4567</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <div style={styles.infoLabel}>Office</div>
                  <div style={styles.infoValue}>123 Business Ave, Suite 100<br />San Francisco, CA 94102</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2CA01C" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div style={styles.infoLabel}>Business Hours</div>
                  <div style={styles.infoValue}>Mon - Fri: 9AM - 6PM PST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={styles.formCard}>
            {submitted ? (
              <div style={styles.successMessage}>
                <div style={styles.successIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={styles.successTitle}>Message Sent!</h3>
                <p style={styles.successText}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} style={styles.resetBtn}>
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
                  Send Message
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
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
    padding: "160px 24px 60px",
    textAlign: "center",
    background: "linear-gradient(180deg, #F8FAFC 0%, #fff 100%)",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "16px",
    marginTop: 0,
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#64748B",
    maxWidth: "600px",
    margin: "0 auto",
  },
  contactSection: {
    padding: "80px 24px",
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
    backgroundColor: "#F8FAFC",
    borderRadius: "20px",
    border: "1px solid #E2E8F0",
  },
  infoTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  infoSubtitle: {
    fontSize: "15px",
    color: "#64748B",
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
    backgroundColor: "#ECFDF5",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: "13px",
    color: "#64748B",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "15px",
    color: "#0F172A",
    lineHeight: "1.5",
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    color: "#0F172A",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    color: "#0F172A",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    color: "#0F172A",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 4px 14px rgba(44, 160, 28, 0.3)",
  },
  successMessage: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#2CA01C",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 4px 20px rgba(44, 160, 28, 0.3)",
  },
  successTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  successText: {
    fontSize: "16px",
    color: "#64748B",
    marginBottom: "32px",
  },
  resetBtn: {
    padding: "14px 28px",
    backgroundColor: "#F1F5F9",
    color: "#475569",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  faqSection: {
    padding: "100px 24px",
    backgroundColor: "#F8FAFC",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 60px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748B",
    margin: 0,
  },
  faqGrid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid #E2E8F0",
  },
  faqQuestion: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  faqAnswer: {
    fontSize: "14px",
    color: "#64748B",
    lineHeight: "1.6",
    margin: 0,
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
