import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Heart, Sparkles, Volume2, VolumeX, Quote, MapPin, Camera, Award, Star, Film, Instagram, Zap } from "lucide-react";
import { C } from "../data";

// MediaLab - concept screen for surfacing customer photos / videos / reels.
// Couple-only positioning: every section frames media as "real couples, real moments".
// Live at: /media-lab

const CDN = "https://cdn.30sundays.club/app_content";

// ─── Couple-themed poster pool (reusing existing destination imagery) ───
const POSTERS = {
  hero:  `${CDN}/bali/kelingking_beach_65.jpg`,
  bali1: `${CDN}/bali/tree_house_nusa_penida_3.jpg`,
  bali2: `${CDN}/bali/bali_swing_experience_1.jpg`,
  bali3: `${CDN}/bali/banyumala_waterfall_56.jpg`,
  bali4: `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
  bali5: `${CDN}/bali/handara_gate_63.jpg`,
  bali6: `${CDN}/bali/kelingking_beach_65.jpg`,
  viet1: `${CDN}/vietnam/sapa_valley_501.jpg`,
  viet2: `${CDN}/vietnam/kayaking_halong_bay_500.jpg`,
  viet3: `${CDN}/vietnam/hoi_an_memories_show_502.jpg`,
  thai1: `${CDN}/thailand/pileh_lagoon_439.jpg`,
  thai2: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
  mald1: `${CDN}/hotels/maldives/hero-images/11_hero.webp`,
  mald2: `${CDN}/hotels/maldives/hero-images/47_hero.webp`,
};

// ─── Mood rails - couple-coded categories ───
const MOOD_RAILS = [
  {
    id: "sunsets",
    title: "Sunsets, together",
    subtitle: "184 couples shared this hour",
    reels: [
      { poster: POSTERS.bali6, dur: "0:18", couple: "Aanya & Rohan", dest: "Bali" },
      { poster: POSTERS.mald1, dur: "0:24", couple: "Priya & Vikram", dest: "Maldives" },
      { poster: POSTERS.thai1, dur: "0:15", couple: "Neha & Arjun",  dest: "Phi Phi" },
      { poster: POSTERS.viet2, dur: "0:31", couple: "Sara & Kabir",  dest: "Ha Long" },
    ],
  },
  {
    id: "firsts",
    title: "First dinners abroad",
    subtitle: "Date-night picks from real couples",
    reels: [
      { poster: POSTERS.bali1, dur: "0:22", couple: "Tara & Ishaan",  dest: "Ubud" },
      { poster: POSTERS.viet3, dur: "0:19", couple: "Riya & Devansh", dest: "Hoi An" },
      { poster: POSTERS.bali2, dur: "0:27", couple: "Anjali & Karan", dest: "Seminyak" },
      { poster: POSTERS.mald2, dur: "0:14", couple: "Megha & Aryan",  dest: "Maldives" },
    ],
  },
  {
    id: "honeymoon",
    title: "Honeymoon firsts",
    subtitle: "The moments they'll never forget",
    reels: [
      { poster: POSTERS.mald2, dur: "0:42", couple: "Ananya & Rishabh", dest: "Maldives" },
      { poster: POSTERS.bali3, dur: "0:28", couple: "Diya & Veer",      dest: "Bali" },
      { poster: POSTERS.thai2, dur: "0:35", couple: "Pooja & Aditya",   dest: "Krabi" },
      { poster: POSTERS.viet1, dur: "0:26", couple: "Kavya & Yash",     dest: "Sapa" },
    ],
  },
];

// ─── Day-card preview teaser ───
const DAY_PEEKS = [
  { day: 3, title: "Sunset cruise, just two of you", poster: POSTERS.bali6, plays: "2.4k", dur: "0:24" },
  { day: 5, title: "Private dinner on the sand",     poster: POSTERS.mald1, plays: "1.8k", dur: "0:31" },
  { day: 7, title: "Couple's spa ritual",            poster: POSTERS.bali3, plays: "1.2k", dur: "0:19" },
];

// ─── Photo mosaic - "Wall of us" ───
const MOSAIC = [
  POSTERS.bali1, POSTERS.viet2, POSTERS.mald1,
  POSTERS.bali4, POSTERS.thai1, POSTERS.bali6,
  POSTERS.viet3, POSTERS.mald2, POSTERS.bali2,
];

// ─── Video testimonials (the 50 edited reels) ───
const TESTIMONIALS = [
  { poster: POSTERS.bali5, couple: "Aanya & Rohan", dest: "10 days in Bali",     quote: "Felt like our trip was made just for us." },
  { poster: POSTERS.mald2, couple: "Priya & Vikram", dest: "Maldives honeymoon", quote: "Every detail thought of before we asked." },
  { poster: POSTERS.viet1, couple: "Sara & Kabir",   dest: "Vietnam, 12 days",   quote: "We didn't lift a finger. Magic." },
];

export default function MediaLab() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FAFAFA",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* ─── Glass back button ─── */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Back"
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top, 0px) + 14px)",
          left: 14,
          width: 36, height: 36, borderRadius: 12,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "0.5px solid rgba(255,255,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 30,
          boxShadow: "0 4px 12px rgba(15,18,30,0.08)",
        }}
      >
        <ArrowLeft size={17} color="#181D27" />
      </button>

      {/* ─── 1. HERO REEL ─── */}
      <HeroReel poster={POSTERS.hero} muted={muted} setMuted={setMuted} />

      {/* ─── 2. SOCIAL PROOF STAT STRIP ─── */}
      <StatStrip />

      <AwardBadgeSection />

      {/* ★ N1 */} <CinemaMarqueeSection />
      {/* ★ N2 */} <WrappedStatsSection />

      {MOOD_RAILS.slice(0, 1).map((rail) => (
        <MoodRail key={rail.id} rail={rail} />
      ))}

      {/* ★ N3 */} <PolaroidScatterSection />
      {/* ★ N4 */} <MagazineCoverSection />

      <LoveFromTheGramSection />

      {MOOD_RAILS.slice(1).map((rail) => (
        <MoodRail key={rail.id} rail={rail} />
      ))}

      {/* ★ N5 */} <BoardingPassSection />
      {/* ★ N6 */} <FilmStripSection />

      <DayPeekSection />

      {/* ★ N7 */} <LoveLetterSection />
      {/* ★ N8 */} <ConstellationMapSection />

      <LovedByStarsSection />
      <MosaicSection />

      {/* ★ N9  */} <HeartbeatECGSection />
      {/* ★ N10 */} <CassetteMixtapeSection />

      <CoupleOfMonthSection />

      {/* ★ N11 */} <PostcardStampSection />
      {/* ★ N12 */} <LiveCounterSection />

      <TestimonialSection />

      {/* ★ N13 */} <BehindCameraSection />
      {/* ★ N14 */} <ReelRouletteSection />

      <FilmCrewSection />

      {/* ★ N15 */} <AnniversaryTimelineSection />
      {/* ★ N16 */} <QuoteSpreadSection />

      <MapOfLoveSection />

      {/* ★ N17 */} <VinylRecordSection />
      {/* ★ N18 */} <ConfettiFrameSection />
      {/* ★ N19 */} <TripInfographicSection />
      {/* ★ N20 */} <CoupleCardDeckSection />

      <CTASection navigate={navigate} />

      <div style={{ height: 40 }} />

      {/* Shared CSS animations */}
      <style>{`
        @keyframes mlPulse {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%      { transform: scale(1.15); opacity: 1;   }
        }
        @keyframes mlShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes mlFadeUp {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0);   }
        }
        .ml-reel-card {
          transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
        }
        .ml-reel-card:active { transform: scale(0.96); }
        .ml-rail-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// HERO REEL - full-bleed autoplay simulation
