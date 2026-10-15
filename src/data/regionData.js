import { allItineraries, destData } from "../data";
import { activityLine } from "./activityLines";
import { activityKind } from "./activityKind";
import { regionFood } from "./regionFood";
import { destAreas, areaImg, flatActivities, recommendedRoute } from "./buildData";
import { regionsFor, isDayTrip } from "./discoverData";
import { cityVibes } from "./dayOptions";
import { regionGuide } from "./regionGuide";
import { monthWeather } from "./weatherData";
import { monthRating as seasonOf } from "./buildData";

// ─── Everything one region needs ───
//
// Assembled from what the app already knows rather than written out again, so
// a region page can never disagree with the itineraries that sell it: the
// activities come from the same pool the wizard picks from, the pros and cons
// from the stay-area notes, and the trips are the real ones that stop here.

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// ─── Footage for the hero ───
//
// There is no region footage in the app yet: the one hosted clip the home
// screen pointed at returns a 404, and the only video file that actually
// exists is the house clip used by the day screen. That stands in here so the
// behaviour is visible, and it is a placeholder, not content. Drop a real file
// per region into REGION_VIDEO and it takes over; a region with nothing falls
// back to its photograph, which is what a missing or broken file does too.
const HOUSE_CLIP = "/day-video.mp4";
export const REGION_VIDEO = {};
const videoFor = (dest, city) => REGION_VIDEO[`${dest}::${city}`] || HOUSE_CLIP;

const MONTH_FULL = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// A stable number from a string, so a region's demo prices and durations are
// the same every time it is opened rather than reshuffling on each render.
function seed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ─── What a month is like here ───
//
// The climate is the destination's, not the region's: we hold one set of
// averages per country. The page says so rather than implying we measured
// Ubud. The verdict comes from the same peak/shoulder/off call the calendar
// uses, so a month cannot read "best" here and "off-season" there.
export function regionMonths(dest) {
  return MONTH_FULL.map((name, m) => {
    const w = monthWeather(dest, m);
    const r = seasonOf(dest, m);
    return {
      m, letter: MONTHS[m], name,
      rating: r,
      verdict: r === "peak" ? "Best" : r === "shoulder" ? "Okay" : "Quiet",
      high: w?.high, low: w?.low, rain: w?.rain,
      sky: w?.sky, rainWord: w?.rainWord,
    };
  });
}

// Roughly how many days of rain a month's millimetres implies. Stated as a
// rounded guide, not a measurement.
const rainDays = (mm) => (mm == null ? null : Math.min(28, Math.round(mm / 11)));

export function regionDetail(dest, city) {
  const region = regionsFor(dest).find((r) => r.city === city);
  if (!region) return null;

  const area = (destAreas[dest] || []).find((a) => a.city === city) || {};
  const full = recommendedRoute(dest, 60);

  // ─── What we put our name to ───
  //
  // Each city's activities are grouped by the kind of day they make, and the
  // first in each group is the one that day gets built around. Those are the
  // ones marked recommended. Nothing random: it is the same ordering the day
  // planner reads, so a tag here means the same thing as it does there.
  const headline = new Set(
    (cityVibes[city] || []).map((v) => v.activities?.[0]).filter(Boolean)
  );

  // Experiences that actually belong to this city, from the wizard's own pool.
  const acts = flatActivities(dest, full)
    .filter((a) => a.city === city)
    .map((a) => {
      const s = seed(a.id);
      // The catalogue holds a name and a photo and nothing else. The line
      // under the name is written by hand in activityLines and the tag comes
      // from activityKind, because the builder's own answers were a generic
      // sentence and the word "Point of Interest", and nine of those down one
      // rail tell a couple nothing. Prices are deliberately not shown: we hold
      // none, and a made-up number on a region page is one a consultant has to
      // walk back on a call.
      return {
        id: a.id,
        name: a.name,
        img: a.img,
        vibe: a.vibe,
        kind: activityKind(a.name),
        summary: activityLine(a.name),
        recommended: headline.has(a.name),
        // A placeholder, deterministic so it never jumps about.
        hours: s % 3 === 0 ? "Half a day" : "About 2 hours",
      };
    });

  // Photos for the hero: the region's own shot first, then its activities.
  const photos = [...new Set([
    region.img,
    ...(destData[dest]?.actImgs || []),
    destData[dest]?.hero,
    ...acts.map((a) => a.img),
  ].filter(Boolean))].slice(0, 10);

  // The other places people pair this with, by the nights we suggest there.
  const paired = regionsFor(dest)
    .filter((r) => r.city !== city)
    .slice(0, 6);

  // Trips that genuinely stop here.
  const trips = allItineraries.filter(
    (it) => it.dest === dest && (it.route || []).some((s) => s.city === city)
  );

  const guide = regionGuide(dest, city);
  const months = regionMonths(dest);

  // The longest unbroken stretch of peak months. Reading the first and last
  // peak month off the year gave "Best Feb to Dec" for Vietnam, which is a
  // list with holes in it rather than a season.
  const peak = months.map((x) => x.rating === "peak");
  let best = null, runStart = null;
  for (let i = 0; i < 24; i++) {
    const m = i % 12;
    if (peak[m]) {
      if (runStart == null) runStart = i;
      const len = i - runStart + 1;
      if (len <= 12 && (!best || len > best.len)) best = { start: runStart, len };
    } else {
      runStart = null;
    }
  }
  const bestMonths = best && best.len < 12
    ? `${months[best.start % 12].name.slice(0, 3)} to ${months[(best.start + best.len - 1) % 12].name.slice(0, 3)}`
    : best ? "All year" : null;

  return {
    dest,
    city,
    // How to get there, how to move around, and what to book: written out in
    // regionGuide because no part of the itinerary data carries it.
    guide,
    emoji: area.emoji,
    blurb: region.blurb,
    crowd: region.crowd,
    nights: region.n,
    dayTrip: isDayTrip(dest, city),
    theme: area.tag,
    photos,
    hero: photos[0] || destData[dest]?.hero,
    video: videoFor(dest, city),
    pros: guide?.why || region.pros || [],
    cons: guide?.whyNot || region.cons || [],
    acts,
    paired,
    trips,
    months,
    bestMonths,
    food: regionFood(dest, city),
  };
}
