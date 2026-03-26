import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Wifi,
  Signal,
  Battery,
  Search,
  Calendar,
  Compass,
  Map,
  User,
  MessageCircle,
  Sparkles,
  Coffee,
  UtensilsCrossed,
  Waves,
  Car,
  Eye,
  ArrowUpRight,
} from "lucide-react";

/* ───────────────────────── design tokens ───────────────────────── */
const C = {
  p900: "#89123E",
  p600: "#E31B53",
  p300: "#FEA3B4",
  p100: "#FFE4E8",
  b600: "#1570EF",
  b100: "#D1E9FF",
  head: "#181D27",
  sub: "#535862",
  inact: "#A4A7AE",
  div: "#E9EAEB",
  bg: "#F5F5F5",
  white: "#FFFFFF",
  sText: "#027A48",
  sBg: "#ECFDF3",
  gold: "#B8860B",
  goldLight: "#FFF8E7",
  goldBorder: "#E8D5A3",
  goldBg: "linear-gradient(135deg, #FFF8E7 0%, #FFF1D6 100%)",
};

const CDN = "https://cdn.30sundays.club/app_content";

/* ───────────────────── star rating component ───────────────────── */
const Stars = ({ count, size = 12 }) => (
  <span style={{ display: "inline-flex", gap: 1 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Star
        key={i}
        size={size}
        fill="#F5A623"
        stroke="#F5A623"
        strokeWidth={1.5}
      />
    ))}
  </span>
);

/* ───────────────── booking.com style rating badge ──────────────── */
const RatingBadge = ({ score, reviews }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontFamily: "Figtree",
    }}
  >
    <span
      style={{
        background: "#003580",
        color: "#fff",
        borderRadius: "6px 6px 6px 0",
        padding: "2px 6px",
        fontWeight: 700,
        fontSize: 12,
        lineHeight: "16px",
      }}
    >
      {score}
    </span>
    {reviews && <span style={{ color: C.sub, fontSize: 11 }}>{reviews} reviews</span>}
  </span>
);

