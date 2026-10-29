import { useState } from "react";
import {
  MapPin, Calendar, Users, User, ChevronDown, Pencil,
} from "lucide-react";
import { C } from "../data";

// ─── The top of your own trip: five ways ───
//
// Three facts sit between the photo and the day plan: where the trip goes,
// when it runs, and how many are going. Two of them can be changed and one
// cannot, so the job of this strip is to say which is which without a label
// spelling it out, and to do it in as little height as possible.
//
//   cities   opens the route screen, which rebuilds the trip
//   dates    opens the calendar, which rebuilds the trip
//   party    a fact, not a field. It is set when the trip is enquired for
//            and changed by the consultant, so there is nothing to tap.
//
// Every version below puts the party somewhere it reads as information:
// mostly up in the hero beside the trip's name, where the nights already
// live and nothing else is tappable either.
//
// Live at: /trip-header-lab

const TITLE = "Your Vietnam Trip";
const NIGHTS = 9;
const ROUTE = "Hanoi 2N · Ha Long 2N · Hoi An 3N";
const ROUTE_MORE = "+1 city";
const DATES = "24 Dec – 2 Jan";
const ADULTS = 2;

const ELLIPSIS = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const HERO_IMG = "https://images.unsplash.com/photo-1528127269322-539801943592?w=900&q=80&auto=format&fit=crop";

// The party, drawn. Figures rather than a sentence, and never a control.
function Party({ onDark, size = 18 }) {
  const dot = {
    width: size, height: size, borderRadius: "50%",
    background: onDark ? "rgba(255,255,255,0.22)" : C.p100,
    display: "grid", placeItems: "center", flexShrink: 0,
    marginLeft: -6, border: `1.5px solid ${onDark ? "rgba(255,255,255,0.5)" : C.white}`,
  };
  return (
    <span style={{ display: "inline-flex", paddingLeft: 6, flexShrink: 0 }}>
      {Array.from({ length: ADULTS }).map((_, i) => (
        <span key={i} style={dot}><User size={10} color={onDark ? "#fff" : C.p600} strokeWidth={2.5} /></span>
      ))}
    </span>
  );
}

// ─── The hero, at a size that shows where the party sits ───
function Hero({ trailing, children }) {
  return (
    <div style={{ position: "relative", height: 132, margin: "0 -16px", overflow: "hidden" }}>
      <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 42%, rgba(0,0,0,0.72) 100%)" }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 12 }}>
        <p style={{ margin: 0, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 19, fontWeight: 700, color: "#fff", lineHeight: "25px" }}>
          <span>{TITLE} · <span style={{ fontWeight: 400 }}>{NIGHTS}N</span></span>
          {trailing}
        </p>
        {children}
      </div>
    </div>
  );
}

// A glass chip on the photo, for the party when it rides up there.
function GlassParty({ withCount = true }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 11px 4px 5px", borderRadius: 999,
      background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)",
      backdropFilter: "blur(8px)",
    }}>
      <Party onDark size={17} />
      {withCount && <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>travellers</span>}
    </span>
  );
}

// ════════════════════════════════════════════════════════════
// 1. Two fields, party in the hero.
//    Closest to what is there now. The two things that can be
//    set keep the look of a field with a value in it; the one
//    that cannot leaves the strip entirely and rides beside the
//    trip's name, where the nights already sit.
// ════════════════════════════════════════════════════════════
function V1() {
  const field = (Icon, text, wide) => (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0,
      flex: wide ? 1 : "0 0 auto",
      padding: "8px 9px 8px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
      border: `1px solid ${C.div}`, background: C.bg, textAlign: "left",
    }}>
      <Icon size={14} color={C.sub} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{text}</span>
      <ChevronDown size={14} color={C.sub} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <>
      <Hero trailing={<GlassParty />} />
      <div style={{ padding: "12px 0 0" }}>
        <div style={{ display: "flex" }}>{field(MapPin, `${ROUTE} ${ROUTE_MORE}`, true)}</div>
        <div style={{ display: "flex", marginTop: 8 }}>{field(Calendar, DATES, true)}</div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// 2. One bar, split in two.
//    Both halves are doors, so they are one object divided
//    rather than two objects that happen to match. Half the
//    height of two stacked fields.
// ════════════════════════════════════════════════════════════
function V2() {
  const half = (Icon, label, text, right) => (
    <button style={{
      flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8,
      padding: "9px 11px", border: "none", background: "transparent",
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      borderLeft: right ? `1px solid ${C.div}` : "none",
    }}>
      <Icon size={14} color={C.p600} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: C.inact }}>{label}</span>
        <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{text}</span>
      </span>
      <ChevronDown size={13} color={C.sub} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <>
      <Hero trailing={<GlassParty />} />
      <div style={{ marginTop: 12, border: `1px solid ${C.div}`, borderRadius: 12, display: "flex", overflow: "hidden" }}>
        {half(MapPin, "Cities", "Hanoi, Ha Long +2")}
        {half(Calendar, "Dates", DATES, true)}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// 3. Rows with a Change link, party as a plain line.
