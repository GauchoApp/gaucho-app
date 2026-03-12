import { useState, useEffect } from "react";
import { C, serif, sans, STRIPE_CONFIG, handleStripePayment } from "./constants";
import {
  db,
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "./firebase";

function YourAccount({ user, renderHeader, renderNav }) {
  const [ownedLots, setOwnedLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showAutoDebit, setShowAutoDebit] = useState(false);
  const [autoDebitDay, setAutoDebitDay] = useState("1");

  // Load owned lots from Firestore
  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, "lotOwnership"), where("ownerEmail", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lots = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      setOwnedLots(lots);
      if (lots.length > 0 && !selectedLot) setSelectedLot(lots[0]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.email]);

  // Load payment history for selected lot
  useEffect(() => {
    if (!selectedLot?.firestoreId) { setPayments([]); return; }
    const q = query(
      collection(db, "lotPayments"),
      where("lotOwnershipId", "==", selectedLot.firestoreId),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPayments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [selectedLot?.firestoreId]);

  const formatCurrency = (amount) => {
    if (amount == null) return "—";
    return "$" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // Handle one-time payment
  const handleOneTimePayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) { alert("Please enter a valid amount"); return; }
    if (amount > (selectedLot.remainingBalance || 0)) {
      alert("Amount exceeds remaining balance");
      return;
    }

    const confirmed = await handleStripePayment(
      Math.round(amount * 100),
      `Lot ${selectedLot.lotId} — Partial Payment`,
      async () => {
        // Record payment in Firestore
        await addDoc(collection(db, "lotPayments"), {
          lotOwnershipId: selectedLot.firestoreId,
          lotId: selectedLot.lotId,
          ownerEmail: user.email,
          amount: amount,
          type: "one-time",
          status: "completed",
          date: serverTimestamp(),
          description: "Manual payment",
        });
        // Update remaining balance
        const newBalance = (selectedLot.remainingBalance || 0) - amount;
        const newTotalPaid = (selectedLot.totalPaid || 0) + amount;
        await updateDoc(doc(db, "lotOwnership", selectedLot.firestoreId), {
          remainingBalance: newBalance,
          totalPaid: newTotalPaid,
          lastPaymentDate: serverTimestamp(),
        });
        setPaymentAmount("");
        setShowPaymentForm(false);
        alert("Payment successful!");
      }
    );
  };

  // Handle auto-debit setup
  const handleSetupAutoDebit = async () => {
    const monthlyAmount = selectedLot.monthlyPayment || 0;
    if (monthlyAmount <= 0) { alert("No monthly payment configured"); return; }

    const confirmed = await handleStripePayment(
      Math.round(monthlyAmount * 100),
      `Lot ${selectedLot.lotId} — Monthly Auto-Debit Setup ($${monthlyAmount.toLocaleString()}/month)`,
      async () => {
        await updateDoc(doc(db, "lotOwnership", selectedLot.firestoreId), {
          autoDebit: true,
          autoDebitDay: parseInt(autoDebitDay),
          autoDebitStartDate: serverTimestamp(),
        });
        await addDoc(collection(db, "lotPayments"), {
          lotOwnershipId: selectedLot.firestoreId,
          lotId: selectedLot.lotId,
          ownerEmail: user.email,
          amount: monthlyAmount,
          type: "auto-debit",
          status: "completed",
          date: serverTimestamp(),
          description: `Auto-debit activated — Day ${autoDebitDay} of each month`,
        });
        const newBalance = (selectedLot.remainingBalance || 0) - monthlyAmount;
        const newTotalPaid = (selectedLot.totalPaid || 0) + monthlyAmount;
        await updateDoc(doc(db, "lotOwnership", selectedLot.firestoreId), {
          remainingBalance: newBalance,
          totalPaid: newTotalPaid,
          lastPaymentDate: serverTimestamp(),
        });
        setShowAutoDebit(false);
        alert("Auto-debit activated! You will be charged on the " + autoDebitDay + " of each month.");
      }
    );
  };

  const handleCancelAutoDebit = async () => {
    if (!window.confirm("Are you sure you want to cancel auto-debit?")) return;
    await updateDoc(doc(db, "lotOwnership", selectedLot.firestoreId), {
      autoDebit: false,
      autoDebitDay: null,
    });
    await addDoc(collection(db, "lotPayments"), {
      lotOwnershipId: selectedLot.firestoreId,
      lotId: selectedLot.lotId,
      ownerEmail: user.email,
      amount: 0,
      type: "system",
      status: "info",
      date: serverTimestamp(),
      description: "Auto-debit cancelled",
    });
    alert("Auto-debit cancelled.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return C.success;
      case "pending": return C.pending;
      case "overdue": return C.danger;
      case "info": return C.cyan;
      default: return C.textMuted;
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: "100vh", maxWidth: "430px", margin: "0 auto" }}>
        {renderHeader()}
        <div style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted }}>Loading your account...</div>
        {renderNav()}
      </div>
    );
  }

  if (ownedLots.length === 0) {
    return (
      <div style={{ backgroundColor: C.bg, minHeight: "100vh", maxWidth: "430px", margin: "0 auto" }}>
        {renderHeader()}
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <h2 style={{ fontFamily: serif, fontSize: "22px", color: C.cyan, marginBottom: "12px" }}>Your Account</h2>
          <p style={{ color: C.textMuted, fontSize: "14px" }}>No lots are currently assigned to your account. If you are a lot owner, please contact the administration.</p>
        </div>
        {renderNav()}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", maxWidth: "430px", margin: "0 auto", paddingBottom: "90px" }}>
      {renderHeader()}

      {/* Title */}
      <div style={{ padding: "20px 16px 10px", textAlign: "center" }}>
        <h2 style={{ fontFamily: serif, fontSize: "22px", color: C.cyan, marginBottom: "4px" }}>Your Account</h2>
        <p style={{ color: C.textMuted, fontSize: "12px" }}>Lot ownership & payment details</p>
      </div>

      {/* Lot Selector (if multiple lots) */}
      {ownedLots.length > 1 && (
        <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px", overflowX: "auto" }}>
          {ownedLots.map(lot => (
            <button
              key={lot.firestoreId}
              onClick={() => { setSelectedLot(lot); setShowPaymentForm(false); setShowAutoDebit(false); }}
              style={{
                padding: "10px 18px", borderRadius: "8px", border: `1px solid ${selectedLot?.firestoreId === lot.firestoreId ? C.cyan : C.border}`,
                backgroundColor: selectedLot?.firestoreId === lot.firestoreId ? C.cyanBg : C.bgCard,
                color: selectedLot?.firestoreId === lot.firestoreId ? C.cyan : C.text,
                fontFamily: serif, fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Lot {lot.lotId}
            </button>
          ))}
        </div>
      )}

      {selectedLot && (
        <>
          {/* Lot Info Card */}
          <div style={{ margin: "0 16px 12px", backgroundColor: C.bgCard, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: serif, fontSize: "20px", color: C.text }}>Lot {selectedLot.lotId}</h3>
                <span style={{
                  fontSize: "10px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase",
                  backgroundColor: selectedLot.remainingBalance > 0 ? "rgba(243,156,18,0.15)" : "rgba(46,204,113,0.15)",
                  color: selectedLot.remainingBalance > 0 ? C.pending : C.success,
                }}>
                  {selectedLot.remainingBalance > 0 ? "Balance Pending" : "Paid in Full"}
                </span>
              </div>
              <p style={{ color: C.textMuted, fontSize: "12px", marginTop: "4px" }}>{selectedLot.village || "Algodon Wine Estates"}</p>
              {selectedLot.description && <p style={{ color: C.textDim, fontSize: "12px", marginTop: "4px" }}>{selectedLot.description}</p>}
            </div>

            {/* Lot Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", backgroundColor: C.border }}>
              <div style={{ backgroundColor: C.bgCard, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Purchase Price</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: C.text }}>{formatCurrency(selectedLot.purchasePrice)}</div>
              </div>
              <div style={{ backgroundColor: C.bgCard, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Total Paid</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: C.success }}>{formatCurrency(selectedLot.totalPaid)}</div>
              </div>
              <div style={{ backgroundColor: C.bgCard, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Remaining Balance</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: selectedLot.remainingBalance > 0 ? C.pending : C.success }}>{formatCurrency(selectedLot.remainingBalance)}</div>
              </div>
              <div style={{ backgroundColor: C.bgCard, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Lot Size</div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: C.text }}>{selectedLot.acres ? `${selectedLot.acres} ac` : "—"}</div>
              </div>
            </div>

            {/* House Status */}
            <div style={{ padding: "14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: C.textMuted }}>House Built</span>
              <span style={{
                fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px",
                backgroundColor: selectedLot.houseBuilt ? "rgba(46,204,113,0.15)" : "rgba(102,102,102,0.15)",
                color: selectedLot.houseBuilt ? C.success : C.textMuted,
              }}>
                {selectedLot.houseBuilt ? "Yes" : "No"}
              </span>
            </div>

            {/* Monthly Payment & Auto-Debit Status */}
            {selectedLot.monthlyPayment > 0 && (
              <div style={{ padding: "14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: C.textMuted }}>Monthly Payment</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: C.text }}>{formatCurrency(selectedLot.monthlyPayment)}</span>
              </div>
            )}
            {selectedLot.autoDebit && (
              <div style={{ padding: "14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: C.textMuted }}>Auto-Debit</span>
                <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", backgroundColor: "rgba(91,188,213,0.15)", color: C.cyan }}>
                  Active — Day {selectedLot.autoDebitDay}
                </span>
              </div>
            )}

            {/* Maintenance Fee */}
            {selectedLot.maintenanceFee && (
              <div style={{ padding: "14px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: C.textMuted }}>Monthly Maintenance</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: C.text }}>{formatCurrency(selectedLot.maintenanceFee)}</span>
              </div>
            )}
          </div>

          {/* Payment Actions */}
          {selectedLot.remainingBalance > 0 && (
            <div style={{ padding: "0 16px 12px" }}>
              {!showPaymentForm && !showAutoDebit ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setShowPaymentForm(true)} style={{ flex: 1, padding: "14px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "14px" }}>
                    Make Payment
                  </button>
                  {!selectedLot.autoDebit ? (
                    <button onClick={() => setShowAutoDebit(true)} style={{ flex: 1, padding: "14px", backgroundColor: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "14px" }}>
                      Set Up Auto-Debit
                    </button>
                  ) : (
                    <button onClick={handleCancelAutoDebit} style={{ flex: 1, padding: "14px", backgroundColor: "transparent", color: C.danger, border: `1px solid ${C.danger}`, borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "14px" }}>
                      Cancel Auto-Debit
                    </button>
                  )}
                </div>
              ) : showPaymentForm ? (
                <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
                  <h4 style={{ fontFamily: serif, fontSize: "16px", color: C.text, marginBottom: "12px" }}>Make a Payment</h4>
                  <p style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px" }}>Remaining balance: {formatCurrency(selectedLot.remainingBalance)}</p>
                  <input
                    type="number"
                    placeholder="Amount (USD)"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    style={{ width: "100%", padding: "12px", marginBottom: "12px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleOneTimePayment} style={{ flex: 1, padding: "12px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "13px" }}>
                      Pay {paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : ""}
                    </button>
                    <button onClick={() => { setShowPaymentForm(false); setPaymentAmount(""); }} style={{ padding: "12px 16px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "6px", cursor: "pointer", fontFamily: sans, fontSize: "13px" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: C.bgCard, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "16px" }}>
                  <h4 style={{ fontFamily: serif, fontSize: "16px", color: C.text, marginBottom: "12px" }}>Set Up Auto-Debit</h4>
                  <p style={{ fontSize: "12px", color: C.textMuted, marginBottom: "4px" }}>Monthly charge: {formatCurrency(selectedLot.monthlyPayment)}</p>
                  <p style={{ fontSize: "12px", color: C.textMuted, marginBottom: "12px" }}>Remaining: {formatCurrency(selectedLot.remainingBalance)} ({selectedLot.monthlyPayment > 0 ? Math.ceil(selectedLot.remainingBalance / selectedLot.monthlyPayment) : "—"} months)</p>
                  <label style={{ fontSize: "11px", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", display: "block" }}>Charge Day of Month</label>
                  <select
                    value={autoDebitDay}
                    onChange={(e) => setAutoDebitDay(e.target.value)}
                    style={{ width: "100%", padding: "12px", marginBottom: "12px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "14px" }}
                  >
                    {Array.from({ length: 28 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleSetupAutoDebit} style={{ flex: 1, padding: "12px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontFamily: sans, fontSize: "13px" }}>
                      Activate Auto-Debit
                    </button>
                    <button onClick={() => setShowAutoDebit(false)} style={{ padding: "12px 16px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "6px", cursor: "pointer", fontFamily: sans, fontSize: "13px" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment History */}
          <div style={{ padding: "0 16px" }}>
            <h3 style={{ fontFamily: serif, fontSize: "18px", color: C.text, marginBottom: "12px" }}>Payment History</h3>
            {payments.length === 0 ? (
              <p style={{ color: C.textMuted, fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No payment history yet</p>
            ) : (
              payments.map(payment => (
                <div key={payment.id} style={{
                  backgroundColor: C.bgCard, borderRadius: "10px", padding: "14px", marginBottom: "8px",
                  border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: C.text, marginBottom: "2px" }}>
                      {payment.description || payment.type}
                    </div>
                    <div style={{ fontSize: "11px", color: C.textMuted }}>{formatDate(payment.date)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {payment.amount > 0 && (
                      <div style={{ fontSize: "15px", fontWeight: "600", color: C.success, marginBottom: "2px" }}>
                        {formatCurrency(payment.amount)}
                      </div>
                    )}
                    <span style={{
                      fontSize: "9px", fontWeight: "600", padding: "3px 8px", borderRadius: "10px", textTransform: "uppercase",
                      backgroundColor: `${getStatusColor(payment.status)}22`,
                      color: getStatusColor(payment.status),
                    }}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {renderNav()}
    </div>
  );
}

export default YourAccount;
