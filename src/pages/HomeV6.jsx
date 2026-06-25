import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { C, destData, allItineraries, couplesCount } from "../data";
import { useDeals } from "../data/deals";
import PortraitVideo from "../components/home_v2/PortraitVideo";
import Logo from "../components/Logo";
import TravellerMoments from "../components/home_shared/TravellerMoments";
import ReviewsStrip from "../components/home_shared/ReviewsStrip";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import { SIX, getSeasonGroups, fromPrice, COMPARE_REELS } from "../data/homeV3Data";

const PAD = 22;
const SERIF = "'Hoefler Text', 'Iowan Old Style', Garamond, Georgia, serif";
const TOTAL_COUPLES = Object.values(couplesCount).reduce((s, n) => s + n, 0);

// Numbered editorial section header with a hairline rule.
function EditorialHead({ num, title, sub }) {
  return (
    <div style={{ padding: `0 ${PAD}px`, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, borderTop: `1px solid ${C.head}`, paddingTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.p600, fontFeatureSettings: "'tnum'" }}>{num}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: C.head, margin: 0, letterSpacing: "-0.2px" }}>{title}</h2>
          {sub && <p style={{ fontSize: 12.5, color: C.sub, margin: "4px 0 0", lineHeight: "17px" }}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function SeasonCard({ d }) {
  return (
    <Link to={`/destination/${encodeURIComponent(d.name)}`} style={{ flexShrink: 0, width: 210, textDecoration: "none" }}>
      <div style={{ position: "relative", height: 250, borderRadius: 4, overflow: "hidden" }}>
        <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.95)", color: d.peakNow ? "#1B5E3A" : C.head, fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 2, letterSpacing: "0.3px", textTransform: "uppercase" }}>{d.badge}</span>
        <div style={{ position: "absolute", left: 13, right: 13, bottom: 13 }}>
          <p style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "#fff", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>{d.name}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.92)", margin: "2px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{d.blurb}</p>
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: C.head, margin: "9px 2px 0" }}>From {fromPrice(d.startPrice)} <span style={{ fontWeight: 400, color: C.inact }}>pp · 7 nights</span></p>
    </Link>
  );
}

