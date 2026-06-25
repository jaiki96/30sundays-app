import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Star, ShieldCheck, IndianRupee, Heart } from "lucide-react";
import { C, allItineraries, couplesCount } from "../data";
import { useDeals } from "../data/deals";
import PortraitVideo from "../components/home_v2/PortraitVideo";
import Logo from "../components/Logo";
import TravellerMoments from "../components/home_shared/TravellerMoments";
import ReviewsStrip from "../components/home_shared/ReviewsStrip";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import { SIX, getSeasonGroups, fromPrice, COMPARE_REELS } from "../data/homeV3Data";

const PAD = 16;
const TOTAL_COUPLES = Object.values(couplesCount).reduce((s, n) => s + n, 0); // ~2,947

// ─── Shared pieces ───
function SectionTitle({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: `0 ${PAD}px`, marginBottom: 12, gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: C.sub, margin: "3px 0 0", lineHeight: "16px" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SeasonCard({ d }) {
  return (
    <Link to={`/destination/${encodeURIComponent(d.name)}`} style={{ flexShrink: 0, width: 184, textDecoration: "none", borderRadius: 16, overflow: "hidden", background: C.white, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${C.div}` }}>
      <div style={{ position: "relative", height: 130 }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 45%)" }} />
        <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: d.peakNow ? "#E6F4EC" : "rgba(255,255,255,0.94)", color: d.peakNow ? "#1B5E3A" : C.head, fontSize: 10.5, fontWeight: 700, padding: "4px 8px", borderRadius: 999, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
          {d.peakNow && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D52", display: "inline-block" }} />}
          {d.badge}
        </span>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>{d.flag} {d.name}</p>
        <p style={{ fontSize: 11, color: C.sub, margin: "2px 0 6px", lineHeight: "15px" }}>{d.blurb}</p>
        <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: 0 }}>
          From {fromPrice(d.startPrice)} <span style={{ fontWeight: 500, color: C.inact }}>pp · 7 nights</span>
        </p>
      </div>
    </Link>
  );
}

function GridCard({ d }) {
  return (
    <Link to={`/destination/${encodeURIComponent(d.name)}`} style={{ textDecoration: "none", borderRadius: 14, overflow: "hidden", background: C.white, border: `1px solid ${C.div}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      <div style={{ height: 96 }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ padding: "9px 11px 11px" }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>{d.flag} {d.name}</p>
        <p style={{ fontSize: 10.5, color: C.sub, margin: "2px 0 0", lineHeight: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {d.blurb} · From {fromPrice(d.startPrice)}
        </p>
      </div>
    </Link>
  );
}

// Honest-promise band, pulled up under the hero (the differentiator, not buried).
const PROMISES = [
  { icon: IndianRupee, title: "Real prices, itemised", body: "Flights, hotels, activities split out. No mystery markup." },
  { icon: ShieldCheck, title: "Honest seasons", body: "We tell you the bad months too, even if it costs us the sale." },
  { icon: Heart, title: "Built for couples", body: "Two-person trips only. Never group tours, never solo." },
];

function PromiseBand() {
  return (
    <div className="hs" style={{ gap: 10, paddingLeft: PAD, paddingRight: PAD }}>
      {PROMISES.map((p, i) => (
        <div key={i} style={{ flexShrink: 0, width: 200, background: C.white, border: `1px solid ${C.div}`, borderRadius: 14, padding: "13px 14px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: C.p100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <p.icon size={16} color={C.p600} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.head, margin: "0 0 2px" }}>{p.title}</p>
          <p style={{ fontSize: 11, color: C.sub, margin: 0, lineHeight: "15px" }}>{p.body}</p>
        </div>
      ))}
    </div>
  );
}

// Avatar stack for social proof.
function ProofRow() {
  const initials = ["A", "K", "R", "S"];
  const bgs = [C.p600, "#9CA3AF", "#6366F1", "#0EA5A4"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ display: "flex" }}>
        {initials.map((c, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: bgs[i], color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}`, marginLeft: i ? -9 : 0 }}>{c}</div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: C.sub, margin: 0 }}>
        <Star size={12} fill="#FBBC05" color="#FBBC05" style={{ verticalAlign: "-1px" }} /> <b style={{ color: C.head }}>4.9</b> · {TOTAL_COUPLES.toLocaleString("en-IN")}+ couples planned
      </p>
    </div>
  );
}

// Head-to-head reels. No video yet → no dead play button, an honest "Films coming soon".
function CompareReels() {
  return (
    <div style={{ marginBottom: 24 }}>
      <SectionTitle title="Torn between two?" sub="Honest head-to-heads. No winner, just which fits you." />
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
        {COMPARE_REELS.map((r, i) => {
          const ready = !!r.videoUrl;
          return (
            <PortraitVideo
              key={i}
              poster={r.poster}
              videoUrl={r.videoUrl}
              width={150}
              radius={16}
              showPlay={ready}
              topRightSlot={!ready ? (
                <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 999, letterSpacing: "0.3px" }}>FILM SOON</span>
              ) : undefined}
              bottomSlot={
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, lineHeight: "17px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{r.a} <span style={{ fontWeight: 500, opacity: 0.85 }}>vs</span> {r.b}</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", margin: "2px 0 0", lineHeight: "14px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{r.hook}</p>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function SeasonStrips({ groups }) {
  return groups.map((g, i) => (
    <div key={i} style={{ marginBottom: 24 }}>
      <SectionTitle title={g.label} sub={g.sub} />
      <div className="hs" style={{ gap: 12, paddingLeft: PAD, paddingRight: PAD }}>
        {g.dests.map(d => <SeasonCard key={d.name} d={d} />)}
      </div>
    </div>
  ));
}

function AllSix() {
  return (
    <div style={{ marginBottom: 20 }}>
      <SectionTitle title="All six countries" sub="Every country, honestly priced." />
      <div style={{ padding: `0 ${PAD}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {SIX.map(d => <GridCard key={d.name} d={d} />)}
      </div>
    </div>
  );
}

export default function HomeV4({ userState = "new" }) {
  const { deals } = useDeals();
  const isNew = userState === "new";

  const groups = useMemo(() => getSeasonGroups(new Date()), []);

  const draftDeal = deals.find(d => (d.versions || []).some(v => v.status === "draft"));
  const draftVer = draftDeal && [...draftDeal.versions].reverse().find(v => v.status === "draft");
  const draftNights = draftVer && (allItineraries.find(it => String(it.id) === String(draftVer.itineraryId))?.nights);

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.bg, paddingBottom: 88 }}>
      {/* Header — logo only; sign-in/account live in the bottom nav */}
      <div style={{ display: "flex", alignItems: "center", padding: `14px ${PAD}px 4px` }}>
        <Logo variant="lockup" height={26} />
      </div>

      {isNew ? (
        /* ─────────── NEW USER ─────────── */
        <>
          {/* Hero: value prop + proof + the assisted path as the obvious first move */}
          <div style={{ padding: `8px ${PAD}px 18px` }}>
            <div style={{ marginBottom: 12 }}><ProofRow /></div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.head, margin: "0 0 8px", letterSpacing: "-0.7px", lineHeight: "31px" }}>
              Find the one trip<br />you'll both love.
            </h1>
            <p style={{ fontSize: 14, color: C.sub, margin: "0 0 16px", lineHeight: "20px" }}>
              Honest couples' holidays across six countries. Real prices, real seasons, no tourist traps.
            </p>
            <Link to="/chat" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.p600, color: "#fff", borderRadius: 14, padding: "15px 18px", fontSize: 15.5, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 18px rgba(227,27,83,0.32)" }}>
              <Sparkles size={18} /> Help me decide
            </Link>
          </div>

          {/* Differentiator, up top (not in the footer) */}
          <div style={{ marginBottom: 24 }}>
            <SectionTitle title="Why we're different" sub="The honesty other apps skip." />
            <PromiseBand />
          </div>

          {/* Season intelligence */}
          <div id="v4-six">
            <SectionTitle title="Where to go, by season" sub="Live picks for the months ahead, told honestly." />
            <div style={{ height: 4 }} />
            <SeasonStrips groups={groups} />
          </div>

          <CompareReels />
          <AllSix />
        </>
      ) : (
        /* ─────────── RETURNING USER ─────────── */
        <>
          <div style={{ padding: `4px ${PAD}px 14px` }}>
            <p style={{ fontSize: 13, color: C.sub, margin: "0 0 2px" }}>Welcome back, Rahul &amp; Aanya</p>
            <h1 style={{ fontSize: 23, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.5px", lineHeight: "28px" }}>
              Pick up where you left off.
            </h1>
          </div>

          {draftVer && (
            <div style={{ padding: `0 ${PAD}px 22px` }}>
              <Link to={`/itinerary/${draftVer.itineraryId}?dealId=${draftDeal.id}&versionId=${draftVer.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", background: C.white, border: `1.5px solid ${C.p300}`, borderRadius: 14, padding: 12 }}>
                <img src={draftDeal.img} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0 }}>{draftVer.destination}{draftNights ? ` · ${draftNights} nights` : ""}</p>
                  <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draftVer.title} · in progress</p>
                </div>
                <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, background: C.p600, color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>Resume <ArrowRight size={14} /></span>
              </Link>
            </div>
          )}

          <SeasonStrips groups={groups} />
          <CompareReels />
          <AllSix />

          {/* Assistant still reachable, just not the hero for a returning user */}
          <div style={{ padding: `4px ${PAD}px 0` }}>
            <Link to="/chat" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.p100, color: C.p600, borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              <Sparkles size={16} /> Help me decide on a new one
            </Link>
          </div>
        </>
      )}

      {/* Social proof + closing lead-gen (both states) */}
      <div style={{ marginTop: 30 }}>
        <TravellerMoments tone="clean" pad={PAD} />
        <ReviewsStrip tone="clean" pad={PAD} />
        <LeadCloseCTA tone="clean" pad={PAD} />
      </div>
    </div>
  );
}
