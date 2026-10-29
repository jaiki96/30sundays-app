import { useState } from "react";
import {
  MapPin, Calendar, User, Baby, Moon, BedDouble, Compass, Car,
  IndianRupee, ChevronRight, ChevronDown, Receipt,
} from "lucide-react";
import { C, allItineraries } from "../data";

// ─── The top of somebody else's trip: five ways ───
//
// The three things a reader asks before anything else: where it went and
// when, what was in it, and what it cost. Every version below answers all
// three. What changes is how much of the screen they are allowed to take,
// because the thing under them is the trip itself and it should not start
// below the fold.
//
// Each one is shown on a real booked trip, on the real page width, with the
// height it costs printed next to it. Live at: /read-summary-lab

const TRIP = allItineraries.find((x) => (x.days?.length || 0) >= 2) || allItineraries[0];
const DATE_LABEL = "31 Mar – 5 Apr 2027";
const TRAVELLERS = 2;
const KIDS = 0;

// The counts, read off the trip the way the itinerary screen reads them.
const dayPlans = (it) => {
  const out = [];
  it.days.forEach((stay) => {
    const names = String(stay.sub || "").split(" · ").filter(Boolean);
    for (let d = 0; d < stay.n; d += 1) out.push({ activities: names });
  });
  return out;
};

const FACTS = (() => {
  const plans = dayPlans(TRIP);
  const activities = plans.reduce((a, d) => a + d.activities.length, 0);
  const perPerson = Number(String(TRIP.price).replace(/,/g, "")) || 102298;
  return {
    route: TRIP.days.map((d) => `${d.city} ${d.n}N`).join(" · "),
    nights: TRIP.nights,
    stays: TRIP.days.length,
    activities,
    transfers: TRIP.days.length + 1,
    perPerson,
    total: perPerson * TRAVELLERS,
  };
})();

const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;


// Who went, drawn rather than written.
function Party({ adults = TRAVELLERS, kids = KIDS, size = 22 }) {
  const dot = (bg) => ({
    width: size, height: size, borderRadius: "50%", background: bg,
    display: "grid", placeItems: "center", flexShrink: 0,
    marginLeft: -5, border: `1.5px solid ${C.white}`,
  });
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <span style={{ display: "flex", paddingLeft: 5 }}>
        {Array.from({ length: adults }).map((_, i) => (
          <span key={`a${i}`} style={dot(C.p100)}><User size={size * 0.52} color={C.p600} strokeWidth={2.4} /></span>
        ))}
        {Array.from({ length: kids }).map((_, i) => (
          <span key={`k${i}`} style={dot("#FEF0C7")}><Baby size={size * 0.52} color="#B54708" strokeWidth={2.4} /></span>
        ))}
      </span>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: C.sub }}>{kids ? `${adults} + ${kids}` : adults}</span>
    </span>
  );
}

const INCLUDED = [
  { Icon: Moon, key: "nights", label: "nights" },
  { Icon: BedDouble, key: "stays", label: "hotels" },
  { Icon: Compass, key: "activities", label: "activities" },
  { Icon: Car, key: "transfers", label: "transfers" },
];

const LABEL = {
  margin: "0 0 6px", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px",
  textTransform: "uppercase", color: C.inact,
};
const CARD = { border: `1px solid ${C.div}`, borderRadius: 14, background: C.white };
const ELLIPSIS = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

// ════════════════════════════════════════════════════════════
// 1. One card, three labelled parts. What is live today.
// ════════════════════════════════════════════════════════════
function V1() {
  const rule = <div style={{ height: 1, background: C.div, margin: "11px 0" }} />;
  return (
    <div style={{ ...CARD, padding: "12px 14px" }}>
      <p style={LABEL}>The trip</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <MapPin size={14} color={C.p600} style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{FACTS.route}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, minWidth: 0 }}>
        <Calendar size={14} color={C.p600} style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: C.head, ...ELLIPSIS }}>{DATE_LABEL}</p>
        <Party />
      </div>
      {rule}
      <p style={LABEL}>Included</p>
      <div style={{ display: "flex", gap: 7 }}>
        {INCLUDED.map(({ Icon, key, label }) => (
          <div key={key} style={{ flex: 1, minWidth: 0, borderRadius: 11, background: C.bg, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Icon size={15} color={C.sub} strokeWidth={2.1} />
            <span style={{ fontSize: 14, fontWeight: 800, color: C.head, lineHeight: 1 }}>{FACTS[key]}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.sub }}>{label}</span>
          </div>
        ))}
      </div>
      {rule}
      <p style={LABEL}>What it cost</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <IndianRupee size={15} color={C.p600} strokeWidth={2.6} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.5px", lineHeight: 1.15 }}>{money(FACTS.total)}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.sub, ...ELLIPSIS }}>{money(FACTS.perPerson)} each, incl. GST &amp; TCS</p>
        </div>
        <button style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 2, padding: "7px 11px", borderRadius: 999, border: `1px solid ${C.div}`, background: C.white, color: C.p600, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Breakdown <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2. The price on a rail down the right, the trip on the left.