// ════════════════════════════════════════════════════════════════════
function HeroReel({ poster, muted, setMuted }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 460,
        overflow: "hidden",
      }}
    >
      {/* Background "video" */}
      <img
        src={poster}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          filter: "saturate(1.05) contrast(1.02)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* LIVE pulse */}
      <div
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top, 0px) + 18px)",
          right: 14,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 10px", borderRadius: 999,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: 10, fontWeight: 700, color: "#fff",
          letterSpacing: 0.5,
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: 999,
            background: "#FF3B30",
            animation: "mlPulse 1.4s ease-in-out infinite",
          }}
        />
        WATCHING NOW
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute",
          right: 14, bottom: 100,
          width: 38, height: 38, borderRadius: 999,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.5px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 2,
        }}
      >
        {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
      </button>

      {/* Bottom copy block */}
      <div
        style={{
          position: "absolute",
          left: 18, right: 18, bottom: 24,
          color: "#fff",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 9px", borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            fontSize: 10, fontWeight: 600, letterSpacing: 0.4,
            marginBottom: 10,
          }}
        >
          <Heart size={10} color="#FEA3B4" fill="#FEA3B4" />
          REAL COUPLES
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 26, fontWeight: 700,
            lineHeight: 1.15, letterSpacing: -0.4,
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >
          Real couples.<br />Real trips. Filmed.
        </h1>
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: 13, opacity: 0.9,
            fontWeight: 500,
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          Aanya & Rohan · Kelingking, Bali · day 4
        </p>
      </div>

      {/* Story progress bars at top */}
      <div
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top, 0px) + 60px)",
          left: 14, right: 14,
          display: "flex", gap: 4,
          zIndex: 2,
        }}
      >
        {[0.7, 0, 0, 0].map((fill, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: 2.5, borderRadius: 999,
              background: "rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fill * 100}%`, height: "100%",
                background: "#fff",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// STAT STRIP
// ════════════════════════════════════════════════════════════════════
function StatStrip() {
  const stats = [
    { num: "10,000+", label: "couples hosted" },
    { num: "1,200+",  label: "clips shared" },
    { num: "50",      label: "reels edited" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        padding: "16px 18px",
        borderBottom: "0.5px solid #E9EAEB",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            textAlign: "center",
            borderRight: i < stats.length - 1 ? "0.5px solid #E9EAEB" : "none",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
            {s.num}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.sub, marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MOOD RAIL - horizontal scroll of 9:16 reel cards
// ════════════════════════════════════════════════════════════════════
function MoodRail({ rail }) {
  return (
    <div style={{ padding: "20px 0 4px 0", background: "#FAFAFA" }}>
      <div style={{ padding: "0 18px", marginBottom: 12 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 17, fontWeight: 700, letterSpacing: -0.3,
            color: C.head,
          }}
        >
          {rail.title}
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          {rail.subtitle}
        </p>
      </div>

      <div
        className="ml-rail-scroll"
        style={{
          display: "flex", gap: 10,
          padding: "4px 18px 16px 18px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {rail.reels.map((reel, idx) => (
          <ReelCard key={idx} reel={reel} />
        ))}
      </div>
    </div>
  );
}

function ReelCard({ reel }) {
  return (
    <div
      className="ml-reel-card"
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: 130, height: 200,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        scrollSnapAlign: "start",
        boxShadow: "0 4px 14px rgba(15,18,30,0.10)",
      }}
    >
      <img
        src={reel.poster}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      {/* Play badge */}
      <div
        style={{
          position: "absolute", top: 8, right: 8,
          display: "inline-flex", alignItems: "center", gap: 3,
          padding: "3px 7px", borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          fontSize: 9, fontWeight: 700, color: "#fff",
        }}
      >
        <Play size={8} color="#fff" fill="#fff" />
        {reel.dur}
      </div>
      {/* Couple + dest */}
      <div
        style={{
          position: "absolute", left: 8, right: 8, bottom: 8,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
          {reel.couple}
        </div>
        <div style={{ fontSize: 9.5, fontWeight: 500, opacity: 0.85, marginTop: 1 }}>
          {reel.dest}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DAY-CARD PEEK - shows how itinerary day cards get video thumbs
// ════════════════════════════════════════════════════════════════════
function DayPeekSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 14 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 17, fontWeight: 700, letterSpacing: -0.3,
            color: C.head,
          }}
        >
          What it actually looks like
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          Real day-by-day footage from couples who've been
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DAY_PEEKS.map((peek) => (
          <div
            key={peek.day}
            style={{
              display: "flex", gap: 12,
              padding: 10,
              background: "#fff",
              borderRadius: 14,
              border: "0.5px solid #E9EAEB",
              boxShadow: "0 1px 3px rgba(15,18,30,0.03)",
              cursor: "pointer",
            }}
          >
            {/* Video thumb */}
            <div
              style={{
                position: "relative",
                flex: "0 0 auto",
                width: 86, height: 86,
                borderRadius: 10,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <img
                src={peek.poster}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 28, height: 28, borderRadius: 999,
                  background: "rgba(255,255,255,0.95)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <Play size={11} color={C.head} fill={C.head} />
              </div>
              <div
                style={{
                  position: "absolute", bottom: 4, right: 4,
                  padding: "1px 5px", borderRadius: 4,
                  background: "rgba(0,0,0,0.7)",
                  fontSize: 8.5, fontWeight: 700, color: "#fff",
                }}
              >
                {peek.dur}
              </div>
            </div>

            {/* Meta */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 7px", borderRadius: 6,
                  background: C.p100, color: C.p600,
                  fontSize: 9.5, fontWeight: 700,
                  alignSelf: "flex-start",
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                DAY {peek.day}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.head, lineHeight: 1.25 }}>
                {peek.title}
              </div>
              <div style={{ fontSize: 11, color: C.sub, fontWeight: 500, marginTop: 4 }}>
                {peek.plays} couples watched
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MOSAIC - Wall of us
// ════════════════════════════════════════════════════════════════════
function MosaicSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: C.head }}>
          Wall of us
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          10,000 photos from couples like you
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {MOSAIC.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              background: "#000",
              cursor: "pointer",
            }}
          >
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {i === 8 && (
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 16, fontWeight: 700,
                  letterSpacing: -0.2,
                }}
              >
                +9,991
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// VIDEO TESTIMONIALS - the 50 edited reels shine here
// ════════════════════════════════════════════════════════════════════
function TestimonialSection() {
  return (
    <div style={{ padding: "20px 0 4px 0", background: "#FAFAFA" }}>
      <div style={{ padding: "0 18px", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: C.head }}>
          Couples on 30 Sundays
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          The full story, in their words
        </p>
      </div>

      <div
        className="ml-rail-scroll"
        style={{
          display: "flex", gap: 12,
          padding: "4px 18px 16px 18px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="ml-reel-card"
            style={{
              position: "relative",
              flex: "0 0 auto",
              width: 240, height: 300,
              borderRadius: 16,
              overflow: "hidden",
              scrollSnapAlign: "start",
              boxShadow: "0 6px 20px rgba(15,18,30,0.12)",
              cursor: "pointer",
            }}
          >
            <img
              src={t.poster}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute", inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            {/* Big play button */}
            <div
              style={{
                position: "absolute",
                top: "44%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 54, height: 54, borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            >
              <Play size={20} color={C.head} fill={C.head} style={{ marginLeft: 2 }} />
            </div>

            {/* Quote */}
            <div
              style={{
                position: "absolute",
                left: 14, right: 14, bottom: 14,
                color: "#fff",
              }}
            >
              <Quote size={14} color="#FEA3B4" fill="#FEA3B4" style={{ marginBottom: 6 }} />
              <div
                style={{
                  fontSize: 13.5, fontWeight: 600, lineHeight: 1.3,
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                  marginBottom: 8,
                }}
              >
                "{t.quote}"
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.95 }}>
                {t.couple}
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.75, marginTop: 1 }}>
                {t.dest}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// AWARD BADGE → "AS FEATURED IN" - editorial press wall, type-led
// ════════════════════════════════════════════════════════════════════
const PRESS = [
  { name: "CONDÉ NAST", subtitle: "TRAVELLER",      font: "Georgia, serif", weight: 900, italic: false, tracking: 1 },
  { name: "VOGUE",       subtitle: "VOYAGE",         font: "'Didot', Georgia, serif", weight: 900, italic: false, tracking: 4 },
  { name: "GQ",          subtitle: "TRAVEL EDITION", font: "Georgia, serif", weight: 900, italic: false, tracking: 8 },
  { name: "Travel+Leisure", subtitle: "INDIA",       font: "Georgia, serif", weight: 700, italic: true,  tracking: 0 },
  { name: "FORBES",      subtitle: "LIFESTYLE",      font: "Georgia, serif", weight: 900, italic: false, tracking: 1 },
  { name: "harper's BAZAAR", subtitle: "ESCAPES",    font: "Georgia, serif", weight: 700, italic: true,  tracking: 0 },
];

function AwardBadgeSection() {
  return (
    <div
      style={{
        position: "relative",
        padding: "32px 0 26px 0",
        background: "#FBF7F0",
        overflow: "hidden",
      }}
    >
      {/* Subtle paper grain */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(120,80,40,0.04) 1px, transparent 1.5px)",
          backgroundSize: "10px 10px",
          pointerEvents: "none",
        }}
      />

      {/* Eyebrow with hairlines */}
      <div style={{ position: "relative", padding: "0 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 1, background: "#3D2817", opacity: 0.5 }} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 10, fontWeight: 700, color: "#3D2817", letterSpacing: 4, fontStyle: "italic" }}>
          as featured in
        </div>
        <div style={{ flex: 1, height: 1, background: "#3D2817", opacity: 0.5 }} />
      </div>

      {/* Editorial pull-quote */}
      <div style={{ position: "relative", padding: "0 22px 22px 22px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 19,
            fontStyle: "italic",
            fontWeight: 400,
            color: "#1A1208",
            lineHeight: 1.35,
            letterSpacing: -0.2,
          }}
        >
          "They booked one couple a week.<br />Now it's one couple a day."
        </div>
        <div style={{ marginTop: 12, fontFamily: "Georgia, serif", fontSize: 10, color: "#7A5A40", letterSpacing: 2.5, fontWeight: 600 }}>
          - CONDÉ NAST TRAVELLER · MAY 2026
        </div>
      </div>

      {/* Masthead strip - horizontal scroll of type-led press wordmarks */}
      <div
        className="ml-rail-scroll"
        style={{
          position: "relative",
          display: "flex",
          gap: 28,
          padding: "16px 22px",
          overflowX: "auto",
          scrollbarWidth: "none",
          borderTop: "1px solid rgba(61,40,23,0.18)",
          borderBottom: "1px solid rgba(61,40,23,0.18)",
          alignItems: "center",
        }}
      >
        {PRESS.map((p, i) => (
          <div key={i} style={{ flex: "0 0 auto", textAlign: "center", color: "#3D2817" }}>
            <div
              style={{
                fontFamily: p.font,
                fontWeight: p.weight,
                fontStyle: p.italic ? "italic" : "normal",
                fontSize: 18,
                letterSpacing: p.tracking,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {p.name}
            </div>
            <div style={{ marginTop: 4, fontFamily: "Georgia, serif", fontSize: 7, letterSpacing: 2.5, opacity: 0.65, fontWeight: 600 }}>
              {p.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Newspaper-style spec line - single row with hairline dividers */}
      <div
        style={{
          position: "relative",
          display: "flex",
          padding: "20px 22px 0 22px",
          gap: 0,
        }}
      >
        {[
          { num: "10K",  lab: "Couples hosted" },
          { num: "1.2K", lab: "Clips shared" },
          { num: "50",   lab: "Reels edited" },
          { num: "24/7", lab: "Concierge" },
        ].map((s, i, arr) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid rgba(61,40,23,0.2)" : "none",
              padding: "0 4px",
            }}
          >
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A1208", lineHeight: 1, letterSpacing: -0.5 }}>
              {s.num}
            </div>
            <div style={{ marginTop: 6, fontSize: 8.5, fontWeight: 600, color: "#7A5A40", letterSpacing: 1.5, textTransform: "uppercase" }}>
              {s.lab}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LOVE FROM THE GRAM → "DMs we wake up to" - couple messages, chat-style
// ════════════════════════════════════════════════════════════════════
const DMS = [
  {
    initials: "A·R", color: "#FEA3B4",
    names: "Aanya & Rohan", when: "today, 06:42",
    msg: "We've never travelled like this. Cried at the airport. Thank you, both of us. ♡",
  },
  {
    initials: "T·I", color: "#FFC83D",
    names: "Tara & Ishaan", when: "today, 09:15",
    msg: "Booked our anniversary already. Same villa, please. 🙏",
  },
  {
    initials: "S·K", color: "#86EFAC",
    names: "Sara & Kabir",  when: "yesterday",
    msg: "He proposed in Sapa. Your concierge knew before I did. Best secret ever.",
  },
  {
    initials: "M·V", color: "#C4B5FD",
    names: "Megha & Vir",   when: "yesterday",
    msg: "Send Devika our love - she found moments in our clips we'd already forgotten.",
  },
];

function LoveFromTheGramSection() {
  return (
    <div
      style={{
        position: "relative",
        background: "#F4EFE6",
        padding: "28px 18px 26px 18px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 11, fontStyle: "italic", color: "#7A5A40", letterSpacing: 1 }}>
            from our inbox -
          </div>
          <h2
            style={{
              margin: "4px 0 0 0",
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1208",
              letterSpacing: -0.4,
              lineHeight: 1.1,
            }}
          >
            DMs we wake up to
          </h2>
        </div>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 8px",
            background: "#fff",
            borderRadius: 4,
            border: "0.5px solid rgba(61,40,23,0.2)",
            fontSize: 9.5, fontWeight: 700, color: "#3D2817", letterSpacing: 0.4,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#15803D" }} />
          +47 THIS WEEK
        </div>
      </div>

      {/* Stacked DM cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DMS.map((d, i) => (
          <DMCard key={i} dm={d} />
        ))}
      </div>

      {/* Footer line */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: "0.5px dashed rgba(61,40,23,0.25)", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 11, color: "#7A5A40" }}>
        - over 10,000 couples have written to us -
      </div>
    </div>
  );
}

function DMCard({ dm }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: "#fff",
        borderRadius: 14,
        border: "0.5px solid rgba(61,40,23,0.12)",
        boxShadow: "0 2px 6px rgba(60,40,20,0.06)",
        position: "relative",
      }}
    >
      {/* Monogram circle */}
      <div
        style={{
          flex: "0 0 auto",
          width: 38, height: 38, borderRadius: 999,
          background: dm.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 700, color: "#1A1208",
          letterSpacing: 0.5,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {dm.initials}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1A1208", letterSpacing: -0.1 }}>
            {dm.names}
          </div>
          <div style={{ fontSize: 9.5, color: "#9C7B5A", fontWeight: 500, flex: "0 0 auto" }}>
            {dm.when}
          </div>
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: "Georgia, serif",
            fontSize: 13,
            fontStyle: "italic",
            color: "#3D2817",
            lineHeight: 1.4,
            letterSpacing: -0.1,
          }}
        >
          {dm.msg}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LOVED BY THE STARS - celeb couples on pink starry background
// ════════════════════════════════════════════════════════════════════
const STAR_COUPLES = [
  { name: "Aanya & Rohan",   poster: POSTERS.bali2 },
  { name: "Tara & Ishaan",   poster: POSTERS.mald2 },
  { name: "Megha & Vir",     poster: POSTERS.viet1 },
  { name: "Riya & Sameer",   poster: POSTERS.bali3 },
  { name: "Anjali & Karan",  poster: POSTERS.thai2 },
];

function LovedByStarsSection() {
  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #FFE4E8 0%, #FFD1DC 100%)",
        padding: "28px 0 24px 0",
        overflow: "hidden",
      }}
    >
      {/* Floating stars decoration */}
      <FloatingStar top={28} left={18} size={18} rotate={-12} />
      <FloatingStar top={42} left={"calc(100% - 36px)"} size={22} rotate={20} />
      <FloatingStar top={"calc(100% - 60px)"} left={"calc(100% - 50px)"} size={16} rotate={-6} />
      <FloatingStar top={"calc(100% - 90px)"} left={24} size={14} rotate={14} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 18px 14px 18px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 22, fontWeight: 800,
            color: C.head,
            letterSpacing: -0.4,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          Loved by the
          <span
            style={{
              padding: "3px 12px",
              borderRadius: 8,
              background: C.p600,
              color: "#fff",
              fontWeight: 800,
              letterSpacing: 0.2,
              boxShadow: "0 4px 12px rgba(227,27,83,0.3)",
            }}
          >
            Stars
          </span>
        </h2>
        <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#7A4A55", fontWeight: 500 }}>
          Celebrity couples who travelled with us
        </p>
      </div>

      <div
        className="ml-rail-scroll"
        style={{
          position: "relative",
          display: "flex", gap: 14,
          padding: "8px 18px 12px 18px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {STAR_COUPLES.map((c, i) => (
          <div
            key={i}
            className="ml-reel-card"
            style={{
              flex: "0 0 auto",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 90, height: 110,
                borderRadius: 22,
                overflow: "hidden",
                border: "3px solid #15803D",
                boxShadow: "0 6px 16px rgba(21,128,61,0.2)",
                background: "#fff",
              }}
            >
              <img
                src={c.poster}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Tiny play badge */}
              <div
                style={{
                  position: "absolute", bottom: 6, right: 6,
                  width: 20, height: 20, borderRadius: 999,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Play size={9} color="#fff" fill="#fff" />
              </div>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.head, marginTop: 8, textAlign: "center", maxWidth: 90, lineHeight: 1.2 }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingStar({ top, left, size, rotate }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      style={{
        position: "absolute",
        top, left,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.55,
        pointerEvents: "none",
      }}
    >
      <path
        fill="#F4A6B8"
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4L2 9.4h7.6z"
      />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════
// COUPLE OF THE MONTH - large spotlight card
// ════════════════════════════════════════════════════════════════════
function CoupleOfMonthSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: C.head }}>
            Couple of the month
          </h2>
          <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
            May 2026 · voted by our concierge team
          </p>
        </div>
        <div
          style={{
            padding: "4px 9px",
            borderRadius: 999,
            background: "#FFF4D6",
            color: "#B88500",
            fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
          }}
        >
          ★ FEATURED
        </div>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "#000",
          height: 260,
          boxShadow: "0 12px 32px rgba(15,18,30,0.12)",
        }}
      >
        <img
          src={POSTERS.mald2}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Crown badge */}
        <div
          style={{
            position: "absolute", top: 14, left: 14,
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 999,
            background: "rgba(184, 133, 0, 0.95)",
            color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
            boxShadow: "0 4px 12px rgba(184,133,0,0.4)",
          }}
        >
          👑 ROYAL HONEYMOON
        </div>

        {/* Play */}
        <div
          style={{
            position: "absolute",
            top: "42%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 60, height: 60, borderRadius: 999,
            background: "rgba(255,255,255,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <Play size={22} color={C.head} fill={C.head} style={{ marginLeft: 3 }} />
        </div>

        {/* Bottom content */}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, color: "#fff" }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2 }}>
            Ananya & Rishabh
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, marginTop: 4 }}>
            7 nights · Maldives · The Nautilus
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 10.5, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Play size={11} color="#fff" fill="#fff" /> 12 reels
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Camera size={11} color="#fff" /> 248 photos
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Heart size={11} color="#FEA3B4" fill="#FEA3B4" /> 4.2k
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// REEL PERK - "Send us your clips, we'll make your reel"
// ════════════════════════════════════════════════════════════════════
function FilmCrewSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          padding: "22px 20px",
          boxShadow: "0 10px 28px rgba(15,18,30,0.18)",
        }}
      >
        {/* Glow accents */}
        <div
          style={{
            position: "absolute", top: -40, right: -40,
            width: 140, height: 140, borderRadius: 999,
            background: "rgba(227,27,83,0.25)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -50, left: -30,
            width: 120, height: 120, borderRadius: 999,
            background: "rgba(105,56,239,0.22)",
            filter: "blur(30px)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 9px", borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 9.5, fontWeight: 800, color: "#FEA3B4", letterSpacing: 0.6,
              marginBottom: 12,
            }}
          >
            <Zap size={11} color="#FEA3B4" fill="#FEA3B4" />
            INCLUDED FREE
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 22, fontWeight: 700,
              color: "#fff", letterSpacing: -0.4, lineHeight: 1.2,
            }}
          >
            You shoot it on your phone.<br />We turn it into a reel.
          </h3>
          <p style={{ margin: "10px 0 16px 0", fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, lineHeight: 1.4 }}>
            Drop your trip clips in the app. Our editors stitch the best moments into a 60-second story - yours forever.
          </p>

          {/* Mini stat strip */}
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <MiniStat icon={Film}   value="50+"   label="in-house editors" />
            <MiniStat icon={Camera} value="1,200" label="reels delivered" />
            <MiniStat icon={Heart}  value="98%"   label="rated 5★" />
          </div>

          <button
            style={{
              padding: "10px 16px", borderRadius: 999,
              background: "#fff", color: C.head,
              border: "none",
              fontSize: 13, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            See how it works
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
      <Icon size={14} color="#FEA3B4" />
      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.2, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 500, color: "rgba(255,255,255,0.6)", lineHeight: 1 }}>
        {label}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAP OF LOVE - heart-pinned destinations
// ════════════════════════════════════════════════════════════════════
const LOVE_PINS = [
  { x: 18, y: 38, dest: "Maldives", count: "2,800",  color: "#0EA5E9" },
  { x: 38, y: 28, dest: "Bali",     count: "3,100",  color: C.p600 },
  { x: 58, y: 22, dest: "Vietnam",  count: "1,400",  color: "#15803D" },
  { x: 72, y: 44, dest: "Thailand", count: "1,900",  color: "#B88500" },
  { x: 32, y: 60, dest: "Sri Lanka",count: "  720",  color: "#6938EF" },
  { x: 84, y: 64, dest: "Philippines", count: " 590", color: "#DB2777" },
];

function MapOfLoveSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: -0.3, color: C.head }}>
          Where couples have shared from
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          10,510 reels across 14 destinations
        </p>
      </div>

      <div
        style={{
          position: "relative",
          aspectRatio: "5 / 3",
          borderRadius: 18,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 60%, #7DD3FC 100%)",
          border: "0.5px solid #E9EAEB",
          boxShadow: "0 6px 18px rgba(15,18,30,0.08)",
        }}
      >
        {/* Stylised landmass blobs */}
        <Landmass />

        {/* Heart pins */}
        {LOVE_PINS.map((p, i) => (
          <LovePin key={i} pin={p} delay={i * 0.15} />
        ))}

        {/* Legend chip */}
        <div
          style={{
            position: "absolute", top: 10, left: 10,
            padding: "5px 10px", borderRadius: 999,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontSize: 10, fontWeight: 700, color: C.head,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}
        >
          <Heart size={10} color={C.p600} fill={C.p600} />
          tap a pin
        </div>
      </div>
    </div>
  );
}

function Landmass() {
  return (
    <svg viewBox="0 0 500 300" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g fill="#86EFAC" opacity="0.85">
        <path d="M40 100 Q90 70 140 90 Q190 110 220 90 Q260 60 280 100 Q300 140 260 170 Q220 200 180 180 Q120 200 70 170 Q30 140 40 100 Z" />
        <path d="M280 50 Q330 30 380 55 Q430 80 410 130 Q380 180 330 160 Q280 140 280 90 Z" />
        <path d="M340 200 Q400 180 450 220 Q470 260 420 270 Q360 280 320 250 Q300 220 340 200 Z" />
        <path d="M140 220 Q190 210 200 250 Q190 280 140 270 Q100 260 140 220 Z" />
      </g>
      <g fill="#4ADE80" opacity="0.4">
        <circle cx="100" cy="130" r="3" />
        <circle cx="200" cy="160" r="3" />
        <circle cx="350" cy="100" r="3" />
        <circle cx="400" cy="240" r="3" />
      </g>
    </svg>
  );
}

function LovePin({ pin, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${pin.x}%`, top: `${pin.y}%`,
        transform: "translate(-50%, -100%)",
        animation: `mlFadeUp 0.5s ease-out ${delay}s both`,
      }}
    >
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translate(-50%, -10px)",
          width: 36, height: 36, borderRadius: 999,
          background: pin.color,
          opacity: 0.35,
          animation: `mlPulse 2s ease-in-out infinite ${delay}s`,
        }}
      />
      {/* Pin body */}
      <div
        style={{
          position: "relative",
          display: "inline-flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 8px 4px 6px",
            borderRadius: 999,
            background: "#fff",
            border: `1.5px solid ${pin.color}`,
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            fontSize: 9.5, fontWeight: 700, color: C.head,
            whiteSpace: "nowrap",
          }}
        >
          <Heart size={9} color={pin.color} fill={pin.color} />
          {pin.dest}
          <span style={{ color: pin.color, fontWeight: 800, marginLeft: 2 }}>
            {pin.count.trim()}
          </span>
        </div>
        {/* Tail */}
        <div
          style={{
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: `6px solid ${pin.color}`,
            marginTop: -1,
          }}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N1 - CINEMA MARQUEE - film poster treatment for featured reel
// ════════════════════════════════════════════════════════════════════
function CinemaMarqueeSection() {
  return (
    <div style={{ background: "#0A0A0A", padding: "32px 18px 28px 18px" }}>
      {/* Marquee header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px",
            border: "1px solid rgba(255,200,61,0.45)",
            borderRadius: 2,
            color: "#FFC83D",
            fontSize: 10, fontWeight: 700,
            letterSpacing: 3, fontFamily: "Georgia, serif",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#FFC83D", boxShadow: "0 0 8px #FFC83D" }} />
          Now playing
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#FFC83D", boxShadow: "0 0 8px #FFC83D" }} />
        </div>
      </div>

      {/* Poster */}
      <div
        style={{
          position: "relative",
          aspectRatio: "2 / 3",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow:
            "0 24px 60px rgba(255,200,61,0.18), 0 0 0 1px rgba(255,200,61,0.25)",
        }}
      >
        <img src={POSTERS.mald2} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.9) 100%)" }} />

        {/* Top stub */}
        <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", color: "#FFC83D", fontFamily: "Georgia, serif" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5 }}>30 SUNDAYS<br /><span style={{ opacity: 0.7, fontWeight: 400 }}>EDIT ROOM</span></div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textAlign: "right" }}>★★★★★<br /><span style={{ opacity: 0.7, fontWeight: 400 }}>R · 7 NIGHTS</span></div>
        </div>

        {/* Title */}
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 60, textAlign: "center", color: "#fff" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 5, opacity: 0.85, marginBottom: 6 }}>A LOVE STORY IN</div>
          <h1 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
            ANANYA <span style={{ color: "#FFC83D", fontStyle: "italic", fontWeight: 400 }}>×</span> RISHABH
          </h1>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 4, opacity: 0.85, marginTop: 10 }}>MALDIVES · MMXXVI</div>
        </div>

        {/* Bottom credit ticker */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 16px", background: "rgba(0,0,0,0.7)", borderTop: "1px solid rgba(255,200,61,0.3)", color: "#FFC83D", fontFamily: "Georgia, serif", fontSize: 8.5, fontWeight: 600, letterSpacing: 2, textAlign: "center", textTransform: "uppercase" }}>
          Shot by Them, on iPhone · Edited by 30 Sundays
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 14, color: "rgba(255,255,255,0.55)", fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2 }}>
        - IN COUPLES ONLY -
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N2 - WRAPPED-STYLE STATS - Spotify Wrapped-style hero numbers
// ════════════════════════════════════════════════════════════════════
const WRAPPED_CARDS = [
  { num: "32",    big: "sunsets",      sub: "watched together",  bg: "linear-gradient(135deg, #FF6B35 0%, #E31B53 100%)" },
  { num: "184",   big: "frames",       sub: "the average couple keeps", bg: "linear-gradient(135deg, #6938EF 0%, #1570EF 100%)" },
  { num: "7",     big: "candlelit",    sub: "dinners on the sand", bg: "linear-gradient(135deg, #15803D 0%, #0EA5E9 100%)" },
  { num: "1,420", big: "kilometres",   sub: "covered hand in hand", bg: "linear-gradient(135deg, #B88500 0%, #DB2777 100%)" },
];

function WrappedStatsSection() {
  return (
    <div style={{ padding: "28px 0 12px 0", background: "#0A0A0A" }}>
      <div style={{ padding: "0 18px 14px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D", letterSpacing: 3, marginBottom: 6 }}>A WEEK WITH US, IN NUMBERS</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.4 }}>
          What a 30 Sundays trip <span style={{ fontStyle: "italic", fontFamily: "Georgia, serif", fontWeight: 400 }}>actually adds up to</span>
        </h2>
      </div>
      <div className="ml-rail-scroll" style={{ display: "flex", gap: 12, padding: "4px 18px 16px 18px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        {WRAPPED_CARDS.map((c, i) => (
          <div
            key={i}
            className="ml-reel-card"
            style={{
              flex: "0 0 auto",
              width: 200, height: 280,
              padding: "20px 18px",
              borderRadius: 22,
              background: c.bg,
              color: "#fff",
              scrollSnapAlign: "start",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: 0.85 }}>#{(i+1).toString().padStart(2, "0")}</div>
            <div>
              <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.95, letterSpacing: -3, fontFamily: "Georgia, serif" }}>{c.num}</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.05, marginTop: 4, letterSpacing: -0.5 }}>{c.big}</div>
              <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.9, marginTop: 6, lineHeight: 1.3 }}>{c.sub}</div>
            </div>
            {/* Decorative blob */}
            <div style={{ position: "absolute", bottom: -40, right: -30, width: 120, height: 120, borderRadius: 999, background: "rgba(255,255,255,0.12)", filter: "blur(20px)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N3 - POLAROID SCATTER - tilted polaroids with handwritten captions
// ════════════════════════════════════════════════════════════════════
const POLAROIDS = [
  { src: POSTERS.bali2, caption: "first time here",   date: "12.03.26", rot: -7,  x: -8 },
  { src: POSTERS.viet2, caption: "she said yes again", date: "14.03.26", rot:  4,  x:  20 },
  { src: POSTERS.thai1, caption: "found our spot",     date: "16.03.26", rot: -3,  x: -15 },
  { src: POSTERS.mald2, caption: "best week of my life", date: "18.03.26", rot:  8,  x:  10 },
];

function PolaroidScatterSection() {
  return (
    <div style={{ background: "#F5EFE6", padding: "28px 18px 32px 18px", position: "relative", overflow: "hidden" }}>
      {/* Cork-board texture dots */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(120,80,40,0.06) 1px, transparent 1.5px)", backgroundSize: "12px 12px", pointerEvents: "none" }} />

      <div style={{ position: "relative", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#3D2817", letterSpacing: -0.3, fontFamily: "Georgia, serif" }}>
          From their scrapbook
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: "#7A5A40", fontWeight: 500 }}>
          Pinned moments from real trips
        </p>
      </div>

      <div className="ml-rail-scroll" style={{ display: "flex", gap: 4, padding: "20px 0 30px 0", overflowX: "auto", scrollbarWidth: "none", alignItems: "center" }}>
        {POLAROIDS.map((p, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 auto",
              width: 160,
              padding: "10px 10px 36px 10px",
              background: "#FFFEF7",
              boxShadow: "0 8px 18px rgba(60,40,20,0.15), 0 0 0 0.5px rgba(0,0,0,0.05)",
              transform: `rotate(${p.rot}deg) translateX(${p.x}px)`,
              marginLeft: i === 0 ? 0 : -20,
              position: "relative",
              cursor: "pointer",
            }}
          >
            {/* Tape strip */}
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(-3deg)", width: 50, height: 14, background: "rgba(245,210,120,0.7)", borderRadius: 1 }} />
            <div style={{ width: "100%", aspectRatio: "1 / 1", background: "#000", overflow: "hidden" }}>
              <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85) contrast(0.95) brightness(0.95)" }} />
            </div>
            <div style={{ marginTop: 8, fontFamily: "'Bradley Hand', 'Marker Felt', cursive", fontSize: 14, color: "#3D2817", textAlign: "center", lineHeight: 1.1 }}>
              {p.caption}
            </div>
            <div style={{ fontFamily: "'Bradley Hand', 'Marker Felt', cursive", fontSize: 10, color: "#9C7B5A", textAlign: "center", marginTop: 4 }}>
              {p.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N4 - MAGAZINE COVER - editorial Vogue-style
// ════════════════════════════════════════════════════════════════════
function MagazineCoverSection() {
  return (
    <div style={{ padding: "24px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: C.p600, letterSpacing: 2 }}>ON THE COVER</div>
        <h2 style={{ margin: "4px 0 0 0", fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          This month's issue
        </h2>
      </div>

      <div
        style={{
          position: "relative",
          aspectRatio: "5 / 7",
          borderRadius: 4,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 16px 40px rgba(15,18,30,0.2)",
        }}
      >
        <img src={POSTERS.bali5} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.1)" }} />

        {/* Masthead */}
        <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", color: "#fff", mixBlendMode: "difference" }}>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 56, letterSpacing: -3, lineHeight: 0.9 }}>30S</div>
          <div style={{ textAlign: "right", fontSize: 9, letterSpacing: 1.5, fontWeight: 600, fontFamily: "Georgia, serif", lineHeight: 1.5 }}>
            MAY 2026<br />
            ISSUE №47<br />
            ₹0 · FREE
          </div>
        </div>

        {/* Headline overlay (positioned to not obscure model face) */}
        <div style={{ position: "absolute", top: 110, left: 16, color: "#FFC83D", fontFamily: "Georgia, serif", lineHeight: 1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3 }}>COVER STORY</div>
          <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, letterSpacing: -1, fontStyle: "italic" }}>
            How they<br />fell in love<br />again.
          </div>
        </div>

        {/* Coverlines bottom-left */}
        <div style={{ position: "absolute", left: 16, bottom: 60, color: "#fff", fontFamily: "Georgia, serif", lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>The 7 best honeymoons</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>Maldives, decoded</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>Why couples are<br />ditching group tours</div>
        </div>

        {/* Barcode */}
        <div style={{ position: "absolute", right: 16, bottom: 16, padding: 6, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ display: "flex", gap: 1, height: 20 }}>
            {[2,1,3,1,2,4,1,2,3,1,2,1,3,2,1,4,1,2].map((w, i) => (
              <div key={i} style={{ width: w, height: "100%", background: "#000" }} />
            ))}
          </div>
          <div style={{ fontSize: 7, fontFamily: "monospace", color: "#000" }}>30S · 2026 · 047</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N5 - BOARDING PASS - utility ticket with QR
// ════════════════════════════════════════════════════════════════════
function BoardingPassSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          The keepsake every couple takes home
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          A real boarding pass, posted after their trip
        </p>
      </div>

      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(15,18,30,0.10)",
          border: "0.5px solid #E9EAEB",
        }}
      >
        {/* Main stub */}
        <div style={{ flex: 1, padding: "16px 16px 14px 16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Heart size={12} color={C.p600} fill={C.p600} />
              <div style={{ fontSize: 10, fontWeight: 800, color: C.p600, letterSpacing: 1.5 }}>30 SUNDAYS</div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.sub, letterSpacing: 1.2 }}>BOARDING PASS · COUPLE</div>
          </div>

          {/* Route */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.head, letterSpacing: -1, lineHeight: 1, fontFamily: "Georgia, serif" }}>BOM</div>
              <div style={{ fontSize: 9, color: C.sub, fontWeight: 600, marginTop: 3 }}>Mumbai · 21:40</div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, color: C.p600 }}>
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${C.p600}` }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill={C.p600}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${C.p600}` }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.head, letterSpacing: -1, lineHeight: 1, fontFamily: "Georgia, serif" }}>MLE</div>
              <div style={{ fontSize: 9, color: C.sub, fontWeight: 600, marginTop: 3 }}>Maldives · 23:55</div>
            </div>
          </div>

          {/* Passenger row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 8, color: C.sub, fontWeight: 700, letterSpacing: 1.2 }}>PASSENGERS</div>
              <div style={{ fontSize: 12, color: C.head, fontWeight: 700, marginTop: 2 }}>Ananya · Rishabh</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: C.sub, fontWeight: 700, letterSpacing: 1.2 }}>SEATS</div>
              <div style={{ fontSize: 12, color: C.head, fontWeight: 700, marginTop: 2 }}>2A · 2B</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: C.sub, fontWeight: 700, letterSpacing: 1.2 }}>NIGHTS</div>
              <div style={{ fontSize: 12, color: C.head, fontWeight: 700, marginTop: 2 }}>7</div>
            </div>
          </div>

          {/* Barcode bottom */}
          <div style={{ display: "flex", gap: 1, height: 26, marginTop: 12 }}>
            {[2,3,1,4,1,2,1,3,2,1,4,1,2,3,1,2,1,4,2,1,3,1,2,1,4,2,3].map((w, i) => (
              <div key={i} style={{ width: w, height: "100%", background: C.head }} />
            ))}
          </div>
        </div>

        {/* Perforation */}
        <div style={{ position: "relative", width: 0, borderLeft: "1.5px dashed #D5D7DA" }}>
          <div style={{ position: "absolute", top: -8, left: -8, width: 16, height: 16, borderRadius: 999, background: "#FAFAFA" }} />
          <div style={{ position: "absolute", bottom: -8, left: -8, width: 16, height: 16, borderRadius: 999, background: "#FAFAFA" }} />
        </div>

        {/* Right stub (QR) */}
        <div style={{ width: 88, padding: "16px 12px", background: C.p100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 8, color: C.p900, fontWeight: 800, letterSpacing: 1.2, textAlign: "center" }}>SCAN TO<br />WATCH TRIP</div>
          <FakeQR />
          <div style={{ fontSize: 9, fontWeight: 800, color: C.p600, letterSpacing: 0.5 }}>2A · 2B</div>
        </div>
      </div>
    </div>
  );
}

function FakeQR() {
  const cells = [];
  for (let i = 0; i < 64; i++) cells.push((i * 37 + 11) % 5 < 2);
  return (
    <div style={{ width: 56, height: 56, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", gap: 1, background: "#fff", padding: 3 }}>
      {cells.map((on, i) => (
        <div key={i} style={{ background: on ? "#181D27" : "#fff" }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N6 - FILM STRIP - horizontal sprocketed negative
// ════════════════════════════════════════════════════════════════════
const FILM_FRAMES = [POSTERS.bali1, POSTERS.viet2, POSTERS.thai1, POSTERS.mald1, POSTERS.bali3, POSTERS.viet3, POSTERS.bali6];

function FilmStripSection() {
  return (
    <div style={{ padding: "20px 0 24px 0", background: "#FAFAFA" }}>
      <div style={{ padding: "0 18px 12px 18px" }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Their camera roll, edited
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          Phone frames from a real couple's trip, picked by our editors
        </p>
      </div>

      <div className="ml-rail-scroll" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "inline-block", background: "#1A1A1A", padding: "10px 8px", minWidth: "100%" }}>
          {/* Top sprockets */}
          <div style={{ display: "flex", gap: 6, height: 12, marginBottom: 6, paddingLeft: 12 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: 14, height: "100%", background: "#FAFAFA", borderRadius: 2 }} />
            ))}
          </div>
          {/* Frames */}
          <div style={{ display: "flex", gap: 6, padding: "0 12px" }}>
            {FILM_FRAMES.map((src, i) => (
              <div key={i} style={{ flex: "0 0 auto", width: 110, height: 80, background: "#000", position: "relative", overflow: "hidden" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.7) contrast(1.05) sepia(0.1)" }} />
                <div style={{ position: "absolute", top: 4, left: 4, fontSize: 8, fontFamily: "monospace", color: "rgba(255,200,61,0.85)", fontWeight: 700 }}>
                  {String(i + 1).padStart(2, "0")}A
                </div>
              </div>
            ))}
          </div>
          {/* Bottom sprockets */}
          <div style={{ display: "flex", gap: 6, height: 12, marginTop: 6, paddingLeft: 12 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: 14, height: "100%", background: "#FAFAFA", borderRadius: 2 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N7 - LOVE LETTER - handwritten note on cream paper
// ════════════════════════════════════════════════════════════════════
function LoveLetterSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div
        style={{
          position: "relative",
          padding: "26px 24px 22px 24px",
          background:
            "linear-gradient(180deg, #FBF6EC 0%, #F5EEDD 100%)",
          borderRadius: 4,
          boxShadow: "0 12px 28px rgba(60,40,20,0.12), inset 0 0 0 0.5px rgba(120,80,40,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Paper lines */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(150,110,60,0.08) 23px, rgba(150,110,60,0.08) 24px)",
            pointerEvents: "none",
          }}
        />
        {/* Wax seal */}
        <div
          style={{
            position: "absolute", top: -12, right: 18,
            width: 44, height: 44, borderRadius: 999,
            background: "radial-gradient(circle at 35% 35%, #E31B53 0%, #89123E 70%, #5B0C2A 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FEA3B4", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 22, fontWeight: 700,
            boxShadow: "0 4px 10px rgba(89,18,62,0.4), inset 0 1px 3px rgba(255,255,255,0.3)",
            transform: "rotate(-8deg)",
          }}
        >
          30
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#9C7B5A", letterSpacing: 1.5, fontStyle: "italic" }}>
            A note from Aanya, day 6 -
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: "'Bradley Hand', 'Marker Felt', 'Brush Script MT', cursive",
              fontSize: 18,
              color: "#3D2817",
              lineHeight: 1.5,
              letterSpacing: 0.2,
            }}
          >
            We didn't think anyone could plan us this well. The little dinner under the stars, the boat man who knew our names - every detail. We came back different. Thank you, for both of us. ♡
          </div>
          <div style={{ marginTop: 18, fontFamily: "'Bradley Hand', cursive", fontSize: 22, color: C.p600, textAlign: "right", letterSpacing: 0.5 }}>
            - Aanya &amp; Rohan
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N8 - CONSTELLATION MAP - couples connected as stars
// ════════════════════════════════════════════════════════════════════
function ConstellationMapSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          The couples' constellation
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          10,000 love stories, mapped to the sky
        </p>
      </div>
      <div
        style={{
          position: "relative",
          aspectRatio: "4 / 3",
          borderRadius: 18,
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at 70% 30%, #1A1B3A 0%, #0A0B1F 60%, #050616 100%)",
          boxShadow: "0 12px 30px rgba(10,11,31,0.4)",
        }}
      >
        {/* Background star dust */}
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {Array.from({ length: 80 }).map((_, i) => {
            const x = (i * 73 + 19) % 400;
            const y = (i * 41 + 7)  % 300;
            const r = (i % 3 === 0) ? 0.8 : 0.4;
            return <circle key={i} cx={x} cy={y} r={r} fill="rgba(255,255,255,0.65)" />;
          })}
        </svg>

        {/* Constellation lines + named stars */}
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {/* lines */}
          <g stroke="rgba(254,163,180,0.4)" strokeWidth="0.6" fill="none">
            <line x1="80"  y1="80"  x2="160" y2="120" />
            <line x1="160" y1="120" x2="240" y2="90"  />
            <line x1="240" y1="90"  x2="310" y2="140" />
            <line x1="160" y1="120" x2="190" y2="200" />
            <line x1="190" y1="200" x2="280" y2="220" />
            <line x1="310" y1="140" x2="280" y2="220" />
          </g>
          {/* stars */}
          {[
            { x: 80, y: 80, label: "Aanya · Rohan" },
            { x: 160, y: 120, label: "Tara · Ishaan" },
            { x: 240, y: 90, label: "Megha · Vir" },
            { x: 310, y: 140, label: "Riya · Sameer" },
            { x: 190, y: 200, label: "Diya · Veer" },
            { x: 280, y: 220, label: "Sara · Kabir" },
          ].map((s, i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="6" fill="#FEA3B4" opacity="0.25" />
              <circle cx={s.x} cy={s.y} r="2.5" fill="#FFC83D" />
              <text x={s.x + 8} y={s.y + 3} fontSize="7" fill="rgba(255,255,255,0.85)" fontFamily="Georgia, serif" fontStyle="italic">
                {s.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Bottom caption */}
        <div style={{ position: "absolute", left: 12, bottom: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Georgia, serif", fontSize: 10, fontStyle: "italic" }}>
          - Sextans Amorum, observed May MMXXVI
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N9 - HEARTBEAT ECG - most-loved moments as pulse line
// ════════════════════════════════════════════════════════════════════
function HeartbeatECGSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          The pulse of a 7-day trip
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          When our couples' hearts raced the most
        </p>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 18,
          border: "0.5px solid #E9EAEB",
          boxShadow: "0 4px 14px rgba(15,18,30,0.06)",
        }}
      >
        <svg viewBox="0 0 360 140" style={{ width: "100%", height: 140 }}>
          {/* grid */}
          <defs>
            <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFE4E8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="360" height="140" fill="url(#ecgGrid)" />

          {/* pulse line */}
          <path
            d="M 0 80 L 30 80 L 38 78 L 45 82 L 60 80 L 72 80 L 80 30 L 92 130 L 100 80 L 140 80 L 148 78 L 160 80 L 180 80 L 188 78 L 200 82 L 220 80 L 232 40 L 240 110 L 248 80 L 290 80 L 300 30 L 312 130 L 320 80 L 360 80"
            fill="none"
            stroke={C.p600}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* spike labels */}
          <g fontFamily="Georgia, serif" fontSize="8" fill={C.head}>
            <circle cx="86" cy="35" r="4" fill={C.p600} />
            <text x="50" y="22" fontWeight="700">Day 2 · first sunset</text>
            <circle cx="236" cy="45" r="4" fill={C.p600} />
            <text x="200" y="32" fontWeight="700">Day 4 · proposal</text>
            <circle cx="306" cy="35" r="4" fill={C.p600} />
            <text x="270" y="22" fontWeight="700">Day 6 · stargazing</text>
          </g>
        </svg>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 12, borderTop: "0.5px solid #E9EAEB" }}>
          <PulseStat val="3.2k" lab="moments tagged 'loved'" />
          <PulseStat val="186"  lab="bpm peak (proposals)" />
          <PulseStat val="74%"  lab="cry-at-airport rate" />
        </div>
      </div>
    </div>
  );
}
function PulseStat({ val, lab }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.p600, fontFamily: "Georgia, serif", letterSpacing: -0.3 }}>{val}</div>
      <div style={{ fontSize: 9.5, color: C.sub, fontWeight: 500, marginTop: 2, maxWidth: 100 }}>{lab}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N10 - CASSETTE MIXTAPE - audio cassette with tracklist
// ════════════════════════════════════════════════════════════════════
function CassetteMixtapeSection() {
  const sideA = ["Sunset at Kelingking",  "Long lunch in Ubud",  "Boat to Nusa Penida"];
  const sideB = ["Stargazing, day 5",     "Spa for two",         "The proposal, day 6"];
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Their mixtape, side by side
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          The trip's greatest hits, on Side A &amp; B
        </p>
      </div>

      {/* Cassette */}
      <div
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #2A1B3F 0%, #1A0F2A 100%)",
          borderRadius: 12,
          padding: "16px 18px 20px 18px",
          boxShadow: "0 14px 32px rgba(26,15,42,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Label */}
        <div
          style={{
            background: "linear-gradient(180deg, #FBF6EC 0%, #F0E4CC 100%)",
            borderRadius: 4,
            padding: "10px 14px",
            marginBottom: 14,
            boxShadow: "inset 0 0 0 0.5px rgba(120,80,40,0.2)",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 6, right: 10, fontSize: 9, fontFamily: "monospace", color: "#9C7B5A", fontWeight: 700 }}>C90</div>
          <div style={{ fontFamily: "'Bradley Hand', cursive", fontSize: 18, color: "#3D2817", lineHeight: 1.1 }}>
            Aanya × Rohan
          </div>
          <div style={{ fontFamily: "'Bradley Hand', cursive", fontSize: 13, color: "#7A5A40", marginTop: 2 }}>
            Bali Tape · spring '26
          </div>
        </div>

        {/* Reels window */}
        <div
          style={{
            background: "#0A0612",
            borderRadius: 8,
            padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "relative",
          }}
        >
          <CassetteReel />
          {/* tape strip */}
          <div style={{ flex: 1, height: 22, margin: "0 12px", background: "linear-gradient(180deg, #4A3A2A 0%, #6B4F2A 50%, #4A3A2A 100%)", borderRadius: 1, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
          <CassetteReel />
        </div>

        {/* Holes */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 30px 0 30px" }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "rgba(0,0,0,0.6)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)" }} />)}
        </div>
      </div>

      {/* Tracklist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <Tracklist side="A" tracks={sideA} />
        <Tracklist side="B" tracks={sideB} />
      </div>
    </div>
  );
}
function CassetteReel() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 999, background: "radial-gradient(circle, #FBF6EC 0%, #F0E4CC 60%, #C8B998 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}>
      <div style={{ width: 14, height: 14, borderRadius: 999, background: "#0A0612", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, padding: 2 }}>
        {[0,1,2,3].map(i => <div key={i} style={{ background: "#FBF6EC", borderRadius: 0.5 }} />)}
      </div>
    </div>
  );
}
function Tracklist({ side, tracks }) {
  return (
    <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 10, border: "0.5px solid #E9EAEB" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 18, height: 18, borderRadius: 999, background: C.p600, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{side}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.head, letterSpacing: 0.4 }}>SIDE {side}</div>
      </div>
      {tracks.map((t, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < tracks.length - 1 ? "0.5px solid #F3F4F6" : "none" }}>
          <span style={{ fontSize: 11, color: C.head, fontWeight: 500 }}>{i + 1}. {t}</span>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N11 - POSTCARD WITH STAMP - vintage travel postcard
// ════════════════════════════════════════════════════════════════════
function PostcardStampSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Wish you were us
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          Postcards back home, from real couples
        </p>
      </div>

      <div
        style={{
          display: "flex",
          background: "#FBF6EC",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 12px 28px rgba(60,40,20,0.15)",
          border: "0.5px solid rgba(120,80,40,0.15)",
          transform: "rotate(-1.5deg)",
        }}
      >
        {/* Photo half */}
        <div style={{ flex: "0 0 45%", position: "relative", background: "#000" }}>
          <img src={POSTERS.bali4} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.8) sepia(0.15)" }} />
          <div style={{ position: "absolute", bottom: 6, left: 8, color: "#fff", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, fontWeight: 700, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
            Greetings from Bali
          </div>
        </div>

        {/* Written half */}
        <div style={{ flex: 1, padding: "10px 12px", position: "relative", borderLeft: "1px dashed rgba(120,80,40,0.3)" }}>
          {/* Stamp */}
          <div
            style={{
              position: "absolute",
              top: 8, right: 8,
              width: 44, height: 54,
              padding: 3,
              background: "#FBF6EC",
              border: "0.5px dashed rgba(120,80,40,0.4)",
              borderRadius: 1,
              transform: "rotate(4deg)",
            }}
          >
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.p600} 0%, ${C.p900} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFC83D", padding: 2 }}>
              <Heart size={12} color="#FFC83D" fill="#FFC83D" />
              <div style={{ fontSize: 6.5, fontWeight: 800, marginTop: 2, letterSpacing: 0.4, fontFamily: "Georgia, serif" }}>30 SUN</div>
              <div style={{ fontSize: 6, fontWeight: 700, marginTop: 1 }}>₹30</div>
            </div>
          </div>

          {/* Cancellation mark */}
          <svg width="50" height="20" viewBox="0 0 50 20" style={{ position: "absolute", top: 60, right: 6, opacity: 0.5 }}>
            <ellipse cx="25" cy="10" rx="22" ry="8" fill="none" stroke="#3D2817" strokeWidth="0.6" />
            <ellipse cx="25" cy="10" rx="18" ry="6" fill="none" stroke="#3D2817" strokeWidth="0.4" />
            <text x="25" y="13" fontSize="6" textAnchor="middle" fill="#3D2817" fontFamily="Georgia, serif" fontWeight="700">UBUD · 26</text>
          </svg>

          <div style={{ fontFamily: "'Bradley Hand', cursive", fontSize: 12, color: "#3D2817", lineHeight: 1.35, paddingRight: 56 }}>
            Mom - it rained on day 2 and we still danced. Tell Dad to book ours next.
          </div>
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: "0.5px solid rgba(120,80,40,0.2)", fontFamily: "monospace", fontSize: 9, color: "#7A5A40", lineHeight: 1.4 }}>
            MRS. SHAH<br />
            ANDHERI WEST<br />
            MUMBAI 400053
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N12 - LIVE COUNTER - animated counter with city ticker
// ════════════════════════════════════════════════════════════════════
function LiveCounterSection() {
  const [n, setN] = useState(127);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + (Math.random() > 0.5 ? 1 : -1)), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div
        style={{
          position: "relative",
          padding: "26px 22px 0 22px",
          background: "linear-gradient(160deg, #FFE4E8 0%, #FFFFFF 60%)",
          borderRadius: 20,
          overflow: "hidden",
          border: "0.5px solid #FEA3B4",
          boxShadow: "0 8px 24px rgba(227,27,83,0.10)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FF3B30", animation: "mlPulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#FF3B30", letterSpacing: 1.5 }}>LIVE · RIGHT NOW</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
          <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.85, letterSpacing: -4, fontFamily: "Georgia, serif", color: C.head }}>
            {n}
          </div>
          <div style={{ paddingBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.head, letterSpacing: -0.3, lineHeight: 1.1 }}>
              couples<br />on a 30S trip, right now
            </div>
          </div>
        </div>

        <p style={{ margin: "12px 0 14px 0", fontSize: 12, color: C.sub, fontWeight: 500, lineHeight: 1.4 }}>
          From Sapa to Seminyak, couples are sharing clips back to us. Tap to see the live map.
        </p>

        {/* City ticker */}
        <div style={{ margin: "0 -22px", padding: "10px 0", background: "#fff", borderTop: "0.5px solid #FEA3B4", overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", gap: 22, whiteSpace: "nowrap", animation: "mlMarquee 22s linear infinite", fontSize: 11, fontWeight: 600, color: C.sub }}>
            {["Maldives · 18 couples", "Bali · 41 couples", "Ha Long · 9 couples", "Phi Phi · 22 couples", "Sapa · 6 couples", "Ubud · 14 couples", "Maldives · 18 couples", "Bali · 41 couples"].map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: C.p600 }} />
                {s}
              </span>
            ))}
          </div>
          <style>{`@keyframes mlMarquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N13 - INSIDE THE EDIT ROOM - meet the team that turns clips → reels
// ════════════════════════════════════════════════════════════════════
const EDITORS = [
  { name: "Devika R.",   role: "Story editor",     reels: 84,  poster: POSTERS.bali1 },
  { name: "Arjun M.",    role: "Reel editor",      reels: 112, poster: POSTERS.viet1 },
  { name: "Riya S.",     role: "Music supervisor", reels: 47,  poster: POSTERS.thai2 },
  { name: "Karthik V.",  role: "Colour & finish",  reels: 156, poster: POSTERS.mald1 },
];

function BehindCameraSection() {
  return (
    <div style={{ padding: "20px 0 4px 0", background: "#0F0F12" }}>
      <div style={{ padding: "0 18px 12px 18px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D", letterSpacing: 2, marginBottom: 4 }}>INSIDE THE EDIT ROOM</div>
        <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
          You shoot it. We story it.
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
          Your phone clips, stitched into a 60-second reel by our in-house edit team
        </p>
      </div>
      <div className="ml-rail-scroll" style={{ display: "flex", gap: 12, padding: "8px 18px 18px 18px", overflowX: "auto", scrollbarWidth: "none" }}>
        {EDITORS.map((c, i) => (
          <div key={i} style={{ flex: "0 0 auto", width: 150, cursor: "pointer" }}>
            <div style={{ position: "relative", aspectRatio: "3 / 4", borderRadius: 14, overflow: "hidden", background: "#000" }}>
              <img src={c.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) contrast(1.1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)" }} />
              <div style={{ position: "absolute", top: 8, left: 8, padding: "3px 6px", background: "rgba(255,200,61,0.95)", borderRadius: 3, fontSize: 8, fontWeight: 800, color: "#0F0F12", letterSpacing: 0.4 }}>
                {c.role.toUpperCase()}
              </div>
              <Film size={14} color="#fff" style={{ position: "absolute", bottom: 10, right: 10 }} />
              <div style={{ position: "absolute", left: 10, bottom: 8, color: "#fff" }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif" }}>{c.name}</div>
                <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginTop: 1 }}>{c.reels} reels cut</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N14 - REEL ROULETTE - fanned card deck of couples
// ════════════════════════════════════════════════════════════════════
function ReelRouletteSection() {
  const cards = [
    { poster: POSTERS.bali6, label: "Day 4 · Sunset", couple: "T & I" },
    { poster: POSTERS.mald2, label: "Day 2 · Snorkel", couple: "A & R" },
    { poster: POSTERS.viet3, label: "Day 5 · Lanterns", couple: "S & K" },
  ];
  return (
    <div style={{ padding: "20px 18px 28px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Pick a couple's day, any day
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          Reel roulette · tap a card, watch their moment
        </p>
      </div>
      <div style={{ position: "relative", height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {cards.map((c, i) => {
          const offset = (i - 1) * 22;
          const rot    = (i - 1) * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 170, height: 240,
                borderRadius: 16,
                overflow: "hidden",
                background: "#000",
                transform: `translateX(${offset}px) rotate(${rot}deg)`,
                boxShadow: "0 12px 28px rgba(15,18,30,0.18)",
                border: "3px solid #fff",
                cursor: "pointer",
                zIndex: i === 1 ? 3 : 1,
              }}
            >
              <img src={c.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.85) 100%)" }} />
              <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 7px", background: "#fff", borderRadius: 6, fontSize: 9, fontWeight: 800, color: C.p600, letterSpacing: 0.5 }}>
                {c.couple}
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 42, height: 42, borderRadius: 999, background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={15} color={C.head} fill={C.head} style={{ marginLeft: 2 }} />
              </div>
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, color: "#fff", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, fontStyle: "italic" }}>
                {c.label}
              </div>
            </div>
          );
        })}
        {/* Hint */}
        <div style={{ position: "absolute", bottom: -8, fontSize: 10, color: C.sub, fontWeight: 600, letterSpacing: 0.5 }}>
          ← swipe to shuffle →
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N15 - ANNIVERSARY TIMELINE - couple trip year-by-year
// ════════════════════════════════════════════════════════════════════
const ANNIVERSARIES = [
  { year: "2021", dest: "Goa",      label: "First trip",      poster: POSTERS.thai1, color: "#FEA3B4" },
  { year: "2023", dest: "Bali",     label: "Honeymoon",       poster: POSTERS.bali3, color: C.p600 },
  { year: "2024", dest: "Sapa",     label: "First anniversary", poster: POSTERS.viet1, color: "#6938EF" },
  { year: "2026", dest: "Maldives", label: "Babymoon",        poster: POSTERS.mald2, color: "#15803D" },
];

function AnniversaryTimelineSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Anniversaries, archived
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          We keep every couple's trips on a private shelf
        </p>
      </div>

      <div style={{ position: "relative", paddingLeft: 22 }}>
        {/* spine */}
        <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 2, background: "linear-gradient(180deg, #FEA3B4 0%, #15803D 100%)", borderRadius: 999 }} />
        {ANNIVERSARIES.map((a, i) => (
          <div key={i} style={{ position: "relative", display: "flex", gap: 12, padding: "8px 0 18px 0" }}>
            <div style={{ position: "absolute", left: -22, top: 12, width: 16, height: 16, borderRadius: 999, background: "#fff", border: `2.5px solid ${a.color}`, boxShadow: `0 0 0 4px ${a.color}22` }} />
            <div style={{ width: 70, height: 70, borderRadius: 12, overflow: "hidden", background: "#000", flex: "0 0 auto", boxShadow: "0 4px 12px rgba(15,18,30,0.08)" }}>
              <img src={a.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, paddingTop: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: a.color, letterSpacing: -0.4, fontFamily: "Georgia, serif", lineHeight: 1 }}>{a.year}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.head, marginTop: 4 }}>{a.label}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.sub, marginTop: 2 }}>{a.dest}</div>
            </div>
          </div>
        ))}
        {/* tail node */}
        <div style={{ position: "relative", paddingLeft: 0 }}>
          <div style={{ position: "absolute", left: -22, top: 2, width: 16, height: 16, borderRadius: 999, background: C.p600, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={9} color="#fff" fill="#fff" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.p600, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            What's next?
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N16 - QUOTE MAGAZINE SPREAD - giant editorial pull-quote
// ════════════════════════════════════════════════════════════════════
function QuoteSpreadSection() {
  return (
    <div style={{ padding: "24px 18px", background: C.p100 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 4,
          padding: "32px 26px 24px 26px",
          boxShadow: "0 10px 28px rgba(89,18,62,0.10)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Huge open quote */}
        <div style={{ position: "absolute", top: -14, left: 14, fontFamily: "Georgia, serif", fontSize: 120, fontWeight: 900, color: C.p100, lineHeight: 1, letterSpacing: -6 }}>
          “
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.p600, letterSpacing: 2, marginBottom: 10 }}>
            INTERVIEW · ISSUE 47
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              fontWeight: 400,
              fontStyle: "italic",
              color: C.head,
              lineHeight: 1.25,
              letterSpacing: -0.4,
            }}
          >
            We never had a couple's <span style={{ background: `linear-gradient(180deg, transparent 60%, ${C.p100} 60%)` }}>holiday</span> until 30 Sundays. Now we don't take anything else.
          </div>
          {/* divider */}
          <div style={{ width: 36, height: 2, background: C.p600, margin: "22px 0 14px 0" }} />
          {/* Attribution */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, overflow: "hidden", background: "#000", flex: "0 0 auto" }}>
              <img src={POSTERS.bali2} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.head, letterSpacing: -0.2 }}>Tara &amp; Ishaan</div>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: C.sub, marginTop: 2 }}>3 trips · 28 days · Bali, Maldives, Sri Lanka</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N17 - VINYL RECORD - spinning record with tracklist
