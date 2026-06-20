import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import {
  ArrowLeft, Check, Plus, Minus, X as XIcon, ChevronDown, ChevronRight,
  Sparkles, Play, GripVertical, Map as MapIcon,
} from "lucide-react";
import { C, customerPhotos, allItineraries } from "../data";
import {
  BUILD_DESTS, destMeta, destAreas, MONTHS, monthRating,
  areaImg, destHero, topActivities, recommendedRoute, routeNights,
  activityPool, estimatePerPerson, formatINR, synthesizeItinerary,
  destCaption, destSocial, visaShort, cityCoords, flatActivities,
} from "../data/buildData";
import { useDeals } from "../data/deals";

// Steps: 0 Destination · 1 Party · 2 When · 3 Route · 4 Activities
const STEP_LABELS = ["Where", "Who", "When", "Cities", "Plan"];
const CROWD_COLOR = { Low: C.sText, Mixed: C.wText, High: C.dText };
// User-facing: collapse crowd levels into a friendlier Popular / Offbeat label.
const CROWD_LABEL = { Low: "Offbeat", Mixed: "Popular", High: "Popular" };
const LABEL_COLOR = { Offbeat: C.sText, Popular: C.wText };
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Reconstruct the picked activities ({ city: [names] }) from an already-built
// itinerary, so a travellers/dates edit re-synthesises with the same day plans.
function picksFromBuilt(built) {
  const map = {};
  (built?.days || []).forEach((d) => {
    if (!d.city || !d.sub) return;
    (map[d.city] ||= []).push(...d.sub.split(" · "));
  });
  Object.keys(map).forEach((c) => { map[c] = [...new Set(map[c])]; });
  return map;
}

const paxToParty = (n) => {
  const t = Math.max(1, n || 2);
  return { couples: Math.floor(t / 2), adults: t % 2, kids: 0 };
};

// ─── Curated route recommendations (the route step is select-only) ───
const CROWD_RANK = { Low: 0, Mixed: 1, High: 2 };

// Greedy-fill an ordered area list to exactly `nights` (leftover lands on the last stop).
function buildRouteFromAreas(areas, nights) {
  const route = [];
  let rem = nights;
  for (const a of areas) {
    if (rem <= 0) break;
    const n = Math.min(a.n, rem);
    if (n > 0) { route.push({ city: a.city, n }); rem -= n; }
  }
  if (!route.length && areas[0]) route.push({ city: areas[0].city, n: nights });
  if (rem > 0 && route.length) route[route.length - 1].n += rem;
  return route;
}

// A handful of distinct curated routes for the chosen nights, from different angles.
function routeVariants(dest, nights) {
  const areas = destAreas[dest] || [];
  if (!areas.length || !nights) return [];
  const orderings = [
    areas,                                                                   // classic / recommended
    [...areas].sort((a, b) => CROWD_RANK[a.crowd] - CROWD_RANK[b.crowd]),     // calm-first
    [...areas].sort((a, b) => CROWD_RANK[b.crowd] - CROWD_RANK[a.crowd]),     // buzzy-first
    areas.slice(1).concat(areas[0]),                                         // alternate lead
    [...areas].reverse(),                                                     // flipped
  ];
  const seen = new Set(); const out = [];
  for (const ord of orderings) {
    const r = buildRouteFromAreas(ord, nights);
    const sig = r.map(s => `${s.city}${s.n}`).join("|");
    if (!r.length || seen.has(sig)) continue;
    seen.add(sig); out.push(r);
    if (out.length >= 6) break;
  }
  return out;
}

// A short vibe tag derived from the route's crowd mix.
function routeVibe(route, dest, isFirst) {
  if (isFirst) return "Most loved";
  const areas = destAreas[dest] || [];
  const crowds = route.map(s => (areas.find(a => a.city === s.city) || {}).crowd);
  const low = crowds.filter(c => c === "Low").length;
  const high = crowds.filter(c => c === "High").length;
  if (low > high && low * 2 >= crowds.length) return "Calm & offbeat";
  if (high * 2 >= crowds.length) return "Buzzy & lively";
  return "Balanced mix";
}

// Edit mode for a curated (non-built) plan: seed the wizard from the deal's
// itinerary + the version's travel dates so dates/travellers/route are editable.
function seedFromCurated(deal, version) {
  if (!deal) return null;
  const it = allItineraries.find((i) => i.id === (version?.itineraryId ?? deal.itineraryId));
  if (!it) return null;
  const td = version?.customizations?.travelDates || {};
  const route = (it.route?.length ? it.route : (it.days || []).map((d) => ({ city: d.city, n: d.n })))
    .map((r) => ({ city: r.city, n: r.n }));
  return {
    id: it.id,
    custom: false, // not a wizard-built itinerary — a save will mint a fresh id
    dest: it.dest || deal.dest,
    route,
    nights: td.nights ?? it.nights ?? routeNights(route),
    startDate: td.fromDate || null,
    partySize: paxToParty(td.travelers ?? it.travellers ?? 2),
    _vibes: [],
    days: it.days || [],
  };
}

