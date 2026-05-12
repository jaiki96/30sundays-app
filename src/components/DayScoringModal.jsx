import { useState } from "react";
import { X as XIcon, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { C } from "../data";
import {
  TONE, paceTone, actTone, travelTone, crowdTone,
  PACE_LABEL, ACT_LABEL, TRAVEL_LABEL, CROWD_LABEL, fmtHrs,
} from "./DayScoringRow";
import { PACE_COPY, ACT_TIME_COPY, TRAVEL_COPY, CROWD_COPY, QUEUE_COPY } from "../data/dayScoring";

// ─── Sub-components ───────────────────────────────────────────────────────

function ScalePills({ levels, activeIdx, tone }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
      {levels.map((lv, i) => {
        const active = i === activeIdx;
        return (
          <div key={i} style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 11, fontWeight: 600,
            background: active ? tone.bg : "#fff",
            color: active ? tone.fg : C.sub,
            border: `1px solid ${active ? tone.fg : C.div}`,
          }}>
            {lv}
          </div>
        );
      })}
    </div>
  );
}

function ScoreChip({ tone, label }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 999,
      background: tone.bg, color: tone.fg,
      fontSize: 12, fontWeight: 700,
    }}>
      {label}
    </span>
  );
}

function TipBlock({ children }) {
  return (
    <div style={{
      display: "flex", gap: 8,
      padding: 12,
      background: C.p100, color: C.head,
      borderRadius: 10,
      marginTop: 14,
    }}>
      <Sparkles size={14} color={C.p600} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.p600, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 0.5 }}>30 Sundays tip</p>
        <p style={{ fontSize: 12, color: C.head, margin: 0, lineHeight: "17px" }}>{children}</p>
      </div>
    </div>
  );
}

function Footer({ children }) {
  return (
    <p style={{ fontSize: 10, color: C.inact, margin: "12px 0 0", lineHeight: "14px", fontStyle: "italic" }}>
      {children}
    </p>
  );
}

// ─── Per-metric content panels ────────────────────────────────────────────

function PacePanel({ score }) {
  const tone = paceTone(score.pace);
  const copy = PACE_COPY[score.pace];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Pace</p>
        <ScoreChip tone={tone} label={copy.label} />
      </div>
      <ScalePills levels={["Relaxed", "Neutral", "Hectic"]} activeIdx={["relaxed","neutral","hectic"].indexOf(score.pace)} tone={tone} />

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "18px 0 4px" }}>What it means</p>
      <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>{copy.means}</p>

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "14px 0 4px" }}>Is it for you?</p>
      <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>{copy.audience}</p>

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "14px 0 4px" }}>How it's calculated</p>
      <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>
        Active hours, number of activities, and travel time. The day takes the highest of the three.
      </p>

      <TipBlock>{copy.tip}</TipBlock>
    </div>
  );
}

