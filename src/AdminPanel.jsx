import React, { useState, useRef } from "react";
import { C, serif, sans, EMAILJS_CONFIG } from "./constants";

export default function AdminPanel({
  user,
  requests,
  setRequests,
  managerNotes,
  setManagerNotes,
  allUsers,
  setAllUsers,
  allLots,
  setAllLots,
  financeRate,
  setFinanceRate,
  adminTab,
  setAdminTab,
  editingLot,
  setEditingLot,
  showCreateLot,
  setShowCreateLot,
  newLotForm,
  setNewLotForm,
  bulkUploadResult,
  setBulkUploadResult,
  lotFileInputRef,
  adminPropertyFilter,
  setAdminPropertyFilter,
  editingUser,
  setEditingUser,
  showCreateUser,
  setShowCreateUser,
  newUserForm,
  setNewUserForm,
  handleLogout,
  handleChangeRequestStatus,
  handleToggleLotStatus,
  calcMonthlyPayment,
  handleDownloadLotTemplate,
  handleBulkLotUpload,
  renderNav,
}) {
  const [managerFilter, setManagerFilter] = useState("all");

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      <div style={{ backgroundColor: C.bgCard, padding: "12px", position: "sticky", top: 0, zIndex: 999, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontFamily: serif, fontSize: "24px", letterSpacing: "2px", color: C.cyan, margin: 0 }}>ADMIN</h1>
          <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: C.danger, color: C.text, border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "12px" }}>Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", padding: "12px", borderBottom: `1px solid ${C.border}`, backgroundColor: C.bgAlt, overflow: "auto" }}>
        <button onClick={() => setAdminTab("requests")} style={{ padding: "8px 16px", backgroundColor: adminTab === "requests" ? C.cyan : "transparent", color: adminTab === "requests" ? C.bg : C.cyan, border: `1px solid ${adminTab === "requests" ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>Requests</button>
        <button onClick={() => setAdminTab("users")} style={{ padding: "8px 16px", backgroundColor: adminTab === "users" ? C.cyan : "transparent", color: adminTab === "users" ? C.bg : C.cyan, border: `1px solid ${adminTab === "users" ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>Users</button>
        <button onClick={() => setAdminTab("lots")} style={{ padding: "8px 16px", backgroundColor: adminTab === "lots" ? C.cyan : "transparent", color: adminTab === "lots" ? C.bg : C.cyan, border: `1px solid ${adminTab === "lots" ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>Lots</button>
      </div>

      <div style={{ flex: 1, padding: "16px", fontFamily: sans, overflow: "auto", marginBottom: "70px" }}>
        {adminTab === "requests" && (
          <div>
            <h2 style={{ fontSize: "18px", color: C.cyan, marginBottom: "16px", fontFamily: serif }}>Concierge Requests</h2>

            {/* Property Selector */}
            <div style={{ display: "flex", gap: "0", marginBottom: "12px" }}>
              {["Algodon Mansion", "Algodon Wine Estates"].map(prop => (
                <button key={prop} onClick={() => { setAdminPropertyFilter(prop); setManagerFilter("all"); }} style={{ flex: 1, padding: "10px", backgroundColor: adminPropertyFilter === prop ? C.cyan : C.bgCard, color: adminPropertyFilter === prop ? C.bg : C.text, border: `1px solid ${adminPropertyFilter === prop ? C.cyan : C.border}`, borderRadius: prop === "Algodon Mansion" ? "6px 0 0 6px" : "0 6px 6px 0", cursor: "pointer", fontFamily: serif, fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>
                  {prop === "Algodon Mansion" ? "ALGODON MANSION" : "WINE ESTATES"}
                  {(() => { const count = requests.filter(r => (prop === "Algodon Wine Estates" ? (r.property === "Algodon Wine Estates" || r.property === "Casa Gaucho") : r.property === prop) && (r.status === "Pending" || r.status === "Answer Requested")).length; return count > 0 ? ` (${count})` : ""; })()}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {["all", "pending", "confirmed", "declined"].map(filter => (
                <button key={filter} onClick={() => setManagerFilter(filter)} style={{ flex: 1, padding: "6px", backgroundColor: managerFilter === filter ? C.cyan : C.bgCard, color: managerFilter === filter ? C.bg : C.text, border: `1px solid ${managerFilter === filter ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>
                  {filter}
                </button>
              ))}
            </div>

            {/* Request Cards */}
            {(() => {
              const propertyRequests = requests.filter(r => adminPropertyFilter === "Algodon Wine Estates" ? (r.property === "Algodon Wine Estates" || r.property === "Casa Gaucho") : r.property === adminPropertyFilter);
              const filtered = propertyRequests.filter(r => managerFilter === "all" || (managerFilter === "pending" && (r.status === "Pending" || r.status === "Answer Requested")) || r.status.toLowerCase() === managerFilter.toLowerCase());
              const sorted = filtered.sort((a, b) => {
                if (a.status === "Pending" && b.status !== "Pending") return -1;
                if (a.status !== "Pending" && b.status === "Pending") return 1;
                return 0;
              });
              return sorted.length === 0 ? (
                <div style={{ backgroundColor: C.bgCard, padding: "24px", borderRadius: "8px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>{propertyRequests.length === 0 ? "No requests yet" : "No requests match this filter"}</p>
                </div>
              ) : (
                sorted.map(req => (
                  <div key={req.id} style={{ backgroundColor: C.bgCard, padding: "14px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${req.status === "Pending" || req.status === "Answer Requested" ? C.pending : req.status === "Confirmed" ? C.success : C.danger}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px 0", color: C.text, fontSize: "14px", fontWeight: "600" }}>{req.type}</h3>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "11px" }}>Guest: {req.guestName} · Res #: {req.reservationNumber}</p>
                      </div>
                      <span style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "3px", fontWeight: "600", backgroundColor: req.status === "Pending" || req.status === "Answer Requested" ? C.pending : req.status === "Confirmed" ? C.success : C.danger, color: "#fff" }}>{req.status === "Answer Requested" ? "Pending" : req.status}</span>
                    </div>
                    <p style={{ margin: "6px 0", color: C.textMuted, fontSize: "11px" }}>{typeof req.details === "string" ? req.details : JSON.stringify(req.details)}</p>
                    {req.property === "Casa Gaucho" && <p style={{ margin: "0 0 4px 0", color: C.cyan, fontSize: "10px", fontWeight: "600" }}>Casa Gaucho</p>}
                    <p style={{ margin: 0, color: C.textDim, fontSize: "10px", marginBottom: "8px" }}>Submitted: {req.date}</p>
                    {(req.status === "Pending" || req.status === "Answer Requested") ? (
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
                        <textarea value={managerNotes[req.id] || ""} onChange={(e) => setManagerNotes(prev => ({ ...prev, [req.id]: e.target.value }))} placeholder="Add response notes (optional)" style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", minHeight: "50px", boxSizing: "border-box", resize: "vertical", marginBottom: "8px" }} />
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleChangeRequestStatus(req.id, "Confirmed")} style={{ flex: 1, padding: "8px", backgroundColor: C.success, border: "none", borderRadius: "4px", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: sans }}>Confirm</button>
                          <button onClick={() => handleChangeRequestStatus(req.id, "Declined")} style={{ flex: 1, padding: "8px", backgroundColor: C.danger, border: "none", borderRadius: "4px", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: sans }}>Decline</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {req.managerNotes && <p style={{ margin: "8px 0 0 0", color: C.textMuted, fontSize: "10px", fontStyle: "italic", backgroundColor: C.bgCard2, padding: "6px", borderRadius: "4px" }}>Response: {req.managerNotes}</p>}
                        {req.confirmedBy && <p style={{ margin: "4px 0 0 0", color: req.status === "Confirmed" ? C.success : C.danger, fontSize: "10px", fontWeight: "600" }}>{req.status} by {req.confirmedBy}</p>}
                      </>
                    )}
                  </div>
                ))
              );
            })()}
          </div>
        )}

        {adminTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", color: C.cyan, margin: 0, fontFamily: serif }}>User Management</h2>
              <button onClick={() => { setShowCreateUser(true); setNewUserForm({ name: "", email: "", role: "guest", property: null }); }} style={{ padding: "6px 14px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600" }}>+ New User</button>
            </div>

            {/* Role Count Summary */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
              {["all", "admin", "manager", "member", "guest"].map(f => {
                const count = f === "all" ? allUsers.length : allUsers.filter(u => u.role === f).length;
                return (
                  <span key={f} style={{ padding: "4px 10px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", fontSize: "10px", color: C.textMuted, fontFamily: sans }}>
                    {f === "all" ? "All" : f === "member" ? "Member" : f.charAt(0).toUpperCase() + f.slice(1)}: {count}
                  </span>
                );
              })}
            </div>

            {/* Create New User Form */}
            {showCreateUser && (
              <div style={{ backgroundColor: C.cyanBg, padding: "14px", borderRadius: "6px", border: `1px solid ${C.cyan}`, marginBottom: "12px" }}>
                <h3 style={{ fontSize: "13px", color: C.cyan, margin: "0 0 10px 0", fontFamily: serif }}>Create New User</h3>
                <input type="text" placeholder="Full Name *" value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px", boxSizing: "border-box", marginBottom: "8px" }} />
                <input type="email" placeholder="Email *" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px", boxSizing: "border-box", marginBottom: "8px" }} />
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <select value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value, property: e.target.value === "manager" ? "Algodon Mansion" : null })} style={{ flex: 1, padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Gaucho Member</option>
                    <option value="guest">Guest</option>
                  </select>
                  {newUserForm.role === "manager" && (
                    <select value={newUserForm.property || "Algodon Mansion"} onChange={(e) => setNewUserForm({ ...newUserForm, property: e.target.value })} style={{ flex: 1, padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }}>
                      <option value="Algodon Mansion">Algodon Mansion</option>
                      <option value="Algodon Wine Estates">Algodon Wine Estates</option>
                    </select>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => {
                    if (!newUserForm.name || !newUserForm.email) return alert("Name and email are required");
                    setAllUsers(prev => [...prev, { id: Date.now(), ...newUserForm }]);
                    setShowCreateUser(false);
                    setNewUserForm({ name: "", email: "", role: "guest", property: null });
                  }} style={{ flex: 1, padding: "8px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px" }}>Create User</button>
                  <button onClick={() => setShowCreateUser(false)} style={{ padding: "8px 16px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "12px" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* User List */}
            {allUsers.map(u => (
              <div key={u.id} style={{ backgroundColor: C.bgCard, padding: "14px", marginBottom: "10px", borderRadius: "6px", border: `1px solid ${editingUser === u.id ? C.cyan : C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    {editingUser === u.id ? (
                      <input type="text" value={u.name} onChange={(e) => setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, name: e.target.value } : usr))} style={{ width: "100%", padding: "4px 6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "13px", fontWeight: "600", boxSizing: "border-box", marginBottom: "4px" }} />
                    ) : (
                      <h3 style={{ margin: "0 0 2px 0", color: C.text, fontSize: "14px", fontWeight: "600" }}>{u.name}</h3>
                    )}
                    {editingUser === u.id ? (
                      <input type="email" value={u.email} onChange={(e) => setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, email: e.target.value } : usr))} style={{ width: "100%", padding: "4px 6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.textMuted, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                    ) : (
                      <p style={{ margin: 0, color: C.textMuted, fontSize: "11px" }}>{u.email}</p>
                    )}
                  </div>
                  <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "3px", fontWeight: "600", color: "#fff", backgroundColor: u.role === "admin" ? C.danger : u.role === "manager" ? C.cyan : u.role === "member" ? C.success : C.textMuted, marginLeft: "8px", whiteSpace: "nowrap" }}>{u.role === "member" ? "Gaucho Member" : u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                </div>

                {editingUser === u.id ? (
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                      <select value={u.role} onChange={(e) => setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: e.target.value, property: e.target.value === "manager" ? usr.property || "Algodon Mansion" : null } : usr))} style={{ flex: 1, padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="member">Gaucho Member</option>
                        <option value="guest">Guest</option>
                      </select>
                      {u.role === "manager" && (
                        <select value={u.property || ""} onChange={(e) => setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, property: e.target.value } : usr))} style={{ flex: 1, padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                          <option value="Algodon Mansion">Algodon Mansion</option>
                          <option value="Algodon Wine Estates">Algodon Wine Estates</option>
                        </select>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditingUser(null)} style={{ flex: 1, padding: "6px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "11px" }}>Done</button>
                      <button onClick={() => { if (confirm("Delete user " + u.name + "?")) { setAllUsers(prev => prev.filter(usr => usr.id !== u.id)); setEditingUser(null); } }} style={{ padding: "6px 12px", backgroundColor: C.danger, color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600" }}>Delete</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {u.property && u.role === "manager" && <p style={{ margin: 0, fontSize: "10px", color: C.textDim }}>Property: {u.property}</p>}
                    <button onClick={() => setEditingUser(u.id)} style={{ padding: "4px 12px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "10px", fontWeight: "600", marginLeft: "auto" }}>Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {adminTab === "lots" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "18px", color: C.cyan, margin: 0, fontFamily: serif }}>Lot Management</h2>
              <span style={{ fontSize: "11px", color: C.textMuted }}>{allLots.length} lots</span>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
              <button onClick={() => { setShowCreateLot(!showCreateLot); setNewLotForm({ id: "", acres: "", m2: "", total: "", desc: "", maintenance: "", village: "Wine & Golf", status: "available", financeYears: "10", downpayment: "" }); }} style={{ padding: "7px 14px", backgroundColor: showCreateLot ? C.danger : C.cyan, color: showCreateLot ? "#fff" : C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px" }}>{showCreateLot ? "Cancel" : "+ New Lot"}</button>
              <button onClick={() => lotFileInputRef.current?.click()} style={{ padding: "7px 14px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px" }}>📤 Bulk Upload</button>
              <button onClick={handleDownloadLotTemplate} style={{ padding: "7px 14px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "4px", cursor: "pointer", fontWeight: "500", fontFamily: sans, fontSize: "12px" }}>📥 Download Template</button>
              <input ref={lotFileInputRef} type="file" accept=".csv" onChange={handleBulkLotUpload} style={{ display: "none" }} />
            </div>

            {/* Finance Rate Setting */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", backgroundColor: C.bgCard, padding: "10px 14px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: sans, whiteSpace: "nowrap" }}>Finance Rate (%):</span>
              <input type="number" step="0.1" min="0" max="30" value={financeRate} onChange={(e) => setFinanceRate(parseFloat(e.target.value) || 0)} style={{ width: "70px", padding: "5px 8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.cyan, fontFamily: sans, fontSize: "13px", fontWeight: "600", textAlign: "center", boxSizing: "border-box" }} />
              <span style={{ fontSize: "10px", color: C.textDim, fontFamily: sans }}>Annual rate applied to all lot financing calculations</span>
            </div>

            {/* Bulk Upload Result Toast */}
            {bulkUploadResult && (
              <div style={{ backgroundColor: bulkUploadResult.success ? `${C.success}15` : `${C.danger}15`, border: `1px solid ${bulkUploadResult.success ? C.success : C.danger}`, borderRadius: "6px", padding: "10px 14px", marginBottom: "14px" }}>
                <p style={{ margin: 0, color: bulkUploadResult.success ? C.success : C.danger, fontSize: "12px", fontWeight: "600" }}>{bulkUploadResult.message}</p>
                {bulkUploadResult.skippedDetails && bulkUploadResult.skippedDetails.length > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    {bulkUploadResult.skippedDetails.map((s, i) => (
                      <p key={i} style={{ margin: "2px 0", color: C.pending, fontSize: "10px" }}>⚠ {s}</p>
                    ))}
                  </div>
                )}
                <button onClick={() => setBulkUploadResult(null)} style={{ marginTop: "6px", padding: "4px 10px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "3px", cursor: "pointer", fontFamily: sans, fontSize: "10px" }}>Dismiss</button>
              </div>
            )}

            {/* Create New Lot Form */}
            {showCreateLot && (
              <div style={{ backgroundColor: C.bgCard, padding: "16px", borderRadius: "8px", border: `1px solid ${C.cyan}`, marginBottom: "16px" }}>
                <h3 style={{ fontSize: "14px", color: C.cyan, margin: "0 0 12px 0", fontFamily: serif }}>Create New Lot</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Lot ID *</label>
                    <input type="text" placeholder="e.g. E25" value={newLotForm.id} onChange={(e) => setNewLotForm({ ...newLotForm, id: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Status</label>
                    <select value={newLotForm.status} onChange={(e) => setNewLotForm({ ...newLotForm, status: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="inquire">Inquire</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Village</label>
                    <select value={newLotForm.village} onChange={(e) => setNewLotForm({ ...newLotForm, village: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                      <option value="Wine & Golf">Wine & Golf</option>
                      <option value="Garden Estate">Garden Estate</option>
                      <option value="Desert & Vineyard">Desert & Vineyard</option>
                      <option value="Vineyard Estate">Vineyard Estate</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Acres</label>
                    <input type="number" step="0.01" placeholder="0.00" value={newLotForm.acres} onChange={(e) => setNewLotForm({ ...newLotForm, acres: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Size (m²)</label>
                    <input type="number" placeholder="0" value={newLotForm.m2} onChange={(e) => setNewLotForm({ ...newLotForm, m2: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Total Price ($)</label>
                    <input type="number" placeholder="0" value={newLotForm.total} onChange={(e) => setNewLotForm({ ...newLotForm, total: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Monthly Maintenance ($)</label>
                    <input type="number" step="0.01" placeholder="0.00" value={newLotForm.maintenance} onChange={(e) => setNewLotForm({ ...newLotForm, maintenance: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Finance Term (years)</label>
                    <input type="number" min="1" max="30" placeholder="10" value={newLotForm.financeYears} onChange={(e) => setNewLotForm({ ...newLotForm, financeYears: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Downpayment ($)</label>
                    <input type="number" placeholder="0" value={newLotForm.downpayment} onChange={(e) => setNewLotForm({ ...newLotForm, downpayment: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Description</label>
                  <textarea placeholder="Lot description..." value={newLotForm.desc} onChange={(e) => setNewLotForm({ ...newLotForm, desc: e.target.value })} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box", minHeight: "50px", resize: "vertical" }} />
                </div>
                <button onClick={() => { if (!newLotForm.id.trim()) return; if (allLots.find(l => l.id === newLotForm.id.trim())) { alert("A lot with this ID already exists"); return; } const totalVal = parseInt(newLotForm.total) || null; setAllLots(prev => [...prev, { id: newLotForm.id.trim(), acres: parseFloat(newLotForm.acres) || null, m2: parseInt(newLotForm.m2) || null, total: totalVal, desc: newLotForm.desc || "", maintenance: parseFloat(newLotForm.maintenance) || null, village: newLotForm.village, status: newLotForm.status, financeYears: parseInt(newLotForm.financeYears) || 10, downpayment: parseInt(newLotForm.downpayment) || (totalVal ? Math.round(totalVal * 0.3) : 0) }]); setShowCreateLot(false); setNewLotForm({ id: "", acres: "", m2: "", total: "", desc: "", maintenance: "", village: "Wine & Golf", status: "available", financeYears: "10", downpayment: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "13px" }}>Create Lot</button>
              </div>
            )}

            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
              {["available", "reserved", "sold", "inquire"].map(s => (
                <span key={s} style={{ padding: "4px 10px", backgroundColor: s === "available" ? `${C.success}20` : s === "sold" ? `${C.danger}20` : s === "reserved" ? `${C.pending}20` : `${C.textMuted}20`, border: `1px solid ${s === "available" ? C.success : s === "sold" ? C.danger : s === "reserved" ? C.pending : C.textMuted}40`, borderRadius: "4px", fontSize: "10px", color: s === "available" ? C.success : s === "sold" ? C.danger : s === "reserved" ? C.pending : C.textMuted, fontFamily: sans }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}: {allLots.filter(l => l.status === s).length}
                </span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
              {allLots.map(lot => (
                <div key={lot.id}>
                  <div style={{ backgroundColor: C.bgCard, padding: "12px", borderRadius: editingLot === lot.id ? "6px 6px 0 0" : "6px", border: `1px solid ${lot.status === "available" ? C.success : lot.status === "sold" ? C.danger : lot.status === "reserved" ? C.pending : C.textMuted}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => setEditingLot(editingLot === lot.id ? null : lot.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, color: C.cyan, fontSize: "14px", fontWeight: "600" }}>Lot {lot.id}</p>
                      <p style={{ margin: 0, color: C.textMuted, fontSize: "11px" }}>{lot.village} · {lot.desc?.substring(0, 40)}{lot.desc?.length > 40 ? "..." : ""}</p>
                      {!!(lot.total && lot.financeYears) && editingLot !== lot.id && (
                        <p style={{ margin: "3px 0 0 0", color: C.textDim, fontSize: "10px" }}>💰 Up to {lot.financeYears}yr · ${(lot.downpayment || 0).toLocaleString()} down · <span style={{ color: C.cyan }}>${calcMonthlyPayment(lot.total, lot.downpayment, lot.financeYears, financeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span></p>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, color: lot.status === "available" ? C.success : lot.status === "sold" ? C.danger : lot.status === "reserved" ? C.pending : C.textMuted, fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }}>{lot.status}</p>
                      <p style={{ margin: 0, color: C.textDim, fontSize: "11px" }}>{lot.acres ? `${lot.acres} ac` : "—"} {lot.total ? `· $${lot.total.toLocaleString()}` : ""}</p>
                    </div>
                  </div>
                  {editingLot === lot.id && (
                    <div style={{ backgroundColor: C.bgCard2, padding: "14px", borderRadius: "0 0 6px 6px", border: `1px solid ${C.border}`, borderTop: "none" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Status</label>
                          <select value={lot.status} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, status: e.target.value } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                            <option value="inquire">Inquire</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Village</label>
                          <select value={lot.village} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, village: e.target.value } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px" }}>
                            <option value="Wine & Golf">Wine & Golf</option>
                            <option value="Garden Estate">Garden Estate</option>
                            <option value="Desert & Vineyard">Desert & Vineyard</option>
                            <option value="Vineyard Estate">Vineyard Estate</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Acres</label>
                          <input type="number" step="0.01" value={lot.acres || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, acres: parseFloat(e.target.value) || null } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Size (m²)</label>
                          <input type="number" value={lot.m2 || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, m2: parseInt(e.target.value) || null } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Total Price ($)</label>
                          <input type="number" value={lot.total || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, total: parseInt(e.target.value) || null } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Monthly Maintenance ($)</label>
                          <input type="number" step="0.01" value={lot.maintenance || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, maintenance: parseFloat(e.target.value) || null } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Finance Term (years)</label>
                          <input type="number" min="1" max="30" value={lot.financeYears || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, financeYears: parseInt(e.target.value) || null } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                        <div>
                          <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Downpayment ($)</label>
                          <input type="number" value={lot.downpayment || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, downpayment: parseInt(e.target.value) || 0 } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                        </div>
                      </div>
                      {!!(lot.total && lot.financeYears) && (
                        <div style={{ backgroundColor: `${C.cyan}10`, border: `1px solid ${C.cyan}30`, borderRadius: "4px", padding: "8px 10px", marginBottom: "8px" }}>
                          <p style={{ margin: 0, fontSize: "11px", color: C.cyan, fontWeight: "600" }}>Financing Preview</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: C.text }}>Finance up to {lot.financeYears} years with a downpayment of ${(lot.downpayment || 0).toLocaleString()} and monthly payments of <span style={{ color: C.cyan, fontWeight: "700" }}>${calcMonthlyPayment(lot.total, lot.downpayment, lot.financeYears, financeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                          <p style={{ margin: "2px 0 0 0", fontSize: "9px", color: C.textDim }}>Rate: {financeRate}% annual</p>
                        </div>
                      )}
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "10px", color: C.textMuted, display: "block", marginBottom: "4px" }}>Description</label>
                        <textarea value={lot.desc || ""} onChange={(e) => setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, desc: e.target.value } : l))} style={{ width: "100%", padding: "6px", backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box", minHeight: "50px", resize: "vertical" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setEditingLot(null)} style={{ flex: 1, padding: "8px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px" }}>Done Editing</button>
                        <button onClick={() => { if (confirm(`Delete Lot ${lot.id}? This cannot be undone.`)) { setAllLots(prev => prev.filter(l => l.id !== lot.id)); setEditingLot(null); } }} style={{ padding: "8px 14px", backgroundColor: "transparent", color: C.danger, border: `1px solid ${C.danger}`, borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px" }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderNav()}
    </div>
  );
}