export default function Build() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dealsCtx = useDeals();

  // Edit mode: re-enter the builder on ONE screen (travellers / dates / cities)
  // for an existing deal, change it, and save it as a new version. `editRoute=1`
  // is kept as a legacy alias for `edit=route`.
  const editDealId = params.get("dealId");
  const editVersionId = params.get("versionId");
  const editTarget = params.get("editRoute") === "1" ? "route" : params.get("edit"); // travellers | dates | route
  const editRoute = editTarget === "route";
  const editMode = !!editTarget && !!editDealId && !!editVersionId;
  const editingVersion = editMode ? dealsCtx.getVersion(editDealId, editVersionId) : null;
  const editDeal = editMode ? dealsCtx.getDeal(editDealId) : null;
  const editBuilt = editMode
    ? (editingVersion?.customizations?.builtItinerary
        || editDeal?.customItinerary
        || seedFromCurated(editDeal, editingVersion))
    : null;
  const editStep = { travellers: 1, dates: 2, route: 3 }[editTarget] ?? 0;

  const [step, setStep] = useState(editMode ? editStep : 0);
  const [dest, setDest] = useState(editBuilt?.dest || null);
  const [party, setParty] = useState(editBuilt?.partySize
    ? { ...editBuilt.partySize }
    : { couples: 1, adults: 0, kids: 0 });
  const [vibes, setVibes] = useState(editBuilt?._vibes || []);
  const [startDate, setStartDate] = useState(editBuilt?.startDate || null);
  const [nights, setNights] = useState(editBuilt?.nights || null);
  const [route, setRoute] = useState(editBuilt?.route || null);
  const [picks, setPicks] = useState(() => new Set());
  const [detailDest, setDetailDest] = useState(null); // full-screen destination view
  const [confirmEdit, setConfirmEdit] = useState(false); // edit-fork confirm (travellers/dates/route)
  const [building, setBuilding] = useState(false);

  const travellers = party.couples * 2 + party.adults + party.kids;
  const targetNights = nights || (dest ? destMeta[dest]?.defaultNights : 7);

  // When the route step is first reached, seed the recommended route.
  useEffect(() => {
    if (step === 3 && dest && targetNights && !route) {
      setRoute(recommendedRoute(dest, targetNights));
    }
  }, [step, dest, targetNights, route]);

  const runningTotal = dest && targetNights
    ? estimatePerPerson(dest, route ? routeNights(route) : targetNights) * travellers
    : null;

  // ─── navigation ───
  const goBack = () => {
    if (step === 0 || editMode) { navigate(-1); return; }
    setStep(s => Math.max(0, s - 1));
  };
  const goNext = () => setStep(s => s + 1);

  const chooseDest = (d) => {
    setDest(d);
    setNights(destMeta[d]?.defaultNights || 7);
    setRoute(null); setPicks(new Set()); setVibes([]);
    setDetailDest(null);
    setStep(1);
  };

  // ─── activities → build ───
  const picksByCity = useMemo(() => {
    const map = {};
    if (!route) return map;
    activityPool(dest, route, vibes).forEach(g => {
      map[g.city] = g.activities.filter(a => picks.has(a.id)).map(a => a.name);
    });
    return map;
  }, [route, vibes, picks]);

  const doBuild = () => {
    setBuilding(true);
    setTimeout(() => {
      const it = synthesizeItinerary({
        dest, nights: routeNights(route), route, picksByCity, vibes, startDate, party,
      });
      it._vibes = vibes; // keep for potential re-entry
      const { dealId, versionId } = dealsCtx.createDeal({
        itineraryId: it.id,
        dest: it.dest,
        title: route.map(r => r.city).join(" · "),
        img: it.img,
        createdBy: "customer",
        customItinerary: it,
        customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: startDate, nights: it.nights, travelers: travellers }, builtItinerary: it },
        indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
      });
      // Skip the reveal: drop straight onto the itinerary screen. Replace so
      // Back from the itinerary doesn't return into the half-built wizard.
      navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`, { replace: true });
    }, 1400);
  };

  // ─── edit confirm (travellers / dates / route) → fork a new version ───
  // Changing the route (or the trip length on the dates screen) is structural:
  // it re-synthesises the itinerary and resets day/hotel swaps. A travellers- or
  // dates-only change keeps the existing day plans and hotels.
  const applyEdit = () => {
    const nightsChanged = editTarget === "dates" && nights && routeNights(route) !== nights;
    const effRoute = nightsChanged ? recommendedRoute(dest, nights) : route;
    const structural = editTarget === "route" || nightsChanged;
    const it = synthesizeItinerary({
      dest, nights: routeNights(effRoute), route: effRoute,
      picksByCity: structural ? {} : picksFromBuilt(editBuilt),
      vibes, startDate, party,
      // Reuse a built trip's id; a curated edit mints a fresh (high) id so it
      // doesn't collide with the seed itinerary it forked from.
      id: editBuilt.custom ? editBuilt.id : undefined,
    });
    it._vibes = vibes;
    const { versionId: newVer } = dealsCtx.forkVersion(editDealId, editVersionId);
    const prev = editingVersion?.customizations || {};
    dealsCtx.updateDraft(editDealId, newVer, {
      customizations: {
        selectedDayOptions: structural ? {} : (prev.selectedDayOptions || {}),
        selectedHotels: structural ? {} : (prev.selectedHotels || {}),
        travelDates: { fromDate: startDate, nights: it.nights, travelers: travellers },
        builtItinerary: it,
      },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    dealsCtx.setCustomItinerary(editDealId, it);
    // Replace the editor entry so Back lands on the itinerary, not the wizard.
    navigate(`/itinerary/${it.id}?dealId=${editDealId}&versionId=${newVer}`, { replace: true });
  };

  // Route step is select-only and gated: too few / too many nights block continue
  // (the screen guides the user to fix nights or talk to the team instead).
  const routeMinN = destMeta[dest]?.minNights || 4;
  const ROUTE_LONG = 14;
  const routeStepOk = !!route?.length && targetNights >= routeMinN && targetNights <= ROUTE_LONG;

  // ─── primary CTA per step ───
  const ctaFor = () => {
    // Single-screen edit: the CTA on the active step saves a new version.
    if (editMode) {
      const enabled = step === 1 ? party.kids === 0 : step === 2 ? (!!startDate && !!nights) : step === 3 ? routeStepOk : true;
      return { label: "Save changes", onClick: () => setConfirmEdit(true), enabled };
    }
    switch (step) {
      case 1: return { label: "Continue", onClick: goNext, enabled: party.kids === 0 };
      case 2: return { label: "Continue", onClick: goNext, enabled: !!startDate && !!nights };
      case 3: return { label: "Looks good, continue", onClick: goNext, enabled: routeStepOk };
      case 4: return picks.size > 0
        ? { label: "Create my itinerary ✦", onClick: doBuild, enabled: true }
        : { label: "Skip & build my trip", onClick: doBuild, enabled: true };
      default: return null;
    }
  };
  const cta = ctaFor();

  if (building) return <Building dest={dest} />;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.white }}>
      {/* Header: back + segmented progress + running total */}
      <div style={{ flexShrink: 0, padding: "12px 14px 10px", borderBottom: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={goBack} aria-label="Back" style={iconBtn}>
            <ArrowLeft size={20} color={C.head} />
          </button>
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {STEP_LABELS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? C.p600 : C.div, transition: "background .2s" }} />
            ))}
          </div>
          {runningTotal != null && step >= 2 && step !== 3 ? (
            <div style={{ textAlign: "right", minWidth: 78 }}>
              <p style={{ margin: 0, fontSize: 9, color: C.inact, fontWeight: 600, letterSpacing: ".3px" }}>EST. TOTAL</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.head }}>₹{runningTotal.toLocaleString("en-IN")}</p>
            </div>
          ) : <div style={{ width: 38 }} />}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {step === 0 && <StepDestination onOpen={setDetailDest} />}
        {step === 1 && <StepParty party={party} setParty={setParty} onContinue={goNext} />}
        {step === 2 && <StepDates dest={dest} startDate={startDate} setStartDate={setStartDate} nights={nights} setNights={setNights} />}
        {step === 3 && route && (
          <StepRoute dest={dest} nights={targetNights} route={route} setRoute={setRoute} setNights={setNights} editRoute={editRoute} />
        )}
        {step === 4 && route && <StepActivities dest={dest} route={route} vibes={vibes} picks={picks} setPicks={setPicks} />}
      </div>

      {/* Footer CTA */}
      {cta && (
        <div style={{ flexShrink: 0, padding: "12px 16px calc(12px + env(safe-area-inset-bottom))", borderTop: `1px solid ${C.div}`, background: C.white }}>
          <button
            onClick={cta.enabled ? cta.onClick : undefined}
            disabled={!cta.enabled}
            style={{ ...primaryBtn, opacity: cta.enabled ? 1 : 0.4 }}
          >
            {cta.label}
          </button>
        </div>
      )}

      {/* Full-screen destination view */}
      {detailDest && (
        <DestinationDetail dest={detailDest} onClose={() => setDetailDest(null)} onChoose={chooseDest} />
      )}

      {/* Edit fork confirm (travellers / dates / cities) */}
      {confirmEdit && (
        <ConfirmEdit target={editTarget} onCancel={() => setConfirmEdit(false)} onConfirm={applyEdit} />
      )}
    </div>
  );
}

// ════════════════════ Step 0: Destination ════════════════════
// A compact grid of portrait cards (4+ visible, scroll for more). Each signals a
// video and shows a one-line visa. Tapping opens a full-screen view.
function StepDestination({ onOpen }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 16px 10px" }}>
        <h1 style={titleStyle}>Where to?</h1>
        <p style={subStyle}>Tap a place to explore, then choose.</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {BUILD_DESTS.map((d) => {
            const soc = destSocial[d] || {};
            return (
              <button key={d} onClick={() => onOpen(d)} style={{
                position: "relative", aspectRatio: "3 / 4", borderRadius: 18, overflow: "hidden",
                padding: 0, border: "none", cursor: "pointer", background: C.div, textAlign: "left",
              }}>
                <img src={destHero(d)} alt={d} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 52%)" }} />
                {soc.trending && (
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(255,255,255,0.92)", color: C.sText, fontSize: 9.5, fontWeight: 800, padding: "3px 7px", borderRadius: 20, letterSpacing: ".3px" }}>🔥 TRENDING</span>
                )}
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", border: "1.5px solid rgba(255,255,255,0.7)" }}>
                  <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                </span>
                <div style={{ position: "absolute", left: 11, right: 11, bottom: 11 }}>
                  <p style={{ margin: 0, color: "#fff", fontSize: 17, fontWeight: 800, letterSpacing: "-0.2px" }}>{d}</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.88)", fontSize: 11, fontWeight: 600 }}>🛂 {visaShort(d)}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ textAlign: "center", color: C.inact, fontSize: 12.5, fontWeight: 600, margin: "20px 0 4px" }}>
          That's all for now ✈️ more dreamy destinations landing soon.
        </p>
      </div>
    </div>
  );
}

// Full-screen destination view: immersive media with content overlaid (no
// opaque panel over the video) and an explicit Select.
function DestinationDetail({ dest, onClose, onChoose }) {
  const meta = destMeta[dest];
  const nightsRange = `${meta.minNights}–${meta.minNights + 4}`;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "#000" }}>
      <img src={destHero(dest)} alt={dest} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.45) 100%)" }} />
      {/* close */}
      <button onClick={onClose} style={{ position: "absolute", top: 14, left: 14, ...iconBtn, background: "rgba(0,0,0,0.4)" }} aria-label="Close"><XIcon size={20} color="#fff" /></button>
      {/* centre play affordance */}
      <div style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)", border: "1.5px solid rgba(255,255,255,0.65)", display: "grid", placeItems: "center" }}>
        <Play size={24} color="#fff" fill="#fff" />
      </div>
      {/* content overlaid on media */}
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 20, color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.4px", fontFamily: "Georgia, 'Times New Roman', serif" }}>{dest}</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.45, color: "rgba(255,255,255,0.92)" }}>{destCaption[dest]}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0 0" }}>
          <GlassChip>🛂 {visaShort(dest)}</GlassChip>
          <GlassChip>🌙 {nightsRange} nights</GlassChip>
        </div>
        <button onClick={() => onChoose(dest)} style={{ ...primaryBtn, marginTop: 16 }}>Select {dest}</button>
      </div>
    </div>
  );
}

const GlassChip = ({ children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 11px", borderRadius: 20 }}>{children}</span>
);


// ════════════════════ Step 1: Party ════════════════════
// Card-based. Couple and two-couples need no extra input (tap advances). A
// bigger group reveals traveller + kids steppers inline.
function StepParty({ party, setParty, onContinue }) {
  const isGroup = party.couples === 0 && party.kids === 0;
  // Selecting "couple with kids" doesn't advance — we surface the couples-only
  // note and disable Continue (kids>0 is the not-catered signal Build reads).
  const kidsBlocked = party.kids > 0;
  const cards = [
    { key: "couple", emoji: "💑", label: "Just us two", sub: "2 adults", on: party.couples === 1 && !kidsBlocked },
    { key: "two", emoji: "👯", label: "Two couples", sub: "4 adults", on: party.couples === 2 && !kidsBlocked },
    { key: "kids", emoji: "👨‍👩‍👧", label: "Couple with kids", sub: "Adults + little ones", on: kidsBlocked },
    { key: "group", emoji: "🎉", label: "A bigger group", sub: "4+ adults", on: isGroup && !kidsBlocked },
  ];
  const pick = (key) => {
    if (key === "kids") { setParty({ couples: 1, adults: 0, kids: 1 }); return; } // not catered → blocks Continue
    if (key === "couple") { setParty({ couples: 1, adults: 0, kids: 0 }); onContinue(); }
    else if (key === "two") { setParty({ couples: 2, adults: 0, kids: 0 }); onContinue(); }
    else setParty({ couples: 0, adults: 6, kids: 0 }); // reveal steppers, stay on screen
  };
  const setAdults = (v) => setParty(p => ({ ...p, adults: Math.max(3, v) }));
  return (
    <div style={{ padding: "18px 16px 24px" }}>
      <h1 style={titleStyle}>Who's travelling?</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {cards.map(c => (
          <div key={c.key}>
            <button onClick={() => pick(c.key)} style={{
              display: "flex", alignItems: "center", gap: 13, padding: "16px", borderRadius: 14, width: "100%",
              border: c.on ? `2px solid ${C.p600}` : `1px solid ${C.div}`, background: c.on ? C.p100 : C.white, cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 26 }}>{c.emoji}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: c.on ? C.p600 : C.head }}>{c.label}</span>
                <span style={{ display: "block", fontSize: 12, color: C.sub, marginTop: 1 }}>{c.sub}</span>
              </span>
              {c.on && <Check size={20} color={C.p600} strokeWidth={2.5} />}
            </button>
            {c.key === "group" && isGroup && !kidsBlocked && (
              <div style={{ marginTop: 10, border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", animation: "fadeUp 0.2s ease-out" }}>
                <Stepper label="Travellers" value={party.adults} onChange={setAdults} min={3} />
              </div>
            )}
          </div>
        ))}
      </div>
      {kidsBlocked && (
        <div style={{ marginTop: 14, padding: 16, borderRadius: 14, background: "linear-gradient(135deg, #FFF5F0 0%, #FFE4E8 100%)", border: "1px solid rgba(254,163,180,0.27)", animation: "fadeUp 0.3s ease-out" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#89123E", margin: "0 0 4px" }}>We're so sorry! 😔</p>
          <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "18px" }}>
            Right now, 30 Sundays is exclusively crafted for couples, romantic getaways, sunset dinners for two, that kind of magic. We don't have kids' itineraries yet, but we're working on it!
          </p>
          <p style={{ fontSize: 13, color: C.p600, fontWeight: 600, margin: "8px 0 0" }}>For now, maybe plan a couples-only escape? You deserve it. 💕</p>
        </div>
      )}
    </div>
  );
}

function Stepper({ label, value, onChange, min = 0, last }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: last ? "none" : `1px solid ${C.div}` }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => onChange(value - 1)} disabled={value <= min} style={{ ...roundBtn, opacity: value <= min ? 0.3 : 1 }} aria-label={`Less ${label}`}><Minus size={16} color={C.head} /></button>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.head, minWidth: 18, textAlign: "center" }}>{value}</span>
        <button onClick={() => onChange(value + 1)} style={roundBtn} aria-label={`More ${label}`}><Plus size={16} color={C.head} /></button>
      </div>
    </div>
  );
}

// ════════════════════ Step 2: When & how long ════════════════════
const SEASON_LABEL = { peak: "Peak season", shoulder: "Shoulder", off: "Off-season" };
const SEASON_COLOR = { peak: C.sText, shoulder: C.wText, off: C.dText };

function StepDates({ dest, startDate, setStartDate, nights, setNights }) {
  const today = new Date();
  const monthsList = useMemo(() => {
    const out = [];
    for (let i = 0; i < 10; i++) {
      const m = (today.getMonth() + i) % 12;
      const y = today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
      out.push({ m, y });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sel = startDate ? new Date(startDate) : null;
  const [openMonth, setOpenMonth] = useState(() => sel ? { m: sel.getMonth(), y: sel.getFullYear() } : monthsList[1]);

  const minN = destMeta[dest]?.minNights || 3;
  const DAY_MS = 86400000;
  const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // End is derived: a complete range means we have both a start and a nights count.
  const hasRange = !!startDate && !!nights;
  const endD = hasRange ? new Date(midnight(sel).getTime() + nights * DAY_MS) : null;

  const pickDay = (day) => {
    const d = new Date(openMonth.y, openMonth.m, day);
    // Fresh start when nothing picked yet, or when a full range already exists.
    if (!startDate || hasRange) {
      setStartDate(d.toISOString());
      setNights(null);
      return;
    }
    // Second tap: anything on/before the start just resets the start.
    if (d <= midnight(sel)) {
      setStartDate(d.toISOString());
      setNights(null);
      return;
    }
    setNights(Math.round((midnight(d) - midnight(sel)) / DAY_MS));
  };

  const ndays = DAYS_IN_MONTH[openMonth.m] + (openMonth.m === 1 && openMonth.y % 4 === 0 ? 1 : 0);
  const isPast = (day) => new Date(openMonth.y, openMonth.m, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDow = new Date(openMonth.y, openMonth.m, 1).getDay(); // 0=Sun, for calendar alignment
  const shortDate = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div style={{ padding: "18px 16px 24px" }}>
      <h1 style={titleStyle}>When & how long?</h1>
      <p style={subStyle}>We'll show you the best months for {dest}.</p>

      {/* month strip - season label sits on each chip */}
      <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "16px -16px 0", padding: "0 16px 4px" }}>
        {monthsList.map(({ m, y }) => {
          const r = monthRating(dest, m);
          const on = openMonth.m === m && openMonth.y === y;
          return (
            <button key={`${m}-${y}`} onClick={() => setOpenMonth({ m, y })} style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: 12, cursor: "pointer", textAlign: "center",
              border: on ? `2px solid ${C.p600}` : `1px solid ${C.div}`, background: on ? C.p100 : C.white,
            }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: on ? C.p600 : C.head }}>{MONTHS[m]}</span>
              <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, color: SEASON_COLOR[r], marginTop: 2 }}>{SEASON_LABEL[r]}</span>
            </button>
          );
        })}
      </div>

      {/* day grid — tap a start date, then an end date */}
      <p style={{ margin: "18px 0 8px", fontSize: 13, fontWeight: 700, color: C.head }}>
        {!startDate ? "Pick your start date" : !hasRange ? "Now pick your end date" : "Your travel dates"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.inact }}>{d}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: ndays }, (_, i) => i + 1).map(day => {
          const past = isPast(day);
          const d = new Date(openMonth.y, openMonth.m, day);
          const isStart = sel && d.getTime() === midnight(sel).getTime();
          const isEnd = endD && d.getTime() === midnight(endD).getTime();
          const inRange = sel && endD && d > midnight(sel) && d < midnight(endD);
          const cap = isStart || isEnd;
          return (
            <button key={day} disabled={past} onClick={() => pickDay(day)} style={{
              aspectRatio: "1", borderRadius: 10, border: "none", cursor: past ? "default" : "pointer",
              background: cap ? C.p600 : inRange ? C.p100 : past ? "transparent" : C.bg,
              color: cap ? "#fff" : inRange ? C.p600 : past ? C.icon : C.head,
              fontSize: 13, fontWeight: cap ? 800 : inRange ? 700 : 600, opacity: past ? 0.4 : 1,
            }}>{day}</button>
          );
        })}
      </div>

      {/* range summary */}
      <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 14, background: C.bg, border: `1px solid ${C.div}` }}>
        {hasRange ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{shortDate(sel)} – {shortDate(endD)}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.p600 }}>{nights} nights</span>
          </div>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>
            {startDate ? `Starts ${shortDate(sel)} · tap your return day` : "Tap a date to begin"}
          </span>
        )}
      </div>
      <p style={{ margin: "10px 2px 0", fontSize: 12, color: hasRange && nights < minN ? C.p600 : C.sub }}>
        💡 We recommend at least {minN} nights for {dest}.
        {hasRange && nights < minN && " Consider a few more to enjoy it fully."}
      </p>
    </div>
  );
}

// ════════════════════ Step 3: Route ════════════════════
// Select-only: get to know the regions (intro videos), then pick one of our
// curated routes for the chosen nights. No manual route editing here. Too few
// nights → nudge to add some; too many → hand off to the team.
function StepRoute({ dest, nights, route, setRoute, setNights, editRoute }) {
  const meta = destMeta[dest] || {};
  const minN = meta.minNights || 4;
  const LONG = 14;
  const n = nights || routeNights(route) || meta.defaultNights || 7;
  const areas = destAreas[dest] || [];

  const [cityView, setCityView] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCities, setFilterCities] = useState([]);
  const [leadSent, setLeadSent] = useState(false);

  const tooShort = n < minN;
  const tooLong = n > LONG;

  // Sticky "your route" summary: pinned above Continue, but gives way once the
  // routes section itself scrolls into view (no duplicate of the same info).
  const routesRef = useRef(null);
  const [routesInView, setRoutesInView] = useState(false);
  useEffect(() => {
    const el = routesRef.current;
    if (!el || tooShort || tooLong) { setRoutesInView(false); return; }
    const io = new IntersectionObserver(([e]) => setRoutesInView(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [tooShort, tooLong, dest, n]);
  const totalN = route.reduce((s, x) => s + x.n, 0);

  const variants = useMemo(() => routeVariants(dest, n), [dest, n]);
  const filtered = filterCities.length
    ? variants.filter(r => r.some(s => filterCities.includes(s.city)))
    : variants;
  const shownRoutes = showAllRoutes ? filtered : filtered.slice(0, 4);

  const sigOf = (r) => r.map(s => `${s.city}${s.n}`).join("|");
  const selectedSig = sigOf(route);
  const shownCities = showAllCities ? areas : areas.slice(0, 6);

  const bumpNights = (d) => {
    const nn = Math.max(1, n + d);
    setNights?.(nn);
    setRoute(recommendedRoute(dest, nn));
  };
  const toggleFilterCity = (city) =>
    setFilterCities(f => (f.includes(city) ? f.filter(c => c !== city) : [...f, city]));

  const crowdChip = (crowd, light) => {
    const label = CROWD_LABEL[crowd] || "Popular";
    const col = LABEL_COLOR[label];
    return <span style={{ fontSize: 10, fontWeight: 700, color: light ? "#fff" : col, background: light ? "rgba(255,255,255,0.22)" : `${col}14`, padding: "2px 7px", borderRadius: 6 }}>{label}</span>;
  };

  const sectionHead = { margin: "26px 0 12px", fontSize: 13, fontWeight: 800, color: C.head, letterSpacing: "-0.2px" };

  return (
    <div style={{ padding: "18px 16px 24px" }}>
      {/* Header + a quiet map pill (top-right) */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={titleStyle}>{editRoute ? "Change your route" : `Your ${dest} trip`}</h1>
          <p style={{ ...subStyle, marginTop: 4 }}>Explore the regions, then pick a route.</p>
        </div>
        <button onClick={() => setMapOpen(true)} aria-label="Open map" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, background: C.white, border: `1px solid ${C.div}`, color: C.head, fontSize: 12.5, fontWeight: 600, padding: "7px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
          <MapIcon size={14} color={C.p600} /> Map
        </button>
      </div>

      {/* ── Section 1: get to know the regions (intro videos) ── */}
      <p style={sectionHead}>Get to know the regions</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {shownCities.map((a, i) => (
          <button key={a.city} onClick={() => setCityView(a.city)} style={{ padding: 0, border: "none", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: C.div }}>
              <img src={areaImg(dest, a.city, i)} alt={a.city} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,0.78))" }} />
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", border: "1.5px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center" }}>
                <Play size={15} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
              </span>
              <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>{a.city}</span>
                {crowdChip(a.crowd, true)}
              </div>
            </div>
            <p style={{ margin: "7px 2px 0", fontSize: 12, color: C.sub, lineHeight: 1.4 }}>{a.blurb}</p>
          </button>
        ))}
      </div>
      {areas.length > 6 && !showAllCities && (
        <button onClick={() => setShowAllCities(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%", marginTop: 14, padding: "12px", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, fontSize: 13.5, fontWeight: 700, color: C.head, cursor: "pointer", fontFamily: "inherit" }}>
          Show more regions <ChevronDown size={15} color={C.sub} />
        </button>
      )}

      {/* ── Section 2: curated routes (or an edge-case nudge) ── */}
      <div ref={routesRef}>
      <p style={sectionHead}>Routes we recommend</p>

      {tooShort ? (
        <div style={{ padding: 16, borderRadius: 14, background: C.p100, border: `1px solid ${C.p300}` }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{dest} shines with at least {minN} nights</p>
          <p style={{ margin: "6px 0 14px", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>You've picked {n} night{n > 1 ? "s" : ""}. Add a couple more and we'll unlock routes that do {dest} justice.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, borderRadius: 12, padding: "8px 12px" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.head }}>{n} night{n > 1 ? "s" : ""}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => bumpNights(-1)} disabled={n <= 1} style={{ ...roundBtn, opacity: n <= 1 ? 0.3 : 1 }} aria-label="Fewer nights"><Minus size={16} color={C.head} /></button>
              <button onClick={() => bumpNights(1)} style={{ ...roundBtn, border: "none", background: C.p600 }} aria-label="More nights"><Plus size={16} color="#fff" /></button>
            </div>
          </div>
        </div>
      ) : tooLong ? (
        leadSent ? (
          <div style={{ padding: 16, borderRadius: 14, background: C.sBg || "#ECFDF3", border: `1px solid ${C.sBorder || "#C0E5D5"}` }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>Thanks, you're in good hands ✨</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Our trip designers will reach out within 24 hours to craft your {n}-night {dest} journey.</p>
          </div>
        ) : (
          <div style={{ padding: 16, borderRadius: 14, background: C.p100, border: `1px solid ${C.p300}` }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>A {n}-night trip deserves a personal touch</p>
            <p style={{ margin: "6px 0 14px", fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Longer journeys are hand-crafted by our team. Share your trip and we'll design the perfect route for you.</p>
            <button onClick={() => setLeadSent(true)} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: C.p600, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Request a custom plan
            </button>
          </div>
        )
      ) : (
        <>
          {/* Quiet filter */}
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setShowFilter(f => !f)} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 0, border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: C.sub }}>
              Filter by city{filterCities.length ? ` · ${filterCities.length}` : ""} <ChevronDown size={14} color={C.sub} style={{ transform: showFilter ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            {showFilter && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                {areas.map(a => {
                  const on = filterCities.includes(a.city);
                  return (
                    <button key={a.city} onClick={() => toggleFilterCity(a.city)} style={{ fontSize: 12, fontWeight: 600, padding: "6px 11px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${on ? C.p600 : C.div}`, background: on ? C.p600 : C.white, color: on ? "#fff" : C.head }}>
                      {a.city}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {shownRoutes.length === 0 ? (
            <p style={{ textAlign: "center", color: C.sub, fontSize: 13, margin: "24px 0" }}>No routes include those cities. Try fewer filters.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {shownRoutes.map((r, idx) => {
                const selected = sigOf(r) === selectedSig;
                const isFirst = idx === 0 && !showAllRoutes && filterCities.length === 0;
                const totalN = r.reduce((s, x) => s + x.n, 0);
                return (
                  <button key={sigOf(r)} onClick={() => setRoute(r)} style={{
                    textAlign: "left", padding: "12px 14px", borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
                    border: `${selected ? 2 : 1}px solid ${selected ? C.p600 : C.div}`, background: selected ? C.p100 : C.white,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ display: "flex" }}>
                          {r.slice(0, 3).map((s, k) => (
                            <img key={s.city} src={areaImg(dest, s.city, k)} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", marginLeft: k ? -8 : 0 }} />
                          ))}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.p600, background: C.p100, padding: "2px 8px", borderRadius: 6 }}>{routeVibe(r, dest, isFirst)}</span>
                      </span>
                      {selected
                        ? <Check size={18} color={C.p600} strokeWidth={2.5} />
                        : <span style={{ fontSize: 12.5, fontWeight: 700, color: C.p600 }}>Select</span>}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
                      {r.map((s, k) => (
                        <span key={s.city} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {k > 0 && <ChevronRight size={13} color={C.icon} />}
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.head }}>{s.city}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{s.n}N</span>
                        </span>
                      ))}
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: C.sub }}>{r.length} {r.length > 1 ? "cities" : "city"} · {totalN} nights</p>
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length > 4 && !showAllRoutes && (
            <button onClick={() => setShowAllRoutes(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%", marginTop: 12, padding: "12px", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, fontSize: 13.5, fontWeight: 700, color: C.head, cursor: "pointer", fontFamily: "inherit" }}>
              See more options <ChevronDown size={15} color={C.sub} />
            </button>
          )}
        </>
      )}

      </div>

      {/* Sticky selected-route summary — pinned above Continue; hides once the
          routes section is on screen. Tap to jump to the routes list. */}
      {!tooShort && !tooLong && !routesInView && (
        <div
          onClick={() => routesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          style={{ position: "sticky", bottom: 0, zIndex: 5, margin: "20px -16px -24px", padding: "10px 16px calc(10px + env(safe-area-inset-bottom))", background: C.white, borderTop: `1px solid ${C.div}`, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.inact, letterSpacing: ".3px" }}>YOUR ROUTE</p>
            <p style={{ margin: "1px 0 0", fontSize: 13, fontWeight: 700, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{route.map(s => `${s.city} ${s.n}N`).join(" · ")}</p>
          </div>
          <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 700, color: C.p600, border: `1px solid ${C.p300}`, borderRadius: 20, padding: "6px 12px" }}>
            <ChevronDown size={13} color={C.p600} /> Change
          </span>
        </div>
      )}

      {cityView && <CityDetail dest={dest} city={cityView} onClose={() => setCityView(null)} />}
      {mapOpen && <RouteMapView dest={dest} nights={n} route={route} setRoute={setRoute} onClose={() => setMapOpen(false)} />}
    </div>
  );
}

