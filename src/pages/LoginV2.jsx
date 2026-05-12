import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, MapPin, Sparkles, Ticket } from "lucide-react";

// Google "G" logo
const GoogleG = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

// ─── Design tokens ───
const T = {
  coral: "#E31B53",
  blush: "#FFE4E8",       // brand light pink — used for filled OTP, dropdown highlight
  navy: "#181D27",
  muted: "#6B7280",
  line: "rgba(0,0,0,0.06)",
  surface: "#F7F8FB",     // soft neutral for inputs on a white page
};

// ─── Country codes ───
const countryCodes = [
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸", digits: 10 },
  { code: "+44", country: "UK", name: "United Kingdom", flag: "🇬🇧", digits: 10 },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺", digits: 9 },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "+971", country: "AE", name: "UAE", flag: "🇦🇪", digits: 9 },
];

// ─── Carousel slides ───
// Slide 1 — Lead: itinerary card mockup over destination photo
const SLIDE_1_BG = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80&auto=format&fit=crop"; // Bali rice terrace
// Slide 2 — Exploration: couple-on-trip / destination collage
const SLIDE_2_BG = "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80&auto=format&fit=crop"; // couple on viewpoint
// Slide 3 — Booked: Maldives overwater villas
const SLIDE_3_BG = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80&auto=format&fit=crop"; // Maldives villas

// Fixed palette for adaptive Skip text — pick whichever reads best on each slide's top area
const SKIP_PALETTE = {
  navy:  "#181D27",   // on bright skies / light backgrounds
  white: "#FFFFFF",   // on dark/colorful areas
  cream: "#F5E6D3",   // on muted earth tones
  ink:   "#0F2533",   // on hazy bluish skies (better than pure black)
};

const slides = [
  {
    key: "lead",
    img: SLIDE_1_BG,
    Icon: MapPin,
    eyebrow: "Your itinerary, in progress",
    title: "Your consultant is\nputting it together",
    sub: "Sign in to see what we're planning for you two",
    highlights: ["consultant"],
    showItineraryMock: true,
    skipColor: SKIP_PALETTE.navy,   // bright sky over rice terraces
    logoColor: SKIP_PALETTE.navy,
  },
  {
    key: "explore",
    img: SLIDE_2_BG,
    Icon: Sparkles,
    eyebrow: "Curated for couples",
    title: "6 destinations,\nhand-picked for two",
    sub: "Bali, Vietnam, New Zealand and more. Tweak any trip you like.",
    highlights: ["hand-picked"],
    skipColor: SKIP_PALETTE.ink,    // hazy bluish karst sky
    logoColor: SKIP_PALETTE.ink,
  },
  {
    key: "customer",
    img: SLIDE_3_BG,
    Icon: Ticket,
    eyebrow: "Your trip, in your pocket",
    title: "Vouchers, day plans,\n24/7 support",
    sub: "Everything you booked, ready offline when you land",
    highlights: ["Vouchers"],
    skipColor: SKIP_PALETTE.navy,   // bright Maldives sky
    logoColor: SKIP_PALETTE.navy,
  },
];

