import { Star } from "lucide-react";
import { C, reviews } from "../../data";
import { tones } from "./sharedStyle";

// Compact social-proof strip: rating line + a few testimonial cards.
// Reuses the existing `reviews` data and mirrors HomeV2's ReviewMini look.
export default function ReviewsStrip({ tone = "clean", pad = 16 }) {
  const t = tones[tone] || tones.clean;
  const items = reviews.slice(0, 6);
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ padding: `0 ${pad}px`, marginBottom: 12 }}>
        <h2 style={{ fontSize: tone === "editorial" ? 22 : 17, color: C.head, margin: 0, ...t.head }}>
          Loved by couples
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}
          </div>
          <span style={{ fontSize: 12.5, color: C.sub }}>
            <b style={{ color: C.head }}>4.6/5</b> · 1,000+ couples on Google
          </span>
        </div>
      </div>
      <div className="hs" style={{ gap: 12, paddingLeft: pad, paddingRight: pad }}>
        {items.map((r, i) => (
          <div key={i} style={{ flexShrink: 0, width: 250, background: C.white, borderRadius: t.cardRadius, padding: 15, border: `1px solid ${C.div}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.p600, flexShrink: 0 }}>
                {r.name[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: C.head, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</p>
                <p style={{ fontSize: 10.5, color: C.sub, margin: 0 }}>{r.dest}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, lineHeight: "17px", color: C.sub, margin: 0 }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
