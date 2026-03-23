import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Plane, SlidersHorizontal, X, Check } from "lucide-react";
import { C, allItineraries } from "../data";
import {
  generateFlightsForRoute, getFlightLegs, airports,
  flightSortOptions, applyFlightFilters, formatPrice,
  timeSlots, timeSlotIcons, getTimeSlot, airlines as airlineDb,
} from "../data/flightData";

export default function FlightListing() {
  const { itineraryId, legIndex } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const itinerary = allItineraries.find(i => i.id === Number(itineraryId));
  const legs = itinerary ? getFlightLegs(itinerary) : [];
  const leg = legs[Number(legIndex)];
  const pax = 2;

  // Get currently selected flight from query param
  const currentFlightId = params.get("current");

  // Generate flights
  const allFlights = useMemo(() => {
    if (!leg) return [];
    return generateFlightsForRoute(leg.from, leg.to, leg.date, pax);
  }, [leg?.from, leg?.to, leg?.date]);

  // State
  const [expandedCard, setExpandedCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterTab, setFilterTab] = useState("Filters");
  const [sortIdx, setSortIdx] = useState(0);
  const [filters, setFilters] = useState({
    stops: new Set(),
    airlines: new Set(),
    checkinBaggage: false,
    handBaggageOnly: false,
    twoCheckinBags: false,
    heavyBaggage: false,
    depTimes: new Set(),
    arrTimes: new Set(),
    maxDuration: null,
    maxPrice: null,
    maxLayover: null,
    lowEmission: false,
  });

  // Available airlines for filter
  const availableAirlines = useMemo(() => {
    const codes = new Set();
    allFlights.forEach(f => f.airlineCodes.forEach(c => codes.add(c)));
    return airlineDb.filter(a => codes.has(a.code));
  }, [allFlights]);

  // Price and duration ranges
  const priceRange = useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 100000 };
    return {
      min: Math.min(...allFlights.map(f => f.price)),
      max: Math.max(...allFlights.map(f => f.price)),
    };
  }, [allFlights]);

  const durationRange = useMemo(() => {
    if (allFlights.length === 0) return { min: 0, max: 2400 };
    return {
      min: Math.min(...allFlights.map(f => f.durationMinutes)),
      max: Math.max(...allFlights.map(f => f.durationMinutes)),
    };
  }, [allFlights]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let result = applyFlightFilters(allFlights, filters);
    const sortFn = flightSortOptions[sortIdx].fn;
    if (sortFn) result = [...result].sort(sortFn);
    return result;
  }, [allFlights, filters, sortIdx]);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.stops.size) c++;
    if (filters.airlines.size) c++;
    if (filters.checkinBaggage) c++;
    if (filters.handBaggageOnly) c++;
    if (filters.twoCheckinBags) c++;
    if (filters.heavyBaggage) c++;
    if (filters.depTimes.size) c++;
    if (filters.arrTimes.size) c++;
    if (filters.maxDuration) c++;
    if (filters.maxPrice) c++;
    if (filters.lowEmission) c++;
    return c;
  }, [filters]);

  const toggleSet = (key, val) => {
    setFilters(f => {
      const next = new Set(f[key]);
      next.has(val) ? next.delete(val) : next.add(val);
      return { ...f, [key]: next };
    });
  };

  const clearAll = () => {
    setFilters({
      stops: new Set(), airlines: new Set(),
      checkinBaggage: false, handBaggageOnly: false,
      twoCheckinBags: false, heavyBaggage: false,
      depTimes: new Set(), arrTimes: new Set(),
      maxDuration: null, maxPrice: null, maxLayover: null, lowEmission: false,
    });
    setSortIdx(0);
  };

  if (!itinerary || !leg) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Flight route not found</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", background: C.bg }}>
      {/* ═══ Header ═══ */}
      <div style={{ background: "linear-gradient(135deg, #FFE4E8 0%, #FFF5F0 100%)", padding: "10px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Link to={`/itinerary/${itineraryId}`} style={{ width: 34, height: 34, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowLeft size={18} color={C.head} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>
              {airports[leg.from]?.city || leg.from} – {airports[leg.to]?.city || leg.to}
            </h1>
            <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>
              {leg.date} – {leg.type === "international" && leg.direction === "outbound"
                ? (() => { const totalNights = itinerary.days.reduce((s, d) => s + d.n, 0); return `Return · 👤 ${pax}`; })()
                : `One way · 👤 ${pax}`}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Options Count ═══ */}
      <div style={{ padding: "10px 16px 6px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>{filtered.length} Options</p>
      </div>

      {/* ═══ Flight Cards ═══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 120px" }} className="hide-scrollbar">
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((flight) => {
              const isCurrent = flight.id === currentFlightId;
              const isExpanded = expandedCard === flight.id;
              return (
                <div key={flight.id}>
                  <div
                    onClick={() => navigate(`/flight-detail/${itineraryId}/${legIndex}/${encodeURIComponent(flight.id)}?current=${currentFlightId || ""}`)}
                    style={{
                      background: C.white, borderRadius: 14, padding: "14px 16px",
                      border: isCurrent ? `2px solid ${C.p600}` : `1px solid ${C.div}`,
                      cursor: "pointer", position: "relative",
                    }}
                  >
                    {isCurrent && (
                      <div style={{ position: "absolute", top: -8, right: 12, background: C.p600, color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 8 }}>
                        Current
                      </div>
                    )}
                    {/* Airline + Price */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0, maxWidth: "60%" }}>{flight.airline}</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>₹ {formatPrice(flight.price)}</p>
                    </div>

                    {/* Outbound leg */}
                    <FlightLeg
                      dep={flight.dep} arr={flight.arr}
                      from={flight.from} to={flight.to}
                      date={flight.date} arrDate={flight.arrDate}
                      duration={flight.duration} stops={flight.stops}
                    />

                    {/* More Details toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : flight.id); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, marginTop: 10,
                        background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
                        fontSize: 12, fontWeight: 600, color: C.p600,
                      }}
                    >
                      {isExpanded ? "Less Details" : "More Details"} {isExpanded ? <ChevronUp size={14} color={C.p600} /> : <ChevronDown size={14} color={C.p600} />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ background: C.white, borderRadius: "0 0 14px 14px", padding: "0 16px 16px", marginTop: -12, borderLeft: isCurrent ? `2px solid ${C.p600}` : `1px solid ${C.div}`, borderRight: isCurrent ? `2px solid ${C.p600}` : `1px solid ${C.div}`, borderBottom: isCurrent ? `2px solid ${C.p600}` : `1px solid ${C.div}` }}>
                      <div style={{ height: 1, background: C.div, marginBottom: 12 }} />

                      {/* Allowed Luggage */}
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>Allowed Luggage</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>Traveler</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>Cabin</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>Check-in</span>
                        {flight.travelers.map((t, i) => [
                          <span key={`${i}-l`} style={{ fontSize: 11, color: C.sub }}>{t.label}</span>,
                          <span key={`${i}-c`} style={{ fontSize: 11, color: C.sub }}>{t.cabin}</span>,
                          <span key={`${i}-k`} style={{ fontSize: 11, color: C.sub }}>{t.checkin}</span>,
                        ])}
                      </div>

                      {/* Cancellation Policy */}
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: "0 0 6px" }}>Cancellation policy</p>
                      <div style={{ paddingLeft: 12 }}>
                        <p style={{ fontSize: 11, color: C.sub, margin: "0 0 3px" }}>• {flight.cancellation}</p>
                        <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>• {flight.dateChange}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>✈️</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: C.head, marginBottom: 4 }}>No flights available</p>
            <p style={{ fontSize: 13, color: C.sub, marginBottom: 16 }}>Try adjusting your filters</p>
            <button onClick={clearAll} style={{ fontSize: 13, fontWeight: 600, color: C.p600, background: C.p100, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit" }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ Floating Bottom Bar ═══ */}
      <div style={{
        position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 10,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
        borderRadius: 16, padding: "8px 10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div className="hs" style={{ flex: 1, gap: 6, paddingBottom: 0, minWidth: 0 }}>
          <QuickChip label="Non Stop" active={filters.stops.has(0)} onToggle={() => toggleSet("stops", 0)} />
          <QuickChip label="Luggage 20+ kg" active={filters.heavyBaggage} onToggle={() => setFilters(f => ({ ...f, heavyBaggage: !f.heavyBaggage }))} />
          <QuickChip label="Full Service" active={false} onToggle={() => {}} />
        </div>
        <div style={{ width: 1, height: 24, background: C.div, flexShrink: 0 }} />
        <button onClick={() => setShowFilters(true)} style={{
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
          background: activeFilterCount > 0 ? C.p600 : C.white, border: activeFilterCount > 0 ? "none" : `1px solid ${C.div}`,
          color: activeFilterCount > 0 ? "#fff" : C.sub, fontSize: 12, fontWeight: 600,
        }}>
          <SlidersHorizontal size={13} />
          Sort & Filters
        </button>
      </div>

      {/* ═══ Full Filter / Sort Bottom Sheet ═══ */}
      {showFilters && (
        <>
          <div onClick={() => setShowFilters(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderRadius: "20px 20px 0 0", zIndex: 50, height: "85%", display: "flex", flexDirection: "column" }} className="animate-slide-up">
            {/* Header */}
            <div style={{ flexShrink: 0, padding: "14px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Link to={`/itinerary/${itineraryId}`} style={{ display: "flex" }}>
                  <ArrowLeft size={18} color={C.head} />
                </Link>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.head }}>Filters</span>
              </div>
              <button onClick={clearAll} style={{ fontSize: 13, fontWeight: 600, color: C.p600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Clear all
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", padding: "12px 20px 0" }}>
              {["Filters", "Sort"].map(tab => (
                <button key={tab} onClick={() => setFilterTab(tab)} style={{
                  flex: 1, fontSize: 14, fontWeight: filterTab === tab ? 600 : 500,
                  color: filterTab === tab ? C.head : C.inact,
                  background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", fontFamily: "inherit",
                  borderBottom: filterTab === tab ? `2px solid ${C.p600}` : "2px solid transparent", textAlign: "center",
                }}>{tab}</button>
              ))}
            </div>

            {/* Filter content */}
            {filterTab === "Filters" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 0" }} className="hide-scrollbar">
                {/* Popular Filters */}
                <FilterSection title="Popular Filters">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Direct flights", val: 0 },
                      { label: "1 Stop", val: 1 },
                      { label: "2 Stops", val: 2 },
                    ].map(item => (
                      <CheckboxRow key={item.val} label={item.label} checked={filters.stops.has(item.val)} onChange={() => toggleSet("stops", item.val)} />
                    ))}
                  </div>
                </FilterSection>

                {/* Baggage Filters */}
                <FilterSection title="Baggage Filters">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <CheckboxRow label="Check-in Baggage Included" checked={filters.checkinBaggage} onChange={() => setFilters(f => ({ ...f, checkinBaggage: !f.checkinBaggage }))} />
                    <CheckboxRow label="Hand Baggage Only" checked={filters.handBaggageOnly} onChange={() => setFilters(f => ({ ...f, handBaggageOnly: !f.handBaggageOnly }))} />
                    <CheckboxRow label="2 Check-in Bags Available" checked={filters.twoCheckinBags} onChange={() => setFilters(f => ({ ...f, twoCheckinBags: !f.twoCheckinBags }))} />
                    <CheckboxRow label="Check-in Baggage Over 30 Kg" checked={filters.heavyBaggage} onChange={() => setFilters(f => ({ ...f, heavyBaggage: !f.heavyBaggage }))} />
                  </div>
                </FilterSection>

                {/* Airlines */}
                <FilterSection title="Airlines">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {availableAirlines.map(a => (
                      <CheckboxRow key={a.code} label={a.name} checked={filters.airlines.has(a.code)} onChange={() => toggleSet("airlines", a.code)} />
                    ))}
                  </div>
                </FilterSection>

                {/* Times */}
                <FilterSection title="Times">
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>{airports[leg.from]?.city} – {airports[leg.to]?.city}</p>
                  <p style={{ fontSize: 11, color: C.sub, margin: "0 0 8px" }}>Leave {airports[leg.from]?.city}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {timeSlots.map((slot, i) => {
                      const active = filters.depTimes.has(slot);
                      return (
                        <button key={slot} onClick={() => toggleSet("depTimes", slot)} style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 20,
                          fontSize: 11, fontWeight: active ? 600 : 500, fontFamily: "inherit", cursor: "pointer",
                          background: active ? C.p100 : C.white, color: active ? C.p600 : C.sub,
                          border: `1.5px solid ${active ? C.p600 : C.div}`,
                        }}>
                          {timeSlotIcons[i]} {slot}
                        </button>
                      );
                    })}
                  </div>

                  <p style={{ fontSize: 11, color: C.sub, margin: "0 0 8px" }}>Arrive in {airports[leg.to]?.city}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {timeSlots.map((slot, i) => {
                      const active = filters.arrTimes.has(slot);
                      return (
                        <button key={slot} onClick={() => toggleSet("arrTimes", slot)} style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 20,
                          fontSize: 11, fontWeight: active ? 600 : 500, fontFamily: "inherit", cursor: "pointer",
                          background: active ? C.p100 : C.white, color: active ? C.p600 : C.sub,
                          border: `1.5px solid ${active ? C.p600 : C.div}`,
                        }}>
                          {timeSlotIcons[i]} {slot}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* Journey Duration Slider */}
                <FilterSection title="Journey duration">
                  <div style={{ padding: "0 4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.sub }}>{Math.floor(durationRange.min / 60)}h {durationRange.min % 60}m</span>
                      <span style={{ fontSize: 11, color: C.sub }}>{Math.floor(durationRange.max / 60)}h {durationRange.max % 60}m</span>
                    </div>
                    <input type="range" min={durationRange.min} max={durationRange.max} value={filters.maxDuration || durationRange.max}
                      onChange={e => setFilters(f => ({ ...f, maxDuration: parseInt(e.target.value) === durationRange.max ? null : parseInt(e.target.value) }))}
                      style={{ width: "100%", accentColor: C.p600 }} />
                  </div>
                </FilterSection>

                {/* Price Slider */}
                <FilterSection title="Round Trip Price">
                  <div style={{ padding: "0 4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.sub }}>₹ {formatPrice(priceRange.min)}</span>
                      <span style={{ fontSize: 11, color: C.sub }}>₹ {formatPrice(priceRange.max)}</span>
                    </div>
                    <input type="range" min={priceRange.min} max={priceRange.max} value={filters.maxPrice || priceRange.max}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: parseInt(e.target.value) === priceRange.max ? null : parseInt(e.target.value) }))}
                      style={{ width: "100%", accentColor: C.p600 }} />
                  </div>
                </FilterSection>

                {/* Flight Emission */}
                <FilterSection title="Flight emission">
                  <CheckboxRow label="Only show flights with lower CO2e emission" checked={filters.lowEmission} onChange={() => setFilters(f => ({ ...f, lowEmission: !f.lowEmission }))} color={C.sText} />
                </FilterSection>

                <div style={{ height: 20 }} />
              </div>
            )}

            {/* Sort tab */}
            {filterTab === "Sort" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 0" }} className="hide-scrollbar">
                {flightSortOptions.map((opt, i) => (
                  <button key={i} onClick={() => setSortIdx(i)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                    padding: "16px 0", background: "none", border: "none",
                    borderBottom: i < flightSortOptions.length - 1 ? `1px solid ${C.div}` : "none",
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

            {/* Sticky footer */}
            <div style={{ display: "flex", gap: 10, padding: "12px 20px 32px", borderTop: `1px solid ${C.div}`, flexShrink: 0 }}>
              <button onClick={() => { clearAll(); setShowFilters(false); }} style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: "13px 0", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, color: C.sub, cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
              <button onClick={() => setShowFilters(false)} style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: "13px 0", borderRadius: 12, border: "none", background: C.p600, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                Show {filtered.length} flights
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Flight Leg Row ───
function FlightLeg({ dep, arr, from, to, date, arrDate, duration, stops }) {
  const diffDay = arrDate && arrDate !== date;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 10, color: C.sub, margin: 0 }}>{date}</p>
          <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>{from}</p>
          <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>{dep}</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 14px 0" }}>
          <span style={{ fontSize: 10, color: C.inact }}>{duration}</span>
          <div style={{ width: "100%", height: 1, background: C.div, margin: "4px 0", position: "relative" }}>
            <Plane size={14} color="#D97706" fill="#D97706" style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%) rotate(0deg)" }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: stops === 0 ? C.sText : C.p600 }}>
            {stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 10, color: C.sub, margin: 0 }}>{diffDay ? arrDate : date}</p>
          <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>{to}</p>
          <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>{arr}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Chip ───
function QuickChip({ label, active, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: active ? 600 : 500, padding: "7px 12px",
      borderRadius: 20, cursor: "pointer", flexShrink: 0, fontFamily: "inherit", whiteSpace: "nowrap",
      color: active ? C.p600 : C.sub, background: active ? C.p100 : "transparent",
      border: `1.5px solid ${active ? C.p600 : C.div}`,
    }}>
      {label}
      {active && <X size={10} color={C.p600} strokeWidth={2.5} style={{ marginLeft: 2 }} />}
    </button>
  );
}

// ─── Filter Section ───
function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.div}` }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.head, marginBottom: 10 }}>{title}</p>
      {children}
    </div>
  );
}

// ─── Checkbox Row ───
function CheckboxRow({ label, checked, onChange, color }) {
  return (
    <button onClick={onChange} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 0",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? (color || C.p600) : C.div}`,
        background: checked ? (color || C.p600) : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 13, color: C.head, textAlign: "left" }}>{label}</span>
    </button>
  );
}
