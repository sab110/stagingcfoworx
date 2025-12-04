import React, { useEffect, useState } from "react";

export default function LicenseSelection({ realmId, onComplete, isManageMode = false }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [licenses, setLicenses] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/licenses/company/${realmId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch licenses");
      }

      const data = await response.json();
      setLicenses(data.licenses || []);
      setCompanyName(data.company_name || "");

      if (isManageMode) {
        const activeFranchiseNumbers = new Set(
          (data.licenses || [])
            .filter((lic) => lic.quickbooks?.is_active === "true")
            .map((lic) => lic.franchise_number)
        );
        setSelectedLicenses(activeFranchiseNumbers);
      } else {
        const allFranchiseNumbers = new Set(
          (data.licenses || []).map((lic) => lic.franchise_number)
        );
        setSelectedLicenses(allFranchiseNumbers);
      }
    } catch (err) {
      console.error("Error fetching licenses:", err);
      setError("Failed to load licenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLicense = (franchiseNumber) => {
    const newSelected = new Set(selectedLicenses);
    if (newSelected.has(franchiseNumber)) {
      newSelected.delete(franchiseNumber);
    } else {
      newSelected.add(franchiseNumber);
    }
    setSelectedLicenses(newSelected);
  };

  const handleSelectAll = () => {
    const allFranchiseNumbers = new Set(
      licenses.map((lic) => lic.franchise_number)
    );
    setSelectedLicenses(allFranchiseNumbers);
  };

  const handleDeselectAll = () => {
    setSelectedLicenses(new Set());
  };

  const handleSaveSelection = async () => {
    if (selectedLicenses.size === 0) {
      setError("Please select at least one franchise");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/select-licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            franchise_numbers: Array.from(selectedLicenses),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save license selection");
      }

      const data = await response.json();
      if (onComplete) {
        onComplete(data);
      }
    } catch (err) {
      console.error("Error saving licenses:", err);
      setError("Failed to save selection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredLicenses = licenses.filter(lic =>
    lic.franchise_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your franchises from QuickBooks...</p>
        </div>
      </div>
    );
  }

  if (error && licenses.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 style={styles.errorTitle}>Error Loading Franchises</h2>
          <p style={styles.errorText}>{error}</p>
          <button onClick={fetchLicenses} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          {isManageMode && (
            <button
              onClick={() => window.location.href = "/dashboard"}
              style={styles.backButton}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </button>
          )}
          <h2 style={styles.title}>
            {isManageMode ? "Manage Your Franchises" : "Select Your Franchises"}
          </h2>
          <p style={styles.subtitle}>
            {companyName && <strong>{companyName}</strong>}
            {companyName && " - "}
            {isManageMode 
              ? "Update which franchises are active for your account"
              : "Choose the franchises you want to manage"}
          </p>
        </div>

        {licenses.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
            </svg>
            <h3 style={styles.emptyTitle}>No franchises found</h3>
            <p style={styles.emptyText}>
              Make sure your QuickBooks departments are set up with franchise numbers.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <span style={{...styles.statValue, color: '#2CA01C'}}>{selectedLicenses.size}</span>
                <span style={styles.statLabel}>Selected</span>
              </div>
              <div style={styles.statItem}>
                <span style={{...styles.statValue, color: '#64748B'}}>{licenses.length - selectedLicenses.size}</span>
                <span style={styles.statLabel}>Unselected</span>
              </div>
              <div style={styles.statItem}>
                <span style={{...styles.statValue, color: '#3B82F6'}}>{licenses.length}</span>
                <span style={styles.statLabel}>Total</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={styles.actionsBar}>
              <div style={styles.searchBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search franchises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <div style={styles.bulkButtons}>
                <button onClick={handleSelectAll} style={styles.bulkButton}>
                  Select All
                </button>
                <button onClick={handleDeselectAll} style={styles.bulkButtonSecondary}>
                  Deselect All
                </button>
              </div>
            </div>

            {/* License List */}
            <div style={styles.licenseList}>
              {filteredLicenses.map((license) => {
                const isSelected = selectedLicenses.has(license.franchise_number);
                return (
                  <div
                    key={license.franchise_number}
                    style={{
                      ...styles.licenseItem,
                      backgroundColor: isSelected ? '#ECFDF5' : '#fff',
                      borderColor: isSelected ? '#2CA01C' : '#E2E8F0',
                    }}
                    onClick={() => handleToggleLicense(license.franchise_number)}
                  >
                    <div style={{
                      ...styles.checkbox,
                      backgroundColor: isSelected ? '#2CA01C' : '#fff',
                      borderColor: isSelected ? '#2CA01C' : '#CBD5E1',
                    }}>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <div style={styles.licenseInfo}>
                      <div style={styles.licenseName}>
                        <span style={styles.franchiseNumber}>#{license.franchise_number}</span>
                        <span style={styles.franchiseName}>{license.name}</span>
                      </div>
                      <div style={styles.licenseDetails}>
                        {license.city && license.state && (
                          <span style={styles.detail}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {license.city}, {license.state}
                          </span>
                        )}
                        {license.quickbooks?.department_name && (
                          <span style={styles.detail}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                              <rect x="2" y="7" width="20" height="14" rx="2"/>
                              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                            </svg>
                            {license.quickbooks.department_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorMessage}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Save Button */}
            <div style={styles.actions}>
              <button
                onClick={handleSaveSelection}
                disabled={saving || selectedLicenses.size === 0}
                style={{
                  ...styles.saveButton,
                  opacity: saving || selectedLicenses.size === 0 ? 0.6 : 1,
                  cursor: saving || selectedLicenses.size === 0 ? "not-allowed" : "pointer",
                }}
              >
                {saving ? (
                  <>
                    <div style={styles.btnSpinner}></div>
                    Saving...
                  </>
                ) : (
                  <>
                    {isManageMode 
                      ? `Save ${selectedLicenses.size} Franchise${selectedLicenses.size !== 1 ? "s" : ""}`
                      : `Continue with ${selectedLicenses.size} Franchise${selectedLicenses.size !== 1 ? "s" : ""}`}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        )}
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
  container: {
    minHeight: "calc(100vh - 100px)",
    backgroundColor: "#F8FAFC",
    padding: "40px 20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    padding: "40px",
    border: "1px solid #E2E8F0",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#F1F5F9",
    color: "#64748B",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "12px",
    marginTop: 0,
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748B",
    lineHeight: "1.5",
    margin: 0,
  },
  statsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
  },
  statValue: {
    display: "block",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748B",
  },
  actionsBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0F172A",
    backgroundColor: "transparent",
  },
  bulkButtons: {
    display: "flex",
    gap: "12px",
  },
  bulkButton: {
    padding: "12px 20px",
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  bulkButtonSecondary: {
    padding: "12px 20px",
    backgroundColor: "#fff",
    color: "#64748B",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  licenseList: {
    maxHeight: "450px",
    overflowY: "auto",
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  licenseItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid",
    borderRadius: "14px",
  },
  checkbox: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "2px solid",
    marginRight: "16px",
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  licenseInfo: {
    flex: 1,
  },
  licenseName: {
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  franchiseNumber: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#2CA01C",
    fontFamily: "'SF Mono', Monaco, monospace",
  },
  franchiseName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0F172A",
  },
  licenseDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748B",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: "#FEF2F2",
    color: "#DC2626",
    borderRadius: "10px",
    marginBottom: "24px",
    fontWeight: "500",
    border: "1px solid #FECACA",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  saveButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 40px",
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 14px rgba(44, 160, 28, 0.3)",
  },
  btnSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingBox: {
    textAlign: "center",
    padding: "80px 20px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #E2E8F0",
    borderTopColor: "#2CA01C",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#64748B",
  },
  errorBox: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    border: "1px solid #E2E8F0",
  },
  errorIcon: {
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "15px",
    color: "#64748B",
    marginBottom: "24px",
  },
  retryButton: {
    padding: "12px 28px",
    backgroundColor: "#2CA01C",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0F172A",
    marginTop: "24px",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748B",
    margin: 0,
  },
};
