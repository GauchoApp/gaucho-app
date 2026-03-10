import React from "react";
import { C, serif, sans, handleStripePayment } from "./constants";
import { CAROUSEL_AWE, LOTS, MAP_COORDINATES, VILLAGE_TO_MAP } from "./data";

export default function WineEstate({
  renderHeader,
  renderNav,
  carouselIndex,
  selectedMapTab,
  setSelectedMapTab,
  mapFilter,
  setMapFilter,
  selectedLot,
  setSelectedLot,
  allLots,
  setAllLots,
  calcMonthlyPayment,
  financeRate,
  showInquiryForm,
  setShowInquiryForm,
  inquiryForm,
  setInquiryForm,
  user,
  makeRequest,
  setRequests,
  sendManagerEmail,
  setEmailSent,
}) {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: sans, maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      {renderHeader()}

      <div style={{ flex: 1, overflow: "auto", marginBottom: "70px" }}>
        <div style={{ maxWidth: "430px", margin: "0 auto" }}>
          <div style={{ position: "relative", height: "300px", backgroundColor: C.bgAlt, overflow: "hidden" }}>
            <img src={CAROUSEL_AWE[carouselIndex]} alt="carousel" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} onError={(e) => { e.target.style.backgroundColor = C.bgCard2; }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
              <h2 style={{ fontFamily: serif, fontSize: "28px", letterSpacing: "2px", margin: 0, color: C.text, textAlign: "center" }}>ALGODON</h2>
              <p style={{ fontSize: "13px", letterSpacing: "2px", margin: "8px 0 0 0", color: C.cyan }}>WINE ESTATES</p>
            </div>
            <div style={{ position: "absolute", bottom: "12px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6px" }}>
              {CAROUSEL_AWE.map((_, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === carouselIndex ? C.cyan : C.border }} />
              ))}
            </div>
          </div>

          {/* Elevate Your Lifestyle */}
          <div style={{ padding: "20px 16px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "20px", color: C.cyan, margin: "0 0 4px 0" }}>Elevate Your Lifestyle</p>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: C.textMuted, margin: "0 0 16px 0", textTransform: "uppercase" }}>Luxury Homes, Hospitality & Fine Wines</p>
            <div style={{ display: "flex", justifyContent: "space-around", gap: "4px" }}>
              {[
                { icon: "⛰", text: "4,100 ACRES" },
                { icon: "⭐", text: "LUXURY HOTEL" },
                { icon: "⛳", text: "9-HOLE GOLF" },
                { icon: "🎾", text: "7 TENNIS COURTS" },
                { icon: "🏡", text: "VINEYARD HOMES" },
              ].map((item, i) => (
                <div key={i} style={{ flex: "0 0 18%", textAlign: "center" }}>
                  <p style={{ fontSize: "18px", margin: "0 0 4px 0" }}>{item.icon}</p>
                  <p style={{ fontSize: "8px", color: C.textMuted, margin: 0, lineHeight: "1.3", letterSpacing: "0.5px" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "16px", color: C.cyan, marginBottom: "10px", fontFamily: serif }}>Interactive Estate Map</h3>

            {/* Phase 1 Overview button — own row */}
            <button onClick={() => { setSelectedMapTab("phase1"); setMapFilter("all"); }} style={{ width: "100%", padding: "8px", marginBottom: "6px", backgroundColor: selectedMapTab === "phase1" ? C.cyan : C.bgCard, color: selectedMapTab === "phase1" ? C.bg : C.cyan, border: `1px solid ${selectedMapTab === "phase1" ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>Phase 1 — Master Plan Overview</button>

            {/* Village tab navigation */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px", overflow: "auto", paddingBottom: "2px" }}>
              {[
                { id: "wine-golf", label: "Wine & Golf" },
                { id: "west-vineyard", label: "West Vineyard" },
                { id: "desert-vineyard", label: "Desert & Vine" },
                { id: "vineyard-estate", label: "Vineyard Est." },
              ].map(tab => (
                <button key={tab.id} onClick={() => { setSelectedMapTab(tab.id); setMapFilter("all"); }} style={{ flex: 1, padding: "6px 6px", backgroundColor: selectedMapTab === tab.id ? C.cyan : C.bgCard, color: selectedMapTab === tab.id ? C.bg : C.cyan, border: `1px solid ${selectedMapTab === tab.id ? C.cyan : C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "10px", fontWeight: "600", whiteSpace: "nowrap" }}>{tab.label}</button>
              ))}
            </div>

            {/* Filter buttons — shown for ALL tabs including Phase 1 */}
            {(() => {
              const villageMap = { "wine-golf": "Wine & Golf", "west-vineyard": "Garden Estate", "desert-vineyard": "Desert & Vineyard", "vineyard-estate": "Vineyard Estate" };
              const getCount = (filter) => {
                if (selectedMapTab === "phase1") {
                  if (filter === "all") return allLots.length;
                  return allLots.filter(l => l.status === filter).length;
                }
                const village = villageMap[selectedMapTab];
                if (filter === "all") return allLots.filter(l => l.village === village).length;
                return allLots.filter(l => l.village === village && l.status === filter).length;
              };
              return (
                <div style={{ display: "flex", gap: "4px", marginBottom: "10px" }}>
                  {["all", "available", "sold"].map(f => {
                    const count = getCount(f);
                    const isActive = mapFilter === f;
                    const bg = isActive ? (f === "sold" ? C.danger : f === "available" ? C.success : C.cyan) : C.bgCard;
                    const fg = isActive ? (f === "all" ? C.bg : "#fff") : C.textMuted;
                    const bdr = isActive ? bg : C.border;
                    return (
                      <button key={f} onClick={() => setMapFilter(f)} style={{ flex: 1, padding: "7px 4px", backgroundColor: bg, color: fg, border: `1px solid ${bdr}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px", fontWeight: "600", textTransform: "capitalize", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                        {f === "all" ? "All" : f === "available" ? "Available" : "Sold"}
                        <span style={{ backgroundColor: isActive ? "rgba(0,0,0,0.2)" : C.bgCard2, color: isActive ? fg : C.textDim, fontSize: "10px", fontWeight: "700", padding: "1px 5px", borderRadius: "8px", minWidth: "18px", textAlign: "center" }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Village info strip — village tabs only */}
            {selectedMapTab !== "phase1" && (
              <div style={{ backgroundColor: C.cyanBg, padding: "8px 12px", borderRadius: "6px", marginBottom: "8px", border: `1px solid ${C.cyan}30` }}>
                <p style={{ margin: 0, fontSize: "11px", color: C.cyan, fontWeight: "600", fontFamily: serif }}>
                  {(() => {
                    const villageMap = { "wine-golf": "Wine & Golf", "west-vineyard": "Garden Estate", "desert-vineyard": "Desert & Vineyard", "vineyard-estate": "Vineyard Estate" };
                    const village = villageMap[selectedMapTab];
                    const villageLots = allLots.filter(l => l.village === village && l.acres);
                    if (villageLots.length === 0) return `${village} — Estate lots`;
                    const minAcres = Math.min(...villageLots.map(l => l.acres));
                    const maxAcres = Math.max(...villageLots.map(l => l.acres));
                    return `${village} · ${minAcres.toFixed(1)}–${maxAcres.toFixed(1)} acres`;
                  })()}
                </p>
              </div>
            )}

            {/* Map image with lot pins */}
            <div style={{ position: "relative", backgroundColor: C.bgCard, borderRadius: "6px", overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: selectedMapTab === "phase1" ? "8px" : "12px" }}>
              <div style={{ paddingBottom: "129%", position: "relative" }}>
                <img
                  src={
                    selectedMapTab === "phase1" ? "/images/maps/phase1-map.jpg" :
                    selectedMapTab === "west-vineyard" ? "/images/maps/west-vineyard.jpg" :
                    selectedMapTab === "desert-vineyard" ? "/images/maps/phase1-map.jpg" :
                    selectedMapTab === "vineyard-estate" ? "/images/maps/phase1-map.jpg" :
                    "/images/maps/wine-golf-se.jpg"
                  }
                  alt="map"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.backgroundColor = C.bgCard2; }}
                />

                {/* Map pins removed — lots listed below the map instead */}
              </div>
            </div>

            {/* Lot listing — alphabetically sorted, filtered by status */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                {allLots.filter(lot => {
                  if (selectedMapTab === "phase1") return true;
                  const villageMap = { "wine-golf": "Wine & Golf", "west-vineyard": "Garden Estate", "desert-vineyard": "Desert & Vineyard", "vineyard-estate": "Vineyard Estate" };
                  if (lot.village !== villageMap[selectedMapTab]) return false;
                  return true;
                }).filter(lot => mapFilter === "all" || lot.status === mapFilter)
                  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
                  .map(lot => (
                  <div key={lot.id} onClick={() => setSelectedLot(lot.id)} style={{ backgroundColor: C.bgCard, padding: "10px 12px", borderRadius: "6px", border: `1px solid ${C.border}`, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <p style={{ margin: 0, color: C.cyan, fontSize: "13px", fontWeight: "700" }}>Lot {lot.id}</p>
                          <span style={{ fontSize: "8px", fontWeight: "600", color: lot.status === "available" ? C.success : lot.status === "sold" ? C.danger : lot.status === "reserved" ? C.pending : C.textMuted, textTransform: "uppercase", letterSpacing: "0.3px" }}>{lot.status}</span>
                        </div>
                        <p style={{ margin: "2px 0 0 0", color: C.textMuted, fontSize: "10px" }}>{selectedMapTab === "phase1" ? `${lot.village} · ${lot.desc}` : lot.desc}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {lot.total ? (
                          <>
                            <p style={{ margin: 0, color: C.text, fontSize: "12px", fontWeight: "600" }}>${lot.total.toLocaleString()}</p>
                            <p style={{ margin: "1px 0 0 0", color: C.textDim, fontSize: "10px" }}>{lot.acres}ac</p>
                          </>
                        ) : (
                          <p style={{ margin: 0, color: C.pending, fontSize: "10px", fontWeight: "600" }}>Inquire</p>
                        )}
                      </div>
                    </div>
                    {!!(lot.total && lot.financeYears) && (
                      <p style={{ margin: "4px 0 0 0", fontSize: "9px", color: C.textDim, borderTop: `1px solid ${C.border}`, paddingTop: "4px" }}>Finance {lot.financeYears}yr · ${(lot.downpayment || 0).toLocaleString()} down · <span style={{ color: C.cyan, fontWeight: "600" }}>${calcMonthlyPayment(lot.total, lot.downpayment, lot.financeYears, financeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span></p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedLot && (
              <div style={{ position: "fixed", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "430px", backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "flex-end", zIndex: 1100 }} onClick={() => { setSelectedLot(null); setShowInquiryForm(false); }}>
                <div style={{ backgroundColor: C.bgCard, width: "100%", maxWidth: "430px", borderRadius: "14px 14px 0 0", padding: "14px 16px 90px", border: `1px solid ${C.border}`, borderBottom: "none", maxHeight: "70vh", overflow: "auto", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const lot = allLots.find(l => l.id === selectedLot) || LOTS.find(l => l.id === selectedLot);
                    return lot ? (
                      <div>
                        {/* Drag handle */}
                        <div style={{ width: "36px", height: "4px", backgroundColor: C.borderLight, borderRadius: "2px", margin: "0 auto 10px" }} />

                        {/* Header row: Lot ID + Status + Close */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h3 style={{ fontSize: "18px", color: C.cyan, margin: 0, fontFamily: serif }}>Lot {lot.id}</h3>
                            <span style={{ fontSize: "10px", fontWeight: "600", color: lot.status === "available" ? C.success : lot.status === "sold" ? C.danger : lot.status === "reserved" ? C.pending : C.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{lot.status}</span>
                          </div>
                          <button onClick={() => { setSelectedLot(null); setShowInquiryForm(false); }} style={{ backgroundColor: "transparent", border: "none", color: C.textDim, fontSize: "20px", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>×</button>
                        </div>

                        {/* Village + Description */}
                        <p style={{ color: C.textMuted, fontSize: "11px", margin: "0 0 4px 0" }}>{lot.village}</p>
                        <p style={{ color: C.text, fontSize: "12px", margin: "0 0 10px 0", lineHeight: "1.4" }}>{lot.desc}</p>

                        {/* Stats row - compact inline */}
                        {lot.acres !== null && (
                          <div style={{ display: "flex", gap: "1px", marginBottom: "10px", borderRadius: "6px", overflow: "hidden" }}>
                            <div style={{ flex: 1, backgroundColor: C.bgCard2, padding: "8px 6px", textAlign: "center" }}>
                              <p style={{ color: C.textDim, fontSize: "9px", margin: 0, textTransform: "uppercase", letterSpacing: "0.3px" }}>Size</p>
                              <p style={{ color: C.cyan, fontSize: "13px", fontWeight: "700", margin: "2px 0 0" }}>{lot.acres}ac</p>
                              <p style={{ color: C.textDim, fontSize: "9px", margin: 0 }}>{lot.m2?.toLocaleString()}m²</p>
                            </div>
                            <div style={{ flex: 1, backgroundColor: C.bgCard2, padding: "8px 6px", textAlign: "center" }}>
                              <p style={{ color: C.textDim, fontSize: "9px", margin: 0, textTransform: "uppercase", letterSpacing: "0.3px" }}>Price</p>
                              <p style={{ color: C.cyan, fontSize: "13px", fontWeight: "700", margin: "2px 0 0" }}>${lot.total?.toLocaleString()}</p>
                            </div>
                            <div style={{ flex: 1, backgroundColor: C.bgCard2, padding: "8px 6px", textAlign: "center" }}>
                              <p style={{ color: C.textDim, fontSize: "9px", margin: 0, textTransform: "uppercase", letterSpacing: "0.3px" }}>Maint/mo</p>
                              <p style={{ color: C.cyan, fontSize: "13px", fontWeight: "700", margin: "2px 0 0" }}>${lot.maintenance?.toFixed(0)}</p>
                            </div>
                          </div>
                        )}

                        {lot.status === "inquire" && <p style={{ color: C.pending, fontSize: "11px", marginBottom: "8px", fontWeight: "600" }}>Please contact us for pricing</p>}

                        {/* Financing - compact */}
                        {!!(lot.total && lot.financeYears) && (
                          <div style={{ backgroundColor: `${C.cyan}08`, border: `1px solid ${C.cyan}25`, borderRadius: "6px", padding: "8px 10px", marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <p style={{ margin: 0, fontSize: "9px", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.3px" }}>Financing</p>
                                <p style={{ margin: "1px 0 0", fontSize: "11px", color: C.textMuted }}>{lot.financeYears}yr · ${(lot.downpayment || 0).toLocaleString()} down · {financeRate}%</p>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <p style={{ margin: 0, fontSize: "9px", color: C.textDim, textTransform: "uppercase", letterSpacing: "0.3px" }}>Monthly</p>
                                <p style={{ margin: "1px 0 0", fontSize: "15px", color: C.cyan, fontWeight: "700" }}>${calcMonthlyPayment(lot.total, lot.downpayment, lot.financeYears, financeRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inquiry button / form */}
                        {!showInquiryForm ? (
                          <div>
                            {lot.status === "available" && (
                              <button onClick={(e) => { e.stopPropagation(); handleStripePayment(100000, `Reserve Lot ${lot.id} — ${lot.village}`, () => { setAllLots(prev => prev.map(l => l.id === lot.id ? { ...l, status: "reserved" } : l)); const req = makeRequest("Lot Reservation", `Lot ${lot.id} (${lot.village}) — $1,000 deposit paid`, "Algodon Wine Estates"); setRequests(prev => [...prev, req]); sendManagerEmail(req); alert("Lot " + lot.id + " has been reserved! Our team will contact you shortly."); setSelectedLot(null); }); }} style={{ display: "block", width: "100%", padding: "10px", backgroundColor: C.success, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", textAlign: "center", marginBottom: "6px" }}>
                                Reserve This Lot — $1,000 Deposit
                              </button>
                            )}
                            <button onClick={() => { setShowInquiryForm(true); if (user) { setInquiryForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", message: "" }); } }} style={{ display: "block", width: "100%", padding: "10px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "13px", textAlign: "center" }}>
                              Inquire About This Lot
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: "11px", color: C.cyan, margin: "0 0 8px 0", fontWeight: "600", fontFamily: serif }}>Inquiry — Lot {lot.id}</p>
                            {!user && (
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
                                <input type="text" placeholder="Name *" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} style={{ width: "100%", padding: "7px 8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                                <input type="email" placeholder="Email *" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} style={{ width: "100%", padding: "7px 8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box" }} />
                                <input type="tel" placeholder="Phone *" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} style={{ width: "100%", padding: "7px 8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box", gridColumn: "1 / -1" }} />
                              </div>
                            )}
                            {user && <p style={{ fontSize: "10px", color: C.textMuted, margin: "0 0 6px 0" }}>Sending as {user.name}</p>}
                            <textarea placeholder="Your message..." value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} style={{ width: "100%", padding: "7px 8px", backgroundColor: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: "4px", color: C.text, fontFamily: sans, fontSize: "11px", boxSizing: "border-box", minHeight: "48px", resize: "vertical", marginBottom: "8px" }} />
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button onClick={() => {
                                const name = user ? user.name : inquiryForm.name;
                                const email = user ? user.email : inquiryForm.email;
                                if (!name || !email) { alert("Please provide your name and email"); return; }
                                const inquiryData = { lot: lot.id, village: lot.village, acres: lot.acres, price: lot.total, name, email, phone: user?.phone || inquiryForm.phone, message: inquiryForm.message, date: new Date().toLocaleDateString() };
                                console.log("[EMAIL] Lot Inquiry → info@algodonwineestates.com", inquiryData);
                                sendManagerEmail({ guestName: name, reservationNumber: "N/A", type: "Lot Inquiry", details: `Lot ${lot.id} (${lot.village}) — ${inquiryForm.message || "General inquiry"}`, property: "Algodon Wine Estates", date: new Date().toLocaleDateString() });
                                setEmailSent(`Inquiry sent for Lot ${lot.id} — our team will contact you shortly`);
                                setTimeout(() => setEmailSent(null), 4000);
                                setShowInquiryForm(false);
                                setInquiryForm({ name: "", email: "", phone: "", message: "" });
                                setSelectedLot(null);
                                alert("Thank you! Your inquiry about Lot " + lot.id + " has been sent. Our team will reach out to you shortly.");
                              }} style={{ flex: 1, padding: "9px", backgroundColor: C.cyan, color: C.bg, border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "700", fontFamily: sans, fontSize: "12px" }}>
                                Send
                              </button>
                              <button onClick={() => setShowInquiryForm(false)} style={{ padding: "9px 14px", backgroundColor: "transparent", color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: "4px", cursor: "pointer", fontFamily: sans, fontSize: "11px" }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            <h3 style={{ fontSize: "16px", color: C.cyan, marginBottom: "12px", fontFamily: serif }}>Estate Home Designs</h3>
            <div style={{ display: "flex", gap: "12px", overflow: "auto", paddingBottom: "8px" }}>
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} style={{ flexShrink: 0, width: "280px", height: "200px", backgroundColor: C.bgCard, borderRadius: "6px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img
                    src={`/images/renders/Model%201%20stone%20(${num}).jpg`}
                    alt={`Estate Design ${num}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {renderNav()}
    </div>
  );
}
