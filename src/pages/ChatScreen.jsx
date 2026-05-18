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

const STEPS = {
  GREET: 0,
  OPTIONS: 1,
  BOOKED: 2,
  DONE: 3,
};

// Phone frame is 390x844 with 44px corner radius.
// Chat panel height is user-draggable between MIN and MAX.
const FRAME_H = 844;
const SHEET_DEFAULT = Math.round(FRAME_H * 0.55);
const SHEET_MIN = 240;   // mostly video, small chat strip
const SHEET_MAX = 760;   // mostly chat, sliver of video for context

export default function ChatScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.GREET);
  const [chosen, setChosen] = useState(null);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [sheetH, setSheetH] = useState(SHEET_DEFAULT);
  const dragRef = useRef(null);
  const scrollRef = useRef(null);

  // Drag the handle to resize the sheet. Works for mouse + touch.
  const onHandleDown = (e) => {
    e.preventDefault();
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    const startH = sheetH;
    dragRef.current = { startY, startH };

    const move = (ev) => {
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const dy = y - startY;
      let next = startH - dy;
      if (next < SHEET_MIN) next = SHEET_MIN;
      if (next > SHEET_MAX) next = SHEET_MAX;
      setSheetH(next);
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  const videoH = FRAME_H - sheetH;

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
  const pickOption = (opt) => { setChosen(opt); advance(STEPS.BOOKED, 1100); };
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
      width: 390, height: FRAME_H,
      zIndex: 200, background: "#0c0c0e",
      borderRadius: 44, overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes chatBgFade { from{opacity:0; transform:scale(1.04)} to{opacity:1; transform:scale(1)} }
        @keyframes bubbleIn { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ───── TOP HALF: video / image ───── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: videoH,
        overflow: "hidden", background: "#000",
      }}>
        <img
          key={bgImg}
          src={bgImg}
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            animation: "chatBgFade .35s ease-out",
          }}
        />
        {/* Top dark shade so status bar / title are readable */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 130,
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }} />
        {/* Bottom shade where chat surfaces meet */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)",
        }} />

        {/* Progress + title + close */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 5, padding: "50px 16px 0" }}>
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
              fontSize: 15, fontWeight: 600, color: "#fff", flex: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
              letterSpacing: "-0.2px",
            }}>
              {titleText}
            </span>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(0,0,0,0.4)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <XIcon size={16} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ───── BOTTOM HALF: solid chat panel ───── */}
      <div style={{
        position: "absolute", top: videoH, left: 0, right: 0, bottom: 0,
        background: "#FBFAF7",
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: "0 -8px 24px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Drag handle, resizes sheet on drag */}
        <div
          onMouseDown={onHandleDown}
          onTouchStart={onHandleDown}
          style={{
            display: "flex", justifyContent: "center",
            padding: "10px 0 6px", flexShrink: 0,
            cursor: "ns-resize", touchAction: "none",
            userSelect: "none",
          }}
        >
          <div style={{
            width: 44, height: 5, borderRadius: 3,
            background: "#C9C4B5",
          }} />
        </div>

        {/* Messages list */}
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            flex: 1, overflowY: "auto",
            padding: "8px 14px 12px",
            display: "flex", flexDirection: "column", gap: 8,
          }}
        >
          <Bubble side="ai">
            Hi Aanya 👋 want to tweak today's experience? Pick a vibe or just ask.
          </Bubble>

          {step === STEPS.GREET && !typing && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 32 }}>
              <Chip onClick={askAdventure}>Something adventurous</Chip>
              <Chip onClick={askAdventure}>Quieter pace</Chip>
              <Chip onClick={askAdventure}>Add a beach</Chip>
            </div>
          )}

          {step >= STEPS.OPTIONS && (
            <Bubble side="user">Something adventurous instead</Bubble>
          )}
          {step >= STEPS.OPTIONS && !typing && (
            <Bubble side="ai">
              Got it. Two adventurous swaps for today, with cost and time difference:
            </Bubble>
          )}
          {step === STEPS.OPTIONS && !typing && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 32 }}>
              {OPTIONS.map(o => <OptionCard key={o.id} opt={o} onPick={() => pickOption(o)} />)}
            </div>
          )}

          {step >= STEPS.BOOKED && chosen && (
            <Bubble side="user">{chosen.name} ✓</Bubble>
          )}
          {step >= STEPS.BOOKED && chosen && !typing && (
            <BookingCard chosen={chosen} />
          )}
          {step === STEPS.BOOKED && !typing && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 32 }}>
              <Chip onClick={finish}>All good 🙌</Chip>
              <Chip onClick={() => {}}>View itinerary</Chip>
              <Chip onClick={undo}>Undo</Chip>
            </div>
          )}

          {step >= STEPS.DONE && !typing && (
            <Bubble side="ai">
              All set. Have a great day 🌴 Tap × any time to leave the chat.
            </Bubble>
          )}

          {typing && <TypingDots />}
        </div>

        {/* Input bar */}
        <div style={{
          padding: "10px 14px 18px",
          borderTop: `1px solid #ECE6D9`,
          background: "#FBFAF7",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fff",
            border: "1px solid #ECE6D9",
            borderRadius: 999,
            padding: "5px 5px 5px 14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
                fontFamily: "inherit", color: C.head,
                fontSize: 14, fontWeight: 400, padding: "8px 0",
              }}
            />

            <button
              aria-label="Voice input"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#F4EFE3", border: "1px solid #ECE6D9",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <Mic size={15} color={C.head} />
            </button>

            <button
              aria-label="Send"
              onClick={handleSend}
              disabled={step === STEPS.DONE}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: step === STEPS.DONE ? "#E5E1D6" : C.p600,
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: step === STEPS.DONE ? "default" : "pointer",
                flexShrink: 0,
                boxShadow: step === STEPS.DONE ? "none" : "0 4px 12px rgba(227,27,83,0.3)",
              }}
            >
              <ArrowUp size={15} color="#fff" />
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: "#9C9685", letterSpacing: "0.2px" }}>
            <Volume2 size={10} style={{ display: "inline-block", verticalAlign: "-1px", marginRight: 4 }} />
            Voice or text, replies are instant
          </div>
        </div>
      </div>

      {showHint && (
        <div style={{
          position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)",
          background: "rgba(20,20,22,0.92)", color: "#fff",
          fontSize: 12, fontWeight: 500,
          padding: "8px 14px", borderRadius: 999, zIndex: 10,
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
        alignSelf: "flex-end", maxWidth: "80%",
        background: C.p600, color: "#fff",
        padding: "9px 13px", borderRadius: 16, borderBottomRightRadius: 4,
        fontSize: 14, lineHeight: 1.4, letterSpacing: "-0.1px",
        boxShadow: "0 2px 8px rgba(227,27,83,0.22)",
        animation: "bubbleIn .25s ease-out",
      }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "bubbleIn .25s ease-out" }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 1px 4px rgba(227,27,83,0.3)",
      }}>
        <Sparkles size={12} color="#fff" fill="#fff" />
      </div>
      <div style={{
        maxWidth: "80%",
        background: "#F0EBE2",
        border: "1px solid #E5DECC",
        color: C.head,
        padding: "9px 13px", borderRadius: 16, borderBottomLeftRadius: 4,
        fontSize: 14, lineHeight: 1.45, letterSpacing: "-0.1px",
      }}>
        {children}
      </div>
    </div>
  );
}

