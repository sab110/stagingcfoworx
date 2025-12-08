import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, LoadingScreen, ErrorScreen, Alert, Pagination } from "../components/ui";

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

  // Simple sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
      <LoadingScreen 
        message="Loading your dashboard..."
        submessage="Fetching your franchise data"
        showLogo={true}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen 
        title="Something went wrong"
        message={error}
        onRetry={() => window.location.reload()}
        onBack={() => navigate("/login")}
      />
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
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            <div style={styles.sidebarHeader}>
              <div style={{
                ...styles.logo,
                transition: 'all 0.2s ease',
              }}>
                <div 
                  style={styles.logoIcon}
                  onClick={handleSidebarToggle}
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg viewBox="0 0 24 24" fill="none" style={{ width: 18, height: 18, cursor: 'pointer' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {!sidebarCollapsed && <span style={styles.logoText}>RoyaltiesAgent</span>}
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
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  }}
                  title={sidebarCollapsed ? item.label : ''}
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
          </div>
        </aside>

      {/* Main Content */}
        <main style={{
          ...styles.mainContent,
          marginLeft: sidebarCollapsed ? 72 : 260,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Top Bar */}
          <header style={styles.topBar}>
            <div style={styles.topBarLeft}>
              {/* Hamburger Menu Button */}
              <button 
                onClick={handleSidebarToggle}
                style={styles.hamburgerBtn}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {sidebarCollapsed ? (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="15" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
              <h1 style={styles.pageTitle}>
                {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
              {/* Company Name Badge */}
              <div style={styles.companyBadge}>
                <span style={styles.companyBadgeText}>{user?.company_name || 'Company'}</span>
              </div>
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

// Simple Bar Chart Component
function SimpleBarChart({ data, height = 200 }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '20px 0' }}>
      {data.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div 
            style={{ 
              width: '100%', 
              maxWidth: 60,
              height: `${(item.value / maxValue) * (height - 60)}px`,
              minHeight: 4,
              background: `linear-gradient(180deg, ${item.color || '#059669'} 0%, ${item.colorEnd || '#047857'} 100%)`,
              borderRadius: '6px 6px 0 0',
              transition: 'height 0.5s ease',
            }} 
          />
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut Chart Component
function DonutChart({ value, total, color = '#059669', size = 120 }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{value}</div>
        <div style={{ fontSize: 11, color: '#64748B' }}>of {total}</div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, time, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ 
        width: 36, 
        height: 36, 
        borderRadius: 10, 
        background: `${color}15`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: color,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#64748B' }}>{time}</div>
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection({ user, licenses, activeLicenses, subscription, onManageBilling, navigate, setActiveSection }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const realmId = localStorage.getItem("realm_id");
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  const inactiveLicenses = licenses.length - activeLicenses.length;
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Fetch recent reports
  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoadingReports(true);
        const [rvcrRes, paymentRes] = await Promise.all([
          fetch(`${backendURL}/api/rvcr/list/${realmId}`).catch(() => null),
          fetch(`${backendURL}/api/payment-summary/list/${realmId}`).catch(() => null),
        ]);

        const rvcrData = rvcrRes?.ok ? await rvcrRes.json() : { reports: [] };
        const paymentData = paymentRes?.ok ? await paymentRes.json() : { reports: [] };

        // Combine and sort by date, take last 5
        const allReports = [
          ...((rvcrData.reports || []).map(r => ({ ...r, type: 'RVCR' }))),
          ...((paymentData.reports || []).map(r => ({ ...r, type: 'Payment Summary' }))),
        ]
        .sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at))
        .slice(0, 5);

        setRecentReports(allReports);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoadingReports(false);
      }
    };

    if (realmId) {
      fetchRecentReports();
    }
  }, [backendURL, realmId]);

  const stats = [
    { 
      label: "Active Franchises", 
      value: activeLicenses.length, 
      total: licenses.length,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
      color: "#059669",
      bgColor: "#ECFDF5",
      trend: "+12%",
      trendUp: true,
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

  // Mock data for charts - replace with real data when available
  const monthlyData = [
    { label: 'Jul', value: 3, color: '#059669', colorEnd: '#047857' },
    { label: 'Aug', value: 5, color: '#059669', colorEnd: '#047857' },
    { label: 'Sep', value: 4, color: '#059669', colorEnd: '#047857' },
    { label: 'Oct', value: 7, color: '#059669', colorEnd: '#047857' },
    { label: 'Nov', value: 6, color: '#059669', colorEnd: '#047857' },
    { label: 'Dec', value: activeLicenses.length || 8, color: '#059669', colorEnd: '#047857' },
  ];

  const recentActivities = [
    { 
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
      title: 'Report Generated',
      time: 'Just now',
      color: '#059669',
    },
    { 
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>,
      title: 'Franchise Synced',
      time: '2 hours ago',
      color: '#3B82F6',
    },
    { 
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      title: 'QuickBooks Connected',
      time: '1 day ago',
      color: '#8B5CF6',
    },
  ];

  return (
    <div style={styles.section}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h2>
          <p style={styles.welcomeText}>Here's an overview of your franchise operations for {currentMonth}.</p>
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
          <div key={i} style={{...styles.statCard, animation: `slideUp 0.4s ease ${i * 0.1}s both`}}>
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
              {stat.trend && (
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: stat.trendUp ? '#059669' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 4,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {stat.trendUp ? <path d="M7 17l5-5 5 5M7 7l5 5 5-5"/> : <path d="M7 7l5 5 5-5M7 17l5-5 5 5"/>}
                  </svg>
                  {stat.trend} this month
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Activity Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Franchise Activity</h3>
              <p style={styles.chartSubtitle}>Monthly active franchises over time</p>
            </div>
            <div style={styles.chartLegend}>
              <span style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: '#059669' }}></span>
                Active
              </span>
            </div>
          </div>
          <SimpleBarChart data={monthlyData} height={180} />
        </div>

        {/* Franchise Distribution */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={styles.chartTitle}>Franchise Status</h3>
              <p style={styles.chartSubtitle}>Active vs Inactive distribution</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
            <DonutChart value={activeLicenses.length} total={licenses.length || 1} color="#059669" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingBottom: 16 }}>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#059669' }}></span>
              Active ({activeLicenses.length})
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#E2E8F0' }}></span>
              Inactive ({inactiveLicenses})
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Quick Actions */}
        <div>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
              <span style={styles.actionLabel}>Generate Reports</span>
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
        </div>

        {/* Recent Activity */}
        <div>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          <div style={styles.activityCard}>
            {recentActivities.map((activity, i) => (
              <ActivityItem key={i} {...activity} />
            ))}
            <div style={{ padding: '16px 0 4px', textAlign: 'center' }}>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: '#059669', 
                fontSize: 13, 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}>
                View All Activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Summary */}
      <div style={{ marginBottom: 32 }}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Recent Reports</h3>
          <button onClick={() => setActiveSection("reports")} style={styles.viewAllBtn}>View All Reports</button>
        </div>
        <div style={styles.reportsTableCard}>
          {loadingReports ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                border: '3px solid #E2E8F0', 
                borderTopColor: '#059669', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }} />
              <span style={{ color: '#64748B', fontSize: 14 }}>Loading reports...</span>
            </div>
          ) : recentReports.length > 0 ? (
            <table style={styles.reportsTable}>
              <thead>
                <tr>
                  <th style={styles.reportsTableHeader}>Franchise</th>
                  <th style={styles.reportsTableHeader}>Report Type</th>
                  <th style={styles.reportsTableHeader}>Period</th>
                  <th style={styles.reportsTableHeader}>Generated</th>
                  <th style={styles.reportsTableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report, idx) => {
                  const periodDisplay = report.period_month 
                    ? (report.period_month.length === 6 
                      ? `${report.period_month.slice(0, 2)}/${report.period_month.slice(2)}` 
                      : `${report.period_month}/${report.period_year || ''}`)
                    : 'N/A';
                  return (
                    <tr key={report.id || idx} style={styles.reportsTableRow}>
                      <td style={styles.reportsTableCell}>
                        <span style={{ fontWeight: 600, color: '#0F172A' }}>#{report.franchise_number}</span>
                      </td>
                      <td style={styles.reportsTableCell}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: report.type === 'RVCR' ? '#ECFDF5' : '#EFF6FF',
                          color: report.type === 'RVCR' ? '#059669' : '#3B82F6',
                        }}>
                          {report.type}
                        </span>
                      </td>
                      <td style={styles.reportsTableCell}>{periodDisplay}</td>
                      <td style={styles.reportsTableCell}>
                        {new Date(report.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={styles.reportsTableCell}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {report.excel_download_url && (
                            <a href={report.excel_download_url} target="_blank" rel="noopener noreferrer" style={styles.reportActionBtn}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                              </svg>
                              Excel
                            </a>
                          )}
                          {report.pdf_download_url && (
                            <a href={report.pdf_download_url} target="_blank" rel="noopener noreferrer" style={styles.reportActionBtn}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                              </svg>
                              PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
              <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>No reports generated yet</p>
              <button 
                onClick={() => setActiveSection("reports")} 
                style={{ 
                  marginTop: 16, 
                  padding: '8px 16px', 
                  background: '#059669', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  fontSize: 13, 
                  fontWeight: 600, 
                  cursor: 'pointer' 
                }}
              >
                Generate Your First Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Franchises Preview */}
      {activeLicenses.length > 0 && (
        <>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Active Franchises</h3>
            <button onClick={() => setActiveSection("franchises")} style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.franchisePreviewGrid}>
            {activeLicenses.slice(0, 4).map((license, index) => (
              <div 
                key={license.franchise_number} 
                style={{
                  ...styles.franchisePreviewCard,
                  animation: `slideUp 0.4s ease ${index * 0.1}s both`,
                }}
              >
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
        <Alert 
          type={message.type === 'success' ? 'success' : 'error'} 
          style={{ marginBottom: 24 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
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

// Reports Section with RVCR and Payment Summary Generation
function ReportsSection() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const realmId = localStorage.getItem("realm_id");
  
  const [activeTab, setActiveTab] = useState("rvcr"); // "rvcr" or "payment"
  const [licenseMappings, setLicenseMappings] = useState([]);
  const [rvcrReports, setRvcrReports] = useState([]);
  const [paymentReports, setPaymentReports] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Calculate "Last Month" display text
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthText = lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Fetch license mappings and reports
  useEffect(() => {
    const fetchData = async () => {
      if (!realmId) return;
      
      try {
        // Fetch license mappings
        const mappingsRes = await fetch(`${backendURL}/api/licenses/mappings/${realmId}`);
        if (mappingsRes.ok) {
          const mappingsData = await mappingsRes.json();
          setLicenseMappings(mappingsData.mappings || []);
        }

        // Fetch RVCR reports
        const reportsRes = await fetch(`${backendURL}/api/rvcr/list/${realmId}`);
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setRvcrReports(reportsData.reports || []);
        }

        // Fetch Payment Summary reports
        const paymentRes = await fetch(`${backendURL}/api/payment-summary/list/${realmId}`);
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          setPaymentReports(paymentData.reports || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendURL, realmId]);

  const handleGenerateRVCR = async () => {
    if (!selectedDepartment) {
      setMessage({ type: 'error', text: 'Please select a department' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      // Reports are always generated for "Last Month" as determined by QuickBooks
      const response = await fetch(`${backendURL}/api/rvcr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realm_id: realmId,
          department_id: selectedDepartment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate report');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: `RVCR generated: ${result.report.report_name}` });
      
      // Refresh reports list
      const reportsRes = await fetch(`${backendURL}/api/rvcr/list/${realmId}`);
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setRvcrReports(reportsData.reports || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate report' });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleGenerateAll = async () => {
    const reportType = activeTab === 'rvcr' ? 'RVCR' : 'Payment Summary';
    if (!window.confirm(`Generate ${reportType} reports for all franchises? This may take a few minutes.`)) {
      return;
    }

    setGeneratingAll(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = activeTab === 'rvcr' 
        ? `${backendURL}/api/rvcr/generate-all/${realmId}`
        : `${backendURL}/api/payment-summary/generate-all/${realmId}`;
      
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate reports');
      }

      const result = await response.json();
      const successCount = result.successful || result.success_count || 0;
      const failedCount = result.failed || result.failed_count || 0;
      const total = result.total_franchises || result.total || 0;
      
      setMessage({ 
        type: failedCount > 0 ? 'warning' : 'success', 
        text: `Generated ${successCount} of ${total} ${reportType} reports${failedCount > 0 ? ` (${failedCount} failed)` : ''}` 
      });

      // Refresh reports list
      if (activeTab === 'rvcr') {
        const reportsRes = await fetch(`${backendURL}/api/rvcr/list/${realmId}`);
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setRvcrReports(reportsData.reports || []);
        }
      } else {
        const paymentRes = await fetch(`${backendURL}/api/payment-summary/list/${realmId}`);
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          setPaymentReports(paymentData.reports || []);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate reports' });
    } finally {
      setGeneratingAll(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Generate Payment Summary Report
  const handleGeneratePaymentSummary = async () => {
    if (!selectedDepartment) {
      setMessage({ type: 'error', text: 'Please select a department' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${backendURL}/api/payment-summary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realm_id: realmId,
          department_id: selectedDepartment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate payment summary');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: `Payment Summary generated for franchise ${result.franchise_number}` });
      
      // Refresh reports list
      const paymentRes = await fetch(`${backendURL}/api/payment-summary/list/${realmId}`);
      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        setPaymentReports(paymentData.reports || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to generate payment summary' });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleDownload = (url, type) => {
    if (!url) {
      setMessage({ type: 'error', text: `No ${type} file available` });
      return;
    }
    window.open(url, '_blank');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={styles.section}>
        <div style={{ textAlign: 'center', padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner size="lg" color="primary" />
          <span style={{ color: '#64748B', fontSize: 15 }}>Loading reports...</span>
        </div>
      </div>
    );
  }

  const currentReports = activeTab === 'rvcr' ? rvcrReports : paymentReports;
  const reportTypeTitle = activeTab === 'rvcr' ? 'RVCR' : 'Payment Summary';
  const reportTypeDesc = activeTab === 'rvcr' 
    ? 'Royalty Volume Calculation Report' 
    : 'Royalty Report with fees calculation';

  return (
    <div style={styles.section}>
      {/* Tab Navigation */}
      <div style={reportsStyles.tabContainer}>
        <button
          onClick={() => { setActiveTab('rvcr'); setMessage({ type: '', text: '' }); }}
          style={{
            ...reportsStyles.tab,
            ...(activeTab === 'rvcr' ? reportsStyles.tabActive : {})
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          RVCR Reports
          <span style={reportsStyles.tabBadge}>{rvcrReports.length}</span>
        </button>
        <button
          onClick={() => { setActiveTab('payment'); setMessage({ type: '', text: '' }); }}
          style={{
            ...reportsStyles.tab,
            ...(activeTab === 'payment' ? reportsStyles.tabActive : {})
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Payment Summary
          <span style={reportsStyles.tabBadge}>{paymentReports.length}</span>
        </button>
      </div>

      {/* Generate Report Card */}
      <div style={reportsStyles.generateCard}>
        <div style={reportsStyles.generateHeader}>
          <div>
            <h3 style={reportsStyles.generateTitle}>
              {activeTab === 'rvcr' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              )}
              Generate {reportTypeTitle} Report
            </h3>
            <p style={reportsStyles.generateDesc}>{reportTypeDesc} - Generate for a specific franchise or all at once</p>
          </div>
        </div>

        <div style={reportsStyles.generateControls}>
          <div style={reportsStyles.controlGroup}>
            <label style={reportsStyles.controlLabel}>Department/Franchise</label>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={reportsStyles.controlSelect}
            >
              <option value="">Select department...</option>
              {licenseMappings.map((mapping) => (
                <option key={mapping.id} value={mapping.qbo_department_id}>
                  {mapping.qbo_department_name} ({mapping.franchise_number})
                </option>
              ))}
            </select>
          </div>

          <div style={reportsStyles.controlGroup}>
            <label style={reportsStyles.controlLabel}>Period</label>
            <div style={{
              ...reportsStyles.controlSelect,
              display: 'flex',
              alignItems: 'center',
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              fontWeight: 500,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {lastMonthText}
            </div>
          </div>

          <div style={reportsStyles.controlGroup}>
            <label style={reportsStyles.controlLabel}>&nbsp;</label>
            <button 
              onClick={activeTab === 'rvcr' ? handleGenerateRVCR : handleGeneratePaymentSummary}
              disabled={!selectedDepartment || generating}
              style={{
                ...reportsStyles.generateBtn,
                opacity: (!selectedDepartment || generating) ? 0.5 : 1,
                cursor: (!selectedDepartment || generating) ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? (
                <>
                  <Spinner size="xs" color="white" />
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>

          <div style={reportsStyles.controlGroup}>
            <label style={reportsStyles.controlLabel}>&nbsp;</label>
            <button 
              onClick={handleGenerateAll}
              disabled={generatingAll}
              style={{
                ...reportsStyles.generateAllBtn,
                opacity: generatingAll ? 0.5 : 1,
                cursor: generatingAll ? 'not-allowed' : 'pointer',
              }}
            >
              {generatingAll ? (
                <>
                  <Spinner size="xs" color="primary" />
                  Generating All...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                  </svg>
                  Generate All
                </>
              )}
            </button>
          </div>
        </div>

        <div style={reportsStyles.infoNote}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {activeTab === 'rvcr' ? (
            <span>Reports are named: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>Franchise # - mmyyyy RVCR</code> (e.g., 01444 - 082024 RVCR)</span>
          ) : (
            <span>Reports include royalty calculations, fixed fees, and National Brand Fund fees based on tiered rates</span>
          )}
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <Alert 
          type={message.type === 'success' ? 'success' : message.type === 'warning' ? 'warning' : 'error'} 
          style={{ marginBottom: 24 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* Reports List */}
      <div style={reportsStyles.reportsCard}>
        <div style={reportsStyles.reportsHeader}>
          <h3 style={reportsStyles.reportsTitle}>
            {activeTab === 'rvcr' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            )}
            Generated {reportTypeTitle} Reports
          </h3>
          <span style={reportsStyles.reportCount}>{currentReports.length} reports</span>
        </div>

        {currentReports.length === 0 ? (
          <div style={reportsStyles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <h4 style={reportsStyles.emptyTitle}>No {reportTypeTitle} reports yet</h4>
            <p style={reportsStyles.emptyText}>Select a department above and click Generate to create your first report.</p>
          </div>
        ) : (
          <div style={reportsStyles.tableContainer}>
            <table style={reportsStyles.table}>
              <thead>
                <tr>
                  <th style={reportsStyles.th}>{activeTab === 'rvcr' ? 'Report Name' : 'Franchise'}</th>
                  <th style={reportsStyles.th}>Franchise #</th>
                  <th style={reportsStyles.th}>Period</th>
                  <th style={reportsStyles.th}>Generated</th>
                  <th style={{ ...reportsStyles.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => (
                  <tr key={report.id} style={reportsStyles.tr}>
                    <td style={reportsStyles.td}>
                      <span style={reportsStyles.reportName}>
                        {activeTab === 'rvcr' ? report.report_name : `${report.franchise_number} Payment Summary`}
                      </span>
                    </td>
                    <td style={reportsStyles.td}>
                      <span style={reportsStyles.franchiseNumber}>{report.franchise_number}</span>
                    </td>
                    <td style={reportsStyles.td}>
                      <span style={reportsStyles.periodBadge}>
                        {activeTab === 'rvcr' 
                          ? (report.period_month && report.period_month.length >= 6 
                              ? `${report.period_month.slice(0, 2)}/${report.period_month.slice(2)}` 
                              : report.period_month)
                          : (report.period_month && report.period_year 
                              ? `${String(report.period_month).padStart(2, '0')}/${report.period_year}` 
                              : report.period_month || 'N/A')}
                      </span>
                    </td>
                    <td style={reportsStyles.td}>
                      <span style={reportsStyles.dateText}>{formatDate(report.generated_at)}</span>
                    </td>
                    <td style={{ ...reportsStyles.td, textAlign: 'right' }}>
                      <div style={reportsStyles.actionBtns}>
                        <button 
                          onClick={() => handleDownload(report.excel_download_url, 'Excel')}
                          disabled={!report.excel_download_url}
                          style={{
                            ...reportsStyles.downloadBtn,
                            ...reportsStyles.excelBtn,
                            opacity: report.excel_download_url ? 1 : 0.5,
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
                          </svg>
                          Excel
                        </button>
                        <button 
                          onClick={() => handleDownload(report.pdf_download_url, 'PDF')}
                          disabled={!report.pdf_download_url}
                          style={{
                            ...reportsStyles.downloadBtn,
                            ...reportsStyles.pdfBtn,
                            opacity: report.pdf_download_url ? 1 : 0.5,
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                          </svg>
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Reports Section Styles
const reportsStyles = {
  tabContainer: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    background: '#F1F5F9',
    padding: 6,
    borderRadius: 12,
    width: 'fit-content',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#64748B',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: '#fff',
    color: '#059669',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tabBadge: {
    padding: '2px 8px',
    background: '#E2E8F0',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
  },
  generateCard: {
    background: '#fff',
    border: '2px solid #D1FAE5',
    borderRadius: 14,
    padding: 24,
    marginBottom: 24,
  },
  generateHeader: {
    marginBottom: 20,
  },
  generateTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#0F172A',
    margin: 0,
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
  },
  generateDesc: {
    fontSize: 14,
    color: '#64748B',
    margin: 0,
  },
  generateControls: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 16,
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
  },
  controlSelect: {
    padding: '12px 14px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    fontSize: 14,
    color: '#0F172A',
    cursor: 'pointer',
    outline: 'none',
  },
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  generateAllBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 20px',
    background: '#fff',
    color: '#059669',
    border: '1px solid #059669',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  infoNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: 8,
    fontSize: 13,
    color: '#1E40AF',
  },
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
  messageWarning: {
    background: '#FFFBEB',
    color: '#92400E',
    border: '1px solid #FCD34D',
  },
  messageError: {
    background: '#FEF2F2',
    color: '#991B1B',
    border: '1px solid #FECACA',
  },
  reportsCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
  },
  reportsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #E2E8F0',
    background: '#F8FAFC',
  },
  reportsTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  reportCount: {
    fontSize: 13,
    color: '#64748B',
    background: '#F1F5F9',
    padding: '4px 10px',
    borderRadius: 4,
  },
  emptyState: {
    textAlign: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 16,
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
  tableContainer: {
    overflowX: 'auto',
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
  reportName: {
    fontWeight: 600,
    color: '#0F172A',
  },
  franchiseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  franchiseNumber: {
    fontFamily: "'SF Mono', Monaco, monospace",
    fontSize: 13,
    fontWeight: 600,
    color: '#059669',
  },
  departmentName: {
    fontSize: 12,
    color: '#64748B',
  },
  periodBadge: {
    padding: '4px 10px',
    background: '#F1F5F9',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  statusSuccess: {
    background: '#ECFDF5',
    color: '#059669',
  },
  statusPending: {
    background: '#FFFBEB',
    color: '#D97706',
  },
  actionBtns: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
  },
  excelBtn: {
    background: '#ECFDF5',
    color: '#059669',
  },
  pdfBtn: {
    background: '#FEF2F2',
    color: '#DC2626',
  },
};

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
  
  @keyframes slideDown {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes sidebarCollapseDown {
    0% { 
      opacity: 1; 
      transform: translateY(0); 
    }
    50% { 
      opacity: 0; 
      transform: translateY(100%); 
    }
    51% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes sidebarExpandUp {
    0% { 
      opacity: 1; 
      transform: translateY(0); 
    }
    50% { 
      opacity: 0; 
      transform: translateY(100%); 
    }
    51% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes navItemSlideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
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
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
    minHeight: '100vh',
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

  // Hamburger Menu Button
  hamburgerBtn: {
    width: 40,
    height: 40,
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    transition: 'all 0.15s',
  },
  companyBadgeText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  
  // Content
  content: {
    padding: 32,
  },
  section: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  
  // Chart Styles
  chartCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 24,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    margin: 0,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 0,
  },
  chartLegend: {
    display: 'flex',
    gap: 16,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#64748B',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  activityCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: '4px 20px',
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
  
  // Reports Table (Overview)
  reportsTableCard: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  reportsTableHeader: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  reportsTableRow: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background 0.15s ease',
  },
  reportsTableCell: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#475569',
  },
  reportActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 10px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    color: '#475569',
    fontSize: 12,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
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
