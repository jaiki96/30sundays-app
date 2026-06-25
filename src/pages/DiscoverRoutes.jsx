import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, X, Minus, Plus, Check, Trash2, MapPin, Sparkles } from "lucide-react";
import { C, destData } from "../data";
import { useSaves } from "../data/saves";
import { useDeals } from "../data/deals";
import { synthesizeItinerary, routeNights, formatINR } from "../data/buildData";
import { regionByCity, activityById, isDayTrip } from "../data/discoverData";
import { generateRoutes } from "../data/routeGen";

const PAD = 16;
const PACES = [{ k: "chill", label: "Chill" }, { k: "balanced", label: "Balanced" }, { k: "packed", label: "Packed" }];

function Chip({ children, tone = "soft" }) {
  const styles = tone === "soft"
    ? { background: C.bg, color: C.head, border: `1px solid ${C.div}` }
    : { background: C.p100, color: C.p600, border: `1px solid ${C.p300}` };
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, ...styles }}>{children}</span>;
}

function ProgressBar({ frac }) {
  return (
    <div style={{ height: 6, borderRadius: 999, background: C.div, overflow: "hidden", margin: "10px 0 12px" }}>
      <div style={{ width: `${Math.round(frac * 100)}%`, height: "100%", background: C.p600, borderRadius: 999 }} />
    </div>
  );
}

