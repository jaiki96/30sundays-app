import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Navigation, X as XIcon, ChevronLeft, ChevronRight, Bed, Maximize2, Bath, Eye, UtensilsCrossed, FileText, Phone, Coffee, Flower2, Waves, Dices, Dumbbell, Plane, Wifi, Palmtree, Wine, BellRing, Shirt, CircleParking, Sparkles, Globe, Download, Clock, ExternalLink } from "lucide-react";
import { C } from "../data";
import { getTripById } from "../data/tripData";
import { generateHotelsForCity, getHotelReviews } from "../data/hotelData";

const amenityIcons = {
  Breakfast: Coffee, Spa: Flower2, "Swimming pool": Waves, "Indoor Games": Dices,
  Gym: Dumbbell, "Airport Transfer": Plane, "Free WiFi": Wifi, Beachfront: Palmtree,
  Restaurant: UtensilsCrossed, Bar: Wine, "Room Service": BellRing, Concierge: BellRing,
  Laundry: Shirt, Parking: CircleParking,
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

  // Use generated images for the gallery — trip photo paths can be broken,
  // and the rich record already has reliable hero/category imagery.
  const heroImg = standIn.images;

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
    // Generated stand-ins so action chips have real-feeling content
    website: tripHotel.website || `https://www.${tripHotel.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
    // Voucher readiness — alternates per hotel for prototype variety
    voucherReady: tripHotel.voucherReady ?? (hash % 3 !== 0),
  };
}

function ActionChip({ Icon, label, href, onClick }) {
  const Tag = href ? "a" : "button";
  const props = href ? { href, target: "_blank", rel: "noreferrer" } : { onClick };
  return (
    <Tag
      {...props}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 999,
        background: C.white, border: "1px solid #E0E2EB",
        color: "#181E4C", fontFamily: "inherit",
        fontSize: 12, fontWeight: 600, textDecoration: "none",
        cursor: "pointer", flexShrink: 0,
      }}
    >
      <Icon size={14} color="#FD014F" strokeWidth={2} />
      {label}
    </Tag>
  );
}

function AboutSection({ hotel }) {
  const [expanded, setExpanded] = useState(false);
  const text = `${hotel.name} is a ${hotel.stars}-star property set in ${hotel.city}, offering ${hotel.amenities.slice(0, 3).join(", ").toLowerCase()} and warm, attentive service. Rooms are designed for comfort with modern furnishings and thoughtful local touches throughout the property. Guests can unwind at on-site facilities, enjoy curated dining, and explore nearby attractions just minutes away. The location balances quick access to the city's highlights with a quiet, restful setting ideal for your stay.`;

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#181E4C", margin: "0 0 8px" }}>About this property</p>
      <div
        style={{
          fontSize: 13, color: "#4A5072", lineHeight: "20px",
          maxHeight: expanded ? 600 : 60,
          overflow: "hidden",
          transition: "max-height 0.32s cubic-bezier(0.4,0,0.2,1)",
          WebkitMaskImage: expanded ? "none" : "linear-gradient(180deg, #000 60%, transparent 100%)",
          maskImage: expanded ? "none" : "linear-gradient(180deg, #000 60%, transparent 100%)",
        }}
      >
        {text}
      </div>
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          marginTop: 6, padding: 0, background: "none", border: "none",
          color: "#FD014F", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

function MapPreview({ hotel, directionUrl, phoneHref }) {
  const mapImage = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80&auto=format&fit=crop";
  return (
    <div style={{
      margin: "16px 16px 0", borderRadius: 16,
      border: `1px solid ${C.div}`, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", background: C.white,
    }}>
      <a
        href={directionUrl}
        target="_blank"
        rel="noreferrer"
        style={{ display: "block", position: "relative", height: 140, textDecoration: "none" }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: `url(${mapImage}) center/cover no-repeat, #E8ECEF`,
        }} />
        {/* Centered pin */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -100%)",
          width: 32, height: 32, borderRadius: "50%", background: "#FD014F",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 10px rgba(253,1,79,0.45), 0 0 0 4px rgba(253,1,79,0.18)",
        }}>
          <MapPin size={16} color="#fff" fill="#fff" />
        </div>
      </a>
      <div style={{ padding: "12px 14px 4px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#181E4C", margin: 0 }}>{hotel.address}</p>
        <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>Check-In: {hotel.checkInTime} &bull; Check-Out: {hotel.checkOutTime}</p>
      </div>
      <div className="hs" style={{ gap: 8, padding: "10px 14px 14px" }}>
        <ActionChip Icon={Navigation} label="Directions" href={directionUrl} />
        <ActionChip Icon={Phone} label="Call hotel" href={phoneHref} />
        {hotel.website && <ActionChip Icon={Globe} label="Website" href={hotel.website} />}
      </div>
    </div>
  );
}

