import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Star, Play, Plane, Clock, FileCheck, MapPin, ChevronRight, X as XIcon, Users } from "lucide-react";
import { C, destData, destinations, getItinerariesForDest, reviews, getCustomerPhotos, customerPhotos, coupleStories, couplesCount, couplePhotoNames, allItineraries } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import SectionHeader from "../components/SectionHeader";

export default function Destination() {
  const { name } = useParams();
  const d = destData[name];
  const [galleryIdx, setGalleryIdx] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showTravellersGallery, setShowTravellersGallery] = useState(false);
  const [travGalleryIdx, setTravGalleryIdx] = useState(0);
  const navigate = useNavigate();
  if (!d) return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Destination not found</div>;

  const itins = getItinerariesForDest(name);
  const relaxed = itins.filter(i => i.vibe === "Relaxed");
  const explorer = itins.filter(i => i.vibe === "Explorer");
  const offbeat = itins.filter(i => i.vibe === "Offbeat");
  const otherDests = destinations.filter(dd => dd.name !== name);
  const destReviews = reviews.filter(r => r.dest === name).length > 0 ? reviews.filter(r => r.dest === name) : reviews.slice(0, 2);
  const isBali = name === "Bali";

  const facts = [
    { icon: FileCheck, label: "Visa", value: d.visa, color: C.p600 },
    { icon: Plane, label: "Direct Flights", value: d.flights, color: "#1570EF" },
    { icon: Clock, label: "Ideal Duration", value: d.idealNights, color: "#6938EF" },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: 270 }}>
        <img src={d.hero} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.7))" }} />
        <Link to="/" style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: 12, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color="#fff" />
        </Link>
        <div style={{ position: "absolute", bottom: 18, left: 16, right: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>{d.flag}</span>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>{name}</h1>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>From <strong style={{ fontSize: 16 }}>₹{d.startPrice}</strong>/person</span>
        </div>
      </div>

      {/* Couples count bar */}
      {couplesCount[name] && customerPhotos[name] && (
        <div style={{ padding: "12px 16px 0" }}>
          <div onClick={() => { setShowTravellersGallery(true); setTravGalleryIdx(0); }} style={{ display: "flex", alignItems: "center", gap: 12, background: C.p100, borderRadius: 14, padding: "10px 16px", cursor: "pointer" }}>
            <div style={{ display: "flex", marginLeft: 0 }}>
              {customerPhotos[name].slice(0, 5).map((img, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, position: "relative", zIndex: 5 - i }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: 0 }}>{couplesCount[name]}+ couples explored {name}</p>
              <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>with 30 Sundays</p>
            </div>
          </div>
        </div>
      )}

      {/* Vibe carousels */}
      {relaxed.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <SectionHeader emoji="🧘" title="Relaxed" sub="Slow mornings & sunsets" linkTo={`/listing?vibe=Relaxed&dest=${name}`} linkLabel="View all" />
          <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>{relaxed.map((it, i) => <ItineraryCard key={i} it={it} vibe="Relaxed" />)}</div>
        </div>
      )}
      {explorer.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <SectionHeader emoji="🧭" title="Explorer" sub="See more, do more" linkTo={`/listing?vibe=Explorer&dest=${name}`} linkLabel="View all" />
          <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>{explorer.map((it, i) => <ItineraryCard key={i} it={it} vibe="Explorer" />)}</div>
        </div>
      )}
      {offbeat.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <SectionHeader emoji="🗺️" title="Offbeat" sub="Skip the crowds" linkTo={`/listing?vibe=Offbeat&dest=${name}`} linkLabel="View all" />
          <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>{offbeat.map((it, i) => <ItineraryCard key={i} it={it} vibe="Offbeat" />)}</div>
        </div>
      )}

      {/* Where to Stay (Bali only) */}
      {isBali && d.stayAreas && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Where to stay</span>
            <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Each area has a different vibe</p>
          </div>
          <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
            {d.stayAreas.map((area, i) => (
              <div key={i} style={{ width: 220, minWidth: 220, flexShrink: 0, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.div}`, background: C.white, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {/* Area image */}
                <div style={{ position: "relative", height: 120 }}>
                  <img src={area.img} alt={area.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.6))" }} />
                  <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18 }}>{area.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{area.name}</span>
                  </div>
                </div>
                {/* Details */}
                <div style={{ padding: "10px 12px 12px" }}>
                  <p style={{ fontSize: 11, color: C.sub, lineHeight: "16px", marginBottom: 8 }}>{area.desc}</p>
                  {area.pros.map((p, j) => <p key={j} style={{ fontSize: 11, color: "#027A48", marginBottom: 2 }}>✓ {p}</p>)}
                  {area.cons.map((c, j) => <p key={j} style={{ fontSize: 11, color: "#D85A30", marginBottom: 2 }}>✗ {c}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Activities */}
      {d.activities && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Top activities</span>
            <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Must-do experiences in {name}</p>
          </div>
          <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
            {d.activities.slice(0, 6).map((act, i) => (
              <div key={i} style={{ width: 138, minWidth: 138, height: 195, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={d.actImgs[i]} alt={act} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.75))" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={18} color="#fff" fill="#fff" />
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, lineHeight: "16px" }}>{act}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offbeat Activities (Bali only) */}
      {isBali && d.offbeat && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Offbeat activities</span>
            <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Hidden gems most tourists miss</p>
          </div>
          <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
            {d.offbeat.slice(0, 6).map((act, i) => (
              <div key={i} style={{ width: 138, minWidth: 138, height: 195, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img src={d.offbeatImgs[i]} alt={act} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(0,0,0,0.75))" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-55%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={18} color="#fff" fill="#fff" />
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, lineHeight: "16px" }}>{act}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Couples, Real Itineraries */}
      {coupleStories.filter(s => s.dest === name).length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: "0 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 16 }}>💑</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Real Couples, Real Itineraries</span>
            </div>
            <p style={{ fontSize: 12, color: C.sub }}>Tap to see their complete journey</p>
          </div>
          <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>
            {coupleStories.filter(s => s.dest === name).map((s, i) => (
              <div key={i} onClick={() => { setShowTravellersGallery(true); setTravGalleryIdx(0); }} style={{ width: 280, minWidth: 280, borderRadius: 16, overflow: "hidden", flexShrink: 0, background: C.white, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", cursor: "pointer" }}>
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
      )}

      {/* Key Facts */}
      <div style={{ margin: "28px 16px 0" }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Key facts</span>
        <p style={{ fontSize: 12, color: C.sub, marginTop: 2, marginBottom: 14 }}>Everything you need to know before you go</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {facts.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ display: "flex", gap: 12, padding: 14, background: C.white, borderRadius: 12, border: `1px solid ${C.div}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={f.color} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: "0 0 2px" }}>{f.label}</p>
                  <p style={{ fontSize: 12, lineHeight: "17px", color: C.sub, margin: 0 }}>{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traveller moments — marquee with couple names & activity tags */}
      <TravellerMomentsMarquee name={name} onPhotoClick={(idx) => { setTravGalleryIdx(idx); setShowTravellersGallery(true); }} />

      {/* Reviews */}
      {(() => { const visibleReviews = showAllReviews ? destReviews : destReviews.slice(0, 3); return (
      <div style={{ margin: "26px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.white, borderRadius: 12, padding: "8px 12px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.head }}>4.6</span>
            <span style={{ fontSize: 12, color: C.sub }}>/5</span>
          </div>
          <p style={{ fontSize: 12, color: C.sub }}>1,000+ Google reviews</p>
        </div>
        {visibleReviews.map((r, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 12, padding: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", borderLeft: `3px solid ${C.p300}`, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.p600 }}>{r.name[0]}</div>
                <div><p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: 0 }}>{r.name}</p><p style={{ fontSize: 10, color: C.sub, margin: 0 }}>{r.dest}</p></div>
              </div>
              <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}</div>
            </div>
            <p style={{ fontSize: 11, lineHeight: "16px", color: C.sub }}>"{r.text}"</p>
          </div>
        ))}
        {!showAllReviews && destReviews.length > 3 && (
          <button onClick={() => setShowAllReviews(true)} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: `1px solid ${C.div}`, background: C.white, fontSize: 13, fontWeight: 600, color: C.p600, cursor: "pointer", marginTop: 4 }}>
            Read all {destReviews.length} reviews
          </button>
        )}
        {showAllReviews && destReviews.length > 3 && (
          <button onClick={() => setShowAllReviews(false)} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: `1px solid ${C.div}`, background: C.white, fontSize: 13, fontWeight: 600, color: C.sub, cursor: "pointer", marginTop: 4 }}>
            Show less
          </button>
        )}
      </div>
      ); })()}

      {/* Other destinations */}
      <div style={{ marginTop: 24 }}>
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Other destinations</span>
        </div>
        <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
          {otherDests.map((dd, i) => (
            <Link key={i} to={`/destination/${dd.name}`} style={{ width: 155, minWidth: 155, flexShrink: 0, borderRadius: 12, overflow: "hidden", textDecoration: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ position: "relative", height: 120 }}>
                <img src={destData[dd.name].card} alt={dd.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(0,0,0,0.7))" }} />
                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{dd.flag} {dd.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "2px 0 0" }}>From ₹{dd.startPrice}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ margin: "20px 16px 0" }}>
        <Link to="/plan" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#fff", background: C.p600, border: "none", borderRadius: 12, padding: "14px 0", textDecoration: "none", boxShadow: "0 4px 16px rgba(227,27,83,0.3)" }}>
          Plan my {name} trip <ArrowRight size={16} />
        </Link>
      </div>

      {/* Fullscreen Travellers Photo Gallery */}
      {showTravellersGallery && customerPhotos[name] && (
        <TravellersFullscreenGallery
          name={name}
          photos={customerPhotos[name]}
          coupleNames={couplePhotoNames[name]}
          startIdx={travGalleryIdx}
          onClose={() => setShowTravellersGallery(false)}
          navigate={navigate}
        />
      )}
    </div>
  );
}

