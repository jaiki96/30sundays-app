import { useSearchParams } from "react-router-dom";
import { BedDouble, Compass, Car, Plane, ChevronRight, Info } from "lucide-react";
import { C } from "../data";
import { BOOKED_TRIPS } from "../data/bookedTrips";

// ─── The header on somebody else's trip: the lab ───
//
// Five ways to lay out the band under the photo on a trip that is being
// read rather than built. Two things live in it and they are not the same
// kind of thing: where the trip went and what was in it, which is the trip,
// and what it cost, which is the reason anybody is reading.
//
// What each one is trying to settle:
//
//   separation    the cost and the trip are two subjects. A hairline, a
//                 change of ground, or two cards. How far apart do they
//                 need to be before they stop reading as one list
//   approximate   the figure is a guide, not a quote, and it has to say so
//                 without a sentence. A kicker, a symbol, a trailing word
//                 or an icon. One per version, so all five can be seen
//   room          the route is the longest thing in the band, and whatever
//                 the price takes, it does not have
//
// What is deliberately not in any of them: the dates they travelled and
// how many of them there were. Somebody else's trip, read by a stranger.
//
// ?id=6 for a different trip. Live at: /read-header-lab

// Icons in slate, not pink. Four pink glyphs in a row made the row read as
// four small buttons, and the only pink thing in the band should be the one
// thing that can be pressed.
const ICON = "#667085";

function Bits({ bits, size = 12, gap = 9 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap, flexWrap: "wrap" }}>
      {bits.map(({ Icon, n, label }) => (
        <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 3.5 }}>
          <Icon size={size} color={ICON} strokeWidth={2.2} />
          <span style={{ fontSize: size - 0.5, fontWeight: 700, color: C.head }}>{n}</span>
          <span style={{ fontSize: size - 1, color: C.sub }}>{label}</span>
        </span>
      ))}
    </div>
  );
}

const routeLine = (days, size = 12) => (
  <p style={{
    margin: 0, fontSize: size, fontWeight: 700, color: C.head,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  }}>
    {days.map((d) => `${d.city} ${d.n}N`).join(" · ")}
  </p>
);

