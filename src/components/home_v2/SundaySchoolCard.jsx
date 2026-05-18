import { GraduationCap } from "lucide-react";
import { C } from "../../data";
import PortraitVideo from "./PortraitVideo";

// Distinctive 30 Sundays "lesson card" - warm cream stage with a single portrait video.
// Used for the seasonal lesson under the hero. Comparison videos use a leaner CompareVideo card.
export default function SundaySchoolCard({ lesson }) {
  const cream = "#FBF3E7";
  const ink = "#1A1A1A";
  const accent = C.p600;

  return (
    <div style={{ padding: "0 16px" }}>
      <div
        style={{
          background: cream,
          borderRadius: 22,
          padding: "18px 18px 22px",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${C.div}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Decorative diagonal lines top-right (chalkboard hint) */}
        <div
          aria-hidden
          style={{
            position: "absolute", top: -10, right: -10, width: 80, height: 80, opacity: 0.18,
            background: `repeating-linear-gradient(45deg, ${accent} 0 2px, transparent 2px 8px)`,
            transform: "rotate(8deg)", pointerEvents: "none",
          }}
        />

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={16} color={cream} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: ink, textTransform: "uppercase" }}>
            Sunday School
          </div>
          <div style={{ flex: 1, height: 1, background: ink, opacity: 0.18 }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", color: ink, opacity: 0.55 }}>
            Issue {lesson.issue}
          </div>
        </div>

        {/* Title block */}
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15,
          margin: "8px 0 6px", letterSpacing: "-0.4px",
        }}>
          {lesson.title}
        </h2>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 16px", lineHeight: 1.45 }}>
          {lesson.subtitle}
        </p>

        {/* Video stage */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            padding: 8,
            background: ink,
            borderRadius: 22,
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
          }}>
            <PortraitVideo
              poster={lesson.poster}
              videoUrl={lesson.videoUrl}
              duration={lesson.duration}
              width={220}
              radius={14}
              topLeftSlot={
                <div style={{
                  background: accent, color: "#fff", fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.8px", padding: "3px 7px", borderRadius: 4, textTransform: "uppercase",
                }}>
                  Lesson {lesson.issue}
                </div>
              }
            />
          </div>
        </div>

        {/* Footer caption */}
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: ink, opacity: 0.55, letterSpacing: "0.4px" }}>
          A 2-minute Sunday lesson · Tap to watch
        </div>
      </div>
    </div>
  );
}
