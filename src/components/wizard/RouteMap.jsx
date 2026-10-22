import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { C } from "../../data";
import { cityCoords } from "../../data/buildData";
import { hop } from "../../data/routeBuilder";

// ─── The route, on a real map ───
//
// A read-only version of the wizard's map, kept in its own file so the route
// builder can show it without reaching back into the step that opens it.
//
// The line follows the journey, not the crow. Ha Long to Hoi An drew straight
// down the coast and said "3h 15m by air", which is a flight nobody can book:
// the day is a car back to Hanoi, a flight to Da Nang, and a car into Hoi An.
// So the path goes through the airports it actually uses, the changes are
// marked, and every leg carries its own mode and time.

// Framed against what can be seen: the map can grow or shrink with its box,
// and a sheet can sit over the foot of it, so it is measured again and fitted
// again whenever either changes. Room on both sides: the change labels hang
// off the left, the leg pills off the right.
function FitBounds({ points, height, covered = 0 }) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => {
      map.invalidateSize();
      const clear = Math.min(covered, Math.max(0, height - 120));
      if (points.length === 1) map.setView(points[0], 9);
      else if (points.length > 1) map.fitBounds(points, { paddingTopLeft: [88, 46], paddingBottomRight: [96, 26 + clear], animate: false });
    }, 60);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), height, covered]);
  return null;
}

function pin(seq) {
  const html = `<div style="width:24px;height:24px;border-radius:50%;background:${C.p600};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;font-family:inherit;">${seq + 1}</div>`;
  return L.divIcon({ className: "", html, iconSize: [24, 24], iconAnchor: [12, 12] });
}

// Where you change planes or get out of the car. Smaller and paler than a
// stop, because you do not sleep here.
function changeDot() {
  const html = `<div style="width:12px;height:12px;border-radius:50%;background:#fff;border:2.5px solid ${C.sub};box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>`;
  return L.divIcon({ className: "", html, iconSize: [12, 12], iconAnchor: [6, 6] });
}

// Drawn by hand rather than pulled from the icon set: these go inside a Leaflet
// marker, which takes a string of HTML and not a React element.
const GLYPH = {
  flight: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
  car: '<path d="M5 11l1.5-4A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.3L19 11h.5A1.5 1.5 0 0 1 21 12.5V17h-3a2 2 0 0 1-4 0h-4a2 2 0 0 1-4 0H3v-4.5A1.5 1.5 0 0 1 4.5 11z"/>',
  boat: '<path d="M12 3l6 4v4l3 1-2 7a4 4 0 0 1-3.5 2H8.5A4 4 0 0 1 5 19l-2-7 3-1V7z"/>',
};

function legIcon(mode, label) {
  const glyph = GLYPH[mode] || GLYPH.car;
  const html = `<div style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:#fff;border:1px solid ${C.div};box-shadow:0 1px 5px rgba(24,29,39,.25);white-space:nowrap;">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="${C.p600}">${glyph}</svg>
    <span style="font-size:10px;font-weight:700;color:${C.head};font-family:inherit;">${label}</span>
  </div>`;
  // Set beside the line rather than on it. Most of these routes run north to
  // south, so a pill centred on the midpoint lands either on a pin or on the
  // name above it, and the one thing it must never do is hide the stop it
  // belongs to.
  const w = 34 + label.length * 5.6;
  return L.divIcon({ className: "", html, iconSize: [w, 20], iconAnchor: [-32, 10] });
}

// The mode alone, for a map that is showing the shape of the trip and not
// its timetable: a car or a plane beside the line, and nothing to read.
function modeIcon(mode) {
  const glyph = GLYPH[mode] || GLYPH.car;
  const html = `<div style="width:22px;height:22px;border-radius:50%;background:#fff;border:1px solid ${C.div};box-shadow:0 1px 5px rgba(24,29,39,.25);display:flex;align-items:center;justify-content:center;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="${C.p600}">${glyph}</svg>
  </div>`;
  return L.divIcon({ className: "", html, iconSize: [22, 22], iconAnchor: [-14, 11] });
}

