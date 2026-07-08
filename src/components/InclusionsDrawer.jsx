import { useState } from "react";
import { X as XIcon, Sparkles } from "lucide-react";
import { C } from "../data";
import { InclusionsBody } from "./InclusionsSection";

// Bottom drawer that shows a single hotel's special inclusions (honeymoon perks
// + value add-ons). Shared by planning, exploration and booked-trip screens so
// the inclusions never crowd the hotel card (which is reserved for upgrades).
export default function InclusionsDrawer({ hotelName, city, inclusions, onClose }) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };
  if (!inclusions) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div
        onClick={handleClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", animation: closing ? "fadeOutBg 0.22s ease-out forwards" : "fadeInBg 0.2s ease-out" }}
      />
      <div style={{
        position: "relative", background: C.white, borderRadius: "20px 20px 0 0",
        maxWidth: 420, margin: "0 auto", width: "100%", boxSizing: "border-box",
        maxHeight: "82vh", display: "flex", flexDirection: "column",
        animation: closing ? "sheetSlideDown 0.22s ease-out forwards" : "sheetSlideUp 0.25s ease-out",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "18px 18px 12px" }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Sparkles size={17} color={C.p600} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0, lineHeight: "20px" }}>Special inclusions</p>
            <p style={{ fontSize: 12.5, color: C.sub, margin: "2px 0 0" }}>{hotelName}{city ? ` · ${city}` : ""}</p>
          </div>
          <button onClick={handleClose} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
            <XIcon size={20} color={C.sub} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "0 18px 28px" }}>
          <InclusionsBody inclusions={inclusions} />
        </div>
      </div>
    </div>
  );
}
