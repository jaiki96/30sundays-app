import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Users, ChevronRight } from "lucide-react";
import { C } from "../data";
import {
  getResortById, getResortsByTier, getDefaultCombo, getRoomSplitLabel,
  TIER_META, MEAL_INFO, resorts,
} from "../data/resortData";

// "Your Maldives quote": lists the shortlisted resort(s) from the wizard, and
// carries the chosen dates / nights / meal preference onto each resort page.
export default function MaldivesQuote() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const nights = Number(params.get("nights")) === 4 ? 4 : 3;
  const date = params.get("date") || "";
  const pax = Number(params.get("pax")) || 2;
  const tier = params.get("tier");
  const resortId = params.get("resort");
  const meal = params.get("meal") || "";

  // Shortlist: a pinned resort, else the tier's resorts, else everything.
  const shortlist = resortId
    ? [getResortById(resortId)].filter(Boolean)
    : tier ? getResortsByTier(tier) : resorts;

  const heading = resortId
    ? (shortlist[0]?.name || "Your resort")
    : tier ? `${TIER_META[tier]?.label || ""} resorts` : "Handpicked resorts";

  // Pass-through so the resort page opens on the same choices.
  const passQuery = [
    date && `date=${encodeURIComponent(date)}`,
    `pax=${pax}`,
    meal && `meal=${encodeURIComponent(meal)}`,
  ].filter(Boolean).join("&");

  const dateStr = date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
  const mealLabels = meal ? meal.split(",").map(k => MEAL_INFO[k]?.label).filter(Boolean).join(", ") : null;

  return (
    <div style={{ paddingBottom: 40, background: C.bg, minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: C.white, padding: "12px 14px 16px", borderBottom: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <button onClick={() => navigate(-1)} aria-label="Back" style={{ width: 38, height: 38, borderRadius: 12, border: "none", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={20} color={C.head} />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.p600, letterSpacing: ".4px" }}>YOUR MALDIVES QUOTE</p>
            <h1 style={{ margin: "1px 0 0", fontSize: 20, fontWeight: 800, color: C.head }}>{heading}</h1>
          </div>
        </div>

        {/* trip summary chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {dateStr && (
            <span style={sumChip}><Calendar size={13} color={C.sub} /> {dateStr}</span>
          )}
          <span style={sumChip}>🌙 {nights} nights</span>
          <span style={sumChip}><Users size={13} color={C.sub} /> {pax} travellers</span>
          {mealLabels && <span style={sumChip}>🍽️ {mealLabels}</span>}
        </div>
      </div>

      {/* Shortlist */}
      <div style={{ padding: "16px 16px 0" }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: C.sub }}>
          {shortlist.length > 1 ? "Tap a resort to customise and book." : "Tap to customise and book."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {shortlist.map(r => (
            <QuoteResortCard key={r.id} resort={r} nights={nights} query={passQuery} />
          ))}
        </div>
      </div>

      {/* Reassurance */}
      <p style={{ margin: "20px 16px 0", fontSize: 12, color: C.inact, textAlign: "center", lineHeight: 1.5 }}>
        Prices are per person and include taxes. A consultant confirms your final booking.
      </p>
    </div>
  );
}

// Full-width resort card for the quote list (image on top, details below).
function QuoteResortCard({ resort, nights, query }) {
  const combo = getDefaultCombo(resort, nights);
  const roomSplit = combo ? getRoomSplitLabel(combo) : "";
  const to = `/resort/${resort.id}?nights=${nights}${query ? `&${query}` : ""}`;

  return (
    <Link to={to} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ borderRadius: 16, overflow: "hidden", background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ position: "relative", height: 160 }}>
          <img src={resort.hero_image} alt={resort.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 55%, rgba(0,0,0,0.28))" }} />
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            🌙 {nights}N
          </div>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resort.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{resort.star_rating}</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: C.inact, margin: "2px 0 0" }}>
            {resort.atoll} · {resort.transfer_type.charAt(0).toUpperCase() + resort.transfer_type.slice(1)}
          </p>
          {roomSplit && <p style={{ fontSize: 12, color: C.sub, margin: "8px 0 0", fontWeight: 500 }}>{roomSplit}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            {combo?.total_price ? (
              <div>
                <span style={{ fontSize: 11, color: C.inact }}>From </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: C.head }}>₹{combo.total_price}</span>
                <span style={{ fontSize: 11, color: C.inact }}>/pp</span>
              </div>
            ) : <span style={{ fontSize: 12, color: C.inact }}>Price on request</span>}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 13, fontWeight: 700, color: C.p600 }}>
              Customise <ChevronRight size={16} color={C.p600} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const sumChip = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: C.head, background: C.bg, border: `1px solid ${C.div}`, borderRadius: 20, padding: "6px 11px" };
