import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, Plus, ChevronRight, ChevronDown, ArrowRight, X as XIcon, Minus, Info,
  Search as SearchIcon, Plane, Car, Ship, Shuffle, Clock, Wand2,
  Trash2, GripVertical, AlertTriangle, Undo2, Map as MapIcon, Wand,
} from "lucide-react";
import { C } from "../../data";
import { destAreas, areaImg, routeNights, recommendedRoute } from "../../data/buildData";
import { SKY_STYLE } from "../skyStyle";
import { WEATHER_CHIP } from "../seasonStyle";
import {
  arrivalAirport, airportCity, hop, nightlyFrom, pickTag, crowdWord, monthFor,
  travelMinutes, bestOrder, routeIssue, hhmm,
} from "../../data/routeBuilder";
import RouteMap from "./RouteMap";
import RegionDetail from "../../pages/RegionDetail";

// ─── Choosing the cities ───
//
// The step this replaces asked two questions on one screen: which regions do
// you want, and which of five pre-built routes do you want. Watching people
// use it, almost nobody touched the region chips and almost everybody took
// Route 1, because neither question told them anything they could decide on. A
// chip saying "Ubud" and a card saying "Route 2" are both just names.
//
// So there is one question now, and it is the one a couple can actually
// answer: which cities do you want. Nothing is ticked to begin with, because a
// pre-ticked list is a list nobody reads. Each city says what it is, how long
// we suggest, what a night costs and what the sky will be doing.
//
// The trip rides along the top in one line, in the order we would run it. A
// city that will not fit in the nights left is held back rather than allowed
// in and argued with afterwards.

const PAD = 16;

const TAG_TONE = {
  "Most recommended": { bg: "#FFE6ED", fg: "#C01048" },
  "Most visited": { bg: "#EAF2FE", fg: "#175CD3" },
  Offbeat: { bg: "#E5F6F5", fg: "#007E72" },
  Culture: { bg: "#F4F0FF", fg: "#6938EF" },
  Beach: { bg: "#E0F2FE", fg: "#026AA2" },
  "On the water": { bg: "#E0F2FE", fg: "#026AA2" },
  "Food and markets": { bg: "#FFF4E0", fg: "#B54708" },
  Nightlife: { bg: "#F4F0FF", fg: "#6938EF" },
  Nature: { bg: "#E5F6F5", fg: "#007E72" },
  "Slow days": { bg: "#F2F4F7", fg: "#475467" },
  Popular: { bg: "#F2F4F7", fg: "#475467" },
};

const CROWD_TONE = {
  Busiest: { bg: "#FEF3F2", fg: "#B42318" },
  "Fewer people, cheaper": { bg: "#F2F4F7", fg: "#475467" },
  "Quietest, cheapest": { bg: "#ECFDF3", fg: "#027A48" },
};

const MODE_ICON = { flight: Plane, car: Car, boat: Ship };

const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const nightsWord = (n) => `${n} night${n === 1 ? "" : "s"}`;

// ─── How long you stay where ───
//
// Every city arrives with the nights we suggest for it. If that leaves the
// trip short we hand the spare nights round, longest stay first, because an
// extra night is worth most where there is most to do. We stretch a city by
// two nights at the outside: seven nights in Hanoi because Hanoi was the only
// thing ticked is not a recommendation, it is arithmetic.
//
// A night somebody set by hand is left exactly where they set it.
const STRETCH = 2;

function rebuild(cities, prev, rec, target, manual) {
  const was = new Map(prev.map((s) => [s.city, s.n]));
  const stops = cities.map((city) => ({
    city,
    n: manual.has(city) ? (was.get(city) ?? rec[city] ?? 2) : (rec[city] ?? 2),
  }));
  let spare = target - stops.reduce((s, x) => s + x.n, 0);

  // Over the trip's length: the suggested stays simply do not all fit, so we
  // take nights back, longest first, and from the stays nobody has set by
  // hand before the ones they have. A city is never cut below one night.
  if (spare < 0) {
    let over = -spare;
    for (const pool of [stops.filter((x) => !manual.has(x.city)), stops]) {
      let moved = true;
      while (over > 0 && moved) {
        moved = false;
        for (const x of [...pool].sort((a, b) => b.n - a.n)) {
          if (over <= 0) break;
          if (x.n > 1) { x.n -= 1; over -= 1; moved = true; }
        }
      }
    }
    return stops;
  }
  if (spare === 0) return stops;

  const room = (x) => (manual.has(x.city) ? 0 : Math.max(0, (rec[x.city] ?? 2) + STRETCH - x.n));
  const order = stops.map((_, i) => i).sort((a, b) => stops[b].n - stops[a].n);
  let moved = true;
  while (spare > 0 && moved) {
    moved = false;
    for (const i of order) {
      if (spare <= 0) break;
      if (room(stops[i]) > 0) { stops[i].n += 1; spare -= 1; moved = true; }
    }
  }
  return stops;
}

// Making the nights match the dates exactly, when somebody asks us to.
function balance(stops, target) {
  const out = stops.map((x) => ({ ...x }));
  let diff = target - out.reduce((s, x) => s + x.n, 0);
  let guard = 200;
  while (diff !== 0 && guard > 0) {
    guard -= 1;
    const order = out.map((_, i) => i).sort((a, b) => out[b].n - out[a].n);
    if (diff > 0) { out[order[0]].n += 1; diff -= 1; }
    else {
      const i = order.find((j) => out[j].n > 1);
      if (i === undefined) break;
      out[i].n -= 1; diff += 1;
    }
  }
  return out;
}

function Chip({ children, bg, fg }) {
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 999, background: bg, color: fg,
      fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// ─── The weather, both ends of it ───
//
// One number was not enough to pack for. The range and the word for the sky
// are what somebody actually decides on.
function WeatherChip({ wx }) {
  const Sky = SKY_STYLE[wx.sky] || SKY_STYLE.cloudy;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px 3px 7px", borderRadius: 999,
      background: WEATHER_CHIP.bg, color: WEATHER_CHIP.fg,
      fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <Sky.Icon size={12} color={Sky.color} style={{ flexShrink: 0 }} />
      {wx.low != null ? `${wx.low}° to ${wx.high}°` : `${wx.high}°`}
      {wx.word ? ` · ${wx.word}` : ""}
    </span>
  );
}

const roundBtn = (on) => ({
  width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white,
  display: "grid", placeItems: "center", cursor: on ? "pointer" : "default",
  opacity: on ? 1 : 0.35, padding: 0, flexShrink: 0,
});

