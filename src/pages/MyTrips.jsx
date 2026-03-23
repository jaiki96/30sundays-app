import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gift, Share2, ChevronRight } from "lucide-react";
import { C } from "../data";
import { getTripsByStatus, getCountdown } from "../data/tripData";

// ─── SVG: Couple with suitcase illustration ───
const CoupleIllo = () => (
  <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
    <ellipse cx="80" cy="130" rx="60" ry="8" fill="#FFE4E8" opacity="0.6" />
    {/* Suitcase */}
    <rect x="62" y="80" width="36" height="44" rx="6" fill="#FEA3B4" stroke="#E31B53" strokeWidth="1.5" />
    <rect x="72" y="74" width="16" height="8" rx="3" fill="none" stroke="#E31B53" strokeWidth="1.5" />
    <line x1="74" y1="92" x2="86" y2="92" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    {/* Person 1 (left) */}
    <circle cx="50" cy="52" r="12" fill="#FFE4E8" stroke="#E31B53" strokeWidth="1.5" />
    <path d="M38 90c0-10 5-18 12-18s12 8 12 18" fill="#E31B53" opacity="0.9" />
    <circle cx="46" cy="50" r="1.5" fill="#E31B53" />
    <circle cx="54" cy="50" r="1.5" fill="#E31B53" />
    <path d="M47 56c1.5 2 4.5 2 6 0" stroke="#E31B53" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Person 2 (right) */}
    <circle cx="110" cy="52" r="12" fill="#FFE4E8" stroke="#FEA3B4" strokeWidth="1.5" />
    <path d="M98 90c0-10 5-18 12-18s12 8 12 18" fill="#FEA3B4" opacity="0.9" />
    <circle cx="106" cy="50" r="1.5" fill="#E31B53" />
    <circle cx="114" cy="50" r="1.5" fill="#E31B53" />
    <path d="M107 56c1.5 2 4.5 2 6 0" stroke="#E31B53" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Hearts */}
    <path d="M76 30c-1-3 -5-4-6-1s2 5 6 8c4-3 7-5 6-8s-5-2-6 1z" fill="#E31B53" opacity="0.8" />
    <path d="M90 22c-0.6-2-3-2.5-3.6-0.6s1.2 3 3.6 4.8c2.4-1.8 4.2-3 3.6-4.8s-3-1.4-3.6 0.6z" fill="#FEA3B4" opacity="0.7" />
    <path d="M130 38c-0.5-1.5-2.5-2-3-0.5s1 2.5 3 4c2-1.5 3.5-2.5 3-4s-2.5-1-3 0.5z" fill="#FEA3B4" opacity="0.5" />
  </svg>
);

// ─── Login Gate ───
function LoginGate() {
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "calc(100% - 50px)", padding: "40px 24px",
      background: `linear-gradient(180deg, ${C.p100}44 0%, ${C.white} 50%)`,
    }}>
      <CoupleIllo />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.head, marginTop: 24, textAlign: "center" }}>
        Your trips await
      </h2>
      <p style={{ fontSize: 16, color: C.sub, marginTop: 8, textAlign: "center", lineHeight: "22px" }}>
        Log in to view your booked trips and upcoming adventures
      </p>
      <button
        onClick={() => navigate("/plan")}
        style={{
          width: "100%", maxWidth: 320, marginTop: 32, padding: "14px 0",
          borderRadius: 8, border: "none", background: C.p600, color: "#fff",
          fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
        }}
      >
        Log in
      </button>
      <Link to="/" style={{ marginTop: 16, fontSize: 14, color: C.p600, fontWeight: 600, textDecoration: "none" }}>
        Continue exploring
      </Link>
    </div>
  );
}

