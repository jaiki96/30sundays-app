import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Navigation, X as XIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Bed, Maximize2, Bath, Eye, UtensilsCrossed } from "lucide-react";
import { C, allItineraries } from "../data";
import { generateHotelsForCity, getStayInfo, formatHotelPrice, getHotelReviews } from "../data/hotelData";
import { useDeals, computePrice } from "../data/deals";

const amenityIcons = {
  Breakfast: "🍳", Spa: "💆", "Swimming pool": "🏊", "Indoor Games": "🎮",
  Gym: "🏋️", "Airport Transfer": "🚐", "Free WiFi": "📶", Beachfront: "🏖️",
  Restaurant: "🍽️", Bar: "🍸", "Room Service": "🛎️", Concierge: "🔑",
  Laundry: "👔", Parking: "🅿️",
};

export default function HotelPDP() {
  const { itineraryId, stayIndex, hotelId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const currentHotelId = params.get("current");
  const dealId = params.get("dealId");
  const versionId = params.get("versionId");
  const dealsCtx = useDeals();
  const [showCurrentDetails, setShowCurrentDetails] = useState(false); // expand current-hotel in the bar
  const [confirmReplace, setConfirmReplace] = useState(false); // warning popup

  const itinerary = allItineraries.find(i => i.id === Number(itineraryId));
  const stayInfo = itinerary ? getStayInfo(itinerary, Number(stayIndex)) : null;

  const hotels = itinerary && stayInfo
    ? generateHotelsForCity(stayInfo.city, itinerary.dest, stayInfo.checkIn, stayInfo.checkOut, stayInfo.nights)
    : [];
  const hotel = hotels.find(h => h.id === decodeURIComponent(hotelId));

  const isCurrentHotel = hotel?.id === currentHotelId;

  const currentHotel = currentHotelId ? hotels.find(h => h.id === currentHotelId) : null;
  const currentRoomPrice = currentHotel ? currentHotel.rooms[0].pricePerNight : 0;

  const [selectedRoomId, setSelectedRoomId] = useState(() => {
    if (isCurrentHotel && hotel?.rooms?.length) return hotel.rooms[0].id;
    return hotel?.rooms?.[0]?.id || null;
  });

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("All");

  if (!itinerary || !stayInfo || !hotel) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Hotel not found</div>;
  }

  const reviews = getHotelReviews(hotel.id);
  const nights = stayInfo.nights;
  const selectedRoom = hotel.rooms.find(r => r.id === selectedRoomId);
  const currentRoom = currentHotel?.rooms?.[0];

  // Check if current hotel + current room is selected (same as what's already booked)
  const isSameAsCurrent = isCurrentHotel && selectedRoomId === hotel.rooms[0]?.id;

  // Stay-total difference of the selected room vs the current hotel.
  const stayDelta = currentHotel ? (selectedRoom.pricePerNight - currentRoomPrice) * nights : 0;
  // Delta vs the itinerary's default hotel — what gets stored on the copy.
  const baseHotel = hotels.find(h => h.id === `${stayInfo.city}-hotel-0`) || hotels[0];
  const basePrice = baseHotel?.rooms?.[0]?.pricePerNight || currentRoomPrice;
  const storedDelta = (selectedRoom.pricePerNight - basePrice) * nights;

  const backToItinerary = `/itinerary/${itineraryId}${dealId && versionId ? `?dealId=${dealId}&versionId=${versionId}` : ""}`;
  const hotelsQS = `?current=${encodeURIComponent(currentHotelId || "")}${dealId && versionId ? `&dealId=${dealId}&versionId=${versionId}` : ""}`;

  // Image categories for gallery
  const allCategories = ["All", ...new Set(hotel.images.map(img => img.category))];
  const filteredGalleryImages = galleryCategoryFilter === "All"
    ? hotel.images
    : hotel.images.filter(img => img.category === galleryCategoryFilter);

  // Confirm → write the hotel onto the copy (create one if needed) + return.
  const doReplace = () => {
    if (!selectedRoom) return;
    const stay = {
      hotelId: hotel.id, hotelName: hotel.name,
      roomId: selectedRoom.id, roomName: selectedRoom.name, mealPlan: selectedRoom.mealPlan,
      image: hotel.images[0].url, stars: hotel.stars, bookingScore: hotel.bookingScore,
      neighbourhood: hotel.neighbourhood, pricePerNight: selectedRoom.pricePerNight, nights,
      priceDelta: storedDelta,
    };
    let did = dealId, vid = versionId;
    if (dealId && versionId) {
      const v = dealsCtx.getVersion(dealId, versionId);
      const cust = v?.customizations || {};
      const nextHotels = { ...(cust.selectedHotels || {}), [stayIndex]: stay };
      dealsCtx.updateDraft(dealId, versionId, {
        customizations: { ...cust, selectedHotels: nextHotels },
        indicativePrice: computePrice(itinerary.price, cust.selectedDayOptions, nextHotels),
      });
    } else {
      const created = dealsCtx.createDeal({
        itineraryId: itinerary.id, dest: itinerary.dest,
        title: itinerary.route?.map(r => r.city).join(" · ") || `${itinerary.dest} trip`, img: itinerary.img,
        createdBy: "customer",
        customizations: { selectedDayOptions: {}, selectedHotels: { [stayIndex]: stay }, travelDates: null },
        indicativePrice: computePrice(itinerary.price, {}, { [stayIndex]: stay }),
      });
      did = created.dealId; vid = created.versionId;
    }
    navigate(`/itinerary/${itinerary.id}?dealId=${did}&versionId=${vid}&toast=hotel`);
  };

  // Gallery layout: 1 big (left, spans 2 rows) + 2 small (right column) + "+N" overlay on last
  const galleryImages = hotel.images.slice(0, 4); // Show 4 in grid
  const remainingCount = hotel.images.length - 3; // "+N" count (images beyond the 3 visible ones)

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.white, position: "relative" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>

        {/* ═══ Header ═══ */}
        <div style={{ background: "linear-gradient(180deg, #FFEBF1 0%, #FFFFFF 100%)", padding: "10px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <Link
              to={`/hotels/${itineraryId}/${stayIndex}${hotelsQS}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0 }}
            >
              <ArrowLeft size={20} color={C.head} />
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#181E4C", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {hotel.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {Array.from({ length: hotel.stars }).map((_, s) => (
                    <Star key={s} size={14} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />
                  ))}
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 16, height: 16, borderRadius: 3, background: "#003580", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                }}>B</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.head }}>{hotel.bookingScore} Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Photo Gallery, 1 big + 2 small + "+N" tile ═══ */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gridTemplateRows: "1fr 1fr", gap: 3, height: 220, borderRadius: 12, overflow: "hidden" }}>
            {/* Large photo, spans 2 rows */}
            <div style={{ gridRow: "1 / 3", cursor: "pointer" }} onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}>
              <img src={galleryImages[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Top-right small */}
            <div style={{ cursor: "pointer" }} onClick={() => { setGalleryIdx(1); setGalleryOpen(true); }}>
              <img src={galleryImages[1].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Bottom-right, "+N Photos" overlay */}
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => { setGalleryIdx(2); setGalleryOpen(true); }}>
              <img src={galleryImages[2].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {remainingCount > 0 && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>+{remainingCount}</span>
                  <span style={{ fontSize: 11, color: "#fff" }}>Photos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Stay summary ═══ */}
        <div style={{ margin: "16px 16px 0", borderRadius: 16, border: `1px solid ${C.div}`, padding: "10px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#181E4C", margin: "0 0 2px" }}>
            {stayInfo.checkIn} – {stayInfo.checkOut} &bull; {stayInfo.nights} {stayInfo.nights === 1 ? "night" : "nights"} &bull; 👤 2 travellers
          </p>
          <span style={{ fontSize: 12, color: C.sub }}>Check-In: {hotel.checkInTime} &bull; Check-Out: {hotel.checkOutTime}</span>
        </div>

        {/* ═══ Property Highlights ═══ */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", padding: "0 16px", margin: "0 0 12px" }}>Property Highlights</p>
          <div className="hs" style={{ gap: 16, paddingLeft: 16, paddingRight: 16 }}>
            {hotel.amenities.map((amenity, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64, flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: C.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  {amenityIcons[amenity] || "✨"}
                </div>
                <span style={{ fontSize: 11, color: C.sub, textAlign: "center", lineHeight: 1.2 }}>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Location — tappable map, opens Google Maps ═══ */}
        <div style={{ margin: "24px 16px 0", borderRadius: 16, border: `1px solid ${C.div}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ position: "relative", height: 120, background: "url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80&auto=format&fit=crop) center/cover no-repeat, #E8ECEF" }}>
              <div style={{
                position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -100%)",
                width: 32, height: 32, borderRadius: "50%", background: "#FD014F",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 10px rgba(253,1,79,0.45), 0 0 0 4px rgba(253,1,79,0.18)",
              }}>
                <MapPin size={16} color="#fff" fill="#fff" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#181E4C", margin: 0 }}>{stayInfo.city}</p>
                <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{hotel.address}</p>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#FD014F", whiteSpace: "nowrap", flexShrink: 0 }}>
                <Navigation size={12} color="#FD014F" />
                Open in Maps
              </span>
            </div>
          </a>
        </div>

        {/* ═══ Room Selection ═══ */}
        <div style={{ marginTop: 24, padding: "0 16px" }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", margin: "0 0 14px" }}>Select your room</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {hotel.rooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const priceDelta = (room.pricePerNight * nights) - (currentRoomPrice * nights);
              const isCurrentRoom = isCurrentHotel && room.id === hotel.rooms[0].id;

              return (
                <div key={room.id} style={{
                  borderRadius: 14, overflow: "hidden",
                  border: isSelected ? "2px solid #FD014F" : `1px solid ${C.div}`,
                  background: isSelected ? "#FFF5F8" : C.white,
                  padding: isSelected ? 15 : 16,
                }}>
                  {/* Room name + meal plan */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#181E4C", margin: 0 }}>{room.name}</p>
                    {isCurrentRoom && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.sub, background: C.bg, borderRadius: 20, padding: "2px 8px" }}>
                        Current Room
                      </span>
                    )}
                  </div>

                  {/* Meal plan tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                    <UtensilsCrossed size={12} color={room.mealPlan === "Only Room" ? C.inact : "#4EAC7E"} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: room.mealPlan === "Only Room" ? C.inact : "#4EAC7E" }}>
                      {room.mealPlan}
                    </span>
                  </div>

                  {/* Bed type + size + amenities */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Bed size={13} color={C.sub} />
                      <span style={{ fontSize: 12, color: C.sub }}>{room.bedType}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Maximize2 size={13} color={C.sub} />
                      <span style={{ fontSize: 12, color: C.sub }}>Size: {room.size} m²</span>
                    </div>
                    {room.amenities.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {a === "Jacuzzi" && <Bath size={13} color={C.sub} />}
                        {a === "Sea View" && <Eye size={13} color={C.sub} />}
                        {!["Jacuzzi", "Sea View"].includes(a) && <span style={{ fontSize: 11, color: C.sub }}>•</span>}
                        <span style={{ fontSize: 12, color: C.sub }}>{a}</span>
                      </div>
                    ))}
                  </div>

                  {/* Room photos */}
                  <div className="hs" style={{ gap: 6, marginBottom: 12 }}>
                    {room.images.map((img, i) => (
                      <div key={i} style={{ width: 110, height: 80, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    ))}
                  </div>

                  {/* Price + action */}
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 12, color: "#FD014F", margin: "0 0 2px" }}>Price for {nights} night{nights > 1 ? "s" : ""}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 2px", color: priceDelta < 0 ? "#4EAC7E" : priceDelta > 0 ? "#FD014F" : C.sub }}>
                        {priceDelta === 0 ? "No price change" : `${priceDelta > 0 ? "+" : "−"} ₹ ${formatHotelPrice(Math.abs(priceDelta))}`}
                      </p>
                      <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>+₹ {formatHotelPrice(room.taxPerNight * nights)} taxes and charges</p>
                    </div>

                    {isSelected ? (
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#FD014F" }}>Selected</span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedRoomId(room.id); }}
                        style={{
                          background: "none", border: `1.5px solid ${C.div}`, borderRadius: 8,
                          padding: "6px 18px", fontSize: 13, fontWeight: 600, color: C.head,
                          cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ Guest Reviews ═══ */}
        <div style={{ marginTop: 24, padding: "0 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", margin: 0 }}>Guest Reviews</p>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 18, height: 18, borderRadius: 3, background: "#003580", color: "#fff",
              fontSize: 10, fontWeight: 700,
            }}>B</span>
            <span style={{ fontSize: 12, color: C.sub }}>Booking.com</span>
          </div>

          <div style={{ borderRadius: 14, border: `1px solid ${C.div}`, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 8, background: "#003580", color: "#fff",
                fontSize: 16, fontWeight: 700,
              }}>{hotel.bookingScore}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#181E4C" }}>Very Good</span>
              <span style={{ fontSize: 12, color: C.sub }}>({hotel.reviewCount})</span>
            </div>

            {[
              { label: "Cleanliness", score: reviews.cleanliness },
              { label: "Comfort", score: reviews.comfort },
              { label: "Facilities", score: reviews.facilities },
            ].map(({ label, score }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#FD014F" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.head }}>{score}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.bg }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "#4EAC7E", width: `${(score / 10) * 100}%` }} />
                </div>
              </div>
            ))}

            <button style={{
              background: "none", border: "none", padding: 0, marginTop: 4,
              fontSize: 13, fontWeight: 600, color: "#FD014F", cursor: "pointer", fontFamily: "inherit",
            }}>
              View all
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Sticky bottom bar — current hotel + price diff, expandable, Replace CTA ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 16px 14px",
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 26%)",
      }}>
        <div style={{ background: C.white, border: `1px solid ${C.div}`, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {/* Expanded current-hotel details */}
          {showCurrentDetails && currentHotel && (
            <div style={{ display: "flex", gap: 12, padding: "12px 14px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                <img src={currentHotel.images[0].url} alt={currentHotel.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#181E4C", margin: "0 0 2px" }}>{currentHotel.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <div style={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: currentHotel.stars }).map((_, s) => <Star key={s} size={12} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>· {currentHotel.bookingScore} Rated</span>
                </div>
                <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{currentRoom?.name}{currentRoom?.mealPlan ? ` · ${currentRoom.mealPlan}` : ""}</p>
              </div>
            </div>
          )}

          {/* Summary row + Replace CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: showCurrentDetails && currentHotel ? "10px 14px 12px" : "12px 14px" }}>
            <button
              onClick={() => setShowCurrentDetails(s => !s)}
              disabled={!currentHotel}
              style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", padding: 0, cursor: currentHotel ? "pointer" : "default", fontFamily: "inherit" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: C.sub }}>Replacing</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.head, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{currentHotel ? currentHotel.name : "current hotel"}</span>
                {currentHotel && (showCurrentDetails ? <ChevronDown size={14} color={C.sub} style={{ flexShrink: 0 }} /> : <ChevronUp size={14} color={C.sub} style={{ flexShrink: 0 }} />)}
              </div>
              <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: stayDelta === 0 ? C.sub : stayDelta > 0 ? "#FD014F" : "#4EAC7E" }}>
                {stayDelta === 0 ? "No price change" : `${stayDelta > 0 ? "+" : "−"} ₹ ${formatHotelPrice(Math.abs(stayDelta))}`}
                <span style={{ fontSize: 11, fontWeight: 400, color: C.sub }}>{stayDelta === 0 ? "" : ` for ${nights} night${nights > 1 ? "s" : ""}`}</span>
              </p>
            </button>
            <button
              onClick={() => setConfirmReplace(true)}
              disabled={!selectedRoomId || isSameAsCurrent}
              style={{
                flexShrink: 0, padding: "11px 18px", height: 44, borderRadius: 12, border: "none",
                background: (!selectedRoomId || isSameAsCurrent) ? C.inact : "#FD014F",
                color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: (!selectedRoomId || isSameAsCurrent) ? "default" : "pointer", fontFamily: "inherit",
              }}
            >
              {isSameAsCurrent ? "Selected" : "Replace hotel"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Replace-hotel warning popup ═══ */}
      {confirmReplace && (
        <div style={{ position: "absolute", inset: 0, zIndex: 120, display: "flex", alignItems: "flex-end" }}>
          <div onClick={() => setConfirmReplace(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "relative", width: "100%", background: C.white, borderRadius: "20px 20px 0 0", padding: "20px 18px calc(20px + env(safe-area-inset-bottom))", boxShadow: "0 -8px 32px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.div, margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: "0 0 8px" }}>Replace your hotel?</h3>
            <p style={{ fontSize: 13, color: C.sub, margin: "0 0 16px", lineHeight: "19px" }}>
              {currentHotel ? <>You're swapping <b style={{ color: C.head }}>{currentHotel.name}</b> for <b style={{ color: C.head }}>{hotel.name}</b> ({selectedRoom.name}).</> : <>Set <b style={{ color: C.head }}>{hotel.name}</b> ({selectedRoom.name}) for this stay.</>}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: C.bg, marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: C.sub }}>Price difference</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: stayDelta === 0 ? C.sub : stayDelta > 0 ? "#FD014F" : "#4EAC7E" }}>
                {stayDelta === 0 ? "No change" : `${stayDelta > 0 ? "+" : "−"} ₹ ${formatHotelPrice(Math.abs(stayDelta))}`}
              </span>
            </div>
            <button onClick={doReplace} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: "#FD014F", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
              Replace hotel
            </button>
            <button onClick={() => setConfirmReplace(false)} style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: `1px solid ${C.div}`, background: C.white, color: C.head, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Go back
            </button>
          </div>
        </div>
      )}

      {/* ═══ Fullscreen Gallery ═══ */}
      {galleryOpen && (
        <div style={{
          position: "absolute", inset: 0, background: "#000", zIndex: 100,
          display: "flex", flexDirection: "column",
        }}>
          {/* Gallery header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
            <span style={{ fontSize: 14, color: "#fff" }}>{galleryIdx + 1} / {filteredGalleryImages.length}</span>
            <button onClick={() => setGalleryOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <XIcon size={22} color="#fff" />
            </button>
          </div>

          {/* Category filter pills */}
          <div className="hs" style={{ gap: 8, padding: "0 16px 12px" }}>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setGalleryCategoryFilter(cat); setGalleryIdx(0); }}
                style={{
                  flexShrink: 0, border: "none", borderRadius: 20,
                  padding: "5px 12px", cursor: "pointer", fontFamily: "inherit",
                  background: galleryCategoryFilter === cat ? "#FD014F" : "rgba(255,255,255,0.15)",
                  fontSize: 12, fontWeight: 500, color: "#fff",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main image */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0 }}>
            <img
              src={filteredGalleryImages[galleryIdx]?.url}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
            {galleryIdx > 0 && (
              <button
                onClick={() => setGalleryIdx(galleryIdx - 1)}
                style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronLeft size={20} color="#fff" />
              </button>
            )}
            {galleryIdx < filteredGalleryImages.length - 1 && (
              <button
                onClick={() => setGalleryIdx(galleryIdx + 1)}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronRight size={20} color="#fff" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="hs" style={{ gap: 6, padding: "12px 16px 16px" }}>
            {filteredGalleryImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setGalleryIdx(i)}
                style={{
                  width: 56, height: 42, borderRadius: 6, overflow: "hidden", flexShrink: 0, cursor: "pointer",
                  border: i === galleryIdx ? "2px solid #FD014F" : "2px solid transparent",
                  opacity: i === galleryIdx ? 1 : 0.6,
                }}
              >
                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
