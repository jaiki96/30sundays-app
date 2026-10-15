import { useState } from "react";
import { Star, BadgeCheck, Sparkles, ChevronRight } from "lucide-react";
import { C } from "../../data";
import { SOURCES } from "../../data/hotelDetailData";
import SourceLogo from "../hotel_detail/SourceLogo";
import { Sheet, Chip, PAD, GAP } from "../hotel_refined/kit";
import { R, SHADOW, T, A } from "../hotel_refined/tokens";

// ─── Ratings and reviews ───
//
// One grey band, top to bottom. Everything in here answers the same question,
// and white blocks separated by hairlines made five answers look like five
// subjects. The band is the section; the white cards inside it are the parts.
//
// Ours goes first and in our own words, because a percentage needs no
// translating. The other three keep their own scales: rewriting 9.2 out of 10
// as 4.6 out of 5 would be our arithmetic on someone else's number, and the
// first thing a traveller does with a score is compare it to the one they just
// saw on that site. Tapping any of them opens the reviews themselves.

const BAND = "#F4F5F6";
const GREEN = "#2E8B60";
const inr = (n) => n.toLocaleString("en-IN");

// ─── One review ───
// A name, a rating, what they wrote. The tag chips came off: they were three
// more taps-that-are-not-taps per card, and every one of them repeated a word
// from the sentence underneath it.
function ReviewCard({ r, compact = false }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 150;
  const s = SOURCES[r.source];
  const initial = r.name.trim()[0].toUpperCase();

  return (
    <div style={{
      border: `1px solid ${C.div}`, borderRadius: R.card, padding: 14,
      background: C.white, boxShadow: SHADOW.card, flexShrink: 0,
      width: compact ? 274 : "auto",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: "#EAE6E3", color: "#254342", display: "grid", placeItems: "center",
          fontSize: 13.5, fontWeight: 700,
        }}>{initial}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              ...T.lead, fontSize: 13.5,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{r.name}</span>
            {r.verified && <BadgeCheck size={14} color="#00A898" style={{ flexShrink: 0 }} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
            {s.scale === 5 ? (
              <span style={{ display: "inline-flex", gap: 1.5 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    color={A.star}
                    fill={i < Math.round(r.score) ? A.star : "none"}
                    strokeWidth={i < Math.round(r.score) ? 0 : 1.6}
                  />
                ))}
              </span>
            ) : (
              <span style={{
                fontSize: 11.5, fontWeight: 800, color: "#fff", background: A.booking,
                borderRadius: 5, padding: "2px 6px",
              }}>{r.score}</span>
            )}
            <span style={{ ...T.micro }}>{r.date}</span>
          </div>
        </div>

        <span style={{ flexShrink: 0 }}>
          <SourceLogo source={r.source} size={17} />
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, marginTop: 11 }}>
        <p style={{
          ...T.body, margin: 0, fontSize: 13,
          ...(open || !long ? {} : {
            display: "-webkit-box", WebkitLineClamp: compact ? 5 : 4,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }),
        }}>{r.text}</p>
      </div>

      {long && (
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            marginTop: 8, alignSelf: "flex-start", border: "none", background: "none",
            padding: 0, cursor: "pointer", fontFamily: "inherit",
            fontSize: 12.5, fontWeight: 700, color: A.pink,
          }}
        >{open ? "Show less" : "Read more"}</button>
      )}
    </div>
  );
}

// ─── The summary ───
// A thousand reviews boiled down to two paragraphs is the most useful thing in
// this section and the only thing on it a machine wrote, so it says so. The
// lavender and the sparkle are the one surface on the page that is not ours or
// a rating site's; nobody should mistake this for something a traveller typed.
function Summary({ hotel }) {
  const [open, setOpen] = useState(false);
  const paras = hotel.reviewSummary.text.split("\n\n");
  const sources = Object.values(hotel.ratings);
  const total = sources.reduce((n, r) => n + r.count, 0);

  return (
    <div style={{
      background: "#F6F3FE", border: "1px solid #E4DBFB", borderRadius: R.card,
      padding: "14px 15px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Sparkles size={15} color="#6941C6" strokeWidth={2.2} style={{ flexShrink: 0 }} />
        <p style={{ ...T.h3, flex: 1, margin: 0, fontSize: 14 }}>What travellers are saying</p>
        <span style={{
          flexShrink: 0, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.4px",
          color: "#6941C6", background: "#EDE7FC", borderRadius: R.pill, padding: "3px 7px",
        }}>AI</span>
      </div>

      <p style={{ ...T.micro, margin: "0 0 10px", color: "#7A6BA8" }}>
        Written by AI from {inr(total)} ratings and reviews across{" "}
        {sources.length === 1 ? "one source" : `all ${sources.length} sources`}
      </p>

      {(open ? paras : paras.slice(0, 1)).map((t, i) => (
        <p
          key={i}
          style={{
            ...T.body, margin: i === 0 ? 0 : "11px 0 0", fontSize: 13,
            ...(open || i > 0 ? {} : {
              display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden",
            }),
          }}
        >{t}</p>
      ))}

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            border: "none", background: "none", padding: 0, cursor: "pointer",
            fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#6941C6",
          }}
        >{open ? "Show less" : "Read more"}</button>
        <span style={{ ...T.micro }}>{hotel.reviewSummary.updated}</span>
      </div>
    </div>
  );
}

