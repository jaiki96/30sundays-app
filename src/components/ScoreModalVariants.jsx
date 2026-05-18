import { useState } from "react";
import { ChevronDown, ChevronUp, Plane, Car, Ship, Lightbulb } from "lucide-react";
import { C } from "../data";
import { SCORE_PALETTE, LEVEL_KEYS } from "../data/dayScoring";

// ─── Shared atoms ──────────────────────────────────────────────────────────

function TagChip({ level, children, size = "sm" }) {
  const colors = SCORE_PALETTE[LEVEL_KEYS[level]];
  const padding = size === "md" ? "5px 12px" : "3px 10px";
  const fontSize = size === "md" ? 13 : 12;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding, borderRadius: 999,
      background: colors.bg, color: colors.text,
      fontSize, fontWeight: 600, letterSpacing: 0.2,
    }}>
      {children}
    </span>
  );
}

function TipBlock({ text }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "12px 14px", borderRadius: 12,
      background: "#FFF4F7", border: "1px solid #FFE4E8",
    }}>
      <Lightbulb size={16} color={C.p600} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.p600, letterSpacing: 0.4 }}>
          30 SUNDAYS TIP
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#181E4C", lineHeight: 1.45 }}>{text}</p>
      </div>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid #E0E2EB", borderBottom: "1px solid #E0E2EB", margin: "16px 0" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0", background: "transparent", border: "none", cursor: "pointer",
        fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#181E4C",
      }}>
        {title}
        {open ? <ChevronUp size={16} color="#666C99" /> : <ChevronDown size={16} color="#666C99" />}
      </button>
      {open && <div style={{ paddingBottom: 14 }}>{children}</div>}
    </div>
  );
}

function TagDefList({ tags }) {
  return (
    <div>
      {tags.map((t, i) => (
        <div key={t.label} style={{
          display: "flex", gap: 10, alignItems: "center",
          marginBottom: i < tags.length - 1 ? 10 : 0,
        }}>
          <div style={{ flexShrink: 0, width: 84 }}>
            <TagChip level={t.level}>{t.label}</TagChip>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#666C99", lineHeight: 1.45, flex: 1 }}>{t.definition}</p>
        </div>
      ))}
    </div>
  );
}

// ─── PACE ───────────────────────────────────────────────────────────────────
export function PaceBody({ data, dayLabel }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <TagChip level={data.level} size="md">{data.label}</TagChip>
        <span style={{ fontSize: 12, color: "#666C99" }}>· {dayLabel}</span>
      </div>

      <p style={{ margin: "0 0 18px", fontSize: 13, color: "#666C99", lineHeight: 1.5 }}>
        {data.explainer}
      </p>

      <p style={{ margin: "0 0 6px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
        This day's makeup
      </p>
      {[
        { label: "Activities", value: data.quickStats?.[0]?.value ?? "-" },
        { label: "Time at activities", value: `${data.breakdown?.[0]?.value ?? 0} hrs` },
        { label: "Time in transit", value: `${data.breakdown?.[1]?.value ?? 0} hrs` },
      ].map((row, i, arr) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", padding: "10px 0",
          borderBottom: i < arr.length - 1 ? "1px solid #F0F1F5" : "none",
        }}>
          <span style={{ fontSize: 13, color: "#666C99" }}>{row.label}</span>
          <span style={{ fontSize: 13, color: "#181E4C", fontWeight: 500 }}>{row.value}</span>
        </div>
      ))}

      <div style={{ marginTop: 22 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
          Pace levels
        </p>
        <TagDefList tags={data.allTags || data.otherTags} />
      </div>

      <div style={{ marginTop: 18 }}>
        <TipBlock text={data.tip} />
      </div>

      <p style={{
        margin: "14px 0 0", fontSize: 11, color: "#A4A7AE",
        fontStyle: "italic", lineHeight: 1.45,
      }}>
        Pace is derived from the count of stops and the travel between them. Actual feel may vary based on your energy and how the day unfolds.
      </p>
    </div>
  );
}

// ─── ACTIVITY ───────────────────────────────────────────────────────────────
// No tag, no levels accordion. Two-column color hero + per-stop list with
// prominent times.
export function ActivityBody({ data, dayLabel }) {
  const stops = data.activities.length;
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
        {dayLabel}
      </p>

      {/* Two-column hero with green tint */}
      <div style={{
        display: "flex", background: "#D7EFE4", borderRadius: 12,
        marginBottom: 16, overflow: "hidden",
      }}>
        <div style={{ flex: 1, padding: "16px 18px" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#2E7D52", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            Total time
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: "#181E4C", lineHeight: 1 }}>
            {data.hoursText}
          </p>
        </div>
        <div style={{ width: 1, background: "rgba(78,172,126,0.25)" }} />
        <div style={{ flex: 1, padding: "16px 18px" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#2E7D52", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            Experiences
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: "#181E4C", lineHeight: 1 }}>
            {stops}<span style={{ fontSize: 16, fontWeight: 500, color: "#666C99", marginLeft: 4 }}>{stops === 1 ? "stop" : "stops"}</span>
          </p>
        </div>
      </div>

      <p style={{ margin: "0 0 18px", fontSize: 13, color: "#666C99", lineHeight: 1.5 }}>
        {data.explainer}
      </p>

      <p style={{ margin: "0 0 6px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
        Time per stop
      </p>
      <div>
        {data.activities.map((a, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < data.activities.length - 1 ? "1px solid #F0F1F5" : "none",
          }}>
            <img src={a.img} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#181E4C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.name}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#A4A7AE" }}>ideal {a.idealTime}</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#181E4C", flexShrink: 0 }}>
              {a.timeAt}
            </span>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }} />
      <TipBlock text={data.tip} />
    </div>
  );
}

