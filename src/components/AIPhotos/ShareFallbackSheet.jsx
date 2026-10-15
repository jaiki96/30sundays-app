import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Instagram, MessageCircle, Mail, Link2, MoreHorizontal, Check } from "lucide-react";
import { C } from "../../data";
import { COPY, track } from "../../data/aiPhotosData";

// Stand-in for the OS share drawer, shown only where the real one does not
// exist (desktop review, older browsers). On a phone the share button calls
// navigator.share and this never appears. WhatsApp sits first either way: on
// iOS and Android it is the couple's default, and here it leads the row.
const TARGETS = [
  { key: "whatsapp", label: "WhatsApp", img: "/whatsapp.webp", bg: "#fff" },
  { key: "instagram", label: "Instagram", icon: Instagram, bg: "#F4E7F5", color: "#C13584" },
  { key: "messages", label: "Messages", icon: MessageCircle, bg: "#E4F7E7", color: "#1FA855" },
  { key: "mail", label: "Mail", icon: Mail, bg: "#E6F0FE", color: "#1A73E8" },
  { key: "more", label: "More", icon: MoreHorizontal, bg: C.bg, color: C.sub },
];

export default function ShareFallbackSheet({ open, onClose, image }) {
  const [frame, setFrame] = useState(null);
  const [done, setDone] = useState(null);

  useEffect(() => { setFrame(document.getElementById("phone-frame")); }, []);
  useEffect(() => { if (open) setDone(null); }, [open]);

  if (!open || !frame) return null;

  const pick = (t) => {
    track("ai_photos_shared", { channel: t.key, destination: image?.slug, location_index: image?.locationIndex });
    setDone(t.key);
    setTimeout(onClose, 900);
  };

  return createPortal(
    <div style={{ position: "absolute", inset: 0, zIndex: 260, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", animation: "fadeInBg 0.2s ease forwards" }} />

      <div style={{
        position: "relative", background: C.white, borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.18)", animation: "sheetSlideUp 0.24s ease-out forwards",
        padding: "10px 0 calc(16px + env(safe-area-inset-bottom))",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 14px" }} />

        {/* What is being shared */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 18px 14px" }}>
          {image && <img src={image.src} alt="" style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>{COPY.shareSheetTitle}</p>
            <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {image ? COPY.shareTitle(image.destination) : ""}
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: C.div, margin: "0 18px" }} />

        {/* Targets, WhatsApp first */}
        <div className="hide-scrollbar" style={{ display: "flex", gap: 18, overflowX: "auto", padding: "16px 18px 6px" }}>
          {TARGETS.map((t) => {
            const Icon = t.icon;
            const picked = done === t.key;
            return (
              <button
                key={t.key}
                onClick={() => pick(t)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, minWidth: 62, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
              >
                <span style={{
                  width: 54, height: 54, borderRadius: "50%", background: t.bg,
                  border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {picked
                    ? <Check size={22} color={C.sText || "#027A48"} strokeWidth={2.6} />
                    : t.img
                      ? <img src={t.img} alt="" width={30} height={30} style={{ display: "block" }} />
                      : <Icon size={23} color={t.color} />}
                </span>
                <span style={{ fontSize: 11.5, color: C.sub, fontWeight: 500 }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: C.div, margin: "12px 18px 0" }} />

        <button
          onClick={() => pick({ key: "copy_link", label: "Copy link" })}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 48, padding: "12px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
        >
          {done === "copy_link" ? <Check size={18} color={C.sText || "#027A48"} /> : <Link2 size={18} color={C.sub} />}
          <span style={{ fontSize: 14.5, fontWeight: 600, color: C.head }}>
            {done === "copy_link" ? COPY.shareCopied : "Copy link"}
          </span>
        </button>

        <p style={{ fontSize: 11, color: C.inact, margin: "4px 18px 0", lineHeight: "15px" }}>
          Prototype stand-in. On a phone this button opens the real iOS or Android share drawer.
        </p>
      </div>
    </div>,
    frame
  );
}
