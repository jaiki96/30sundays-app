import { useState, useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { C } from "../../data";
import { matchPromises } from "../../data/homeV2Data";

// Variant 3 — 3 short title chips. Tap any → bottom drawer with all 5 in detail.
const TEASERS = [
  "Made for couples",
  "We flag every flaw",
  "Every rupee, visible",
];

export default function WhyUsDrawer() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div style={{ background: C.p100 + "60", padding: "26px 0 26px", marginTop: 20 }}>
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
          Why us
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
          Built differently
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0" }}>
          Tap any reason for the full story.
        </p>
      </div>

      {/* Title-only chips */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {TEASERS.map((t, i) => (
          <button
            key={i}
            onClick={() => setOpen(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: C.white,
              border: `1px solid ${C.p100}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              textAlign: "left",
              boxShadow: "0 1px 6px rgba(137,18,62,0.04)",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>
              {t}
            </span>
            <ArrowUpRight size={18} color={C.p600} />
          </button>
        ))}

        {/* +2 more reasons */}
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "transparent", border: "none",
            color: C.p600, fontSize: 13, fontWeight: 700,
            padding: "8px 0 0", cursor: "pointer", letterSpacing: "-0.1px",
          }}
        >
          + 2 more reasons →
        </button>
      </div>

      {/* Bottom drawer */}
      {open && <Drawer onClose={() => setOpen(false)} />}
    </div>
  );
}

function Drawer({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-end",
        animation: "wfade .2s ease-out",
      }}
    >
      <style>{`
        @keyframes wfade { from{opacity:0} to{opacity:1} }
        @keyframes wslide { from{transform:translateY(100%)} to{transform:translateY(0)} }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxHeight: "85%",
          background: C.white,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: "10px 0 24px",
          display: "flex", flexDirection: "column",
          animation: "wslide .25s ease-out",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px 12px" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 3 }}>
              Why us
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
              Five promises, before you book
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.bg, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={16} color={C.head} />
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{ overflowY: "auto", padding: "4px 18px 8px" }}>
          {matchPromises.map((it, i) => {
            const num = String(i + 1).padStart(2, "0");
            const last = i === matchPromises.length - 1;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "32px 1fr",
                columnGap: 10, alignItems: "start",
                padding: "16px 0",
                borderBottom: last ? "none" : `1px solid ${C.div}`,
              }}>
                <div style={{
                  fontSize: 13, fontStyle: "italic", fontWeight: 700,
                  color: C.wText, paddingTop: 2,
                }}>{num}</div>
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
    </div>
  );
}
