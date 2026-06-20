import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, Receipt, FolderOpen, Ticket, ChevronRight, ChevronDown, ChevronUp,
  Share2, MapPin, Star, MessageCircle, Plane, Users, PalmtreeIcon,
  User as UserIcon, Phone, Pencil, Trash2, Plus, Bell, PlayCircle, Send,
  X, Download, Hotel, ShieldCheck, BookCheck, Stamp, Clock, Luggage,
} from "lucide-react";
import { C } from "../data";
import { getTripById, getCountdown } from "../data/tripData";
import ConsultantCard from "../components/ConsultantCard";
import AddOnsSection from "../components/AddOnsSection";
import { buildActivityDetail } from "../data/activityData";

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

// ─── Chat FAB (typing-bubble + halo pulse + unread bob) ───
function ChatFAB() {
  return (
    <button
      onClick={() => alert("Chat with your travel consultant - opens WhatsApp.")}
      aria-label="Chat with consultant"
      style={{
        position: "absolute", bottom: 140, right: 16,
        width: 52, height: 52, borderRadius: "50%",
        background: "transparent", border: "none", padding: 0, cursor: "pointer",
        display: "grid", placeItems: "center", lineHeight: 0,
        zIndex: 15,
        overflow: "visible",
      }}
    >
      {/* Outward halo ripple (sits behind the button face) */}
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: C.p600,
        animation: "cfHalo 2.4s ease-out infinite",
        pointerEvents: "none",
      }} />

      {/* Static coral face */}
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: C.p600,
        boxShadow: "0 6px 18px rgba(227,27,83,0.32)",
      }} />

      {/* Bubble + 3 typing dots */}
      <svg
        width="26" height="26" viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path
          d="M3 11.5a8.5 8.5 0 1 1 4.2 7.32l-3.2.88a.5.5 0 0 1-.62-.62l.88-3.2A8.5 8.5 0 0 1 3 11.5z"
          fill="#fff"
        />
        <circle cx="8"  cy="11.5" r="1.3" fill={C.p600} className="cf-dot cf-d1" />
        <circle cx="12" cy="11.5" r="1.3" fill={C.p600} className="cf-dot cf-d2" />
        <circle cx="16" cy="11.5" r="1.3" fill={C.p600} className="cf-dot cf-d3" />
      </svg>

      <style>{`
        @keyframes cfHalo {
          0%   { transform: scale(1);   opacity: 0.45; }
          70%  { opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes cfDot {
          0%, 60%, 100% { opacity: 0.3; }
          30%           { opacity: 1; }
        }
        .cf-dot  { animation: cfDot 1.4s ease-in-out infinite; }
        .cf-d1   { animation-delay: 0s; }
        .cf-d2   { animation-delay: 0.18s; }
        .cf-d3   { animation-delay: 0.36s; }
      `}</style>
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
    <div style={{ margin: "0 0 16px" }}>
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

// ─── Tickets & Vouchers bottom sheet ───
// Five document families: flights, hotels, whole-trip voucher, visa, insurance.
// Each is grouped under a heading; every row says what it is, which component it
// covers, and offers a download (or a quiet "not added" state when not purchased).
function buildTicketGroups(trip) {
  const flights = (trip?.flights || []).map((f) => ({
    id: f.id,
    title: `${f.from?.city || f.from?.code} → ${f.to?.city || f.to?.code}`,
    meta: `${f.airline} · ${f.date}`,
    ready: true,
  }));
  const hotels = (trip?.hotels || []).map((h) => ({
    id: h.id,
    title: h.name,
    meta: `${h.city} · ${h.dayRange}`,
    ready: true,
  }));

  const visa = trip?.addOns?.visa;
  const insurance = trip?.addOns?.insurance;

  return [
    {
      key: "voucher",
      heading: "Trip voucher",
      Icon: BookCheck,
      items: [{
        id: "trip-voucher",
        title: `${trip?.destination || "Trip"} confirmation voucher`,
        meta: "Full booking summary · all components",
        ready: true,
      }],
    },
    { key: "flights", heading: "Flight tickets", Icon: Plane, items: flights },
    { key: "hotels", heading: "Hotel vouchers", Icon: Hotel, items: hotels },
    {
      key: "visa",
      heading: "Visa",
      Icon: Stamp,
      items: [{
        id: "visa-doc",
        title: "e-Visa document",
        meta: visa?.purchased ? "Approved · ready to download" : "Not added to this trip",
        ready: !!visa?.purchased,
      }],
    },
    {
      key: "insurance",
      heading: "Travel insurance",
      Icon: ShieldCheck,
      items: [{
        id: "insurance-doc",
        title: "Insurance policy",
        meta: insurance?.purchased ? "Active · ready to download" : "Not added to this trip",
        ready: !!insurance?.purchased,
      }],
    },
  ].filter((g) => g.items.length > 0);
}

