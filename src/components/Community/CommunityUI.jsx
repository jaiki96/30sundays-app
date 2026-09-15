import { useState, useRef, useEffect } from "react";
import {
  BadgeCheck, Heart, Link2, Bookmark, CornerUpLeft, Lock, Pin, ChevronRight,
  MessageCircle, ImagePlus, X as XIcon, Check, ArrowLeft, SendHorizontal,
} from "lucide-react";
import { C } from "../../data";
import { ago } from "../../data/communityData";

// Community's own pieces. The screen chrome (Screen, Body, TopBar, Sheet,
// Primary, Secondary, Field, Input, Textarea) comes from the gift kit, which
// already matches the app, so none of that is rebuilt here.

// The brief's grid: 16px screen padding, 8px rhythm, 16px card radius.
export const PAD = 16;
export const CARD = {
  background: C.white, borderRadius: 16, border: `1px solid ${C.div}`,
};

// ── Couple identity ──

// Initials of both halves, so a couple reads as a couple at a glance.
export function CoupleMark({ couple, ops, size = 36 }) {
  if (ops) {
    return (
      <span style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        background: C.p100, display: "grid", placeItems: "center",
      }}>
        <BadgeCheck size={size * 0.52} color={C.p600} />
      </span>
    );
  }
  const parts = String(couple || "").split("&").map(s => s.trim()).filter(Boolean);
  const initials = parts.map(p => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: C.p100, display: "grid", placeItems: "center",
      fontSize: size * 0.34, fontWeight: 700, color: C.p900, letterSpacing: "0.2px",
    }}>{initials}</span>
  );
}

// The stamp is the whole point of an answer: it says where they actually went.
export function TripStamp({ stamp, ops, style }) {
  if (ops) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: C.p100, border: `1px solid ${C.p300}`, borderRadius: 999,
        padding: "3px 9px", fontSize: 11, fontWeight: 700, color: C.p900, ...style,
      }}>
        <BadgeCheck size={12} color={C.p600} /> 30 Sundays team
      </span>
    );
  }
  if (!stamp) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#ECFDF3", border: "1px solid #B7E3CB", borderRadius: 999,
      padding: "3px 9px", fontSize: 11, fontWeight: 600, color: "#027A48", ...style,
    }}>
      <BadgeCheck size={12} color="#027A48" /> Went to {stamp.destination}, {stamp.month}
    </span>
  );
}

export function AuthorLine({ author, minsAgo, showCity = true }) {
  const ops = !!author?.ops;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <CoupleMark couple={author?.couple} ops={ops} size={34} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontSize: 14, fontWeight: 700, color: ops ? C.p900 : C.head, margin: 0,
          display: "flex", alignItems: "center", gap: 5,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {author?.couple}
          {ops && <BadgeCheck size={14} color={C.p600} />}
        </p>
        <p style={{ fontSize: 12, color: C.sub, margin: "1px 0 0" }}>
          {showCity && author?.city ? `${author.city} · ` : ""}{ago(minsAgo)}
        </p>
      </div>
    </div>
  );
}

// ── Pinned rows ──

export function PinnedRow({ icon: Icon = Pin, title, desc, locked, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 48,
      padding: "14px 16px", background: C.white, border: "none", borderBottom: `1px solid ${C.div}`,
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, background: C.p100, flexShrink: 0,
        display: "grid", placeItems: "center",
      }}><Icon size={16} color={C.p600} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: C.head }}>{title}</span>
          {locked && <Lock size={12} color={C.inact} />}
        </span>
        <span style={{
          display: "block", fontSize: 12.5, color: C.sub, marginTop: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{desc}</span>
      </span>
      <ChevronRight size={17} color={C.inact} />
    </button>
  );
}

/* ═══════════ Screen furniture, matching the itinerary screen ═══════════ */

// A 6px full bleed grey bar is how that screen separates sections. No card
// wrapper, no tint, just a gap you can see.
export function SectionBar({ margin = "20px 0" }) {
  return <div style={{ height: 6, background: C.bg, margin }} />;
}

export function SectionHead({ children, right, style }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      gap: 10, padding: `0 ${PAD}px`, marginBottom: 12, ...style,
    }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.1px" }}>
        {children}
      </h2>
      {right && <span style={{ fontSize: 11, color: C.sub }}>{right}</span>}
    </div>
  );
}

export function Kicker({ children, style }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase",
      color: C.sub, margin: 0, ...style,
    }}>{children}</p>
  );
}

