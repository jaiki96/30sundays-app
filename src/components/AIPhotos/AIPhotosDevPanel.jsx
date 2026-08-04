import { FlaskConical } from "lucide-react";
import { C } from "../../data";
import Sheet from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { AI_DESTINATIONS, LOCATIONS_PER_DESTINATION } from "../../data/aiPhotosData";

// Reviewer tool, not part of the feature. Jumps straight to any state so nobody
// has to sit through the mock generation delay to see a screen.
const STATES = [
  ["loggedOut", "Logged out"],
  ["noPhoto", "No photo"],
  ["generating", "Generating"],
  ["generatedUnseen", "Generated, unseen"],
  ["generatedSeen", "Generated, seen"],
  ["failed", "Generation failed"],
  ["hidden", "Hidden"],
  ["removed", "Removed"],
  ["offline", "Offline"],
];

const REJECTIONS = [
  [null, "None"],
  ["no_face", "No face"],
  ["moderation", "Moderation"],
  ["minor_detected", "Minor detected"],
];

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        minHeight: 34, padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
        fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
        border: `1px solid ${active ? C.p300 : C.div}`,
        background: active ? C.p100 : C.white,
        color: active ? C.p600 : C.sub,
      }}
    >
      {children}
    </button>
  );
}

function Group({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: C.inact, margin: "0 0 8px" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{children}</div>
    </div>
  );
}

export function DevPanelButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Prototype states"
      style={{
        position: "absolute", left: 16, bottom: 160, zIndex: 90,
        width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.div}`,
        background: C.white, boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}
    >
      <FlaskConical size={19} color={C.head} />
    </button>
  );
}

export default function AIPhotosDevPanel() {
  const s = useAIPhotos();
  const {
    sheet, setSheet, forceState, patch,
    status, hidden, loggedIn, offline, destination, locationIndex,
    nudgeDismissed, nudgeSuppressed, rejection,
  } = s;

  // Which preset best describes where we are right now.
  const current =
    !loggedIn ? "loggedOut"
    : offline ? "offline"
    : hidden ? "hidden"
    : status === "generating" ? "generating"
    : status === "failed" ? "failed"
    : status === "generated" ? (s.seen ? "generatedSeen" : "generatedUnseen")
    : nudgeSuppressed ? "removed"
    : "noPhoto";

  return (
    <Sheet open={sheet === "dev"} onClose={() => setSheet(null)} title="Prototype states" sub="Reviewer shortcuts. Not part of the feature." zIndex={260}>
      <Group label="State">
        {STATES.map(([key, label]) => (
          <Chip key={key} active={current === key} onClick={() => forceState(key)}>{label}</Chip>
        ))}
      </Group>

      <Group label="Destination">
        {AI_DESTINATIONS.map((d) => (
          <Chip key={d.slug} active={destination === d.slug} onClick={() => patch({ destination: d.slug })}>{d.name}</Chip>
        ))}
      </Group>

      <Group label="Spot in the cycle">
        {Array.from({ length: LOCATIONS_PER_DESTINATION }).map((_, i) => (
          <Chip key={i} active={locationIndex === i} onClick={() => patch({ locationIndex: i, seen: true })}>{i + 1}</Chip>
        ))}
      </Group>

      <Group label="Nudge">
        <Chip active={!nudgeDismissed && !nudgeSuppressed} onClick={() => patch({ nudgeDismissed: false, nudgeSuppressed: false })}>Show</Chip>
        <Chip active={nudgeDismissed} onClick={() => patch({ nudgeDismissed: true })}>Dismissed</Chip>
      </Group>

      <Group label="Upload rejection">
        {REJECTIONS.map(([key, label]) => (
          <Chip key={label} active={rejection === key} onClick={() => patch({ rejection: key })}>{label}</Chip>
        ))}
      </Group>

      <Group label="Connection">
        <Chip active={!offline} onClick={() => patch({ offline: false })}>Online</Chip>
        <Chip active={offline} onClick={() => patch({ offline: true })}>Offline</Chip>
      </Group>

      <p style={{ fontSize: 11.5, color: C.inact, margin: "0 2px 4px", lineHeight: "16px" }}>
        Triple tap the hero to open this panel again.
      </p>
    </Sheet>
  );
}
