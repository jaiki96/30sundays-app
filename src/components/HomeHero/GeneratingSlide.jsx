import { RefreshCw } from "lucide-react";
import { C } from "../../data";
import SlideShell from "./SlideShell";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY, getDestination } from "../../data/aiPhotosData";

const PAD = 18;

// In-progress and failed both live in slot 0. Neither blocks the home screen:
// the carousel keeps rotating and everything below stays interactive.
export default function GeneratingSlide({ failed }) {
  const { destination, onGenerationRetried } = useAIPhotos();
  const reduced = useReducedMotion();
  const dest = getDestination(destination);

  return (
    <SlideShell
      image={dest?.hero}
      imageStyle={{ filter: "blur(14px) saturate(0.8)", transform: "scale(1.12)" }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px 44px` }}>
        {failed ? (
          <>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.4px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
              {COPY.failedTitle}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", margin: "0 0 14px" }}>{COPY.failedSub}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onGenerationRetried(); }}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, padding: "0 20px", borderRadius: 12, border: "none", background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 6px 20px rgba(227,27,83,0.35)" }}
            >
              <RefreshCw size={15} color="#fff" /> {COPY.failedCta}
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: 34, height: 34, borderRadius: "50%", marginBottom: 14,
                border: "2.5px solid rgba(255,255,255,0.28)", borderTopColor: "#fff",
                animation: reduced ? "none" : "spin 0.9s linear infinite",
              }}
            />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.4px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
              {COPY.generatingTitle(dest?.name || "your destination")}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", margin: 0 }}>{COPY.generatingSub}</p>
          </>
        )}
      </div>
    </SlideShell>
  );
}
