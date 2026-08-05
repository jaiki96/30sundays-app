import { useState } from "react";
import { ChevronRight, CloudOff } from "lucide-react";
import SlideShell from "./SlideShell";
import RevealAnimation from "../AIPhotos/RevealAnimation";
import { useAIPhotos } from "../../state/useAIPhotos";
import { COPY } from "../../data/aiPhotosData";

const PAD = 18;

// The AI image slot. Always index 0 when present. Tapping opens full screen.
export default function PersonalizedSlide() {
  const { image, seen, offline, onHeroTapped } = useAIPhotos();
  // Captured once on mount. The reveal marks itself seen straight away, so
  // reading `seen` live here would tear the animation down on its first frame.
  const [playReveal] = useState(() => !seen);
  if (!image) return null;

  return (
    <SlideShell image={image.src} alt={`You both at ${image.location}`} onClick={onHeroTapped}>
      {/* Plays once on first render after a generation, then never again. */}
      {playReveal && <RevealAnimation location={image.location} />}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px 44px` }}>
        {offline && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(6px)" }}>
            <CloudOff size={12} color="#fff" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{COPY.offlineTag}</span>
          </div>
        )}

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", marginBottom: 6 }}>
          You both in {image.destination}
        </div>
        <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: "26px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
          {image.location}
        </h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 2, marginTop: 10, fontSize: 12, fontWeight: 700, color: "#fff" }}>
          Tap to open <ChevronRight size={13} color="#fff" />
        </div>
      </div>
    </SlideShell>
  );
}