// ════════════════════════════════════════════════════════════════════
function VinylRecordSection() {
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Every trip gets a playlist
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          Our concierge curates one for every couple - to set the mood before they fly
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, background: "linear-gradient(135deg, #1A1A1A 0%, #2A1B2F 100%)", borderRadius: 18, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
        {/* Vinyl */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <div
            style={{
              width: 120, height: 120, borderRadius: 999,
              background: "radial-gradient(circle, #0A0A0A 0%, #1A1A1A 35%, #0A0A0A 36%, #1A1A1A 42%, #0A0A0A 43%, #1A1A1A 50%, #0A0A0A 51%, #1A1A1A 60%, #0A0A0A 61%, #2A2A2A 100%)",
              animation: "mlSpin 8s linear infinite",
              position: "relative",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* center label */}
            <div style={{ position: "absolute", inset: "35%", borderRadius: 999, background: `radial-gradient(circle, ${C.p600} 0%, ${C.p900} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)" }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: "#0A0A0A" }} />
            </div>
          </div>
          <style>{`@keyframes mlSpin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }`}</style>
        </div>

        {/* Tracklist */}
        <div style={{ flex: 1, minWidth: 0, color: "#fff" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#FFC83D", letterSpacing: 1.8, marginBottom: 4 }}>SIDE A · BALI '26</div>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: -0.3, marginBottom: 10 }}>Aanya × Rohan</div>
          {[
            { n: "01", t: "Sunset, Kelingking",   d: "3:24" },
            { n: "02", t: "Rain on the villa",    d: "2:47" },
            { n: "03", t: "Long lunch, Sayan",    d: "5:11" },
          ].map((s) => (
            <div key={s.n} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid rgba(255,255,255,0.08)", fontSize: 11 }}>
              <span style={{ opacity: 0.8 }}>{s.n}. {s.t}</span>
              <span style={{ opacity: 0.55, fontFamily: "monospace", fontSize: 10 }}>{s.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N18 - CONFETTI FRAME - celebration moment
// ════════════════════════════════════════════════════════════════════
function ConfettiFrameSection() {
  const confetti = Array.from({ length: 22 }).map((_, i) => ({
    left: (i * 53 + 7) % 100,
    delay: (i * 0.17) % 3,
    color: [C.p600, "#FFC83D", "#15803D", "#6938EF", "#FEA3B4"][i % 5],
    rot: (i * 47) % 360,
  }));
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          The moment they said yes
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          47 couples have proposed on a 30 Sundays trip
        </p>
      </div>

      <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 18, overflow: "hidden", background: "#000", boxShadow: "0 12px 30px rgba(15,18,30,0.15)" }}>
        <img src={POSTERS.bali3} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Falling confetti */}
        {confetti.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${c.left}%`, top: -20,
              width: 7, height: 12,
              background: c.color,
              transform: `rotate(${c.rot}deg)`,
              animation: `mlConfetti ${3 + (i % 4)}s linear infinite ${c.delay}s`,
              borderRadius: 1,
              opacity: 0.95,
            }}
          />
        ))}
        <style>{`@keyframes mlConfetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1 } 100% { transform: translateY(120vh) rotate(720deg); opacity: 0 } }`}</style>

        {/* Caption */}
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#fff" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 999, background: "rgba(255,200,61,0.95)", color: "#3D2817", fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, marginBottom: 10 }}>
            <Sparkles size={10} color="#3D2817" fill="#3D2817" /> SHE SAID YES
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", lineHeight: 1.15, letterSpacing: -0.3 }}>
            Ananya &amp; Rishabh<br />
            <span style={{ fontStyle: "italic", color: "#FFC83D", fontWeight: 400 }}>Day 4, golden hour</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N19 - TRIP INFOGRAPHIC - bold icon grid of trip metrics