//    The clearest about which of the three can be touched: two
//    rows end in a pink word, the third ends in nothing. Costs
//    a third row to say it.
// ════════════════════════════════════════════════════════════
function V3() {
  const row = (Icon, text, change, last) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
      borderBottom: last ? "none" : `1px solid ${C.div}`,
    }}>
      <Icon size={14} color={change ? C.p600 : C.inact} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: change ? 700 : 500, color: change ? C.head : C.sub, ...ELLIPSIS }}>{text}</span>
      {change && (
        <button style={{ flexShrink: 0, padding: 0, border: "none", background: "none", color: C.p600, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Change
        </button>
      )}
    </div>
  );
  return (
    <>
      <Hero />
      <div style={{ marginTop: 6 }}>
        {row(MapPin, `${ROUTE} ${ROUTE_MORE}`, true)}
        {row(Calendar, DATES, true)}
        {row(Users, `${ADULTS} travellers`, false, true)}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// 4. Two fields and a chip that is plainly not one.
//    The party stays in the strip, next to the dates, but with
//    no border, no caret and no fill. Keeps the three facts
//    together at the cost of leaning on styling to say that one
//    of them is dead.
// ════════════════════════════════════════════════════════════
function V4() {
  return (
    <>
      <Hero />
      <div style={{ padding: "12px 0 0" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 7,
          padding: "8px 9px 8px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
          border: `1px solid ${C.div}`, background: C.bg, textAlign: "left",
        }}>
          <MapPin size={14} color={C.sub} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{ROUTE} {ROUTE_MORE}</span>
          <ChevronDown size={14} color={C.sub} style={{ flexShrink: 0 }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 7, minWidth: 0,
            padding: "8px 9px 8px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
            border: `1px solid ${C.div}`, background: C.bg, textAlign: "left",
          }}>
            <Calendar size={14} color={C.sub} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.head, whiteSpace: "nowrap" }}>{DATES}</span>
            <ChevronDown size={14} color={C.sub} style={{ flexShrink: 0 }} />
          </button>
          {/* No border, no fill, no caret. It is a fact sitting next to two
              controls, and it has to look like one. */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <Party />
            <span style={{ fontSize: 12.5, color: C.sub, whiteSpace: "nowrap" }}>travellers</span>
          </span>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// 5. One line, one pencil.
//    The three facts run together as a sentence and a single
//    control opens the Customise picker, which already asks
//    which one. Smallest of the five, and one tap further from
//    either screen.
// ════════════════════════════════════════════════════════════
function V5() {
  return (
    <>
      <Hero trailing={<GlassParty />} />
      <div style={{
        marginTop: 12, display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: 12, background: "#FFF1F4",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.head, ...ELLIPSIS }}>{ROUTE} {ROUTE_MORE}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.sub, ...ELLIPSIS }}>{DATES} · {ADULTS} travellers</p>
        </div>
        <button style={{
          flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
          padding: "8px 13px", borderRadius: 999, border: "none",
          background: C.p600, color: "#fff", fontSize: 12.5, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <Pencil size={12} /> Edit
        </button>
      </div>
    </>
  );
}

// ─── The page ───
const VERSIONS = [
  {
    n: 1, name: "Two fields, party in the hero", El: V1,
    note: "Nearest to today. The two doors keep the field look; the party moves up beside the nights, where nothing is tappable either.",
  },
  {
    n: 2, name: "One bar, split in two", El: V2,
    note: "Both doors in one object divided by a rule, each with a small label. Half the height of two stacked fields, and the labels say what each half opens.",
  },
  {
    n: 3, name: "Rows with a Change link", El: V3,
    note: "The clearest about what can be touched: two rows end in a pink word, the third ends in nothing. Costs a third row to say it.",
  },
  {
    n: 4, name: "Two fields, party as plain text", El: V4,
    note: "All three stay together. The party has no border, no fill and no caret, so it leans on styling alone to say it is dead.",
  },
  {
    n: 5, name: "One line, one pencil", El: V5,
    note: "The three facts as a sentence, and one button into the Customise picker, which already asks which one. Smallest, and one tap further from either screen.",
  },
];

export default function TripHeaderLab() {
  const [heights, setHeights] = useState({});
  const measure = (n) => (el) => {
    if (!el) return;
    const h = Math.round(el.getBoundingClientRect().height);
    setHeights((prev) => (prev[n] === h ? prev : { ...prev, [n]: h }));
  };

  return (
    <div style={{ minHeight: "100%", background: C.white, paddingBottom: 40 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>The top of your own trip</p>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>
          Cities and dates can be changed. The number of travellers cannot, so it has to read as a fact. Each version shows the hero too, because that is where the party usually goes. The height under the photo is on the tag.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, El }) => (
        <div key={n} style={{ padding: "18px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 21, height: 21, borderRadius: "50%", background: C.head, color: "#fff", fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{n}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{name}</span>
            <span style={{ flexShrink: 0, padding: "3px 9px", borderRadius: 999, background: C.bg, fontSize: 11, fontWeight: 700, color: C.sub }}>
              {heights[n] ? `${Math.max(0, heights[n] - 132)} px` : "…"}
            </span>
          </div>
          {/* The hero is the same in every version and is only there for
              context, so its height comes off the tag. */}
          <div ref={measure(n)}><El /></div>
          <p style={{ margin: "11px 0 0", fontSize: 11.5, color: C.sub, lineHeight: "16px" }}>{note}</p>
          <div style={{ height: 18, borderBottom: `1px solid ${C.div}` }} />
        </div>
      ))}

      <p style={{ margin: "20px 16px 0", fontSize: 11.5, color: C.inact, lineHeight: "16px" }}>
        Nothing here is wired up. Tapping does nothing on this page.
      </p>
    </div>
  );
}
