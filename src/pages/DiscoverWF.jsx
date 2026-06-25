import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Play, Check, ChevronRight, Sparkles } from "lucide-react";
import { C, destData } from "../data";
import { useSaves } from "../data/saves";
import { useDeals } from "../data/deals";
import { destHero, estimatePerPerson, formatINR, synthesizeItinerary, routeNights } from "../data/buildData";
import { regionsFor, activitiesFor } from "../data/discoverData";
import { generateRoutes } from "../data/routeGen";

const PAD = 16;
const NIGHT_CYCLE = [5, 7, 9, 11];
const PACE_CYCLE = ["Balanced", "Packed", "Chill"];

function SaveHeart({ saved, onClick }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} aria-label={saved ? "Saved" : "Save"} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: saved ? C.p600 : "rgba(255,255,255,0.92)", boxShadow: "0 1px 5px rgba(0,0,0,0.18)" }}>
      <Heart size={16} fill={saved ? "#fff" : "none"} color={saved ? "#fff" : C.head} strokeWidth={2} />
    </button>
  );
}

export default function DiscoverWF() {
  const { name } = useParams();
  const dest = decodeURIComponent(name || "");
  const navigate = useNavigate();
  const { forDest, toggleRegion, toggleActivity } = useSaves();
  const { createDeal } = useDeals();

  if (!destData[dest]) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;

  const regions = regionsFor(dest);
  const activities = activitiesFor(dest, 8);
  const saved = forDest(dest);
  const isRegionSaved = (c) => saved.regions.includes(c);
  const isActivitySaved = (id) => saved.activities.includes(id);

  // Build-your-route controls (local to this screen — the "as drawn" model).
  const baseRegions = regions.filter(r => !r.dayTrip);
  const [selected, setSelected] = useState(baseRegions.slice(0, 2).map(r => r.city));
  const [nights, setNights] = useState(7);
  const [pace, setPace] = useState("Balanced");
  const [showAll, setShowAll] = useState(false);

  const toggleSel = (c) => setSelected(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c]);

  // "Routes that fit you" — variants across paces, ranked, with a fit %.
  const routes = useMemo(() => {
    const out = [];
    ["balanced", "packed", "chill"].forEach(p => {
      generateRoutes({ dest, savedRegions: selected, savedActivities: [], nights, pace: p }).routes.forEach(r => out.push(r));
    });
    const seen = new Set();
    const uniq = out.filter(r => { const s = r.segs.map(x => x.city + x.n).join("|"); if (seen.has(s)) return false; seen.add(s); return true; });
    return uniq.map((r, i) => ({ ...r, fit: Math.max(60, 92 - i * 8) }));
  }, [dest, selected, nights]);

  const savedSpots = selected.filter(c => regions.find(r => r.city === c)?.dayTrip).length;
  const baseCount = selected.length - savedSpots;

  const customise = (r) => {
    const route = r.segs.map(s => ({ city: s.city, n: s.n }));
    const it = synthesizeItinerary({ dest, nights: routeNights(route), route, picksByCity: {}, vibes: [], startDate: null, party: { couples: 1, adults: 0, kids: 0 } });
    const { dealId, versionId } = createDeal({
      itineraryId: it.id, dest: it.dest, title: it.name, img: it.img, createdBy: "customer",
      customItinerary: it,
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: null, nights: it.nights, travelers: 2 }, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`);
  };

  const fromPrice = estimatePerPerson(dest, 7);
  const shown = showAll ? routes : routes.slice(0, 2);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.bg }}>
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0, paddingBottom: 16 }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220 }}>
        <img src={destHero(dest)} alt={dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.75) 100%)" }} />
        <button onClick={() => navigate(-1)} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={19} color="#fff" />
        </button>
        <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "7px 14px", fontSize: 12.5, fontWeight: 700, color: C.head }}>
          <Play size={13} fill={C.p600} color={C.p600} /> Watch {dest} · 90s
        </div>
        <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 14 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>{dest}</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.92)", margin: "2px 0 0", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Temples, rice fields &amp; sunset beaches</p>
        </div>
      </div>

      {/* Where will you base yourself */}
      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>Where will you base yourself?</h2>
          <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "16px" }}>Watch each region, save what you love. A base you sleep in, or a day out.</p>
        </div>
        <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
          {regions.map(r => (
            <div key={r.city} style={{ flexShrink: 0, width: 150, borderRadius: 16, overflow: "hidden", background: C.white, border: `1px solid ${isRegionSaved(r.city) ? C.p300 : C.div}` }}>
              <div style={{ position: "relative", height: 110 }}>
                <img src={r.img} alt={r.city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.12)" }} />
                <div style={{ position: "absolute", top: 8, right: 8 }}><SaveHeart saved={isRegionSaved(r.city)} onClick={() => toggleRegion(dest, r.city)} /></div>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={16} color={C.head} fill={C.head} /></div>
              </div>
              <div style={{ padding: "9px 11px 11px" }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>{r.emoji} {r.city}</p>
                <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 6px", lineHeight: "14px", height: 28, overflow: "hidden" }}>{r.blurb}</p>
                <span style={{ fontSize: 10, fontWeight: 700, color: r.dayTrip ? C.sub : C.p600, background: r.dayTrip ? C.bg : C.p100, borderRadius: 999, padding: "3px 8px" }}>{r.dayTrip ? "Day trip" : `Base · ${r.n}N`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Build your route */}
      <div style={{ padding: `0 ${PAD}px`, marginBottom: 22 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Build your route</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => setNights(n => NIGHT_CYCLE[(NIGHT_CYCLE.indexOf(n) + 1) % NIGHT_CYCLE.length] || 7)} style={{ background: C.white, border: `1px solid ${C.div}`, borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: C.head, cursor: "pointer", fontFamily: "inherit" }}>{nights} nights</button>
          <button onClick={() => setPace(p => PACE_CYCLE[(PACE_CYCLE.indexOf(p) + 1) % PACE_CYCLE.length])} style={{ background: C.white, border: `1px solid ${C.div}`, borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: C.head, cursor: "pointer", fontFamily: "inherit" }}>{pace}</button>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.sub, letterSpacing: "0.5px", margin: "0 0 9px" }}>REGIONS</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {regions.map(r => {
            const on = selected.includes(r.city);
            return (
              <button key={r.city} onClick={() => toggleSel(r.city)} style={{ background: on ? C.p600 : C.white, color: on ? "#fff" : C.head, border: `1px solid ${on ? C.p600 : C.div}`, borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{r.city}</button>
            );
          })}
        </div>
      </div>

      {/* Routes that fit you */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ padding: `0 ${PAD}px`, marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>Routes that fit you</h2>
          <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>Ranked around your {baseCount} region{baseCount === 1 ? "" : "s"}{savedSpots ? ` and ${savedSpots} saved spot${savedSpots === 1 ? "" : "s"}` : ""}.</p>
        </div>
        {shown.length === 0 ? (
          <p style={{ padding: `0 ${PAD}px`, fontSize: 13, color: C.sub }}>Pick at least one base region above to see routes.</p>
        ) : (
          <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 12 }}>
            {shown.map((r, idx) => (
              <div key={r.key + idx} style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${idx === 0 ? C.p600 : C.div}`, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: C.head, margin: 0 }}>{r.segs.map(s => s.city).slice(0, 2).join(" & ")}</h3>
                    <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>{r.nights} nights · {r.paceLabel} pace</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.p600 }}>{r.fit}% fit</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: C.div, overflow: "hidden", margin: "10px 0 12px" }}>
                  <div style={{ width: `${r.fit}%`, height: "100%", background: C.p600 }} />
                </div>
                {r.segs.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: i < r.segs.length - 1 || r.dayTrips.length ? `1px solid ${C.div}` : "none" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.head }}>{s.city}</span>
                    <span style={{ fontSize: 12.5, color: C.sub }}>{s.n} night{s.n === 1 ? "" : "s"}</span>
                  </div>
                ))}
                {r.dayTrips.map((c, i) => (
                  <div key={`d${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: C.head }}>{c}</span>
                    <span style={{ fontSize: 12.5, color: C.sub }}>day trip</span>
                  </div>
                ))}
                <button onClick={() => customise(r)} style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: idx === 0 ? C.p600 : C.white, color: idx === 0 ? "#fff" : C.head, border: `1.5px solid ${idx === 0 ? C.p600 : C.div}`, borderRadius: 12, padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {idx === 0 && <Sparkles size={16} />} Customise this route for me
                </button>
              </div>
            ))}
            {routes.length > 2 && (
              <button onClick={() => setShowAll(v => !v)} style={{ background: C.white, border: `1px solid ${C.div}`, borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, color: C.head, cursor: "pointer", fontFamily: "inherit" }}>
                {showAll ? "Show fewer" : `Show ${routes.length - 2} more routes`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Things you'll remember */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: `0 ${PAD}px`, marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>Things you'll remember</h2>
            <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0" }}>Tap to watch. Save what you love.</p>
          </div>
        </div>
        <div className="hs" style={{ gap: 11, paddingLeft: PAD, paddingRight: PAD }}>
          {activities.map(a => (
            <div key={a.id} style={{ flexShrink: 0, width: 132 }}>
              <div style={{ position: "relative", height: 168, borderRadius: 14, overflow: "hidden" }}>
                <img src={a.img} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)" }} />
                <div style={{ position: "absolute", top: 8, right: 8 }}><SaveHeart saved={isActivitySaved(a.id)} onClick={() => toggleActivity(dest, a.id)} /></div>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={15} color={C.head} fill={C.head} /></div>
                <div style={{ position: "absolute", left: 9, right: 9, bottom: 9 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, lineHeight: "15px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{a.name}</p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", margin: "1px 0 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{a.city} · {a.dur}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No asterisks */}
      <div style={{ padding: `0 ${PAD}px` }}>
        <div style={{ background: C.p100, borderRadius: 14, padding: "16px 16px 14px" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: C.head, margin: "0 0 10px" }}>No asterisks. Ever.</p>
          {["Real prices, taxes and fees in, upfront.", "Transfer times shown, not hidden in fine print.", "A day trip is never sold to you as a stay."].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
              <Check size={15} color="#2E7D52" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: C.head, lineHeight: "17px" }}>{t}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: C.sub, margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${C.p300}` }}>4.8 · planned with 2,300+ couples</p>
        </div>
      </div>

      </div>{/* end scroll area */}

      {/* Fixed bottom bar */}
      <div style={{ flexShrink: 0, background: C.white, borderTop: `1px solid ${C.div}`, padding: `12px ${PAD}px`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)" }}>
        <div>
          <p style={{ fontSize: 10.5, color: C.sub, margin: 0 }}>From</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: C.head, margin: 0 }}>₹{formatINR(fromPrice)} <span style={{ fontSize: 11, fontWeight: 500, color: C.inact }}>/ person</span></p>
        </div>
        <Link to={`/wf/${encodeURIComponent(dest)}/wishlist`} style={{ flex: 1, maxWidth: 210, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.p600, color: "#fff", borderRadius: 13, padding: "14px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Plan my {dest} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
