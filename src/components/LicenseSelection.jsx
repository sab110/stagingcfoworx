import React, { useEffect, useState } from "react";
import { LoadingScreen, ErrorScreen, Spinner, Alert } from "./ui";

export default function LicenseSelection({ realmId, onComplete, isManageMode = false }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [licenses, setLicenses] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({ field: 'franchise_number', direction: 'asc' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

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
      <span style={{ marginLeft: '4px', opacity: isActive ? 1 : 0.3, display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle' }}>
        <svg width="8" height="5" viewBox="0 0 8 5" style={{ marginBottom: '-1px' }}><path d="M4 0L7 4H1L4 0Z" fill={isActive && sortConfig.direction === 'asc' ? '#059669' : '#94A3B8'} /></svg>
        <svg width="8" height="5" viewBox="0 0 8 5"><path d="M4 5L1 1H7L4 5Z" fill={isActive && sortConfig.direction === 'desc' ? '#059669' : '#94A3B8'} /></svg>
      </span>
    );
  };

  const filteredLicenses = licenses
    .filter(lic => {
      const matchesSearch = lic.franchise_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lic.city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isSelected = selectedLicenses.has(lic.franchise_number);
      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "selected" && isSelected) || 
        (filterStatus === "unselected" && !isSelected);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const getValue = (obj) => {
        switch (sortConfig.field) {
          case 'franchise_number': return obj.franchise_number || '';
          case 'name': return obj.name || '';
          case 'city': return obj.city || '';
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

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading your franchises..."
        submessage="Fetching data from QuickBooks"
        showLogo={false}
        fullScreen={false}
      />
    );
  }

  if (error && licenses.length === 0) {
    return (
      <ErrorScreen 
        title="Error Loading Franchises"
        message={error}
        onRetry={fetchLicenses}
        fullScreen={false}
      />
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
                <span style={{...styles.statValue, color: '#059669'}}>{selectedLicenses.size}</span>
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
                  onChange={(e) => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                  style={styles.searchInput}
                />
              </div>
              <select 
                value={filterStatus} 
                onChange={(e) => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                style={{
                  padding: '10px 32px 10px 14px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: '#fff',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                }}
              >
                <option value="all">All ({licenses.length})</option>
                <option value="selected">Selected ({selectedLicenses.size})</option>
                <option value="unselected">Unselected ({licenses.length - selectedLicenses.size})</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Show</span>
                <select 
                  value={pagination.limit} 
                  onChange={(e) => setPagination({ page: 1, limit: parseInt(e.target.value) })}
                  style={{
                    padding: '8px 28px 8px 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    background: '#fff',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 4L5 6.5L7.5 4' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                  }}
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
                    padding: '8px 12px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
              <div style={styles.bulkButtons}>
                <button onClick={handleSelectAll} style={styles.bulkButton}>
                  Select All
                </button>
                <button onClick={handleDeselectAll} style={styles.bulkButtonSecondary}>
                  Deselect All
                </button>
              </div>
            </div>
            
            {/* Sort Bar */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '12px',
              padding: '10px 16px',
              background: '#F8FAFC',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#64748B',
            }}>
              <span style={{ fontWeight: '500' }}>Sort by:</span>
              <button 
                onClick={() => handleSort('franchise_number')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: sortConfig.field === 'franchise_number' ? '#059669' : '#64748B', fontWeight: sortConfig.field === 'franchise_number' ? '600' : '400', display: 'flex', alignItems: 'center', fontSize: '13px' }}
              >
                Franchise #<SortIcon field="franchise_number" />
              </button>
              <button 
                onClick={() => handleSort('name')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: sortConfig.field === 'name' ? '#059669' : '#64748B', fontWeight: sortConfig.field === 'name' ? '600' : '400', display: 'flex', alignItems: 'center', fontSize: '13px' }}
              >
                Name<SortIcon field="name" />
              </button>
              <button 
                onClick={() => handleSort('city')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: sortConfig.field === 'city' ? '#059669' : '#64748B', fontWeight: sortConfig.field === 'city' ? '600' : '400', display: 'flex', alignItems: 'center', fontSize: '13px' }}
              >
                Location<SortIcon field="city" />
              </button>
              <span style={{ marginLeft: 'auto' }}>{filteredLicenses.length} results</span>
            </div>

            {/* License List */}
            <div style={styles.licenseList}>
              {paginatedLicenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                  <p>No franchises match your search or filter</p>
                </div>
              ) : (
                paginatedLicenses.map((license) => {
                  const isSelected = selectedLicenses.has(license.franchise_number);
                  return (
                    <div
                      key={license.franchise_number}
                      style={{
                        ...styles.licenseItem,
                        backgroundColor: isSelected ? '#ECFDF5' : '#fff',
                        borderColor: isSelected ? '#059669' : '#E2E8F0',
                      }}
                      onClick={() => handleToggleLicense(license.franchise_number)}
                    >
                      <div style={{
                        ...styles.checkbox,
                        backgroundColor: isSelected ? '#059669' : '#fff',
                        borderColor: isSelected ? '#059669' : '#CBD5E1',
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
                })
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderTop: '1px solid #E2E8F0',
                marginTop: '16px',
              }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, filteredLicenses.length)} of {filteredLicenses.length}
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
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert type="error" style={{ marginBottom: '24px' }}>
                {error}
              </Alert>
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
                    <Spinner size="xs" color="white" />
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
    backgroundColor: "#059669",
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
    color: "#059669",
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
    backgroundColor: "#059669",
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
    borderTopColor: "#059669",
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
    backgroundColor: "#059669",
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