// ════════════════════════════════════════════════════════════════════
function TripInfographicSection() {
  const items = [
    { emoji: "✈️", val: "7",    lab: "flights flown",       color: "#0EA5E9" },
    { emoji: "🌅", val: "14",   lab: "sunsets watched",     color: "#F58529" },
    { emoji: "🍷", val: "21",   lab: "dinners for two",     color: C.p600 },
    { emoji: "🏝️", val: "6",    lab: "islands explored",   color: "#15803D" },
    { emoji: "💆", val: "4",    lab: "couples' spas",       color: "#6938EF" },
    { emoji: "📸", val: "248",  lab: "photos kept",         color: "#B88500" },
  ];
  return (
    <div style={{ padding: "20px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          An average trip, in icons
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          What 7 nights look like for the couples we host
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1 / 1",
              borderRadius: 14,
              background: "#fff",
              border: `1px solid ${it.color}22`,
              padding: 12,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(15,18,30,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -10, right: -10, width: 50, height: 50, borderRadius: 999, background: `${it.color}10` }} />
            <div style={{ fontSize: 22, position: "relative" }}>{it.emoji}</div>
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: it.color, letterSpacing: -0.5, lineHeight: 1, fontFamily: "Georgia, serif" }}>{it.val}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.head, marginTop: 4, lineHeight: 1.2 }}>{it.lab}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ★ N20 - COUPLE CARD DECK - face-down playing cards, tap to flip
// ════════════════════════════════════════════════════════════════════
const DECK = [
  { back: POSTERS.bali2, couple: "T & I", dest: "BALI" },
  { back: POSTERS.mald2, couple: "A & R", dest: "MLE" },
  { back: POSTERS.viet1, couple: "S & K", dest: "HAN" },
  { back: POSTERS.thai2, couple: "P & A", dest: "BKK" },
  { back: POSTERS.bali3, couple: "D & V", dest: "DPS" },
];

