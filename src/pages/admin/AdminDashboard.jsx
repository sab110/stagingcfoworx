import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// ADMIN DASHBOARD - Enterprise SaaS Admin Panel
// CFOWORX Branding: Primary #1B4DFF, Accent #F97316
// ============================================================

export default function AdminDashboard() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  
  // State
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [failedPayments, setFailedPayments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetailTab, setClientDetailTab] = useState("overview");
  
  const adminUsername = localStorage.getItem("admin_username") || "Admin";

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    "Content-Type": "application/json"
  }), []);

  // Auth check & initial data load
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchDashboard();
  }, [navigate]);

  // Fetch functions
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
      const response = await fetch(`${backendURL}/api/admin/failed-payments`, {
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

  // Navigation handlers
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedClient(null);
    
    if (section === "clients" && clients.length === 0) fetchClients();
    if (section === "billing" && subscriptions.length === 0) fetchSubscriptions();
    if (section === "errors" && failedPayments.length === 0) fetchFailedPayments();
    if (section === "runs" && submissions.length === 0) fetchSubmissions();
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

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setClientDetailTab("overview");
  };

  // Utility functions
  const formatCurrency = (cents) => {
    if (!cents && cents !== 0) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
        <style>{globalStyles}</style>
      </div>
    );
  }

  // Menu items
  const menuItems = [
    { id: "dashboard", icon: <LayoutDashboardIcon />, label: "Dashboard" },
    { id: "clients", icon: <UsersIcon />, label: "Clients" },
    { id: "runs", icon: <PlayCircleIcon />, label: "Runs" },
    { id: "reports", icon: <FileTextIcon />, label: "Reports" },
    { id: "mapping", icon: <GitBranchIcon />, label: "Mapping Rules" },
    { id: "billing", icon: <CreditCardIcon />, label: "Billing" },
    { id: "errors", icon: <AlertTriangleIcon />, label: "Errors / Logs", alert: dashboard?.alerts?.has_failed_payments },
    { id: "settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarCollapsed ? '72px' : '260px',
      }}>
        {/* Logo */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2.5" fill="none"/>
                <circle cx="16" cy="16" r="2.5" fill="white"/>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div style={styles.logoTextContainer}>
                <span style={styles.logoText}>RoyaltiesAgent</span>
                <span style={styles.logoSubtext}>Admin</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={styles.collapseBtn}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              style={{
                ...styles.navItem,
                ...(activeSection === item.id ? styles.navItemActive : {}),
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                padding: sidebarCollapsed ? '12px' : '12px 16px',
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span style={{
                ...styles.navIcon,
                color: activeSection === item.id ? '#1B4DFF' : '#64748B',
              }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={styles.navLabel}>{item.label}</span>}
              {item.alert && <span style={styles.alertDot}></span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.sidebarFooter}>
          {!sidebarCollapsed && (
            <div style={styles.adminInfo}>
              <div style={styles.adminAvatar}>
                {adminUsername.charAt(0).toUpperCase()}
              </div>
              <div style={styles.adminDetails}>
                <span style={styles.adminName}>{adminUsername}</span>
                <span style={styles.adminRole}>Administrator</span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            ...styles.logoutBtn,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          }}>
            <LogOutIcon />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: sidebarCollapsed ? '72px' : '260px',
      }}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.pageTitle}>
              {selectedClient 
                ? selectedClient.company_name || 'Client Details'
                : menuItems.find(m => m.id === activeSection)?.label || "Dashboard"
              }
            </h1>
            {selectedClient && (
              <button onClick={() => setSelectedClient(null)} style={styles.backBtn}>
                <ArrowLeftIcon /> Back to Clients
              </button>
            )}
          </div>
          <div style={styles.topBarRight}>
            {/* Search */}
            {(activeSection === "clients" || activeSection === "dashboard") && !selectedClient && (
              <form onSubmit={handleSearch} style={styles.searchForm}>
                <SearchIcon style={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clients..."
                  style={styles.searchInput}
                />
              </form>
            )}
            {/* Notifications */}
            <button style={styles.iconBtn}>
              <BellIcon />
              {dashboard?.alerts?.has_failed_payments && <span style={styles.notifDot}></span>}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {/* Dashboard Section */}
          {activeSection === "dashboard" && !selectedClient && (
            <DashboardSection 
              dashboard={dashboard} 
              onViewFailedPayments={() => handleSectionChange("errors")}
            />
          )}

          {/* Clients Section */}
          {activeSection === "clients" && !selectedClient && (
            <ClientsSection 
              clients={clients}
              onViewClient={handleViewClient}
              formatDate={formatDate}
            />
          )}

          {/* Client Detail View */}
          {selectedClient && (
            <ClientDetailSection
              client={selectedClient}
              activeTab={clientDetailTab}
              setActiveTab={setClientDetailTab}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Runs Section */}
          {activeSection === "runs" && !selectedClient && (
            <RunsSection 
              submissions={submissions}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Reports Section */}
          {activeSection === "reports" && !selectedClient && (
            <ReportsSection />
          )}

          {/* Mapping Rules Section */}
          {activeSection === "mapping" && !selectedClient && (
            <MappingRulesSection />
          )}

          {/* Billing Section */}
          {activeSection === "billing" && !selectedClient && (
            <BillingSection 
              subscriptions={subscriptions}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Errors/Logs Section */}
          {activeSection === "errors" && !selectedClient && (
            <ErrorsSection 
              failedPayments={failedPayments}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Settings Section */}
          {activeSection === "settings" && !selectedClient && (
            <SettingsSection adminUsername={adminUsername} />
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// SECTION COMPONENTS
// ============================================================

// Dashboard Section
function DashboardSection({ dashboard, onViewFailedPayments }) {
  const overview = dashboard?.overview || {};
  
  return (
    <div>
      {/* Alert Banner */}
      {dashboard?.alerts?.has_failed_payments && (
        <div style={styles.alertBanner}>
          <AlertTriangleIcon />
          <span>
            You have <strong>{overview.unresolved_failed_payments}</strong> unresolved failed payment(s) that require attention
          </span>
          <button onClick={onViewFailedPayments} style={styles.alertAction}>
            View Details
          </button>
        </div>
      )}

      {/* Next Run Banner */}
      <div style={styles.scheduleBanner}>
        <div style={styles.scheduleIcon}>
          <CalendarIcon />
        </div>
        <div style={styles.scheduleContent}>
          <span style={styles.scheduleLabel}>Next Royalty Run</span>
          <span style={styles.scheduleValue}>10th of each month @ 08:00 ET</span>
        </div>
        <span style={styles.scheduleBadge}>Automated</span>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard 
          icon={<BuildingIcon />}
          value={overview.total_companies || 0}
          label="Total Clients"
          subtext={`+${overview.new_companies_this_month || 0} this month`}
          color="#1B4DFF"
        />
        <StatCard 
          icon={<CheckCircleIcon />}
          value={overview.active_subscriptions || 0}
          label="Active Subscriptions"
          subtext={`${overview.past_due_subscriptions || 0} past due`}
          color="#10B981"
        />
        <StatCard 
          icon={<FileIcon />}
          value={overview.total_active_licenses || 0}
          label="Active Licenses"
          color="#8B5CF6"
        />
        <StatCard 
          icon={<DollarSignIcon />}
          value={overview.estimated_mrr || "$0"}
          label="Estimated MRR"
          color="#F97316"
        />
        <StatCard 
          icon={<RefreshCwIcon />}
          value={overview.upcoming_renewals_7_days || 0}
          label="Upcoming Renewals"
          subtext="Next 7 days"
          color="#06B6D4"
        />
        <StatCard 
          icon={<XCircleIcon />}
          value={overview.unresolved_failed_payments || 0}
          label="Failed Payments"
          subtext="Unresolved"
          color="#EF4444"
          alert={overview.unresolved_failed_payments > 0}
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
      </div>
      <div style={styles.quickActionsGrid}>
        <QuickActionCard icon={<UsersIcon />} label="View All Clients" />
        <QuickActionCard icon={<PlayCircleIcon />} label="Trigger Manual Run" />
        <QuickActionCard icon={<DownloadIcon />} label="Export Reports" />
        <QuickActionCard icon={<SettingsIcon />} label="System Settings" />
      </div>
    </div>
  );
}

// Clients Section
function ClientsSection({ clients, onViewClient, formatDate }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>All Clients</h3>
        <span style={styles.resultCount}>{clients.length} clients</span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Franchises</th>
              <th style={styles.th}>Plan</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.realm_id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.companyCell}>
                    <div style={styles.companyAvatar}>
                      {(client.company_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.companyName}>{client.company_name || "Unknown"}</div>
                      <div style={styles.realmId}>{client.realm_id}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{client.email || "—"}</td>
                <td style={styles.td}>
                  <span style={styles.licenseCount}>{client.license_count || 0}</span>
                </td>
                <td style={styles.td}>
                  {client.subscription?.plan_name ? (
                    <span style={styles.planBadge}>{client.subscription.plan_name}</span>
                  ) : (
                    <span style={styles.noPlan}>No plan</span>
                  )}
                </td>
                <td style={styles.td}>
                  <StatusBadge status={client.subscription?.status || "none"} />
                </td>
                <td style={styles.td}>{formatDate(client.created_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => onViewClient(client)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <EmptyState 
            icon={<UsersIcon />}
            title="No clients found"
            description="Try adjusting your search or filters"
          />
        )}
      </div>
    </div>
  );
}

// Client Detail Section
function ClientDetailSection({ client, activeTab, setActiveTab, formatDate, formatCurrency }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "licenses", label: "Licenses" },
    { id: "quickbooks", label: "QuickBooks" },
    { id: "reports", label: "Reports" },
    { id: "runs", label: "Run History" },
  ];

  return (
    <div>
      {/* Client Header */}
      <div style={styles.clientHeader}>
        <div style={styles.clientHeaderLeft}>
          <div style={styles.clientLargeAvatar}>
            {(client.company_name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.clientName}>{client.company_name || "Unknown Company"}</h2>
            <div style={styles.clientMeta}>
              <span>{client.email || "No email"}</span>
              <span style={styles.metaDot}>•</span>
              <span>Realm: {client.realm_id}</span>
            </div>
          </div>
        </div>
        <div style={styles.clientHeaderRight}>
          <StatusBadge status={client.subscription?.status || "none"} large />
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "overview" && (
          <div style={styles.overviewGrid}>
            <div style={styles.infoCard}>
              <h4 style={styles.infoCardTitle}>Company Information</h4>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Legal Name</span>
                <span style={styles.infoValue}>{client.legal_name || "—"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>{client.primary_phone || "—"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Country</span>
                <span style={styles.infoValue}>{client.country || "—"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Onboarding</span>
                <span style={styles.infoValue}>
                  {client.onboarding_completed === "true" ? (
                    <span style={{ color: '#10B981' }}>Completed</span>
                  ) : (
                    <span style={{ color: '#F59E0B' }}>In Progress</span>
                  )}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Created</span>
                <span style={styles.infoValue}>{formatDate(client.created_at)}</span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <h4 style={styles.infoCardTitle}>Subscription</h4>
              {client.subscription ? (
                <>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Plan</span>
                    <span style={styles.infoValue}>{client.subscription.plan_name || "—"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Licenses</span>
                    <span style={styles.infoValue}>{client.subscription.quantity || 1}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Status</span>
                    <StatusBadge status={client.subscription.status} />
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Next Billing</span>
                    <span style={styles.infoValue}>{formatDate(client.subscription.end_date)}</span>
                  </div>
                </>
              ) : (
                <p style={styles.noData}>No subscription</p>
              )}
            </div>

            <div style={styles.infoCard}>
              <h4 style={styles.infoCardTitle}>QuickBooks Connection</h4>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Status</span>
                <span style={styles.infoValue}>
                  <span style={{ ...styles.connectionDot, background: '#10B981' }}></span>
                  Connected
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Realm ID</span>
                <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: '12px' }}>
                  {client.realm_id}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "licenses" && (
          <div style={styles.infoCard}>
            <h4 style={styles.infoCardTitle}>Licensed Franchises</h4>
            <p style={styles.noData}>
              {client.license_count || 0} active franchise(s) linked to this account.
            </p>
          </div>
        )}

        {activeTab === "quickbooks" && (
          <div style={styles.infoCard}>
            <h4 style={styles.infoCardTitle}>QuickBooks Integration</h4>
            <p style={styles.noData}>QuickBooks connection details and token status.</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div style={styles.infoCard}>
            <h4 style={styles.infoCardTitle}>Generated Reports</h4>
            <EmptyState 
              icon={<FileTextIcon />}
              title="No reports yet"
              description="Reports will appear here after the first royalty run"
            />
          </div>
        )}

        {activeTab === "runs" && (
          <div style={styles.infoCard}>
            <h4 style={styles.infoCardTitle}>Run History</h4>
            <EmptyState 
              icon={<PlayCircleIcon />}
              title="No runs yet"
              description="Run history will appear here after the first royalty run"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Runs Section
function RunsSection({ submissions, formatDate, formatCurrency }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Run History</h3>
        <button style={styles.primaryBtn}>
          <PlayCircleIcon /> Trigger Manual Run
        </button>
      </div>

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
                <td style={styles.td}>{sub.submission_type || "—"}</td>
                <td style={styles.td}>
                  {sub.period_start && sub.period_end
                    ? `${formatDate(sub.period_start)} - ${formatDate(sub.period_end)}`
                    : "—"}
                </td>
                <td style={styles.td}>{formatCurrency(sub.gross_sales)}</td>
                <td style={styles.td}>{formatCurrency(sub.royalty_amount)}</td>
                <td style={styles.td}>
                  <StatusBadge status={sub.status} />
                </td>
                <td style={styles.td}>{formatDate(sub.submitted_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <EmptyState 
            icon={<PlayCircleIcon />}
            title="No run history"
            description="Run history will appear here after the first royalty run"
          />
        )}
      </div>
    </div>
  );
}

// Reports Section
function ReportsSection() {
  const reportTypes = [
    { id: "ilrm", name: "ILRM Report", description: "Individual License Royalty Manager", icon: <FileTextIcon /> },
    { id: "rvcr", name: "RVCR Report", description: "Royalty Volume Calculation Report", icon: <FileIcon /> },
    { id: "payment", name: "Payment Summary", description: "Monthly payment breakdown", icon: <DollarSignIcon /> },
  ];

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Reports</h3>
      </div>

      <div style={styles.reportsGrid}>
        {reportTypes.map((report) => (
          <div key={report.id} style={styles.reportCard}>
            <div style={styles.reportIcon}>{report.icon}</div>
            <h4 style={styles.reportTitle}>{report.name}</h4>
            <p style={styles.reportDesc}>{report.description}</p>
            <button style={styles.reportBtn}>
              <DownloadIcon /> Download
            </button>
          </div>
        ))}
      </div>

      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Recent Reports</h3>
      </div>
      <EmptyState 
        icon={<FileTextIcon />}
        title="No reports generated yet"
        description="Reports will be available after the first royalty run"
      />
    </div>
  );
}

// Mapping Rules Section
function MappingRulesSection() {
  const ruleCategories = [
    { id: "subcontract", name: "Subcontract Rules", count: 0 },
    { id: "referral", name: "Referral Rules", count: 0 },
    { id: "estimating", name: "Estimating Rules", count: 0 },
    { id: "interest", name: "Interest/Damage Rules", count: 0 },
  ];

  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Mapping Rules</h3>
        <button style={styles.primaryBtn}>
          <PlusIcon /> Add Rule
        </button>
      </div>

      <div style={styles.rulesGrid}>
        {ruleCategories.map((cat) => (
          <div key={cat.id} style={styles.ruleCard}>
            <div style={styles.ruleHeader}>
              <GitBranchIcon />
              <h4 style={styles.ruleName}>{cat.name}</h4>
            </div>
            <p style={styles.ruleCount}>{cat.count} rules configured</p>
            <button style={styles.ruleBtn}>Manage Rules</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Billing Section
function BillingSection({ subscriptions, formatDate, formatCurrency }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Subscriptions</h3>
        <span style={styles.resultCount}>{subscriptions.length} subscriptions</span>
      </div>

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
                      <div style={styles.planName}>{sub.plan.name}</div>
                      <div style={styles.planPrice}>{sub.plan.billing_cycle} - {sub.plan.price}</div>
                    </div>
                  ) : "—"}
                </td>
                <td style={styles.td}>{sub.quantity}</td>
                <td style={styles.td}>
                  <StatusBadge status={sub.status} />
                </td>
                <td style={styles.td}>{formatDate(sub.end_date)}</td>
                <td style={styles.td}>
                  <span style={styles.stripeId}>{sub.stripe_subscription_id?.slice(0, 24)}...</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscriptions.length === 0 && (
          <EmptyState 
            icon={<CreditCardIcon />}
            title="No subscriptions"
            description="Subscriptions will appear here when clients subscribe"
          />
        )}
      </div>
    </div>
  );
}

// Errors Section
function ErrorsSection({ failedPayments, formatDate, formatCurrency }) {
  const [activeTab, setActiveTab] = useState("payments");
  
  return (
    <div>
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab("payments")}
          style={{
            ...styles.tab,
            ...(activeTab === "payments" ? styles.tabActive : {}),
          }}
        >
          Failed Payments
        </button>
        <button
          onClick={() => setActiveTab("webhooks")}
          style={{
            ...styles.tab,
            ...(activeTab === "webhooks" ? styles.tabActive : {}),
          }}
        >
          Webhook Logs
        </button>
        <button
          onClick={() => setActiveTab("qbo")}
          style={{
            ...styles.tab,
            ...(activeTab === "qbo" ? styles.tabActive : {}),
          }}
        >
          QBO Errors
        </button>
        <button
          onClick={() => setActiveTab("sftp")}
          style={{
            ...styles.tab,
            ...(activeTab === "sftp" ? styles.tabActive : {}),
          }}
        >
          SFTP Errors
        </button>
      </div>

      {activeTab === "payments" && (
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
                  <td style={styles.td}>{payment.customer_email || "—"}</td>
                  <td style={styles.td}>{formatCurrency(payment.amount)}</td>
                  <td style={styles.td}>
                    <div style={styles.failureMessage}>{payment.failure_message}</div>
                    {payment.failure_code && (
                      <div style={styles.failureCode}>Code: {payment.failure_code}</div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <StatusBadge status={payment.status} />
                  </td>
                  <td style={styles.td}>{formatDate(payment.failed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {failedPayments.length === 0 && (
            <EmptyState 
              icon={<CheckCircleIcon />}
              title="No failed payments"
              description="All payments are processing correctly"
            />
          )}
        </div>
      )}

      {activeTab === "webhooks" && (
        <EmptyState 
          icon={<WebhookIcon />}
          title="No webhook errors"
          description="All webhooks are being processed correctly"
        />
      )}

      {activeTab === "qbo" && (
        <EmptyState 
          icon={<RefreshCwIcon />}
          title="No QuickBooks errors"
          description="All QuickBooks integrations are healthy"
        />
      )}

      {activeTab === "sftp" && (
        <EmptyState 
          icon={<UploadIcon />}
          title="No SFTP errors"
          description="All SFTP uploads are successful"
        />
      )}
    </div>
  );
}

// Settings Section
function SettingsSection({ adminUsername }) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>System Settings</h3>
      </div>

      <div style={styles.settingsGrid}>
        <div style={styles.settingsCard}>
          <h4 style={styles.settingsTitle}>Admin Account</h4>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Username</span>
            <span style={styles.infoValue}>{adminUsername}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Role</span>
            <span style={styles.infoValue}>Super Admin</span>
          </div>
        </div>

        <div style={styles.settingsCard}>
          <h4 style={styles.settingsTitle}>Automation Schedule</h4>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Royalty Run</span>
            <span style={styles.infoValue}>10th of each month @ 08:00 ET</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Token Refresh</span>
            <span style={styles.infoValue}>Every 30 minutes</span>
          </div>
        </div>

        <div style={styles.settingsCard}>
          <h4 style={styles.settingsTitle}>Integrations</h4>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Stripe</span>
            <span style={{ ...styles.infoValue, color: '#10B981' }}>Connected</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>QuickBooks</span>
            <span style={{ ...styles.infoValue, color: '#10B981' }}>Connected</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>ServproNET SFTP</span>
            <span style={{ ...styles.infoValue, color: '#10B981' }}>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

// Stat Card
function StatCard({ icon, value, label, subtext, color, alert }) {
  return (
    <div style={{
      ...styles.statCard,
      ...(alert ? styles.statCardAlert : {}),
    }}>
      <div style={{
        ...styles.statIcon,
        color: color || '#64748B',
        background: `${color || '#64748B'}10`,
      }}>
        {icon}
      </div>
      <div style={styles.statContent}>
        <div style={{
          ...styles.statValue,
          color: color || '#0F172A',
        }}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
        {subtext && <div style={styles.statSubtext}>{subtext}</div>}
      </div>
    </div>
  );
}

// Quick Action Card
function QuickActionCard({ icon, label }) {
  return (
    <button style={styles.quickActionCard}>
      <div style={styles.quickActionIcon}>{icon}</div>
      <span style={styles.quickActionLabel}>{label}</span>
    </button>
  );
}

// Status Badge
function StatusBadge({ status, large }) {
  const statusConfig = {
    active: { bg: '#ECFDF5', color: '#059669', label: 'Active' },
    canceled: { bg: '#FEF2F2', color: '#DC2626', label: 'Canceled' },
    past_due: { bg: '#FEF3C7', color: '#D97706', label: 'Past Due' },
    inactive: { bg: '#F1F5F9', color: '#64748B', label: 'Inactive' },
    none: { bg: '#F1F5F9', color: '#64748B', label: 'None' },
    submitted: { bg: '#EFF6FF', color: '#2563EB', label: 'Submitted' },
    approved: { bg: '#ECFDF5', color: '#059669', label: 'Approved' },
    rejected: { bg: '#FEF2F2', color: '#DC2626', label: 'Rejected' },
    pending_review: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
    unresolved: { bg: '#FEF2F2', color: '#DC2626', label: 'Unresolved' },
    resolved: { bg: '#ECFDF5', color: '#059669', label: 'Resolved' },
  };

  const config = statusConfig[status] || statusConfig.none;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: large ? '6px 14px' : '4px 10px',
      borderRadius: '6px',
      fontSize: large ? '13px' : '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
}

// Empty State
function EmptyState({ icon, title, description }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>{icon}</div>
      <h4 style={styles.emptyTitle}>{title}</h4>
      <p style={styles.emptyDesc}>{description}</p>
    </div>
  );
}

// ============================================================
// ICONS (Lucide-style)
// ============================================================

function LayoutDashboardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
}

function UsersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
}

function PlayCircleIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>;
}

function FileTextIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
}

function GitBranchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>;
}

function CreditCardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
}

function AlertTriangleIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
}

function SettingsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
}

function LogOutIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
}

function ChevronLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
}

function ChevronRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
}

