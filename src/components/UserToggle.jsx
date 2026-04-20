import { useState, useEffect } from "react";
import { Beaker, X as XIcon, Check } from "lucide-react";
import { C } from "../data";

const states = [
  { key: "new", label: "New User", emoji: "👋" },
  { key: "lead", label: "Lead", emoji: "📝" },
  { key: "customer", label: "Customer", emoji: "✈️" },
  { key: "done", label: "Trip Done", emoji: "🎉" },
];

export default function UserToggle({ userState, setUserState }) {
  const [open, setOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Demo state switcher"
        style={{
          position: "fixed", bottom: 84, right: 16, zIndex: 90,
          width: 44, height: 44, borderRadius: "50%",
          background: C.p600, color: "#fff", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 6px 20px rgba(227,27,83,0.45)",
        }}
      >
        {open ? <XIcon size={20} /> : <Beaker size={18} />}
      </button>

      {/* Popup menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 85, background: "rgba(0,0,0,0.2)" }}
          />
          {/* Menu */}
          <div style={{
            position: "fixed", bottom: 136, right: 16, zIndex: 95,
            width: 220, background: C.white, borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            border: `1px solid ${C.div}`, overflow: "hidden",
            animation: "fadeUp 0.18s ease-out",
          }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.div}`, background: C.bg }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.inact, letterSpacing: "0.8px", margin: 0, textTransform: "uppercase" }}>Demo state</p>
            </div>
            {states.map(s => {
              const on = userState === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => { setUserState(s.key); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "12px 14px",
                    border: "none", background: on ? C.p100 : C.white,
                    cursor: "pointer", fontFamily: "inherit",
                    borderBottom: `1px solid ${C.div}`,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? C.p600 : C.head, flex: 1, textAlign: "left" }}>
                    {s.label}
                  </span>
                  {on && <Check size={16} color={C.p600} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
