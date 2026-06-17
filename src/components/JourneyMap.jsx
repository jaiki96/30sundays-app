import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { Plane } from "lucide-react";
import { C } from "../data";
import { cityCoords } from "../data/buildData";

// Coordinates for itinerary cities not covered by the build wizard's cityCoords.
// Cities still missing from both fall back to the simple SVG strip below.
const EXTRA_COORDS = {
  // Bali
  "Nusa Dua": { lat: -8.7969, lng: 115.2310 }, Kintamani: { lat: -8.2486, lng: 115.3120 },
  Amed: { lat: -8.3380, lng: 115.6620 }, Sidemen: { lat: -8.4500, lng: 115.4450 },
  Munduk: { lat: -8.2710, lng: 115.0760 }, Pemuteran: { lat: -8.1400, lng: 114.6500 },
  Lovina: { lat: -8.1580, lng: 115.0250 }, Lembongan: { lat: -8.6810, lng: 115.4540 },
  // Vietnam
  Sapa: { lat: 22.3360, lng: 103.8440 }, "Ninh Binh": { lat: 20.2510, lng: 105.9740 },
  "Phong Nha": { lat: 17.5910, lng: 106.2820 }, Mekong: { lat: 10.1200, lng: 105.7700 },
  // Thailand
  "Chiang Rai": { lat: 19.9100, lng: 99.8400 }, Pai: { lat: 19.3590, lng: 98.4420 },
  // Sri Lanka
  Colombo: { lat: 6.9271, lng: 79.8612 }, Trincomalee: { lat: 8.5874, lng: 81.2152 },
  Yala: { lat: 6.3700, lng: 81.5160 },
  // New Zealand
  Waiheke: { lat: -36.8000, lng: 175.1080 }, Milford: { lat: -44.6680, lng: 167.9250 },
  // Maldives
  Fuvahmulah: { lat: -0.2980, lng: 73.4240 },
};

const coordsFor = (city) => cityCoords[city] || EXTRA_COORDS[city] || null;

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 10);
    else if (points.length > 1) map.fitBounds(points, { padding: [38, 38] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);
  return null;
}

function numberPin(n) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${C.p600};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;font-family:inherit;">${n}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  });
}

// Simple non-map fallback (the original numbered strip) for routes whose
// cities we don't have coordinates for.
function SvgStrip({ stops }) {
  return (
    <div style={{ position: "relative", height: 200, borderRadius: 14, overflow: "hidden", background: "#E8F4EA" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {stops.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p600, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.head, marginTop: 4, whiteSpace: "nowrap" }}>{s.city}</span>
                <span style={{ fontSize: 11, color: C.sub }}>{s.n}N</span>
              </div>
              {i < stops.length - 1 && (
                <div style={{ width: 40, height: 1, borderTop: "2px dashed #A4A7AE", margin: "0 4px 16px" }}>
                  <Plane size={10} color={C.inact} style={{ position: "relative", top: -7, left: 14 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Real OpenStreetMap (Leaflet) of the route: numbered pins per stop + a dashed
// connecting line, framed to the whole journey. Falls back to SvgStrip when a
// stop's coordinates aren't known.
export default function JourneyMap({ stops, height = 220 }) {
  const resolved = (stops || []).map(s => ({ city: s.city, n: s.n, c: coordsFor(s.city) }));
  if (!resolved.length || !resolved.every(s => s.c)) return <SvgStrip stops={stops || []} />;

  const pts = resolved.map(s => [s.c.lat, s.c.lng]);
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.div}`, position: "relative", zIndex: 0, isolation: "isolate" }}>
      <MapContainer center={pts[0]} zoom={9} style={{ height, width: "100%", background: "#aadaff" }} attributionControl={false} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={pts} />
        {pts.length > 1 && <Polyline positions={pts} pathOptions={{ color: C.p600, weight: 3, dashArray: "7 6" }} />}
        {resolved.map((s, i) => (
          <Marker key={i} position={[s.c.lat, s.c.lng]} icon={numberPin(i + 1)}>
            <Tooltip permanent direction="top" offset={[0, -14]} className="route-tip">{s.city} · {s.n}N</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
