import { Heart, Timer, Plane, Users, ChevronRight, X as XIcon, Lightbulb } from "lucide-react";
import { C } from "../data";
import { SCORE_PALETTE, LEVEL_KEYS } from "../data/dayScoring";
import { PaceBody, ActivityBody, TravelBody, CrowdBody } from "./ScoreModalVariants";

// Match the figma score row: icon-in-circle + value + label, with vertical dividers between tiles.
function ScoreTile({ icon: Icon, value, sub, label, level, onClick }) {
  const colors = SCORE_PALETTE[LEVEL_KEYS[level]];
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, padding: "0 4px",
        background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={16} color={colors.icon} strokeWidth={2.2} fill={Icon === Heart ? colors.icon : "none"} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 0, fontSize: 14, fontWeight: 500, color: "#181E4C", lineHeight: 1.4 }}>
          {value}
          <ChevronRight size={11} color="#A4A7AE" />
        </span>
        {sub && (
          <span style={{ fontSize: 11, fontWeight: 600, color: "#181E4C", lineHeight: 1.3 }}>{sub}</span>
        )}
        <span style={{ fontSize: 12, color: "#666C99", lineHeight: 1.3 }}>{label}</span>
      </div>
    </button>
  );
}

// Compact "6.5h" formatter used inside the row.
const shortH = (h) => (h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`);

// Inner half-tile used inside the merged duration tile. Same icon+value+label
// rhythm as ScoreTile but without its own button wrapper or chevron.
function DurationHalfTile({ icon: Icon, value, label, level }) {
  const colors = SCORE_PALETTE[LEVEL_KEYS[level]];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={16} color={colors.icon} strokeWidth={2.2} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", lineHeight: 1.4 }}>{value}</span>
        <span style={{ fontSize: 12, color: "#666C99", lineHeight: 1.3 }}>{label}</span>
      </div>
    </div>
  );
}

// Merged Activity + Travel tile: two sub-tiles joined by a "+" with a single
// "≈ 12.5 hr day" caption centered underneath both.
function DurationTile({ scoring, onClick }) {
  const a = scoring.activity;
  const t = scoring.travel;
  const d = scoring.duration;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 2, display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, padding: "0 4px",
        background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 4, width: "100%" }}>
        <DurationHalfTile icon={Timer} value={shortH(a.hours)} label="Activity time" level={a.level} />
        <span style={{
          fontSize: 18, fontWeight: 600, color: "#A4A7AE",
          alignSelf: "center", marginTop: -10,
        }}>+</span>
        <DurationHalfTile icon={Plane} value={shortH(t.hours)} label="Travel time" level={t.level} />
      </div>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        fontSize: 14, fontWeight: 700, color: "#181E4C", lineHeight: 1.3,
        marginTop: 2,
      }}>
        ≈ {shortH(d.totalHrs)} day
        <ChevronRight size={13} color="#A4A7AE" />
      </span>
    </button>
  );
}

export function DayScoreRow({ scoring, onOpen }) {
  return (
    <div style={{
      display: "flex", padding: "12px 0",
      background: "#F9F9FB",
      borderTop: "1px solid #E0E2EB", borderBottom: "1px solid #E0E2EB",
    }}>
      <ScoreTile
        icon={Heart}
        value={scoring.pace.label}
        label="Pace"
        level={scoring.pace.level}
        onClick={() => onOpen("pace")}
      />
      <div style={{ width: 1, background: "#E0E2EB", margin: "8px 0" }} />
      <DurationTile scoring={scoring} onClick={() => onOpen("duration")} />
      <div style={{ width: 1, background: "#E0E2EB", margin: "8px 0" }} />
      <ScoreTile
        icon={Users}
        value={scoring.crowd.label}
        label="Crowd levels"
        level={scoring.crowd.level}
        onClick={() => onOpen("crowd")}
      />
    </div>
  );
}

// 3-segment scale visual.
function ScorePills({ labels, activeLevel }) {
  return (
    <div style={{ display: "flex", gap: 6, width: "100%" }}>
      {labels.map((l, i) => {
        const colors = SCORE_PALETTE[LEVEL_KEYS[i]];
        const active = i === activeLevel;
        return (
          <div key={l} style={{
            flex: 1, padding: "6px 8px", borderRadius: 999, textAlign: "center",
            background: active ? colors.bg : "#F5F5F5",
            color: active ? colors.text : "#A4A7AE",
            fontSize: 11, fontWeight: 600,
            border: active ? `1px solid ${colors.icon}` : "1px solid transparent",
          }}>
            {l}
          </div>
        );
      })}
    </div>
  );
}

function TipBlock({ text }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "12px 14px", borderRadius: 12,
      background: "#FFF4F7", border: "1px solid #FFE4E8",
    }}>
      <div style={{ flexShrink: 0, marginTop: 1 }}>
        <Lightbulb size={16} color={C.p600} strokeWidth={2} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.p600, letterSpacing: 0.4 }}>
          30 SUNDAYS TIP
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#181E4C", lineHeight: 1.45 }}>{text}</p>
      </div>
    </div>
  );
}

const LEVEL_TO_KEY = { low: "green", short: "green", mixed: "amber", medium: "amber", high: "red", long: "red" };
const levelChip = (lvl) => SCORE_PALETTE[LEVEL_TO_KEY[lvl] || "amber"];

// Bottom-sheet shell.
function Sheet({ title, scoreText, children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "flex-end", zIndex: 30,
    }}>
      <div onClick={e => e.stopPropagation()} className="animate-slide-up" style={{
        width: "100%", maxHeight: "85%", overflowY: "auto",
        background: "#fff", borderRadius: "20px 20px 0 0",
      }}>
        <div style={{ padding: "8px 0 4px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#E0E2EB", margin: "0 auto" }} />
        </div>
        <div style={{ padding: "12px 20px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#181E4C" }}>{title}</h3>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: "50%", background: "#F5F5F5",
              border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <XIcon size={14} color="#666C99" />
            </button>
          </div>
          {scoreText && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666C99" }}>{scoreText}</p>
          )}
        </div>
        <div style={{ padding: "0 20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

const TITLES = {
  pace: "Pace",
  activity: "Activity time",
  travel: "Travel time",
  duration: "Tour duration",
  crowd: "Crowd levels",
};

// Merged Activity + Travel modal: total + breakdown.
function DurationBody({ data, scoring, dayLabel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 13, color: "#666C99", lineHeight: 1.5 }}>
        {data.explainer}
      </p>

      {/* Total card */}
      <div style={{
        padding: 14, borderRadius: 12,
        background: "#FFF4F7", border: "1px solid #FFE4E8",
      }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: C.p600 }}>
          APPROXIMATE TOTAL
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700, color: "#181E4C", letterSpacing: -0.3 }}>
          ≈ {data.totalText}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#666C99" }}>
          {data.activityText} at activities + {data.travelText} in transit
        </p>
      </div>

      {/* Activity legs */}
      {scoring?.activity?.activities?.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#666C99", letterSpacing: 0.4 }}>
            ACTIVITY TIME · {data.activityText}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {scoring.activity.activities.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#181E4C" }}>
                <span>{a.name}</span>
                <span style={{ color: "#666C99" }}>{a.timeAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel legs */}
      {scoring?.travel?.legs?.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#666C99", letterSpacing: 0.4 }}>
            TRAVEL TIME · {data.travelText}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {scoring.travel.legs.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#181E4C" }}>
                <span>{l.from} → {l.to}</span>
                <span style={{ color: "#666C99" }}>{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.tip && <TipBlock text={data.tip} />}
    </div>
  );
}

export function DayScoreModal({ metric, scoring, dayLabel, onClose }) {
  const data = scoring[metric];
  if (!data) return null;

  if (metric === "duration") {
    return (
      <Sheet title={TITLES.duration} scoreText={null} onClose={onClose}>
        <DurationBody data={data} scoring={scoring} dayLabel={dayLabel} />
      </Sheet>
    );
  }

  const Body =
    metric === "pace" ? PaceBody :
    metric === "activity" ? ActivityBody :
    metric === "travel" ? TravelBody :
    metric === "crowd" ? CrowdBody : null;

  if (!Body) return null;

  return (
    <Sheet title={TITLES[metric]} scoreText={null} onClose={onClose}>
      <Body data={data} dayLabel={dayLabel} />
    </Sheet>
  );
}
