import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../../data";
import { HERO_HEIGHT, HERO_MIN_HEIGHT } from "./SlideShell";
import MarketingSlide from "./MarketingSlide";
import { useReducedMotion } from "../../state/useAIPhotos";
import { track } from "../../data/aiPhotosData";

const ADVANCE_MS = 10000;
const RESUME_AFTER_MS = 15000;
const SWIPE_THRESHOLD = 40;

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

  useEffect(() => { setIndex((i) => (i >= count ? 0 : i)); }, [count]);

  return { index, setIndex, markInteraction };
}

// Marketing banners only. The AI photos invitation is its own section further
// down the home screen, not a hero slide.
export default function HeroCarousel({ marketingSlides, onOpenVideo }) {
  const reduced = useReducedMotion();
  const count = marketingSlides.length;
  const { index, setIndex, markInteraction } = useAutoAdvance(count, !reduced);

  const dragX = useRef(null);
  const swipedAt = useRef(0);
  const advanceType = useRef("auto");
  const viewed = useRef(new Set());

  useEffect(() => { viewed.current.add(index); }, [index]);

  const total = useRef(count);
  total.current = count;
  useEffect(() => () => {
    track("home_carousel_scroll_depth", { slides_viewed: viewed.current.size, total_slides: total.current });
  }, []);

  const goTo = (next, direction) => {
    const to = (next + count) % count;
    advanceType.current = "swipe";
    track("home_carousel_swiped", { direction, from_position: index, to_position: to });
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
  // A swipe must not also open the link under the finger.
  const onClickCapture = (e) => {
    if (Date.now() - swipedAt.current < 350) { e.preventDefault(); e.stopPropagation(); }
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
        {marketingSlides.map((s, i) => (
          <div key={i} style={{ width: `${100 / count}%`, height: "100%", flexShrink: 0 }}>
            <MarketingSlide slide={s} onOpenVideo={onOpenVideo} />
          </div>
        ))}
      </div>

      {/* A single item renders as a static hero, so no indicators. */}
      {count > 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 5, pointerEvents: "none" }}>
          {marketingSlides.map((_, i) => (
            <span key={i} style={{
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
