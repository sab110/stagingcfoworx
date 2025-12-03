import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileWidget from "../components/ProfileWidget";

export default function FranchiseManagement() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const realmId = localStorage.getItem("realm_id");
  
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!realmId) {
      navigate("/");
      return;
    }
    fetchUserData();
    fetchLicenses();
  }, [realmId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${backendURL}/api/quickbooks/user-data/${realmId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${backendURL}/api/licenses/company/${realmId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch licenses");
      }

      const data = await response.json();
      console.log("📋 Licenses data:", data);

      setLicenses(data.licenses || []);
      setCompanyName(data.company_name || "");
    } catch (err) {
      console.error("❌ Error fetching licenses:", err);
      setError("Failed to load licenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLicense = async (franchiseNumber, currentActive) => {
    const newActive = currentActive === "true" ? "false" : "true";
    
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/mapping/${franchiseNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_active: newActive,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update license");
      }

      const data = await response.json();
      console.log("✅ License updated:", data);
      
      // Update local state
      setLicenses(prev => prev.map(lic => {
        if (lic.franchise_number === franchiseNumber) {
          return {
            ...lic,
            quickbooks: {
              ...lic.quickbooks,
              is_active: newActive,
            }
          };
        }
        return lic;
      }));

      setSuccess(`Franchise #${franchiseNumber} ${newActive === "true" ? "activated" : "deactivated"} successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating license:", err);
      setError(`Failed to update franchise #${franchiseNumber}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkActivate = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const allFranchiseNumbers = licenses.map(lic => lic.franchise_number);
      
      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/select-licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            franchise_numbers: allFranchiseNumbers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate all licenses");
      }

      await fetchLicenses();
      setSuccess("All franchises activated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error bulk activating:", err);
      setError("Failed to activate all franchises");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate all franchises?")) {
      return;
    }
    
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/select-licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            franchise_numbers: [], // Empty array to deactivate all
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deactivate all licenses");
      }

      await fetchLicenses();
      setSuccess("All franchises deactivated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error bulk deactivating:", err);
      setError("Failed to deactivate all franchises");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("realm_id");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const activeCount = licenses.filter(l => l.quickbooks?.is_active === "true").length;
  const inactiveCount = licenses.length - activeCount;

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "20px", fontSize: "16px", color: "#64748b" }}>
            Loading your franchises...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logo}>⚡</div>
          <h2 style={styles.navTitle}>CFO Worx</h2>
        </div>
        <ProfileWidget user={user} onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.pageTitle}>Franchise Management</h1>
          {companyName && (
            <p style={styles.companyName}>{companyName}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div style={styles.statsContainer}>
          <div style={{ ...styles.statCard, borderLeftColor: "#10b981" }}>
            <div style={styles.statNumber}>{activeCount}</div>
            <div style={styles.statLabel}>Active</div>
          </div>
          <div style={{ ...styles.statCard, borderLeftColor: "#ef4444" }}>
            <div style={styles.statNumber}>{inactiveCount}</div>
            <div style={styles.statLabel}>Inactive</div>
          </div>
          <div style={{ ...styles.statCard, borderLeftColor: "#3b82f6" }}>
            <div style={styles.statNumber}>{licenses.length}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div style={styles.bulkActions}>
          <button 
            onClick={handleBulkActivate} 
            disabled={saving || activeCount === licenses.length}
            style={{
              ...styles.bulkButton,
              backgroundColor: "#10b981",
              opacity: saving || activeCount === licenses.length ? 0.5 : 1,
            }}
          >
            ✓ Activate All
          </button>
          <button 
            onClick={handleBulkDeactivate} 
            disabled={saving || inactiveCount === licenses.length}
            style={{
              ...styles.bulkButton,
              backgroundColor: "#ef4444",
              opacity: saving || inactiveCount === licenses.length ? 0.5 : 1,
            }}
          >
            ✗ Deactivate All
          </button>
          <button onClick={fetchLicenses} style={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={styles.successMessage}>
            ✅ {success}
          </div>
        )}

        {/* Licenses Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Franchise #</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => {
                const isActive = license.quickbooks?.is_active === "true";
                return (
                  <tr key={license.franchise_number} style={styles.tableRow}>
                    <td style={styles.td}>
                      <span style={styles.franchiseNumber}>#{license.franchise_number}</span>
                    </td>
                    <td style={styles.td}>{license.name}</td>
                    <td style={styles.td}>
                      {license.city && license.state 
                        ? `${license.city}, ${license.state}` 
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      {license.quickbooks?.department_name || "-"}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                        color: isActive ? "#16a34a" : "#dc2626",
                      }}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleToggleLicense(license.franchise_number, license.quickbooks?.is_active || "false")}
                        disabled={saving}
                        style={{
                          ...styles.actionButton,
                          backgroundColor: isActive ? "#fee2e2" : "#dcfce7",
                          color: isActive ? "#dc2626" : "#16a34a",
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
        </div>

        {licenses.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>No Franchises Found</h3>
            <p style={{ color: "#64748b" }}>
              Make sure your QuickBooks departments are set up with franchise numbers.
            </p>
          </div>
        )}
      </div>

      {/* Spinner keyframe animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  navbar: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
    color: "white",
    padding: "12px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  navTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  mainContent: {
    padding: "40px 30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "none",
    padding: "8px 0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  pageTitle: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
  },
  companyName: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    borderLeft: "4px solid",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
  bulkActions: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  bulkButton: {
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  refreshButton: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  errorMessage: {
    padding: "16px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  successMessage: {
    padding: "16px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#334155",
  },
  franchiseNumber: {
    fontWeight: "600",
    color: "#1e293b",
    fontFamily: "monospace",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
};