// ─── Trip Card ───
function TripCard({ trip }) {
  const countdown = getCountdown(trip.startDate);
  const statusLabel = trip.status === "upcoming" ? "Booked" : trip.status === "ongoing" ? "Ongoing" : "Completed";
  const statusStyle = trip.status === "upcoming"
    ? { color: "#039855", background: "#ECFDF3", border: "1px solid #C0E5D5" }
    : trip.status === "ongoing"
    ? { color: C.p600, background: C.p100, border: `1px solid ${C.p300}` }
    : { color: C.sub, background: C.bg, border: `1px solid ${C.div}` };

  const [imgIdx, setImgIdx] = useState(0);
  const imgs = trip.heroImages;

  return (
    <Link to={`/trips/${trip.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{
        background: C.white, borderRadius: 12, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        {/* Hero image */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
          <img
            src={imgs[imgIdx]}
            alt={trip.destination}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.target.src = imgs[0]; }}
          />
          {/* Carousel dots */}
          {imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                  style={{
                    width: 6, height: 6, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                    background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}
          {/* Countdown badge */}
          {countdown && (
            <div style={{
              position: "absolute", bottom: 10, right: 10,
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.25)", borderRadius: 20,
              padding: "5px 12px", display: "flex", alignItems: "center", gap: 4,
              border: "1px solid rgba(255,255,255,0.3)",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>⏳ {countdown}</span>
            </div>
          )}
        </div>

        {/* Card content */}
        <div style={{ padding: 16 }}>
          {/* Status badge */}
          <span style={{
            display: "inline-block", fontSize: 12, fontWeight: 600,
            padding: "3px 10px", borderRadius: 20, marginBottom: 8,
            ...statusStyle,
          }}>
            {statusLabel}
          </span>

          {/* Duration */}
          <div style={{ fontSize: 12, fontWeight: 600, color: C.p600, marginBottom: 4 }}>
            🔥 {trip.totalNights} Nights
          </div>

          {/* Trip name */}
          <h4 style={{
            fontSize: 18, fontWeight: 600, color: C.head, margin: "0 0 4px",
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {trip.tripName} — {trip.startDateDisplay}
          </h4>

          {/* City breakdown */}
          <p style={{ fontSize: 14, color: C.sub, margin: "0 0 12px" }}>
            {trip.nightsBreakdown}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: C.div, marginBottom: 12 }} />

          {/* Share action */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "none",
              border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Share2 size={14} color={C.p600} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.p600 }}>Share Itinerary</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty States ───
function EmptyActive() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", textAlign: "center" }}>
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#FFE4E8" opacity="0.5" />
        <path d="M35 55c0-10 6-18 15-18s15 8 15 18" stroke="#E31B53" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="42" r="8" stroke="#E31B53" strokeWidth="1.5" fill="#fff" />
        <circle cx="58" cy="42" r="8" stroke="#FEA3B4" strokeWidth="1.5" fill="#fff" />
        <path d="M30 68h40" stroke="#FEA3B4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
        <circle cx="70" cy="30" r="4" fill="#FEA3B4" opacity="0.4" />
      </svg>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, marginTop: 16 }}>No upcoming trips yet</h4>
      <p style={{ fontSize: 16, color: C.sub, marginTop: 6 }}>Start planning your next getaway</p>
      <Link to="/" style={{
        marginTop: 20, padding: "12px 28px", borderRadius: 8, background: C.p600,
        color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
      }}>
        Explore destinations
      </Link>
    </div>
  );
}

function EmptyCompleted() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", textAlign: "center" }}>
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#FFE4E8" opacity="0.5" />
        <rect x="30" y="35" width="40" height="32" rx="4" stroke="#E31B53" strokeWidth="1.5" fill="#fff" />
        <rect x="35" y="40" width="14" height="10" rx="2" fill="#FEA3B4" opacity="0.5" />
        <rect x="52" y="40" width="14" height="10" rx="2" fill="#FEA3B4" opacity="0.3" />
        <rect x="35" y="54" width="14" height="10" rx="2" fill="#FEA3B4" opacity="0.3" />
        <rect x="52" y="54" width="14" height="10" rx="2" fill="#FEA3B4" opacity="0.5" />
        <circle cx="72" cy="30" r="3" fill="#FEA3B4" opacity="0.4" />
      </svg>
      <h4 style={{ fontSize: 18, fontWeight: 600, color: C.head, marginTop: 16 }}>No trips completed yet</h4>
      <p style={{ fontSize: 16, color: C.sub, marginTop: 6 }}>Your travel memories will appear here</p>
    </div>
  );
}

// ─── Main Component ───
export default function MyTrips({ userState }) {
  const [tab, setTab] = useState("active");
  const isLoggedIn = userState === "customer" || userState === "done";

  if (!isLoggedIn) return <LoginGate />;

  const trips = getTripsByStatus(tab);

  return (
    <div style={{ background: `linear-gradient(180deg, ${C.p100}55 0%, ${C.bg} 12%)`, minHeight: "100%" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.head }}>My Trips</h2>
        <button style={{
          display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
          borderRadius: 20, background: C.p100, border: "none", cursor: "pointer", fontFamily: "inherit",
        }}>
          <Gift size={14} color={C.p600} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.p600 }}>Refer & Earn</span>
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", padding: "16px 16px 0", borderBottom: `1px solid ${C.div}` }}>
        {["active", "completed"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 600, fontFamily: "inherit",
              color: tab === t ? C.p600 : C.sub,
              borderBottom: tab === t ? `2px solid ${C.p600}` : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {t === "active" ? "Active" : "Completed"}
          </button>
        ))}
      </div>

      {/* Trip list */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {trips.length === 0 ? (
          tab === "active" ? <EmptyActive /> : <EmptyCompleted />
        ) : (
          trips.map(trip => <TripCard key={trip.id} trip={trip} />)
        )}
      </div>
    </div>
  );
}
