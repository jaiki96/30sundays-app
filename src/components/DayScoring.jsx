import { Heart, Timer, Users, ChevronRight, X as XIcon, Lightbulb } from "lucide-react";
import { C } from "../data";
import { SCORE_PALETTE, LEVEL_KEYS } from "../data/dayScoring";
import { PaceBody, ActivityBody, TravelBody, CrowdBody } from "./ScoreModalVariants";

// Match the figma score row: icon-in-circle + value + label, with vertical dividers between tiles.
function ScoreTile({ icon: Icon, value, label, level, onClick }) {
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
        <span style={{ fontSize: 12, color: "#666C99", lineHeight: 1.3 }}>{label}</span>
      </div>
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
      <ScoreTile
        icon={Timer}
        value={scoring.activity.hoursText}
        label="Activity time"
        level={scoring.activity.level}
        onClick={() => onOpen("activity")}
      />
      <div style={{ width: 1, background: "#E0E2EB", margin: "8px 0" }} />
      <ScoreTile
        icon={Timer}
        value={scoring.travel.hoursText}
        label="Travel time"
        level={scoring.travel.level}
        onClick={() => onOpen("travel")}
      />
      <div style={{ width: 1, background: "#E0E2EB", margin: "8px 0" }} />
      <ScoreTile
        icon={Users}
        value={scoring.crowd.label}
        label="Crowds"
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
  crowd: "Crowds & queues",
};

export function DayScoreModal({ metric, scoring, dayLabel, onClose }) {
  const data = scoring[metric];
  if (!data) return null;

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