// Read-only map for the chosen route. The map frames just the selected cities;
// a bottom rail of recommended routes lets the user switch and the map re-frames
// live. No manual editing.
function RouteMapView({ dest, nights, route, setRoute, onClose }) {
  const n = nights || route.reduce((s, r) => s + r.n, 0);
  const variants = useMemo(() => routeVariants(dest, n), [dest, n]);
  const sigOf = (r) => r.map(s => `${s.city}${s.n}`).join("|");
  const selectedSig = sigOf(route);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 65, background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${C.div}` }}>
        <button onClick={onClose} style={iconBtn} aria-label="Close map"><XIcon size={20} color={C.head} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head }}>Your route</p>
          <p style={{ margin: 0, fontSize: 12, color: C.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{route.map(s => `${s.city} ${s.n}N`).join(" · ")}</p>
        </div>
        <button onClick={onClose} style={{ ...pillBtn, color: C.p600, borderColor: C.p300 }}>Done</button>
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 0, isolation: "isolate", minHeight: 0 }}>
        <LeafletRouteMap dest={dest} route={route} height="100%" interactive={false} />
      </div>

      {/* Recommended routes — tap to switch; the map re-frames live */}
      {variants.length > 0 && (
        <div style={{ flexShrink: 0, borderTop: `1px solid ${C.div}`, padding: "12px 0 calc(14px + env(safe-area-inset-bottom))", background: C.white }}>
          <p style={{ margin: "0 16px 10px", fontSize: 12, fontWeight: 800, color: C.head }}>Recommended routes</p>
          <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
            {variants.map((r, idx) => {
              const on = sigOf(r) === selectedSig;
              return (
                <button key={sigOf(r)} onClick={() => setRoute(r)} style={{
                  flexShrink: 0, width: 230, textAlign: "left", padding: "10px 12px", borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                  border: `${on ? 2 : 1}px solid ${on ? C.p600 : C.div}`, background: on ? C.p100 : C.white,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 5 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.p600, background: C.p100, padding: "2px 7px", borderRadius: 6 }}>{routeVibe(r, dest, idx === 0)}</span>
                    {on ? <Check size={15} color={C.p600} strokeWidth={2.5} /> : <span style={{ fontSize: 11.5, fontWeight: 700, color: C.p600 }}>Select</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.map(s => `${s.city} ${s.n}N`).join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Real OpenStreetMap (Leaflet) helpers ───
// Keep the Leaflet view framed to whatever cities are plottable.
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 9);
    else if (points.length > 1) map.fitBounds(points, { padding: [36, 36] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);
  return null;
}

// A numbered pink pin for selected cities, a small grey dot for the rest.
function cityPin(on, seq) {
  const html = on
    ? `<div style="width:26px;height:26px;border-radius:50%;background:${C.p600};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;font-family:inherit;">${seq + 1}</div>`
    : `<div style="width:14px;height:14px;border-radius:50%;background:#9ca3af;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>`;
  const size = on ? 26 : 14;
  return L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

// Shared Leaflet route map. interactive=false renders a static thumbnail.
function LeafletRouteMap({ dest, route, onToggle, height, interactive = true }) {
  const areas = destAreas[dest] || [];
  const selected = route.map(r => r.city);
  const allPts = areas.map(a => cityCoords[a.city]).filter(Boolean).map(c => [c.lat, c.lng]);
  const linePts = route.map(r => cityCoords[r.city]).filter(Boolean).map(c => [c.lat, c.lng]);
  // Editor frames all options; the read-only view frames just the chosen route.
  const fitPts = interactive ? allPts : (linePts.length ? linePts : allPts);
  const center = fitPts[0] || [0, 0];
  return (
    <MapContainer
      center={center} zoom={8} style={{ height, width: "100%", background: "#aadaff" }}
      scrollWheelZoom={interactive} dragging={interactive} zoomControl={interactive}
      doubleClickZoom={interactive} touchZoom={interactive} boxZoom={interactive} keyboard={interactive}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds points={fitPts} />
      {linePts.length > 1 && <Polyline positions={linePts} pathOptions={{ color: C.p600, weight: 3, dashArray: "7 6" }} />}
      {(interactive ? areas : route).map((a) => {
        const co = cityCoords[a.city]; if (!co) return null;
        const seq = selected.indexOf(a.city); const on = seq >= 0;
        return (
          <Marker
            key={a.city} position={[co.lat, co.lng]} icon={cityPin(on, seq)}
            interactive={interactive}
            eventHandlers={interactive && onToggle ? { click: () => onToggle(a) } : undefined}
          >
            <Tooltip permanent direction="top" offset={[0, on ? -14 : -8]} className="route-tip">{a.city}</Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// Full-screen, functional map editor: all the destination's cities plotted at
// their true positions on a real map. Tap a pin to add/remove; the selected ones
// show a numbered sequence and a connecting path. Sequence + nights are edited in
// the list below and reflected live on the map.
function RouteMapFull({ dest, route, setRoute, onClose }) {
  const [dragIdx, setDragIdx] = useState(null);
  const selectedSet = new Set(route.map(r => r.city));
  const totalNights = route.reduce((s, r) => s + r.n, 0);

  const setN = (i, n) => setRoute(r => r.map((s, j) => j === i ? { ...s, n: Math.max(1, n) } : s));
  const remove = (city) => setRoute(r => r.length > 1 ? r.filter(s => s.city !== city) : r);
  const toggle = (area) => {
    if (selectedSet.has(area.city)) remove(area.city);
    else setRoute(r => [...r, { city: area.city, n: area.n }]);
  };
  const reorder = (from, to) => setRoute(r => { const c = [...r]; const [m] = c.splice(from, 1); c.splice(to, 0, m); return c; });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 65, background: C.white, display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: `1px solid ${C.div}` }}>
        <button onClick={onClose} style={iconBtn} aria-label="Close map"><XIcon size={20} color={C.head} /></button>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.head }}>Plan on the map</p>
          <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{route.length} {route.length > 1 ? "cities" : "city"} · {totalNights} night{totalNights > 1 ? "s" : ""}</p>
        </div>
        <button onClick={onClose} style={{ ...pillBtn, color: C.p600, borderColor: C.p300 }}>Done</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* real OpenStreetMap canvas */}
        <div style={{ borderBottom: `1px solid ${C.div}` }}>
          <LeafletRouteMap dest={dest} route={route} onToggle={toggle} height={300} />
          <p style={{ margin: 0, padding: "10px 16px 12px", fontSize: 11.5, color: C.sub, textAlign: "center" }}>Tap a pin to add or remove a city</p>
        </div>

        {/* selected sequence — reorder + nights */}
        <div style={{ padding: "16px 16px 28px" }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.head }}>Your sequence</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {route.map((stop, i) => (
              <div
                key={stop.city + i}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { reorder(dragIdx, i); setDragIdx(i); } }}
                onDragEnd={() => setDragIdx(null)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px 10px 8px", border: `1px solid ${C.div}`, borderRadius: 14, background: C.white, opacity: dragIdx === i ? 0.45 : 1 }}
              >
                <span style={{ cursor: "grab", color: C.icon, display: "grid", placeItems: "center" }} aria-label="Drag to reorder"><GripVertical size={16} /></span>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.p600, color: "#fff", fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: C.head }}>{stop.city}</span>
                <NightsDropdown value={stop.n} onChange={(n) => setN(i, n)} />
                {route.length > 1 && (
                  <button onClick={() => remove(stop.city)} style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }} aria-label={`Remove ${stop.city}`}><XIcon size={15} color={C.icon} /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact nights picker shared by the route list and the map editor.
function NightsDropdown({ value, onChange }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Nights"
        style={{
          appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
          padding: "8px 26px 8px 11px", border: `1px solid ${C.div}`, borderRadius: 10,
          background: C.white, color: C.head, fontSize: 13, fontWeight: 800,
          fontFamily: "inherit", cursor: "pointer", lineHeight: 1,
        }}
      >
        {Array.from({ length: 10 }, (_, k) => k + 1).map(v => (
          <option key={v} value={v}>{v} night{v > 1 ? "s" : ""}</option>
        ))}
      </select>
      <ChevronDown size={14} color={C.sub} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

// Full-screen city look opened from "View details".
function CityDetail({ dest, city, onClose }) {
  const area = (destAreas[dest] || []).find(a => a.city === city) || { city, crowd: "Mixed", blurb: "" };
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "#000" }}>
      <img src={areaImg(dest, city, 0)} alt={city} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.4) 100%)" }} />
      <button onClick={onClose} style={{ position: "absolute", top: 14, left: 14, ...iconBtn, background: "rgba(0,0,0,0.4)" }} aria-label="Close"><XIcon size={20} color="#fff" /></button>
      <div style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)", border: "1.5px solid rgba(255,255,255,0.65)", display: "grid", placeItems: "center" }}>
        <Play size={24} color="#fff" fill="#fff" />
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, fontFamily: "Georgia, 'Times New Roman', serif" }}>{city}</h1>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <GlassChip>{CROWD_LABEL[area.crowd] || "Popular"}</GlassChip>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.92)" }}>{area.blurb}</p>
      </div>
    </div>
  );
}

