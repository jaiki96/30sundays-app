import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X as XIcon, Share2, ThumbsUp, ThumbsDown, Sparkles, Wand2 } from "lucide-react";
import { C } from "../../data";
import { FrameLayer } from "./Sheet";
import ShareFallbackSheet from "./ShareFallbackSheet";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY, track } from "../../data/aiPhotosData";

const SWIPE_THRESHOLD = 45;

const ROUND = {
  width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
  background: "rgba(0,0,0,0.42)", border: "1px solid rgba(255,255,255,0.22)",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

// Full screen, one image at a time, swipe left and right through the set.
export default function PhotoViewer() {
  const navigate = useNavigate();
  const { images, viewerIndex, setViewerIndex, destination, rate } = useAIPhotos();
  const reduced = useReducedMotion();
  const [votes, setVotes] = useState({});
  const [shareFallback, setShareFallback] = useState(false);
  const openedAt = useRef(0);
  const dragX = useRef(null);

  const open = viewerIndex != null && images.length > 0;

  useEffect(() => { if (open) openedAt.current = Date.now(); }, [open]);

  // Arrow keys, so the set can be reviewed on a desktop too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") setViewerIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setViewerIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Escape") setViewerIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, setViewerIndex]);

  if (!open) return null;

  const image = images[viewerIndex];
  const vote = votes[image.id];

  const close = () => {
    track("ai_photos_fullscreen_closed", { view_duration_ms: Date.now() - openedAt.current });
    setViewerIndex(null);
  };

  const go = (next) => {
    const to = Math.max(0, Math.min(next, images.length - 1));
    if (to === viewerIndex) return;
    track("ai_photos_viewer_swiped", { from_index: viewerIndex, to_index: to });
    setViewerIndex(to);
  };

  const onPointerDown = (e) => { dragX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragX.current == null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    go(viewerIndex + (dx < 0 ? 1 : -1));
  };

  // Hands off to the OS drawer, so the couple picks the app themselves and
  // WhatsApp sits where their phone already puts it.
  const share = async () => {
    track("ai_photos_share_tapped", { destination: image.slug, image_index: viewerIndex });
    const data = {
      title: COPY.shareTitle(image.destination),
      text: COPY.shareText(image.destination, image.location),
      url: window.location.origin,
    };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        track("ai_photos_shared", { channel: "native", destination: image.slug, image_index: viewerIndex });
      } catch (e) {
        // Dismissing the OS drawer is a normal outcome, not a failure.
        if (e?.name !== "AbortError") setShareFallback(true);
      }
      return;
    }
    setShareFallback(true);
  };

  const castVote = (kind) => {
    if (vote) return;
    setVotes((v) => ({ ...v, [image.id]: kind }));
    rate(kind === "up" ? "ai_photos_thumbs_up" : "ai_photos_thumbs_down", viewerIndex);
  };

  // Straight into the wizard with this picture's place already chosen, so the
  // destination step is skipped.
  const planTrip = () => {
    track("ai_photos_plan_trip_tapped", { destination: image.destination, source: "viewer" });
    setViewerIndex(null);
    navigate(`/build?dest=${encodeURIComponent(image.destination)}`);
  };

  return (
    <FrameLayer zIndex={250}>
      {/* One track, so the swipe carries the image with it. */}
      <div
        style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragX.current = null; }}
      >
        <div style={{
          display: "flex", height: "100%", width: `${images.length * 100}%`,
          transform: `translateX(-${viewerIndex * (100 / images.length)}%)`,
          transition: reduced ? "none" : "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {images.map((img) => (
            <div key={img.id} style={{ width: `${100 / images.length}%`, height: "100%", flexShrink: 0, position: "relative" }}>
              <img src={img.src} alt={`You both at ${img.location}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.82) 100%)" }} />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 14px 0" }}>
        <button onClick={close} aria-label="Close" style={ROUND}>
          <XIcon size={20} color="#fff" />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>
          {viewerIndex + 1} of {images.length}
        </span>
        <button onClick={share} aria-label="Share" style={ROUND}>
          <Share2 size={19} color="#fff" />
        </button>
      </div>

      {/* Bottom block */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 18px calc(20px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 9, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 999, padding: "4px 9px", backdropFilter: "blur(6px)" }}>
          <Sparkles size={11} color="#fff" />
          <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.3px", color: "rgba(255,255,255,0.95)" }}>{COPY.aiTag}</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.3px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", margin: 0 }}>
              You both in {image.destination}
            </p>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: "5px 0 0", letterSpacing: "-0.5px", lineHeight: "26px", textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}>
              {image.location}
            </h2>
          </div>
          <button onClick={() => castVote("up")} aria-label="Good likeness" style={{ ...ROUND, background: vote === "up" ? "rgba(255,255,255,0.3)" : ROUND.background, cursor: vote ? "default" : "pointer" }}>
            <ThumbsUp size={17} color="#fff" fill={vote === "up" ? "#fff" : "none"} />
          </button>
          <button onClick={() => castVote("down")} aria-label="Not a good likeness" style={{ ...ROUND, background: vote === "down" ? "rgba(255,255,255,0.3)" : ROUND.background, cursor: vote ? "default" : "pointer" }}>
            <ThumbsDown size={17} color="#fff" fill={vote === "down" ? "#fff" : "none"} />
          </button>
        </div>

        {/* Dots, so the set reads as a set. */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, margin: "14px 0 12px" }}>
          {images.map((img, i) => (
            <span key={img.id} style={{
              width: i === viewerIndex ? 18 : 6, height: 6, borderRadius: 3,
              background: i === viewerIndex ? "#fff" : "rgba(255,255,255,0.42)",
              transition: reduced ? "none" : "width 0.3s ease, background 0.3s ease",
            }} />
          ))}
        </div>

        <button
          onClick={planTrip}
          style={{
            display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8,
            minHeight: 48, borderRadius: 999, border: "none", background: C.p600, color: "#fff",
            fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(227,27,83,0.4)",
          }}
        >
          <Wand2 size={16} color="#fff" /> {COPY.planTripCta(image.destination)}
        </button>
      </div>

      <ShareFallbackSheet open={shareFallback} onClose={() => setShareFallback(false)} image={image} />
    </FrameLayer>
  );
}
