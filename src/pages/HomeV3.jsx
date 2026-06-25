import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles, ChevronRight, ShoppingBag } from "lucide-react";
import { C, allItineraries } from "../data";
import { useDeals } from "../data/deals";
import PortraitVideo from "../components/home_v2/PortraitVideo";
import Logo from "../components/Logo";
import TravellerMoments from "../components/home_shared/TravellerMoments";
import ReviewsStrip from "../components/home_shared/ReviewsStrip";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import { SIX, getSeasonGroups, fromPrice, COMPARE_REELS } from "../data/homeV3Data";

const PAD = 16;

// ─── Small pieces ───
function SectionTitle({ title, sub }) {
  return (
    <div style={{ padding: `0 ${PAD}px`, marginBottom: 12 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "16px" }}>{sub}</p>}
    </div>
  );
}

// A wide, photo-led destination card used in the season strips.
function SeasonCard({ d }) {
  return (
    <Link
      to={`/destination/${encodeURIComponent(d.name)}`}
      style={{
        flexShrink: 0, width: 184, textDecoration: "none",
        borderRadius: 16, overflow: "hidden", background: C.white,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.div}`,
      }}
    >
      <div style={{ position: "relative", height: 130 }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 45%)" }} />
        <span style={{
          position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4,
          background: d.peakNow ? "#E6F4EC" : "rgba(255,255,255,0.94)",
          color: d.peakNow ? "#1B5E3A" : C.head,
          fontSize: 10.5, fontWeight: 700, padding: "4px 8px", borderRadius: 999,
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        }}>
          {d.peakNow && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D52", display: "inline-block" }} />}
          {d.badge}
        </span>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>{d.flag} {d.name}</p>
        <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 6px", lineHeight: "15px" }}>{d.blurb}</p>
        <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: 0 }}>
          From {fromPrice(d.startPrice)} <span style={{ fontWeight: 500, color: C.inact }}>pp</span>
        </p>
      </div>
    </Link>
  );
}

// Compact tile used in the "All six" grid.
function GridCard({ d }) {
  return (
    <Link
      to={`/destination/${encodeURIComponent(d.name)}`}
      style={{ textDecoration: "none", borderRadius: 14, overflow: "hidden", background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      <div style={{ height: 96, position: "relative" }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ padding: "9px 11px 11px" }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>{d.flag} {d.name}</p>
        <p style={{ fontSize: 10.5, color: C.sub, margin: "2px 0 0", lineHeight: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {d.blurb} · {fromPrice(d.startPrice)}
        </p>
      </div>
    </Link>
  );
}

const FILTERS = [
  { key: "month", label: "In season" },
  { key: "budget", label: "By budget" },
  { key: "beach", label: "Beachy" },
];

export default function HomeV3() {
  const navigate = useNavigate();
  const { deals } = useDeals();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(null);

  const groups = useMemo(() => getSeasonGroups(new Date()), []);
  const inSeason = useMemo(() => new Set(groups.flatMap(g => g.dests.map(d => d.name))), [groups]);

  // The single open (un-finalized) draft — surfaced as "Continue planning".
  const draftDeal = deals.find(d => (d.versions || []).some(v => v.status === "draft"));
  const draftVer = draftDeal && [...draftDeal.versions].reverse().find(v => v.status === "draft");
  const draftNights = draftVer && (allItineraries.find(it => String(it.id) === String(draftVer.itineraryId))?.nights);

  // "All six" — search + one active filter.
  const sixView = useMemo(() => {
    let list = SIX.filter(d =>
      !q.trim() ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.blurb.toLowerCase().includes(q.toLowerCase())
    );
    if (filter === "beach") list = list.filter(d => d.beach);
    if (filter === "budget") list = [...list].sort((a, b) =>
      Number(String(a.startPrice).replace(/[^0-9]/g, "")) - Number(String(b.startPrice).replace(/[^0-9]/g, "")));
    if (filter === "month") list = [...list].sort((a, b) => (inSeason.has(b.name) - inSeason.has(a.name)));
    return list;
  }, [q, filter, inSeason]);

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.bg, paddingBottom: 88 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `14px ${PAD}px 4px` }}>
        <Logo variant="lockup" height={26} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/trips")} aria-label="Tickets" style={{ position: "relative", background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <ShoppingBag size={20} color={C.head} strokeWidth={1.8} />
            <span style={{ position: "absolute", top: -2, right: -2, background: C.p600, color: "#fff", fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>8</span>
          </button>
          <div style={{ display: "flex" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.p600, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + C.bg }}>R</div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#9CA3AF", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + C.bg, marginLeft: -8 }}>A</div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ padding: `2px ${PAD}px 12px` }}>
        <p style={{ fontSize: 13, color: C.sub, margin: "0 0 2px" }}>Hi Rahul &amp; Aanya</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.6px", lineHeight: "29px" }}>
          Six countries.<br />Let's find your one.
        </h1>
      </div>

      {/* Search */}
      <div style={{ padding: `0 ${PAD}px 12px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: C.white, border: `1px solid ${C.div}`, borderRadius: 12, padding: "11px 13px" }}>
          <Search size={17} color={C.inact} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search a place or a vibe"
            style={{ flex: 1, border: "none", outline: "none", background: "none", fontSize: 14, color: C.head, fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="hs" style={{ gap: 8, paddingLeft: PAD, paddingRight: PAD, marginBottom: 18 }}>
        <Link
          to="/chat"
          style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, background: C.p600, color: "#fff", border: "none", borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
        >
          <Sparkles size={14} /> Help me decide
        </Link>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(on ? null : f.key)}
              style={{ flexShrink: 0, background: on ? C.p100 : C.white, color: on ? C.p600 : C.head, border: `1px solid ${on ? C.p300 : C.div}`, borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Continue planning */}
      {draftVer && (
        <div style={{ padding: `0 ${PAD}px 22px` }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.sub, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Continue planning</p>
          <Link
            to={`/itinerary/${draftVer.itineraryId}?dealId=${draftDeal.id}&versionId=${draftVer.id}`}
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", background: C.white, border: `1.5px solid ${C.p300}`, borderRadius: 14, padding: 12 }}
          >
            <img src={draftDeal.img} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0 }}>
                {draftVer.destination}{draftNights ? ` · ${draftNights} nights` : ""}
              </p>
              <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {draftVer.title} · in progress
              </p>
            </div>
            <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, background: C.p600, color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>
              Resume <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      )}

      {/* Season groups */}
      {groups.map((g, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <SectionTitle title={g.label} sub={g.sub} />
          <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
            {g.dests.map(d => <SeasonCard key={d.name} d={d} />)}
          </div>
        </div>
      ))}

      {/* Torn between two? */}
      <div style={{ marginBottom: 24 }}>
        <SectionTitle title="Torn between two?" sub="Watch the honest head-to-head. No winner, just which fits you." />
        <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
          {COMPARE_REELS.map((r, i) => (
            <PortraitVideo
              key={i}
              poster={r.poster}
              videoUrl={r.videoUrl}
              duration={r.duration}
              width={150}
              radius={16}
              bottomSlot={
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, lineHeight: "17px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{r.a} <span style={{ fontWeight: 500, opacity: 0.85 }}>vs</span> {r.b}</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", margin: "2px 0 0", lineHeight: "14px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{r.hook}</p>
                </div>
              }
            />
          ))}
        </div>
      </div>

      {/* All six */}
      <div style={{ marginBottom: 18 }}>
        <SectionTitle title="All six" sub={filter || q ? "Filtered to your pick." : "Every country, honestly priced."} />
        <div style={{ padding: `0 ${PAD}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {sixView.map(d => <GridCard key={d.name} d={d} />)}
        </div>
        {sixView.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: C.sub, padding: "20px 0" }}>No matches. Try another search.</p>
        )}
      </div>

      <TravellerMoments tone="clean" pad={PAD} />
      <ReviewsStrip tone="clean" pad={PAD} />

      {/* Honest-promise footer */}
      <div style={{ padding: `0 ${PAD}px`, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.p100, borderRadius: 12, padding: "13px 14px" }}>
          <span style={{ fontSize: 18 }}>🤝</span>
          <p style={{ fontSize: 12, color: C.head, margin: 0, lineHeight: "16px", fontWeight: 500 }}>
            Real prices, honest seasons. Day-trips are never sold as stays.
          </p>
        </div>
      </div>

      <LeadCloseCTA tone="clean" pad={PAD} />
    </div>
  );
}
