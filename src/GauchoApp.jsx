import { useState, useEffect, useRef } from "react";
import { C, serif, sans, sendManagerEmail } from "./constants";
import { LOTS, CAROUSEL_AWE, CAROUSEL_GAUCHO, CAROUSEL_WINES } from "./data";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "./firebase";
import AdminPanel from "./AdminPanel";
import VipTrips from "./VipTrips";
import WineEstate from "./WineEstate";
import GauchoBA from "./GauchoBA";
import Wines from "./Wines";

function GauchoApp() {
  // ===== GLOBAL STATE =====
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("wine-estate");
  const [adminTab, setAdminTab] = useState("requests");

  // ===== LOGIN FORM STATE =====
  const [loginEmail, setLoginEmail] = useState("demo@gaucho.com");
  const [loginPassword, setLoginPassword] = useState("demo");
  const [loginError, setLoginError] = useState("");

  // ===== CREATE ACCOUNT FORM STATE =====
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ===== WINE ESTATE STATE =====
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [gauchoCarouselIdx, setGauchoCarouselIdx] = useState(0);
  const [winesCarouselIdx, setWinesCarouselIdx] = useState(0);
  const [selectedMapTab, setSelectedMapTab] = useState("phase1");
  const [mapFilter, setMapFilter] = useState("all");
  const [selectedLot, setSelectedLot] = useState(null);

  // ===== RESERVATIONS STATE =====
  const [showReservations, setShowReservations] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservationGuests, setReservationGuests] = useState("");

  // ===== CONCIERGE STATE =====
  const [expandedSection, setExpandedSection] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reservationFilter, setReservationFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [managerNotes, setManagerNotes] = useState({});
  const [emailSent, setEmailSent] = useState(null);
  const [showManageReservations, setShowManageReservations] = useState(true);

  // ===== GUEST INFO (shared across all forms) =====
  const [guestName, setGuestName] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");

  // ===== ROOM RESERVATION FORMS =====
  const [algodEstateForm, setAlgodEstateForm] = useState({ arrivalDate: "", nights: "", rooms: "", guests: "", property: "Algodon Mansion" });
  const [aweForm, setAweForm] = useState({ arrivalDate: "", nights: "", rooms: "", guests: "", property: "Algodon Wine Estates" });
  const [casaForm, setCasaForm] = useState({ arrivalDate: "", nights: "", guests: "", property: "Casa Gaucho" });

  // ===== SYNXIS AVAILABILITY STATE =====
  const [mansionAvail, setMansionAvail] = useState(null);
  const [aweAvail, setAweAvail] = useState(null);
  const [casaAvail, setCasaAvail] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState({});

  // ===== CONCIERGE SERVICE FORMS =====
  const [transfersForm, setTransfersForm] = useState({ type: "arrival", airport: "", flightNumber: "", airline: "", time: "12:00", passengers: "", notes: "", property: "Algodon Wine Estates" });
  const [dinnerForms, setDinnerForms] = useState([{ restaurant: "", day: "Monday", time: "19:00", guests: "", notes: "" }]);
  const [dinnerProperty, setDinnerProperty] = useState("Algodon Wine Estates");
  const [wineTastingForm, setWineTastingForm] = useState({ day: "Monday", time: "14:00", guests: "", property: "Algodon Wine Estates" });
  const [wineryTourForm, setWineryTourForm] = useState({ day: "Monday", time: "10:00", guests: "", property: "Algodon Wine Estates" });
  const [asadoForm, setAsadoForm] = useState({ day: "Monday", time: "18:00", guests: "", property: "Algodon Wine Estates" });
  const [chefForm, setChefForm] = useState({ day: "Monday", time: "19:00", guests: "", property: "Algodon Wine Estates" });

  // ===== NEW PROPERTY SELECTOR & SPECIAL REQUEST FORMS =====
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showsForm, setShowsForm] = useState({ date: "", time: "20:00", guests: "", notes: "" });
  const [specialRequestText, setSpecialRequestText] = useState("");

  // ===== NEW AWE SERVICE FORMS =====
  const [restaurantForms, setRestaurantForms] = useState([{ date: "", time: "12:00", guests: "", notes: "" }]);
  const [makeWineForm, setMakeWineForm] = useState({ date: "", guests: "", notes: "" });
  const [spaForms, setSpaForms] = useState([{ date: "", time: "10:00", treatment: "", notes: "" }]);
  const [tennisClassForms, setTennisClassForms] = useState([{ date: "", time: "10:00", guests: "", level: "beginner" }]);
  const [golfClassForms, setGolfClassForms] = useState([{ date: "", time: "10:00", guests: "", level: "beginner" }]);
  const [mateandoForm, setMateandoForm] = useState({ date: "", guests: "" });
  const [picnicForm, setPicnicForm] = useState({ date: "", time: "12:00", guests: "", notes: "" });
  const [fillFridgeForm, setFillFridgeForm] = useState({ items: "" });

  // ===== ADMIN USERS STATE =====
  const [allUsers, setAllUsers] = useState([
    { id: 1, email: "admin@gaucho.com", name: "Admin User", role: "admin", property: null },
    { id: 2, email: "demo@gaucho.com", name: "Demo User", role: "guest", property: null },
    { id: 3, email: "member@gaucho.com", name: "Gaucho Member", role: "member", property: null },
    { id: 4, email: "manager@awe.com", name: "AWE Manager", role: "manager", property: "Algodon Wine Estates" },
    { id: 5, email: "manager@mansion.com", name: "Mansion Manager", role: "manager", property: "Algodon Mansion" },
  ]);

  // ===== ADMIN LOTS STATE =====
  const [allLots, setAllLots] = useState(LOTS.map(lot => ({ ...lot, financeYears: lot.financeYears || 10, downpayment: lot.downpayment || (lot.total ? Math.round(lot.total * 0.3) : 0) })));
  const [financeRate, setFinanceRate] = useState(7.5);
  const [editingLot, setEditingLot] = useState(null);
  const [showCreateLot, setShowCreateLot] = useState(false);
  const [newLotForm, setNewLotForm] = useState({ id: "", acres: "", m2: "", total: "", desc: "", maintenance: "", village: "Wine & Golf", status: "available", financeYears: "10", downpayment: "" });
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const lotFileInputRef = useRef(null);
  const [adminPropertyFilter, setAdminPropertyFilter] = useState("Algodon Mansion");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "guest", property: null });

  // ===== NEW ACTIVITY FORM STATE =====
  const [astronomyForm, setAstronomyForm] = useState({ date: "", guests: "" });
  const [empanadaForm, setEmpanadaForm] = useState({ date: "", guests: "" });
  const [horseridingForm, setHorseridingForm] = useState({ date: "", guests: "" });
  const [toursEntertainmentForm, setToursEntertainmentForm] = useState({ description: "", date: "", time: "", guests: "" });

  // ===== INQUIRY FORM STATE =====
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });

  // ===== CAROUSEL EFFECTS =====
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % CAROUSEL_AWE.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGauchoCarouselIdx(prev => (prev + 1) % CAROUSEL_GAUCHO.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWinesCarouselIdx(prev => (prev + 1) % CAROUSEL_WINES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ===== ROLE LOOKUP =====
  const ADMIN_EMAILS = {
    "admin@gaucho.com": { role: "admin", isAdmin: true, property: null },
    "manager@awe.com": { role: "manager", isAdmin: false, property: "Algodon Wine Estates" },
    "manager@mansion.com": { role: "manager", isAdmin: false, property: "Algodon Mansion" },
  };

  const getUserRole = (email) => {
    const match = ADMIN_EMAILS[email];
    return match || { role: "guest", isAdmin: false, property: null };
  };

  // ===== FIREBASE AUTH STATE LISTENER =====
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const roleInfo = getUserRole(firebaseUser.email);
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          picture: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          ...roleInfo,
        });
        if (roleInfo.isAdmin) setCurrentTab("admin");
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ===== AUTHENTICATION HANDLERS =====
  const handleGoogleLogin = async () => {
    setLoginError("");
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLoginForm(false);
      setCurrentTab("vip-trips");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setLoginError(err.message);
      }
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setShowLoginForm(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setLoginError("Invalid email or password");
      } else {
        setLoginError(err.message);
      }
    }
  };

  const handleCreateAccount = async () => {
    if (!newEmail || !newPassword || !newName) {
      alert("Please fill in name, email, and password");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      const credential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      await updateProfile(credential.user, { displayName: newName });
      const newUser = { id: Date.now(), email: newEmail, name: newName, phone: newPhone, role: "guest", property: null };
      setAllUsers(prev => [...prev, newUser]);
      setShowCreateAccountForm(false);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewPhone("");
      setCurrentTab("vip-trips");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("An account with this email already exists. Please log in instead.");
      } else {
        alert(err.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentTab("vip-trips");
    setShowLoginForm(false);
    setShowCreateAccountForm(false);
  };

  // ===== CONCIERGE SUBMISSION HANDLERS =====
  const makeRequest = (type, details, property) => ({
    id: Date.now() + Math.random(),
    type,
    details,
    property: property || "Algodon Wine Estates",
    guestName: guestName || user?.name || "Guest",
    reservationNumber: reservationNumber || "—",
    submittedBy: user?.email,
    status: "Pending",
    date: new Date().toLocaleDateString(),
    confirmedBy: null,
    answerRequested: false,
    managerNotes: "",
  });

  const handleRequestAnswer = (requestId) => {
    const req = requests.find(r => r.id === requestId);
    setRequests(requests.map(r => r.id === requestId ? { ...r, status: "Answer Requested", answerRequested: true } : r));
    if (req) sendManagerEmail({...req, status: "Answer Requested"}, "answer_requested");
    setEmailSent(`Answer requested — notification sent to ${req?.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
  };

  const handleSubmitTransfers = () => {
    if (!transfersForm.airport || !transfersForm.flightNumber || !transfersForm.passengers) {
      alert("Please fill all required fields");
      return;
    }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Transfers", `${transfersForm.type.charAt(0).toUpperCase() + transfersForm.type.slice(1)} - ${transfersForm.airport}, Flight ${transfersForm.flightNumber}, ${transfersForm.passengers} pax`, transfersForm.property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${transfersForm.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setTransfersForm({ type: "arrival", airport: "", flightNumber: "", airline: "", time: "12:00", passengers: "", notes: "", property: "Algodon Wine Estates" });
    setExpandedSection(null);
    alert("Transfer request submitted!");
  };

  const handleSubmitDinners = () => {
    const validDinners = dinnerForms.filter(d => d.restaurant && d.guests);
    if (validDinners.length === 0) { alert("Please fill in at least one dinner reservation"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newRequests = validDinners.map(dinner =>
      makeRequest("Dinner Reservation", `${dinner.restaurant} - ${dinner.day} at ${dinner.time}, ${dinner.guests} guests`, dinnerProperty)
    );
    setRequests(prev => [...prev, ...newRequests]);
    newRequests.forEach(req => sendManagerEmail(req));
    setEmailSent(`Request sent — notification emailed to ${dinnerProperty} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setDinnerForms([{ restaurant: "", day: "Monday", time: "19:00", guests: "", notes: "" }]);
    setExpandedSection(null);
    alert("Dinner reservation(s) submitted!");
  };

  const handleSubmitWineTasting = () => {
    if (!wineTastingForm.guests) { alert("Please specify number of guests"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Wine Tasting", `${wineTastingForm.day} at ${wineTastingForm.time}, ${wineTastingForm.guests} guests`, wineTastingForm.property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${wineTastingForm.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setWineTastingForm({ day: "Monday", time: "14:00", guests: "", property: "Algodon Wine Estates" });
    setExpandedSection(null);
    alert("Wine tasting request submitted!");
  };

  const handleSubmitWineryTour = () => {
    if (!wineryTourForm.guests) { alert("Please specify number of guests"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Winery Tour", `${wineryTourForm.day} at ${wineryTourForm.time}, ${wineryTourForm.guests} guests`, wineryTourForm.property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${wineryTourForm.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setWineryTourForm({ day: "Monday", time: "10:00", guests: "", property: "Algodon Wine Estates" });
    setExpandedSection(null);
    alert("Winery tour request submitted!");
  };

  const handleSubmitAsado = () => {
    if (!asadoForm.guests) { alert("Please specify number of guests"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Asado Experience", `${asadoForm.day} at ${asadoForm.time}, ${asadoForm.guests} guests`, asadoForm.property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${asadoForm.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setAsadoForm({ day: "Monday", time: "18:00", guests: "", property: "Algodon Wine Estates" });
    setExpandedSection(null);
    alert("Asado experience request submitted!");
  };

  const handleSubmitChef = () => {
    if (!chefForm.guests) { alert("Please specify number of guests"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Personal Chef", `${chefForm.day} at ${chefForm.time}, ${chefForm.guests} guests`, chefForm.property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${chefForm.property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setChefForm({ day: "Monday", time: "19:00", guests: "", property: "Algodon Wine Estates" });
    setExpandedSection(null);
    alert("Personal chef request submitted!");
  };

  const handleSubmitShows = (property) => {
    if (!showsForm.date || !showsForm.guests) { alert("Please fill required fields"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Shows", `${showsForm.date} at ${showsForm.time}, ${showsForm.guests} guests${showsForm.notes ? " - " + showsForm.notes : ""}`, property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setShowsForm({ date: "", time: "20:00", guests: "", notes: "" });
    setExpandedSection(null);
    alert("Show reservation submitted!");
  };

  const handleSubmitSpecialRequest = (property) => {
    if (!specialRequestText) { alert("Please describe your request"); return; }
    if (!guestName) { alert("Please enter the guest name"); return; }
    const newReq = makeRequest("Special Request", specialRequestText, property);
    setRequests([...requests, newReq]);
    sendManagerEmail(newReq);
    setEmailSent(`Request sent — notification emailed to ${property} manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setSpecialRequestText("");
    setExpandedSection(null);
    alert("Special request submitted!");
  };

  const handleSubmitReservation = () => {
    if (!selectedActivity || !reservationDate || !reservationTime || !reservationGuests) {
      alert("Please fill all reservation fields");
      return;
    }
    const req = {
      id: Date.now() + Math.random(),
      type: "Activity Reservation",
      details: `${selectedActivity} - ${reservationDate} at ${reservationTime}, ${reservationGuests} guests`,
      property: "Algodon Wine Estates",
      guestName: guestName || user?.name || "Guest",
      reservationNumber: reservationNumber || "—",
      submittedBy: user?.email || "walk-in",
      status: "Pending",
      date: new Date().toLocaleDateString(),
      confirmedBy: null,
      answerRequested: false,
      managerNotes: "",
    };
    setRequests([...requests, req]);
    sendManagerEmail(req);
    setEmailSent(`Request sent — notification emailed to Algodon Wine Estates manager`);
    setTimeout(() => setEmailSent(null), 3000);
    setShowReservations(false);
    setSelectedActivity(null);
    setReservationDate("");
    setReservationTime("");
    setReservationGuests("");
    alert("Activity reservation submitted!");
  };

  const getActivityTimes = (activity) => {
    switch(activity) {
      case "Golf":
      case "Tennis":
        return Array.from({ length: 8 }, (_, i) => `${String(10 + i).padStart(2, "0")}:00`);
      case "Restaurant":
        return ["12:00", "13:00", "14:00", "15:00", "19:00", "20:00"];
      case "Winery Tour":
        return ["10:00", "12:00", "14:00", "16:00"];
      case "Mateando":
        return ["18:00"];
      case "Picnic":
        return ["12:00", "18:00"];
      case "Spa & Wellness":
        return ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
      default:
        return [];
    }
  };

  // ===== ADMIN HANDLERS =====
  const handleChangeRequestStatus = (requestId, newStatus) => {
    const notes = managerNotes[requestId] || "";
    setRequests(requests.map(r => r.id === requestId ? { ...r, status: newStatus, confirmedBy: user?.name || "Manager", managerNotes: notes } : r));
    setManagerNotes(prev => { const copy = {...prev}; delete copy[requestId]; return copy; });
  };

  const handleToggleLotStatus = (lotId) => {
    setAllLots(allLots.map(lot => {
      if (lot.id === lotId) {
        const statusCycle = ["available", "sold", "reserved"];
        const currentIdx = statusCycle.indexOf(lot.status);
        const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
        return { ...lot, status: nextStatus };
      }
      return lot;
    }));
  };

  // ===== FINANCE CALCULATOR =====
  const calcMonthlyPayment = (lotTotal, downpayment, years, rate) => {
    if (!lotTotal || !years || years <= 0) return 0;
    const principal = (lotTotal || 0) - (downpayment || 0);
    if (principal <= 0) return 0;
    const monthlyRate = (rate || 7.5) / 100 / 12;
    const nPayments = years * 12;
    if (monthlyRate === 0) return principal / nPayments;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1);
  };

  // ===== BULK LOT UPLOAD HELPERS =====
  const handleDownloadLotTemplate = () => {
    const csvHeader = "lot_id,acres,size_m2,total_price,monthly_maintenance,village,status,description,finance_years,downpayment";
    const csvExample1 = "E99,1.50,6070,450000,420.00,Wine & Golf,available,Example lot near 9th Hole with vineyard views,10,135000";
    const csvExample2 = "F99,2.10,8500,620000,490.00,Garden Estate,available,Equestrian meadow homesite with mountain views,15,186000";
    const csvContent = [csvHeader, csvExample1, csvExample2].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lots-upload-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkLotUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) { setBulkUploadResult({ success: false, message: "File is empty or has no data rows." }); return; }
        const header = lines[0].toLowerCase().replace(/\s+/g, "");
        const headerCols = header.split(",").map(h => h.trim());
        const colMap = {};
        headerCols.forEach((col, idx) => {
          if (col.includes("lot") && col.includes("id")) colMap.id = idx;
          else if (col === "acres") colMap.acres = idx;
          else if (col.includes("m2") || col.includes("size")) colMap.m2 = idx;
          else if (col.includes("total") || col.includes("price")) colMap.total = idx;
          else if (col.includes("maintenance")) colMap.maintenance = idx;
          else if (col.includes("village")) colMap.village = idx;
          else if (col.includes("status")) colMap.status = idx;
          else if (col.includes("desc")) colMap.desc = idx;
          else if (col.includes("finance") && col.includes("year")) colMap.financeYears = idx;
          else if (col.includes("downpayment") || col.includes("down_payment")) colMap.downpayment = idx;
        });
        if (colMap.id === undefined) { setBulkUploadResult({ success: false, message: "CSV must have a 'lot_id' column." }); return; }
        const validStatuses = ["available", "reserved", "sold", "inquire"];
        const validVillages = ["Wine & Golf", "Garden Estate", "Desert & Vineyard", "Vineyard Estate"];
        const newLots = [];
        const skipped = [];
        const existingIds = new Set(allLots.map(l => l.id));
        for (let i = 1; i < lines.length; i++) {
          const row = [];
          let current = "", inQuotes = false;
          for (let c = 0; c < lines[i].length; c++) {
            const ch = lines[i][c];
            if (ch === '"') { inQuotes = !inQuotes; }
            else if (ch === ',' && !inQuotes) { row.push(current.trim()); current = ""; }
            else { current += ch; }
          }
          row.push(current.trim());
          const lotId = row[colMap.id]?.trim();
          if (!lotId) { skipped.push(`Row ${i + 1}: missing lot ID`); continue; }
          if (existingIds.has(lotId)) { skipped.push(`Row ${i + 1}: lot "${lotId}" already exists`); continue; }
          const status = (row[colMap.status] || "available").toLowerCase().trim();
          const village = row[colMap.village]?.trim() || "Wine & Golf";
          const lot = {
            id: lotId,
            acres: colMap.acres !== undefined ? (parseFloat(row[colMap.acres]) || null) : null,
            m2: colMap.m2 !== undefined ? (parseInt(row[colMap.m2]) || null) : null,
            total: colMap.total !== undefined ? (parseInt(row[colMap.total]) || null) : null,
            maintenance: colMap.maintenance !== undefined ? (parseFloat(row[colMap.maintenance]) || null) : null,
            village: validVillages.find(v => v.toLowerCase() === village.toLowerCase()) || village,
            status: validStatuses.includes(status) ? status : "available",
            desc: colMap.desc !== undefined ? (row[colMap.desc] || "") : "",
            financeYears: colMap.financeYears !== undefined ? (parseInt(row[colMap.financeYears]) || 10) : 10,
            downpayment: colMap.downpayment !== undefined ? (parseInt(row[colMap.downpayment]) || 0) : (colMap.total !== undefined ? Math.round((parseInt(row[colMap.total]) || 0) * 0.3) : 0),
          };
          newLots.push(lot);
          existingIds.add(lotId);
        }
        if (newLots.length > 0) {
          setAllLots(prev => [...prev, ...newLots]);
        }
        setBulkUploadResult({ success: true, added: newLots.length, skipped: skipped.length, skippedDetails: skipped, message: `${newLots.length} lot${newLots.length !== 1 ? "s" : ""} added successfully${skipped.length > 0 ? `, ${skipped.length} skipped` : ""}.` });
        setTimeout(() => setBulkUploadResult(null), 8000);
      } catch (err) {
        setBulkUploadResult({ success: false, message: "Error parsing CSV: " + err.message });
        setTimeout(() => setBulkUploadResult(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ===== RENDER VIP LOGIN =====
  const renderVipLogin = () => (
    <div style={{ padding: "20px 20px 120px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontFamily: serif, fontSize: "22px", color: C.cyan, marginBottom: "8px" }}>VIP Concierge</h2>
      <p style={{ color: C.textMuted, fontSize: "13px", marginBottom: "24px", textAlign: "center" }}>Please sign in to access concierge services and trip planning.</p>

      {showCreateAccountForm ? (
        <div style={{ width: "100%", maxWidth: "390px", backgroundColor: C.bgCard, padding: "24px", borderRadius: "8px", border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: "16px", marginBottom: "16px", color: C.text, fontFamily: serif }}>Create Account</h3>
          <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <input type="tel" placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "16px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <button onClick={handleCreateAccount} style={{ width: "100%", padding: "12px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer", marginBottom: "10px", fontFamily: sans, fontSize: "14px" }}>Create Account</button>
          <button onClick={() => setShowCreateAccountForm(false)} style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "14px" }}>Back</button>
        </div>
      ) : showLoginForm ? (
        <div style={{ width: "100%", maxWidth: "390px", backgroundColor: C.bgCard, padding: "24px", borderRadius: "8px", border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: "16px", marginBottom: "16px", color: C.text, fontFamily: serif }}>Login</h3>
          {loginError && <p style={{ color: C.danger, marginBottom: "10px", fontSize: "12px" }}>{loginError}</p>}
          <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "16px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }} />
          <button onClick={handleLogin} style={{ width: "100%", padding: "12px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer", marginBottom: "10px", fontFamily: sans, fontSize: "14px" }}>Login</button>
          <button onClick={() => setShowLoginForm(false)} style={{ width: "100%", padding: "12px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "14px" }}>Back</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "390px" }}>
          <button onClick={handleGoogleLogin} style={{ padding: "14px", backgroundColor: "#FFFFFF", color: "#333", border: "1px solid #555", borderRadius: "4px", fontWeight: "500", cursor: "pointer", fontFamily: sans, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
            <div style={{ flex: 1, height: "1px", background: C.border }} />
            <span style={{ color: C.textMuted, fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: C.border }} />
          </div>
          <button onClick={() => setShowLoginForm(true)} style={{ padding: "14px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "16px" }}>Login with Email</button>
          <button onClick={() => setShowCreateAccountForm(true)} style={{ padding: "14px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "4px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "16px" }}>Create Account</button>
        </div>
      )}
    </div>
  );

  // ===== SHARED HEADER =====
  const renderHeader = () => (
    <header style={{ backgroundColor: C.bg, padding: "14px 16px", position: "sticky", top: 0, zIndex: 999, borderBottom: `1px solid ${C.border}`, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <img src="https://i.postimg.cc/9fLX5RGL/Gaucho_Group_Holdings.jpg" alt="Gaucho Group Holdings" style={{ height: "140px", opacity: 0.95 }} />
    </header>
  );

  // ===== SHARED BOTTOM NAV =====
  const NavLogo = ({ lines, active }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0px", lineHeight: "1.1" }}>
      {lines.map((line, i) => (
        <span key={i} style={{ fontSize: i === 0 ? "9px" : "7px", fontFamily: serif, letterSpacing: "1.5px", color: active ? C.cyan : C.textMuted, fontWeight: i === 0 ? "600" : "400" }}>{line}</span>
      ))}
    </div>
  );

  const renderNav = () => (
    <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "430px", backgroundColor: C.bgCard, borderTop: `2px solid ${C.cyan}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "6px 0 8px", height: "72px", zIndex: 999, borderRadius: "12px 12px 0 0" }}>
      {[
        { id: "vip-trips", lines: ["VIP", "CONCIERGE"] },
        { id: "wine-estate", lines: ["ALGODON", "WINE ESTATES"] },
        { id: "gaucho-ba", lines: ["GAUCHO", "BUENOS AIRES"] },
        { id: "wines", lines: ["ALGODON", "FINE WINES"] },
      ].map(tab => (
        <button key={tab.id} onClick={() => { setCurrentTab(tab.id); window.scrollTo(0, 0); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: "4px 2px", borderBottom: currentTab === tab.id ? `2px solid ${C.cyan}` : "2px solid transparent" }}>
          <NavLogo lines={tab.lines} active={currentTab === tab.id} />
        </button>
      ))}
      {user && user?.isAdmin && (
        <button onClick={() => setCurrentTab("admin")} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: currentTab === "admin" ? C.cyan : C.textMuted, fontFamily: sans, fontSize: "10px", padding: "8px" }}>
          <span style={{ fontSize: "20px" }}>⚙</span>
          <span>Admin</span>
        </button>
      )}
      {user && (
        <button onClick={handleLogout} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", backgroundColor: "transparent", border: "none", cursor: "pointer", color: C.textMuted, fontFamily: sans, fontSize: "10px", padding: "8px" }}>
          <span style={{ fontSize: "20px" }}>🚪</span>
          <span>Logout</span>
        </button>
      )}
    </nav>
  );

  // ===== TAB ROUTING =====
  if (user?.isAdmin && currentTab === "admin") {
    return (
      <AdminPanel
        user={user}
        requests={requests}
        setRequests={setRequests}
        managerNotes={managerNotes}
        setManagerNotes={setManagerNotes}
        allUsers={allUsers}
        setAllUsers={setAllUsers}
        allLots={allLots}
        setAllLots={setAllLots}
        financeRate={financeRate}
        setFinanceRate={setFinanceRate}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        editingLot={editingLot}
        setEditingLot={setEditingLot}
        showCreateLot={showCreateLot}
        setShowCreateLot={setShowCreateLot}
        newLotForm={newLotForm}
        setNewLotForm={setNewLotForm}
        bulkUploadResult={bulkUploadResult}
        setBulkUploadResult={setBulkUploadResult}
        lotFileInputRef={lotFileInputRef}
        adminPropertyFilter={adminPropertyFilter}
        setAdminPropertyFilter={setAdminPropertyFilter}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        showCreateUser={showCreateUser}
        setShowCreateUser={setShowCreateUser}
        newUserForm={newUserForm}
        setNewUserForm={setNewUserForm}
        handleLogout={handleLogout}
        handleChangeRequestStatus={handleChangeRequestStatus}
        handleToggleLotStatus={handleToggleLotStatus}
        calcMonthlyPayment={calcMonthlyPayment}
        handleDownloadLotTemplate={handleDownloadLotTemplate}
        handleBulkLotUpload={handleBulkLotUpload}
        renderNav={renderNav}
      />
    );
  }

  if (currentTab === "vip-trips") {
    return (
      <VipTrips
        user={user}
        renderHeader={renderHeader}
        renderNav={renderNav}
        renderVipLogin={renderVipLogin}
        guestName={guestName}
        setGuestName={setGuestName}
        reservationNumber={reservationNumber}
        setReservationNumber={setReservationNumber}
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
        requests={requests}
        setRequests={setRequests}
        reservationFilter={reservationFilter}
        setReservationFilter={setReservationFilter}
        emailSent={emailSent}
        setEmailSent={setEmailSent}
        showManageReservations={showManageReservations}
        setShowManageReservations={setShowManageReservations}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        transfersForm={transfersForm}
        setTransfersForm={setTransfersForm}
        dinnerForms={dinnerForms}
        setDinnerForms={setDinnerForms}
        dinnerProperty={dinnerProperty}
        setDinnerProperty={setDinnerProperty}
        wineTastingForm={wineTastingForm}
        setWineTastingForm={setWineTastingForm}
        wineryTourForm={wineryTourForm}
        setWineryTourForm={setWineryTourForm}
        asadoForm={asadoForm}
        setAsadoForm={setAsadoForm}
        chefForm={chefForm}
        setChefForm={setChefForm}
        showsForm={showsForm}
        setShowsForm={setShowsForm}
        specialRequestText={specialRequestText}
        setSpecialRequestText={setSpecialRequestText}
        algodEstateForm={algodEstateForm}
        setAlgodEstateForm={setAlgodEstateForm}
        aweForm={aweForm}
        setAweForm={setAweForm}
        casaForm={casaForm}
        setCasaForm={setCasaForm}
        mansionAvail={mansionAvail}
        setMansionAvail={setMansionAvail}
        aweAvail={aweAvail}
        setAweAvail={setAweAvail}
        casaAvail={casaAvail}
        setCasaAvail={setCasaAvail}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        restaurantForms={restaurantForms}
        setRestaurantForms={setRestaurantForms}
        makeWineForm={makeWineForm}
        setMakeWineForm={setMakeWineForm}
        spaForms={spaForms}
        setSpaForms={setSpaForms}
        tennisClassForms={tennisClassForms}
        setTennisClassForms={setTennisClassForms}
        golfClassForms={golfClassForms}
        setGolfClassForms={setGolfClassForms}
        mateandoForm={mateandoForm}
        setMateandoForm={setMateandoForm}
        picnicForm={picnicForm}
        setPicnicForm={setPicnicForm}
        fillFridgeForm={fillFridgeForm}
        setFillFridgeForm={setFillFridgeForm}
        showReservations={showReservations}
        setShowReservations={setShowReservations}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        reservationDate={reservationDate}
        setReservationDate={setReservationDate}
        reservationTime={reservationTime}
        setReservationTime={setReservationTime}
        reservationGuests={reservationGuests}
        setReservationGuests={setReservationGuests}
        handleSubmitTransfers={handleSubmitTransfers}
        handleSubmitDinners={handleSubmitDinners}
        handleSubmitWineTasting={handleSubmitWineTasting}
        handleSubmitWineryTour={handleSubmitWineryTour}
        handleSubmitAsado={handleSubmitAsado}
        handleSubmitChef={handleSubmitChef}
        handleSubmitShows={handleSubmitShows}
        handleSubmitSpecialRequest={handleSubmitSpecialRequest}
        handleSubmitReservation={handleSubmitReservation}
        handleRequestAnswer={handleRequestAnswer}
        getActivityTimes={getActivityTimes}
        managerFilter={managerFilter}
        setManagerFilter={setManagerFilter}
        managerNotes={managerNotes}
        setManagerNotes={setManagerNotes}
        handleChangeRequestStatus={handleChangeRequestStatus}
        makeRequest={makeRequest}
        sendManagerEmail={sendManagerEmail}
        astronomyForm={astronomyForm}
        setAstronomyForm={setAstronomyForm}
        empanadaForm={empanadaForm}
        setEmpanadaForm={setEmpanadaForm}
        horseridingForm={horseridingForm}
        setHorseridingForm={setHorseridingForm}
        toursEntertainmentForm={toursEntertainmentForm}
        setToursEntertainmentForm={setToursEntertainmentForm}
      />
    );
  }

  if (currentTab === "wine-estate") {
    return (
      <WineEstate
        renderHeader={renderHeader}
        renderNav={renderNav}
        carouselIndex={carouselIndex}
        selectedMapTab={selectedMapTab}
        setSelectedMapTab={setSelectedMapTab}
        mapFilter={mapFilter}
        setMapFilter={setMapFilter}
        selectedLot={selectedLot}
        setSelectedLot={setSelectedLot}
        allLots={allLots}
        setAllLots={setAllLots}
        calcMonthlyPayment={calcMonthlyPayment}
        financeRate={financeRate}
        showInquiryForm={showInquiryForm}
        setShowInquiryForm={setShowInquiryForm}
        inquiryForm={inquiryForm}
        setInquiryForm={setInquiryForm}
        user={user}
        makeRequest={makeRequest}
        setRequests={setRequests}
        sendManagerEmail={sendManagerEmail}
        setEmailSent={setEmailSent}
      />
    );
  }

  if (currentTab === "gaucho-ba") {
    return (
      <GauchoBA
        renderHeader={renderHeader}
        renderNav={renderNav}
        gauchoCarouselIdx={gauchoCarouselIdx}
      />
    );
  }

  if (currentTab === "wines") {
    return (
      <Wines
        renderHeader={renderHeader}
        renderNav={renderNav}
        winesCarouselIdx={winesCarouselIdx}
      />
    );
  }

  return <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, maxWidth: "430px", margin: "0 auto" }}>Loading...</div>;
}

export default GauchoApp;
