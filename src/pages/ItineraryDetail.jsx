import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Play, MapPin, Star, Plane, ChevronDown, ChevronUp, X as XIcon, ArrowLeftRight, RefreshCw, Calendar, Users, Zap, Sparkles, ChevronRight } from "lucide-react";
import { C, allItineraries, destData, reviews, getCustomerPhotos, customerPhotos, couplesCount, couplePhotoNames } from "../data";
import { getFlightLegs, generateFlightsForRoute, airports, formatPrice } from "../data/flightData";
import { generateDayOptions } from "../data/dayOptions";
import { Camera } from "lucide-react";
import ChangeDaySheet from "../components/ChangeDaySheet";
import HotelUpgradeDrawer from "../components/HotelUpgradeDrawer";
import ConsultantCard from "../components/ConsultantCard";
import WatchTeaser from "../components/WatchTeaser";
import { videosForDest } from "../data/watchData";

const PREBOOKING_CONSULTANTS = [
  { name: "Riya Shah", phone: "+919876500011" },
  { name: "Aarav Mehta", phone: "+919876500022" },
  { name: "Kabir Iyer", phone: "+919876500033" },
  { name: "Sana Kapoor", phone: "+919876500044" },
];
import { getUpgradeInfo } from "../data/upgradeData";

const Divider = () => <div style={{ height: 6, background: "#F5F5F5", margin: "20px 0" }} />;

// Expand each city stay into individual days for video section + tabs
function getDayActivities(it) {
  const destImgs = destData[it.dest];
  const actImgs = destImgs?.actImgs || [];
  const expanded = [];
  let dayNum = 1;
  it.days.forEach((stay, si) => {
    const actNames = stay.sub.split(" · ");
    for (let d = 0; d < stay.n; d++) {
      const activities = actNames.map((name, ai) => ({
        name,
        img: actImgs[(si * 3 + ai + d) % (actImgs.length || 1)] || it.img,
      }));
      expanded.push({ city: stay.city, n: 1, sub: stay.sub, activities, dayNum });
      dayNum++;
    }
  });
  return expanded;
}

// Sample hotels per city
function getHotels(it) {
  return it.days.map((day, i) => ({
    city: day.city,
    dayRange: `Day ${it.days.slice(0, i).reduce((a, d) => a + d.n, 0) + 1}–${it.days.slice(0, i + 1).reduce((a, d) => a + d.n, 0)}`,
    name: `${day.city} Grand Resort`,
    type: "Deluxe Room · Breakfast included",
    rating: (4 + Math.random() * 0.8).toFixed(1),
    img: destData[it.dest]?.actImgs?.[(i * 2) % (destData[it.dest]?.actImgs?.length || 1)] || it.img,
  }));
}