// ════════════════════ Step 5: Activities ════════════════════
// One flat set of the best experiences across the whole trip (not per-city).
// Portrait reel cards, 2 per row; tap opens the full-screen reel. A corner tick
// toggles selection. "See more" reveals the rest; "Skip" auto-builds the best.
function StepActivities({ dest, route, vibes, picks, setPicks }) {
  const all = useMemo(() => flatActivities(dest, route, vibes), [dest, route, vibes]);
  const [showAll, setShowAll] = useState(false);
  const [reel, setReel] = useState(null);
  const toggle = (id) => setPicks(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const TOP = 8;
  const shown = showAll ? all : all.slice(0, TOP);

  return (
    <div style={{ padding: "18px 16px 24px" }}>
      <h1 style={titleStyle}>Tap what you'd love</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        {shown.map(a => (
          <ActivityCard key={a.id} a={a} on={picks.has(a.id)} onOpen={() => setReel(a)} onToggle={() => toggle(a.id)} />
        ))}
      </div>

      {!showAll && all.length > TOP && (
        <button onClick={() => setShowAll(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%", marginTop: 16,
          padding: "13px", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white,
          fontSize: 14, fontWeight: 700, color: C.head, cursor: "pointer", fontFamily: "inherit",
        }}>
          See more activities <ChevronDown size={15} color={C.sub} />
        </button>
      )}

      <p style={{ margin: "20px 8px 0", fontSize: 11, fontStyle: "italic", color: C.inact, textAlign: "center", lineHeight: 1.5 }}>
        These just help us learn your preferences. Your final itinerary may vary slightly based on what's feasible on the ground.
      </p>

      {reel && <ActivityReel a={reel} dest={dest} on={picks.has(reel.id)} onToggle={() => toggle(reel.id)} onClose={() => setReel(null)} />}
    </div>
  );
}

