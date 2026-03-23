import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X as XIcon } from "lucide-react";
import { C, destinations } from "../data";

const funLines = [
  "Meanwhile, your dream beach is warming up the sand for you...",
  "Fun fact: Couples who travel together stay together \u{1F495}",
  "Your sunset dinner table in Bali is almost ready...",
  "Pack your bags mentally while we verify this...",
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

const IlloName = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFE4E8"/>
    <circle cx="33" cy="34" r="7" stroke="#E31B53" strokeWidth="2" fill="#fff"/>
    <path d="M23 52c0-6 4-10 10-10s10 4 10 10" stroke="#E31B53" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="49" cy="34" r="7" stroke="#FEA3B4" strokeWidth="2" fill="#fff"/>
    <path d="M39 52c0-6 4-10 10-10s10 4 10 10" stroke="#FEA3B4" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M38 26l3-4 3 4" stroke="#E31B53" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M41 22v-1" stroke="#E31B53" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IlloDest = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFE4E8"/>
    <path d="M40 22c-6.6 0-12 5.4-12 12 0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z" stroke="#E31B53" strokeWidth="2" fill="#fff"/>
    <circle cx="40" cy="34" r="5" fill="#FEA3B4"/>
    <circle cx="40" cy="34" r="2" fill="#E31B53"/>
    <circle cx="56" cy="26" r="2" fill="#FEA3B4" opacity="0.6"/>
    <circle cx="24" cy="30" r="1.5" fill="#FEA3B4" opacity="0.6"/>
    <circle cx="54" cy="46" r="1.5" fill="#FEA3B4" opacity="0.4"/>
  </svg>
);

const IlloTravel = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFE4E8"/>
    <path d="M16 52l14-20 10 10 8-14 16 24H16z" fill="#FEA3B4" opacity="0.3"/>
    <path d="M16 52l14-20 10 10 8-14 16 24" stroke="#E31B53" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <path d="M48 28l8-6 4 2-6 8-4 0z" fill="#E31B53"/>
    <path d="M42 28l6-4" stroke="#FEA3B4" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="32" cy="48" r="3" fill="#fff" stroke="#E31B53" strokeWidth="1.5"/>
    <circle cx="38" cy="48" r="3" fill="#fff" stroke="#FEA3B4" strokeWidth="1.5"/>
  </svg>
);

const IlloConfirm = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#ECFDF3"/>
    <circle cx="40" cy="40" r="20" stroke="#039855" strokeWidth="2.5" fill="none"/>
    <path d="M30 40l7 7 13-14" stroke="#039855" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const destNames = ["Bali", "Vietnam", "Thailand", "Maldives", "Sri Lanka", "New Zealand"];

