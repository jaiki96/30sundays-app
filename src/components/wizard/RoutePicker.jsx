import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, X, Plus, Check, AlertTriangle } from "lucide-react";
import { C } from "../../data";
import { destAreas, areaImg, cityCoords } from "../../data/buildData";
import { pickTag } from "../../data/routeBuilder";
import { regionDetail } from "../../data/regionData";
import RegionDetail from "../../pages/RegionDetail";

// ─── Choose the cities ───
//
// One question: where do you want to stay. The screen used to ask four at once.
// Every card carried the weather, a nightly rate, two tags, a suggestion, and a
// dial for setting that city's nights by hand; above them sat a route strip, an
// order note, a fit warning, a nights warning and an info panel, and behind it
// all a drag-and-drop route builder. A couple picking Ubud does not need nine
// surfaces to do it in.
//
// So: a search box, a list of cities, and a map. A card is a picture, a name, a
// line and a tag. One line at the foot says whether what they have chosen fits
// the trip, which is the only thing the warnings were ever really saying.
//
// The order and the nights are ours to work out, as they always were, and the
// itinerary screen is where either gets changed afterwards.

const PAD = 16;

// ─── Sharing the nights out ───
//
// Our suggested length per city, scaled to fit the trip they have booked, with
// the remainder going to the longer stays first so nothing ends up at nought.
function split(cities, rec, target) {
  if (!cities.length) return [];
  const want = cities.map((c) => Math.max(1, rec[c] ?? 2));
  const total = want.reduce((a, b) => a + b, 0);
  const out = cities.map((c, i) => ({
    city: c,
    n: Math.max(1, Math.round((want[i] / total) * target)),
  }));
  // Rounding never lands on the target, so the difference is handed to, or
  // taken from, the longest stays until it does.
  let diff = target - out.reduce((a, b) => a + b.n, 0);
  const order = [...out.keys()].sort((a, b) => out[b].n - out[a].n);
  let guard = 0;
  while (diff !== 0 && guard < 500) {
    for (const i of order) {
      if (diff === 0) break;
      if (diff > 0) { out[i].n += 1; diff -= 1; }
      else if (out[i].n > 1) { out[i].n -= 1; diff += 1; }
    }
    guard += 1;
  }
  return out;
}

// ─── Does it fit ───
//
// Not "are all your nights allocated", which they always are, but "do the
// places you have chosen want more or less time than you have". That is the
// question a couple is actually getting wrong, and the only one worth a line.
function fit(route, rec, nights) {
  if (!route.length) {
    return { kind: "empty", text: `Pick a city to start. Your trip is ${nights} nights.` };
  }
  const want = route.reduce((t, s) => t + Math.max(1, rec[s.city] ?? 2), 0);
  const over = want - nights;
  if (over > 1) return { kind: "over", text: "Too much to see, too little time." };
  if (over < -1) {
    const spare = -over;
    return { kind: "under", text: `${spare} ${spare === 1 ? "night" : "nights"} spare, keep adding.` };
  }
  return { kind: "good", text: "Just about the right length." };
}

// ─── The map ───
//
// Full bleed, the way a listing app does it, and the cities are their own names
// rather than numbered dots: a pin reading "2" is a puzzle, and the name is
// both the label and the answer. Picked cities carry the brand colour and a
// tick, so the map is a way of choosing rather than a picture of what you chose.
const namePin = (name, picked, open) => L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-50%) scale(${open ? 1.08 : 1});
      transition:transform .14s ease;
      display:inline-flex;align-items:center;gap:4px;
      white-space:nowrap;padding:6px 11px;border-radius:999px;
      background:${picked ? C.p600 : "#fff"};color:${picked ? "#fff" : C.head};
      box-shadow:${open ? "0 4px 14px rgba(16,24,40,0.4)" : "0 2px 8px rgba(16,24,40,0.28)"};
      font-family:Figtree,sans-serif;font-size:12.5px;font-weight:700">
      ${picked ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ""}
      ${name}
    </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Leaflet measures its container once and caches it. Growing the map when a
