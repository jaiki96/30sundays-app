import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, Check, ArrowRight } from "lucide-react";
import { C } from "../../data";
import { useAIPhotos, useReducedMotion } from "../../state/useAIPhotos";
import { COPY, SECTION_OWN_PHOTO, SECTION_SHOTS, getDestination, track } from "../../data/aiPhotosData";

const PAD = 18;

// The panel every state sits in, so the section stays recognisable as the
// couple moves from "not started" to "ready".
function Panel({ children }) {
  return (
    <div style={{ padding: `0 ${PAD}px`, marginBottom: 28 }}>
      <div style={{
        position: "relative", borderRadius: 24, overflow: "hidden",
        background: `linear-gradient(160deg, #FFD9E1 0%, ${C.p100} 42%, #FFF6F8 100%)`,
        border: `1px solid ${C.p300}55`,
        boxShadow: "0 12px 32px rgba(227,27,83,0.13)",
      }}>
        <div style={{ position: "absolute", top: -46, right: -46, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,27,83,0.2) 0%, rgba(227,27,83,0) 70%)" }} />
        {children}
      </div>
    </div>
  );
}

function Chip({ children, tone = "brand" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 9.5, fontWeight: 800, letterSpacing: "1.1px",
      color: tone === "ready" ? C.sText : C.p600,
      background: C.white, borderRadius: 999, padding: "4px 10px",
      boxShadow: "0 1px 6px rgba(137,18,62,0.14)",
    }}>
      {children}
    </span>
  );
}

function Heading({ chip, title, sub }) {
  return (
    <div style={{ position: "relative", padding: "18px 18px 0", textAlign: "center" }}>
      {chip}
      {/* Balanced, so a two line title never drops a single orphan word. */}
      <h2 style={{ fontSize: 25, fontWeight: 900, color: C.head, margin: "11px 0 0", letterSpacing: "-0.9px", lineHeight: "29px", textWrap: "balance" }}>
        {title}
      </h2>
      <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "8px auto 0", maxWidth: 268 }}>
        {sub}
      </p>
    </div>
  );
}

function Cta({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: 50, borderRadius: 999, border: "none", background: C.p600, color: "#fff",
        fontSize: 15, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
        boxShadow: "0 8px 22px rgba(227,27,83,0.32)",
      }}
    >
      {children}
    </button>
  );
}

// One slot per picture. Filled slots carry the real image, the rest keep a
// sheen moving so the row reads as working rather than broken.
function Tray({ batch, ready, count, reduced }) {
  return (
    <div style={{ display: "flex", gap: 7, margin: "14px 16px 0" }}>
      {Array.from({ length: count }).map((_, i) => {
        const img = i < ready ? batch[i] : null;
        return (
          <div key={i} style={{
            flex: 1, position: "relative", aspectRatio: "9 / 16", borderRadius: 10,
            overflow: "hidden", background: "rgba(255,255,255,0.6)",
            border: `1px solid ${img ? "transparent" : `${C.p300}66`}`,
            boxShadow: img ? "0 4px 12px rgba(140,10,50,0.16)" : "none",
          }}>
            {img ? (
              <img
                src={img.src}
                alt={`You both at ${img.location}`}
                className={reduced ? undefined : "ai-tile-in"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className={reduced ? undefined : "ai-tile-wait"} style={{ position: "absolute", inset: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── The three states ── */

// Nothing started yet. The couple's own photo stays put while four
// destinations sweep over it, so "one photo in, many places out" is shown
// rather than explained.
function NotStarted({ onGo, reduced }) {
  const [i, setI] = useState(0);
  const shot = SECTION_SHOTS[i];
  const next = () => setI((n) => (n + 1) % SECTION_SHOTS.length);

  return (
    <>
      <Heading
        chip={<Chip><Sparkles size={10} color={C.p600} /> {COPY.sectionKicker}</Chip>}
        title={<>{COPY.sectionTitleLead} <span style={{ color: C.p600 }}>{COPY.sectionTitleAccent}</span></>}
        sub={COPY.sectionSub}
      />

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
        <Cta onClick={onGo}><Wand2 size={16} color="#fff" /> {COPY.sectionCta}</Cta>
        <p style={{ fontSize: 10.5, fontStyle: "italic", color: C.inact, textAlign: "center", margin: "10px 0 0" }}>
          {COPY.aiNote}
        </p>
      </div>
    </>
  );
}

// Working on it. The couple can leave the module, so this has to say where
// things stand and promise the pictures will turn up here.
function Working({ onGo, reduced, batch, ready, count }) {
  return (
    <>
      <Heading
        chip={<Chip><Sparkles size={10} color={C.p600} style={{ animation: reduced ? "none" : "pulse 1.4s ease-in-out infinite" }} /> {COPY.sectionBusyKicker}</Chip>}
        title={COPY.sectionBusyTitle}
        sub={COPY.sectionBusySub}
      />

      <Tray batch={batch} ready={ready} count={count} reduced={reduced} />

      <div style={{ position: "relative", padding: "14px 16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.head }}>{COPY.sectionProgress(ready, count)}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.7)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{
            height: "100%", width: `${(ready / count) * 100}%`, background: C.p600,
            transition: reduced ? "none" : "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>
        <Cta onClick={onGo}>{COPY.sectionBusyCta} <ArrowRight size={16} color="#fff" /></Cta>
      </div>
    </>
  );
}

// Done. The pictures themselves are the hook, so they lead and the button just
// opens them.
function Ready({ onGo, reduced, batch, count, destName }) {
  return (
    <>
      <Heading
        chip={<Chip tone="ready"><Check size={10} color={C.sText} strokeWidth={3} /> {COPY.sectionReadyKicker}</Chip>}
        title={COPY.sectionReadyTitle}
        sub={COPY.sectionReadySub(destName)}
      />

      <Tray batch={batch} ready={count} count={count} reduced={reduced} />

      <div style={{ position: "relative", padding: "14px 16px 18px" }}>
        <Cta onClick={onGo}><Wand2 size={16} color="#fff" /> {COPY.sectionReadyCta}</Cta>
      </div>
    </>
  );
}

// The entry point to the AI photos module. Sits directly under the three USPs
// and mirrors whatever the module is doing.
export default function AIPhotosHomeSection() {
  const navigate = useNavigate();
  const { status, ready, batch, imageCount, destination } = useAIPhotos();
  const reduced = useReducedMotion();

  const go = () => {
    track("ai_photos_entry_tapped", { entry_source: "home_section", state: status });
    navigate("/ai-photos");
  };

  const destName = getDestination(destination)?.name || "somewhere new";

  return (
    <Panel>
      {status === "generating" && (
        <Working onGo={go} reduced={reduced} batch={batch} ready={ready} count={imageCount} />
      )}
      {status === "generated" && (
        <Ready onGo={go} reduced={reduced} batch={batch} count={imageCount} destName={destName} />
      )}
      {status !== "generating" && status !== "generated" && (
        <NotStarted onGo={go} reduced={reduced} />
      )}
    </Panel>
  );
}
