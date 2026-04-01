import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, X, Sparkles, Calendar, Gauge, Users } from "lucide-react";
import { C, VS, allItineraries, destinations } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import HotelUpgradeDrawer from "../components/HotelUpgradeDrawer";
import { getUpgradeInfo } from "../data/upgradeData";

const nightRanges = [
  { label: "3–5N", min: 3, max: 5 },
  { label: "6–8N", min: 6, max: 8 },
  { label: "8–10N", min: 8, max: 10 },
  { label: "10+N", min: 10, max: 99 },
];

const sortOptions = [
  { label: "Recommended", fn: () => 0 },
  { label: "Price: Low to High", fn: (a, b) => parseInt(a.price.replace(/,/g, "")) - parseInt(b.price.replace(/,/g, "")) },
  { label: "Price: High to Low", fn: (a, b) => parseInt(b.price.replace(/,/g, "")) - parseInt(a.price.replace(/,/g, "")) },
  { label: "Duration: Shortest first", fn: (a, b) => a.nights - b.nights },
];

export default function Listing({ userState, leadData }) {
  const [params] = useSearchParams();
  const initialVibe = params.get("vibe") || "";
  const initialDest = params.get("dest") || "";
  const isWelcome = params.get("welcome") === "1";
  const welcomeName = params.get("name") || leadData?.name || "";
  const [showWelcome, setShowWelcome] = useState(isWelcome);

  // Auto-dismiss welcome banner after 8 seconds
  useEffect(() => {
    if (showWelcome) {
      const t = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(t);
    }
  }, [showWelcome]);

  const [filters, setFilters] = useState({
    vibes: initialVibe ? new Set([initialVibe]) : new Set(),
    dests: initialDest ? new Set([initialDest]) : new Set(),
    nights: new Set(),
    vegOnly: false,
    pace: new Set(),
    crowds: new Set(),
  });
  const [sortIdx, setSortIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filterTab, setFilterTab] = useState("Filters");
  const [showDrawer, setShowDrawer] = useState(false);
  const [upgradeItinerary, setUpgradeItinerary] = useState(null); // itinerary for upgrade drawer

  useEffect(() => {
    const seen = sessionStorage.getItem("listing-drawer-seen");
    if (!seen) {
      const t = setTimeout(() => setShowDrawer(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const closeDrawer = () => { setShowDrawer(false); sessionStorage.setItem("listing-drawer-seen", "true"); };

  const toggleSet = (key, val) => {
    setFilters(f => {
      const next = new Set(f[key]);
      next.has(val) ? next.delete(val) : next.add(val);
      return { ...f, [key]: next };
    });
  };

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.dests.size) c++;
    if (filters.nights.size) c++;
    if (filters.vegOnly) c++;
    if (filters.pace.size) c++;
    if (filters.crowds.size) c++;
    return c;
  }, [filters]);

  const filtered = useMemo(() => {
    let results = allItineraries.filter(it => {
      if (filters.vibes.size && !filters.vibes.has(it.vibe)) return false;
      if (filters.dests.size && !filters.dests.has(it.dest)) return false;
      if (filters.nights.size) {
        const match = [...filters.nights].some(i => it.nights >= nightRanges[i].min && it.nights <= nightRanges[i].max);
        if (!match) return false;
      }
      if (filters.vegOnly && !it.veg) return false;
      if (filters.pace.size && !filters.pace.has(it.pace)) return false;
      if (filters.crowds.size && !filters.crowds.has(it.crowds)) return false;
      return true;
    });
    const sortFn = sortOptions[sortIdx].fn;
    if (sortFn) results = [...results].sort(sortFn);
    return results;
  }, [filters, sortIdx]);

  const clearAll = () => {
    setFilters({ vibes: new Set(), dests: new Set(), nights: new Set(), vegOnly: false, pace: new Set(), crowds: new Set() });
    setSortIdx(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <Link to="/" style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ArrowLeft size={18} color={C.head} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Explore Trips</h1>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{filtered.length} itineraries</p>
        </div>
      </div>

      {/* spacer */}
      <div style={{ height: 4 }} />

      {/* Results */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 140px" }} className="hide-scrollbar">
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(it => (
              <ItineraryCard key={it.id} it={it} fullWidth onUpgradeClick={(itData) => setUpgradeItinerary(itData)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🏝️</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.head, marginBottom: 4 }}>No trips match</p>
            <p style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>Try adjusting your filters</p>
            <button onClick={clearAll} style={{ fontSize: 13, fontWeight: 600, color: C.p600, background: C.p100, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ Floating Filter Bar at Bottom ═══ */}
      <div style={{
        position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 10,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderRadius: 16, padding: "8px 10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        {/* Scrollable chips area */}
        <div className="hs" style={{ flex: 1, gap: 6, paddingBottom: 0, minWidth: 0 }}>
          <QuickChip label="6–8N" active={filters.nights.has(1)} onToggle={() => toggleSet("nights", 1)} />
          <QuickChip label="Relaxed" active={filters.vibes.has("Relaxed")} onToggle={() => toggleSet("vibes", "Relaxed")} />
          <QuickChip label="Offbeat" active={filters.vibes.has("Offbeat")} onToggle={() => toggleSet("vibes", "Offbeat")} />
          <QuickChip label="🌱 Veg" active={filters.vegOnly} onToggle={() => setFilters(f => ({ ...f, vegOnly: !f.vegOnly }))} />
        </div>
        {/* Fixed separator + filter icon */}
        <div style={{ width: 1, height: 24, background: C.div, flexShrink: 0 }} />
        <button onClick={() => setShowFilters(true)} style={{
          position: "relative", width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: activeFilterCount > 0 ? C.p100 : "transparent", border: activeFilterCount > 0 ? `1.5px solid ${C.p600}` : `1px solid ${C.div}`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <SlidersHorizontal size={14} color={activeFilterCount > 0 ? C.p600 : C.sub} />
          {activeFilterCount > 0 && (
            <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: C.p600, color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCount}</div>
          )}
        </button>
      </div>

      {/* ═══ Full Filter Bottom Sheet ═══ */}
      {showFilters && (
        <>
          <div onClick={() => setShowFilters(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderRadius: "20px 20px 0 0", zIndex: 50, height: "70%", display: "flex", flexDirection: "column" }} className="animate-slide-up">
            {/* Sticky header with 50-50 tabs */}
            <div style={{ flexShrink: 0, padding: "14px 20px 0", display: "flex", alignItems: "flex-start" }}>
              <div style={{ flex: 1, display: "flex" }}>
                {["Filters", "Sort"].map(tab => (
                  <button key={tab} onClick={() => setFilterTab(tab)} style={{
                    flex: 1, fontSize: 15, fontWeight: filterTab === tab ? 600 : 500, color: filterTab === tab ? C.head : C.inact,
                    background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", fontFamily: "inherit",
                    borderBottom: filterTab === tab ? `2px solid ${C.p600}` : "2px solid transparent",
                    textAlign: "center",
                  }}>{tab}</button>
                ))}
              </div>
              <button onClick={() => setShowFilters(false)} style={{ width: 28, height: 28, borderRadius: "50%", background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginLeft: 4 }}>
                <X size={14} color={C.sub} />
              </button>
            </div>

            {/* Scrollable content — Filters tab */}
            {filterTab === "Filters" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 0" }} className="hide-scrollbar">
              {/* Destination */}
              <FilterSection title="Destination">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {destinations.map((d, i) => {
                    const on = filters.dests.has(d.name);
                    return (
                      <button key={i} onClick={() => toggleSet("dests", d.name)} style={{
                        fontSize: 12, fontWeight: on ? 600 : 500, padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
                        color: on ? C.p600 : C.sub, background: on ? C.p100 : C.white, border: `1.5px solid ${on ? C.p600 : C.div}`,
                      }}>{d.flag} {d.name}</button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Duration — multi-select */}
              <FilterSection title="Duration">
                <div style={{ display: "flex", gap: 8 }}>
                  {nightRanges.map((r, i) => {
                    const on = filters.nights.has(i);
                    return (
                      <button key={i} onClick={() => toggleSet("nights", i)} style={{
                        flex: 1, fontSize: 12, fontWeight: on ? 600 : 500, padding: "10px 0", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                        color: on ? C.p600 : C.sub, background: on ? C.p100 : C.white, border: `1.5px solid ${on ? C.p600 : C.div}`,
                      }}>{r.label}</button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Pace — multi-select */}
              <FilterSection title="Pace">
                <div style={{ display: "flex", gap: 8 }}>
                  {["Unhurried", "Balanced"].map(p => {
                    const on = filters.pace.has(p);
                    return (
                      <button key={p} onClick={() => toggleSet("pace", p)} style={{
                        flex: 1, fontSize: 12, fontWeight: on ? 600 : 500, padding: "10px 0", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                        color: on ? "#0F6E56" : C.sub, background: on ? "#E1F5EE" : C.white, border: `1.5px solid ${on ? "#0F6E56" : C.div}`,
                      }}>{p}</button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Crowds — multi-select */}
              <FilterSection title="Crowd level">
                <div style={{ display: "flex", gap: 8 }}>
                  {["Low", "Mixed"].map(c => {
                    const on = filters.crowds.has(c);
                    return (
                      <button key={c} onClick={() => toggleSet("crowds", c)} style={{
                        flex: 1, fontSize: 12, fontWeight: on ? 600 : 500, padding: "10px 0", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                        color: on ? "#B54708" : C.sub, background: on ? "#FFFAEB" : C.white, border: `1.5px solid ${on ? "#B54708" : C.div}`,
                      }}>{c}</button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Dietary */}
              <FilterSection title="Dietary">
                <button onClick={() => setFilters(f => ({ ...f, vegOnly: !f.vegOnly }))} style={{
                  fontSize: 12, fontWeight: filters.vegOnly ? 600 : 500, padding: "10px 16px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                  color: filters.vegOnly ? "#027A48" : C.sub, background: filters.vegOnly ? "#ECFDF3" : C.white, border: `1.5px solid ${filters.vegOnly ? "#C0E5D5" : C.div}`,
                }}>🌱 Veg Friendly</button>
              </FilterSection>
            </div>
            )}

            {/* Sort tab — clean list style */}
            {filterTab === "Sort" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 0" }} className="hide-scrollbar">
                {sortOptions.map((opt, i) => (
                  <button key={i} onClick={() => setSortIdx(i)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                    padding: "16px 0", background: "none", border: "none",
                    borderBottom: i < sortOptions.length - 1 ? `1px solid ${C.div}` : "none",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: sortIdx === i ? 600 : 500, color: sortIdx === i ? C.p600 : C.sub }}>{opt.label}</span>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `1.5px solid ${sortIdx === i ? C.p600 : C.div}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {sortIdx === i && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.p600 }} />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Sticky actions */}
            <div style={{ display: "flex", gap: 10, padding: "12px 20px 32px", borderTop: `1px solid ${C.div}`, flexShrink: 0 }}>
              <button onClick={() => { clearAll(); setShowFilters(false); }} style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: "13px 0", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, color: C.sub, cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
              <button onClick={() => setShowFilters(false)} style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: "13px 0", borderRadius: 12, border: "none", background: C.p600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                Show {filtered.length} trips
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══ Welcome Banner (post-signup) ═══ */}
      {showWelcome && (
        <div style={{
          position: "absolute", bottom: 72, left: 12, right: 12, zIndex: 30,
          borderRadius: 18, padding: "18px 16px",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          background: "rgba(255, 255, 255, 0.75)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(255,255,255,0.4)",
          border: "1px solid rgba(255,255,255,0.3)",
          animation: "nudgeIn 0.5s ease-out",
        }}>
          <button
            onClick={() => setShowWelcome(false)}
            style={{
              position: "absolute", top: 8, right: 10, width: 20, height: 20,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={12} color="rgba(0,0,0,0.3)" />
          </button>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.p100} 0%, #fff 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${C.p300}44`,
            }}>
              <Sparkles size={20} color={C.p600} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.p900, margin: "0 0 3px" }}>
                {welcomeName ? `We're thrilled, ${welcomeName}! 🎉` : "We're thrilled! 🎉"}
              </p>
              <p style={{ fontSize: 12, color: C.sub, margin: 0, lineHeight: "17px" }}>
                A travel consultant from 30 Sundays will connect with you shortly. Till then, explore our curated itineraries!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Travel Details Drawer (first visit — collect dates, pace, crowds) ═══ */}
      {showDrawer && (
        <TravelDetailsDrawer onClose={closeDrawer} filters={filters} setFilters={setFilters} />
      )}

      {/* ═══ Hotel Upgrade Drawer ═══ */}
      {upgradeItinerary && (() => {
        const info = getUpgradeInfo(upgradeItinerary.id, upgradeItinerary.days);
        return info.upgradeCount > 0 ? (
          <HotelUpgradeDrawer
            upgrades={info.upgrades}
            totalAdditional={info.totalAdditional}
            onClose={() => setUpgradeItinerary(null)}
          />
        ) : null;
      })()}
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: C.head, marginBottom: 8 }}>{title}</p>
      {children}
    </div>
  );
}

function QuickChip({ label, active, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 4,
      fontSize: 12, fontWeight: active ? 600 : 500, padding: "7px 12px",
      borderRadius: 20, cursor: "pointer", flexShrink: 0, fontFamily: "inherit", whiteSpace: "nowrap",
      color: active ? C.p600 : C.sub, background: active ? C.p100 : "transparent",
      border: `1.5px solid ${active ? C.p600 : C.div}`,
    }}>
      {label}
      {active && <X size={10} color={C.p600} strokeWidth={2.5} style={{ marginLeft: 2 }} />}
    </button>
  );
}

function TravelDetailsDrawer({ onClose, filters, setFilters }) {
  const [selectedPace, setSelectedPace] = useState("");
  const [selectedCrowds, setSelectedCrowds] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [nights, setNights] = useState("");

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const nightOptions = [3, 4, 5, 6, 7, 8, 9, 10];

  const handleDone = () => {
    setFilters(f => ({
      ...f,
      pace: selectedPace ? new Set([selectedPace]) : f.pace,
      crowds: selectedCrowds ? new Set([selectedCrowds]) : f.crowds,
    }));
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", zIndex: 50, maxHeight: "80%", overflowY: "auto" }} className="animate-slide-up hide-scrollbar">
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, marginBottom: 4 }}>Help us personalise your trips</h3>
        <p style={{ fontSize: 12, color: C.sub, marginBottom: 20 }}>A few quick picks for better recommendations</p>

        {/* Travel Dates — exact from date + nights */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Calendar size={14} color={C.p600} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>When are you planning to travel?</p>
          </div>
          <p style={{ fontSize: 11, color: C.inact, marginBottom: 10, paddingLeft: 22 }}>For accurate pricing & flight availability</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1.3 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginBottom: 4, display: "block" }}>From date</label>
              <input
                type="date"
                min={minDate}
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13,
                  border: `1.5px solid ${fromDate ? C.p600 : C.div}`, background: fromDate ? C.p100 : C.white,
                  color: fromDate ? C.p600 : C.sub, fontFamily: "inherit", outline: "none",
                  fontWeight: fromDate ? 600 : 400, boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 0.7 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginBottom: 4, display: "block" }}>Nights</label>
              <div style={{ position: "relative" }}>
                <select
                  value={nights}
                  onChange={e => setNights(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13,
                    border: `1.5px solid ${nights ? C.p600 : C.div}`, background: nights ? C.p100 : C.white,
                    color: nights ? C.p600 : C.sub, fontFamily: "inherit", outline: "none",
                    fontWeight: nights ? 600 : 400, appearance: "none", boxSizing: "border-box",
                  }}
                >
                  <option value="">Select</option>
                  {nightOptions.map(n => <option key={n} value={n}>{n}N</option>)}
                </select>
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: C.sub, pointerEvents: "none" }}>▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pace */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Gauge size={14} color="#0F6E56" />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>What's your ideal pace?</p>
          </div>
          <p style={{ fontSize: 11, color: C.inact, marginBottom: 8, paddingLeft: 22 }}>So your itinerary doesn't feel hectic or rushed</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "Unhurried", label: "Unhurried", desc: "Sleep in, no FOMO" },
              { key: "Balanced", label: "Balanced", desc: "Best of both worlds" },
            ].map(p => {
              const on = selectedPace === p.key;
              return (
                <button key={p.key} onClick={() => setSelectedPace(on ? "" : p.key)} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  background: on ? "#E1F5EE" : C.white, border: `1.5px solid ${on ? "#0F6E56" : C.div}`,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: on ? "#0F6E56" : C.head, margin: 0 }}>{p.label}</p>
                  <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Crowd Levels */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Users size={14} color="#B54708" />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>Crowd preference?</p>
          </div>
          <p style={{ fontSize: 11, color: C.inact, marginBottom: 8, paddingLeft: 22 }}>Totally personal — no wrong answer here</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "Low", label: "Low crowds", desc: "Quiet, offbeat spots" },
              { key: "Mixed", label: "Doesn't matter", desc: "Popular is fine too" },
            ].map(c => {
              const on = selectedCrowds === c.key;
              return (
                <button key={c.key} onClick={() => setSelectedCrowds(on ? "" : c.key)} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  background: on ? "#FFFAEB" : C.white, border: `1.5px solid ${on ? "#B54708" : C.div}`,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: on ? "#B54708" : C.head, margin: 0 }}>{c.label}</p>
                  <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>{c.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleDone} style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: C.p600, color: "#fff", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
        }}>
          Show me trips
        </button>
        <button onClick={onClose} style={{ width: "100%", marginTop: 8, padding: "10px 0", fontSize: 13, fontWeight: 500, color: C.inact, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          Skip for now
        </button>
      </div>
    </>
  );
}
