import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
import { C } from "../../data";
import SlideShell from "./SlideShell";

const PAD = 18;

// Static banner slide. This is the home's existing hero content, unchanged,
// now living as one slot in the carousel.
export default function MarketingSlide({ slide, onOpenVideo }) {
  return (
    <SlideShell image={slide.img} onClick={slide.video ? onOpenVideo : undefined}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px 44px` }}>
        {slide.showRating && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Star size={13} fill="#FBBC05" color="#FBBC05" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.92)", letterSpacing: "0.2px" }}>
              <b style={{ color: "#fff" }}>4.6</b> · 10,000+ couples have trusted us
            </span>
          </div>
        )}
        {slide.kicker && (
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", marginBottom: 6 }}>
            {slide.kicker}
          </div>
        )}
        <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.5px", lineHeight: "26px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
          {slide.headline}
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link
            to={slide.to}
            onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 48, background: C.p600, color: "#fff", borderRadius: 12, padding: "11px 22px", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(227,27,83,0.35)" }}
          >
            <Sparkles size={16} color="#fff" /> {slide.cta}
          </Link>
        </div>
      </div>
    </SlideShell>
  );
}
