import { C } from "../../data";

export const HERO_HEIGHT = "50vh";
export const HERO_MIN_HEIGHT = 400;

// One fixed scrim for every slot. Generated image brightness varies a lot, so
// the gradient is identical on marketing and personalized slides to keep text
// legible without any slide reading as darker than its neighbours.
export const HERO_SCRIM =
  "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.15) 52%, rgba(0,0,0,0.82) 100%)";

// Shared frame for every hero slide: image, fixed scrim, and the white fade
// that merges the hero into the content below it.
export default function SlideShell({ image, alt = "", onClick, children, imageStyle }) {
  return (
    <div
      onClick={onClick}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", cursor: onClick ? "pointer" : "default", background: C.div }}
    >
      {image && (
        <img
          src={image}
          alt={alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...imageStyle }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: HERO_SCRIM }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 100%)", pointerEvents: "none" }} />
      {children}
    </div>
  );
}
