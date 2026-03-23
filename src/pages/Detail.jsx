import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { C, VS, allItineraries, destData } from "../data";

export default function Detail() {
  const { id } = useParams();
  const it = allItineraries.find(i => i.id === Number(id));
  if (!it) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Itinerary not found</div>;

  const v = VS[it.vibe];
  const d = destData[it.dest];

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: 240 }}>
        <img src={it.img} alt={it.dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 20%, rgba(0,0,0,0.7))" }} />
        <Link to={-1} style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: 12, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color="#fff" />
        </Link>
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>{d?.flag}</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{it.dest}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "3px 8px" }}>🌙 {it.nights}N</span>
          </div>
          {it.resort && <p style={{ fontSize: 13, fontWeight: 600, color: C.p300, margin: "0 0 4px" }}>★ {it.resort}</p>}
        </div>
      </div>

      {/* Route chips */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: v.text, background: v.bg, border: `1px solid ${v.border}`, borderRadius: 12, padding: "2px 8px" }}>{it.vibe}</span>
          {it.veg && <span style={{ fontSize: 10, fontWeight: 600, color: "#027A48", background: "#ECFDF3", border: "1px solid #C0E5D5", borderRadius: 12, padding: "2px 8px" }}>🌱 Veg Friendly</span>}
        </div>
      </div>

      {/* Itinerary at a glance */}
      <div style={{ padding: "20px 16px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 16 }}>Itinerary at a glance</h2>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: C.div }} />
          {it.days.map((day, i) => (
            <div key={i} style={{ position: "relative", marginBottom: i < it.days.length - 1 ? 20 : 0 }}>
              {/* Dot */}
              <div style={{ position: "absolute", left: -20, top: 4, width: 12, height: 12, borderRadius: "50%", background: i === 0 ? C.p600 : i === it.days.length - 1 ? C.p900 : C.inact, border: `2px solid ${C.white}` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>Day {it.days.slice(0, i).reduce((acc, d) => acc + d.n, 0) + 1}: {day.city}</p>
                  <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>{day.sub}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.inact, flexShrink: 0, marginLeft: 8, background: C.bg, borderRadius: 8, padding: "2px 8px" }}>{day.n}N</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip overview */}
      <div style={{ padding: "0 16px 20px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Trip overview</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Pace", value: it.pace, bg: it.pace === "Unhurried" ? "#E1F5EE" : "#FFF5F0", color: it.pace === "Unhurried" ? "#0F6E56" : "#D85A30" },
            { label: "Crowds", value: it.crowds, bg: it.crowds === "Low" ? "#E1F5EE" : "#FFFAEB", color: it.crowds === "Low" ? "#0F6E56" : "#B54708" },
            { label: "Veg food", value: it.vegFood, bg: it.vegFood === "High" ? "#ECFDF3" : "#FFF5F0", color: it.vegFood === "High" ? "#027A48" : "#D85A30" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white }}>
              <span style={{ fontSize: 12, color: C.sub }}>{item.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: item.color, background: item.bg, borderRadius: 8, padding: "2px 8px" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing card */}
      <div style={{ margin: "0 16px 16px", background: `linear-gradient(135deg, ${C.p100}, #EDF3FF)`, borderRadius: 16, padding: 20 }}>
        <p style={{ fontSize: 12, color: C.sub, marginBottom: 4 }}>Starting from</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.head }}>₹{it.price}</span>
          <span style={{ fontSize: 13, color: C.sub }}>/person</span>
        </div>
        <p style={{ fontSize: 11, color: C.inact, marginTop: 4 }}>Incl. GST & TCS</p>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 16px 20px" }}>
        <Link to="/plan" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#fff", background: C.p600, border: "none", borderRadius: 12, padding: "14px 0", textDecoration: "none", boxShadow: "0 4px 16px rgba(227,27,83,0.3)" }}>
          Plan My Trip <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