// Photo first, like every other surface in the app that sells a place.
export function Hero({ image, kicker, title, sub, onBack, pill, height = 200 }) {
  return (
    <div style={{ position: "relative", height }}>
      <img src={image} alt="" className="ken-burns" style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.34) 0%, transparent 42%, rgba(0,0,0,0.78) 100%)",
      }} />
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
          border: "none", cursor: "pointer", display: "grid", placeItems: "center",
        }}><ArrowLeft size={19} color="#fff" /></button>
      )}
      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 14 }}>
        {kicker && (
          <p style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase",
            color: "rgba(255,255,255,0.86)", margin: "0 0 5px",
          }}>{kicker}</p>
        )}
        <h1 style={{
          fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, lineHeight: "29px",
          letterSpacing: "-0.4px", textShadow: "0 1px 12px rgba(0,0,0,0.35)",
        }}>{title}</h1>
        {sub && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", margin: "5px 0 0" }}>{sub}</p>
        )}
        {pill && <div style={{ marginTop: 12 }}>{pill}</div>}
      </div>
    </div>
  );
}

// Frosted pill that sits on a photo.
export function GlassPill({ icon: Icon, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, minHeight: 36, padding: "0 15px",
      borderRadius: 999, background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
      cursor: onClick ? "pointer" : "default", fontFamily: "inherit",
      fontSize: 12.5, fontWeight: 700, color: "#fff",
    }}>
      {Icon && <Icon size={14} color="#fff" />}
      {children}
    </button>
  );
}

// Who is in the group, as faces rather than a number on its own.
export function AvatarStack({ people, extra, size = 30 }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {people.map((p, i) => (
        <span key={p.couple} style={{ marginLeft: i ? -10 : 0, borderRadius: "50%", border: `2px solid ${C.white}` }}>
          <CoupleMark couple={p.couple} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span style={{
          marginLeft: -10, width: size, height: size, borderRadius: "50%",
          border: `2px solid ${C.white}`, background: C.head, color: "#fff",
          display: "grid", placeItems: "center", fontSize: size * 0.3, fontWeight: 700,
        }}>+{extra}</span>
      )}
    </div>
  );
}

// The sticky foot of the itinerary screen: what this is on the left, the one
// pink action on the right.
export function ActionBar({ title, caption, label, icon: Icon, onClick }) {
  return (
    <div style={{
      flexShrink: 0, borderTop: `1px solid ${C.div}`,
      background: "rgba(255,255,255,0.97)", backdropFilter: "blur(10px)",
      padding: `10px ${PAD}px calc(12px + env(safe-area-inset-bottom))`,
      display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between",
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.head }}>{title}</p>
        {caption && <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{caption}</p>}
      </div>
      <button onClick={onClick} style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 7, minHeight: 48,
        padding: "0 20px", borderRadius: 999, border: "none", cursor: "pointer",
        fontFamily: "inherit", fontSize: 14.5, fontWeight: 700,
        background: C.p600, color: "#fff", boxShadow: "0 4px 16px rgba(227,27,83,0.3)",
      }}>
        {Icon && <Icon size={17} />} {label}
      </button>
    </div>
  );
}

// ── A question in the feed ──

export function QuestionCard({ q, answerCount, solved, onClick }) {
  const lastActivity = answerCount > 0
    ? Math.min(q.minsAgo, ...(q.answers || []).map(a => a.minsAgo ?? q.minsAgo))
    : q.minsAgo;
  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
      padding: "14px 14px 12px", background: C.white, borderRadius: 14,
      border: `1px solid ${C.div}`, boxShadow: "0 1px 4px rgba(24,30,76,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <p style={{
          flex: 1, fontSize: 15.5, fontWeight: 700, color: C.head, margin: 0,
          lineHeight: "21px", letterSpacing: "-0.15px",
        }}>{q.title}</p>
        {solved && (
          <span style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2,
            background: "#ECFDF3", border: "1px solid #B7E3CB", borderRadius: 999,
            padding: "2px 8px", fontSize: 10, fontWeight: 800, color: "#027A48",
            letterSpacing: "0.3px", textTransform: "uppercase",
          }}><Check size={10} strokeWidth={3} /> Solved</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
        <CoupleMark couple={q.author?.couple} ops={q.author?.ops} size={20} />
        <span style={{
          fontSize: 12.5, color: C.sub, flex: 1, minWidth: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{q.mine ? "You both" : q.author?.couple}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px",
          borderRadius: 999, background: answerCount ? C.p100 : C.bg,
          fontSize: 11.5, fontWeight: 700, color: answerCount ? C.p900 : C.inact,
        }}>
          <MessageCircle size={11} /> {answerCount}
        </span>
        <span style={{ fontSize: 11.5, color: C.inact }}>{ago(lastActivity)}</span>
      </div>
    </button>
  );
}

