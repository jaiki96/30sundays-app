import { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { C } from "../../data";

// ─── The parts every stage card is built from ───
//
// One frame, three fillings. A Lead, an Upcoming and an On-trip card are the
// same object at different points in its life, so they share a photo header, a
// fact line and an action row. What changes is the middle: the price for a
// lead, the money owed for an upcoming trip, today's plan for someone who is
// already there.

export const CARD_RADIUS = 20;
export const CARD_SHADOW = "0 10px 30px rgba(16,24,40,0.10)";

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export const dateRange = (from, to) => `${shortDate(from)} – ${shortDate(to)}`;

// The destination, swipeable. One photo is a header; a strip you can push
// through is a reason to look, and the dots say how many more there are.
export function PhotoStrip({ images = [], onTap }) {
  const [i, setI] = useState(0);
  const onScroll = (e) => {
    const w = e.currentTarget.clientWidth || 1;
    const n = Math.round(e.currentTarget.scrollLeft / w);
    if (n !== i) setI(n);
  };
  return (
    <>
      <div
        className="hide-scrollbar"
        onScroll={onScroll}
        onClick={onTap}
        style={{
          position: "absolute", inset: 0, display: "flex", overflowX: "auto",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
          cursor: onTap ? "pointer" : "default",
        }}
      >
        {images.map((src, n) => (
          <img
            key={n}
            src={src}
            alt=""
            draggable={false}
            style={{
              flex: "0 0 100%", width: "100%", height: "100%", objectFit: "cover",
              scrollSnapAlign: "center", userSelect: "none",
            }}
          />
        ))}
      </div>
      {/* Dots centred on the bottom edge, the same shape and place as the
          marketing banner's, so one carousel on Home behaves like the other. */}
      {images.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 9, zIndex: 3,
          display: "flex", justifyContent: "center", alignItems: "center", gap: 5,
          pointerEvents: "none",
        }}>
          {images.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 16 : 5, height: 5, borderRadius: 999,
              background: n === i ? "#fff" : "rgba(255,255,255,0.5)",
              transition: "width 0.25s ease, background 0.25s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
            }} />
          ))}
        </div>
      )}
    </>
  );
}

export function Pill({ tone = "light", dot, children }) {
  const tones = {
    light: { bg: "rgba(255,255,255,0.94)", fg: C.head },
    green: { bg: "rgba(236,253,243,0.96)", fg: "#027A48" },
    live: { bg: "rgba(2,122,72,0.96)", fg: "#fff" },
  };
  const t = tones[tone] || tones.light;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, background: t.bg, color: t.fg,
      fontSize: 10, fontWeight: 800, letterSpacing: "0.9px", textTransform: "uppercase",
      padding: "5px 10px", borderRadius: 999, boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
      whiteSpace: "nowrap",
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.fg, display: "inline-block" }} />}
      {children}
    </span>
  );
}

// The card's photo top: name and dates over the picture, a stage pill on one
// side and the one number that matters on the other. The photos swipe under
// everything; the overlay never eats the gesture.
export function CardHead({ images, height = 164, pill, badge, title, sub, onOpen }) {
  return (
    <div style={{ position: "relative", height, overflow: "hidden", background: "#16262B" }}>
      <PhotoStrip images={images} onTap={onOpen} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "linear-gradient(180deg, rgba(8,18,20,0.46) 0%, rgba(8,18,20,0) 40%, rgba(8,18,20,0.88) 100%)",
      }} />
      <div style={{
        position: "absolute", top: 12, left: 13, right: 13, zIndex: 3,
        display: "flex", alignItems: "center", gap: 8, pointerEvents: "none",
      }}>
        {pill}
        {badge && <span style={{ marginLeft: "auto" }}>{badge}</span>}
      </div>
      <div
        onClick={onOpen}
        style={{
          position: "absolute", left: 14, right: 70, bottom: 24, zIndex: 3,
          cursor: onOpen ? "pointer" : "default",
        }}
      >
        <p style={{
          margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px",
          lineHeight: "24px", textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}>{title}</p>
        <p style={{
          margin: "4px 0 0", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.94)",
          textShadow: "0 1px 7px rgba(0,0,0,0.55)",
        }}>{sub}</p>
      </div>
    </div>
  );
}