// Portrait reel card (mirrors the destination cards). Tap the card to watch the
// reel; tap the corner tick to add/remove.
function ActivityCard({ a, on, onOpen, onToggle }) {
  return (
    <div onClick={onOpen} style={{
      position: "relative", aspectRatio: "3 / 4", borderRadius: 18, overflow: "hidden", cursor: "pointer",
      background: C.div, boxShadow: on ? `0 0 0 3px ${C.p600}` : "none",
    }}>
      <img src={a.img} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(0,0,0,0.32)", backdropFilter: "blur(4px)", border: "1.5px solid rgba(255,255,255,0.7)", display: "grid", placeItems: "center" }}>
        <Play size={17} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label={on ? "Remove" : "Add"} style={{
        position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
        border: on ? "none" : "2px solid rgba(255,255,255,0.9)", background: on ? C.p600 : "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 0,
      }}>
        {on ? <Check size={16} color="#fff" strokeWidth={3} /> : <Plus size={16} color="#fff" strokeWidth={2.5} />}
      </button>
      <p style={{ position: "absolute", left: 11, right: 11, bottom: 11, margin: 0, color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: "-0.2px", lineHeight: 1.2 }}>{a.name}</p>
    </div>
  );
}

// Full-screen activity reel. Mirrors the itinerary's VideoViewer design: top +
// bottom gradients, kicker, name, traveller-photo social proof, caption, then
// the "Add to my trip" CTA at the bottom.
function ActivityReel({ a, dest, on, onToggle, onClose }) {
  const photos = (dest && customerPhotos[dest]) || [];
  const caption = `${a.name} in ${a.city} - a hand-picked highlight with private transfers, a local guide, and time to truly soak it in.`;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, background: "#000", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <img src={a.img} alt={a.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* top + bottom gradients (match VideoViewer) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(180deg, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0) 100%)", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 300, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", zIndex: 2 }} />

      {/* top: close */}
      <div style={{ position: "relative", zIndex: 5, padding: "16px 16px 0", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} aria-label="Close" style={{
          width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <XIcon size={16} color="#fff" />
        </button>
      </div>

      {/* bottom: kicker, name, traveller photos, caption, CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 28px", zIndex: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: 0.2, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          {a.city} · {a.vibe}
        </span>
        <p style={{ margin: "4px 0 10px", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.2, textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>{a.name}</p>

        {photos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ display: "flex", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>
              {photos.slice(0, 3).map((img, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", border: "1.5px solid #fff", marginLeft: i > 0 ? -8 : 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
              Loved by {photos.length} travellers
            </span>
          </div>
        )}

        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#F9F9FB", lineHeight: 1.4, opacity: 0.92, textShadow: "0 1px 6px rgba(0,0,0,0.5)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {caption}
        </p>

        <button onClick={onToggle} aria-label={on ? "Remove from trip" : "Add to my trip"} style={{
          ...primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: on ? "rgba(255,255,255,0.18)" : C.p600,
          border: on ? "1px solid rgba(255,255,255,0.6)" : "none",
          backdropFilter: on ? "blur(8px)" : "none",
        }}>
          {on ? <><Check size={18} color="#fff" strokeWidth={3} /> Added to your trip</> : <><Plus size={18} color="#fff" strokeWidth={2.5} /> Add to my trip</>}
        </button>
      </div>
    </div>
  );
}

// ════════════════════ Building ════════════════════
function Building({ dest }) {
  const msgs = ["Mapping your route…", "Picking your stays…", "Slotting in your experiences…", "Pricing it up…"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % msgs.length), 380); return () => clearInterval(t); }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.white, padding: 30 }}>
      <div style={{ position: "relative", width: 70, height: 70 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.p100}`, borderTopColor: C.p600, animation: "spin 0.8s linear infinite" }} />
        <Sparkles size={28} color={C.p600} style={{ position: "absolute", top: 21, left: 21 }} />
      </div>
      <p style={{ margin: "22px 0 0", fontSize: 17, fontWeight: 800, color: C.head }}>Building your {dest} trip</p>
      <p style={{ margin: "6px 0 0", fontSize: 14, color: C.sub }}>{msgs[i]}</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ConfirmEdit({ target, onCancel, onConfirm }) {
  const what = target === "dates" ? "your dates" : target === "travellers" ? "your travellers" : "your cities";
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end" }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.white, borderRadius: "20px 20px 0 0", padding: "22px 20px calc(22px + env(safe-area-inset-bottom))" }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.head }}>Save this as a new version?</h2>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
          Changing {what} creates a new version of this trip. Your current one stays saved in My Plans.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={onCancel} style={{ ...secondaryBtn, flex: 1 }}>Go back</button>
          <button onClick={onConfirm} style={{ ...primaryBtn, flex: 1 }}>Save new version</button>
        </div>
      </div>
    </div>
  );
}

// ─── shared styles ───
const titleStyle = { margin: 0, fontSize: 26, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" };
const subStyle = { margin: "8px 0 0", fontSize: 14, color: C.sub, lineHeight: 1.45 };
const iconBtn = { width: 38, height: 38, borderRadius: 12, border: "none", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 };
const roundBtn = { width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.div}`, background: C.white, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 };
const primaryBtn = { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: C.p600, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
const secondaryBtn = { padding: "15px", borderRadius: 14, border: `1px solid ${C.div}`, background: C.white, color: C.head, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
const pillBtn = { display: "inline-flex", alignItems: "center", padding: "8px 13px", borderRadius: 20, border: `1px solid ${C.div}`, background: C.white, fontSize: 13, fontWeight: 700, cursor: "pointer" };
