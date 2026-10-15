import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight, X as XIcon, Heart, IndianRupee, ShieldCheck } from "lucide-react";
import { C, destData, reviews, customerPhotos } from "../data";
import EduMultiCarousel from "../components/home_v2/EduMultiCarousel";
import TravellerReel from "../components/home_v2/TravellerReel";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import BookedTripsRail from "../components/BookedTripsRail";
import { SIX, COMPARE_REELS } from "../data/homeV3Data";
import { travellerReels } from "../data/homeV2Data";

const PAD = 18;
const HERO_IMGS = [destData.Maldives.hero, destData.Bali.hero, destData.Vietnam.hero];
const HERO_VIDEO = "https://thirtysundays-prod-content.fra1.digitaloceanspaces.com/welcome/Indonesia.mp4";

// Fullscreen video player. Tap the backdrop or the close button to dismiss.
function FullscreenVideo({ src, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <video src={src} autoPlay controls playsInline onClick={(e) => e.stopPropagation()} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }} />
      <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <XIcon size={20} color="#fff" />
      </button>
    </div>
  );
}

// Traveller moments reels (same as HomeV2's "From the road").
export function TravellerMomentsReels() {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ padding: `0 ${PAD}px`, marginBottom: 13 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>Traveller moments</h2>
      </div>
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
        {travellerReels.map((r, i) => <TravellerReel key={i} item={r} />)}
      </div>
    </div>
  );
}

// Compact review card (mirrors HomeV2's ReviewMini).
function ReviewMini({ r }) {
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
        <div style={{ display: "flex", gap: 1 }}>
          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}
        </div>
      </div>
      <p style={{ fontSize: 11, lineHeight: "16px", color: C.sub, margin: 0 }}>"{r.text}"</p>
    </div>
  );
}

// Real couples we've hosted, paired with their own trip photos.
const COUPLE_FACES = [
  { name: "Ayushi & Kaustubh", dest: "Bali", img: customerPhotos.Bali[0] },
  { name: "Dinesh & Harshitha", dest: "Maldives", img: customerPhotos.Maldives[0] },
  { name: "Raaghav & Ritika", dest: "Vietnam", img: customerPhotos.Vietnam[0] },
  { name: "Sharv & Pranjali", dest: "Thailand", img: customerPhotos.Thailand[0] },
  { name: "Utsav & Prachi", dest: "Bali", img: customerPhotos.Bali[10] },
  { name: "Anupriya & Sumit", dest: "Thailand", img: customerPhotos.Thailand[7] },
];

// Horizontal strip of real couples with their name + destination on the photo.
function CoupleFaces() {
  return (
    <div className="hs" style={{ gap: 10, margin: "0 -16px 16px", paddingLeft: 16, paddingRight: 16 }}>
      {COUPLE_FACES.map((c, i) => (
        <div key={i} style={{ flexShrink: 0, width: 124, position: "relative", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: C.div }}>
          <img src={c.img} alt={c.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 45%, rgba(0,0,0,0.78))" }} />
          <div style={{ position: "absolute", left: 9, right: 9, bottom: 9 }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 800, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{c.name}</p>
            <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.9)", fontSize: 10.5, fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{c.dest}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reviews block (same as HomeV2's "What couples say").
export function LovedByCouples() {
  return (
    <div style={{ margin: "28px 16px 0" }}>
      <div style={{ marginBottom: 13 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>Loved by 1,000+ couples</h2>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${C.p100} 0%, #fff 100%)`, border: `1px solid ${C.p100}`, borderRadius: 18, padding: "20px 18px", marginBottom: 16, boxShadow: "0 4px 18px rgba(137,18,62,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.head, lineHeight: 1, letterSpacing: "-1.5px" }}>4.6</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginTop: 2, letterSpacing: "0.2px" }}>out of 5</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />)}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: "0 0 8px", lineHeight: 1.3 }}>Based on <strong>1,000+</strong> verified reviews</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.white, border: `1px solid ${C.div}`, borderRadius: 999, padding: "4px 10px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.head, letterSpacing: "-0.1px" }}>Verified on Google</span>
            </div>
          </div>
        </div>
      </div>
      <CoupleFaces />
      {reviews.slice(0, 3).map((r, i) => <ReviewMini key={i} r={r} />)}
    </div>
  );
}

// ─── The opening ───
//
// One picture, the name of the company on it, one promise, and the button. The
// home used to spend its first two screens on shortcuts and a promo carousel
// before it said what we do, so the photo now carries that weight on its own
// and the proof line sits under the button where it backs the decision up.
function Hero({ imgs, idx, onPlay }) {
  return (
    <div style={{ background: C.white }}>
      <div style={{ position: "relative", height: 432, overflow: "hidden" }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === idx ? 1 : 0, transition: "opacity 1.4s ease, transform 6s ease",
            transform: i === idx ? "scale(1.08)" : "scale(1)",
          }} />
        ))}
        <div onClick={onPlay} style={{ position: "absolute", inset: 0, cursor: "pointer", background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.05) 34%, rgba(0,0,0,0.3) 72%, rgba(0,0,0,0.55) 100%)" }} />

        <img src="/logo.png" alt="30 Sundays" style={{ position: "absolute", top: 16, left: PAD, height: 30, width: "auto", filter: "brightness(0) invert(1)", pointerEvents: "none" }} />

        <h1 style={{
          position: "absolute", left: PAD, right: PAD, top: "52%", transform: "translateY(-50%)",
          margin: 0, textAlign: "center", fontSize: 26, fontWeight: 800, lineHeight: "34px",
          color: "#fff", letterSpacing: "-0.4px", textShadow: "0 2px 16px rgba(0,0,0,0.45)", pointerEvents: "none",
        }}>Complete Picture of your Holiday</h1>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 100%)", pointerEvents: "none" }} />
      </div>

      <div style={{ padding: `0 ${PAD}px`, marginTop: -26, position: "relative", textAlign: "center" }}>
        <Link to="/build" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
          background: C.p600, color: "#fff", borderRadius: 999, padding: "15px 44px",
          fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 10px 26px rgba(227,27,83,0.32)",
        }}>Plan my trip <ArrowRight size={17} /></Link>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 14 }}>
          <GoogleMark />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.head }}>4.6</span>
          <Star size={13} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />
          <span style={{ color: C.div }}>|</span>
          <span style={{ fontSize: 13.5, color: C.sub }}>25,000+ travellers</span>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Destinations ───