// A plus that cannot add still answers when it is pressed. A dead control is
// a question the screen refuses to take, and the couple is left guessing which
// of the two numbers on this screen is in their way.
function Nights({ n, onChange, canAdd = true, onBlocked }) {
  const stop = (e, f) => { e.stopPropagation(); f(); };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={(e) => stop(e, () => onChange(n - 1))} disabled={n <= 1} aria-label="One night fewer" style={roundBtn(n > 1)}>
        <Minus size={13} color={C.head} />
      </button>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.head, minWidth: 54, textAlign: "center" }}>{nightsWord(n)}</span>
      <button
        onClick={(e) => stop(e, () => (canAdd ? onChange(n + 1) : onBlocked?.()))}
        aria-label="One night more"
        style={{ ...roundBtn(true), opacity: canAdd ? 1 : 0.55 }}
      >
        <Plus size={13} color={canAdd ? C.head : C.inact} />
      </button>
    </div>
  );
}

// ─── One city ───
//
// The card reads; the circle chooses. Tapping anywhere on it, the photograph
// included, opens the city's page, because somebody who has not been to Hoi An
// cannot decide on it from four words. Only the plus puts it in the trip, so
// looking something up never quietly changes the answer.
function PlaceCard({ dest, area, wx, picked, nights, left, onToggle, onNights, onNeedNight, onOpen }) {
  const tag = pickTag(dest, area.city);
  const tone = TAG_TONE[tag] || TAG_TONE.Popular;
  const crowd = crowdWord(dest, area.city);
  const crowdTone = CROWD_TONE[crowd] || TAG_TONE.Popular;
  const rate = nightlyFrom(dest, area.city);
  const Sky = SKY_STYLE[wx.sky] || SKY_STYLE.cloudy;

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(); } }}
      style={{
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        background: picked ? "#FFF6F9" : C.white,
        border: `${picked ? 2 : 1}px solid ${picked ? C.p600 : C.div}`,
        boxShadow: picked ? "0 2px 10px rgba(227,27,83,0.10)" : "0 1px 3px rgba(24,29,39,0.05)",
        transition: "background .15s, border-color .15s",
      }}
    >
      <div style={{ display: "flex", gap: 12, padding: picked ? 11 : 12 }}>
        <img
          src={area.img}
          alt=""
          style={{ width: 76, height: 76, borderRadius: 12, objectFit: "cover", flexShrink: 0, background: "#F4F2F0" }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 800, color: C.head, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {area.city}
            </span>
            {/* The only thing on the card that chooses. */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              aria-label={picked ? `Remove ${area.city}` : `Add ${area.city}`}
              style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0, padding: 0, cursor: "pointer",
                display: "grid", placeItems: "center",
                background: picked ? C.p600 : C.white,
                border: `1.5px solid ${picked ? C.p600 : C.p300}`,
              }}
            >
              {picked
                ? <Check size={15} strokeWidth={3.5} color="#fff" />
                : <Plus size={15} strokeWidth={3} color={C.p600} />}
            </button>
          </div>

          <p style={{
            margin: "2px 0 0", fontSize: 11.5, lineHeight: "16px", color: C.sub,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{area.tag}</p>

          {/* Two chips, and then a plain line. The sky and the nightly rate
              were chips too, and four chips on a card is a card you have to
              read rather than one you can glance at. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
            {tag && <Chip bg={tone.bg} fg={tone.fg}>{tag}</Chip>}
            {crowd && <Chip bg={crowdTone.bg} fg={crowdTone.fg}>{crowd}</Chip>}
          </div>

          <p style={{ margin: "7px 0 0", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.sub, flexWrap: "wrap" }}>
            <Sky.Icon size={12} color={Sky.color} style={{ flexShrink: 0 }} />
            {wx.low != null ? `${wx.low}° to ${wx.high}°` : `${wx.high}°`}
            {wx.word ? ` · ${wx.word}` : ""}
            {rate ? ` · about ${money(rate)} a night` : ""}
          </p>
        </div>
      </div>

      {/* The nights. Our suggestion before it is picked, and a dial after, so
          nobody has to open anything to stay a day longer. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: picked ? "8px 11px 10px" : "9px 12px 11px",
        borderTop: `1px solid ${picked ? "#F7CEDC" : C.div}`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {picked ? (
            <Nights n={nights} onChange={onNights} canAdd={left > 0} onBlocked={onNeedNight} />
          ) : (
            <span style={{ fontSize: 12.5, color: C.sub }}>
              We suggest <strong style={{ color: C.head, fontWeight: 700 }}>{nightsWord(area.n)}</strong>
            </span>
          )}
        </div>
        <span style={{
          flexShrink: 0, fontSize: 12.5, fontWeight: 700, color: C.p600,
          display: "inline-flex", alignItems: "center", gap: 2,
        }}>Details <ChevronRight size={14} /></span>
      </div>
    </div>
  );
}

// ─── Nights that do not fit ───
//
// Only when the cities come to more than the trip, which can now only happen
// from the night dials, because a city that will not fit is never let in.
function NightsNote({ placed, nights, onMakeNights, onBalance }) {
  if (placed <= nights) return null;
  const Action = ({ onClick, children }) => (
    <button onClick={onClick} style={{
      padding: "7px 13px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
      background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
    }}>{children}</button>
  );
  return (
    <div style={{
      marginTop: 9, padding: "9px 11px", borderRadius: 11,
      background: "#FEF3F2", border: "1px solid #FDA29B",
    }}>
      <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.head }}>
        Your cities come to {nightsWord(placed)}. The trip is {nights}.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {onMakeNights && <Action onClick={() => onMakeNights(placed)}>Make the trip {nightsWord(placed)}</Action>}
        {onBalance && <Action onClick={onBalance}>Even out the nights</Action>}
      </div>
    </div>
  );
}

function SearchBox({ q, setQ }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      padding: "0 12px", height: 38, borderRadius: 12,
      background: C.white, border: `1px solid ${q ? C.p600 : C.div}`,
    }}>
      <SearchIcon size={15} color={q ? C.p600 : C.inact} style={{ flexShrink: 0 }} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a city"
        style={{
          flex: 1, minWidth: 0, border: "none", outline: "none", background: "none",
          fontFamily: "inherit", fontSize: 14, color: C.head, padding: 0,
        }}
      />
      {q && (
        <button onClick={() => setQ("")} aria-label="Clear search" style={{
          width: 20, height: 20, borderRadius: "50%", border: "none", background: C.bg,
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0, padding: 0,
        }}><XIcon size={12} color={C.sub} /></button>
      )}
    </div>
  );
}

// ─── The route, in one line ───
//
// Arrows between the cities rather than a heading saying they are in order: a
// label has to be read and believed, an arrow is just true. One row, so the
// cities underneath are not pushed off the screen by the summary of them.
function RouteStrip({ route, onEdit, onMap, onRemove }) {
  if (!route.length) return null;
  return (
    <>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
      <div
        className="hide-scrollbar"
        style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2, overflowX: "auto" }}
      >
        {route.map((s, i) => (
          <span key={s.city} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
            {i > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", margin: "0 1px", flexShrink: 0 }}>
                <span style={{ width: 9, height: 1.5, background: C.p300, borderRadius: 1 }} />
                <ArrowRight size={12} color={C.p300} strokeWidth={3} style={{ marginLeft: -5 }} />
              </span>
            )}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 4px 4px 10px", borderRadius: 999, background: C.p100,
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.p900 }}>{s.city}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.p600 }}>{s.n}n</span>
              <button
                onClick={() => onRemove(s.city)}
                aria-label={`Remove ${s.city}`}
                style={{
                  width: 17, height: 17, borderRadius: "50%", border: "none", padding: 0,
                  background: "rgba(137,18,62,0.12)", display: "grid", placeItems: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              ><XIcon size={10} color={C.p900} strokeWidth={3} /></button>
            </span>
          </span>
        ))}
      </div>
      <button
        onClick={onEdit}
        style={{
          flexShrink: 0, padding: "5px 10px", borderRadius: 999,
          border: `1.5px solid ${C.p600}`, background: C.white, color: C.p600,
          fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}
      ><Shuffle size={12} /> Edit</button>
    </div>

    {/* Its own line, and its own words. Squeezed in beside Edit as an icon it
        was one more small square on a row that is already busy with four
        cities, and nobody was going to find out what it did. */}
    <button
      onClick={onMap}
      style={{
        width: "100%", marginTop: 7, padding: "7px 11px", borderRadius: 10,
        border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
      }}
    >
      <MapIcon size={14} color={C.p600} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 12, fontWeight: 700, color: C.head }}>
        See the route on a map
      </span>
      <span style={{ flexShrink: 0, fontSize: 11, color: C.sub }}>
        {route.length} {route.length === 1 ? "city" : "cities"}
      </span>
      <ChevronRight size={14} color={C.inact} style={{ flexShrink: 0 }} />
    </button>
    </>
  );
}