function CoupleCardDeckSection() {
  const [flipped, setFlipped] = useState(-1);
  return (
    <div style={{ padding: "20px 18px 28px 18px", background: "#FAFAFA" }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.head, letterSpacing: -0.3 }}>
          Pick a card, meet a couple
        </h2>
        <p style={{ margin: "3px 0 0 0", fontSize: 12, color: C.sub, fontWeight: 500 }}>
          A daily-shuffled deck of love stories
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 200, perspective: 1000 }}>
        {DECK.map((c, i) => {
          const isFlipped = flipped === i;
          const off  = (i - 2) * 32;
          const rot  = (i - 2) * 4;
          return (
            <div
              key={i}
              onClick={() => setFlipped(isFlipped ? -1 : i)}
              style={{
                position: "absolute",
                width: 110, height: 160,
                top: "50%",
                left: "50%",
                marginLeft: -55,
                marginTop:  -80,
                transform: `translateX(${off}px) rotate(${rot}deg) rotateY(${isFlipped ? 180 : 0}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 600ms cubic-bezier(0.32, 0.72, 0, 1)",
                cursor: "pointer",
                zIndex: isFlipped ? 10 : i,
              }}
            >
              {/* Back */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${C.p900} 0%, ${C.p600} 100%)`,
                  border: "3px solid #fff",
                  boxShadow: "0 6px 16px rgba(15,18,30,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", inset: 8, border: "0.5px dashed rgba(255,255,255,0.4)", borderRadius: 6 }} />
                <div style={{ textAlign: "center", color: "#FEA3B4" }}>
                  <Heart size={20} color="#FEA3B4" fill="#FEA3B4" />
                  <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 11, marginTop: 4, letterSpacing: 1 }}>30S</div>
                </div>
              </div>
              {/* Front */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: 10,
                  border: "3px solid #fff",
                  boxShadow: "0 10px 24px rgba(15,18,30,0.22)",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <img src={c.back} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)" }} />
                <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 6px", background: "#fff", borderRadius: 3, fontSize: 8, fontWeight: 800, color: C.p600, letterSpacing: 0.4 }}>
                  {c.dest}
                </div>
                <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, color: "#fff", fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
                  {c.couple}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: C.sub, fontWeight: 600, letterSpacing: 0.4 }}>
        ✦ tap a card to flip ✦
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// CTA - plan your couple trip
// ════════════════════════════════════════════════════════════════════
function CTASection({ navigate }) {
  return (
    <div style={{ padding: "24px 18px 12px 18px", background: "#FAFAFA" }}>
      <div
        style={{
          position: "relative",
          padding: "24px 22px",
          borderRadius: 20,
          overflow: "hidden",
          background:
            `linear-gradient(135deg, ${C.p600} 0%, ${C.p900} 100%)`,
          boxShadow: "0 12px 32px rgba(227, 27, 83, 0.28)",
        }}
      >
        {/* Soft glow accent */}
        <div
          style={{
            position: "absolute",
            top: -60, right: -60,
            width: 180, height: 180, borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            filter: "blur(20px)",
          }}
        />
        <div style={{ position: "relative", color: "#fff" }}>
          <Sparkles size={18} color="#FEA3B4" fill="#FEA3B4" style={{ marginBottom: 10 }} />
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2 }}>
            Your turn on screen
          </h3>
          <p style={{ margin: "8px 0 16px 0", fontSize: 13, opacity: 0.92, fontWeight: 500, lineHeight: 1.4 }}>
            Plan a trip for two. We film the moments you'll show your friends back home.
          </p>
          <button
            onClick={() => navigate("/plan")}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 999,
              background: "#fff",
              color: C.p600,
              border: "none",
              fontSize: 14, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Plan our trip
          </button>
        </div>
      </div>
    </div>
  );
}