function VoucherCard({ hotel, room, trip }) {
  if (!hotel.voucherReady) return null;
  return (
    <div style={{ margin: "16px 16px 0" }}>
      <div style={{
        borderRadius: 14, border: `1px solid ${C.div}`, background: C.white,
        padding: 14, display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "#FFEBF1",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FileText size={18} color="#FD014F" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#181E4C", margin: 0 }}>
            Hotel voucher
          </p>
          <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>
            Carry this at check-in
          </p>
        </div>
        <button
          onClick={() => alert(`Hotel voucher\n\n${hotel.name}\n${room.name}\nCheck-in: ${trip.startDateDisplay}\nCheck-out: ${trip.endDateDisplay}\n\nDownloading PDF…`)}
          style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 999,
            background: "#FD014F", color: "#fff", border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Download size={14} color="#fff" strokeWidth={2.2} />
          Download
        </button>
      </div>
    </div>
  );
}

export default function BookedHotelPDP() {
  const { tripId, hotelIdx } = useParams();
  const navigate = useNavigate();

  const trip = getTripById(tripId);
  const tripHotel = trip?.hotels?.[Number(hotelIdx)];

  // Gallery has 2 stages: "grid" (Airbnb-style list of all photos) and
  // "fullscreen" (single image, swipe to change). Closed when null.
  const [galleryStage, setGalleryStage] = useState(null); // null | "grid" | "fullscreen"
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
            <div style={{ gridRow: "1 / 3", cursor: "pointer" }} onClick={() => { setGalleryIdx(0); setGalleryCategoryFilter("All"); setGalleryStage("grid"); }}>
              <img src={galleryImages[0]?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ cursor: "pointer" }} onClick={() => { setGalleryIdx(1); setGalleryCategoryFilter("All"); setGalleryStage("grid"); }}>
              <img src={galleryImages[1]?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => { setGalleryIdx(2); setGalleryCategoryFilter("All"); setGalleryStage("grid"); }}>
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

        {/* ═══ About this property ═══ */}
        <AboutSection hotel={hotel} />

        {/* ═══ Map preview + Reach-the-hotel chips ═══ */}
        <MapPreview hotel={hotel} directionUrl={directionUrl} phoneHref={`tel:${phoneDigits}`} />

        {/* ═══ Property Highlights ═══ */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", padding: "0 16px", margin: "0 0 12px" }}>Property Highlights</p>
          <div className="hs" style={{ gap: 16, paddingLeft: 16, paddingRight: 16 }}>
            {hotel.amenities.map((amenity, i) => {
              const Ico = amenityIcons[amenity] || Sparkles;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64, flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: "#F4F5F8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Ico size={20} color="#4A5072" strokeWidth={1.6} />
                  </div>
                  <span style={{ fontSize: 11, color: "#4A5072", textAlign: "center", lineHeight: 1.2 }}>{amenity}</span>
                </div>
              );
            })}
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

        {/* ═══ Voucher (booking artifact) ═══ */}
        <VoucherCard hotel={hotel} room={room} trip={trip} />

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

      {galleryStage && (
        <GalleryOverlay
          stage={galleryStage}
          setStage={setGalleryStage}
          images={hotel.images}
          filteredImages={filteredGalleryImages}
          categories={allCategories}
          categoryFilter={galleryCategoryFilter}
          setCategoryFilter={setGalleryCategoryFilter}
          galleryIdx={galleryIdx}
          setGalleryIdx={setGalleryIdx}
        />
      )}
    </div>
  );
}