export default function Plan() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselectedDest = params.get("dest") || "";

  // phase: "phone" | "otp" | 0 | 1 | 2 | 3
  const [phase, setPhase] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [dests, setDests] = useState(preselectedDest ? [preselectedDest] : []);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const funLine = useMemo(() => funLines[Math.floor(Math.random() * funLines.length)], []);

  const isWizard = typeof phase === "number";
  const wizardStep = isWizard ? phase : -1;

  const goNext = () => {
    if (phase === "phone") setPhase("otp");
    else if (phase === "otp") setPhase(0);
    else if (typeof phase === "number" && phase < 3) setPhase(phase + 1);
  };

  const goBack = () => {
    if (phase === "otp") setPhase("phone");
    else if (phase === "phone") navigate(-1);
    else if (typeof phase === "number" && phase > 0) setPhase(phase - 1);
  };

  const toggleDest = (d) => setDests(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  // Determine CTA state
  let ctaLabel = "";
  let ctaEnabled = false;
  if (phase === "phone") { ctaLabel = "Send OTP"; ctaEnabled = phone.length === 10; }
  else if (phase === "otp") { ctaLabel = "Verify"; ctaEnabled = otp.every(d => d); }
  else if (phase === 0) { ctaLabel = "Continue"; ctaEnabled = name.trim().length > 0; }
  else if (phase === 1) { ctaLabel = "Continue"; ctaEnabled = dests.length > 0; }
  else if (phase === 2) { ctaLabel = "Submit"; ctaEnabled = true; }
  else if (phase === 3) { ctaLabel = "Explore Itineraries"; ctaEnabled = true; }

  const ctaAction = () => {
    if (phase === 3) {
      navigate(dests.length > 0 ? `/listing?dest=${dests[0]}` : "/");
    } else {
      goNext();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 700, background: C.white }}>
      {/* Top bar: back + step label + close */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px 0" }}>
        {phase !== 3 ? (
          <button onClick={goBack} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={17} color={C.head} />
          </button>
        ) : <div style={{ width: 34 }} />}
        {isWizard && !phase !== 3 && (
          <span style={{ fontSize: 11, color: C.inact }}>Step {wizardStep + 1} of 4</span>
        )}
        {phase !== 3 ? (
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, borderRadius: 12, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <XIcon size={16} color={C.sub} />
          </button>
        ) : <div style={{ width: 34 }} />}
      </div>

      {/* Segmented progress bar (wizard only) */}
      {isWizard && (
        <div style={{ display: "flex", gap: 4, padding: "8px 20px 0" }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= wizardStep ? C.p600 : C.div, transition: "background 0.4s ease" }} />
          ))}
        </div>
      )}

      {/* Top half: Illustration + Title + Subtitle */}
      <div key={phase} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
        <div style={{ animation: "scaleIn 0.3s ease-out" }}>
          {phase === "phone" && <IlloPhone />}
          {phase === "otp" && <IlloOtp />}
          {phase === 0 && <IlloName />}
          {phase === 1 && <IlloDest />}
          {phase === 2 && <IlloTravel />}
          {phase === 3 && <IlloConfirm />}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.head, marginTop: 16, animation: "fadeUp 0.3s ease-out 0.08s both" }}>
          {phase === "phone" && "Let's plan your getaway"}
          {phase === "otp" && "Verify your number"}
          {phase === 0 && "What should we call you?"}
          {phase === 1 && `Where to, ${name.trim() || "traveller"}?`}
          {phase === 2 && "Who's travelling?"}
          {phase === 3 && `You're all set, ${name.trim() || ""}!`}
        </h2>
        <p style={{ fontSize: 13, color: C.sub, marginTop: 6, lineHeight: "19px", animation: "fadeUp 0.3s ease-out 0.08s both" }}>
          {phase === "phone" && "Your number helps our travel consultant reach you with a personalised itinerary"}
          {phase === "otp" && `Code sent to +91 ${phone}`}
          {phase === 0 && "So we can make your trip feel personal"}
          {phase === 1 && "Pick one or more — we'll curate for each"}
          {phase === 2 && "Tell us about your travel party"}
          {phase === 3 && (<>We're crafting itineraries for {dests.join(" & ")}.<br />Our travel consultant will connect shortly.</>)}
        </p>
        {phase === "otp" && (
          <p style={{ fontSize: 12, color: C.p600, fontStyle: "italic", marginTop: 10, lineHeight: "17px", animation: "fadeUp 0.3s ease-out 0.12s both" }}>
            {funLine}
          </p>
        )}
      </div>

      {/* Bottom half: Inputs + CTA */}
      <div style={{ padding: "0 20px 40px", animation: "fadeUp 0.3s ease-out 0.12s both" }} key={`input-${phase}`}>
        {/* PHONE INPUT */}
        {phase === "phone" && (
          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${phone.length === 10 ? "#027A48" : C.div}`, borderRadius: 14, padding: "0 14px", height: 52, background: "#FAFAFA", transition: "border 0.2s" }}>
            <span style={{ fontSize: 15, color: C.head, marginRight: 10 }}>+91</span>
            <div style={{ width: 1, height: 22, background: C.div, marginRight: 10 }} />
            <input
              type="tel" maxLength={10} placeholder="Mobile number" autoFocus
              value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              style={{ flex: 1, fontSize: 15, color: C.head, background: "transparent", border: "none", outline: "none", fontFamily: "inherit" }}
            />
            {phone.length === 10 && <Check size={16} color="#027A48" />}
          </div>
        )}

        {/* OTP INPUT */}
        {phase === "otp" && (
          <>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12 }}>
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i} type="tel" maxLength={1} autoFocus={i === 0}
                  value={otp[i]}
                  style={{
                    width: 56, height: 60, borderRadius: 14, textAlign: "center",
                    fontSize: 22, fontWeight: 600, color: C.head, fontFamily: "inherit",
                    border: `1.5px solid ${otp[i] ? C.p600 : C.div}`,
                    background: otp[i] ? "#FFE4E844" : "#FAFAFA",
                    outline: "none",
                  }}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    const next = [...otp]; next[i] = val;
                    setOtp(next);
                    if (val && e.target.nextElementSibling) e.target.nextElementSibling.focus();
                  }}
                  onKeyDown={e => {
                    if (e.key === "Backspace" && !otp[i] && e.target.previousElementSibling) e.target.previousElementSibling.focus();
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* NAME INPUT */}
        {phase === 0 && (
          <input
            type="text" placeholder="Your first name" autoFocus
            value={name} onChange={e => setName(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14,
              border: `1.5px solid ${name.trim() ? "#027A48" : C.div}`,
              fontSize: 15, color: C.head, background: "#FAFAFA",
              outline: "none", fontFamily: "inherit", transition: "border 0.2s",
            }}
          />
        )}

        {/* DESTINATION GRID */}
        {phase === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 230, overflowY: "auto" }} className="hide-scrollbar">
            {destNames.map(d => {
              const sel = dests.includes(d);
              return (
                <button key={d} onClick={() => toggleDest(d)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 10px", borderRadius: 14, cursor: "pointer",
                  fontSize: 13, fontWeight: sel ? 600 : 500,
                  color: sel ? C.p600 : C.sub,
                  background: sel ? C.p100 : "#FAFAFA",
                  border: `1.5px solid ${sel ? C.p600 : C.div}`,
                  transition: "all 0.15s", fontFamily: "inherit",
                }}>
                  {sel && <Check size={14} color={C.p600} strokeWidth={2.5} />}
                  {d}
                </button>
              );
            })}
          </div>
        )}

        {/* TRAVELERS STEPPER */}
        {phase === 2 && (
          <div>
            {[
              { label: "Adults", sub: "Age 12+", val: adults, set: setAdults, min: 1 },
              { label: "Children", sub: "Age 2–11", val: children, set: setChildren, min: 0 },
            ].map((item, idx) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: idx === 0 ? `1px solid ${C.div}` : "none" }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.head, margin: 0 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: C.sub, margin: 0 }}>{item.sub}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => item.set(v => Math.max(item.min, v - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${C.div}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: C.head, fontFamily: "inherit" }}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 600, color: C.head, minWidth: 20, textAlign: "center" }}>{item.val}</span>
                  <button onClick={() => item.set(v => v + 1)} style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${C.div}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: C.head, fontFamily: "inherit" }}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONFIRMATION SUMMARY */}
        {phase === 3 && (
          <div style={{ background: "#FAFAFA", borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
            {[
              { label: "Name", value: name },
              { label: "Phone", value: `+91 ${phone}` },
              { label: "Destinations", value: dests.join(", ") },
              { label: "Travellers", value: `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}` },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.div}44` : "none" }}>
                <span style={{ fontSize: 12, color: C.sub }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA BUTTON */}
        <button
          onClick={ctaAction}
          disabled={!ctaEnabled}
          style={{
            width: "100%", marginTop: phase === "phone" || phase === 0 ? 20 : 16,
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

        {/* OTP resend */}
        {phase === "otp" && (
          <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.sub }}>
            Didn't receive? <span style={{ fontWeight: 600, color: C.p600, cursor: "pointer" }}>Resend in 28s</span>
          </p>
        )}
      </div>
    </div>
  );
}