function TravellerMomentsMarquee({ name, onPhotoClick }) {
  const photos = getCustomerPhotos(name);
  const names = couplePhotoNames[name] || [];
  if (!photos.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>📸</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Traveller moments</span>
        </div>
        <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Couples who explored {name} with us</p>
      </div>
      <div style={{ overflow: "hidden", width: "100%" }}>
        <div className="marquee-strip" style={{ display: "flex", gap: 10, width: "max-content" }}>
          {[...photos, ...photos].map((photo, i) => {
            const realIdx = i % photos.length;
            const coupleName = names[realIdx] || "";
            return (
              <div key={i} onClick={() => onPhotoClick(realIdx)} style={{ width: 180, minWidth: 180, height: 240, borderRadius: 14, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer" }}>
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
          })}
        </div>
      </div>
    </div>
  );
}

function TravellersFullscreenGallery({ name, photos, coupleNames, startIdx, onClose, navigate }) {
  const [idx, setIdx] = useState(startIdx);
  const touchRef = useRef(null);
  const total = photos.length;
  const tags = getCustomerPhotos(name);
  const activityTag = tags[idx] ? tags[idx].tag : name;
  const coupleName = coupleNames ? (coupleNames[idx] || "") : "";

  // Find matching couple story for itinerary CTA
  const story = coupleStories.find(s => s.dest === name);
  const itinerary = story ? allItineraries.find(it => it.id === story.itineraryId) : null;

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
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", zIndex: 2 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{coupleName || name}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 }}>{name} · {activityTag}</p>
        </div>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={18} color="#fff" />
        </button>
      </div>

      {/* Counter */}
      <div style={{ textAlign: "center", padding: "0 0 8px", zIndex: 2 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{idx + 1} / {total}</span>
      </div>

      {/* Image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img src={photos[idx]} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
        {idx > 0 && <div onClick={() => setIdx(idx - 1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />}
        {idx < total - 1 && <div onClick={() => setIdx(idx + 1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", cursor: "pointer" }} />}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "10px 0", flexWrap: "wrap", maxWidth: "90%", margin: "0 auto" }}>
        {photos.slice(0, 15).map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, background: i === idx ? C.p600 : "rgba(255,255,255,0.3)", transition: "all 0.2s", cursor: "pointer" }} />
        ))}
      </div>

      {/* Bottom bar — itinerary CTA */}
      {story && itinerary && (
        <div style={{ padding: "8px 16px 24px", background: "linear-gradient(transparent, rgba(0,0,0,0.9) 30%)" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{story.couple}'s Itinerary</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: 0 }}>{itinerary.nights}N · {itinerary.route.map(r => r.city).join(" → ")}</p>
            </div>
            <button onClick={() => { onClose(); navigate(`/itinerary/${story.itineraryId}`); }} style={{ background: C.p600, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(227,27,83,0.4)" }}>
              View <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
