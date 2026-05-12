import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, Receipt, FolderOpen, Ticket, ChevronRight, ChevronDown, ChevronUp,
  Share2, MapPin, Star, MessageCircle, Plane, Users, PalmtreeIcon,
  User as UserIcon, Phone, Pencil, Trash2, Plus, Bell, PlayCircle, Send,
} from "lucide-react";
import { C } from "../data";
import { getTripById, getCountdown } from "../data/tripData";
import ConsultantCard from "../components/ConsultantCard";
import AddOnsSection from "../components/AddOnsSection";

// ─── Simplified 2-tab bottom nav for trip details ───
function TripBottomNav() {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, background: C.white,
      borderTop: `1px solid ${C.div}`, display: "flex", paddingTop: 6, paddingBottom: 26, zIndex: 20,
    }}>
      {[
        { label: "Trips", icon: "🌴", to: "/trips", active: true },
        { label: "Account", icon: null, to: "/account", active: false },
      ].map(tab => (
        <Link key={tab.label} to={tab.to} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          textDecoration: "none", padding: "4px 0", position: "relative",
        }}>
          {tab.active && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 18, height: 3, borderRadius: 2, background: C.p600 }} />}
          <span style={{ fontSize: 18 }}>{tab.icon || "👤"}</span>
          <span style={{ fontSize: 10, fontWeight: tab.active ? 600 : 500, color: tab.active ? C.p600 : C.inact }}>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Chat FAB ───
function ChatFAB() {
  return (
    <button
      onClick={() => alert("Chat with your travel consultant — opens WhatsApp.")}
      aria-label="Chat with consultant"
      style={{
        position: "absolute", bottom: 140, right: 16, width: 52, height: 52,
        borderRadius: "50%", background: C.p600, border: "none", padding: 0, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
        display: "grid", placeItems: "center", lineHeight: 0,
        zIndex: 15,
      }}>
      <MessageCircle size={22} color="#fff" fill="#fff" />
    </button>
  );
}