// ── An answer ──

// A quote sits above the answer with the original author named, so a reply to
// one line of a long thread still makes sense on its own.
export function QuoteBlock({ quote }) {
  if (!quote) return null;
  return (
    <div style={{
      borderLeft: `3px solid ${C.p300}`, background: C.bg, borderRadius: "0 8px 8px 0",
      padding: "8px 12px", margin: "0 0 10px",
    }}>
      <p style={{ fontSize: 11.5, fontWeight: 700, color: C.p900, margin: 0 }}>
        {quote.author?.couple || quote.author}
      </p>
      <p style={{ fontSize: 13, color: C.sub, margin: "3px 0 0", lineHeight: "18px", fontStyle: "italic" }}>
        &ldquo;{quote.text}&rdquo;
      </p>
    </div>
  );
}

// Exactly four actions, the same four everywhere.
export function PostActions({ liked, likes, bookmarked, onLike, onCopy, onBookmark, onReply }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
      <Action icon={Heart} label={likes > 0 ? String(likes) : "Like"} active={liked} fill={liked} onClick={onLike} />
      <Action icon={Link2} label="Copy link" onClick={onCopy} />
      <Action icon={Bookmark} label="Save" active={bookmarked} fill={bookmarked} onClick={onBookmark} />
      <Action icon={CornerUpLeft} label="Reply" onClick={onReply} />
    </div>
  );
}

function Action({ icon: Icon, label, active, fill, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
      minHeight: 48, padding: "0 10px", background: "none", border: "none",
      cursor: "pointer", fontFamily: "inherit",
      fontSize: 12.5, fontWeight: 600, color: active ? C.p600 : C.sub,
    }}>
      <Icon size={16} color={active ? C.p600 : C.sub} fill={fill ? C.p600 : "none"} />
      {label}
    </button>
  );
}

export function AnswerCard({ answer, accepted, liked, bookmarked, onLike, onCopy, onBookmark, onReply }) {
  const ops = !!answer.author?.ops;
  return (
    <div style={{
      ...CARD,
      padding: 16,
      borderColor: accepted ? "#B7E3CB" : C.div,
      background: accepted ? "#F6FEF9" : C.white,
    }}>
      {accepted && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "#ECFDF3", border: "1px solid #B7E3CB", borderRadius: 999,
            padding: "3px 10px", fontSize: 10.5, fontWeight: 800, color: "#027A48",
            letterSpacing: "0.4px", textTransform: "uppercase",
          }}><Check size={11} strokeWidth={3} /> Answered</span>
        </div>
      )}
      <AuthorLine author={answer.mine ? { ...answer.author, couple: "You both" } : answer.author} minsAgo={answer.minsAgo} />
      {!ops && answer.author?.stamp && (
        <div style={{ marginTop: 10 }}>
          <TripStamp stamp={answer.author.stamp} />
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <QuoteBlock quote={answer.quotes} />
        <p style={{ fontSize: 14.5, color: C.head, margin: 0, lineHeight: "22px" }}>{answer.body}</p>
        {answer.image && (
          <img src={answer.image} alt="" style={{
            width: "100%", borderRadius: 12, marginTop: 12, display: "block",
          }} />
        )}
      </div>
      <PostActions
        liked={liked} likes={(answer.likes || 0) + (liked ? 1 : 0)} bookmarked={bookmarked}
        onLike={onLike} onCopy={onCopy} onBookmark={onBookmark} onReply={onReply}
      />
    </div>
  );
}

// ── Cohort chat ──

