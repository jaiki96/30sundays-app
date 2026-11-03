import { useMemo } from "react";
import { Users, ChevronRight } from "lucide-react";
import { C } from "../data";
import { regionDetail } from "../data/regionData";

// ─── Popular among travellers ───
//
// A short rail after the last day in a city: things other travellers add
// there that this trip does not have yet. It is a suggestion, so it stays
// quiet. A cream band separates it from the plan, the card is one photo with
// three facts on it (name, price difference, View details), and nothing on
// it is pink: the page already has its one pink button, Save Itinerary.
//
// The whole card is the tap target, so it holds no button, only the named
// link. Tapping opens the same activity sheet the day detail uses.

const CREAM = "#FDF8F5";
const GOLD = "#FDA201";
const MAX = 4;

// We hold no real prices for add-ons yet, so each one gets a steady,
// believable difference per person, the same way day options price theirs.
// Seeded on the name, so a card shows the same number every visit.
function addPrice(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  // A walk, a market or a temple stop costs little more than a guide and a
  // car; a tour, a class or a boat costs a real ticket.
  const light = /walk|market|stroll|temple|beach|cycling|forest|sunrise|sunset|cafe/i.test(name);
  return light ? 400 + (h % 9) * 100 : 1200 + (h % 28) * 100; // ₹400-₹1,200, or ₹1,200-₹3,900
}
const inr = (n) => n.toLocaleString("en-IN");

export function popularFor(dest, city, exclude = []) {
  const r = regionDetail(dest, city);
  if (!r?.acts?.length) return [];
  const have = new Set(exclude.map((n) => String(n).toLowerCase()));
  return r.acts
    .filter((a) => a.img && !have.has(a.name.toLowerCase()))
    .slice(0, MAX)
    .map((a) => ({ ...a, add: addPrice(a.name) }));
}

export default function PopularActivities({ dest, city, exclude, onOpen }) {
  const acts = useMemo(() => popularFor(dest, city, exclude), [dest, city, exclude]);
  if (!acts.length) return null;

  return (
    <section
      aria-label={`Popular among travellers in ${city}`}
      style={{ margin: "4px -16px", background: CREAM, padding: "18px 0 20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", marginBottom: 12 }}>
        <Users size={18} color={GOLD} strokeWidth={2} aria-hidden />
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.head }}>
          Popular among travellers in {city}
        </p>
      </div>

      <div
        className="hide-scrollbar"
        style={{
          display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
          padding: "0 16px", scrollPaddingLeft: 16,
        }}
      >
        {acts.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onOpen(a)}
            aria-label={`${a.name}, ₹${inr(a.add)} more a person. View details`}
            style={{
              position: "relative", flex: "none", width: 200, height: 240, padding: 0,
              border: "none", borderRadius: 14, overflow: "hidden", cursor: "pointer",
              background: C.div, scrollSnapAlign: "start", textAlign: "left", fontFamily: "inherit",
            }}
          >
            <img src={a.img} alt="" loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span aria-hidden style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(24,30,76,0) 38%, rgba(24,30,76,0.86) 100%)",
            }} />
            <span style={{ position: "absolute", left: 14, right: 14, bottom: 14, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{
                fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.25,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>{a.name}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>+₹{inr(a.add)} a person</span>
              <span style={{
                marginTop: 6, display: "inline-flex", alignItems: "center", gap: 2,
                fontSize: 13, fontWeight: 600, color: "#fff",
              }}>
                View details <ChevronRight size={14} strokeWidth={2.2} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
