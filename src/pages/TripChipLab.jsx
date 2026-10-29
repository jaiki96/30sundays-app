import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapPin, Calendar, Pencil } from "lucide-react";
import { C } from "../data";

// ─── The route and dates strip: eight more ───
//
// Round two. The first lab settled the shape (two values, both changeable,
// the route on a line of its own) and the chips that came out of it read
// cleanly but lost their icons to make room. These eight go at the same
// strip from other angles: what the route line says, how many objects it is
// made of, and whether the two values are one thing or two.
//
// Same four-city trip in every one, so the route each version manages to
// show is comparable. Height is on the tag.
//
// Live at: /trip-chip-lab

const DAYS = [
  { city: "Hanoi", n: 2 },
  { city: "Ha Long", n: 2 },
  { city: "Hoi An", n: 3 },
  { city: "Da Nang", n: 2 },
];
const DATES = "24 Dec – 2 Jan";
const NIGHTS = DAYS.reduce((a, d) => a + d.n, 0);

const SEP = "  ·  ";
const FONT = (px, w = 700) => `${w} ${px}px Figtree, system-ui, sans-serif`;

// As many as fit, then a count of the rest. `nights` decides whether each
// city carries its own, which is worth about sixty pixels over four cities.
function fit(days, px, { fontPx = 13, nights = true } = {}) {
  const parts = days.map((d) => (nights ? `${d.city} ${d.n}N` : d.city));
  if (!parts.length) return "";
  if (!px) return parts.join(SEP);
  const cv = fit.cv || (fit.cv = document.createElement("canvas"));
  const ctx = cv.getContext("2d");
  ctx.font = FONT(fontPx);
  for (let n = parts.length; n > 0; n -= 1) {
    const rest = parts.length - n;
    const label = parts.slice(0, n).join(SEP) + (rest ? `  +${rest} ${rest === 1 ? "city" : "cities"}` : "");
    if (ctx.measureText(label).width <= px) return label;
  }
  return `${parts.length} cities`;
}

function Route({ fontPx = 13, nights = true, color = C.head }) {
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
        {fit(DAYS, px, { fontPx, nights })}
      </span>
    </span>
  );
}