/* ────────────────── sample data ────────────────── */
const itineraries = [
  {
    id: 1,
    dest: "Bali",
    nights: 7,
    route: "3N Ubud · 2N Seminyak · 2N Sanur",
    price: "62,498",
    vibe: "Relaxed",
    img: `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
    veg: true,
    upgradeCount: 2,
    upgradeDelta: 4000,
    hotels: [
      {
        name: "Padma Resort Ubud",
        city: "Ubud",
        stars: 4,
        dayRange: "Day 1–3",
        type: "Deluxe Room · Breakfast included",
        rating: 8.4,
        reviews: 2341,
        img: "https://picsum.photos/seed/padma/400/240",
        upgrade: {
          name: "Viceroy Bali",
          stars: 5,
          type: "Pool Villa · All meals included",
          rating: 9.2,
          reviews: 1856,
          img: "https://picsum.photos/seed/viceroy/400/240",
          delta: 4200,
          perks: [
            "Private infinity pool",
            "Complimentary spa session",
            "Butler service",
            "Airport transfer included",
          ],
        },
      },
      {
        name: "The Mulia Bali",
        city: "Seminyak",
        stars: 5,
        dayRange: "Day 4–5",
        type: "Ocean Suite · Breakfast included",
        rating: 9.1,
        reviews: 3102,
        img: "https://picsum.photos/seed/mulia/400/240",
        upgrade: null,
      },
      {
        name: "COMO Uma Sanur",
        city: "Sanur",
        stars: 4,
        dayRange: "Day 6–7",
        type: "Garden Room · Breakfast included",
        rating: 8.1,
        reviews: 1204,
        img: "https://picsum.photos/seed/como/400/240",
        upgrade: {
          name: "Four Seasons Sayan",
          stars: 5,
          type: "Riverfront Villa · Half board",
          rating: 9.4,
          reviews: 2678,
          img: "https://picsum.photos/seed/fssayan/400/240",
          delta: 3800,
          perks: [
            "Valley-view private terrace",
            "Daily yoga sessions",
            "Gourmet dining credit",
            "Sunset cocktails included",
          ],
        },
      },
    ],
  },
  {
    id: 2,
    dest: "Bali",
    nights: 5,
    route: "3N Seminyak · 2N Nusa Dua",
    price: "78,998",
    vibe: "Relaxed",
    img: `${CDN}/bali/kelingking_beach_65.jpg`,
    veg: false,
    upgradeCount: 1,
    upgradeDelta: 4200,
    hotels: [
      {
        name: "W Bali Seminyak",
        city: "Seminyak",
        stars: 5,
        dayRange: "Day 1–3",
        type: "Wonderful Room · Breakfast included",
        rating: 8.9,
        reviews: 4201,
        img: "https://picsum.photos/seed/wbali/400/240",
        upgrade: null,
      },
      {
        name: "Hilton Bali Resort",
        city: "Nusa Dua",
        stars: 4,
        dayRange: "Day 4–5",
        type: "Deluxe Room · Breakfast included",
        rating: 8.3,
        reviews: 1892,
        img: "https://picsum.photos/seed/hilton/400/240",
        upgrade: {
          name: "The Ritz-Carlton Bali",
          stars: 5,
          type: "Cliff Villa · All meals included",
          rating: 9.3,
          reviews: 3456,
          img: "https://picsum.photos/seed/ritz/400/240",
          delta: 4200,
          perks: [
            "Private beach access",
            "Couples spa treatment",
            "Club lounge access",
            "Sunset dining experience",
          ],
        },
      },
    ],
  },
  {
    id: 3,
    dest: "Bali",
    nights: 7,
    route: "3N Ubud · 2N Kintamani · 2N Sanur",
    price: "72,498",
    vibe: "Relaxed",
    img: `${CDN}/bali/banyumala_waterfall_56.jpg`,
    veg: true,
    upgradeCount: 0,
    upgradeDelta: 0,
    hotels: [],
  },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────── */
export default function HotelUpgradeNudge() {
  const [screen, setScreen] = useState("planning"); // planning | details | drawer
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  useEffect(() => {
    setFadeIn(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeIn(true));
    });
  }, [screen]);

  const openDetails = (it) => {
    setSelectedItinerary(it);
    setScreen("details");
    setExpandedAccordion(null);
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    setScreen("drawer");
    setExpandedAccordion(null);
  };

  const openDrawerForItinerary = (it) => {
    setSelectedItinerary(it);
    setDrawerOpen(true);
    setScreen("drawer");
    setExpandedAccordion(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setScreen("details");
  };

  return (
    <div
      style={{
        fontFamily: "'Figtree', sans-serif",
        background: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "24px 0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes shimmer { from { background-position: -200px 0; } to { background-position: 200px 0; } }
        @keyframes pulseGold { 0%, 100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.15); } 50% { box-shadow: 0 0 0 6px rgba(184,134,11,0); } }
      `}</style>

      {/* ── device frame ── */}
      <div
        style={{
          width: 390,
          height: 844,
          background: C.white,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* status bar */}
        <StatusBar />

        {/* screen content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            background: screen === "drawer" ? "rgba(0,0,0,0.4)" : C.bg,
            position: "relative",
          }}
        >
          {screen === "planning" && (
            <PlanningScreen
              fadeIn={fadeIn}
              onSelectItinerary={openDetails}
              onOpenDrawer={openDrawerForItinerary}
            />
          )}
          {screen === "details" && selectedItinerary && (
            <DetailsScreen
              fadeIn={fadeIn}
              itinerary={selectedItinerary}
              onBack={() => setScreen("planning")}
              onOpenDrawer={openDrawer}
            />
          )}
          {screen === "drawer" && selectedItinerary && (
            <DrawerScreen
              itinerary={selectedItinerary}
              onClose={closeDrawer}
              expandedAccordion={expandedAccordion}
              setExpandedAccordion={setExpandedAccordion}
            />
          )}
        </div>

        {/* bottom nav */}
        <BottomNav active={screen === "planning" ? "Planning" : "Planning"} />
      </div>

      {/* ── screen labels ── */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          display: "flex",
          gap: 8,
          zIndex: 100,
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        {["planning", "details", "drawer"].map((s) => (
          <button
            key={s}
            onClick={() => {
              if (s === "planning") setScreen("planning");
              else if (s === "details") {
                setSelectedItinerary(itineraries[0]);
                setScreen("details");
              } else if (s === "drawer") {
                setSelectedItinerary(itineraries[0]);
                setScreen("drawer");
              }
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: screen === s ? C.head : C.white,
              color: screen === s ? C.white : C.head,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontFamily: "'Figtree', sans-serif",
            }}
          >
            {s === "planning"
              ? "1. Planning"
              : s === "details"
                ? "2. Itinerary"
                : "3. Drawer"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STATUS BAR
   ═══════════════════════════════════════════════════════════════════ */
function StatusBar() {
  return (
    <div
      style={{
        height: 54,
        padding: "14px 24px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: C.white,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: C.head }}>
        9:41
      </span>
      <div
        style={{
          width: 120,
          height: 32,
          background: C.head,
          borderRadius: 20,
        }}
      />
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <Signal size={14} color={C.head} />
        <Wifi size={14} color={C.head} />
        <Battery size={14} color={C.head} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BOTTOM NAV
   ═══════════════════════════════════════════════════════════════════ */
function BottomNav({ active }) {
  const tabs = [
    { name: "Explore", icon: Compass },
    { name: "Planning", icon: Map },
    { name: "My Trips", icon: Calendar },
    { name: "Account", icon: User },
    { name: "Chats", icon: MessageCircle },
  ];
  return (
    <div
      style={{
        height: 80,
        background: C.white,
        borderTop: `1px solid ${C.div}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: 10,
        flexShrink: 0,
      }}
    >
      {tabs.map((t) => {
        const isActive = t.name === active;
        const Icon = t.icon;
        return (
          <div
            key={t.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <Icon
              size={22}
              color={isActive ? C.p600 : C.inact}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.p600 : C.inact,
              }}
            >
              {t.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 1 — PLANNING PAGE
   ═══════════════════════════════════════════════════════════════════ */
function PlanningScreen({ fadeIn, onSelectItinerary, onOpenDrawer }) {
  return (
    <div
      style={{
        padding: "0 0 24px",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "16px 20px 12px",
          background: C.white,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: C.head,
            lineHeight: "32px",
          }}
        >
          Your Plans
        </h1>
        <p
          style={{ fontSize: 14, color: C.sub, marginTop: 4, lineHeight: "20px" }}
        >
          3 itineraries crafted for you both
        </p>
      </div>

      {/* itinerary cards */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {itineraries.map((it, idx) => (
          <div
            key={it.id}
            style={{
              animation: `fadeUp 0.5s ease ${idx * 0.12}s both`,
            }}
          >
            {/* ── itinerary card ── */}
            <div
              onClick={() => onSelectItinerary(it)}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                cursor: "pointer",
                position: "relative",
                height: 280,
                background: C.head,
              }}
            >
              <img
                src={it.img}
                alt={it.dest}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.82) 100%)",
                }}
              />

              {/* vibe chip */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {it.vibe}
              </div>

              {/* veg badge */}
              {it.veg && (
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 20,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  🌱 Veg Friendly
                </div>
              )}

              {/* bottom content */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "0 16px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {it.dest}
                  </h3>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 500,
                    }}
                  >
                    🌙 {it.nights}N
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: 12,
                    fontWeight: 400,
                  }}
                >
                  {it.route}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}
                  >
                    From ₹{it.price}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      /pp
                    </span>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    View <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── UPGRADE PILL (below card, single line) ── */}
            {it.upgradeCount > 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDrawer(it);
                }}
                style={{
                  marginTop: -1,
                  borderRadius: "0 0 16px 16px",
                  background: "linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 50%, #FFF3D6 100%)",
                  border: `1px solid ${C.goldBorder}`,
                  borderTop: "none",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles size={14} color="#B8860B" strokeWidth={2.2} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#6B4F1D",
                      lineHeight: "16px",
                    }}
                  >
                    {it.upgradeCount === 1
                      ? "1 hotel upgrade available"
                      : `${it.upgradeCount} hotel upgrades available`}
                  </span>

                </div>
                <ArrowUpRight size={14} color="#8B7340" strokeWidth={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 2 — ITINERARY DETAILS (Hotel section)
   Matches existing ItineraryDetail.jsx hotel card design exactly:
   horizontal scroll, 280px cards, 14px border-radius, 1px border
   ═══════════════════════════════════════════════════════════════════ */
function DetailsScreen({ fadeIn, itinerary, onBack, onOpenDrawer }) {
  const upgradeable = itinerary.hotels.filter((h) => h.upgrade);
  // Total additional cost = sum of (delta × nights per hotel stay)
  const totalAdditional = upgradeable.reduce((s, h) => {
    const nights = parseInt(h.dayRange.match(/\d+/g)?.[1] || 2) - parseInt(h.dayRange.match(/\d+/g)?.[0] || 1) + 1;
    return s + h.upgrade.delta * nights;
  }, 0);

  return (
    <div
      style={{
        background: C.bg,
      }}
    >
      {/* hero */}
      <div style={{ position: "relative", height: 200 }}>
        <img
          src={itinerary.img}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          onClick={onBack}
          style={{
            position: "absolute", top: 14, left: 16, width: 36, height: 36,
            borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 300 }}>←</span>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: "30px" }}>
            {itinerary.dest} · {itinerary.nights}N
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
            {itinerary.route}
          </p>
        </div>
      </div>

      {/* hotels section — horizontal scroll matching existing app */}
      <div>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, padding: "20px 16px 12px" }}>
          Hotels
        </p>
        <div
          className="hs"
          style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}
        >
          {itinerary.hotels.map((hotel, idx) => (
            <div
              key={idx}
              style={{
                width: 280, minWidth: 280, flexShrink: 0,
                animation: `fadeUp 0.45s ease ${0.1 + idx * 0.1}s both`,
              }}
            >
              {/* ── hotel card (matches ItineraryDetail.jsx) ── */}
              <div
                style={{
                  borderRadius: 14, border: `1px solid ${C.div}`,
                  overflow: "hidden", background: C.white,
                }}
              >
                <div style={{ padding: "10px 10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>
                      {hotel.dayRange} · {hotel.city}
                    </span>
                    {hotel.stars === 5 && !hotel.upgrade && (
                      <span
                        style={{
                          fontSize: 10, fontWeight: 600, color: C.sText,
                          background: C.sBg, borderRadius: 20, padding: "2px 8px",
                        }}
                      >
                        5★ Already
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ margin: 10, borderRadius: 10, overflow: "hidden", height: 140 }}>
                  <img
                    src={hotel.img} alt={hotel.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "0 12px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                    <Star size={12} fill="#FBBC05" color="#FBBC05" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{hotel.rating}</span>
                    <span style={{ fontSize: 10, color: C.sub }}>· Booking.com</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>
                    {hotel.name}
                  </p>
                  <p style={{ fontSize: 11, color: C.sub, margin: "0 0 4px" }}>{hotel.type}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 10 }}>
                    <MapPin size={10} color={C.inact} />
                    <span style={{ fontSize: 11, color: C.inact }}>{hotel.city}</span>
                  </div>
                </div>
              </div>

              {/* ── UPGRADE ROW (under non-5★ hotel cards) ── */}
              {hotel.upgrade && (
                <div
                  onClick={onOpenDrawer}
                  style={{
                    marginTop: -1,
                    background: C.goldBg,
                    border: `1px solid ${C.goldBorder}`,
                    borderTop: "none",
                    borderRadius: "0 0 14px 14px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(184,134,11,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Sparkles size={14} color={C.gold} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, lineHeight: "14px" }}>
                      <span style={{ fontSize: 10, color: "#6B4F1D", fontWeight: 500 }}>Upgrade to 5</span>
                      <Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                    </div>
                    <p style={{
                      fontSize: 12, fontWeight: 600, color: C.head,
                      lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {hotel.upgrade.name}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, color: C.gold, fontWeight: 600, whiteSpace: "nowrap" }}>
                    See details
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── UPGRADE ALL HOTELS ROW (section-level) ── */}
      {upgradeable.length >= 2 && (
        <div
          onClick={onOpenDrawer}
          style={{
            margin: "16px 16px 24px",
            background: C.p100,
            border: `1.5px solid ${C.p300}`,
            borderRadius: 12,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.white,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} color={C.p600} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 14, fontWeight: 700, color: C.head,
              display: "flex", alignItems: "center", gap: 2, lineHeight: "18px",
            }}>
              Upgrade all hotels to 5<Star size={10} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
            </span>
            <span style={{
              fontSize: 12, color: C.sub, fontWeight: 500,
              lineHeight: "16px", marginTop: 2, display: "block",
            }}>
              {upgradeable.length} hotels · <span style={{ color: C.p600, fontWeight: 600 }}>+₹{totalAdditional.toLocaleString("en-IN")} total</span>
            </span>
          </div>
          <span style={{ fontSize: 12, color: C.p600, fontWeight: 600, whiteSpace: "nowrap" }}>
            View details
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCREEN 3 — BOTTOM DRAWER
   ═══════════════════════════════════════════════════════════════════ */
function DrawerScreen({
  itinerary,
  onClose,
  expandedAccordion,
  setExpandedAccordion,
}) {
  const upgradeable = itinerary.hotels.filter((h) => h.upgrade);
  // Total additional = sum of (delta × nights) for each hotel
  const totalAdditional = upgradeable.reduce((s, h) => {
    const nums = h.dayRange.match(/\d+/g) || [1, 2];
    const nights = parseInt(nums[1] || 2) - parseInt(nums[0] || 1) + 1;
    return s + h.upgrade.delta * nights;
  }, 0);

  const perkIcons = {
    pool: Waves, spa: Sparkles, butler: Coffee, airport: Car,
    beach: Waves, couples: Sparkles, club: Coffee, sunset: Eye,
    valley: Eye, yoga: Sparkles, gourmet: UtensilsCrossed,
    dining: UtensilsCrossed, cocktails: Coffee, credit: UtensilsCrossed,
  };

  const getPerkIcon = (perk) => {
    const lower = perk.toLowerCase();
    for (const [key, Icon] of Object.entries(perkIcons)) {
      if (lower.includes(key)) return Icon;
    }
    return Sparkles;
  };

  return (
    <div
      style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 50,
      }}
    >
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* drawer */}
      <div
        style={{
          background: "#FAFAFA", borderRadius: "20px 20px 0 0",
          maxHeight: "82%", overflowY: "auto", animation: "slideUp 0.35s ease both",
        }}
      >
        {/* handle */}
        <div style={{ padding: "12px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div }} />
        </div>

        {/* header */}
        <div style={{
          padding: "16px 20px 18px",
          background: C.white,
          borderBottom: `1px solid ${C.div}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%", background: C.p600,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(227,27,83,0.25)",
              }}
            >
              <Sparkles size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, lineHeight: "22px", letterSpacing: "-0.2px", display: "flex", alignItems: "center", gap: 3 }}>
                Upgrade to 5<Star size={12} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} /> Hotels
              </h3>
              <p style={{ fontSize: 12, color: C.sub, lineHeight: "16px", marginTop: 2 }}>
                {upgradeable.length === 1
                  ? "1 hotel in your itinerary can be upgraded"
                  : `${upgradeable.length} hotels in your itinerary can be upgraded`}
              </p>
            </div>
          </div>
        </div>

        {/* accordions */}
        <div style={{ padding: "16px 20px 8px" }}>
          {upgradeable.map((hotel, idx) => {
            const isOpen = expandedAccordion === idx;
            const up = hotel.upgrade;
            const nums = hotel.dayRange.match(/\d+/g) || [1, 2];
            const nights = parseInt(nums[1] || 2) - parseInt(nums[0] || 1) + 1;
            const totalDelta = up.delta * nights;
            return (
              <div
                key={idx}
                style={{
                  border: `1px solid ${isOpen ? C.p300 : "#EBEBEB"}`,
                  borderRadius: 14, marginBottom: 14, overflow: "hidden",
                  background: C.white,
                  boxShadow: isOpen ? "0 4px 16px rgba(227,27,83,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.25s ease",
                }}
              >
                {/* accordion header — shows CURRENT hotel info */}
                <div
                  onClick={() => setExpandedAccordion(isOpen ? null : idx)}
                  style={{
                    padding: "12px 14px", display: "flex", alignItems: "flex-start",
                    gap: 12, cursor: "pointer",
                  }}
                >
                  <img
                    src={hotel.img} alt=""
                    style={{
                      width: 52, height: 52, borderRadius: 10, objectFit: "cover",
                      border: `1px solid ${C.div}`, flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.head, lineHeight: "18px" }}>
                      {hotel.name} <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 1 }}>{hotel.stars}<Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} /></span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: C.sub, lineHeight: "14px" }}>{hotel.type}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <RatingBadge score={hotel.rating} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.p600 }}>
                        +₹{totalDelta.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} color={C.inact} style={{ marginTop: 4 }} />
                  ) : (
                    <ChevronDown size={18} color={C.inact} style={{ marginTop: 4 }} />
                  )}
                </div>

                {/* accordion body — shows only UPGRADE hotel */}
                {isOpen && (
                  <div style={{ padding: "0 14px 14px", animation: "fadeUp 0.3s ease both" }}>
                    <div style={{ height: 1, background: C.div, marginBottom: 12 }} />

                    <span style={{
                      fontSize: 10, fontWeight: 700, color: C.p600,
                      textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8,
                    }}>Upgrade to</span>

                    {/* upgrade hotel — full width, image left, pink border */}
                    <div style={{
                      display: "flex", gap: 12, padding: 12, borderRadius: 12,
                      border: `1.5px solid ${C.p300}`, background: "#FAFAFA",
                    }}>
                      <img src={up.img} alt="" style={{
                        width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.p600, lineHeight: "18px" }}>
                          {up.name} <span style={{ fontSize: 11, color: C.sub, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 1 }}>5<Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} /></span>
                        </p>
                        <p style={{ fontSize: 11, color: C.sub, marginTop: 2, lineHeight: "14px" }}>
                          {up.type}
                        </p>
                        <div style={{ marginTop: 4 }}>
                          <RatingBadge score={up.rating} />
                        </div>
                      </div>
                    </div>

                    {/* total additional cost */}
                    <div style={{
                      marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 12px", background: C.bg, borderRadius: 8, border: `1px solid ${C.div}`,
                    }}>
                      <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>
                        Total additional cost ({nights}N)
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.p600 }}>
                        +₹{totalDelta.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── combined cost footer (only 2+ upgradeable) ── */}
        {upgradeable.length >= 2 && (
          <div style={{
            margin: "0 20px 8px", padding: "14px 16px",
            background: C.p100, borderRadius: 12, border: `1px solid ${C.p300}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.head, display: "flex", alignItems: "center", gap: 2, lineHeight: "18px" }}>
                Upgrade all {upgradeable.length} hotels to 5<Star size={10} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
              </span>
              <span style={{ fontSize: 11, color: C.sub, display: "block", marginTop: 2 }}>
                Total additional cost
              </span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.p600, lineHeight: "22px" }}>
              +₹{totalAdditional.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* informational footer */}
        <div style={{ padding: "16px 20px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.sub, lineHeight: "18px", fontWeight: 500 }}>
            Interested? Discuss these upgrades with your travel expert on your next call.
          </p>
        </div>
      </div>
    </div>
  );
}