export default function ItineraryDetail({ selectedFlights, selectedHotels }) {
  const { id } = useParams();
  const it = allItineraries.find(i => i.id === Number(id));
  const [expanded, setExpanded] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [showViewer, setShowViewer] = useState(null); // { day, activity }
  const [saved, setSaved] = useState(false);
  const [changeDayIndex, setChangeDayIndex] = useState(null); // which day's bottom sheet is open
  const [selectedDayOptions, setSelectedDayOptions] = useState({}); // { dayIndex: option }
  const [toast, setToast] = useState(null); // { message, undoData } or null
  const toastTimerRef = useRef(null);
  const [showPricingSheet, setShowPricingSheet] = useState(false);
  const [travelDates, setTravelDates] = useState(null); // { month, travelers }
  const [pricingState, setPricingState] = useState("cached"); // "cached" | "loading" | "live"
  const [showUpgradeDrawer, setShowUpgradeDrawer] = useState(false);
  const [showDayPhotos, setShowDayPhotos] = useState(null); // { dayNum, photoIdx }
  const [showDayWiseDrawer, setShowDayWiseDrawer] = useState(false);
  const [drawerActiveDay, setDrawerActiveDay] = useState(0);

  if (!it) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Itinerary not found</div>;

  const upgradeInfo = getUpgradeInfo(it.id, it.days);

  // Flight legs
  const flightLegs = useMemo(() => getFlightLegs(it), [it]);
  const internationalLegs = flightLegs.filter(l => l.type === "international");
  const internalLegs = flightLegs.filter(l => l.type === "internal");

  // Get selected or default flights for each leg
  const getFlightForLeg = (legIdx) => {
    const saved = selectedFlights?.[it.id]?.legs?.[legIdx];
    if (saved) return saved;
    const leg = flightLegs[legIdx];
    if (!leg) return null;
    const flights = generateFlightsForRoute(leg.from, leg.to, leg.date, 2);
    return flights[0] || null;
  };

  const d = destData[it.dest];
  const daysWithActivities = getDayActivities(it);
  const baseHotels = getHotels(it);
  const isVietnam = it.dest === "Vietnam";

  // Vietnam-only highlights: first unique activity per day, capped at 8
  const highlights = useMemo(() => {
    if (!isVietnam) return [];
    const seen = new Set();
    const items = [];
    daysWithActivities.forEach((day, dayIdx) => {
      day.activities.forEach((act, actIdx) => {
        if (seen.has(act.name)) return;
        seen.add(act.name);
        items.push({
          name: act.name,
          img: act.img,
          dayNum: day.dayNum,
          city: day.city,
          dayIndex: dayIdx,
          activityIndex: actIdx,
        });
      });
    });
    return items.slice(0, 8);
  }, [daysWithActivities, isVietnam]);

  // Merge saved hotel selections
  const hotels = baseHotels.map((h, i) => {
    const savedHotel = selectedHotels?.[it.id]?.stays?.[i];
    if (savedHotel) {
      return {
        ...h,
        name: savedHotel.hotelName,
        type: savedHotel.roomName,
        img: savedHotel.image || h.img,
        rating: savedHotel.bookingScore || h.rating,
        hotelId: savedHotel.hotelId,
      };
    }
    return { ...h, hotelId: `${h.city}-hotel-0` }; // default to first hotel
  });
  const destReviews = reviews.filter(r => r.dest === it.dest).length > 0 ? reviews.filter(r => r.dest === it.dest) : reviews.slice(0, 3);
  const visibleDays = expanded ? daysWithActivities : daysWithActivities.slice(0, 3);

  // ─── Change Day handlers ───
  const showToast = (message, undoData) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, undoData });
    toastTimerRef.current = setTimeout(() => setToast(null), 5000);
  };

  const handleChangeDaySelect = (dayIndex, option) => {
    const previousOption = selectedDayOptions[dayIndex] || null;
    setSelectedDayOptions(prev => ({ ...prev, [dayIndex]: option }));
    setChangeDayIndex(null);

    const pricePart = option.priceDelta !== 0
      ? ` · Trip total ${option.priceDelta > 0 ? "+" : "−"}₹${Math.abs(option.priceDelta).toLocaleString("en-IN")}`
      : "";
    showToast(
      `Day ${daysWithActivities[dayIndex]?.dayNum} updated ✓${pricePart}`,
      { dayIndex, previousOption }
    );
  };

  const handleUndo = () => {
    if (!toast?.undoData) return;
    const { dayIndex, previousOption } = toast.undoData;
    if (previousOption) {
      setSelectedDayOptions(prev => ({ ...prev, [dayIndex]: previousOption }));
    } else {
      setSelectedDayOptions(prev => {
        const next = { ...prev };
        delete next[dayIndex];
        return next;
      });
    }
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  // Get current day data for the change-day sheet
  const changeDayData = changeDayIndex !== null
    ? (() => {
        const data = generateDayOptions(it, changeDayIndex, daysWithActivities);
        if (!data) return null;
        // If user previously selected a different option, mark it as current
        const prevSelected = selectedDayOptions[changeDayIndex];
        if (prevSelected) {
          data.options = data.options.map(opt => ({
            ...opt,
            isCurrent: opt.id === prevSelected.id,
          }));
        }
        return data;
      })()
    : null;

  // Check if a day has alternate options available
  const dayHasOptions = (dayIndex) => {
    const data = generateDayOptions(it, dayIndex, daysWithActivities);
    return data && data.options.length > 1;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* ═══ 1. Hero Image ═══ */}
      <div style={{ position: "relative", height: 240 }}>
        <img src={it.img} alt={it.dest} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
        {/* Top buttons */}
        <Link to={-1} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color="#fff" />
        </Link>
        <button onClick={() => setSaved(!saved)} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
          <Heart size={18} color="#fff" fill={saved ? "#E31B53" : "none"} />
        </button>
        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, lineHeight: "26px" }}>
            🌴 Your {it.dest} Trip · <span style={{ fontWeight: 400 }}>{it.nights}N</span>
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "4px 0 10px" }}>
            Mar 31 – Apr 6 · {2 + (it.veg ? 0 : 1)} travellers
          </p>
          {/* Watch the trip button */}
          <button onClick={() => setShowViewer({ day: 0, activity: 0 })} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)", cursor: "pointer",
          }}>
            <Play size={12} color="#fff" fill="#fff" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Watch the trip</span>
          </button>
        </div>
      </div>

      {/* ═══ 2. Highlights (Vietnam) / See Your Trip (others) ═══ */}
      {isVietnam ? (
        <div style={{ padding: "16px 0 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 16px", marginBottom: 10 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0 }}>Trip highlights</p>
            <span style={{ fontSize: 11, color: C.sub }}>{highlights.length} experiences</span>
          </div>
          <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
            {highlights.map((h, i) => (
              <div
                key={i}
                onClick={() => setShowViewer({ day: h.dayIndex, activity: h.activityIndex })}
                style={{
                  width: 200, minWidth: 200, height: 280, borderRadius: 16, overflow: "hidden",
                  position: "relative", flexShrink: 0, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                <img
                  src={h.img}
                  alt={h.name}
                  className={`ken-burns${i % 3 === 1 ? " ken-burns-2" : i % 3 === 2 ? " ken-burns-3" : ""}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.85))" }} />
                {/* day chip */}
                <div style={{
                  position: "absolute", top: 10, left: 10,
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 999, padding: "4px 9px",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Day {h.dayNum}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>· {h.city}</span>
                </div>
                {/* title */}
                <p style={{ position: "absolute", bottom: 12, left: 12, right: 12, fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, lineHeight: "18px" }}>
                  {h.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: "16px 0 0" }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: C.head, padding: "0 16px", marginBottom: 10 }}>See your trip</p>
          {/* Day tabs */}
          <div className="hs" style={{ gap: 6, paddingLeft: 16, paddingRight: 16, marginBottom: 10 }}>
            {daysWithActivities.map((day, i) => (
              <button key={i} onClick={() => setActiveDay(i)} style={{
                padding: "8px 14px", borderRadius: 10, minWidth: 80, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                background: activeDay === i ? C.p600 : "#F5F5F5",
                border: activeDay === i ? "none" : `1px solid ${C.div}`,
                textAlign: "left",
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: activeDay === i ? "#fff" : C.head, margin: 0 }}>Day {day.dayNum}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                  <MapPin size={10} color={activeDay === i ? "rgba(255,255,255,0.7)" : C.sub} />
                  <span style={{ fontSize: 10, color: activeDay === i ? "rgba(255,255,255,0.7)" : C.sub }}>{day.city}</span>
                </div>
              </button>
            ))}
          </div>
          {/* Video thumbnails */}
          <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
            {daysWithActivities[activeDay]?.activities.map((act, i) => (
              <div key={i} onClick={() => setShowViewer({ day: activeDay, activity: i })} style={{
                width: 170, minWidth: 170, height: 220, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0, cursor: "pointer",
              }}>
                <img src={act.img} alt={act.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 35%, rgba(0,0,0,0.8))" }} />
                {/* Play button */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={16} color="#fff" fill="#fff" />
                </div>
                <p style={{ position: "absolute", bottom: 10, left: 10, right: 10, fontSize: 12, fontWeight: 600, color: "#fff", margin: 0 }}>{act.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {/* ═══ 3. Itinerary at a Glance ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 16 }}>Itinerary at a glance</p>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 1, borderLeft: "1px dashed #D0D5DD" }} />
          {visibleDays.map((day, i) => {
            const globalDayIndex = daysWithActivities.indexOf(day);
            const swapped = selectedDayOptions[globalDayIndex];
            const displayActivities = swapped
              ? swapped.activities
              : day.sub.split(" · ");
            const hasOptions = dayHasOptions(globalDayIndex);

            return (
              <div key={i} style={{ position: "relative", marginBottom: i < visibleDays.length - 1 ? (isVietnam ? 14 : 20) : 0 }}>
                <div style={{ position: "absolute", left: -20, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2px solid ${i === 0 ? "#027A48" : C.inact}` }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>Day {day.dayNum}: {day.city}</p>
                      {swapped && (
                        <span style={{
                          fontSize: 9, fontWeight: 600, color: C.p600, background: C.p100,
                          borderRadius: 6, padding: "2px 6px", whiteSpace: "nowrap",
                        }}>
                          {swapped.vibeLabel}
                        </span>
                      )}
                    </div>
                    {isVietnam && hasOptions && (
                      <button
                        onClick={() => setChangeDayIndex(globalDayIndex)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: 0, background: "none", border: "none",
                          fontSize: 12, fontWeight: 600, color: C.p600, cursor: "pointer",
                          fontFamily: "inherit", flexShrink: 0,
                        }}
                        aria-label="Change day plan"
                      >
                        <RefreshCw size={12} color={C.p600} />
                        Change
                      </button>
                    )}
                  </div>
                  {isVietnam ? (
                    <div className="hs" style={{ gap: 10, marginTop: 8, paddingBottom: 2, marginRight: -16 }}>
                      {displayActivities.map((a, j) => {
                        const thumb = day.activities[j]?.img || it.img;
                        return (
                          <div
                            key={j}
                            onClick={() => setShowViewer({ day: globalDayIndex, activity: j })}
                            style={{ width: 76, minWidth: 76, flexShrink: 0, cursor: "pointer" }}
                          >
                            <div style={{ width: 76, height: 76, borderRadius: 10, overflow: "hidden", background: C.div }}>
                              <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            </div>
                            <p style={{ fontSize: 11, color: C.head, fontWeight: 500, margin: "6px 0 0", lineHeight: "13px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                              {a}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                      {displayActivities.map((a, j) => (
                        <span key={j} style={{ fontSize: 12, color: C.sub }}>• {a}</span>
                      ))}
                    </div>
                  )}
                  {!isVietnam && hasOptions && (
                    <button
                      onClick={() => setChangeDayIndex(globalDayIndex)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        marginTop: 6, padding: 0, background: "none", border: "none",
                        fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <RefreshCw size={12} color={C.p600} />
                      Change day plan
                    </button>
                  )}
                  {/* Day traveler photos */}
                  {!isVietnam && customerPhotos[it.dest] && (
                    <DayTravellerPhotos
                      dest={it.dest}
                      dayNum={day.dayNum}
                      dayIndex={globalDayIndex}
                      totalDays={daysWithActivities.length}
                      onPhotoClick={(photoIdx) => setShowDayPhotos({ dayNum: day.dayNum, photoIdx })}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {daysWithActivities.length > 3 && (
          <button onClick={() => setExpanded(!expanded)} style={{
            display: "flex", alignItems: "center", gap: 4, margin: "14px 0 0", background: "none", border: "none",
            fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer", fontFamily: "inherit",
          }}>
            {expanded ? "Hide details" : "Read more"} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
        {isVietnam && (
          <button
            onClick={() => { setDrawerActiveDay(0); setShowDayWiseDrawer(true); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", marginTop: 16, padding: "12px 16px",
              background: "#fff", border: `1px solid ${C.div}`, borderRadius: 12,
              fontSize: 13, fontWeight: 600, color: C.head, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Play size={12} color={C.p600} fill={C.p600} />
            View day-wise itinerary
            <ChevronRight size={14} color={C.sub} />
          </button>
        )}
      </div>

      <Divider />

      {/* ═══ 4. Hotels ═══ */}
      <div>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, padding: "0 16px", marginBottom: 12 }}>Hotels</p>
        <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
          {hotels.map((h, i) => {
            // Check if this hotel has an upgrade available
            const upgradeForHotel = upgradeInfo.upgrades.find(u => u.cityIndex === i);
            return (
            <div key={i} style={{ width: 280, minWidth: 280, flexShrink: 0 }}>
            <Link to={`/hotel-detail/${it.id}/${i}/${encodeURIComponent(h.hotelId || "")}?current=${encodeURIComponent(h.hotelId || "")}`}
              style={{ borderRadius: upgradeForHotel ? "14px 14px 0 0" : 14, border: `1px solid ${C.div}`, overflow: "hidden", background: C.white, textDecoration: "none", color: "inherit", display: "block" }}>
              <div style={{ padding: "10px 10px 0" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>{h.dayRange} · {h.city}</span>
              </div>
              <div style={{ margin: 10, borderRadius: 10, overflow: "hidden", height: 140 }}>
                <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "0 12px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <Star size={12} fill="#FBBC05" color="#FBBC05" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{h.rating}</span>
                  <span style={{ fontSize: 10, color: C.sub }}>· Booking.com</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{h.name}</p>
                <p style={{ fontSize: 11, color: C.sub, margin: "0 0 4px" }}>{h.type}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 10 }}>
                  <MapPin size={10} color={C.inact} />
                  <span style={{ fontSize: 11, color: C.inact }}>{h.city}</span>
                </div>
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/hotels/${it.id}/${i}?current=${encodeURIComponent(h.hotelId || "")}`; }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    border: "1.5px solid #FD014F", borderRadius: 20,
                    padding: "7px 14px", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, color: "#FD014F",
                    background: "none", minHeight: 36,
                  }}
                >
                  <ArrowLeftRight size={13} color="#FD014F" />
                  Change Hotel
                </span>
              </div>
            </Link>
            {/* upgrade row under hotel card */}
            {upgradeForHotel && (
              <div onClick={() => setShowUpgradeDrawer(true)} style={{
                marginTop: -1, background: "linear-gradient(135deg, #FFF8E7 0%, #FFF1D6 100%)",
                border: "1px solid #E8D5A3", borderTop: "none", borderRadius: "0 0 14px 14px",
                padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: "rgba(184,134,11,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Sparkles size={14} color="#B8860B" strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, lineHeight: "14px" }}>
                    <span style={{ fontSize: 10, color: "#6B4F1D", fontWeight: 500 }}>Upgrade to 5</span>
                    <Star size={8} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.head, lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {upgradeForHotel.upgrade.name}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: "#B8860B", fontWeight: 600, whiteSpace: "nowrap" }}>See details</span>
              </div>
            )}
            </div>
            );
          })}
        </div>

        {/* "Upgrade all hotels" banner */}
        {upgradeInfo.upgradeCount >= 2 && (
          <div onClick={() => setShowUpgradeDrawer(true)} style={{
            margin: "16px 16px 0", background: C.p100, border: `1.5px solid ${C.p300}`,
            borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: C.white,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Sparkles size={16} color={C.p600} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.head, display: "flex", alignItems: "center", gap: 2, lineHeight: "18px" }}>
                Upgrade all hotels to 5<Star size={10} fill="#F5A623" stroke="#F5A623" strokeWidth={1.5} />
              </span>
              <span style={{ fontSize: 12, color: C.sub, fontWeight: 500, lineHeight: "16px", marginTop: 2, display: "block" }}>
                {upgradeInfo.upgradeCount} hotels · <span style={{ color: C.p600, fontWeight: 600 }}>+₹{upgradeInfo.totalAdditional.toLocaleString("en-IN")} total</span>
              </span>
            </div>
            <span style={{ fontSize: 12, color: C.p600, fontWeight: 600, whiteSpace: "nowrap" }}>View details</span>
          </div>
        )}
      </div>

      <Divider />

      {/* ═══ 4b. Pricing & Availability ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Pricing & Availability</p>

        {/* Price status card */}
        <div style={{
          borderRadius: 14, overflow: "hidden",
          border: `1px solid ${travelDates ? C.sBorder : C.div}`,
          background: travelDates ? C.sBg : C.white,
        }}>
          {/* Current price display */}
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.head }}>₹{it.price}</span>
                <span style={{ fontSize: 12, color: C.sub }}>/person</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                {travelDates ? (
                  <>
                    <Zap size={10} color={C.sText} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.sText }}>Live price · {new Date(travelDates.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {travelDates.nights}N · {travelDates.travelers} pax</span>
                  </>
                ) : (
                  <>
                    <Calendar size={10} color={C.inact} />
                    <span style={{ fontSize: 11, color: C.inact }}>Estimated price · may vary by dates</span>
                  </>
                )}
              </div>
            </div>
            {pricingState === "loading" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${C.p300}`, borderTopColor: C.p600, animation: "spin 0.8s linear infinite" }} />
            )}
          </div>

          {/* Travel dates banner if set */}
          {travelDates && (
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.sText, background: `${C.sText}10`, padding: "3px 8px", borderRadius: 6 }}>📅 {new Date(travelDates.fromDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {travelDates.nights}N</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.sText, background: `${C.sText}10`, padding: "3px 8px", borderRadius: 6 }}>👥 {travelDates.travelers} adults</span>
            </div>
          )}

          {/* CTA */}
          <div style={{ padding: "0 16px 14px" }}>
            <button onClick={() => setShowPricingSheet(true)} style={{
              width: "100%", padding: "11px 0", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 600,
              background: travelDates ? C.white : C.p100, color: travelDates ? C.p600 : C.p600,
              border: `1.5px solid ${travelDates ? C.p300 : C.p600}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Zap size={13} color={C.p600} />
              {travelDates ? "Update travel details" : "Get real-time pricing"}
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* ═══ 4c. Book your trip, Payment Card ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Book your trip</p>
        {(() => {
          const priceNum = Number(String(it.price).replace(/,/g, "")) || 0;
          const firstInstallment = Math.round(priceNum * 2 * 0.2);
          return (
        <div style={{
          borderRadius: 12, border: `1px solid ${C.div}`, background: C.white,
          padding: "12px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: C.sub, margin: "0 0 2px" }}>First installment</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>
                ₹{firstInstallment.toLocaleString("en-IN")}
                <span style={{ fontSize: 11, fontWeight: 400, color: C.sub, marginLeft: 4 }}>to confirm</span>
              </p>
            </div>
            <button onClick={() => alert("Razorpay checkout would open here")} style={{
              padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              background: C.p600, color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              Pay via Razorpay
            </button>
          </div>
          <Link to={`/itinerary/${it.id}/payment-plan`} style={{
            marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.div}`, textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 11, color: C.sub }}>4-installment plan</span>
            <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: C.p600 }}>
              View payment plan <ChevronRight size={12} />
            </span>
          </Link>
        </div>
          );
        })()}
      </div>

      <Divider />

      {/* ═══ 5. Flights, Coming Soon Notice ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Flights</p>
        <div style={{
          borderRadius: 14, padding: "16px 16px", border: `1.5px dashed ${C.div}`,
          background: "#FAFAFA",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EBE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Plane size={16} color="#6938EF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 4px" }}>Flights not included in this price</p>
              <p style={{ fontSize: 12, color: C.sub, lineHeight: "17px", margin: "0 0 10px" }}>
                Our travel consultant will help you find the best flights for your dates. In-app flight booking is coming soon!
              </p>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                background: "#EBE9FE", border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 12, fontWeight: 600, color: "#6938EF",
              }}>
                <Plane size={12} color="#6938EF" /> Talk to consultant about flights
              </button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* ═══ 5a. Trip briefings — educational videos for this trip ═══ */}
      {(() => {
        const deck = videosForDest(it.dest);
        if (!deck.length) return null;
        return (
          <>
            <WatchTeaser
              title={`Want to know the secrets of ${it.dest}?`}
              subtitle="Local tips, hidden gems, and what most travelers miss"
              videos={deck}
              libraryTitle={`The ${it.dest} Edit`}
              librarySubtitle="Curated by 30 Sundays. Made for couples."
            />
            <Divider />
          </>
        );
      })()}

      {/* ═══ 5b. Travel Consultant ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Your travel consultant</p>
        {(() => {
          const unassigned = Number(it.id) % 3 === 0;
          const consultant = unassigned ? null : PREBOOKING_CONSULTANTS[Number(it.id) % PREBOOKING_CONSULTANTS.length];
          return (
            <ConsultantCard
              consultant={consultant}
              role="Your travel consultant"
              context={`my ${it.dest} trip`}
              unassigned={unassigned}
            />
          );
        })()}
      </div>

      <Divider />

      {/* ═══ 6. Journey Map ═══ */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, marginBottom: 12 }}>Journey Map</p>
        <div style={{ position: "relative", height: 200, borderRadius: 14, overflow: "hidden", background: "#E8F4EA" }}>
          {/* Simple visual map */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {it.days.map((day, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p600, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: C.head, marginTop: 4, whiteSpace: "nowrap" }}>{day.city}</span>
                    <span style={{ fontSize: 8, color: C.sub }}>{day.n}N</span>
                  </div>
                  {i < it.days.length - 1 && (
                    <div style={{ width: 40, height: 1, borderTop: "2px dashed #A4A7AE", margin: "0 4px 16px" }}>
                      <Plane size={10} color={C.inact} style={{ position: "relative", top: -7, left: 14 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* ═══ 7. Traveler Stories ═══ */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.head }}>4.6</span>
          <span style={{ fontSize: 12, color: C.sub }}>/5</span>
          <div style={{ display: "flex", gap: 1, marginLeft: 4 }}>{[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#34A853" color="#34A853" strokeWidth={0} />)}</div>
        </div>
        <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Based on Google reviews</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 10 }}>Our customers say</p>
        {destReviews.slice(0, 3).map((r, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.sub, flexShrink: 0 }}>{r.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>{r.name}</p>
                  <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#34A853" color="#34A853" strokeWidth={0} />)}</div>
                </div>
                <p style={{ fontSize: 13, color: C.sub, margin: "4px 0 0", lineHeight: "18px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{r.text}"</p>
              </div>
            </div>
            {i < 2 && <div style={{ height: 1, background: C.div }} />}
          </div>
        ))}
      </div>

      {/* Bottom padding for sticky CTA */}
      <div style={{ height: 20 }} />

      {/* ═══ Sticky CTA ═══ */}
      <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", padding: "10px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 20, borderTop: `1px solid ${C.div}` }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: 11, color: C.sub }}>From</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.head }}>₹{it.price}</span>
            <span style={{ fontSize: 11, color: C.sub }}>/person</span>
          </div>
          <p style={{ fontSize: 9, color: C.inact, margin: 0 }}>Price incl. GST & TCS</p>
        </div>
        <Link to={`/plan?dest=${it.dest}`} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "13px 20px", borderRadius: 12,
          background: C.p600, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
        }}>
          Plan My Trip <ArrowRight size={14} />
        </Link>
      </div>

      {/* ═══ Stories-Style Video Viewer ═══ */}
      {showViewer && (
        <VideoViewer
          days={daysWithActivities}
          dest={it.dest}
          initialDay={showViewer.day}
          initialActivity={showViewer.activity}
          onClose={() => setShowViewer(null)}
        />
      )}

      {/* ═══ Day-wise Full Screen (Vietnam) ═══ */}
      {showDayWiseDrawer && (
        <DayWiseScreen
          days={daysWithActivities}
          dest={it.dest}
          itineraryId={it.id}
          hotels={hotels}
          activeDay={drawerActiveDay}
          setActiveDay={setDrawerActiveDay}
          onPlay={(day, activity) => setShowViewer({ day, activity })}
          onChangeDay={(globalDayIndex) => setChangeDayIndex(globalDayIndex)}
          onPhotoOpen={(dayNum, photoIdx) => setShowDayPhotos({ dayNum, photoIdx })}
          onClose={() => setShowDayWiseDrawer(false)}
        />
      )}

      {/* ═══ Pricing Details Bottom Sheet ═══ */}
      {showPricingSheet && (
        <PricingSheet
          onClose={() => setShowPricingSheet(false)}
          initialDates={travelDates}
          onSubmit={(data) => {
            setTravelDates(data);
            setPricingState("loading");
            setShowPricingSheet(false);
            // Simulate live price fetch
            setTimeout(() => setPricingState("live"), 2000);
          }}
        />
      )}

      {/* ═══ Change Day Bottom Sheet ═══ */}
      {changeDayData && (
        <ChangeDaySheet
          dayData={changeDayData}
          onSelect={(option) => handleChangeDaySelect(changeDayIndex, option)}
          onClose={() => setChangeDayIndex(null)}
        />
      )}

      {/* ═══ Toast Notification ═══ */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "50%", left: "50%",
          width: 390, height: 844,
          transform: "translate(-50%, -50%)",
          zIndex: 150,
          pointerEvents: "none",
          borderRadius: 44,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            bottom: 120, left: 16, right: 16,
            background: "rgba(24,29,39,0.95)",
            color: "#fff",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "auto",
            animation: "toastSlideUp 0.3s ease-out forwards",
            fontSize: 13,
            fontWeight: 500,
          }}>
            <span>{toast.message}</span>
            <button
              onClick={handleUndo}
              style={{
                background: "none", border: "none",
                color: C.p300, fontSize: 13, fontWeight: 600,
                cursor: "pointer", textDecoration: "underline",
                fontFamily: "inherit", flexShrink: 0, marginLeft: 8,
              }}
            >
              Undo
            </button>
          </div>
        </div>
      )}

      {/* ═══ Hotel Upgrade Drawer ═══ */}
      {showUpgradeDrawer && upgradeInfo.upgradeCount > 0 && (
        <HotelUpgradeDrawer
          upgrades={upgradeInfo.upgrades}
          totalAdditional={upgradeInfo.totalAdditional}
          onClose={() => setShowUpgradeDrawer(false)}
        />
      )}

      {/* ═══ Day Traveller Photos Fullscreen ═══ */}
      {showDayPhotos && customerPhotos[it.dest] && (
        <DayPhotosGallery
          dest={it.dest}
          dayNum={showDayPhotos.dayNum}
          startIdx={showDayPhotos.photoIdx}
          onClose={() => setShowDayPhotos(null)}
        />
      )}
    </div>
  );
}

