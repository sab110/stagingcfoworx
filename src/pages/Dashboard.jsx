import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileWidget from "../components/ProfileWidget";

export default function Dashboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    navigate("/");
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
        <style>{loaderStyles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Back to Login
        </button>
        <style>{loaderStyles}</style>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "franchises", icon: "building", label: "Franchises" },
    { id: "reports", icon: "chart", label: "Reports" },
    { id: "billing", icon: "card", label: "Billing" },
    { id: "submissions", icon: "upload", label: "Submissions" },
  ];

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">CW</div>
              {!sidebarCollapsed && <span className="logo-text">CFO Worx</span>}
            </div>
            <button 
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {sidebarCollapsed ? (
                  <path d="M9 18l6-6-6-6" />
                ) : (
                  <path d="M15 18l-6-6 6-6" />
                )}
              </svg>
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <MenuIcon name={item.icon} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="connection-status">
              <span className="status-dot"></span>
              {!sidebarCollapsed && <span>QuickBooks Connected</span>}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Top Bar */}
          <header className="top-bar">
            <div className="top-bar-left">
              <h1 className="page-title">
                {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              {user?.company_name && (
                <span className="company-badge">{user.company_name}</span>
              )}
            </div>
            <ProfileWidget user={user} onLogout={handleLogout} />
          </header>

          {/* Content Area */}
          <div className="content">
            {activeSection === "overview" && (
              <OverviewSection 
                user={user} 
                licenses={licenses} 
                subscription={subscription}
                onManageBilling={handleManageBilling}
                navigate={navigate}
              />
            )}
            {activeSection === "franchises" && (
              <FranchisesSection licenses={licenses} navigate={navigate} />
            )}
            {activeSection === "reports" && (
              <ReportsSection />
            )}
            {activeSection === "billing" && (
              <BillingSection 
                subscription={subscription} 
                onManageBilling={handleManageBilling}
                navigate={navigate}
              />
            )}
            {activeSection === "submissions" && (
              <SubmissionsSection />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Menu Icon Component
function MenuIcon({ name }) {
  const icons = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    card: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  };
  return <span className="nav-icon">{icons[name]}</span>;
}

// Overview Section
function OverviewSection({ user, licenses, subscription, onManageBilling, navigate }) {
  const stats = [
    { label: "Active Franchises", value: licenses.length, color: "#10b981" },
    { label: "Subscription", value: subscription?.status === "active" ? "Active" : "Inactive", color: subscription?.status === "active" ? "#10b981" : "#f59e0b" },
    { label: "Licensed Seats", value: subscription?.quantity || 0, color: "#6366f1" },
    { label: "Next Billing", value: subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A", color: "#8b5cf6" },
  ];

  return (
    <div className="section">
      {/* Welcome */}
      <div className="welcome-card">
        <div className="welcome-content">
          <h2>Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
          <p>Here's an overview of your franchise operations.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h3>Quick Actions</h3>
      </div>
      <div className="actions-grid">
        <button onClick={() => navigate("/franchises")} className="action-card">
          <MenuIcon name="building" />
          <span>Manage Franchises</span>
        </button>
        <button className="action-card">
          <MenuIcon name="chart" />
          <span>Generate Report</span>
        </button>
        <button onClick={onManageBilling} className="action-card">
          <MenuIcon name="card" />
          <span>Manage Billing</span>
        </button>
        <button className="action-card">
          <MenuIcon name="upload" />
          <span>New Submission</span>
        </button>
      </div>

      {/* Recent Franchises */}
      {licenses.length > 0 && (
        <>
          <div className="section-header">
            <h3>Your Franchises</h3>
            <button onClick={() => navigate("/franchises")} className="link-btn">View All</button>
          </div>
          <div className="franchise-grid">
            {licenses.slice(0, 6).map((license) => (
              <div key={license.franchise_number} className="franchise-card">
                <div className="franchise-header">
                  <span className="franchise-number">#{license.franchise_number}</span>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="franchise-name">{license.name}</div>
                <div className="franchise-location">{license.city}, {license.state}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Franchises Section
function FranchisesSection({ licenses, navigate }) {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Franchise Management</h3>
        <button onClick={() => navigate("/franchises")} className="btn btn-primary">
          Manage Franchises
        </button>
      </div>

      {licenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MenuIcon name="building" />
          </div>
          <h3>No franchises yet</h3>
          <p>Add your first franchise to get started</p>
          <button onClick={() => navigate("/franchises")} className="btn btn-primary">
            Add Franchises
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Franchise #</th>
                <th>Name</th>
                <th>Location</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.franchise_number}>
                  <td><strong>#{license.franchise_number}</strong></td>
                  <td>{license.name}</td>
                  <td>{license.city}, {license.state}</td>
                  <td>{license.quickbooks?.department_name || "—"}</td>
                  <td><span className="status-badge active">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Reports Section
function ReportsSection() {
  const reportTypes = [
    { title: "Royalty Volume Calculation", desc: "Calculate royalties based on sales volume" },
    { title: "Sales Summary", desc: "Monthly sales breakdown by franchise" },
    { title: "Compliance Report", desc: "Franchise compliance and audit report" },
  ];

  return (
    <div className="section">
      <div className="section-header">
        <h3>Reports</h3>
        <button className="btn btn-primary">Generate New Report</button>
      </div>

      <div className="reports-grid">
        {reportTypes.map((report, i) => (
          <div key={i} className="report-card">
            <h4>{report.title}</h4>
            <p>{report.desc}</p>
            <button className="btn btn-secondary">Generate</button>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: '32px' }}>
        <h3>Recent Reports</h3>
      </div>
      <div className="empty-state">
        <div className="empty-icon">
          <MenuIcon name="chart" />
        </div>
        <h3>No reports yet</h3>
        <p>Generate your first report to see it here</p>
      </div>
    </div>
  );
}

// Billing Section
function BillingSection({ subscription, onManageBilling, navigate }) {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Billing & Subscription</h3>
      </div>

      {subscription ? (
        <div className="billing-grid">
          <div className="billing-card">
            <h4>Current Plan</h4>
            <div className="plan-name">{subscription.plan?.name || "Standard"} Plan</div>
            <div className="plan-cycle">{subscription.plan?.billing_cycle || "Monthly"}</div>
            <div className="plan-price">
              {subscription.plan?.price || "$39/mo"} × {subscription.quantity || 1} license(s)
            </div>
            <div className="plan-status">
              Status: <span className={subscription.status === "active" ? "text-success" : "text-warning"}>
                {subscription.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="billing-card">
            <h4>Billing Details</h4>
            <div className="billing-item">
              <span>Next billing date</span>
              <span className="billing-value">
                {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="billing-item">
              <span>Total licenses</span>
              <span className="billing-value">{subscription.quantity || 1}</span>
            </div>
            <button onClick={onManageBilling} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
              Manage Billing
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <MenuIcon name="card" />
          </div>
          <h3>No active subscription</h3>
          <p>Subscribe to access all features</p>
          <button onClick={() => navigate("/subscribe")} className="btn btn-primary">
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
}

// Submissions Section
function SubmissionsSection() {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Submissions</h3>
        <button className="btn btn-primary">New Submission</button>
      </div>

      <div className="empty-state">
        <div className="empty-icon">
          <MenuIcon name="upload" />
        </div>
        <h3>No submissions yet</h3>
        <p>Submit your first royalty report to see it here</p>
        <button className="btn btn-primary">Create Submission</button>
      </div>
    </div>
  );
}

// Loader Styles
const loaderStyles = `
  .loading-container, .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0f1419;
    color: #e7e9ea;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  .loading-container p, .error-container p {
    margin-top: 16px;
    color: #71767b;
  }
  .error-icon {
    width: 64px;
    height: 64px;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    color: #ef4444;
    margin-bottom: 16px;
  }
  .error-container h2 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 600;
  }
  .error-container .btn {
    margin-top: 24px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Dashboard Styles
const dashboardStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .dashboard {
    display: flex;
    min-height: 100vh;
    background: #0f1419;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #e7e9ea;
  }

  /* Sidebar */
  .sidebar {
    width: 260px;
    background: #16181c;
    border-right: 1px solid #2f3336;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
    transition: width 0.2s ease;
  }

  .sidebar.collapsed {
    width: 72px;
  }

  .sidebar-header {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2f3336;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: white;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #e7e9ea;
  }

  .collapse-btn {
    background: none;
    border: none;
    color: #71767b;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.15s;
  }

  .collapse-btn:hover {
    background: #2f3336;
    color: #e7e9ea;
  }

  .sidebar.collapsed .collapse-btn {
    display: none;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #71767b;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    width: 100%;
  }

  .nav-item:hover {
    background: #1d1f23;
    color: #e7e9ea;
  }

  .nav-item.active {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-icon svg {
    width: 20px;
    height: 20px;
  }

  .sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 12px;
  }

  .sidebar.collapsed .nav-item span:not(.nav-icon) {
    display: none;
  }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid #2f3336;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #71767b;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
  }

  .sidebar.collapsed .connection-status span:not(.status-dot) {
    display: none;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
    transition: margin-left 0.2s ease;
  }

  .sidebar.collapsed + .main-content {
    margin-left: 72px;
  }

  .top-bar {
    background: #16181c;
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2f3336;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .top-bar-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #e7e9ea;
  }

  .company-badge {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .content {
    padding: 32px;
    flex: 1;
  }

  /* Section */
  .section {
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .section-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #e7e9ea;
  }

  .link-btn {
    background: none;
    border: none;
    color: #818cf8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s;
  }

  .link-btn:hover {
    color: #a5b4fc;
  }

  /* Buttons */
  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .btn-secondary {
    background: #2f3336;
    color: #e7e9ea;
  }

  .btn-secondary:hover {
    background: #3a3d41;
  }

  /* Welcome Card */
  .welcome-card {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    border: 1px solid rgba(99, 102, 241, 0.2);
  }

  .welcome-content h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .welcome-content p {
    color: #a5b4fc;
    font-size: 15px;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 24px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: #71767b;
  }

  /* Actions Grid */
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .action-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #e7e9ea;
    text-align: center;
  }

  .action-card:hover {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.05);
  }

  .action-card .nav-icon {
    width: 32px;
    height: 32px;
    color: #818cf8;
  }

  .action-card .nav-icon svg {
    width: 32px;
    height: 32px;
  }

  .action-card span:not(.nav-icon) {
    font-size: 14px;
    font-weight: 500;
  }

  /* Franchise Grid */
  .franchise-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .franchise-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.15s;
  }

  .franchise-card:hover {
    border-color: #6366f1;
  }

  .franchise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .franchise-number {
    font-weight: 600;
    color: #818cf8;
    font-size: 14px;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.active {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .status-badge.inactive {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .franchise-name {
    font-size: 16px;
    font-weight: 600;
    color: #e7e9ea;
    margin-bottom: 8px;
  }

  .franchise-location {
    font-size: 13px;
    color: #71767b;
  }

  /* Table */
  .table-container {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    overflow: hidden;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    padding: 16px 20px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #71767b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #1d1f23;
    border-bottom: 1px solid #2f3336;
  }

  .data-table td {
    padding: 16px 20px;
    font-size: 14px;
    color: #e7e9ea;
    border-bottom: 1px solid #2f3336;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .data-table tr:hover td {
    background: rgba(99, 102, 241, 0.05);
  }

  /* Reports Grid */
  .reports-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .report-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 28px;
    text-align: center;
  }

  .report-card h4 {
    font-size: 16px;
    font-weight: 600;
    color: #e7e9ea;
    margin-bottom: 8px;
  }

  .report-card p {
    font-size: 13px;
    color: #71767b;
    margin-bottom: 20px;
  }

  /* Billing Grid */
  .billing-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .billing-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 28px;
  }

  .billing-card h4 {
    font-size: 14px;
    font-weight: 600;
    color: #71767b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
  }

  .plan-name {
    font-size: 24px;
    font-weight: 700;
    color: #e7e9ea;
  }

  .plan-cycle {
    font-size: 14px;
    color: #71767b;
    margin-bottom: 16px;
  }

  .plan-price {
    font-size: 16px;
    color: #e7e9ea;
    margin-bottom: 12px;
  }

  .plan-status {
    font-size: 14px;
    color: #71767b;
  }

  .text-success { color: #10b981; font-weight: 600; }
  .text-warning { color: #f59e0b; font-weight: 600; }

  .billing-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #2f3336;
    font-size: 14px;
    color: #71767b;
  }

  .billing-value {
    font-weight: 600;
    color: #e7e9ea;
  }

  /* Empty State */
  .empty-state {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    color: #71767b;
  }

  .empty-icon .nav-icon {
    width: 64px;
    height: 64px;
  }

  .empty-icon svg {
    width: 64px;
    height: 64px;
  }

  .empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: #e7e9ea;
    margin-bottom: 8px;
  }

  .empty-state p {
    font-size: 14px;
    color: #71767b;
    margin-bottom: 24px;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .stats-grid, .actions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .franchise-grid, .reports-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 72px;
    }
    .sidebar .logo-text,
    .sidebar .nav-item span:not(.nav-icon),
    .sidebar .connection-status span:not(.status-dot) {
      display: none;
    }
    .sidebar .nav-item {
      justify-content: center;
      padding: 12px;
    }
    .sidebar .collapse-btn {
      display: none;
    }
    .main-content {
      margin-left: 72px;
    }
    .stats-grid, .actions-grid, .franchise-grid, .reports-grid, .billing-grid {
      grid-template-columns: 1fr;
    }
    .top-bar {
      padding: 16px 20px;
    }
    .content {
      padding: 20px;
    }
    .page-title {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    .sidebar {
      position: fixed;
      bottom: 0;
      top: auto;
      left: 0;
      right: 0;
      width: 100%;
      height: 64px;
      flex-direction: row;
      border-right: none;
      border-top: 1px solid #2f3336;
    }
    .sidebar-header, .sidebar-footer {
      display: none;
    }
    .sidebar-nav {
      flex-direction: row;
      padding: 8px;
      justify-content: space-around;
    }
    .main-content {
      margin-left: 0;
      padding-bottom: 80px;
    }
  }
`;