// ─── Gallery overlay (portal-mounted into #phone-frame so it stays contained) ───
function GalleryOverlay({ stage, setStage, images, filteredImages, categories, categoryFilter, setCategoryFilter, galleryIdx, setGalleryIdx }) {
  const phoneFrame = typeof document !== "undefined" ? document.getElementById("phone-frame") : null;

  // Lock background scroll while overlay is open
  useEffect(() => {
    if (!phoneFrame) return;
    const prev = phoneFrame.style.overflow;
    phoneFrame.style.overflow = "hidden";
    return () => { phoneFrame.style.overflow = prev; };
  }, [phoneFrame]);

  // ESC closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (stage === "fullscreen") setStage("grid");
      else setStage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, setStage]);

  const content = stage === "grid" ? (
    <GridView
      images={images}
      categories={categories}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      onPick={(i) => { setGalleryIdx(i); setStage("fullscreen"); }}
      onClose={() => setStage(null)}
    />
  ) : (
    <FullscreenView
      images={filteredImages}
      idx={galleryIdx}
      setIdx={setGalleryIdx}
      onBack={() => setStage("grid")}
    />
  );

  const overlay = (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: stage === "fullscreen" ? "#000" : C.white,
      display: "flex", flexDirection: "column",
      animation: "fadeIn 0.18s ease-out",
    }}>
      {content}
    </div>
  );

  return phoneFrame ? createPortal(overlay, phoneFrame) : overlay;
}

function GridView({ images, categories, categoryFilter, setCategoryFilter, onPick, onClose }) {
  const filtered = categoryFilter === "All" ? images : images.filter(img => img.category === categoryFilter);
  return (
    <>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 12px 8px", borderBottom: `1px solid ${C.div}`, background: C.white,
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <XIcon size={20} color="#181E4C" />
        </button>
        <p style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "#181E4C", margin: 0 }}>All photos · {filtered.length}</p>
      </div>

      {/* Category chips */}
      <div className="hs" style={{ gap: 8, padding: "10px 12px", flexShrink: 0, borderBottom: `1px solid ${C.div}` }}>
        {categories.map(cat => {
          const active = cat === categoryFilter;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                flexShrink: 0, borderRadius: 999,
                padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                background: active ? "#181E4C" : C.white,
                border: `1px solid ${active ? "#181E4C" : "#E0E2EB"}`,
                color: active ? "#fff" : "#181E4C",
                fontSize: 12, fontWeight: 600,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Scrollable image list — Airbnb stacks them at full width */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((img, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => onPick(images.indexOf(img))}
              style={{
                padding: 0, border: "none", background: "none", cursor: "pointer",
                borderRadius: 12, overflow: "hidden", width: "100%",
              }}
            >
              <img src={img.url} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
            </button>
            <span style={{ fontSize: 12, color: C.sub, paddingLeft: 4 }}>{img.category}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function FullscreenView({ images, idx, setIdx, onBack }) {
  // Touch-swipe state
  const [touchStartX, setTouchStartX] = useState(null);
  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40 && idx > 0) setIdx(idx - 1);
    if (dx < -40 && idx < images.length - 1) setIdx(idx + 1);
    setTouchStartX(null);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <ChevronLeft size={22} color="#fff" />
        </button>
        <span style={{ fontSize: 14, color: "#fff" }}>{idx + 1} / {images.length}</span>
        <div style={{ width: 30 }} />
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0, padding: "0 8px" }}
      >
        <img
          src={images[idx]?.url}
          alt=""
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
        {idx > 0 && (
          <button
            onClick={() => setIdx(idx - 1)}
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <ChevronLeft size={20} color="#fff" />
          </button>
        )}
        {idx < images.length - 1 && (
          <button
            onClick={() => setIdx(idx + 1)}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <ChevronRight size={20} color="#fff" />
          </button>
        )}
      </div>

      <div style={{ padding: "10px 16px 4px", color: "#fff", fontSize: 12, opacity: 0.8, textAlign: "center", flexShrink: 0 }}>
        {images[idx]?.category}
      </div>

      <div className="hs" style={{ gap: 6, padding: "10px 16px 14px", flexShrink: 0 }}>
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: 56, height: 42, borderRadius: 6, overflow: "hidden", flexShrink: 0, cursor: "pointer",
              border: i === idx ? "2px solid #FD014F" : "2px solid transparent",
              opacity: i === idx ? 1 : 0.55,
            }}
          >
            <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
    </>
  );
}
