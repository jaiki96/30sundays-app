import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Beaker, X as XIcon, Check } from "lucide-react";
import { C } from "../data";

const states = [
  { key: "new", label: "New User", emoji: "👋" },
  { key: "lead", label: "Lead", emoji: "📝" },
  { key: "customer", label: "Customer", emoji: "✈️" },
  { key: "done", label: "Trip Done", emoji: "🎉" },
];

const FAB = 44;
const PAD = 8;            // keep-out margin from the frame edges
const MENU_W = 220;
const MENU_H = 232;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function UserToggle({ userState, setUserState }) {
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null);
  const drag = useRef(null);
  // FAB position (left/top) within the phone frame, plus frame size for clamping.
  const [pos, setPos] = useState(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });

  // Seed position from the default bottom-right anchor once we can measure the frame.
  useLayoutEffect(() => {
    const btn = fabRef.current;
    if (!btn || pos) return;
    const parent = btn.offsetParent || btn.parentElement;
    if (!parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    setFrame({ w, h });
    setPos({ left: w - FAB - 16, top: h - FAB - 160 });
  }, [pos]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onPointerDown = (e) => {
    const btn = fabRef.current;
    const parent = btn.offsetParent || btn.parentElement;
    const pRect = parent.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setFrame({ w: pRect.width, h: pRect.height });
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX, startY: e.clientY,
      originLeft: bRect.left - pRect.left,
      originTop: bRect.top - pRect.top,
      moved: false,
    };
    btn.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    setPos({
      left: clamp(d.originLeft + dx, PAD, frame.w - FAB - PAD),
      top: clamp(d.originTop + dy, PAD, frame.h - FAB - PAD),
    });
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) setOpen((v) => !v); // a tap (not a drag) toggles the menu
  };

  // Anchor the menu to the FAB's current spot: above if there's room, else below;
  // right-aligned to the FAB and clamped inside the frame.
  const fb = pos || { left: 0, top: 0 };
  let menuLeft = clamp(fb.left + FAB - MENU_W, PAD, Math.max(PAD, frame.w - MENU_W - PAD));
  let menuTop = fb.top - MENU_H - 8;
  if (menuTop < PAD) menuTop = fb.top + FAB + 8;

  const fabStyle = pos
    ? { left: pos.left, top: pos.top }
    : { right: 16, bottom: 160 };

  return (
    <>
      {/* Floating action button (drag to move, tap to open) */}
      <button
        ref={fabRef}
        data-testid="demo-state-fab"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="Demo state switcher"
        style={{
          position: "absolute", ...fabStyle, zIndex: 90,
          width: FAB, height: FAB, borderRadius: "50%",
          background: C.p600, color: "#fff", border: "none", padding: 0,
          display: "grid", placeItems: "center",
          lineHeight: 0, touchAction: "none",
          cursor: "grab", fontFamily: "inherit",
          boxShadow: "0 6px 20px rgba(227,27,83,0.45)",
        }}
      >
        {open ? <XIcon size={20} strokeWidth={2.2} /> : <Beaker size={20} strokeWidth={2} />}
      </button>

      {/* Popup menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "absolute", inset: 0, zIndex: 85, background: "rgba(0,0,0,0.2)" }}
          />
          {/* Menu */}
          <div style={{
            position: "absolute", left: menuLeft, top: menuTop, zIndex: 95,
            width: MENU_W, background: C.white, borderRadius: 14,
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
                  data-testid={`demo-state-${s.key}`}
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