export function ChatBubble({ msg }) {
  const ops = !!msg.author?.ops;
  const mine = !!msg.mine;

  // An ops checkpoint is the thing people scroll back for, so it gets a card
  // of its own rather than a bubble in the run of chat.
  if (ops) {
    return (
      <div style={{
        ...CARD, borderColor: C.p300, background: "#FFF8FA", padding: 16, margin: "8px 0",
      }}>
        <TripStamp ops />
        {msg.title && (
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: "10px 0 0", letterSpacing: "-0.1px" }}>
            {msg.title}
          </p>
        )}
        <p style={{ fontSize: 14, color: C.head, margin: "6px 0 0", lineHeight: "21px" }}>{msg.text}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, margin: "8px 0", flexDirection: mine ? "row-reverse" : "row" }}>
      {!mine && <CoupleMark couple={msg.author?.couple} size={32} />}
      <div style={{ maxWidth: "80%" }}>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3,
          justifyContent: mine ? "flex-end" : "flex-start",
        }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.head }}>
            {mine ? "You both" : msg.author?.couple}
          </span>
          {!mine && msg.author?.city && (
            <span style={{ fontSize: 11.5, color: C.inact }}>{msg.author.city}</span>
          )}
        </div>
        <div style={{
          background: mine ? C.p100 : C.white,
          border: `1px solid ${mine ? C.p300 : C.div}`,
          borderRadius: 14, padding: "10px 13px",
        }}>
          <p style={{ fontSize: 14.5, color: C.head, margin: 0, lineHeight: "21px" }}>{msg.text}</p>
          {msg.image && (
            <img src={msg.image} alt="" style={{ width: "100%", borderRadius: 10, marginTop: 8, display: "block" }} />
          )}
        </div>
      </div>
    </div>
  );
}

export function DayDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 10px" }}>
      <div style={{ flex: 1, height: 1, background: C.div }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: C.inact, letterSpacing: "0.4px", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.div }} />
    </div>
  );
}

// ── Composer ──

// Kept as its own component with its own state, so typing does not re-render
// the message list and throw the scroll position away.
export function Composer({ placeholder, onSend, disabled }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileRef = useRef(null);

  const send = () => {
    if (!text.trim() || disabled) return;
    onSend({ text, image });
    setText("");
    setImage(null);
  };

  return (
    <div style={{
      flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.white,
      padding: `8px ${PAD}px calc(8px + env(safe-area-inset-bottom))`,
    }}>
      {image && (
        <div style={{ position: "relative", width: 64, marginBottom: 8 }}>
          <img src={image} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, display: "block" }} />
          <button onClick={() => setImage(null)} aria-label="Remove image" style={{
            position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%",
            background: C.head, border: "none", cursor: "pointer", display: "grid", placeItems: "center",
          }}><XIcon size={12} color="#fff" /></button>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        <button onClick={() => fileRef.current?.click()} aria-label="Add a photo" disabled={disabled} style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: C.bg,
          border: "none", cursor: disabled ? "default" : "pointer", display: "grid", placeItems: "center",
        }}><ImagePlus size={19} color={C.sub} /></button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => setImage(r.result);
            r.readAsDataURL(f);
          }} />
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} rows={1} disabled={disabled}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{
            flex: 1, minHeight: 44, maxHeight: 110, padding: "11px 14px", borderRadius: 14,
            border: `1px solid ${C.div}`, background: C.white, resize: "none",
            fontFamily: "inherit", fontSize: 15, color: C.head, outline: "none", lineHeight: "21px",
          }}
        />
        <button onClick={send} disabled={!text.trim() || disabled} aria-label="Send" style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0, border: "none",
          background: text.trim() && !disabled ? C.p600 : C.div,
          cursor: text.trim() && !disabled ? "pointer" : "default",
          display: "grid", placeItems: "center",
        }}><SendHorizontal size={18} color="#fff" /></button>
      </div>
    </div>
  );
}

// ── Small shared bits ──

export function Banner({ title, body, onDismiss }) {
  return (
    <div style={{
      background: C.p100, borderRadius: 16, padding: "14px 16px", margin: `0 ${PAD}px 12px`,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: C.p900, margin: 0 }}>{title}</p>
        <p style={{ fontSize: 13, color: C.p900, opacity: 0.82, margin: "4px 0 0", lineHeight: "19px" }}>{body}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.7)",
          border: "none", cursor: "pointer", display: "grid", placeItems: "center",
        }}><XIcon size={14} color={C.p900} /></button>
      )}
    </div>
  );
}

export function Toast({ children, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "absolute", left: 16, right: 16, bottom: 92, zIndex: 300,
      background: C.head, color: "#fff", borderRadius: 12, padding: "12px 16px",
      fontSize: 13.5, fontWeight: 600, textAlign: "center",
      animation: "toastSlideUp 0.25s ease-out",
    }}>{children}</div>
  );
}
