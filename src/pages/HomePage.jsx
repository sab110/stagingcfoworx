import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      ),
      title: "QuickBooks Integration",
      description: "Seamlessly connect your QuickBooks account with secure OAuth authentication. Real-time data synchronization.",
      color: "#059669",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: "Automated Reports",
      description: "Generate ILRM, RVCR, and payment summary reports automatically. Export to Excel or PDF with one click.",
      color: "#0EA5E9",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
        </svg>
      ),
      title: "Multi-Franchise Support",
      description: "Manage unlimited franchise locations from a single dashboard. Track each location's performance independently.",
      color: "#8B5CF6",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
      ),
      title: "Smart Notifications",
      description: "Get instant alerts for important events - report generation, payment updates, and system notifications.",
      color: "#F59E0B",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Enterprise Security",
      description: "Bank-level AES-256 encryption for all data. SOC 2 compliant infrastructure with 99.9% uptime guarantee.",
      color: "#EF4444",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      title: "Flexible Billing",
      description: "Pay only for active franchises. Monthly, semi-annual, or annual billing options with transparent pricing.",
      color: "#06B6D4",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Users" },
    { value: "2M+", label: "Reports Generated" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="home-page">
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
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="nav-actions">
            <button onClick={() => navigate("/login")} className="btn-secondary">
              Sign In
            </button>
            <button onClick={() => navigate("/login")} className="btn-primary">
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
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

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/about" className="mobile-nav-link">About</Link>
          <Link to="/pricing" className="mobile-nav-link">Pricing</Link>
          <Link to="/contact" className="mobile-nav-link">Contact</Link>
          <div className="mobile-menu-actions">
            <button onClick={() => navigate("/login")} className="btn-secondary w-full">Sign In</button>
            <button onClick={() => navigate("/login")} className="btn-primary w-full">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot"></span>
            Trusted by 500+ Franchise Owners
          </div>
          
          <h1 className="hero-title animate-fade-in stagger-1">
            Streamline Your
            <span className="text-gradient"> Royalty Management</span>
          </h1>
          
          <p className="hero-subtitle animate-fade-in stagger-2">
            Automate royalty calculations, generate comprehensive reports, and sync seamlessly with QuickBooks. 
            RoyaltiesAgent makes franchise financial management effortless.
          </p>
          
          <div className="hero-cta animate-fade-in stagger-3">
            <button onClick={() => navigate("/login")} className="btn-hero-primary">
              Start Free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={() => navigate("/pricing")} className="btn-hero-secondary">
              View Pricing
            </button>
          </div>
          
          <div className="hero-trust animate-fade-in stagger-4">
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-fade-in stagger-5">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="preview-title">Dashboard Overview</span>
            </div>
            <div className="preview-content">
              <div className="preview-stat">
                <div className="preview-stat-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 20V10M12 20V4M6 20v-6"/>
                  </svg>
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">$124,500</span>
                  <span className="preview-stat-label">Total Royalties</span>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                  </svg>
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">12</span>
                  <span className="preview-stat-label">Active Franchises</span>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  </svg>
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">+18.5%</span>
                  <span className="preview-stat-label">This Month</span>
                </div>
              </div>
            </div>
          </div>
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

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Powerful tools designed to streamline your franchise royalty management
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="how-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Get Started in Minutes</h2>
            <p className="section-subtitle">
              Simple setup process to get your franchise royalties automated
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect QuickBooks</h3>
              <p className="step-desc">
                Securely link your QuickBooks account with our OAuth integration. No passwords stored.
              </p>
            </div>
            <div className="step-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Select Franchises</h3>
              <p className="step-desc">
                Choose which franchise locations to track. Easily manage active and inactive locations.
              </p>
            </div>
            <div className="step-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Automate Reports</h3>
              <p className="step-desc">
                Generate comprehensive royalty reports automatically. Export and share with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Simplify Your Royalty Management?</h2>
            <p className="cta-subtitle">
              Join hundreds of franchise owners who trust RoyaltiesAgent for their financial operations.
            </p>
            <div className="cta-actions">
              <button onClick={() => navigate("/login")} className="btn-cta-primary">
                Get Started Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={() => navigate("/contact")} className="btn-cta-secondary">
                Contact Sales
              </button>
            </div>
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
                Automated royalty reporting for franchise businesses. Seamlessly integrated with QuickBooks.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-link-group">
                <h4 className="footer-link-title">Product</h4>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/about" className="footer-link">Features</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
              </div>
              <div className="footer-link-group">
                <h4 className="footer-link-title">Company</h4>
                <Link to="/about" className="footer-link">About Us</Link>
                <a href="https://cfoworx.com" target="_blank" rel="noopener noreferrer" className="footer-link">CFOWORX</a>
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
            <div className="footer-secure">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = `
  .home-page {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #0F172A;
    background: #fff;
    overflow-x: hidden;
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
    -webkit-backdrop-filter: blur(20px);
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
    letter-spacing: 0.3px;
  }

  .nav-links {
    display: flex;
    align-items: center;
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

  .nav-link:hover {
    color: #0F172A;
    background: #F1F5F9;
  }

  .nav-link.active {
    color: #059669;
    background: #ECFDF5;
  }

  .nav-actions {
    display: flex;
    align-items: center;
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

  .btn-secondary:hover {
    background: #F8FAFC;
    border-color: #CBD5E1;
  }

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
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);
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
    display: none;
    padding: 16px 24px 24px;
    border-top: 1px solid #E2E8F0;
  }

  .mobile-menu.open {
    display: block;
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

  .mobile-menu-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }

  .w-full {
    width: 100%;
    justify-content: center;
  }

  /* Hero Section */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 32px 80px;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-gradient {
    position: absolute;
    top: -50%;
    right: -30%;
    width: 100%;
    height: 150%;
    background: radial-gradient(ellipse at center, rgba(5, 150, 105, 0.08) 0%, transparent 60%);
  }

  .hero-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(#E2E8F0 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.5;
  }

  .hero-content {
    position: relative;
    max-width: 600px;
    z-index: 1;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ECFDF5;
    color: #065F46;
    padding: 10px 18px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 28px;
    border: 1px solid #A7F3D0;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #059669;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .hero-title {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.1;
    color: #0F172A;
    margin: 0 0 24px;
    letter-spacing: -0.02em;
  }

  .text-gradient {
    background: linear-gradient(135deg, #059669 0%, #0EA5E9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 18px;
    color: #64748B;
    line-height: 1.7;
    margin: 0 0 36px;
  }

  .hero-cta {
    display: flex;
    gap: 16px;
    margin-bottom: 40px;
  }

  .btn-hero-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #fff;
    border: none;
    padding: 18px 32px;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
  }

  .btn-hero-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(5, 150, 105, 0.4);
  }

  .btn-hero-secondary {
    background: #fff;
    color: #0F172A;
    border: 2px solid #E2E8F0;
    padding: 16px 28px;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-hero-secondary:hover {
    background: #F8FAFC;
    border-color: #CBD5E1;
  }

  .hero-trust {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748B;
    font-size: 14px;
    font-weight: 500;
  }

  .hero-visual {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  .dashboard-preview {
    width: 500px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #F8FAFC;
    border-bottom: 1px solid #E2E8F0;
  }

  .preview-dots {
    display: flex;
    gap: 6px;
  }

  .preview-dots .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .preview-dots .red { background: #FF5F56; }
  .preview-dots .yellow { background: #FFBD2E; }
  .preview-dots .green { background: #27CA40; }

  .preview-title {
    font-size: 13px;
    font-weight: 500;
    color: #64748B;
  }

  .preview-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .preview-stat {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #F8FAFC;
    border-radius: 14px;
    border: 1px solid #E2E8F0;
  }

  .preview-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-stat-icon.green {
    background: #ECFDF5;
    color: #059669;
  }

  .preview-stat-icon.blue {
    background: #EFF6FF;
    color: #3B82F6;
  }

  .preview-stat-icon.purple {
    background: #F5F3FF;
    color: #8B5CF6;
  }

  .preview-stat-info {
    display: flex;
    flex-direction: column;
  }

  .preview-stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #0F172A;
  }

  .preview-stat-label {
    font-size: 13px;
    color: #64748B;
  }

  /* Stats Section */
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

  .stat-item {
    text-align: center;
  }

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

  /* Features Section */
  .features-section {
    padding: 120px 32px;
    background: #F8FAFC;
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 60px;
  }

  .section-badge {
    display: inline-block;
    background: #EFF6FF;
    color: #1D4ED8;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 42px;
    font-weight: 800;
    color: #0F172A;
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }

  .section-subtitle {
    font-size: 18px;
    color: #64748B;
    margin: 0;
    line-height: 1.6;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .feature-card {
    background: #fff;
    border-radius: 20px;
    padding: 36px;
    border: 1px solid #E2E8F0;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    border-color: transparent;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .feature-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .feature-desc {
    font-size: 15px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  /* How It Works */
  .how-section {
    padding: 120px 32px;
    background: #fff;
  }

  .how-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .steps-grid {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 24px;
  }

  .step-card {
    flex: 1;
    max-width: 280px;
    text-align: center;
    padding: 32px 24px;
  }

  .step-number {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: #fff;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 800;
    margin: 0 auto 24px;
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.25);
  }

  .step-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin: 0 0 12px;
  }

  .step-desc {
    font-size: 15px;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
  }

  .step-connector {
    display: flex;
    align-items: center;
    padding-top: 40px;
    color: #CBD5E1;
  }

  /* CTA Section */
  .cta-section {
    padding: 100px 32px;
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  }

  .cta-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-title {
    font-size: 40px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 20px;
    letter-spacing: -0.01em;
  }

  .cta-subtitle {
    font-size: 18px;
    color: #94A3B8;
    margin: 0 0 40px;
    line-height: 1.6;
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
    padding: 80px 32px 32px;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    gap: 60px;
    margin-bottom: 60px;
  }

  .footer-brand {
    max-width: 320px;
  }

  .footer-brand .logo {
    margin-bottom: 20px;
  }

  .footer-brand .logo-icon {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  .footer-brand .logo-text {
    color: #fff;
  }

  .footer-brand .logo-subtext {
    color: #64748B;
  }

  .footer-brand-desc {
    font-size: 14px;
    color: #94A3B8;
    line-height: 1.7;
    margin: 0;
  }

  .footer-links {
    display: flex;
    gap: 80px;
  }

  .footer-link-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .footer-link-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 8px;
  }

  .footer-link {
    font-size: 14px;
    color: #94A3B8;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-link:hover {
    color: #fff;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-copyright {
    font-size: 14px;
    color: #64748B;
    margin: 0;
  }

  .footer-secure {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #64748B;
  }

  /* Animations */
  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
  }

  .stagger-1 { animation-delay: 100ms; }
  .stagger-2 { animation-delay: 200ms; }
  .stagger-3 { animation-delay: 300ms; }
  .stagger-4 { animation-delay: 400ms; }
  .stagger-5 { animation-delay: 500ms; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .hero-visual {
      display: none;
    }

    .hero-content {
      max-width: 100%;
      text-align: center;
    }

    .hero {
      justify-content: center;
    }

    .hero-cta {
      justify-content: center;
    }

    .hero-trust {
      justify-content: center;
    }

    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .steps-grid {
      flex-direction: column;
      align-items: center;
    }

    .step-connector {
      transform: rotate(90deg);
      padding: 0;
      margin: 16px 0;
    }
  }

  @media (max-width: 768px) {
    .nav-links,
    .nav-actions {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }

    .hero-title {
      font-size: 36px;
    }

    .hero {
      padding: 100px 20px 60px;
      min-height: auto;
    }

    .hero-cta {
      flex-direction: column;
    }

    .btn-hero-primary,
    .btn-hero-secondary {
      width: 100%;
      justify-content: center;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .stats-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }

    .stat-value {
      font-size: 36px;
    }

    .section-title {
      font-size: 32px;
    }

    .footer-top {
      flex-direction: column;
      gap: 40px;
    }

    .footer-links {
      flex-wrap: wrap;
      gap: 40px;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .cta-title {
      font-size: 28px;
    }

    .cta-actions {
      flex-direction: column;
    }
  }
`;