// ─── The card that holds every opinion ───
//
// One card, because four opinions on the same hotel are one subject and
// splitting them across two asked the reader to work out why.
//
// What changes is the shape it takes for however many we have. Ours is always
// a full-width row: it is the only one in our own words and the only one that
// needs a sentence. The others go in a row of equal cells, which is what says
// "same kind of fact, different sources" without a word of explanation. But a
// single cell spanning the whole card is not a row of anything, so one other
// source becomes a full-width row too, named in full and with room for it.
//
// Every row and cell opens the same thing: the reviews. It used to open a
// breakdown of how each score was composed, in bars. Nobody taps a rating to
// see arithmetic; they tap it to read what people wrote.
const CARD = {
  background: C.white, borderRadius: R.card, border: `1px solid ${C.div}`,
  boxShadow: SHADOW.card,
};

function OursRow({ hotel, onOpen, lone }) {
  const r = hotel.ratings.sundays;
  const split = hotel.starSplit.sundays || [];
  const pct = Math.round((split[0] || 0) + (split[1] || 0));

  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: lone ? "16px 14px" : 14, textAlign: "left", cursor: "pointer",
        border: "none", background: "none", fontFamily: "inherit",
      }}
    >
      <SourceLogo source="sundays" size={lone ? 34 : 30} />
      <span style={{ flex: 1, minWidth: 0 }}>
        {/* Our own name, in our own ink. It was set in the same grey as a
            timestamp, which put the one rating on this page that is ours
            below the three that are borrowed. */}
        {/* The count rides with the name, not with the claim. Inline after the
            sentence it pushed the whole line onto a second row, and it belongs
            with the source anyway: it says how many people this is, the same
            way the borrowed rows carry their count under their name. */}
        <span style={{ display: "block" }}>
          <span style={{
            fontSize: 12, fontWeight: 800, color: C.head, letterSpacing: "0.1px",
          }}>30 Sundays</span>
          <span style={{ ...T.micro, marginLeft: 5 }}>· {inr(r.count)} ratings</span>
        </span>
        {/* The one green line on the page, and the same green as the thumb at
            the top and the "Loved it" bar in the sheet this opens. */}
        <span style={{
          ...T.h3, display: "block", marginTop: 3,
          fontSize: lone ? 14.5 : 13.5, color: GREEN,
        }}>
          {pct}% of travellers enjoyed it
        </span>
      </span>
      <ChevronRight size={18} color={C.icon} style={{ flexShrink: 0 }} />
    </button>
  );
}

// One borrowed source, given the room a lone number needs: the site named in
// full, the score at the size of a headline, the count behind it.
function SourceRow({ hotel, k, onOpen, divider }) {
  const r = hotel.ratings[k];
  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: 14, textAlign: "left", cursor: "pointer",
        border: "none", background: "none", fontFamily: "inherit",
        borderTop: divider ? `1px solid ${C.div}` : "none",
      }}
    >
      <SourceLogo source={k} size={28} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...T.lead, display: "block", fontSize: 13.5 }}>{SOURCES[k].name}</span>
        <span style={{ ...T.micro, display: "block", marginTop: 2 }}>{inr(r.count)} ratings</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: C.head, fontVariantNumeric: "tabular-nums" }}>
          {r.score.toFixed(1)}
        </span>
        <span style={{ ...T.micro, fontSize: 11 }}>/{r.outOf}</span>
      </span>
      <ChevronRight size={17} color={C.icon} style={{ flexShrink: 0 }} />
    </button>
  );
}

