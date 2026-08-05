import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../../data";
import { HERO_HEIGHT, HERO_MIN_HEIGHT } from "./SlideShell";
import MarketingSlide from "./MarketingSlide";
import PersonalizedSlide from "./PersonalizedSlide";
import GeneratingSlide from "./GeneratingSlide";
import InvitationSlide from "./InvitationSlide";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { track } from "../../data/aiPhotosData";

const ADVANCE_MS = 10000;
const RESUME_AFTER_MS = 15000;
const SWIPE_THRESHOLD = 40;
// Long enough for the reveal to finish before rotation takes over again.
const REVEAL_HOLD_MS = 2400;

// Auto-advance lives here, deliberately. Lifting this timer to the home page
// would re-render the whole screen every 10 seconds and reset the scroll
// position, so it stays local to the carousel and nothing above it re-renders.
function useAutoAdvance(count, enabled) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef(null);

  const markInteraction = useCallback(() => {
    setPaused(true);
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, []);

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  useEffect(() => {
    if (!enabled || paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), ADVANCE_MS);
    return () => clearInterval(t);
  }, [enabled, paused, count]);

  // Slide count changes when the photo is generated, hidden or removed.
  useEffect(() => { setIndex((i) => (i >= count ? 0 : i)); }, [count]);

  return { index, setIndex, markInteraction };
}

export default function HeroCarousel({ marketingSlides, onOpenVideo }) {
  const { showPersonalized, showNudge, status } = useAIPhotos();
  const reduced = useReducedMotion();

  // Slot 0 is the couple's own image once they have one, and the invitation to
  // make one until then. Only one of the two can ever apply.
  const slides = [
    ...(showPersonalized ? [{ type: "personalized", key: "ai" }] : []),
    ...(showNudge ? [{ type: "invitation", key: "invite" }] : []),
    ...marketingSlides.map((s, i) => ({ type: "marketing", key: `m${i}`, slide: s })),
  ];
  const count = slides.length;

  // A newly generated image pins to the first slot and plays its reveal before
  // normal rotation begins. Tracked off the status transition, not off `seen`,
  // because the reveal marks itself seen on its very first frame.
  const [pinned, setPinned] = useState(false);
  const prevStatus = useRef(status);
  const pinTimer = useRef(null);
  useEffect(() => {
    const was = prevStatus.current;
    prevStatus.current = status;
    if (status !== "generated" || was === "generated") return;
    setPinned(true);
    clearTimeout(pinTimer.current);
    pinTimer.current = setTimeout(() => setPinned(false), REVEAL_HOLD_MS);
  }, [status]);
  useEffect(() => () => clearTimeout(pinTimer.current), []);

  const { index, setIndex, markInteraction } = useAutoAdvance(count, !reduced && !pinned);

  useEffect(() => { if (pinned) setIndex(0); }, [pinned, setIndex]);

  const dragX = useRef(null);
  const swipedAt = useRef(0);
  const advanceType = useRef("auto");
  const viewed = useRef(new Set());
  const sawPersonalized = useRef(false);

  // Slide-level view tracking. A slide counts as viewed once it has been the
  // active slot for a full second.
  useEffect(() => {
    viewed.current.add(index);
    const current = slides[index];
    if (current?.type !== "personalized") return;
    const t = setTimeout(() => {
      sawPersonalized.current = true;
      track("ai_photos_hero_slide_viewed", { slide_position: index, advance_type: advanceType.current });
      advanceType.current = "auto";
    }, 1000);
    return () => clearTimeout(t);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = useRef(count);
  total.current = count;
  useEffect(() => () => {
    track("ai_photos_carousel_scroll_depth", {
      slides_viewed: viewed.current.size,
      total_slides: total.current,
      personalized_slide_seen: sawPersonalized.current,
    });
  }, []);

  const goTo = (next, direction) => {
    const to = (next + count) % count;
    advanceType.current = "swipe";
    track("ai_photos_carousel_swiped", { direction, from_position: index, to_position: to });
    setIndex(to);
    markInteraction();
  };

  // Pointer events, so a finger swipe and a mouse drag both move the hero.
  const onPointerDown = (e) => { dragX.current = e.clientX; markInteraction(); };
  const onPointerUp = (e) => {
    if (dragX.current == null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    swipedAt.current = Date.now();
    goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? "next" : "previous");
  };
  // A swipe must not also open the link or the full screen view under the finger.
  const onClickCapture = (e) => {
    if (Date.now() - swipedAt.current < 350) { e.preventDefault(); e.stopPropagation(); }
  };

  const renderSlide = (s) => {
    if (s.type === "personalized") {
      if (status === "generating") return <GeneratingSlide />;
      if (status === "failed") return <GeneratingSlide failed />;
      return <PersonalizedSlide />;
    }
    if (s.type === "invitation") return <InvitationSlide />;
    return <MarketingSlide slide={s.slide} onOpenVideo={onOpenVideo} />;
  };

  return (
    <div
      style={{ position: "relative", height: HERO_HEIGHT, minHeight: HERO_MIN_HEIGHT, overflow: "hidden", touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragX.current = null; }}
      onClickCapture={onClickCapture}
    >
      <div style={{
        display: "flex", height: "100%", width: `${count * 100}%`,
        transform: `translateX(-${index * (100 / count)}%)`,
        transition: reduced ? "none" : "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {slides.map((s) => (
          <div key={s.key} style={{ width: `${100 / count}%`, height: "100%", flexShrink: 0 }}>
            {renderSlide(s)}
          </div>
        ))}
      </div>

      {/* A single item renders as a static hero, so no indicators. */}
      {count > 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 5, pointerEvents: "none" }}>
          {slides.map((s, i) => (
            <span key={s.key} style={{
              width: i === index ? 18 : 6, height: 6, borderRadius: 3,
              background: i === index ? "#fff" : "rgba(255,255,255,0.45)",
              transition: reduced ? "none" : "width 0.3s ease, background 0.3s ease",
              boxShadow: i === index ? `0 1px 4px ${C.head}55` : "none",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
