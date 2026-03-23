import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Plane, Users } from "lucide-react";
import { C, allItineraries } from "../data";
import {
  generateFlightsForRoute, getFlightLegs, airports, formatPrice,
} from "../data/flightData";

export default function FlightDetail() {
  const { itineraryId, legIndex, flightId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const itinerary = allItineraries.find(i => i.id === Number(itineraryId));
  const legs = itinerary ? getFlightLegs(itinerary) : [];
  const leg = legs[Number(legIndex)];
  const pax = 2;
  const currentFlightId = params.get("current");

  // Find the flight
  const allFlights = leg ? generateFlightsForRoute(leg.from, leg.to, leg.date, pax) : [];
  const flight = allFlights.find(f => f.id === decodeURIComponent(flightId));

  if (!itinerary || !leg || !flight) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Flight not found</div>;
  }

  const isCurrent = flight.id === currentFlightId;

  const handleSelectFlight = () => {
    if (isCurrent) return;
    navigate(`/review-flight/${itineraryId}/${legIndex}?new=${encodeURIComponent(flight.id)}&current=${currentFlightId || ""}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* ═══ Header ═══ */}
      <div style={{ background: "linear-gradient(135deg, #FFE4E8 0%, #FFF5F0 100%)", padding: "10px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to={`/flights/${itineraryId}/${legIndex}?current=${currentFlightId || ""}`} style={{ width: 34, height: 34, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowLeft size={18} color={C.head} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>Flight</h1>
            <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>
              {leg.date} · 👤 {pax}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 100px" }} className="hide-scrollbar">
        {/* Route heading */}
        <div style={{ padding: "16px 16px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>
            {airports[leg.from]?.city} to {airports[leg.to]?.city}
          </h2>
          <p style={{ fontSize: 12, color: C.sub, margin: "0 0 2px" }}>{getDayName(leg.date)}, {leg.date}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <Clock size={12} color={C.sub} />
            <span style={{ fontSize: 12, color: C.sub }}>{flight.duration}</span>
            <span style={{ fontSize: 12, color: C.p600, fontWeight: 600 }}>• {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</span>
          </div>
        </div>

        {/* Segments Timeline */}
        {flight.segments.map((seg, i) => (
          <div key={i}>
            {/* Layover badge */}
            {seg.layoverBefore && (
              <div style={{ padding: "0 16px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>You may need to check in again for the connecting flight</p>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 6,
                  background: "#FEF3F2", border: `1px solid ${C.p300}`,
                }}>
                  <Clock size={10} color={C.p600} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.p600 }}>Layover {seg.layoverBefore}</span>
                </div>
                <div style={{ height: 12 }} />
              </div>
            )}

            {/* Segment Card */}
            <div style={{ padding: "0 16px", marginBottom: 16 }}>
              {/* Airline */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plane size={14} color={C.p600} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>{seg.airline}</p>
                  <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{seg.flightNo}</p>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ paddingLeft: 6 }}>
                {/* Departure */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.sText, border: "2px solid #fff" }} />
                    <div style={{ width: 1, height: 30, borderLeft: "2px dotted #D0D5DD" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>{seg.dep}</p>
                    </div>
                    <div style={{
                      flex: 1, margin: "4px 12px", padding: "4px 10px",
                      background: C.bg, borderRadius: 6,
                    }}>
                      <span style={{ fontSize: 11, color: C.sub }}>{seg.from} ({seg.fromCity})</span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                    <div style={{ width: 1, height: 4, borderLeft: "2px dotted #D0D5DD" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 4 }}>
                    <Clock size={10} color={C.inact} />
                    <span style={{ fontSize: 10, color: C.inact }}>{seg.duration}</span>
                  </div>
                </div>

                {/* Arrival */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                    <div style={{ width: 1, height: 10, borderLeft: "2px dotted #D0D5DD" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.sText, border: "2px solid #fff" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>{seg.arr}</p>
                    </div>
                    <div style={{
                      flex: 1, margin: "4px 12px", padding: "4px 10px",
                      background: C.bg, borderRadius: 6,
                    }}>
                      <span style={{ fontSize: 11, color: C.sub }}>{seg.to} ({seg.toCity})</span>
                      {seg.arrDate && seg.arrDate !== seg.date && (
                        <span style={{ fontSize: 10, color: C.inact, marginLeft: 4 }}>Arrival – {getDayName(seg.arrDate)}, {seg.arrDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ═══ Allowed Luggage ═══ */}
        <div style={{ padding: "0 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🧳</span>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>Allowed Luggage</p>
          </div>
          <div style={{ border: `1px solid ${C.div}`, borderRadius: 10, overflow: "hidden" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: C.bg, padding: "8px 12px" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>Traveler</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>Cabin</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>Check-in</span>
            </div>
            {flight.travelers.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 12px", borderTop: `1px solid ${C.div}` }}>
                <span style={{ fontSize: 12, color: C.sub }}>{t.label}</span>
                <span style={{ fontSize: 12, color: C.sub }}>{t.cabin}</span>
                <span style={{ fontSize: 12, color: C.sub }}>{t.checkin}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Web Check-in */}
        {flight.webCheckin && (
          <div style={{ padding: "0 16px", marginBottom: 16 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 20,
              border: `1.5px solid ${C.p600}`, background: C.white,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.p600 }}>Web check-in</span>
            </div>
          </div>
        )}

        {/* ═══ Cancellation Policy ═══ */}
        <div style={{ padding: "0 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: "0 0 8px" }}>Cancellation policy</p>
          <div style={{ paddingLeft: 8 }}>
            <p style={{ fontSize: 12, color: C.sub, margin: "0 0 4px" }}>• {flight.cancellation}</p>
            <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>• {flight.dateChange}</p>
          </div>
        </div>
      </div>

      {/* ═══ Sticky CTA ═══ */}
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 20,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
        padding: "12px 16px 16px", borderTop: `1px solid ${C.div}`,
      }}>
        <button
          onClick={handleSelectFlight}
          disabled={isCurrent}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: isCurrent ? C.bg : C.p600,
            color: isCurrent ? C.inact : "#fff",
            fontSize: 15, fontWeight: 700, cursor: isCurrent ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: isCurrent ? "none" : "0 4px 16px rgba(227,27,83,0.3)",
          }}
        >
          {isCurrent ? "This is your current flight" : "Select Flight"}
        </button>
      </div>
    </div>
  );
}

// Helper
function getDayName(dateStr) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const parts = dateStr.split(" ");
  const monthIdx = months.indexOf(parts[0]);
  const day = parseInt(parts[1]);
  const d = new Date(2025, monthIdx, day);
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
}