//    Reading across instead of down: nothing is stacked that can
//    sit beside something else.
// ════════════════════════════════════════════════════════════
function V2() {
  return (
    <div style={{ ...CARD, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, minWidth: 0, padding: "11px 12px" }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{FACTS.route}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4, minWidth: 0 }}>
          <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 12, color: C.sub, ...ELLIPSIS }}>{DATE_LABEL}</p>
          <Party size={19} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 10, flexWrap: "wrap" }}>
          {INCLUDED.map(({ Icon, key, label }) => (
            <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon size={13} color={C.p600} strokeWidth={2.2} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.head }}>{FACTS[key]}</span>
              <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ width: 122, flexShrink: 0, background: "#FFF1F4", padding: "11px 10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: C.p600 }}>Total</p>
        <p style={{ margin: "2px 0 0", fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{money(FACTS.total)}</p>
        <p style={{ margin: "3px 0 0", fontSize: 10.5, color: C.sub, lineHeight: "14px" }}>{money(FACTS.perPerson)}<br />per person</p>
        <button style={{ marginTop: 6, padding: 0, border: "none", background: "none", color: C.p600, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 1 }}>
          Breakdown <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3. No card at all. Two lines of plain facts and one price line,
//    with hairlines doing the dividing. The lightest thing that
//    can carry all three answers.
// ════════════════════════════════════════════════════════════
function V3() {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: C.head, letterSpacing: "-0.3px", ...ELLIPSIS }}>{FACTS.route}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 12.5, color: C.sub, ...ELLIPSIS }}>
          {DATE_LABEL} · {FACTS.nights} nights
        </p>
        <Party size={19} />
      </div>
      <div style={{ height: 1, background: C.div, margin: "10px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap" }}>
        {INCLUDED.slice(1).map(({ Icon, key, label }) => (
          <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon size={14} color={C.sub} strokeWidth={2.1} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.head }}>{FACTS[key]}</span>
            <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
          </span>
        ))}
      </div>
      <div style={{ height: 1, background: C.div, margin: "10px 0" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: C.head, letterSpacing: "-0.6px" }}>{money(FACTS.total)}</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: C.sub, ...ELLIPSIS }}>
          {money(FACTS.perPerson)} each, incl. tax
        </span>
        <button style={{ flexShrink: 0, padding: 0, border: "none", background: "none", color: C.p600, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 1 }}>
          Breakdown <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. One line resting, the rest on tap. The smallest it can be
