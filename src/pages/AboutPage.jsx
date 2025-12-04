import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: "500+", label: "Active Users" },
    { value: "2M+", label: "Reports Generated" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const values = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/>
        </svg>
      ),
      title: "Simplicity First",
      description: "Complex problems deserve simple solutions. We obsess over making our platform intuitive and easy to use.",
      color: "#059669",
      bgColor: "#ECFDF5",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      title: "Customer Success",
      description: "Your success is our success. We're not happy until you're saving time and getting accurate results.",
      color: "#0EA5E9",
      bgColor: "#EFF6FF",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Trust & Security",
      description: "We handle your financial data with the utmost care. Enterprise-grade security is non-negotiable.",
      color: "#EF4444",
      bgColor: "#FEF2F2",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      title: "Continuous Innovation",
      description: "We're always improving. Regular updates and new features based on user feedback.",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
    },
  ];

  const team = [
    { name: "Franchise Owners", description: "Built by people who understand franchise operations" },
    { name: "Finance Experts", description: "Deep expertise in royalty calculations and reporting" },
    { name: "Tech Innovators", description: "Modern solutions with seamless integrations" },
  ];

  return (
    <div className="about-page">
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
            <Link to="/about" className="nav-link active">About</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
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
            <Link to="/about" className="mobile-nav-link active">About</Link>
            <Link to="/pricing" className="mobile-nav-link">Pricing</Link>
            <Link to="/contact" className="mobile-nav-link">Contact</Link>
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
          <span className="section-badge">About Us</span>
          <h1 className="hero-title">We're Building the Future of Franchise Financial Management</h1>
          <p className="hero-subtitle">
            RoyaltiesAgent was created to simplify the complex world of franchise royalty calculations and reporting.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <span className="section-badge">Our Story</span>
            <h2 className="section-title">From Frustration to Innovation</h2>
            <p className="story-text">
              RoyaltiesAgent was born from a simple observation: franchise owners spend too much time 
              wrestling with spreadsheets and manual calculations instead of growing their business.
            </p>
            <p className="story-text">
              Founded by franchise operators who experienced these challenges firsthand, we built 
              the tool we wished existed. Today, RoyaltiesAgent helps hundreds of franchise owners 
              automate their royalty calculations and financial reporting.
            </p>
            <p className="story-text">
              Our platform seamlessly integrates with QuickBooks, eliminating data entry errors 
              and saving hours of manual work every week.
            </p>
          </div>
          <div className="story-visual">
            <div className="visual-card">
              <div className="visual-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="visual-title">Mission-Driven</h3>
              <p className="visual-desc">
                We're committed to making franchise financial management accessible and efficient for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="section-header">
            <span className="section-badge">Our Values</span>
            <h2 className="section-title">The Principles That Guide Us</h2>
            <p className="section-subtitle">
              Everything we build is guided by these core values
            </p>
          </div>
          
          <div className="values-grid">
            {values.map((value, i) => (
              <div key={i} className="value-card">
                <div className="value-icon" style={{ backgroundColor: value.bgColor, color: value.color }}>
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <div className="section-header">
            <span className="section-badge">Our Team</span>
            <h2 className="section-title">Built by Experts, For Experts</h2>
            <p className="section-subtitle">
              A diverse team united by a common goal
            </p>
          </div>

          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-desc">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Simplify Your Royalty Management?</h2>
          <p className="cta-subtitle">
            Join hundreds of franchise owners who trust RoyaltiesAgent.
          </p>
          <div className="cta-actions">
            <button onClick={() => navigate("/login")} className="btn-cta-primary">
              Get Started Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={() => navigate("/contact")} className="btn-cta-secondary">Contact Sales</button>
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
  .about-page {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #0F172A;
    background: #fff;
  }

  /* Navigation - Same as HomePage */
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

  .logo-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    line-height: 1.2;
  }

  .logo-subtext {
    font-size: 11px;
    font-weight: 500;
    color: #64748B;
  }

  .nav-links {
    display: flex;
    gap: 8px;
  }

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

  .nav-actions {
    display: flex;
    gap: 12px;
  }

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
    max-width: 800px;
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
    margin: 0 0 24px;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .hero-subtitle {
    font-size: 20px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  /* Stats */
  .stats-section {
    background: #0F172A;
    padding: 60px 32px;
  }

  .stats-container {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }

  .stat-item { text-align: center; }

  .stat-value {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 15px;
    color: #94A3B8;
    font-weight: 500;
  }

  /* Story Section */
  .story-section {
    padding: 120px 32px;
  }

  .story-container {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .story-content {}

  .section-title {
    font-size: 40px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 24px;
    letter-spacing: -0.01em;
  }

  .story-text {
    font-size: 16px;
    color: #64748B;
    line-height: 1.8;
    margin: 0 0 20px;
  }

  .story-visual {
    display: flex;
    justify-content: center;
  }

  .visual-card {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border-radius: 24px;
    padding: 48px;
    text-align: center;
    max-width: 360px;
    box-shadow: 0 20px 60px rgba(5, 150, 105, 0.2);
  }

  .visual-icon {
    width: 96px;
    height: 96px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  .visual-icon svg { stroke: #fff; }

  .visual-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
  }

  .visual-desc {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    margin: 0;
  }

  /* Values Section */
  .values-section {
    padding: 120px 32px;
    background: #F8FAFC;
  }

  .values-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 60px;
  }

  .section-subtitle {
    font-size: 18px;
    color: #64748B;
    margin: 0;
    line-height: 1.6;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .value-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    text-align: center;
    border: 1px solid #E2E8F0;
    transition: all 0.3s ease;
  }

  .value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    border-color: transparent;
  }

  .value-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .value-title {
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .value-desc {
    font-size: 14px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  /* Team Section */
  .team-section {
    padding: 120px 32px;
  }

  .team-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .team-card {
    background: linear-gradient(135deg, #F8FAFC 0%, #fff 100%);
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    border: 1px solid #E2E8F0;
  }

  .team-name {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .team-desc {
    font-size: 15px;
    color: #64748B;
    line-height: 1.5;
    margin: 0;
  }

  /* CTA Section */
  .cta-section {
    padding: 100px 32px;
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    text-align: center;
  }

  .cta-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: 40px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 16px;
  }

  .cta-subtitle {
    font-size: 18px;
    color: #94A3B8;
    margin: 0 0 36px;
  }

  .cta-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .btn-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #fff;
    border: none;
    padding: 18px 36px;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
    transition: all 0.2s ease;
  }

  .btn-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(5, 150, 105, 0.4);
  }

  .btn-cta-secondary {
    background: transparent;
    color: #fff;
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 16px 32px;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
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

  .footer-brand {
    max-width: 320px;
  }

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

  .footer-links {
    display: flex;
    gap: 60px;
  }

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
    .story-container { grid-template-columns: 1fr; gap: 60px; }
    .values-grid { grid-template-columns: repeat(2, 1fr); }
    .team-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .nav-links, .nav-actions { display: none; }
    .mobile-menu-btn { display: block; }
    .hero-title { font-size: 36px; }
    .section-title { font-size: 32px; }
    .stats-container { grid-template-columns: repeat(2, 1fr); }
    .stat-value { font-size: 36px; }
    .values-grid { grid-template-columns: 1fr; }
    .footer-top { flex-direction: column; gap: 40px; }
    .cta-title { font-size: 28px; }
    .cta-actions { flex-direction: column; }
  }
`;
