import { useFrameRect } from "../useFrameRect";

// Persistent "Ask anything" bar — the AI entry point. Sits just above the glass
// BottomNav (which is 60px tall at bottom:16), pinned inside the phone frame.
export const ORB_GRADIENT = "conic-gradient(from 0deg, #FD014F, #FDA201, #00A898, #712BDA, #FD014F)";

export function Orb({ size = 34, style }) {
  return (
    <span className="ai-orb" style={{ width: size, height: size, ...style }}>
      <span className="ai-orb-glow" />
      <span className="ai-orb-core" />
    </span>
  );
}

export default function AiAskBar({ onOpen, hidden }) {
  const r = useFrameRect();
  if (hidden) return null;
  return (
    <div
      role="button" tabIndex={0} aria-label="Ask the trip assistant"
      onClick={() => onOpen("")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(""); }}
      style={{
        position: "fixed", zIndex: 21,
        left: r.left + 16, width: r.width - 32, top: r.top + r.height - 86 - 50,
        height: 50, display: "flex", alignItems: "center", gap: 10,
        background: "rgba(13,21,20,0.86)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "8px 8px 8px 12px",
        boxShadow: "0 14px 34px rgba(0,0,0,0.32)", cursor: "text", fontFamily: "inherit",
      }}
    >
      <style>{`
        .ai-orb{position:relative;display:inline-block;border-radius:50%;flex:none;background:${ORB_GRADIENT};animation:aiSpin 7s linear infinite}
        .ai-orb-glow{position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(circle,rgba(253,1,79,.45),rgba(113,43,218,0) 70%);filter:blur(4px);animation:aiGlow 2.6s ease-in-out infinite}
        .ai-orb-core{position:absolute;inset:4px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0%,#FFD6E2 35%,#FD014F 80%,#712BDA 120%)}
        @keyframes aiSpin{to{transform:rotate(360deg)}}
        @keyframes aiGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
        @media (prefers-reduced-motion:reduce){.ai-orb,.ai-orb-glow{animation:none}}
      `}</style>
      <Orb />
      <span style={{ flex: 1, color: "#D7E1DF", fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        Ask anything about your trip…
      </span>
      <button
        aria-label="Speak" onClick={(e) => { e.stopPropagation(); onOpen("voice"); }}
        style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", fontSize: 15 }}
      >🎙</button>
    </div>
  );
}
