import { C } from "../../data";
import PortraitVideo from "./PortraitVideo";

// Portrait comparison video card — "Bali vs Thailand" style.
// Two country chips overlay top, hook text bottom.
export default function CompareVideo({ data, width = 220 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
      <PortraitVideo
        poster={data.poster}
        videoUrl={data.videoUrl}
        duration={data.duration}
        width={width}
        radius={16}
        topLeftSlot={
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Chip text={data.a} />
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, opacity: 0.85 }}>vs</span>
            <Chip text={data.b} />
          </div>
        }
        bottomSlot={
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            {data.hook}
          </div>
        }
      />
    </div>
  );
}

function Chip({ text }) {
  return (
    <span style={{
      background: "rgba(255,255,255,0.92)", color: C.head,
      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }}>
      {text}
    </span>
  );
}
