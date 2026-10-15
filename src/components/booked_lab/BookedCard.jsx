import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { C } from "../../data";

// ─── One booked trip ───
//
// Photo on top, facts underneath, the shape of a package card a couple has
// already seen a hundred times. Everything a glance needs is on it and
// nothing else: who booked it and when, who they went as, how long, where,
// through what, what it cost, and what kind of week it was.
//
// The pace sits beside the price rather than on a line of its own, because
// "Relaxed" and "₹62,498" are the two things people compare cards on.

export const TAG = {
  Relaxed: { bg: "#EAF2FE", fg: "#175CD3" },
  Explorer: { bg: "#FFF4E0", fg: "#B54708" },
  Offbeat: { bg: "#E5F6F5", fg: "#007E72" },
};

export function Route({ legs, max = 2, size = 11.5 }) {
  const shown = legs.slice(0, max);
  const rest = legs.length - shown.length;
  return (
    <span style={{
      display: "block", fontSize: size, color: C.sub, lineHeight: "16px",
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    }}>
      {shown.map((l, i) => (
        <span key={l.city ?? l}>
          {i > 0 && <span style={{ opacity: 0.45, margin: "0 4px" }}>→</span>}
          {l.city ?? l}
        </span>
      ))}
      {rest > 0 && <span style={{ opacity: 0.7 }}> +{rest}</span>}
    </span>
  );
}

export default function BookedCard({ t, wide = false }) {
  const tone = TAG[t.style] || TAG.Relaxed;

  return (
    <Link to={t.target} style={{
      flexShrink: 0, width: wide ? "100%" : 254, textDecoration: "none",
      borderRadius: 16, overflow: "hidden", background: C.white,
      border: `1px solid ${C.div}`, boxShadow: "0 3px 14px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column",
    }}>
      <img src={t.img} alt={t.dest} style={{ width: "100%", height: wide ? 150 : 138, objectFit: "cover", display: "block" }} />

      <div style={{ padding: "11px 13px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: C.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong style={{ fontWeight: 800, color: C.head }}>{t.who}</strong> booked {t.when}
          </span>
          <span style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 999, border: `1px solid ${C.div}`,
            fontSize: 10, fontWeight: 700, color: C.sub, whiteSpace: "nowrap",
          }}><Users size={10} /> {t.party}</span>
        </div>

        <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
          {t.nights} nights in {t.dest}
        </p>
        <div style={{ marginTop: 3 }}><Route legs={t.legs} /></div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          marginTop: 11, paddingTop: 11, borderTop: `1px solid ${C.div}`,
        }}>
          <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: C.head, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
            ₹{t.price} <span style={{ fontSize: 10, fontWeight: 600, color: C.inact, letterSpacing: 0 }}>per person</span>
          </p>
          <span style={{
            flexShrink: 0, padding: "4px 10px", borderRadius: 999,
            background: tone.bg, color: tone.fg, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
          }}>{t.style}</span>
        </div>
      </div>
    </Link>
  );
}