//    and still answer the question most people came with, which
//    is what it cost.
// ════════════════════════════════════════════════════════════
function V4() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...CARD, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", border: "none", background: C.white, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{FACTS.route}</p>
          <p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.sub, ...ELLIPSIS }}>
            {DATE_LABEL} · {TRAVELLERS} travellers · {FACTS.stays} hotels
          </p>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.4px", lineHeight: 1.1 }}>{money(FACTS.total)}</p>
          <p style={{ margin: "1px 0 0", fontSize: 10, color: C.inact }}>incl. tax</p>
        </div>
        <ChevronDown size={16} color={C.sub} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${C.div}`, padding: "11px 13px", background: C.bg }}>
          <div style={{ display: "flex", gap: 7 }}>
            {INCLUDED.map(({ Icon, key, label }) => (
              <div key={key} style={{ flex: 1, minWidth: 0, borderRadius: 10, background: C.white, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Icon size={14} color={C.sub} strokeWidth={2.1} />
                <span style={{ fontSize: 13.5, fontWeight: 800, color: C.head, lineHeight: 1 }}>{FACTS[key]}</span>
                <span style={{ fontSize: 9.5, fontWeight: 600, color: C.sub }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 12, color: C.sub }}>{money(FACTS.perPerson)} each, incl. GST &amp; TCS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.p600 }}>Breakdown ›</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. Over the photo. The card lifts into the bottom of the hero,
//    so most of its height is paid for out of the picture rather
//    than out of the page.
// ════════════════════════════════════════════════════════════
function V5() {
  return (
    <div style={{ margin: "0 -16px" }}>
      <div style={{ position: "relative", height: 150 }}>
        <img src={TRIP.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
        <p style={{ position: "absolute", left: 16, right: 16, bottom: 44, margin: 0, fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px" }}>
          Aanya&apos;s {TRIP.dest} trip · {TRIP.nights}N
        </p>
      </div>
      <div style={{ margin: "-30px 16px 0", position: "relative", ...CARD, boxShadow: "0 8px 24px -10px rgba(16,24,40,0.3)", padding: "11px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{FACTS.route}</p>
          <Party size={19} />
        </div>
        <p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.sub }}>{DATE_LABEL}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 11, margin: "9px 0", paddingTop: 9, borderTop: `1px solid ${C.div}`, flexWrap: "wrap" }}>
          {INCLUDED.map(({ Icon, key, label }) => (
            <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Icon size={13} color={C.p600} strokeWidth={2.2} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.head }}>{FACTS[key]}</span>
              <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 9, borderTop: `1px solid ${C.div}` }}>
          <Receipt size={14} color={C.p600} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15.5, fontWeight: 800, color: C.head, letterSpacing: "-0.4px" }}>{money(FACTS.total)}</span>
          <span style={{ flex: 1, minWidth: 0, fontSize: 11, color: C.sub, ...ELLIPSIS }}>{money(FACTS.perPerson)} each, incl. tax</span>
          <ChevronRight size={14} color={C.p600} style={{ flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ─── The page ───
const VERSIONS = [
  { n: 1, name: "Three labelled parts", note: "What is live now. Clearest to scan, and the one that costs the most page.", El: V1 },
  { n: 2, name: "Price on a rail (chosen)", note: "Now live on the trip screen. The price moves beside the trip instead of under it. Tinted so it reads as the answer to its own question.", El: V2 },
  { n: 3, name: "No card, just rules", note: "Nothing boxed. Two hairlines carry the three parts, and the type does the rest.", El: V3 },
  { n: 4, name: "One line, opens up", note: "Resting, it answers what it cost. Tap for the rest. Smallest by far, and the inclusions are hidden until asked for.", El: V4 },
  { n: 5, name: "Lifted into the photo", note: "The card overlaps the hero, so most of its height comes out of the picture. Needs the hero shortened to suit.", El: V5 },
];

export default function ReadSummaryLab() {
  const [heights, setHeights] = useState({});
  const measure = (n) => (el) => {
    if (!el) return;
    const h = Math.round(el.getBoundingClientRect().height);
    setHeights((prev) => (prev[n] === h ? prev : { ...prev, [n]: h }));
  };

  return (
    <div style={{ minHeight: "100%", background: C.white, paddingBottom: 40 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>The top of a trip you are reading</p>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>
          Five ways to say where it went, what was in it and what it cost. Real trip, real page width. The height each one costs is on its tag.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, El }) => (
        <div key={n} style={{ padding: "18px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <span style={{ width: 21, height: 21, borderRadius: "50%", background: C.head, color: "#fff", fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{n}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{name}</span>
            <span style={{ flexShrink: 0, padding: "3px 9px", borderRadius: 999, background: C.bg, fontSize: 11, fontWeight: 700, color: C.sub }}>
              {heights[n] ? `${heights[n]} px` : "…"}
            </span>
          </div>
          <div ref={measure(n)}><El /></div>
          <p style={{ margin: "9px 0 0", fontSize: 11.5, color: C.sub, lineHeight: "16px" }}>{note}</p>
          <div style={{ height: 18, borderBottom: `1px solid ${C.div}` }} />
        </div>
      ))}
    </div>
  );
}