//
// Six countries, a photo and a name each, and no price. The price belongs on
// the destination screen where there is room to say what it buys. Here the
// only question being asked is where you fancy going.
function Destinations() {
  return (
    <div style={{ marginTop: 30, background: C.white }}>
      <h2 style={{ margin: `0 ${PAD}px 14px`, fontSize: 22, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>
        Destinations
      </h2>
      <div style={{ padding: `0 ${PAD}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {SIX.map((d) => (
          <Link key={d.name} to={`/destination/${encodeURIComponent(d.name)}`} style={{
            textDecoration: "none", background: C.white, borderRadius: 16, padding: 8,
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
          }}>
            <img src={d.img} alt={d.name} style={{ width: "100%", height: 118, objectFit: "cover", borderRadius: 11, display: "block" }} />
            <p style={{ margin: "10px 0 6px", textAlign: "center", fontSize: 15, fontWeight: 700, color: C.head }}>{d.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Why we're the perfect match ───
//
// The three claims used to be a row of 11px captions under the hero, which is
// the size you set a disclaimer in. They are the reasons to use us at all, so
// they get a line of their own each and the question they answer above them.
const MATCH = [
  { I: Heart, t: "Made for Couples", s: "Vacations curated solely with couples in mind" },
  { I: IndianRupee, t: "Price Transparency", s: "Only travel company to provide a split of Flights, Hotels & Activities" },
  { I: ShieldCheck, t: "No Tourist Traps", s: "Only 8+ rated hotels; hand-picked authentic activities" },
];

function PerfectMatch() {
  return (
    <div style={{ marginTop: 32, padding: `0 ${PAD}px`, background: C.white }}>
      <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800, color: C.head, letterSpacing: "-0.5px" }}>
        Why we&apos;re the perfect match
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 13.5, lineHeight: "20px", color: C.sub }}>
        Overwhelmed by itineraries that leave you no time to relax together? Suspect your &apos;friendly&apos; travel agent isn&apos;t so friendly to your wallet? Then give us a try!
      </p>
      {MATCH.map(({ I, t, s }) => (
        <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          <span style={{
            width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: C.p100,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <I size={21} color={C.p600} strokeWidth={2.1} />
          </span>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>{t}</p>
            <p style={{ margin: "3px 0 0", fontSize: 13, lineHeight: "18px", color: C.sub }}>{s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeV5() {
  const [hero, setHero] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setHero(h => (h + 1) % HERO_IMGS.length), 4500);
    return () => clearInterval(t);
  }, []);

  // "Torn between two?" comparison reels, shown in the Sunday School style.
  const seriesLessons = COMPARE_REELS.map((c) => ({
    poster: c.poster, videoUrl: c.videoUrl, duration: c.duration,
    tag: `${c.a} vs ${c.b}`, topics: c.topics,
  }));

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <Hero imgs={HERO_IMGS} idx={hero} onPlay={() => setShowVideo(true)} />

      <Destinations />
      <PerfectMatch />

      {/* Torn between two? in the Sunday School multi-video style */}
      <EduMultiCarousel valueTitle="Torn between [two]?" lessons={seriesLessons} />

      {/* Sunday School settles which country; this is what they ask for next. */}
      <BookedTripsRail />

      {/* Traveller moments + reviews + closing lead-gen */}
      <TravellerMomentsReels />
      <LovedByCouples />
      <LeadCloseCTA tone="clean" pad={PAD} />

      <div style={{ height: 80 }} />

      {showVideo && <FullscreenVideo src={HERO_VIDEO} onClose={() => setShowVideo(false)} />}
    </div>
  );
}
