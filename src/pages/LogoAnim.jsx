import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw } from "lucide-react";
import svgMarkup from "../assets/logo-anim.svg?raw";

// Splash animation preview — 30 Sundays logo on Blush canvas.
// Sequence: two arrive → spark → Sundays reveals → settle → hold.
// Total: ~2.2s.
// Live at: /logo-anim
export default function LogoAnim() {
  const navigate = useNavigate();
  const [runId, setRunId] = useState(0); // bump to remount SVG and replay

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Back button — subtle glass pill */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Back"
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top, 0px) + 16px)",
          left: 16,
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "0.5px solid rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 3,
          boxShadow: "0 4px 12px rgba(15,18,30,0.05)",
        }}
      >
        <ArrowLeft size={17} color="#254342" />
      </button>

      {/* Replay button — bottom centre */}
      <button
        onClick={() => setRunId((n) => n + 1)}
        aria-label="Replay"
        style={{
          position: "absolute",
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "0.5px solid rgba(255,255,255,0.85)",
          fontSize: 13,
          fontWeight: 600,
          color: "#254342",
          cursor: "pointer",
          zIndex: 3,
          boxShadow:
            "0 6px 18px rgba(15,18,30,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <RotateCw size={14} color="#254342" />
        Replay
      </button>

      {/* Logo — re-mounts on replay via key, which restarts the CSS animations */}
      <div
        key={runId}
        style={{
          width: "78%",
          maxWidth: 460,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    </div>
  );
}