export default function HomeV6({ userState = "new" }) {
  const { deals } = useDeals();
  const isNew = userState === "new";
  const groups = useMemo(() => getSeasonGroups(new Date()), []);

  const draftDeal = deals.find(d => (d.versions || []).some(v => v.status === "draft"));
  const draftVer = draftDeal && [...draftDeal.versions].reverse().find(v => v.status === "draft");
  const draftNights = draftVer && (allItineraries.find(it => String(it.id) === String(draftVer.itineraryId))?.nights);

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: "#FBFAF8" }}>
      {/* Masthead — logo only; account lives in the bottom nav */}
      <div style={{ display: "flex", alignItems: "center", padding: `18px ${PAD}px 6px` }}>
        <Logo variant="lockup" height={24} />
      </div>

      {/* Editorial hero */}
      <div style={{ padding: `10px ${PAD}px 4px` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.p600, letterSpacing: "1.4px", textTransform: "uppercase", margin: "0 0 12px" }}>
          Issue 01 · Couples' travel
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: C.head, margin: "0 0 14px", letterSpacing: "-0.8px", lineHeight: "43px" }}>
          Six countries.<br />One trip you'll<br />both love.
        </h1>
        <p style={{ fontSize: 14.5, color: C.sub, margin: "0 0 18px", lineHeight: "21px", maxWidth: 330 }}>
          We plan honest holidays for two. Real prices, real seasons, and the bad months named out loud.
        </p>
      </div>

      {/* Framed cover photograph */}
      <div style={{ padding: `0 ${PAD}px` }}>
        <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", height: 320 }}>
          <img src={destData.Maldives.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
          <p style={{ position: "absolute", left: 16, bottom: 14, fontSize: 11, color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "0.3px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            <Star size={11} fill="#FBBC05" color="#FBBC05" style={{ verticalAlign: "-1px" }} /> 4.9 · {TOTAL_COUPLES.toLocaleString("en-IN")} couples travelled with us
          </p>
        </div>
      </div>

      {/* Understated CTA */}
      <div style={{ padding: `20px ${PAD}px 30px`, display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/chat" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.head, color: "#fff", borderRadius: 999, padding: "13px 22px", fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
          Help me decide <ArrowRight size={16} />
        </Link>
        <a href="#v6-six" onClick={(e) => { e.preventDefault(); document.getElementById("v6-six")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontSize: 13.5, fontWeight: 600, color: C.head, textDecoration: "underline", textUnderlineOffset: 4, textDecorationColor: C.inact }}>
          Browse the six
        </a>
      </div>

      {/* Returning-user resume */}
      {!isNew && draftVer && (
        <div style={{ padding: `0 ${PAD}px 26px` }}>
          <Link to={`/itinerary/${draftVer.itineraryId}?dealId=${draftDeal.id}&versionId=${draftVer.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", borderTop: `1px solid ${C.head}`, paddingTop: 14 }}>
            <img src={draftDeal.img} alt="" style={{ width: 52, height: 52, borderRadius: 4, objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.head, margin: 0 }}>Continue your {draftVer.destination} trip</p>
              <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>{draftVer.title}{draftNights ? ` · ${draftNights} nights` : ""}</p>
            </div>
            <ArrowUpRight size={18} color={C.p600} />
          </Link>
        </div>
      )}

      {/* The honest promise, as an editorial pull-quote */}
      <div style={{ margin: `0 ${PAD}px 32px`, padding: "0 0 4px" }}>
        <p style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, fontStyle: "italic", color: C.head, margin: 0, lineHeight: "29px" }}>
          "We itemise every rupee, flag the bad seasons, and only plan trips for two. Even when honesty costs us the sale."
        </p>
      </div>

      {/* Sections */}
      <div id="v6-six" style={{ marginBottom: 30 }}>
        <EditorialHead num="01" title="In season now" sub="Live picks for the months ahead, told honestly." />
        {groups.map((g, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <p style={{ padding: `0 ${PAD}px`, fontSize: 12.5, fontWeight: 700, color: C.head, margin: "0 0 10px", letterSpacing: "0.2px" }}>{g.label}</p>
            <div className="hs" style={{ gap: 14, paddingLeft: PAD, paddingRight: PAD }}>
              {g.dests.map(d => <SeasonCard key={d.name} d={d} />)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 30 }}>
        <EditorialHead num="02" title="Torn between two?" sub="Honest head-to-heads. No winner, just which fits you." />
        <div className="hs" style={{ gap: 14, paddingLeft: PAD, paddingRight: PAD }}>
          {COMPARE_REELS.map((r, i) => (
            <PortraitVideo key={i} poster={r.poster} videoUrl={r.videoUrl} width={162} radius={4} showPlay={!!r.videoUrl}
              topRightSlot={!r.videoUrl ? <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 2, letterSpacing: "0.3px" }}>FILM SOON</span> : undefined}
              bottomSlot={<div>
                <p style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: "#fff", margin: 0, lineHeight: "20px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{r.a} <span style={{ fontStyle: "italic", fontWeight: 400, opacity: 0.9 }}>vs</span> {r.b}</p>
                <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.9)", margin: "3px 0 0", lineHeight: "14px", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{r.hook}</p>
              </div>} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <EditorialHead num="03" title="All six countries" sub="Every country, honestly priced." />
        <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column" }}>
          {SIX.map((d, i) => (
            <Link key={d.name} to={`/destination/${encodeURIComponent(d.name)}`} style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", padding: "13px 0", borderBottom: `1px solid ${C.div}` }}>
              <img src={d.img} alt={d.name} style={{ width: 66, height: 66, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: C.head, margin: 0 }}>{d.name}</p>
                <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.blurb}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: C.head, margin: 0 }}>{fromPrice(d.startPrice)}</p>
                <p style={{ fontSize: 10, color: C.inact, margin: "1px 0 0" }}>pp</p>
              </div>
              <ArrowUpRight size={17} color={C.inact} />
            </Link>
          ))}
        </div>
      </div>

      {/* Social proof + closing lead-gen */}
      <TravellerMoments tone="editorial" pad={PAD} />
      <ReviewsStrip tone="editorial" pad={PAD} />
      <div style={{ height: 8 }} />
      <LeadCloseCTA tone="editorial" pad={PAD} />

      <div style={{ height: 80 }} />
    </div>
  );
}
