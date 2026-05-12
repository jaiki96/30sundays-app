import { C } from "../../data";
import { SectionHead, GlassPlay } from "./EduSingleCard";

// Sunday School — series carousel (multi-video).
// Just a section header + horizontal scroll of lesson cards.
export default function EduMultiCarousel({ lessons }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ padding: "0 16px" }}>
        <SectionHead />
      </div>

      <div className="hs" style={{ gap: 12, padding: "4px 16px 4px" }}>
        {lessons.map((l, i) => <LessonCard key={i} l={l} />)}
      </div>
    </div>
  );
}

function LessonCard({ l }) {
  return (
    <div style={{
      flex: "0 0 200px", width: 200,
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "0.5px solid rgba(24,29,39,0.06)",
      boxShadow: "0 2px 8px rgba(24,29,39,0.04)",
    }}>
      <div style={{ position: "relative", height: 252, overflow: "hidden", background: "#d6cfc4" }}>
        {l.poster && <img src={l.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }} />

        <GlassPlay size={48} iconSize={18} />

        {l.duration && (
          <div style={{
            position: "absolute", bottom: 10, right: 10,
            background: "rgba(24,29,39,0.78)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            padding: "3px 7px", borderRadius: 4,
            fontSize: 11, fontWeight: 600,
            zIndex: 2,
          }}>
            {l.duration}
          </div>
        )}
      </div>

      <div style={{ padding: "12px 13px 14px" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: C.p600,
          letterSpacing: "1px", textTransform: "uppercase",
          marginBottom: 4,
        }}>
          {l.tag}
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: C.head,
          lineHeight: 1.3, letterSpacing: "-0.1px",
        }}>
          {l.hook}
        </div>
      </div>
    </div>
  );
}