// ─── Why the order is the order ───
//
// Route order is the part nobody has ever explained, and it is not arbitrary:
// a couple of the cities have the airport, the rest are a drive from one of
// them, and which end you start at decides how much of the holiday is spent in
// a car. So this says which cities those are, what the current order costs in
// travelling, and, when a better one exists, what it would save.
function OrderNote({ dest, cities, best, onUseBest }) {
  if (cities.length < 2) return null;
  const mins = travelMinutes(dest, cities);
  const bestMins = travelMinutes(dest, best);
  const better = best.join("|") !== cities.join("|") && bestMins < mins;
  const air = cities.filter((c) => airportCity(dest, c));

  // Named, not prescribed: Hoi An has no airport but you fly home from Da
  // Nang, 45 minutes down the road, so "the trip must start and finish at an
  // airport city" would be a tidy sentence and a false one. Which cities have
  // their own airport is the fact; what it costs in driving is the point.
  const airLine = air.length === 0
    ? `None of these cities has an airport of its own, so you land nearby and drive in at both ends.`
    : `${air.length === 1
      ? `${air[0]} is the only one with an airport of its own`
      : `${air.slice(0, -1).join(", ")} and ${air[air.length - 1]} have airports of their own`}. The others are a drive from the nearest one, which is why the order decides how much of the trip is spent getting about.`;

  return (
    <div style={{
      padding: "11px 13px", borderRadius: 14,
      background: better ? "#FFFAEB" : C.white,
      border: `1px solid ${better ? "#FEC84B" : C.div}`,
    }}>
      <div style={{ display: "flex", gap: 9 }}>
        <Plane size={14} color={better ? "#B54708" : "#1570EF"} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.sub }}>{airLine}</p>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 8 }}>
        <Clock size={14} color={C.inact} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.sub }}>
          This order is about <strong style={{ color: C.head, fontWeight: 700 }}>{hhmm(mins)}</strong> of travelling between cities.
          {better && ` Ours does it in about ${hhmm(bestMins)}.`}
        </p>
      </div>
      {better && (
        <button onClick={() => onUseBest(best)} style={{
          marginTop: 9, padding: "8px 13px", borderRadius: 999,
          border: `1.5px solid ${C.p600}`, background: C.white, color: C.p600,
          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}><Wand2 size={13} /> Use the quicker order</button>
      )}
    </div>
  );
}

// ─── The map, big ───
//
// The strip at the top of the builder frames the shape of the trip. This is
// for reading it: every leg spelled out underneath in the order you fly and
// drive them, with the airports at either end.
function MapSheet({ dest, route, inAir, outAir, onClose }) {
  const legs = route.slice(0, -1).map((s, i) => ({
    from: s.city, to: route[i + 1].city, leg: hop(dest, s.city, route[i + 1].city),
  }));
  const total = travelMinutes(dest, route.map((s) => s.city));

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 90, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.white, borderBottom: `1px solid ${C.div}` }}>
        <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <XIcon size={18} color={C.head} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Your route on the map</p>
          <p style={{ margin: "1px 0 0", fontSize: 11.5, color: C.sub }}>
            {route.length} cities · about {hhmm(total)} of travelling
          </p>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 0, isolation: "isolate", flexShrink: 0 }}>
        <RouteMap dest={dest} route={route} height={330} />
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `14px ${PAD}px 24px` }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "11px 13px", borderRadius: 13, background: C.white, border: `1px solid ${C.div}` }}>
          <Plane size={15} color="#1570EF" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 12, lineHeight: "17px", color: C.sub }}>
            You land at <strong style={{ color: C.head, fontWeight: 700 }}>{inAir ? `${inAir.name} (${inAir.code})` : route[0]?.city}</strong>
            {" "}and fly home from <strong style={{ color: C.head, fontWeight: 700 }}>{outAir ? `${outAir.name} (${outAir.code})` : route[route.length - 1]?.city}</strong>.
          </p>
        </div>

        {legs.map(({ from, to, leg }, i) => {
          const steps = leg?.steps || [];
          return (
            <div key={`${from}>${to}`} style={{
              marginTop: 10, padding: "11px 13px", borderRadius: 13,
              background: C.white, border: `1px solid ${C.div}`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: C.head }}>
                  {i + 1}. {from} to {to}
                </p>
                {leg?.mins ? (
                  <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.sub }}>
                    about {hhmm(leg.mins)}
                  </span>
                ) : null}
              </div>

              {/* Every leg of it, in order. One line saying "by air" hid a car
                  to the airport at each end, which is most of the day. */}
              {steps.length > 1 ? (
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 7 }}>
                  {steps.map((st, k) => {
                    const Icon = MODE_ICON[st.mode] || Car;
                    return (
                      <div key={`${st.from}>${st.to}-${k}`} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <span style={{ width: 22, height: 22, borderRadius: 7, background: C.bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Icon size={12} color={C.sub} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.head }}>{st.from} to {st.to}</p>
                          <p style={{ margin: "1px 0 0", fontSize: 11, color: C.sub }}>{st.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.sub }}>{leg?.label || "Transfer confirmed on booking"}</p>
              )}

              {leg?.note && (
                <div style={{
                  display: "flex", gap: 8, marginTop: 9, padding: "8px 10px", borderRadius: 10,
                  background: "#FFFAEB", border: "1px solid #FEC84B",
                }}>
                  <AlertTriangle size={13} color="#B54708" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 11, lineHeight: "16px", color: C.head }}>{leg.note}</p>
                </div>
              )}
            </div>
          );
        })}

        <p style={{ margin: "14px 2px 0", fontSize: 11, lineHeight: "16px", color: C.inact }}>
          Times are door to door and approximate. Your consultant confirms the exact car or flight before anything is booked.
        </p>
      </div>
    </div>
  );
}

