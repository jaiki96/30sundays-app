import { Heart } from "lucide-react";
import { C } from "../data";

// ─── One wishlist control, everywhere ───
//
// The app had four hearts doing the same job. A pink disc with a white heart
// inside it on the discover cards. A bare pink outline on the plan cards. A
// white outline on a black disc over the video thumbnails. A heart that was
// always filled on the saved screen. Four readings of one promise, so the
// state of a save was something a couple had to learn again on every screen.
//
// One rule now. The heart is the brand pink wherever it appears. Outline means
// not saved, solid means saved, and that is the only difference between the two
// states. Over a photograph it sits in a white disc, because a pink outline on
// a picture nobody has seen yet is a coin toss; on white it needs nothing
// behind it.

export default function SaveHeart({ saved, onToggle, onPhoto = false, size = 32 }) {
  const icon = Math.round(size * 0.53);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle?.(); }}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={!!saved}
      style={{
        width: size, height: size, flexShrink: 0, padding: 0, cursor: "pointer",
        borderRadius: "50%", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: onPhoto ? "rgba(255,255,255,0.96)" : "transparent",
        boxShadow: onPhoto ? "0 2px 8px rgba(16,24,40,0.22)" : "none",
        ...(onPhoto ? { backdropFilter: "blur(8px)" } : null),
      }}
    >
      <Heart size={icon} color={C.p600} fill={saved ? C.p600 : "none"} strokeWidth={2.2} />
    </button>
  );
}
