import { X, Check } from "lucide-react";
import { C } from "../../data";

// Variant 2 — "Typical agency vs 30 Sundays" comparison table.
// Each row shows the contrast that defines the brand.
const ROWS = [
  { bad: "Group tours, mixed groups",   good: "Built only for couples" },
  { bad: "Hide flaws to close the sale", good: "Flag every flaw before booking" },
  { bad: "Any hotel goes",               good: "8+ on Booking, 4+ on TA" },
  { bad: "Bundled pricing, no breakdown", good: "Hotel · Flight · Activity split" },
  { bad: "Sales team & call centres",    good: "IIT-IIM founders on chat" },
];

export default function WhyUsCompare() {
  return (
    <div style={{ background: C.p100 + "60", padding: "26px 0 26px", marginTop: 20 }}>
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
          Why us
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
          Why couples switch to us
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0" }}>
          Five things we do differently.
        </p>
      </div>

      <div style={{
        margin: "0 16px",
        background: C.white,
        border: `1px solid ${C.p100}`,
        borderRadius: 16,
        overflow: "hidden",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: C.bg,
          borderBottom: `1px solid ${C.div}`,
        }}>
          <div style={{
            padding: "10px 12px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.6px",
            color: C.inact, textTransform: "uppercase", textAlign: "center",
          }}>
            Typical agency
          </div>
          <div style={{
            padding: "10px 12px",
            fontSize: 11, fontWeight: 800, letterSpacing: "0.6px",
            color: C.p600, textTransform: "uppercase", textAlign: "center",
            background: C.p100 + "80",
          }}>
            30 Sundays
          </div>
        </div>

        {/* Data rows */}
        {ROWS.map((r, i) => {
          const last = i === ROWS.length - 1;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              borderBottom: last ? "none" : `1px solid ${C.div}`,
            }}>
              <div style={{
                padding: "12px 12px", display: "flex", alignItems: "flex-start", gap: 6,
                color: C.sub,
              }}>
                <X size={14} color={C.inact} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, lineHeight: 1.4 }}>{r.bad}</span>
              </div>
              <div style={{
                padding: "12px 12px", display: "flex", alignItems: "flex-start", gap: 6,
                background: C.p100 + "40", color: C.head,
              }}>
                <Check size={14} color={C.sText} style={{ marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
                <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{r.good}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
