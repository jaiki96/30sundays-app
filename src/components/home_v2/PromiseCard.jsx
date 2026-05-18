import { C } from "../../data";

// "Numbered promises" card - list view without icons.
// kicker = small uppercase label, title = bold headline, sub = support line.
export default function PromiseCard({ kicker, title, sub, items }) {
  return (
    <div style={{
      background: C.p100 + "70",
      border: `1px solid ${C.p100}`,
      borderRadius: 20,
      padding: "20px 18px",
      margin: "0 16px",
    }}>
      <div style={{ background: C.white, borderRadius: 16, padding: "20px 18px 8px", border: `1px solid ${C.p100}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: C.p600, textTransform: "uppercase", marginBottom: 6 }}>
          {kicker}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, letterSpacing: "-0.4px", lineHeight: 1.2, margin: "0 0 6px" }}>
          {title}
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 14px" }}>{sub}</p>

        {items.map((it, i) => {
          const num = String(i + 1).padStart(2, "0");
          const last = i === items.length - 1;
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
              <span style={{ fontSize: 13, fontStyle: "italic", color: C.wText, fontWeight: 700, paddingTop: 2 }}>
                {num}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.head, marginBottom: 3, lineHeight: 1.25 }}>{it.title}</div>
                <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.45 }}>{it.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
