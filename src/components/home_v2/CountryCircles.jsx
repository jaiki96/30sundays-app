import { Link } from "react-router-dom";
import { C, destinations } from "../../data";
import { HOME_V2_COUNTRIES, mauritiusItineraries } from "../../data/homeV2Data";

// Round destination chips at the top of Home. Reuses image pool from data.js
// and adds a Mauritius circle (using sample itinerary image).
export default function CountryCircles() {
  const items = HOME_V2_COUNTRIES.map(c => {
    const liveMeta = destinations.find(d => d.name === c.name);
    const img = liveMeta?.img || mauritiusItineraries[0]?.img;
    return { name: c.name, img };
  });

  return (
    <div className="hs" style={{ gap: 16, padding: "16px 16px 6px" }}>
      {items.map((d, i) => (
        <Link
          key={i}
          to={`/destination/${encodeURIComponent(d.name)}`}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, textDecoration: "none" }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
            border: `2.5px solid ${C.div}`, padding: 2,
          }}>
            <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.sub, whiteSpace: "nowrap" }}>{d.name}</span>
        </Link>
      ))}
    </div>
  );
}
