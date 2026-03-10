import React from "react";
import { C, serif, sans } from "./constants";
import { CAROUSEL_GAUCHO, GAUCHO_PRODUCTS } from "./data";

export default function GauchoBA({ renderHeader, renderNav, gauchoCarouselIdx }) {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: sans, maxWidth: "430px", margin: "0 auto", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      {renderHeader()}

      <div style={{ flex: 1, overflow: "auto", marginBottom: "70px" }}>
        <div style={{ maxWidth: "430px", margin: "0 auto" }}>
          <div style={{ position: "relative", height: "300px", backgroundColor: C.bgAlt, overflow: "hidden", marginBottom: "16px" }}>
            <img src={CAROUSEL_GAUCHO[gauchoCarouselIdx]} alt="Gaucho Buenos Aires" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, transition: "opacity 0.5s" }} onError={(e) => { e.target.style.backgroundColor = C.bgCard2; }} />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <h2 style={{ fontFamily: serif, fontSize: "32px", letterSpacing: "4px", margin: 0, color: C.text }}>GAUCHO</h2>
              <p style={{ fontSize: "14px", letterSpacing: "3px", margin: "8px 0 0 0", color: C.cyan }}>BUENOS AIRES</p>
            </div>
            <div style={{ position: "absolute", bottom: "12px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6px" }}>
              {CAROUSEL_GAUCHO.map((_, i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === gauchoCarouselIdx ? C.cyan : C.border }} />
              ))}
            </div>
          </div>

          <div style={{ padding: "0 16px 16px" }}>
            <p style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6", marginBottom: "16px" }}>
              Gaucho — Buenos Aires is the iconic luxury lifestyle brand rooted in Argentine heritage. From the finest hand-stitched leather goods to elegantly crafted apparel, every piece embodies the spirit of the Pampas and the sophistication of Buenos Aires. Our Heartbeat collection introduces signature designs that blend traditional gaucho craftsmanship with contemporary style.
            </p>

            <h3 style={{ fontSize: "16px", color: C.cyan, marginBottom: "12px", fontFamily: serif }}>Explore the Collection</h3>
            <p style={{ fontSize: "12px", color: C.textMuted, marginBottom: "16px" }}>
              <a href="https://www.gaucho.com" target="_blank" rel="noopener noreferrer" style={{ color: C.cyan, textDecoration: "none", fontWeight: "600" }}>Visit gaucho.com →</a>
            </p>

            <h3 style={{ fontSize: "16px", color: C.text, marginBottom: "12px", fontFamily: serif }}>Featured Products</h3>
            <div style={{ display: "flex", gap: "12px", overflow: "auto", paddingBottom: "8px" }}>
              {GAUCHO_PRODUCTS.map((product, idx) => {
                const emojiMap = {
                  Clothing: "👔",
                  Bags: "👜",
                  Accessories: "🕶️",
                  Home: "🏠",
                };
                return (
                  <a
                    key={idx}
                    href={product.url}
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
                    <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.bgCard2, borderRadius: "4px", overflow: "hidden" }}>
                      {product.img ? (
                        <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<span style="font-size:40px">${emojiMap[product.cat] || "🎁"}</span>`; }} />
                      ) : (
                        <span style={{ fontSize: "40px" }}>{emojiMap[product.cat] || "🎁"}</span>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", color: C.textMuted, margin: "0 0 4px 0", fontWeight: "600", textTransform: "uppercase" }}>{product.cat}</p>
                    <p style={{ fontSize: "12px", color: C.text, margin: 0, fontWeight: "600", lineHeight: "1.4" }}>{product.name}</p>
                    {product.price && <p style={{ fontSize: "12px", color: C.cyan, margin: "0 0 4px 0", fontWeight: "600" }}>{product.price}</p>}
                    <p style={{ fontSize: "10px", color: C.cyan, margin: 0 }}>View on gaucho.com →</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {renderNav()}
    </div>
  );
}
