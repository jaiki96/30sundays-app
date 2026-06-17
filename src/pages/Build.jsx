import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Check, Plus, Minus, X as XIcon, ChevronDown, ChevronRight,
  Sparkles, Play, GripVertical, Map as MapIcon,
} from "lucide-react";
import { C, customerPhotos } from "../data";
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

export default function Build() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dealsCtx = useDeals();

  // Route-change mode: re-enter the builder on the Route step for an existing deal.
  const editDealId = params.get("dealId");
  const editVersionId = params.get("versionId");
  const editRoute = params.get("editRoute") === "1";
  const editingVersion = editRoute && editDealId && editVersionId
    ? dealsCtx.getVersion(editDealId, editVersionId) : null;
  const editBuilt = editRoute
    ? (editingVersion?.customizations?.builtItinerary || dealsCtx.getDeal(editDealId)?.customItinerary || null)
    : null;

  const [step, setStep] = useState(editRoute ? 3 : 0);
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
  const [confirmRoute, setConfirmRoute] = useState(false); // route-change fork confirm
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
    if (step === 0 || editRoute) { navigate(-1); return; }
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

  // ─── route-change confirm (edit mode) ───
  const applyRouteChange = () => {
    const it = synthesizeItinerary({
      dest, nights: routeNights(route), route, picksByCity: {}, vibes, startDate, party, id: editBuilt.id,
    });
    it._vibes = vibes;
    const { versionId: newVer } = dealsCtx.forkVersion(editDealId, editVersionId);
    dealsCtx.updateDraft(editDealId, newVer, {
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: editingVersion?.customizations?.travelDates || null, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    dealsCtx.setCustomItinerary(editDealId, it);
    // Replace the route-editor entry so Back lands on the itinerary, not the editor.
    navigate(`/itinerary/${it.id}?dealId=${editDealId}&versionId=${newVer}`, { replace: true });
  };

  // ─── primary CTA per step ───
  const ctaFor = () => {
    switch (step) {
      case 1: return { label: "Continue", onClick: goNext, enabled: true };
      case 2: return { label: "Continue", onClick: goNext, enabled: !!startDate };
      case 3: return editRoute
        ? { label: "Save new route", onClick: () => setConfirmRoute(true), enabled: !!route?.length }
        : { label: "Looks good, continue", onClick: goNext, enabled: !!route?.length };
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
          {runningTotal != null && step >= 2 ? (
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
          <StepRoute dest={dest} route={route} setRoute={setRoute} targetNights={targetNights} editRoute={editRoute} />
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

      {/* Route-change fork confirm */}
      {confirmRoute && (
        <ConfirmRoute onCancel={() => setConfirmRoute(false)} onConfirm={applyRouteChange} />
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
                <span style={{ position: "absolute", top: 8, right: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
                  <Play size={9} color="#fff" fill="#fff" /> Reel
                </span>
                <div style={{ position: "absolute", left: 11, right: 11, bottom: 11 }}>
                  <p style={{ margin: 0, color: "#fff", fontSize: 17, fontWeight: 800, letterSpacing: "-0.2px" }}>{d}</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.88)", fontSize: 11, fontWeight: 600 }}>🛂 {visaShort(d)}</p>
                </div>
              </button>
            );
          })}
        </div>
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
          <GlassChip>📅 Best {meta.peak.slice(0, 2).join(", ")}</GlassChip>
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
  const isGroup = party.couples === 0;
  const cards = [
    { key: "couple", emoji: "💑", label: "Just us two", sub: "A couple", on: party.couples === 1 },
    { key: "two", emoji: "👯", label: "Two couples", sub: "4 travellers", on: party.couples === 2 },
    { key: "group", emoji: "🎉", label: "A bigger group", sub: "Friends or family", on: isGroup },
  ];
  const pick = (key) => {
    if (key === "couple") { setParty({ couples: 1, adults: 0, kids: 0 }); onContinue(); }
    else if (key === "two") { setParty({ couples: 2, adults: 0, kids: 0 }); onContinue(); }
    else setParty({ couples: 0, adults: 6, kids: 0 }); // reveal steppers, stay on screen
  };
  const setAdults = (v) => setParty(p => ({ ...p, adults: Math.max(3, v) }));
  const setKids = (v) => setParty(p => ({ ...p, kids: Math.max(0, v) }));
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
            {c.key === "group" && isGroup && (
              <div style={{ marginTop: 10, border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", animation: "fadeUp 0.2s ease-out" }}>
                <Stepper label="Travellers" value={party.adults} onChange={setAdults} min={3} />
                <Stepper label="Kids" value={party.kids} onChange={setKids} last />
              </div>
            )}
          </div>
        ))}
      </div>
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
  const [nightsOpen, setNightsOpen] = useState(false);

  const pickDay = (day) => setStartDate(new Date(openMonth.y, openMonth.m, day).toISOString());
  const ndays = DAYS_IN_MONTH[openMonth.m] + (openMonth.m === 1 && openMonth.y % 4 === 0 ? 1 : 0);
  const isPast = (day) => new Date(openMonth.y, openMonth.m, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const minN = destMeta[dest]?.minNights || 3;
  const curNights = nights || destMeta[dest]?.defaultNights || 7;
  const nightOptions = [];
  for (let n = minN; n <= 14; n++) nightOptions.push(n);
  const firstDow = new Date(openMonth.y, openMonth.m, 1).getDay(); // 0=Sun, for calendar alignment

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

      {/* day grid */}
      <p style={{ margin: "18px 0 8px", fontSize: 13, fontWeight: 700, color: C.head }}>Pick your start date</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.inact }}>{d}</span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: ndays }, (_, i) => i + 1).map(day => {
          const past = isPast(day);
          const on = sel && sel.getDate() === day && sel.getMonth() === openMonth.m && sel.getFullYear() === openMonth.y;
          return (
            <button key={day} disabled={past} onClick={() => pickDay(day)} style={{
              aspectRatio: "1", borderRadius: 10, border: "none", cursor: past ? "default" : "pointer",
              background: on ? C.p600 : past ? "transparent" : C.bg, color: on ? "#fff" : past ? C.icon : C.head,
              fontSize: 13, fontWeight: on ? 800 : 600, opacity: past ? 0.4 : 1,
            }}>{day}</button>
          );
        })}
      </div>

      {/* nights dropdown */}
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>Number of nights</span>
        <div style={{ position: "relative" }}>
          <button onClick={() => setNightsOpen(o => !o)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 10,
            background: C.white, border: `1.5px solid ${C.div}`, cursor: "pointer", fontFamily: "inherit", minWidth: 104, justifyContent: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.head }}>{curNights} nights</span>
            <ChevronDown size={14} color={C.sub} style={{ transition: "transform 0.2s", transform: nightsOpen ? "rotate(180deg)" : "none" }} />
          </button>
          {nightsOpen && (
            <div className="hide-scrollbar" style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: C.white,
              borderRadius: 12, border: `1px solid ${C.div}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "auto", maxHeight: 220, width: 124,
            }}>
              {nightOptions.map((n, idx) => (
                <button key={n} onClick={() => { setNights(n); setNightsOpen(false); }} style={{
                  display: "block", width: "100%", padding: "11px 0", textAlign: "center",
                  background: n === curNights ? C.p100 : "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  borderBottom: idx < nightOptions.length - 1 ? `1px solid ${C.div}` : "none",
                  fontSize: 15, fontWeight: n === curNights ? 700 : 500, color: n === curNights ? C.p600 : C.head,
                }}>{n} nights</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p style={{ margin: "10px 2px 0", fontSize: 12, color: C.sub }}>
        💡 We recommend at least {minN} nights for {dest}.
        {startDate && ` · ${fmtDate(startDate)} start`}
      </p>
    </div>
  );
}

// ════════════════════ Step 3: Route ════════════════════
// One clean white screen: drag to reorder, nights with - / +, View details for a
// full-screen city look, and more places to add below.
function StepRoute({ dest, route, setRoute, editRoute }) {
  const usedCities = new Set(route.map(r => r.city));
  const available = (destAreas[dest] || []).filter(a => !usedCities.has(a.city));
  const [dragIdx, setDragIdx] = useState(null);
  const [cityView, setCityView] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const totalNights = route.reduce((s, r) => s + r.n, 0);

  const setN = (i, n) => setRoute(r => r.map((s, j) => j === i ? { ...s, n: Math.max(1, n) } : s));
  const remove = (i) => setRoute(r => r.length > 1 ? r.filter((_, j) => j !== i) : r);
  const add = (area) => setRoute(r => [...r, { city: area.city, n: area.n }]);
  const reorder = (from, to) => setRoute(r => { const c = [...r]; const [m] = c.splice(from, 1); c.splice(to, 0, m); return c; });
  const areaOf = (city) => (destAreas[dest] || []).find(a => a.city === city) || { city, crowd: "Mixed", blurb: "" };

  const crowdChip = (crowd) => {
    const label = CROWD_LABEL[crowd] || "Popular";
    const col = LABEL_COLOR[label];
    return <span style={{ fontSize: 10, fontWeight: 700, color: col, background: `${col}14`, padding: "2px 7px", borderRadius: 6 }}>{label}</span>;
  };
  const viewLink = (city) => (
    <button onClick={() => setCityView(city)} style={{ marginTop: 4, padding: 0, border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 1, color: C.sub, fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}>
      View details <ChevronRight size={13} />
    </button>
  );
  return (
    <div style={{ padding: "18px 16px 24px" }}>
      <h1 style={titleStyle}>{editRoute ? "Change your cities" : "Here are your cities"}</h1>
      <p style={{ ...subStyle, marginTop: 4 }}>
        <strong style={{ color: C.head }}>{route.length} {route.length > 1 ? "cities" : "city"}</strong> · {totalNights} night{totalNights > 1 ? "s" : ""} total
      </p>

      {/* tappable map preview → full-screen editor */}
      <button onClick={() => setMapOpen(true)} style={{ position: "relative", display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "pointer" }} aria-label="Open map">
        <RouteMap route={route} />
        <span style={{ position: "absolute", top: 18, right: 0, display: "inline-flex", alignItems: "center", gap: 5, background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", color: C.head, fontSize: 12, fontWeight: 700, padding: "6px 11px", borderRadius: 20 }}>
          <MapIcon size={13} color={C.p600} /> Open map
        </span>
      </button>

      {/* route cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {route.map((stop, i) => {
          const area = areaOf(stop.city);
          return (
            <div
              key={stop.city + i}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) { reorder(dragIdx, i); setDragIdx(i); } }}
              onDragEnd={() => setDragIdx(null)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 8px 10px 2px",
                border: `1px solid ${C.div}`, borderRadius: 16, background: C.white, opacity: dragIdx === i ? 0.45 : 1,
              }}
            >
              <span style={{ flexShrink: 0, cursor: "grab", color: C.icon, display: "grid", placeItems: "center" }} aria-label="Drag to reorder">
                <GripVertical size={18} />
              </span>
              <img src={areaImg(dest, stop.city, i)} alt={stop.city} style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: C.head }}>{stop.city}</span>
                  {crowdChip(area.crowd)}
                </div>
                {viewLink(stop.city)}
              </div>
              <NightsDropdown value={stop.n} onChange={(n) => setN(i, n)} />
              {route.length > 1 && (
                <button onClick={() => remove(i)} style={{ flexShrink: 0, border: "none", background: "none", cursor: "pointer", padding: 2 }} aria-label={`Remove ${stop.city}`}>
                  <XIcon size={15} color={C.icon} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* more places to add */}
      {available.length > 0 && (
        <>
          <p style={{ margin: "24px 0 10px", fontSize: 13, fontWeight: 800, color: C.head }}>Add another place</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {available.map((a, i) => (
              <div key={a.city} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", border: `1px solid ${C.div}`, borderRadius: 16, background: C.white }}>
                <img src={areaImg(dest, a.city, i)} alt={a.city} style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: C.head }}>{a.city}</span>
                    {crowdChip(a.crowd)}
                  </div>
                  {viewLink(a.city)}
                </div>
                <button onClick={() => add(a)} style={{ ...pillBtn, color: C.p600, borderColor: C.p300, flexShrink: 0 }} aria-label={`Add ${a.city}`}>
                  <Plus size={14} color={C.p600} style={{ marginRight: 3 }} /> Add
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {cityView && <CityDetail dest={dest} city={cityView} onClose={() => setCityView(null)} />}
      {mapOpen && <RouteMapFull dest={dest} route={route} setRoute={setRoute} onClose={() => setMapOpen(false)} />}
    </div>
  );
}

// Full-screen, functional map editor: all the destination's cities plotted at
// their true relative positions. Tap a pin to add/remove; the selected ones show
// a numbered sequence and a connecting path. Sequence + nights are edited in the
// list below and reflected live on the map.
function RouteMapFull({ dest, route, setRoute, onClose }) {
  const [dragIdx, setDragIdx] = useState(null);
  const areas = destAreas[dest] || [];
  const selected = route.map(r => r.city);
  const selectedSet = new Set(selected);
  const totalNights = route.reduce((s, r) => s + r.n, 0);

  const setN = (i, n) => setRoute(r => r.map((s, j) => j === i ? { ...s, n: Math.max(1, n) } : s));
  const remove = (city) => setRoute(r => r.length > 1 ? r.filter(s => s.city !== city) : r);
  const toggle = (area) => {
    if (selectedSet.has(area.city)) remove(area.city);
    else setRoute(r => [...r, { city: area.city, n: area.n }]);
  };
  const reorder = (from, to) => setRoute(r => { const c = [...r]; const [m] = c.splice(from, 1); c.splice(to, 0, m); return c; });

  // Project lat/lng of every plottable city into the canvas box.
  const W = 320, H = 300, pad = 40;
  const pts = areas.map(a => cityCoords[a.city]).filter(Boolean);
  const lats = pts.map(p => p.lat), lngs = pts.map(p => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const spanLat = Math.max(0.01, maxLat - minLat), spanLng = Math.max(0.01, maxLng - minLng);
  const project = (c) => {
    const co = cityCoords[c];
    if (!co) return { x: W / 2, y: H / 2 };
    return {
      x: pad + ((co.lng - minLng) / spanLng) * (W - 2 * pad),
      y: pad + (1 - (co.lat - minLat) / spanLat) * (H - 2 * pad), // invert: north up
    };
  };
  const seqPath = route.map((s, i) => { const p = project(s.city); return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`; }).join(" ");

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
        {/* map canvas */}
        <div style={{ background: "#EEF3F4", borderBottom: `1px solid ${C.div}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
            {/* sea texture lines for a maplike feel */}
            {[0.25, 0.5, 0.75].map((f, i) => (
              <line key={i} x1={0} y1={H * f} x2={W} y2={H * f} stroke="#E0E8EA" strokeWidth="1" />
            ))}
            {/* sequence path through selected cities */}
            {route.length > 1 && <path d={seqPath} stroke={C.p600} strokeWidth="2.5" strokeDasharray="6 5" fill="none" strokeLinecap="round" />}
            {/* all city pins */}
            {areas.map((a) => {
              const p = project(a.city);
              const seq = selected.indexOf(a.city);
              const on = seq >= 0;
              return (
                <g key={a.city} onClick={() => toggle(a)} style={{ cursor: "pointer" }}>
                  {on ? (
                    <>
                      <circle cx={p.x} cy={p.y} r="13" fill={C.p600} />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{seq + 1}</text>
                    </>
                  ) : (
                    <circle cx={p.x} cy={p.y} r="7" fill={C.white} stroke={C.inact} strokeWidth="2" />
                  )}
                  <text x={p.x} y={p.y - (on ? 19 : 13)} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={on ? C.head : C.sub} stroke="#EEF3F4" strokeWidth="3" paintOrder="stroke" style={{ strokeLinejoin: "round" }}>{a.city}</text>
                </g>
              );
            })}
          </svg>
          <p style={{ margin: 0, padding: "0 16px 12px", fontSize: 11.5, color: C.sub, textAlign: "center" }}>Tap a pin to add or remove a city</p>
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

function RouteMap({ route }) {
  // Honest static thumbnail: labelled dots on a path, no fake interactivity.
  const W = 320, H = 88, pad = 26;
  const n = route.length;
  const xs = n === 1 ? [W / 2] : route.map((_, i) => pad + (i * (W - 2 * pad)) / (n - 1));
  const ys = route.map((_, i) => H / 2 + (i % 2 === 0 ? -10 : 10));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <div style={{ marginTop: 14 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <path d={path} stroke={C.p300} strokeWidth="2.5" strokeDasharray="5 5" fill="none" strokeLinecap="round" />
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r="6" fill={C.p600} />
            <text x={x} y={ys[i] + (i % 2 === 0 ? -12 : 20)} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.head}>{route[i].city}</text>
          </g>
        ))}
      </svg>
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

function ConfirmRoute({ onCancel, onConfirm }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end" }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.white, borderRadius: "20px 20px 0 0", padding: "22px 20px calc(22px + env(safe-area-inset-bottom))" }}>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.head }}>Save this as a new version?</h2>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: C.sub, lineHeight: 1.5 }}>
          Changing your cities creates a new version of this trip. Your current one stays saved in My Plans.
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
