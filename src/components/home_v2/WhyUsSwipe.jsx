import { C } from "../../data";
import { matchPromises } from "../../data/homeV2Data";

// "Why we're the perfect match" - clean numbered list, no icons.
// Keeps section short on a single screen while staying readable.
export default function WhyUsSwipe() {
  return (
    <div style={{ background: C.p100 + "60", padding: "22px 0 24px", marginTop: 20 }}>
      {/* Header */}
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
          Why us
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
          Why we're the perfect match
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0" }}>
          Five promises, before you book.
        </p>
      </div>

      {/* List */}
      <div style={{
        margin: "0 16px",
        background: C.white,
        border: `1px solid ${C.p100}`,
        borderRadius: 16,
        padding: "4px 16px",
        boxShadow: "0 2px 10px rgba(137,18,62,0.06)",
      }}>
        {matchPromises.map((it, i) => {
          const num = String(i + 1).padStart(2, "0");
          const last = i === matchPromises.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr",
                columnGap: 10,
                alignItems: "start",
                padding: "14px 0",
                borderBottom: last ? "none" : `1px solid ${C.div}`,
              }}
            >
              <div style={{
                fontSize: 13, fontStyle: "italic", fontWeight: 700,
                color: C.wText, paddingTop: 2,
              }}>
                {num}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.head, marginBottom: 3, lineHeight: 1.25 }}>
                  {it.title}
                </div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.45 }}>
                  {it.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
