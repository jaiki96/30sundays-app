import { useState } from "react";
import { Star, BadgeCheck, ChevronRight, MessageSquareQuote } from "lucide-react";
import { C } from "../../data";
import { SOURCES } from "../../data/hotelDetailData";
import SourceLogo from "./SourceLogo";
import { Section, Sheet, Chip, HEAD, PAGE_PAD } from "./kit";

// ─── Ratings and reviews, all sources in one place ───
//
// Three platforms rate this hotel and all three are on the page, each behind
// its own mark. None of them is averaged into a single invented number,
// because a 9.2 out of 10 and a 4.6 out of 5 do not mean the same thing and
// pretending they do is how you end up with a score nobody trusts.
//
// Each row opens. Behind it is that platform's own breakup: the categories it
// actually asks about, and how its stars are spread. So a number on this page
// is never something you have to take on trust.

const ROWS = ["booking", "google", "sundays"];

function Bar({ pct, colour = "#00A898", h = 5 }) {
  return (
    <div style={{ flex: 1, height: h, borderRadius: 3, background: "#EFEFF1", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: colour }} />
    </div>
  );
}


// ─── What people are generally saying ───
//
// The three numbers above tell you the hotel is good. They do not tell you
// what is good about it, and they certainly do not tell you what the people
// who marked it down were annoyed by. That is what this is for, and it carries
// the complaints as well as the praise, because a summary that only flatters
// is an advert and nobody reads one twice.
function Summary({ hotel, total }) {
  const [open, setOpen] = useState(false);
  const paras = hotel.reviewSummary.text.split("\n\n");

  return (
    <div style={{
      border: `1px solid ${C.div}`, borderRadius: 16, padding: 15, marginBottom: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <MessageSquareQuote size={16} color={C.sub} strokeWidth={2} style={{ flexShrink: 0 }} />
        <p style={{ flex: 1, margin: 0, fontSize: 13.5, fontWeight: 700, color: HEAD }}>
          What travellers are saying
        </p>
      </div>

      {(open ? paras : paras.slice(0, 1)).map((t, i) => (
        <p
          key={i}
          style={{
            margin: i === 0 ? 0 : "10px 0 0", fontSize: 13, color: C.sub, lineHeight: 1.6,
            ...(open || i > 0 ? {} : {
              display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden",
            }),
          }}
        >{t}</p>
      ))}

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          marginTop: 9, border: "none", background: "none", padding: 0, cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#FD014F",
        }}
      >{open ? "Show less" : "Read more"}</button>

      <p style={{ margin: "11px 0 0", fontSize: 11, color: C.inact, lineHeight: 1.45 }}>
        Written from all {total.toLocaleString("en-IN")} reviews, not selected ones.
        {" "}{hotel.reviewSummary.updated}.
      </p>
    </div>
  );
}

function SourceRow({ source, data, onOpen, last }) {
  const s = SOURCES[source];
  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "13px 14px", border: "none", background: "none", cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
        borderBottom: last ? "none" : `1px solid ${C.div}`,
      }}
    >
      <SourceLogo source={source} size={26} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: HEAD }}>{s.name}</span>
        <span style={{ display: "block", fontSize: 11.5, color: C.sub, marginTop: 1 }}>
          {data.count.toLocaleString("en-IN")} reviews
        </span>
      </span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 1, flexShrink: 0 }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: HEAD, letterSpacing: "-0.3px" }}>{data.score.toFixed(1)}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.inact }}>/{data.outOf}</span>
      </span>
      <ChevronRight size={16} color={C.inact} style={{ flexShrink: 0 }} />
    </button>
  );
}

