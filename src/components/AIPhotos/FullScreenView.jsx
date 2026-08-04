import { useEffect, useRef, useState } from "react";
import { X as XIcon, EyeOff, ThumbsDown, Sparkles } from "lucide-react";
import { FrameLayer } from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY, track } from "../../data/aiPhotosData";

// Tap-through view. Close and hide only in v1, plus the thumbs-down signal and
// the AI label. The label is a low cost hedge on synthetic media rules.
export default function FullScreenView() {
  const { fullScreen, setFullScreen, image, onHidden, onThumbsDown } = useAIPhotos();
  const openedAt = useRef(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (fullScreen) { openedAt.current = Date.now(); setVoted(false); }
  }, [fullScreen]);

  if (!fullScreen || !image) return null;

  const close = () => {
    track("ai_photos_fullscreen_viewed", { view_duration_ms: Date.now() - openedAt.current });
    setFullScreen(false);
  };

  return (
    <FrameLayer zIndex={240}>
      <img src={image.src} alt={`You both at ${image.location}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 12px 0" }}>
        <button
          onClick={close}
          aria-label="Close"
          style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <XIcon size={20} color="#fff" />
        </button>
        <button
          onClick={onHidden}
          aria-label="Hide from hero"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 48, padding: "0 16px", borderRadius: 999, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.22)", cursor: "pointer", fontFamily: "inherit" }}
        >
          <EyeOff size={15} color="#fff" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Hide</span>
        </button>
      </div>

      {/* Bottom block */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 18px calc(28px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 10, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "4px 9px", backdropFilter: "blur(6px)" }}>
          <Sparkles size={11} color="#fff" />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3px", color: "rgba(255,255,255,0.95)" }}>{COPY.aiTag}</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(255,255,255,0.82)", margin: 0 }}>
              You both in {image.destination}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "5px 0 0", letterSpacing: "-0.5px", textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>
              {image.location}
            </h2>
          </div>
          <button
            onClick={() => { if (!voted) { onThumbsDown(); setVoted(true); } }}
            aria-label="Not a good likeness"
            style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: voted ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", cursor: voted ? "default" : "pointer" }}
          >
            <ThumbsDown size={18} color="#fff" fill={voted ? "#fff" : "none"} />
          </button>
        </div>
      </div>
    </FrameLayer>
  );
}