// Wrap any word in `highlights` with a coral span; preserves \n line breaks
function renderWithHighlights(text, highlights, color) {
  if (!highlights || highlights.length === 0) return text;
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(${highlights.map(escape).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((p, i) =>
    highlights.some((h) => h.toLowerCase() === p.toLowerCase())
      ? <span key={i} style={{ color }}>{p}</span>
      : p
  );
}

// ─── Carousel (state isolated locally — DO NOT lift) ───
function HeroCarousel({ collapsed, onSkip }) {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  // Auto-advance every 5s (paused on touch / when collapsed)
  useEffect(() => {
    if (paused || collapsed) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, collapsed]);

  const onTouchStart = useCallback((e) => {
    setPaused(true);
    touchX.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchX.current == null) { setPaused(false); return; }
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -40) setSlide((s) => (s + 1) % slides.length);
    else if (dx > 40) setSlide((s) => (s - 1 + slides.length) % slides.length);
    touchX.current = null;
    setTimeout(() => setPaused(false), 800);
  }, []);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      {/* Layered background slides */}
      {slides.map((s, i) => (
        <div
          key={s.key}
          style={{
            position: "absolute", inset: 0,
            opacity: i === slide ? 1 : 0,
            transition: "opacity 700ms ease",
            backgroundImage: `url(${s.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Floating itinerary card mockup (slide 1 only) */}
      <div style={{
        position: "absolute",
        top: collapsed ? "10%" : "14%",
        right: 18,
        opacity: slides[slide].showItineraryMock && !collapsed ? 1 : 0,
        transform: slides[slide].showItineraryMock && !collapsed ? "translateY(0) rotate(-3deg)" : "translateY(-8px) rotate(-3deg)",
        transition: "opacity 500ms ease, transform 500ms ease, top 320ms ease",
        pointerEvents: "none",
        width: 180,
        background: "#fff",
        borderRadius: 14,
        padding: "10px 12px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.coral }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: T.coral, letterSpacing: 0.5, textTransform: "uppercase" }}>Day 3 · Ubud</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.navy, margin: 0, lineHeight: 1.3 }}>
          Sunrise at Mt Batur
        </p>
        <p style={{ fontSize: 10, color: T.muted, margin: "2px 0 8px", lineHeight: 1.3 }}>
          Pickup 3:00 AM · Private guide
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: T.coral }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: T.coral }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(227,27,83,0.18)" }} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(227,27,83,0.18)" }} />
        </div>
      </div>

      {/* Bottom-up dark gradient — gives text legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.4) 92%, rgba(0,0,0,0) 100%)",
        pointerEvents: "none",
      }} />
      {/* Long white fade — gracefully dissolves the hero into the form area */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0.92) 90%, #fff 100%)",
        pointerEvents: "none",
      }} />

      {/* Top bar — logo + skip, adaptive text colour, no pill */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
      }}>
        <img
          src="/logo.png"
          alt="30 Sundays"
          style={{
            height: 40,
            width: "auto",
            display: "block",
            // logo has its own colours; drop a subtle shadow so it reads on busy hero areas
            filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.18))",
          }}
        />
        <button
          onClick={onSkip}
          style={{
            background: "transparent",
            border: "none",
            padding: "6px 4px",
            fontSize: 14, fontWeight: 700,
            letterSpacing: 0.1,
            color: slides[slide].skipColor,
            cursor: "pointer",
            opacity: collapsed ? 0 : 1,
            pointerEvents: collapsed ? "none" : "auto",
            transition: "color 400ms ease, opacity 200ms ease",
          }}
        >
          Skip →
        </button>
      </div>

      {/* Slide content — sits on the gradient, no grey box (positioned above the long white-fade band) */}
      <div style={{
        position: "absolute",
        left: 16, right: 16,
        bottom: collapsed ? 28 : 56,
        color: "#fff",
        transition: "bottom 320ms ease",
      }}>
        {slides.map((s, i) => (
          <div key={s.key} style={{
            display: i === slide ? "block" : "none",
            animation: "lv2SlideUp 0.55s ease-out",
          }}>
            {/* Eyebrow chip */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: "0.5px solid rgba(255,255,255,0.3)",
              borderRadius: 999,
              padding: "5px 11px 5px 9px",
              fontSize: 11,
              fontWeight: 600, letterSpacing: 0.2,
              marginBottom: collapsed ? 10 : 12,
              transition: "margin-bottom 280ms ease",
            }}>
              <s.Icon size={12} />
              {s.eyebrow}
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: collapsed ? 28 : 32,
              fontWeight: 800, lineHeight: 1.1, margin: 0,
              whiteSpace: "pre-line",
              letterSpacing: -0.4,
              textShadow: "0 2px 14px rgba(0,0,0,0.32)",
              transition: "font-size 280ms ease",
            }}>
              {renderWithHighlights(s.title, s.highlights, T.coral)}
            </h2>

            {/* Sub */}
            <p style={{
              fontSize: collapsed ? 14 : 15,
              opacity: 0.94,
              margin: collapsed ? "9px 0 0" : "10px 0 0",
              lineHeight: 1.4,
              textShadow: "0 1px 6px rgba(0,0,0,0.3)",
              transition: "all 280ms ease",
            }}>
              {s.sub}
            </p>
          </div>
        ))}

        {/* Dots */}
        <div style={{
          display: "flex", gap: 6,
          marginTop: collapsed ? 10 : 16,
          transition: "margin-top 280ms ease",
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === slide ? 22 : 6, height: 6, borderRadius: 999,
                background: i === slide ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 300ms ease, background 300ms ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ───
// Props (all optional — defaults make this work as a standalone /login-v2 page):
//   onComplete({ country, phone, otp })  — called after OTP verifies successfully
//   onSkip()                              — called when Skip tapped (default: navigate("/"))
//   validateOtp(otpString) -> string|null — return error string to keep on OTP screen, or null/undefined to proceed
export default function LoginV2({ onComplete, onSkip: onSkipProp, validateOtp }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("phone"); // phone | otp
  const [country, setCountry] = useState(countryCodes[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(28);
  const [canResend, setCanResend] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // hero shrinks when input focused
  const otpRefs = useRef([]);

  // Resend countdown
  useEffect(() => {
    if (phase !== "otp") return;
    setResendTimer(28);
    setCanResend(false);
    const t = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { setCanResend(true); clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", ""]);
    setOtpError("");
    setResendTimer(28);
    setCanResend(false);
  };

  // visualViewport — collapse when keyboard pushes viewport up
  useEffect(() => {
    if (!window.visualViewport) return;
    const baseline = window.visualViewport.height;
    const onResize = () => {
      const shrunk = baseline - window.visualViewport.height > 150;
      setCollapsed(shrunk);
    };
    window.visualViewport.addEventListener("resize", onResize);
    return () => window.visualViewport.removeEventListener("resize", onResize);
  }, []);

  const phoneValid = phone.length === country.digits;
  const otpValid = otp.every((d) => d.length === 1);

  const handlePhone = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, country.digits);
    setPhone(digits);
  };
  const handleOtpChange = (i, v) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = d; setOtp(next);
    if (otpError) setOtpError("");
    if (d && i < 3) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const onPrimary = () => {
    if (phase === "phone" && phoneValid) {
      setPhase("otp");
    } else if (phase === "otp" && otpValid) {
      const otpStr = otp.join("");
      if (validateOtp) {
        const err = validateOtp(otpStr);
        if (err) { setOtpError(err); return; }
      }
      setOtpError("");
      if (onComplete) onComplete({ country, phone, otp: otpStr });
      else console.log("[LoginV2] Verify OTP", otpStr);
    }
  };
  const skip = () => {
    if (onSkipProp) onSkipProp();
    else navigate("/");
  };

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "#fff",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      color: T.navy,
    }}>
      {/* ─── Hero area (60% by default, shrinks to 42% when keyboard up) ─── */}
      {phase === "phone" && (
        <div style={{
          position: "relative",
          height: collapsed ? "42%" : "60%",
          transition: "height 320ms cubic-bezier(0.4,0,0.2,1)",
          flexShrink: 0,
        }}>
          <HeroCarousel collapsed={collapsed} onSkip={skip} />
        </div>
      )}

      {/* ─── Social proof strip ─── */}
      {phase === "phone" && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          padding: "10px 16px",
          background: "#fff",
          borderBottom: `0.5px solid ${T.line}`,
          opacity: collapsed ? 0 : 1,
          maxHeight: collapsed ? 0 : 40,
          overflow: "hidden",
          transition: "opacity 200ms ease, max-height 280ms ease, padding 280ms ease",
          paddingTop: collapsed ? 0 : 10,
          paddingBottom: collapsed ? 0 : 10,
          flexShrink: 0,
        }}>
          <GoogleG size={14} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>4.6 on Google</span>
          <span style={{ fontSize: 12, color: "#D1D5DB" }}>·</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>10,000+ trips planned</span>
        </div>
      )}

      {/* ─── Phone form ─── */}
      {phase === "phone" && (
        <div style={{
          flex: 1, minHeight: 0,
          padding: 16,
          display: "flex", flexDirection: "column",
          background: "#fff",
        }}>
          {/* Country code + phone */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCountryOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "0 12px", height: 52,
                background: T.surface,
                border: `0.5px solid ${T.line}`,
                borderRadius: 16,
                fontSize: 14, fontWeight: 600, color: T.navy,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 18 }}>{country.flag}</span>
              <span>{country.code}</span>
              <ChevronDown size={14} color={T.muted} />
            </button>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={country.digits}
              placeholder="Mobile number"
              value={phone}
              onChange={(e) => handlePhone(e.target.value)}
              onFocus={() => setCollapsed(true)}
              onBlur={() => setTimeout(() => setCollapsed(false), 120)}
              style={{
                flex: 1, height: 52, padding: "0 16px",
                background: T.surface,
                border: `0.5px solid ${T.line}`,
                borderRadius: 16,
                fontSize: 15, fontWeight: 500, color: T.navy,
                outline: "none",
              }}
            />
          </div>

          {/* Country dropdown */}
          {countryOpen && (
            <div style={{
              marginTop: 8,
              background: "#fff", borderRadius: 16, padding: 6,
              boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
              border: `0.5px solid ${T.line}`,
              maxHeight: 220, overflowY: "auto",
            }}>
              {countryCodes.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCountry(c); setCountryOpen(false); setPhone(""); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    background: c.code === country.code ? T.blush : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.navy }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{c.code}</span>
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onPrimary}
            disabled={!phoneValid}
            style={{
              marginTop: 12, height: 54, borderRadius: 16,
              background: phoneValid ? T.coral : "#E5E7EB",
              color: phoneValid ? "#fff" : "#9CA3AF",
              border: "none", fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: phoneValid ? "pointer" : "not-allowed",
              boxShadow: phoneValid ? "0 8px 20px rgba(227,27,83,0.3)" : "none",
              transition: "background 200ms ease",
            }}
          >
            Send OTP <ArrowRight size={16} />
          </button>

          {/* Footer */}
          <p style={{
            fontSize: 11, color: T.muted, textAlign: "center",
            margin: "auto 0 4px", lineHeight: 1.5,
          }}>
            By continuing you agree to our{" "}
            <span style={{ color: T.coral, fontWeight: 600 }}>Terms</span> &{" "}
            <span style={{ color: T.coral, fontWeight: 600 }}>Privacy</span>
          </p>
        </div>
      )}

      {/* ─── OTP phase ─── */}
      {phase === "otp" && (
        <div style={{
          flex: 1, padding: "72px 16px 16px",
          display: "flex", flexDirection: "column",
          background: "#fff",
        }}>
          {/* Top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px",
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
          }}>
            <button
              onClick={() => setPhase("phone")}
              style={{
                background: "transparent", border: "none", color: T.coral,
                fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0,
              }}
            >
              ← Change number
            </button>
            <button onClick={skip} style={{
              background: "rgba(0,0,0,0.04)",
              border: `0.5px solid ${T.line}`,
              borderRadius: 999, padding: "7px 14px",
              fontSize: 12, fontWeight: 600, color: T.muted,
              cursor: "pointer",
            }}>
              Skip →
            </button>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: -0.3 }}>
            Check your messages
          </h2>
          <p style={{ fontSize: 14, color: T.muted, margin: "8px 0 0", lineHeight: 1.5 }}>
            We sent a 4-digit code to{" "}
            <span style={{ fontWeight: 700, color: T.navy }}>{country.code} {phone}</span>
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKey(i, e)}
                style={{
                  flex: 1, height: 60,
                  background: otpError ? "#FEF3F2" : d ? T.blush : T.surface,
                  border: otpError
                    ? "1.5px solid #B42318"
                    : d
                      ? `1.5px solid ${T.coral}`
                      : `0.5px solid ${T.line}`,
                  borderRadius: 16, textAlign: "center",
                  fontSize: 22, fontWeight: 700, color: T.navy,
                  outline: "none",
                  transition: "border-color 160ms, background 160ms",
                }}
              />
            ))}
          </div>

          {otpError && (
            <p style={{ fontSize: 12, color: "#B42318", margin: "10px 0 0", fontWeight: 600 }}>
              {otpError}
            </p>
          )}

          <p style={{ fontSize: 12, color: T.muted, margin: "16px 0 0" }}>
            Didn't get it?{" "}
            {canResend ? (
              <span onClick={handleResend} style={{ color: T.coral, fontWeight: 600, cursor: "pointer" }}>
                Resend OTP
              </span>
            ) : (
              <span style={{ color: T.muted, fontWeight: 600 }}>Resend in {resendTimer}s</span>
            )}
          </p>

          <button
            onClick={onPrimary}
            disabled={!otpValid}
            style={{
              marginTop: 28, height: 54, borderRadius: 16,
              background: otpValid ? T.coral : "#E5E7EB",
              color: otpValid ? "#fff" : "#9CA3AF",
              border: "none", fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: otpValid ? "pointer" : "not-allowed",
              boxShadow: otpValid ? "0 8px 20px rgba(227,27,83,0.3)" : "none",
            }}
          >
            Verify & Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes lv2SlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
