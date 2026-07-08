import { useState } from "react";
import { Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { C } from "../data";

// The inclusions content (min-stay pill + honeymoon perks + value add-ons +
// note). Shared by the bottom drawer and the inline hotel-detail section so
// both always show the same thing.
export function InclusionsBody({ inclusions }) {
  if (!inclusions) return null;
  const List = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Check size={15} color={C.sText} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: C.sub, lineHeight: "19px" }}>{p}</span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      {inclusions.minStay && (
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, color: C.p600, background: C.p100, borderRadius: 6, padding: "4px 9px", marginBottom: 14 }}>{inclusions.minStay}</span>
      )}
      {inclusions.honeymoon?.length > 0 && (
        <>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "0 0 8px" }}>Honeymoon perks</p>
          <List items={inclusions.honeymoon} />
        </>
      )}
      {inclusions.valueAdds?.length > 0 && (
        <>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: inclusions.honeymoon?.length ? "16px 0 8px" : "0 0 8px" }}>Value add-ons</p>
          <List items={inclusions.valueAdds} />
        </>
      )}
      {inclusions.note && (
        <p style={{ fontSize: 11, color: C.inact, lineHeight: "16px", margin: "16px 0 0" }}>{inclusions.note}</p>
      )}
    </>
  );
}

// Inline "Special inclusions" section for the hotel detail page. Matches the
// look of the other detail sections (title + bordered card).
export default function InclusionsSection({ inclusions }) {
  const [open, setOpen] = useState(false);
  if (!inclusions) return null;
  return (
    <div style={{ marginTop: 24, padding: "0 16px" }}>
      <div style={{ borderRadius: 14, border: `1px solid ${C.div}`, overflow: "hidden" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
        >
          <span style={{ width: 26, height: 26, borderRadius: 8, background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Sparkles size={15} color={C.p600} />
          </span>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: "#181E4C" }}>Special inclusions</span>
          {open ? <ChevronUp size={20} color={C.sub} /> : <ChevronDown size={20} color={C.sub} />}
        </button>
        {open && (
          <div style={{ padding: "0 16px 16px" }}>
            <InclusionsBody inclusions={inclusions} />
          </div>
        )}
      </div>
    </div>
  );
}
