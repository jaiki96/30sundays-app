import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2 } from "lucide-react";
import { C } from "../../data";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY, SECTION_OWN_PHOTO, SECTION_SHOTS, track } from "../../data/aiPhotosData";

const PAD = 18;

// The entry point to the AI photos module. Sits directly under the three USPs.
// One constant photo with four destinations sweeping over it in turn, so the
// idea lands without being read.
export default function AIPhotosHomeSection() {
  const navigate = useNavigate();
  const { status } = useAIPhotos();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  const shot = SECTION_SHOTS[i];
  const next = () => setI((n) => (n + 1) % SECTION_SHOTS.length);

  const go = () => {
    track("ai_photos_entry_tapped", { entry_source: "home_section", state: status });
    navigate("/ai-photos");
  };

  return (
    <div style={{ padding: `0 ${PAD}px`, marginBottom: 28 }}>
      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        background: `linear-gradient(160deg, #FFD9E1 0%, ${C.p100} 42%, #FFF6F8 100%)`,
        border: `1px solid ${C.p300}55`,
        boxShadow: "0 12px 32px rgba(227,27,83,0.13)",
      }}>
        <div style={{ position: "absolute", top: -46, right: -46, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,27,83,0.2) 0%, rgba(227,27,83,0) 70%)" }} />

        <div style={{ position: "relative", padding: "18px 18px 0", textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 9.5, fontWeight: 800, letterSpacing: "1.1px", color: C.p600,
            background: C.white, borderRadius: 999, padding: "4px 10px",
            boxShadow: "0 1px 6px rgba(137,18,62,0.14)",
          }}>
            <Sparkles size={10} color={C.p600} /> {COPY.sectionKicker}
          </span>

          <h2 style={{ fontSize: 25, fontWeight: 900, color: C.head, margin: "11px 0 0", letterSpacing: "-0.9px", lineHeight: "29px" }}>
            {COPY.sectionTitleLead} <span style={{ color: C.p600 }}>{COPY.sectionTitleAccent}</span>
          </h2>
          <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "8px auto 0", maxWidth: 268 }}>
            {COPY.sectionSub}
          </p>
        </div>

        {/* One photo, four places sweeping over it. */}
        <div style={{ position: "relative", margin: "14px 16px 0", height: 250, borderRadius: 16, overflow: "hidden", background: C.div, boxShadow: "0 8px 24px rgba(140,10,50,0.18)" }}>
          <img src={SECTION_OWN_PHOTO} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

          {/* Clipped together, so the place name arrives with its picture. */}
          <div
            className={reduced ? undefined : "ai-sec-wipe"}
            onAnimationIteration={reduced ? undefined : next}
            style={{ position: "absolute", inset: 0, ...(reduced ? { clipPath: "inset(0 0 0 50%)" } : null) }}
          >
            <img src={shot.src} alt={`You both in ${shot.place}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.62) 100%)" }} />
            <span style={{ position: "absolute", left: 12, bottom: 10, fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.2px", textShadow: "0 1px 8px rgba(0,0,0,0.55)" }}>
              {shot.place}
            </span>
          </div>

          <div
            className={reduced ? undefined : "ai-sec-line"}
            style={{
              position: "absolute", top: 0, bottom: 0, width: 2, marginLeft: -1,
              background: "rgba(255,255,255,0.95)", boxShadow: "0 0 16px rgba(255,255,255,0.7)",
              ...(reduced ? { left: "50%", opacity: 1 } : null),
            }}
          />
        </div>

        <div style={{ position: "relative", padding: "14px 16px 18px" }}>
          <button
            onClick={go}
            style={{
              display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8,
              minHeight: 50, borderRadius: 999, border: "none", background: C.p600, color: "#fff",
              fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 8px 22px rgba(227,27,83,0.32)",
            }}
          >
            <Wand2 size={16} color="#fff" /> {status === "generated" ? COPY.sectionCtaReturning : COPY.sectionCta}
          </button>
          <p style={{ fontSize: 10.5, fontStyle: "italic", color: C.inact, textAlign: "center", margin: "10px 0 0" }}>
            {COPY.aiNote}
          </p>
        </div>
      </div>
    </div>
  );
}
