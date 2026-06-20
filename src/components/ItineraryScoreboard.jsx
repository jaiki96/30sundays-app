import { useMemo, useState } from "react";
import { Check, X as XIcon, Info } from "lucide-react";
import { C } from "../data";
import { SCORE_PALETTE } from "../data/dayScoring";
import { computeScoreboard } from "../data/scoreboard";

// Green / yellow / orange scale (no harsh red on this positive surface).
const SCALE = {
  good: { bg: "#DEF3E4", text: "#2E7D52", border: "#8FD0AB" }, // green
  ok:   { bg: "#FCEFCF", text: "#9A6B00", border: "#EBC665" }, // yellow
  weak: { bg: "#FCE2CF", text: "#C2410C", border: "#F0A968" }, // orange
};

// One metric on a single line: name + an info "i" + its value as a colored chip.
function Read({ r, onInfo }) {
  const c = SCALE[r.tone];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "2px 0" }}>
      <button onClick={onInfo} aria-label={`About ${r.label}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.head }}>{r.label}</span>
        <Info size={13} color={C.inact} />
      </button>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: c.text, background: c.bg, border: `1px solid ${c.border}`, padding: "3px 11px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
        {r.options[r.activeIndex]}
      </span>
    </div>
  );
}

// Bottom-sheet modal: what the metric means + all three levels, your level marked.
function ScoreInfoModal({ r, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: C.white, borderRadius: 20, padding: 18, boxShadow: "0 12px 40px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>{r.label}</p>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}><XIcon size={20} color={C.sub} /></button>
        </div>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 14px", lineHeight: "18px" }}>{r.explain}</p>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: C.inact, textTransform: "uppercase", letterSpacing: ".4px" }}>What the levels mean</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {r.options.map((opt, i) => {
            const on = i === r.activeIndex;
            const c = on ? SCALE[r.tone] : null;
            return (
              <div key={opt} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", borderRadius: 12, border: `1px solid ${on ? c.border : C.div}`, background: on ? c.bg : C.white }}>
                <span style={{ flexShrink: 0, width: 78, fontSize: 12.5, fontWeight: 700, color: on ? c.text : C.head }}>{opt}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: C.sub, lineHeight: "17px" }}>{r.defs?.[i]}</span>
                {on && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 800, color: c.text }}>YOUR TRIP</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score }) {
  const R = 27, CIRC = 2 * Math.PI * R, off = CIRC * (1 - score / 10);
  const ring = score >= 7 ? SCALE.good : score >= 5 ? SCALE.ok : SCALE.weak;
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={R} fill="none" stroke={C.bg} strokeWidth="7" />
        <circle cx="34" cy="34" r={R} fill="none" stroke={ring.text} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={off} transform="rotate(-90 34 34)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: C.head, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8.5, color: C.inact, fontWeight: 700, letterSpacing: ".3px", marginTop: 1 }}>/ 10</span>
      </div>
    </div>
  );
}

const AreaTag = ({ area }) => (
  <span style={{ fontSize: 9.5, fontWeight: 700, color: C.sub, background: C.bg, padding: "1px 6px", borderRadius: 5, flexShrink: 0 }}>{area}</span>
);

function InsightRow({ item, kind, showTag }) {
  const good = kind === "hit";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0" }}>
      <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", marginTop: 1, display: "grid", placeItems: "center", background: good ? SCALE.good.bg : SCALE.weak.bg }}>
        {good ? <Check size={11} color={SCALE.good.text} strokeWidth={3} /> : <XIcon size={11} color={SCALE.weak.text} strokeWidth={3} />}
      </span>
      <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: C.head, lineHeight: "17px" }}>{item.text}</span>
      {showTag && <AreaTag area={item.area} />}
    </div>
  );
}

export default function ItineraryScoreboard({ it, days, selOut, selRet, hotelStays }) {
  const [showAll, setShowAll] = useState(false);
  const [infoRead, setInfoRead] = useState(null);
  const data = useMemo(
    () => computeScoreboard({ it, days, selOut, selRet, hotelStays }),
    [it, days, selOut, selRet, hotelStays]
  );
  const { score, verdictWord, title, blurb, reads, highlights, headsUp } = data;

  const CAP = 3;
  const hi = showAll ? highlights : highlights.slice(0, CAP);
  const he = showAll ? headsUp : headsUp.slice(0, CAP);
  const more = (highlights.length - hi.length) + (headsUp.length - he.length);
  const mixedAreas = new Set([...highlights, ...headsUp].map((i) => i.area)).size > 1;
  const wordColor = score >= 7 ? SCALE.good.text : score >= 5 ? SCALE.ok.text : SCALE.weak.text;

  return (
    <div style={{ padding: "0 16px" }}>
      <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Itinerary scoreboard</p>
      <div style={{ border: `1px solid ${C.div}`, borderRadius: 16, background: C.white, boxShadow: "0 4px 4px -2px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* Score + verdict */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 14px 12px" }}>
          <ScoreRing score={score} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: wordColor, textTransform: "uppercase", letterSpacing: ".4px" }}>{verdictWord}</span>
            <p style={{ margin: "2px 0 3px", fontSize: 14.5, fontWeight: 700, color: C.head, lineHeight: "19px" }}>{title}</p>
            <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: "16px" }}>{blurb}</p>
          </div>
        </div>

        {/* Six quick reads — one colored chip each, 2-up */}
        <div style={{ borderTop: `1px solid ${C.div}`, padding: "6px 14px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 18, alignItems: "center" }}>
          {reads.map((r) => (
            <div key={r.label} style={{ borderBottom: `1px solid ${C.bg}`, padding: "8px 0" }}>
              <Read r={r} onInfo={() => setInfoRead(r)} />
            </div>
          ))}
        </div>

        {/* Highlights & heads-up */}
        {(highlights.length > 0 || headsUp.length > 0) && (
          <div style={{ borderTop: `1px solid ${C.div}`, padding: "10px 14px 14px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: C.inact, textTransform: "uppercase", letterSpacing: ".4px" }}>Highlights &amp; heads-up</p>
            {hi.map((item, i) => <InsightRow key={`h${i}`} item={item} kind="hit" showTag={mixedAreas} />)}
            {he.map((item, i) => <InsightRow key={`m${i}`} item={item} kind="miss" showTag={mixedAreas} />)}
            {(more > 0 || showAll) && (
              <button onClick={() => setShowAll((v) => !v)} style={{ marginTop: 6, padding: 0, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: C.p600 }}>
                {showAll ? "Show less" : `See ${more} more`}
              </button>
            )}
          </div>
        )}
      </div>

      {infoRead && <ScoreInfoModal r={infoRead} onClose={() => setInfoRead(null)} />}
    </div>
  );
}
