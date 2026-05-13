import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X as XIcon, Mic, ArrowUp, Sparkles, Check, Volume2, Star, Clock } from "lucide-react";
import { C } from "../data";

const CDN = "https://cdn.30sundays.club/app_content";

// Backdrop video poster (currently displayed experience).
const CURRENT = {
  name: "Handara Gate",
  img: `${CDN}/bali/handara_gate_63.jpg`,
};

// Two adventurous swap options with incremental price + time.
// ATV is flagged "recommended for couples".
// Posters use Unsplash for activity-specific imagery (no ATV/rafting in CDN yet).
const OPTIONS = [
  {
    id: "atv",
    name: "ATV Quad Adventure",
    inc: "+₹3,200",
    time: "2 hrs",
    recommended: true,
    note: "Easy ride, scenic photo stops, perfect for couples",
    img: "/atv-bali.jpg",
  },
  {
    id: "raft",
    name: "White Water Rafting",
    inc: "+₹4,800",
    time: "4 hrs",
    recommended: false,
    note: "Bigger thrill, half-day, wetter ride",
    img: `${CDN}/bali/banyumala_waterfall_56.jpg`,
  },
];

// Step machine for the demo conversation.
const STEPS = {
  GREET: 0,    // AI greeting + suggestion chips
  OPTIONS: 1,  // 2 swap cards with recommendation
  BOOKED: 2,   // confirmation + reply chips
  DONE: 3,     // sign-off
};