function TravelPanel({ score }) {
  const tone = travelTone(score.travelBand);
  const copy = TRAVEL_COPY[score.travelBand];
  const [expanded, setExpanded] = useState(null); // index of multi-leg expanded
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Travel time</p>
          <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>{fmtHrs(score.travelHrs)} total</p>
        </div>
        <ScoreChip tone={tone} label={copy.label} />
      </div>
      <ScalePills levels={["Short", "Moderate", "Long"]} activeIdx={["short","moderate","long"].indexOf(score.travelBand)} tone={tone} />

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "18px 0 6px" }}>Today's transfers</p>
      <div style={{ borderTop: `1px solid ${C.div}` }}>
        {score.legs.map((leg, i) => {
          const isMulti = !!leg.multi?.length;
          const isOpen = expanded === i;
          return (
            <div key={i} style={{ borderBottom: `1px solid ${C.div}` }}>
              <button
                onClick={() => isMulti && setExpanded(isOpen ? null : i)}
                style={{
                  width: "100%", padding: "10px 0",
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: isMulti ? "pointer" : "default",
                  fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{leg.mode}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0, lineHeight: "16px" }}>
                    {leg.from} → {leg.to}
                  </p>
                  <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>
                    {fmtHrs(leg.time)} · {leg.km} km{isMulti ? ` · ${leg.multi.length} segments` : ""}
                  </p>
                </div>
                {isMulti && (isOpen ? <ChevronUp size={16} color={C.sub} /> : <ChevronDown size={16} color={C.sub} />)}
              </button>
              {isMulti && isOpen && (
                <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
                  {leg.multi.map((m, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                      <span style={{ fontSize: 14 }}>{m.mode}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: C.head, margin: 0 }}>{m.from} → {m.to}</p>
                        <p style={{ fontSize: 10, color: C.sub, margin: "1px 0 0" }}>{fmtHrs(m.time)} · {m.km} km</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TipBlock>{copy.tip}</TipBlock>
      <Footer>Estimates. Actual times vary with traffic, weather, and operator schedules.</Footer>
    </div>
  );
}

function ActivityPanel({ score }) {
  const tone = actTone(score.activityBand);
  const copy = ACT_TIME_COPY[score.activityBand];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Activity time</p>
          <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>{fmtHrs(score.activityHrs)} across {score.perActivity.length} activities</p>
        </div>
        <ScoreChip tone={tone} label={copy.label} />
      </div>
      <ScalePills levels={["Light", "Balanced", "Packed"]} activeIdx={["light","balanced","packed"].indexOf(score.activityBand)} tone={tone} />

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "18px 0 6px" }}>Per activity</p>
      <div style={{ borderTop: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", padding: "8px 0", borderBottom: `1px solid ${C.div}`, fontSize: 11, fontWeight: 600, color: C.sub }}>
          <div style={{ flex: 1 }}>Activity</div>
          <div style={{ width: 60, textAlign: "right" }}>You get</div>
          <div style={{ width: 60, textAlign: "right" }}>Ideal</div>
        </div>
        {score.perActivity.map((a, i) => {
          const short = a.time < a.ideal - 0.4;
          return (
            <div key={i} style={{ display: "flex", padding: "10px 0", borderBottom: `1px solid ${C.div}`, alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0, lineHeight: "16px" }}>{a.name}</p>
                {short && <p style={{ fontSize: 10, color: "#B54708", margin: "2px 0 0" }}>Short of ideal</p>}
              </div>
              <div style={{ width: 60, textAlign: "right", fontSize: 12, color: C.head, fontWeight: 600 }}>{fmtHrs(a.time)}</div>
              <div style={{ width: 60, textAlign: "right", fontSize: 12, color: C.sub }}>{fmtHrs(a.ideal)}</div>
            </div>
          );
        })}
      </div>

      <TipBlock>{copy.tip}</TipBlock>
      <Footer>Ideal times are guidance — your pace and interest may differ.</Footer>
    </div>
  );
}

function CrowdPanel({ score }) {
  const tone = crowdTone(score.crowdBand);
  const copy = CROWD_COPY[score.crowdBand];
  const queueTone = score.queueBand === "long" ? TONE.intense : score.queueBand === "moderate" ? TONE.mid : TONE.easy;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Crowds</p>
        <ScoreChip tone={tone} label={copy.label} />
      </div>
      <ScalePills levels={["Low", "Medium", "High"]} activeIdx={["low","medium","high"].indexOf(score.crowdBand)} tone={tone} />

      <p style={{ fontSize: 12, color: C.sub, margin: "12px 0 0", lineHeight: "17px" }}>
        <b style={{ color: C.head }}>Crowd</b> is how busy the place feels.{" "}
        <b style={{ color: C.head }}>Queue</b> is how long you'll wait to enter or get in.
      </p>

      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "16px 0 6px" }}>Per activity</p>
      <div style={{ borderTop: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", padding: "8px 0", borderBottom: `1px solid ${C.div}`, fontSize: 11, fontWeight: 600, color: C.sub }}>
          <div style={{ flex: 1 }}>Activity</div>
          <div style={{ width: 70, textAlign: "right" }}>Crowd</div>
          <div style={{ width: 88, textAlign: "right" }}>Wait</div>
        </div>
        {score.perActivity.map((a, i) => {
          const cT = a.crowd === "high" ? TONE.intense : a.crowd === "medium" ? TONE.mid : TONE.easy;
          return (
            <div key={i} style={{ display: "flex", padding: "10px 0", borderBottom: `1px solid ${C.div}`, alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0, lineHeight: "16px" }}>{a.name}</p>
                <p style={{ fontSize: 10, color: C.sub, margin: "2px 0 0" }}>{a.wait}</p>
              </div>
              <div style={{ width: 70, display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: cT.bg, color: cT.fg }}>
                  {a.crowd[0].toUpperCase() + a.crowd.slice(1)}
                </span>
              </div>
              <div style={{ width: 88, textAlign: "right", fontSize: 11, color: C.sub }}>
                {QUEUE_COPY[a.queue]?.label}
              </div>
            </div>
          );
        })}
      </div>

      <TipBlock>{copy.tip}</TipBlock>
      <Footer>Crowd & queue based on historical patterns and Google Places signals.</Footer>
    </div>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────

export default function DayScoringModal({ metric, score, onClose }) {
  const [closing, setClosing] = useState(false);
  if (!metric || !score) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 390, height: 844, borderRadius: 44,
          background: "rgba(0,0,0,0.45)",
          zIndex: 110,
          animation: closing ? "fadeOutBg 0.28s ease-out forwards" : "fadeInBg 0.28s ease-out forwards",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          width: 390, height: 844,
          transform: "translate(-50%, -50%)",
          zIndex: 111,
          pointerEvents: "none",
          borderRadius: 44,
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          maxHeight: "82%",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
          display: "flex", flexDirection: "column",
          pointerEvents: "auto",
          animation: closing ? "sheetSlideDown 0.28s ease-in forwards" : "sheetSlideUp 0.32s ease-out forwards",
        }}>
          {/* Grabber */}
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 0" }}>
            <div style={{ width: 36, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
          </div>
          {/* Close */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: "absolute", top: 10, right: 10,
              width: 28, height: 28, borderRadius: "50%",
              background: "#F5F5F5", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <XIcon size={14} color={C.head} />
          </button>

          {/* Body */}
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 18px 24px" }}>
            {metric === "pace" && <PacePanel score={score} />}
            {metric === "travel" && <TravelPanel score={score} />}
            {metric === "activity" && <ActivityPanel score={score} />}
            {metric === "crowd" && <CrowdPanel score={score} />}
          </div>
        </div>
      </div>
    </>
  );
}