export default function DiscoverRoutes() {
  const { name } = useParams();
  const dest = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { forDest, remove } = useSaves();
  const { createDeal } = useDeals();

  const [nights, setNights] = useState(7);
  const [pace, setPace] = useState("balanced");
  const [filter, setFilter] = useState("all");
  const [invite, setInvite] = useState(false);

  if (!destData[dest]) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;
  }

  const saved = forDest(dest);
  const savedActs = saved.activities.map(id => activityById(dest, id)).filter(Boolean);
  const savedRegionObjs = saved.regions.map(c => regionByCity(dest, c)).filter(Boolean);
  const bases = savedRegionObjs.filter(r => !r.dayTrip);
  const dayTrips = savedRegionObjs.filter(r => r.dayTrip);

  const gen = useMemo(
    () => generateRoutes({ dest, savedRegions: saved.regions, savedActivities: saved.activities, nights, pace }),
    [dest, saved.regions, saved.activities, nights, pace]
  );

  // Build a real, editable, priced itinerary from a generated route.
  const customise = (r) => {
    const route = r.segs.map(s => ({ city: s.city, n: s.n }));
    const picksByCity = {};
    savedActs.forEach(a => { if (route.find(s => s.city === a.city)) (picksByCity[a.city] = picksByCity[a.city] || []).push(a.name); });
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

  // Saved-items list with filtering.
  const rows = [
    ...bases.map(r => ({ kind: "regions", id: r.city, title: `${r.emoji} ${r.city}`, sub: r.blurb, tag: `Base · ${r.n}N`, group: "base" })),
    ...dayTrips.map(r => ({ kind: "regions", id: r.city, title: `${r.emoji} ${r.city}`, sub: r.blurb, tag: "Day trip", group: "daytrip" })),
    ...savedActs.map(a => ({ kind: "activities", id: a.id, title: a.name, sub: `${a.city} · ${a.dur}`, tag: a.vibe, group: "todo" })),
  ];
  const filtered = rows.filter(r => filter === "all" || r.group === filter);
  const filters = [
    { k: "all", label: `All · ${rows.length}` },
    { k: "base", label: `Bases · ${bases.length}` },
    { k: "daytrip", label: `Day trips · ${dayTrips.length}` },
    { k: "todo", label: `To do · ${savedActs.length}` },
  ].filter(f => f.k === "all" || rows.some(r => r.group === f.k));

  const banner = gen.empty
    ? "Save a few regions and experiences, then we'll build honest routes from them."
    : gen.needsBase
      ? "You've saved day trips and things to do, but no base to sleep in yet. Add a base to build a route."
      : `${gen.total} saves, ${nights} nights. Here are honest ways to spend them, each showing what's in and what's for next time.`;

  return (
    <div className="hide-scrollbar" style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.bg, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `14px ${PAD}px 8px` }}>
        <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: "50%", background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <h1 style={{ flex: 1, fontSize: 18, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>Your {dest} plan</h1>
        <button onClick={() => setInvite(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.p100, color: C.p600, border: `1px solid ${C.p300}`, borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          <UserPlus size={14} /> Invite
        </button>
      </div>

      {/* Banner */}
      <div style={{ padding: `0 ${PAD}px 14px` }}>
        <div style={{ background: C.p100, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontSize: 12.5, color: C.head, margin: 0, lineHeight: "18px" }}>{banner}</p>
        </div>
      </div>

      {/* Saved items */}
      {rows.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div className="hs" style={{ gap: 8, paddingLeft: PAD, paddingRight: PAD, marginBottom: 12 }}>
            {filters.map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ flexShrink: 0, background: filter === f.k ? C.p600 : C.white, color: filter === f.k ? "#fff" : C.head, border: `1px solid ${filter === f.k ? C.p600 : C.div}`, borderRadius: 999, padding: "7px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{f.label}</button>
            ))}
          </div>
          <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(r => (
              <div key={`${r.kind}:${r.id}`} style={{ display: "flex", alignItems: "center", gap: 11, background: C.white, border: `1px solid ${C.div}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</p>
                    <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.sub, background: C.bg, borderRadius: 999, padding: "2px 7px" }}>{r.tag}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</p>
                </div>
                <button onClick={() => remove(dest, r.kind, r.id)} aria-label="Remove" style={{ width: 30, height: 30, borderRadius: "50%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={15} color={C.inact} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Empty / needs-base states */}
      {(gen.empty || gen.needsBase) && (
        <div style={{ padding: `10px ${PAD}px`, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", margin: "12px auto 14px" }}>
            <MapPin size={24} color={C.p600} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>{gen.empty ? "Nothing saved yet" : "Add a base to sleep in"}</p>
          <p style={{ fontSize: 13, color: C.sub, margin: "0 0 18px", lineHeight: "19px" }}>{gen.empty ? "Save a couple of regions and experiences and we'll build routes around them." : "Day trips are great, but every route needs at least one base. Save one to continue."}</p>
          <button onClick={() => navigate(`/discover/${encodeURIComponent(dest)}`)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.p600, color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
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
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: 0 }}>{r.title}</h3>
                    <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>{r.nights} nights · {r.paceLabel} pace · from ₹{formatINR(r.perPerson)} pp</p>
                  </div>
                  {r.recommended
                    ? <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: C.p600, background: C.p100, border: `1px solid ${C.p300}`, borderRadius: 999, padding: "4px 9px" }}>Recommended</span>
                    : <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.p600 }}>{r.covered} of {r.total} saves</span>}
                </div>

                <ProgressBar frac={r.total ? r.covered / r.total : 0} />

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
                  {r.segs.map((s, i) => <Chip key={i}>{s.city} {s.n}N</Chip>)}
                  {r.dayTrips.map((c, i) => <Chip key={`d${i}`}>+ {c} day trip</Chip>)}
                </div>

                {r.inItems.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.p600 }}>{r.covered} of {r.total} saves:</span>
                    {r.inItems.slice(0, 4).map((it, i) => <Chip key={i} tone="pink">{it}</Chip>)}
                    {r.inItems.length > 4 && <Chip tone="pink">+{r.inItems.length - 4}</Chip>}
                  </div>
                )}

                {r.leftOutNames.length > 0 && (
                  <p style={{ fontSize: 12, color: C.sub, margin: "0 0 10px" }}>Leaves out: {r.leftOutNames.join(", ")}</p>
                )}

                {needsMore && (
                  <div style={{ background: C.p100, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: C.head, margin: 0, lineHeight: "17px" }}>{r.note}</p>
                  </div>
                )}

                <button onClick={() => customise(r)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: r.recommended ? C.p600 : C.white, color: r.recommended ? "#fff" : C.head, border: `1.5px solid ${r.recommended ? C.p600 : C.div}`, borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {r.recommended && <Sparkles size={16} />} Customise this route
                </button>
              </div>
            );
          })}

          <p onClick={() => navigate(`/discover/${encodeURIComponent(dest)}`)} style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: C.p600, margin: "6px 0 4px", cursor: "pointer" }}>
            None quite right? Save or remove places
          </p>
        </div>
      )}

      {/* Invite stub */}
      {invite && (
        <div onClick={() => setInvite(false)} style={{ position: "absolute", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "rgba(0,0,0,0.45)", animation: "fadeInBg 0.2s ease" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: "20px 20px 0 0", padding: 20, animation: "sheetSlideUp 0.28s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: 0 }}>Plan together</h3>
              <button onClick={() => setInvite(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={C.sub} /></button>
            </div>
            <p style={{ fontSize: 13.5, color: C.sub, margin: "0 0 16px", lineHeight: "19px" }}>Soon your partner will save their own favourites too, and every route will balance both of you. For now, you're planning solo.</p>
            <button onClick={() => setInvite(false)} style={{ width: "100%", background: C.p600, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
