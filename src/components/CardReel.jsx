import { useState } from "react";
import { A } from "./hotel_refined/tokens";

// ─── The pictures on a card ───
//
// Its own reel, swiped inside the card, because one photograph of a waterfall
// is a waterfall and three of them are a morning. Snapping is CSS and the dots
// read the scroll rather than drive it, so a flick and a drag land on the same
// frame.
//
// Scrolling is not tapping, so the reel can live inside a card that opens
// something: a swipe moves the picture, and a tap does whatever `onTap` says,
// with the picture you were looking at.
//
// One reel for the region pages, Change hotel and Change day plan. They used to
// be three: a snapping full-width reel with dots on one, and on the other two a
// loose strip of 86% wide crops with no dots and no snap, so a swipe left you
// between two pictures with no way to tell how many there were.

export default function CardReel({ imgs, alt = "", height, onTap, children }) {
  const [i, setI] = useState(0);
  const onScroll = (e) => {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== i) setI(next);
  };

  return (
    <div style={{ position: "relative", height, flexShrink: 0, background: A.photoBg }}>
      <div
        className="hide-scrollbar"
        onScroll={onScroll}
        style={{
          display: "flex", height: "100%", overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
        }}
      >
        {imgs.map((src, n) => (
          <div
            key={n}
            onClick={onTap ? (e) => { e.stopPropagation(); onTap(n); } : undefined}
            style={{
              flex: "0 0 100%", width: "100%", height: "100%", scrollSnapAlign: "start",
              cursor: onTap ? "pointer" : undefined,
            }}
          >
            <img src={src} alt={n === 0 ? alt : ""} loading={n === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      {children}

      {imgs.length > 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 8,
          display: "flex", justifyContent: "center", gap: 4, pointerEvents: "none",
        }}>
          {imgs.map((_, n) => (
            <span key={n} style={{
              width: n === i ? 6 : 4.5, height: n === i ? 6 : 4.5, borderRadius: "50%",
              background: n === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
