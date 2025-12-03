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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch email preferences when modal opens
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
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to load email preferences");
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
        setSuccess("Email added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to add email");
      }
    } catch (err) {
      console.error("Error adding email:", err);
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
          emailPreferences.map((p) =>
            p.id === editingEmail.id ? data.preference : p
          )
        );
        setEditingEmail(null);
        setSuccess("Email updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to update email");
      }
    } catch (err) {
      console.error("Error updating email:", err);
      setError("Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDeleteEmail = async (preferenceId) => {
    if (!confirm("Are you sure you want to delete this email preference?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${backendURL}/api/email-preferences/${realmId}/${preferenceId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setEmailPreferences(emailPreferences.filter((p) => p.id !== preferenceId));
        setSuccess("Email removed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to delete email");
      }
    } catch (err) {
      console.error("Error deleting email:", err);
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
        // Clear all local storage
        localStorage.clear();
        // Redirect to login page
        window.location.href = "/";
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to delete account");
        setDeletingAccount(false);
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account");
      setDeletingAccount(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "2px solid rgba(255,255,255,0.3)",
          color: "white",
          fontWeight: "700",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 0 0 3px rgba(102, 126, 234, 0.4)" : "none",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {getInitials(user?.full_name)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            minWidth: "280px",
            zIndex: 1000,
            overflow: "hidden",
            animation: "slideDown 0.2s ease",
          }}
        >
          {/* User Info Header */}
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
              {user?.full_name || "User"}
            </div>
            <div style={{ fontSize: "13px", opacity: 0.9 }}>
              {user?.email || "No email"}
            </div>
            {user?.company_name && (
              <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
                🏢 {user.company_name}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div style={{ padding: "8px 0" }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowEmailModal(true);
              }}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#334155",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>📧</span>
              Email Preferences
            </button>

            <button
              onClick={() => {
                window.location.href = "/franchises";
              }}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#334155",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>🏢</span>
              Manage Franchises
            </button>

            <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "8px 0" }} />

            <button
              onClick={onLogout}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#334155",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>🚪</span>
              Sign Out
            </button>

            <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "8px 0" }} />

            <button
              onClick={() => {
                setIsOpen(false);
                setShowDeleteConfirm(true);
              }}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>⚠️</span>
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Email Preferences Modal */}
      {showEmailModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmailModal(false);
              setEditingEmail(null);
              setError("");
              setSuccess("");
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "85vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                📧 Email Preferences
              </h2>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEditingEmail(null);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px", overflow: "auto", flex: 1 }}>
              {/* Messages */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    color: "#16a34a",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {success}
                </div>
              )}

              {/* Add New Email Form */}
              {!editingEmail && (
                <form onSubmit={handleAddEmail} style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#334155" }}>
                    Add New Email
                  </h3>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={newEmail.email}
                      onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Label (optional)"
                      value={newEmail.label}
                      onChange={(e) => setNewEmail({ ...newEmail, label: e.target.value })}
                      style={{
                        width: "140px",
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newEmail.receive_reports}
                        onChange={(e) => setNewEmail({ ...newEmail, receive_reports: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Reports
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newEmail.receive_billing}
                        onChange={(e) => setNewEmail({ ...newEmail, receive_billing: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Billing
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newEmail.receive_notifications}
                        onChange={(e) => setNewEmail({ ...newEmail, receive_notifications: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Notifications
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={savingEmail}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: savingEmail ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      opacity: savingEmail ? 0.7 : 1,
                    }}
                  >
                    {savingEmail ? "Adding..." : "Add Email"}
                  </button>
                </form>
              )}

              {/* Edit Email Form */}
              {editingEmail && (
                <form onSubmit={handleUpdateEmail} style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#334155" }}>
                    Edit Email
                  </h3>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={editingEmail.email}
                      onChange={(e) => setEditingEmail({ ...editingEmail, email: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Label (optional)"
                      value={editingEmail.label || ""}
                      onChange={(e) => setEditingEmail({ ...editingEmail, label: e.target.value })}
                      style={{
                        width: "140px",
                        padding: "12px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingEmail.receive_reports}
                        onChange={(e) => setEditingEmail({ ...editingEmail, receive_reports: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Reports
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingEmail.receive_billing}
                        onChange={(e) => setEditingEmail({ ...editingEmail, receive_billing: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Billing
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={editingEmail.receive_notifications}
                        onChange={(e) => setEditingEmail({ ...editingEmail, receive_notifications: e.target.checked })}
                        style={{ width: "16px", height: "16px", accentColor: "#667eea" }}
                      />
                      Notifications
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      disabled={savingEmail}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        cursor: savingEmail ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        opacity: savingEmail ? 0.7 : 1,
                      }}
                    >
                      {savingEmail ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEmail(null)}
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Email List */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#334155" }}>
                  Saved Email Addresses
                </h3>
                
                {loadingEmails ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                    Loading emails...
                  </div>
                ) : emailPreferences.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                    No email preferences saved yet. Add your first email above.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {emailPreferences.map((pref) => (
                      <div
                        key={pref.id}
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "16px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <div>
                            <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "15px" }}>
                              {pref.email}
                              {pref.is_primary && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    backgroundColor: "#dbeafe",
                                    color: "#2563eb",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                  }}
                                >
                                  PRIMARY
                                </span>
                              )}
                            </div>
                            {pref.label && (
                              <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
                                {pref.label}
                              </div>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => setEditingEmail(pref)}
                              style={{
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmail(pref.id)}
                              style={{
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {pref.receive_reports && (
                            <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>
                              📊 Reports
                            </span>
                          )}
                          {pref.receive_billing && (
                            <span style={{ backgroundColor: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>
                              💳 Billing
                            </span>
                          )}
                          {pref.receive_notifications && (
                            <span style={{ backgroundColor: "#dbeafe", color: "#2563eb", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>
                              🔔 Notifications
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !deletingAccount) {
              setShowDeleteConfirm(false);
              setError("");
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "450px",
              overflow: "hidden",
            }}
          >
            {/* Warning Header */}
            <div
              style={{
                padding: "24px",
                backgroundColor: "#fef2f2",
                borderBottom: "1px solid #fecaca",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚠️</div>
              <h2 style={{ margin: 0, fontSize: "22px", color: "#dc2626", fontWeight: "700" }}>
                Delete Your Account?
              </h2>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {error && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", margin: "0 0 16px 0" }}>
                This action is <strong style={{ color: "#dc2626" }}>permanent and cannot be undone</strong>. 
                Deleting your account will:
              </p>

              <ul style={{ color: "#334155", fontSize: "14px", lineHeight: "1.8", margin: "0 0 24px 0", paddingLeft: "20px" }}>
                <li>Cancel your active subscription</li>
                <li>Remove all your company data</li>
                <li>Delete all email preferences</li>
                <li>Remove franchise mappings</li>
                <li>Disconnect your QuickBooks account</li>
              </ul>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setError("");
                  }}
                  disabled={deletingAccount}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                    border: "none",
                    borderRadius: "8px",
                    cursor: deletingAccount ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: deletingAccount ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    opacity: deletingAccount ? 0.7 : 1,
                  }}
                >
                  {deletingAccount ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
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
      `}</style>
    </div>
  );
}

