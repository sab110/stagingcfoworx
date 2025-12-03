import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [failedPayments, setFailedPayments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const adminUsername = localStorage.getItem("admin_username") || "Admin";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/dashboard`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async (search = "") => {
    try {
      const url = search 
        ? `${backendURL}/api/admin/clients?search=${encodeURIComponent(search)}`
        : `${backendURL}/api/admin/clients`;
      
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/subscriptions`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  const fetchFailedPayments = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/failed-payments?status=unresolved`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setFailedPayments(data.failed_payments || []);
    } catch (err) {
      console.error("Error fetching failed payments:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/submissions`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "clients" && clients.length === 0) fetchClients();
    if (tab === "subscriptions" && subscriptions.length === 0) fetchSubscriptions();
    if (tab === "payments" && failedPayments.length === 0) fetchFailedPayments();
    if (tab === "submissions" && submissions.length === 0) fetchSubmissions();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients(searchTerm);
  };

  const formatCurrency = (cents) => {
    if (!cents) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <>
        <style>{dashboardStyles}</style>
        <div className="loading-page">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </>
    );
  }

  const menuItems = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "clients", icon: "users", label: "Clients" },
    { id: "subscriptions", icon: "card", label: "Subscriptions" },
    { id: "payments", icon: "alert", label: "Failed Payments", alert: dashboard?.alerts?.has_failed_payments },
    { id: "submissions", icon: "file", label: "Submissions" },
  ];

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="admin-dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">CW</div>
              <span className="logo-text">Admin</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                {item.alert && <span className="alert-dot"></span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-avatar">{adminUsername.charAt(0).toUpperCase()}</div>
              <span className="admin-name">{adminUsername}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="top-bar">
            <h1 className="page-title">{menuItems.find(m => m.id === activeTab)?.label || "Dashboard"}</h1>
          </header>

          <div className="content">
            {/* Overview Tab */}
            {activeTab === "overview" && dashboard && (
              <div className="overview">
                {dashboard.alerts?.has_failed_payments && (
                  <div className="alert-banner">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    You have {dashboard.overview?.unresolved_failed_payments} unresolved failed payment(s)
                  </div>
                )}

                <div className="stats-grid">
                  <StatCard
                    icon="building"
                    value={dashboard.overview?.total_companies}
                    label="Total Companies"
                    subtext={`+${dashboard.overview?.new_companies_this_month} this month`}
                  />
                  <StatCard
                    icon="check"
                    value={dashboard.overview?.active_subscriptions}
                    label="Active Subscriptions"
                    subtext={`${dashboard.overview?.past_due_subscriptions} past due`}
                    color="#10b981"
                  />
                  <StatCard
                    icon="file"
                    value={dashboard.overview?.total_active_licenses}
                    label="Active Licenses"
                  />
                  <StatCard
                    icon="dollar"
                    value={dashboard.overview?.estimated_mrr}
                    label="Estimated MRR"
                    color="#6366f1"
                  />
                  <StatCard
                    icon="refresh"
                    value={dashboard.overview?.upcoming_renewals_7_days}
                    label="Upcoming Renewals"
                    subtext="Next 7 days"
                  />
                  <StatCard
                    icon="x"
                    value={dashboard.overview?.unresolved_failed_payments}
                    label="Failed Payments"
                    subtext="Unresolved"
                    color="#ef4444"
                    alert={dashboard.overview?.unresolved_failed_payments > 0}
                  />
                </div>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === "clients" && (
              <div>
                <div className="toolbar">
                  <form onSubmit={handleSearch} className="search-form">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, email, or realm ID..."
                      className="search-input"
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                  </form>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Franchises</th>
                        <th>Subscription</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.realm_id}>
                          <td>
                            <div className="company-name">{client.company_name || "N/A"}</div>
                            <div className="realm-id">{client.realm_id}</div>
                          </td>
                          <td>{client.email || "N/A"}</td>
                          <td>{client.license_count}</td>
                          <td>{client.subscription ? `${client.subscription.quantity} license(s)` : <span className="text-muted">None</span>}</td>
                          <td>
                            <span className={`status-badge ${client.subscription?.status === "active" ? 'active' : 'inactive'}`}>
                              {client.subscription?.status || "None"}
                            </span>
                          </td>
                          <td>{formatDate(client.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clients.length === 0 && <div className="empty-state">No clients found</div>}
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Plan</th>
                      <th>Licenses</th>
                      <th>Status</th>
                      <th>Next Billing</th>
                      <th>Stripe ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div className="company-name">{sub.company_name}</div>
                          <div className="realm-id">{sub.company_email}</div>
                        </td>
                        <td>
                          {sub.plan ? (
                            <>
                              <div>{sub.plan.name}</div>
                              <div className="text-muted">{sub.plan.billing_cycle} - {sub.plan.price}</div>
                            </>
                          ) : "N/A"}
                        </td>
                        <td>{sub.quantity}</td>
                        <td>
                          <span className={`status-badge ${sub.status === "active" ? 'active' : sub.status === "past_due" ? 'danger' : 'inactive'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td>{formatDate(sub.end_date)}</td>
                        <td><span className="mono">{sub.stripe_subscription_id?.slice(0, 20)}...</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {subscriptions.length === 0 && <div className="empty-state">No subscriptions found</div>}
              </div>
            )}

            {/* Failed Payments Tab */}
            {activeTab === "payments" && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Failure Reason</th>
                      <th>Status</th>
                      <th>Failed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.company_name || "Unknown"}</td>
                        <td>{payment.customer_email || "N/A"}</td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>
                          <div className="failure-message">{payment.failure_message}</div>
                          {payment.failure_code && <div className="mono text-muted">Code: {payment.failure_code}</div>}
                        </td>
                        <td>
                          <span className={`status-badge ${payment.status === "resolved" ? 'active' : 'danger'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>{formatDate(payment.failed_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {failedPayments.length === 0 && <div className="empty-state">No failed payments found</div>}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === "submissions" && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Period</th>
                      <th>Gross Sales</th>
                      <th>Royalty</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>{sub.company_name}</td>
                        <td>{sub.submission_type || "N/A"}</td>
                        <td>
                          {sub.period_start && sub.period_end
                            ? `${formatDate(sub.period_start)} - ${formatDate(sub.period_end)}`
                            : "N/A"}
                        </td>
                        <td>{formatCurrency(sub.gross_sales)}</td>
                        <td>{formatCurrency(sub.royalty_amount)}</td>
                        <td>
                          <span className={`status-badge ${sub.status === "approved" ? 'active' : sub.status === "rejected" ? 'danger' : 'warning'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td>{formatDate(sub.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {submissions.length === 0 && <div className="empty-state">No submissions found</div>}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Nav Icon Component
function NavIcon({ name }) {
  const icons = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    card: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  };
  return <span className="nav-icon">{icons[name]}</span>;
}

// Stat Card Component
function StatCard({ icon, value, label, subtext, color, alert }) {
  const icons = {
    building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  };

  return (
    <div className={`stat-card ${alert ? 'alert' : ''}`}>
      <div className="stat-icon" style={color ? { color } : {}}>
        {icons[icon]}
      </div>
      <div className="stat-content">
        <div className="stat-value" style={color ? { color } : {}}>{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
}

const dashboardStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .admin-dashboard {
    display: flex;
    min-height: 100vh;
    background: #0f1419;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #e7e9ea;
  }

  .loading-page {
    min-height: 100vh;
    background: #0f1419;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #e7e9ea;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(239, 68, 68, 0.2);
    border-top-color: #ef4444;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  .loading-page p {
    color: #71767b;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
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
  }

  .sidebar-header {
    padding: 20px;
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
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
    position: relative;
  }

  .nav-item:hover {
    background: #1d1f23;
    color: #e7e9ea;
  }

  .nav-item.active {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
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

  .alert-dot {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    margin-left: auto;
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #2f3336;
  }

  .admin-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #0f1419;
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .admin-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: white;
  }

  .admin-name {
    font-size: 14px;
    font-weight: 600;
    color: #e7e9ea;
  }

  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    color: #ef4444;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    background: #16181c;
    padding: 20px 32px;
    border-bottom: 1px solid #2f3336;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .page-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }

  .content {
    padding: 32px;
    flex: 1;
  }

  /* Alert Banner */
  .alert-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    color: #ef4444;
    font-size: 14px;
    margin-bottom: 24px;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .stat-card {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 16px;
  }

  .stat-card.alert {
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.05);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    background: #0f1419;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #71767b;
  }

  .stat-icon svg {
    width: 24px;
    height: 24px;
  }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #e7e9ea;
    line-height: 1;
  }

  .stat-label {
    font-size: 14px;
    color: #71767b;
    margin-top: 4px;
  }

  .stat-subtext {
    font-size: 12px;
    color: #536471;
    margin-top: 4px;
  }

  /* Toolbar */
  .toolbar {
    margin-bottom: 24px;
  }

  .search-form {
    display: flex;
    gap: 12px;
    max-width: 500px;
  }

  .search-input {
    flex: 1;
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    color: #e7e9ea;
    outline: none;
  }

  .search-input:focus {
    border-color: #ef4444;
  }

  .search-input::placeholder {
    color: #71767b;
  }

  .btn {
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
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
    padding: 14px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #71767b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: #1d1f23;
    border-bottom: 1px solid #2f3336;
  }

  .data-table td {
    padding: 14px 16px;
    font-size: 14px;
    color: #e7e9ea;
    border-bottom: 1px solid #2f3336;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .data-table tr:hover td {
    background: rgba(239, 68, 68, 0.03);
  }

  .company-name {
    font-weight: 600;
    color: #e7e9ea;
  }

  .realm-id {
    font-size: 12px;
    color: #536471;
    margin-top: 2px;
  }

  .text-muted {
    color: #536471;
    font-style: italic;
  }

  .mono {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 12px;
  }

  .failure-message {
    color: #ef4444;
    font-size: 13px;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
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
    background: rgba(113, 118, 123, 0.15);
    color: #71767b;
  }

  .status-badge.danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .status-badge.warning {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }

  .empty-state {
    padding: 60px 24px;
    text-align: center;
    color: #71767b;
    font-size: 15px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 72px;
    }

    .sidebar .logo-text,
    .sidebar .nav-item span:not(.nav-icon):not(.alert-dot),
    .sidebar .admin-name {
      display: none;
    }

    .sidebar .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .sidebar .admin-info {
      justify-content: center;
    }

    .sidebar .logout-btn span {
      display: none;
    }

    .main-content {
      margin-left: 72px;
    }

    .content {
      padding: 20px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      min-width: 700px;
    }
  }
`;
