import React, { useState, useEffect, useRef } from "react";

export default function ProfileWidget({ user, onLogout }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const realmId = localStorage.getItem("realm_id");
  
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [newEmail, setNewEmail] = useState({
    email: "",
    label: "",
    receive_reports: true,
    receive_billing: true,
    receive_notifications: true,
  });
  const [editingEmail, setEditingEmail] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showEmailModal && realmId) {
      fetchEmailPreferences();
    }
  }, [showEmailModal, realmId]);

  const fetchEmailPreferences = async () => {
    setLoadingEmails(true);
    setError("");
    try {
      const res = await fetch(`${backendURL}/api/email-preferences/${realmId}`);
      if (res.ok) {
        const data = await res.json();
        setEmailPreferences(data.preferences || []);
      }
    } catch (err) {
      console.error("Error fetching email preferences:", err);
      setError("Failed to load email preferences");
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.email) {
      setError("Email address is required");
      return;
    }

    setSavingEmail(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${backendURL}/api/email-preferences/${realmId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmail),
      });

      if (res.ok) {
        const data = await res.json();
        setEmailPreferences([...emailPreferences, data.preference]);
        setNewEmail({
          email: "",
          label: "",
          receive_reports: true,
          receive_billing: true,
          receive_notifications: true,
        });
        setSuccess("Email added successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to add email");
      }
    } catch (err) {
      setError("Failed to add email");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!editingEmail) return;

    setSavingEmail(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${backendURL}/api/email-preferences/${realmId}/${editingEmail.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEmail),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEmailPreferences(
          emailPreferences.map((p) => (p.id === editingEmail.id ? data.preference : p))
        );
        setEditingEmail(null);
        setSuccess("Email updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to update email");
      }
    } catch (err) {
      setError("Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDeleteEmail = async (preferenceId) => {
    if (!confirm("Are you sure you want to delete this email preference?")) return;

    try {
      const res = await fetch(
        `${backendURL}/api/email-preferences/${realmId}/${preferenceId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setEmailPreferences(emailPreferences.filter((p) => p.id !== preferenceId));
        setSuccess("Email removed");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Failed to delete email");
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setError("");

    try {
      const res = await fetch(
        `${backendURL}/api/subscriptions/account/${realmId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        localStorage.clear();
        window.location.href = "/";
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to delete account");
        setDeletingAccount(false);
      }
    } catch (err) {
      setError("Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <style>{widgetStyles}</style>
      <div ref={dropdownRef} className="profile-widget">
        {/* Avatar Button */}
        <button onClick={() => setIsOpen(!isOpen)} className={`avatar-btn ${isOpen ? 'active' : ''}`}>
          {getInitials(user?.full_name)}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="dropdown">
            <div className="dropdown-header">
              <div className="user-name">{user?.full_name || "User"}</div>
              <div className="user-email">{user?.email || "No email"}</div>
              {user?.company_name && (
                <div className="user-company">{user.company_name}</div>
              )}
            </div>

            <div className="dropdown-menu">
              <button onClick={() => { setIsOpen(false); setShowEmailModal(true); }} className="menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Preferences
              </button>

              <button onClick={() => window.location.href = "/franchises"} className="menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                </svg>
                Manage Franchises
              </button>

              <div className="menu-divider"></div>

              <button onClick={onLogout} className="menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Sign Out
              </button>

              <div className="menu-divider"></div>

              <button onClick={() => { setIsOpen(false); setShowDeleteConfirm(true); }} className="menu-item danger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Email Preferences Modal */}
        {showEmailModal && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEmailModal(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2>Email Preferences</h2>
                <button onClick={() => { setShowEmailModal(false); setEditingEmail(null); setError(""); setSuccess(""); }} className="close-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="modal-content">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Add/Edit Form */}
                <form onSubmit={editingEmail ? handleUpdateEmail : handleAddEmail} className="email-form">
                  <h3>{editingEmail ? "Edit Email" : "Add New Email"}</h3>
                  <div className="form-row">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={editingEmail ? editingEmail.email : newEmail.email}
                      onChange={(e) => editingEmail 
                        ? setEditingEmail({ ...editingEmail, email: e.target.value })
                        : setNewEmail({ ...newEmail, email: e.target.value })}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Label (optional)"
                      value={editingEmail ? editingEmail.label || "" : newEmail.label}
                      onChange={(e) => editingEmail
                        ? setEditingEmail({ ...editingEmail, label: e.target.value })
                        : setNewEmail({ ...newEmail, label: e.target.value })}
                      className="form-input small"
                    />
                  </div>
                  <div className="form-checkboxes">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editingEmail ? editingEmail.receive_reports : newEmail.receive_reports}
                        onChange={(e) => editingEmail
                          ? setEditingEmail({ ...editingEmail, receive_reports: e.target.checked })
                          : setNewEmail({ ...newEmail, receive_reports: e.target.checked })}
                      />
                      Reports
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editingEmail ? editingEmail.receive_billing : newEmail.receive_billing}
                        onChange={(e) => editingEmail
                          ? setEditingEmail({ ...editingEmail, receive_billing: e.target.checked })
                          : setNewEmail({ ...newEmail, receive_billing: e.target.checked })}
                      />
                      Billing
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editingEmail ? editingEmail.receive_notifications : newEmail.receive_notifications}
                        onChange={(e) => editingEmail
                          ? setEditingEmail({ ...editingEmail, receive_notifications: e.target.checked })
                          : setNewEmail({ ...newEmail, receive_notifications: e.target.checked })}
                      />
                      Notifications
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={savingEmail} className="btn btn-primary">
                      {savingEmail ? "Saving..." : editingEmail ? "Save Changes" : "Add Email"}
                    </button>
                    {editingEmail && (
                      <button type="button" onClick={() => setEditingEmail(null)} className="btn btn-secondary">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Email List */}
                <div className="email-list">
                  <h3>Saved Emails</h3>
                  {loadingEmails ? (
                    <p className="loading-text">Loading...</p>
                  ) : emailPreferences.length === 0 ? (
                    <p className="empty-text">No email preferences saved yet</p>
                  ) : (
                    emailPreferences.map((pref) => (
                      <div key={pref.id} className="email-item">
                        <div className="email-info">
                          <div className="email-address">
                            {pref.email}
                            {pref.is_primary && <span className="primary-badge">Primary</span>}
                          </div>
                          {pref.label && <div className="email-label">{pref.label}</div>}
                          <div className="email-tags">
                            {pref.receive_reports && <span className="tag">Reports</span>}
                            {pref.receive_billing && <span className="tag">Billing</span>}
                            {pref.receive_notifications && <span className="tag">Notifications</span>}
                          </div>
                        </div>
                        <div className="email-actions">
                          <button onClick={() => setEditingEmail(pref)} className="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteEmail(pref.id)} className="btn-icon danger">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !deletingAccount && setShowDeleteConfirm(false)}>
            <div className="modal modal-sm">
              <div className="modal-header danger">
                <h2>Delete Account?</h2>
              </div>
              <div className="modal-content">
                {error && <div className="alert alert-error">{error}</div>}
                
                <p className="delete-warning">
                  This action is <strong>permanent</strong> and cannot be undone.
                </p>
                <ul className="delete-list">
                  <li>Cancel your active subscription</li>
                  <li>Remove all your company data</li>
                  <li>Delete all email preferences</li>
                  <li>Remove franchise mappings</li>
                  <li>Disconnect your QuickBooks account</li>
                </ul>

                <div className="modal-actions">
                  <button onClick={() => { setShowDeleteConfirm(false); setError(""); }} disabled={deletingAccount} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} disabled={deletingAccount} className="btn btn-danger">
                    {deletingAccount ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const widgetStyles = `
  .profile-widget {
    position: relative;
  }

  .avatar-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    color: white;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .avatar-btn:hover, .avatar-btn.active {
    transform: scale(1.05);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 12px;
    min-width: 280px;
    z-index: 1000;
    overflow: hidden;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .dropdown-header {
    padding: 20px;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border-bottom: 1px solid #2f3336;
  }

  .user-name {
    font-size: 16px;
    font-weight: 600;
    color: #e7e9ea;
    margin-bottom: 4px;
  }

  .user-email {
    font-size: 13px;
    color: #a5b4fc;
  }

  .user-company {
    font-size: 12px;
    color: #818cf8;
    margin-top: 8px;
  }

  .dropdown-menu {
    padding: 8px;
  }

  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: none;
    color: #e7e9ea;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.15s;
    text-align: left;
  }

  .menu-item:hover {
    background: #2f3336;
  }

  .menu-item.danger {
    color: #ef4444;
  }

  .menu-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  .menu-item svg {
    color: #71767b;
  }

  .menu-item.danger svg {
    color: #ef4444;
  }

  .menu-divider {
    height: 1px;
    background: #2f3336;
    margin: 8px 0;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }

  .modal {
    background: #16181c;
    border: 1px solid #2f3336;
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal.modal-sm {
    max-width: 450px;
  }

  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #2f3336;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  }

  .modal-header.danger {
    background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%);
  }

  .modal-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: #e7e9ea;
    margin: 0;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .modal-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  /* Alerts */
  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
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

  /* Form */
  .email-form {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #2f3336;
  }

  .email-form h3 {
    font-size: 14px;
    font-weight: 600;
    color: #71767b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-input {
    flex: 1;
    padding: 12px 16px;
    background: #0f1419;
    border: 1px solid #2f3336;
    border-radius: 8px;
    color: #e7e9ea;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-input:focus {
    border-color: #6366f1;
  }

  .form-input.small {
    max-width: 160px;
  }

  .form-input::placeholder {
    color: #71767b;
  }

  .form-checkboxes {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #e7e9ea;
    cursor: pointer;
  }

  .checkbox-label input {
    width: 16px;
    height: 16px;
    accent-color: #6366f1;
  }

  .form-actions {
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
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  .btn-secondary {
    background: #2f3336;
    color: #e7e9ea;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #3a3d41;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #dc2626;
  }

  .btn-icon {
    background: none;
    border: none;
    color: #71767b;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-icon:hover {
    background: #2f3336;
    color: #e7e9ea;
  }

  .btn-icon.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* Email List */
  .email-list h3 {
    font-size: 14px;
    font-weight: 600;
    color: #71767b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .loading-text, .empty-text {
    color: #71767b;
    font-size: 14px;
    text-align: center;
    padding: 20px;
  }

  .email-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px;
    background: #0f1419;
    border: 1px solid #2f3336;
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .email-info {
    flex: 1;
  }

  .email-address {
    font-size: 15px;
    font-weight: 600;
    color: #e7e9ea;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .primary-badge {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .email-label {
    font-size: 13px;
    color: #71767b;
    margin-bottom: 8px;
  }

  .email-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .tag {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
  }

  .email-actions {
    display: flex;
    gap: 4px;
  }

  /* Delete Modal */
  .delete-warning {
    font-size: 15px;
    color: #e7e9ea;
    margin-bottom: 16px;
  }

  .delete-warning strong {
    color: #ef4444;
  }

  .delete-list {
    list-style: none;
    margin: 0 0 24px 0;
    padding: 0;
  }

  .delete-list li {
    font-size: 14px;
    color: #71767b;
    padding: 8px 0;
    border-bottom: 1px solid #2f3336;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .delete-list li:before {
    content: "•";
    color: #ef4444;
  }

  .delete-list li:last-child {
    border-bottom: none;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    .dropdown {
      min-width: 260px;
    }

    .form-row {
      flex-direction: column;
    }

    .form-input.small {
      max-width: 100%;
    }

    .modal-actions {
      flex-direction: column;
    }

    .modal-actions .btn {
      width: 100%;
    }
  }
`;
