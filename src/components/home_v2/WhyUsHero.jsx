import { C } from "../../data";

// Variant A — Hero promise + supporting one-liners.
// Hero stays bold; the 4 supporting reasons compress to "emoji + single line"
// so the section stays under one screen.
const SUPPORTING = [
  { emoji: "👀", line: "We flag every flaw — even when it costs us the booking." },
  { emoji: "🛡️", line: "Only 8+ rated hotels and 4+ rated activities. Always." },
  { emoji: "💸", line: "Hotel · flight · activity priced separately. No markup." },
  { emoji: "🎓", line: "Founded by IIT–IIM engineers who chose travel over consulting." },
];

export default function WhyUsHero() {
  return (
    <div style={{ background: C.p100 + "60", padding: "26px 0 26px", marginTop: 20 }}>
      {/* Kicker */}
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 6 }}>
          Why us
        </div>

        {/* Hero headline */}
        <h2 style={{
          fontSize: 30, fontWeight: 800, color: C.head,
          letterSpacing: "-0.8px", lineHeight: 1.05, margin: "0 0 8px",
        }}>
          0 group tours.
          <br />
          0 solo travellers.
          <br />
          <span style={{ color: C.p600 }}>100% couples.</span>
        </h2>
        <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.45 }}>
          Built for two. Never group tours, never solo travellers.
        </p>
      </div>

      {/* Compact one-liner list */}
      <div style={{
        margin: "0 16px",
        background: C.white,
        border: `1px solid ${C.p100}`,
        borderRadius: 16,
        padding: "4px 14px",
      }}>
        {SUPPORTING.map((it, i) => {
          const last = i === SUPPORTING.length - 1;
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr",
              columnGap: 10,
              alignItems: "center",
              padding: "11px 0",
              borderBottom: last ? "none" : `1px solid ${C.div}`,
            }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{it.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.head, lineHeight: 1.4 }}>
                {it.line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
