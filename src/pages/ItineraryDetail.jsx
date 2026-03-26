import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, Play, MapPin, Star, Plane, ChevronDown, ChevronUp, X as XIcon, ArrowLeftRight, RefreshCw, Calendar, Users, Zap } from "lucide-react";
import { C, allItineraries, destData, reviews, getCustomerPhotos } from "../data";
import { getFlightLegs, generateFlightsForRoute, airports, formatPrice } from "../data/flightData";
import { generateDayOptions } from "../data/dayOptions";
import ChangeDaySheet from "../components/ChangeDaySheet";

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

  if (!it) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Itinerary not found</div>;

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

      {/* ═══ 2. See Your Trip — Video Thumbnails ═══ */}
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
              <div key={i} style={{ position: "relative", marginBottom: i < visibleDays.length - 1 ? 20 : 0 }}>
                <div style={{ position: "absolute", left: -20, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: `2px solid ${i === 0 ? "#027A48" : C.inact}` }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {displayActivities.map((a, j) => (
                      <span key={j} style={{ fontSize: 12, color: C.sub }}>• {a}</span>
                    ))}
                  </div>
                  {hasOptions && (
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
      </div>

      <Divider />

      {/* ═══ 4. Hotels ═══ */}
      <div>
        <p style={{ fontSize: 17, fontWeight: 700, color: C.head, padding: "0 16px", marginBottom: 12 }}>Hotels</p>
        <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
          {hotels.map((h, i) => (
            <Link key={i} to={`/hotel-detail/${it.id}/${i}/${encodeURIComponent(h.hotelId || "")}?current=${encodeURIComponent(h.hotelId || "")}`}
              style={{ width: 280, minWidth: 280, flexShrink: 0, borderRadius: 14, border: `1px solid ${C.div}`, overflow: "hidden", background: C.white, textDecoration: "none", color: "inherit", display: "block" }}>
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
          ))}
        </div>
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

      {/* ═══ 5. Flights — Coming Soon Notice ═══ */}
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
          initialDay={showViewer.day}
          initialActivity={showViewer.activity}
          onClose={() => setShowViewer(null)}
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
function VideoViewer({ days, initialDay, initialActivity, onClose }) {
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

        {/* Travel Dates — exact from date + nights */}
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