export default function ChatScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.GREET);
  const [chosen, setChosen] = useState(null);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef(null);

  // Background crossfades to chosen activity after booking.
  const bgImg = chosen ? chosen.img : CURRENT.img;
  const titleText = chosen ? chosen.name : CURRENT.name;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [step, typing]);

  const advance = (next, delay = 900) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); setStep(next); }, delay);
  };

  const askAdventure = () => {
    if (step !== STEPS.GREET) return;
    advance(STEPS.OPTIONS);
  };

  const pickOption = (opt) => {
    setChosen(opt);
    advance(STEPS.BOOKED, 1100);
  };

  const finish = () => {
    advance(STEPS.DONE, 700);
    setTimeout(() => setShowHint(true), 1500);
  };

  const undo = () => { setChosen(null); setStep(STEPS.GREET); };

  const handleSend = () => {
    setInput("");
    if (step === STEPS.GREET) askAdventure();
    else if (step === STEPS.BOOKED) finish();
  };

  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      width: 390, height: 844,
      zIndex: 200, background: "#000",
      borderRadius: 44, overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Background image, crossfade on swap */}
      <img
        key={bgImg}
        src={bgImg}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          animation: "chatBgFade .35s ease-out",
        }}
      />

      {/* Top + bottom gradients for legibility */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 130,
        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
        zIndex: 2,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.85) 100%)",
        zIndex: 2,
      }} />

      <style>{`
        @keyframes chatBgFade { from{opacity:0; transform:scale(1.04)} to{opacity:1; transform:scale(1)} }
        @keyframes bubbleIn { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* TOP bar */}
      <div style={{ position: "relative", zIndex: 5, padding: "50px 16px 0" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 8, background: "rgba(255,255,255,0.5)", overflow: "hidden" }}>
            <div style={{
              width: `${(step / (Object.keys(STEPS).length - 1)) * 100}%`,
              height: "100%", background: "#fff", transition: "width .3s",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{
            fontSize: 14, fontWeight: 400, color: "#fff", flex: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}>
            {titleText}
          </span>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(0,0,0,0.4)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <XIcon size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          position: "absolute", left: 0, right: 0, top: 100, bottom: 110,
          overflowY: "auto", padding: "12px 14px 12px",
          display: "flex", flexDirection: "column", gap: 10,
          zIndex: 4,
        }}
      >
        <div style={{ flex: 1 }} />

        {/* Greeting */}
        <Bubble side="ai">
          Hi Aanya 👋 want to tweak today's experience? Pick a vibe or just ask.
        </Bubble>

        {/* Greeting chips, inline so they don't overlap input */}
        {step === STEPS.GREET && !typing && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: 36 }}>
            <Chip onClick={askAdventure}>Something adventurous</Chip>
            <Chip onClick={askAdventure}>Quieter pace</Chip>
            <Chip onClick={askAdventure}>Add a beach</Chip>
          </div>
        )}

        {/* User picked adventurous */}
        {step >= STEPS.OPTIONS && (
          <Bubble side="user">Something adventurous instead</Bubble>
        )}

        {/* AI option cards */}
        {step >= STEPS.OPTIONS && !typing && (
          <Bubble side="ai">
            Got it. Two adventurous swaps for today, with cost and time difference:
          </Bubble>
        )}
        {step === STEPS.OPTIONS && !typing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginLeft: 36 }}>
            {OPTIONS.map(o => (
              <OptionCard key={o.id} opt={o} onPick={() => pickOption(o)} />
            ))}
          </div>
        )}

        {/* User picked */}
        {step >= STEPS.BOOKED && chosen && (
          <Bubble side="user">{chosen.name} ✓</Bubble>
        )}

        {/* Booking confirmation */}
        {step >= STEPS.BOOKED && chosen && !typing && (
          <BookingCard chosen={chosen} />
        )}

        {/* Reply chips */}
        {step === STEPS.BOOKED && !typing && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: 36 }}>
            <Chip onClick={finish}>All good 🙌</Chip>
            <Chip onClick={() => {}}>View itinerary</Chip>
            <Chip onClick={undo}>Undo</Chip>
          </div>
        )}

        {/* Sign-off */}
        {step >= STEPS.DONE && !typing && (
          <Bubble side="ai">
            All set. Have a great day 🌴 Tap × any time to leave the chat.
          </Bubble>
        )}

        {typing && <TypingDots />}
      </div>

      {/* INPUT BAR */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 22px", zIndex: 6 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.16)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: 999,
          padding: "6px 6px 6px 14px",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), " +
            "0 8px 24px rgba(0,0,0,0.28)",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={
              step === STEPS.GREET ? "Or type to ask anything"
              : step === STEPS.OPTIONS ? "Or describe what you want"
              : step === STEPS.BOOKED ? "Say 'all good' or ask more"
              : "Chat closed, tap × to leave"
            }
            disabled={step === STEPS.DONE}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: "inherit", color: "#fff",
              fontSize: 14, fontWeight: 400, padding: "8px 0",
            }}
          />

          <button
            aria-label="Voice input"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <Mic size={16} color="#fff" />
          </button>

          <button
            aria-label="Send"
            onClick={handleSend}
            disabled={step === STEPS.DONE}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: step === STEPS.DONE ? "rgba(255,255,255,0.12)" : C.p600,
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: step === STEPS.DONE ? "default" : "pointer",
              flexShrink: 0,
              boxShadow: step === STEPS.DONE ? "none" : "0 4px 14px rgba(227,27,83,0.4)",
            }}
          >
            <ArrowUp size={16} color="#fff" />
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.2px" }}>
          <Volume2 size={10} style={{ display: "inline-block", verticalAlign: "-1px", marginRight: 4 }} />
          Voice or text, replies are instant
        </div>
      </div>

      {showHint && (
        <div style={{
          position: "absolute", top: 110, left: "50%", transform: "translateX(-50%)",
          background: "rgba(20,20,22,0.9)", color: "#fff",
          fontSize: 12, fontWeight: 500,
          padding: "8px 14px", borderRadius: 999, zIndex: 7,
          animation: "bubbleIn .3s ease-out",
        }}>
          <Check size={12} style={{ display: "inline-block", verticalAlign: "-1px", marginRight: 5 }} />
          Booking confirmed
        </div>
      )}
    </div>
  );
}

// ─── Building blocks ───

function Bubble({ side, children }) {
  if (side === "user") {
    return (
      <div style={{
        alignSelf: "flex-end", maxWidth: "78%",
        background: C.p600, color: "#fff",
        padding: "9px 14px", borderRadius: 18, borderBottomRightRadius: 6,
        fontSize: 14, lineHeight: 1.4, letterSpacing: "-0.1px",
        boxShadow: "0 6px 18px rgba(227,27,83,0.32)",
        animation: "bubbleIn .25s ease-out",
      }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "bubbleIn .25s ease-out" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 2px 8px rgba(227,27,83,0.35)",
      }}>
        <Sparkles size={13} color="#fff" fill="#fff" />
      </div>
      <div style={{
        maxWidth: "78%",
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.22)",
        color: "#fff",
        padding: "9px 14px", borderRadius: 18, borderBottomLeftRadius: 6,
        fontSize: 14, lineHeight: 1.45, letterSpacing: "-0.1px",
      }}>
        {children}
      </div>
    </div>
  );
}

// Adventurous-swap option card with price increment, time, recommendation badge.
function OptionCard({ opt, onPick }) {
  return (
    <button
      onClick={onPick}
      style={{
        position: "relative",
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        background: opt.recommended ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: opt.recommended ? `1.5px solid ${C.p300}` : "1px solid rgba(255,255,255,0.22)",
        borderRadius: 16, padding: 10,
        cursor: "pointer", textAlign: "left",
        animation: "bubbleIn .25s ease-out",
        boxShadow: opt.recommended ? `0 4px 18px rgba(254,163,180,0.25)` : "none",
      }}
    >
      {opt.recommended && (
        <div style={{
          position: "absolute", top: -8, left: 12,
          display: "inline-flex", alignItems: "center", gap: 4,
          background: C.p600, color: "#fff",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.6px",
          padding: "3px 8px", borderRadius: 999,
          textTransform: "uppercase",
          boxShadow: "0 2px 8px rgba(227,27,83,0.45)",
        }}>
          <Star size={9} fill="#fff" /> Recommended for couples
        </div>
      )}

      <img src={opt.img} alt="" style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3, letterSpacing: "-0.1px" }}>
          {opt.name}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1.35, marginBottom: 6 }}>
          {opt.note}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "#fff", fontWeight: 600 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Clock size={10} /> {opt.time}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: C.p300 }}>{opt.inc}</span>
        </div>
      </div>
    </button>
  );
}

// Booking confirmation card shown after pick.
function BookingCard({ chosen }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "bubbleIn .25s ease-out" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 2px 8px rgba(227,27,83,0.35)",
      }}>
        <Sparkles size={13} color="#fff" fill="#fff" />
      </div>
      <div style={{
        maxWidth: "82%",
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 18, borderBottomLeftRadius: 6,
        padding: "12px 14px",
        color: "#fff",
      }}>
        {/* Confirmation header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "#1FB36F",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(31,179,111,0.4)",
          }}>
            <Check size={13} color="#fff" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px" }}>
            Booked, {chosen.name}
          </span>
        </div>

        {/* Details rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 8 }}>
          <Row label="Pickup">8:30 AM, same as before</Row>
          <Row label="Duration">{chosen.time}</Row>
          <Row label="Includes">Safety gear, guide, photos</Row>
          <Row label="Added">{chosen.inc} to trip total</Row>
        </div>

        <div style={{ fontSize: 12, lineHeight: 1.4, color: "rgba(255,255,255,0.9)" }}>
          Replaces Handara Gate visit. Anything else you want to tweak?
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ width: 72, opacity: 0.65, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function Chip({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "#fff",
        fontSize: 12, fontWeight: 600,
        padding: "7px 12px", borderRadius: 999, cursor: "pointer",
        animation: "bubbleIn .25s ease-out",
      }}
    >
      {children}
    </button>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Sparkles size={13} color="#fff" fill="#fff" />
      </div>
      <div style={{
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.22)",
        padding: "10px 14px", borderRadius: 18, borderBottomLeftRadius: 6,
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%", background: "#fff",
              animation: `dotPulse 1.2s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
