import { useState, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft, Heart, Share2, Star, ChevronDown, ChevronUp, ChevronRight,
  Camera, Play, Clock, Check, Info, MapPin, Phone, FileText,
  Waves, Anchor, Calendar, X as XIcon, Eye,
} from "lucide-react";
import { C, reviews as allReviews, getCustomerPhotos } from "../data";
import { getResortById, getRoomSplitLabel, CATEGORY_COLORS, CATEGORY_META, maldivesCustomerPhotos } from "../data/resortData";

const amenityIcons = {
  Pool: "🏊", "Private Pool": "🏊", Spa: "💆", "Spa by Clarins": "💆", "Anantara Spa": "💆", "SPA Cenvaree": "💆", "Iridium Spa": "💆",
  Gym: "🏋️", WiFi: "📶", Bar: "🍸", "Whale Bar": "🍸", "Sunset Bar": "🍸",
  "Beach Towel": "🏖️", "Mini Bar": "🍹", Laundry: "👕", Restaurant: "🍽️",
  "2 Restaurants": "🍽️", "3 Restaurants": "🍽️", "4 Restaurants": "🍽️",
  "Dive Centre": "🤿", "Snorkeling Gear": "🤿", Kayaks: "🛶",
  Observatory: "🔭", Cinema: "🎬", "Open-Air Cinema": "🎬",
  "Chocolate Room": "🍫", "Ice Cream Parlour": "🍦", Library: "📚",
  "Tennis Court": "🎾", "Kids Club": "👶", "Adults Only": "💑",
  "Butler Service": "🛎️", "Yoga Pavilion": "🧘", "Games Room": "🎮",
  "Water Sports Centre": "🏄", "Underwater Restaurant": "🐠",
  "House Reef Access": "🐡", "Non-motorized Water Sports": "🚣",
};

// Room amenities per room type (simulated)
const roomAmenities = {
  default: ["King Bed", "Private Bathroom", "Air Conditioning", "Mini Bar", "Tea/Coffee Maker", "In-room Safe", "Wardrobe"],
  water: ["Glass Floor Panel", "Overwater Deck", "Direct Ocean Access", "Outdoor Shower", "Sun Loungers"],
  beach: ["Garden View", "Beach Access", "Outdoor Seating", "Plunge Pool"],
  pool: ["Private Pool", "Pool Deck", "Sun Loungers", "Outdoor Dining"],
};

function getRoomExtras(roomType) {
  const lower = roomType.toLowerCase();
  const extras = [...roomAmenities.default];
  if (lower.includes("water") || lower.includes("overwater")) extras.push(...roomAmenities.water);
  if (lower.includes("beach") || lower.includes("earth") || lower.includes("garden")) extras.push(...roomAmenities.beach);
  if (lower.includes("pool")) extras.push(...roomAmenities.pool);
  return extras;
}

