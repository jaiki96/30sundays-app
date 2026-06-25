import { C } from "../../data";
import { travellerReels } from "../../data/homeV2Data";
import { tones } from "./sharedStyle";

// Real-couple photo strip. Reuses travellerReels (poster + name + country + activity).
export default function TravellerMoments({ tone = "clean", pad = 16 }) {
  const t = tones[tone] || tones.clean;
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ padding: `0 ${pad}px`, marginBottom: 12 }}>
        <h2 style={{ fontSize: tone === "editorial" ? 22 : 17, color: C.head, margin: 0, ...t.head }}>
          Real couples, real trips
        </h2>
        <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 0" }}>Moments from couples who travelled with us.</p>
      </div>
      <div className="hs" style={{ gap: 11, paddingLeft: pad, paddingRight: pad }}>
        {travellerReels.map((m, i) => (
          <div key={i} style={{ flexShrink: 0, width: 132, height: 176, borderRadius: t.cardRadius, overflow: "hidden", position: "relative" }}>
            <img src={m.poster} alt={m.activity} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)" }} />
            <div style={{ position: "absolute", left: 10, right: 10, bottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{m.name}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.92)", margin: "1px 0 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{m.country} · {m.activity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
