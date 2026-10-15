import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X as XIcon } from "lucide-react";
import { C } from "../../data";

// Every AI Photos surface renders inside the phone frame, not the browser
// viewport, so sheets sit against the phone's bottom edge on desktop too.
function useFrame() {
  const [el, setEl] = useState(null);
  useEffect(() => { setEl(document.getElementById("phone-frame")); }, []);
  return el;
}

// Full-bleed layer inside the frame. Used by the reveal and the full screen view.
export function FrameLayer({ children, zIndex = 220, background = "#000" }) {
  const frame = useFrame();
  if (!frame) return null;
  return createPortal(
    <div style={{ position: "absolute", inset: 0, zIndex, background, overflow: "hidden" }}>{children}</div>,
    frame
  );
}

// Half-modal bottom sheet. Never a full screen takeover: it caps at 82% of the
// frame so the home screen stays visible behind it.
export default function Sheet({ open, onClose, title, sub, children, footer, zIndex = 200 }) {
  const frame = useFrame();
  const [closing, setClosing] = useState(false);

  useEffect(() => { if (open) setClosing(false); }, [open]);

  if (!open || !frame) return null;

  const close = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose?.(); }, 200);
  };

  return createPortal(
    <div style={{ position: "absolute", inset: 0, zIndex, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div
        onClick={close}
        style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
          animation: `${closing ? "fadeOutBg" : "fadeInBg"} 0.2s ease forwards`,
        }}
      />
      <div style={{
        position: "relative", width: "100%", background: C.white,
        borderRadius: "20px 20px 0 0", maxHeight: "82%", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
        animation: `${closing ? "sheetSlideDown" : "sheetSlideUp"} 0.24s ease-out forwards`,
      }}>
        <div style={{ padding: "10px 18px 0", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 14px" }} />
          {title && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: sub ? 4 : 14 }}>
              <h2 style={{ flex: 1, fontSize: 18, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
              <button
                onClick={close}
                aria-label="Close"
                style={{ width: 48, height: 48, margin: "-14px -14px 0 0", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
              >
                <XIcon size={20} color={C.sub} />
              </button>
            </div>
          )}
          {sub && <p style={{ fontSize: 13, color: C.sub, margin: "0 0 14px", lineHeight: "18px" }}>{sub}</p>}
        </div>

        <div className="hide-scrollbar" style={{ overflowY: "auto", padding: "0 18px", flex: 1 }}>{children}</div>

        {footer && (
          <div style={{ padding: "14px 18px calc(16px + env(safe-area-inset-bottom))", flexShrink: 0 }}>{footer}</div>
        )}
        {!footer && <div style={{ height: "calc(16px + env(safe-area-inset-bottom))", flexShrink: 0 }} />}
      </div>
    </div>,
    frame
  );
}

// Primary action. Coral is reserved for this and the reveal accent.
export function PrimaryButton({ children, disabled, onClick, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", minHeight: 48, borderRadius: 12, border: "none",
        background: disabled ? C.div : C.p600, color: disabled ? C.inact : "#fff",
        fontSize: 15, fontWeight: 700, fontFamily: "inherit",
        cursor: disabled ? "default" : "pointer", ...style,
      }}
    >
      {children}
    </button>
  );
}
