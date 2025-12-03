import React, { useEffect, useState } from "react";
import ProfileWidget from "../components/ProfileWidget";

export default function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const token = localStorage.getItem("access_token");
  const realmId = localStorage.getItem("realm_id");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !realmId) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendURL}/api/quickbooks/qbo-user/${realmId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        if (data.email) localStorage.setItem("user_email", data.email);
        setUser(data);
        await fetchSelectedLicenses();
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Unable to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectedLicenses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/licenses/company/${realmId}/selected`);
        if (response.ok) {
          const data = await response.json();
          setLicenses(data.licenses || []);
        }
      } catch (err) {
        console.error("Error fetching licenses:", err);
      }
    };

    const fetchSubscription = async () => {
      try {
        const response = await fetch(`${backendURL}/api/subscriptions/company/${realmId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status !== "no_subscription") {
            setSubscription(data);
          }
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    };

    fetchUserData();
    fetchSubscription();
  }, [backendURL, token, realmId]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("realm_id");
    localStorage.removeItem("user_email");
    window.location.href = "/";
  };

  const handleManageBilling = async () => {
    if (!subscription || !subscription.stripe_customer_id) {
      alert("No subscription found. Please subscribe first.");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/stripe/create-customer-portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: subscription.stripe_customer_id })
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal");
      }
    } catch (err) {
      console.error("Error opening billing portal:", err);
      alert("Error opening billing portal");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h2 style={styles.errorTitle}>Something went wrong</h2>
        <p style={styles.errorText}>{error}</p>
        <button onClick={() => window.location.href = "/login"} style={styles.errorBtn}>
          Back to Login
        </button>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "licenses", icon: "🏢", label: "Franchises" },
    { id: "reports", icon: "📋", label: "Reports" },
    { id: "billing", icon: "💳", label: "Billing" },
    { id: "submissions", icon: "📤", label: "Submissions" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>⚡</div>
            <span style={styles.logoText}>CFO Worx</span>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navItem,
                ...(activeSection === item.id ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.quickbooksStatus}>
            <span style={styles.statusDot}></span>
            <span style={styles.statusText}>QuickBooks Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.pageTitle}>
              {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
            </h1>
            {user?.company_name && (
              <span style={styles.companyBadge}>{user.company_name}</span>
            )}
          </div>
          <ProfileWidget user={user} onLogout={handleLogout} />
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {activeSection === "overview" && (
            <OverviewSection 
              user={user} 
              licenses={licenses} 
              subscription={subscription}
              onManageBilling={handleManageBilling}
            />
          )}
          {activeSection === "licenses" && (
            <LicensesSection licenses={licenses} />
          )}
          {activeSection === "reports" && (
            <ReportsSection />
          )}
          {activeSection === "billing" && (
            <BillingSection 
              subscription={subscription} 
              onManageBilling={handleManageBilling}
            />
          )}
          {activeSection === "submissions" && (
            <SubmissionsSection />
          )}
        </div>
      </main>
    </div>
  );
}

