import React, { useState } from "react";
import { C, serif, sans, handleStripePayment } from "./constants";
import { MOCK_ROOMS, checkAvailability } from "./data";

const VipTrips = ({
  user,
  renderHeader,
  renderNav,
  renderVipLogin,
  guestName,
  setGuestName,
  reservationNumber,
  setReservationNumber,
  expandedSection,
  setExpandedSection,
  requests,
  setRequests,
  reservationFilter,
  setReservationFilter,
  emailSent,
  setEmailSent,
  showManageReservations,
  setShowManageReservations,
  selectedProperty,
  setSelectedProperty,
  transfersForm,
  setTransfersForm,
  dinnerForms,
  setDinnerForms,
  dinnerProperty,
  setDinnerProperty,
  wineTastingForm,
  setWineTastingForm,
  wineryTourForm,
  setWineryTourForm,
  asadoForm,
  setAsadoForm,
  chefForm,
  setChefForm,
  showsForm,
  setShowsForm,
  specialRequestText,
  setSpecialRequestText,
  algodEstateForm,
  setAlgodEstateForm,
  aweForm,
  setAweForm,
  casaForm,
  setCasaForm,
  mansionAvail,
  setMansionAvail,
  aweAvail,
  setAweAvail,
  casaAvail,
  setCasaAvail,
  selectedRoom,
  setSelectedRoom,
  restaurantForms,
  setRestaurantForms,
  makeWineForm,
  setMakeWineForm,
  spaForms,
  setSpaForms,
  tennisClassForms,
  setTennisClassForms,
  golfClassForms,
  setGolfClassForms,
  mateandoForm,
  setMateandoForm,
  picnicForm,
  setPicnicForm,
  fillFridgeForm,
  setFillFridgeForm,
  showReservations,
  setShowReservations,
  selectedActivity,
  setSelectedActivity,
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  reservationGuests,
  setReservationGuests,
  handleSubmitTransfers,
  handleSubmitDinners,
  handleSubmitWineTasting,
  handleSubmitWineryTour,
  handleSubmitAsado,
  handleSubmitChef,
  handleSubmitShows,
  handleSubmitSpecialRequest,
  handleSubmitReservation,
  handleRequestAnswer,
  getActivityTimes,
  managerFilter,
  setManagerFilter,
  managerNotes,
  setManagerNotes,
  handleChangeRequestStatus,
  makeRequest,
  sendManagerEmail,
  astronomyForm,
  setAstronomyForm,
  empanadaForm,
  setEmpanadaForm,
  horseridingForm,
  setHorseridingForm,
  toursEntertainmentForm,
  setToursEntertainmentForm,
}) => {
  // Local state for activities that don't have dedicated parent props
  const [golfClassForm, setGolfClassForm] = useState({ date: "", time: "", guests: "", level: "beginner" });
  const [tennisClassForm, setTennisClassForm] = useState({ date: "", time: "", guests: "", level: "beginner" });

  if (!user) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: sans, maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
        {renderHeader()}
        {renderVipLogin()}
        {renderNav()}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: sans, maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      {emailSent && (
        <div style={{ position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", backgroundColor: C.success, color: "#fff", padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontFamily: sans, zIndex: 9999, maxWidth: "380px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          ✉ {emailSent}
        </div>
      )}

      {renderHeader()}

      <div style={{ flex: 1, padding: "16px 12px", marginBottom: "80px", overflow: "auto" }}>
        <div style={{ maxWidth: "430px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "20px", color: C.cyan, marginBottom: "20px", fontFamily: serif }}>Welcome, {user.name}</h2>

          {/* ===== MANAGER-ONLY VIEW ===== */}
          {user.role === "manager" && (
            <div>
              <div style={{ backgroundColor: C.cyanBg, border: `1px solid ${C.cyan}`, borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", color: C.cyan, margin: 0, fontFamily: serif }}>{user.property}</h3>
                  {requests.filter(r => r.property === user.property && (r.status === "Answer Requested" || r.status === "Pending")).length > 0 && (
                    <span style={{ fontSize: "11px", fontWeight: "600", backgroundColor: C.danger, color: "#fff", padding: "4px 8px", borderRadius: "4px" }}>🔔 {requests.filter(r => r.property === user.property && (r.status === "Answer Requested" || r.status === "Pending")).length} Pending</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: C.textMuted }}>Manager Portal — Review and manage guest requests</p>
              </div>

              {/* Manager Filter Tabs */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                {["all", "pending", "confirmed", "declined"].map(filter => (
                  <button key={filter} onClick={() => setManagerFilter(filter)} style={{ padding: "6px 12px", backgroundColor: managerFilter === filter ? C.cyan : C.bgCard, color: managerFilter === filter ? C.bg : C.text, border: `1px solid ${managerFilter === filter ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>
                    {filter}
                  </button>
                ))}
              </div>

              {/* Manager Request Cards */}
              {requests.filter(r => r.property === user.property).length === 0 ? (
                <div style={{ backgroundColor: C.bgCard, padding: "24px", borderRadius: "8px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: "14px", color: C.textMuted, margin: 0 }}>No requests yet for {user.property}.</p>
                  <p style={{ fontSize: "11px", color: C.textDim, margin: "8px 0 0 0" }}>Requests from guests will appear here in real time.</p>
                </div>
              ) : (
                requests.filter(r => r.property === user.property && (managerFilter === "all" || (managerFilter === "pending" && (r.status === "Pending" || r.status === "Answer Requested")) || r.status.toLowerCase() === managerFilter.toLowerCase())).sort((a, b) => {
                  if (a.status === "Answer Requested" && b.status !== "Answer Requested") return -1;
                  if (a.status !== "Answer Requested" && b.status === "Answer Requested") return 1;
                  if (a.status === "Pending" && b.status !== "Pending") return -1;
                  if (a.status !== "Pending" && b.status === "Pending") return 1;
                  return 0;
                }).map(req => (
                  <div key={req.id} style={{ backgroundColor: C.bgCard, padding: "14px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${req.status === "Answer Requested" ? C.cyan : C.border}`, borderLeft: `3px solid ${req.status === "Answer Requested" ? C.cyan : req.status === "Pending" ? C.pending : req.status === "Confirmed" ? C.success : C.danger}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0", color: C.text, fontSize: "14px", fontWeight: "600" }}>{req.type}</h4>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "11px" }}>Guest: {req.guestName} · Res #: {req.reservationNumber}</p>
                      </div>
                      <span style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "3px", fontWeight: "600", backgroundColor: req.status === "Answer Requested" ? C.cyan : req.status === "Pending" ? C.pending : req.status === "Confirmed" ? C.success : C.danger, color: "#fff", whiteSpace: "nowrap" }}>{req.status}</span>
                    </div>

                    <p style={{ margin: "6px 0", color: C.textMuted, fontSize: "11px" }}>{typeof req.details === "string" ? req.details : JSON.stringify(req.details)}</p>
                    <p style={{ margin: 0, color: C.textDim, fontSize: "10px", marginBottom: "8px" }}>Submitted: {req.date}</p>

                    {(req.status === "Pending" || req.status === "Answer Requested") ? (
                      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${C.border}` }}>
                        <textarea value={managerNotes[req.id] || ""} onChange={(e) => setManagerNotes(prev => ({ ...prev, [req.id]: e.target.value }))} placeholder="Add response notes for the guest (optional)" style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", minHeight: "60px", boxSizing: "border-box", resize: "vertical", marginBottom: "8px" }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleChangeRequestStatus(req.id, "Confirmed")} style={{ flex: 1, padding: "8px", backgroundColor: C.success, border: "none", borderRadius: "4px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Confirm</button>
                          <button onClick={() => handleChangeRequestStatus(req.id, "Declined")} style={{ flex: 1, padding: "8px", backgroundColor: C.danger, border: "none", borderRadius: "4px", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Decline</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {req.managerNotes && <p style={{ margin: "8px 0 0 0", color: C.textMuted, fontSize: "10px", fontStyle: "italic", backgroundColor: C.bgCard2, padding: "6px 8px", borderRadius: "4px" }}>Response: {req.managerNotes}</p>}
                        {req.confirmedBy && <p style={{ margin: "4px 0 0 0", color: req.status === "Confirmed" ? C.success : C.danger, fontSize: "10px", fontWeight: "600" }}>{req.status} by {req.confirmedBy}</p>}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== GUEST-ONLY VIEW ===== */}
          {user.role !== "manager" && !user.isAdmin && (
          <div>

          {/* Manage My Reservations - Always visible for guests */}
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setShowManageReservations(!showManageReservations)} style={{ width: "100%", padding: "14px 16px", backgroundColor: requests.filter(r => r.submittedBy === user?.email).length > 0 ? C.cyanBg : C.bgCard, border: `1px solid ${C.cyan}`, color: C.cyan, borderRadius: "8px", cursor: "pointer", fontFamily: serif, fontSize: "15px", fontWeight: "600", marginBottom: showManageReservations ? "12px" : "0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📋 My Reservations {requests.filter(r => r.submittedBy === user?.email).length > 0 ? `(${requests.filter(r => r.submittedBy === user?.email).length})` : ""}</span>
              <span style={{ fontSize: "12px" }}>{showManageReservations ? "▼" : "▶"}</span>
            </button>

            {showManageReservations && (
              <div>
                {requests.filter(r => r.submittedBy === user?.email).length === 0 ? (
                  <div style={{ backgroundColor: C.bgCard, padding: "20px", borderRadius: "6px", textAlign: "center", border: `1px solid ${C.border}` }}>
                    <p style={{ fontSize: "13px", color: C.textMuted, margin: 0 }}>No reservations yet</p>
                    <p style={{ fontSize: "11px", color: C.textDim, margin: "6px 0 0 0" }}>Requests you submit will appear here with live status updates.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                      {["all", "pending", "confirmed", "declined", "answer-requested"].map(filter => (
                        <button key={filter} onClick={() => setReservationFilter(filter)} style={{ padding: "5px 10px", backgroundColor: reservationFilter === filter ? C.cyan : C.bgCard, color: reservationFilter === filter ? C.bg : C.text, border: `1px solid ${reservationFilter === filter ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "10px", fontWeight: "600", textTransform: "capitalize" }}>
                          {filter === "answer-requested" ? "Requested" : filter}
                        </button>
                      ))}
                    </div>

                    {requests.filter(r => r.submittedBy === user?.email && (reservationFilter === "all" || r.status.toLowerCase() === reservationFilter.toLowerCase() || (reservationFilter === "answer-requested" && r.answerRequested))).map(req => (
                      <div key={req.id} style={{ backgroundColor: C.bgCard, padding: "14px", marginBottom: "10px", borderRadius: "6px", border: `1px solid ${req.status === "Answer Requested" ? C.cyan : C.border}`, borderLeft: `3px solid ${req.status === "Pending" ? C.pending : req.status === "Confirmed" ? C.success : req.status === "Answer Requested" ? C.cyan : C.danger}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <span style={{ fontSize: "13px", color: C.text, fontWeight: "600" }}>{req.type}</span>
                          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "3px", fontWeight: "600", backgroundColor: req.status === "Pending" ? C.pending : req.status === "Confirmed" ? C.success : req.status === "Answer Requested" ? C.cyan : C.danger, color: "#fff" }}>{req.status}</span>
                        </div>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "11px", marginBottom: "2px" }}>{req.property}</p>
                        <p style={{ margin: 0, color: C.textMuted, fontSize: "11px", marginBottom: "4px" }}>{typeof req.details === "string" ? req.details : JSON.stringify(req.details)}</p>
                        <p style={{ margin: 0, color: C.textDim, fontSize: "10px" }}>Submitted: {req.date}</p>

                        {req.status === "Pending" && (
                          <button onClick={() => handleRequestAnswer(req.id)} style={{ marginTop: "8px", width: "100%", padding: "7px", backgroundColor: "transparent", border: `1px solid ${C.cyan}`, color: C.cyan, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600" }}>
                            Request Answer
                          </button>
                        )}

                        {req.managerNotes && <p style={{ margin: "8px 0 0 0", color: C.text, fontSize: "11px", backgroundColor: C.cyanBg, padding: "8px", borderRadius: "4px", border: `1px solid ${C.cyan}30` }}>💬 Manager: {req.managerNotes}</p>}
                        {req.confirmedBy && <p style={{ margin: "4px 0 0 0", color: req.status === "Confirmed" ? C.success : C.danger, fontSize: "10px", fontWeight: "600" }}>{req.status} by {req.confirmedBy}</p>}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Guest Info Fields */}
          <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.cyan}` }}>
            <h3 style={{ fontSize: "14px", color: C.cyan, margin: "0 0 12px 0", fontFamily: serif }}>Guest Information</h3>
            <input type="text" placeholder="Guest Full Name *" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "13px", boxSizing: "border-box", marginBottom: "8px" }} />
            <input type="text" placeholder="Reservation Number" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "13px", boxSizing: "border-box" }} />
            <p style={{ fontSize: "10px", color: C.textDim, margin: "6px 0 0 0" }}>Required for all concierge requests</p>
          </div>

          {(user?.role === "member" || user?.isAdmin) && (
          <>
          <h3 style={{ fontSize: "16px", color: C.text, marginBottom: "12px", fontFamily: serif }}>Room Reservations</h3>

          {/* ALGODON MANSION */}
          <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, color: C.text, fontSize: "14px" }}>Algodon Mansion</h4>
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ backgroundColor: C.danger, color: C.text, padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "600" }}>Profile Restricted</span>
                <span style={{ backgroundColor: C.bgCard2, color: C.textMuted, padding: "2px 6px", borderRadius: "3px", fontSize: "9px" }}>SynXis</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input type="date" value={algodEstateForm.arrivalDate} onChange={(e) => setAlgodEstateForm({ ...algodEstateForm, arrivalDate: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Nights" value={algodEstateForm.nights} onChange={(e) => setAlgodEstateForm({ ...algodEstateForm, nights: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Rooms" value={algodEstateForm.rooms} onChange={(e) => setAlgodEstateForm({ ...algodEstateForm, rooms: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Guests" value={algodEstateForm.guests} onChange={(e) => setAlgodEstateForm({ ...algodEstateForm, guests: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
            </div>
            <button onClick={() => setMansionAvail(checkAvailability("Algodon Mansion", algodEstateForm.arrivalDate, algodEstateForm.nights, algodEstateForm.rooms))} style={{ width: "100%", padding: "8px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px", marginBottom: "8px" }}>
              Check Availability
            </button>
            {mansionAvail && (
              <div style={{ marginTop: "8px" }}>
                <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>Available Room Types:</p>
                {mansionAvail.map(room => (
                  <div key={room.id} onClick={() => setSelectedRoom({...selectedRoom, mansion: room.id})} style={{ padding: "10px", marginBottom: "6px", borderRadius: "4px", cursor: room.available > 0 ? "pointer" : "default", opacity: room.available > 0 ? 1 : 0.4, backgroundColor: selectedRoom.mansion === room.id ? C.cyanBg : C.bgCard2, border: `1px solid ${selectedRoom.mansion === room.id ? C.cyan : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", color: C.text, fontWeight: "600" }}>{room.name}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: C.textMuted }}>${room.rate}/night · Max {room.maxGuests} guests</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: room.available > 0 ? C.success : C.danger, fontWeight: "600" }}>
                          {room.available > 0 ? `${room.available} avail.` : "Sold out"}
                        </p>
                        {room.available > 0 && <p style={{ margin: 0, fontSize: "11px", color: C.cyan }}>${room.totalCost} total</p>}
                      </div>
                    </div>
                  </div>
                ))}
                {selectedRoom.mansion && mansionAvail.find(r => r.id === selectedRoom.mansion)?.available > 0 && (
                  <button onClick={() => {
                    if (!guestName) return alert("Please enter your name");
                    const room = mansionAvail.find(r => r.id === selectedRoom.mansion);
                    const newReq = makeRequest("Room Reservation", `${room.name} at Algodon Mansion, ${algodEstateForm.arrivalDate}, ${algodEstateForm.nights} nights, ${algodEstateForm.rooms || 1} rooms, $${room.totalCost} total`, "Algodon Mansion");
                    setRequests(prev => [...prev, newReq]);
                    sendManagerEmail(newReq);
                    setEmailSent(`Request sent — notification emailed to Algodon Mansion manager`);
                    setTimeout(() => setEmailSent(null), 3000);
                    alert("Room reservation request submitted! Awaiting manager confirmation.");
                    setMansionAvail(null);
                    setSelectedRoom({...selectedRoom, mansion: undefined});
                    setAlgodEstateForm({ arrivalDate: "", nights: "", rooms: "", guests: "" });
                  }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", marginTop: "8px" }}>
                    Request Reservation — Pending Confirmation
                  </button>
                )}
                <p style={{ fontSize: "9px", color: C.textDim, margin: "8px 0 0 0", textAlign: "center" }}>Availability subject to manager confirmation</p>
              </div>
            )}
          </div>

          {/* AWE LODGE (ALGODON WINE ESTATES) */}
          <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, color: C.text, fontSize: "14px" }}>AWE Lodge</h4>
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ backgroundColor: C.danger, color: C.text, padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "600" }}>Profile Restricted</span>
                <span style={{ backgroundColor: C.bgCard2, color: C.textMuted, padding: "2px 6px", borderRadius: "3px", fontSize: "9px" }}>SynXis</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input type="date" value={aweForm.arrivalDate} onChange={(e) => setAweForm({ ...aweForm, arrivalDate: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Nights" value={aweForm.nights} onChange={(e) => setAweForm({ ...aweForm, nights: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Rooms" value={aweForm.rooms} onChange={(e) => setAweForm({ ...aweForm, rooms: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Guests" value={aweForm.guests} onChange={(e) => setAweForm({ ...aweForm, guests: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
            </div>
            <button onClick={() => setAweAvail(checkAvailability("Algodon Wine Estates", aweForm.arrivalDate, aweForm.nights, aweForm.rooms))} style={{ width: "100%", padding: "8px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px", marginBottom: "8px" }}>
              Check Availability
            </button>
            {aweAvail && (
              <div style={{ marginTop: "8px" }}>
                <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>Available Room Types:</p>
                {aweAvail.map(room => (
                  <div key={room.id} onClick={() => setSelectedRoom({...selectedRoom, awe: room.id})} style={{ padding: "10px", marginBottom: "6px", borderRadius: "4px", cursor: room.available > 0 ? "pointer" : "default", opacity: room.available > 0 ? 1 : 0.4, backgroundColor: selectedRoom.awe === room.id ? C.cyanBg : C.bgCard2, border: `1px solid ${selectedRoom.awe === room.id ? C.cyan : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", color: C.text, fontWeight: "600" }}>{room.name}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: C.textMuted }}>${room.rate}/night · Max {room.maxGuests} guests</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: room.available > 0 ? C.success : C.danger, fontWeight: "600" }}>
                          {room.available > 0 ? `${room.available} avail.` : "Sold out"}
                        </p>
                        {room.available > 0 && <p style={{ margin: 0, fontSize: "11px", color: C.cyan }}>${room.totalCost} total</p>}
                      </div>
                    </div>
                  </div>
                ))}
                {selectedRoom.awe && aweAvail.find(r => r.id === selectedRoom.awe)?.available > 0 && (
                  <button onClick={() => {
                    if (!guestName) return alert("Please enter your name");
                    const room = aweAvail.find(r => r.id === selectedRoom.awe);
                    const newReq = makeRequest("Room Reservation", `${room.name} at Algodon Wine Estates, ${aweForm.arrivalDate}, ${aweForm.nights} nights, ${aweForm.rooms || 1} rooms, $${room.totalCost} total`, "Algodon Wine Estates");
                    setRequests(prev => [...prev, newReq]);
                    sendManagerEmail(newReq);
                    setEmailSent(`Request sent — notification emailed to Algodon Wine Estates manager`);
                    setTimeout(() => setEmailSent(null), 3000);
                    alert("Room reservation request submitted! Awaiting manager confirmation.");
                    setAweAvail(null);
                    setSelectedRoom({...selectedRoom, awe: undefined});
                    setAweForm({ arrivalDate: "", nights: "", rooms: "", guests: "" });
                  }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", marginTop: "8px" }}>
                    Request Reservation — Pending Confirmation
                  </button>
                )}
                <p style={{ fontSize: "9px", color: C.textDim, margin: "8px 0 0 0", textAlign: "center" }}>Availability subject to manager confirmation</p>
              </div>
            )}
          </div>

          {/* CASA GAUCHO */}
          <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, color: C.text, fontSize: "14px" }}>Casa Gaucho</h4>
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ backgroundColor: C.danger, color: C.text, padding: "2px 6px", borderRadius: "3px", fontSize: "10px", fontWeight: "600" }}>Profile Restricted</span>
                <span style={{ backgroundColor: C.bgCard2, color: C.textMuted, padding: "2px 6px", borderRadius: "3px", fontSize: "9px" }}>SynXis</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input type="date" value={casaForm.arrivalDate} onChange={(e) => setCasaForm({ ...casaForm, arrivalDate: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Nights" value={casaForm.nights} onChange={(e) => setCasaForm({ ...casaForm, nights: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Rooms" value={casaForm.rooms} onChange={(e) => setCasaForm({ ...casaForm, rooms: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
              <input type="number" placeholder="Guests" value={casaForm.guests} onChange={(e) => setCasaForm({ ...casaForm, guests: e.target.value })} style={{ padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "12px" }} />
            </div>
            <button onClick={() => setCasaAvail(checkAvailability("Casa Gaucho", casaForm.arrivalDate, casaForm.nights, casaForm.rooms))} style={{ width: "100%", padding: "8px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontFamily: sans, fontSize: "12px", marginBottom: "8px" }}>
              Check Availability
            </button>
            {casaAvail && (
              <div style={{ marginTop: "8px" }}>
                <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "8px" }}>Available Room Types:</p>
                {casaAvail.map(room => (
                  <div key={room.id} onClick={() => setSelectedRoom({...selectedRoom, casa: room.id})} style={{ padding: "10px", marginBottom: "6px", borderRadius: "4px", cursor: room.available > 0 ? "pointer" : "default", opacity: room.available > 0 ? 1 : 0.4, backgroundColor: selectedRoom.casa === room.id ? C.cyanBg : C.bgCard2, border: `1px solid ${selectedRoom.casa === room.id ? C.cyan : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", color: C.text, fontWeight: "600" }}>{room.name}</p>
                        <p style={{ margin: 0, fontSize: "11px", color: C.textMuted }}>${room.rate}/night · Max {room.maxGuests} guests</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: room.available > 0 ? C.success : C.danger, fontWeight: "600" }}>
                          {room.available > 0 ? `${room.available} avail.` : "Sold out"}
                        </p>
                        {room.available > 0 && <p style={{ margin: 0, fontSize: "11px", color: C.cyan }}>${room.totalCost} total</p>}
                      </div>
                    </div>
                  </div>
                ))}
                {selectedRoom.casa && casaAvail.find(r => r.id === selectedRoom.casa)?.available > 0 && (
                  <button onClick={() => {
                    if (!guestName) return alert("Please enter your name");
                    const room = casaAvail.find(r => r.id === selectedRoom.casa);
                    const newReq = makeRequest("Room Reservation", `${room.name} at Casa Gaucho, ${casaForm.arrivalDate}, ${casaForm.nights} nights, ${casaForm.rooms || 1} rooms, $${room.totalCost} total`, "Casa Gaucho");
                    setRequests(prev => [...prev, newReq]);
                    sendManagerEmail(newReq);
                    setEmailSent(`Request sent — notification emailed to Casa Gaucho manager`);
                    setTimeout(() => setEmailSent(null), 3000);
                    alert("Room reservation request submitted! Awaiting manager confirmation.");
                    setCasaAvail(null);
                    setSelectedRoom({...selectedRoom, casa: undefined});
                    setCasaForm({ arrivalDate: "", nights: "", guests: "" });
                  }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", marginTop: "8px" }}>
                    Request Reservation — Pending Confirmation
                  </button>
                )}
                <p style={{ fontSize: "9px", color: C.textDim, margin: "8px 0 0 0", textAlign: "center" }}>Availability subject to manager confirmation</p>
              </div>
            )}
          </div>
          </>
          )}

          <h3 style={{ fontSize: "16px", color: C.text, marginBottom: "12px", fontFamily: serif }}>Concierge Services</h3>

          {/* Property Selector */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button onClick={() => setSelectedProperty(selectedProperty === "mansion" ? null : "mansion")} style={{ flex: 1, padding: "10px", backgroundColor: selectedProperty === "mansion" ? C.cyan : C.bgCard, color: selectedProperty === "mansion" ? C.bg : C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "6px", fontFamily: serif, fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "1px" }}>ALGODON MANSION {selectedProperty === "mansion" ? "▲" : "▼"}</button>
            <button onClick={() => setSelectedProperty(selectedProperty === "awe" ? null : "awe")} style={{ flex: 1, padding: "10px", backgroundColor: selectedProperty === "awe" ? C.cyan : C.bgCard, color: selectedProperty === "awe" ? C.bg : C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "6px", fontFamily: serif, fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "1px" }}>WINE ESTATES {selectedProperty === "awe" ? "▲" : "▼"}</button>
          </div>

          {/* ALGODON MANSION SERVICES */}
          {selectedProperty === "mansion" && (
            <div>
              {/* Transfers for Mansion */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-transfers" ? null : "m-transfers")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>✈ Transfers <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$100</span></h4>
                {expandedSection === "m-transfers" && (
                  <div style={{ marginTop: "12px" }}>
                    <select value={transfersForm.type} onChange={(e) => setTransfersForm({ ...transfersForm, type: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="arrival">Arrival</option>
                      <option value="departure">Departure</option>
                    </select>
                    <input type="text" placeholder="Airport" value={transfersForm.airport} onChange={(e) => setTransfersForm({ ...transfersForm, airport: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Flight Number" value={transfersForm.flightNumber} onChange={(e) => setTransfersForm({ ...transfersForm, flightNumber: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Airline" value={transfersForm.airline} onChange={(e) => setTransfersForm({ ...transfersForm, airline: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={transfersForm.time} onChange={(e) => setTransfersForm({ ...transfersForm, time: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`).map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <button onClick={() => { if (!guestName || !transfersForm.airport) return alert("Please fill all fields"); handleSubmitTransfers(); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Transfers Request</button>
                  </div>
                )}
              </div>

              {/* Dinner Reservations for Mansion */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-dinners" ? null : "m-dinners")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🍽 Dinner Reservations <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>Custom</span></h4>
                {expandedSection === "m-dinners" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={dinnerForms.mansion?.date || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, mansion: { ...prev.mansion, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={dinnerForms.mansion?.time || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, mansion: { ...prev.mansion, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {["12:00", "13:00", "14:00", "19:00", "20:00", "21:00"].map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={dinnerForms.mansion?.guests || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, mansion: { ...prev.mansion, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Notes" value={dinnerForms.mansion?.notes || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, mansion: { ...prev.mansion, notes: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !dinnerForms.mansion?.date || !dinnerForms.mansion?.time || !dinnerForms.mansion?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Dinner Reservation", `Dinner at Algodon Mansion - Date: ${dinnerForms.mansion.date}, Time: ${dinnerForms.mansion.time}, Guests: ${dinnerForms.mansion.guests}, Notes: ${dinnerForms.mansion.notes || "None"}`, "Algodon Mansion"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Dinner reservation request submitted!"); setTimeout(() => setEmailSent(null), 3000); setDinnerForms(prev => ({ ...prev, mansion: { date: "", time: "", guests: "", notes: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Dinner Request</button>
                  </div>
                )}
              </div>

              {/* Wine Tasting for Mansion */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-wine-tasting" ? null : "m-wine-tasting")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🍷 Wine Tasting</h4>
                {expandedSection === "m-wine-tasting" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={wineTastingForm.mansion?.date || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, mansion: { ...prev.mansion, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={wineTastingForm.mansion?.time || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, mansion: { ...prev.mansion, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {getActivityTimes().map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={wineTastingForm.mansion?.guests || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, mansion: { ...prev.mansion, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Wine Preferences" value={wineTastingForm.mansion?.preferences || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, mansion: { ...prev.mansion, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !wineTastingForm.mansion?.date || !wineTastingForm.mansion?.time || !wineTastingForm.mansion?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Wine Tasting", `Wine Tasting at Algodon Mansion - Date: ${wineTastingForm.mansion.date}, Time: ${wineTastingForm.mansion.time}, Guests: ${wineTastingForm.mansion.guests}, Preferences: ${wineTastingForm.mansion.preferences || "None"}`, "Algodon Mansion"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Wine tasting request submitted!"); setTimeout(() => setEmailSent(null), 3000); setWineTastingForm(prev => ({ ...prev, mansion: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Wine Tasting Request</button>
                  </div>
                )}
              </div>

              {/* Tours & Entertainment for Mansion */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-tours-entertainment" ? null : "m-tours-entertainment")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🎭 Tours & Entertainment <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>Custom</span></h4>
                {expandedSection === "m-tours-entertainment" && (
                  <div style={{ marginTop: "12px" }}>
                    <textarea placeholder="Describe the tour or entertainment you'd like (e.g., city tour, tango show, live band, museum visit)" value={toursEntertainmentForm.mansion?.description || ""} onChange={(e) => setToursEntertainmentForm(prev => ({ ...prev, mansion: { ...prev.mansion, description: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <input type="date" value={toursEntertainmentForm.mansion?.date || ""} onChange={(e) => setToursEntertainmentForm(prev => ({ ...prev, mansion: { ...prev.mansion, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={toursEntertainmentForm.mansion?.time || ""} onChange={(e) => setToursEntertainmentForm(prev => ({ ...prev, mansion: { ...prev.mansion, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={toursEntertainmentForm.mansion?.guests || ""} onChange={(e) => setToursEntertainmentForm(prev => ({ ...prev, mansion: { ...prev.mansion, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!guestName || !toursEntertainmentForm.mansion?.description || !toursEntertainmentForm.mansion?.date || !toursEntertainmentForm.mansion?.time || !toursEntertainmentForm.mansion?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Tours & Entertainment", `Tours & Entertainment at Algodon Mansion - Date: ${toursEntertainmentForm.mansion.date}, Time: ${toursEntertainmentForm.mansion.time}, Guests: ${toursEntertainmentForm.mansion.guests}, Description: ${toursEntertainmentForm.mansion.description}`, "Algodon Mansion"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Tours & entertainment request submitted!"); setTimeout(() => setEmailSent(null), 3000); setToursEntertainmentForm(prev => ({ ...prev, mansion: { description: "", date: "", time: "", guests: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Tours & Entertainment Request</button>
                  </div>
                )}
              </div>

              {/* Options at Arrival for Mansion */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-arrival-options" ? null : "m-arrival-options")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🎁 Options at Arrival</h4>
                {expandedSection === "m-arrival-options" && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>Select items to have ready upon your arrival:</p>
                    {[
                      { id: "sparkling", label: "🥂 Sparkling Wine", price: 50 },
                      { id: "chocolates", label: "🍫 Chocolates", price: 25 },
                      { id: "charcuterie", label: "🧀 Cheese & Charcuterie Board", price: 30 },
                    ].map(item => (
                      <label key={item.id} onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", marginBottom: "6px", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input type="checkbox" id={`m-arrival-${item.id}`} onClick={(e) => e.stopPropagation()} style={{ accentColor: C.cyan }} />
                          <span style={{ fontSize: "12px", color: C.text }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>${item.price}</span>
                      </label>
                    ))}
                    <button onClick={() => { const checks = ["sparkling", "chocolates", "charcuterie"].filter(id => document.getElementById(`m-arrival-${id}`)?.checked); if (!guestName || checks.length === 0) return alert("Please select at least one option"); const items = checks.map(id => ({ sparkling: "Sparkling Wine ($50)", chocolates: "Chocolates ($25)", charcuterie: "Cheese & Charcuterie Board ($30)" }[id])); const newReq = makeRequest("Options at Arrival", `Arrival items at Algodon Mansion: ${items.join(", ")}`, "Algodon Mansion"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Arrival options request submitted!"); setTimeout(() => setEmailSent(null), 3000); checks.forEach(id => { const el = document.getElementById(`m-arrival-${id}`); if (el) el.checked = false; }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", marginTop: "4px" }}>Submit Arrival Options</button>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "m-special-requests" ? null : "m-special-requests")} style={{ margin: 0, color: C.cyan, fontSize: "14px", cursor: "pointer" }}>💬 Special Requests</h4>
                {expandedSection === "m-special-requests" && (
                  <div style={{ marginTop: "12px" }}>
                    <textarea placeholder="Tell us what you need..." value={specialRequestText} onChange={(e) => setSpecialRequestText(e.target.value)} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "80px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !specialRequestText) return alert("Please fill all fields"); handleSubmitSpecialRequest(); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Special Request</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WINE ESTATES SERVICES */}
          {selectedProperty === "awe" && (
            <div>
              {/* Transfers for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-transfers" ? null : "awe-transfers")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>✈ Transfers <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$100</span></h4>
                {expandedSection === "awe-transfers" && (
                  <div style={{ marginTop: "12px" }}>
                    <select value={transfersForm.type} onChange={(e) => setTransfersForm({ ...transfersForm, type: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="arrival">Arrival</option>
                      <option value="departure">Departure</option>
                    </select>
                    <input type="text" placeholder="Airport" value={transfersForm.airport} onChange={(e) => setTransfersForm({ ...transfersForm, airport: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Flight Number" value={transfersForm.flightNumber} onChange={(e) => setTransfersForm({ ...transfersForm, flightNumber: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Airline" value={transfersForm.airline} onChange={(e) => setTransfersForm({ ...transfersForm, airline: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={transfersForm.time} onChange={(e) => setTransfersForm({ ...transfersForm, time: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`).map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <button onClick={() => { if (!guestName || !transfersForm.airport) return alert("Please fill all fields"); const newReq = makeRequest("Transfers", `Transfer (${transfersForm.type}) to Algodon Wine Estates - Airport: ${transfersForm.airport}, Flight: ${transfersForm.flightNumber}, Airline: ${transfersForm.airline}, Time: ${transfersForm.time}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Transfer request submitted!"); setTimeout(() => setEmailSent(null), 3000); setTransfersForm({ type: "arrival", airport: "", flightNumber: "", airline: "", time: "12:00" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Transfers Request</button>
                  </div>
                )}
              </div>

              {/* Dinner Reservations for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-dinners" ? null : "awe-dinners")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🍽 Dinner Reservations <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>Custom</span></h4>
                {expandedSection === "awe-dinners" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={dinnerForms.awe?.date || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, awe: { ...prev.awe, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={dinnerForms.awe?.time || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, awe: { ...prev.awe, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {["12:00", "13:00", "14:00", "19:00", "20:00", "21:00"].map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={dinnerForms.awe?.guests || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, awe: { ...prev.awe, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Menu Preferences & Dietary Restrictions" value={dinnerForms.awe?.preferences || ""} onChange={(e) => setDinnerForms(prev => ({ ...prev, awe: { ...prev.awe, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !dinnerForms.awe?.date || !dinnerForms.awe?.time || !dinnerForms.awe?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Dinner Reservation", `Dinner at Algodon Wine Estates - Date: ${dinnerForms.awe.date}, Time: ${dinnerForms.awe.time}, Guests: ${dinnerForms.awe.guests}, Preferences: ${dinnerForms.awe.preferences || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Dinner reservation request submitted!"); setTimeout(() => setEmailSent(null), 3000); setDinnerForms(prev => ({ ...prev, awe: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Dinner Request</button>
                  </div>
                )}
              </div>

              {/* Wine Tasting for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-wine-tasting" ? null : "awe-wine-tasting")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🍷 Wine Tasting</h4>
                {expandedSection === "awe-wine-tasting" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={wineTastingForm.awe?.date || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, awe: { ...prev.awe, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={wineTastingForm.awe?.time || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, awe: { ...prev.awe, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {getActivityTimes().map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={wineTastingForm.awe?.guests || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, awe: { ...prev.awe, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Wine Preferences" value={wineTastingForm.awe?.preferences || ""} onChange={(e) => setWineTastingForm(prev => ({ ...prev, awe: { ...prev.awe, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !wineTastingForm.awe?.date || !wineTastingForm.awe?.time || !wineTastingForm.awe?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Wine Tasting", `Wine Tasting at Algodon Wine Estates - Date: ${wineTastingForm.awe.date}, Time: ${wineTastingForm.awe.time}, Guests: ${wineTastingForm.awe.guests}, Preferences: ${wineTastingForm.awe.preferences || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Wine tasting request submitted!"); setTimeout(() => setEmailSent(null), 3000); setWineTastingForm(prev => ({ ...prev, awe: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Wine Tasting Request</button>
                  </div>
                )}
              </div>

              {/* Winery Tour for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-winery-tour" ? null : "awe-winery-tour")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🏰 Winery Tour</h4>
                {expandedSection === "awe-winery-tour" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={wineryTourForm.awe?.date || ""} onChange={(e) => setWineryTourForm(prev => ({ ...prev, awe: { ...prev.awe, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={wineryTourForm.awe?.time || ""} onChange={(e) => setWineryTourForm(prev => ({ ...prev, awe: { ...prev.awe, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {getActivityTimes().map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={wineryTourForm.awe?.guests || ""} onChange={(e) => setWineryTourForm(prev => ({ ...prev, awe: { ...prev.awe, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Special Interests (e.g., organic wines, red wines)" value={wineryTourForm.awe?.preferences || ""} onChange={(e) => setWineryTourForm(prev => ({ ...prev, awe: { ...prev.awe, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !wineryTourForm.awe?.date || !wineryTourForm.awe?.time || !wineryTourForm.awe?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Winery Tour", `Winery Tour at Algodon Wine Estates - Date: ${wineryTourForm.awe.date}, Time: ${wineryTourForm.awe.time}, Guests: ${wineryTourForm.awe.guests}, Preferences: ${wineryTourForm.awe.preferences || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Winery tour request submitted!"); setTimeout(() => setEmailSent(null), 3000); setWineryTourForm(prev => ({ ...prev, awe: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Winery Tour Request</button>
                  </div>
                )}
              </div>

              {/* Asado (BBQ) for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-asado" ? null : "awe-asado")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🔥 Asado BBQ <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$50/pp</span></h4>
                {expandedSection === "awe-asado" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={asadoForm.awe?.date || ""} onChange={(e) => setAsadoForm(prev => ({ ...prev, awe: { ...prev.awe, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={asadoForm.awe?.time || ""} onChange={(e) => setAsadoForm(prev => ({ ...prev, awe: { ...prev.awe, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {getActivityTimes().map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={asadoForm.awe?.guests || ""} onChange={(e) => setAsadoForm(prev => ({ ...prev, awe: { ...prev.awe, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Meat Preferences & Dietary Restrictions" value={asadoForm.awe?.preferences || ""} onChange={(e) => setAsadoForm(prev => ({ ...prev, awe: { ...prev.awe, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !asadoForm.awe?.date || !asadoForm.awe?.time || !asadoForm.awe?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Asado BBQ", `Asado BBQ at Algodon Wine Estates - Date: ${asadoForm.awe.date}, Time: ${asadoForm.awe.time}, Guests: ${asadoForm.awe.guests}, Preferences: ${asadoForm.awe.preferences || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Asado request submitted!"); setTimeout(() => setEmailSent(null), 3000); setAsadoForm(prev => ({ ...prev, awe: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Asado Request</button>
                  </div>
                )}
              </div>

              {/* Golf Class for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-golf-class" ? null : "awe-golf-class")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🏌 Golf Class <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>Custom</span></h4>
                {expandedSection === "awe-golf-class" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={golfClassForm.date} onChange={(e) => setGolfClassForm({ ...golfClassForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={golfClassForm.time} onChange={(e) => setGolfClassForm({ ...golfClassForm, time: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {["10:00", "11:00", "14:00", "15:00"].map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={golfClassForm.guests} onChange={(e) => setGolfClassForm({ ...golfClassForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={golfClassForm.level} onChange={(e) => setGolfClassForm({ ...golfClassForm, level: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <button onClick={() => { if (!guestName || !golfClassForm.date || !golfClassForm.time || !golfClassForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Golf Class", `Golf Class at Algodon Wine Estates - Date: ${golfClassForm.date}, Time: ${golfClassForm.time}, Guests: ${golfClassForm.guests}, Level: ${golfClassForm.level}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Golf class request submitted!"); setTimeout(() => setEmailSent(null), 3000); setGolfClassForm({ date: "", time: "", guests: "", level: "beginner" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Golf Class Request</button>
                  </div>
                )}
              </div>

              {/* Tennis Class for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-tennis-class" ? null : "awe-tennis-class")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🎾 Tennis Class <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$30/pp</span></h4>
                {expandedSection === "awe-tennis-class" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={tennisClassForm.date} onChange={(e) => setTennisClassForm({ ...tennisClassForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={tennisClassForm.time} onChange={(e) => setTennisClassForm({ ...tennisClassForm, time: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {["10:00", "11:00", "14:00", "15:00", "16:00"].map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={tennisClassForm.guests} onChange={(e) => setTennisClassForm({ ...tennisClassForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={tennisClassForm.level} onChange={(e) => setTennisClassForm({ ...tennisClassForm, level: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <button onClick={() => { if (!guestName || !tennisClassForm.date || !tennisClassForm.time || !tennisClassForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Tennis Class", `Tennis Class at Algodon Wine Estates - Date: ${tennisClassForm.date}, Time: ${tennisClassForm.time}, Guests: ${tennisClassForm.guests}, Level: ${tennisClassForm.level}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Tennis class request submitted!"); setTimeout(() => setEmailSent(null), 3000); setTennisClassForm({ date: "", time: "", guests: "", level: "beginner" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Tennis Class Request</button>
                  </div>
                )}
              </div>

              {/* Astronomy for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-astronomy" ? null : "awe-astronomy")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🔭 Astronomy <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$100/pp</span></h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "10px", color: C.textMuted }}>Up to 16 people per session</p>
                {expandedSection === "awe-astronomy" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={astronomyForm.date || ""} onChange={(e) => setAstronomyForm({ ...astronomyForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <div style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>9:00 PM</div>
                    <input type="number" placeholder="Number of Guests (max 16)" value={astronomyForm.guests || ""} onChange={(e) => setAstronomyForm({ ...astronomyForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!guestName || !astronomyForm.date || !astronomyForm.guests || parseInt(astronomyForm.guests) > 16) return alert("Please fill all fields and ensure guests do not exceed 16"); const newReq = makeRequest("Astronomy", `Astronomy at Algodon Wine Estates - Date: ${astronomyForm.date}, Time: 9:00 PM, Guests: ${astronomyForm.guests}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Astronomy session request submitted!"); setTimeout(() => setEmailSent(null), 3000); setAstronomyForm({ date: "", guests: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Astronomy Request</button>
                  </div>
                )}
              </div>

              {/* Mateando for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-mateando" ? null : "awe-mateando")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🧉 Mateando <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$20/pp</span></h4>
                {expandedSection === "awe-mateando" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={mateandoForm.date || ""} onChange={(e) => setMateandoForm({ ...mateandoForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <div style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>5:00 PM</div>
                    <input type="number" placeholder="Number of Guests" value={mateandoForm.guests || ""} onChange={(e) => setMateandoForm({ ...mateandoForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!guestName || !mateandoForm.date || !mateandoForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Mateando", `Mateando at Algodon Wine Estates - Date: ${mateandoForm.date}, Time: 5:00 PM, Guests: ${mateandoForm.guests}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Mateando request submitted!"); setTimeout(() => setEmailSent(null), 3000); setMateandoForm({ date: "", guests: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Mateando Request</button>
                  </div>
                )}
              </div>

              {/* Picnic for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-picnic" ? null : "awe-picnic")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🧺 Picnic <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$20/pp</span></h4>
                {expandedSection === "awe-picnic" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={picnicForm.date || ""} onChange={(e) => setPicnicForm({ ...picnicForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <div style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>1:00 PM</div>
                    <input type="number" placeholder="Number of Guests" value={picnicForm.guests || ""} onChange={(e) => setPicnicForm({ ...picnicForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Notes & Dietary Restrictions" value={picnicForm.notes || ""} onChange={(e) => setPicnicForm({ ...picnicForm, notes: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !picnicForm.date || !picnicForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Picnic", `Picnic at Algodon Wine Estates - Date: ${picnicForm.date}, Time: 1:00 PM, Guests: ${picnicForm.guests}, Notes: ${picnicForm.notes || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Picnic request submitted!"); setTimeout(() => setEmailSent(null), 3000); setPicnicForm({ date: "", guests: "", notes: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Picnic Request</button>
                  </div>
                )}
              </div>

              {/* Empanada Classes for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-empanada" ? null : "awe-empanada")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🥟 Empanada Classes <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$20/pp</span></h4>
                {expandedSection === "awe-empanada" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={empanadaForm.date || ""} onChange={(e) => setEmpanadaForm({ ...empanadaForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <div style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>11:00 AM</div>
                    <input type="number" placeholder="Number of Guests" value={empanadaForm.guests || ""} onChange={(e) => setEmpanadaForm({ ...empanadaForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!guestName || !empanadaForm.date || !empanadaForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Empanada Classes", `Empanada Classes at Algodon Wine Estates - Date: ${empanadaForm.date}, Time: 11:00 AM, Guests: ${empanadaForm.guests}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Empanada class request submitted!"); setTimeout(() => setEmailSent(null), 3000); setEmpanadaForm({ date: "", guests: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Empanada Class Request</button>
                  </div>
                )}
              </div>

              {/* Horse Backriding for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-horseriding" ? null : "awe-horseriding")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🐴 Horse Backriding <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$30/pp</span></h4>
                {expandedSection === "awe-horseriding" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={horseridingForm.date || ""} onChange={(e) => setHorseridingForm({ ...horseridingForm, date: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <div style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>10:00 AM</div>
                    <input type="number" placeholder="Number of Guests" value={horseridingForm.guests || ""} onChange={(e) => setHorseridingForm({ ...horseridingForm, guests: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!guestName || !horseridingForm.date || !horseridingForm.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Horse Backriding", `Horse Backriding at Algodon Wine Estates - Date: ${horseridingForm.date}, Time: 10:00 AM, Guests: ${horseridingForm.guests}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Horse backriding request submitted!"); setTimeout(() => setEmailSent(null), 3000); setHorseridingForm({ date: "", guests: "" }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Horse Backriding Request</button>
                  </div>
                )}
              </div>

              {/* Personal Chef for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-chef" ? null : "awe-chef")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>👨‍🍳 Personal Chef <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>$100+</span></h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "10px", color: C.textMuted }}>Available exclusively at Casa Gaucho</p>
                {expandedSection === "awe-chef" && (
                  <div style={{ marginTop: "12px" }}>
                    <input type="date" value={chefForm.awe?.date || ""} onChange={(e) => setChefForm(prev => ({ ...prev, awe: { ...prev.awe, date: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <select value={chefForm.awe?.time || ""} onChange={(e) => setChefForm(prev => ({ ...prev, awe: { ...prev.awe, time: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px" }}>
                      <option value="">Select Time</option>
                      {getActivityTimes().map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                    <input type="number" placeholder="Number of Guests" value={chefForm.awe?.guests || ""} onChange={(e) => setChefForm(prev => ({ ...prev, awe: { ...prev.awe, guests: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", boxSizing: "border-box" }} />
                    <textarea placeholder="Cuisine Preferences & Dietary Restrictions" value={chefForm.awe?.preferences || ""} onChange={(e) => setChefForm(prev => ({ ...prev, awe: { ...prev.awe, preferences: e.target.value } }))} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "60px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !chefForm.awe?.date || !chefForm.awe?.time || !chefForm.awe?.guests) return alert("Please fill all required fields"); const newReq = makeRequest("Personal Chef", `Personal Chef at Algodon Wine Estates - Date: ${chefForm.awe.date}, Time: ${chefForm.awe.time}, Guests: ${chefForm.awe.guests}, Preferences: ${chefForm.awe.preferences || "None"}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Personal chef request submitted!"); setTimeout(() => setEmailSent(null), 3000); setChefForm(prev => ({ ...prev, awe: { date: "", time: "", guests: "", preferences: "" } })); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Personal Chef Request</button>
                  </div>
                )}
              </div>

              {/* Options at Arrival for AWE */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "12px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-arrival-options" ? null : "awe-arrival-options")} style={{ margin: 0, color: C.cyan, fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>🎁 Options at Arrival</h4>
                {expandedSection === "awe-arrival-options" && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "10px" }}>Select items to have ready upon your arrival:</p>
                    {[
                      { id: "sparkling", label: "🥂 Sparkling Wine", price: 50 },
                      { id: "chocolates", label: "🍫 Chocolates", price: 25 },
                      { id: "charcuterie", label: "🧀 Cheese & Charcuterie Board", price: 30 },
                    ].map(item => (
                      <label key={item.id} onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", marginBottom: "6px", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input type="checkbox" id={`awe-arrival-${item.id}`} onClick={(e) => e.stopPropagation()} style={{ accentColor: C.cyan }} />
                          <span style={{ fontSize: "12px", color: C.text }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: C.success, fontWeight: "700" }}>${item.price}</span>
                      </label>
                    ))}
                    <button onClick={() => { const checks = ["sparkling", "chocolates", "charcuterie"].filter(id => document.getElementById(`awe-arrival-${id}`)?.checked); if (!guestName || checks.length === 0) return alert("Please select at least one option"); const items = checks.map(id => ({ sparkling: "Sparkling Wine ($50)", chocolates: "Chocolates ($25)", charcuterie: "Cheese & Charcuterie Board ($30)" }[id])); const newReq = makeRequest("Options at Arrival", `Arrival items at Algodon Wine Estates: ${items.join(", ")}`, "Algodon Wine Estates"); setRequests(prev => [...prev, newReq]); sendManagerEmail(newReq); setEmailSent("Arrival options request submitted!"); setTimeout(() => setEmailSent(null), 3000); checks.forEach(id => { const el = document.getElementById(`awe-arrival-${id}`); if (el) el.checked = false; }); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", marginTop: "4px" }}>Submit Arrival Options</button>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div style={{ backgroundColor: C.bgCard, padding: "16px", marginBottom: "16px", borderRadius: "6px", border: `1px solid ${C.border}` }}>
                <h4 onClick={() => setExpandedSection(expandedSection === "awe-special-requests" ? null : "awe-special-requests")} style={{ margin: 0, color: C.cyan, fontSize: "14px", cursor: "pointer" }}>💬 Special Requests</h4>
                {expandedSection === "awe-special-requests" && (
                  <div style={{ marginTop: "12px" }}>
                    <textarea placeholder="Tell us what you need..." value={specialRequestText} onChange={(e) => setSpecialRequestText(e.target.value)} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, marginBottom: "8px", fontFamily: sans, fontSize: "12px", minHeight: "80px", boxSizing: "border-box", resize: "vertical" }} />
                    <button onClick={() => { if (!guestName || !specialRequestText) return alert("Please fill all fields"); handleSubmitSpecialRequest(); }} style={{ width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px" }}>Submit Special Request</button>
                  </div>
                )}
              </div>
            </div>
          )}

          </div>
          )}

        </div>
      </div>

      {renderNav()}
    </div>
  );
};

export default VipTrips;
