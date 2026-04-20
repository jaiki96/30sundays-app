import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X as XIcon, ChevronDown, Search, Heart, MapPin, Sparkles } from "lucide-react";
import { C, destinations, allItineraries } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import DatePicker from "../components/DatePicker";

const funLines = [
  "Meanwhile, your dream beach is warming up the sand for you...",
  "Fun fact: Couples who travel together stay together 💕",
  "Your sunset dinner table in Bali is almost ready...",
  "Pack your bags mentally while we verify this...",
];

// ─── Country codes (expanded + searchable) ───
const countryCodes = [
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸", digits: 10 },
  { code: "+44", country: "UK", name: "United Kingdom", flag: "🇬🇧", digits: 10 },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺", digits: 9 },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "+971", country: "AE", name: "UAE", flag: "🇦🇪", digits: 9 },
  { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾", digits: 10 },
  { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭", digits: 9 },
  { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵", digits: 10 },
  { code: "+86", country: "CN", name: "China", flag: "🇨🇳", digits: 11 },
  { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪", digits: 11 },
  { code: "+33", country: "FR", name: "France", flag: "🇫🇷", digits: 9 },
  { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹", digits: 10 },
  { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷", digits: 10 },
  { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩", digits: 11 },
  { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭", digits: 10 },
  { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿", digits: 9 },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰", digits: 9 },
  { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵", digits: 10 },
  { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩", digits: 10 },
  { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦", digits: 9 },
  { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺", digits: 10 },
  { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷", digits: 11 },
  { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽", digits: 10 },
  { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬", digits: 10 },
  { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪", digits: 9 },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦", digits: 9 },
  { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦", digits: 8 },
  { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲", digits: 8 },
  { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭", digits: 8 },
];

// ─── SVG Illustrations ───
const IlloPhone = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFE4E8"/>
    <rect x="27" y="18" width="26" height="44" rx="5" stroke="#E31B53" strokeWidth="2" fill="#fff"/>
    <rect x="35" y="56" width="10" height="2" rx="1" fill="#FEA3B4"/>
    <circle cx="52" cy="22" r="5" fill="#E31B53"/>
    <circle cx="52" cy="22" r="2" fill="#fff"/>
    <path d="M48 16l2-3M56 16l-2-3M52 14v-3" stroke="#FEA3B4" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IlloOtp = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFE4E8"/>
    <rect x="22" y="28" width="36" height="26" rx="4" stroke="#E31B53" strokeWidth="2" fill="#fff"/>
    <path d="M22 32l18 12 18-12" stroke="#FEA3B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="34" cy="44" r="2" fill="#E31B53"/>
    <circle cx="40" cy="44" r="2" fill="#E31B53"/>
    <circle cx="46" cy="44" r="2" fill="#E31B53"/>
  </svg>
);

const destNames = ["Thailand", "Vietnam", "Bali", "Maldives", "Sri Lanka", "New Zealand"];
const destFlags = { Thailand: "🇹🇭", Vietnam: "🇻🇳", Bali: "🇮🇩", Maldives: "🇲🇻", "Sri Lanka": "🇱🇰", "New Zealand": "🇳🇿" };
const adultOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Plan({ userState, setUserState, leadData, setLeadData }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselectedDest = params.get("dest") || "";
  const returnTo = params.get("return") || "";

  // If already a lead with data, skip to appropriate page
  useEffect(() => {
    if (userState === "lead" && leadData) {
      if (returnTo === "trips") {
        navigate("/trips", { replace: true });
      } else if (returnTo === "account") {
        navigate("/account", { replace: true });
      } else {
        // Already a lead, show the success screen
        setPhase("success");
      }
    }
  }, []);

  // phase: "phone" | "otp" | "details" | "success"
  const [phase, setPhase] = useState(userState === "lead" && leadData ? "success" : "phone");
  const [countryIdx, setCountryIdx] = useState(0);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(28);
  const [canResend, setCanResend] = useState(false);

  // Details fields
  const [name, setName] = useState("");
  const [dests, setDests] = useState(preselectedDest ? [preselectedDest] : []);
  const [adults, setAdults] = useState(2);
  const [showAdultDropdown, setShowAdultDropdown] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [showChildrenApology, setShowChildrenApology] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [nights, setNights] = useState(null);
  const [showNightsDropdown, setShowNightsDropdown] = useState(false);

  // Welcome banner dismiss
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeFadingOut, setWelcomeFadingOut] = useState(false);

  const funLine = useMemo(() => funLines[Math.floor(Math.random() * funLines.length)], []);
  const otpRefs = useRef([]);
  const searchInputRef = useRef(null);
  const country = countryCodes[countryIdx];
  const phoneValid = phone.length === country.digits;

  // Get recommended itineraries for selected destinations
  const recommendedItineraries = useMemo(() => {
    const selectedDests = phase === "success" && leadData ? leadData.dests : dests;
    if (!selectedDests || selectedDests.length === 0) return [];
    // Pick 1 recommended itinerary per destination
    const recs = [];
    selectedDests.forEach(d => {
      const match = allItineraries.find(it => it.dest === d);
      if (match) recs.push(match);
    });
    return recs;
  }, [phase, leadData, dests]);

  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countryCodes;
    const q = countrySearch.toLowerCase().trim();
    return countryCodes.filter(cc =>
      cc.name.toLowerCase().includes(q) ||
      cc.country.toLowerCase().includes(q) ||
      cc.code.includes(q)
    );
  }, [countrySearch]);

  // Auto-focus search when picker opens
  useEffect(() => {
    if (showCountryPicker && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!showCountryPicker) setCountrySearch("");
  }, [showCountryPicker]);

  // Resend timer
  useEffect(() => {
    if (phase !== "otp") return;
    setResendTimer(28);
    setCanResend(false);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-dismiss welcome banner after 20 seconds
  useEffect(() => {
    if (phase !== "success" || !showWelcome) return;
    const fadeTimer = setTimeout(() => setWelcomeFadingOut(true), 19000);
    const hideTimer = setTimeout(() => setShowWelcome(false), 20000);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [phase, showWelcome]);

  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(28);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setOtpError("");
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleDest = (d) => setDests(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleChildrenYes = () => {
    setHasChildren(true);
    setShowChildrenApology(true);
  };

  // Determine CTA state per phase
  let ctaLabel = "";
  let ctaEnabled = false;
  if (phase === "phone") { ctaLabel = "Send OTP"; ctaEnabled = phoneValid; }
  else if (phase === "otp") { ctaLabel = "Verify"; ctaEnabled = otp.every(d => d); }
  else if (phase === "details") { ctaLabel = "Explore Itineraries"; ctaEnabled = name.trim().length > 0 && dests.length > 0; }

  const ctaAction = () => {
    if (phase === "phone") {
      setPhase("otp");
    } else if (phase === "otp") {
      const enteredOtp = otp.join("");
      if (enteredOtp === "0000") {
        setOtpError("Invalid OTP. Please try again.");
        return;
      }
      setOtpError("");
      setPhase("details");
    } else if (phase === "details") {
      const data = {
        phone,
        countryCode: country.code,
        name: name.trim(),
        dests,
        adults,
        children: hasChildren ? 1 : 0,
        startDate,
        nights,
      };
      setLeadData(data);
      setUserState("lead");
      if (returnTo === "trips") {
        navigate("/trips", { replace: true });
      } else if (returnTo === "account") {
        navigate("/account", { replace: true });
      } else {
        // Transient curating state for feedback, then success
        setPhase("curating");
        setTimeout(() => {
          setPhase("success");
          setShowWelcome(true);
        }, 2400);
      }
    }
  };

  const goBack = () => {
    if (phase === "otp") setPhase("phone");
    else if (phase === "details") setPhase("otp");
    else if (phase === "success") navigate("/");
    else navigate(-1);
  };

  const successName = leadData?.name || name.trim() || "traveller";
  const successDests = leadData?.dests || dests;

  // ─── RENDER ───
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 700, background: C.white }}>

      {/* ═══ CURATING TRANSIENT STATE ═══ */}
      {phase === "curating" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
          <div style={{
            width: 96, height: 96, borderRadius: 28,
            background: `linear-gradient(135deg, ${C.p100} 0%, #FFF5F0 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20, position: "relative",
            animation: "scaleIn 0.4s ease-out",
          }}>
            <Sparkles size={40} color={C.p600} style={{ animation: "pulse 1.6s ease-in-out infinite" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>
            Curating your getaway…
          </h2>
          <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "20px", maxWidth: 300 }}>
            Hand-picking itineraries based on your preferences. This takes just a moment.
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 26 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: C.p600, opacity: 0.35,
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ SUCCESS SCREEN (post-signup, stays on Plan page) ═══ */}
      {phase === "success" && (
        <>
          {/* Header */}
          <div style={{ padding: "12px 16px 8px" }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: 0 }}>Your Trips</h1>
            <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 0" }}>{recommendedItineraries.length} itinerary{recommendedItineraries.length !== 1 ? "s" : ""} curated for you</p>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 80px" }} className="hide-scrollbar">
            {/* Welcome banner */}
            {showWelcome && (
              <div style={{
                margin: "8px 0 16px", borderRadius: 16, padding: "16px",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                background: "linear-gradient(135deg, rgba(255,228,232,0.8) 0%, rgba(255,255,255,0.9) 100%)",
                border: `1px solid ${C.p300}44`,
                position: "relative",
                animation: welcomeFadingOut ? "fadeOut 1s ease-out forwards" : "scaleIn 0.4s ease-out, fadeUp 0.5s ease-out",
              }}>
                <button
                  onClick={() => { setWelcomeFadingOut(true); setTimeout(() => setShowWelcome(false), 800); }}
                  style={{
                    position: "absolute", top: 8, right: 10, width: 20, height: 20,
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <XIcon size={12} color="rgba(0,0,0,0.3)" />
                </button>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: C.p100, display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${C.p300}44`,
                  }}>
                    <Sparkles size={20} color={C.p600} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.p900, margin: "0 0 4px" }}>
                      We're thrilled, {successName}! 🎉
                    </p>
                    <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "18px" }}>
                      We've curated {recommendedItineraries.length} itinerar{recommendedItineraries.length === 1 ? "y" : "ies"} for {successDests.join(" & ")}, scroll to explore.
                      A travel consultant will also reach out shortly to personalise further.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dates-missing prompt, shown when user skipped startDate / nights */}
            {(!leadData?.startDate || !leadData?.nights) && (
              <div style={{
                margin: "4px 0 16px", borderRadius: 16, padding: "16px",
                background: `linear-gradient(135deg, ${C.p100} 0%, #FFF5F0 100%)`,
                border: `1px solid ${C.p300}66`,
                position: "relative", zIndex: 30,
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color={C.p600} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.p900, margin: "0 0 2px" }}>
                      Unlock your exact itinerary
                    </p>
                    <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "18px" }}>
                      Add your travel dates and nights and we'll lock in prices + availability for you.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ position: "relative", zIndex: 15 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 4, display: "block" }}>Trip start date</label>
                    <DatePicker value={startDate} onChange={setStartDate} />
                  </div>

                  <div style={{ position: "relative", zIndex: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 4, display: "block" }}>How many nights?</label>
                    <button
                      onClick={() => setShowNightsDropdown(!showNightsDropdown)}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px", borderRadius: 12,
                        background: C.white,
                        border: `1.5px solid ${nights ? "#027A48" : C.div}`,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: nights ? 600 : 500, color: nights ? C.head : C.sub }}>
                        {nights ? (nights === 0 ? "Flexible" : `${nights} Nights`) : "Select number of nights"}
                      </span>
                      <ChevronDown size={16} color={C.sub} style={{ transition: "transform 0.2s", transform: showNightsDropdown ? "rotate(180deg)" : "none" }} />
                    </button>
                    {showNightsDropdown && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                        background: C.white, borderRadius: 12, border: `1px solid ${C.div}`,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                        maxHeight: 240, overflowY: "auto",
                      }}>
                        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0].map((n, idx, arr) => {
                          const sel = nights === n;
                          const label = n === 0 ? "Flexible" : `${n} Nights`;
                          return (
                            <button
                              key={n}
                              onClick={() => { setNights(n); setShowNightsDropdown(false); }}
                              style={{
                                display: "flex", alignItems: "center",
                                width: "100%", padding: "11px 16px",
                                background: sel ? C.p100 : "none",
                                border: "none", cursor: "pointer", fontFamily: "inherit",
                                borderBottom: idx < arr.length - 1 ? `1px solid ${C.div}` : "none",
                                fontSize: 14, fontWeight: sel ? 700 : 500,
                                color: sel ? C.p600 : C.head, textAlign: "left",
                              }}
                            >{label}</button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!startDate || !nights) return;
                      setLeadData({ ...leadData, startDate, nights });
                    }}
                    disabled={!startDate || !nights}
                    style={{
                      marginTop: 4, padding: "12px 0", borderRadius: 12, border: "none",
                      background: (startDate && nights) ? C.p600 : C.inact,
                      color: "#fff", fontSize: 14, fontWeight: 700,
                      cursor: (startDate && nights) ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: (startDate && nights) ? "0 4px 12px rgba(227,27,83,0.3)" : "none",
                    }}
                  >
                    Save & see my itinerary
                  </button>
                </div>
              </div>
            )}

            {/* Recommended itineraries */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recommendedItineraries.map(it => (
                <ItineraryCard key={it.id} it={it} fullWidth />
              ))}
            </div>

            {/* See more link */}
            <Link
              to={`/listing?dest=${successDests[0]}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                margin: "20px 0", padding: "14px 0", borderRadius: 14,
                border: `1.5px solid ${C.p600}`, background: C.white,
                fontSize: 14, fontWeight: 600, color: C.p600, textDecoration: "none",
              }}
            >
              View all itineraries <ArrowRight size={15} />
            </Link>
          </div>
        </>
      )}

      {/* ═══ NON-SUCCESS SCREENS ═══ */}
      {phase !== "success" && (
        <>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px 0" }}>
            <button onClick={goBack} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ArrowLeft size={17} color={C.head} />
            </button>
            <span style={{ fontSize: 11, color: C.inact }}>
              {phase === "phone" ? "Step 1 of 3" : phase === "otp" ? "Step 2 of 3" : "Step 3 of 3"}
            </span>
            <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <XIcon size={16} color={C.sub} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 4, padding: "8px 20px 0" }}>
            {[0, 1, 2].map(i => {
              const stepIdx = phase === "phone" ? 0 : phase === "otp" ? 1 : 2;
              return (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= stepIdx ? C.p600 : C.div, transition: "background 0.4s ease" }} />
              );
            })}
          </div>
        </>
      )}

      {/* ═══ PHONE SCREEN ═══ */}
      {phase === "phone" && (
        <>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <div style={{ animation: "scaleIn 0.3s ease-out" }}><IlloPhone /></div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, marginTop: 16 }}>Let's plan your getaway</h2>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: "19px" }}>
              Your number helps our travel consultant reach you with a personalised itinerary
            </p>
          </div>
          <div style={{ padding: "0 20px 40px", animation: "fadeUp 0.3s ease-out 0.12s both" }}>
            <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${phoneValid ? "#027A48" : C.div}`, borderRadius: 14, height: 52, background: "#FAFAFA", transition: "border 0.2s", overflow: "hidden" }}>
              <button
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "0 10px 0 14px",
                  height: "100%", background: "none", border: "none", cursor: "pointer",
                  fontSize: 15, color: C.head, fontFamily: "inherit", flexShrink: 0,
                }}
              >
                <span>{country.flag}</span>
                <span style={{ fontWeight: 500 }}>{country.code}</span>
                <ChevronDown size={12} color={C.sub} />
              </button>
              <div style={{ width: 1, height: 22, background: C.div, flexShrink: 0 }} />
              <input
                type="tel" maxLength={country.digits} placeholder="Mobile number"
                autoFocus={!showCountryPicker}
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, country.digits))}
                style={{ flex: 1, fontSize: 15, color: C.head, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", padding: "0 14px" }}
              />
              {phoneValid && <Check size={16} color="#027A48" style={{ marginRight: 14 }} />}
            </div>

            {/* Country picker dropdown with search */}
            {showCountryPicker && (
              <div style={{
                marginTop: 4, borderRadius: 14, border: `1px solid ${C.div}`, background: C.white,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderBottom: `1px solid ${C.div}`,
                  background: "#FAFAFA",
                }}>
                  <Search size={14} color={C.inact} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search country or code..."
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    style={{
                      flex: 1, fontSize: 13, color: C.head, background: "transparent",
                      border: "none", outline: "none", fontFamily: "inherit",
                    }}
                  />
                  {countrySearch && (
                    <button onClick={() => setCountrySearch("")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}>
                      <XIcon size={12} color={C.inact} />
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 180, overflowY: "auto" }} className="hide-scrollbar">
                  {filteredCountries.length === 0 ? (
                    <div style={{ padding: "16px", textAlign: "center", fontSize: 12, color: C.inact }}>
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((cc) => {
                      const originalIdx = countryCodes.indexOf(cc);
                      return (
                        <button
                          key={cc.code}
                          onClick={() => { setCountryIdx(originalIdx); setShowCountryPicker(false); setPhone(""); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 14px",
                            background: originalIdx === countryIdx ? C.p100 : "none", border: "none", cursor: "pointer",
                            borderBottom: `1px solid ${C.div}22`,
                            fontFamily: "inherit",
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{cc.flag}</span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: C.head, flex: 1, textAlign: "left" }}>{cc.name}</span>
                          <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>{cc.code}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={ctaAction}
              disabled={!ctaEnabled}
              style={{
                width: "100%", marginTop: showCountryPicker ? 12 : 20,
                padding: "15px 0", borderRadius: 14, border: "none",
                background: ctaEnabled ? C.p600 : C.inact,
                color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: ctaEnabled ? "pointer" : "not-allowed",
                boxShadow: ctaEnabled ? "0 4px 16px rgba(227,27,83,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {ctaLabel} <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}

      {/* ═══ OTP SCREEN ═══ */}
      {phase === "otp" && (
        <>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <div style={{ animation: "scaleIn 0.3s ease-out" }}><IlloOtp /></div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, marginTop: 16 }}>Verify your number</h2>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: "19px" }}>
              Code sent to {country.code} {phone}
            </p>
            <p style={{ fontSize: 12, color: C.p600, fontStyle: "italic", marginTop: 10, lineHeight: "17px" }}>
              {funLine}
            </p>
          </div>
          <div style={{ padding: "0 20px 40px", animation: "fadeUp 0.3s ease-out 0.12s both" }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }}>
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i} type="tel" maxLength={1} autoFocus={i === 0}
                  ref={el => otpRefs.current[i] = el}
                  value={otp[i]}
                  style={{
                    width: 44, height: 48, borderRadius: 12, textAlign: "center",
                    fontSize: 18, fontWeight: 600, color: C.head, fontFamily: "inherit",
                    border: `1.5px solid ${otpError ? "#B42318" : otp[i] ? C.p600 : C.div}`,
                    background: otpError ? "#FEF3F2" : otp[i] ? "#FFE4E844" : "#FAFAFA",
                    outline: "none",
                  }}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    const next = [...otp]; next[i] = val;
                    setOtp(next);
                    setOtpError("");
                    if (val && otpRefs.current[i + 1]) otpRefs.current[i + 1].focus();
                  }}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !otp[i] && otpRefs.current[i - 1]) otpRefs.current[i - 1].focus();
                  }}
                />
              ))}
            </div>
            {otpError && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#B42318", marginBottom: 8 }}>{otpError}</p>
            )}
            <button
              onClick={ctaAction}
              disabled={!ctaEnabled}
              style={{
                width: "100%", marginTop: 12,
                padding: "15px 0", borderRadius: 14, border: "none",
                background: ctaEnabled ? C.p600 : C.inact,
                color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: ctaEnabled ? "pointer" : "not-allowed",
                boxShadow: ctaEnabled ? "0 4px 16px rgba(227,27,83,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {ctaLabel} <ArrowRight size={16} />
            </button>
            <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.sub }}>
              Didn't receive?{" "}
              {canResend ? (
                <span onClick={handleResend} style={{ fontWeight: 600, color: C.p600, cursor: "pointer" }}>Resend OTP</span>
              ) : (
                <span style={{ fontWeight: 600, color: C.inact }}>Resend in {resendTimer}s</span>
              )}
            </p>
          </div>
        </>
      )}

      {/* ═══ TRIP DETAILS SCREEN ═══ */}
      {phase === "details" && (
        <>
          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 0" }} className="hide-scrollbar">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.head, marginBottom: 2, animation: "fadeUp 0.3s ease-out" }}>
              Tell us about your trip
            </h2>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 16, animation: "fadeUp 0.3s ease-out 0.05s both" }}>
              We'll curate the perfect getaway for you
            </p>

            {/* ── 1. Name ── */}
            <div style={{ marginBottom: 16, animation: "fadeUp 0.3s ease-out 0.08s both" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 6, display: "block" }}>
                Your name <span style={{ color: C.p600 }}>*</span>
              </label>
              <input
                type="text" placeholder="What should we call you?" autoFocus
                value={name} onChange={e => setName(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14,
                  border: `1.5px solid ${name.trim() ? "#027A48" : C.div}`,
                  fontSize: 15, color: C.head, background: "#FAFAFA",
                  outline: "none", fontFamily: "inherit", transition: "border 0.2s",
                }}
              />
            </div>

            {/* ── 2. Travellers ── */}
            <div style={{ marginBottom: 16, position: "relative", zIndex: 20, animation: "fadeUp 0.3s ease-out 0.12s both" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 8, display: "block" }}>
                Travellers
              </label>

              {/* Adults dropdown */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.div}` }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>Adults</p>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowAdultDropdown(!showAdultDropdown)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 14px", borderRadius: 10,
                      background: C.p100, border: `1.5px solid ${C.p300}`,
                      cursor: "pointer", fontFamily: "inherit",
                      minWidth: 64, justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.p900 }}>{adults}</span>
                    <ChevronDown size={14} color={C.p600} style={{ transition: "transform 0.2s", transform: showAdultDropdown ? "rotate(180deg)" : "none" }} />
                  </button>
                  {showAdultDropdown && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                      background: C.white, borderRadius: 12, border: `1px solid ${C.div}`,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                      width: 80,
                    }}>
                      {adultOptions.map((n, idx) => (
                        <button
                          key={n}
                          onClick={() => { setAdults(n); setShowAdultDropdown(false); }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "100%", padding: "12px 0",
                            background: n === adults ? C.p100 : "none",
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            borderBottom: idx < adultOptions.length - 1 ? `1px solid ${C.div}` : "none",
                            fontSize: 15, fontWeight: n === adults ? 700 : 500,
                            color: n === adults ? C.p600 : C.head,
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Adults apology, if not exactly 2 (couples only) */}
              {adults !== 2 && (
                <div style={{
                  marginTop: 12, padding: "14px", borderRadius: 14,
                  background: "linear-gradient(135deg, #FFF5F0 0%, #FFE4E8 100%)",
                  border: `1px solid ${C.p300}44`,
                  animation: "fadeUp 0.3s ease-out",
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 12, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Heart size={16} color={C.p600} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.p900, margin: "0 0 4px" }}>
                        We're so sorry! 😔
                      </p>
                      <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "18px" }}>
                        30 Sundays is exclusively crafted for couples, intimate getaways,
                        private dinners, that kind of magic. We don't curate group trips yet.
                      </p>
                      <p style={{ fontSize: 13, color: C.p600, fontWeight: 600, margin: "8px 0 0" }}>
                        For now, try a couples-only escape? You deserve it. 💕
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Travelling with children toggle */}
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.head, margin: 0 }}>Travelling with children?</p>
                    <p style={{ fontSize: 12, color: C.sub, margin: 0 }}>Age 0–11</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { setHasChildren(false); setShowChildrenApology(false); }}
                      style={{
                        padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                        background: !hasChildren ? C.p100 : "#FAFAFA",
                        color: !hasChildren ? C.p600 : C.sub,
                        border: `1.5px solid ${!hasChildren ? C.p600 : C.div}`,
                      }}
                    >No</button>
                    <button
                      onClick={handleChildrenYes}
                      style={{
                        padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                        background: hasChildren ? C.p100 : "#FAFAFA",
                        color: hasChildren ? C.p600 : C.sub,
                        border: `1.5px solid ${hasChildren ? C.p600 : C.div}`,
                      }}
                    >Yes</button>
                  </div>
                </div>
                {showChildrenApology && (
                  <div style={{
                    marginTop: 14, padding: "16px", borderRadius: 14,
                    background: "linear-gradient(135deg, #FFF5F0 0%, #FFE4E8 100%)",
                    border: `1px solid ${C.p300}44`,
                    animation: "fadeUp 0.3s ease-out",
                  }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Heart size={18} color={C.p600} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.p900, margin: "0 0 4px" }}>
                          We're so sorry! 😔
                        </p>
                        <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "18px" }}>
                          Right now, 30 Sundays is exclusively crafted for couples, romantic getaways,
                          sunset dinners for two, that kind of magic. We don't have kids' itineraries yet,
                          but we're working on it!
                        </p>
                        <p style={{ fontSize: 13, color: C.p600, fontWeight: 600, margin: "8px 0 0" }}>
                          For now, maybe plan a couples-only escape? You deserve it. 💕
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── 3. Destinations ── */}
            <div style={{ marginBottom: 16, animation: "fadeUp 0.3s ease-out 0.16s both" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 2, display: "block" }}>
                Where do you want to go? <span style={{ color: C.p600 }}>*</span>
              </label>
              <p style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>Pick one or more, we'll curate for each</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {destNames.map(d => {
                  const sel = dests.includes(d);
                  return (
                    <button key={d} onClick={() => toggleDest(d)} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 10px", borderRadius: 12, cursor: "pointer",
                      fontSize: 14, fontWeight: sel ? 600 : 500,
                      color: sel ? C.p600 : C.sub,
                      background: sel ? C.p100 : "#FAFAFA",
                      border: `1.5px solid ${sel ? C.p600 : C.div}`,
                      transition: "all 0.15s", fontFamily: "inherit",
                    }}>
                      <span>{destFlags[d]}</span>
                      {sel && <Check size={14} color={C.p600} strokeWidth={2.5} />}
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 4. Trip start date ── */}
            <div style={{ marginBottom: 16, position: "relative", zIndex: 15, animation: "fadeUp 0.3s ease-out 0.18s both" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 2, display: "block" }}>
                When's your trip? <span style={{ color: C.p600 }}>*</span>
              </label>
              <p style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>Trip start date</p>
              <DatePicker value={startDate} onChange={setStartDate} />
            </div>

            {/* ── 5. Nights ── */}
            <div style={{ marginBottom: 16, position: "relative", zIndex: 10, animation: "fadeUp 0.3s ease-out 0.2s both" }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.head, marginBottom: 2, display: "block" }}>
                How many nights? <span style={{ color: C.p600 }}>*</span>
              </label>
              <p style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>Duration of your getaway</p>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNightsDropdown(!showNightsDropdown)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 12,
                    background: "#FAFAFA",
                    border: `1.5px solid ${nights ? "#027A48" : C.div}`,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: nights ? 600 : 500, color: nights ? C.head : C.sub }}>
                    {nights ? (nights === 0 ? "Flexible" : `${nights} Nights`) : "Select number of nights"}
                  </span>
                  <ChevronDown size={16} color={C.sub} style={{ transition: "transform 0.2s", transform: showNightsDropdown ? "rotate(180deg)" : "none" }} />
                </button>
                {showNightsDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                    background: C.white, borderRadius: 12, border: `1px solid ${C.div}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                    maxHeight: 280, overflowY: "auto",
                  }}>
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0].map((n, idx, arr) => {
                      const sel = nights === n;
                      const label = n === 0 ? "Flexible" : `${n} Nights`;
                      return (
                        <button
                          key={n}
                          onClick={() => { setNights(n); setShowNightsDropdown(false); }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "flex-start",
                            width: "100%", padding: "12px 16px",
                            background: sel ? C.p100 : "none",
                            border: "none", cursor: "pointer", fontFamily: "inherit",
                            borderBottom: idx < arr.length - 1 ? `1px solid ${C.div}` : "none",
                            fontSize: 14, fontWeight: sel ? 700 : 500,
                            color: sel ? C.p600 : C.head,
                            textAlign: "left",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Spacer for fixed CTA */}
            <div style={{ height: 90 }} />
          </div>

          {/* ── Fixed CTA at bottom ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "12px 20px 40px",
            background: "linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)",
            zIndex: 5,
          }}>
            <button
              onClick={ctaAction}
              disabled={!ctaEnabled}
              style={{
                width: "100%", padding: "15px 0", borderRadius: 14, border: "none",
                background: ctaEnabled ? C.p600 : C.inact,
                color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: ctaEnabled ? "pointer" : "not-allowed",
                boxShadow: ctaEnabled ? "0 4px 16px rgba(227,27,83,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              {ctaLabel} <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
