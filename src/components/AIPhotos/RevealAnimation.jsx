import { useEffect, useState } from "react";
import { C } from "../../data";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY } from "../../data/aiPhotosData";

const DURATION_MS = 1900;

// One-time reveal, played in place so the image settles straight into the
// carousel. Marked seen the moment it renders, so backgrounding the app
// mid-reveal never replays it.
export default function RevealAnimation({ location }) {
  const { onRevealPlayed } = useAIPhotos();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    onRevealPlayed();
    if (reduced) { setDone(true); return; }
    const t = setTimeout(() => setDone(true), DURATION_MS);
    return () => clearTimeout(t);
  }, [onRevealPlayed, reduced]);

  if (done || reduced) return null;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Blush veil lifting off the photo */}
      <div style={{
        position: "absolute", inset: 0, background: C.p100,
        animation: `aiRevealVeil ${DURATION_MS}ms ease-out forwards`,
      }} />
      {/* Single coral sweep. The one place besides the primary CTA that uses it. */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: "45%",
        background: `linear-gradient(90deg, transparent, ${C.p300}, transparent)`,
        opacity: 0.85, animation: `aiRevealSweep ${DURATION_MS}ms ease-in-out forwards`,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: "42%", textAlign: "center",
        animation: `aiRevealKicker ${DURATION_MS}ms ease-out forwards`,
      }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
          {COPY.revealKicker}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 17, fontWeight: 700, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          {location}
        </p>
      </div>
    </div>
  );
}
