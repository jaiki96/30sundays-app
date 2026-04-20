import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, Shield, Headphones, MapPin, Star, ArrowRight, ChevronRight, X as XIcon, ChevronLeft, Camera } from "lucide-react";
import { C, destinations, reviews, usps, travellerMoments, destData, coupleStories, allItineraries, getItinerariesForDest } from "../data";

const HOME_DESTS = [
  { name: "Bali", flag: "🇮🇩", sub: "Temples, rice fields & sunset beaches" },
  { name: "Vietnam", flag: "🇻🇳", sub: "Bays, lanterns & bustling streets" },
  { name: "Thailand", flag: "🇹🇭", sub: "Islands, palaces & night markets" },
  { name: "Maldives", flag: "🇲🇻", sub: "Overwater villas & coral reefs" },
  { name: "New Zealand", flag: "🇳🇿", sub: "Fiords, peaks & epic road trips" },
];
import ItineraryCard from "../components/ItineraryCard";
import SectionHeader from "../components/SectionHeader";

const iconMap = { Heart, Eye, Shield, Headphones };

export default function Home({ userState }) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const navigate = useNavigate();

  const renderDestSections = (slice, chunkIdx) => slice.map((d, idx) => {
    const items = getItinerariesForDest(d.name);
    if (!items.length) return null;
    return (
      <div key={d.name} style={{ marginTop: chunkIdx === 0 && idx === 0 ? 22 : 26 }}>
        <SectionHeader emoji={d.flag} title={d.name} sub={d.sub} linkTo={`/listing?dest=${encodeURIComponent(d.name)}`} />
        <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>
          {items.map((it, i) => <ItineraryCard key={i} it={it} vibe={it.vibe} hideDest={it.dest !== "Maldives"} />)}
        </div>
      </div>
    );
  });

  return (
    <div style={{ background: `linear-gradient(180deg, ${C.p100}55 0%, ${C.white} 14%)`, paddingTop: 12 }}>
      {/* Header */}
      <div style={{ padding: "8px 16px 14px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.head }}>Explore</h1>
      </div>

      {/* Destination circles */}
      <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16, marginBottom: 4 }}>
        {destinations.map((d, i) => (
          <Link key={i} to={`/destination/${d.name}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0, textDecoration: "none" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", overflow: "hidden", border: `2.5px solid ${C.div}`, padding: 2 }}>
              <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.sub, whiteSpace: "nowrap" }}>{d.name}</span>
          </Link>
        ))}
      </div>

      {/* Destination carousels — interleaved with traveller moments + USPs to break monotony */}
      {renderDestSections(HOME_DESTS.slice(0, 2), 0)}

      {/* Traveller moments — auto-scrolling marquee */}
      <div style={{ marginTop: 26 }}>
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 16 }}>📸</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Traveller moments</span>
          </div>
          <p style={{ fontSize: 12, color: C.sub }}>Real photos from couples who travelled with us</p>
        </div>
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div className="marquee-strip" style={{ display: "flex", gap: 10, width: "max-content" }}>
            {[...travellerMoments, ...travellerMoments].map((p, i) => (
              <div key={i} style={{ width: 140, minWidth: 140, height: 195, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={p.img} alt={`Traveller in ${p.dest}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 55%, rgba(0,0,0,0.7))" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <MapPin size={10} color={C.p300} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{p.dest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderDestSections(HOME_DESTS.slice(2, 4), 1)}

      {/* USPs */}
      <div style={{ margin: "30px 0 0", padding: "24px 16px", background: `linear-gradient(135deg, ${C.p100}55 0%, #EDF3FF66 100%)` }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.head, marginBottom: 3 }}>Why 30 Sundays?</h2>
        <p style={{ fontSize: 12, color: C.sub, marginBottom: 16 }}>Designed for couples who deserve better</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {usps.map((u, i) => {
            const Icon = iconMap[u.icon];
            return (
              <div key={i} style={{ background: C.white, borderRadius: 12, padding: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${u.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <Icon size={16} color={u.color} />
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: C.head, marginBottom: 2 }}>{u.title}</h4>
                <p style={{ fontSize: 11, lineHeight: "15px", color: C.sub }}>{u.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {renderDestSections(HOME_DESTS.slice(4), 2)}

      {/* Real Couples, Real Itineraries */}
      <div style={{ marginTop: 26 }}>
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 16 }}>💑</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Real Couples, Real Itineraries</span>
          </div>
          <p style={{ fontSize: 12, color: C.sub }}>Tap to see their complete journey</p>
        </div>
        <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>
          {coupleStories.map((s, i) => (
            <div key={i} onClick={() => { setSelectedCouple(s); setGalleryIndex(0); }} style={{ width: 280, minWidth: 280, borderRadius: 16, overflow: "hidden", flexShrink: 0, background: C.white, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", cursor: "pointer" }}>
              <div style={{ height: 240, position: "relative", overflow: "hidden" }}>
                <img src={s.heroImg} alt={s.couple} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.75))" }} />
                <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.couple}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{s.dest}</p>
                </div>
              </div>
              <div style={{ padding: "10px 14px 12px", display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.04)" }}>
                <MapPin size={12} color={C.p600} />
                <span style={{ fontSize: 12, fontWeight: 500, color: C.sub }}>{s.route}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ margin: "26px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.white, borderRadius: 12, padding: "8px 12px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.head }}>4.6</span>
            <span style={{ fontSize: 12, color: C.sub }}>/5</span>
          </div>
          <p style={{ fontSize: 12, color: C.sub }}>Based on <strong style={{ color: C.head }}>1,000+</strong> Google reviews</p>
        </div>
        {reviews.slice(0, 3).map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
        {reviews.length > 3 && (
          <button onClick={() => setShowAllReviews(true)} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: `1px solid ${C.div}`, background: C.white, fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer", marginTop: 4 }}>
            Read all {reviews.length} reviews
          </button>
        )}
      </div>

      {/* All Reviews Fullscreen Overlay */}
      {showAllReviews && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.white, display: "flex", flexDirection: "column", maxWidth: 390, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.div}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.head }}>All Reviews</span>
              <span style={{ fontSize: 12, color: C.sub }}>({reviews.length})</span>
            </div>
            <button onClick={() => setShowAllReviews(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <XIcon size={16} color={C.head} />
            </button>
          </div>
          {/* Rating summary */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.div}` }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: C.head }}>4.6</span>
            <div>
              <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>{[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}</div>
              <p style={{ fontSize: 12, color: C.sub }}>Based on 1,000+ Google reviews</p>
            </div>
          </div>
          {/* Scrollable reviews */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }} className="hide-scrollbar">
            {reviews.map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </div>
        </div>
      )}

      {/* CTA banner */}
      <div style={{ margin: "20px 16px 20px" }}>
        <div style={{ background: C.p100, borderRadius: 16, padding: "22px 20px", textAlign: "center" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.p900, marginBottom: 5 }}>Ready to plan your getaway?</h3>
          <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Tell us where you'd love to go</p>
          <Link to="/plan" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "#fff", background: C.p600, border: "none", borderRadius: 8, padding: "11px 26px", textDecoration: "none", boxShadow: "0 4px 16px rgba(227,27,83,0.3)" }}>
            Plan My Trip <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Fullscreen Couple Gallery Overlay */}
      {selectedCouple && (
        <CoupleGallery
          couple={selectedCouple}
          galleryIndex={galleryIndex}
          setGalleryIndex={setGalleryIndex}
          onClose={() => setSelectedCouple(null)}
          onViewItinerary={() => { setSelectedCouple(null); navigate(`/itinerary/${selectedCouple.itineraryId}`); }}
        />
      )}
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", borderLeft: `3px solid ${C.p300}`, marginBottom: 10 }}>
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
      <p style={{ fontSize: 11, lineHeight: "16px", color: C.sub }}>"{r.text}"</p>
    </div>
  );
}

function CoupleGallery({ couple, galleryIndex, setGalleryIndex, onClose, onViewItinerary }) {
  const touchRef = useRef(null);
  const total = couple.gallery.length;
  const itinerary = allItineraries.find(it => it.id === couple.itineraryId);

  const handleTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && galleryIndex < total - 1) setGalleryIndex(galleryIndex + 1);
      else if (diff < 0 && galleryIndex > 0) setGalleryIndex(galleryIndex - 1);
    }
    touchRef.current = null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000", display: "flex", flexDirection: "column", maxWidth: 390, margin: "0 auto" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", position: "relative", zIndex: 2 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{couple.couple}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 }}>{couple.dest}</p>
        </div>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={18} color="#fff" />
        </button>
      </div>

      {/* Image counter */}
      <div style={{ textAlign: "center", padding: "0 0 8px", zIndex: 2 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{galleryIndex + 1} / {total}</span>
      </div>

      {/* Gallery image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img
          src={couple.gallery[galleryIndex]}
          alt={`${couple.couple} photo ${galleryIndex + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
        {/* Tap zones for desktop */}
        {galleryIndex > 0 && (
          <div onClick={() => setGalleryIndex(galleryIndex - 1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />
        )}
        {galleryIndex < total - 1 && (
          <div onClick={() => setGalleryIndex(galleryIndex + 1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />
        )}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "10px 0" }}>
        {couple.gallery.map((_, i) => (
          <div key={i} style={{ width: i === galleryIndex ? 18 : 6, height: 6, borderRadius: 3, background: i === galleryIndex ? C.p600 : "rgba(255,255,255,0.3)", transition: "all 0.2s" }} />
        ))}
      </div>

      {/* Bottom bar — itinerary CTA */}
      {itinerary && (
        <div style={{ padding: "12px 16px 24px", background: "linear-gradient(transparent, rgba(0,0,0,0.9) 30%)" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{couple.couple}'s Itinerary</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 }}>{itinerary.nights}N · {itinerary.route.map(r => r.city).join(" → ")}</p>
            </div>
            <button onClick={onViewItinerary} style={{ background: C.p600, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(227,27,83,0.4)" }}>
              View <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
