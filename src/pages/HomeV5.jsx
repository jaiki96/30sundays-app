import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, IndianRupee, ShieldCheck, Heart, Star, ArrowRight } from "lucide-react";
import { C, destData, allItineraries, couplesCount } from "../data";
import { useDeals } from "../data/deals";
import PortraitVideo from "../components/home_v2/PortraitVideo";
import Logo from "../components/Logo";
import TravellerMoments from "../components/home_shared/TravellerMoments";
import ReviewsStrip from "../components/home_shared/ReviewsStrip";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import { SIX, getSeasonGroups, fromPrice, COMPARE_REELS } from "../data/homeV3Data";

const PAD = 18;
const TOTAL_COUPLES = Object.values(couplesCount).reduce((s, n) => s + n, 0);
const HERO_IMGS = [destData.Maldives.hero, destData.Bali.hero, destData.Vietnam.hero];

// ─── Lower-fold pieces (clean, premium spacing) ───
function SectionTitle({ title, sub }) {
  return (
    <div style={{ padding: `0 ${PAD}px`, marginBottom: 14 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.4px" }}>{title}</h2>
      {sub && <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 0", lineHeight: "17px" }}>{sub}</p>}
    </div>
  );
}

function SeasonCard({ d }) {
  return (
    <Link to={`/destination/${encodeURIComponent(d.name)}`} style={{ flexShrink: 0, width: 200, textDecoration: "none", borderRadius: 18, overflow: "hidden", background: C.white, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
      <div style={{ position: "relative", height: 150 }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 45%)" }} />
        <span style={{ position: "absolute", top: 11, left: 11, display: "inline-flex", alignItems: "center", gap: 4, background: d.peakNow ? "#E6F4EC" : "rgba(255,255,255,0.95)", color: d.peakNow ? "#1B5E3A" : C.head, fontSize: 10.5, fontWeight: 700, padding: "4px 9px", borderRadius: 999 }}>
          {d.peakNow && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2E7D52" }} />}
          {d.badge}
        </span>
      </div>
      <div style={{ padding: "12px 13px 13px" }}>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0 }}>{d.flag} {d.name}</p>
        <p style={{ fontSize: 11.5, color: C.sub, margin: "3px 0 7px", lineHeight: "15px" }}>{d.blurb}</p>
        <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: 0 }}>From {fromPrice(d.startPrice)} <span style={{ fontWeight: 500, color: C.inact }}>pp · 7 nights</span></p>
      </div>
    </Link>
  );
}

function LowerSections({ groups }) {
  return (
    <div style={{ paddingTop: 30, background: C.white, borderRadius: "26px 26px 0 0", marginTop: -26, position: "relative" }}>
      {/* Trust strip — refined, hairline-separated (not chunky cards) */}
      <div style={{ margin: `0 ${PAD}px 30px`, padding: "4px 0", display: "flex", borderTop: `1px solid ${C.div}`, borderBottom: `1px solid ${C.div}` }}>
        {[
          { I: IndianRupee, t: "Itemised prices", s: "No mystery markup" },
          { I: ShieldCheck, t: "Honest seasons", s: "Bad months flagged" },
          { I: Heart, t: "Couples only", s: "Never group tours" },
        ].map((x, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 8px", textAlign: "center", borderLeft: i ? `1px solid ${C.div}` : "none" }}>
            <x.I size={17} color={C.p600} style={{ marginBottom: 5 }} />
            <p style={{ fontSize: 11.5, fontWeight: 700, color: C.head, margin: 0 }}>{x.t}</p>
            <p style={{ fontSize: 10, color: C.sub, margin: "1px 0 0" }}>{x.s}</p>
          </div>
        ))}
      </div>

      {groups.map((g, i) => (
        <div key={i} style={{ marginBottom: 28 }}>
          <SectionTitle title={g.label} sub={g.sub} />
          <div className="hs" style={{ gap: 13, paddingLeft: PAD, paddingRight: PAD }}>
            {g.dests.map(d => <SeasonCard key={d.name} d={d} />)}
          </div>
        </div>
      ))}

      <div style={{ marginBottom: 28 }}>
        <SectionTitle title="Torn between two?" sub="Honest head-to-heads. No winner, just which fits you." />
        <div className="hs" style={{ gap: 13, paddingLeft: PAD, paddingRight: PAD }}>
          {COMPARE_REELS.map((r, i) => (
            <PortraitVideo key={i} poster={r.poster} videoUrl={r.videoUrl} width={158} radius={18} showPlay={!!r.videoUrl}
              topRightSlot={!r.videoUrl ? <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 999, letterSpacing: "0.3px" }}>FILM SOON</span> : undefined}
              bottomSlot={<div>
                <p style={{ fontSize: 14.5, fontWeight: 800, color: "#fff", margin: 0, lineHeight: "18px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{r.a} <span style={{ fontWeight: 500, opacity: 0.85 }}>vs</span> {r.b}</p>
                <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", margin: "2px 0 0", lineHeight: "14px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{r.hook}</p>
              </div>} />
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: 8 }}>
        <SectionTitle title="All six countries" sub="Every country, honestly priced." />
        <div style={{ padding: `0 ${PAD}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          {SIX.map(d => (
            <Link key={d.name} to={`/destination/${encodeURIComponent(d.name)}`} style={{ textDecoration: "none", borderRadius: 16, overflow: "hidden", position: "relative", height: 128 }}>
              <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }} />
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 11 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{d.name}</p>
                <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.92)", margin: "1px 0 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>From {fromPrice(d.startPrice)} pp</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeV5({ userState = "new" }) {
  const { deals } = useDeals();
  const isNew = userState === "new";
  const groups = useMemo(() => getSeasonGroups(new Date()), []);
  const [hero, setHero] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHero(h => (h + 1) % HERO_IMGS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const draftDeal = deals.find(d => (d.versions || []).some(v => v.status === "draft"));
  const draftVer = draftDeal && [...draftDeal.versions].reverse().find(v => v.status === "draft");
  const draftNights = draftVer && (allItineraries.find(it => String(it.id) === String(draftVer.itineraryId))?.nights);

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      {/* ─── Cinematic full-bleed hero ─── */}
      <div style={{ position: "relative", height: 552, overflow: "hidden" }}>
        {HERO_IMGS.map((src, i) => (
          <img key={i} src={src} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === hero ? 1 : 0, transition: "opacity 1.4s ease, transform 6s ease",
            transform: i === hero ? "scale(1.08)" : "scale(1)",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0.15) 52%, rgba(0,0,0,0.82) 100%)" }} />

        {/* Top bar — logo only; account lives in the bottom nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", padding: `16px ${PAD}px`, filter: "drop-shadow(0 1px 6px rgba(0,0,0,0.4))" }}>
          <Logo variant="lockup" height={26} mono="#fff" />
        </div>

        {/* Bottom-anchored editorial block */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `0 ${PAD}px 30px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Star size={13} fill="#FBBC05" color="#FBBC05" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.92)", letterSpacing: "0.2px" }}><b style={{ color: "#fff" }}>4.9</b> · {TOTAL_COUPLES.toLocaleString("en-IN")} couples travelled with us</span>
          </div>
          <h1 style={{ fontSize: 33, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-1px", lineHeight: "36px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
            The one trip<br />you'll both love.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", margin: "0 0 20px", lineHeight: "20px", maxWidth: 320, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            Six countries, chosen for couples. Real prices, honest seasons, no tourist traps.
          </p>
          <Link to="/chat" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: C.head, borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.28)" }}>
            <Sparkles size={18} color={C.p600} /> Help me decide
          </Link>
        </div>
      </div>

      {/* Returning-user resume, slotted just under the hero */}
      {!isNew && draftVer && (
        <div style={{ padding: `18px ${PAD}px 0` }}>
          <Link to={`/itinerary/${draftVer.itineraryId}?dealId=${draftDeal.id}&versionId=${draftVer.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", background: C.white, border: `1.5px solid ${C.p300}`, borderRadius: 14, padding: 12 }}>
            <img src={draftDeal.img} alt="" style={{ width: 50, height: 50, borderRadius: 10, objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>Resume {draftVer.destination}{draftNights ? ` · ${draftNights} nights` : ""}</p>
              <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{draftVer.title} · in progress</p>
            </div>
            <ArrowRight size={18} color={C.p600} />
          </Link>
        </div>
      )}

      <div id="v5-rest"><LowerSections groups={groups} /></div>

      {/* Social proof + closing lead-gen */}
      <TravellerMoments tone="clean" pad={PAD} />
      <ReviewsStrip tone="clean" pad={PAD} />
      <LeadCloseCTA tone="clean" pad={PAD} />

      <div style={{ height: 80 }} />
    </div>
  );
}