// Zoom in and out, drawn by us so they match the app rather than Leaflet's
// grey boxes. At the top right, under whatever header sits over the map, and
// clear of the sheet that comes up over the foot of it.
function Zoom({ map }) {
  const btn = {
    width: 34, height: 34, border: "none", background: C.white, display: "grid", placeItems: "center",
    cursor: "pointer", padding: 0, fontFamily: "inherit", fontSize: 20, fontWeight: 600, color: C.head, lineHeight: 1,
  };
  return (
    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000, display: "flex", flexDirection: "column", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 6px rgba(24,29,39,.25)", border: `1px solid ${C.div}` }}>
      <button onClick={() => map?.zoomIn()} aria-label="Zoom in" data-testid="map-zoom-in" style={{ ...btn, borderBottom: `1px solid ${C.div}` }}>+</button>
      <button onClick={() => map?.zoomOut()} aria-label="Zoom out" data-testid="map-zoom-out" style={btn}>−</button>
    </div>
  );
}

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const short = (label = "") => (label.match(/\d+h(?:\s\d+m)?|\d+m/) || ["", ""])[0] || "";
const pt = (city) => {
  const c = cityCoords[city];
  return c ? [c.lat, c.lng] : null;
};

export default function RouteMap({ dest, route, height = 215, times = true, covered = 0, interactive = false }) {
  const [map, setMap] = useState(null);
  const stops = route.map((r) => ({ city: r.city, co: cityCoords[r.city] })).filter((s) => s.co);
  if (!stops.length) return null;

  // Every leg of every hop, end to end, so the line and the times come from
  // the same place the itinerary will.
  const segs = [];
  for (let i = 1; i < stops.length; i += 1) {
    const j = dest ? hop(dest, stops[i - 1].city, stops[i].city) : null;
    (j?.steps || []).forEach((st) => {
      const a = pt(st.from);
      const b = pt(st.to);
      if (a && b) segs.push({ ...st, a, b });
    });
  }

  const stopCities = new Set(stops.map((s) => s.city));
  const changes = [...new Set(segs.map((s) => s.to).filter((c) => !stopCities.has(c) && pt(c)))];
  const bounds = [...stops.map((s) => [s.co.lat, s.co.lng]), ...changes.map(pt)];

  // The height lives on a box of our own and the map fills it. Leaflet's own
  // box is sized once, so a map that has to grow with its screen (the editor
  // measures the screen after the first paint) was staying at its first size.
  return (
    <div style={{ height, width: "100%", background: "#aadaff", position: "relative" }}>
    {interactive && <Zoom map={map} />}
    <MapContainer
      ref={setMap}
      center={bounds[0]} zoom={8} zoomSnap={0} style={{ height: "100%", width: "100%", background: "#aadaff" }}
      scrollWheelZoom={false} dragging={interactive} zoomControl={false} doubleClickZoom={interactive}
      touchZoom={interactive} boxZoom={false} keyboard={false} attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds points={bounds} height={height} covered={covered} />

      {/* Roads solid, flights dashed, so the shape of the day is readable
          before a single label is. */}
      {segs.map((s, i) => (
        <Polyline
          key={`l${i}-${s.from}>${s.to}`}
          positions={[s.a, s.b]}
          pathOptions={{
            color: C.p600,
            weight: s.mode === "flight" ? 3 : 2.5,
            dashArray: s.mode === "flight" ? "6 7" : undefined,
            opacity: s.mode === "flight" ? 1 : 0.75,
          }}
        />
      ))}

      {segs.map((s, i) => {
        const label = short(s.label);
        if (times && !label) return null;
        return (
          <Marker
            key={`p${i}-${s.from}>${s.to}`}
            position={mid(s.a, s.b)}
            icon={times ? legIcon(s.mode, label) : modeIcon(s.mode)}
            interactive={false}
            zIndexOffset={400}
          />
        );
      })}

      {changes.map((c) => (
        <Marker key={`c${c}`} position={pt(c)} icon={changeDot()} interactive={false} zIndexOffset={500}>
          {/* Left of the line: the leg pills live on the right, and the two
              were landing on top of each other. */}
          <Tooltip permanent direction="left" offset={[-8, 0]} className="route-tip">{`Change at ${c}`}</Tooltip>
        </Marker>
      ))}

      {stops.map((s, i) => (
        <Marker key={s.city} position={[s.co.lat, s.co.lng]} icon={pin(i)} interactive={false} zIndexOffset={600}>
          <Tooltip permanent direction="top" offset={[0, -13]} className="route-tip">{s.city}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}
