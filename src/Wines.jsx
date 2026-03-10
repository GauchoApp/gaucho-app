import React from "react";
import { C, serif, sans } from "./constants";
import { CAROUSEL_WINES, WINES } from "./data";

export default function Wines({ renderHeader, renderNav, winesCarouselIdx }) {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: sans, maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      {renderHeader()}

      <div style={{ flex: 1, overflow: "auto", marginBottom: "70px" }}>
        <div style={{ maxWidth: "430px", margin: "0 auto" }}>
          <div style={{ position: "relative", height: "300px", backgroundColor: C.bgAlt, overflow: "hidden", marginBottom: "16px" }}>
            <img src={CAROUSEL_WINES[winesCarouselIdx]} alt="Algodon Fine Wines" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "opacity 0.5s" }} onError={(e) => { e.target.style.backgroundColor = C.bgCard2; }} />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <h2 style={{ fontFamily: serif, fontSize: "32px", letterSpacing: "4px", margin: 0, color: C.text }}>ALGODON</h2>
              <p style={{ fontSize: "14px", letterSpacing: "3px", margin: "8px 0 0 0", color: C.cyan }}>FINE WINES</p>
              <p style={{ fontSize: "11px", letterSpacing: "2px", margin: "4px 0 0 0", color: C.textMuted }}>SAN RAFAEL, MENDOZA</p>
            </div>
            <div style={{ position: "absolute", bottom: "12px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6px" }}>
              {CAROUSEL_WINES.map((_, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === winesCarouselIdx ? C.cyan : C.border }} />
              ))}
            </div>
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            <p style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6", marginBottom: "16px" }}>
              Algodon Fine Wines represents a legacy of winemaking excellence from vineyards first planted in 1946 in San Rafael, Mendoza. Hand-harvested and microvinified, each bottle captures the unique terroir of our 4,100-acre estate at the foothills of the Andes. From our acclaimed PIMA icon wine to our signature Malbec and reserve blends, every vintage tells the story of Argentine passion and Old World tradition.
            </p>

            <h3 style={{ fontSize: "16px", color: C.text, marginBottom: "12px", fontFamily: serif }}>Wine Collection</h3>
            <div style={{ display: "flex", gap: "12px", overflow: "auto", paddingBottom: "8px" }}>
              {WINES.map((wine, idx) => (
                <a
                  key={idx}
                  href={wine.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flexShrink: 0,
                    width: "160px",
                    backgroundColor: C.bgCard,
                    borderRadius: "6px",
                    border: `1px solid ${C.border}`,
                    padding: "12px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ height: "140px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.bgCard2, borderRadius: "4px", overflow: "hidden" }}>
                    {wine.img ? (
                      <img src={wine.img} alt={wine.name} style={{ height: "100%", objectFit: "contain", padding: "4px" }} onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = '<span style="font-size:40px">🍷</span>'; }} />
                    ) : (
                      <span style={{ fontSize: "40px" }}>🍷</span>
                    )}
                  </div>
                  <p style={{ fontSize: "10px", color: C.textMuted, margin: "0 0 4px 0", fontWeight: "600", textTransform: "uppercase" }}>{wine.type}</p>
                  <p style={{ fontSize: "12px", color: C.text, margin: 0, fontWeight: "600", lineHeight: "1.4" }}>{wine.name}</p>
                  {wine.price && <p style={{ fontSize: "12px", color: C.cyan, margin: "0 0 4px 0", fontWeight: "600" }}>{wine.price}</p>}
                  <p style={{ fontSize: "10px", color: C.cyan, margin: 0 }}>Buy at algodonfinewines.com →</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {renderNav()}
    </div>
  );
}
