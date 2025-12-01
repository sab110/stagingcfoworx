import React, { useEffect, useState } from "react";

export default function LicenseSelection({ realmId, onComplete }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [licenses, setLicenses] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");

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
      console.log("📋 Licenses data:", data);

      setLicenses(data.licenses || []);
      setCompanyName(data.company_name || "");

      // Default: Select all licenses
      const allFranchiseNumbers = new Set(
        (data.licenses || []).map((lic) => lic.franchise_number)
      );
      setSelectedLicenses(allFranchiseNumbers);
    } catch (err) {
      console.error("❌ Error fetching licenses:", err);
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
      setError("Please select at least one license");
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
      console.log("✅ Licenses saved:", data);

      // Call onComplete callback to move to next step
      if (onComplete) {
        onComplete(data);
      }
    } catch (err) {
      console.error("❌ Error saving licenses:", err);
      setError("Failed to save selection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}>
            Loading your franchises from QuickBooks...
          </p>
        </div>
      </div>
    );
  }

  if (error && licenses.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2 style={{ color: "#dc2626", marginBottom: "10px" }}>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={fetchLicenses} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Select Your Franchises</h2>
          <p style={styles.subtitle}>
            {companyName && <><strong>{companyName}</strong> - </>}
            Choose the franchises you want to manage (default: all selected)
          </p>
        </div>

        {licenses.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "10px" }}>
              No franchises found
            </p>
            <p style={{ fontSize: "14px", color: "#999" }}>
              Make sure your QuickBooks departments are set up with franchise numbers.
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            <div style={styles.bulkActions}>
              <button onClick={handleSelectAll} style={styles.bulkButton}>
                Select All ({licenses.length})
              </button>
              <button onClick={handleDeselectAll} style={styles.bulkButtonSecondary}>
                Deselect All
              </button>
              <span style={styles.selectedCount}>
                {selectedLicenses.size} of {licenses.length} selected
              </span>
            </div>

            {/* License List */}
            <div style={styles.licenseList}>
              {licenses.map((license) => (
                <div
                  key={license.franchise_number}
                  style={{
                    ...styles.licenseItem,
                    backgroundColor: selectedLicenses.has(license.franchise_number)
                      ? "#eff6ff"
                      : "white",
                    borderColor: selectedLicenses.has(license.franchise_number)
                      ? "#3b82f6"
                      : "#e5e7eb",
                  }}
                  onClick={() => handleToggleLicense(license.franchise_number)}
                >
                  <div style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedLicenses.has(license.franchise_number)}
                      onChange={() => handleToggleLicense(license.franchise_number)}
                      style={styles.checkboxInput}
                    />
                  </div>
                  <div style={styles.licenseInfo}>
                    <div style={styles.licenseName}>
                      <strong>#{license.franchise_number}</strong> - {license.name}
                    </div>
                    <div style={styles.licenseDetails}>
                      {license.owner && (
                        <span style={styles.detail}>👤 {license.owner}</span>
                      )}
                      {license.city && license.state && (
                        <span style={styles.detail}>
                          📍 {license.city}, {license.state}
                        </span>
                      )}
                      {license.quickbooks?.department_name && (
                        <span style={styles.detail}>
                          💼 {license.quickbooks.department_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorMessage}>
                ⚠️ {error}
              </div>
            )}

            {/* Action Buttons */}
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
                {saving ? "Saving..." : `Continue with ${selectedLicenses.size} License${selectedLicenses.size !== 1 ? "s" : ""}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "40px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.5",
  },
  bulkActions: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "25px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  bulkButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  bulkButtonSecondary: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#6b7280",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  selectedCount: {
    marginLeft: "auto",
    fontSize: "14px",
    fontWeight: "600",
    color: "#3b82f6",
  },
  licenseList: {
    maxHeight: "500px",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginBottom: "25px",
  },
  licenseItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid",
  },
  checkbox: {
    marginRight: "15px",
    marginTop: "2px",
  },
  checkboxInput: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  licenseInfo: {
    flex: 1,
  },
  licenseName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  licenseDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },
  detail: {
    fontSize: "13px",
    color: "#6b7280",
  },
  errorMessage: {
    padding: "15px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  saveButton: {
    padding: "15px 40px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  errorBox: {
    textAlign: "center",
    padding: "60px 20px",
  },
  retryButton: {
    marginTop: "20px",
    padding: "12px 30px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