const BTN = { border: "none", background: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left" };
const CHIP = {
  ...BTN, display: "flex", alignItems: "center", gap: 8, minWidth: 0,
  padding: "9px 10px", borderRadius: 10, background: C.bg,
};
const DATE_TEXT = { fontSize: 13, fontWeight: 700, color: C.head, whiteSpace: "nowrap" };

// ════════════════════════════════════════════════════════════
// 1. Chips, no icons. Where round one ended up.
// ════════════════════════════════════════════════════════════
function V1() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button style={{ ...CHIP, flex: "1 1 100%" }}>
        <Route />
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{ ...CHIP, flex: "0 0 auto" }}>
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 2. Chips with icons, nights off the route.
//    The nights are the expensive part of that line: four of
//    them cost about sixty pixels, which is what the pin and
//    the calendar want. The nights are still on every day card
//    below and inside the route screen itself.
// ════════════════════════════════════════════════════════════
function V2() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button style={{ ...CHIP, flex: "1 1 100%" }}>
        <MapPin size={14} color={C.sub} style={{ flexShrink: 0 }} />
        <Route nights={false} />
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{ ...CHIP, flex: "0 0 auto" }}>
        <Calendar size={14} color={C.sub} style={{ flexShrink: 0 }} />
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 3. One chip per city.
//    The route as the thing it is: a list of places, each with
//    its own nights, wrapping to as many lines as it needs. The
//    most legible route of the eight and the tallest strip.
// ════════════════════════════════════════════════════════════
function V3() {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
        {DAYS.map((d) => (
          <span key={d.city} style={{
            display: "inline-flex", alignItems: "baseline", gap: 4,
            padding: "5px 9px", borderRadius: 999, background: C.bg,
            fontSize: 12.5, fontWeight: 700, color: C.head, whiteSpace: "nowrap",
          }}>
            {d.city}
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.p600 }}>{d.n}N</span>
          </span>
        ))}
        <button style={{
          ...BTN, display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 26, height: 26, borderRadius: "50%", background: C.p100, flexShrink: 0,
        }}>
          <Pencil size={12} color={C.p600} />
        </button>
      </div>
      <button style={{ ...CHIP, marginTop: 9, flex: "0 0 auto", display: "inline-flex" }}>
        <Calendar size={14} color={C.sub} style={{ flexShrink: 0 }} />
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 4. One chip, both values.
//    Route and dates in a single object split by a rule, each
//    half its own door. One line, the least ink of the eight,
//    and the route pays for it in cities.
// ════════════════════════════════════════════════════════════
function V4() {
  return (
    <div style={{ display: "flex", borderRadius: 10, background: C.bg, overflow: "hidden" }}>
      <button style={{ ...BTN, flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, padding: "9px 10px" }}>
        <Route />
        <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{
        ...BTN, flex: "0 0 auto", display: "flex", alignItems: "center", gap: 8, padding: "9px 10px",
        borderLeft: `1px solid ${C.div}`,
      }}>
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 5. The count leads, the names follow.
//    "4 cities · 9 nights" is the shape of the trip in four
//    words, and the places are under it in grey where they are
//    read second. Nothing ever truncates.
// ════════════════════════════════════════════════════════════
function V5() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <button style={{ ...BTN, flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.head, letterSpacing: "-0.2px" }}>
            {DAYS.length} cities · {NIGHTS} nights
          </span>
          <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
        </span>
        <span style={{ display: "block", marginTop: 3, fontSize: 11.5, color: C.sub, lineHeight: "16px" }}>
          {DAYS.map((d) => d.city).join(" · ")}
        </span>
      </button>
      <button style={{ ...CHIP, flex: "0 0 auto", marginTop: 1 }}>
        <span style={{ ...DATE_TEXT, fontSize: 12.5 }}>{DATES}</span>
        <Pencil size={12} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 6. Pink chips.
//    The same two chips in the brand's tint instead of grey.
//    Marks the part of the page that answers to you, at the
//    cost of a block of colour above the day plan.
// ════════════════════════════════════════════════════════════
function V6() {
  const chip = { ...CHIP, background: "#FFF1F4" };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button style={{ ...chip, flex: "1 1 100%" }}>
        <Route />
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{ ...chip, flex: "0 0 auto" }}>
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 7. Outlined chips.
//    A hairline instead of a fill. Lighter on the page than a
//    grey block and still an object with an edge, so there is
//    no gap between a short value and its pencil.
// ════════════════════════════════════════════════════════════
function V7() {
  const chip = { ...CHIP, background: C.white, border: `1px solid ${C.div}` };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button style={{ ...chip, flex: "1 1 100%" }}>
        <Route />
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{ ...chip, flex: "0 0 auto" }}>
        <span style={DATE_TEXT}>{DATES}</span>
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// 8. Dates first, route under it.
//    When you go is the shorter answer and the one a couple
//    checks first, so it leads in small caps with the route
//    below in full. Two lines, no chips, nothing truncated.
// ════════════════════════════════════════════════════════════
function V8() {
  return (
    <div>
      <button style={{ ...BTN, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.sub, letterSpacing: "0.2px" }}>{DATES}</span>
        <Pencil size={11} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
      <button style={{ ...BTN, width: "100%", display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <Route fontPx={14} />
        <Pencil size={13} color={C.p600} style={{ flexShrink: 0 }} />
      </button>
    </div>
  );
}

// ─── The page ───
const VERSIONS = [
  { n: 1, name: "Chips, no icons", El: V1, note: "Where round one ended up. Both values in grey chips, pencil inside each, no leading icons because they cost the fourth city." },
  { n: 2, name: "Chips with icons, no nights", El: V2, note: "The pin and calendar come back, and the nights come off the route to pay for them. Nights are still on every day card and inside the route screen." },
  { n: 3, name: "One chip per city", El: V3, note: "The route as what it is: a list of places, each with its nights, wrapping as far as it needs. Most legible route here, tallest strip." },
  { n: 4, name: "One chip, both values", El: V4, note: "Route and dates in a single object split by a rule. One line and the least ink, and the route pays for it in cities." },
  { n: 5, name: "The count leads", El: V5, note: "Four words for the shape of the trip, the places in grey underneath. Nothing ever truncates, and the names are read second." },
  { n: 6, name: "Pink chips", El: V6, note: "The same two chips in the brand tint. Marks the part of the page that answers to you, at the cost of colour above the day plan." },
  { n: 7, name: "Outlined chips", El: V7, note: "A hairline instead of a fill. Lighter than a grey block, still an object with an edge." },
  { n: 8, name: "Dates lead, route under", El: V8, note: "When you go is the shorter answer and the one checked first, so it leads small. The route sits below at full size." },
];

export default function TripChipLab() {
  const [heights, setHeights] = useState({});
  const [shows, setShows] = useState({});
  const refs = useRef({});

  useLayoutEffect(() => {
    const read = () => {
      const h = {};
      const r = {};
      Object.entries(refs.current).forEach(([n, el]) => {
        if (!el) return;
        h[n] = Math.round(el.getBoundingClientRect().height);
        r[n] = el.innerText.replace(/\n/g, " · ");
      });
      setHeights(h);
      setShows(r);
    };
    const t = setTimeout(read, 250);
    document.fonts?.ready.then(() => setTimeout(read, 60)).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100%", background: C.white, paddingBottom: 40 }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Route and dates, eight more</p>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>
          Same four-city trip in every one, so the route each one manages to show is comparable. Height is on the tag.
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
          {shows[n] && <p style={{ margin: "4px 0 0", fontSize: 11, color: C.inact }}>Shows: {shows[n]}</p>}
          <div style={{ height: 18, borderBottom: `1px solid ${C.div}` }} />
        </div>
      ))}

      <p style={{ margin: "20px 16px 0", fontSize: 11.5, color: C.inact, lineHeight: "16px" }}>
        Nothing here is wired up. Tapping does nothing on this page.
      </p>
    </div>
  );
}
