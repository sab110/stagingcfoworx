import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${backendURL}/api/admin/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.detail || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: "Email",
      value: "support@cfoworx.com",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ),
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: "Business Hours",
      value: "Mon - Fri: 9AM - 6PM PST",
    },
  ];

  const faqs = [
    {
      question: "How do I connect my QuickBooks account?",
      answer: "Simply click 'Connect QuickBooks' from your dashboard and follow the secure OAuth flow. Your credentials are never stored on our servers.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use bank-level encryption (AES-256) and never store your QuickBooks credentials. All data is transmitted over secure HTTPS connections.",
    },
    {
      question: "Do you offer custom plans?",
      answer: "Yes! Contact us for enterprise pricing if you have more than 50 franchise locations or need custom features.",
    },
  ];

  return (
    <div className="contact-page">
      <style>{styles}</style>

      {/* Navigation */}
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="logo-text-wrap">
              <span className="logo-text">RoyaltiesAgent</span>
              <span className="logo-subtext">by CFOWORX</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/contact" className="nav-link active">Contact</Link>
          </nav>

          <div className="nav-actions">
            <button onClick={() => navigate("/login")} className="btn-secondary">Sign In</button>
            <button onClick={() => navigate("/login")} className="btn-primary">Get Started</button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/about" className="mobile-nav-link">About</Link>
            <Link to="/pricing" className="mobile-nav-link">Pricing</Link>
            <Link to="/contact" className="mobile-nav-link active">Contact</Link>
            <div className="mobile-menu-actions">
              <button onClick={() => navigate("/login")} className="btn-secondary w-full">Sign In</button>
              <button onClick={() => navigate("/login")} className="btn-primary w-full">Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="section-badge">Contact Us</span>
          <h1 className="hero-title">Get in Touch</h1>
          <p className="hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <h2 className="info-title">Contact Information</h2>
            <p className="info-subtitle">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="info-items">
              {contactInfo.map((item, i) => (
                <div key={i} className="info-item">
                  <div className="info-icon">{item.icon}</div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    <div className="info-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-visual">
              <div className="visual-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>We're here to help</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="success-title">Message Sent!</h3>
                <p className="success-text">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-reset">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="form-error">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="form-input"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <div className="select-wrapper">
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="form-select"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                    <svg className="select-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="form-textarea"
                    placeholder="How can we help you?"
                    rows={5}
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-header">
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to common questions</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${expandedFaq === i ? 'faq-item-open' : ''}`}>
                <button className="faq-question-btn" onClick={() => toggleFaq(i)}>
                  <span className="faq-question-text">{faq.question}</span>
                  <div className={`faq-icon ${expandedFaq === i ? 'faq-icon-open' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </button>
                <div className={`faq-answer ${expandedFaq === i ? 'faq-answer-open' : ''}`}>
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="logo-text-wrap">
                  <span className="logo-text">RoyaltiesAgent</span>
                  <span className="logo-subtext">by CFOWORX</span>
                </div>
              </Link>
              <p className="footer-brand-desc">
                Automated royalty reporting for franchise businesses.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-link-group">
                <h4 className="footer-link-title">Product</h4>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/about" className="footer-link">Features</Link>
              </div>
              <div className="footer-link-group">
                <h4 className="footer-link-title">Legal</h4>
                <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
                <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} RoyaltiesAgent by CFOWORX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = `
  .contact-page {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #0F172A;
    background: #fff;
  }

  /* Navigation */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease;
  }

  .nav-scrolled {
    background: rgba(255, 255, 255, 0.95);
    border-bottom-color: #E2E8F0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
  }

  .logo-text-wrap { display: flex; flex-direction: column; }
  .logo-text { font-size: 20px; font-weight: 700; color: #0F172A; line-height: 1.2; }
  .logo-subtext { font-size: 11px; font-weight: 500; color: #64748B; }

  .nav-links { display: flex; gap: 8px; }

  .nav-link {
    color: #475569;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .nav-link:hover { color: #0F172A; background: #F1F5F9; }
  .nav-link.active { color: #059669; background: #ECFDF5; }

  .nav-actions { display: flex; gap: 12px; }

  .btn-secondary {
    background: transparent;
    color: #475569;
    border: 1px solid #E2E8F0;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover { background: #F8FAFC; border-color: #CBD5E1; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    padding: 8px;
    color: #0F172A;
    cursor: pointer;
  }

  .mobile-menu {
    padding: 16px 24px 24px;
    border-top: 1px solid #E2E8F0;
  }

  .mobile-nav-link {
    display: block;
    padding: 14px 0;
    color: #475569;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #F1F5F9;
  }

  .mobile-nav-link.active { color: #059669; }

  .mobile-menu-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .w-full { width: 100%; justify-content: center; }

  /* Hero */
  .hero {
    padding: 180px 32px 100px;
    text-align: center;
    position: relative;
    background: linear-gradient(180deg, #F8FAFC 0%, #fff 100%);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% -20%, rgba(5, 150, 105, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
  }

  .section-badge {
    display: inline-block;
    background: #ECFDF5;
    color: #065F46;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
    border: 1px solid #A7F3D0;
  }

  .hero-title {
    font-size: 52px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 20px;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .hero-subtitle {
    font-size: 18px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  /* Contact Section */
  .contact-section {
    padding: 80px 32px 120px;
  }

  .contact-container {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
  }

  .contact-info {
    padding: 40px;
    background: #F8FAFC;
    border-radius: 24px;
    border: 1px solid #E2E8F0;
    height: fit-content;
  }

  .info-title {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .info-subtitle {
    font-size: 15px;
    color: #64748B;
    margin: 0 0 36px;
    line-height: 1.6;
  }

  .info-items {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 36px;
  }

  .info-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .info-icon {
    width: 52px;
    height: 52px;
    background: #ECFDF5;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #059669;
    flex-shrink: 0;
  }

  .info-label {
    font-size: 13px;
    color: #64748B;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 15px;
    color: #0F172A;
    font-weight: 600;
    line-height: 1.5;
  }

  .info-visual { margin-top: 12px; }

  .visual-card {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: #fff;
    font-weight: 600;
  }

  /* Contact Form */
  .contact-form-card {
    background: #fff;
    border-radius: 24px;
    padding: 48px;
    border: 1px solid #E2E8F0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #0F172A;
    margin-bottom: 8px;
  }

  .form-error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 12px;
    color: #DC2626;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 16px 20px;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    color: #0F172A;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    background: #fff;
  }

  .select-wrapper {
    position: relative;
  }

  .form-select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    padding-right: 48px;
  }

  .select-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748B;
    pointer-events: none;
  }

  .form-textarea { resize: vertical; min-height: 140px; }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .btn-submit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);
    transition: all 0.2s ease;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(5, 150, 105, 0.4);
  }

  /* Success Message */
  .success-message {
    text-align: center;
    padding: 40px 20px;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
  }

  .success-title {
    font-size: 28px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .success-text {
    font-size: 16px;
    color: #64748B;
    margin: 0 0 28px;
    line-height: 1.6;
  }

  .btn-reset {
    padding: 14px 28px;
    background: #F1F5F9;
    color: #475569;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-reset:hover {
    background: #E2E8F0;
  }

  /* FAQ Section */
  .faq-section {
    padding: 100px 32px;
    background: #F8FAFC;
  }

  .faq-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 60px;
  }

  .section-title {
    font-size: 40px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .section-subtitle {
    font-size: 18px;
    color: #64748B;
    margin: 0;
    line-height: 1.6;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq-item {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .faq-item-open {
    border-color: #059669;
    box-shadow: 0 8px 24px rgba(5, 150, 105, 0.1);
    background: linear-gradient(135deg, #ECFDF5 0%, #fff 100%);
  }

  .faq-question-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .faq-question-text {
    font-size: 17px;
    font-weight: 600;
    color: #0F172A;
    flex: 1;
    padding-right: 20px;
    line-height: 1.4;
  }

  .faq-icon {
    width: 36px;
    height: 36px;
    background: #F1F5F9;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .faq-icon-open {
    transform: rotate(180deg);
    background: #ECFDF5;
    color: #059669;
  }

  .faq-answer {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    padding: 0 28px;
  }

  .faq-answer-open {
    max-height: 300px;
    opacity: 1;
    padding: 0 28px 28px;
  }

  .faq-answer-text {
    font-size: 15px;
    color: #64748B;
    line-height: 1.8;
    margin: 0;
  }

  /* Footer */
  .footer {
    background: #0F172A;
    color: #fff;
    padding: 60px 32px 32px;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    gap: 60px;
    margin-bottom: 40px;
  }

  .footer-brand { max-width: 320px; }
  .footer-brand .logo { margin-bottom: 16px; }
  .footer-brand .logo-icon { background: linear-gradient(135deg, #059669 0%, #047857 100%); }
  .footer-brand .logo-text { color: #fff; }
  .footer-brand .logo-subtext { color: #64748B; }

  .footer-brand-desc {
    font-size: 14px;
    color: #94A3B8;
    line-height: 1.6;
    margin: 0;
  }

  .footer-links { display: flex; gap: 60px; }

  .footer-link-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .footer-link-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 4px;
  }

  .footer-link {
    font-size: 14px;
    color: #94A3B8;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-link:hover { color: #fff; }

  .footer-bottom {
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-copyright {
    font-size: 14px;
    color: #64748B;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .contact-container { grid-template-columns: 1fr; }
    .faq-list { max-width: 700px; margin: 0 auto; }
  }

  @media (max-width: 768px) {
    .nav-links, .nav-actions { display: none; }
    .mobile-menu-btn { display: block; }
    .hero-title { font-size: 36px; }
    .section-title { font-size: 32px; }
    .form-row { grid-template-columns: 1fr; }
    .footer-top { flex-direction: column; gap: 40px; }
  }
`;
