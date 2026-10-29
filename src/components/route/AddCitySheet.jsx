import { useMemo, useState } from "react";
import { X as XIcon, Plus, Search as SearchIcon } from "lucide-react";
import { C } from "../../data";
import { destAreas, areaImg } from "../../data/buildData";
import { cityTags } from "../../data/cityTags";

// ─── Adding a city, at a particular point in the route ───
//
// Every city not already on the trip, and a tap adds it. What that costs, if
// anything, is said back on the route, where our suggestion can sit beside
// it as a button and the city can still be kept where it was put.

function SearchBox({ q, setQ }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9, padding: "0 12px", height: 40, borderRadius: 12,
      background: C.white, border: `1px solid ${q ? C.p600 : C.div}`,
    }}>
      <SearchIcon size={15} color={q ? C.p600 : C.inact} style={{ flexShrink: 0 }} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a city"
        data-testid="add-city-search"
        style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "none", fontFamily: "inherit", fontSize: 14, color: C.head, padding: 0 }}
      />
      {q && (
        <button onClick={() => setQ("")} aria-label="Clear search" style={{ width: 20, height: 20, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0, padding: 0 }}>
          <XIcon size={12} color={C.sub} />
        </button>
      )}
    </div>
  );
}

export default function AddCitySheet({ dest, route, gap, onAdd, onClose }) {
  const [q, setQ] = useState("");
  const areas = destAreas[dest] || [];
  const taken = new Set(route.map((s) => s.city));
  const before = gap > 0 ? route[gap - 1]?.city : null;
  const after = route[gap]?.city || null;
  const where = before && after ? `between ${before} and ${after}` : before ? `after ${before}` : after ? `before ${after}` : "to the route";

  const rest = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return areas
      .map((a, i) => ({ ...a, img: areaImg(dest, a.city, i), tags: cityTags(dest, a.city, 2) }))
      .filter((a) => !taken.has(a.city))
      .filter((a) => !needle || `${a.city} ${a.tag || ""}`.toLowerCase().includes(needle));
  }, [areas, dest, q]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 95, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(24,29,39,0.45)" }} onClick={onClose} />
      <div data-testid="add-city-sheet" style={{ position: "relative", background: C.bg, borderRadius: "20px 20px 0 0", height: "84%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flexShrink: 0, background: C.white, borderBottom: `1px solid ${C.div}`, padding: "10px 14px 12px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: C.div, margin: "0 auto 12px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 16, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>Add a city {where}</p>
            <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: C.bg, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <XIcon size={16} color={C.head} />
            </button>
          </div>
          <div style={{ marginTop: 10 }}><SearchBox q={q} setQ={setQ} /></div>
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {rest.length === 0 && (
            <p style={{ margin: "14px 0", fontSize: 13, color: C.sub, textAlign: "center" }}>
              {q.trim() ? `Nothing left in ${dest} matches "${q}".` : `Every city in ${dest} is already on the route.`}
            </p>
          )}

          {rest.map((a) => (
            <button
              key={a.city}
              data-testid={`add-city-${a.city}`}
              onClick={() => onAdd(a.city, gap)}
              style={{
                display: "flex", gap: 11, alignItems: "center", textAlign: "left",
                padding: 10, borderRadius: 14, background: C.white, border: `1px solid ${C.div}`,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <img src={a.img} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#F4F2F0" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: C.head }}>{a.city}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11.5, lineHeight: "16px", color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.tag}</p>
                {a.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                    {a.tags.map((t) => (
                      <span key={t.key} style={{ padding: "2px 8px", borderRadius: 999, background: t.bg, color: t.fg, fontSize: 10.5, fontWeight: 700 }}>{t.label}</span>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: C.p100, display: "grid", placeItems: "center", flexShrink: 0 }}><Plus size={16} strokeWidth={2.8} color={C.p600} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
