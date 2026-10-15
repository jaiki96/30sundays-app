import { allItineraries, destData } from "../data";
import { activityLine } from "./activityLines";
import { activityKind } from "./activityKind";
import { regionFood } from "./regionFood";
import { destAreas, flatActivities, recommendedRoute } from "./buildData";
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

// ─── No footage ───
//
// There is none, per region, anywhere in the app. The region page used to fall
// back to the day screen's house clip, which meant every region in every
// country opened on the same close-up of a flower. A photograph of the actual
// place is a better answer than a video of somewhere else, so the hero is a
// photograph and this file holds no video at all.

const MONTH_FULL = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// A stable number from a string, so a region's demo prices and durations are
// the same every time it is opened rather than reshuffling on each render.
function seed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ─── A different picture on every card ───
//
// The catalogue asked for one image per activity and got it from the city's
// own photograph, so all nine cards in Ubud showed the same rice terrace. Worse
// than dull: nine identical photographs tell a couple the nine things are the
// same thing.
//
// There is no per-activity photography in the app, so this deals from the
// destination's landscape pool instead, round-robin by position. Every card in
// a region opens on a different picture, which is the thing that was broken.
//
// Customer photographs are deliberately not in here, though they would double
// the pool. They are pictures of couples, and a portrait of somebody's
// honeymoon standing in for a photograph of a temple is a worse lie than a
// generic landscape. They stay in the gallery, where they are labelled.
//
// The pool is small enough that the second and third pictures on a card repeat
// across cards. Only real per-activity photography fixes that.
function destPool(dest) {
  const d = destData[dest] || {};
  return [...new Set([
    ...(d.actImgs || []),
    d.hero, d.card, d.circle,
    ...(d.stayAreas || []).map((a) => a.img),
  ].filter(Boolean))];
}

// Each card starts at its own position in the pool and then steps a third of
// the way round it, so the three pictures inside one card are always different
// from each other. The pool is six to nine images deep per destination, which
// is why the second and third slots start repeating between cards after that:
// a stride is the best a short pool can do, and only real photography is better.
function dealImages(pool, i, want = 3) {
  const L = pool.length;
  if (!L) return [];
  const stride = Math.max(1, Math.floor(L / want));
  const out = [];
  for (let k = 0; k < want; k++) {
    const img = pool[(i + k * stride) % L];
    if (!out.includes(img)) out.push(img);
  }
  return out;
}

// ─── How long it takes ───
//
// Every card used to say "About 2 hours" or "Half a day", which on a rail of
// nine is the same word twice. These are still placeholders, but they are at
// least shaped by what the thing is: a market is an hour, a volcano is most of
// a day, and a beach club is however long you let it be.
const HOURS = {
  Temple: ["About an hour", "About 90 minutes", "A couple of hours"],
  Culture: ["A couple of hours", "About 90 minutes", "Half a day"],
  Market: ["About an hour", "About 90 minutes", "A couple of hours"],
  Food: ["A couple of hours", "About 90 minutes", "An evening"],
  "After dark": ["An evening", "A couple of hours", "A long evening"],
  "On foot": ["A couple of hours", "About 90 minutes", "Half a day"],
  View: ["About an hour", "About 90 minutes", "A couple of hours"],
  Nature: ["A couple of hours", "Half a day", "About 3 hours"],
  Wildlife: ["A couple of hours", "Half a day", "About 3 hours"],
  Adventure: ["Half a day", "About 3 hours", "Most of a day"],
  "On the water": ["Half a day", "Most of a day", "A full day"],
  Beach: ["Half a day", "A couple of hours", "Most of a day"],
  Relax: ["A couple of hours", "About 90 minutes", "Half a day"],
};
const hoursFor = (kind, s) => {
  const set = HOURS[kind] || HOURS.Culture;
  return set[s % set.length];
};

// ─── Why this one ───
//
// A badge on its own says nothing on a screen where everything is curated, so
// each one carries its reason. Two of the three come off the activity's own
// name, and the third off the itinerary: this is the experience the day here is
// built around, which is a fact we hold.
//
// "Most booked" is the obvious third label and it is not here, because we hold
// no booking counts and a card is not the place to start inventing them. Swap
// the string below the day it is a real number.
const PICK_RULES = [
  [/sunrise|dawn/i, "Best at sunrise"],
  [/sunset/i, "Best at sunset"],
  [/night|after dark/i, "Best after dark"],
];
const MAX_PICKS = 3;

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
  const raw = flatActivities(dest, full).filter((a) => a.city === city);
  const pool = destPool(dest);
  let picks = 0;

  const acts = raw.map((a, i) => {
    const s = seed(a.id);
    const kind = activityKind(a.name);
    // The catalogue holds a name and a photo and nothing else. The line under
    // the name is written by hand in activityLines and the tag comes from
    // activityKind, because the builder's own answers were a generic sentence
    // and the word "Point of Interest", and nine of those down one rail tell a
    // couple nothing. Prices are deliberately not shown: we hold none, and a
    // made-up number on a region page is one a consultant has to walk back on
    // a call.
    const isHeadline = headline.has(a.name);
    const named = (PICK_RULES.find(([re]) => re.test(a.name)) || [])[1];
    let pick = null;
    if (picks < MAX_PICKS) {
      pick = named || (isHeadline ? "In most itineraries" : null);
      if (pick) picks += 1;
    }
    const imgs = dealImages(pool, i);
    return {
      id: a.id,
      name: a.name,
      // The first of its own set, so a card and its carousel open on the same
      // picture and anything still reading `img` keeps working.
      img: imgs[0] || a.img,
      imgs: imgs.length ? imgs : [a.img].filter(Boolean),
      vibe: a.vibe,
      kind,
      summary: activityLine(a.name),
      recommended: isHeadline,
      pick,
      hours: hoursFor(kind, s),
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