function ReviewCard({ r, compact = false }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 170;
  const s = SOURCES[r.source];
  const initial = r.name.trim()[0].toUpperCase();

  return (
    <div style={{
      border: `1px solid ${C.div}`, borderRadius: 14, padding: 13,
      background: C.white, width: compact ? 268 : "auto", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "#EAE6E3", color: "#254342", display: "grid", placeItems: "center",
          fontSize: 13, fontWeight: 700,
        }}>{initial}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: HEAD,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{r.name}</span>
            {r.verified && <BadgeCheck size={13} color="#00A898" style={{ flexShrink: 0 }} />}
          </div>
          <p style={{
            margin: "1px 0 0", fontSize: 11, color: C.sub,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{r.meta}</p>
        </div>

        <SourceLogo source={r.source} size={20} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "10px 0 8px" }}>
        {s.scale === 5 ? (
          <span style={{ display: "inline-flex", gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                color="#FDA201"
                fill={i < Math.round(r.score) ? "#FDA201" : "none"}
                strokeWidth={i < Math.round(r.score) ? 0 : 1.6}
              />
            ))}
          </span>
        ) : (
          <span style={{
            fontSize: 11.5, fontWeight: 800, color: "#fff", background: "#003580",
            borderRadius: 5, padding: "2px 6px",
          }}>{r.score}</span>
        )}
        <span style={{ fontSize: 11, color: C.inact }}>{r.date}</span>
      </div>

      {r.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {r.tags.map((t) => (
            <span key={t} style={{
              fontSize: 10.5, fontWeight: 600, color: C.sub, background: C.bg,
              borderRadius: 999, padding: "3px 8px",
            }}>{t}</span>
          ))}
        </div>
      )}

      <p style={{
        margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.5,
        ...(open || !long ? {} : {
          display: "-webkit-box", WebkitLineClamp: compact ? 4 : 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }),
      }}>{r.text}</p>

      {long && (
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            marginTop: 6, border: "none", background: "none", padding: 0, cursor: "pointer",
            fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: "#FD014F",
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
      <div style={{ padding: "16px 16px 24px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 13, padding: 14,
          borderRadius: 14, background: s.tint, marginBottom: 18,
        }}>
          <SourceLogo source={source} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, display: "flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: HEAD, letterSpacing: "-0.7px" }}>{data.score.toFixed(1)}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.inact }}>/{data.outOf}</span>
              <span style={{ marginLeft: 7, fontSize: 13, fontWeight: 700, color: HEAD }}>{data.label}</span>
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.sub }}>
              {data.count.toLocaleString("en-IN")} reviews on {s.name}
            </p>
          </div>
        </div>

        <p style={{ margin: "0 0 10px", fontSize: 13.5, fontWeight: 700, color: HEAD }}>
          How the ratings are spread
        </p>
        {stars.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, width: 26, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{n}</span>
              <Star size={10} color="#FDA201" fill="#FDA201" strokeWidth={0} />
            </span>
            <Bar pct={split[i] || 0} colour="#FDA201" h={6} />
            <span style={{ width: 30, flexShrink: 0, textAlign: "right", fontSize: 11.5, color: C.sub }}>
              {split[i] || 0}%
            </span>
          </div>
        ))}

        <p style={{ margin: "20px 0 10px", fontSize: 13.5, fontWeight: 700, color: HEAD }}>
          Rating breakup
        </p>
        {rows.map((b) => (
          <div key={b.label} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12.5, color: C.sub }}>{b.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: HEAD }}>{b.score.toFixed(1)}</span>
            </div>
            <Bar pct={(b.score / data.outOf) * 100} />
          </div>
        ))}

        {source === "sundays" && (
          <div style={{
            marginTop: 18, padding: 13, borderRadius: 12, background: C.bg,
          }}>
            <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.55 }}>
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
        <div style={{ border: `1px solid ${C.div}`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
          {ROWS.map((k, i) => (
            <SourceRow
              key={k}
              source={k}
              data={hotel.ratings[k]}
              onOpen={() => setBreakup(k)}
              last={i === ROWS.length - 1}
            />
          ))}
        </div>

        <Summary hotel={hotel} total={total} />
      </Section>

      {/* The reviews themselves, each carrying the mark of where it came from */}
      <div className="hs" style={{ gap: 10, padding: `0 ${PAGE_PAD}px 4px` }}>
        {hotel.reviews.slice(0, 4).map((r) => <ReviewCard key={r.id} r={r} compact />)}
      </div>

      <div style={{ padding: `12px ${PAGE_PAD}px 0` }}>
        <button
          onClick={() => setAllOpen(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "12px 0", borderRadius: 12,
            border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
            fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: HEAD,
          }}
        >
          Read all reviews
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            {reviewSources.map((k) => <SourceLogo key={k} source={k} size={16} />)}
          </span>
        </button>
      </div>

      <BreakupSheet hotel={hotel} source={breakup} onClose={() => setBreakup(null)} />

      {/* ─── Every review, filterable by where it came from ─── */}
      <Sheet open={allOpen} title="Reviews" onClose={() => setAllOpen(false)} full>
        <div style={{
          position: "sticky", top: 0, background: C.white, zIndex: 2,
          borderBottom: `1px solid ${C.div}`, padding: "11px 0",
        }}>
          <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 16px" }}>
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

        <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 11 }}>
          {filtered.map((r) => <ReviewCard key={r.id} r={r} />)}
          <p style={{ margin: "6px 0 0", fontSize: 11.5, color: C.inact, lineHeight: 1.5, textAlign: "center" }}>
            Reviews from Booking.com, Google, MakeMyTrip and Tripadvisor are shown as they were
            written there. We do not edit or remove them.
          </p>
        </div>
      </Sheet>
    </>
  );
}
