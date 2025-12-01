import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif",
      lineHeight: "1.6"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "2px solid #0077C5",
        paddingBottom: "20px",
        marginBottom: "30px"
      }}>
        <h1 style={{ color: "#393A3D", marginBottom: "10px" }}>Privacy Policy</h1>
        <p style={{ color: "#666", fontSize: "14px" }}>Last Updated: November 20, 2025</p>
      </div>

      {/* Content */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          1. Information We Collect
        </h2>
        <p style={{ color: "#393A3D", marginBottom: "15px" }}>
          We collect information you provide directly to us when you use our QuickBooks integration service,
          including:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Account information (name, email address)</li>
          <li>QuickBooks company data and financial information</li>
          <li>Usage data and analytics</li>
          <li>Payment and subscription information</li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          2. How We Use Your Information
        </h2>
        <p style={{ color: "#393A3D", marginBottom: "10px" }}>
          We use the information we collect to:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze trends, usage, and activities</li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          3. Information Sharing and Disclosure
        </h2>
        <p style={{ color: "#393A3D" }}>
          We do not share, sell, rent, or trade your personal information with third parties except as
          described in this privacy policy. We may share your information with:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Service providers who perform services on our behalf</li>
          <li>Professional advisors</li>
          <li>Law enforcement when required by law</li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          4. Data Security
        </h2>
        <p style={{ color: "#393A3D" }}>
          We implement appropriate technical and organizational security measures to protect your personal
          information. However, no method of transmission over the Internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          5. Your Rights
        </h2>
        <p style={{ color: "#393A3D" }}>
          You have the right to access, update, or delete your personal information. You may also have the
          right to restrict or object to certain processing of your data. To exercise these rights, please
          contact us at the email address below.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          6. QuickBooks Data
        </h2>
        <p style={{ color: "#393A3D" }}>
          We access your QuickBooks data solely to provide our services. We comply with Intuit's API Terms
          of Service and security requirements. Your QuickBooks data is encrypted in transit and at rest.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          7. Contact Us
        </h2>
        <p style={{ color: "#393A3D" }}>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p style={{ color: "#0077C5", fontWeight: "600" }}>
          support@yourcompany.com
        </p>
      </section>

      {/* Back Button */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#0077C5",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0062A3";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#0077C5";
          }}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