// Two or three of them, side by side. With two there is room for the name, so
// the cells take it rather than leaving the width empty.
function SourceCells({ hotel, list, onOpen, divider }) {
  const named = list.length === 2;
  return (
    <div style={{ display: "flex", borderTop: divider ? `1px solid ${C.div}` : "none" }}>
      {list.map((k, i) => {
        const r = hotel.ratings[k];
        return (
          <button
            key={k}
            onClick={() => onOpen(k)}
            style={{
              flex: 1, minWidth: 0, padding: "11px 6px 12px", cursor: "pointer",
              border: "none", background: "none", fontFamily: "inherit",
              borderLeft: i === 0 ? "none" : `1px solid ${C.div}`,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <SourceLogo source={k} size={18} />
              {named && (
                <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{SOURCES[k].name}</span>
              )}
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: C.head, fontVariantNumeric: "tabular-nums" }}>
                  {r.score.toFixed(1)}
                </span>
                <span style={{ ...T.micro, fontSize: 10 }}>/{r.outOf}</span>
              </span>
            </span>
            <span style={{ ...T.micro, display: "block", marginTop: 4, fontSize: 10.5 }}>
              {inr(r.count)} ratings
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ScoreCard({ hotel, onOpen, sources, ours = true }) {
  const others = (sources || ["booking", "google", "tripadvisor"]).filter((k) => hotel.ratings[k]);
  const mine = ours && !!hotel.ratings.sundays;
  if (!mine && others.length === 0) return null;

  return (
    <div style={{ ...CARD, overflow: "hidden" }}>
      {mine && <OursRow hotel={hotel} onOpen={() => onOpen("sundays")} lone={others.length === 0} />}
      {others.length === 1 && (
        <SourceRow hotel={hotel} k={others[0]} onOpen={() => onOpen(others[0])} divider={mine} />
      )}
      {others.length >= 2 && (
        <SourceCells hotel={hotel} list={others} onOpen={onOpen} divider={mine} />
      )}
    </div>
  );
}

export default function Ratings({ hotel }) {
  const [allOpen, setAllOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const counts = {};
  hotel.reviews.forEach((r) => { counts[r.source] = (counts[r.source] || 0) + 1; });
  const filtered = filter === "all" ? hotel.reviews : hotel.reviews.filter((r) => r.source === filter);
  const reviewSources = Object.keys(counts);

  const white = {
    background: C.white, borderRadius: R.card, border: `1px solid ${C.div}`,
    boxShadow: SHADOW.card,
  };

  return (
    <div style={{ background: BAND, padding: `${GAP}px 0` }}>
      <div style={{ padding: `0 ${PAD}px` }}>
        <h2 style={{ ...T.h2, margin: 0 }}>Ratings and reviews</h2>

        <div style={{ marginTop: 14 }}>
          <ScoreCard hotel={hotel} onOpen={() => setAllOpen(true)} />
        </div>

        <div style={{ marginTop: 14 }}>
          <Summary hotel={hotel} />
        </div>
      </div>

      <div className="hs" style={{ gap: 11, padding: `14px ${PAD}px 2px` }}>
        {hotel.reviews.slice(0, 4).map((r) => <ReviewCard key={r.id} r={r} compact />)}
      </div>

      <div style={{ padding: `12px ${PAD}px 0` }}>
        <button
          onClick={() => setAllOpen(true)}
          style={{
            ...white, display: "block", width: "100%", padding: "13px 0",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 13.5, fontWeight: 700, color: C.head,
          }}
        >
          Read all reviews
        </button>
      </div>

      <Sheet open={allOpen} title="Reviews" onClose={() => setAllOpen(false)} full>
        <div style={{
          position: "sticky", top: 0, background: C.white, zIndex: 2,
          borderBottom: `1px solid ${C.div}`, padding: "12px 0",
        }}>
          <div className="hide-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: `0 ${PAD}px` }}>
            <Chip active={filter === "all"} onClick={() => setFilter("all")} count={hotel.reviews.length}>
              All sources
            </Chip>
            {reviewSources.map((k) => (
              <Chip key={k} active={filter === k} onClick={() => setFilter(k)} count={counts[k]}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <SourceLogo source={k} size={14} />
                  {SOURCES[k].name}
                </span>
              </Chip>
            ))}
          </div>
        </div>

        <div style={{ padding: `14px ${PAD}px 26px`, display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((r) => <ReviewCard key={r.id} r={r} />)}
        </div>
      </Sheet>
    </div>
  );
}