// ─── Adding a city, at a particular point in the route ───
//
// Not a list of everywhere, but a list of everywhere that works from here.
// Phu Quoc between Hanoi and Hoi An is not a stop, it is a day of flying back
// through Saigon, so it is shown as unavailable with the reason on it rather
// than left out, which would only make a couple wonder where it went.
function AddCitySheet({ dest, areas, route, left, nights, gap, canInsert, onAdd, onLonger, onClose }) {
  const [q, setQ] = useState("");
  const [ask, setAsk] = useState(null);   // a city with nowhere to sleep yet
  const taken = new Set(route.map((s) => s.city));
  const before = gap > 0 ? route[gap - 1]?.city : null;
  const after = route[gap]?.city || null;
  const where = before && after ? `between ${before} and ${after}`
    : before ? `after ${before}` : after ? `before ${after}` : "in your route";

  const needle = q.trim().toLowerCase();
  const rest = areas
    .map((a, i) => ({ ...a, img: areaImg(dest, a.city, i) }))
    .filter((a) => !taken.has(a.city))
    .filter((a) => !needle || `${a.city} ${a.tag || ""}`.toLowerCase().includes(needle))
    .map((a) => ({ ...a, blocked: canInsert(a.city, gap) }));

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 95, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" }} onClick={onClose} />
      <div style={{ position: "relative", background: C.bg, borderRadius: "20px 20px 0 0", height: "80%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.div}`, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Add a city {where}</p>
              <p style={{ margin: "1px 0 0", fontSize: 11.5, color: C.sub }}>
                {left > 0 ? `${nightsWord(left)} still free` : `All ${nights} nights are taken`}
              </p>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <XIcon size={16} color={C.head} />
            </button>
          </div>
          <div style={{ marginTop: 10 }}><SearchBox q={q} setQ={setQ} /></div>
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: `12px ${PAD}px 20px`, display: "flex", flexDirection: "column", gap: 10 }}>
          {rest.length === 0 && (
            <p style={{ margin: "14px 0", fontSize: 13, color: C.sub, textAlign: "center" }}>
              {needle ? `Nothing left in ${dest} matches “${q}”.` : `Every city in ${dest} is already in your route.`}
            </p>
          )}
          {/* Out of nights is not the same as out of options: it is something
              we can offer to fix, in the same words the city list uses. */}
          {ask && (
            <div style={{ padding: "10px 12px", borderRadius: 12, background: "#FFFAEB", border: "1px solid #FEC84B" }}>
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.head }}>
                All {nights} nights are taken. Shorten a stay to fit {ask.city} in.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {onLonger && (
                  <button
                    onClick={() => { onLonger(ask.city, gap, ask.want); onClose(); }}
                    style={{
                      padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                      background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >Make it {nightsWord(nights + ask.want)}</button>
                )}
                <button onClick={() => setAsk(null)} style={{
                  padding: "6px 12px", borderRadius: 999, border: "none", background: "none",
                  color: C.sub, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>Got it</button>
              </div>
            </div>
          )}

          {rest.map((a) => {
            const off = !!a.blocked;
            const full = !off && left < 1;
            return (
              <button
                key={a.city}
                onClick={() => {
                  if (off) return;
                  if (full) { setAsk({ city: a.city, want: a.n || 1 }); return; }
                  onAdd(a.city, gap);
                  onClose();
                }}
                disabled={off}
                style={{
                  display: "flex", gap: 11, alignItems: "center", textAlign: "left",
                  padding: 10, borderRadius: 14, background: C.white, border: `1px solid ${C.div}`,
                  cursor: off ? "default" : "pointer", fontFamily: "inherit",
                }}
              >
                <img src={a.img} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#F4F2F0", filter: off ? "grayscale(1)" : "none", opacity: off ? 0.7 : 1 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: off ? C.sub : C.head }}>{a.city}</p>
                  <p style={{
                    margin: "2px 0 0", fontSize: 11.5, lineHeight: "16px",
                    color: off ? "#B54708" : C.sub,
                  }}>{off ? a.blocked : a.tag}</p>
                </div>
                {off
                  ? <AlertTriangle size={16} color="#B54708" style={{ flexShrink: 0 }} />
                  : <Plus size={18} color={full ? C.inact : C.p600} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── The builder ───
//
// Everything the step decides for you, opened up: the order, the nights in
// each city, which city to drop, which to add, which airport you land at and
// what each hop is really made of.
//
// It used to open on a map you had not asked for, under two paragraphs of
// grey. The map is one line now, and the screen is the thing you came here to
// change: a timeline you can pick up and reorder, with the airports at either
// end of it and the transfer between every pair.
function RouteBuilder({ dest, route, setRoute, setN, drop, add, addLonger, setNights, onBalance, wx, nights, onClose }) {
  const areas = destAreas[dest] || [];
  const total = routeNights(route);
  const left = nights - total;
  const cities = route.map((s) => s.city);
  const key = cities.join("|");
  const best = useMemo(() => bestOrder(dest, key.split("|")), [dest, key]);
  const travel = travelMinutes(dest, cities);
  const first = route[0]?.city;
  const last = route[route.length - 1]?.city;
  const inAir = first ? arrivalAirport(dest, first) : null;
  const outAir = last ? arrivalAirport(dest, last) : null;
  const openJaw = inAir && outAir && inAir.code !== outAir.code;

  const [note, setNote] = useState(null);
  const [drag, setDrag] = useState(null);
  const [bigMap, setBigMap] = useState(false);
  const [adding, setAdding] = useState(null);   // which gap is being filled
  const [openLeg, setOpenLeg] = useState(null); // which transfer is expanded
  const dragRef = useRef(null);
  const rows = useRef([]);
  const rects = useRef([]);

  const reorder = (arr, from, to) => {
    const c = [...arr];
    const [m] = c.splice(from, 1);
    c.splice(to, 0, m);
    return c;
  };

  const setOrder = (order) => setRoute((r) => order.map((c) => r.find((s) => s.city === c)).filter(Boolean));

  // ─── Where a city can go ───
  //
  // Returns nothing when the city fits at this point, and the reason when it
  // does not. Nights are not part of this answer: running out of them is
  // something we can offer to fix, and a point in the route that cannot be
  // flown is not.
  const whyNot = (city, gap) => {
    const trial = [...cities.slice(0, gap), city, ...cities.slice(gap)];
    const issue = routeIssue(dest, trial);
    if (!issue) return null;
    return issue.city === city
      ? `Only connects through ${issue.hubName}, so it has to sit beside ${issue.hub}`
      : `This would strand ${issue.city}, which only connects through ${issue.hubName}`;
  };
  const openGaps = useMemo(() => {
    const out = new Set();
    const rest = areas.map((a) => a.city).filter((c) => !cities.includes(c));
    for (let g = 0; g <= cities.length; g += 1) {
      if (rest.some((c) => !whyNot(c, g))) out.add(g);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dest, key, areas]);

  // Dropped in at a point that costs more travelling than its best point, the
  // city still goes in. We say what it cost and offer to move it.
  const insert = (city, gap) => {
    const options = [];
    for (let g = 0; g <= cities.length; g += 1) {
      if (!whyNot(city, g)) {
        options.push({ g, mins: travelMinutes(dest, [...cities.slice(0, g), city, ...cities.slice(g)]) });
      }
    }
    const here = options.find((x) => x.g === gap);
    const cheapest = options.slice().sort((a, b) => a.mins - b.mins)[0];
    add(city, gap);
    if (here && cheapest && cheapest.g !== gap && here.mins - cheapest.mins > 0) {
      const order = [...cities.slice(0, cheapest.g), city, ...cities.slice(cheapest.g)];
      const beside = cheapest.g === 0 ? `before ${cities[0]}` : `after ${cities[cheapest.g - 1]}`;
      setNote({
        kind: "warn",
        text: `${city} here adds about ${hhmm(here.mins - cheapest.mins)} more travelling than putting it ${beside}.`,
        move: order,
        moveLabel: `Put it ${beside}`,
      });
    } else {
      setNote(null);
    }
  };

  const applyMove = (from, to) => {
    if (to === from || to < 0 || to >= route.length) return;
    const next = reorder(cities, from, to);

    // Turned down: there is no way to fly it. Saying so is the whole point of
    // letting somebody drag in the first place.
    const issue = routeIssue(dest, next);
    if (issue) {
      setNote({
        kind: "block",
        text: `${issue.city} only connects through ${issue.hubName}. Away from ${issue.hub} in the order you fly back through it anyway, which is about ${hhmm(issue.extra)} and another sector on the bill. The order is unchanged.`,
      });
      return;
    }

    const before = travelMinutes(dest, cities);
    const after = travelMinutes(dest, next);
    setOrder(next);
    setNote(after > before
      ? {
        kind: "warn",
        text: `That takes the route back on itself: about ${hhmm(after - before)} more between cities, and the extra distance is on the bill as well as the clock.`,
        undo: cities,
      }
      : null);
  };

  const startDrag = (i) => (e) => {
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch { /* no active pointer */ }
    // Only the rows that are actually on screen: the ref array keeps its
    // slots when a city is removed, and a stale undefined in here was enough
    // to throw on the first drag after a delete.
    rects.current = rows.current.slice(0, route.length).map((el) => el?.getBoundingClientRect());
    const d = { from: i, to: i, dy: 0, y0: e.clientY };
    dragRef.current = d;
    setDrag(d);
  };
  const moveDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const r = rects.current;
    if (!r[d.from]) return;
    const dy = e.clientY - d.y0;
    const centre = r[d.from].top + dy + r[d.from].height / 2;
    const live = r.map((x, i) => (x ? i : -1)).filter((i) => i >= 0);
    if (!live.length) return;
    let to = d.from;
    if (centre < r[live[0]].top) to = live[0];
    else if (centre > r[live[live.length - 1]].bottom) to = live[live.length - 1];
    else {
      for (const i of live) {
        if (centre >= r[i].top && centre <= r[i].bottom) { to = i; break; }
      }
    }
    const next = { ...d, dy, to };
    dragRef.current = next;
    setDrag(next);
  };
  const endDrag = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (d) applyMove(d.from, d.to);
  };

  // While a card is held, the ones it is passing slide out of its way.
  const shift = (i) => {
    if (!drag) return 0;
    const h = rects.current[drag.from]?.height || 0;
    if (i === drag.from) return drag.dy;
    if (drag.to > drag.from && i > drag.from && i <= drag.to) return -h;
    if (drag.to < drag.from && i < drag.from && i >= drag.to) return h;
    return 0;
  };

  const RAIL = 36;

  // ─── Either end of the trip ───
  const AirNode = ({ label, air, city }) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0, zIndex: 1,
        background: "#EAF2FE", border: "2px solid #fff", boxShadow: "0 0 0 1px #D6E4FB",
        display: "grid", placeItems: "center",
      }}><Plane size={15} color="#1570EF" /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: C.inact }}>{label}</p>
        <p style={{ margin: "1px 0 0", fontSize: 13.5, fontWeight: 700, color: C.head }}>
          {air ? `${air.name} (${air.code})` : `${city} airport`}
        </p>
      </div>
    </div>
  );

  // ─── The join between two cities ───
  //
  // A line for the shape of it, and the legs underneath when somebody wants
  // them. "By air" on its own hid a car at each end, which is most of the day.
  const Transfer = ({ i, leg }) => {
    const steps = leg.steps || [];
    const Icon = MODE_ICON[leg.mode] || Car;
    const open = openLeg === i;
    // The sequence, not the set: road, air, road is three parts of a day and
    // collapsing the repeat made it read as two.
    const modes = steps.map((s) => (s.mode === "flight" ? "air" : s.mode === "boat" ? "boat" : "road"));
    return (
      <div style={{ paddingLeft: RAIL, paddingTop: 8, paddingBottom: 8 }}>
        <button
          onClick={() => setOpenLeg(open ? null : i)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "8px 11px", borderRadius: 11, cursor: "pointer", fontFamily: "inherit",
            background: C.white, border: `1px solid ${leg.note ? "#FEC84B" : C.div}`,
          }}
        >
          <Icon size={14} color={C.p600} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 11.5, fontWeight: 600, color: C.head }}>
            {hhmm(leg.mins)}
            <span style={{ fontWeight: 400, color: C.sub }}>
              {steps.length > 1 ? ` door to door · ${modes.join(", then ")}` : ` by ${modes[0]}`}
            </span>
          </span>
          {steps.length > 1 && (
            <ChevronDown size={14} color={C.inact} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .18s" }} />
          )}
        </button>

        {open && steps.length > 1 && (
          <div style={{ marginTop: 7, padding: "9px 11px", borderRadius: 11, background: C.white, border: `1px solid ${C.div}` }}>
            {steps.map((st, k) => {
              const StepIcon = MODE_ICON[st.mode] || Car;
              return (
                <div key={`${st.from}>${st.to}-${k}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: k ? 8 : 0 }}>
                  <StepIcon size={12} color={C.sub} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: C.head }}>{st.from} to {st.to}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 11, color: C.sub }}>{st.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {leg.note && (
          <div style={{ display: "flex", gap: 8, marginTop: 7, padding: "8px 11px", borderRadius: 11, background: "#FFFAEB", border: "1px solid #FEC84B" }}>
            <AlertTriangle size={13} color="#B54708" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 11, lineHeight: "16px", color: C.head }}>{leg.note}</p>
          </div>
        )}
      </div>
    );
  };

  // ─── Somewhere a city could go ───
  const Insert = ({ gap }) => {
    const open = openGaps.has(gap);
    const where = gap === 0 ? `before ${cities[0]}`
      : gap === cities.length ? `after ${cities[cities.length - 1]}`
        : `between ${cities[gap - 1]} and ${cities[gap]}`;
    return (
      <div style={{ paddingLeft: RAIL, paddingBottom: 8 }}>
        <button
          onClick={() => (open ? setAdding(gap) : setNote({
            kind: "block",
            text: `Nothing can go in ${where}. The cities left all connect through somewhere, so they have to sit beside it.`,
          }))}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 11px 5px 8px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
            border: `1.5px ${open ? "solid" : "dashed"} ${open ? C.p300 : C.icon}`,
            background: open ? "#FFF6F9" : C.white,
            color: open ? C.p600 : C.inact, fontSize: 11.5, fontWeight: 700,
          }}
        ><Plus size={13} strokeWidth={3} /> Add a city</button>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, background: "#FBFAFB", display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.white, borderBottom: `1px solid ${C.div}` }}>
        <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <XIcon size={18} color={C.head} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Edit route</p>
          <p style={{ margin: "1px 0 0", fontSize: 11.5, color: total === nights ? C.sub : "#B42318", fontWeight: total === nights ? 400 : 700 }}>
            {route.length} {route.length === 1 ? "city" : "cities"} · {nightsWord(total)}
            {total !== nights && ` of ${nights}`}
          </p>
        </div>
      </div>

      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", touchAction: drag ? "none" : "auto", padding: `12px ${PAD}px 24px` }}>
        {/* The map is a line, not the screen. Somebody who taps Edit route has
            come to change the order, not to look at Vietnam. */}
        <button
          onClick={() => setBigMap(true)}
          style={{
            width: "100%", padding: "9px 11px", borderRadius: 12, cursor: "pointer",
            border: `1px solid ${C.div}`, background: C.white, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 9,
          }}
        >
          <MapIcon size={15} color={C.p600} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, textAlign: "left", fontSize: 12.5, fontWeight: 700, color: C.head }}>
            See the route on a map
          </span>
          <span style={{ flexShrink: 0, fontSize: 11, color: C.sub }}>about {hhmm(travel)} of travel</span>
          <ChevronRight size={14} color={C.inact} style={{ flexShrink: 0 }} />
        </button>

        <div style={{ marginTop: 10 }}>
          <OrderNote dest={dest} cities={cities} best={best} onUseBest={(o) => { setOrder(o); setNote(null); }} />
        </div>
        <NightsNote placed={total} nights={nights} onMakeNights={setNights} onBalance={onBalance} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 2px 10px" }}>
          <p style={{ margin: 0, flex: 1, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: C.inact }}>
            Your cities, in order
          </p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.inact }}>
            <GripVertical size={12} color={C.icon} /> hold to move
          </span>
        </div>

        {/* The trip as one line down the page, from the airport you land at to
            the one you fly home from. */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 15, top: 16, bottom: 16, width: 2, background: C.div, borderRadius: 2 }} />

          <AirNode label="You land at" air={inAir} city={first} />
          {openJaw && (
            <p style={{ margin: "7px 0 0", paddingLeft: RAIL, fontSize: 11, lineHeight: "16px", color: C.sub }}>
              You land in one city and fly home from another. We book it that way, so there is no doubling back.
            </p>
          )}

          <div style={{ height: 10 }} />
          <Insert gap={0} />

          {route.map((s, i) => {
            // The photo belongs to the city, not to its position in the
            // route. Keyed off the route index, reordering swapped the
            // pictures round.
            const ai = Math.max(0, areas.findIndex((a) => a.city === s.city));
            const next = route[i + 1];
            const leg = next ? hop(dest, s.city, next.city) : null;
            const held = drag?.from === i;
            return (
              <div
                key={s.city}
                ref={(el) => { rows.current[i] = el; }}
                style={{
                  transform: `translateY(${shift(i)}px)`,
                  transition: held ? "none" : "transform .18s ease",
                  position: "relative", zIndex: held ? 5 : 1,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* The number is the handle. It sits on the line, where the
                      order lives, and it is the biggest thing on the left. */}
                  <span
                    onPointerDown={startDrag(i)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    role="button"
                    aria-label={`Reorder ${s.city}`}
                    style={{
                      width: 32, flexShrink: 0, paddingTop: 5, paddingBottom: 5, borderRadius: 11,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      background: held ? C.p600 : C.p100,
                      border: `2px solid ${held ? C.p600 : "#fff"}`,
                      boxShadow: held ? "0 4px 12px rgba(227,27,83,.35)" : "0 0 0 1px #F7CEDC",
                      cursor: "grab", touchAction: "none", zIndex: 1,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: held ? "#fff" : C.p900, lineHeight: 1 }}>{i + 1}</span>
                    <GripVertical size={12} color={held ? "#fff" : C.p300} />
                  </span>

                  <div style={{
                    flex: 1, minWidth: 0, background: C.white, borderRadius: 14, padding: 11,
                    border: `1px solid ${held ? C.p600 : C.div}`,
                    boxShadow: held ? "0 8px 22px rgba(24,29,39,0.18)" : "0 1px 2px rgba(24,29,39,0.04)",
                  }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <img src={areaImg(dest, s.city, ai)} alt="" style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#F4F2F0" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 800, color: C.head, letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {s.city}
                          </span>
                          <button
                            onClick={() => drop(s.city)}
                            disabled={route.length < 2}
                            aria-label={`Remove ${s.city}`}
                            style={{
                              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                              border: "none", background: "none", display: "grid", placeItems: "center",
                              cursor: route.length > 1 ? "pointer" : "default",
                              opacity: route.length > 1 ? 1 : 0.3, padding: 0,
                            }}
                          ><Trash2 size={15} color={C.inact} /></button>
                        </div>
                        <div style={{ marginTop: 4 }}><WeatherChip wx={wx} /></div>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, paddingTop: 9, borderTop: `1px solid ${C.div}`, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 11, color: C.inact }}>Nights here</span>
                      <Nights
                        n={s.n}
                        onChange={(n) => setN(s.city, n)}
                        canAdd={left > 0}
                        onBlocked={() => setNote({
                          kind: "block",
                          text: `All ${nights} nights are taken. Shorten another stay to give ${s.city} one more.`,
                          longer: { want: 1, city: s.city },
                        })}
                      />
                    </div>
                  </div>
                </div>

                {leg && <Transfer i={i} leg={leg} />}
                {!leg && <div style={{ height: 8 }} />}
                <Insert gap={i + 1} />
              </div>
            );
          })}

          <AirNode label="You fly home from" air={outAir} city={last} />
        </div>

        <p style={{ margin: "16px 2px 0", fontSize: 11, lineHeight: "16px", color: C.inact }}>
          Transfer times are door to door and approximate. Your consultant confirms the exact car or flight before anything is booked.
        </p>
      </div>

      <div style={{ flexShrink: 0, background: C.white, borderTop: `1px solid ${C.div}`, padding: `10px ${PAD}px calc(12px + env(safe-area-inset-bottom))` }}>
        {note && (
          <div style={{
            marginBottom: 10, padding: "10px 12px", borderRadius: 12,
            background: note.kind === "block" ? "#FEF3F2" : "#FFFAEB",
            border: `1px solid ${note.kind === "block" ? "#FDA29B" : "#FEC84B"}`,
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <AlertTriangle size={14} color={note.kind === "block" ? "#B42318" : "#B54708"} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.head }}>{note.text}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {note.undo && (
                <button onClick={() => { setOrder(note.undo); setNote(null); }} style={{
                  padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                  background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}><Undo2 size={13} /> Put it back</button>
              )}
              {note.move && (
                <button onClick={() => { setOrder(note.move); setNote(null); }} style={{
                  padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                  background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{note.moveLabel}</button>
              )}
              {note.longer && (
                <button
                  onClick={() => {
                    setNights(nights + note.longer.want);
                    setN(note.longer.city, (route.find((s) => s.city === note.longer.city)?.n || 1) + note.longer.want);
                    setNote(null);
                  }}
                  style={{
                    padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                    background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >Make it {nightsWord(nights + note.longer.want)}</button>
              )}
              <button onClick={() => setNote(null)} style={{
                padding: "6px 12px", borderRadius: 999, border: "none", background: "none",
                color: C.sub, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{note.undo || note.move || note.longer ? "Keep it" : "Got it"}</button>
            </div>
          </div>
        )}
        <button onClick={onClose} style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: C.p600, color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>Done</button>
      </div>

      {bigMap && (
        <MapSheet dest={dest} route={route} inAir={inAir} outAir={outAir} onClose={() => setBigMap(false)} />
      )}
      {adding != null && (
        <AddCitySheet
          dest={dest} areas={areas} route={route} left={left} nights={nights}
          gap={adding} canInsert={whyNot} onAdd={insert} onLonger={addLonger}
          onClose={() => setAdding(null)}
        />
      )}
    </div>
  );
}

export default function RoutePicker({ dest, nights, startDate, route, setRoute, setNights, nudge }) {
  const areas = useMemo(() => destAreas[dest] || [], [dest]);
  const [builder, setBuilder] = useState(false);
  const [info, setInfo] = useState(false);
  const [q, setQ] = useState("");
  // The region page opens over the step rather than navigating to it. Leaving
  // the wizard loses every answer given so far, and reading about Ubud is not
  // a reason to start again.
  const [reading, setReading] = useState(null);
  const [fitNote, setFitNote] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  // Said when it is asked for. A banner that sits there from the first tap is
  // a telling-off nobody has earned yet; the same words, the moment somebody
  // pushes the greyed button, are an answer.
  const [asked, setAsked] = useState(false);

  const wx = useMemo(() => monthFor(dest, startDate), [dest, startDate]);
  const picked = useMemo(() => new Map(route.map((r) => [r.city, r.n])), [route]);
  const placed = routeNights(route);
  const left = nights - placed;

  useEffect(() => { if (nudge) setAsked(true); }, [nudge]);
  // Any change to the route is an answer to the question, so the question
  // goes away. It comes back if they push the greyed button again.
  useEffect(() => { setAsked(false); }, [route]);
  useEffect(() => { if (placed >= nights) setAsked(false); }, [placed, nights]);

  const cards = useMemo(
    () => areas.map((a, i) => ({ ...a, img: areaImg(dest, a.city, i) })),
    [areas, dest]
  );
  // Chosen cities first, in the order the trip runs them, then the rest. The
  // list can be a dozen long; what somebody has already decided should not be
  // something they scroll to find.
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? cards.filter((a) => `${a.city} ${a.tag || ""}`.toLowerCase().includes(needle))
      : cards;
    const order = route.map((s) => s.city);
    const rank = (a) => (order.includes(a.city) ? order.indexOf(a.city) : 1000 + cards.indexOf(a));
    return [...list].sort((a, b) => rank(a) - rank(b));
  }, [cards, q, route]);

  const rec = useMemo(() => Object.fromEntries(areas.map((a) => [a.city, a.n])), [areas]);
  const canonical = useMemo(() => areas.map((a) => a.city), [areas]);
  // Which cities have had their nights set by hand. Kept out of state on
  // purpose: it changes nothing on screen by itself, it only tells the night
  // sharing which stops to leave alone.
  const manual = useRef(new Set());

  const toggle = (area) => {
    const has = route.some((s) => s.city === area.city);
    // Nothing is dimmed on the list, so the "it will not fit" answer is given
    // here, once, where the route is, rather than printed on half the cards.
    if (!has && left < 1) {
      setFitNote({ city: area.city, want: area.n || 1 });
      return;
    }
    setFitNote(null);
    setRoute((r) => {
      manual.current.delete(area.city);
      // New cities go in the order we would run them, not the order they were
      // tapped, so the route stays sensible without anyone having to think
      // about it.
      const cities = has
        ? r.filter((s) => s.city !== area.city).map((s) => s.city)
        : [...r.map((s) => s.city), area.city].sort((a, b) => canonical.indexOf(a) - canonical.indexOf(b));
      return rebuild(cities, r, rec, nights, manual.current);
    });
  };

  // From inside the builder, where the order is the couple's own: the new city
  // goes exactly where they dropped it rather than back into our order, and
  // takes whatever nights are still free, up to what we would suggest for it.
  const addAt = (city, gap) => {
    manual.current.delete(city);
    setRoute((r) => {
      if (r.some((s) => s.city === city)) return r;
      const spare = nights - routeNights(r);
      if (spare < 1) return r;
      const stop = { city, n: Math.min(spare, rec[city] ?? 2) };
      const at = Math.max(0, Math.min(gap ?? r.length, r.length));
      return [...r.slice(0, at), stop, ...r.slice(at)];
    });
  };

  // A city added from the builder when the trip is already full: the nights
  // for it are added to the trip, the same bargain the city list offers.
  const addLonger = (city, gap, want) => {
    const n = nights + want;
    setNights(n);
    manual.current.delete(city);
    setRoute((r) => {
      if (r.some((s) => s.city === city)) return r;
      const at = Math.max(0, Math.min(gap ?? r.length, r.length));
      return [...r.slice(0, at), { city, n: want }, ...r.slice(at)];
    });
  };

  // A night changed by hand is a night the couple meant, so nothing is
  // redistributed underneath it.
  const setCityNights = (city, n) => {
    manual.current.add(city);
    setRoute((r) => r.map((s) => (s.city === city ? { ...s, n: Math.max(1, n) } : s)));
  };

  // Taking a city out, from its cross on the route or the bin in the builder,
  // frees its nights for the cities that are left.
  const dropCity = (city) => {
    manual.current.delete(city);
    setRoute((r) => rebuild(r.filter((s) => s.city !== city).map((s) => s.city), r, rec, nights, manual.current));
  };

  // Asked for the nights and the city in one tap, because that is what the
  // button is for: tapping "Make it 11 nights" and then having to go and find
  // Hoi An again is the screen forgetting what the question was.
  const lengthenFor = ({ city, want, kind }) => {
    const n = nights + want;
    setNights(n);
    setFitNote(null);
    // One more night in a city already in the trip: the extra night is theirs
    // by hand, so it stays where it was asked for.
    if (kind === "more") {
      manual.current.add(city);
      setRoute((r) => r.map((s) => (s.city === city ? { ...s, n: s.n + want } : s)));
      return;
    }
    manual.current.delete(city);
    setRoute((r) => {
      if (r.some((s) => s.city === city)) return r;
      const cities = [...r.map((s) => s.city), city]
        .sort((a, b) => canonical.indexOf(a) - canonical.indexOf(b));
      // Balanced, not just rebuilt: somebody who has asked for a longer trip
      // to fit a city in should land on a trip that is exactly that long.
      return balance(rebuild(cities, r, rec, n, manual.current), n);
    });
  };

  // "Even out the nights": the trip is the length the dates say, so we take
  // the nights back off the longest stays, or hand the spare ones to them.
  const balanceNights = () => {
    manual.current.clear();
    setRoute((r) => balance(r, nights));
  };

  return (
    <div>
      <div style={{ padding: `18px ${PAD}px 0` }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: 7 }}>
          Choose the cities you want to visit
          <button
            onClick={() => setInfo((v) => !v)}
            aria-label="How this works"
            style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0, padding: 0,
              border: "none", background: info ? C.p100 : "transparent",
              display: "grid", placeItems: "center", cursor: "pointer",
            }}
          ><Info size={16} color={info ? C.p600 : C.inact} /></button>
        </h1>
        {info && (
          <p style={{
            margin: "9px 0 0", padding: "10px 12px", borderRadius: 12,
            background: C.p100, fontSize: 12.5, lineHeight: "18px", color: C.head,
          }}>
            We put them in the best order and split your {nights} nights. You can change both.
          </p>
        )}
      </div>

      <div style={{
        position: "sticky", top: 0, zIndex: 20, marginTop: 12,
        background: C.white, borderBottom: `1px solid ${C.div}`,
        padding: `10px ${PAD}px 11px`,
        boxShadow: "0 2px 10px rgba(24,29,39,0.05)",
      }}>
        <SearchBox q={q} setQ={setQ} />

        {/* With nothing picked there is no route to show, so the row carries
            the way out instead: both live at the top, where they are seen,
            rather than under a list nobody scrolls to the end of. */}
        {route.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 10 }}>
            <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 11.5, color: C.sub }}>
              Not sure where to go?
            </p>
            <button
              onClick={() => { manual.current.clear(); setRoute(recommendedRoute(dest, nights)); }}
              style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 999,
                border: `1.5px solid ${C.p600}`, background: C.white, color: C.p600,
                fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}
            ><Wand size={12} /> You choose for me</button>
          </div>
        ) : (
          <RouteStrip
            route={route}
            onEdit={() => setBuilder(true)}
            onMap={() => setMapOpen(true)}
            onRemove={dropCity}
          />
        )}
        {fitNote && (
          <div style={{
            marginTop: 9, padding: "9px 11px", borderRadius: 11,
            background: "#FFFAEB", border: "1px solid #FEC84B",
            display: "flex", gap: 9, alignItems: "flex-start",
          }}>
            <AlertTriangle size={14} color="#B54708" style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: "16px", color: C.head }}>
                All {nights} nights are taken. {fitNote.kind === "more"
                  ? `Shorten another stay to give ${fitNote.city} one more.`
                  : `Shorten a stay to fit ${fitNote.city} in.`}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {setNights && (
                  <button
                    onClick={() => { lengthenFor(fitNote); setFitNote(null); }}
                    style={{
                      padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                      background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >Make it {nightsWord(nights + fitNote.want)}</button>
                )}
                <button onClick={() => setFitNote(null)} style={{
                  padding: "6px 10px", borderRadius: 999, border: "none", background: "none",
                  color: C.sub, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}>Got it</button>
              </div>
            </div>
          </div>
        )}
        {asked && placed < nights && (
          <div style={{
            marginTop: 9, padding: "9px 11px", borderRadius: 11,
            background: "#FFFAEB", border: "1px solid #FEC84B",
            display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap",
          }}>
            <p style={{ margin: 0, flex: 1, minWidth: 150, fontSize: 11.5, lineHeight: "16px", color: C.head }}>
              {route.length === 0
                ? `Pick a city to start. Your trip is ${nightsWord(nights)}.`
                : `${nightsWord(nights - placed)} still to place. Add a city, or stay longer somewhere.`}
            </p>
            {route.length > 0 && (
              <button onClick={balanceNights} style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${C.p600}`,
                background: C.white, color: C.p600, fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>Spread them out</button>
            )}
          </div>
        )}
        <NightsNote placed={placed} nights={nights} onMakeNights={setNights} onBalance={balanceNights} />
      </div>

      <div style={{ padding: `14px ${PAD}px 24px` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shown.map((a) => (
            <PlaceCard
              key={a.city}
              dest={dest}
              area={a}
              wx={wx}
              picked={picked.has(a.city)}
              nights={picked.get(a.city)}
              left={left}
              onToggle={() => toggle(a)}
              onNights={(n) => setCityNights(a.city, n)}
              onNeedNight={() => setFitNote({ city: a.city, want: 1, kind: "more" })}
              onOpen={() => setReading(a.city)}
            />
          ))}
          {shown.length === 0 && (
            <p style={{ margin: "14px 0", fontSize: 13, color: C.sub, textAlign: "center" }}>
              Nothing in {dest} matches &ldquo;{q}&rdquo;.
            </p>
          )}
        </div>
      </div>

      {/* Over the step, and over the sticky bar with it: the search row
          sitting on top of the region video was the bar painting through an
          overlay that had no layer of its own. */}
      {reading && (
        <div style={{ position: "absolute", inset: 0, zIndex: 120 }}>
          <RegionDetail dest={dest} city={reading} onClose={() => setReading(null)} />
        </div>
      )}

      {mapOpen && route.length > 0 && (
        <MapSheet
          dest={dest}
          route={route}
          inAir={arrivalAirport(dest, route[0].city)}
          outAir={arrivalAirport(dest, route[route.length - 1].city)}
          onClose={() => setMapOpen(false)}
        />
      )}

      {builder && route.length > 0 && (
        <RouteBuilder
          dest={dest}
          route={route}
          setRoute={setRoute}
          setN={setCityNights}
          drop={dropCity}
          add={addAt}
          addLonger={addLonger}
          setNights={setNights}
          onBalance={balanceNights}
          wx={wx}
          nights={nights}
          onClose={() => setBuilder(false)}
        />
      )}
    </div>
  );
}
