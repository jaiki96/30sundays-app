import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Navigation, X as XIcon, ChevronLeft, ChevronRight, Bed, Maximize2, Bath, Eye, UtensilsCrossed } from "lucide-react";
import { C, allItineraries } from "../data";
import { generateHotelsForCity, getStayInfo, formatHotelPrice, getHotelReviews } from "../data/hotelData";

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

  // Check if current hotel + current room is selected (same as what's already booked)
  const isSameAsCurrent = isCurrentHotel && selectedRoomId === hotel.rooms[0]?.id;

  // Image categories for gallery
  const allCategories = ["All", ...new Set(hotel.images.map(img => img.category))];
  const filteredGalleryImages = galleryCategoryFilter === "All"
    ? hotel.images
    : hotel.images.filter(img => img.category === galleryCategoryFilter);

  const handleContinue = () => {
    if (!selectedRoom || isSameAsCurrent) return;
    navigate(
      `/review-hotel/${itineraryId}/${stayIndex}?new=${encodeURIComponent(hotel.id)}&room=${encodeURIComponent(selectedRoom.id)}&current=${encodeURIComponent(currentHotelId || "")}`
    );
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
              to={`/hotels/${itineraryId}/${stayIndex}?current=${encodeURIComponent(currentHotelId || "")}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0 }}
            >
              <ArrowLeft size={20} color={C.head} />
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#181E4C", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {hotel.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Star size={11} fill="#FD014F" color="#FD014F" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#FD014F" }}>{hotel.stars} star hotel</span>
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

        {/* ═══ Photo Gallery — 1 big + 2 small + "+N" tile ═══ */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gridTemplateRows: "1fr 1fr", gap: 3, height: 220, borderRadius: 12, overflow: "hidden" }}>
            {/* Large photo — spans 2 rows */}
            <div style={{ gridRow: "1 / 3", cursor: "pointer" }} onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}>
              <img src={galleryImages[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Top-right small */}
            <div style={{ cursor: "pointer" }} onClick={() => { setGalleryIdx(1); setGalleryOpen(true); }}>
              <img src={galleryImages[1].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Bottom-right — "+N Photos" overlay */}
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

        {/* ═══ Location Card ═══ */}
        <div style={{ margin: "16px 16px 0", borderRadius: 16, border: `1px solid ${C.div}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FFEBF1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={18} color="#FD014F" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#181E4C", margin: 0 }}>{stayInfo.city}</p>
              <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{hotel.address}</p>
            </div>
            <Navigation size={20} color="#FD014F" style={{ flexShrink: 0 }} />
          </div>
          <div style={{ borderTop: `1px solid ${C.div}`, padding: "10px 16px" }}>
            <span style={{ fontSize: 12, color: C.sub }}>Check-In: {hotel.checkInTime} &bull; Check-Out: {hotel.checkOutTime}</span>
          </div>
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

      {/* ═══ Sticky Continue CTA ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "12px 16px 16px",
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%)",
      }}>
        <button
          onClick={handleContinue}
          disabled={!selectedRoomId || isSameAsCurrent}
          style={{
            width: "100%", height: 52, borderRadius: 9999, border: "none",
            background: (!selectedRoomId || isSameAsCurrent) ? C.inact : "#FD014F",
            color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: (!selectedRoomId || isSameAsCurrent) ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {isSameAsCurrent ? "Already Selected" : "Continue"}
        </button>
      </div>

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
