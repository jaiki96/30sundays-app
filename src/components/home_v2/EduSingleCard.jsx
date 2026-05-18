import { GraduationCap, Play } from "lucide-react";
import { C } from "../../data";
import SundaySchoolMasthead from "./SundaySchoolMasthead";

// Sunday School - single lesson section.
// Small "Sunday School" chip + tagline byline at top, big DM Serif value title
// (the previous card title is promoted to the section headline), then a clean
// video tile (poster + GlassPlay + duration). No card body anymore.
export default function EduSingleCard({
  title,
  poster,
  videoUrl,
  duration,
  onPlay,
  tagline,            // pass "" to suppress the byline on repeat SS sections
}) {
  return (
    <div style={{
      background: "#FCF4CC",
      padding: "26px 16px 28px",
      borderTop: "1px solid rgba(180,130,30,0.22)",
      borderBottom: "1px solid rgba(180,130,30,0.22)",
    }}>
      <SundaySchoolMasthead valueTitle={title} tagline={tagline} />

      {/* Video tile - poster + GlassPlay + duration. No body. */}
      <div style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        border: "0.5px solid rgba(24,29,39,0.06)",
        boxShadow: "0 2px 8px rgba(24,29,39,0.04)",
        height: 220,
        background: "#E89A7C",
      }}>
        {poster && <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }} />

        <GlassPlay onClick={onPlay} size={64} iconSize={26} />

        {duration && (
          <div style={{
            position: "absolute", bottom: 12, right: 12,
            background: "rgba(24,29,39,0.78)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            color: "#fff",
            padding: "4px 8px", borderRadius: 5,
            fontSize: 11, fontWeight: 600,
            zIndex: 2,
          }}>
            {duration}
          </div>
        )}
      </div>
    </div>
  );
}

// Glassmorphism play button - Apple visionOS / iOS 26 style.
// Translucent white, blurred backdrop, soft inner highlight, deep ambient shadow.
export function GlassPlay({ onClick, size = 58, iconSize = 22 }) {
  return (
    <button
      onClick={onClick}
      aria-label="Play"
      style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: size, height: size, borderRadius: "50%",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.55), " +     // top inner highlight
          "inset 0 -1px 0 rgba(255,255,255,0.10), " +    // bottom inner highlight
          "0 10px 30px rgba(0,0,0,0.25), " +             // ambient drop
          "0 2px 6px rgba(0,0,0,0.18)",                  // contact shadow
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 3,
      }}
    >
      <Play
        size={iconSize}
        fill="#fff"
        color="#fff"
        strokeWidth={0}
        style={{ marginLeft: 2, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      />
    </button>
  );
}

// Section header used by both single + multi Sunday School blocks.
export function SectionHead() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <GraduationCap size={22} color={C.p600} strokeWidth={2.2} />
      <span style={{
        fontSize: 18, fontWeight: 700, color: C.head, letterSpacing: "-0.2px",
      }}>
        Sunday School
      </span>
    </div>
  );
}