export default function ResortDetail() {
  const { resortId } = useParams();
  const [searchParams] = useSearchParams();
  const resort = getResortById(resortId);

  const initialNights = parseInt(searchParams.get("nights")) || resort?.night_configs[0]?.nights || 4;
  const [selectedNights, setSelectedNights] = useState(initialNights);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [inclusionTab, setInclusionTab] = useState("standard");
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [liked, setLiked] = useState(false);
  // Date picker state
  const [checkInDate, setCheckInDate] = useState("");
  const galleryRef = useRef(null);

  if (!resort) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Resort not found</div>;

  const nightConfig = resort.night_configs.find(c => c.nights === selectedNights) || resort.night_configs[0];
  const combos = nightConfig?.combos || [];
  const activeCombo = combos.find(c => c.combo_id === selectedComboId) || combos.find(c => c.is_default) || combos[0];
  const baseMeal = resort.meal_plans.find(m => m.is_base) || resort.meal_plans[0];
  const activeMeal = resort.meal_plans.find(m => m.plan_id === selectedMealId) || baseMeal;

  const basePrice = parseInt((activeCombo?.total_price || "0").replace(/,/g, ""));
  const mealDelta = (activeMeal?.price_delta || 0) * 2;
  const totalPrice = basePrice + mealDelta;
  const displayPrice = totalPrice.toLocaleString("en-IN");

  // Compute checkout date
  const checkOutLabel = checkInDate && selectedNights
    ? (() => {
        const d = new Date(checkInDate);
        d.setDate(d.getDate() + selectedNights);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      })()
    : null;
  const checkInLabel = checkInDate
    ? new Date(checkInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const destReviews = allReviews.filter(r => r.dest === "Maldives");
  const custPhotos = getCustomerPhotos("Maldives");
  const inclusionTypes = Object.keys(resort.inclusions || {});
  const visibleAmenities = showAllAmenities ? resort.amenities : resort.amenities.slice(0, 8);

  // Last fetched timestamp
  const lastFetched = "31 Mar, 11:42 PM";

  return (
    <div style={{ paddingBottom: 140 }}>
      {/* ─── A. Hero Gallery ─── */}
      <div style={{ position: "relative", height: 280 }}>
        <div
          ref={galleryRef}
          className="hs"
          style={{ height: "100%", gap: 0, scrollSnapType: "x mandatory" }}
          onScroll={() => {
            if (galleryRef.current) {
              const idx = Math.round(galleryRef.current.scrollLeft / galleryRef.current.offsetWidth);
              setGalleryIdx(idx);
            }
          }}
        >
          {resort.images.map((img, i) => (
            <div key={i} style={{ width: "100%", minWidth: "100%", height: "100%", flexShrink: 0, scrollSnapAlign: "start" }}>
              <img src={img} alt={`${resort.name} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
        <Link to="/destination/Maldives" style={{
          position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: 12,
          background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ArrowLeft size={18} color="#fff" />
        </Link>
        <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 8 }}>
          <button onClick={() => setLiked(!liked)} style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <Heart size={18} color="#fff" fill={liked ? C.p600 : "none"} />
          </button>
          <button style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <Share2 size={16} color="#fff" />
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 14, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
          <Camera size={12} color="#fff" />
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{galleryIdx + 1}/{resort.images.length}</span>
        </div>
      </div>

      {/* ─── B. Resort Header ─── */}
      <div style={{ padding: "16px 16px 0" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>{resort.name}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.sub }}>{resort.star_rating} hotel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <MapPin size={12} color={C.inact} />
          <span style={{ fontSize: 13, color: C.sub }}>{resort.atoll} · {resort.distance_from_airport} from Airport</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.bg, borderRadius: 8, padding: "6px 10px" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.head }}>{resort.google_rating}/5</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.sText }}>Exceptional</span>
          <span style={{ fontSize: 11, color: C.inact }}>· From {resort.google_rating_count.toLocaleString()} ratings on Google</span>
        </div>
      </div>

      {/* ─── C. Check-in / Check-out ─── */}
      <div style={{ margin: "16px 16px 0", padding: "12px 14px", borderRadius: 12, background: C.white, border: `1px solid ${C.div}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 11, color: C.inact, display: "block" }}>Check-in</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{resort.check_in_time}</span>
          </div>
          <div style={{ width: 1, height: 28, background: C.div }} />
          <div>
            <span style={{ fontSize: 11, color: C.inact, display: "block" }}>Check-out</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{resort.check_out_time}</span>
          </div>
          {resort.refundable && (
            <div style={{ background: C.sBg, borderRadius: 6, padding: "4px 8px" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.sText }}>Refundable</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── D. Select Dates & Room ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Select dates & room</h3>

        {/* Date + Nights picker */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {/* Check-in date */}
          <div style={{ flex: 1, position: "relative" }}>
            <label style={{ fontSize: 11, color: C.inact, display: "block", marginBottom: 4 }}>Check-in date</label>
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={checkInDate}
                onChange={e => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 10, fontSize: 13,
                  border: `1px solid ${C.div}`, background: C.white, color: C.head,
                  fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          {/* Nights */}
          <div style={{ minWidth: 100 }}>
            <label style={{ fontSize: 11, color: C.inact, display: "block", marginBottom: 4 }}>Nights</label>
            <div style={{ display: "flex", gap: 6 }}>
              {resort.night_configs.map(nc => (
                <button
                  key={nc.nights}
                  onClick={() => { setSelectedNights(nc.nights); setSelectedComboId(null); }}
                  style={{
                    padding: "7px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: selectedNights === nc.nights ? `1.5px solid ${C.p600}` : `1px solid ${C.div}`,
                    background: selectedNights === nc.nights ? C.p100 : C.white,
                    color: selectedNights === nc.nights ? C.p600 : C.sub,
                    cursor: "pointer",
                  }}
                >
                  {nc.nights}N
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Show computed dates */}
        {checkInDate && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "8px 12px", borderRadius: 8, background: C.sBg }}>
            <Calendar size={13} color={C.sText} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sText }}>
              {checkInLabel} — {checkOutLabel} · {selectedNights} nights
            </span>
          </div>
        )}

        {/* Room combination cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {combos.map(combo => {
            const isSelected = combo.combo_id === (activeCombo?.combo_id);
            const isExpanded = expandedRoom === combo.combo_id;
            return (
              <div key={combo.combo_id}>
                <div
                  onClick={() => setSelectedComboId(combo.combo_id)}
                  style={{
                    padding: "12px 14px", borderRadius: isExpanded ? "12px 12px 0 0" : 12, textAlign: "left",
                    border: isSelected ? `2px solid ${C.p600}` : `1px solid ${C.div}`,
                    borderBottom: isExpanded ? "none" : undefined,
                    background: isSelected ? "#FFF5F7" : C.white,
                    cursor: "pointer", width: "100%", boxSizing: "border-box",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: isSelected ? `5px solid ${C.p600}` : `2px solid ${C.inact}`, boxSizing: "border-box" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{getRoomSplitLabel(combo)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 26 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.head }}>₹{combo.total_price}</span>
                      <span style={{ fontSize: 11, color: C.inact }}> total</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.sub }}>₹{combo.per_night_price}/night</span>
                  </div>
                  {/* Room thumbnails + expand */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingLeft: 26 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {combo.rooms.map((room, i) => (
                        <img key={i} src={room.image} alt={room.room_type} style={{ width: 48, height: 36, borderRadius: 6, objectFit: "cover" }} />
                      ))}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedRoom(isExpanded ? null : combo.combo_id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <span style={{ fontSize: 11, color: C.p600, fontWeight: 600 }}>Details</span>
                      {isExpanded ? <ChevronUp size={12} color={C.p600} /> : <ChevronDown size={12} color={C.p600} />}
                    </button>
                  </div>
                </div>

                {/* Expanded room details */}
                {isExpanded && (
                  <div style={{
                    border: isSelected ? `2px solid ${C.p600}` : `1px solid ${C.div}`,
                    borderTop: "none", borderRadius: "0 0 12px 12px",
                    background: isSelected ? "#FFF5F7" : C.white,
                    padding: "0 14px 14px",
                  }}>
                    {combo.rooms.map((room, ri) => (
                      <div key={ri} style={{ marginTop: 12, paddingTop: ri > 0 ? 12 : 0, borderTop: ri > 0 ? `1px solid ${C.div}` : "none" }}>
                        {/* Room header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.head }}>{room.room_type}</span>
                          <span style={{ fontSize: 11, color: C.inact }}>· {room.nights}N</span>
                        </div>
                        {/* Room image larger */}
                        <div style={{ borderRadius: 10, overflow: "hidden", height: 140, marginBottom: 10 }}>
                          <img src={room.image} alt={room.room_type} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        {/* Room amenities */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {getRoomExtras(room.room_type).slice(0, 8).map((am, ai) => (
                            <span key={ai} style={{
                              fontSize: 10, color: C.sub, background: C.bg, borderRadius: 12,
                              padding: "3px 8px", fontWeight: 500,
                            }}>
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <Phone size={12} color={C.p600} />
          <span style={{ fontSize: 12, color: C.p600, fontWeight: 600, cursor: "pointer" }}>Want a different split? Talk to our consultant</span>
          <ChevronRight size={12} color={C.p600} />
        </div>
      </div>

      {/* ─── E. Meal Plans ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Meal plan</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {resort.meal_plans.map(plan => {
            const isSelected = plan.plan_id === activeMeal.plan_id;
            return (
              <button key={plan.plan_id} onClick={() => setSelectedMealId(plan.plan_id)} style={{
                padding: "12px 14px", borderRadius: 12, textAlign: "left",
                border: isSelected ? `2px solid ${C.p600}` : `1px solid ${C.div}`,
                background: isSelected ? "#FFF5F7" : C.white, cursor: "pointer", width: "100%",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 9, border: isSelected ? `5px solid ${C.p600}` : `2px solid ${C.inact}`, boxSizing: "border-box" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.head }}>{plan.name}</span>
                  </div>
                  {plan.price_delta > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.p600 }}>+₹{plan.price_delta.toLocaleString("en-IN")}/pp</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: C.sub, margin: "4px 0 0 26px" }}>{plan.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── F. Inclusions ─── */}
      {inclusionTypes.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>What's included</h3>
          <div className="hs" style={{ gap: 6, marginBottom: 14, paddingBottom: 2 }}>
            {inclusionTypes.map(type => (
              <button key={type} onClick={() => setInclusionTab(type)} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: inclusionTab === type ? `1.5px solid ${C.p600}` : `1px solid ${C.div}`,
                background: inclusionTab === type ? C.p100 : C.white,
                color: inclusionTab === type ? C.p600 : C.sub,
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, textTransform: "capitalize",
              }}>
                {type === "standard" ? "Standard" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(resort.inclusions[inclusionTab] || []).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Check size={14} color={C.sText} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.sub, lineHeight: "18px" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── G. Transfers ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Getting there</h3>
        <div style={{ padding: "14px", borderRadius: 12, background: C.white, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: C.b100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {resort.transfer_type === "seaplane" ? <span style={{ fontSize: 22 }}>🛩️</span> : <Anchor size={22} color={C.b600} />}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.head, display: "block" }}>
              {resort.transfer_type === "seaplane" ? "Seaplane" : resort.transfer_type === "speedboat" ? "Speedboat" : "Domestic Flight + Speedboat"}
            </span>
            <span style={{ fontSize: 12, color: C.sub }}>{resort.transfer_duration_minutes} minutes from Airport</span>
          </div>
          <div style={{ background: resort.transfer_included ? C.sBg : C.wBg, borderRadius: 6, padding: "4px 8px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: resort.transfer_included ? C.sText : C.wText }}>
              {resort.transfer_included ? "Included" : "Extra cost"}
            </span>
          </div>
        </div>
        {resort.transfer_type === "seaplane" && (
          <p style={{ fontSize: 11, color: C.inact, marginTop: 6, lineHeight: "16px" }}>
            Seaplanes operate during daylight hours only. If you arrive after dark, an overnight stay in Male may be needed.
          </p>
        )}
      </div>

      {/* ─── H. Amenities ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Amenities</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {visibleAmenities.map((am, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: C.bg, fontSize: 12, color: C.sub, fontWeight: 500 }}>
              <span style={{ fontSize: 14 }}>{amenityIcons[am] || "✨"}</span>{am}
            </div>
          ))}
        </div>
        {resort.amenities.length > 8 && (
          <button onClick={() => setShowAllAmenities(!showAllAmenities)} style={{ background: "none", border: "none", color: C.p600, fontSize: 12, fontWeight: 600, marginTop: 8, cursor: "pointer", padding: 0 }}>
            {showAllAmenities ? "Show less" : `View all ${resort.amenities.length} amenities`}
          </button>
        )}
      </div>

      {/* ─── I. Watersports & Excursions ─── */}
      {resort.watersports?.length > 0 && (
        <div style={{ padding: "20px 0 0" }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Things to do</h3>
          </div>
          <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
            {resort.watersports.map((ws, i) => (
              <div key={i} style={{ width: 140, minWidth: 140, flexShrink: 0 }}>
                <div style={{ borderRadius: 12, overflow: "hidden", height: 100, marginBottom: 6 }}>
                  <img src={ws.image} alt={ws.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{ws.name}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.inact, padding: "6px 16px 0", lineHeight: "16px" }}>
            Activities can be booked directly at the resort, subject to availability
          </p>
        </div>
      )}

      {/* ─── J. Property Highlights ─── */}
      {resort.property_highlights?.length > 0 && (
        <div style={{ padding: "20px 0 0" }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Property highlights</h3>
          </div>
          <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
            {resort.property_highlights.map((ph, i) => (
              <div key={i} style={{ width: 180, minWidth: 180, flexShrink: 0 }}>
                <div style={{ borderRadius: 12, overflow: "hidden", height: 120, marginBottom: 6, position: "relative" }}>
                  <img src={ph.image} alt={ph.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.5))" }} />
                  <span style={{ position: "absolute", bottom: 8, left: 10, fontSize: 12, fontWeight: 600, color: "#fff" }}>{ph.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── K. Destination Info ─── */}
      <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: C.sBg, display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={16} color={C.sText} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.sText }}>{resort.visa_info}</span>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: C.wBg, border: `1px solid #FDE68A` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Info size={13} color={C.wText} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.wText }}>Green Tax</span>
          </div>
          <p style={{ fontSize: 12, color: C.sub, margin: 0, lineHeight: "17px" }}>{resort.green_tax_note}</p>
        </div>
      </div>

      {/* ─── L. Flights ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ padding: "14px", borderRadius: 12, background: C.bg, border: `1px solid ${C.div}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.head, display: "block" }}>Flights not included</span>
            <span style={{ fontSize: 12, color: C.sub }}>Talk to our consultant about flights</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone size={16} color={C.p600} />
          </div>
        </div>
      </div>

      {/* ─── M. About the Resort ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>About {resort.name}</h3>
        <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "20px", fontStyle: "italic" }}>
          {showFullDesc ? resort.editorial_description : resort.editorial_description.slice(0, 150) + (resort.editorial_description.length > 150 ? "..." : "")}
        </p>
        {resort.editorial_description.length > 150 && (
          <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ background: "none", border: "none", color: C.p600, fontSize: 12, fontWeight: 600, marginTop: 4, cursor: "pointer", padding: 0 }}>
            {showFullDesc ? "Read less" : "Read more"}
          </button>
        )}
        {resort.about_hotel_text && (
          <>
            <p style={{ fontSize: 13, color: C.sub, margin: "10px 0 0", lineHeight: "20px" }}>
              {showFullAbout ? resort.about_hotel_text : resort.about_hotel_text.slice(0, 200) + (resort.about_hotel_text.length > 200 ? "..." : "")}
            </p>
            {resort.about_hotel_text.length > 200 && (
              <button onClick={() => setShowFullAbout(!showFullAbout)} style={{ background: "none", border: "none", color: C.p600, fontSize: 12, fontWeight: 600, marginTop: 4, cursor: "pointer", padding: 0 }}>
                {showFullAbout ? "Read less" : "Read more"}
              </button>
            )}
          </>
        )}
      </div>

      {/* ─── O. Resort Documents / PDFs ─── */}
      <div style={{ padding: "20px 16px 0" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>Resort documents</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { title: "Excursions & Water Sports", icon: "🏄" },
            { title: "Scuba Diving Menu", icon: "🤿" },
            { title: "Food & Beverage Menu", icon: "🍽️" },
            { title: "Resort Brochure", icon: "📄" },
          ].map((doc, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 10, background: C.bg, cursor: "pointer",
            }}>
              <span style={{ fontSize: 18 }}>{doc.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: C.head, flex: 1 }}>{doc.title}</span>
              <span style={{ fontSize: 11, color: C.p600, fontWeight: 600 }}>View</span>
              <ChevronRight size={14} color={C.p600} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── N. Customer Photos & Reviews ─── */}
      {custPhotos.length > 0 && (
        <div style={{ padding: "20px 0 0" }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Customer stories</h3>
          </div>
          <div className="hs" style={{ gap: 8, paddingLeft: 16, paddingRight: 16 }}>
            {custPhotos.slice(0, 8).map((p, i) => (
              <div key={i} style={{ width: 120, minWidth: 120, height: 160, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <img src={p} alt="Customer" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google rating card */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ padding: "14px", borderRadius: 12, background: C.white, border: `1px solid ${C.div}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.head }}>{resort.google_rating}</div>
            <div>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} color="#F59E0B" fill={s <= Math.round(resort.google_rating) ? "#F59E0B" : "none"} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: C.inact }}>{resort.google_rating_count.toLocaleString()} ratings on Google</span>
            </div>
          </div>
          {resort.rating_breakdown && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(resort.rating_breakdown).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: C.sub, width: 60, textTransform: "capitalize" }}>{key}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.bg }}>
                    <div style={{ width: `${(val / 5) * 100}%`, height: "100%", borderRadius: 3, background: C.p600 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.head, width: 24 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer testimonials */}
      {destReviews.length > 0 && (
        <div style={{ padding: "12px 16px 0" }}>
          {destReviews.map((rev, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < destReviews.length - 1 ? `1px solid ${C.div}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.head }}>{rev.name}</span>
                <div style={{ display: "flex", gap: 1 }}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} color="#F59E0B" fill="#F59E0B" />)}
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.sub, margin: 0, lineHeight: "18px" }}>{rev.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── P. FAQs ─── */}
      {resort.faqs?.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>FAQs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {resort.faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.div}` }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{
                  width: "100%", padding: "12px 0", background: "none", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.head, flex: 1, paddingRight: 10 }}>{faq.question}</span>
                  {expandedFaq === i ? <ChevronUp size={16} color={C.inact} /> : <ChevronDown size={16} color={C.inact} />}
                </button>
                {expandedFaq === i && (
                  <p style={{ fontSize: 12, color: C.sub, margin: "0 0 12px", lineHeight: "18px" }}>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Q. Cancellation Policy ─── */}
      {resort.cancellation_policy?.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "0 0 12px" }}>Cancellation policy</h3>
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.div}` }}>
            {resort.cancellation_policy.map((cp, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "10px 14px",
                background: i % 2 === 0 ? C.white : C.bg,
                borderBottom: i < resort.cancellation_policy.length - 1 ? `1px solid ${C.div}` : "none",
              }}>
                <span style={{ fontSize: 12, color: C.sub }}>{cp.window}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: cp.fee.includes("No") ? C.sText : C.dText }}>{cp.fee}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.inact, marginTop: 6 }}>Subject to Terms and conditions and payments received till date</p>
        </div>
      )}

      <div style={{ height: 20 }} />

      {/* ─── Sticky Bottom Bar — moved 60px lower ─── */}
      <div style={{
        position: "fixed", bottom: -4, left: 0, right: 0, maxWidth: 390, margin: "0 auto",
        background: C.white, borderTop: `1px solid ${C.div}`,
        padding: "10px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 20, boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.head }}>₹{displayPrice}</span>
            <span style={{ fontSize: 11, color: C.inact }}>/person</span>
          </div>
          <button style={{
            background: "none", border: "none", padding: 0, fontSize: 11, color: C.p600,
            fontWeight: 600, cursor: "pointer", textDecoration: "underline",
          }}>
            Get real-time pricing
          </button>
          <span style={{ fontSize: 9, color: C.inact, display: "block", marginTop: 1 }}>Last fetched: {lastFetched}</span>
        </div>
        <Link to="/plan" style={{
          background: C.p600, color: C.white, borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 700,
          textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 4px 12px rgba(227,27,83,0.3)",
        }}>
          Plan My Trip <ChevronRight size={16} color="#fff" />
        </Link>
      </div>
    </div>
  );
}
