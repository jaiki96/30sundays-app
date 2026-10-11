import { useFrameRect } from "../useFrameRect";

// The AI entry point. Light glass, like the rest of the app. On Home it is the
// full "Ask anything" bar above the nav; on itinerary screens it is a compact
// pill that returns to the same conversation.
export const ORB_GRADIENT = "conic-gradient(from 0deg, #FD014F, #FDA201, #00A898, #712BDA, #FD014F)";

export function Orb({ size = 34, style }) {
  return (
    <span className="ai-orb" style={{ width: size, height: size, ...style }}>
      <span className="ai-orb-glow" /><span className="ai-orb-core" />
    </span>
  );
}

const ORB_CSS = `
.ai-orb{position:relative;display:inline-block;border-radius:50%;flex:none;background:${ORB_GRADIENT};animation:aiSpin 7s linear infinite}
.ai-orb-glow{position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(253,1,79,.4),rgba(113,43,218,0) 70%);filter:blur(4px);animation:aiGlow 2.6s ease-in-out infinite}
.ai-orb-core{position:absolute;inset:4px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,#FFD6E2 35%,#FD014F 80%,#712BDA 120%)}
@keyframes aiSpin{to{transform:rotate(360deg)}}@keyframes aiGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
@media (prefers-reduced-motion:reduce){.ai-orb,.ai-orb-glow{animation:none}}`;

export default function AiAskBar({ onOpen, compact = false }) {
  const r = useFrameRect();
  if (compact) {
    return (
      <button onClick={() => onOpen("resume")} aria-label="Back to your assistant"
        style={{ position: "fixed", zIndex: 300, left: r.left + r.width - 16 - 190, width: 190, top: r.top + 54, height: 40, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(37,67,66,0.12)", borderRadius: 999, padding: "4px 12px 4px 5px",
          boxShadow: "0 8px 24px rgba(37,67,66,0.18)", cursor: "pointer", fontFamily: "inherit", color: "#254342", fontSize: 12.5, fontWeight: 700 }}>
        <style>{ORB_CSS}</style><Orb size={30} /><span>Back to assistant</span>
      </button>
    );
  }
  return (
    <div role="button" tabIndex={0} aria-label="Ask the trip assistant" onClick={() => onOpen("")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(""); }}
      style={{ position: "fixed", zIndex: 21, left: r.left + 16, width: r.width - 32, top: r.top + r.height - 86 - 52, height: 52, display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.86)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px) saturate(160%)", border: "1px solid rgba(37,67,66,0.12)", borderRadius: 999, padding: "8px 8px 8px 11px",
        boxShadow: "0 14px 34px rgba(37,67,66,0.16), inset 0 1px 0 rgba(255,255,255,0.8)", cursor: "text", fontFamily: "inherit" }}>
      <style>{ORB_CSS}</style>
      <Orb size={36} />
      <span style={{ flex: 1, color: "#254342", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Ask anything about your trip…</span>
      <button aria-label="Speak" onClick={(e) => { e.stopPropagation(); onOpen("voice"); }}
        style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(37,67,66,0.12)", background: "#FFF", color: "#254342", cursor: "pointer", display: "grid", placeItems: "center", fontSize: 15 }}>🎙</button>
    </div>
  );
}
