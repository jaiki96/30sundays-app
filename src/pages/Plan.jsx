import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X as XIcon, ChevronDown, ChevronRight, Search, Heart, MapPin, Sparkles } from "lucide-react";
import { C, destinations, allItineraries } from "../data";
import ItineraryCard from "../components/ItineraryCard";
import DatePicker from "../components/DatePicker";
import LoginV2 from "./LoginV2";
import { useDeals, effectiveStatus, STATUS_LABEL, QUOTE_VALID_DAYS } from "../data/deals";

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
// Returning users without a fresh lead inquiry still land on a populated plan list.
const DEFAULT_PLAN_DESTS = ["Bali", "Thailand", "Vietnam"];
const destFlags = { Thailand: "🇹🇭", Vietnam: "🇻🇳", Bali: "🇮🇩", Maldives: "🇲🇻", "Sri Lanka": "🇱🇰", "New Zealand": "🇳🇿" };
const adultOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

// Big, image-led card for a finalized quote version (vs the compact draft row).
function QuoteCard({ deal, v, onOpen }) {
  const itin = allItineraries.find(i => i.id === deal.itineraryId);
  const travellers = 2 + (itin?.veg ? 0 : 1);
  const expired = effectiveStatus(v) === "expired";
  const total = (v.livePrice || 0) * travellers;
  const validTill = v.pricedAt ? new Date(v.pricedAt + QUOTE_VALID_DAYS * 86400000) : null;
  return (
    <div
      data-testid={`deal-quote-card-v${v.num}`}
      onClick={onOpen}
      style={{ position: "relative", height: 188, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
    >
      <img src={deal.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.78) 100%)" }} />

      {/* Status + version chips */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, color: "#fff", background: expired ? "rgba(181,71,8,0.92)" : "rgba(2,122,72,0.92)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          {expired ? "Expired" : "Quote"}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", padding: "4px 10px", borderRadius: 20, color: "#fff", background: "rgba(255,255,255,0.16)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
          V{v.num}
        </span>
      </div>

      {/* Bottom overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>
        <p style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.title}</p>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.82)" }}>
          {v.createdBy === "customer" ? "Created by you · " : ""}{deal.dest}{validTill && !expired ? ` · valid till ${validTill.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>₹{total.toLocaleString("en-IN")}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 14, fontWeight: 700, color: "#fff" }}>Open <ArrowRight size={15} color="#fff" /></span>
        </div>
      </div>
    </div>
  );
}

export default function Plan({ userState, setUserState, leadData, setLeadData }) {
  const navigate = useNavigate();
  const { deals } = useDeals();
  const [params] = useSearchParams();
  const preselectedDest = params.get("dest") || "";
  const returnTo = params.get("return") || "";

  // Returning users (lead / customer / trip done) go straight to their plans.
  // Only a brand-new user is asked to log in first.
  const isReturning = userState !== "new";

  useEffect(() => {
    if (isReturning) {
      if (returnTo === "trips") {
        navigate("/trips", { replace: true });
      } else if (returnTo === "account") {
        navigate("/account", { replace: true });
      } else {
        // Already known to us, show the plans directly
        setPhase("success");
      }
    }
  }, []);

  // phase: "auth" | "details" | "curating" | "success"
  // ("auth" covers what used to be "phone" + "otp" - handled by LoginV2)
  const [phase, setPhase] = useState(isReturning ? "success" : "auth");
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
    let selectedDests = phase === "success" && leadData ? leadData.dests : dests;
    // Returning user without a fresh inquiry: fall back to a default curated set.
    if (phase === "success" && (!selectedDests || selectedDests.length === 0)) {
      selectedDests = DEFAULT_PLAN_DESTS;
    }
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

  // Determine CTA state per phase (auth phase has its own CTA inside LoginV2)
  let ctaLabel = "";
  let ctaEnabled = false;
  if (phase === "details") { ctaLabel = "Explore Itineraries"; ctaEnabled = name.trim().length > 0 && dests.length > 0; }

  // Called by LoginV2 when OTP verifies successfully
  const handleAuthComplete = ({ country: c, phone: p }) => {
    setPhone(p);
    setCountryIdx(countryCodes.findIndex((cc) => cc.code === c.code));
    setPhase("details");
  };

  // OTP validation that LoginV2 calls - keep the legacy "0000 = invalid" rule
  const validateOtp = (otpStr) => {
    if (otpStr === "0000") return "Invalid OTP. Please try again.";
    return null;
  };

  // Skip from LoginV2 → bounce home (or return target)
  const handleAuthSkip = () => {
    if (returnTo === "trips") navigate("/trips", { replace: true });
    else if (returnTo === "account") navigate("/account", { replace: true });
    else navigate("/", { replace: true });
  };

  const ctaAction = () => {
    if (phase === "details") {
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
    if (phase === "details") setPhase("auth");
    else if (phase === "success") navigate("/");
    else navigate(-1);
  };

  const successName = leadData?.name || name.trim() || "traveller";
  const successDests = (leadData?.dests?.length ? leadData.dests : (dests.length ? dests : DEFAULT_PLAN_DESTS));

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
            {/* Saved plans (versioned deals) */}
            {deals.length > 0 && (
              <div style={{ margin: "8px 0 20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "0 0 10px" }}>Saved plans</p>
                {deals.map(deal => {
                  const sorted = [...deal.versions].sort((a, b) => b.num - a.num);
                  const itin = allItineraries.find(i => i.id === deal.itineraryId);
                  const travellers = 2 + (itin?.veg ? 0 : 1);
                  const quotes = sorted.filter(v => effectiveStatus(v) !== "draft");
                  const drafts = sorted.filter(v => effectiveStatus(v) === "draft");
                  return (
                    <div key={deal.id} style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                      {/* Finalized quotes → big image cards */}
                      {quotes.map(v => (
                        <QuoteCard
                          key={v.id}
                          deal={deal}
                          v={v}
                          onOpen={() => navigate(`/itinerary/${deal.itineraryId}?dealId=${deal.id}&versionId=${v.id}`)}
                        />
                      ))}

                      {/* Drafts (work in progress) → compact rows under a header */}
                      {drafts.length > 0 && (
                        <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", background: C.white }}>
                          <div
                            onClick={() => navigate(`/itinerary/${deal.itineraryId}?dealId=${deal.id}&versionId=${drafts[0].id}`)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderBottom: `1px solid ${C.div}`, cursor: "pointer" }}
                          >
                            <img src={deal.img} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{deal.title}</p>
                              <p style={{ margin: "1px 0 0", fontSize: 11, color: C.sub }}>{deal.dest} · {drafts.length} draft{drafts.length !== 1 ? "s" : ""}</p>
                            </div>
                            <ChevronRight size={18} color={C.inact} style={{ flexShrink: 0 }} />
                          </div>
                          {drafts.map(v => {
                            const total = (v.indicativePrice || 0) * travellers;
                            return (
                              <div
                                key={v.id}
                                data-testid={`deal-version-draft-v${v.num}`}
                                onClick={() => navigate(`/itinerary/${deal.itineraryId}?dealId=${deal.id}&versionId=${v.id}`)}
                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", cursor: "pointer", borderTop: `1px solid ${C.bg}` }}
                              >
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: C.p100, color: C.p600, flexShrink: 0 }}>
                                  Draft
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.head, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    v{v.num}
                                    {v.indicativePrice != null && <span style={{ fontWeight: 700 }}> · ₹{total.toLocaleString("en-IN")}</span>}
                                  </p>
                                  <p style={{ margin: "1px 0 0", fontSize: 11, color: C.sub }}>
                                    {v.createdBy === "customer" ? "Created by you · " : ""}
                                    {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · Editing
                                  </p>
                                </div>
                                <ArrowRight size={16} color={C.inact} style={{ flexShrink: 0 }} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

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

            {/* Recommended itineraries */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recommendedItineraries.map(it => (
                <ItineraryCard key={it.id} it={it} fullWidth showVersion />
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

      {/* ═══ Top bar (details only - auth has its own, success/curating don't need it) ═══ */}
      {phase === "details" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px 0" }}>
          <button onClick={goBack} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={17} color={C.head} />
          </button>
          <span style={{ fontSize: 11, color: C.inact }}>Almost done</span>
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <XIcon size={16} color={C.sub} />
          </button>
        </div>
      )}

      {/* ═══ AUTH (phone + OTP) - handled by LoginV2 ═══ */}
      {phase === "auth" && (
        <LoginV2
          onComplete={handleAuthComplete}
          onSkip={handleAuthSkip}
          validateOtp={validateOtp}
        />
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