function SearchIcon(props) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
}

function BellIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
}

function ArrowLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
}

function BuildingIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>;
}

function CheckCircleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}

function FileIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
}

function DollarSignIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
}

function RefreshCwIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
}

function XCircleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
}

function CalendarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
}

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
}

function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}

function WebhookIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"></path><path d="m6 17 3.13-5.78c.53-.97.43-2.17-.26-3.07a4 4 0 0 1 6.92-4.01c.31.55.49 1.16.53 1.79"></path><path d="m12 6 3.13 5.73A2 2 0 0 0 16.88 13H22"></path><circle cx="17" cy="17" r="3"></circle><circle cx="6" cy="6" r="3"></circle></svg>;
}

function UploadIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
}

// ============================================================
// STYLES
// ============================================================

const globalStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`;

const styles = {
  // Layout
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  // Loading
  loadingPage: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E2E8F0',
    borderTopColor: '#1B4DFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 16px',
  },
  loadingText: {
    color: '#64748B',
    fontSize: '14px',
  },

  // Sidebar
  sidebar: {
    background: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 100,
    transition: 'width 0.2s ease',
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: '1.2',
  },
  logoSubtext: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '500',
  },
  collapseBtn: {
    width: '28px',
    height: '28px',
    background: '#F1F5F9',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
  },
  sidebarNav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    width: '100%',
    textAlign: 'left',
  },
  navItemActive: {
    background: '#EFF6FF',
    color: '#1B4DFF',
  },
  navIcon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navLabel: {
    whiteSpace: 'nowrap',
  },
  alertDot: {
    width: '8px',
    height: '8px',
    background: '#EF4444',
    borderRadius: '50%',
    marginLeft: 'auto',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #E2E8F0',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#F8FAFC',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  adminAvatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0,
  },
  adminDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  adminName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
  },
  adminRole: {
    fontSize: '12px',
    color: '#64748B',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 12px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // Main Content
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-left 0.2s ease',
  },
  topBar: {
    background: '#FFFFFF',
    padding: '16px 32px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#64748B',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
  },
  searchForm: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#94A3B8',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '280px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 12px 10px 40px',
    fontSize: '14px',
    color: '#0F172A',
    outline: 'none',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    background: '#EF4444',
    borderRadius: '50%',
  },
  content: {
    padding: '32px',
    flex: 1,
    animation: 'fadeIn 0.3s ease',
  },

  // Alert Banner
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    marginBottom: '24px',
    color: '#DC2626',
    fontSize: '14px',
  },
  alertAction: {
    marginLeft: 'auto',
    background: '#DC2626',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Schedule Banner
  scheduleBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
    borderRadius: '12px',
    marginBottom: '24px',
    color: '#FFFFFF',
  },
  scheduleIcon: {
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  scheduleLabel: {
    fontSize: '13px',
    opacity: 0.9,
  },
  scheduleValue: {
    fontSize: '18px',
    fontWeight: '600',
  },
  scheduleBadge: {
    marginLeft: 'auto',
    background: 'rgba(255,255,255,0.2)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    gap: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  statCardAlert: {
    borderColor: '#FECACA',
    background: '#FFFBFB',
  },
  statIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '1',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '500',
  },
  statSubtext: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '4px',
  },

  // Section Header
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    margin: 0,
  },
  resultCount: {
    fontSize: '13px',
    color: '#64748B',
  },

  // Quick Actions
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  quickActionCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.15s ease',
  },
  quickActionIcon: {
    color: '#1B4DFF',
  },
  quickActionLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F172A',
  },

  // Table
  tableContainer: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  tr: {
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#0F172A',
    verticalAlign: 'middle',
  },
  companyCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  companyAvatar: {
    width: '36px',
    height: '36px',
    background: '#EFF6FF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1B4DFF',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0,
  },
  companyName: {
    fontWeight: '600',
    color: '#0F172A',
  },
  realmId: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '2px',
    fontFamily: 'monospace',
  },
  licenseCount: {
    background: '#EFF6FF',
    color: '#1B4DFF',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  planBadge: {
    background: '#F0FDF4',
    color: '#059669',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  noPlan: {
    color: '#94A3B8',
    fontSize: '13px',
  },
  viewBtn: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#0F172A',
    cursor: 'pointer',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Client Detail
  clientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    marginBottom: '24px',
  },
  clientHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  clientLargeAvatar: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: '22px',
    fontWeight: '600',
  },
  clientName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 4px 0',
  },
  clientMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#64748B',
  },
  metaDot: {
    color: '#CBD5E1',
  },
  clientHeaderRight: {},

  // Tabs
  tabsContainer: {
    display: 'flex',
    gap: '4px',
    background: '#F1F5F9',
    padding: '4px',
    borderRadius: '10px',
    marginBottom: '24px',
    width: 'fit-content',
  },
  tab: {
    padding: '10px 18px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabActive: {
    background: '#FFFFFF',
    color: '#0F172A',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  tabContent: {
    animation: 'fadeIn 0.2s ease',
  },

  // Info Cards
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  infoCardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E2E8F0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#64748B',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  connectionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  noData: {
    color: '#94A3B8',
    fontSize: '14px',
  },

  // Reports
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  reportCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  reportIcon: {
    color: '#1B4DFF',
    marginBottom: '12px',
  },
  reportTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    margin: '0 0 6px 0',
  },
  reportDesc: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '16px',
  },
  reportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0F172A',
    cursor: 'pointer',
  },

  // Mapping Rules
  rulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  ruleCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  ruleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    color: '#1B4DFF',
  },
  ruleName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    margin: 0,
  },
  ruleCount: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '16px',
  },
  ruleBtn: {
    width: '100%',
    background: '#EFF6FF',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1B4DFF',
    cursor: 'pointer',
  },

  // Billing
  planName: {
    fontWeight: '600',
    color: '#0F172A',
  },
  planPrice: {
    fontSize: '12px',
    color: '#64748B',
  },
  stripeId: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#64748B',
  },

  // Errors
  failureMessage: {
    color: '#DC2626',
    fontSize: '13px',
    fontWeight: '500',
  },
  failureCode: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#94A3B8',
    marginTop: '4px',
  },

  // Settings
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  settingsCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  settingsTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #E2E8F0',
  },

  // Empty State
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#CBD5E1',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    margin: '0 0 8px 0',
  },
  emptyDesc: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
};
