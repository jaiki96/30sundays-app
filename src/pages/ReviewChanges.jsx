import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plane, Check } from "lucide-react";
import { C, allItineraries } from "../data";
import {
  generateFlightsForRoute, getFlightLegs, airports, formatPrice,
} from "../data/flightData";

export default function ReviewChanges({ selectedFlights, setSelectedFlights }) {
  const { itineraryId, legIndex } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const itinerary = allItineraries.find(i => i.id === Number(itineraryId));
  const legs = itinerary ? getFlightLegs(itinerary) : [];
  const leg = legs[Number(legIndex)];
  const pax = 2;

  const newFlightId = params.get("new");
  const currentFlightId = params.get("current");

  const allFlights = leg ? generateFlightsForRoute(leg.from, leg.to, leg.date, pax) : [];
  const newFlight = allFlights.find(f => f.id === decodeURIComponent(newFlightId));
  const currentFlight = currentFlightId ? allFlights.find(f => f.id === decodeURIComponent(currentFlightId)) : allFlights[0];

  if (!itinerary || !leg || !newFlight) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Flight not found</div>;
  }

  const priceDelta = newFlight.price - (currentFlight?.price || 0);
  const isSame = newFlight.id === currentFlight?.id;

  const handleConfirm = () => {
    setSelectedFlights(prev => {
      const updated = { ...prev };
      if (!updated[itineraryId]) {
        updated[itineraryId] = { legs: [] };
      }
      // Ensure array is long enough
      const legsArr = [...(updated[itineraryId].legs || [])];
      legsArr[Number(legIndex)] = newFlight;
      updated[itineraryId] = { legs: legsArr };
      return updated;
    });
    navigate(`/itinerary/${itineraryId}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", background: C.bg }}>
      {/* ═══ Header ═══ */}
      <div style={{ background: "linear-gradient(135deg, #FFE4E8 0%, #FFF5F0 100%)", padding: "10px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            to={`/flights/${itineraryId}/${legIndex}?current=${currentFlightId || ""}`}
            style={{ width: 34, height: 34, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <ArrowLeft size={18} color={C.head} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>Review Changes</h1>
            <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>
              {airports[leg.from]?.city} → {airports[leg.to]?.city}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px" }} className="hide-scrollbar">
        {/* Current Flight */}
        {currentFlight && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.bg, border: `1.5px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plane size={10} color={C.inact} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>Current flight</span>
            </div>
            <CompactFlightCard flight={currentFlight} variant="current" />
          </div>
        )}

        {/* Arrow */}
        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 16px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <ArrowRight size={16} color={C.p600} style={{ transform: "rotate(90deg)" }} />
          </div>
        </div>

        {/* New Flight */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.p100, border: `1.5px solid ${C.p600}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plane size={10} color={C.p600} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.p600 }}>New flight</span>
          </div>
          <CompactFlightCard flight={newFlight} variant="new" />
        </div>

        {/* Price Comparison */}
        {currentFlight && (
          <div style={{
            background: C.white, borderRadius: 14, padding: "16px",
            border: `1px solid ${C.div}`, marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Price comparison</p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.sub }}>Current flight</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>₹ {formatPrice(currentFlight.price)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.sub }}>New flight</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>₹ {formatPrice(newFlight.price)}</span>
            </div>

            <div style={{ height: 1, background: C.div, marginBottom: 12 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.head }}>Difference</span>
              <span style={{
                fontSize: 14, fontWeight: 700,
                padding: "4px 10px", borderRadius: 8,
                background: priceDelta > 0 ? "#FEF3F2" : priceDelta < 0 ? "#ECFDF3" : C.bg,
                color: priceDelta > 0 ? "#B42318" : priceDelta < 0 ? "#027A48" : C.sub,
              }}>
                {priceDelta > 0 ? "+" : priceDelta < 0 ? "-" : ""}₹ {formatPrice(Math.abs(priceDelta))}
                {priceDelta === 0 && " (No change)"}
              </span>
            </div>
            <p style={{ fontSize: 10, color: C.inact, margin: "8px 0 0", textAlign: "right" }}>per person</p>
          </div>
        )}

        {/* Key differences */}
        {currentFlight && (
          <div style={{
            background: C.white, borderRadius: 14, padding: "16px",
            border: `1px solid ${C.div}`,
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Key differences</p>
            <DiffRow label="Airline" oldVal={currentFlight.airline} newVal={newFlight.airline} />
            <DiffRow label="Duration" oldVal={currentFlight.duration} newVal={newFlight.duration} />
            <DiffRow label="Stops" oldVal={currentFlight.stops === 0 ? "Non-stop" : `${currentFlight.stops} stop`} newVal={newFlight.stops === 0 ? "Non-stop" : `${newFlight.stops} stop`} />
            <DiffRow label="Departure" oldVal={currentFlight.dep} newVal={newFlight.dep} />
            <DiffRow label="Arrival" oldVal={currentFlight.arr} newVal={newFlight.arr} />
          </div>
        )}
      </div>

      {/* ═══ Sticky CTA ═══ */}
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 20,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        padding: "12px 16px 16px", borderTop: `1px solid ${C.div}`,
      }}>
        <button
          onClick={handleConfirm}
          disabled={isSame}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: isSame ? C.bg : C.p600,
            color: isSame ? C.inact : "#fff",
            fontSize: 15, fontWeight: 700,
            cursor: isSame ? "not-allowed" : "pointer", fontFamily: "inherit",
            boxShadow: isSame ? "none" : "0 4px 16px rgba(227,27,83,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <Check size={16} /> Confirm Change
        </button>
      </div>
    </div>
  );
}

// ─── Compact Flight Card ───
function CompactFlightCard({ flight, variant }) {
  const isCurrent = variant === "current";
  return (
    <div style={{
      background: C.white, borderRadius: 14, padding: "14px 16px",
      border: isCurrent ? `1px solid ${C.div}` : `2px solid ${C.p600}`,
      opacity: isCurrent ? 0.75 : 1,
    }}>
      {/* Airline + Price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0, maxWidth: "60%" }}>{flight.airline}</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>₹ {formatPrice(flight.price)}</p>
      </div>
      {/* Leg */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{flight.dep}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{flight.from}</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
          <span style={{ fontSize: 10, color: C.inact }}>{flight.duration}</span>
          <div style={{ width: "100%", height: 1, background: C.div, margin: "3px 0", position: "relative" }}>
            <Plane size={12} color="#D97706" fill="#D97706" style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)" }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: flight.stops === 0 ? C.sText : C.p600 }}>
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{flight.arr}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{flight.to}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Diff Row ───
function DiffRow({ label, oldVal, newVal }) {
  const changed = oldVal !== newVal;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.div}` }}>
      <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {changed && <span style={{ fontSize: 11, color: C.inact, textDecoration: "line-through" }}>{oldVal}</span>}
        <span style={{ fontSize: 12, fontWeight: changed ? 600 : 400, color: changed ? C.head : C.sub }}>{newVal}</span>
      </div>
    </div>
  );
}