const card = {
  margin: "0 16px", border: `1px solid ${C.div}`, borderRadius: 14,
  background: C.white, overflow: "hidden",
};
const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// ─── A. Side by side, hairline ───
// What is live now. The cheapest separation there is, and the one that
// costs the route the most room.
function SideBySide({ t }) {
  return (
    <div style={{ ...card, display: "flex", alignItems: "stretch" }}>
      <div style={{ flex: 1, minWidth: 0, padding: "10px 11px" }}>
        {routeLine(t.days)}
        <div style={{ marginTop: 8 }}><Bits bits={t.bits} /></div>
      </div>
      <button style={{
        width: 118, flexShrink: 0, background: C.white,
        padding: "10px 9px 10px 11px", border: "none", borderLeft: `1px solid ${C.div}`,
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: C.p600 }}>Approx</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{money(t.pp)}</span>
          <span style={{ display: "block", marginTop: 2, fontSize: 10.5, color: C.sub }}>per person</span>
        </span>
        <ChevronRight size={16} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── B. Two bands ───
// The trip takes a full-width row, the cost takes the one under it. The
// route gets the whole line, which is the only version where a four-city
// trip names all four, and the divider runs the full width so the two
// subjects are plainly two.
function TwoBands({ t }) {
  return (
    <div style={card}>
      <div style={{ padding: "10px 12px" }}>
        {routeLine(t.days, 12.5)}
        <div style={{ marginTop: 8 }}><Bits bits={t.bits} /></div>
      </div>
      <button style={{
        width: "100%", background: C.white,
        padding: "9px 12px", border: "none", borderTop: `1px solid ${C.div}`,
        cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 12, color: C.sub }}>Cost per person</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>
          <span style={{ color: C.sub, fontWeight: 600 }}>≈ </span>{money(t.pp)}
        </span>
        <ChevronRight size={16} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── C. Cost on its own ground ───
// Separated by colour rather than by a line. The band at the foot is grey,
// so the eye takes it as a different kind of thing before it reads a word
// of it, and no line is needed at all.
function Footer({ t }) {
  return (
    <div style={card}>
      <div style={{ padding: "10px 12px" }}>
        {routeLine(t.days, 12.5)}
        <div style={{ marginTop: 8 }}><Bits bits={t.bits} /></div>
      </div>
      <button style={{
        width: "100%", background: "#F8F9FB", padding: "9px 12px", border: "none",
        cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 12, color: C.sub }}>Per person</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>~{money(t.pp)}</span>
        <ChevronRight size={16} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── D. Two cards ───
// The furthest apart they can be without being on different screens. The
// trip is a card, the cost is a card, and nothing has to signal that they
// are separate because they visibly are.
function TwoCards({ t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...card, padding: "10px 12px" }}>
        {routeLine(t.days, 12.5)}
        <div style={{ marginTop: 8 }}><Bits bits={t.bits} /></div>
      </div>
      <button style={{
        ...card, padding: "10px 12px", cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 8, width: "auto",
      }}>
        <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 12, color: C.sub }}>Cost per person</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>
          {money(t.pp)}<span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}> approx.</span>
        </span>
        <ChevronRight size={16} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── E. Cost first ───
// The number is why the card was tapped, so it leads, and the trip reads
// underneath it. The "approximate" is carried by an icon beside the label,
// which is the quietest of the five and the only one you can put a
// sentence behind if somebody taps it.
function CostFirst({ t }) {
  return (
    <div style={card}>
      <button style={{
        width: "100%", background: C.white, padding: "10px 12px", border: "none",
        borderBottom: `1px solid ${C.div}`, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ flex: 1, minWidth: 0, textAlign: "left", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.6px" }}>{money(t.pp)}</span>
          <span style={{ fontSize: 11.5, color: C.sub }}>per person</span>
          <Info size={12} color={ICON} style={{ flexShrink: 0 }} />
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.p600, display: "inline-flex", alignItems: "center" }}>
          <ChevronRight size={16} color={C.p600} />
        </span>
      </button>
      <div style={{ padding: "9px 12px" }}>
        {routeLine(t.days, 12.5)}
        <div style={{ marginTop: 8 }}><Bits bits={t.bits} /></div>
      </div>
    </div>
  );
}

const VERSIONS = [
  { n: "A", name: "Side by side", note: "Live now. Hairline between them. The route has the least room here.", approx: "APPROX kicker", Card: SideBySide },
  { n: "B", name: "Two bands", note: "Full-width divider. The route gets the whole line.", approx: "≈ before the figure", Card: TwoBands },
  { n: "C", name: "Cost on its own ground", note: "Grey footer. Separated by colour, so no line is needed.", approx: "~ before the figure", Card: Footer },
  { n: "D", name: "Two cards", note: "Furthest apart. Nothing has to signal it.", approx: "approx. after the figure", Card: TwoCards },
  { n: "E", name: "Cost first", note: "The number leads, the trip reads under it.", approx: "An info icon", Card: CostFirst },
];

export default function ReadHeaderLab() {
  const [params] = useSearchParams();
  const id = Number(params.get("id")) || 6;
  const trip = BOOKED_TRIPS.find((t) => t.id === id) || BOOKED_TRIPS.find((t) => t.id);

  const days = (trip?.legs || []).map((l) => ({ city: l.city, n: l.n }));
  const t = {
    days,
    pp: trip?.priceValue || 81298,
    bits: [
      { Icon: BedDouble, n: days.length, label: days.length === 1 ? "hotel" : "hotels" },
      { Icon: Compass, n: 13, label: "activities" },
      { Icon: Car, n: 2, label: "transfers" },
      { Icon: Plane, n: 2, label: "flights" },
    ],
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: "16px 16px 10px" }}>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
          The band under the photo
        </h1>
        <p style={{ margin: "5px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "18px" }}>
          {trip?.who}&apos;s {trip?.dest} trip, {trip?.nights} nights. Five ways to separate what the
          trip was from what it cost, each carrying a different way of saying the figure is
          a guide. Icons are slate in all five.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, approx, Card }) => (
        <section key={n} style={{ padding: "14px 0 18px", borderTop: `1px solid ${C.div}` }}>
          <div style={{ padding: "0 16px 11px" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.p600, letterSpacing: "0.6px", textTransform: "uppercase" }}>
              Option {n}
            </p>
            <p style={{ margin: "3px 0 2px", fontSize: 15, fontWeight: 700, color: C.head }}>{name}</p>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: C.sub, lineHeight: "17px" }}>{note}</p>
            <p style={{ margin: 0, fontSize: 11.5, color: C.inact }}>Approximate: {approx}</p>
          </div>
          <Card t={t} />
        </section>
      ))}

      <div style={{ height: 40 }} />
    </div>
  );
}
