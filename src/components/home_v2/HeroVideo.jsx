import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { C } from "../../data";

// Hero with brand video (placeholder for now). Autoplay-muted-loop, tap-to-unmute.
// Overlay: tagline + Plan My Trip CTA.
export default function HeroVideo({
  videoUrl = "", // placeholder until brand video lands
  poster = "https://cdn.30sundays.club/app_content/bali/handara_gate_63.jpg",
  tagline = "Saving relationships,\none vacation at a time.",
  height = 300,
}) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (ref.current && videoUrl) ref.current.play().catch(() => {});
  }, [videoUrl]);

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden", background: "#000" }}>
      {videoUrl ? (
        <video
          ref={ref}
          src={videoUrl}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85)" }} />
      )}

      {/* Top fade so TopBar reads */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />
      {/* Bottom fade for copy */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 260, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 100%)" }} />

      {/* Mute toggle (only shown if real video) */}
      {videoUrl && (
        <button
          onClick={() => setMuted(m => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          style={{
            position: "absolute", top: 70, right: 16, zIndex: 5,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
        </button>
      )}

      {/* Tagline + CTA - centered stack */}
      <div style={{
        position: "absolute", left: 18, right: 18, bottom: 26,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: "#fff", fontSize: 28, fontWeight: 500, lineHeight: 1.15,
          letterSpacing: "-0.5px", margin: "0 0 16px",
          whiteSpace: "pre-line",
          textShadow: "0 2px 12px rgba(0,0,0,0.45)",
        }}>
          {tagline}
        </h1>
        <button
          onClick={() => navigate("/build")}
          style={{
            background: C.p600, color: "#fff",
            border: "none", padding: "9px 20px", borderRadius: 999,
            fontSize: 14, fontWeight: 700, letterSpacing: "-0.1px",
            cursor: "pointer", boxShadow: "0 6px 16px rgba(227,27,83,0.4)",
          }}
        >
          Plan My Trip →
        </button>
      </div>

      {/* Placeholder watermark */}
      {!videoUrl && (
        <div style={{
          position: "absolute", top: 84, left: "50%", transform: "translateX(-50%)",
          padding: "3px 10px", borderRadius: 999,
          background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.85)",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase",
        }}>
          Brand video placeholder
        </div>
      )}
    </div>
  );
}
