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
  const [searchQuery, setSearchQuery] = useState("");

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
      setLicenses(data.licenses || []);
      setCompanyName(data.company_name || "");
    } catch (err) {
      console.error("Error fetching licenses:", err);
      setError("Failed to load franchises. Please try again.");
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
          body: JSON.stringify({ is_active: newActive }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update license");
      }

      setLicenses(prev => prev.map(lic => {
        if (lic.franchise_number === franchiseNumber) {
          return { ...lic, quickbooks: { ...lic.quickbooks, is_active: newActive } };
        }
        return lic;
      }));

      setSuccess(`Franchise #${franchiseNumber} ${newActive === "true" ? "activated" : "deactivated"}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating license:", err);
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
          body: JSON.stringify({ franchise_numbers: allFranchiseNumbers }),
        }
      );

      if (!response.ok) throw new Error("Failed to activate all");

      await fetchLicenses();
      setSuccess("All franchises activated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error bulk activating:", err);
      setError("Failed to activate all franchises");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate all franchises?")) return;
    
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${backendURL}/api/licenses/company/${realmId}/select-licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ franchise_numbers: [] }),
        }
      );

      if (!response.ok) throw new Error("Failed to deactivate all");

      await fetchLicenses();
      setSuccess("All franchises deactivated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error bulk deactivating:", err);
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

  const filteredLicenses = licenses.filter(lic => 
    lic.franchise_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lic.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your franchises...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="page">
        {/* Top Navigation */}
        <header className="navbar">
          <div className="navbar-left">
            <button onClick={() => navigate("/dashboard")} className="back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <div className="nav-divider"></div>
            <div className="logo">
              <div className="logo-icon">CW</div>
              <span className="logo-text">CFO Worx</span>
            </div>
          </div>
          <ProfileWidget user={user} onLogout={handleLogout} />
        </header>

        {/* Main Content */}
        <main className="main">
          <div className="container">
            {/* Page Header */}
            <div className="page-header">
              <div>
                <h1>Franchise Management</h1>
                {companyName && <p className="subtitle">{companyName}</p>}
              </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-value text-success">{activeCount}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-danger">{inactiveCount}</div>
                <div className="stat-label">Inactive</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{licenses.length}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="actions-bar">
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search franchises..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="action-buttons">
                <button 
                  onClick={handleBulkActivate} 
                  disabled={saving || activeCount === licenses.length}
                  className="btn btn-success"
                >
                  Activate All
                </button>
                <button 
                  onClick={handleBulkDeactivate} 
                  disabled={saving || inactiveCount === licenses.length}
                  className="btn btn-danger"
                >
                  Deactivate All
                </button>
                <button onClick={fetchLicenses} className="btn btn-secondary">
                  Refresh
                </button>
              </div>
            </div>

            {/* Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Table */}
            {filteredLicenses.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                </svg>
                <h3>{searchQuery ? "No matching franchises" : "No franchises found"}</h3>
                <p>{searchQuery ? "Try adjusting your search" : "Make sure your QuickBooks departments are set up"}</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Franchise #</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLicenses.map((license) => {
                      const isActive = license.quickbooks?.is_active === "true";
                      return (
                        <tr key={license.franchise_number}>
                          <td><span className="franchise-num">#{license.franchise_number}</span></td>
                          <td>{license.name}</td>
                          <td>{license.city && license.state ? `${license.city}, ${license.state}` : "—"}</td>
                          <td>{license.quickbooks?.department_name || "—"}</td>
                          <td>
                            <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleLicense(license.franchise_number, license.quickbooks?.is_active || "false")}
                              disabled={saving}
                              className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
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
            )}
          </div>
        </main>
      </div>
    </>
  );
}

const pageStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .page {
    min-height: 100vh;
    background: #0f1419;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #e7e9ea;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #0f1419;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-container p {
    margin-top: 16px;
    color: #71767b;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Navbar */
  .navbar {
    background: #16181c;
    border-bottom: 1px solid #2f3336;
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #71767b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.15s;
  }

  .back-btn:hover {
    background: #2f3336;
    color: #e7e9ea;
  }

  .nav-divider {
    width: 1px;
    height: 24px;
    background: #2f3336;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    color: white;
  }

  .logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #e7e9ea;
  }

  /* Main */
  .main {
    padding: 32px;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Page Header */
  .page-header {
    margin-bottom: 32px;
  }

  .page-header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #71767b;
    font-size: 15px;
  }

  /* Stats Row */
  .stats-row {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
  }

  .stat-item {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 20px 32px;
    text-align: center;
    min-width: 120px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: #71767b;
  }

  .text-success { color: #10b981; }
  .text-danger { color: #ef4444; }

  /* Actions Bar */
  .actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 10px;
    padding: 12px 16px;
    flex: 1;
    max-width: 400px;
  }

  .search-box svg {
    color: #71767b;
    flex-shrink: 0;
  }

  .search-box input {
    background: none;
    border: none;
    color: #e7e9ea;
    font-size: 14px;
    outline: none;
    width: 100%;
  }

  .search-box input::placeholder {
    color: #71767b;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }

  /* Buttons */
  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .btn-success:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.25);
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.25);
  }

  .btn-secondary {
    background: #2f3336;
    color: #e7e9ea;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #3a3d41;
  }

  .btn-sm {
    padding: 6px 14px;
    font-size: 13px;
  }

  .btn-outline-success {
    background: transparent;
    color: #10b981;
    border: 1px solid #10b981;
  }

  .btn-outline-success:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.15);
  }

  .btn-outline-danger {
    background: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
  }

  .btn-outline-danger:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.15);
  }

  /* Alerts */
  .alert {
    padding: 14px 20px;
    border-radius: 10px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }

  .alert-error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .alert-success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
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
    padding: 16px 20px;
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
    padding: 16px 20px;
    font-size: 14px;
    color: #e7e9ea;
    border-bottom: 1px solid #2f3336;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .data-table tr:hover td {
    background: rgba(99, 102, 241, 0.05);
  }

  .franchise-num {
    font-weight: 600;
    color: #818cf8;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .status-badge {
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.active {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .status-badge.inactive {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  /* Empty State */
  .empty-state {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
  }

  .empty-state svg {
    color: #71767b;
    margin-bottom: 20px;
  }

  .empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .empty-state p {
    font-size: 14px;
    color: #71767b;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .navbar {
      padding: 12px 16px;
    }

    .main {
      padding: 20px 16px;
    }

    .page-header h1 {
      font-size: 24px;
    }

    .stats-row {
      flex-wrap: wrap;
    }

    .stat-item {
      flex: 1;
      min-width: 100px;
      padding: 16px;
    }

    .stat-value {
      font-size: 24px;
    }

    .actions-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .search-box {
      max-width: 100%;
    }

    .action-buttons {
      flex-wrap: wrap;
    }

    .action-buttons .btn {
      flex: 1;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      min-width: 700px;
    }

    .logo-text {
      display: none;
    }
  }
`;
