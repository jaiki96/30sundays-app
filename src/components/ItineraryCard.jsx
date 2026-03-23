import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { C, VS } from "../data";

// Glassmorphism vibe chip style
const vibeChipStyle = (v) => ({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.3px",
  color: "#fff",
  background: `${v.text}CC`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: "4px 12px",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  textTransform: "none",
});

export default function ItineraryCard({ it, vibe, variant = "carousel" }) {
  const v = VS[vibe || it.vibe];
  const isListing = variant === "listing";
  const cardW = isListing ? "100%" : 272;
  const cardH = isListing ? "auto" : 280;

  if (isListing) {
    return (
      <Link to={`/itinerary/${it.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", background: C.white, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ position: "relative", height: 185 }}>
            <img src={it.img} alt={it.dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))" }} />
            {/* Vibe tag top-right — glassmorphism */}
            <span style={{ position: "absolute", top: 12, right: 12, ...vibeChipStyle(v) }}>{it.vibe}</span>
            {/* Veg badge top-left */}
            {it.veg && <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(2,122,72,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 600, color: "#fff" }}>🌱 Veg</div>}
          </div>
          <div style={{ padding: "12px 14px" }}>
            {/* Dest name · nights */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.head }}>{it.dest}</span>
              <span style={{ fontSize: 12, color: C.inact }}>·</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>🌙 {it.nights}N</span>
            </div>
            {/* Route row */}
            <div style={{ fontSize: 12, fontWeight: 500, color: C.sub, marginBottom: 8 }}>
              {it.route.map(r => `${r.n}N ${r.city}`).join(" · ")}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 11, color: C.sub }}>From </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.head }}>₹{it.price}</span>
                <span style={{ fontSize: 11, color: C.sub }}>/pp</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.p600 }}>View</span>
                <ArrowRight size={13} color={C.p600} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Full-bleed carousel card
  return (
    <Link to={`/itinerary/${it.id}`} style={{ textDecoration: "none", color: "inherit", flexShrink: 0 }}>
      <div style={{ width: cardW, minWidth: cardW, borderRadius: 16, overflow: "hidden", position: "relative", height: cardH, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", cursor: "pointer" }}>
        <img src={it.img} alt={it.dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.82) 100%)" }} />

        {/* Vibe tag top-right — glassmorphism */}
        <span style={{ position: "absolute", top: 12, right: 12, ...vibeChipStyle(v) }}>{it.vibe}</span>

        {/* Veg badge top-left */}
        {it.veg && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(2,122,72,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>🌱 Veg Friendly</div>
        )}

        {/* Bottom overlay content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>
          {/* Dest name · nights on same line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{it.dest}</h3>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>🌙 {it.nights}N</span>
          </div>

          {it.resort && <p style={{ fontSize: 12, color: C.p300, fontWeight: 600, margin: "0 0 4px" }}>★ {it.resort}</p>}

          {/* Route chips — full width row, bolder */}
          <div className="hs" style={{ gap: 4, marginBottom: 10 }}>
            {it.route.map((r, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", flexShrink: 0 }}>
                {i > 0 && " · "}{r.n}N {r.city}
              </span>
            ))}
          </div>

          {/* Price + View link */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>From </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>₹{it.price}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>/pp</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>View</span>
              <ArrowRight size={14} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
