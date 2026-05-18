import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { C, getItinerariesForDest, reviews } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import SectionHeader from "../components/SectionHeader";
import HeroVideo from "../components/home_v2/HeroVideo";
import CountryCircles from "../components/home_v2/CountryCircles";
import WhyUsHero from "../components/home_v2/WhyUsHero";
import EduSingleCard from "../components/home_v2/EduSingleCard";
import EduMultiCarousel from "../components/home_v2/EduMultiCarousel";
import PromiseCard from "../components/home_v2/PromiseCard";
import TravellerReel from "../components/home_v2/TravellerReel";
import {
  HOME_V2_COUNTRIES, mauritiusItineraries, seasonalLesson,
  compareVideos, travellerReels, tripPromises,
} from "../data/homeV2Data";

// Compact review card (mirrors live Home's ReviewCard).
function ReviewMini({ r }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", borderLeft: `3px solid ${C.p300}`, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.p600 }}>
            {r.name[0]}
          </div>
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

// ─── Helpers ───
const itemsFor = (name) =>
  name === "Mauritius" ? mauritiusItineraries : getItinerariesForDest(name);

const CountryStrip = ({ d }) => {
  const items = itemsFor(d.name);
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        emoji={d.flag}
        title={d.name}
        sub={d.sub}
        linkTo={`/destination/${encodeURIComponent(d.name)}`}
      />
      <div className="hs" style={{ gap: 14, paddingLeft: 16, paddingRight: 16 }}>
        {items.slice(0, 6).map((it, i) => (
          <ItineraryCard key={i} it={it} vibe={it.vibe} hideDest={it.dest !== "Maldives"} />
        ))}
      </div>
    </div>
  );
};

export default function HomeV2() {
  // Single-comparison Sunday School cards (Bali vs Thailand, Maldives vs Mauritius).
  const baliVsThailandLesson = {
    tag: "Compare",
    topic: "Bali vs Thailand",
    topicIcon: "compare",
    title: "Bali or [Thailand] for your honeymoon?",
    subtitle: "Same budget, very different week. Two minutes to decide.",
    outcome: "Vibe, food, budget",
    poster: compareVideos.baliVsThailand.poster,
    videoUrl: compareVideos.baliVsThailand.videoUrl,
    duration: compareVideos.baliVsThailand.duration,
  };
  const maldivesVsMauritiusLesson = {
    tag: "Compare",
    topic: "Maldives vs Mauritius",
    topicIcon: "compare",
    title: "Maldives or Mauritius for your island week?",
    subtitle: "Two island honeymoons, head-to-head.",
    outcome: "Villas, reefs, price",
    poster: compareVideos.maldivesVsMauritius.poster,
    videoUrl: compareVideos.maldivesVsMauritius.videoUrl,
    duration: compareVideos.maldivesVsMauritius.duration,
  };

  // Multi-carousel comparison lessons (Bali vs Vietnam, etc.) - tagged like a series.
  const seriesLessons = compareVideos.carouselA.map((c, i) => ({
    poster: c.poster,
    videoUrl: c.videoUrl,
    duration: c.duration,
    tag: `${c.a} vs ${c.b}`,
    hook: c.hook,
    watched: i === 0, // demo: first lesson marked watched
  }));

  return (
    <div style={{ background: C.white, paddingBottom: 40 }}>

      {/* ─── Country circles (top) ─── */}
      <CountryCircles />

      {/* ─── Hero ─── */}
      <HeroVideo />

      {/* ─── Why us ─── */}
      <WhyUsHero />

      {/* ─── Bali itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[0]} />

      {/* ─── Thailand itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[1]} />

      {/* ─── Bali or Thailand? (single Sunday School comparison) ─── */}
      <div style={{ marginTop: 28 }}>
        <EduSingleCard {...baliVsThailandLesson} />
      </div>

      {/* ─── Vietnam itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[2]} />

      {/* ─── Maldives itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[3]} />

      {/* ─── Sunday School series - comparison carousel ─── */}
      <EduMultiCarousel
        valueTitle="Pick the right [week], head-to-head"
        lessons={seriesLessons}
      />

      {/* ─── Mauritius itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[4]} />

      {/* ─── New Zealand itineraries ─── */}
      <CountryStrip d={HOME_V2_COUNTRIES[5]} />

      {/* ─── Traveller Moments ─── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
            From the road
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
            Traveller moments
          </h2>
          <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0" }}>Real couples. Real reels.</p>
        </div>
        <div className="hs" style={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}>
          {travellerReels.map((r, i) => <TravellerReel key={i} item={r} />)}
        </div>
      </div>

      {/* ─── We don't ghost after booking ─── */}
      <div style={{ marginTop: 30 }}>
        <PromiseCard
          kicker="On the trip"
          title="We're with you till the end of the trip."
          sub="Four ways we stay with you, mid-trip."
          items={tripPromises}
        />
      </div>

      {/* ─── Reviews - hero rating block ─── */}
      <div style={{ margin: "30px 16px 0" }}>
        {/* Section kicker */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.4px", color: C.p600, textTransform: "uppercase", marginBottom: 4 }}>
            What couples say
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.head, letterSpacing: "-0.3px", margin: 0 }}>
            Loved by 1,000+ couples
          </h2>
        </div>

        {/* Hero rating card */}
        <div style={{
          background: `linear-gradient(135deg, ${C.p100} 0%, #fff 100%)`,
          border: `1px solid ${C.p100}`,
          borderRadius: 18,
          padding: "20px 18px",
          marginBottom: 16,
          boxShadow: "0 4px 18px rgba(137,18,62,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Big number */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: C.head, lineHeight: 1, letterSpacing: "-1.5px" }}>
                4.6
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginTop: 2, letterSpacing: "0.2px" }}>
                out of 5
              </div>
            </div>

            {/* Right column: stars + trust */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill="#FBBC05" color="#FBBC05" strokeWidth={0} />
                ))}
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: "0 0 8px", lineHeight: 1.3 }}>
                Based on <strong>1,000+</strong> verified reviews
              </p>
              {/* Google trust chip */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: C.white, border: `1px solid ${C.div}`,
                borderRadius: 999, padding: "4px 10px",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.head, letterSpacing: "-0.1px" }}>
                  Verified on Google
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Review cards */}
        {reviews.slice(0, 3).map((r, i) => <ReviewMini key={i} r={r} />)}
      </div>

      {/* ─── End CTA banner ─── */}
      <div style={{ margin: "20px 16px 4px" }}>
        <div style={{ background: C.p100, borderRadius: 16, padding: "22px 20px", textAlign: "center" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.p900, margin: "0 0 5px" }}>
            Ready to plan your getaway?
          </h3>
          <p style={{ fontSize: 12, color: C.sub, margin: "0 0 14px" }}>
            Tell us where you'd love to go
          </p>
          <Link to="/plan" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontWeight: 600, color: "#fff",
            background: C.p600, border: "none", borderRadius: 8,
            padding: "11px 26px", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
          }}>
            Plan My Trip <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: C.inact }}>
        Home V2 preview · <Link to="/" style={{ color: C.p600, textDecoration: "none" }}>Back to live home</Link>
      </div>
    </div>
  );
}