// ─── Payment Banner (Figma-styled: gradient pink→yellow split card) ───
function PaymentBanner({ trip, navigate }) {
  const dueInstallment = trip.installments.find(i => i.status === "due");
  if (!dueInstallment && trip.amountPaid >= trip.totalPackageValue) return null;

  const nextDue = dueInstallment || trip.installments.find(i => i.status === "pending");
  if (!nextDue) return null;

  const remainingCount = trip.installments.filter(i => i.status !== "paid").length;
  const remainingLabel = `${remainingCount} Installment${remainingCount > 1 ? "s" : ""} left!`;

  return (
    <div style={{ margin: "0 0 24px" }}>
      {/* Top gradient block */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        padding: 16,
        background: "linear-gradient(90deg, #FFE6ED 0.85%, #FEF0D8 100%)",
        border: "1px solid #E0E2EB",
        borderBottom: "none",
        borderRadius: "12px 12px 0 0",
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 400, color: "#666C99", margin: "0 0 4px", lineHeight: "20px" }}>
            {remainingLabel}
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "22px" }}>
            ₹ {nextDue.amount.toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: 12, fontWeight: 400, color: "#666C99", margin: 0, lineHeight: "16px" }}>
            Due on {nextDue.date}
          </p>
        </div>
        <button
          onClick={() => navigate(`/trips/${trip.id}/payments`)}
          style={{
            display: "flex", alignItems: "center", gap: 4, background: "none",
            border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#FD014F" }}>Pay now</span>
          <ChevronRight size={16} color="#FD014F" />
        </button>
      </div>

      {/* Bottom white strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "8px 16px",
        background: C.white,
        border: "1px solid #E0E2EB",
        borderRadius: "0 0 12px 12px",
      }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#4EAC7E", lineHeight: "20px" }}>
          ₹ {trip.amountPaid.toLocaleString("en-IN")}
        </span>
        <span style={{ fontSize: 12, color: "#666C99", lineHeight: "16px" }}>Paid of</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", lineHeight: "20px" }}>
          ₹ {trip.totalPackageValue.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

// ─── Documents Section (Figma-styled: solid pink tiles with white icons) ───
function DocumentsSection({ trip, navigate }) {
  const docs = [
    {
      label: "Itinerary PDF",
      Icon: FileText,
      onClick: () => alert(`Itinerary PDF\n\nDownloading your ${trip?.destination || "trip"} itinerary…`),
    },
    {
      label: "Tickets",
      Icon: Ticket,
      onClick: () => {
        const flightCount = trip?.flights?.length || 0;
        alert(flightCount > 0
          ? `Tickets\n\n${flightCount} flight ticket(s) ready to download.`
          : "Tickets\n\nYour flight tickets will appear here once flights are confirmed.");
      },
    },
    {
      label: "Payment Receipts",
      Icon: Receipt,
      onClick: () => trip && navigate(`/trips/${trip.id}/payments`),
    },
    {
      label: "Traveler Documents",
      Icon: FolderOpen,
      onClick: () => alert(`Traveler Documents\n\nUpload IDs, visa pages, vaccination certificates here.`),
    },
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px" }}>Documents</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {docs.map(d => (
          <button key={d.label} onClick={d.onClick} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 6, padding: 0, background: "none", border: "none",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, background: C.white,
              border: "1px solid #E0E2EB",
              boxShadow: "0 4px 4px -2px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <d.Icon size={22} color="#FD014F" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 400, color: "#181E4C", textAlign: "center", lineHeight: "16px" }}>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Co-Travelers Section ───
function CoTravelersSection({ trip }) {
  const [showSheet, setShowSheet] = useState(false);
  return (
    <>
      <div style={{
        background: "#F9F9FB",
        borderTop: "1px solid #E0E2EB",
        borderBottom: "1px solid #E0E2EB",
        padding: "24px 20px",
        margin: "0 -16px 24px",
      }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "28px" }}>Manage co-travelers</h4>
        <p style={{ fontSize: 14, color: "#666C99", margin: "0 0 12px", lineHeight: "20px" }}>Invite the ones who makes every journey special.</p>
        <button
          onClick={() => setShowSheet(true)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 4 }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#FD014F" }}>Add guest</span>
          <ChevronRight size={16} color="#FD014F" />
        </button>
      </div>

      {/* Manage Guests Bottom Sheet */}
      {showSheet && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 100,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <div
            onClick={() => setShowSheet(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", animation: "fadeInBg 0.2s ease-out" }}
          />
          <div style={{
            position: "relative", background: C.white, borderRadius: "16px 16px 0 0",
            padding: "16px 20px 32px", maxHeight: "70vh", overflowY: "auto",
            animation: "sheetSlideUp 0.25s ease-out",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: C.head, margin: 0 }}>Manage Guests</h3>
              <button onClick={() => setShowSheet(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: C.bg, border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <p style={{ fontSize: 16, color: C.sub, textAlign: "center", marginBottom: 20 }}>Add the ones who makes every journey special.</p>

            {/* Lead traveler */}
            <div style={{ padding: "12px 0", borderBottom: `1px solid ${C.div}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: 0 }}>{trip.leadTraveler.name}</p>
                  <p style={{ fontSize: 14, color: C.sub, margin: "2px 0 0" }}>{trip.leadTraveler.phone}</p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#039855", background: "#ECFDF3", padding: "3px 10px", borderRadius: 20 }}>Lead traveler</span>
              </div>
            </div>

            {/* Co-travelers */}
            {trip.coTravelers.map((ct, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < trip.coTravelers.length - 1 ? `1px solid ${C.div}` : "none" }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: 0 }}>{ct.name}</p>
                <p style={{ fontSize: 14, color: C.sub, margin: "2px 0 0" }}>{ct.phone}</p>
              </div>
            ))}

            <button style={{
              width: "100%", marginTop: 20, padding: "12px 0", borderRadius: 8,
              border: `1.5px solid ${C.p600}`, background: "none", color: C.p600,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              + Add Guest
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Itinerary at Glance ───
function ItineraryGlance({ trip, setDetailTab }) {
  const [expanded, setExpanded] = useState(false);
  const days = trip.itineraryDays;
  const visibleDays = expanded ? days : days.slice(0, 2);

  return (
    <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E0E2EB" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: 0, lineHeight: "28px" }}>Itinerary at glance</h4>
        {setDetailTab && (
          <button
            onClick={() => setDetailTab("daywise")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, fontSize: 14, fontWeight: 500, color: "#FD014F" }}
          >
            Read more
          </button>
        )}
      </div>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        {visibleDays.length > 1 && (
          <div style={{
            position: "absolute", left: 5, top: 12, bottom: 12, width: 1,
            borderLeft: "1px dashed #E0E2EB",
          }} />
        )}
        {visibleDays.map((day, i) => (
          <div key={i} style={{
            position: "relative",
            paddingBottom: i < visibleDays.length - 1 ? 12 : 0,
            marginBottom: i < visibleDays.length - 1 ? 12 : 0,
            borderBottom: i < visibleDays.length - 1 ? "1px solid #E0E2EB" : "none",
          }}>
            <div style={{
              position: "absolute", left: -24, top: 4, width: 12, height: 12,
              borderRadius: "50%", background: i === 0 ? "#4EAC7E" : C.white,
              border: `2px solid ${i === 0 ? "#4EAC7E" : "#E0E2EB"}`,
            }} />
            <h5 style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", margin: "0 0 4px", lineHeight: "20px" }}>
              Day {day.day}, {day.city}
            </h5>
            <ul style={{ margin: 0, paddingLeft: 14 }}>
              {day.activities.map((a, j) => (
                <li key={j} style={{ fontSize: 12, color: "#666C99", lineHeight: "18px" }}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {days.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "flex", alignItems: "center", gap: 4, marginTop: 12,
            background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#FD014F" }}>
            {expanded ? "Hide details" : "Show all days"}
          </span>
          {expanded ? <ChevronUp size={16} color="#FD014F" /> : <ChevronDown size={16} color="#FD014F" />}
        </button>
      )}
    </div>
  );
}

// ─── Flight Cards Carousel (Figma-styled: 322px, gray header + body) ───
function FlightsSection({ flights }) {
  if (!flights || flights.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", textAlign: "center" }}>Flights</h4>
      <div className="hs" style={{ gap: 16, paddingLeft: 0, paddingRight: 16 }}>
        {flights.map(fl => (
          <div key={fl.id} style={{
            minWidth: 322, maxWidth: 322, flexShrink: 0, background: C.white,
            borderRadius: 16, boxShadow: "0 4px 4px -2px rgba(0,0,0,0.06)",
            border: "1px solid #E0E2EB", overflow: "hidden",
          }}>
            {/* Header strip: dates + times in gray */}
            <div style={{ padding: "16px 16px 12px", background: "#F9F9FB", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#666C99", lineHeight: "20px" }}>{fl.date}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#181E4C", lineHeight: "22px" }}>{fl.departTime}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: "#666C99", lineHeight: "20px" }}>{fl.date}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#181E4C", lineHeight: "22px" }}>{fl.arriveTime}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Airline row */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: "1px solid #E0E2EB" }}>
                <div style={{
                  width: 28, height: 20, borderRadius: 4, background: "#F4F2F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#666C99",
                }}>
                  {fl.airlineLogo}
                </div>
                <span style={{ fontSize: 14, color: "#181E4C", lineHeight: "20px" }}>{fl.airline}</span>
              </div>

              {/* Route */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#181E4C", lineHeight: "28px" }}>{fl.from.code}</div>
                  <div style={{ fontSize: 14, color: "#FD014F", lineHeight: "20px" }}>{fl.from.city}</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 12, color: "#181E4C", lineHeight: "16px" }}>{fl.duration}</div>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ flex: 1, height: 0, borderTop: "1px dashed #E0E2EB" }} />
                    <Plane size={16} color="#FDA201" style={{ transform: "rotate(90deg)" }} />
                    <div style={{ flex: 1, height: 0, borderTop: "1px dashed #E0E2EB" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#181E4C", lineHeight: "16px" }}>
                    {fl.stops === "Direct" ? "Direct" : fl.stops}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#181E4C", lineHeight: "28px" }}>{fl.to.code}</div>
                  <div style={{ fontSize: 14, color: "#FD014F", lineHeight: "20px" }}>{fl.to.city}</div>
                </div>
              </div>

              {/* Baggage table */}
              <div style={{ borderTop: "1px solid #E0E2EB", paddingTop: 10 }}>
                <div style={{ display: "flex", gap: 0, fontSize: 12, color: "#666C99", marginBottom: 6 }}>
                  <span style={{ flex: 1 }}>Baggage</span>
                  <span style={{ flex: 1, textAlign: "center" }}>Cabin</span>
                  <span style={{ flex: 1, textAlign: "right" }}>Check-in</span>
                </div>
                {fl.baggage.map((b, i) => (
                  <div key={i} style={{ display: "flex", fontSize: 12, color: "#181E4C", marginBottom: 2 }}>
                    <span style={{ flex: 1 }}>{b.traveler}</span>
                    <span style={{ flex: 1, textAlign: "center" }}>{b.cabin}</span>
                    <span style={{ flex: 1, textAlign: "right" }}>{b.checkin}</span>
                  </div>
                ))}
              </div>

              {/* Web check-in */}
              <button
                onClick={() => alert("Web check-in opens 48 hours before departure.")}
                style={{
                  width: "100%", padding: "10px 0", borderRadius: 40,
                  border: "1.5px solid #FD014F", background: "none", color: "#FD014F",
                  fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                }}>
                Web check-in
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hotel Cards Carousel (Figma-styled: Day label above, rating + Booking.com badge) ───
function HotelsSection({ hotels, tripId }) {
  const navigate = useNavigate();
  if (!hotels || hotels.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px" }}>Hotels</h4>
      <div className="hs" style={{ gap: 12, paddingLeft: 0, paddingRight: 16 }}>
        {hotels.map((ht, idx) => (
          <div key={ht.id} style={{ minWidth: 280, maxWidth: 300, flexShrink: 0 }}>
            {/* Day label above the card */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#181E4C", lineHeight: "22px" }}>{ht.dayRange}</div>
              <div style={{ fontSize: 14, color: "#666C99", lineHeight: "20px" }}>{ht.city}</div>
            </div>
            {/* Card */}
            <div
              onClick={() => tripId && navigate(`/trips/${tripId}/hotel/${idx}`)}
              style={{
                background: C.white, borderRadius: 12, overflow: "hidden",
                filter: "drop-shadow(0 4px 16px rgba(15,23,42,0.06))",
                cursor: tripId ? "pointer" : "default",
              }}>
              {/* Image with rating + booking badge overlay */}
              <div style={{ position: "relative", padding: 8, background: C.white }}>
                <img
                  src={ht.photo || ht.fallbackPhoto}
                  alt={ht.name}
                  style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: "8px 8px 0 0", display: "block" }}
                  onError={(e) => { e.target.src = ht.fallbackPhoto; }}
                />
                {/* Star rating badge bottom-left */}
                <div style={{
                  position: "absolute", left: 16, bottom: 16,
                  display: "flex", alignItems: "center", padding: "0 6px",
                  background: "rgba(255,255,255,0.9)", border: "1px solid #fff",
                  borderRadius: "0 4px",
                  height: 22,
                }}>
                  <Star size={14} fill="#4EAC7E" color="#4EAC7E" strokeWidth={0} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#4EAC7E", marginLeft: 2 }}>{ht.stars} star hotel</span>
                </div>
                {/* Booking.com rating badge bottom-right */}
                <div style={{
                  position: "absolute", right: 16, bottom: 16,
                  display: "flex", alignItems: "center", gap: 4, padding: "0 8px",
                  background: "rgba(255,255,255,0.95)", border: "1px solid #fff",
                  borderRadius: "0 4px",
                  height: 22,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#003580", background: "#003580", color: "#fff", padding: "1px 3px", borderRadius: 2 }}>B</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#181E4C" }}>{ht.bookingRating} Rated</span>
                </div>
              </div>
              {/* Body */}
              <div style={{ padding: "8px 12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                  <h5 style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: "20px", flex: 1 }}>{ht.name}</h5>
                  {ht.price && (
                    <span style={{ fontSize: 12, color: "#666C99", lineHeight: "16px", whiteSpace: "nowrap" }}>{ht.price}</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#666C99", margin: "0 0 4px", lineHeight: "16px" }}>{ht.roomType}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={14} color="#666C99" />
                  <span style={{ fontSize: 12, color: "#666C99", lineHeight: "16px" }}>{ht.city}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 30 Sundays Pass promo card ───
function ThirtySundaysPass({ trip }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "#FFE6ED",
      padding: "24px 20px",
      margin: "0 -16px 24px",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {/* Decorative blob */}
      <div style={{
        position: "absolute", width: 201, height: 201, left: -96, top: -93,
        background: "#F8BACC", opacity: 0.5, borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "28px" }}>
          30 Sundays Pass
        </h4>
        <p style={{ fontSize: 14, color: "#666C99", margin: "0 0 12px", lineHeight: "20px" }}>
          Unlock perks on your next trip — priority support, free upgrades, exclusive experiences.
        </p>
        <button
          onClick={() => alert("30 Sundays Pass — coming soon for early customers.")}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#FD014F" }}>View details</span>
          <ChevronRight size={16} color="#FD014F" />
        </button>
      </div>
      <div style={{
        width: 80, height: 80, borderRadius: 16,
        background: "linear-gradient(135deg, #FD014F 0%, #DA0143 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40, flexShrink: 0, position: "relative", zIndex: 1,
        boxShadow: "0 8px 24px rgba(253,1,79,0.3)",
      }}>
        🎫
      </div>
    </div>
  );
}

// ─── Journey Map (Figma-styled with floating "View on map" pill) ───
function JourneyMap({ cities }) {
  if (!cities || cities.length === 0) return null;
  const handleViewMap = () => {
    const q = cities.map(c => c.name).join(",");
    window.open(`https://www.google.com/maps/dir/${encodeURIComponent(q)}`, "_blank");
  };
  return (
    <div style={{
      background: C.white, padding: "24px 20px", margin: "0 -16px 0",
      borderTop: "1px solid #E0E2EB", borderBottom: "1px solid #E0E2EB",
    }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", textAlign: "center", lineHeight: "28px" }}>
        Journey map
      </h4>
      <div style={{
        height: 244, borderRadius: 16, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg, #E1F5EE 0%, #D1E9FF 50%, #EBE9FE 100%)",
      }}>
        {/* City markers */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "space-evenly", padding: "0 20px",
        }}>
          {cities.map((c, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                background: "#FD014F", color: "#fff", borderRadius: 20, padding: "4px 12px",
                fontSize: 12, fontWeight: 600, boxShadow: "0 2px 8px rgba(253,1,79,0.3)",
              }}>
                {c.number}. {c.name}
              </div>
              <MapPin size={20} color="#FD014F" />
            </div>
          ))}
        </div>
        <div style={{
          position: "absolute", top: "50%", left: "15%", right: "15%", height: 0,
          borderTop: "2px dashed rgba(253,1,79,0.25)",
        }} />
        {/* View on map pill */}
        <button
          onClick={handleViewMap}
          style={{
            position: "absolute", bottom: 16, right: 16, background: C.white,
            border: "1px solid #E0E2EB", borderRadius: 40,
            padding: "8px 16px", display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
          <MapPin size={16} color="#181E4C" />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#181E4C" }}>View on map</span>
        </button>
      </div>
    </div>
  );
}

// ─── Before You Go Accordion ───
// ─── Before You Go: Sub-sections ───

function MoneySimContent({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.2s ease-out" }}>
      {/* Currency rates row */}
      {data.currencyRates && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {data.currencyRates.map((r, i) => (
            <div key={i} style={{
              flex: 1, background: C.bg, borderRadius: 10, padding: "10px 8px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: 11, color: C.sub, margin: "0 0 2px" }}>{r.label}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0 }}>{r.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Forex section */}
      {data.forex && (
        <div style={{ marginBottom: 20 }}>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{"\uD83D\uDCB1"}</span> Forex
          </h5>
          <p style={{ fontSize: 14, color: C.sub, margin: "0 0 12px", lineHeight: "21px" }}>{data.forex.intro}</p>
          <div style={{
            background: C.bg, borderRadius: 10, padding: 14, marginBottom: 12,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {data.forex.options.map((opt, i) => (
              <p key={i} style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "21px" }}>
                <span style={{ marginRight: 6 }}>{opt.icon}</span>{opt.text}
              </p>
            ))}
          </div>
          {data.forex.warning && (
            <div style={{
              background: "#FFFAEB", borderRadius: 10, padding: 14,
              borderLeft: `3px solid #F79009`,
            }}>
              <p style={{ fontSize: 13, color: "#B54708", margin: 0, lineHeight: "20px" }}>
                <span style={{ marginRight: 4 }}>{"\u26A0\uFE0F"}</span> {data.forex.warning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SIM section */}
      {data.sim && (
        <div>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{"\uD83D\uDCF1"}</span> {data.sim.title || "SIM & Connectivity"}
          </h5>
          <p style={{ fontSize: 14, color: C.sub, margin: "0 0 12px", lineHeight: "21px" }}>{data.sim.intro}</p>
          <div style={{
            background: C.bg, borderRadius: 10, padding: 14,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {data.sim.options.map((opt, i) => (
              <p key={i} style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "21px" }}>
                <span style={{ marginRight: 6 }}>{opt.icon}</span>{opt.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for simple items */}
      {data.items && !data.currencyRates && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: C.sub, lineHeight: "22px", marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PackingContent({ data }) {
  const [items, setItems] = useState(data.checklist || []);
  const [newItem, setNewItem] = useState("");

  const toggleCheck = (idx) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, checked: !it.checked } : it));
  };
  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems(prev => [...prev, { item: newItem.trim(), emoji: "\uD83D\uDD0C", person: "essential", checked: false }]);
    setNewItem("");
  };

  const checkedCount = items.filter(c => c.checked).length;

  return (
    <div style={{ animation: "fadeUp 0.2s ease-out" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "11px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${C.div}` : "none",
          }}>
            <input
              type="checkbox"
              checked={it.checked}
              onChange={() => toggleCheck(i)}
              style={{ accentColor: C.p600, width: 18, height: 18, flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: 16, flexShrink: 0 }}>{it.emoji}</span>
            <span style={{
              flex: 1, fontSize: 14, color: it.checked ? C.inact : C.head,
              textDecoration: it.checked ? "line-through" : "none",
            }}>
              {it.item}
            </span>
            <Pencil size={16} color={C.inact} style={{ cursor: "pointer", flexShrink: 0 }} />
            <Trash2 size={16} color={C.inact} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => removeItem(i)} />
          </div>
        ))}
      </div>

      {/* Add item row */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          placeholder="Add item..."
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addItem()}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.div}`,
            fontSize: 14, fontFamily: "inherit", outline: "none", color: C.head,
          }}
        />
        <button onClick={addItem} style={{
          padding: "10px 20px", borderRadius: 8, background: C.p600, color: "#fff",
          border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>
          Add
        </button>
      </div>

      {/* Progress */}
      <p style={{ fontSize: 12, color: C.sub, margin: "10px 0 0" }}>
        {checkedCount}/{items.length} packed
      </p>
    </div>
  );
}

function AtDestinationContent({ data }) {
  const [showVeg, setShowVeg] = useState(false);

  return (
    <div style={{ animation: "fadeUp 0.2s ease-out" }}>
      {/* Arrival steps */}
      {data.arrivalSteps && (
        <div style={{ marginBottom: 24 }}>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{"\uD83C\uDFF3\uFE0F"}</span> Arrival steps
          </h5>
          <div style={{
            display: "flex", flexDirection: "column", gap: 0,
            borderLeft: `2px solid ${C.div}`, marginLeft: 16, paddingLeft: 20,
          }}>
            {data.arrivalSteps.map((step, i) => (
              <div key={i} style={{
                position: "relative", paddingBottom: i < data.arrivalSteps.length - 1 ? 18 : 0,
              }}>
                {/* Dot on timeline */}
                <div style={{
                  position: "absolute", left: -29, top: 2,
                  width: 28, height: 28, borderRadius: "50%",
                  background: C.bg, border: `2px solid ${C.div}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                }}>
                  {step.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food & Dining */}
      {data.foodDining && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{"\uD83C\uDF5B"}</span> {data.foodDining.title}
            </h5>
            <button
              onClick={() => setShowVeg(!showVeg)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "6px 12px", borderRadius: 20,
                border: `1px solid ${showVeg ? "#039855" : C.div}`,
                background: showVeg ? "#ECFDF3" : C.white,
                cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                color: showVeg ? "#039855" : C.sub, fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 14 }}>{"\uD83C\uDF31"}</span> Show veg
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.foodDining.dishes
              .filter(d => !showVeg || d.veg)
              .map((dish, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.div}` : "none",
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{dish.name}</span>
                    <span style={{ fontSize: 13, color: C.sub, marginLeft: 8 }}>{dish.description}</span>
                  </div>
                  {dish.veg && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "#039855",
                      background: "#ECFDF3", padding: "2px 8px", borderRadius: 4,
                      border: `1px solid #C0E5D5`, flexShrink: 0,
                    }}>
                      VEG
                    </span>
                  )}
                </div>
              ))}
          </div>
          {data.foodDining.tip && (
            <div style={{
              background: "#FFFAEB", borderRadius: 10, padding: 14, marginTop: 12,
              borderLeft: `3px solid #F79009`,
            }}>
              <p style={{ fontSize: 13, color: "#B54708", margin: 0, lineHeight: "20px" }}>
                <span style={{ marginRight: 4 }}>{"\u26A0\uFE0F"}</span> {data.foodDining.tip}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fallback for simple items */}
      {data.items && !data.arrivalSteps && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: C.sub, lineHeight: "22px", marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GoodToKnowContent({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.2s ease-out" }}>
      {data.sections ? data.sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: i < data.sections.length - 1 ? 20 : 0 }}>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{sec.icon}</span> {sec.title}
          </h5>
          {sec.text && (
            <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "22px" }}>{sec.text}</p>
          )}
          {sec.items && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sec.items.map((it, j) => (
                <div key={j} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: j < sec.items.length - 1 ? `1px solid ${C.div}` : "none",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{it.phrase}</span>
                  <span style={{ fontSize: 13, color: C.sub }}>{it.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )) : data.items && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: C.sub, lineHeight: "22px", marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
      {data.electricityNote && (
        <div style={{
          background: C.bg, borderRadius: 10, padding: 14, marginTop: 16,
        }}>
          <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "20px" }}>
            {"\uD83D\uDD0C"} {data.electricityNote}
          </p>
        </div>
      )}
    </div>
  );
}

function EmergencyContactsContent({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.2s ease-out" }}>
      {/* Screenshot warning */}
      {data.screenshotWarning && (
        <div style={{
          background: "#FEF3F2", borderRadius: 8, padding: "10px 14px", marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: "#B42318", margin: 0, fontWeight: 500 }}>
            {"\u26A0\uFE0F"} {data.screenshotWarning}
          </p>
        </div>
      )}

      {/* Emergency numbers grid */}
      {data.numbers && (
        <div style={{ marginBottom: 20 }}>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{"\uD83D\uDCDE"}</span> Emergency Numbers
          </h5>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          }}>
            {data.numbers.map((n, i) => (
              <div key={i} style={{
                background: C.bg, borderRadius: 10, padding: "12px 14px",
                ...(i === data.numbers.length - 1 && data.numbers.length % 2 !== 0 ? { gridColumn: "1 / 2" } : {}),
              }}>
                <p style={{ fontSize: 11, color: C.sub, margin: "0 0 4px", textTransform: "capitalize" }}>{n.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: C.p600, margin: 0 }}>{n.number}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hospitals */}
      {data.hospitals && (
        <div>
          <h5 style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{"\uD83C\uDFE5"}</span> Hospitals
          </h5>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.hospitals.map((h, i) => (
              <div key={i} style={{
                background: C.bg, borderRadius: 10, padding: 14,
              }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>{h.name}</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <a href={`tel:${h.phone}`} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "6px 14px", borderRadius: 6,
                    background: C.white, border: `1px solid ${C.div}`,
                    textDecoration: "none", fontSize: 13, fontWeight: 600, color: C.b600,
                    cursor: "pointer",
                  }}>
                    <Phone size={14} color={C.b600} /> Call
                  </a>
                  <a href={h.mapUrl} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "6px 14px", borderRadius: 6,
                    background: C.white, border: `1px solid ${C.div}`,
                    textDecoration: "none", fontSize: 13, fontWeight: 600, color: C.p600,
                    cursor: "pointer",
                  }}>
                    <MapPin size={14} color={C.p600} /> Map
                  </a>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>{h.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback for simple items */}
      {data.items && !data.numbers && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.items.map((item, j) => (
            <li key={j} style={{ fontSize: 14, color: C.sub, lineHeight: "22px", marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BeforeYouGo({ data }) {
  const [openIdx, setOpenIdx] = useState(-1);
  if (!data) return null;

  const sections = [
    { key: "moneySim", ...data.moneySim },
    { key: "packing", ...data.packing },
    { key: "atDestination", ...data.atDestination },
    { key: "goodToKnow", ...data.goodToKnow },
    { key: "emergencyContacts", ...data.emergencyContacts },
  ].filter(s => s.title);

  const renderContent = (sec) => {
    switch (sec.key) {
      case "moneySim": return <MoneySimContent data={data.moneySim} />;
      case "packing": return <PackingContent data={data.packing} />;
      case "atDestination": return <AtDestinationContent data={data.atDestination} />;
      case "goodToKnow": return <GoodToKnowContent data={data.goodToKnow} />;
      case "emergencyContacts": return <EmergencyContactsContent data={data.emergencyContacts} />;
      default: return null;
    }
  };

  return (
    <div style={{
      background: "#F9F9FB",
      padding: "24px 20px",
      margin: "0 -16px 0",
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "28px" }}>Before you go</h3>
      <p style={{ fontSize: 14, color: "#666C99", margin: "0 0 16px", lineHeight: "20px" }}>Everything you need before your trip</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sections.map((sec, i) => (
          <div key={sec.key} style={{
            background: C.white, borderRadius: 12, overflow: "hidden",
            border: `1px solid ${C.div}`,
          }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: 16, background: "none", border: "none", cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: C.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>
                {sec.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: 0 }}>{sec.title}</h5>
                <p style={{ fontSize: 13, color: C.sub, margin: "2px 0 0" }}>{sec.subtitle}</p>
              </div>
              {openIdx === i ? <ChevronUp size={20} color={C.sub} /> : <ChevronRight size={20} color={C.sub} />}
            </button>
            {openIdx === i && (
              <div style={{ padding: "0 16px 16px" }}>
                {renderContent(sec)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Day Wise Tab ───
// ─── Day-wise tab (Figma redesign) ───
function getDirectionUrl(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

function DatePicker({ days, selectedDay, onSelect }) {
  return (
    <div className="hs" style={{
      gap: 8, padding: "12px 20px", background: C.white,
      position: "sticky", top: 0, zIndex: 5,
    }}>
      {days.map((d, i) => {
        const active = i === selectedDay;
        const dateObj = new Date(d.date);
        const dayNum = dateObj.getDate();
        const monthShort = dateObj.toLocaleDateString("en-US", { month: "short" });
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              width: 56, height: 54, flexShrink: 0,
              borderRadius: 12, padding: 8,
              border: active ? "none" : "1px solid #E0E2EB",
              background: active ? "#FD014F" : C.white, cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "22px", color: active ? "#fff" : "#181E4C" }}>{dayNum}</span>
            <span style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: active ? "#fff" : "#181E4C" }}>{monthShort}</span>
          </button>
        );
      })}
    </div>
  );
}

function DayHero({ day }) {
  const hero = day.activities?.[0]?.photo;
  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{
        width: "100%", aspectRatio: "16/9", borderRadius: 12,
        background: hero ? `url(${hero}) center/cover no-repeat` : "#F4F2F0",
        marginBottom: 16,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "22px" }}>
            Day {day.dayNumber}, {day.city}
          </h3>
          <p style={{ fontSize: 12, fontWeight: 400, color: "#181E4C", margin: 0, lineHeight: "16px" }}>
            {day.activities?.length || 0} experience{day.activities?.length === 1 ? "" : "s"} planned
          </p>
        </div>
        <a
          href={getDirectionUrl(`${day.city}`)}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            background: C.white, border: "1px solid #E0E2EB", borderRadius: 40,
            color: "#181E4C", fontSize: 14, fontWeight: 500, textDecoration: "none",
          }}
        >
          <MapPin size={16} color="#181E4C" />
          Map
        </a>
      </div>
    </div>
  );
}

function ActivityCards({ activities, city }) {
  if (!activities?.length) return null;
  return (
    <div style={{
      background: "#F9F9FB", borderTop: "1px solid #E0E2EB",
      borderRadius: "16px 16px 0 0",
      margin: "24px 0 0",
      padding: "24px 20px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {activities.map((act, i) => {
          const mins = (i + 1) * 30 + 75;
          const dur = `${Math.floor(mins / 60)}:${(mins % 60).toString().padStart(2, "0")}`;
          return (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{
                position: "relative", width: 175, height: 120, flexShrink: 0,
                borderRadius: 8, overflow: "hidden",
                background: act.photo ? `url(${act.photo}) center/cover no-repeat` : "#F4F2F0",
              }}>
                <div style={{
                  position: "absolute", left: 116, top: 90,
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 6px", background: "#181E4C",
                  boxShadow: "inset -1px -1px 4px rgba(255,255,255,0.25)",
                  borderRadius: 4,
                }}>
                  <PlayCircle size={12} color="#fff" strokeWidth={1.8} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: "#fff", lineHeight: "14px" }}>{dur}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 2 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#181E4C", margin: "0 0 4px", lineHeight: "20px" }}>{act.title}</p>
                  <p style={{
                    fontSize: 12, color: "#666C99", margin: 0, lineHeight: "16px",
                    overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                  }}>{act.description}</p>
                </div>
                <a
                  href={getDirectionUrl(`${act.venue}, ${city}`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, fontWeight: 600, color: "#FD014F", marginTop: 8, textDecoration: "none" }}
                >
                  Get direction
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayHotelCard({ hotel, trip }) {
  const navigate = useNavigate();
  if (!hotel) return null;
  // Match day's hotel to trip.hotels by name to get the right index for navigation
  const matchIdx = trip?.hotels?.findIndex(h => h.name === hotel.name);
  const canNavigate = trip && matchIdx !== undefined && matchIdx >= 0;
  return (
    <div style={{ background: C.white, padding: "24px 20px" }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", lineHeight: "28px" }}>Your stay</h4>
      <div
        onClick={() => canNavigate && navigate(`/trips/${trip.id}/hotel/${matchIdx}`)}
        style={{
          borderRadius: 12, overflow: "hidden",
          filter: "drop-shadow(0 4px 16px rgba(15,23,42,0.06))",
          cursor: canNavigate ? "pointer" : "default",
        }}>
        <div style={{ position: "relative", padding: 8, background: C.white }}>
          <div style={{
            width: "100%", aspectRatio: "16/10", borderRadius: "8px 8px 0 0",
            background: hotel.photo ? `url(${hotel.photo}) center/cover no-repeat` : "#F4F2F0",
          }} />
          <div style={{
            position: "absolute", left: 16, bottom: 16,
            display: "flex", alignItems: "center", padding: "0 6px",
            background: "rgba(255,255,255,0.9)", border: "1px solid #fff",
            borderRadius: "0 4px", height: 22,
          }}>
            <Star size={14} fill="#4EAC7E" color="#4EAC7E" strokeWidth={0} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#4EAC7E", marginLeft: 2 }}>{hotel.stars} star hotel</span>
          </div>
          <div style={{
            position: "absolute", right: 16, bottom: 16,
            display: "flex", alignItems: "center", gap: 4, padding: "0 8px",
            background: "rgba(255,255,255,0.95)", border: "1px solid #fff",
            borderRadius: "0 4px", height: 22,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, background: "#003580", color: "#fff", padding: "1px 3px", borderRadius: 2 }}>B</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#181E4C" }}>{hotel.bookingRating} Rated</span>
          </div>
        </div>
        <div style={{ padding: "8px 12px 16px" }}>
          <h5 style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: "0 0 4px", lineHeight: "20px" }}>{hotel.name}</h5>
          <p style={{ fontSize: 12, color: "#666C99", margin: "0 0 4px", lineHeight: "16px" }}>{hotel.roomType}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={14} color="#666C99" />
            <span style={{ fontSize: 12, color: "#666C99", lineHeight: "16px" }}>{hotel.city}</span>
          </div>
        </div>
      </div>
      <a
        href={getDirectionUrl(`${hotel.name}, ${hotel.city}`)}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "8px 24px", marginTop: 16,
          background: C.white, border: "1px solid #E0E2EB",
          boxShadow: "0 4px 12px -4px #E0E2EB",
          borderRadius: 40, color: "#FD014F", textDecoration: "none",
          fontSize: 14, fontWeight: 500,
        }}
      >
        <MapPin size={20} color="#FD014F" />
        Get direction
      </a>
    </div>
  );
}

function HighlightsSubsection({ title, items }) {
  return (
    <div>
      <h5 style={{ fontSize: 16, fontWeight: 500, color: "#181E4C", margin: "0 0 12px", lineHeight: "22px" }}>{title}</h5>
      <div className="hs" style={{ gap: 16, paddingRight: 16 }}>
        {items.map((it, i) => (
          <div key={i} style={{ width: 110, flexShrink: 0 }}>
            <div style={{
              width: 110, height: 100, borderRadius: 8,
              background: it.photo ? `url(${it.photo}) center/cover no-repeat` : "#F4F2F0",
              marginBottom: 8,
            }} />
            <p style={{ fontSize: 12, fontWeight: 500, color: "#0F172A", margin: "0 0 2px", lineHeight: "18px" }}>{it.title}</p>
            <p style={{ fontSize: 10, color: "#666C99", margin: 0, lineHeight: "12px" }}>{it.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HighlightsSection({ day }) {
  // Mock highlights drawn from activities (cuisine + must-try)
  const items = day.activities?.map((a, i) => ({
    title: a.title,
    caption: a.venue,
    photo: a.photo,
  })) || [];
  const restaurants = day.restaurants?.map(r => ({
    title: r.name,
    caption: r.cuisine || r.priceRange || r.city,
    photo: r.photo,
  })) || [];

  if (items.length === 0 && restaurants.length === 0) return null;

  return (
    <div style={{ background: C.white, padding: "24px 20px" }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", lineHeight: "28px" }}>Highlights</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.length > 0 && <HighlightsSubsection title="Must-do today" items={items} />}
        {restaurants.length > 0 && <HighlightsSubsection title="Where to eat" items={restaurants} />}
      </div>
    </div>
  );
}

function AIChatbotCard() {
  return (
    <div style={{ background: C.white, padding: "16px 20px" }}>
      <div style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", gap: 16,
        padding: 12, background: "#FFF0F4", borderRadius: 12,
      }}>
        <div style={{
          position: "absolute", width: 80, height: 80, left: 9, top: "calc(50% - 40px)",
          background: "#F8BACC", opacity: 0.5, borderRadius: "50%", filter: "blur(3px)",
          pointerEvents: "none",
        }} />
        <div style={{
          width: 72, height: 74, flexShrink: 0, position: "relative", zIndex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 56,
        }}>
          😄
        </div>
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <h5 style={{ fontSize: 16, fontWeight: 500, color: "#181E4C", margin: "0 0 4px", lineHeight: "22px" }}>AI Chatbot</h5>
          <p style={{ fontSize: 12, color: "#666C99", margin: "0 0 12px", lineHeight: "16px" }}>
            Get personalised recommendations for things to do, areas to explore and much more in seconds.
          </p>
          <button
            onClick={() => alert("AI Chatbot — coming soon. Ask anything about your trip.")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 24px",
              background: "#FD014F", boxShadow: "0 4px 16px -2px rgba(253,1,79,0.25)",
              border: "none", borderRadius: 40, cursor: "pointer", fontFamily: "inherit",
              color: "#fff", fontSize: 14, fontWeight: 500,
            }}
          >
            Try now
            <Send size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    name: "Nishant",
    avatar: "https://i.pravatar.cc/64?img=12",
    text: "They don't suggest over touristy places like others. Their Jatiluwih terraces + Beach love combination in Bali is a must try for every couple. We had a great time enjoying the sunset sitting on Bean bags from a cliff overlooking an ocean. No other travel agent understands Couples like this!",
    photos: [
      "https://cdn.30sundays.club/app_content/bali/bali_swing_experience_1.jpg",
      "https://cdn.30sundays.club/app_content/bali/tegallalang_rice_fields_4.jpg",
      "https://cdn.30sundays.club/app_content/bali/banyumala_waterfall_56.jpg",
    ],
  },
  {
    name: "Ruby",
    avatar: "https://i.pravatar.cc/64?img=47",
    text: "Every trip has small hiccups. What we loved about 30 Sundays was that they respond to every request within minutes. When I travel with 30 Sundays, I know they have our back always :)",
    photos: [
      "https://cdn.30sundays.club/app_content/thailand/pileh_lagoon_439.jpg",
      "https://cdn.30sundays.club/app_content/thailand/long_beach_koh_phi_phi_468.jpg",
      "https://cdn.30sundays.club/app_content/thailand/big_buddha_temple_koh_samui_459.jpg",
    ],
  },
];

function ReviewsSection() {
  const [expanded, setExpanded] = useState({});
  return (
    <div style={{ background: C.white, padding: "24px 20px" }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", lineHeight: "28px" }}>Reviews</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MOCK_REVIEWS.map((r, idx) => {
          const isOpen = expanded[idx];
          const previewText = isOpen ? r.text : r.text.slice(0, 200) + (r.text.length > 200 ? "…" : "");
          return (
            <div key={idx} style={{ paddingBottom: 16, borderBottom: idx < MOCK_REVIEWS.length - 1 ? "1px solid #E0E2EB" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <img src={r.avatar} alt={r.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                <p style={{ fontSize: 16, fontWeight: 500, color: "#090C10", margin: 0, lineHeight: "22px" }}>{r.name}</p>
              </div>
              <p style={{ fontSize: 14, color: "#666C99", margin: "0 0 8px", lineHeight: "20px" }}>{previewText}</p>
              {r.text.length > 200 && (
                <button
                  onClick={() => setExpanded(s => ({ ...s, [idx]: !s[idx] }))}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", color: "#FD014F", fontSize: 14, fontWeight: 500, marginBottom: 16 }}
                >
                  {isOpen ? "Show less" : "Read more"}
                </button>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                {r.photos.map((p, i) => (
                  <div key={i} style={{
                    flex: 1, aspectRatio: "1", borderRadius: 8,
                    background: `url(${p}) center/cover no-repeat`,
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayWiseTab({ trip }) {
  const days = trip.dayWise;
  const [selectedDay, setSelectedDay] = useState(0);

  if (!days || days.length === 0) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 16, color: "#666C99" }}>Day-wise details will appear once your itinerary is finalized.</p>
      </div>
    );
  }

  const day = days[selectedDay] || days[0];

  return (
    <div style={{ background: C.white }}>
      <DatePicker days={days} selectedDay={selectedDay} onSelect={setSelectedDay} />
      <DayHero day={day} />
      <ActivityCards activities={day.activities} city={day.city} />
      <DayHotelCard hotel={day.hotel} trip={trip} />
      <HighlightsSection day={day} />
      <AIChatbotCard />
      <ReviewsSection />
      <div style={{ padding: "0 16px" }}>
        <JourneyMap cities={trip.journeyMapCities} />
      </div>
    </div>
  );
}

// ─── Main Trip Details Page ───
export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = getTripById(tripId);
  const [detailTab, setDetailTab] = useState("details");

  if (!trip) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: C.sub }}>Trip not found</p>
        <button onClick={() => navigate("/trips")} style={{ marginTop: 16, color: C.p600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Back to My Trips
        </button>
      </div>
    );
  }

  const countdown = getCountdown(trip.startDate);
  const isCompleted = trip.status === "completed";

  return (
    <div style={{ background: C.white, minHeight: "100%", paddingBottom: 24 }}>
      {/* ─── Header with ambient gradient blobs ─── */}
      <div style={{
        position: "relative", background: "#F4F2F0",
        padding: "8px 20px 16px", overflow: "hidden",
      }}>
        {/* Ambient blurs */}
        <div style={{
          position: "absolute", width: 288, height: 162, right: -78, top: -29,
          background: "#FD014F", opacity: 0.18, filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 288, height: 162, left: -216, top: -29,
          background: "#FED180", opacity: 0.4, filter: "blur(70px)", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, position: "relative" }}>
          {/* Back button */}
          <button
            onClick={() => navigate("/trips")}
            style={{
              width: 24, height: 24, background: "none", border: "none", padding: 0,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: 2,
            }}
          >
            <ArrowLeft size={20} color="#181E4C" />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, color: "#0F172A", margin: "0 0 4px", lineHeight: "22px" }}>
              Your {trip.destination} Trip {trip.emoji}
            </h2>
            <p style={{ fontSize: 14, fontWeight: 400, color: "#666C99", margin: "0 0 8px", lineHeight: "20px" }}>
              {trip.startDateDisplay} – {trip.endDateDisplay}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {countdown && (
                <span style={{
                  fontSize: 12, fontWeight: 400, color: "#FD014F",
                  background: "#FFE6ED", border: "1px solid #F8BACC",
                  padding: "4px 8px", borderRadius: 8, lineHeight: "16px",
                }}>
                  Starts in {countdown}
                </span>
              )}
              {trip.status === "ongoing" && (
                <span style={{
                  fontSize: 12, fontWeight: 400, color: "#FD014F",
                  background: "#FFE6ED", border: "1px solid #F8BACC",
                  padding: "4px 8px", borderRadius: 8, lineHeight: "16px",
                }}>
                  Ongoing
                </span>
              )}
              {isCompleted && (
                <span style={{
                  fontSize: 12, fontWeight: 400, color: "#4EAC7E",
                  background: "#E6F4EC", border: "1px solid #BBE3CA",
                  padding: "4px 8px", borderRadius: 8, lineHeight: "16px",
                }}>
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Bell */}
          <button style={{
            width: 28, height: 28, borderRadius: 14, background: C.white,
            border: "1px solid #E0E2EB", padding: 0, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 2, flexShrink: 0,
          }}>
            <Bell size={16} color="#666C99" />
          </button>
        </div>
      </div>

      {/* ─── Tab bar ─── */}
      <div style={{
        display: "flex", gap: 16, background: "#F9F9FB",
        borderBottom: "1px solid #E0E2EB",
        padding: "12px 20px 0", position: "sticky", top: 0, zIndex: 10,
      }}>
        {["details", "daywise"].map(t => {
          const active = detailTab === t;
          return (
            <button
              key={t}
              onClick={() => setDetailTab(t)}
              style={{
                padding: "0 0 12px", border: "none", background: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                color: active ? "#FD014F" : "#181E4C",
                borderBottom: active ? "2px solid #FD014F" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t === "details" ? "Trip details" : "Day wise"}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {detailTab === "details" ? (
        <div style={{ padding: 16 }}>
          {/* Payment banner (hide for completed) */}
          {!isCompleted && <PaymentBanner trip={trip} navigate={navigate} />}

          <DocumentsSection trip={trip} navigate={navigate} />
          {trip.addOns && <AddOnsSection addOns={trip.addOns} />}
          <CoTravelersSection trip={trip} />
          <ItineraryGlance trip={trip} setDetailTab={setDetailTab} />
          <FlightsSection flights={trip.flights} />
          {trip.consultant && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>
                {isCompleted ? "Your trip manager" : "Your trip manager"}
              </h4>
              <ConsultantCard
                consultant={trip.consultant}
                role="Your trip manager"
                context={`my ${trip.destination} trip (${trip.startDateDisplay}–${trip.endDateDisplay})`}
              />
            </div>
          )}
          <HotelsSection hotels={trip.hotels} tripId={trip.id} />
          <ThirtySundaysPass trip={trip} />
          <JourneyMap cities={trip.journeyMapCities} />

          {/* Before You Go (hide for completed) */}
          {!isCompleted && trip.beforeYouGo && <BeforeYouGo data={trip.beforeYouGo} />}

          {/* Completed trip CTA */}
          {isCompleted && (
            <div style={{
              background: C.white, borderRadius: 12, padding: 20, textAlign: "center",
              border: `1px solid ${C.div}`,
            }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>How was your trip?</h4>
              <p style={{ fontSize: 14, color: C.sub, margin: "0 0 16px" }}>Share your experience to help other travelers</p>
              <button style={{
                padding: "10px 28px", borderRadius: 8, background: C.p600, color: "#fff",
                fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                Rate your trip
              </button>
            </div>
          )}
        </div>
      ) : (
        <DayWiseTab trip={trip} />
      )}

      <ChatFAB />
    </div>
  );
}
