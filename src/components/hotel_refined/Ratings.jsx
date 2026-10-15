import { useState } from "react";
import { Star, BadgeCheck, ChevronRight, MessageSquareQuote } from "lucide-react";
import { C } from "../../data";
import { SOURCES } from "../../data/hotelDetailData";
import SourceLogo from "../hotel_detail/SourceLogo";
import { Section, Card, RowCard, Sheet, Chip, PAD } from "./kit";
import { R, SHADOW, T, A } from "./tokens";

// ─── Ratings and reviews ───
//
// The content is unchanged. What changed is that the three logos now sit on a
// common white base with a hairline, so a four-colour G, a blue square and a
// line-drawn palm read as three items in one list rather than three different
// things pasted in. Every logo on this page gets the same treatment.

const ROWS = ["booking", "google", "sundays"];

function Bar({ pct, colour = "#00A898", h = 6 }) {
  return (
    <div style={{ flex: 1, height: h, borderRadius: R.pill, background: "#EFEFF1", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, borderRadius: R.pill, background: colour }} />
    </div>
  );
}

// A logo on its own base. Different platforms draw their marks at wildly
// different weights, and a shared plate is what stops the row looking ragged.
function LogoPlate({ source, size = 38 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: R.well, background: C.white,
      border: `1px solid ${C.div}`, display: "grid", placeItems: "center", flexShrink: 0,
    }}>
      <SourceLogo source={source} size={size - 15} />
    </span>
  );
}

function SourceRow({ source, data, onOpen, last }) {
  const s = SOURCES[source];
  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "13px", border: "none", background: "none", cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
        borderBottom: last ? "none" : `1px solid ${C.div}`,
      }}
    >
      <LogoPlate source={source} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...T.lead, display: "block" }}>{s.name}</span>
        <span style={{ ...T.micro, display: "block", marginTop: 2 }}>
          {data.count.toLocaleString("en-IN")} reviews
        </span>
      </span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 1, flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>
          {data.score.toFixed(1)}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.inact }}>/{data.outOf}</span>
      </span>
      <ChevronRight size={17} color={C.icon} style={{ flexShrink: 0 }} />
    </button>
  );
}

// ─── What people are generally saying ───
function Summary({ hotel, total }) {
  const [open, setOpen] = useState(false);
  const paras = hotel.reviewSummary.text.split("\n\n");

  return (
    <Card pad={15} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 28, height: 28, borderRadius: R.well, background: "#FFE6ED",
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <MessageSquareQuote size={15} color={A.pink} strokeWidth={2} />
        </span>
        <p style={{ ...T.h3, flex: 1, margin: 0, fontSize: 14 }}>What travellers are saying</p>
      </div>

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

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          marginTop: 10, border: "none", background: "none", padding: 0, cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: A.pink,
        }}
      >{open ? "Show less" : "Read more"}</button>

      <p style={{ ...T.micro, margin: "12px 0 0", lineHeight: 1.5 }}>
        Written from all {total.toLocaleString("en-IN")} reviews, not selected ones.
        {" "}{hotel.reviewSummary.updated}.
      </p>
    </Card>
  );
}

