import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, FileText, Receipt, FolderOpen, ChevronRight, ChevronDown, ChevronUp,
  Share2, MapPin, Star, MessageCircle, Plane, Users, PalmtreeIcon,
  User as UserIcon, Phone, Pencil, Trash2, Plus,
} from "lucide-react";
import { C } from "../data";
import { getTripById, getCountdown } from "../data/tripData";

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
    <button style={{
      position: "fixed", bottom: 80, right: "calc(50% - 170px)", width: 56, height: 56,
      borderRadius: "50%", background: C.p600, border: "none", cursor: "pointer",
      boxShadow: "0 4px 16px rgba(227,27,83,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 15,
    }}>
      <MessageCircle size={24} color="#fff" fill="#fff" />
    </button>
  );
}

// ─── Payment Banner ───
function PaymentBanner({ trip, navigate }) {
  const dueInstallment = trip.installments.find(i => i.status === "due");
  if (!dueInstallment && trip.amountPaid >= trip.totalPackageValue) return null;

  const nextDue = dueInstallment || trip.installments.find(i => i.status === "pending");
  if (!nextDue) return null;

  return (
    <div style={{
      background: "#FFF8F0", borderRadius: 12, padding: 16, margin: "0 0 24px",
    }}>
      <p style={{ fontSize: 14, color: C.sub, margin: "0 0 4px" }}>Next installment due!</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 21, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>
            ₹ {nextDue.amount.toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>Due on {nextDue.date}</p>
        </div>
        <button
          onClick={() => navigate(`/trips/${trip.id}/payments`)}
          style={{
            display: "flex", alignItems: "center", gap: 2, background: "none",
            border: "none", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: C.p600 }}>View details</span>
          <ChevronRight size={16} color={C.p600} />
        </button>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 4, background: "#E9EAEB", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(trip.amountPaid / trip.totalPackageValue) * 100}%`, background: "#039855", borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 12, marginTop: 6, margin: "6px 0 0" }}>
          <span style={{ color: "#039855", fontWeight: 600 }}>₹ {trip.amountPaid.toLocaleString("en-IN")} Paid</span>
          <span style={{ color: C.sub }}> of ₹ {trip.totalPackageValue.toLocaleString("en-IN")}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Documents Section ───
function DocumentsSection() {
  const docs = [
    { label: "Itinerary PDF", icon: <FileText size={24} color={C.p600} /> },
    { label: "Payment Receipts", icon: <Receipt size={24} color={C.p600} /> },
    { label: "Traveler Documents", icon: <FolderOpen size={24} color={C.p600} /> },
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Documents</h4>
      <div style={{ display: "flex", gap: 10 }}>
        {docs.map(d => (
          <button key={d.label} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 8, padding: 12, background: C.white, border: `1px solid ${C.div}`,
            borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
          }}>
            {d.icon}
            <span style={{ fontSize: 11, fontWeight: 500, color: C.head, textAlign: "center", lineHeight: "14px" }}>{d.label}</span>
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
        background: C.white, borderRadius: 12, padding: 16, marginBottom: 24,
        border: `1px solid ${C.div}`,
      }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>Manage co-travelers</h4>
        <p style={{ fontSize: 14, color: C.sub, margin: "0 0 12px" }}>Invite the ones who makes every journey special.</p>
        <button
          onClick={() => setShowSheet(true)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: C.p600 }}>See Guests</span>
        </button>
      </div>

      {/* Manage Guests Bottom Sheet */}
      {showSheet && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
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
function ItineraryGlance({ trip }) {
  const [expanded, setExpanded] = useState(false);
  const days = trip.itineraryDays;
  const visibleDays = expanded ? days : days.slice(0, 2);

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 16px" }}>Itinerary at glance</h4>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        {/* Timeline line */}
        {visibleDays.length > 1 && (
          <div style={{
            position: "absolute", left: 5, top: 12, bottom: 12, width: 1,
            borderLeft: `1px dashed ${C.div}`,
          }} />
        )}
        {visibleDays.map((day, i) => (
          <div key={i} style={{ position: "relative", marginBottom: i < visibleDays.length - 1 ? 20 : 0 }}>
            {/* Circle marker */}
            <div style={{
              position: "absolute", left: -24, top: 4, width: 12, height: 12,
              borderRadius: "50%", background: i === 0 ? "#039855" : C.white,
              border: `2px solid ${i === 0 ? "#039855" : C.div}`,
            }} />
            <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 6px" }}>
              Day {day.day} — {day.city}
            </h5>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {day.activities.map((a, j) => (
                <li key={j} style={{ fontSize: 14, color: C.sub, lineHeight: "22px" }}>{a}</li>
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
          <span style={{ fontSize: 14, fontWeight: 600, color: C.p600 }}>
            {expanded ? "Hide details" : "Read more"}
          </span>
          {expanded ? <ChevronUp size={16} color={C.p600} /> : <ChevronDown size={16} color={C.p600} />}
        </button>
      )}
    </div>
  );
}

// ─── Flight Cards Carousel ───
function FlightsSection({ flights }) {
  if (!flights || flights.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Flights</h4>
      <div className="hs" style={{ gap: 12, paddingLeft: 0, paddingRight: 16 }}>
        {flights.map(fl => (
          <div key={fl.id} style={{
            minWidth: 300, maxWidth: 320, flexShrink: 0, background: C.white,
            borderRadius: 12, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: `1px solid ${C.div}`,
          }}>
            {/* Date + times */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{fl.date}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{fl.date}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.head }}>{fl.departTime}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.head }}>{fl.arriveTime}</span>
            </div>

            {/* Airline */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 4, background: C.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: C.sub,
              }}>
                {fl.airlineLogo}
              </div>
              <span style={{ fontSize: 14, color: C.head }}>{fl.airline}</span>
            </div>

            {/* Route */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.head }}>{fl.from.code}</div>
                <div style={{ fontSize: 12, color: C.p600 }}>{fl.from.city}</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.sub, marginBottom: 2 }}>{fl.duration}</div>
                <div style={{ position: "relative", height: 1, background: C.div }}>
                  <span style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", fontSize: 12 }}>✈️</span>
                </div>
                <div style={{
                  fontSize: 11, color: C.sub, marginTop: 4, display: "inline-block",
                  padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.div}`,
                }}>
                  {fl.stops === "Direct" ? "Direct Flight" : fl.stops}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.head }}>{fl.to.code}</div>
                <div style={{ fontSize: 12, color: C.p600 }}>{fl.to.city}</div>
              </div>
            </div>

            {/* Baggage table */}
            <div style={{ marginTop: 12, borderTop: `1px solid ${C.div}`, paddingTop: 10 }}>
              <div style={{ display: "flex", gap: 0, fontSize: 12, color: C.sub, marginBottom: 4 }}>
                <span style={{ flex: 1 }}>Baggage</span>
                <span style={{ flex: 1, textAlign: "center" }}>Cabin</span>
                <span style={{ flex: 1, textAlign: "right" }}>Check-in</span>
              </div>
              {fl.baggage.map((b, i) => (
                <div key={i} style={{ display: "flex", fontSize: 12, color: C.head, marginBottom: 2 }}>
                  <span style={{ flex: 1 }}>{b.traveler}</span>
                  <span style={{ flex: 1, textAlign: "center" }}>{b.cabin}</span>
                  <span style={{ flex: 1, textAlign: "right" }}>{b.checkin}</span>
                </div>
              ))}
            </div>

            {/* Web check-in */}
            <button style={{
              width: "100%", marginTop: 12, padding: "8px 0", borderRadius: 8,
              border: `1.5px solid ${C.p600}`, background: "none", color: C.p600,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Web check-in
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hotel Cards Carousel ───
function HotelsSection({ hotels }) {
  if (!hotels || hotels.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Hotels</h4>
      <div className="hs" style={{ gap: 12, paddingLeft: 0, paddingRight: 16 }}>
        {hotels.map(ht => (
          <div key={ht.id} style={{
            minWidth: 280, maxWidth: 300, flexShrink: 0, background: C.white,
            borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: `1px solid ${C.div}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.head, padding: "12px 14px 4px" }}>{ht.dayRange}</div>
            <div style={{ fontSize: 14, color: C.sub, padding: "0 14px 8px" }}>{ht.city}</div>
            <img
              src={ht.photo || ht.fallbackPhoto}
              alt={ht.name}
              style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }}
              onError={(e) => { e.target.src = ht.fallbackPhoto; }}
            />
            <div style={{ padding: "10px 14px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#039855", fontWeight: 600 }}>⭐ {ht.stars} star hotel</span>
                <span style={{ fontSize: 12, color: "#039855", fontWeight: 600 }}>🅱️ {ht.bookingRating} Rated</span>
              </div>
              <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{ht.name}</h5>
              <p style={{ fontSize: 14, color: C.sub, margin: "0 0 2px" }}>{ht.roomType}</p>
              <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>📍 {ht.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Journey Map (placeholder) ───
function JourneyMap({ cities }) {
  if (!cities || cities.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 12px" }}>Journey map</h4>
      <div style={{
        height: 200, borderRadius: 12, overflow: "hidden", position: "relative",
        background: `linear-gradient(135deg, #E1F5EE 0%, #D1E9FF 50%, #EBE9FE 100%)`,
      }}>
        {/* City markers */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "space-evenly", padding: "0 20px",
        }}>
          {cities.map((c, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                background: C.p600, color: "#fff", borderRadius: 20, padding: "4px 12px",
                fontSize: 12, fontWeight: 600, boxShadow: "0 2px 8px rgba(227,27,83,0.3)",
              }}>
                {c.number}. {c.name}
              </div>
              <MapPin size={20} color={C.p600} />
            </div>
          ))}
        </div>
        {/* Dashed connecting line */}
        <div style={{
          position: "absolute", top: "50%", left: "15%", right: "15%", height: 0,
          borderTop: `2px dashed ${C.p600}40`,
        }} />
        {/* View on map button */}
        <button style={{
          position: "absolute", bottom: 10, right: 10, background: C.white, border: "none",
          borderRadius: 20, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", fontFamily: "inherit",
        }}>
          <MapPin size={14} color={C.p600} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>View on map</span>
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
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>Before you go</h3>
      <p style={{ fontSize: 14, color: C.sub, margin: "0 0 16px" }}>Everything you need before your trip</p>
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
function DayWiseTab({ trip }) {
  const days = trip.dayWise;
  const [selectedDay, setSelectedDay] = useState(0);

  if (!days || days.length === 0) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 16, color: C.sub }}>Day-wise details will appear once your itinerary is finalized.</p>
      </div>
    );
  }

  const day = days[selectedDay] || days[0];

  return (
    <div>
      {/* Date pill selector */}
      <div className="hs" style={{
        gap: 8, padding: "12px 16px", background: C.white,
        position: "sticky", top: 0, zIndex: 5, borderBottom: `1px solid ${C.div}`,
      }}>
        {days.map((d, i) => {
          const isToday = d.date === new Date().toISOString().split("T")[0];
          const active = i === selectedDay;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                minWidth: 90, flexShrink: 0, padding: "8px 12px", borderRadius: 12,
                border: active ? "none" : `1px solid ${C.div}`,
                background: active ? C.p600 : C.white, cursor: "pointer",
                textAlign: "center", fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#fff" : C.head }}>
                {d.dateDisplay.split(",")[0] || `Day ${d.dayNumber}`}
              </div>
              <div style={{ fontSize: 12, color: active ? "rgba(255,255,255,0.8)" : C.sub, marginTop: 2 }}>
                📍 {d.city}
              </div>
              {isToday && (
                <div style={{
                  fontSize: 9, fontWeight: 700, color: active ? C.p600 : "#fff",
                  background: active ? "#fff" : C.p600, borderRadius: 4,
                  padding: "1px 5px", marginTop: 3, display: "inline-block",
                }}>
                  TODAY
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <div style={{ padding: 16 }}>
        {/* Activities */}
        {day.activities && day.activities.map((act, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 12, padding: 14, marginBottom: 12,
            border: `1px solid ${C.div}`,
          }}>
            <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 10px" }}>{act.title}</h5>
            <div style={{ display: "flex", gap: 12 }}>
              <img
                src={act.photo}
                alt={act.title}
                style={{ width: 120, height: 90, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>{act.venue}</p>
                <p style={{
                  fontSize: 14, color: C.sub, margin: 0, lineHeight: "20px",
                  overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {act.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Hotel for this day */}
        {day.hotel && (
          <div style={{ marginTop: 12, marginBottom: 24 }}>
            <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 10px" }}>Your stay</h5>
            <div style={{
              background: C.white, borderRadius: 12, overflow: "hidden",
              border: `1px solid ${C.div}`,
            }}>
              <img
                src={day.hotel.photo}
                alt={day.hotel.name}
                style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "10px 14px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#039855", fontWeight: 600 }}>⭐ {day.hotel.stars} star hotel</span>
                  <span style={{ fontSize: 12, color: "#039855", fontWeight: 600 }}>🅱️ {day.hotel.bookingRating} Rated</span>
                </div>
                <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{day.hotel.name}</h5>
                <p style={{ fontSize: 14, color: C.sub, margin: 0 }}>{day.hotel.roomType}</p>
                <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>📍 {day.hotel.city}</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurants / Discover */}
        {day.restaurants && day.restaurants.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h5 style={{ fontSize: 16, fontWeight: 600, color: C.head, margin: 0 }}>Restaurants</h5>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer" }}>View all</span>
            </div>
            <div className="hs" style={{ gap: 12 }}>
              {day.restaurants.map((r, i) => (
                <div key={i} style={{
                  minWidth: 160, flexShrink: 0, background: C.white, borderRadius: 12,
                  overflow: "hidden", border: `1px solid ${C.div}`,
                }}>
                  <img src={r.photo} alt={r.name} style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "8px 10px" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{r.name}</p>
                    <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{r.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, ${C.p100}44 0%, ${C.white} 100%)`,
        padding: "8px 16px 16px",
      }}>
        {/* Back + title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <button
            onClick={() => navigate("/trips")}
            style={{
              width: 34, height: 34, borderRadius: 12, background: C.white, border: "none",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <ArrowLeft size={17} color={C.head} />
          </button>
          <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, margin: 0 }}>
            Your {trip.destination} Trip {trip.emoji}
          </h4>
        </div>

        {/* Dates + countdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 44 }}>
          <span style={{ fontSize: 14, color: C.head, fontWeight: 500 }}>
            {trip.startDateDisplay} – {trip.endDateDisplay}
          </span>
          {countdown && (
            <span style={{
              fontSize: 12, fontWeight: 600, color: C.p600,
              background: C.p100, padding: "3px 10px", borderRadius: 20,
            }}>
              Starts in {countdown}
            </span>
          )}
          {trip.status === "ongoing" && (
            <span style={{
              fontSize: 12, fontWeight: 600, color: C.p600,
              background: C.p100, padding: "3px 10px", borderRadius: 20,
            }}>
              Ongoing
            </span>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.div}`, position: "sticky", top: 0, zIndex: 10 }}>
        {["details", "daywise"].map(t => (
          <button
            key={t}
            onClick={() => setDetailTab(t)}
            style={{
              flex: 1, padding: "12px 0", border: "none", background: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 600, fontFamily: "inherit",
              color: detailTab === t ? C.p600 : C.sub,
              borderBottom: detailTab === t ? `2px solid ${C.p600}` : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {t === "details" ? "Trip details" : "Day wise"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {detailTab === "details" ? (
        <div style={{ padding: 16 }}>
          {/* Payment banner (hide for completed) */}
          {!isCompleted && <PaymentBanner trip={trip} navigate={navigate} />}

          <DocumentsSection />
          <CoTravelersSection trip={trip} />
          <ItineraryGlance trip={trip} />
          <FlightsSection flights={trip.flights} />
          <HotelsSection hotels={trip.hotels} />
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
