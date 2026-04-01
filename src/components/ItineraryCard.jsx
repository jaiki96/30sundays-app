import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import { C, VS, allItineraries } from "../data";
import { getUpgradeInfo } from "../data/upgradeData";

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

export default function ItineraryCard({ it, vibe, fullWidth = false, travelDates, onUpgradeClick }) {
  const v = VS[vibe || it.vibe];
  const cardW = fullWidth ? "100%" : 272;
  const cardH = fullWidth ? 300 : 280;
  const hasDates = travelDates?.fromDate;
  const { upgradeCount } = getUpgradeInfo(it.id, it.days);

  return (
    <div style={{ flexShrink: 0 }}>
    <Link to={`/itinerary/${it.id}`} style={{ textDecoration: "none", color: "inherit", flexShrink: 0, display: "block" }}>
      <div style={{ width: cardW, minWidth: fullWidth ? undefined : cardW, borderRadius: upgradeCount > 0 ? "16px 16px 0 0" : 16, overflow: "hidden", position: "relative", height: cardH, boxShadow: upgradeCount > 0 ? "none" : "0 4px 20px rgba(0,0,0,0.12)", cursor: "pointer" }}>
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
          {/* Dest name · nights · version on same line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 4px" }}>
            <h3 style={{ fontSize: fullWidth ? 24 : 22, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{it.dest}</h3>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>·</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>🌙 {it.nights}N</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginLeft: -2 }}>{getVersion(it)}</span>
          </div>

          {it.resort && <p style={{ fontSize: 12, color: C.p300, fontWeight: 600, margin: "0 0 4px" }}>★ {it.resort}</p>}

          {/* Bottom banner: dates (if available) or route */}
          {hasDates ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
              <Calendar size={11} color="rgba(255,255,255,0.75)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                {formatTravelDates(travelDates, it.nights)}
              </span>
            </div>
          ) : (
            <div className="hs" style={{ gap: 4, marginBottom: 10 }}>
              {it.route.map((r, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {i > 0 && " · "}{r.n}N {r.city}
                </span>
              ))}
            </div>
          )}

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
    {/* upgrade nudge pill */}
    {upgradeCount > 0 && (
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpgradeClick?.(it); }}
        style={{
          marginTop: -1, borderRadius: "0 0 16px 16px",
          background: "linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 50%, #FFF3D6 100%)",
          borderTop: "none",
          border: "1px solid #E8D5A3",
          borderTopColor: "transparent",
          padding: "8px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} color="#B8860B" strokeWidth={2.2} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6B4F1D", lineHeight: "16px" }}>
            {upgradeCount} hotel upgrade{upgradeCount > 1 ? "s" : ""} available
          </span>
        </div>
        <ArrowUpRight size={14} color="#8B7340" strokeWidth={2} />
      </div>
    )}
    </div>
  );
}
