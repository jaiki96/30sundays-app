import { useEffect, useRef, useState } from "react";
import { Sparkles, X as XIcon } from "lucide-react";
import { C } from "../../data";
import { HERO_SCRIM } from "./SlideShell";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY, TEASER_DESTINATIONS, TEASER_PLAIN_PHOTO, track } from "../../data/aiPhotosData";

const PAD = 18;
// Matches the heroWipe keyframes. Only used to pace the word when motion is off.
const CYCLE_MS = 5500;

// The couple's own photo. Muted and cropped in close so it reads as a snapshot
// off their camera roll, not another wide brochure shot. Without that contrast
// the sweep looks like a colour filter rather than a change of place.
const PLAIN_STYLE = {
  filter: "saturate(0.28) brightness(1.06) blur(0.6px)",
  transform: "scale(1.5)",
  transformOrigin: "50% 55%",
};

// Slot 0 of the hero when there is no photo yet. Replaces the strip that used
// to sit under the hero, so the invitation costs no extra height.
export default function InvitationSlide() {
  const { onNudgeTapped, onNudgeDismissed, loggedIn } = useAIPhotos();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const fired = useRef(false);

  const next = () => setI((n) => (n + 1) % TEASER_DESTINATIONS.length);

  // With motion on, the word advances on the wipe's own iteration boundary, so
  // the two never drift apart. With motion off there is no animation to hook.
  useEffect(() => {
    if (!reduced) return;
    const t = setInterval(next, CYCLE_MS);
    return () => clearInterval(t);
  }, [reduced]);

  // Later destinations swap in mid-animation, so they must already be decoded.
  useEffect(() => {
    TEASER_DESTINATIONS.forEach((d) => { if (d.photo) new Image().src = d.photo; });
  }, []);

  useEffect(() => {
    if (fired.current) return;
    const t = setTimeout(() => {
      fired.current = true;
      track("ai_photos_nudge_viewed", { login_state: loggedIn ? "logged_in" : "logged_out", entry_source: "home_hero" });
    }, 1000);
    return () => clearTimeout(t);
  }, [loggedIn]);

  const dest = TEASER_DESTINATIONS[i];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: C.div }}>
      <img src={TEASER_PLAIN_PHOTO} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...PLAIN_STYLE }} />

      {/* The generated side. src swaps while it is clipped out of view. */}
      <img
        className={reduced ? undefined : "hero-wipe"}
        src={dest.photo}
        alt={`You both in ${dest.name}`}
        onAnimationIteration={reduced ? undefined : next}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          ...(reduced ? { clipPath: "inset(0 0 0 46%)" } : null),
        }}
      />
      <div
        className={reduced ? undefined : "hero-wipe-line"}
        style={{
          position: "absolute", top: 0, bottom: 0, width: 2, marginLeft: -1,
          background: "rgba(255,255,255,0.95)", boxShadow: "0 0 16px rgba(255,255,255,0.55)",
          ...(reduced ? { left: "46%" } : null),
        }}
      />

      <div style={{ position: "absolute", inset: 0, background: HERO_SCRIM }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 100%)", pointerEvents: "none" }} />

      {/* Instant dismiss, no confirmation. */}
      <button
        onClick={(e) => { e.stopPropagation(); onNudgeDismissed(); }}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%",
          background: "rgba(0,0,0,0.34)", border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2,
        }}
      >
        <XIcon size={16} color="#fff" />
      </button>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px 38px` }}>
        <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.5px", lineHeight: "27px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
          {COPY.invitationLead}{" "}
          {/* Keyed so the entry animation replays on every destination. */}
          <span key={dest.name} style={{ display: "inline-block", animation: reduced ? "none" : "heroWordIn 0.45s cubic-bezier(0.2,0,0.2,1) both" }}>
            {dest.name}
          </span>
        </h1>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onNudgeTapped(); }}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
              minHeight: 48, background: C.p600, color: "#fff", border: "none", borderRadius: 12,
              padding: "11px 22px", fontSize: 14, fontWeight: 700, fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 6px 20px rgba(227,27,83,0.35)",
            }}
          >
            <Sparkles size={16} color="#fff" /> {COPY.invitationCta}
          </button>
        </div>

        <p style={{ fontSize: 10.5, fontStyle: "italic", color: "rgba(255,255,255,0.72)", textAlign: "center", margin: "9px 0 0" }}>
          {COPY.invitationNote}
        </p>
      </div>
    </div>
  );
}
