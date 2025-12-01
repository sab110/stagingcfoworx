import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
        <h1 style={{ color: "#393A3D", marginBottom: "10px" }}>
          End-User License Agreement (EULA)
        </h1>
        <p style={{ color: "#666", fontSize: "14px" }}>Last Updated: November 20, 2025</p>
      </div>

      {/* Content */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          1. Agreement to Terms
        </h2>
        <p style={{ color: "#393A3D" }}>
          By accessing and using this QuickBooks integration service, you agree to be bound by these
          Terms of Service and all applicable laws and regulations. If you do not agree with any of these
          terms, you are prohibited from using this service.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          2. License Grant
        </h2>
        <p style={{ color: "#393A3D", marginBottom: "10px" }}>
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Access and use the service for your internal business purposes</li>
          <li>Connect your QuickBooks account to our platform</li>
          <li>Access features available under your subscription plan</li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          3. User Obligations
        </h2>
        <p style={{ color: "#393A3D", marginBottom: "10px" }}>
          You agree to:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Not attempt to reverse engineer or compromise the service</li>
          <li>Not use the service for any unlawful purpose</li>
        </ul>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          4. Subscription and Payment
        </h2>
        <p style={{ color: "#393A3D" }}>
          Our service is provided on a subscription basis. You agree to pay all fees associated with your
          chosen subscription plan. Fees are non-refundable except as required by law or as explicitly
          stated in our refund policy.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          5. QuickBooks Integration
        </h2>
        <p style={{ color: "#393A3D", marginBottom: "10px" }}>
          By connecting your QuickBooks account, you authorize us to:
        </p>
        <ul style={{ color: "#393A3D", marginLeft: "20px" }}>
          <li>Access your QuickBooks data as necessary to provide the service</li>
          <li>Store and process your QuickBooks data securely</li>
          <li>Perform actions on your behalf within QuickBooks as instructed by you</li>
        </ul>
        <p style={{ color: "#393A3D", marginTop: "15px" }}>
          You remain responsible for the accuracy and legality of your QuickBooks data.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          6. Intellectual Property
        </h2>
        <p style={{ color: "#393A3D" }}>
          The service, including all content, features, and functionality, is owned by us and is protected
          by copyright, trademark, and other intellectual property laws. You may not copy, modify,
          distribute, or create derivative works without our express written permission.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          7. Limitation of Liability
        </h2>
        <p style={{ color: "#393A3D" }}>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of or relating to your use of the service.
          Our total liability shall not exceed the amount you paid for the service in the 12 months
          preceding the claim.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          8. Termination
        </h2>
        <p style={{ color: "#393A3D" }}>
          We may terminate or suspend your access to the service immediately, without prior notice, for
          any reason, including breach of these Terms. Upon termination, your right to use the service
          will immediately cease.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          9. Changes to Terms
        </h2>
        <p style={{ color: "#393A3D" }}>
          We reserve the right to modify these Terms at any time. We will notify you of any material
          changes by posting the new Terms on this page and updating the "Last Updated" date.
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0077C5", fontSize: "22px", marginBottom: "15px" }}>
          10. Contact Information
        </h2>
        <p style={{ color: "#393A3D" }}>
          For questions about these Terms, please contact us at:
        </p>
        <p style={{ color: "#0077C5", fontWeight: "600" }}>
          legal@yourcompany.com
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