// card opens leaves the new area unpainted until it is told, which showed as
// flat blue below the old bottom edge.
function Resize({ on }) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(id);
  }, [map, on]);
  return null;
}

function CityMap({ dest, cards, picked, onToggle, onOpen, height, onFocus }) {
  const pins = useMemo(() => cards.filter((a) => cityCoords[a.city]), [cards]);
  const [sel, setSel] = useState(null);
  const chosen = pins.find((p) => p.city === sel);
  // Only for the one that is open, because working out a region is not free.
  const imgs = useMemo(() => {
    if (!chosen) return [];
    const photos = regionDetail(dest, chosen.city)?.photos || [];
    return (photos.length ? photos : [chosen.img]).filter(Boolean).slice(0, 5);
  }, [dest, chosen]);

  // A card open over the map is the whole screen, so the step hides its list
  // and the wizard stands its button down until the card is answered or shut.
  useEffect(() => { onFocus?.(!!chosen); }, [chosen, onFocus]);
  useEffect(() => () => onFocus?.(false), [onFocus]);

  // ─── What the opening view fits ───
  //
  // Not every pin. Bali's list runs to Labuan Bajo, five hundred kilometres
  // east in Flores, and fitting that put the six cities people actually choose
  // between into one overlapping blob off the corner of Java. So the outlier is
  // left out of the fit and stays on the map, a zoom out away: anything more
  // than three times the median distance from the middle of the cluster. A
  // country that is genuinely spread out, like Vietnam, keeps all of itself
  // because none of its cities is an outlier against the others.
  const span = useMemo(() => {
    const pts = pins.map((p) => cityCoords[p.city]);
    const mid = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    const c = { lat: mid(pts.map((p) => p.lat)), lng: mid(pts.map((p) => p.lng)) };
    const away = pts.map((p) => Math.hypot(p.lat - c.lat, p.lng - c.lng));
    const typical = mid(away) || 0.1;
    const core = pts.filter((_, i) => away[i] <= typical * 3);
    const use = core.length >= 2 ? core : pts;
    const lat = use.map((x) => x.lat);
    const lng = use.map((x) => x.lng);
    const pad = Math.max(0.12, (Math.max(...lat) - Math.min(...lat)) * 0.25);
    return [
      [Math.min(...lat) - pad, Math.min(...lng) - pad],
      [Math.max(...lat) + pad, Math.max(...lng) + pad],
    ];
  }, [pins]);

  // position and zIndex together give Leaflet its own stacking context. Its
  // panes sit at z-index 200 to 700 internally, and without a context of their
  // own they draw straight through any page opened over this step.
  return (
    <div style={{ position: "relative", zIndex: 0, height, background: "#AADAFF" }}>
      <MapContainer
        bounds={span}
        style={{ height: "100%", width: "100%", background: "#AADAFF" }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Resize on={height} />
        {pins.map((p) => (
          <Marker
            key={p.city}
            position={[cityCoords[p.city].lat, cityCoords[p.city].lng]}
            icon={namePin(p.city, picked.has(p.city), sel === p.city)}
            zIndexOffset={sel === p.city ? 1000 : picked.has(p.city) ? 500 : 0}
            eventHandlers={{ click: () => setSel(p.city) }}
          />
        ))}
      </MapContainer>

      {/* The card floats over the map rather than pushing it, the way a
          listing does, and it comes up from under the bottom edge. */}
      {chosen && (
        <div style={{
          position: "absolute", left: 12, right: 12, bottom: 14, zIndex: 650,
          animation: "sheetSlideUp 0.24s cubic-bezier(0.22,0.61,0.36,1)",
        }}>
          <MapCard
            area={chosen}
            imgs={imgs}
            picked={picked.has(chosen.city)}
            onToggle={() => { onToggle(chosen); setSel(null); }}
            onOpen={() => onOpen(chosen.city)}
            onClose={() => setSel(null)}
          />
        </div>
      )}
    </div>
  );
}

// ─── The card a pin raises ───
//
// The same shape the listing apps use: a reel of photographs you swipe with
// dots under them, the name and a line, one tag, and the two things you can do
// about it. Tapping the picture or the name opens the full region page, which
// has the same Add button at the foot of it, so reading about a place and
// choosing it are never two separate errands.
function CardReel({ imgs, alt, height = 150 }) {
  const [i, setI] = useState(0);
  const onScroll = (e) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== i) setI(next);
  };
  return (
    <div style={{ position: "relative", height, background: "#F4F2F0" }}>
      <div
        className="hide-scrollbar"
        onScroll={onScroll}
        style={{
          display: "flex", height: "100%", overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}
      >
        {imgs.map((src, n) => (
          <div key={n} style={{ flex: "0 0 100%", width: "100%", height: "100%", scrollSnapAlign: "start" }}>
            <img src={src} alt={n === 0 ? alt : ""} loading={n === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
      {imgs.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 8,
          display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none",
        }}>
          {imgs.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 6 : 4.5, height: n === i ? 6 : 4.5, borderRadius: "50%",
              background: n === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function MapCard({ area, imgs, picked, onToggle, onOpen, onClose }) {
  const tag = pickTag(area.dest, area.city);
  const round = {
    position: "absolute", top: 9, width: 28, height: 28, borderRadius: "50%",
    border: "none", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(6px)",
    display: "grid", placeItems: "center", cursor: "pointer", padding: 0,
    boxShadow: "0 2px 8px rgba(16,24,40,0.2)",
  };

  return (
    <div style={{
      position: "relative", background: C.white, borderRadius: 16, overflow: "hidden",
      boxShadow: "0 8px 28px rgba(16,24,40,0.24)",
    }}>
      {/* The whole card is the way into the region page, which is where the
          real Add button lives. Here it is a mark in the corner rather than a
          button across the bottom: the card is for reading, not for a form. */}
      <div onClick={onOpen} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(); } }}
        style={{ cursor: "pointer" }}>
        <CardReel imgs={imgs} alt={area.city} />

        <div style={{ padding: "11px 13px 13px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {area.city}
            </span>
            {tag && (
              <span style={{
                flexShrink: 0, background: C.p100, color: C.p900, borderRadius: 999, padding: "3px 9px",
                fontSize: 10, fontWeight: 800, letterSpacing: "0.3px", textTransform: "uppercase",
              }}>{tag}</span>
            )}
          </div>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, lineHeight: "18px", color: C.sub }}>
            {area.tag}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        aria-label={picked ? `Remove ${area.city}` : `Add ${area.city}`}
        style={{
          ...round, left: 9,
          background: picked ? C.p600 : "rgba(255,255,255,0.94)",
        }}
      >
        {picked
          ? <Check size={15} strokeWidth={3.5} color="#fff" />
          : <Plus size={15} strokeWidth={3} color={C.head} />}
      </button>

      <button onClick={onClose} aria-label="Close" style={{ ...round, right: 9 }}>
        <X size={15} color={C.head} />
      </button>
    </div>
  );
}

// ─── One city ───
//
// Picture, name, one line, one tag. The whole card opens the region page,
// because that is what somebody wants when they are deciding; the plus is the
// only thing on it that chooses.
function CityCard({ dest, area, picked, onToggle, onOpen }) {
  const tag = pickTag(dest, area.city);
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onOpen(); } }}
      style={{
        display: "flex", gap: 12, padding: 11, cursor: "pointer",
        borderRadius: 16, background: C.white,
        border: `${picked ? 1.5 : 1}px solid ${picked ? C.p600 : C.div}`,
        boxShadow: "0 1px 3px rgba(24,29,39,0.05)",
        transition: "border-color .15s",
      }}
    >
      <img src={area.img} alt="" style={{ width: 84, height: 84, borderRadius: 12, objectFit: "cover", flexShrink: 0, background: "#F4F2F0" }} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 800, color: C.head, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {area.city}
          </span>
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
          margin: "2px 0 0", fontSize: 12, lineHeight: "17px", color: C.sub,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{area.tag}</p>

        <span style={{ flex: 1 }} />

        {tag && (
          <span style={{
            alignSelf: "flex-start", marginTop: 7,
            background: C.p100, color: C.p900, borderRadius: 999, padding: "3px 9px",
            fontSize: 10, fontWeight: 800, letterSpacing: "0.3px", textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>{tag}</span>
        )}
      </div>
    </div>
  );
}

export default function RoutePicker({ dest, nights, route, setRoute, nudge, onFocus }) {
  const areas = useMemo(() => destAreas[dest] || [], [dest]);
  const [q, setQ] = useState("");
  // The region page opens over the step rather than navigating to it. Leaving
  // the wizard loses every answer given so far, and reading about Ubud is not
  // a reason to start again.
  const [reading, setReading] = useState(null);

  const cards = useMemo(
    () => areas.map((a, i) => ({ ...a, dest, img: areaImg(dest, a.city, i) })),
    [areas, dest]
  );
  const rec = useMemo(() => Object.fromEntries(areas.map((a) => [a.city, a.n])), [areas]);
  const canonical = useMemo(() => areas.map((a) => a.city), [areas]);
  const picked = useMemo(() => new Set(route.map((r) => r.city)), [route]);
  const note = useMemo(() => fit(route, rec, nights), [route, rec, nights]);

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

  const seen = useRef(false);
  if (nudge) seen.current = true;

  // ─── How tall the map is ───
  //
  // All of the step bar a strip, so the sheet peeks at the bottom the way a
  // listing app's does: enough to show the handle and the count, and enough to
  // say there is a list down there to pull up.
  //
  // Measured off the step's scroll container, not off this component. Measuring
  // our own height is a loop: the sheet is as tall as the step, so the content
  // grows, so the measurement grows, so the map grows. And not vh either,
  // because inside the phone shell on a desktop the viewport is the window
  // rather than the screen we are drawing.
  const box = useRef(null);
  const [H, setH] = useState(560);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let scroller = el.parentElement;
    while (scroller && scroller !== document.body) {
      const oy = getComputedStyle(scroller).overflowY;
      if (oy === "auto" || oy === "scroll") break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) return;
    const read = () => { const h = scroller.clientHeight; if (h > 200) setH(h); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, []);
  // A card over the map takes the step: no list under it, no button beside it.
  const [focused, setFocused] = useState(false);
  const focus = useCallback((on) => { setFocused(on); onFocus?.(on); }, [onFocus]);

  // Cities go in the order the trip would run them, not the order they were
  // tapped, and the nights are shared out again every time. Nothing is ever
  // left unallocated, so nothing has to warn anybody that it is.
  const setCities = (cities) => setRoute(
    split(cities.sort((a, b) => canonical.indexOf(a) - canonical.indexOf(b)), rec, nights)
  );

  const toggle = (area) => {
    const has = picked.has(area.city);
    setCities(has
      ? route.filter((s) => s.city !== area.city).map((s) => s.city)
      : [...route.map((s) => s.city), area.city]);
  };

  return (
    <div ref={box} style={{ position: "relative" }}>
      {/* ─── The map, and most of the screen ───
          Not behind a button, and not a strip at the top. A couple choosing
          between six parts of an island is asking where those places are, and
          the map is the answer rather than an illustration of it. It stays put
          while the sheet slides up over it. */}
      <div style={{ position: "sticky", top: 0, zIndex: 0 }}>
        <CityMap
          dest={dest}
          cards={cards}
          picked={picked}
          onToggle={toggle}
          onOpen={(city) => setReading(city)}
          onFocus={focus}
          height={focused ? H : Math.round(H * 0.46)}
        />
      </div>

      {/* ─── And the cities, on a sheet that pulls up over it ─── */}
      <div style={{
        position: "relative", zIndex: 1, marginTop: -18, background: C.white,
        borderRadius: "20px 20px 0 0", minHeight: H,
        boxShadow: "0 -6px 24px rgba(16,24,40,0.12)",
        display: focused ? "none" : "block",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "9px 0 0" }}>
          <span style={{ width: 38, height: 4, borderRadius: 99, background: C.div }} />
        </div>

        {/* The one line a peeking sheet has room for, and the same line the
            listing apps put there: how much is down here. */}
        <div style={{ padding: `9px ${PAD}px 0` }}>
          <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: C.head, textAlign: "center", letterSpacing: "-0.2px" }}>
            {cards.length} cities in {dest}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.sub, textAlign: "center" }}>
            Choose the ones you want to visit
          </p>
        </div>

        <div style={{
          position: "sticky", top: 0, zIndex: 20, marginTop: 11,
          background: C.white, borderBottom: `1px solid ${C.div}`,
          padding: `9px ${PAD}px 10px`,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: `1px solid ${C.div}`, borderRadius: 999, padding: "9px 13px", background: C.white,
          }}>
            <Search size={15} color={C.inact} style={{ flexShrink: 0 }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find a city"
              style={{
                flex: 1, minWidth: 0, border: "none", outline: "none", background: "none",
                fontFamily: "inherit", fontSize: 13.5, color: C.head,
              }}
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear" style={{
                border: "none", background: "none", padding: 0, cursor: "pointer", display: "grid", placeItems: "center",
              }}><X size={14} color={C.inact} /></button>
            )}
          </div>
        </div>

        <div style={{ padding: `12px ${PAD}px 16px` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {shown.map((a) => (
              <CityCard
                key={a.city}
                dest={dest}
                area={a}
                picked={picked.has(a.city)}
                onToggle={() => toggle(a)}
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
      </div>

      {/* ─── What they have chosen ───
          Pinned above the wizard's own button. The nights are not on the chips:
          they are ours to work out and nobody picking Ubud is choosing a
          number. The line above only appears when there is something wrong
          with the choice, which is when there are more cities than the trip can
          hold; a line that is always there is one nobody reads. */}
      {route.length > 0 && !focused && (
        <div style={{
          position: "sticky", bottom: 0, zIndex: 20,
          background: C.white, borderTop: `1px solid ${C.div}`,
          padding: `10px ${PAD}px 12px`,
          boxShadow: "0 -2px 10px rgba(24,29,39,0.05)",
        }}>
          {note.kind === "over" && (
            <p style={{
              margin: "0 0 9px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontSize: 12.5, fontWeight: 700, color: "#B54708", textAlign: "center",
            }}>
              <AlertTriangle size={13} style={{ flexShrink: 0 }} />
              {note.text}
            </p>
          )}

          <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto" }}>
            {route.map((s) => (
              <span key={s.city} style={{
                flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
                background: C.p100, borderRadius: 999, padding: "6px 8px 6px 12px",
                fontSize: 12.5, fontWeight: 700, color: C.p900, whiteSpace: "nowrap",
              }}>
                {s.city}
                <button
                  onClick={() => toggle({ city: s.city })}
                  aria-label={`Remove ${s.city}`}
                  style={{
                    width: 17, height: 17, borderRadius: "50%", border: "none", flexShrink: 0,
                    background: "rgba(192,8,64,0.14)", display: "grid", placeItems: "center",
                    cursor: "pointer", padding: 0,
                  }}
                ><X size={11} color={C.p900} strokeWidth={3} /></button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Over the step, and over the sticky bars with it. The region page gets
          the same add button the cards have, because somebody who has just
          read about Ubud should not have to come back out to choose it. */}
      {reading && (
        <div style={{ position: "absolute", inset: 0, zIndex: 120 }}>
          <RegionDetail
            dest={dest}
            city={reading}
            added={picked.has(reading)}
            onAdd={() => toggle({ city: reading })}
            onClose={() => setReading(null)}
          />
        </div>
      )}
    </div>
  );
}
