import { Gauge, Timer, Clock, Users } from "lucide-react";
import { C } from "../data";

// Color logic shared across all metrics: green=easy, amber=moderate, red=intense.
const TONE = {
  easy:    { bg: "#E7F8EE", fg: "#027A48" },
  mid:     { bg: "#FFF4E0", fg: "#B54708" },
  intense: { bg: "#FEE4E2", fg: "#B42318" },
};

function paceTone(pace)   { return pace === "hectic" ? TONE.intense : pace === "neutral" ? TONE.mid : TONE.easy; }
function actTone(band)    { return band === "packed" ? TONE.intense : band === "balanced" ? TONE.mid : TONE.easy; }
function travelTone(band) { return band === "long" ? TONE.intense : band === "moderate" ? TONE.mid : TONE.easy; }
function crowdTone(band)  { return band === "high" ? TONE.intense : band === "medium" ? TONE.mid : TONE.easy; }

const PACE_LABEL   = { hectic: "Hectic",   neutral: "Neutral",  relaxed: "Relaxed" };
const ACT_LABEL    = { packed: "Packed",   balanced: "Balanced", light: "Light" };
const TRAVEL_LABEL = { long: "Long",       moderate: "Moderate", short: "Short" };
const CROWD_LABEL  = { high: "High",       medium: "Medium",     low: "Low" };

function fmtHrs(h) {
  if (h == null) return "-";
  if (Math.abs(h - Math.round(h)) < 0.05) return `${Math.round(h)} hr`;
  return `${h.toFixed(1)} hrs`;
}

function Tile({ icon: Icon, value, caption, tone, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minWidth: 0,
        padding: "10px 8px",
        background: "#fff",
        border: `1px solid ${C.div}`,
        borderRadius: 12,
        cursor: "pointer",
        fontFamily: "inherit",
        textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: tone.bg, color: tone.fg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={16} color={tone.fg} strokeWidth={2} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: 0, lineHeight: "16px" }}>{value}</p>
      <p style={{ fontSize: 10, color: C.sub, margin: 0, lineHeight: "12px" }}>{caption}</p>
    </button>
  );
}

export default function DayScoringRow({ score, onOpen }) {
  if (!score) return null;
  return (
    <div style={{
      display: "flex", gap: 8, padding: "12px 16px 0",
    }}>
      <Tile
        icon={Gauge}
        tone={paceTone(score.pace)}
        value={PACE_LABEL[score.pace]}
        caption="Pace"
        onClick={() => onOpen("pace")}
      />
      <Tile
        icon={Timer}
        tone={actTone(score.activityBand)}
        value={fmtHrs(score.activityHrs)}
        caption="Activity time"
        onClick={() => onOpen("activity")}
      />
      <Tile
        icon={Clock}
        tone={travelTone(score.travelBand)}
        value={fmtHrs(score.travelHrs)}
        caption="Travel time"
        onClick={() => onOpen("travel")}
      />
      <Tile
        icon={Users}
        tone={crowdTone(score.crowdBand)}
        value={CROWD_LABEL[score.crowdBand]}
        caption="Crowds"
        onClick={() => onOpen("crowd")}
      />
    </div>
  );
}

export { TONE, paceTone, actTone, travelTone, crowdTone, PACE_LABEL, ACT_LABEL, TRAVEL_LABEL, CROWD_LABEL, fmtHrs };
