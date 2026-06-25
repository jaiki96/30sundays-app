import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Sparkles } from "lucide-react";
import { C, destData } from "../data";
import { useSaves } from "../data/saves";
import { useDeals } from "../data/deals";
import { synthesizeItinerary, routeNights, formatINR } from "../data/buildData";
import { generateRoutes } from "../data/routeGen";
import { mergedSaves, saveCounts, unionRegions, unionActivityIds, coupleRationale, YOU, PARTNER } from "../data/coupleData";

const PAD = 16;
const PACES = [{ k: "chill", label: "Chill" }, { k: "balanced", label: "Balanced" }, { k: "packed", label: "Packed" }];

function Avatars({ by, size = 22 }) {
  const people = by.map(k => (k === "you" ? YOU : PARTNER));
  return (
    <div style={{ display: "flex" }}>
      {people.map((p, i) => (
        <div key={p.key} style={{ width: size, height: size, borderRadius: "50%", background: p.color, color: "#fff", fontSize: size * 0.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: i ? -7 : 0 }}>{p.initial}</div>
      ))}
    </div>
  );
}

function Chip({ children }) {
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, background: C.bg, color: C.head, border: `1px solid ${C.div}` }}>{children}</span>;
}

export default function RoutesCouples() {
  const { name } = useParams();
  const dest = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { forDest, remove } = useSaves();
  const { createDeal } = useDeals();

  const [nights, setNights] = useState(7);
  const [pace, setPace] = useState("balanced");
  const [filter, setFilter] = useState("all");

  if (!destData[dest]) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;

  const you = forDest(dest);
  const merged = useMemo(() => mergedSaves(dest, you), [dest, you]);
  const counts = saveCounts(merged);

  const gen = useMemo(
    () => generateRoutes({ dest, savedRegions: unionRegions(merged), savedActivities: unionActivityIds(merged), nights, pace }),
    [dest, merged, nights, pace]
  );

  const customise = (r) => {
    const route = r.segs.map(s => ({ city: s.city, n: s.n }));
    const picksByCity = {};
    merged.activities.forEach(a => { if (route.find(s => s.city === a.city)) (picksByCity[a.city] = picksByCity[a.city] || []).push(a.name); });
    const n = routeNights(route);
    const it = synthesizeItinerary({ dest, nights: n, route, picksByCity, vibes: [], startDate: null, party: { couples: 1, adults: 0, kids: 0 } });
    const { dealId, versionId } = createDeal({
      itineraryId: it.id, dest: it.dest, title: it.name, img: it.img, createdBy: "customer",
      customItinerary: it,
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: null, nights: it.nights, travelers: 2 }, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`);
  };

  // Saved items, sorted "both love" first, filtered by who.
  const allRows = [
    ...merged.regions.map(r => ({ kind: "regions", id: r.city, title: `${r.emoji} ${r.city}`, sub: r.blurb, tag: r.dayTrip ? "Day trip" : `Base · ${r.n}N`, by: r.by })),
    ...merged.activities.map(a => ({ kind: "activities", id: a.id, title: a.name, sub: `${a.city} · ${a.dur}`, tag: a.vibe, by: a.by })),
  ].sort((a, b) => (b.by.length - a.by.length));
  const rows = allRows.filter(r => filter === "all" || (filter === "both" ? r.by.length > 1 : r.by.includes(filter)));
  const filters = [
    { k: "all", label: `All · ${counts.all}` },
    { k: "you", label: `You · ${counts.you}` },
    { k: "aanya", label: `Aanya · ${counts.aanya}` },
    { k: "both", label: `Both · ${counts.both}` },
  ];

  return (
    <div className="hide-scrollbar" style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.bg, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `14px ${PAD}px 8px` }}>
        <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: "50%", background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <h1 style={{ flex: 1, fontSize: 18, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>Your {dest} plan</h1>
        <Avatars by={["you", "aanya"]} size={28} />
      </div>

      {/* Banner */}
      <div style={{ padding: `0 ${PAD}px 14px` }}>
        <div style={{ background: C.p100, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontSize: 12.5, color: C.head, margin: 0, lineHeight: "18px" }}>
            You &amp; Aanya saved {counts.all} things. Everything here tunes the routes we show you both.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="hs" style={{ gap: 8, paddingLeft: PAD, paddingRight: PAD, marginBottom: 12 }}>
        {filters.map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{ flexShrink: 0, background: filter === f.k ? C.p600 : C.white, color: filter === f.k ? "#fff" : C.head, border: `1px solid ${filter === f.k ? C.p600 : C.div}`, borderRadius: 999, padding: "7px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{f.label}</button>
        ))}
      </div>

      {/* Saved items */}
      <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {rows.map(r => (
          <div key={`${r.kind}:${r.id}`} style={{ display: "flex", alignItems: "center", gap: 11, background: r.by.length > 1 ? C.p100 : C.white, border: `1px solid ${r.by.length > 1 ? C.p300 : C.div}`, borderRadius: 12, padding: "10px 12px" }}>
            <Avatars by={r.by} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</p>
                <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.sub, background: C.white, border: `1px solid ${C.div}`, borderRadius: 999, padding: "2px 7px" }}>{r.tag}</span>
              </div>
              <p style={{ fontSize: 11.5, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</p>
            </div>
            {r.by.includes("you") && (
              <button onClick={() => remove(dest, r.kind, r.id)} aria-label="Remove" style={{ width: 30, height: 30, borderRadius: "50%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Trash2 size={15} color={C.inact} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      {!gen.empty && !gen.needsBase && (
        <div style={{ padding: `0 ${PAD}px 18px` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.head }}>Trip length</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setNights(n => Math.max(3, n - 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={15} color={C.head} /></button>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.head, minWidth: 58, textAlign: "center" }}>{nights} nights</span>
              <button onClick={() => setNights(n => Math.min(14, n + 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={15} color={C.head} /></button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {PACES.map(p => (
              <button key={p.k} onClick={() => setPace(p.k)} style={{ flex: 1, background: pace === p.k ? C.head : C.white, color: pace === p.k ? "#fff" : C.head, border: `1px solid ${pace === p.k ? C.head : C.div}`, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{p.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Empty / needs-base */}
      {(gen.empty || gen.needsBase) && (
        <div style={{ padding: `10px ${PAD}px`, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", margin: "12px auto 14px" }}>
            <MapPin size={24} color={C.p600} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>{gen.empty ? "Nothing saved yet" : "Add a base to sleep in"}</p>
          <p style={{ fontSize: 13, color: C.sub, margin: "0 0 18px", lineHeight: "19px" }}>{gen.empty ? "Save a couple of regions and we'll build routes for the two of you." : "Every route needs at least one base. Save one to continue."}</p>
          <button onClick={() => navigate(`/discover-couples/${encodeURIComponent(dest)}`)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.p600, color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Back to {dest}
          </button>
        </div>
      )}

      {/* Routes */}
      {gen.routes.length > 0 && (
        <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 14 }}>
          {gen.routes.map(r => {
            const needsMore = r.nights !== nights;
            return (
              <div key={r.key} style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${r.recommended ? C.p600 : C.div}`, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: 0 }}>{r.recommended ? "Best of both" : r.key === "all" ? "All your places" : "Slow & both-loved"}</h3>
                    <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>{r.nights} nights · {r.paceLabel} pace · from ₹{formatINR(r.perPerson)} pp</p>
                  </div>
                  {r.recommended
                    ? <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: C.p600, background: C.p100, border: `1px solid ${C.p300}`, borderRadius: 999, padding: "4px 9px" }}>Recommended</span>
                    : <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.p600 }}>{r.covered} of {r.total} saves</span>}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, margin: "12px 0" }}>
                  {r.segs.map((s, i) => <Chip key={i}>{s.city} {s.n}N</Chip>)}
                  {r.dayTrips.map((c, i) => <Chip key={`d${i}`}>+ {c} day trip</Chip>)}
                </div>

                {r.leftOutNames.length > 0 && (
                  <p style={{ fontSize: 12, color: C.sub, margin: "0 0 10px" }}>Leaves out: {r.leftOutNames.join(", ")}</p>
                )}

                {needsMore && (
                  <div style={{ background: C.p100, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: C.head, margin: 0, lineHeight: "17px" }}>{r.note}</p>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Avatars by={["you", "aanya"]} size={20} />
                  <span style={{ fontSize: 12, color: C.sub }}>{coupleRationale(r, merged)}</span>
                </div>

                <button onClick={() => customise(r)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: r.recommended ? C.p600 : C.white, color: r.recommended ? "#fff" : C.head, border: `1.5px solid ${r.recommended ? C.p600 : C.div}`, borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {r.recommended && <Sparkles size={16} />} Customise this route
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