// ═══ Day Traveller Photos (inline in each day) ═══
function DayTravellerPhotos({ dest, dayNum, dayIndex, totalDays, onPhotoClick }) {
  const photos = customerPhotos[dest];
  const tags = getCustomerPhotos(dest);
  const names = couplePhotoNames[dest] || [];
  const count = couplesCount[dest] || 500;
  if (!photos || photos.length === 0) return null;

  // Pick 3 photos per day by rotating through the pool
  const startOffset = (dayIndex * 3) % photos.length;
  const dayPhotos = [0, 1, 2].map(i => {
    const idx = (startOffset + i) % photos.length;
    return { img: photos[idx], tag: tags[idx]?.tag || dest, couple: names[idx] || "", realIdx: idx };
  });

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <Camera size={12} color={C.p600} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.head }}>Day {dayNum} photos from travelers</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {dayPhotos.map((p, i) => (
          <div key={i} onClick={() => onPhotoClick(p.realIdx)} style={{ flex: 1, height: 70, borderRadius: 10, overflow: "hidden", position: "relative", cursor: "pointer" }}>
            <img src={p.img} alt={p.tag} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.65))" }} />
            <span style={{ position: "absolute", bottom: 4, left: 5, right: 5, fontSize: 8, fontWeight: 600, color: "#fff", lineHeight: "10px" }}>{p.tag}</span>
          </div>
        ))}
      </div>
      {/* CTA nudge */}
      <div onClick={() => onPhotoClick(dayPhotos[0].realIdx)} style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
        <Play size={10} color={C.p600} fill={C.p600} />
        <span style={{ fontSize: 10, fontWeight: 600, color: C.p600 }}>See how {count}+ couples experienced this</span>
      </div>
    </div>
  );
}

