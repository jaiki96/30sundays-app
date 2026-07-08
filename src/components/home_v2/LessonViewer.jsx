import { X, Heart } from "lucide-react";
import { C } from "../../data";
import { useSaves } from "../../data/saves";
import { GlassPlay } from "./EduSingleCard";

// Full-screen Sunday School video: the video (or poster fallback) fills most
// of the screen, with a compact wishlist strip underneath for the specific
// places or experiences that video covers. Minimal by design: one row of
// heart-toggle chips, no separate list/heart split.
export default function LessonViewer({ lesson, onClose }) {
  const { forDest, toggleRegion, toggleActivity } = useSaves();
  const topics = lesson.topics || [];
  const title = lesson.hook || lesson.tag || "";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
      {/* Video / poster area - ~75% of the screen */}
      <div style={{ flex: "0 0 75%", position: "relative", background: "#000" }}>
        {lesson.videoUrl ? (
          <video src={lesson.videoUrl} autoPlay controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <img src={lesson.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <GlassPlay size={56} iconSize={22} />
          </>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <X size={20} color="#fff" />
        </button>
      </div>

      {/* Wishlist strip */}
      <div style={{ flex: 1, background: C.white, padding: "14px 16px", overflowY: "auto" }}>
        {title && <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: C.head }}>{title}</p>}
        {topics.length > 0 && (
          <>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: C.sub }}>Wishlist what's in this video</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topics.map((t, i) => {
                const saved = t.kind === "region"
                  ? forDest(t.dest).regions.includes(t.key)
                  : forDest(t.dest).activities.includes(t.key);
                const toggle = () => (t.kind === "region" ? toggleRegion(t.dest, t.key) : toggleActivity(t.dest, t.key));
                const showDest = topics.some(o => o.dest !== t.dest);
                return (
                  <button key={i} onClick={toggle} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20,
                    border: `1px solid ${saved ? C.p600 : C.div}`, background: saved ? C.p100 : C.white,
                    fontSize: 12.5, fontWeight: 600, color: C.head, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {showDest && <span style={{ color: C.inact, fontWeight: 500 }}>{t.dest}:</span>}
                    {t.label || t.key}
                    <Heart size={12} color={C.p600} fill={saved ? C.p600 : "none"} strokeWidth={2.4} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