function ReviewCard({ r, compact = false }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 170;
  const s = SOURCES[r.source];
  const initial = r.name.trim()[0].toUpperCase();

  return (
    <div style={{
      border: `1px solid ${C.div}`, borderRadius: R.card, padding: 14,
      background: C.white, boxShadow: SHADOW.card, flexShrink: 0,
      width: compact ? 274 : "auto",
      // A swipe row of cards with ragged bottoms reads as broken. One height,
      // set by the tallest thing a clamped card can hold.
      minHeight: compact ? 238 : 0,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
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
          <p style={{
            ...T.micro, margin: "2px 0 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{r.meta}</p>
        </div>

        <LogoPlate source={r.source} size={28} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "11px 0 9px" }}>
        {s.scale === 5 ? (
          <span style={{ display: "inline-flex", gap: 1.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                color={A.star}
                fill={i < Math.round(r.score) ? A.star : "none"}
                strokeWidth={i < Math.round(r.score) ? 0 : 1.6}
              />
            ))}
          </span>
        ) : (
          <span style={{
            fontSize: 12, fontWeight: 800, color: "#fff", background: A.booking,
            borderRadius: 6, padding: "3px 7px",
          }}>{r.score}</span>
        )}
        <span style={{ ...T.micro }}>{r.date}</span>
      </div>

      {r.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 9 }}>
          {r.tags.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600, color: C.sub, background: "#F3F4F6",
              borderRadius: R.pill, padding: "4px 9px",
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* The spacer, not the paragraph, takes the leftover height. Putting
          flex on a line-clamped element stretches it past its clamp and the
          last line gets sliced in half. */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <p style={{
          ...T.body, margin: 0, fontSize: 13,
          ...(open || !long ? {} : {
            display: "-webkit-box", WebkitLineClamp: compact ? 4 : 3,
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

// ─── One platform, opened up ───
function BreakupSheet({ hotel, source, onClose }) {
  if (!source) return null;
  const s = SOURCES[source];
  const data = hotel.ratings[source];
  const rows = hotel.ratingBreakdown[source] || [];
  const split = hotel.starSplit[source] || [];
  const stars = [5, 4, 3, 2, 1];

  return (
    <Sheet open title={s.name} onClose={onClose}>
      <div style={{ padding: `18px ${PAD}px 26px` }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: 15,
          borderRadius: R.card, background: s.tint, marginBottom: 20,
        }}>
          <LogoPlate source={source} size={46} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: C.head, letterSpacing: "-0.8px" }}>
                {data.score.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.inact }}>/{data.outOf}</span>
              <span style={{ ...T.h3, marginLeft: 8, fontSize: 13.5 }}>{data.label}</span>
            </p>
            <p style={{ ...T.meta, margin: "3px 0 0" }}>
              {data.count.toLocaleString("en-IN")} reviews on {s.name}
            </p>
          </div>
        </div>

        <p style={{ ...T.h3, margin: "0 0 12px", fontSize: 14 }}>How the ratings are spread</p>
        {stars.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, width: 28, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{n}</span>
              <Star size={10} color={A.star} fill={A.star} strokeWidth={0} />
            </span>
            <Bar pct={split[i] || 0} colour={A.star} />
            <span style={{ width: 32, flexShrink: 0, textAlign: "right", ...T.micro }}>
              {split[i] || 0}%
            </span>
          </div>
        ))}

        <p style={{ ...T.h3, margin: "24px 0 12px", fontSize: 14 }}>Rating breakup</p>
        {rows.map((b) => (
          <div key={b.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ ...T.meta }}>{b.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.head }}>{b.score.toFixed(1)}</span>
            </div>
            <Bar pct={(b.score / data.outOf) * 100} />
          </div>
        ))}

        {source === "sundays" && (
          <div style={{ marginTop: 20, padding: 14, borderRadius: R.card, background: C.bg }}>
            <p style={{ ...T.body, margin: 0, fontSize: 12.5 }}>
              We ask for this rating after the trip ends, and only from people whose booking we
              handled. It is a smaller number than the others on purpose, and closer to your
              trip. A low score stays on the page. If a hotel drops below 3.5 we stop putting it
              in itineraries rather than hiding the rating.
            </p>
          </div>
        )}
      </div>
    </Sheet>
  );
}

export default function Ratings({ hotel }) {
  const [allOpen, setAllOpen] = useState(false);
  const [breakup, setBreakup] = useState(null);
  const [filter, setFilter] = useState("all");

  const total = ROWS.reduce((n, k) => n + hotel.ratings[k].count, 0);
  const counts = {};
  hotel.reviews.forEach((r) => { counts[r.source] = (counts[r.source] || 0) + 1; });
  const filtered = filter === "all" ? hotel.reviews : hotel.reviews.filter((r) => r.source === filter);
  const reviewSources = Object.keys(counts);

  return (
    <>
      <Section
        title="Ratings and reviews"
        sub={`${total.toLocaleString("en-IN")} reviews in total. Tap a platform to see how it rated this hotel.`}
      >
        <RowCard style={{ marginBottom: 14 }}>
          {ROWS.map((k, i) => (
            <SourceRow
              key={k}
              source={k}
              data={hotel.ratings[k]}
              onOpen={() => setBreakup(k)}
              last={i === ROWS.length - 1}
            />
          ))}
        </RowCard>

        <Summary hotel={hotel} total={total} />
      </Section>

      <div className="hs" style={{ gap: 11, padding: `0 ${PAD}px 2px`, marginTop: 2 }}>
        {hotel.reviews.slice(0, 4).map((r) => <ReviewCard key={r.id} r={r} compact />)}
      </div>

      <div style={{ padding: `12px ${PAD}px 0` }}>
        <button
          onClick={() => setAllOpen(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            width: "100%", padding: "13px 0", borderRadius: R.card,
            border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
            boxShadow: SHADOW.card, fontFamily: "inherit",
            fontSize: 13.5, fontWeight: 700, color: C.head,
          }}
        >
          Read all reviews
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            {reviewSources.map((k) => <SourceLogo key={k} source={k} size={16} />)}
          </span>
        </button>
      </div>

      <BreakupSheet hotel={hotel} source={breakup} onClose={() => setBreakup(null)} />

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
          <p style={{ ...T.micro, margin: "6px 0 0", textAlign: "center", lineHeight: 1.55 }}>
            Reviews from Booking.com, Google, MakeMyTrip and Tripadvisor are shown as they were
            written there. We do not edit or remove them.
          </p>
        </div>
      </Sheet>
    </>
  );
}