// ═══ Day Photos Fullscreen Gallery ═══
function DayPhotosGallery({ dest, dayNum, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const touchRef = useRef(null);
  const photos = customerPhotos[dest];
  const tags = getCustomerPhotos(dest);
  const names = couplePhotoNames[dest] || [];
  const total = photos.length;

  const handleTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && idx < total - 1) setIdx(idx + 1);
      else if (diff < 0 && idx > 0) setIdx(idx - 1);
    }
    touchRef.current = null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000", display: "flex", flexDirection: "column", maxWidth: 390, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", zIndex: 2 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{names[idx] || dest}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 }}>{dest} · {tags[idx]?.tag || "Day " + dayNum}</p>
        </div>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={18} color="#fff" />
        </button>
      </div>
      <div style={{ textAlign: "center", padding: "0 0 8px", zIndex: 2 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{idx + 1} / {total}</span>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img src={photos[idx]} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        {idx > 0 && <div onClick={() => setIdx(idx - 1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />}
        {idx < total - 1 && <div onClick={() => setIdx(idx + 1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "10px 0", flexWrap: "wrap", maxWidth: "90%", margin: "0 auto" }}>
        {photos.slice(0, 15).map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i === idx ? C.p600 : "rgba(255,255,255,0.3)", transition: "all 0.2s", cursor: "pointer" }} />
        ))}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

// ═══ Flight Card (for ItineraryDetail) ═══
function FlightCard({ flight, leg, itineraryId, legIndex }) {
  return (
    <div style={{ borderRadius: 14, border: `1px solid ${C.div}`, padding: 14, background: C.white, position: "relative" }}>
      {/* Edit button */}
      <Link
        to={`/flights/${itineraryId}/${legIndex}?current=${encodeURIComponent(flight.id)}`}
        style={{
          position: "absolute", top: 10, right: 10,
          width: 30, height: 30, borderRadius: 8,
          background: C.p100, border: `1px solid ${C.p300}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", textDecoration: "none",
        }}
      >
        <ArrowLeftRight size={13} color={C.p600} />
      </Link>

      {/* Direction label */}
      <p style={{ fontSize: 10, fontWeight: 600, color: C.sub, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {leg.direction === "outbound" ? "Outbound" : leg.direction === "return" ? "Return" : "Transfer"}
      </p>

      {/* Airline + Price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, paddingRight: 36 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>{flight.airline}</p>
      </div>

      {/* Flight leg visual */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>{flight.dep}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{flight.from}</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px" }}>
          <span style={{ fontSize: 10, color: C.inact }}>{flight.duration}</span>
          <div style={{ width: "100%", height: 1, background: C.div, margin: "4px 0", position: "relative" }}>
            <Plane size={12} color="#D97706" fill="#D97706" style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)" }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: flight.stops === 0 ? "#027A48" : C.p600 }}>
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </span>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>{flight.arr}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{flight.to}</p>
        </div>
      </div>

      {/* Price */}
      <p style={{ fontSize: 13, fontWeight: 600, color: C.p600, margin: 0 }}>₹ {formatPrice(flight.price)} <span style={{ fontSize: 10, fontWeight: 400, color: C.inact }}>/person</span></p>
    </div>
  );
}

// ═══ Full-Screen Video/Stories Viewer ═══
function VideoViewer({ days, dest, initialDay, initialActivity, onClose }) {
  const [dayIdx, setDayIdx] = useState(initialDay);
  const [actIdx, setActIdx] = useState(initialActivity);
  const [showDetails, setShowDetails] = useState(false);
  const touchStart = useRef(null);

  const currentDay = days[dayIdx];
  const activities = currentDay?.activities || [];
  const currentAct = activities[actIdx] || activities[0];

  const goNext = useCallback(() => {
    if (actIdx < activities.length - 1) {
      setActIdx(a => a + 1);
    } else if (dayIdx < days.length - 1) {
      setDayIdx(d => d + 1);
      setActIdx(0);
    }
  }, [actIdx, activities.length, dayIdx, days.length]);

  const goPrev = useCallback(() => {
    if (actIdx > 0) {
      setActIdx(a => a - 1);
    } else if (dayIdx > 0) {
      setDayIdx(d => d - 1);
      setActIdx(days[dayIdx - 1].activities.length - 1);
    }
  }, [actIdx, dayIdx, days]);

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.55) goNext();
    else goPrev();
  };

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientY;
    if (diff > 60 && dayIdx < days.length - 1) { setDayIdx(d => d + 1); setActIdx(0); }
    else if (diff < -60 && dayIdx > 0) { setDayIdx(d => d - 1); setActIdx(0); }
    touchStart.current = null;
  };

  return (
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 390, height: 844, zIndex: 200, background: "#000", borderRadius: 44, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Background image */}
      <img src={currentAct?.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Tap area */}
      <div onClick={handleTap} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* Top overlay */}
      <div style={{ position: "relative", zIndex: 2, padding: "50px 16px 0" }}>
        {/* Progress bars */}
        <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
          {activities.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: i <= actIdx ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
        {/* Day + City */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: C.p600, borderRadius: 10, padding: "3px 8px" }}>Day {days.slice(0, dayIdx).reduce((a, d) => a + d.n, 0) + 1}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginLeft: 8 }}>{currentDay?.city}</span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <XIcon size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Customer photos nudge, glassmorphism pill */}
      {dest && customerPhotos[dest] && (
        <div style={{ position: "absolute", bottom: 110, right: 16, zIndex: 3, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 20, padding: "6px 12px 6px 6px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex" }}>
            {customerPhotos[dest].slice(0, 2).map((img, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.4)", marginLeft: i > 0 ? -6 : 0 }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{customerPhotos[dest].length} photos</span>
        </div>
      )}

      {/* Bottom overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "80px 16px 28px" }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>{currentAct?.name}</p>
        <button onClick={() => setShowDetails(!showDetails)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>See day details</span>
          <ChevronUp size={12} color="rgba(255,255,255,0.6)" />
        </button>
      </div>

      {/* Day Details Bottom Sheet */}
      {showDetails && (
        <>
          <div onClick={() => setShowDetails(false)} style={{ position: "absolute", inset: 0, zIndex: 3 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: C.white, borderRadius: "20px 20px 0 0", zIndex: 4, padding: "12px 16px 20px", overflowY: "auto" }} className="hide-scrollbar">
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 12px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: C.p600, borderRadius: 10, padding: "3px 8px" }}>Day {days.slice(0, dayIdx).reduce((a, d) => a + d.n, 0) + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{currentDay?.city}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>Included in package</p>
            {activities.map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < activities.length - 1 ? `1px solid ${C.div}` : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === actIdx ? C.p600 : C.div, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: i === actIdx ? 600 : 400, color: i === actIdx ? C.head : C.sub }}>{act.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══ Pricing Bottom Sheet ═══
function PricingSheet({ onClose, initialDates, onSubmit }) {
  const travelerOpts = [2, 4, 6, 8];
  const [fromDate, setFromDate] = useState(initialDates?.fromDate || "");
  const [nights, setNights] = useState(initialDates?.nights || "");
  const [travelers, setTravelers] = useState(initialDates?.travelers || 2);
  const nightOptions = [3, 4, 5, 6, 7, 8, 9, 10];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const isValid = fromDate && nights;

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 390, height: 844, zIndex: 100, borderRadius: 44, overflow: "hidden", pointerEvents: "none" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", pointerEvents: "auto" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.white, borderRadius: "20px 20px 0 0", padding: "20px 20px 34px", pointerEvents: "auto" }} className="animate-slide-up">
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, marginBottom: 4 }}>Get real-time pricing</h3>
        <p style={{ fontSize: 12, color: C.sub, marginBottom: 20 }}>We'll fetch live hotel rates and availability for your dates</p>

        {/* Travel Dates, exact from date + nights */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Calendar size={14} color={C.p600} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>When are you travelling?</p>
          </div>
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

        {/* Travelers */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Users size={14} color={C.p600} />
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>How many adults?</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {travelerOpts.map(t => {
              const on = travelers === t;
              return (
                <button key={t} onClick={() => setTravelers(t)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                  fontSize: 14, fontWeight: on ? 700 : 500,
                  color: on ? C.p600 : C.sub, background: on ? C.p100 : C.white, border: `1.5px solid ${on ? C.p600 : C.div}`,
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { if (isValid) onSubmit({ fromDate, nights: Number(nights), travelers }); }}
          disabled={!isValid}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none", cursor: isValid ? "pointer" : "default",
            background: isValid ? C.p600 : C.div, color: isValid ? "#fff" : C.inact,
            fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            boxShadow: isValid ? "0 4px 16px rgba(227,27,83,0.3)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          <Zap size={14} /> Fetch live prices
        </button>
      </div>
    </div>
  );
}

// ═══ Day-wise Drawer (Vietnam) ═══
const VIETNAM_NARRATIVES = {
  Hanoi:    [{ t: "Arrival in Hanoi",    s: "Settle in, walk the Old Quarter, end with street food." },
             { t: "Old soul of the city", s: "Temples, lakes, and a water puppet show." }],
  "Ha Long":[{ t: "Sail into the bay",   s: "Cruise emerald waters and kayak through limestone caves." },
             { t: "Caves & quiet coves", s: "Hidden lagoons, sunrise tai chi, slow sailing." }],
  HCMC:     [{ t: "Saigon's pulse",      s: "War Remnants, market hopping, rooftop sundowners." },
             { t: "Cu Chi & culture",    s: "Crawl the tunnels, then watch the city dance at night." },
             { t: "Slow & savor",        s: "Coffee crawl, tailor stops, last shopping run." }],
  Sapa:     [{ t: "Into the highlands",  s: "Trek through rice terraces with hill-tribe guides." },
             { t: "Fansipan summit",     s: "Cable car to Indochina's roof; clouds at your feet." },
             { t: "Village & valley",    s: "Homestay lunch, weaving demos, slow valley walks." }],
  "Hoi An": [{ t: "Lantern town",        s: "Tailors, ancient streets, and a riverside dinner." },
             { t: "Cooking & coast",     s: "Market-to-table class, then beach time at An Bang." },
             { t: "Slow Hoi An",         s: "Bicycle the rice fields, sunset by the lanterns." },
             { t: "Memories show",       s: "Riverside spectacle that lights up the night." }],
  "Da Nang":[{ t: "Beach city welcome",  s: "Golden Bridge, sunset cruise on Han River." },
             { t: "Marble & mountains",  s: "Marble Mountains caves, Ba Na Hills cable car." },
             { t: "Spa & sand",          s: "My Khe Beach morning, full-body spa afternoon." }],
  "Phu Quoc":[{ t: "Island arrival",     s: "Sunset on Long Beach, fresh seafood by the shore." },
             { t: "Snorkel & sail",      s: "Three-island hop with snorkel gear and lunch." },
             { t: "Slow island day",     s: "Spa, kayaking, fishing village walk." }],
  Mekong:   [{ t: "Mekong Delta day",    s: "Sampan rides, floating markets, coconut candy." }],
  "Ninh Binh":[{ t: "Tam Coc rowboats",  s: "Glide past karst peaks and rice paddies." },
             { t: "Bich Dong & Bai Dinh", s: "Pagodas, caves, and a quiet boat ride." }],
  "Phong Nha":[{ t: "Paradise Cave",     s: "Walk inside a cathedral of stalactites." },
             { t: "Dark Cave adventure", s: "Zipline, mud bath, swim through a cave river." },
             { t: "Jungle & river",      s: "Botanic garden, kayaking, slow village lunch." }],
  "Nha Trang":[{ t: "Beach welcome",     s: "Promenade walk, seafood dinner by the bay." },
             { t: "Snorkel & spa",       s: "Boat day to Hon Mun, mud bath afternoon." },
             { t: "Po Nagar & ponies",   s: "Cham temples, beach hour, sunset bar." }],
  "Ha Giang":[{ t: "Loop begins",        s: "Heaven's Gate, terraced valleys, twisting roads." },
             { t: "Markets & motors",    s: "Hill-tribe markets, valley vistas, cliffside cafés." },
             { t: "Slow descent",        s: "River canyons, homestay lunch, easy ride back." }],
};

function getDayPlan(day, dayIdx, daysWithActivities) {
  const sameCityCount = daysWithActivities.slice(0, dayIdx).filter(d => d.city === day.city).length;
  const cityDayIdx = sameCityCount;
  const narrArr = VIETNAM_NARRATIVES[day.city] || [];
  const narrative = narrArr[cityDayIdx] || { t: day.city, s: day.activities.map(a => a.name).join(" · ") };

  const isFirstDay = dayIdx === 0;
  const isLastDay = dayIdx === daysWithActivities.length - 1;
  const prevCity = dayIdx > 0 ? daysWithActivities[dayIdx - 1].city : null;
  const nextCity = dayIdx < daysWithActivities.length - 1 ? daysWithActivities[dayIdx + 1].city : null;
  const cityChanged = prevCity && prevCity !== day.city;
  const departingTomorrow = nextCity && nextCity !== day.city;

  let transfer = null;
  if (isFirstDay) transfer = { ico: "✈️", text: `Mumbai → ${day.city} · arriving 10:30 AM` };
  else if (cityChanged) transfer = { ico: "🚗", text: `${prevCity} → ${day.city} · ~4 hr scenic transfer` };
  else if (isLastDay) transfer = { ico: "✈️", text: `${day.city} → Mumbai · 6:30 PM departure` };
  else if (departingTomorrow) transfer = { ico: "🛏️", text: `Last night in ${day.city} before transfer to ${nextCity}` };

  const hotelName = `${day.city} Heritage Resort`;
  const roomType = "Deluxe King · Breakfast included";

  const meals = isFirstDay
    ? ["Welcome dinner"]
    : isLastDay
      ? ["Farewell breakfast"]
      : cityChanged
        ? ["Lunch en route", "Dinner at hotel"]
        : ["Breakfast"];

  const SLOTS = ["Morning", "Afternoon", "Evening"];
  const ICONS = { Morning: "🌅", Afternoon: "☀️", Evening: "🌙" };
  const DURATIONS = ["2 hrs", "3 hrs", "1.5 hrs", "2.5 hrs"];
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  day.activities.forEach((a, i) => {
    const slot = SLOTS[i % SLOTS.length];
    groups[slot].push({ ...a, duration: DURATIONS[i % DURATIONS.length], idx: i });
  });

  return { narrative, transfer, hotelName, roomType, meals, groups, ICONS, cityDayIdx };
}

function DayWiseScreen({ days, dest, itineraryId, hotels, activeDay, setActiveDay, onPlay, onChangeDay, onPhotoOpen, onClose }) {
  const [closing, setClosing] = useState(false);
  const handleClose = () => { setClosing(true); setTimeout(onClose, 280); };
  const day = days[activeDay];
  const plan = day ? getDayPlan(day, activeDay, days) : null;
  const totalActs = day?.activities.length || 0;
  const DURATIONS = ["2 hrs", "3 hrs", "1.5 hrs", "2.5 hrs"];
  const totalDuration = day?.activities.reduce((sum, _, i) => sum + parseFloat(DURATIONS[i % 4]), 0) || 0;
  const dayHotelIdx = hotels?.findIndex(h => h.city === day?.city) ?? -1;
  const dayHotel = dayHotelIdx >= 0 ? hotels[dayHotelIdx] : null;
  const destReviewsForDest = reviews.filter(r => r.dest === dest);

  // Build portrait card list: transfer (if any) + activities
  const portraitCards = [];
  if (plan?.transfer) {
    portraitCards.push({
      type: "transfer",
      icon: plan.transfer.ico,
      title: plan.transfer.text,
      img: day.activities[0]?.img,
    });
  }
  day?.activities.forEach((a, i) => {
    portraitCards.push({
      type: "activity",
      title: a.name,
      img: a.img,
      duration: DURATIONS[i % 4],
      idx: i,
    });
  });

  // Activity description bank
  const ACT_DESC = {
    "Old Quarter":      "Maze of 36 narrow streets — each named after the trade once practiced there. Walk past silk shops, herbal apothecaries, and pho stalls older than your grandparents.",
    "Street food":      "Hanoi on a plate: bun cha smoke, egg coffee crema, banh cuon steamed fresh. A local guide takes you to spots tourists never find.",
    "Temple":           "Tran Quoc Pagoda on West Lake — Vietnam's oldest, set on a quiet island. Incense, lotus ponds, and a six-tiered tower glowing at dusk.",
    "Bay cruise":       "Overnight on a luxury junk among 1,600 limestone islets. Sunset kayaking, fresh seafood, and stargazing from the upper deck.",
    "Kayaking":         "Paddle into hidden lagoons reachable only at low tide. Pass floating fishing villages and emerald grottos.",
    "Caves":            "Sung Sot ('Surprise Cave') — three vast chambers filled with stalactites lit by carefully placed warm lights.",
    "Cu Chi":           "Crawl through a section of the 250 km tunnel network used during the war. Above ground: a glimpse of village life that never stopped.",
    "Markets":          "Ben Thanh by day, Ben Thanh Night by dusk. Sip sugarcane juice, haggle for silk, eat banh xeo at a plastic-stool counter.",
    "Rooftop bars":     "Watch District 1 light up from 50 floors above. Saigon classic cocktails with a side of city skyline.",
    "Golden Bridge":    "The 150 m bridge held aloft by giant stone hands. Cloud-walking is the unofficial sport here.",
    "Beach":            "An Bang or My Khe — soft white sand, gentle surf, palm-thatched cabanas, and the sweet kick of a co-co coconut.",
    "Spa":              "Vietnamese herbal compress massage. 90 minutes of warm oils, lemongrass steam, and quiet.",
    "Lanterns":         "After sundown, Hoi An's old town turns into a river of color. Float a candle on the Thu Bon for good luck.",
    "Tailoring":        "Pick your fabric in the morning, pick up your custom-fitted suit or ao dai by evening. A Hoi An rite of passage.",
    "Cooking":          "Market shop with a chef, then cook 4 dishes in a riverside class — pho, fresh spring rolls, banh xeo, mango sticky rice.",
    "Island beach":     "Sao Beach's sugar-fine sand stretches a kilometer. Hammocks, calm water, and grilled prawns delivered to your towel.",
    "Snorkeling":       "Reefs around An Thoi archipelago — clownfish, parrotfish, and the occasional reef shark in 5 m water.",
    "Boat rides":       "Bamboo sampans through the Tam Coc waterway, paddled by women who use their feet to row.",
    "Pagodas":          "Bai Dinh — Southeast Asia's largest pagoda complex. 500 stone arhat statues line the corridor.",
    "Paradise Cave":    "31 km of cathedral-scale formations. Wooden walkways take you a kilometer in.",
    "Dark Cave":        "Zipline in, mud-bath inside, then swim back out through a cave river. Gear and guide included.",
    "Jungle":           "Phong Nha National Park trek with a former cave explorer. Birds, butterflies, and a hidden waterfall lunch spot.",
    "Lantern Night":    "The town lit by 5,000 silk lanterns. Quietest at the corners; loudest at the night market.",
  };
  const fallback = "Curated experience hand-picked by our local team. Tap to see why we love it.";

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 390, height: 844, borderRadius: 44,
      zIndex: 100, background: "#fff",
      overflow: "hidden",
      animation: closing ? "fadeOutBg 0.28s ease-out forwards" : "fadeInBg 0.28s ease-out forwards",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{ flexShrink: 0, padding: "44px 16px 10px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.div}` }}>
        <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F5F5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={16} color={C.head} />
        </button>
        <div>
          <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>Day-wise itinerary</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>Day {day?.dayNum} · {day?.city}</p>
        </div>
      </div>

      {/* Sticky day pills */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.div}`, background: "#fff" }}>
        <div className="hs" style={{ gap: 6, padding: "10px 16px" }}>
          {days.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              padding: "8px 14px", borderRadius: 10, minWidth: 80, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              background: activeDay === i ? C.p600 : "#F5F5F5",
              border: activeDay === i ? "none" : `1px solid ${C.div}`,
              textAlign: "left",
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: activeDay === i ? "#fff" : C.head, margin: 0 }}>Day {d.dayNum}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                <MapPin size={10} color={activeDay === i ? "rgba(255,255,255,0.7)" : C.sub} />
                <span style={{ fontSize: 10, color: activeDay === i ? "rgba(255,255,255,0.7)" : C.sub }}>{d.city}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
        {/* Day header / narrative */}
        <div style={{ padding: "16px 16px 12px" }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: C.head, margin: 0 }}>{plan?.narrative.t}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 8px" }}>{totalActs} activities · ~{totalDuration} hrs</p>
          <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>{plan?.narrative.s}</p>
        </div>

        {/* Portrait thumbnails: transfer + activities */}
        <div className="hs" style={{ gap: 10, padding: "0 16px 16px" }}>
          {portraitCards.map((c, i) => (
            <div
              key={i}
              onClick={() => c.type === "activity" && onPlay(activeDay, c.idx)}
              style={{
                width: 140, minWidth: 140, height: 200, borderRadius: 14, overflow: "hidden",
                position: "relative", flexShrink: 0,
                cursor: c.type === "activity" ? "pointer" : "default",
                background: c.type === "transfer" ? C.p100 : C.div,
              }}
            >
              {c.img && (
                <img
                  src={c.img}
                  alt={c.title}
                  className={c.type === "activity" ? "" : ""}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: "block",
                    filter: c.type === "transfer" ? "blur(2px) brightness(0.55)" : "none",
                  }}
                />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.85))" }} />
              {c.type === "activity" && (
                <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999 }}>
                  {c.duration}
                </span>
              )}
              {c.type === "transfer" && (
                <div style={{ position: "absolute", top: 12, left: 12, fontSize: 22 }}>{c.icon}</div>
              )}
              <p style={{
                position: "absolute", bottom: 10, left: 10, right: 10,
                fontSize: 12, fontWeight: 600, color: "#fff", margin: 0, lineHeight: "15px",
              }}>
                {c.title}
              </p>
            </div>
          ))}
        </div>

        {/* Day in detail */}
        <div style={{ padding: "0 16px 8px" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: "4px 0 12px" }}>What you'll do</p>
          {day?.activities.map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderBottom: i < day.activities.length - 1 ? `1px solid ${C.div}` : "none",
            }}>
              <div onClick={() => onPlay(activeDay, i)} style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer", background: C.div }}>
                <img src={a.img} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={11} color="#fff" fill="#fff" />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: 0 }}>{a.name}</p>
                  <span style={{ fontSize: 10, color: C.sub }}>· {DURATIONS[i % 4]}</span>
                </div>
                <p style={{ fontSize: 12, color: C.sub, margin: 0, lineHeight: "17px" }}>
                  {ACT_DESC[a.name] || fallback}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hotel card — internal design language */}
        {dayHotel && (() => {
          const NEIGHBORHOODS = {
            Hanoi: "Hoan Kiem · Old Quarter",
            "Ha Long": "Bay Front",
            HCMC: "District 1 · Saigon",
            "Da Nang": "My Khe Beach",
            "Hoi An": "Ancient Town",
            "Phu Quoc": "Long Beach",
            Sapa: "Town Centre",
            Mekong: "Can Tho",
            "Ninh Binh": "Tam Coc",
            "Phong Nha": "Son Trach",
            "Nha Trang": "Tran Phu Beach",
            "Ha Giang": "Old Town",
          };
          const neighborhood = NEIGHBORHOODS[dayHotel.city] || dayHotel.city;
          const ratingOutOf10 = (parseFloat(dayHotel.rating) * 2).toFixed(1);
          const altCount = 3;
          return (
            <div style={{ padding: "16px 16px 0" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>Tonight's stay</p>
              <p style={{ fontSize: 12, color: C.sub, margin: "0 0 10px" }}>{dayHotel.dayRange} · {dayHotel.city}</p>
              <Link
                to={`/hotel-detail/${itineraryId}/${dayHotelIdx}/${encodeURIComponent(dayHotel.hotelId || "")}?current=${encodeURIComponent(dayHotel.hotelId || "")}`}
                style={{ borderRadius: 14, border: `1px solid ${C.div}`, overflow: "hidden", background: C.white, textDecoration: "none", color: "inherit", display: "block" }}
              >
                {/* Image */}
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={dayHotel.img} alt={dayHotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>

                {/* Body */}
                <div style={{ padding: "12px 14px 14px" }}>
                  {/* 30 Sundays Recommended badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center",
                    background: C.p100, color: C.p600,
                    borderRadius: 999, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600,
                    marginBottom: 10,
                  }}>
                    30 Sundays Recommended
                  </div>

                  {/* Star class + Booking rating row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Star size={13} fill="#027A48" color="#027A48" strokeWidth={0} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#027A48" }}>5 star hotel</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{
                        background: "#003B95", color: "#fff",
                        fontSize: 10, fontWeight: 700,
                        padding: "2px 5px", borderRadius: 4,
                        fontFamily: "system-ui, sans-serif", letterSpacing: -0.2,
                      }}>B.</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.head }}>{ratingOutOf10}</span>
                      <span style={{ fontSize: 10, color: C.sub }}>/ 10</span>
                    </div>
                  </div>

                  {/* Name */}
                  <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: "0 0 2px", lineHeight: "20px" }}>{dayHotel.name}</p>

                  {/* Room type */}
                  <p style={{ fontSize: 12, color: C.sub, margin: "0 0 6px" }}>{dayHotel.type}</p>

                  {/* Address */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
                    <MapPin size={11} color={C.sub} />
                    <span style={{ fontSize: 12, color: C.sub }}>{neighborhood}, {dayHotel.city}</span>
                  </div>

                  {/* Two CTAs — text links */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16,
                    paddingTop: 10, borderTop: `1px solid ${C.div}`,
                  }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 13, fontWeight: 600, color: C.p600,
                    }}>
                      View details
                      <ChevronRight size={13} color={C.p600} />
                    </span>
                    <span style={{ width: 1, height: 14, background: C.div }} />
                    <span
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/hotels/${itineraryId}/${dayHotelIdx}?current=${encodeURIComponent(dayHotel.hotelId || "")}`; }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer",
                      }}
                    >
                      <RefreshCw size={12} color={C.p600} />
                      See {altCount} alternatives
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })()}

        {/* Traveller moments — marquee, same as destination page */}
        {dest && customerPhotos[dest] && (
          <div style={{ marginTop: 24 }}>
            <div style={{ padding: "0 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📸</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Traveller moments</span>
              </div>
              <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Couples who explored {dest} with us</p>
            </div>
            <div style={{ overflow: "hidden", width: "100%" }}>
              <div className="marquee-strip" style={{ display: "flex", gap: 10, width: "max-content" }}>
                {(() => {
                  const photos = getCustomerPhotos(dest);
                  const names = couplePhotoNames[dest] || [];
                  return [...photos, ...photos].map((photo, i) => {
                    const realIdx = i % photos.length;
                    const coupleName = names[realIdx] || "";
                    return (
                      <div key={i} onClick={() => onPhotoOpen(day?.dayNum, realIdx)} style={{ width: 180, minWidth: 180, height: 240, borderRadius: 14, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer" }}>
                        <img src={photo.img} alt={photo.tag} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,0.75))" }} />
                        <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                          {coupleName && <p style={{ fontSize: 11, fontWeight: 600, color: "#fff", margin: "0 0 2px", opacity: 0.9 }}>{coupleName}</p>}
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <MapPin size={10} color={C.p300} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{photo.tag}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Reviews — same Google-card design as destination page */}
        {destReviewsForDest.length > 0 && (
          <div style={{ margin: "26px 16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.white, borderRadius: 12, padding: "8px 12px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.head }}>4.6</span>
                <span style={{ fontSize: 12, color: C.sub }}>/5</span>
              </div>
              <p style={{ fontSize: 12, color: C.sub }}>1,000+ Google reviews</p>
            </div>
            {destReviewsForDest.slice(0, 3).map((r, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 12, padding: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", borderLeft: `3px solid ${C.p300}`, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.p600 }}>{r.name[0]}</div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: 0 }}>{r.name}</p>
                      <p style={{ fontSize: 10, color: C.sub, margin: 0 }}>{r.dest}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}</div>
                </div>
                <p style={{ fontSize: 11, lineHeight: "16px", color: C.sub, margin: 0 }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Change day CTA */}
        <div style={{ padding: "20px 16px 28px" }}>
          <button
            onClick={() => onChangeDay(activeDay)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "14px 16px",
              background: "#fff", border: `1.5px solid ${C.p600}`, borderRadius: 12,
              fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <RefreshCw size={14} color={C.p600} />
            Change this day
          </button>
        </div>
      </div>
    </div>
  );
}
