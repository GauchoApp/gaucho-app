import { useState, useEffect } from "react";
import { C, serif, sans } from "./constants";
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "./firebase";

const MyTrips = ({ user, renderHeader, renderNav }) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [tripForm, setTripForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    destination: "Algodon Wine Estates",
    notes: "",
  });
  const [activityForm, setActivityForm] = useState({
    title: "",
    date: "",
    time: "",
    type: "activity",
    location: "",
    notes: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteeName, setInviteeName] = useState("");
  const [activities, setActivities] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list | detail
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load user's trips
  useEffect(() => {
    if (!user?.email) return;
    const q = query(
      collection(db, "trips"),
      where("participants", "array-contains", user.email)
    );
    const unsub = onSnapshot(q, (snap) => {
      const t = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      t.sort((a, b) => {
        const da = a.startDate || "";
        const db2 = b.startDate || "";
        return db2.localeCompare(da);
      });
      setTrips(t);
    });
    return () => unsub();
  }, [user?.email]);

  // Load activities and invitees when a trip is selected
  useEffect(() => {
    if (!selectedTrip) {
      setActivities([]);
      setInvitees([]);
      return;
    }
    const unsubAct = onSnapshot(
      query(
        collection(db, "tripActivities"),
        where("tripId", "==", selectedTrip.id)
      ),
      (snap) => {
        const acts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        acts.sort((a, b) => {
          const cmp = (a.date || "").localeCompare(b.date || "");
          if (cmp !== 0) return cmp;
          return (a.time || "").localeCompare(b.time || "");
        });
        setActivities(acts);
      }
    );
    const unsubInv = onSnapshot(
      query(
        collection(db, "tripInvites"),
        where("tripId", "==", selectedTrip.id)
      ),
      (snap) => {
        setInvitees(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );
    return () => {
      unsubAct();
      unsubInv();
    };
  }, [selectedTrip?.id]);

  // Create a new trip
  const handleCreateTrip = async () => {
    if (!tripForm.name || !tripForm.startDate || !tripForm.endDate) {
      showToast("Please fill in trip name and dates");
      return;
    }
    try {
      const tripData = {
        name: tripForm.name,
        startDate: tripForm.startDate,
        endDate: tripForm.endDate,
        destination: tripForm.destination,
        notes: tripForm.notes,
        creatorEmail: user.email,
        creatorName: user.name || user.email,
        participants: [user.email],
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "trips"), tripData);
      setTripForm({ name: "", startDate: "", endDate: "", destination: "Algodon Wine Estates", notes: "" });
      setShowCreateTrip(false);
      showToast("Trip created!");
      // Auto-select the new trip
      setSelectedTrip({ id: docRef.id, ...tripData, participants: [user.email] });
      setViewMode("detail");
    } catch (err) {
      console.error("Error creating trip:", err);
      showToast("Error creating trip");
    }
  };

  // Add activity to trip
  const handleAddActivity = async () => {
    if (!activityForm.title || !activityForm.date) {
      showToast("Please fill in activity title and date");
      return;
    }
    try {
      await addDoc(collection(db, "tripActivities"), {
        tripId: selectedTrip.id,
        title: activityForm.title,
        date: activityForm.date,
        time: activityForm.time,
        type: activityForm.type,
        location: activityForm.location,
        notes: activityForm.notes,
        addedBy: user.email,
        createdAt: serverTimestamp(),
      });
      setActivityForm({ title: "", date: "", time: "", type: "activity", location: "", notes: "" });
      setShowAddActivity(false);
      showToast("Activity added!");
    } catch (err) {
      console.error("Error adding activity:", err);
      showToast("Error adding activity");
    }
  };

  // Invite someone to trip
  const handleInvite = async () => {
    if (!inviteEmail) {
      showToast("Please enter an email address");
      return;
    }
    try {
      // Add to invitees collection
      await addDoc(collection(db, "tripInvites"), {
        tripId: selectedTrip.id,
        email: inviteEmail.toLowerCase().trim(),
        name: inviteeName || inviteEmail,
        invitedBy: user.email,
        status: "invited",
        createdAt: serverTimestamp(),
      });
      // Add to participants array
      const tripRef = doc(db, "trips", selectedTrip.id);
      const updatedParticipants = [...(selectedTrip.participants || [])];
      if (!updatedParticipants.includes(inviteEmail.toLowerCase().trim())) {
        updatedParticipants.push(inviteEmail.toLowerCase().trim());
        await updateDoc(tripRef, { participants: updatedParticipants });
        setSelectedTrip({ ...selectedTrip, participants: updatedParticipants });
      }
      setInviteEmail("");
      setInviteeName("");
      setShowInvite(false);
      showToast(`Invited ${inviteeName || inviteEmail}!`);
    } catch (err) {
      console.error("Error inviting:", err);
      showToast("Error sending invite");
    }
  };

  // Generate ICS calendar file for download
  const handleDownloadCalendar = () => {
    if (!selectedTrip) return;
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Gaucho App//Trip Itinerary//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
    // Add the trip itself as an event
    const startD = selectedTrip.startDate.replace(/-/g, "");
    const endD = selectedTrip.endDate.replace(/-/g, "");
    icsContent += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${startD}
DTEND;VALUE=DATE:${endD}
SUMMARY:${selectedTrip.name}
DESCRIPTION:${selectedTrip.destination}${selectedTrip.notes ? " - " + selectedTrip.notes : ""}
LOCATION:${selectedTrip.destination}
END:VEVENT
`;
    // Add each activity
    activities.forEach((act) => {
      const actDate = act.date.replace(/-/g, "");
      if (act.time) {
        const t = act.time.replace(":", "") + "00";
        icsContent += `BEGIN:VEVENT
DTSTART:${actDate}T${t}
DURATION:PT1H
SUMMARY:${act.title}
DESCRIPTION:${act.notes || ""}
LOCATION:${act.location || selectedTrip.destination}
END:VEVENT
`;
      } else {
        icsContent += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${actDate}
SUMMARY:${act.title}
DESCRIPTION:${act.notes || ""}
LOCATION:${act.location || selectedTrip.destination}
END:VEVENT
`;
      }
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTrip.name.replace(/\s+/g, "_")}_itinerary.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Calendar downloaded!");
  };

  // Generate shareable link (uses trip ID)
  const handleShareLink = () => {
    const link = `${window.location.origin}?trip=${selectedTrip.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => showToast("Link copied to clipboard!"));
    } else {
      showToast(link);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (actId) => {
    if (!window.confirm("Remove this activity?")) return;
    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "tripActivities", actId));
      showToast("Activity removed");
    } catch (err) {
      showToast("Error removing activity");
    }
  };

  // ===== STYLES =====
  const card = {
    backgroundColor: C.bgCard,
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    border: `1px solid ${C.border}`,
  };
  const btn = (primary = false) => ({
    padding: "12px 20px",
    borderRadius: "8px",
    border: primary ? "none" : `1px solid ${C.cyan}`,
    backgroundColor: primary ? C.cyan : "transparent",
    color: primary ? "#000" : C.cyan,
    fontFamily: sans,
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
  });
  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `1px solid ${C.border}`,
    backgroundColor: C.bgCard2,
    color: C.text,
    fontFamily: sans,
    fontSize: "14px",
    boxSizing: "border-box",
  };
  const label = {
    fontFamily: sans,
    fontSize: "12px",
    color: C.textMuted,
    marginBottom: "4px",
    display: "block",
  };

  const activityTypes = [
    { value: "flight", label: "Flight", icon: "✈️" },
    { value: "hotel", label: "Hotel", icon: "🏨" },
    { value: "restaurant", label: "Restaurant", icon: "🍷" },
    { value: "activity", label: "Activity", icon: "🎯" },
    { value: "wine-tasting", label: "Wine Tasting", icon: "🍇" },
    { value: "golf", label: "Golf", icon: "⛳" },
    { value: "tennis", label: "Tennis", icon: "🎾" },
    { value: "spa", label: "Spa", icon: "💆" },
    { value: "transfer", label: "Transfer", icon: "🚗" },
    { value: "other", label: "Other", icon: "📌" },
  ];

  const getActivityIcon = (type) => {
    return activityTypes.find((t) => t.value === type)?.icon || "📌";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Group activities by date
  const groupedActivities = activities.reduce((acc, act) => {
    const key = act.date || "unscheduled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(act);
    return acc;
  }, {});

  // ===== RENDER: TRIP LIST =====
  const renderTripList = () => (
    <div style={{ padding: "0 16px 120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontFamily: serif, fontSize: "22px", color: C.text, margin: 0 }}>My Trips</h2>
        <button onClick={() => setShowCreateTrip(true)} style={btn(true)}>
          + New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✈️</div>
          <p style={{ fontFamily: serif, fontSize: "18px", color: C.text, marginBottom: "8px" }}>No trips yet</p>
          <p style={{ fontFamily: sans, fontSize: "14px", color: C.textMuted }}>
            Create your first trip and start building your itinerary
          </p>
        </div>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => {
              setSelectedTrip(trip);
              setViewMode("detail");
            }}
            style={{ ...card, cursor: "pointer", transition: "border-color 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontFamily: serif, fontSize: "18px", color: C.text, margin: "0 0 6px" }}>{trip.name}</h3>
                <p style={{ fontFamily: sans, fontSize: "13px", color: C.cyan, margin: "0 0 4px" }}>
                  {trip.destination}
                </p>
                <p style={{ fontFamily: sans, fontSize: "12px", color: C.textMuted, margin: 0 }}>
                  {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: sans, fontSize: "11px", color: C.textMuted }}>
                  {(trip.participants || []).length} guest{(trip.participants || []).length !== 1 ? "s" : ""}
                </span>
                <div style={{ fontSize: "24px", marginTop: "4px" }}>→</div>
              </div>
            </div>
            {trip.notes && (
              <p style={{ fontFamily: sans, fontSize: "12px", color: C.textDim, marginTop: "8px", marginBottom: 0 }}>
                {trip.notes}
              </p>
            )}
          </div>
        ))
      )}

      {/* Create Trip Modal */}
      {showCreateTrip && renderCreateTripForm()}
    </div>
  );

  // ===== RENDER: CREATE TRIP FORM =====
  const renderCreateTripForm = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: C.bgCard, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ fontFamily: serif, fontSize: "20px", color: C.text, marginTop: 0, marginBottom: "20px" }}>Create New Trip</h3>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Trip Name</label>
          <input
            style={input}
            placeholder="e.g. April Wine Country Getaway"
            value={tripForm.name}
            onChange={(e) => setTripForm({ ...tripForm, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("trip-start")?.focus()}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          <div>
            <label style={label}>Start Date</label>
            <input
              style={input}
              type="date"
              value={tripForm.startDate}
              onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
            />
          </div>
          <div>
            <label style={label}>End Date</label>
            <input
              style={input}
              type="date"
              value={tripForm.endDate}
              onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Destination</label>
          <select
            style={input}
            value={tripForm.destination}
            onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
          >
            <option value="Algodon Wine Estates">Algodon Wine Estates</option>
            <option value="Algodon Mansion">Algodon Mansion</option>
            <option value="Both Properties">Both Properties</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={label}>Notes (optional)</label>
          <textarea
            style={{ ...input, minHeight: "60px", resize: "vertical" }}
            placeholder="Any notes about this trip..."
            value={tripForm.notes}
            onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowCreateTrip(false)} style={btn(false)}>Cancel</button>
          <button onClick={handleCreateTrip} style={btn(true)}>Create Trip</button>
        </div>
      </div>
    </div>
  );

  // ===== RENDER: TRIP DETAIL =====
  const renderTripDetail = () => {
    if (!selectedTrip) return null;
    const isCreator = selectedTrip.creatorEmail === user.email;

    return (
      <div style={{ padding: "0 16px 120px" }}>
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedTrip(null);
            setViewMode("list");
          }}
          style={{ background: "none", border: "none", color: C.cyan, fontFamily: sans, fontSize: "14px", cursor: "pointer", padding: "8px 0", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}
        >
          ← Back to My Trips
        </button>

        {/* Trip Header */}
        <div style={{ ...card, borderLeft: `3px solid ${C.cyan}` }}>
          <h2 style={{ fontFamily: serif, fontSize: "22px", color: C.text, margin: "0 0 4px" }}>{selectedTrip.name}</h2>
          <p style={{ fontFamily: sans, fontSize: "14px", color: C.cyan, margin: "0 0 6px" }}>{selectedTrip.destination}</p>
          <p style={{ fontFamily: sans, fontSize: "13px", color: C.textMuted, margin: "0 0 8px" }}>
            {formatDate(selectedTrip.startDate)} — {formatDate(selectedTrip.endDate)}
          </p>
          {selectedTrip.notes && (
            <p style={{ fontFamily: sans, fontSize: "13px", color: C.textDim, margin: "0 0 12px" }}>{selectedTrip.notes}</p>
          )}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={handleShareLink} style={{ ...btn(false), width: "auto", padding: "8px 14px", fontSize: "12px" }}>
              🔗 Share Link
            </button>
            <button onClick={handleDownloadCalendar} style={{ ...btn(false), width: "auto", padding: "8px 14px", fontSize: "12px" }}>
              📅 Download Calendar
            </button>
            <button onClick={() => setShowInvite(true)} style={{ ...btn(false), width: "auto", padding: "8px 14px", fontSize: "12px" }}>
              👥 Invite People
            </button>
          </div>
        </div>

        {/* Guests */}
        <div style={{ ...card }}>
          <h3 style={{ fontFamily: serif, fontSize: "16px", color: C.text, margin: "0 0 10px" }}>
            Guests ({(invitees.length || 0) + 1})
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontFamily: sans, fontSize: "12px", backgroundColor: C.cyanBg, color: C.cyan, padding: "4px 10px", borderRadius: "12px", border: `1px solid ${C.cyan}` }}>
              {selectedTrip.creatorName || selectedTrip.creatorEmail} (organizer)
            </span>
            {invitees.map((inv) => (
              <span key={inv.id} style={{ fontFamily: sans, fontSize: "12px", backgroundColor: "rgba(255,255,255,0.05)", color: C.textMuted, padding: "4px 10px", borderRadius: "12px", border: `1px solid ${C.border}` }}>
                {inv.name || inv.email}
                {inv.status === "accepted" && " ✓"}
              </span>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontFamily: serif, fontSize: "18px", color: C.text, margin: 0 }}>Itinerary</h3>
          <button onClick={() => setShowAddActivity(true)} style={{ ...btn(true), width: "auto", padding: "8px 16px", fontSize: "13px" }}>
            + Add
          </button>
        </div>

        {activities.length === 0 ? (
          <div style={{ ...card, textAlign: "center", padding: "30px 20px" }}>
            <p style={{ fontFamily: sans, fontSize: "14px", color: C.textMuted, margin: 0 }}>
              No activities yet. Tap "+ Add" to start building your itinerary.
            </p>
          </div>
        ) : (
          Object.entries(groupedActivities)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, acts]) => (
              <div key={date} style={{ marginBottom: "16px" }}>
                <div style={{ fontFamily: serif, fontSize: "14px", color: C.cyan, marginBottom: "8px", paddingBottom: "4px", borderBottom: `1px solid ${C.border}` }}>
                  {date === "unscheduled" ? "Unscheduled" : formatDate(date)}
                </div>
                {acts.map((act) => (
                  <div key={act.id} style={{ ...card, display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "24px", marginTop: "2px" }}>{getActivityIcon(act.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontFamily: sans, fontSize: "14px", fontWeight: "600", color: C.text, margin: "0 0 2px" }}>
                          {act.title}
                        </h4>
                        {(isCreator || act.addedBy === user.email) && (
                          <button onClick={() => handleDeleteActivity(act.id)} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "14px", padding: "0 4px" }}>
                            ✕
                          </button>
                        )}
                      </div>
                      {act.time && (
                        <p style={{ fontFamily: sans, fontSize: "12px", color: C.cyan, margin: "0 0 2px" }}>{act.time}</p>
                      )}
                      {act.location && (
                        <p style={{ fontFamily: sans, fontSize: "12px", color: C.textMuted, margin: "0 0 2px" }}>📍 {act.location}</p>
                      )}
                      {act.notes && (
                        <p style={{ fontFamily: sans, fontSize: "12px", color: C.textDim, margin: "2px 0 0" }}>{act.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
        )}

        {/* Add Activity Modal */}
        {showAddActivity && renderAddActivityForm()}
        {/* Invite Modal */}
        {showInvite && renderInviteForm()}
      </div>
    );
  };

  // ===== RENDER: ADD ACTIVITY FORM =====
  const renderAddActivityForm = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: C.bgCard, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ fontFamily: serif, fontSize: "20px", color: C.text, marginTop: 0, marginBottom: "20px" }}>Add to Itinerary</h3>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Type</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {activityTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setActivityForm({ ...activityForm, type: t.value })}
                style={{
                  padding: "6px 10px",
                  borderRadius: "16px",
                  border: `1px solid ${activityForm.type === t.value ? C.cyan : C.border}`,
                  backgroundColor: activityForm.type === t.value ? C.cyanBg : "transparent",
                  color: activityForm.type === t.value ? C.cyan : C.textMuted,
                  fontFamily: sans,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Title</label>
          <input
            style={input}
            placeholder="e.g. Wine tasting at Algodon"
            value={activityForm.title}
            onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          <div>
            <label style={label}>Date</label>
            <input
              style={input}
              type="date"
              value={activityForm.date}
              onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
            />
          </div>
          <div>
            <label style={label}>Time (optional)</label>
            <input
              style={input}
              type="time"
              value={activityForm.time}
              onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Location (optional)</label>
          <input
            style={input}
            placeholder="e.g. Main vineyard"
            value={activityForm.location}
            onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={label}>Notes (optional)</label>
          <textarea
            style={{ ...input, minHeight: "50px", resize: "vertical" }}
            placeholder="Any details..."
            value={activityForm.notes}
            onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowAddActivity(false)} style={btn(false)}>Cancel</button>
          <button onClick={handleAddActivity} style={btn(true)}>Add Activity</button>
        </div>
      </div>
    </div>
  );

  // ===== RENDER: INVITE FORM =====
  const renderInviteForm = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: C.bgCard, borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "400px" }}>
        <h3 style={{ fontFamily: serif, fontSize: "20px", color: C.text, marginTop: 0, marginBottom: "16px" }}>Invite to Trip</h3>
        <p style={{ fontFamily: sans, fontSize: "13px", color: C.textMuted, marginTop: 0, marginBottom: "16px" }}>
          They'll receive a link to view the itinerary. If they have the app, they'll also see it in their My Trips.
        </p>

        <div style={{ marginBottom: "14px" }}>
          <label style={label}>Name</label>
          <input
            style={input}
            placeholder="Guest name"
            value={inviteeName}
            onChange={(e) => setInviteeName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={label}>Email</label>
          <input
            style={input}
            type="email"
            placeholder="guest@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowInvite(false)} style={btn(false)}>Cancel</button>
          <button onClick={handleInvite} style={btn(true)}>Send Invite</button>
        </div>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", maxWidth: "430px", margin: "0 auto" }}>
      {renderHeader()}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)", backgroundColor: C.cyan, color: "#000", padding: "10px 20px", borderRadius: "8px", fontFamily: sans, fontSize: "14px", fontWeight: "600", zIndex: 2000, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          {toast}
        </div>
      )}

      {viewMode === "list" ? renderTripList() : renderTripDetail()}

      {renderNav()}
    </div>
  );
};

export default MyTrips;
