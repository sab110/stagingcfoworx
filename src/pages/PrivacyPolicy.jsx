import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us when you use RoyaltiesAgent. This includes:`,
      list: [
        "Account information (name, email address, company name)",
        "QuickBooks company data including sales reports, classes, and departments",
        "Franchise and license information you configure",
        "Payment and subscription details processed through Stripe",
        "Usage data and analytics to improve our service",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to provide, maintain, and improve our services:`,
      list: [
        "Generate accurate royalty reports from your QuickBooks data",
        "Process transactions and manage your subscription",
        "Send service-related notices and support communications",
        "Respond to your questions and requests",
        "Monitor and analyze usage trends to improve user experience",
        "Detect and prevent fraudulent or unauthorized activity",
      ],
    },
    {
      title: "3. QuickBooks Data Access",
      content: `When you connect your QuickBooks Online account, we access only the data necessary to provide our services:`,
      list: [
        "Company information and profile details",
        "Class/Category sales data for royalty calculations",
        "Department information for franchise mapping",
        "Sales transaction summaries (not individual transactions)",
      ],
      important: "We never access, store, or process sensitive financial data like bank account numbers, credit card information, or individual customer payment details from QuickBooks.",
    },
    {
      title: "4. Information Sharing",
      content: `We do not sell, rent, or trade your personal information. We may share your information only in these circumstances:`,
      list: [
        "With Stripe for secure payment processing",
        "With Microsoft Azure for secure data storage",
        "With service providers who assist in operating our platform",
        "When required by law or to protect our legal rights",
        "With your explicit consent",
      ],
    },
    {
      title: "5. Data Security",
      content: `We implement robust security measures to protect your data:`,
      list: [
        "All data encrypted in transit using TLS 1.3 encryption",
        "Data at rest encrypted using AES-256 encryption",
        "OAuth 2.0 for secure QuickBooks authentication",
        "Automatic token refresh without storing passwords",
        "Regular security audits and vulnerability assessments",
        "SOC 2 Type II compliant infrastructure",
      ],
    },
    {
      title: "6. Data Retention",
      content: `We retain your data for as long as your account is active or as needed to provide services:`,
      list: [
        "Account data retained while your subscription is active",
        "Generated reports stored for 2 years for your access",
        "QuickBooks tokens refreshed automatically, old tokens deleted",
        "Data deleted within 30 days of account closure upon request",
      ],
    },
    {
      title: "7. Your Rights",
      content: `You have the following rights regarding your personal information:`,
      list: [
        "Access: Request a copy of the data we hold about you",
        "Correction: Update or correct inaccurate information",
        "Deletion: Request deletion of your personal data",
        "Portability: Export your data in a standard format",
        "Objection: Object to certain processing activities",
        "Restriction: Request limited processing of your data",
      ],
      note: "To exercise these rights, contact us at privacy@cfoworx.com. We will respond within 30 days.",
    },
    {
      title: "8. Cookies and Tracking",
      content: `We use essential cookies and similar technologies to:`,
      list: [
        "Maintain your authenticated session",
        "Remember your preferences and settings",
        "Understand how you use our service",
        "Improve performance and user experience",
      ],
      note: "We do not use cookies for advertising purposes or sell cookie data to third parties.",
    },
    {
      title: "9. Third-Party Services",
      content: `Our service integrates with the following third-party services:`,
      services: [
        { name: "QuickBooks Online (Intuit)", purpose: "Financial data access for royalty calculations" },
        { name: "Stripe", purpose: "Secure payment processing" },
        { name: "Microsoft Azure", purpose: "Cloud hosting and data storage" },
      ],
      note: "Each third-party service has its own privacy policy governing their data practices.",
    },
    {
      title: "10. Children's Privacy",
      content: `RoyaltiesAgent is a business service and is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`,
    },
    {
      title: "11. International Data Transfers",
      content: `Your data may be processed in the United States where our servers are located. By using our service, you consent to the transfer of your data to the United States. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.`,
    },
    {
      title: "12. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by:`,
      list: [
        "Posting the updated policy on our website",
        "Sending an email notification to your registered address",
        "Displaying a notice in the application dashboard",
      ],
      note: "Your continued use of the service after changes indicates acceptance of the updated policy.",
    },
    {
      title: "13. Contact Us",
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:`,
      contact: {
        email: "privacy@cfoworx.com",
        dpo: "Data Protection Officer, CFOWORX",
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
          <span style={styles.badge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Privacy
          </span>
          <h1 style={styles.heroTitle}>Privacy Policy</h1>
          <p style={styles.heroSubtitle}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
          </p>
          <div style={styles.lastUpdated}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Last Updated: December 1, 2025
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={styles.trustSection}>
        <div style={styles.trustInner}>
          <div style={styles.trustBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div style={styles.trustBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>SOC 2 Compliant</span>
          </div>
          <div style={styles.trustBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Data Encrypted</span>
          </div>
          <div style={styles.trustBadge}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>99.9% Uptime</span>
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
                {section.services && (
                  <div style={styles.servicesGrid}>
                    {section.services.map((service, j) => (
                      <div key={j} style={styles.serviceCard}>
                        <span style={styles.serviceName}>{service.name}</span>
                        <span style={styles.servicePurpose}>{service.purpose}</span>
                      </div>
                    ))}
                  </div>
                )}
                {section.important && (
                  <div style={styles.important}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <div>
                      <strong>Important:</strong> {section.important}
                    </div>
                  </div>
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
                      <span style={styles.contactLabel}>Data Protection Officer</span>
                      <span style={styles.contactValue}>{section.contact.dpo}</span>
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
            <Link to="/terms-of-service" style={styles.footerLink}>Terms of Service</Link>
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
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    padding: '80px 32px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  heroContent: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: 'rgba(5, 150, 105, 0.2)',
    borderRadius: 100,
    color: '#34D399',
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
    color: 'rgba(255,255,255,0.7)',
    margin: '0 0 24px',
    lineHeight: 1.6,
  },
  lastUpdated: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  trustSection: {
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    padding: '24px 32px',
  },
  trustInner: {
    maxWidth: 1000,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    flexWrap: 'wrap',
  },
  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#475569',
    fontSize: 14,
    fontWeight: 500,
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
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginTop: 20,
  },
  serviceCard: {
    padding: '16px 20px',
    background: '#F8FAFC',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0F172A',
  },
  servicePurpose: {
    fontSize: 13,
    color: '#64748B',
  },
  important: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '16px 20px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 12,
    marginTop: 20,
    fontSize: 14,
    color: '#991B1B',
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