// One fact with its own icon, the way the change-day and change-hotel cards
// read, so a fact line never runs together into one sentence.
export function Fact({ icon: I, children, muted }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
      <I size={13} color={muted ? C.inact : C.sub} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span style={{
        fontSize: 12, color: muted ? C.inact : C.sub, fontWeight: 500, lineHeight: "16px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{children}</span>
    </span>
  );
}

export function Primary({ children, onClick, tone = "pink" }) {
  const bg = tone === "green" ? "#027A48" : C.p600;
  const shadow = tone === "green" ? "0 6px 18px rgba(2,122,72,0.28)" : "0 6px 18px rgba(227,27,83,0.28)";
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%",
        background: bg, color: "#fff", border: "none", borderRadius: 13, padding: "13px 16px",
        fontSize: 14.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: shadow,
      }}
    >
      {children}
    </button>
  );
}

// The quiet actions. They scroll sideways rather than wrapping, so the card
// keeps its height no matter how many a stage needs.
export function QuietRow({ actions }) {
  return (
    <div className="hs" style={{ gap: 8, margin: "0 -14px", padding: "0 14px" }}>
      {actions.map((a, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); a.onClick?.(); }}
          style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
            background: C.white, border: `1px solid ${C.div}`, borderRadius: 11,
            padding: "9px 12px", cursor: "pointer", fontFamily: "inherit",
            fontSize: 12, fontWeight: 700, color: C.head, whiteSpace: "nowrap",
          }}
        >
          <a.icon size={14} color={C.sub} strokeWidth={2} />
          {a.label}
        </button>
      ))}
    </div>
  );
}

export function Divider({ m = "13px 0" }) {
  return <div style={{ height: 1, background: C.div, margin: m }} />;
}

// A labelled block inside the card: TODAY, STAY, TRAVEL.
export function Block({ label, icon: I, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
        {I && <I size={13} color={C.p600} strokeWidth={2.4} />}
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "1.1px", textTransform: "uppercase", color: C.p600,
        }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── A row that is obviously a button ───
// The chat strip used to be a line of text with an icon, which nobody reads as
// tappable. Tinted, with a chevron, it is unmistakable.
export function TapRow({ icon: I, tone = "pink", title, hint, onClick, right }) {
  const fg = tone === "green" ? "#027A48" : C.p600;
  const bg = tone === "green" ? "#F2FBF6" : "#FFF3F6";
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      role="button"
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
        background: bg, borderTop: `1px solid ${C.div}`, cursor: "pointer",
      }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 10, background: C.white, border: `1px solid ${C.div}`,
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <I size={15} color={fg} strokeWidth={2.2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.head, lineHeight: "17px" }}>{title}</p>
        {hint && <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{hint}</p>}
      </div>
      {right || <ChevronRight size={17} color={fg} strokeWidth={2.4} />}
    </div>
  );
}

// ─── Bottom sheet ───
// Everything the card triggers opens here rather than sending you to another
// screen. You came to Home for one thing; you should not lose your place doing
// it.
export function Sheet({ title, sub, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 400 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(16,24,40,0.45)" }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "82%", overflowY: "auto",
        background: C.white, borderRadius: "22px 22px 0 0", boxShadow: "0 -8px 32px rgba(16,24,40,0.24)",
        animation: "sheetSlideUp 0.22s ease-out",
      }} className="hide-scrollbar">
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
          <span style={{ width: 38, height: 4, borderRadius: 999, background: C.div }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 18px 12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>{title}</p>
            {sub && <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>{sub}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg,
            display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
          }}>
            <X size={16} color={C.sub} />
          </button>
        </div>
        <div style={{ padding: "0 18px 26px" }}>{children}</div>
      </div>
    </div>
  );
}

// One line inside a sheet: an icon, a label, and something on the right.
export function SheetRow({ icon: I, iconBg, iconFg, title, sub, right, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 11, padding: "11px 0",
        borderTop: `1px solid ${C.div}`, cursor: onClick ? "pointer" : "default",
      }}
    >
      {I && (
        <span style={{
          width: 36, height: 36, borderRadius: 11, background: iconBg || C.bg,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <I size={17} color={iconFg || C.head} strokeWidth={2} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, lineHeight: "18px" }}>{title}</p>
        {sub && <p style={{ margin: "1px 0 0", fontSize: 11.5, color: C.sub }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Toast({ children }) {
  return (
    <div style={{
      position: "absolute", bottom: 92, left: 16, right: 16, zIndex: 500,
      background: "rgba(24,30,76,0.95)", color: "#fff", borderRadius: 12,
      padding: "12px 16px", fontSize: 13, fontWeight: 500, textAlign: "center",
    }}>
      {children}
    </div>
  );
}
