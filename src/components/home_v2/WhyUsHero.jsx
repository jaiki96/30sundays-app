import { Eye, ShieldCheck, Receipt, GraduationCap } from "lucide-react";
import { C } from "../../data";

// Why Us, compact 2-column grid layout. Hero stays sharp, the 4 supporting
// reasons sit in a 2x2 grid with branded icons, so the whole section fits
// inside one viewport.
// One tight line per reason. Uniform weight + colour, capped at 2 lines.
const SUPPORTING = [
  { Icon: Eye,           text: "Every flaw flagged before you book" },
  { Icon: ShieldCheck,   text: "8+ rated hotels, 4+ rated activities" },
  { Icon: Receipt,       text: "Hotel · flight · activity priced separately" },
  { Icon: GraduationCap, text: "IIT-IIM founders, no sales team" },
];

export default function WhyUsHero() {
  return (
    <div style={{ background: C.p100 + "60", padding: "18px 0 20px", marginTop: 18 }}>
      {/* Kicker + headline */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
          Why us
        </div>
        <h2 style={{
          fontSize: 24, fontWeight: 800, color: C.head,
          letterSpacing: "-0.6px", lineHeight: 1.1, margin: 0,
        }}>
          0 group tours. 0 solo travellers.{" "}
          <span style={{ color: C.p600 }}>100% couples.</span>
        </h2>
      </div>

      {/* 2-column grid of supporting reasons */}
      <div style={{
        margin: "0 16px",
        background: C.white,
        border: `1px solid ${C.p100}`,
        borderRadius: 14,
        padding: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      }}>
        {SUPPORTING.map((it, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 4px",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: C.p100,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <it.Icon size={15} color={C.p600} strokeWidth={2.2} />
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: C.head,
              lineHeight: 1.35, minWidth: 0,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {it.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
