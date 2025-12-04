import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        await fetchAllLicenses();
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Unable to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllLicenses = async () => {
      try {
        const response = await fetch(`${backendURL}/api/licenses/company/${realmId}`);
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

  const refreshLicenses = async () => {
    try {
      const response = await fetch(`${backendURL}/api/licenses/company/${realmId}`);
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (err) {
      console.error("Error refreshing licenses:", err);
    }
  };

  if (loading) {
  return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
        <style>{keyframes}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style={styles.errorTitle}>Something went wrong</h2>
        <p style={styles.errorText}>{error}</p>
        <button onClick={() => navigate("/login")} style={styles.errorBtn}>
          Back to Login
        </button>
        <style>{keyframes}</style>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "franchises", icon: "building", label: "Franchises" },
    { id: "reports", icon: "chart", label: "Reports" },
    { id: "billing", icon: "card", label: "Billing" },
  ];

  const activeLicenses = licenses.filter(l => l.quickbooks?.is_active === "true");

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.dashboard}>
        {/* Sidebar */}
        <aside style={{
          ...styles.sidebar,
          width: sidebarCollapsed ? 72 : 260,
      }}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {!sidebarCollapsed && <span style={styles.logoText}>RoyaltiesAgent</span>}
            </div>
        <button
              style={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {sidebarCollapsed ? (
                  <path d="M9 18l6-6-6-6" />
                ) : (
                  <path d="M15 18l-6-6 6-6" />
                )}
              </svg>
            </button>
          </div>

          <nav style={styles.sidebarNav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
          style={{
                  ...styles.navItem,
                  ...(activeSection === item.id ? styles.navItemActive : {}),
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                }}
              >
                <MenuIcon name={item.icon} active={activeSection === item.id} />
                {!sidebarCollapsed && <span>{item.label}</span>}
        </button>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={{
              ...styles.connectionStatus,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}>
              <span style={styles.statusDot}></span>
              {!sidebarCollapsed && <span style={styles.statusText}>QuickBooks Connected</span>}
      </div>
          </div>
        </aside>

      {/* Main Content */}
        <main style={styles.mainContent}>
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
            <div style={styles.topBarRight}>
              <div style={styles.userMenu}>
                <div style={styles.userAvatar}>
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user?.full_name || 'User'}</span>
                  <span style={styles.userEmail}>{user?.email || ''}</span>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div style={styles.content}>
            {activeSection === "overview" && (
              <OverviewSection 
                user={user} 
                licenses={licenses}
                activeLicenses={activeLicenses}
                subscription={subscription}
                onManageBilling={handleManageBilling}
                navigate={navigate}
                setActiveSection={setActiveSection}
              />
          )}
            {activeSection === "franchises" && (
              <FranchisesSection 
                licenses={licenses}
                setLicenses={setLicenses}
                realmId={realmId}
                backendURL={backendURL}
                refreshLicenses={refreshLicenses}
              />
            )}
            {activeSection === "reports" && (
              <ReportsSection />
            )}
            {activeSection === "billing" && (
              <BillingSection 
                subscription={subscription} 
                activeLicenses={activeLicenses}
                onManageBilling={handleManageBilling}
                navigate={navigate}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Menu Icon Component
function MenuIcon({ name, active }) {
  const color = active ? "#059669" : "#64748B";
  const icons = {
    grid: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    building: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
    chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    card: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  };
  return icons[name] || null;
}

// Overview Section
function OverviewSection({ user, licenses, activeLicenses, subscription, onManageBilling, navigate, setActiveSection }) {
  const stats = [
    { 
      label: "Active Franchises", 
      value: activeLicenses.length, 
      total: licenses.length,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
      color: "#059669",
      bgColor: "#ECFDF5",
    },
    { 
      label: "Subscription Status", 
      value: subscription?.status === "active" ? "Active" : subscription?.status === "canceled" ? "Canceled" : "None",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={subscription?.status === "active" ? "#059669" : "#F59E0B"} strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      color: subscription?.status === "active" ? "#059669" : "#F59E0B",
      bgColor: subscription?.status === "active" ? "#ECFDF5" : "#FFFBEB",
    },
    { 
      label: "Licensed Seats", 
      value: subscription?.quantity || 0,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    { 
      label: "Next Billing", 
      value: subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
    },
  ];

  return (
    <div style={styles.section}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
          <p style={styles.welcomeText}>Here's an overview of your franchise operations.</p>
        </div>
        {!subscription && (
          <button onClick={() => navigate("/subscribe")} style={styles.subscribeBtn}>
            Subscribe Now
          </button>
              )}
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: stat.bgColor }}>
              {stat.icon}
            </div>
            <div style={styles.statContent}>
              <div style={{ ...styles.statValue, color: stat.color }}>
                {stat.value}
                {stat.total !== undefined && (
                  <span style={styles.statTotal}>/ {stat.total}</span>
                )}
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={styles.sectionTitle}>Quick Actions</h3>
      <div style={styles.actionsGrid}>
        <button onClick={() => setActiveSection("franchises")} style={styles.actionCard}>
          <div style={{ ...styles.actionIcon, background: '#ECFDF5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
            </svg>
          </div>
          <span style={styles.actionLabel}>Manage Franchises</span>
          <span style={styles.actionArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
                </span>
        </button>
        <button onClick={() => setActiveSection("reports")} style={styles.actionCard}>
          <div style={{ ...styles.actionIcon, background: '#EFF6FF' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          </div>
          <span style={styles.actionLabel}>View Reports</span>
          <span style={styles.actionArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </span>
        </button>
        <button onClick={onManageBilling} style={styles.actionCard}>
          <div style={{ ...styles.actionIcon, background: '#F5F3FF' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span style={styles.actionLabel}>Manage Billing</span>
          <span style={styles.actionArrow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </span>
        </button>
      </div>

      {/* Recent Franchises Preview */}
      {activeLicenses.length > 0 && (
        <>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Active Franchises</h3>
            <button onClick={() => setActiveSection("franchises")} style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.franchisePreviewGrid}>
            {activeLicenses.slice(0, 4).map((license) => (
              <div key={license.franchise_number} style={styles.franchisePreviewCard}>
                <div style={styles.franchisePreviewHeader}>
                  <span style={styles.franchiseNum}>#{license.franchise_number}</span>
                  <span style={styles.activeBadge}>Active</span>
                </div>
                <div style={styles.franchisePreviewName}>{license.name}</div>
                <div style={styles.franchisePreviewLocation}>
                  {license.city && license.state ? `${license.city}, ${license.state}` : "Location not set"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Franchises Section with full management
function FranchisesSection({ licenses, setLicenses, realmId, backendURL, refreshLicenses }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({ field: 'franchise_number', direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const SortIcon = ({ field }) => {
    const isActive = sortConfig.field === field;
    return (
      <span style={{ marginLeft: '6px', opacity: isActive ? 1 : 0.3, display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" style={{ marginBottom: '-1px' }}><path d="M4 0L7 4H1L4 0Z" fill={isActive && sortConfig.direction === 'asc' ? '#059669' : '#94A3B8'} /></svg>
        <svg width="8" height="5" viewBox="0 0 8 5"><path d="M4 5L1 1H7L4 5Z" fill={isActive && sortConfig.direction === 'desc' ? '#059669' : '#94A3B8'} /></svg>
      </span>
    );
  };

  const handleToggleLicense = async (franchiseNumber, currentActive) => {
    const newActive = currentActive === "true" ? "false" : "true";
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/mapping/${franchiseNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: newActive }),
        }
      );

      if (!response.ok) throw new Error("Failed to update license");

      setLicenses(prev => prev.map(lic => {
        if (lic.franchise_number === franchiseNumber) {
          return { ...lic, quickbooks: { ...lic.quickbooks, is_active: newActive } };
        }
        return lic;
      }));

      setMessage({ 
        type: 'success', 
        text: `Franchise #${franchiseNumber} ${newActive === "true" ? "activated" : "deactivated"}` 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error("Error updating license:", err);
      setMessage({ type: 'error', text: `Failed to update franchise #${franchiseNumber}` });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAction = async (activate) => {
    if (!activate && !window.confirm("Are you sure you want to deactivate all franchises? This will affect your billing.")) {
      return;
    }
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const franchiseNumbers = activate ? licenses.map(lic => lic.franchise_number) : [];
      
      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/select-licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ franchise_numbers: franchiseNumbers }),
        }
      );

      if (!response.ok) throw new Error("Failed to update");

      await refreshLicenses();
      setMessage({ 
        type: 'success', 
        text: activate ? "All franchises activated" : "All franchises deactivated" 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: 'error', text: "Failed to update franchises" });
    } finally {
      setSaving(false);
    }
  };

  const filteredLicenses = licenses
    .filter(lic => {
      const matchesSearch = 
        lic.franchise_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isActive = lic.quickbooks?.is_active === "true";
      const matchesFilter = 
        filterStatus === "all" ||
        (filterStatus === "active" && isActive) ||
        (filterStatus === "inactive" && !isActive);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const getValue = (obj) => {
        switch (sortConfig.field) {
          case 'franchise_number': return obj.franchise_number || '';
          case 'name': return obj.name || '';
          case 'city': return obj.city || '';
          case 'status': return obj.quickbooks?.is_active === "true" ? 'active' : 'inactive';
          default: return '';
        }
      };
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredLicenses.length / pagination.limit);
  const paginatedLicenses = filteredLicenses.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);

  const activeCount = licenses.filter(l => l.quickbooks?.is_active === "true").length;
  const inactiveCount = licenses.length - activeCount;

  return (
    <div style={styles.section}>
      {/* Stats Cards */}
      <div style={styles.franchiseStats}>
        <div style={{ ...styles.franchiseStatCard, borderColor: '#059669' }}>
          <div style={{ ...styles.franchiseStatValue, color: '#059669' }}>{activeCount}</div>
          <div style={styles.franchiseStatLabel}>Active</div>
        </div>
        <div style={{ ...styles.franchiseStatCard, borderColor: '#EF4444' }}>
          <div style={{ ...styles.franchiseStatValue, color: '#EF4444' }}>{inactiveCount}</div>
          <div style={styles.franchiseStatLabel}>Inactive</div>
        </div>
        <div style={{ ...styles.franchiseStatCard, borderColor: '#3B82F6' }}>
          <div style={{ ...styles.franchiseStatValue, color: '#3B82F6' }}>{licenses.length}</div>
          <div style={styles.franchiseStatLabel}>Total</div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={styles.infoBanner}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Billing is based on <strong>active franchises</strong>. Changes will apply on your next billing cycle.</span>
      </div>

      {/* Actions Bar */}
      <div style={styles.franchiseActionsBar}>
        <div style={styles.searchBox}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search franchises..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            style={styles.searchInput}
          />
        </div>
        
        <select 
          value={filterStatus} 
          onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
          style={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>Show</span>
          <select 
            value={pagination.limit} 
            onChange={(e) => setPagination({ page: 1, limit: parseInt(e.target.value) })}
            style={styles.filterSelect}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {(searchQuery || filterStatus !== "all") && (
          <button 
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setPagination(p => ({ ...p, page: 1 })); }}
            style={{
              padding: '8px 14px',
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

        <span style={{ fontSize: '13px', color: '#64748B' }}>
          {filteredLicenses.length} of {licenses.length}
        </span>

        <div style={styles.bulkActions}>
                <button
            onClick={() => handleBulkAction(true)} 
            disabled={saving || activeCount === licenses.length}
                  style={{
              ...styles.bulkBtn,
              ...styles.bulkBtnSuccess,
              opacity: (saving || activeCount === licenses.length) ? 0.5 : 1,
                  }}
                >
            Activate All
                </button>
                  <button
            onClick={() => handleBulkAction(false)} 
            disabled={saving || inactiveCount === licenses.length}
                    style={{
              ...styles.bulkBtn,
              ...styles.bulkBtnDanger,
              opacity: (saving || inactiveCount === licenses.length) ? 0.5 : 1,
                    }}
                  >
            Deactivate All
                  </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
        }}>
          {message.text}
        </div>
      )}

      {/* Table */}
      {filteredLicenses.length === 0 ? (
        <div style={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
            <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
          </svg>
          <h3 style={styles.emptyTitle}>
            {searchQuery || filterStatus !== "all" ? "No matching franchises" : "No franchises found"}
          </h3>
          <p style={styles.emptyText}>
            {searchQuery || filterStatus !== "all" ? "Try adjusting your search or filter" : "Your QuickBooks departments will appear here"}
          </p>
              </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('franchise_number')}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>Franchise #<SortIcon field="franchise_number" /></div>
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>Name<SortIcon field="name" /></div>
                </th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('city')}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>Location<SortIcon field="city" /></div>
                </th>
                <th style={styles.th}>Department</th>
                <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>Status<SortIcon field="status" /></div>
                </th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLicenses.map((license) => {
                const isActive = license.quickbooks?.is_active === "true";
                return (
                  <tr key={license.franchise_number} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.franchiseNumber}>#{license.franchise_number}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.franchiseName}>{license.name}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.franchiseLocation}>
                        {license.city && license.state ? `${license.city}, ${license.state}` : "—"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.departmentName}>{license.quickbooks?.department_name || "—"}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(isActive ? styles.statusActive : styles.statusInactive)
                      }}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
              <button
                        onClick={() => handleToggleLicense(license.franchise_number, license.quickbooks?.is_active || "false")}
                        disabled={saving}
                style={{
                          ...styles.toggleBtn,
                          ...(isActive ? styles.toggleBtnDeactivate : styles.toggleBtnActivate),
                          opacity: saving ? 0.5 : 1,
                }}
              >
                        {isActive ? "Deactivate" : "Activate"}
              </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderTop: '1px solid #E2E8F0',
              background: '#F8FAFC',
              borderRadius: '0 0 12px 12px',
            }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                Page {pagination.page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: 1 }))} 
                  disabled={pagination.page === 1}
                  style={{
                    padding: '8px 12px',
                    background: pagination.page === 1 ? '#F1F5F9' : '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    color: pagination.page === 1 ? '#94A3B8' : '#475569',
                    fontSize: '13px',
                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >First</button>
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} 
                  disabled={pagination.page === 1}
                  style={{
                    padding: '8px 12px',
                    background: pagination.page === 1 ? '#F1F5F9' : '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    color: pagination.page === 1 ? '#94A3B8' : '#475569',
                    fontSize: '13px',
                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  }}
                >Prev</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (pagination.page <= 3) pageNum = i + 1;
                  else if (pagination.page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = pagination.page - 2 + i;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setPagination(p => ({ ...p, page: pageNum }))}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: pagination.page === pageNum ? '#059669' : '#fff',
                        border: pagination.page === pageNum ? 'none' : '1px solid #E2E8F0',
                        borderRadius: '6px',
                        color: pagination.page === pageNum ? '#fff' : '#475569',
                        fontSize: '13px',
                        fontWeight: pagination.page === pageNum ? '600' : '400',
                        cursor: 'pointer',
                      }}
                    >{pageNum}</button>
                  );
                })}
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} 
                  disabled={pagination.page === totalPages}
                  style={{
                    padding: '8px 12px',
                    background: pagination.page === totalPages ? '#F1F5F9' : '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    color: pagination.page === totalPages ? '#94A3B8' : '#475569',
                    fontSize: '13px',
                    cursor: pagination.page === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >Next</button>
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: totalPages }))} 
                  disabled={pagination.page === totalPages}
                  style={{
                    padding: '8px 12px',
                    background: pagination.page === totalPages ? '#F1F5F9' : '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    color: pagination.page === totalPages ? '#94A3B8' : '#475569',
                    fontSize: '13px',
                    cursor: pagination.page === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >Last</button>
              </div>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                {filteredLicenses.length} total
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Reports Section
function ReportsSection() {
  return (
    <div style={styles.section}>
      <div style={styles.comingSoon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
        <h3 style={styles.comingSoonTitle}>Reports Coming Soon</h3>
        <p style={styles.comingSoonText}>
          Your royalty reports, analytics, and file downloads will be available here.
        </p>
      </div>
    </div>
  );
}

// Billing Section
function BillingSection({ subscription, activeLicenses, onManageBilling, navigate }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!subscription) {
    return (
      <div style={styles.section}>
        <div style={styles.noSubscription}>
          <div style={styles.noSubIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h3 style={styles.noSubTitle}>No Active Subscription</h3>
          <p style={styles.noSubText}>
            Subscribe to unlock full access to royalty reporting and automation features.
          </p>
          <button onClick={() => navigate("/subscribe")} style={styles.subscribeNowBtn}>
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      {/* Subscription Card */}
      <div style={styles.billingCard}>
        <div style={styles.billingHeader}>
                    <div>
            <h3 style={styles.billingTitle}>Subscription Details</h3>
            <p style={styles.billingSubtitle}>Manage your plan and billing preferences</p>
                    </div>
          <span style={{
            ...styles.billingStatus,
            ...(subscription.status === 'active' ? styles.billingStatusActive : 
                subscription.status === 'canceled' ? styles.billingStatusCanceled : styles.billingStatusPending)
          }}>
            {subscription.status === 'active' ? 'Active' : 
             subscription.status === 'canceled' ? 'Canceled' : subscription.status}
          </span>
                    </div>

        <div style={styles.billingDetails}>
          <div style={styles.billingRow}>
            <span style={styles.billingLabel}>Plan</span>
            <span style={styles.billingValue}>{subscription.plan_name || 'Standard'}</span>
                  </div>
          <div style={styles.billingRow}>
            <span style={styles.billingLabel}>Active Franchises</span>
            <span style={styles.billingValue}>{activeLicenses.length} franchises</span>
          </div>
          <div style={styles.billingRow}>
            <span style={styles.billingLabel}>Licensed Seats</span>
            <span style={styles.billingValue}>{subscription.quantity || 0}</span>
          </div>
          <div style={styles.billingRow}>
            <span style={styles.billingLabel}>
              {subscription.status === 'canceled' ? 'Access Until' : 'Next Billing Date'}
            </span>
            <span style={styles.billingValue}>{formatDate(subscription.end_date)}</span>
          </div>
        </div>

        <div style={styles.billingActions}>
          <button onClick={onManageBilling} style={styles.manageBillingBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Manage in Stripe Portal
                </button>
              </div>
      </div>

      {/* Billing Info */}
      <div style={styles.billingInfo}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div>
          <strong>Billing adjusts automatically:</strong> When you activate or deactivate franchises, 
          your billing will be updated on the next billing cycle based on the number of active franchises.
        </div>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const styles = {
  // Layout
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  // Loading & Error
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#F8FAFC',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '3px solid #E2E8F0',
    borderTopColor: '#059669',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 15,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#F8FAFC',
    textAlign: 'center',
    padding: 24,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 8,
  },
  errorText: {
    color: '#64748B',
    marginBottom: 24,
  },
  errorBtn: {
    padding: '12px 24px',
    background: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  // Sidebar
  sidebar: {
    background: '#fff',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 40,
  },
  sidebarHeader: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #F1F5F9',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0F172A',
  },
  collapseBtn: {
    width: 32,
    height: 32,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748B',
  },
  sidebarNav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.15s',
    width: '100%',
    textAlign: 'left',
  },
  navItemActive: {
    background: '#ECFDF5',
    color: '#059669',
  },
  sidebarFooter: {
    padding: 16,
    borderTop: '1px solid #F1F5F9',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: '#F8FAFC',
    borderRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    background: '#059669',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: 13,
    color: '#64748B',
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    marginLeft: 260,
    transition: 'margin-left 0.2s ease',
  },
  topBar: {
    background: '#fff',
    borderBottom: '1px solid #E2E8F0',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
  },
  companyBadge: {
    padding: '6px 12px',
    background: '#F1F5F9',
    borderRadius: 6,
    fontSize: 13,
    color: '#64748B',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748B',
    marginLeft: 8,
  },
  
  // Content
  content: {
    padding: 32,
  },
  section: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  
  // Welcome Card
  welcomeCard: {
    background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #A7F3D0',
  },
  welcomeContent: {},
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#064E3B',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#047857',
    margin: 0,
  },
  subscribeBtn: {
    padding: '12px 24px',
    background: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginBottom: 40,
  },
  statCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 24,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {},
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 4,
  },
  statTotal: {
    fontSize: 16,
    fontWeight: 400,
    color: '#94A3B8',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Section Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 16,
    marginTop: 0,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#059669',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  // Actions Grid
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 40,
  },
  actionCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: 'pointer',
    transition: 'all 0.15s',
    width: '100%',
    textAlign: 'left',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
  },
  actionArrow: {
    color: '#94A3B8',
  },
  
  // Franchise Preview Grid
  franchisePreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  franchisePreviewCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    padding: 20,
  },
  franchisePreviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  franchiseNum: {
    fontFamily: "'SF Mono', Monaco, monospace",
    fontSize: 14,
    fontWeight: 600,
    color: '#059669',
  },
  activeBadge: {
    padding: '4px 8px',
    background: '#ECFDF5',
    color: '#059669',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  franchisePreviewName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 4,
  },
  franchisePreviewLocation: {
    fontSize: 13,
    color: '#64748B',
  },
  
  // Franchise Section
  franchiseStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  franchiseStatCard: {
    background: '#fff',
    border: '2px solid',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
  },
  franchiseStatValue: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 4,
  },
  franchiseStatLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 12,
    marginBottom: 24,
    fontSize: 14,
    color: '#1E40AF',
  },
  franchiseActionsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: 200,
    maxWidth: 400,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14,
    color: '#0F172A',
  },
  filterSelect: {
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    fontSize: 14,
    color: '#0F172A',
    cursor: 'pointer',
  },
  bulkActions: {
    display: 'flex',
    gap: 12,
    marginLeft: 'auto',
  },
  bulkBtn: {
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s',
  },
  bulkBtnSuccess: {
    background: '#ECFDF5',
    color: '#059669',
    border: '1px solid #A7F3D0',
  },
  bulkBtnDanger: {
    background: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
  },
  
  // Messages
  message: {
    padding: '14px 20px',
    borderRadius: 10,
    marginBottom: 24,
    fontSize: 14,
    fontWeight: 500,
  },
  messageSuccess: {
    background: '#ECFDF5',
    color: '#065F46',
    border: '1px solid #A7F3D0',
  },
  messageError: {
    background: '#FEF2F2',
    color: '#991B1B',
    border: '1px solid #FECACA',
  },
  
  // Table
  tableContainer: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
  },
  td: {
    padding: '16px 20px',
    fontSize: 14,
    color: '#0F172A',
  },
  franchiseNumber: {
    fontFamily: "'SF Mono', Monaco, monospace",
    fontWeight: 600,
    color: '#059669',
  },
  franchiseName: {
    fontWeight: 500,
  },
  franchiseLocation: {
    color: '#64748B',
  },
  departmentName: {
    color: '#64748B',
    fontSize: 13,
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  statusActive: {
    background: '#ECFDF5',
    color: '#059669',
  },
  statusInactive: {
    background: '#FEF2F2',
    color: '#DC2626',
  },
  toggleBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  toggleBtnActivate: {
    background: '#fff',
    color: '#059669',
    border: '1px solid #059669',
  },
  toggleBtnDeactivate: {
    background: '#fff',
    color: '#DC2626',
    border: '1px solid #DC2626',
  },
  
  // Empty State
  emptyState: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 60,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    margin: 0,
  },
  
  // Coming Soon
  comingSoon: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 80,
    textAlign: 'center',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 15,
    color: '#64748B',
    margin: 0,
  },
  
  // Billing Section
  noSubscription: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 60,
    textAlign: 'center',
  },
  noSubIcon: {
    marginBottom: 24,
  },
  noSubTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 8,
  },
  noSubText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
  },
  subscribeNowBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  billingCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  billingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  billingTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 4,
    marginTop: 0,
  },
  billingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    margin: 0,
  },
  billingStatus: {
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
  },
  billingStatusActive: {
    background: '#ECFDF5',
    color: '#059669',
  },
  billingStatusCanceled: {
    background: '#FEF2F2',
    color: '#DC2626',
  },
  billingStatusPending: {
    background: '#FFFBEB',
    color: '#D97706',
  },
  billingDetails: {
    padding: 24,
  },
  billingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  billingLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  billingValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0F172A',
  },
  billingActions: {
    padding: 24,
    borderTop: '1px solid #E2E8F0',
  },
  manageBillingBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 24px',
    background: '#0F172A',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
  },
  billingInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '16px 20px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 12,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 1.5,
  },
};