// ─── TRAVEL ─────────────────────────────────────────────────────────────────
// No tag, no levels accordion. Two-column color hero + per-leg list.
export function TravelBody({ data, dayLabel }) {
  const legs = data.legs.length;
  const showKm = data.totalKm > 0;
  return (
    <div>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
        {dayLabel}
      </p>

      {/* Two-column hero with amber tint */}
      <div style={{
        display: "flex", background: "#FEF5E5", borderRadius: 12,
        marginBottom: 16, overflow: "hidden",
      }}>
        <div style={{ flex: 1, padding: "16px 18px" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#A66B00", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            Travel time
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: "#181E4C", lineHeight: 1 }}>
            {data.hoursText}
          </p>
        </div>
        <div style={{ width: 1, background: "rgba(253,162,1,0.3)" }} />
        <div style={{ flex: 1, padding: "16px 18px" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#A66B00", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>
            {showKm ? "Distance" : "Legs"}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 700, color: "#181E4C", lineHeight: 1 }}>
            {showKm ? (
              <>{data.totalKm}<span style={{ fontSize: 16, fontWeight: 500, color: "#666C99", marginLeft: 4 }}>km</span></>
            ) : (
              <>{legs}<span style={{ fontSize: 16, fontWeight: 500, color: "#666C99", marginLeft: 4 }}>{legs === 1 ? "leg" : "legs"}</span></>
            )}
          </p>
        </div>
      </div>

      <p style={{ margin: "0 0 18px", fontSize: 13, color: "#666C99", lineHeight: 1.5 }}>
        {data.explainer}
      </p>

      <p style={{ margin: "0 0 6px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
        Per leg
      </p>
      <div>
        {data.legs.map((leg, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < data.legs.length - 1 ? "1px solid #F0F1F5" : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {leg.mode === "flight" ? <Plane size={16} color="#666C99" /> : leg.mode === "ferry" ? <Ship size={16} color="#666C99" /> : <Car size={16} color="#666C99" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#181E4C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {leg.from} → {leg.to}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#A4A7AE", textTransform: "capitalize" }}>{leg.mode}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#181E4C" }}>{leg.time}</p>
              {leg.km !== "-" && (
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#666C99" }}>{leg.km}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }} />
      <TipBlock text={data.tip} />
    </div>
  );
}

// ─── CROWD ──────────────────────────────────────────────────────────────────
// Two parameters with their own one-line explainers, per-stop columns, and a
// dual accordion showing all crowd + queue level definitions.
export function CrowdBody({ data, dayLabel }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <TagChip level={data.level} size="md">{data.label}</TagChip>
        <span style={{ fontSize: 12, color: "#666C99" }}>· {dayLabel}</span>
      </div>

      {/* Column header */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 84px 84px",
        gap: 8, padding: "8px 0",
        borderBottom: "1px solid #E0E2EB",
      }}>
        <span style={{ fontSize: 10, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>Stop</span>
        <span style={{ fontSize: 10, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, textAlign: "center" }}>Crowd</span>
        <span style={{ fontSize: 10, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, textAlign: "center" }}>Queue</span>
      </div>

      {/* Per-stop rows */}
      {data.activities.map((a, i) => {
        const cLvl = a.crowd === "high" ? 2 : a.crowd === "moderate" ? 1 : 0;
        const qLvl = a.queue === "long" ? 2 : a.queue === "moderate" ? 1 : 0;
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        const queueRange = a.queue === "short" ? "< 30 min wait"
                         : a.queue === "moderate" ? "30-60 min wait"
                         : "> 60 min wait";
        return (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 84px 84px",
            gap: 8, alignItems: "center", padding: "12px 0",
            borderBottom: i < data.activities.length - 1 ? "1px solid #F0F1F5" : "none",
          }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#181E4C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.name}
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <TagChip level={cLvl}>{cap(a.crowd)}</TagChip>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <TagChip level={qLvl}>{cap(a.queue)}</TagChip>
              <span style={{ fontSize: 10, fontStyle: "italic", color: "#A4A7AE", whiteSpace: "nowrap" }}>
                {queueRange}
              </span>
            </div>
          </div>
        );
      })}

      {/* Appendix - always-visible definitions */}
      <div style={{ marginTop: 22 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
          Crowd levels
        </p>
        <TagDefList tags={data.crowdLevels} />

        <p style={{ margin: "18px 0 10px", fontSize: 11, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
          Queue levels
        </p>
        <TagDefList tags={data.queueLevels} />
      </div>

      {data.tip && <div style={{ marginTop: 18 }}><TipBlock text={data.tip} /></div>}

      {/* Disclaimer */}
      <p style={{
        margin: "14px 0 0", fontSize: 11, color: "#A4A7AE",
        fontStyle: "italic", lineHeight: 1.45,
      }}>
        Average values shown. Actual crowd and queue times may vary based on season, weather, events, and real-time conditions on the day.
      </p>
    </div>
  );
}
