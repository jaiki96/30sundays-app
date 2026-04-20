import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { C, VS, allItineraries } from "../data";

// Version tag — subtle uppercase label
const versionBadgeStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.6px",
  color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 4,
  padding: "1px 6px",
  textTransform: "uppercase",
  lineHeight: 1.4,
};

// Glassmorphism vibe chip style
const vibeChipStyle = (v) => ({
  fontSize: 11,
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

// Compute version number (V1, V2…) within same dest + vibe group
const versionCache = {};
allItineraries.forEach(it => {
  const key = `${it.dest}-${it.vibe}`;
  if (!versionCache[key]) versionCache[key] = [];
  versionCache[key].push(it.id);
});
const getVersion = (it) => {
  const key = `${it.dest}-${it.vibe}`;
  const idx = (versionCache[key] || []).indexOf(it.id);
  return idx >= 0 ? `V${idx + 1}` : "V1";
};

// Format travel dates for display
const formatTravelDates = (travelDates, nights) => {
  if (!travelDates?.fromDate) return null;
  const from = new Date(travelDates.fromDate);
  const to = new Date(from);
  to.setDate(to.getDate() + (nights || 0));
  const opts = { day: "numeric", month: "short" };
  return `${from.toLocaleDateString("en-IN", opts)} – ${to.toLocaleDateString("en-IN", opts)}, ${to.getFullYear()}`;
};

export default function ItineraryCard({ it, vibe, fullWidth = false, travelDates, hideDest = false }) {
  const v = VS[vibe || it.vibe];
  const cardW = fullWidth ? "100%" : 272;
  const cardH = fullWidth ? 320 : 300;
  const hasDates = travelDates?.fromDate;

  return (
    <div style={{ flexShrink: 0 }}>
    <Link to={`/itinerary/${it.id}`} style={{ textDecoration: "none", color: "inherit", flexShrink: 0, display: "block" }}>
      <div style={{ width: cardW, minWidth: fullWidth ? undefined : cardW, borderRadius: 16, overflow: "hidden", position: "relative", height: cardH, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", cursor: "pointer" }}>
        <img src={it.img} alt={it.dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.82) 100%)" }} />

        {/* Vibe tag top-right — glassmorphism */}
        <span style={{ position: "absolute", top: 12, right: 12, ...vibeChipStyle(v) }}>{it.vibe}</span>

        {/* Veg badge top-left */}
        {it.veg && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(2,122,72,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>🌱 Veg Friendly</div>
        )}

        {/* Bottom overlay content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>
          {it.highlightResort && it.resort ? (
            <>
              <h3 style={{ fontSize: fullWidth ? 22 : 20, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.3px", lineHeight: 1.15 }}>{it.resort}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{it.dest}</span>
                <span style={{ fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.65)" }}>•</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>🌙 {it.nights}N</span>
                <span style={{ fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.65)" }}>•</span>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.5px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}>{getVersion(it)}</span>
              </div>
            </>
          ) : hideDest ? (
            <>
              <h3 style={{ fontSize: fullWidth ? 22 : 20, fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                {it.name || it.route.map(r => r.city).join(" · ")}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{it.dest}</span>
                <span style={{ fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.65)" }}>•</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>🌙 {it.nights}N</span>
                <span style={{ fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.65)" }}>•</span>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.5px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}>{getVersion(it)}</span>
                {it.resort && (<>
                  <span style={{ fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.65)" }}>•</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.p300 }}>★ {it.resort}</span>
                </>)}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
                <h3 style={{ fontSize: fullWidth ? 24 : 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{it.dest}</h3>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>·</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>🌙 {it.nights}N</span>
                <span style={versionBadgeStyle}>{getVersion(it)}</span>
              </div>
              {it.resort && <p style={{ fontSize: 14, color: C.p300, fontWeight: 600, margin: "0 0 4px" }}>★ {it.resort}</p>}
            </>
          )}

          {/* Bottom banner: dates (if available) or route */}
          {hasDates ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
              <Calendar size={11} color="rgba(255,255,255,0.75)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                {formatTravelDates(travelDates, it.nights)}
              </span>
            </div>
          ) : (
            <div className="hs" style={{ gap: 4, marginBottom: 10 }}>
              {(it.villas || it.route).map((r, i) => (
                <span key={i} style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {i > 0 && " · "}{r.n}N {r.type || r.city}
                </span>
              ))}
            </div>
          )}

          {/* Price + View link */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>From </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>₹{it.price}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>/pp</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>View</span>
              <ArrowRight size={15} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
}
