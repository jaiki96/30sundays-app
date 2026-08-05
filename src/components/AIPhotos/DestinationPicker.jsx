import { Check, Shuffle } from "lucide-react";
import { C } from "../../data";
import Sheet from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";
import { AI_DESTINATIONS, COPY } from "../../data/aiPhotosData";

// Only destinations with all 7 locations ready appear here, per the content
// rule in the PRD.
export default function DestinationPicker() {
  const { sheet, setSheet, destination, onDestinationSelected, onSurpriseMe } = useAIPhotos();
  const open = sheet === "destination";

  return (
    <Sheet open={open} onClose={() => setSheet(null)} title={COPY.destTitle} sub={COPY.destSub}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 4 }}>
        {AI_DESTINATIONS.map((d) => {
          const active = destination === d.slug;
          return (
            <button
              key={d.slug}
              onClick={() => onDestinationSelected(d.slug)}
              style={{
                display: "flex", alignItems: "center", gap: 13, minHeight: 48, padding: 10,
                background: active ? C.p100 : C.white,
                border: `1.5px solid ${active ? C.p300 : C.div}`,
                borderRadius: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}
            >
              <img src={d.hero} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{d.name}</p>
                <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{d.blurb}</p>
              </div>
              {active && (
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.p600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={13} color="#fff" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}

        {/* For couples who have not settled on a place yet. */}
        <button
          onClick={onSurpriseMe}
          style={{
            display: "flex", alignItems: "center", gap: 13, minHeight: 48, padding: 10,
            background: `linear-gradient(135deg, ${C.p100} 0%, ${C.white} 100%)`,
            border: `1.5px dashed ${C.p300}`,
            borderRadius: 16, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          }}
        >
          <span style={{ width: 56, height: 56, borderRadius: 12, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 6px rgba(137,18,62,0.12)" }}>
            <Shuffle size={22} color={C.p600} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{COPY.surpriseTitle}</p>
            <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{COPY.surpriseSub}</p>
          </div>
        </button>
      </div>
      <p style={{ fontSize: 11.5, color: C.inact, margin: "12px 2px 0", lineHeight: "16px" }}>
        Switching later starts you over at the first spot in the new place.
      </p>
    </Sheet>
  );
}
