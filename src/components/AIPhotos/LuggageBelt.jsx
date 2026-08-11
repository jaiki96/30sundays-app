import { C } from "../../data";
import { useReducedMotion } from "../../state/useAIPhotos";

// The picture for "your pictures missed the belt". A baggage carousel still
// turning with one bag on it, so the screen says "coming round again" before
// the words do. Stripes are spaced 24 apart and travel exactly 24, so the loop
// has no seam.
export default function LuggageBelt() {
  const reduced = useReducedMotion();

  return (
    <svg width="200" height="132" viewBox="0 0 200 132" fill="none" role="img" aria-label="A bag going round on a baggage belt">
      <defs>
        <clipPath id="beltClip">
          <rect x="14" y="96" width="172" height="18" rx="9" />
        </clipPath>
      </defs>

      {/* Soft blush behind, so the illustration sits on something */}
      <ellipse cx="100" cy="72" rx="76" ry="60" fill={C.p100} />

      {/* Belt */}
      <rect x="14" y="96" width="172" height="18" rx="9" fill="#D5D7DA" />
      <g clipPath="url(#beltClip)">
        <g className={reduced ? undefined : "bag-belt"}>
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={-16 + i * 24} y="96" width="8" height="18" fill="#BFC2C7" transform="skewX(-18)" />
          ))}
        </g>
      </g>
      <rect x="14" y="112" width="172" height="5" rx="2.5" fill="#A4A7AE" opacity="0.5" />

      {/* The bag, riding round */}
      <g className={reduced ? undefined : "bag-bob"}>
        {/* Handle */}
        <path d="M88 46v-8a12 12 0 0 1 24 0v8" stroke={C.head} strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="68" y="46" width="64" height="52" rx="10" fill={C.p600} />
        <rect x="68" y="64" width="64" height="9" fill="#fff" opacity="0.28" />
        {/* Tag, because a bag on a belt has one */}
        <rect x="118" y="52" width="14" height="10" rx="3" fill="#fff" opacity="0.85" />
        {/* Feet */}
        <rect x="76" y="96" width="10" height="5" rx="2" fill="#A8123E" />
        <rect x="114" y="96" width="10" height="5" rx="2" fill="#A8123E" />
      </g>
    </svg>
  );
}
