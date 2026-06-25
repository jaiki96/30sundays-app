import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { C, destData } from "../data";
import { useSaves } from "../data/saves";
import { useDeals } from "../data/deals";
import { synthesizeItinerary, routeNights, formatINR } from "../data/buildData";
import { generateRoutes } from "../data/routeGen";
import { mergedSaves, saveCounts, unionRegions, unionActivityIds, coupleRationale, YOU, PARTNER } from "../data/coupleData";

const PAD = 16;
const NIGHTS = 7;
const TITLES = { best: "Best of both", all: "All your regions", slow: "Slow & both-loved" };

function Avatars({ by, size = 20 }) {
  const people = by.map(k => (k === "you" ? YOU : PARTNER));
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {people.map((p, i) => (
        <div key={p.key} style={{ width: size, height: size, borderRadius: "50%", background: p.color, color: "#fff", fontSize: size * 0.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", marginLeft: i ? -6 : 0 }}>{p.initial}</div>
      ))}
    </div>
  );
}

function Chip({ children, tone = "soft" }) {
  const s = tone === "pink" ? { background: C.p100, color: C.p600, border: `1px solid ${C.p300}` } : { background: C.bg, color: C.head, border: `1px solid ${C.div}` };
  return <span style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 999, ...s }}>{children}</span>;
}

export default function RoutesWF() {
  const { name } = useParams();
  const dest = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { forDest } = useSaves();
  const { createDeal } = useDeals();

  if (!destData[dest]) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;

  const you = forDest(dest);
  const merged = useMemo(() => mergedSaves(dest, you), [dest, you]);
  const counts = saveCounts(merged);
  const gen = useMemo(() => generateRoutes({ dest, savedRegions: unionRegions(merged), savedActivities: unionActivityIds(merged), nights: NIGHTS, pace: "balanced" }), [dest, merged]);

  const customise = (r) => {
    const route = r.segs.map(s => ({ city: s.city, n: s.n }));
    const picksByCity = {};
    merged.activities.forEach(a => { if (route.find(s => s.city === a.city)) (picksByCity[a.city] = picksByCity[a.city] || []).push(a.name); });
    const it = synthesizeItinerary({ dest, nights: routeNights(route), route, picksByCity, vibes: [], startDate: null, party: { couples: 1, adults: 0, kids: 0 } });
    const { dealId, versionId } = createDeal({
      itineraryId: it.id, dest: it.dest, title: it.name, img: it.img, createdBy: "customer",
      customItinerary: it,
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: null, nights: it.nights, travelers: 2 }, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`);
  };

  const rec = gen.routes.find(r => r.recommended);
  const allFit = rec && rec.covered >= rec.total;
  const banner = gen.empty
    ? "Save a few regions and experiences first, then we'll build routes from them."
    : gen.needsBase
      ? "You've saved day trips and things to do, but no base to sleep in. Add a base to build a route."
      : allFit
        ? `Your ${counts.all} saves fit in ${NIGHTS} nights. Here are a few honest ways to arrange them.`
        : `All ${counts.all} saves won't fit in ${NIGHTS} nights. Here are ${gen.routes.length} honest ways to spend them, each showing what's in and what's for next time.`;

  return (
    <div className="hide-scrollbar" style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.bg, paddingBottom: 36 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `14px ${PAD}px 10px` }}>
        <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: "50%", background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={18} color={C.head} />
        </button>
        <h1 style={{ flex: 1, fontSize: 18, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>Routes from your saves</h1>
        <Avatars by={["you", "aanya"]} size={28} />
      </div>

      {/* Banner */}
      <div style={{ padding: `0 ${PAD}px 16px` }}>
        <div style={{ background: C.p100, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontSize: 12.5, color: C.head, margin: 0, lineHeight: "18px" }}>{banner}</p>
        </div>
      </div>

      {/* Empty / needs base */}
      {(gen.empty || gen.needsBase) && (
        <div style={{ padding: `10px ${PAD}px`, textAlign: "center" }}>
          <button onClick={() => navigate(`/wf/${encodeURIComponent(dest)}`)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.p600, color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Back to {dest}</button>
        </div>
      )}

      {/* Routes */}
      {gen.routes.length > 0 && (
        <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 14 }}>
          {gen.routes.map(r => {
            const needsMore = r.nights !== NIGHTS;
            return (
              <div key={r.key} style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${r.recommended ? C.p600 : C.div}`, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: 0 }}>{TITLES[r.key] || r.title}</h3>
                    <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>{r.nights} nights · {r.paceLabel} · from ₹{formatINR(r.perPerson)} pp</p>
                  </div>
                  {r.recommended
                    ? <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: C.p600, background: C.p100, border: `1px solid ${C.p300}`, borderRadius: 999, padding: "4px 9px" }}>Recommended</span>
                    : <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: C.p600 }}>{r.covered} of {r.total} saves</span>}
                </div>

                <div style={{ height: 6, borderRadius: 999, background: C.div, overflow: "hidden", margin: "10px 0 12px" }}>
                  <div style={{ width: `${r.total ? Math.round((r.covered / r.total) * 100) : 0}%`, height: "100%", background: C.p600 }} />
                </div>

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

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Avatars by={["you", "aanya"]} size={20} />
                  <span style={{ fontSize: 12, color: C.sub }}>{coupleRationale(r, merged)}</span>
                </div>

                <button onClick={() => customise(r)} style={{ width: "100%", background: r.recommended ? C.p600 : C.white, color: r.recommended ? "#fff" : C.head, border: `1.5px solid ${r.recommended ? C.p600 : C.div}`, borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Customise this route
                </button>
              </div>
            );
          })}

          <p onClick={() => navigate(`/wf/${encodeURIComponent(dest)}`)} style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: C.p600, margin: "6px 0 4px", cursor: "pointer" }}>
            None quite right? Tweak nights or regions
          </p>
        </div>
      )}
    </div>
  );
}
