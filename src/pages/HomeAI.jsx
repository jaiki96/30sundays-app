import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Images } from "lucide-react";
import { C, destData, allItineraries } from "../data";
import { useDeals } from "../data/deals";
import EduMultiCarousel from "../components/home_v2/EduMultiCarousel";
import LeadCloseCTA from "../components/home_shared/LeadCloseCTA";
import { getSeasonGroups, COMPARE_REELS } from "../data/homeV3Data";

// The home below the hero is unchanged. Only the hero itself becomes a
// carousel, so this variant reuses the existing sections as they are.
import {
  FullscreenVideo, DestCircles, LowerSections,
  AllSixCountries, TravellerMomentsReels, LovedByCouples,
} from "./HomeV5";

import { AIPhotosProvider, useAIPhotos } from "../state/useAIPhotos";
import HeroCarousel from "../components/HomeHero/HeroCarousel";
import NudgeStrip from "../components/HomeHero/NudgeStrip";
import UploadSheet from "../components/AIPhotos/UploadSheet";
import DestinationPicker from "../components/AIPhotos/DestinationPicker";
import MockLoginSheet from "../components/AIPhotos/MockLoginSheet";
import AIPhotoSettings from "../components/AIPhotos/AIPhotoSettings";
import FullScreenView from "../components/AIPhotos/FullScreenView";
import AIPhotosDevPanel, { DevPanelButton } from "../components/AIPhotos/AIPhotosDevPanel";

const PAD = 18;
const HERO_VIDEO = "https://thirtysundays-prod-content.fra1.digitaloceanspaces.com/welcome/Indonesia.mp4";

// Live marketing banners. The first one is the home's existing hero, kept
// exactly as it was so the carousel reads as an extension, not a redesign.
const MARKETING_SLIDES = [
  {
    img: destData.Maldives?.hero,
    headline: "The one trip you'll both love.",
    cta: "Plan my trip",
    to: "/build",
    showRating: true,
    video: true,
  },
  {
    img: destData.Bali?.hero,
    kicker: "In season now",
    headline: "Bali, before the crowds find it.",
    cta: "See Bali",
    to: "/destination/Bali",
  },
  {
    img: destData.Vietnam?.hero,
    kicker: "Two weeks, one coastline",
    headline: "Vietnam, north to south, together.",
    cta: "See Vietnam",
    to: "/destination/Vietnam",
  },
];

function HomeAIInner({ userState }) {
  const { deals } = useDeals();
  const isNew = userState === "new";
  const groups = useMemo(() => getSeasonGroups(new Date()), []);
  const [showVideo, setShowVideo] = useState(false);
  const { setSheet, hasPhoto, showPersonalized, hidden } = useAIPhotos();

  // Triple tap the hero to reach the reviewer panel without the floating button.
  const taps = useRef([]);
  const onHeroTap = () => {
    const now = Date.now();
    taps.current = [...taps.current, now].filter((t) => now - t < 600);
    if (taps.current.length >= 3) { taps.current = []; setSheet("dev"); }
  };

  const draftDeal = deals.find((d) => (d.versions || []).some((v) => v.status === "draft"));
  const draftVer = draftDeal && [...draftDeal.versions].reverse().find((v) => v.status === "draft");
  const draftNights = draftVer && allItineraries.find((it) => String(it.id) === String(draftVer.itineraryId))?.nights;

  const seriesLessons = COMPARE_REELS.map((c) => ({
    poster: c.poster, videoUrl: c.videoUrl, duration: c.duration,
    tag: `${c.a} vs ${c.b}`, topics: c.topics,
  }));

  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <DestCircles />

      <div onClick={onHeroTap}>
        <HeroCarousel marketingSlides={MARKETING_SLIDES} onOpenVideo={() => setShowVideo(true)} />
      </div>

      {/* Prompt to start, below the hero. Never returns once hidden or removed. */}
      <NudgeStrip destName="Bali" />

      {/* Way back into the controls once a photo exists. */}
      {hasPhoto && (showPersonalized || hidden) && (
        <div style={{ padding: `12px ${PAD}px 0` }}>
          <button
            onClick={() => setSheet("settings")}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, minHeight: 48, padding: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <Images size={15} color={C.p600} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.p600 }}>
              {hidden ? "Your photos are hidden" : "Your photos"}
            </span>
          </button>
        </div>
      )}

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

      <div style={{ paddingTop: 14 }}><LowerSections groups={groups} /></div>
      <EduMultiCarousel valueTitle="Torn between [two]?" lessons={seriesLessons} />
      <AllSixCountries />
      <TravellerMomentsReels />
      <LovedByCouples />
      <LeadCloseCTA tone="clean" pad={PAD} />

      <div style={{ height: 80 }} />

      {showVideo && <FullscreenVideo src={HERO_VIDEO} onClose={() => setShowVideo(false)} />}

      {/* Feature surfaces. All half-modal, all scoped to the phone frame. */}
      <MockLoginSheet />
      <UploadSheet />
      <DestinationPicker />
      <AIPhotoSettings />
      <FullScreenView />

      <DevPanelButton onClick={() => setSheet("dev")} />
      <AIPhotosDevPanel />
    </div>
  );
}

export default function HomeAI({ userState = "new" }) {
  return (
    <AIPhotosProvider>
      <HomeAIInner userState={userState} />
    </AIPhotosProvider>
  );
}
