import { useEffect, useState } from "react";
import { X, ChevronRight, Check, Star } from "lucide-react";
import { C } from "../../data";
import { SOURCES } from "../../data/hotelDetailData";
import SourceLogo from "./SourceLogo";

// ─── The small pieces the hotel page is built from ───
//
// One section title, one card, one sheet, one row. The old page invented a
// slightly different heading and border for every block, which is most of why
// it read as cluttered. Everything here is deliberately plain so the photos
// and the numbers are the only things asking for attention.

export const RADIUS = 16;
export const PAGE_PAD = 16;
export const HEAD = "#181D27";

// ─── A section: title, optional right-hand action, then children ───
export function Section({ title, action, onAction, sub, children, flush = false, id }) {
  return (
    <section id={id} style={{ padding: flush ? `22px 0 0` : `22px ${PAGE_PAD}px 0` }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10,
          padding: flush ? `0 ${PAGE_PAD}px` : 0, marginBottom: sub ? 3 : 12,
        }}>
          <h2 style={{ flex: 1, margin: 0, fontSize: 17, fontWeight: 700, color: HEAD, letterSpacing: "-0.2px" }}>
            {title}
          </h2>
          {action && (
            <button
              onClick={onAction}
              style={{
                border: "none", background: "none", padding: 0, cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: "#FD014F",
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              {action}
            </button>
          )}
        </div>
      )}
      {sub && (
        <p style={{
          margin: "0 0 12px", padding: flush ? `0 ${PAGE_PAD}px` : 0,
          fontSize: 12.5, color: C.sub, lineHeight: 1.45,
        }}>{sub}</p>
      )}
      {children}
    </section>
  );
}

// Where one subject ends and the next begins. A hairline, not a grey band: on
// a page this long the bands stacked up and started reading as the design.
export function Rule() {
  return <div style={{ height: 1, background: C.div, margin: "24px 16px 0" }} />;
}

// ─── A plain card ───
export function Card({ children, pad = 14, style }) {
  return (
    <div style={{
      border: `1px solid ${C.div}`, borderRadius: RADIUS, background: C.white,
      padding: pad, ...style,
    }}>{children}</div>
  );
}

// ─── A row you can tap, with a chevron so it looks like one ───
export function TapRow({ icon, title, sub, onClick, right, last = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "13px 14px", border: "none", background: "none", cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
        borderBottom: last ? "none" : `1px solid ${C.div}`,
      }}
    >
      {icon && <span style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 22 }}>{icon}</span>}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: HEAD }}>{title}</span>
        {sub && <span style={{ display: "block", fontSize: 12, color: C.sub, marginTop: 1 }}>{sub}</span>}
      </span>
      {right || <ChevronRight size={17} color={C.inact} style={{ flexShrink: 0 }} />}
    </button>
  );
}

// ─── Chips ───
export function Chip({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, border: `1px solid ${active ? "#FD014F" : C.div}`,
        background: active ? "#FFE8EF" : C.white,
        color: active ? "#C00840" : C.sub,
        borderRadius: 999, padding: "7px 14px", cursor: "pointer",
        fontFamily: "inherit", fontSize: 12.5, fontWeight: active ? 700 : 600,
        whiteSpace: "nowrap", transition: "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {children}
      {count != null && (
        <span style={{ marginLeft: 5, fontWeight: 600, opacity: 0.7 }}>{count}</span>
      )}
    </button>
  );
}

// ─── The mark that says whose number or whose words these are ───
//
// Every rating and every review on this page carries one. It is the whole
// point of showing more than one source: you can tell them apart at a glance,
// and a real mark does that far faster than a letter in a coloured box.
export function SourceBadge({ source, size = 18 }) {
  return <SourceLogo source={source} size={size} />;
}

export function sourceName(key) {
  return (SOURCES[key] || {}).name || "";
}

// ─── A checklist line, used all over the facility sheets ───
export function CheckLine({ label, note }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "7px 0" }}>
      <Check size={14} color={C.inact} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, color: HEAD, lineHeight: 1.4 }}>{label}</span>
        {note && (
          <span style={{ display: "block", marginTop: 2, fontSize: 11, color: C.inact }}>{note}</span>
        )}
      </span>
    </div>
  );
}

// A count that reads as a link, for the places where a chevron would be
// heavier than the thing it points at.
export function LinkText({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none", background: "none", padding: 0, cursor: "pointer",
        fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: "#FD014F",
        textDecoration: "underline", textUnderlineOffset: 2,
      }}
    >{children}</button>
  );
}

// ─── Stars ───
export function Stars({ n, size = 12 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} color="#FDA201" fill="#FDA201" strokeWidth={0} />
      ))}
    </span>
  );
}

// ─── A score bar ───
export function ScoreBar({ label, score, outOf = 10 }) {
  const pct = Math.max(0, Math.min(100, (score / outOf) * 100));
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: C.sub }}>{label}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: HEAD }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#EFEFF1", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 3,
          background: score >= 9 ? "#00A898" : score >= 8 ? "#3FBFAF" : "#FDA201",
        }} />
      </div>
    </div>
  );
}

// ─── The bottom sheet ───
//
// Every "show me everything" on this page lands here rather than on a new
// screen, so nobody loses their place in a page this long.
export function Sheet({ open, title, onClose, children, footer, full = false }) {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 220);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 900 }}>
      <div
        onClick={close}
        style={{
          position: "absolute", inset: 0, background: "rgba(16,24,40,0.45)",
          animation: closing ? "fadeOutBg 0.2s ease forwards" : "fadeInBg 0.2s ease",
        }}
      />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: full ? "92%" : "auto", maxHeight: "88%",
        background: C.white, borderRadius: "20px 20px 0 0",
        display: "flex", flexDirection: "column", overflow: "hidden",
        animation: closing ? "sheetSlideDown 0.22s ease forwards" : "sheetSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ padding: "9px 0 0", flexShrink: 0 }}>
          <div style={{ width: 38, height: 4, borderRadius: 999, background: "#D5D7DA", margin: "0 auto" }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px 13px", borderBottom: `1px solid ${C.div}`, flexShrink: 0,
        }}>
          <h3 style={{ flex: 1, margin: 0, fontSize: 16.5, fontWeight: 700, color: HEAD }}>{title}</h3>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg,
              display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={16} color={C.head} />
          </button>
        </div>
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}>
          {children}
        </div>
        {footer && (
          <div style={{ flexShrink: 0, borderTop: `1px solid ${C.div}`, padding: "12px 16px 16px" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Text that clamps to n lines with a Read more ───
export function Clamp({ lines = 3, children, onMore, moreLabel = "Read more" }) {
  return (
    <>
      <p style={{
        margin: 0, fontSize: 13.5, color: C.sub, lineHeight: 1.55,
        display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{children}</p>
      {onMore && (
        <button
          onClick={onMore}
          style={{
            marginTop: 7, border: "none", background: "none", padding: 0, cursor: "pointer",
            fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: "#FD014F",
          }}
        >{moreLabel}</button>
      )}
    </>
  );
}
