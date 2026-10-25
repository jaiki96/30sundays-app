import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapPin, Calendar, Pencil, ChevronRight } from "lucide-react";
import { C } from "../data";

// ─── The two things you can still change: nine ways ───
//
// A trip that exists has two answers left open: which cities, and which
// dates. Everything else is either decided for good (who is going) or lives
// further down the page (hotels, day plans). So this strip has one job: say
// what those two answers currently are, and make it obvious that either can
// be changed.
//
// The hard part is the route. "Hanoi 2N · Ha Long 2N · Hoi An 3N · Da Nang
// 2N" is 44 characters and a phone is 358 wide, so every version has to
// decide how many cities it can afford before it starts counting the rest.
// A route on its own row fits them all; a route beside the dates fits one or
// two. That trade is the real choice here, not the icon.
//
// Each version below is on the same four-city trip, so the count in the
// route line is comparable. The height is on the tag.
//
// Live at: /trip-edit-lab

const DAYS = [
  { city: "Hanoi", n: 2 },
  { city: "Ha Long", n: 2 },
  { city: "Hoi An", n: 3 },
  { city: "Da Nang", n: 2 },
];
const DATES = "24 Dec – 2 Jan";
const DATES_LONG = "24 Dec 2026 – 2 Jan 2027";

const SEP = "  ·  ";
const CITY_FONT = (px) => `700 ${px}px Figtree, system-ui, sans-serif`;

// As many cities as the width allows, then a count of the rest. The same
// idea the live screen uses, measured on a canvas so it costs one pass.
function fitCities(days, px, fontPx = 13) {
  const parts = days.map((d) => `${d.city} ${d.n}N`);
  if (!parts.length) return "";
  if (!px) return parts.join(SEP);
  const cv = fitCities.cv || (fitCities.cv = document.createElement("canvas"));
  const ctx = cv.getContext("2d");
  ctx.font = CITY_FONT(fontPx);
  for (let n = parts.length; n > 0; n -= 1) {
    const rest = parts.length - n;
    const label = parts.slice(0, n).join(SEP) + (rest ? `  +${rest} ${rest === 1 ? "city" : "cities"}` : "");
    if (ctx.measureText(label).width <= px) return label;
  }
  return `${parts.length} cities`;
}

function CityLine({ fontPx = 13, color = C.head }) {
  const box = useRef(null);
  const [px, setPx] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const read = () => setPx(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    document.fonts?.ready.then(read).catch(() => {});
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={box} style={{ flex: 1, minWidth: 0, display: "block", overflow: "hidden" }}>
      <span style={{ fontSize: fontPx, fontWeight: 700, color, whiteSpace: "nowrap" }}>
        {fitCities(DAYS, px, fontPx)}
      </span>
    </span>
  );
}

