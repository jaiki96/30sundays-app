import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, ChevronRight } from "lucide-react";
import { C, destData } from "../data";
import { useSaves } from "../data/saves";
import { mergedSaves, saveCounts, YOU, PARTNER } from "../data/coupleData";

const PAD = 16;

function Avatars({ by, size = 22 }) {
  const people = by.map(k => (k === "you" ? YOU : PARTNER));
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {people.map((p, i) => (
        <div key={p.key} style={{ width: size, height: size, borderRadius: "50%", background: p.color, color: "#fff", fontSize: size * 0.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: i ? -7 : 0 }}>{p.initial}</div>
      ))}
    </div>
  );
}

function Row({ item, onUnsave }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderBottom: `1px solid ${C.div}` }}>
      <Avatars by={item.by} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
          <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.sub, background: C.bg, border: `1px solid ${C.div}`, borderRadius: 999, padding: "2px 7px" }}>{item.tag}</span>
        </div>
        <p style={{ fontSize: 11.5, color: C.sub, margin: "2px 0 0" }}>{item.sub}</p>
      </div>
      {item.by.includes("you") && (
        <button onClick={onUnsave} aria-label="Unsave" style={{ width: 32, height: 32, borderRadius: "50%", background: C.p600, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Heart size={15} fill="#fff" color="#fff" />
        </button>
      )}
    </div>
  );
}

export default function WishlistWF() {
  const { name } = useParams();
  const dest = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { forDest, toggleRegion, toggleActivity } = useSaves();

  if (!destData[dest]) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;

  const you = forDest(dest);
  const merged = useMemo(() => mergedSaves(dest, you), [dest, you]);
  const counts = saveCounts(merged);

  const regions = merged.regions.map(r => ({ kind: "regions", id: r.city, title: `${r.emoji} ${r.city}`, sub: r.blurb, tag: r.dayTrip ? "Day trip · not a base" : `Base · ${r.n}N`, by: r.by }));
  const acts = merged.activities.map(a => ({ kind: "activities", id: a.id, title: a.name, sub: `${a.city} · activity`, tag: a.vibe, by: a.by }));

  const bothLove = [...regions, ...acts].filter(i => i.by.length > 1);
  const soloRegions = regions.filter(i => i.by.length === 1);
  const soloActs = acts.filter(i => i.by.length === 1);
  const baseCount = merged.regions.filter(r => !r.dayTrip).length;

  const unsave = (item) => item.kind === "regions" ? toggleRegion(dest, item.id) : toggleActivity(dest, item.id);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.bg }}>
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0, paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `14px ${PAD}px 10px` }}>
        <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: "50%", background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <h1 style={{ flex: 1, fontSize: 18, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>Your {dest} wishlist</h1>
        <Avatars by={["you", "aanya"]} size={28} />
      </div>

      {/* Banner */}
      <div style={{ padding: `0 ${PAD}px 14px` }}>
        <div style={{ background: C.p100, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontSize: 12.5, color: C.head, margin: 0, lineHeight: "18px" }}>You &amp; Aanya saved {counts.all} things. Everything here tunes the routes we show you both.</p>
        </div>
      </div>

      {/* Filter chips (display counts; as-drawn) */}
      <div className="hs" style={{ gap: 8, paddingLeft: PAD, paddingRight: PAD, marginBottom: 16 }}>
        {[["All", counts.all], ["You", counts.you], ["Aanya", counts.aanya], ["Both", counts.both]].map(([l, n], i) => (
          <span key={l} style={{ flexShrink: 0, background: i === 0 ? C.p600 : C.white, color: i === 0 ? "#fff" : C.head, border: `1px solid ${i === 0 ? C.p600 : C.div}`, borderRadius: 999, padding: "7px 13px", fontSize: 12.5, fontWeight: 600 }}>{l} · {n}</span>
        ))}
      </div>

      {/* You both love */}
      {bothLove.length > 0 && (
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 20 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: C.p600, margin: "0 0 8px" }}>You both love · ranked highest</p>
          <div style={{ background: C.p100, borderRadius: 14, padding: "2px 14px" }}>
            {bothLove.map(i => <Row key={`${i.kind}:${i.id}`} item={i} onUnsave={() => unsave(i)} />)}
          </div>
        </div>
      )}

      {/* Regions */}
      {soloRegions.length > 0 && (
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 18 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.sub, margin: "0 0 4px" }}>Regions · {soloRegions.length}</p>
          {soloRegions.map(i => <Row key={`${i.kind}:${i.id}`} item={i} onUnsave={() => unsave(i)} />)}
        </div>
      )}

      {/* Things to do */}
      {soloActs.length > 0 && (
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 18 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.sub, margin: "0 0 4px" }}>Things to do · {soloActs.length}</p>
          {soloActs.map(i => <Row key={`${i.kind}:${i.id}`} item={i} onUnsave={() => unsave(i)} />)}
        </div>
      )}

      {counts.all === 0 && (
        <p style={{ textAlign: "center", fontSize: 13, color: C.sub, padding: "40px 20px" }}>Nothing saved yet. Save regions and experiences on the destination page.</p>
      )}

      </div>{/* end scroll area */}

      {/* Fixed footer */}
      <div style={{ flexShrink: 0, background: C.white, borderTop: `1px solid ${C.div}`, padding: `10px ${PAD}px 12px`, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: 11, color: C.sub, margin: "0 0 8px", textAlign: "center" }}>{counts.both} you both love · {baseCount} bases · shaping every route</p>
        <Link to={`/wf/${encodeURIComponent(dest)}/routes`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.p600, color: "#fff", borderRadius: 13, padding: "14px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Build a route from your saves <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
