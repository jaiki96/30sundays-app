import { useState, useRef, useEffect } from "react";
import { Play, X } from "lucide-react";
import { C } from "../../data";

// Reusable portrait-aspect video tile. Click → fullscreen overlay video.
// Falls back to poster + play button if videoUrl missing.
export default function PortraitVideo({
  poster,
  videoUrl,
  duration,
  width = 240,
  aspect = "9 / 16",   // override e.g. "16 / 10" for landscape thumbs
  radius = 18,
  topRightSlot,        // node rendered absolute top-right (e.g. duration chip)
  bottomSlot,          // node rendered overlay bottom (e.g. caption)
  topLeftSlot,         // node rendered absolute top-left (e.g. issue stamp)
  onClick,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (open && ref.current) ref.current.play().catch(() => {});
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => { onClick?.(); if (videoUrl) setOpen(true); }}
        style={{
          width,
          aspectRatio: aspect,
          borderRadius: radius,
          overflow: "hidden",
          position: "relative",
          border: "none",
          padding: 0,
          cursor: "pointer",
          background: "#000",
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
          flexShrink: 0,
        }}
      >
        <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {/* Bottom gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)" }} />

        {/* Center play */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
        }}>
          <Play size={22} color={C.head} fill={C.head} />
        </div>

        {topLeftSlot && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>{topLeftSlot}</div>
        )}
        {topRightSlot && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>{topRightSlot}</div>
        )}
        {!topRightSlot && duration && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(0,0,0,0.55)", color: "#fff",
            fontSize: 11, fontWeight: 600, padding: "3px 7px", borderRadius: 6,
          }}>
            {duration}
          </div>
        )}
        {bottomSlot && (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12 }}>{bottomSlot}</div>
        )}
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)",
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={20} color="#fff" />
          </button>
          <video
            ref={ref}
            src={videoUrl}
            controls
            playsInline
            style={{ maxWidth: "92%", maxHeight: "92%", borderRadius: 12, background: "#000" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
