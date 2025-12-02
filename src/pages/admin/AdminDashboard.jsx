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
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarLogo}>📊</span>
          <span style={styles.sidebarTitle}>CFO Worx Admin</span>
        </div>

        <nav style={styles.nav}>
          {[
            { id: "overview", icon: "🏠", label: "Overview" },
            { id: "clients", icon: "👥", label: "Clients" },
            { id: "subscriptions", icon: "💳", label: "Subscriptions" },
            { id: "payments", icon: "⚠️", label: "Failed Payments" },
            { id: "submissions", icon: "📋", label: "Submissions" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
              {item.id === "payments" && dashboard?.alerts?.has_failed_payments && (
                <span style={styles.alertBadge}></span>
              )}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <span style={styles.adminAvatar}>👤</span>
            <span style={styles.adminName}>{adminUsername}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Overview Tab */}
        {activeTab === "overview" && dashboard && (
          <div>
            <h1 style={styles.pageTitle}>Dashboard Overview</h1>
            
            {/* Alert Banners */}
            {dashboard.alerts?.has_failed_payments && (
              <div style={styles.alertBanner}>
                ⚠️ You have {dashboard.overview?.unresolved_failed_payments} unresolved failed payment(s)
              </div>
            )}

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🏢</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.total_companies}</div>
                  <div style={styles.statLabel}>Total Companies</div>
                  <div style={styles.statSubtext}>
                    +{dashboard.overview?.new_companies_this_month} this month
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.active_subscriptions}</div>
                  <div style={styles.statLabel}>Active Subscriptions</div>
                  <div style={styles.statSubtext}>
                    {dashboard.overview?.past_due_subscriptions} past due
                  </div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📄</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.total_active_licenses}</div>
                  <div style={styles.statLabel}>Active Licenses</div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.estimated_mrr}</div>
                  <div style={styles.statLabel}>Estimated MRR</div>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>🔄</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.upcoming_renewals_7_days}</div>
                  <div style={styles.statLabel}>Upcoming Renewals</div>
                  <div style={styles.statSubtext}>Next 7 days</div>
                </div>
              </div>

              <div style={{...styles.statCard, ...(dashboard.overview?.unresolved_failed_payments > 0 ? styles.statCardAlert : {})}}>
                <div style={styles.statIcon}>❌</div>
                <div style={styles.statContent}>
                  <div style={styles.statValue}>{dashboard.overview?.unresolved_failed_payments}</div>
                  <div style={styles.statLabel}>Failed Payments</div>
                  <div style={styles.statSubtext}>Unresolved</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div>
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Client Information</h1>
              <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or realm ID..."
                  style={styles.searchInput}
                />
                <button type="submit" style={styles.searchBtn}>Search</button>
              </form>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Licenses</th>
                    <th style={styles.th}>Subscription</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.realm_id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.companyName}>{client.company_name || "N/A"}</div>
                        <div style={styles.realmId}>{client.realm_id}</div>
                      </td>
                      <td style={styles.td}>{client.email || "N/A"}</td>
                      <td style={styles.td}>{client.license_count}</td>
                      <td style={styles.td}>
                        {client.subscription ? (
                          <span>{client.subscription.quantity} license(s)</span>
                        ) : (
                          <span style={styles.noSubscription}>No subscription</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(client.subscription?.status === "active" ? styles.statusActive : styles.statusInactive)
                        }}>
                          {client.subscription?.status || "None"}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(client.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length === 0 && (
                <div style={styles.emptyState}>No clients found</div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div>
            <h1 style={styles.pageTitle}>Subscription Summary</h1>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Plan</th>
                    <th style={styles.th}>Licenses</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Next Billing</th>
                    <th style={styles.th}>Stripe ID</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.companyName}>{sub.company_name}</div>
                        <div style={styles.realmId}>{sub.company_email}</div>
                      </td>
                      <td style={styles.td}>
                        {sub.plan ? (
                          <div>
                            <div>{sub.plan.name}</div>
                            <div style={styles.planCycle}>{sub.plan.billing_cycle} • {sub.plan.price}</div>
                          </div>
                        ) : "N/A"}
                      </td>
                      <td style={styles.td}>{sub.quantity}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(sub.status === "active" ? styles.statusActive : 
                             sub.status === "past_due" ? styles.statusPastDue : styles.statusInactive)
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(sub.end_date)}</td>
                      <td style={styles.td}>
                        <span style={styles.stripeId}>{sub.stripe_subscription_id?.slice(0, 20)}...</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscriptions.length === 0 && (
                <div style={styles.emptyState}>No subscriptions found</div>
              )}
            </div>
          </div>
        )}

        {/* Failed Payments Tab */}
        {activeTab === "payments" && (
          <div>
            <h1 style={styles.pageTitle}>Failed Payments Log</h1>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Failure Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Failed At</th>
                  </tr>
                </thead>
                <tbody>
                  {failedPayments.map((payment) => (
                    <tr key={payment.id} style={styles.tr}>
                      <td style={styles.td}>{payment.company_name || "Unknown"}</td>
                      <td style={styles.td}>{payment.customer_email || "N/A"}</td>
                      <td style={styles.td}>{formatCurrency(payment.amount)}</td>
                      <td style={styles.td}>
                        <div style={styles.failureMessage}>{payment.failure_message}</div>
                        {payment.failure_code && (
                          <div style={styles.failureCode}>Code: {payment.failure_code}</div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(payment.status === "resolved" ? styles.statusActive : styles.statusPastDue)
                        }}>
                          {payment.status}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(payment.failed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {failedPayments.length === 0 && (
                <div style={styles.emptyState}>No failed payments found</div>
              )}
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div>
            <h1 style={styles.pageTitle}>Franchisee Submissions</h1>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Period</th>
                    <th style={styles.th}>Gross Sales</th>
                    <th style={styles.th}>Royalty</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} style={styles.tr}>
                      <td style={styles.td}>{sub.company_name}</td>
                      <td style={styles.td}>{sub.submission_type || "N/A"}</td>
                      <td style={styles.td}>
                        {sub.period_start && sub.period_end ? (
                          `${formatDate(sub.period_start)} - ${formatDate(sub.period_end)}`
                        ) : "N/A"}
                      </td>
                      <td style={styles.td}>{formatCurrency(sub.gross_sales)}</td>
                      <td style={styles.td}>{formatCurrency(sub.royalty_amount)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(sub.status === "approved" ? styles.statusActive : 
                             sub.status === "rejected" ? styles.statusPastDue : styles.statusPending)
                        }}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(sub.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {submissions.length === 0 && (
                <div style={styles.emptyState}>No submissions found</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    color: "#f8fafc",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(148, 163, 184, 0.2)",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    color: "#94a3b8",
  },
  // Sidebar
  sidebar: {
    width: "260px",
    backgroundColor: "#1e293b",
    borderRight: "1px solid rgba(148, 163, 184, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 12px",
    marginBottom: "32px",
  },
  sidebarLogo: {
    fontSize: "28px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    position: "relative",
  },
  navItemActive: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    color: "#3b82f6",
  },
  navIcon: {
    fontSize: "18px",
  },
  alertBadge: {
    width: "8px",
    height: "8px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    marginLeft: "auto",
  },
  sidebarFooter: {
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    paddingTop: "16px",
    marginTop: "auto",
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    marginBottom: "12px",
  },
  adminAvatar: {
    fontSize: "24px",
  },
  adminName: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "500",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px 16px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    color: "#fca5a5",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  // Main
  main: {
    flex: 1,
    padding: "32px 40px",
    overflowY: "auto",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 24px 0",
  },
  searchForm: {
    display: "flex",
    gap: "8px",
  },
  searchInput: {
    backgroundColor: "#1e293b",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    color: "#f8fafc",
    width: "300px",
    outline: "none",
  },
  searchBtn: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  // Alert Banner
  alertBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    padding: "14px 20px",
    color: "#fca5a5",
    fontSize: "14px",
    marginBottom: "24px",
  },
  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    gap: "16px",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  statCardAlert: {
    borderColor: "rgba(239, 68, 68, 0.3)",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  statIcon: {
    fontSize: "32px",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#f8fafc",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#94a3b8",
    marginTop: "4px",
  },
  statSubtext: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
  },
  // Table
  tableContainer: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
  },
  tr: {
    borderBottom: "1px solid rgba(148, 163, 184, 0.05)",
  },
  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#cbd5e1",
  },
  companyName: {
    fontWeight: "500",
    color: "#f8fafc",
  },
  realmId: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  planCycle: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  stripeId: {
    fontSize: "12px",
    color: "#64748b",
    fontFamily: "monospace",
  },
  noSubscription: {
    color: "#64748b",
    fontStyle: "italic",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusActive: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    color: "#22c55e",
  },
  statusInactive: {
    backgroundColor: "rgba(100, 116, 139, 0.15)",
    color: "#64748b",
  },
  statusPastDue: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "#ef4444",
  },
  statusPending: {
    backgroundColor: "rgba(234, 179, 8, 0.15)",
    color: "#eab308",
  },
  failureMessage: {
    color: "#fca5a5",
    fontSize: "13px",
  },
  failureCode: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
    fontFamily: "monospace",
  },
  emptyState: {
    padding: "48px 24px",
    textAlign: "center",
    color: "#64748b",
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
if (!document.querySelector('style[data-admin-dashboard]')) {
  styleSheet.setAttribute('data-admin-dashboard', 'true');
  document.head.appendChild(styleSheet);
}