function TicketRow({ item, onDownload }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      padding: "12px 0",
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", margin: "0 0 2px", lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.title}
        </p>
        <p style={{ fontSize: 12, color: "#666C99", margin: 0, lineHeight: "16px" }}>{item.meta}</p>
      </div>
      {item.ready ? (
        <button
          onClick={() => onDownload(item)}
          aria-label={`Download ${item.title}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            padding: 4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Download size={19} color="#FD014F" strokeWidth={1.9} />
        </button>
      ) : (
        <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: C.inact }}>Not added</span>
      )}
    </div>
  );
}

function TicketsSheet({ trip, onClose }) {
  const groups = buildTicketGroups(trip);
  const download = (item) => alert(`Downloading\n\n${item.title}`);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", animation: "fadeInBg 0.2s ease-out" }} />
      <div style={{
        position: "relative", background: C.white, borderRadius: "16px 16px 0 0",
        padding: "16px 20px 32px", maxHeight: "78vh", overflowY: "auto",
        animation: "sheetSlideUp 0.25s ease-out",
      }}>
        {/* Grabber + header */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E2EB", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: 0 }}>Tickets &amp; vouchers</h4>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", padding: 4, marginRight: -4 }}>
            <X size={20} color="#666C99" />
          </button>
        </div>

        {groups.map((g) => (
          <div key={g.key} style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <g.Icon size={16} color="#FD014F" strokeWidth={1.9} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#181E4C" }}>{g.heading}</span>
            </div>
            <div>
              {g.items.map((item, i) => (
                <div key={item.id} style={{ borderTop: i === 0 ? "none" : "1px solid #F0F1F5" }}>
                  <TicketRow item={item} onDownload={download} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Documents Section (Figma-styled: solid pink tiles with white icons) ───
function DocumentsSection({ trip, navigate }) {
  const [showTickets, setShowTickets] = useState(false);
  const docs = [
    {
      label: "Itinerary PDF",
      Icon: FileText,
      onClick: () => alert(`Itinerary PDF\n\nDownloading your ${trip?.destination || "trip"} itinerary…`),
    },
    {
      label: "Tickets",
      Icon: Ticket,
      onClick: () => setShowTickets(true),
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
    <div style={{ marginBottom: 16 }}>
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
      {showTickets && <TicketsSheet trip={trip} onClose={() => setShowTickets(false)} />}
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
// Top-right pill: green "Booked" once confirmed, amber "Processing" until then.
function BookingStatusBadge({ status }) {
  const booked = status === "booked";
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, lineHeight: "16px", padding: "3px 8px", borderRadius: 8,
      color: booked ? "#2E7D52" : "#A66B00",
      background: booked ? "#E6F4EC" : "#FEF5E5",
      border: `1px solid ${booked ? "#BBE3CA" : "#F5D98B"}`,
    }}>
      {booked ? "Booked" : "Processing"}
    </span>
  );
}

// Slim full-width footer inside a booked card: a confirmation/PNR ref + a
// download glyph, tinted green to reinforce the confirmed state.
function BookingRefBar({ label, value, onDownload }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onDownload(); }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        padding: "8px 12px", background: "#E6F4EC", borderTop: "1px solid #BBE3CA", cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: "#3E8E63", lineHeight: "16px" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1B5E3A", letterSpacing: ".3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
      </div>
      <Download size={16} color="#2E7D52" strokeWidth={2} style={{ flexShrink: 0 }} />
    </div>
  );
}

// Full flight details, opened from a flight card. Mirrors the planning/exploration
// detail: route, baggage, web check-in (or its tentative open date), and ticket/PNR.
function FlightDetailSheet({ flight: fl, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", animation: "fadeInBg 0.2s ease-out" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: "16px 16px 0 0", padding: "16px 20px 32px", maxHeight: "84vh", overflowY: "auto", animation: "sheetSlideUp 0.25s ease-out" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E0E2EB", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: 0 }}>Flight details</h4>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", padding: 4, marginRight: -4 }}><X size={20} color="#666C99" /></button>
        </div>

        {/* Airline + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 20, borderRadius: 4, background: "#F4F2F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#666C99" }}>{fl.airlineLogo}</div>
            <span style={{ fontSize: 14, color: "#181E4C" }}>{fl.airline}</span>
          </div>
          <BookingStatusBadge status={fl.bookingStatus} />
        </div>

        {/* Route + times */}
        <div style={{ borderRadius: 12, border: "1px solid #E0E2EB", padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div><span style={{ fontSize: 13, color: "#666C99" }}>{fl.date}</span><div style={{ fontSize: 16, fontWeight: 600, color: "#181E4C" }}>{fl.departTime}</div></div>
            <div style={{ textAlign: "right" }}><span style={{ fontSize: 13, color: "#666C99" }}>{fl.date}</span><div style={{ fontSize: 16, fontWeight: 600, color: "#181E4C" }}>{fl.arriveTime}</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div><div style={{ fontSize: 20, fontWeight: 600, color: "#181E4C" }}>{fl.from.code}</div><div style={{ fontSize: 13, color: "#FD014F" }}>{fl.from.city}</div></div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 12, color: "#181E4C" }}>{fl.duration}</div>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <div style={{ flex: 1, height: 0, borderTop: "1px dashed #E0E2EB" }} />
                <Plane size={16} color="#FDA201" style={{ transform: "rotate(90deg)" }} />
                <div style={{ flex: 1, height: 0, borderTop: "1px dashed #E0E2EB" }} />
              </div>
              <div style={{ fontSize: 12, color: "#181E4C" }}>{fl.stops === "Direct" ? "Direct" : fl.stops}</div>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#181E4C" }}>{fl.to.code}</div><div style={{ fontSize: 13, color: "#FD014F" }}>{fl.to.city}</div></div>
          </div>
        </div>

        {/* Baggage */}
        {fl.baggage?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Luggage size={16} color="#FD014F" strokeWidth={1.9} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#181E4C" }}>Baggage</span>
            </div>
            <div style={{ display: "flex", fontSize: 12, color: "#666C99", marginBottom: 6 }}>
              <span style={{ flex: 1 }}>Traveller</span>
              <span style={{ flex: 1, textAlign: "center" }}>Cabin</span>
              <span style={{ flex: 1, textAlign: "right" }}>Check-in</span>
            </div>
            {fl.baggage.map((b, i) => (
              <div key={i} style={{ display: "flex", fontSize: 13, color: "#181E4C", marginBottom: 3 }}>
                <span style={{ flex: 1 }}>{b.traveler}</span>
                <span style={{ flex: 1, textAlign: "center" }}>{b.cabin}</span>
                <span style={{ flex: 1, textAlign: "right" }}>{b.checkin}</span>
              </div>
            ))}
          </div>
        )}

        {/* Web check-in: live button when open, else tentative date */}
        <div style={{ marginTop: 16 }}>
          {fl.webCheckinOpen ? (
            <button
              onClick={() => alert(`Web check-in\n\nOpening ${fl.airline} web check-in…`)}
              style={{ width: "100%", padding: "12px 0", borderRadius: 40, border: "1.5px solid #FD014F", background: "none", color: "#FD014F", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Web check-in
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#F9F9FB", border: "1px solid #E0E2EB" }}>
              <Clock size={16} color="#666C99" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "#666C99", lineHeight: "17px" }}>
                Web check-in opens 48 hrs before departure{fl.checkinOpensOn ? ` · around ${fl.checkinOpensOn}` : ""}.
              </span>
            </div>
          )}
        </div>

        {/* Ticket / PNR */}
        <div style={{ marginTop: 12 }}>
          {fl.bookingStatus === "booked" && fl.pnr ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#E6F4EC", border: "1px solid #BBE3CA" }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 11, color: "#3E8E63" }}>PNR</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1B5E3A", letterSpacing: ".3px" }}>{fl.pnr}</div>
              </div>
              <button
                onClick={() => alert(`Downloading\n\nFlight ticket · PNR ${fl.pnr}`)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, background: C.white, border: "1px solid #BBE3CA", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
              >
                <Download size={15} color="#2E7D52" strokeWidth={2} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2E7D52" }}>Ticket</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "#FEF5E5", border: "1px solid #F5D98B" }}>
              <Clock size={16} color="#A66B00" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "#A66B00", lineHeight: "17px" }}>Ticket and PNR will appear here once this flight is confirmed.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlightsSection({ flights }) {
  const [openFlight, setOpenFlight] = useState(null);
  if (!flights || flights.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px" }}>Flights</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {flights.map(fl => (
          <div key={fl.id} onClick={() => setOpenFlight(fl)} style={{
            width: "100%", background: C.white, cursor: "pointer",
            borderRadius: 16, boxShadow: "0 4px 4px -2px rgba(0,0,0,0.06)",
            border: `1px solid ${fl.bookingStatus === "booked" ? "#8FD0AB" : "#E0E2EB"}`,
            overflow: "hidden",
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
              {/* Airline row + booking status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingBottom: 8, borderBottom: "1px solid #E0E2EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <div style={{
                    width: 28, height: 20, borderRadius: 4, background: "#F4F2F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: "#666C99", flexShrink: 0,
                  }}>
                    {fl.airlineLogo}
                  </div>
                  <span style={{ fontSize: 14, color: "#181E4C", lineHeight: "20px" }}>{fl.airline}</span>
                </div>
                <BookingStatusBadge status={fl.bookingStatus} />
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

              {/* Tap-for-details hint */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: -2 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: "#FD014F" }}>View details</span>
                <ChevronRight size={15} color="#FD014F" />
              </div>
            </div>

            {/* PNR + download — only once ticketed */}
            {fl.bookingStatus === "booked" && fl.pnr && (
              <BookingRefBar
                label="PNR"
                value={fl.pnr}
                onDownload={() => alert(`Downloading\n\nFlight ticket · PNR ${fl.pnr}`)}
              />
            )}
          </div>
        ))}
      </div>

      {openFlight && <FlightDetailSheet flight={openFlight} onClose={() => setOpenFlight(null)} />}
    </div>
  );
}

// ─── Hotel Cards Carousel (Figma-styled: Day label above, rating + Booking.com badge) ───
function BookedHotelCard({ hotel, tripId, hotelIdx, fullWidth = false, showGetDirection = false }) {
  const navigate = useNavigate();
  const directionUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}`;
  const goPdp = () => tripId !== undefined && navigate(`/trips/${tripId}/hotel/${hotelIdx}`);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: fullWidth ? "100%" : undefined }}>
      {/* Offering card */}
      <div
        onClick={goPdp}
        style={{
          position: "relative",
          background: C.white, borderRadius: 12,
          border: hotel.bookingStatus === "booked" ? "1px solid #8FD0AB" : "1px solid transparent",
          filter: "drop-shadow(0 4px 16px rgba(15,23,42,0.06))",
          cursor: tripId !== undefined ? "pointer" : "default",
          overflow: "hidden",
        }}
      >
        {/* Booked / Processing pill, top-right over the image */}
        {hotel.bookingStatus && (
          <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
            <BookingStatusBadge status={hotel.bookingStatus} />
          </div>
        )}

        {/* Image block: 8px white inset around the image */}
        <div style={{ padding: 8, background: C.white }}>
          <img
            src={hotel.photo || hotel.fallbackPhoto}
            alt={hotel.name}
            onError={(e) => {
              if (hotel.fallbackPhoto && !e.currentTarget.src.endsWith(hotel.fallbackPhoto)) {
                e.currentTarget.src = hotel.fallbackPhoto;
              }
            }}
            style={{
              display: "block", width: "100%", height: 224, objectFit: "cover",
              borderRadius: "8px 8px 0 0", background: "#F4F2F0",
            }}
          />
        </div>

        {/* Description block */}
        <div style={{ padding: "8px 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Rating row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Star size={20} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#4EAC7E", lineHeight: "20px" }}>{hotel.stars} star hotel</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#003580", padding: "2px 4px", borderRadius: 3 }}>B</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", lineHeight: "20px" }}>{hotel.bookingRating} Rated</span>
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h5 style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: "20px" }}>{hotel.name}</h5>
            <p style={{ fontSize: 12, color: "#666C99", margin: 0, lineHeight: "16px" }}>{hotel.roomType}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={14} color="#666C99" />
              <span style={{ fontSize: 12, color: "#666C99", lineHeight: "16px" }}>{hotel.address || hotel.city}</span>
            </div>
          </div>
        </div>

        {/* Hotel confirmation no. + download — only once confirmed */}
        {hotel.bookingStatus === "booked" && hotel.confirmationNo && (
          <BookingRefBar
            label="Confirmation"
            value={hotel.confirmationNo}
            onDownload={() => alert(`Downloading\n\nHotel voucher · ${hotel.name}\nConfirmation ${hotel.confirmationNo}`)}
          />
        )}
      </div>

      {/* Get direction button - only on the single Day-wise stay */}
      {showGetDirection && (
        <a
          href={directionUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
            padding: "8px 24px", height: 44,
            background: C.white, border: "1px solid #E0E2EB",
            boxShadow: "0 4px 12px -4px #E0E2EB",
            borderRadius: 40, color: "#FD014F", textDecoration: "none",
            fontSize: 14, fontWeight: 500,
          }}
        >
          <MapPin size={20} color="#FD014F" />
          Get direction
        </a>
      )}
    </div>
  );
}