// Overview Section Component
function OverviewSection({ user, licenses, subscription, onManageBilling }) {
  return (
    <div>
      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <h2 style={styles.welcomeTitle}>
            👋 Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
          </h2>
          <p style={styles.welcomeSubtitle}>
            Here's what's happening with your franchises today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏢</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{licenses.length}</div>
            <div style={styles.statLabel}>Active Franchises</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💳</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>
              {subscription?.status === "active" ? "Active" : "Inactive"}
            </div>
            <div style={styles.statLabel}>Subscription Status</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{subscription?.quantity || 0}</div>
            <div style={styles.statLabel}>Licensed Seats</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>
              {subscription?.end_date 
                ? new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "N/A"}
            </div>
            <div style={styles.statLabel}>Next Billing</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
      </div>
      <div style={styles.actionsGrid}>
        <button onClick={() => window.location.href = "/franchises"} style={styles.actionCard}>
          <span style={styles.actionIcon}>🏢</span>
          <span style={styles.actionLabel}>Manage Franchises</span>
        </button>
        <button style={styles.actionCard}>
          <span style={styles.actionIcon}>📋</span>
          <span style={styles.actionLabel}>Generate Report</span>
        </button>
        <button onClick={onManageBilling} style={styles.actionCard}>
          <span style={styles.actionIcon}>💳</span>
          <span style={styles.actionLabel}>Manage Billing</span>
        </button>
        <button style={styles.actionCard}>
          <span style={styles.actionIcon}>📤</span>
          <span style={styles.actionLabel}>New Submission</span>
        </button>
      </div>

      {/* Recent Franchises */}
      {licenses.length > 0 && (
        <>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Your Franchises</h3>
            <button 
              onClick={() => window.location.href = "/franchises"} 
              style={styles.viewAllBtn}
            >
              View All →
            </button>
          </div>
          <div style={styles.franchiseGrid}>
            {licenses.slice(0, 6).map((license) => (
              <div key={license.franchise_number} style={styles.franchiseCard}>
                <div style={styles.franchiseHeader}>
                  <span style={styles.franchiseNumber}>#{license.franchise_number}</span>
                  <span style={styles.franchiseStatus}>Active</span>
                </div>
                <div style={styles.franchiseName}>{license.name}</div>
                <div style={styles.franchiseLocation}>
                  📍 {license.city}, {license.state}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Licenses Section Component
function LicensesSection({ licenses }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Franchise Management</h3>
        <button 
          onClick={() => window.location.href = "/franchises"} 
          style={styles.primaryBtn}
        >
          + Add / Remove Franchises
        </button>
      </div>

      {licenses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏢</div>
          <h3 style={styles.emptyTitle}>No franchises yet</h3>
          <p style={styles.emptyText}>Add your first franchise to get started</p>
          <button 
            onClick={() => window.location.href = "/franchises"} 
            style={styles.emptyBtn}
          >
            Add Franchises
          </button>
        </div>
      ) : (
        <div style={styles.licensesTable}>
          <div style={styles.tableHeader}>
            <span style={styles.tableCol}>Franchise #</span>
            <span style={styles.tableCol}>Name</span>
            <span style={styles.tableCol}>Location</span>
            <span style={styles.tableCol}>Department</span>
            <span style={styles.tableCol}>Status</span>
          </div>
          {licenses.map((license) => (
            <div key={license.franchise_number} style={styles.tableRow}>
              <span style={styles.tableCol}>
                <strong>#{license.franchise_number}</strong>
              </span>
              <span style={styles.tableCol}>{license.name}</span>
              <span style={styles.tableCol}>{license.city}, {license.state}</span>
              <span style={styles.tableCol}>{license.quickbooks?.department_name || "N/A"}</span>
              <span style={styles.tableCol}>
                <span style={styles.statusBadge}>Active</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reports Section Component
function ReportsSection() {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Reports</h3>
        <button style={styles.primaryBtn}>+ Generate New Report</button>
      </div>

      <div style={styles.reportsGrid}>
        <div style={styles.reportTypeCard}>
          <div style={styles.reportIcon}>📊</div>
          <h4 style={styles.reportTitle}>Royalty Volume Calculation</h4>
          <p style={styles.reportDesc}>Calculate royalties based on sales volume</p>
          <button style={styles.reportBtn}>Generate →</button>
        </div>
        <div style={styles.reportTypeCard}>
          <div style={styles.reportIcon}>📈</div>
          <h4 style={styles.reportTitle}>Sales Summary</h4>
          <p style={styles.reportDesc}>Monthly sales breakdown by franchise</p>
          <button style={styles.reportBtn}>Generate →</button>
        </div>
        <div style={styles.reportTypeCard}>
          <div style={styles.reportIcon}>📋</div>
          <h4 style={styles.reportTitle}>Compliance Report</h4>
          <p style={styles.reportDesc}>Franchise compliance and audit report</p>
          <button style={styles.reportBtn}>Generate →</button>
        </div>
      </div>

      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Recent Reports</h3>
      </div>
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📋</div>
        <h3 style={styles.emptyTitle}>No reports yet</h3>
        <p style={styles.emptyText}>Generate your first report to see it here</p>
      </div>
    </div>
  );
}

// Billing Section Component
function BillingSection({ subscription, onManageBilling }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Billing & Subscription</h3>
      </div>

      {subscription ? (
        <div style={styles.billingGrid}>
          <div style={styles.billingCard}>
            <h4 style={styles.billingCardTitle}>Current Plan</h4>
            <div style={styles.planInfo}>
              <div style={styles.planName}>
                {subscription.plan?.name || "Standard"} Plan
              </div>
              <div style={styles.planCycle}>
                {subscription.plan?.billing_cycle || "Monthly"}
              </div>
            </div>
            <div style={styles.planPrice}>
              {subscription.plan?.price || "$39/mo"} × {subscription.quantity || 1} license(s)
            </div>
            <div style={styles.planStatus}>
              Status: <span style={{
                color: subscription.status === "active" ? "#10b981" : "#f59e0b"
              }}>{subscription.status?.toUpperCase()}</span>
            </div>
          </div>

          <div style={styles.billingCard}>
            <h4 style={styles.billingCardTitle}>Billing Details</h4>
            <div style={styles.billingItem}>
              <span>Next billing date</span>
              <span style={styles.billingValue}>
                {subscription.end_date 
                  ? new Date(subscription.end_date).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div style={styles.billingItem}>
              <span>Total licenses</span>
              <span style={styles.billingValue}>{subscription.quantity || 1}</span>
            </div>
            <button onClick={onManageBilling} style={styles.manageBillingBtn}>
              Manage Billing →
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💳</div>
          <h3 style={styles.emptyTitle}>No active subscription</h3>
          <p style={styles.emptyText}>Subscribe to access all features</p>
          <button 
            onClick={() => window.location.href = "/subscribe"} 
            style={styles.emptyBtn}
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
}

// Submissions Section Component
function SubmissionsSection() {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Submissions</h3>
        <button style={styles.primaryBtn}>+ New Submission</button>
      </div>

      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📤</div>
        <h3 style={styles.emptyTitle}>No submissions yet</h3>
        <p style={styles.emptyText}>Submit your first royalty report to see it here</p>
        <button style={styles.emptyBtn}>Create Submission</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  // Sidebar
  sidebar: {
    width: "260px",
    backgroundColor: "#0f172a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
  },
  sidebarHeader: {
    padding: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
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
    fontSize: "20px",
    fontWeight: "700",
  },
  sidebarNav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
  },
  navItemActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
  },
  navIcon: {
    fontSize: "18px",
  },
  navLabel: {},
  sidebarFooter: {
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  quickbooksStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#64748b",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
  },
  statusText: {},
  // Main
  main: {
    flex: 1,
    marginLeft: "260px",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    backgroundColor: "#fff",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  companyBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
  },
  content: {
    padding: "32px",
    flex: 1,
  },
  // Welcome Banner
  welcomeBanner: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "32px",
    color: "#fff",
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  welcomeSubtitle: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  statIcon: {
    width: "52px",
    height: "52px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  statInfo: {},
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "2px",
  },
  // Section Header
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  viewAllBtn: {
    color: "#2563eb",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  primaryBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  // Actions Grid
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  actionIcon: {
    fontSize: "28px",
  },
  actionLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  // Franchise Grid
  franchiseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  franchiseCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
  },
  franchiseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  franchiseNumber: {
    fontWeight: "700",
    color: "#2563eb",
    fontSize: "14px",
  },
  franchiseStatus: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  franchiseName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "8px",
  },
  franchiseLocation: {
    fontSize: "13px",
    color: "#64748b",
  },
  // Tables
  licensesTable: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr 0.8fr",
    padding: "16px 20px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr 0.8fr",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
    alignItems: "center",
  },
  tableCol: {},
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  // Reports
  reportsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  reportTypeCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  },
  reportIcon: {
    fontSize: "36px",
    marginBottom: "16px",
  },
  reportTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  reportDesc: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "16px",
  },
  reportBtn: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  // Billing
  billingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  billingCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "28px",
    border: "1px solid #e2e8f0",
  },
  billingCardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 20px 0",
  },
  planInfo: {
    marginBottom: "16px",
  },
  planName: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
  },
  planCycle: {
    fontSize: "14px",
    color: "#64748b",
  },
  planPrice: {
    fontSize: "16px",
    color: "#334155",
    marginBottom: "12px",
  },
  planStatus: {
    fontSize: "14px",
    color: "#64748b",
  },
  billingItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#64748b",
  },
  billingValue: {
    fontWeight: "600",
    color: "#1e293b",
  },
  manageBillingBtn: {
    marginTop: "20px",
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  // Empty State
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "60px 40px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 24px 0",
  },
  emptyBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  // Loading & Error States
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "15px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "20px",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  errorText: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "24px",
  },
  errorBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

// Add spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
