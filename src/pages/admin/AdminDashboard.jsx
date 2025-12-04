import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [licenseMappings, setLicenseMappings] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [tenantLogs, setTenantLogs] = useState([]);
  const [tenantLogFilters, setTenantLogFilters] = useState({ categories: [], actions: [], companies: [] });
  const [clientLicenses, setClientLicenses] = useState([]);
  const [clientDetail, setClientDetail] = useState(null);
  const [loadingClientDetail, setLoadingClientDetail] = useState(false);
  
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

  const fetchLicenseMappings = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/license-mappings`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setLicenseMappings(data.license_mappings || []);
    } catch (err) {
      console.error("Error fetching license mappings:", err);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/email-logs`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setEmailLogs(data.email_logs || []);
    } catch (err) {
      console.error("Error fetching email logs:", err);
    }
  };

  const fetchAdminLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/activity-logs`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setAdminLogs(data.activity_logs || []);
    } catch (err) {
      console.error("Error fetching admin logs:", err);
    }
  };

  const fetchWebhookLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/webhook-logs`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setWebhookLogs(data.webhook_logs || []);
    } catch (err) {
      console.error("Error fetching webhook logs:", err);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/system-logs`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSystemLogs(data.system_logs || []);
    } catch (err) {
      console.error("Error fetching system logs:", err);
    }
  };

  const fetchTenantLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/api/admin/tenant-logs`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setTenantLogs(data.tenant_logs || []);
      setTenantLogFilters(data.filters || { categories: [], actions: [], companies: [] });
    } catch (err) {
      console.error("Error fetching tenant logs:", err);
    }
  };

  const fetchClientDetail = async (realmId) => {
    setLoadingClientDetail(true);
    try {
      const response = await fetch(`${backendURL}/api/admin/clients/${realmId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setClientDetail(data);
      setClientLicenses(data.licenses || []);
    } catch (err) {
      console.error("Error fetching client detail:", err);
    } finally {
      setLoadingClientDetail(false);
    }
  };

  // Navigation handlers
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedClient(null);
    
    if (section === "clients" && clients.length === 0) fetchClients();
    if (section === "billing" && subscriptions.length === 0) fetchSubscriptions();
    if (section === "errors") {
      if (failedPayments.length === 0) fetchFailedPayments();
      if (webhookLogs.length === 0) fetchWebhookLogs();
      if (systemLogs.length === 0) fetchSystemLogs();
      if (emailLogs.length === 0) fetchEmailLogs();
      if (adminLogs.length === 0) fetchAdminLogs();
      if (tenantLogs.length === 0) fetchTenantLogs();
    }
    if (section === "runs" && submissions.length === 0) fetchSubmissions();
    if (section === "mapping" && licenseMappings.length === 0) fetchLicenseMappings();
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
    setClientDetail(null);
    setClientLicenses([]);
    fetchClientDetail(client.realm_id);
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
              clientDetail={clientDetail}
              clientLicenses={clientLicenses}
              loadingDetail={loadingClientDetail}
              activeTab={clientDetailTab}
              setActiveTab={setClientDetailTab}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
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
            <MappingRulesSection 
              licenseMappings={licenseMappings}
              formatDate={formatDate}
            />
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
              webhookLogs={webhookLogs}
              systemLogs={systemLogs}
              emailLogs={emailLogs}
              adminLogs={adminLogs}
              tenantLogs={tenantLogs}
              tenantLogFilters={tenantLogFilters}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
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
function ClientDetailSection({ client, clientDetail, clientLicenses, loadingDetail, activeTab, setActiveTab, formatDate, formatDateTime }) {
  const [selectedLicense, setSelectedLicense] = useState(null);
  
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "licenses", label: "Licenses", count: clientLicenses.length },
    { id: "quickbooks", label: "QuickBooks" },
    { id: "reports", label: "Reports" },
    { id: "runs", label: "Run History" },
  ];

  const detail = clientDetail || {};
  const company = detail.company || client;
  const subscription = detail.subscription || client.subscription;
  const user = detail.user;

  return (
    <div>
      {/* Client Header */}
      <div style={styles.clientHeader}>
        <div style={styles.clientHeaderLeft}>
          <div style={styles.clientLargeAvatar}>
            {(company.company_name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.clientName}>{company.company_name || "Unknown Company"}</h2>
            <div style={styles.clientMeta}>
              <span>{company.email || user?.email || "No email"}</span>
              <span style={styles.metaDot}>•</span>
              <span>Realm: {company.realm_id || client.realm_id}</span>
            </div>
          </div>
        </div>
        <div style={styles.clientHeaderRight}>
          <StatusBadge status={subscription?.status || "none"} large />
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
            {tab.count !== undefined && (
              <span style={{
                marginLeft: '6px',
                padding: '2px 8px',
                background: activeTab === tab.id ? '#1B4DFF' : '#E2E8F0',
                color: activeTab === tab.id ? '#fff' : '#64748B',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '600',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loadingDetail && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #E2E8F0', borderTopColor: '#1B4DFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
          Loading details...
        </div>
      )}

      {/* Tab Content */}
      {!loadingDetail && (
        <div style={styles.tabContent}>
          {activeTab === "overview" && (
            <div style={styles.overviewGrid}>
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Company Information</h4>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Legal Name</span>
                  <span style={styles.infoValue}>{company.legal_name || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Phone</span>
                  <span style={styles.infoValue}>{company.primary_phone || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Country</span>
                  <span style={styles.infoValue}>{company.country || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Onboarding</span>
                  <span style={styles.infoValue}>
                    {company.onboarding_completed === "true" ? (
                      <span style={{ color: '#10B981', fontWeight: '600' }}>Completed</span>
                    ) : (
                      <span style={{ color: '#F59E0B', fontWeight: '600' }}>In Progress</span>
                    )}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Created</span>
                  <span style={styles.infoValue}>{formatDate(company.created_at)}</span>
                </div>
              </div>

              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Subscription</h4>
                {subscription ? (
                  <>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Plan</span>
                      <span style={styles.infoValue}>
                        {subscription.plan ? (
                          <span style={{
                            padding: '4px 12px',
                            background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
                            color: '#fff',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}>
                            {subscription.plan.name} - {subscription.plan.price}
                          </span>
                        ) : "—"}
                      </span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Billing Cycle</span>
                      <span style={styles.infoValue}>{subscription.plan?.billing_cycle || "—"}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Licenses</span>
                      <span style={styles.infoValue}>
                        <span style={{ fontWeight: '700', color: '#1B4DFF', fontSize: '16px' }}>{subscription.quantity || 1}</span>
                      </span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Status</span>
                      <StatusBadge status={subscription.status} />
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Next Billing</span>
                      <span style={styles.infoValue}>{formatDate(subscription.end_date)}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Stripe ID</span>
                      <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>
                        {subscription.stripe_subscription_id?.slice(0, 24)}...
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>
                    No subscription
                  </div>
                )}
              </div>

              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>QuickBooks Connection</h4>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Status</span>
                  <span style={styles.infoValue}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                      <span style={{ color: '#10B981', fontWeight: '600' }}>Connected</span>
                    </span>
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Realm ID</span>
                  <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: '12px' }}>
                    {company.realm_id || client.realm_id}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Last Synced</span>
                  <span style={styles.infoValue}>{formatDateTime(company.last_synced_at) || "—"}</span>
                </div>
              </div>

              {user && (
                <div style={styles.infoCard}>
                  <h4 style={styles.infoCardTitle}>Account Owner</h4>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Name</span>
                    <span style={styles.infoValue}>{user.full_name || "—"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Email</span>
                    <span style={styles.infoValue}>{user.email || "—"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Phone</span>
                    <span style={styles.infoValue}>{user.phone || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "licenses" && (
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                  Licensed Franchises ({clientLicenses.length})
                </h4>
              </div>
              
              {clientLicenses.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Franchise #</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Owner</th>
                        <th style={styles.th}>Location</th>
                        <th style={styles.th}>QB Department</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientLicenses.map((lic, idx) => (
                        <tr key={idx} style={styles.tr}>
                          <td style={styles.td}>
                            <span style={styles.licenseCount}>#{lic.franchise_number}</span>
                          </td>
                          <td style={styles.td}>{lic.name || "—"}</td>
                          <td style={styles.td}>{lic.owner || "—"}</td>
                          <td style={styles.td}>
                            {lic.city && lic.state ? `${lic.city}, ${lic.state}` : "—"}
                          </td>
                          <td style={styles.td}>
                            <div style={{ fontSize: '13px' }}>{lic.qbo_department_name || "Not mapped"}</div>
                            {lic.qbo_department_id && (
                              <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                                ID: {lic.qbo_department_id}
                              </div>
                            )}
                          </td>
                          <td style={styles.td}>
                            <StatusBadge status={lic.is_active === "true" ? "active" : "inactive"} />
                          </td>
                          <td style={styles.td}>
                            <button 
                              onClick={() => setSelectedLicense(lic)}
                              style={styles.viewBtn}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState 
                  icon={<FileIcon />}
                  title="No franchises linked"
                  description="This client has not linked any franchises yet"
                />
              )}
            </div>
          )}

          {activeTab === "quickbooks" && (
            <div style={styles.overviewGrid}>
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Connection Status</h4>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Status</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
                    <span style={{ color: '#10B981', fontWeight: '600' }}>Connected</span>
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Realm ID</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{company.realm_id}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>QBO Company ID</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{company.qbo_id || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Domain</span>
                  <span>{company.domain || "QBO"}</span>
                </div>
              </div>
              
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Company Settings</h4>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Fiscal Year Start</span>
                  <span>{company.fiscal_year_start_month || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Timezone</span>
                  <span>{company.default_timezone || "—"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Languages</span>
                  <span>{company.supported_languages || "—"}</span>
                </div>
              </div>

              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>Sync Information</h4>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Last Synced</span>
                  <span>{formatDateTime(company.last_synced_at) || "Never"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Sync Token</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>{company.sync_token || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <EmptyState 
              icon={<FileTextIcon />}
              title="No reports yet"
              description="Reports will appear here after the first royalty run"
            />
          )}

          {activeTab === "runs" && (
            <div>
              {detail.recent_submissions && detail.recent_submissions.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.recent_submissions.map((sub) => (
                        <tr key={sub.id} style={styles.tr}>
                          <td style={styles.td}>#{sub.id}</td>
                          <td style={styles.td}>{sub.type || "—"}</td>
                          <td style={styles.td}><StatusBadge status={sub.status} /></td>
                          <td style={styles.td}>{formatDateTime(sub.submitted_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState 
                  icon={<PlayCircleIcon />}
                  title="No runs yet"
                  description="Run history will appear here after the first royalty run"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* License Detail Modal */}
      {selectedLicense && (
        <LicenseDetailModal 
          license={selectedLicense} 
          onClose={() => setSelectedLicense(null)} 
        />
      )}
    </div>
  );
}

// License Detail Modal
function LicenseDetailModal({ license, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              Franchise #{license.franchise_number}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {license.name || "Unnamed Franchise"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Franchise Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Franchise #" value={`#${license.franchise_number}`} highlight />
              <InfoRowCompact label="Name" value={license.name || "—"} />
              <InfoRowCompact label="Owner" value={license.owner || "—"} />
              <InfoRowCompact label="Address" value={license.address || "—"} />
              <InfoRowCompact label="City" value={license.city || "—"} />
              <InfoRowCompact label="State" value={license.state || "—"} />
              <InfoRowCompact label="ZIP Code" value={license.zip_code || "—"} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              QuickBooks Mapping
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Department Name" value={license.qbo_department_name || "Not mapped"} />
              <InfoRowCompact label="Department ID" value={license.qbo_department_id || "—"} mono />
              <InfoRowCompact label="Status" value={license.is_active === "true" ? "Active" : "Inactive"} status={license.is_active === "true" ? "active" : "inactive"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Row Compact
function InfoRowCompact({ label, value, highlight, mono, status }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
      <span style={{ color: '#64748B', fontSize: '13px' }}>{label}</span>
      <span style={{ 
        fontWeight: highlight ? '700' : '500', 
        color: highlight ? '#1B4DFF' : '#0F172A',
        fontFamily: mono ? 'monospace' : 'inherit',
        fontSize: mono ? '12px' : '13px',
      }}>
        {status ? <StatusBadge status={status} /> : value}
      </span>
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
function MappingRulesSection({ licenseMappings, formatDate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [hoveredMapping, setHoveredMapping] = useState(null);

  // Get unique companies for filter
  const companies = [...new Set(licenseMappings.map(m => m.company_name).filter(Boolean))];
  
  // Apply filters
  const filteredMappings = licenseMappings.filter(m => {
    const matchesSearch = !searchTerm || 
      m.franchise_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.license_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.license_city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && m.is_active === "true") ||
      (filterStatus === "inactive" && m.is_active !== "true");
    
    const matchesCompany = filterCompany === "all" || m.company_name === filterCompany;
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const activeMappings = licenseMappings.filter(m => m.is_active === "true");
  const inactiveMappings = licenseMappings.filter(m => m.is_active !== "true");

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#1B4DFF', background: '#EFF6FF' }}>
            <GitBranchIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#1B4DFF' }}>{licenseMappings.length}</div>
            <div style={styles.statLabel}>Total Mappings</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#10B981', background: '#ECFDF5' }}>
            <CheckCircleIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#10B981' }}>{activeMappings.length}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#F59E0B', background: '#FEF3C7' }}>
            <XCircleIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#F59E0B' }}>{inactiveMappings.length}</div>
            <div style={styles.statLabel}>Inactive</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#8B5CF6', background: '#F3E8FF' }}>
            <BuildingIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#8B5CF6' }}>{companies.length}</div>
            <div style={styles.statLabel}>Companies</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search franchises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {/* Company Filter */}
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '180px',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Companies</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {(searchTerm || filterStatus !== "all" || filterCompany !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterCompany("all");
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          Showing {filteredMappings.length} of {licenseMappings.length}
        </span>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Franchise #</th>
              <th style={styles.th}>License Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>QB Department</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMappings.map((mapping) => (
              <tr 
                key={mapping.id} 
                style={{
                  ...styles.tr,
                  background: hoveredMapping === mapping.id ? '#F8FAFC' : 'transparent',
                }}
                onMouseEnter={() => setHoveredMapping(mapping.id)}
                onMouseLeave={() => setHoveredMapping(null)}
              >
                <td style={styles.td}>
                  <div style={styles.companyName}>{mapping.company_name || "Unknown"}</div>
                  <div style={styles.realmId}>{mapping.realm_id?.slice(0, 12)}...</div>
                </td>
                <td style={styles.td}>
                  <span style={styles.licenseCount}>#{mapping.franchise_number}</span>
                </td>
                <td style={styles.td}>{mapping.license_name || "—"}</td>
                <td style={styles.td}>
                  {mapping.license_city && mapping.license_state 
                    ? `${mapping.license_city}, ${mapping.license_state}`
                    : "—"
                  }
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: '13px' }}>{mapping.qbo_department_name || "—"}</div>
                  {mapping.qbo_department_id && (
                    <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      ID: {mapping.qbo_department_id}
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  <StatusBadge status={mapping.is_active === "true" ? "active" : "inactive"} />
                </td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedMapping(mapping)}
                    style={styles.viewBtn}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMappings.length === 0 && (
          <EmptyState 
            icon={<GitBranchIcon />}
            title={searchTerm || filterStatus !== "all" || filterCompany !== "all" ? "No matching results" : "No license mappings"}
            description={searchTerm || filterStatus !== "all" || filterCompany !== "all" ? "Try adjusting your search or filters" : "License mappings will appear here when clients configure their franchises"}
          />
        )}
      </div>

      {/* Mapping Detail Modal */}
      {selectedMapping && (
        <MappingDetailModal 
          mapping={selectedMapping} 
          onClose={() => setSelectedMapping(null)} 
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Mapping Detail Modal
function MappingDetailModal({ mapping, onClose, formatDate }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                padding: '6px 14px',
                background: '#EFF6FF',
                color: '#1B4DFF',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                #{mapping.franchise_number}
              </span>
              <StatusBadge status={mapping.is_active === "true" ? "active" : "inactive"} />
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
              {mapping.license_name || "Unnamed License"}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {mapping.company_name}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                License Information
              </h4>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
                <InfoRowCompact label="Franchise #" value={`#${mapping.franchise_number}`} highlight />
                <InfoRowCompact label="Name" value={mapping.license_name || "—"} />
                <InfoRowCompact label="Owner" value={mapping.license_owner || "—"} />
                <InfoRowCompact label="City" value={mapping.license_city || "—"} />
                <InfoRowCompact label="State" value={mapping.license_state || "—"} />
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                QuickBooks Mapping
              </h4>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
                <InfoRowCompact label="Department" value={mapping.qbo_department_name || "Not mapped"} />
                <InfoRowCompact label="Dept ID" value={mapping.qbo_department_id || "—"} mono />
                <InfoRowCompact label="Status" value={mapping.is_active === "true" ? "Active" : "Inactive"} status={mapping.is_active === "true" ? "active" : "inactive"} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Company & Sync Info
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Company" value={mapping.company_name || "—"} />
              <InfoRowCompact label="Realm ID" value={mapping.realm_id || "—"} mono />
              <InfoRowCompact label="Created" value={formatDate(mapping.created_at)} />
              <InfoRowCompact label="Last Synced" value={formatDate(mapping.last_synced_at)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Billing Section
function BillingSection({ subscriptions, formatDate }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  
  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const canceledCount = subscriptions.filter(s => s.status === "canceled").length;
  const totalLicenses = subscriptions.reduce((acc, s) => acc + (s.quantity || 0), 0);
  
  const filteredSubscriptions = subscriptions.filter(s => {
    const matchesSearch = !searchTerm || 
      s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#1B4DFF', background: '#EFF6FF' }}>
            <CreditCardIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#1B4DFF' }}>{subscriptions.length}</div>
            <div style={styles.statLabel}>Total Subscriptions</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#10B981', background: '#ECFDF5' }}>
            <CheckCircleIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#10B981' }}>{activeCount}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#EF4444', background: '#FEF2F2' }}>
            <XCircleIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#EF4444' }}>{canceledCount}</div>
            <div style={styles.statLabel}>Canceled</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, color: '#8B5CF6', background: '#F3E8FF' }}>
            <FileIcon />
          </div>
          <div style={styles.statContent}>
            <div style={{ ...styles.statValue, color: '#8B5CF6' }}>{totalLicenses}</div>
            <div style={styles.statLabel}>Total Licenses</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search by company or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="canceled">Canceled</option>
          <option value="past_due">Past Due</option>
        </select>

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          Showing {filteredSubscriptions.length} of {subscriptions.length}
        </span>
      </div>

      {/* Table */}
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
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((sub) => (
              <tr key={sub.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.companyName}>{sub.company_name}</div>
                  <div style={styles.realmId}>{sub.company_email}</div>
                </td>
                <td style={styles.td}>
                  {sub.plan ? (
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}>
                        {sub.plan.name}
                      </span>
                      <div style={styles.planPrice}>{sub.plan.billing_cycle} - {sub.plan.price}</div>
                    </div>
                  ) : "—"}
                </td>
                <td style={styles.td}>
                  <span style={{
                    fontWeight: '700',
                    color: '#1B4DFF',
                    fontSize: '16px',
                  }}>
                    {sub.quantity}
                  </span>
                </td>
                <td style={styles.td}>
                  <StatusBadge status={sub.status} />
                </td>
                <td style={styles.td}>{formatDate(sub.end_date)}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => setSelectedSubscription(sub)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#1B4DFF',
                      fontWeight: '500',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  >
                    {sub.stripe_subscription_id?.slice(0, 20)}...
                  </button>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => setSelectedSubscription(sub)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubscriptions.length === 0 && (
          <EmptyState 
            icon={<CreditCardIcon />}
            title={searchTerm || filterStatus !== "all" ? "No matching subscriptions" : "No subscriptions"}
            description={searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Subscriptions will appear here when clients subscribe"}
          />
        )}
      </div>

      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <SubscriptionDetailModal 
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Subscription Detail Modal
function SubscriptionDetailModal({ subscription, onClose, formatDate }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSyncQuantity = async () => {
    if (!window.confirm(`Sync subscription quantity for ${subscription.company_name}? This will update billing based on their active licenses.`)) {
      return;
    }
    
    setSyncing(true);
    setSyncResult(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${backendURL}/admin/subscriptions/${subscription.realm_id}/sync-quantity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSyncResult({ success: true, ...data });
      } else {
        setSyncResult({ success: false, error: data.detail || 'Sync failed' });
      }
    } catch (err) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {subscription.plan && (
                <span style={{
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}>
                  {subscription.plan.name}
                </span>
              )}
              <StatusBadge status={subscription.status} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              {subscription.company_name}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {subscription.company_email}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subscription Details
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Status" value={subscription.status} status={subscription.status === 'active' ? 'active' : 'inactive'} />
              <InfoRowCompact label="Plan" value={subscription.plan?.name || "—"} />
              <InfoRowCompact label="Billing Cycle" value={subscription.plan?.billing_cycle || "—"} />
              <InfoRowCompact label="Price" value={subscription.plan?.price || "—"} />
              <InfoRowCompact label="Licenses" value={subscription.quantity} highlight />
              <InfoRowCompact label="Start Date" value={formatDate(subscription.start_date)} />
              <InfoRowCompact label="Next Billing" value={formatDate(subscription.end_date)} />
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Stripe Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>Subscription ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0F172A' }}>
                    {subscription.stripe_subscription_id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(subscription.stripe_subscription_id)}
                    style={{
                      padding: '4px 8px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      color: '#1B4DFF',
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B', fontSize: '13px' }}>Customer ID</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0F172A' }}>
                    {subscription.stripe_customer_id || "—"}
                  </span>
                  {subscription.stripe_customer_id && (
                    <button
                      onClick={() => copyToClipboard(subscription.stripe_customer_id)}
                      style={{
                        padding: '4px 8px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        color: '#1B4DFF',
                      }}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
              <InfoRowCompact label="Realm ID" value={subscription.realm_id} mono />
            </div>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: syncResult.success ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${syncResult.success ? '#A7F3D0' : '#FECACA'}`,
              borderRadius: '8px',
              fontSize: '14px',
            }}>
              {syncResult.success ? (
                <div style={{ color: '#059669' }}>
                  {syncResult.no_change ? (
                    <span>Already synced: {syncResult.quantity} licenses</span>
                  ) : (
                    <span>Updated: {syncResult.old_quantity} → {syncResult.new_quantity} licenses</span>
                  )}
                </div>
              ) : (
                <div style={{ color: '#DC2626' }}>{syncResult.error}</div>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {subscription.status === 'active' && (
              <button
                onClick={handleSyncQuantity}
                disabled={syncing}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: syncing ? '#94A3B8' : '#D97706',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {syncing ? (
                  <>
                    <span style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}></span>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                    Sync Quantity
                  </>
                )}
              </button>
            )}
            <a
              href={`https://dashboard.stripe.com/subscriptions/${subscription.stripe_subscription_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, #635BFF 0%, #7A73FF 100%)',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '13px',
              }}
            >
              View in Stripe Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Errors Section
function ErrorsSection({ failedPayments, webhookLogs, systemLogs, emailLogs, adminLogs, tenantLogs, tenantLogFilters, formatDate, formatDateTime, formatCurrency }) {
  const [activeTab, setActiveTab] = useState("payments");
  
  const tabs = [
    { id: "payments", label: "Failed Payments", count: failedPayments.length },
    { id: "webhooks", label: "Webhook Logs", count: webhookLogs.length },
    { id: "system", label: "System Logs", count: systemLogs.length },
    { id: "emails", label: "Email Logs", count: emailLogs.length },
    { id: "tenant", label: "Tenant Activity", count: tenantLogs.length },
    { id: "admin", label: "Admin Activity", count: adminLogs.length },
  ];
  
  return (
    <div>
      <div style={{ ...styles.tabsContainer, flexWrap: 'wrap' }}>
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
            <span style={{
              marginLeft: '6px',
              padding: '2px 8px',
              background: activeTab === tab.id ? '#1B4DFF' : '#E2E8F0',
              color: activeTab === tab.id ? '#fff' : '#64748B',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Failed Payments Tab */}
      {activeTab === "payments" && (
        <FailedPaymentsTab 
          failedPayments={failedPayments}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Webhook Logs Tab */}
      {activeTab === "webhooks" && (
        <WebhookLogsTab 
          webhookLogs={webhookLogs}
          formatDateTime={formatDateTime}
        />
      )}

      {/* System Logs Tab */}
      {activeTab === "system" && (
        <SystemLogsTab 
          systemLogs={systemLogs}
          formatDateTime={formatDateTime}
        />
      )}

      {/* Email Logs Tab */}
      {activeTab === "emails" && (
        <EmailLogsTab 
          emailLogs={emailLogs}
          formatDateTime={formatDateTime}
        />
      )}

      {/* Tenant Activity Tab */}
      {activeTab === "tenant" && (
        <TenantActivityTab 
          tenantLogs={tenantLogs}
          tenantLogFilters={tenantLogFilters}
          formatDateTime={formatDateTime}
        />
      )}

      {/* Admin Activity Tab */}
      {activeTab === "admin" && (
        <AdminActivityTab 
          adminLogs={adminLogs} 
          formatDateTime={formatDateTime} 
        />
      )}
    </div>
  );
}

// Admin Activity Tab Component
function AdminActivityTab({ adminLogs, formatDateTime }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterAction, setFilterAction] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const actions = [...new Set(adminLogs.map(l => l.action).filter(Boolean))];
  
  const filteredLogs = adminLogs.filter(l => {
    const matchesAction = filterAction === "all" || l.action === filterAction;
    const matchesSearch = !searchTerm ||
      l.admin_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search admin activity..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Actions</option>
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
        
        {(searchTerm || filterAction !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterAction("all");
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
        
        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          {filteredLogs.length} entries
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Admin</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Resource</th>
              <th style={styles.th}>IP Address</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #1B4DFF 0%, #3B6FFF 100%)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {log.admin_username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '500' }}>{log.admin_username}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <ActionBadge action={log.action} />
                </td>
                <td style={styles.td}>
                  {log.resource_type ? (
                    <span style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: '500' }}>{log.resource_type}</span>
                      {log.resource_id && (
                        <span style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '11px' }}>
                          {' / '}{log.resource_id.slice(0, 12)}...
                        </span>
                      )}
                    </span>
                  ) : "—"}
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748B' }}>
                    {log.ip_address || "—"}
                  </span>
                </td>
                <td style={styles.td}>{formatDateTime(log.created_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <EmptyState 
            icon={<UsersIcon />}
            title="No admin activity"
            description="Admin actions will be logged here"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <AdminLogDetailModal 
          log={selectedLog} 
          onClose={() => setSelectedLog(null)}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

// Admin Log Detail Modal
function AdminLogDetailModal({ log, onClose, formatDateTime }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ActionBadge action={log.action} />
              <span style={{ color: '#64748B', fontSize: '13px' }}>
                {formatDateTime(log.created_at)}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              Admin Activity Details
            </h3>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          {/* Admin Info */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admin Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Username" value={log.admin_username} />
              <InfoRowCompact label="Action" value={log.action} mono />
              <InfoRowCompact label="IP Address" value={log.ip_address || "—"} mono />
            </div>
          </div>

          {/* Resource Info */}
          {(log.resource_type || log.resource_id) && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Resource
              </h4>
              <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
                <InfoRowCompact label="Type" value={log.resource_type || "—"} />
                <InfoRowCompact label="ID" value={log.resource_id || "—"} mono />
              </div>
            </div>
          )}

          {/* Details JSON */}
          {log.details && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Details (JSON)
              </h4>
              <div style={{
                background: '#0F172A',
                borderRadius: '10px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Action Badge
function ActionBadge({ action }) {
  const getActionColor = (action) => {
    if (action?.includes('view')) return { bg: '#EFF6FF', color: '#1B4DFF' };
    if (action?.includes('login')) return { bg: '#ECFDF5', color: '#059669' };
    if (action?.includes('create') || action?.includes('add')) return { bg: '#F0FDF4', color: '#16A34A' };
    if (action?.includes('delete') || action?.includes('remove')) return { bg: '#FEF2F2', color: '#DC2626' };
    if (action?.includes('update') || action?.includes('edit')) return { bg: '#FEF3C7', color: '#D97706' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };
  
  const colors = getActionColor(action);
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      color: colors.color,
      fontFamily: 'monospace',
    }}>
      {action}
    </span>
  );
}

// Email Logs Tab Component
function EmailLogsTab({ emailLogs, formatDateTime }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const types = [...new Set(emailLogs.map(l => l.email_type).filter(Boolean))];
  
  const filteredLogs = emailLogs.filter(log => {
    const matchesType = filterType === "all" || log.email_type === filterType;
    const matchesSearch = !searchTerm || 
      log.recipient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '8px 32px 8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span style={{ color: '#64748B', fontSize: '13px' }}>
          {filteredLogs.length} emails
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Recipient</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Sent</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>{log.recipient_email}</td>
                <td style={styles.td}>
                  <div
                    style={{
                      maxWidth: '250px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'help',
                    }}
                    title={log.subject}
                  >
                    {log.subject}
                  </div>
                </td>
                <td style={styles.td}>
                  <EmailTypeBadge type={log.email_type} />
                </td>
                <td style={styles.td}>{log.company_name || "—"}</td>
                <td style={styles.td}>
                  <StatusBadge status={log.status === 'sent' ? 'active' : log.status === 'failed' ? 'rejected' : 'pending_review'} />
                </td>
                <td style={styles.td}>{formatDateTime(log.sent_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedEmail(log)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <EmptyState 
            icon={<MailIcon />}
            title="No email logs"
            description="Sent emails will appear here"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailDetailModal 
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

// Email Type Badge
function EmailTypeBadge({ type }) {
  const getTypeColor = (type) => {
    if (type === 'welcome') return { bg: '#ECFDF5', color: '#059669' };
    if (type === 'billing') return { bg: '#EFF6FF', color: '#1B4DFF' };
    if (type === 'report') return { bg: '#F3E8FF', color: '#8B5CF6' };
    if (type === 'notification') return { bg: '#FEF3C7', color: '#D97706' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };
  
  const colors = getTypeColor(type);
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      color: colors.color,
    }}>
      {type}
    </span>
  );
}

// Email Detail Modal
function EmailDetailModal({ email, onClose, formatDateTime }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <EmailTypeBadge type={email.email_type} />
              <StatusBadge status={email.status === 'sent' ? 'active' : 'rejected'} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              Email Details
            </h3>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Recipient" value={email.recipient_email} />
              <InfoRowCompact label="Company" value={email.company_name || "—"} />
              <InfoRowCompact label="Type" value={email.email_type} />
              <InfoRowCompact label="Sent At" value={formatDateTime(email.sent_at)} />
              <InfoRowCompact label="Resend ID" value={email.resend_id || "—"} mono />
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Subject
            </h4>
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '14px',
              color: '#0F172A',
              lineHeight: '1.6',
            }}>
              {email.subject}
            </div>
          </div>

          {email.error_message && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Error Message
              </h4>
              <div style={{
                background: '#FEF2F2',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '13px',
                color: '#DC2626',
                fontFamily: 'monospace',
              }}>
                {email.error_message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tenant Activity Tab Component
function TenantActivityTab({ tenantLogs, tenantLogFilters, formatDateTime }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const filteredLogs = tenantLogs.filter(log => {
    const matchesCategory = filterCategory === "all" || log.category === filterCategory;
    const matchesCompany = filterCompany === "all" || log.realm_id === filterCompany;
    const matchesSearch = !searchTerm || 
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesCompany && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search tenant activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Categories</option>
          {tenantLogFilters.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '180px',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Companies</option>
          {tenantLogFilters.companies.map(c => (
            <option key={c.realm_id} value={c.realm_id}>{c.name}</option>
          ))}
        </select>

        {(searchTerm || filterCategory !== "all" || filterCompany !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setFilterCompany("all");
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          {filteredLogs.length} logs
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>IP</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ fontWeight: '500' }}>{log.company_name || "—"}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    {log.realm_id?.slice(0, 12)}...
                  </div>
                </td>
                <td style={styles.td}>{log.user_email || "—"}</td>
                <td style={styles.td}>
                  <ActionBadge action={log.action} />
                </td>
                <td style={styles.td}>
                  <CategoryBadge category={log.category} />
                </td>
                <td style={styles.td}>
                  <div 
                    style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help' }}
                    title={log.description || "—"}
                  >
                    {log.description || "—"}
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>
                    {log.ip_address || "—"}
                  </span>
                </td>
                <td style={styles.td}>{formatDateTime(log.created_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <EmptyState 
            icon={<UsersIcon />}
            title="No tenant activity"
            description="Tenant/user actions will be logged here"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <TenantLogDetailModal 
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

// Category Badge
function CategoryBadge({ category }) {
  const getCategoryColor = (cat) => {
    if (cat === 'auth') return { bg: '#ECFDF5', color: '#059669' };
    if (cat === 'billing') return { bg: '#EFF6FF', color: '#1B4DFF' };
    if (cat === 'license') return { bg: '#F3E8FF', color: '#8B5CF6' };
    if (cat === 'report') return { bg: '#FEF3C7', color: '#D97706' };
    if (cat === 'settings') return { bg: '#F1F5F9', color: '#64748B' };
    if (cat === 'qbo') return { bg: '#ECFDF5', color: '#10B981' };
    return { bg: '#F1F5F9', color: '#64748B' };
  };
  
  const colors = getCategoryColor(category);
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.bg,
      color: colors.color,
      textTransform: 'uppercase',
    }}>
      {category}
    </span>
  );
}

// Failed Payments Tab Component
function FailedPaymentsTab({ failedPayments, formatDate, formatCurrency }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const filteredPayments = failedPayments.filter(p => {
    const matchesSearch = !searchTerm ||
      p.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.failure_message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search failed payments..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Status</option>
          <option value="unresolved">Unresolved</option>
          <option value="resolved">Resolved</option>
        </select>
        
        {(searchTerm || filterStatus !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          {filteredPayments.length} failed payments
        </span>
      </div>

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
            {paginatedPayments.map((payment) => (
              <tr key={payment.id} style={styles.tr}>
                <td style={styles.td}>{payment.company_name || "Unknown"}</td>
                <td style={styles.td}>{payment.customer_email || "—"}</td>
                <td style={styles.td}>{formatCurrency(payment.amount)}</td>
                <td style={styles.td}>
                  <div 
                    style={{ ...styles.failureMessage, cursor: 'help' }}
                    title={payment.failure_message}
                  >
                    {payment.failure_message}
                  </div>
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
        {filteredPayments.length === 0 && (
          <EmptyState 
            icon={<CheckCircleIcon />}
            title="No failed payments"
            description="All payments are processing correctly"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredPayments.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderTop: '1px solid #E2E8F0',
      marginTop: '16px',
    }}>
      <span style={{ fontSize: '13px', color: '#64748B' }}>
        Showing {startItem} to {endItem} of {totalItems} entries
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            background: currentPage === 1 ? '#F8FAFC' : '#fff',
            color: currentPage === 1 ? '#94A3B8' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            background: currentPage === 1 ? '#F8FAFC' : '#fff',
            color: currentPage === 1 ? '#94A3B8' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          Prev
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '8px 12px',
              border: '1px solid',
              borderColor: page === currentPage ? '#1B4DFF' : '#E2E8F0',
              borderRadius: '6px',
              background: page === currentPage ? '#1B4DFF' : '#fff',
              color: page === currentPage ? '#fff' : '#374151',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: page === currentPage ? '600' : '400',
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            background: currentPage === totalPages ? '#F8FAFC' : '#fff',
            color: currentPage === totalPages ? '#94A3B8' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            background: currentPage === totalPages ? '#F8FAFC' : '#fff',
            color: currentPage === totalPages ? '#94A3B8' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          Last
        </button>
      </div>
    </div>
  );
}

// System Logs Tab Component
function SystemLogsTab({ systemLogs, formatDateTime }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const levels = [...new Set(systemLogs.map(l => l.level).filter(Boolean))];
  const sources = [...new Set(systemLogs.map(l => l.source).filter(Boolean))];
  
  const filteredLogs = systemLogs.filter(log => {
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesSource = filterSource === "all" || log.source === filterSource;
    const matchesSearch = !searchTerm || 
      log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSource && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        
        <select
          value={filterLevel}
          onChange={(e) => { setFilterLevel(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <select
          value={filterSource}
          onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>

        {(searchTerm || filterLevel !== "all" || filterSource !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterLevel("all");
              setFilterSource("all");
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          {filteredLogs.length} logs
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>
                  <LogLevelBadge level={log.level} />
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.source}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.action}</span>
                </td>
                <td style={styles.td}>
                  <div 
                    style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'help' }}
                    title={log.message}
                  >
                    {log.message}
                  </div>
                </td>
                <td style={styles.td}>{log.company_name || "—"}</td>
                <td style={styles.td}>{formatDateTime(log.created_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <EmptyState 
            icon={<FileTextIcon />}
            title="No system logs"
            description="System activity will appear here"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <SystemLogDetailModal 
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

// System Log Detail Modal
function SystemLogDetailModal({ log, onClose, formatDateTime }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <LogLevelBadge level={log.level} />
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748B' }}>{log.source}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              System Log Details
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {formatDateTime(log.created_at)}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Log Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Level" value={log.level} />
              <InfoRowCompact label="Source" value={log.source} mono />
              <InfoRowCompact label="Action" value={log.action} mono />
              <InfoRowCompact label="Company" value={log.company_name || "—"} />
              {log.duration_ms && <InfoRowCompact label="Duration" value={`${log.duration_ms}ms`} />}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Message
            </h4>
            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '14px',
              color: '#0F172A',
              lineHeight: '1.6',
              wordBreak: 'break-word',
            }}>
              {log.message}
            </div>
          </div>

          {log.details && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Details (JSON)
              </h4>
              <div style={{
                background: '#0F172A',
                borderRadius: '10px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {log.error_traceback && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Error Traceback
              </h4>
              <div style={{
                background: '#FEF2F2',
                borderRadius: '10px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#DC2626',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {log.error_traceback}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Webhook Logs Tab Component
function WebhookLogsTab({ webhookLogs, formatDateTime }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const sources = [...new Set(webhookLogs.map(l => l.source).filter(Boolean))];
  
  const filteredLogs = webhookLogs.filter(log => {
    const matchesSource = filterSource === "all" || log.source === filterSource;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesSearch = !searchTerm || 
      log.event_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesStatus && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <SearchIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', width: '16px', height: '16px' }} />
          <input
            type="text"
            placeholder="Search webhooks..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '13px',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>
        
        <select
          value={filterSource}
          onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Sources</option>
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 32px 10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          <option value="all">All Status</option>
          <option value="processed">Processed</option>
          <option value="received">Received</option>
          <option value="failed">Failed</option>
        </select>

        {(searchTerm || filterSource !== "all" || filterStatus !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterSource("all");
              setFilterStatus("all");
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#64748B', fontSize: '13px' }}>
          {filteredLogs.length} webhooks
        </span>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Event Type</th>
              <th style={styles.th}>Event ID</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Time (ms)</th>
              <th style={styles.th}>Received</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: log.source === 'stripe' ? '#EFF6FF' : '#F0FDF4',
                    color: log.source === 'stripe' ? '#1B4DFF' : '#059669',
                  }}>
                    {log.source}
                  </span>
                </td>
                <td style={styles.td}>
                  <span 
                    style={{ fontFamily: 'monospace', fontSize: '12px', cursor: 'help' }}
                    title={log.event_type}
                  >
                    {log.event_type}
                  </span>
                </td>
                <td style={styles.td}>
                  <span 
                    style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B', cursor: 'help' }}
                    title={log.event_id}
                  >
                    {log.event_id?.slice(0, 20)}...
                  </span>
                </td>
                <td style={styles.td}>{log.company_name || "—"}</td>
                <td style={styles.td}>
                  <StatusBadge status={log.status === 'processed' ? 'active' : log.status === 'failed' ? 'rejected' : 'pending_review'} />
                </td>
                <td style={styles.td}>{log.processing_time_ms || "—"}</td>
                <td style={styles.td}>{formatDateTime(log.created_at)}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => setSelectedLog(log)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <EmptyState 
            icon={<WebhookIcon />}
            title="No webhook logs"
            description="Webhook activity will appear here"
          />
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <WebhookLogDetailModal 
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
}

// Webhook Log Detail Modal
function WebhookLogDetailModal({ log, onClose, formatDateTime }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: log.source === 'stripe' ? '#EFF6FF' : '#F0FDF4',
                color: log.source === 'stripe' ? '#1B4DFF' : '#059669',
              }}>
                {log.source}
              </span>
              <StatusBadge status={log.status === 'processed' ? 'active' : log.status === 'failed' ? 'rejected' : 'pending_review'} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              {log.event_type}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {formatDateTime(log.created_at)}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Webhook Information
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Source" value={log.source} />
              <InfoRowCompact label="Event Type" value={log.event_type} mono />
              <InfoRowCompact label="Status" value={log.status} status={log.status === 'processed' ? 'active' : 'inactive'} />
              <InfoRowCompact label="Processing Time" value={log.processing_time_ms ? `${log.processing_time_ms}ms` : "—"} />
              <InfoRowCompact label="Company" value={log.company_name || "—"} />
              <InfoRowCompact label="Realm ID" value={log.realm_id || "—"} mono />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Event ID
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: '#F8FAFC',
                borderRadius: '10px',
                padding: '12px 16px',
                fontFamily: 'monospace',
                fontSize: '13px',
                flex: 1,
                wordBreak: 'break-all',
              }}>
                {log.event_id}
              </div>
              <button
                onClick={() => copyToClipboard(log.event_id)}
                style={{
                  padding: '12px 16px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#1B4DFF',
                  fontWeight: '500',
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {log.payload && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Payload (JSON)
              </h4>
              <div style={{
                background: '#0F172A',
                borderRadius: '10px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {log.error_message && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Error Message
              </h4>
              <div style={{
                background: '#FEF2F2',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '13px',
                color: '#DC2626',
              }}>
                {log.error_message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tenant Log Detail Modal
function TenantLogDetailModal({ log, onClose, formatDateTime }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ActionBadge action={log.action} />
              <CategoryBadge category={log.category} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>
              Tenant Activity Details
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748B' }}>
              {formatDateTime(log.created_at)}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: '#F1F5F9',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
          }}>
            <XCircleIcon />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Company & User
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Company" value={log.company_name || "—"} />
              <InfoRowCompact label="Realm ID" value={log.realm_id} mono />
              <InfoRowCompact label="User Email" value={log.user_email || "—"} />
              <InfoRowCompact label="IP Address" value={log.ip_address || "—"} mono />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Activity
            </h4>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px' }}>
              <InfoRowCompact label="Action" value={log.action} />
              <InfoRowCompact label="Category" value={log.category} />
              {log.description && <InfoRowCompact label="Description" value={log.description} />}
            </div>
          </div>

          {log.details && (
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Details (JSON)
              </h4>
              <div style={{
                background: '#0F172A',
                borderRadius: '10px',
                padding: '16px',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                <pre style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Log Level Badge
function LogLevelBadge({ level }) {
  const config = {
    INFO: { bg: '#EFF6FF', color: '#1B4DFF' },
    WARNING: { bg: '#FEF3C7', color: '#D97706' },
    ERROR: { bg: '#FEF2F2', color: '#DC2626' },
    DEBUG: { bg: '#F1F5F9', color: '#64748B' },
  };
  
  const style = config[level] || config.INFO;
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: style.bg,
      color: style.color,
    }}>
      {level}
    </span>
  );
}

// Settings Section
function SettingsSection({ adminUsername }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadError('Please select a CSV file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${backendURL}/admin/licenses/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult(data);
      } else {
        setUploadError(data.detail || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Error uploading file: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSyncAllSubscriptions = async () => {
    if (!window.confirm('This will update ALL active subscriptions to match their active license counts. Billing may be affected. Continue?')) {
      return;
    }

    setSyncingAll(true);
    setSyncResult(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${backendURL}/admin/subscriptions/sync-all-quantities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setSyncResult(data);
    } catch (err) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setSyncingAll(false);
    }
  };

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

      {/* Franchise CSV Upload Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Update ServPro Franchises</h3>
        </div>
        
        <div style={{
          ...styles.settingsCard,
          marginTop: '16px',
          maxWidth: '800px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#EFF6FF',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B4DFF" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                Upload Franchise CSV
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                Upload a CSV file to update the franchise/license database. Existing franchises will be updated, new ones will be created.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: uploading ? '#94A3B8' : '#1B4DFF',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {uploading ? (
                    <>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      Select CSV File
                    </>
                  )}
                </label>
                
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Required columns: franchise_number (name, owner, city, state, zip_code are optional)
                </span>
              </div>
            </div>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {uploadError}
            </div>
          )}

          {/* Upload Success */}
          {uploadResult && uploadResult.success && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#059669' }}>
                  CSV Processed Successfully
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>{uploadResult.summary.total_rows}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Total Rows</div>
                </div>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>{uploadResult.summary.created}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Created</div>
                </div>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#1B4DFF' }}>{uploadResult.summary.updated}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Updated</div>
                </div>
                <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: uploadResult.summary.errors > 0 ? '#DC2626' : '#94A3B8' }}>{uploadResult.summary.errors}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Errors</div>
                </div>
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#FEF2F2', borderRadius: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#DC2626', marginBottom: '8px' }}>Errors:</div>
                  {uploadResult.errors.slice(0, 5).map((err, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#991B1B', marginBottom: '4px' }}>
                      Row {err.row}: {err.error || err.reason}
                    </div>
                  ))}
                  {uploadResult.errors.length > 5 && (
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                      ...and {uploadResult.errors.length - 5} more errors
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Sync Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Subscription Management</h3>
        </div>
        
        <div style={{
          ...styles.settingsCard,
          marginTop: '16px',
          maxWidth: '800px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#FEF3C7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                Sync Subscription Quantities
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                Update all Stripe subscriptions to match their current active license count. This will adjust billing for all companies based on their active franchises.
              </p>
              
              <button
                onClick={handleSyncAllSubscriptions}
                disabled={syncingAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: syncingAll ? '#94A3B8' : '#D97706',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: syncingAll ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {syncingAll ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}></span>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                    Sync All Subscriptions
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: syncResult.success ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${syncResult.success ? '#A7F3D0' : '#FECACA'}`,
              borderRadius: '8px',
            }}>
              {syncResult.success ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#059669' }}>
                      Sync Completed
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>{syncResult.summary?.total_active_subscriptions || 0}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Total</div>
                    </div>
                    <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>{syncResult.summary?.synced || 0}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Updated</div>
                    </div>
                    <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#1B4DFF' }}>{syncResult.summary?.already_synced || 0}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Already Synced</div>
                    </div>
                    <div style={{ padding: '12px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: syncResult.summary?.errors > 0 ? '#DC2626' : '#94A3B8' }}>{syncResult.summary?.errors || 0}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Errors</div>
                    </div>
                  </div>
                  {syncResult.details?.synced && syncResult.details.synced.length > 0 && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#fff', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#059669', marginBottom: '8px' }}>Updated Subscriptions:</div>
                      {syncResult.details.synced.slice(0, 5).map((item, i) => (
                        <div key={i} style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                          {item.company_name}: {item.old_quantity} → {item.new_quantity} licenses
                        </div>
                      ))}
                      {syncResult.details.synced.length > 5 && (
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                          ...and {syncResult.details.synced.length - 5} more
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Error: {syncResult.error || 'Sync failed'}
                </div>
              )}
            </div>
          )}
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

function MailIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
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