function HotelsSection({ hotels, tripId }) {
  if (!hotels || hotels.length === 0) return null;
  return (
    <div style={{
      marginBottom: 24,
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: 0, lineHeight: "28px" }}>Your hotels</h4>
      <div className="hs" style={{ gap: 16, paddingRight: 16, marginRight: -16 }}>
        {hotels.map((ht, idx) => (
          <div key={ht.id} style={{ minWidth: 309, maxWidth: 309, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#181E4C", lineHeight: "22px" }}>{ht.dayRange}</div>
              <div style={{ fontSize: 14, color: "#666C99", lineHeight: "20px" }}>{ht.city}</div>
            </div>
            <BookedHotelCard hotel={ht} tripId={tripId} hotelIdx={idx} />
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
          Unlock perks on your next trip - priority support, free upgrades, exclusive experiences.
        </p>
        <button
          onClick={() => alert("30 Sundays Pass - coming soon for early customers.")}
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

function ActivityCards({ activities, city, tripId, dayIdx }) {
  const navigate = useNavigate();
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
          const meta = buildActivityDetail(act, { city, isBooked: true });
          const open = () => navigate(`/trips/${tripId}/day/${dayIdx}/activity/${i}`);
          return (
            <div key={i} onClick={open} style={{ display: "flex", gap: 12, cursor: "pointer" }}>
              <div style={{
                position: "relative", width: 175, height: 120, flexShrink: 0,
                borderRadius: 8, overflow: "hidden",
                background: act.photo ? `url(${act.photo}) center/cover no-repeat` : "#F4F2F0",
              }}>
                {/* Duration badge - bottom-right glass pill */}
                <div style={{
                  position: "absolute", right: 8, bottom: 8,
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 8px",
                  background: "rgba(20,20,28,0.38)",
                  backdropFilter: "blur(14px) saturate(180%)",
                  WebkitBackdropFilter: "blur(14px) saturate(180%)",
                  border: "0.5px solid rgba(255,255,255,0.28)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 2px rgba(0,0,0,0.18)",
                  borderRadius: 999,
                }}>
                  <PlayCircle size={11} color="#fff" strokeWidth={2} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", lineHeight: "14px", letterSpacing: 0.1 }}>{dur}</span>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={12} fill="#FBBC05" color="#FBBC05" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#181E4C" }}>{meta.rating}</span>
                  </div>
                  <a
                    href={getDirectionUrl(`${act.venue}, ${city}`)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 12, fontWeight: 600, color: "#FD014F", textDecoration: "none" }}
                  >
                    Get direction
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayHotelCard({ hotel, trip }) {
  if (!hotel) return null;
  const matchIdx = trip?.hotels?.findIndex(h => h.name === hotel.name);
  const canNavigate = trip && matchIdx !== undefined && matchIdx >= 0;
  return (
    <div style={{ background: C.white, padding: "24px 20px" }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: "#181E4C", margin: "0 0 16px", lineHeight: "28px" }}>Your hotel</h4>
      <BookedHotelCard
        hotel={hotel}
        tripId={canNavigate ? trip.id : undefined}
        hotelIdx={canNavigate ? matchIdx : undefined}
        fullWidth
        showGetDirection
      />
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
            onClick={() => alert("AI Chatbot - coming soon. Ask anything about your trip.")}
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
      <ActivityCards activities={day.activities} city={day.city} tripId={trip.id} dayIdx={selectedDay} />
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
