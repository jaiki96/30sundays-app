import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Navigation, X as XIcon, ChevronLeft, ChevronRight, Bed, Maximize2, Bath, Eye, UtensilsCrossed, FileText, Phone } from "lucide-react";
import { C } from "../data";
import { getTripById } from "../data/tripData";
import { generateHotelsForCity, getHotelReviews } from "../data/hotelData";

const amenityIcons = {
  Breakfast: "🍳", Spa: "💆", "Swimming pool": "🏊", "Indoor Games": "🎮",
  Gym: "🏋️", "Airport Transfer": "🚐", "Free WiFi": "📶", Beachfront: "🏖️",
  Restaurant: "🍽️", Bar: "🍸", "Room Service": "🛎️", Concierge: "🔑",
  Laundry: "👔", Parking: "🅿️",
};

// Pick a rich stand-in hotel record from the generator, then layer the trip's
// actual hotel name/stars/rating/photo on top. Room is locked to the trip's
// roomType so the customer sees only their booking.
function buildBookedHotel(tripHotel, trip) {
  const checkIn = trip.startDate || new Date().toISOString().split("T")[0];
  const checkOut = trip.endDate || checkIn;
  const generated = generateHotelsForCity(tripHotel.city, trip.destination, checkIn, checkOut, 1);
  // Deterministic pick based on hotel name hash so the same booked hotel keeps
  // the same rich record between renders.
  const hash = [...tripHotel.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const standIn = generated[hash % generated.length] || generated[0];
  if (!standIn) return null;

  // Override hero image with the trip's actual hotel photo so it visually
  // matches the carousel card.
  const heroImg = tripHotel.photo
    ? [{ url: tripHotel.photo, category: "Exterior" }, ...standIn.images.slice(1)]
    : standIn.images;

  // Lock the first room to the trip's booked room type.
  const lockedRoom = {
    ...standIn.rooms[0],
    name: tripHotel.roomType || standIn.rooms[0].name,
  };

  return {
    ...standIn,
    name: tripHotel.name,
    stars: tripHotel.stars ?? standIn.stars,
    bookingScore: tripHotel.bookingRating ?? standIn.bookingScore,
    images: heroImg,
    room: lockedRoom,
    city: tripHotel.city,
    // Phone for "Call hotel" — generated stub
    phone: tripHotel.phone || "+91 80 4567 1234",
  };
}

function QuickActionButton({ Icon, label, onClick, href }) {
  const Tag = href ? "a" : "button";
  const props = href ? { href, target: "_blank", rel: "noreferrer" } : { onClick };
  return (
    <Tag
      {...props}
      style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "12px 8px",
        background: C.white,
        border: "1px solid #E0E2EB",
        borderRadius: 12,
        cursor: "pointer",
        fontFamily: "inherit",
        textDecoration: "none",
        boxShadow: "0 4px 4px -2px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: "#FFE6ED",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={18} color="#FD014F" strokeWidth={1.8} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#181E4C" }}>{label}</span>
    </Tag>
  );
}

export default function BookedHotelPDP() {
  const { tripId, hotelIdx } = useParams();
  const navigate = useNavigate();

  const trip = getTripById(tripId);
  const tripHotel = trip?.hotels?.[Number(hotelIdx)];

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("All");

  if (!trip || !tripHotel) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: C.sub }}>Hotel not found</p>
        <button onClick={() => navigate(`/trips/${tripId}`)} style={{ marginTop: 16, color: "#FD014F", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Back to trip
        </button>
      </div>
    );
  }

  const hotel = buildBookedHotel(tripHotel, trip);
  if (!hotel) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Hotel not found</div>;
  }

  const room = hotel.room;
  const reviews = getHotelReviews(hotel.id);

  // Gallery
  const galleryImages = hotel.images.slice(0, 3);
  const remainingCount = hotel.images.length - 3;
  const allCategories = ["All", ...new Set(hotel.images.map(img => img.category))];
  const filteredGalleryImages = galleryCategoryFilter === "All"
    ? hotel.images
    : hotel.images.filter(img => img.category === galleryCategoryFilter);

  const directionUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${hotel.name}, ${hotel.city}`)}`;
  const phoneDigits = (hotel.phone || "").replace(/\s/g, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: C.white, position: "relative" }}>
      <div style={{ flex: 1, paddingBottom: 24 }}>

        {/* ═══ Header ═══ */}
        <div style={{ background: "linear-gradient(180deg, #FFEBF1 0%, #FFFFFF 100%)", padding: "10px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <button
              onClick={() => navigate(`/trips/${trip.id}`)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <ArrowLeft size={20} color="#181E4C" />
            </button>
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
                <span style={{ fontSize: 11, fontWeight: 600, color: "#181E4C" }}>{hotel.bookingScore} Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Photo Gallery ═══ */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gridTemplateRows: "1fr 1fr", gap: 3, height: 220, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ gridRow: "1 / 3", cursor: "pointer" }} onClick={() => { setGalleryIdx(0); setGalleryOpen(true); }}>
              <img src={galleryImages[0]?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => { setGalleryIdx(1); setGalleryOpen(true); }}>
              <img src={galleryImages[1]?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => { setGalleryIdx(2); setGalleryOpen(true); }}>
              <img src={galleryImages[2]?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

        {/* ═══ Quick Actions ═══ */}
        <div style={{ padding: "16px 16px 0", display: "flex", gap: 10 }}>
          <QuickActionButton
            Icon={FileText}
            label="Voucher"
            onClick={() => alert(`Hotel voucher\n\n${hotel.name}\n${room.name}\nCheck-in: ${trip.startDateDisplay}\nCheck-out: ${trip.endDateDisplay}\n\nDownloading PDF…`)}
          />
          <QuickActionButton
            Icon={Navigation}
            label="Directions"
            href={directionUrl}
          />
          <QuickActionButton
            Icon={Phone}
            label="Call hotel"
            href={`tel:${phoneDigits}`}
          />
        </div>

        {/* ═══ Location Card ═══ */}
        <div style={{ margin: "16px 16px 0", borderRadius: 16, border: `1px solid ${C.div}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FFEBF1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MapPin size={18} color="#FD014F" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#181E4C", margin: 0 }}>{hotel.city}</p>
              <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{hotel.address}</p>
            </div>
            <a href={directionUrl} target="_blank" rel="noreferrer" style={{ flexShrink: 0, color: "#FD014F" }}>
              <Navigation size={20} color="#FD014F" />
            </a>
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

        {/* ═══ Your Room (fixed, no selector) ═══ */}
        <div style={{ marginTop: 24, padding: "0 16px" }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", margin: "0 0 14px" }}>Your room</p>

          <div style={{
            borderRadius: 14, overflow: "hidden",
            border: `1px solid ${C.div}`, background: C.white, padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#181E4C", margin: 0 }}>{room.name}</p>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#027A48", background: "#ECFDF3", border: "1px solid #C0E5D5", borderRadius: 20, padding: "2px 8px" }}>
                Booked
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              <UtensilsCrossed size={12} color={room.mealPlan === "Only Room" ? C.inact : "#4EAC7E"} />
              <span style={{ fontSize: 11, fontWeight: 600, color: room.mealPlan === "Only Room" ? C.inact : "#4EAC7E" }}>
                {room.mealPlan}
              </span>
            </div>

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

            <div className="hs" style={{ gap: 6 }}>
              {room.images.map((img, i) => (
                <div key={i} style={{ width: 110, height: 80, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
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
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#181E4C" }}>{score}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.bg }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "#4EAC7E", width: `${(score / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Fullscreen Gallery ═══ */}
      {galleryOpen && (
        <div style={{
          position: "absolute", inset: 0, background: "#000", zIndex: 100,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
            <span style={{ fontSize: 14, color: "#fff" }}>{galleryIdx + 1} / {filteredGalleryImages.length}</span>
            <button onClick={() => setGalleryOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <XIcon size={22} color="#fff" />
            </button>
          </div>

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