const DATE_TEXT = { fontSize: 13, fontWeight: 700, color: C.head, whiteSpace: "nowrap" };
const BTN = { border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left" };

// ════════════════════════════════════════════════════════════
// 1. Split bar, a pencil in each half. What is live now.
// ════════════════════════════════════════════════════════════
function V1() {
  const half = (child, right) => (
    <button style={{
      ...BTN, flex: right ? "0 0 auto" : 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6,
      padding: "11px 9px", background: C.white,
      borderLeft: right ? `1px solid ${C.div}` : "none",
    }}>
      {child}
      <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 12, display: "flex", overflow: "hidden" }}>
      {half(<CityLine />)}
      {half(<span style={DATE_TEXT}>{DATES}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2. Split bar, a chevron in each half.
//    The arrow says a screen opens; the pencil says a value is
//    edited in place. Both screens do open, so this is the more
//    literal of the two.
// ════════════════════════════════════════════════════════════
function V2() {
  const half = (child, right) => (
    <button style={{
      ...BTN, flex: right ? "0 0 auto" : 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6,
      padding: "11px 9px", background: C.white,
      borderLeft: right ? `1px solid ${C.div}` : "none",
    }}>
      {child}
      <ChevronRight size={14} color={C.sub} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 12, display: "flex", overflow: "hidden" }}>
      {half(<CityLine />)}
      {half(<span style={DATE_TEXT}>{DATES}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3. Two full-width rows, a chevron on each.
//    The route gets the whole phone, so every city on a normal
//    trip fits with its nights. Costs one more row.
// ════════════════════════════════════════════════════════════
function V3() {
  const row = (Icon, child, last) => (
    <button style={{
      ...BTN, width: "100%", display: "flex", alignItems: "center", gap: 9,
      padding: "11px 0", borderBottom: last ? "none" : `1px solid ${C.div}`,
    }}>
      <Icon size={14} color={C.sub} style={{ flexShrink: 0 }} />
      {child}
      <ChevronRight size={15} color={C.sub} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div>
      {row(MapPin, <CityLine />)}
      {row(Calendar, <span style={{ ...DATE_TEXT, flex: 1 }}>{DATES_LONG}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. Two rows, the word Change.
//    A word cannot be mistaken for decoration the way a small
//    glyph can, and it names the action. Widest affordance, so
//    the route line loses about fifty pixels to it.
// ════════════════════════════════════════════════════════════
function V4() {
  const row = (child, last) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 0", borderBottom: last ? "none" : `1px solid ${C.div}`,
    }}>
      {child}
      <button style={{ ...BTN, flexShrink: 0, color: C.p600, fontSize: 12.5, fontWeight: 700 }}>Change</button>
    </div>
  );
  return (
    <div>
      {row(<CityLine />)}
      {row(<span style={{ ...DATE_TEXT, flex: 1 }}>{DATES_LONG}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. Two pills, a pencil inside each.
//    Nothing boxing them in, so the strip reads lighter than a
//    bar. Rounded ends cost a few pixels of route.
// ════════════════════════════════════════════════════════════
function V5() {
  const pill = (child, wide) => (
    <button style={{
      ...BTN, flex: wide ? 1 : "0 0 auto", minWidth: 0,
      display: "flex", alignItems: "center", gap: 7,
      padding: "9px 13px", borderRadius: 999, background: C.bg, border: `1px solid ${C.div}`,
    }}>
      {child}
      <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {pill(<CityLine fontPx={12.5} />, true)}
      {pill(<span style={{ ...DATE_TEXT, fontSize: 12.5 }}>{DATES}</span>)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 6. Rows with a round pencil button.
//    The control is a button in its own right, sized for a
//    thumb, and the row beside it is just the value. Clearest
//    target of the nine, and the heaviest to look at.
// ════════════════════════════════════════════════════════════
function V6() {
  const row = (child, last) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.div}`,
    }}>
      {child}
      <button style={{
        ...BTN, flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
        border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center",
      }}>
        <Pencil size={13} color={C.p600} />
      </button>
    </div>
  );
  return (
    <div>
      {row(<CityLine />)}
      {row(<span style={{ ...DATE_TEXT, flex: 1 }}>{DATES_LONG}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 7. No box at all. Underlined values.
//    The value is the control, the way an editable field reads
//    on paper. Lightest of the nine, and the one that leans
//    hardest on a convention people may not read as a control.
// ════════════════════════════════════════════════════════════
function V7() {
  // The route takes the row so its line has a width to measure against; the
  // dates sit to their own length, because an underline running past a short
  // value looks like a field somebody forgot to fill in.
  const item = (child, grow) => (
    <button style={{
      ...BTN, display: "flex", alignItems: "center", gap: 6, minWidth: 0,
      flex: grow ? 1 : "0 1 auto",
      borderBottom: `1.5px dashed ${C.icon}`, paddingBottom: 3,
    }}>
      {child}
      <Pencil size={11} color={C.p600} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div>
      <div style={{ display: "flex" }}>{item(<CityLine />, true)}</div>
      <div style={{ display: "flex", marginTop: 11 }}>{item(<span style={DATE_TEXT}>{DATES_LONG}</span>)}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 8. One tinted card, two rows, pencils.
//    A patch of brand colour marks the part of the page that
//    answers to you. Reads as a group rather than two controls
//    that happen to be adjacent.
// ════════════════════════════════════════════════════════════
function V8() {
  const row = (Icon, child, last) => (
    <button style={{
      ...BTN, width: "100%", display: "flex", alignItems: "center", gap: 9,
      padding: "9px 0", borderBottom: last ? "none" : "1px solid rgba(227,27,83,0.14)",
    }}>
      <Icon size={13} color={C.p600} style={{ flexShrink: 0 }} />
      {child}
      <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
    </button>
  );
  return (
    <div style={{ background: "#FFF1F4", borderRadius: 12, padding: "2px 12px" }}>
      {row(MapPin, <CityLine />)}
      {row(Calendar, <span style={{ ...DATE_TEXT, flex: 1 }}>{DATES_LONG}</span>, true)}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 9. Route on its own row, dates and the edit beneath.
//    The route gets the full width and no icon at all, so it
//    fits the most cities of any version here. The dates sit
//    under it in smaller type, where a secondary fact belongs.
// ════════════════════════════════════════════════════════════
function V9() {
  return (
    <div style={{ border: `1px solid ${C.div}`, borderRadius: 12, padding: "10px 12px" }}>
      <button style={{ ...BTN, width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
        <CityLine fontPx={13.5} />
        <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <div style={{ height: 1, background: C.div, margin: "9px 0" }} />
      <button style={{ ...BTN, width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
        <Calendar size={13} color={C.sub} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 600, color: C.sub, whiteSpace: "nowrap" }}>{DATES_LONG}</span>
        <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── The page ───
const VERSIONS = [
  { n: 1, name: "Split bar, pencils", El: V1, note: "What is live now. One bar, two halves, a pencil each. Shortest of the lot, and the route shares its row with the dates." },
  { n: 2, name: "Split bar, chevrons", El: V2, note: "Same bar, arrows instead of pencils. An arrow says a screen opens, which is what actually happens; a pencil suggests editing in place." },
  { n: 3, name: "Two rows, chevrons", El: V3, note: "The route gets the whole width, so every city fits on a normal trip. Icons name each row without a heading. Costs a second row." },
  { n: 4, name: "Two rows, the word Change", El: V4, note: "A word cannot be mistaken for decoration and it names the action. It is also the widest affordance, so the route gives up the most room." },
  { n: 5, name: "Two pills", El: V5, note: "Lighter than a bar and clearly two separate things. Rounded ends and a gap cost a little route." },
  { n: 6, name: "Round pencil buttons", El: V6, note: "The control is a proper button, sized for a thumb. Clearest target here, and the heaviest to look at." },
  { n: 7, name: "Underlined values, no box", El: V7, note: "The value is the control, the way a fillable line reads on paper. Lightest of all, and leans hardest on a convention." },
  { n: 8, name: "Tinted card", El: V8, note: "A patch of brand colour marks the part of the page that answers to you. Reads as one group, not two neighbours." },
  { n: 9, name: "Route first, dates beneath", El: V9, note: "The route takes the full width with no leading icon, so it fits the most cities of any version. The dates sit under it as the quieter fact." },
];

export default function TripEditLab() {
  const [heights, setHeights] = useState({});
  const [routes, setRoutes] = useState({});
  const refs = useRef({});

  // Measured after the real font lands, so the city counts are the ones a
  // phone will actually show.
  useLayoutEffect(() => {
    const read = () => {
      const h = {};
      const r = {};
      Object.entries(refs.current).forEach(([n, el]) => {
        if (!el) return;
        h[n] = Math.round(el.getBoundingClientRect().height);
        r[n] = el.innerText.split("\n")[0];
      });
      setHeights(h);
      setRoutes(r);
    };
    const t = setTimeout(read, 250);
    document.fonts?.ready.then(() => setTimeout(read, 60)).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100%", background: C.white, paddingBottom: 40 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Changing the route and the dates</p>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>
          Nine ways to show both and offer to change either. Same four-city trip in every one, so the cities that survive are comparable. Height is on the tag.
        </p>
      </div>

      {VERSIONS.map(({ n, name, note, El }) => (
        <div key={n} style={{ padding: "18px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 21, height: 21, borderRadius: "50%", background: C.head, color: "#fff", fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{n}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{name}</span>
            <span style={{ flexShrink: 0, padding: "3px 9px", borderRadius: 999, background: C.bg, fontSize: 11, fontWeight: 700, color: C.sub }}>
              {heights[n] ? `${heights[n]} px` : "…"}
            </span>
          </div>
          <div ref={(el) => { refs.current[n] = el; }}><El /></div>
          <p style={{ margin: "10px 0 0", fontSize: 11.5, color: C.sub, lineHeight: "16px" }}>{note}</p>
          {routes[n] && (
            <p style={{ margin: "4px 0 0", fontSize: 11, color: C.inact }}>
              Shows: {routes[n]}
            </p>
          )}
          <div style={{ height: 18, borderBottom: `1px solid ${C.div}` }} />
        </div>
      ))}

      <p style={{ margin: "20px 16px 0", fontSize: 11.5, color: C.inact, lineHeight: "16px" }}>
        Nothing here is wired up. Tapping does nothing on this page.
      </p>
    </div>
  );
}
