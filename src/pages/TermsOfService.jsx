import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Agreement to Terms",
      content: `By accessing and using RoyaltiesAgent, a product of CFOWORX, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.`,
    },
    {
      title: "2. License Grant",
      content: `Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:`,
      list: [
        "Access and use the service for your internal business purposes",
        "Connect your QuickBooks Online account to our platform",
        "Generate and export royalty reports for your franchise operations",
        "Access features available under your subscription plan",
      ],
    },
    {
      title: "3. User Obligations",
      content: `As a user of our service, you agree to:`,
      list: [
        "Provide accurate and complete information during registration",
        "Maintain the security of your account credentials",
        "Comply with all applicable laws and regulations",
        "Not attempt to reverse engineer or compromise the service",
        "Not use the service for any unlawful purpose",
        "Not share your account access with unauthorized users",
      ],
    },
    {
      title: "4. Subscription and Payment",
      content: `Our service is provided on a subscription basis billed per active franchise location. You agree to pay all fees associated with your chosen subscription plan. Fees are calculated based on the number of active franchises at the time of billing.`,
      list: [
        "Billing occurs monthly, semi-annually, or annually based on your plan",
        "Fees are non-refundable except as required by law",
        "You may cancel your subscription at any time through the billing portal",
        "Subscription changes take effect at the next billing cycle",
      ],
    },
    {
      title: "5. QuickBooks Integration",
      content: `By connecting your QuickBooks Online account, you authorize us to:`,
      list: [
        "Access your QuickBooks financial data as necessary to provide the service",
        "Read company information, classes, departments, and sales reports",
        "Store and process your QuickBooks data securely on our servers",
        "Generate royalty reports based on your QuickBooks data",
      ],
      note: "You remain responsible for the accuracy and legality of your QuickBooks data. We do not modify your QuickBooks records.",
    },
    {
      title: "6. Data Security",
      content: `We implement industry-standard security measures to protect your data:`,
      list: [
        "All data is encrypted in transit using TLS 1.3",
        "Data at rest is encrypted using AES-256 encryption",
        "Access tokens are securely stored and refreshed automatically",
        "We comply with SOC 2 Type II requirements",
      ],
    },
    {
      title: "7. Intellectual Property",
      content: `The service, including all content, features, and functionality, is owned by CFOWORX and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `To the maximum extent permitted by law, CFOWORX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service. Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.`,
    },
    {
      title: "9. Termination",
      content: `We may terminate or suspend your access to the service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination:`,
      list: [
        "Your right to use the service will immediately cease",
        "You may export your data within 30 days of termination",
        "Any outstanding fees remain payable",
        "QuickBooks connection will be revoked",
      ],
    },
    {
      title: "10. Changes to Terms",
      content: `We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the service after such modifications constitutes acceptance of the updated Terms.`,
    },
    {
      title: "11. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Cook County, Illinois.`,
    },
    {
      title: "12. Contact Information",
      content: `For questions about these Terms of Service, please contact us:`,
      contact: {
        email: "legal@cfoworx.com",
        address: "CFOWORX LLC, Chicago, IL",
      },
    },
  ];

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>RoyaltiesAgent</span>
          </Link>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <div style={styles.heroContent}>
          <span style={styles.badge}>Legal</span>
          <h1 style={styles.heroTitle}>Terms of Service</h1>
          <p style={styles.heroSubtitle}>
            Please read these terms carefully before using RoyaltiesAgent
          </p>
          <div style={styles.lastUpdated}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Last Updated: December 1, 2025
          </div>
        </div>
      </section>

      {/* Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          {/* Table of Contents */}
          <nav style={styles.toc}>
            <h3 style={styles.tocTitle}>Contents</h3>
            <ul style={styles.tocList}>
              {sections.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} style={styles.tocLink}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div style={styles.content}>
            {sections.map((section, i) => (
              <section key={i} id={`section-${i}`} style={styles.section}>
                <h2 style={styles.sectionTitle}>{section.title}</h2>
                <p style={styles.sectionText}>{section.content}</p>
                {section.list && (
                  <ul style={styles.list}>
                    {section.list.map((item, j) => (
                      <li key={j} style={styles.listItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <div style={styles.note}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    {section.note}
                  </div>
                )}
                {section.contact && (
                  <div style={styles.contactBox}>
                    <div style={styles.contactItem}>
                      <span style={styles.contactLabel}>Email</span>
                      <a href={`mailto:${section.contact.email}`} style={styles.contactValue}>{section.contact.email}</a>
                    </div>
                    <div style={styles.contactItem}>
                      <span style={styles.contactLabel}>Address</span>
                      <span style={styles.contactValue}>{section.contact.address}</span>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p style={styles.footerText}>© {new Date().getFullYear()} RoyaltiesAgent by CFOWORX. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link to="/privacy-policy" style={styles.footerLink}>Privacy Policy</Link>
            <Link to="/contact" style={styles.footerLink}>Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0F172A',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    color: '#475569',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  hero: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    padding: '80px 32px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  heroContent: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 24px',
  },
  lastUpdated: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  main: {
    padding: '60px 32px',
  },
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: 48,
  },
  toc: {
    position: 'sticky',
    top: 100,
    height: 'fit-content',
  },
  tocTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 16,
  },
  tocList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tocLink: {
    display: 'block',
    padding: '8px 12px',
    color: '#475569',
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: 8,
    transition: 'all 0.15s',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
  },
  section: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    border: '1px solid #E2E8F0',
    animation: 'fadeIn 0.5s ease',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 16,
    marginTop: 0,
  },
  sectionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 1.7,
    margin: 0,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    fontSize: 15,
    color: '#475569',
    lineHeight: 1.6,
  },
  note: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '16px 20px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 12,
    marginTop: 20,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 1.6,
  },
  contactBox: {
    marginTop: 20,
    padding: 24,
    background: '#F8FAFC',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contactValue: {
    fontSize: 15,
    fontWeight: 500,
    color: '#0F172A',
    textDecoration: 'none',
  },
  footer: {
    background: '#0F172A',
    padding: '32px',
  },
  footerInner: {
    maxWidth: 1000,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    gap: 24,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
    textDecoration: 'none',
  },
};
