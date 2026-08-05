import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X as XIcon, Share2, ThumbsDown, ThumbsUp, Sparkles, Check } from "lucide-react";
import { C } from "../../data";
import { FrameLayer } from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY, track } from "../../data/aiPhotosData";

const ROUND_BTN = {
  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.22)",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

// Tap-through view. Close, share, the two quality signals, the AI label, and
// the way into planning the trip the image is selling.
export default function FullScreenView() {
  const navigate = useNavigate();
  const { fullScreen, setFullScreen, image, onThumbsUp, onThumbsDown } = useAIPhotos();
  const openedAt = useRef(0);
  const [vote, setVote] = useState(null); // "up" | "down"
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (fullScreen) { openedAt.current = Date.now(); setVote(null); setShared(false); }
  }, [fullScreen]);

  if (!fullScreen || !image) return null;

  const close = () => {
    track("ai_photos_fullscreen_viewed", { view_duration_ms: Date.now() - openedAt.current });
    setFullScreen(false);
  };

  // Prototype share: no sheet, no real link. Confirms the tap and moves on.
  const share = () => {
    track("ai_photos_shared", { destination: image.slug, location_index: image.locationIndex });
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  const castVote = (kind) => {
    if (vote) return;
    setVote(kind);
    if (kind === "up") onThumbsUp(); else onThumbsDown();
  };

  const planTrip = () => {
    track("ai_photos_plan_trip_tapped", { destination: image.slug });
    setFullScreen(false);
    navigate(`/destination/${image.destination}`);
  };

  return (
    <FrameLayer zIndex={240}>
      <img src={image.src} alt={`You both at ${image.location}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 100%)" }} />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 12px 0" }}>
        <button onClick={close} aria-label="Close" style={ROUND_BTN}>
          <XIcon size={20} color="#fff" />
        </button>
        <button onClick={share} aria-label="Share" style={ROUND_BTN}>
          {shared ? <Check size={20} color="#fff" /> : <Share2 size={19} color="#fff" />}
        </button>
      </div>

      {/* Share confirmation */}
      {shared && (
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
          <span style={{ background: "rgba(0,0,0,0.72)", color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 999 }}>
            {COPY.shareCopied}
          </span>
        </div>
      )}

      {/* Bottom block */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 18px calc(24px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 10, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "4px 9px", backdropFilter: "blur(6px)" }}>
          <Sparkles size={11} color="#fff" />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3px", color: "rgba(255,255,255,0.95)" }}>{COPY.aiTag}</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(255,255,255,0.82)", margin: 0 }}>
              You both in {image.destination}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "5px 0 0", letterSpacing: "-0.5px", textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>
              {image.location}
            </h2>
          </div>

          {/* Quality signals, up first. */}
          <button
            onClick={() => castVote("up")}
            aria-label="Good likeness"
            style={{ ...ROUND_BTN, background: vote === "up" ? "rgba(255,255,255,0.3)" : ROUND_BTN.background, cursor: vote ? "default" : "pointer" }}
          >
            <ThumbsUp size={18} color="#fff" fill={vote === "up" ? "#fff" : "none"} />
          </button>
          <button
            onClick={() => castVote("down")}
            aria-label="Not a good likeness"
            style={{ ...ROUND_BTN, background: vote === "down" ? "rgba(255,255,255,0.3)" : ROUND_BTN.background, cursor: vote ? "default" : "pointer" }}
          >
            <ThumbsDown size={18} color="#fff" fill={vote === "down" ? "#fff" : "none"} />
          </button>
        </div>

        {/* The point of the whole feature: turn the image into a trip. */}
        <button
          onClick={planTrip}
          style={{
            width: "100%", minHeight: 48, marginTop: 16, borderRadius: 12, border: "none",
            background: C.p600, color: "#fff", fontSize: 15, fontWeight: 700,
            fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 20px rgba(227,27,83,0.35)",
          }}
        >
          {COPY.planTripCta(image.destination)}
        </button>
      </div>
    </FrameLayer>
  );
}