function OptionCard({ opt, onPick }) {
  return (
    <button
      onClick={onPick}
      style={{
        position: "relative",
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        background: "#fff",
        border: opt.recommended ? `1.5px solid ${C.p600}` : "1px solid #ECE6D9",
        borderRadius: 14, padding: 10,
        cursor: "pointer", textAlign: "left",
        animation: "bubbleIn .25s ease-out",
        boxShadow: opt.recommended ? "0 4px 12px rgba(227,27,83,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
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
          boxShadow: "0 2px 6px rgba(227,27,83,0.35)",
        }}>
          <Star size={9} fill="#fff" /> Recommended for couples
        </div>
      )}

      <img src={opt.img} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.head, marginBottom: 3, letterSpacing: "-0.1px" }}>
          {opt.name}
        </div>
        <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.35, marginBottom: 6 }}>
          {opt.note}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: C.sub }}>
            <Clock size={10} /> {opt.time}
          </span>
          <span style={{ color: "#D9D5CC" }}>·</span>
          <span style={{ color: C.p600 }}>{opt.inc}</span>
        </div>
      </div>
    </button>
  );
}

function BookingCard({ chosen }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", animation: "bubbleIn .25s ease-out" }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 1px 4px rgba(227,27,83,0.3)",
      }}>
        <Sparkles size={12} color="#fff" fill="#fff" />
      </div>
      <div style={{
        maxWidth: "82%",
        background: "#fff",
        border: "1px solid #ECE6D9",
        borderRadius: 16, borderBottomLeftRadius: 4,
        padding: "12px 14px",
        color: C.head,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "#1FB36F",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(31,179,111,0.35)",
          }}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px" }}>
            Booked, {chosen.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: C.sub, marginBottom: 8 }}>
          <Row label="Pickup">8:30 AM, same as before</Row>
          <Row label="Duration">{chosen.time}</Row>
          <Row label="Includes">Safety gear, guide, photos</Row>
          <Row label="Added">{chosen.inc} to trip total</Row>
        </div>

        <div style={{ fontSize: 12, lineHeight: 1.4, color: C.head }}>
          Replaces Handara Gate visit. Anything else you want to tweak?
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ width: 70, opacity: 0.65, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, fontWeight: 600, color: C.head }}>{children}</span>
    </div>
  );
}

function Chip({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${C.p300}`,
        color: C.p600,
        fontSize: 12, fontWeight: 600,
        padding: "6px 12px", borderRadius: 999, cursor: "pointer",
        animation: "bubbleIn .25s ease-out",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
        width: 24, height: 24, borderRadius: "50%",
        background: "linear-gradient(135deg, #FEA3B4 0%, #E31B53 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Sparkles size={12} color="#fff" fill="#fff" />
      </div>
      <div style={{
        background: "#F0EBE2",
        border: "1px solid #E5DECC",
        padding: "10px 14px", borderRadius: 16, borderBottomLeftRadius: 4,
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%", background: C.p600,
              animation: `dotPulse 1.2s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
