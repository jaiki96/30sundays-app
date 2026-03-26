import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Star, Play, Plane, Clock, FileCheck, MapPin, ChevronRight, X as XIcon } from "lucide-react";
import { C, destData, destinations, getItinerariesForDest, reviews, getCustomerPhotos } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import SectionHeader from "../components/SectionHeader";

export default function Destination() {
  const { name } = useParams();
  const d = destData[name];
  const [galleryIdx, setGalleryIdx] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
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

      {/* Traveller moments */}
      <TravellerMoments name={name} galleryIdx={galleryIdx} setGalleryIdx={setGalleryIdx} />

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
    </div>
  );
}

function TravellerMoments({ name, galleryIdx, setGalleryIdx }) {
  const photos = getCustomerPhotos(name);
  if (!photos.length) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>📸</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.head }}>Traveller moments</span>
        </div>
        <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Couples who explored {name} with us</p>
      </div>
      <div className="hs" style={{ gap: 10, paddingLeft: 16, paddingRight: 16 }}>
        {photos.map((photo, i) => (
          <div key={i} onClick={() => setGalleryIdx(i)} style={{ width: 140, minWidth: 140, height: 190, borderRadius: 14, overflow: "hidden", flexShrink: 0, position: "relative", cursor: "pointer" }}>
            <img src={photo.img} alt={photo.tag} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 60%, rgba(0,0,0,0.65))" }} />
            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin size={10} color={C.p300} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{photo.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Gallery — rendered inside #phone-frame via absolute positioning */}
      {galleryIdx !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          <div style={{ width: 390, height: 844, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column", borderRadius: 44, overflow: "hidden", pointerEvents: "auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 8px" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{galleryIdx + 1} / {photos.length}</span>
              <button onClick={() => setGalleryIdx(null)} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <XIcon size={18} color="#fff" />
              </button>
            </div>
            {/* Main image */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 12px", position: "relative", minHeight: 0 }}>
              <img src={photos[galleryIdx].img} alt={photos[galleryIdx].tag} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, objectFit: "contain" }} />
              {galleryIdx > 0 && (
                <button onClick={() => setGalleryIdx(i => i - 1)} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ArrowLeft size={18} color="#fff" />
                </button>
              )}
              {galleryIdx < photos.length - 1 && (
                <button onClick={() => setGalleryIdx(i => i + 1)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <ArrowRight size={18} color="#fff" />
                </button>
              )}
            </div>
            {/* Tag */}
            <div style={{ padding: "12px 16px 8px", textAlign: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{photos[galleryIdx].tag}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>· {name}</span>
            </div>
            {/* Thumbnails */}
            <div className="hs" style={{ gap: 6, padding: "0 16px 20px" }}>
              {photos.map((p, i) => (
                <div key={i} onClick={() => setGalleryIdx(i)} style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, cursor: "pointer", border: i === galleryIdx ? "2px solid #fff" : "2px solid transparent", opacity: i === galleryIdx ? 1 : 0.5 }}>
                  <img src={p.img} alt={p.tag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
