import { useEffect, useState } from "react";
import { X, ChevronRight, Check, Star } from "lucide-react";
import { C } from "../../data";
import { R, SHADOW, T, WELL, A, PAD, GAP } from "./tokens";

// ─── The parts, rebuilt on the tokens ───
//
// Same components as before, same names, same jobs. What changed is that each
// one now takes its numbers from one place, so a card here and a card three
// sections down are the same object rather than two things that happen to look
// similar.

export { PAD, GAP };

// ─── A section ───
// One heading style, one gap above, one optional line underneath. The old
// version let each section decide its own padding, which is why the spacing
// between them alternated depending on whether a divider sat in between.
export function Section({ title, sub, children, flush = false }) {
  return (
    <section style={{ padding: `${GAP}px ${flush ? 0 : PAD}px 0` }}>
      {title && (
        <h2 style={{ ...T.h2, margin: 0, padding: flush ? `0 ${PAD}px` : 0 }}>{title}</h2>
      )}
      {sub && (
        <p style={{ ...T.meta, margin: "5px 0 0", padding: flush ? `0 ${PAD}px` : 0 }}>{sub}</p>
      )}
      <div style={{ marginTop: title || sub ? 14 : 0 }}>{children}</div>
    </section>
  );
}

// Where one subject ends. Full bleed to the gutter, nothing more.
export function Rule() {
  return <div style={{ height: 1, background: C.div, margin: `${GAP}px ${PAD}px 0` }} />;
}

// ─── A card ───
// Lifted, not outlined. The hairline stays because on a white page a shadow
// alone leaves the top edge undefined, but it is the shadow doing the work.
export function Card({ children, pad = 14, radius = R.card, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: radius, border: `1px solid ${C.div}`,
      boxShadow: SHADOW.card, padding: pad, ...style,
    }}>{children}</div>
  );
}

// A card whose children are rows with their own dividers, so it takes no
// padding of its own.
export function RowCard({ children, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: R.card, border: `1px solid ${C.div}`,
      boxShadow: SHADOW.card, overflow: "hidden", ...style,
    }}>{children}</div>
  );
}

// ─── The icon well ───
// Every icon on this page sits in one. The tint is the category, so a facility
// and a legal notice are told apart before either is read.
export function Well({ tone = "neutral", size = 30, children }) {
  const t = WELL[tone] || WELL.neutral;
  return (
    <span style={{
      width: size, height: size, borderRadius: R.well, background: t.bg,
      display: "grid", placeItems: "center", flexShrink: 0,
    }}>{children}</span>
  );
}

export function WellIcon({ Ico, tone = "neutral", size = 30, icon = 16 }) {
  const t = WELL[tone] || WELL.neutral;
  return (
    <Well tone={tone} size={size}>
      <Ico size={icon} color={t.fg} strokeWidth={2} />
    </Well>
  );
}

// ─── A row inside a RowCard ───
export function Row({ tone = "neutral", Ico, label, value, valueTone, sub, last, onClick, chevron }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "12px 13px", textAlign: "left",
        border: "none", background: "none", cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
        borderBottom: last ? "none" : `1px solid ${C.div}`,
      }}
    >
      {Ico && <WellIcon Ico={Ico} tone={tone} />}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...T.lead, display: "block" }}>{label}</span>
        {sub && <span style={{ ...T.micro, display: "block", marginTop: 2 }}>{sub}</span>}
      </span>
      {value && (
        <span style={{
          ...T.lead, flexShrink: 0,
          color: valueTone === "good" ? A.green : C.head,
        }}>{value}</span>
      )}
      {chevron && <ChevronRight size={17} color={C.icon} style={{ flexShrink: 0 }} />}
    </Tag>
  );
}

// ─── The one button that opens a sheet ───
// Full width, under the thing it expands. There is exactly one of these on the
// page so it is always recognisable.
export function MoreButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        width: "100%", marginTop: 12, padding: "13px 0", borderRadius: R.card,
        border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
        boxShadow: SHADOW.card, fontFamily: "inherit",
        fontSize: 13.5, fontWeight: 700, color: C.head,
      }}
    >
      {children}
      <ChevronRight size={15} color={A.pink} />
    </button>
  );
}

// ─── Chips ───
// Filter chips only. They never open anything, so they can never be confused
// with the button above.
export function Chip({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, borderRadius: R.pill, padding: "8px 14px", cursor: "pointer",
        fontFamily: "inherit", fontSize: 12.5, fontWeight: active ? 700 : 600,
        whiteSpace: "nowrap",
        border: `1px solid ${active ? A.pink : C.div}`,
        background: active ? A.pinkSoft : C.white,
        color: active ? "#C00840" : C.sub,
        boxShadow: active ? "none" : SHADOW.card,
        transition: "background 0.16s ease, border-color 0.16s ease",
      }}
    >
      {children}
      {count != null && <span style={{ marginLeft: 5, fontWeight: 600, opacity: 0.65 }}>{count}</span>}
    </button>
  );
}

// ─── A small tag inside a card ───
export function Tag({ children, tone = "neutral" }) {
  const t = WELL[tone] || WELL.neutral;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, color: t.fg, background: t.bg,
      borderRadius: 7, padding: "4px 8px", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

// A fact with a tick, in the app's green.
export function Yes({ children, no }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 600, color: no ? C.sub : A.green,
    }}>
      <Check size={13} strokeWidth={3} style={{ opacity: no ? 0.45 : 1 }} />
      {children}
    </span>
  );
}

export function CheckLine({ label, note }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "7px 0" }}>
      <Check size={14} color="#00857A" strokeWidth={2.6} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, color: C.head, lineHeight: 1.4 }}>{label}</span>
        {note && <span style={{ ...T.micro, display: "block", marginTop: 2 }}>{note}</span>}
      </span>
    </div>
  );
}

export function Stars({ n, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1.5 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} color={A.star} fill={A.star} strokeWidth={0} />
      ))}
    </span>
  );
}

// A count that reads as a link.
export function LinkText({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "none", background: "none", padding: 0, cursor: "pointer",
        fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: A.pink,
        textDecoration: "underline", textUnderlineOffset: 2,
      }}
    >{children}</button>
  );
}

// ─── A photo ───
// One component, so a photo is never accidentally a different aspect or a
// different grey when it has not loaded.
export function Photo({ src, w, h, radius = R.well, style }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      style={{
        width: w, height: h, borderRadius: radius, objectFit: "cover",
        display: "block", flexShrink: 0, background: A.photoBg, ...style,
      }}
    />
  );
}

// ─── The bottom sheet ───
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
    // Above Leaflet, which puts its panes at 400 and its controls at 1000.
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
        background: C.white, borderRadius: `${R.hero}px ${R.hero}px 0 0`,
        display: "flex", flexDirection: "column", overflow: "hidden",
        animation: closing ? "sheetSlideDown 0.22s ease forwards" : "sheetSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{ padding: "9px 0 0", flexShrink: 0 }}>
          <div style={{ width: 38, height: 4, borderRadius: R.pill, background: "#D5D7DA", margin: "0 auto" }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px 13px", borderBottom: `1px solid ${C.div}`, flexShrink: 0,
        }}>
          <h3 style={{ ...T.h2, flex: 1, margin: 0, fontSize: 17 }}>{title}</h3>
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

// Text that clamps to n lines.
export function Clamp({ lines = 4, children }) {
  return (
    <p style={{
      ...T.body, margin: 0,
      display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}>{children}</p>
  );
}
