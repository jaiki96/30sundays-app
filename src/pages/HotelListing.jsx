import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, SlidersHorizontal, X as XIcon, ChevronDown } from "lucide-react";
import { C, allItineraries } from "../data";
import { generateHotelsForCity, getStayInfo, formatHotelPrice } from "../data/hotelData";

// ─── Quick filter chips (top bar) ───
const quickFilters = [
  "Private pool", "Hot tub", "Sea view", "Mountain view", "9+ rated", "5 star",
];

// ─── Sort options ───
const sortOptions = [
  { label: "Price: Low to High", fn: (a, b) => a.pricePerNight - b.pricePerNight },
  { label: "Price: High to Low", fn: (a, b) => b.pricePerNight - a.pricePerNight },
  { label: "Rating: High to Low", fn: (a, b) => b.bookingScore - a.bookingScore },
  { label: "Distance: Nearest", fn: (a, b) => a.distanceFromCenter - b.distanceFromCenter },
];

export default function HotelListing() {
  const { itineraryId, stayIndex } = useParams();
  const [params] = useSearchParams();
  const currentHotelId = params.get("current");

  const itinerary = allItineraries.find(i => i.id === Number(itineraryId));
  const stayInfo = itinerary ? getStayInfo(itinerary, Number(stayIndex)) : null;

  // Filter/sort state
  const [activeQuickFilters, setActiveQuickFilters] = useState(new Set());
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortIdx, setSortIdx] = useState(0);
  const [filters, setFilters] = useState({ stars: new Set(), minRating: 0, amenities: new Set() });

  if (!itinerary || !stayInfo) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Stay not found</div>;
  }

  const allHotels = generateHotelsForCity(stayInfo.city, itinerary.dest, stayInfo.checkIn, stayInfo.checkOut, stayInfo.nights);

  // Get current hotel price for delta calculation
  const currentHotel = allHotels.find(h => h.id === currentHotelId);
  const currentPrice = currentHotel ? currentHotel.pricePerNight : allHotels[0]?.pricePerNight || 0;

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...allHotels];

    // Quick filters
    if (activeQuickFilters.size > 0) {
      result = result.filter(h => {
        for (const f of activeQuickFilters) {
          if (f === "5 star" && h.stars !== 5) return false;
          if (f === "9+ rated" && h.bookingScore < 9) return false;
          if (["Private pool", "Hot tub", "Sea view", "Mountain view"].includes(f) && !h.viewTags.includes(f)) return false;
        }
        return true;
      });
    }

    // Star filter
    if (filters.stars.size > 0) {
      result = result.filter(h => filters.stars.has(h.stars));
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(h => h.bookingScore >= filters.minRating);
    }

    // Amenity filter
    if (filters.amenities.size > 0) {
      result = result.filter(h => {
        for (const a of filters.amenities) {
          if (!h.amenities.includes(a)) return false;
        }
        return true;
      });
    }

    // Sort, always put current hotel first
    const sortFn = sortOptions[sortIdx].fn;
    result.sort((a, b) => {
      if (a.id === currentHotelId) return -1;
      if (b.id === currentHotelId) return 1;
      return sortFn(a, b);
    });

    return result;
  }, [allHotels, activeQuickFilters, filters, sortIdx, currentHotelId]);

  const toggleQuickFilter = (f) => {
    setActiveQuickFilters(prev => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: new Set(prev[key]) };
      next[key].has(value) ? next[key].delete(value) : next[key].add(value);
      return next;
    });
  };

  const filterAmenityOptions = ["Breakfast", "Spa", "Swimming pool", "Gym", "Airport Transfer", "Free WiFi", "Beachfront", "Restaurant", "Bar", "Parking"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.white }}>
      {/* ═══ Full scrollable content ═══ */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ═══ Header (scrolls with content) ═══ */}
        <div style={{ background: "linear-gradient(180deg, #FFEBF1 0%, #FFFFFF 100%)", padding: "10px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to={`/itinerary/${itineraryId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0 }}>
              <ArrowLeft size={20} color={C.head} />
            </Link>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>{stayInfo.city} hotels</h1>
                <span style={{ fontSize: 13, color: C.sub }}>({filtered.length})</span>
              </div>
              <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>
                {stayInfo.checkIn} – {stayInfo.checkOut} &bull; 1 Room &bull; 👤 2
              </p>
            </div>
            {/* Sort button */}
            <button onClick={() => setShowSortSheet(true)} style={{
              display: "flex", alignItems: "center", gap: 4, background: "none", border: `1px solid ${C.div}`,
              borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit",
            }}>
              <SlidersHorizontal size={14} color={C.sub} />
              <span style={{ fontSize: 11, color: C.sub }}>Sort</span>
            </button>
          </div>
        </div>

        {/* ═══ Quick filter chips ═══ */}
        <div className="hs" style={{ gap: 8, padding: "8px 16px 12px", borderBottom: `1px solid ${C.div}` }}>
          {/* Filter button */}
          <button onClick={() => setShowFilterSheet(true)} style={{
            display: "flex", alignItems: "center", gap: 4, background: "none", border: `1.5px solid ${C.div}`,
            borderRadius: 20, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
          }}>
            <SlidersHorizontal size={13} color={C.head} />
            <span style={{ fontSize: 12, fontWeight: 500, color: C.head }}>Filters</span>
          </button>
          {quickFilters.map(f => (
            <button
              key={f}
              onClick={() => toggleQuickFilter(f)}
              style={{
                flexShrink: 0, border: activeQuickFilters.has(f) ? "1.5px solid #FD014F" : `1.5px solid ${C.div}`,
                borderRadius: 20, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit",
                background: activeQuickFilters.has(f) ? "#FFEBF1" : "none",
                fontSize: 12, fontWeight: 500, color: activeQuickFilters.has(f) ? "#FD014F" : C.head,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ═══ Hotel List ═══ */}
        <div style={{ padding: "0 16px" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.head }}>No hotels match your filters</p>
              <p style={{ fontSize: 13, color: C.sub }}>Try adjusting your filters to see more options</p>
            </div>
          )}
          {filtered.map((hotel, i) => {
            const isCurrent = hotel.id === currentHotelId;
            const priceDelta = hotel.pricePerNight - currentPrice;

            return (
              <Link
                key={hotel.id}
                to={`/hotel-detail/${itineraryId}/${stayIndex}/${encodeURIComponent(hotel.id)}?current=${encodeURIComponent(currentHotelId || "")}`}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div style={{
                  display: "flex", gap: 14, padding: "16px 0",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.div}` : "none",
                }}>
                  {/* Hotel Image */}
                  <div style={{ width: 120, height: 100, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <img src={hotel.images[0].url} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>

                  {/* Hotel Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isCurrent && (
                      <span style={{
                        display: "inline-block", fontSize: 10, fontWeight: 600, color: "#FD014F",
                        background: "#FFEBF1", borderRadius: 20, padding: "2px 8px", marginBottom: 4,
                      }}>
                        Currently Selected ✓
                      </span>
                    )}

                    <p style={{ fontSize: 14, fontWeight: 700, color: "#181E4C", margin: "0 0 3px", lineHeight: 1.3,
                      overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {hotel.name}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                      <Star size={11} fill="#FD014F" color="#FD014F" />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#FD014F" }}>{hotel.stars} star hotel</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 16, height: 16, borderRadius: 3, background: "#003580", color: "#fff",
                        fontSize: 9, fontWeight: 700,
                      }}>B</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{hotel.bookingScore} Rated</span>
                    </div>

                    <p style={{ fontSize: 12, color: C.sub, margin: "0 0 4px" }}>{hotel.roomType} : {hotel.bedSummary}</p>

                    {/* Price delta */}
                    <p style={{ fontSize: 13, margin: "0 0 4px" }}>
                      {isCurrent ? (
                        <span style={{ fontWeight: 600, color: C.sub }}>Current selection</span>
                      ) : priceDelta === 0 ? (
                        <span style={{ fontWeight: 600, color: C.sub }}>No price change</span>
                      ) : (
                        <>
                          <span style={{ fontWeight: 700, color: priceDelta > 0 ? "#FD014F" : "#4EAC7E" }}>
                            {priceDelta > 0 ? "+" : "−"} ₹ {formatHotelPrice(Math.abs(priceDelta))}
                          </span>
                          <span style={{ fontSize: 11, color: C.sub }}> per night</span>
                        </>
                      )}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <MapPin size={10} color={C.inact} />
                      <span style={{ fontSize: 11, color: C.inact }}>{hotel.neighbourhood}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══ Sort Bottom Sheet ═══ */}
      {showSortSheet && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setShowSortSheet(false)} />
          <div style={{ position: "relative", background: C.white, borderRadius: "16px 16px 0 0", padding: "20px 16px 24px", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>Sort by</p>
              <button onClick={() => setShowSortSheet(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <XIcon size={18} color={C.sub} />
              </button>
            </div>
            {sortOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => { setSortIdx(i); setShowSortSheet(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "12px 0",
                  background: "none", border: "none", borderBottom: i < sortOptions.length - 1 ? `1px solid ${C.div}` : "none",
                  fontSize: 14, color: i === sortIdx ? "#FD014F" : C.head, fontWeight: i === sortIdx ? 600 : 400,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {opt.label} {i === sortIdx && "✓"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Filter Bottom Sheet ═══ */}
      {showFilterSheet && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setShowFilterSheet(false)} />
          <div style={{ position: "relative", background: C.white, borderRadius: "16px 16px 0 0", padding: "20px 16px 24px", zIndex: 1, maxHeight: "70%", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>Filters</p>
              <button onClick={() => setShowFilterSheet(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <XIcon size={18} color={C.sub} />
              </button>
            </div>

            {/* Star category */}
            <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>Star Category</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => toggleFilter("stars", s)}
                  style={{
                    border: filters.stars.has(s) ? "1.5px solid #FD014F" : `1.5px solid ${C.div}`,
                    borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                    background: filters.stars.has(s) ? "#FFEBF1" : "none",
                    fontSize: 13, fontWeight: 500, color: filters.stars.has(s) ? "#FD014F" : C.head,
                  }}
                >
                  {s} ★
                </button>
              ))}
            </div>

            {/* Booking.com rating */}
            <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>Booking.com Rating</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[8, 8.5, 9].map(r => (
                <button
                  key={r}
                  onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === r ? 0 : r }))}
                  style={{
                    border: filters.minRating === r ? "1.5px solid #FD014F" : `1.5px solid ${C.div}`,
                    borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                    background: filters.minRating === r ? "#FFEBF1" : "none",
                    fontSize: 13, fontWeight: 500, color: filters.minRating === r ? "#FD014F" : C.head,
                  }}
                >
                  {r}+
                </button>
              ))}
            </div>

            {/* Amenities */}
            <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: "0 0 8px" }}>Amenities</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {filterAmenityOptions.map(a => (
                <button
                  key={a}
                  onClick={() => toggleFilter("amenities", a)}
                  style={{
                    border: filters.amenities.has(a) ? "1.5px solid #FD014F" : `1.5px solid ${C.div}`,
                    borderRadius: 20, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit",
                    background: filters.amenities.has(a) ? "#FFEBF1" : "none",
                    fontSize: 12, fontWeight: 500, color: filters.amenities.has(a) ? "#FD014F" : C.head,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Apply */}
            <button
              onClick={() => setShowFilterSheet(false)}
              style={{
                width: "100%", height: 48, borderRadius: 9999, border: "none",
                background: "#FD014F", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", marginTop: 8,
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
