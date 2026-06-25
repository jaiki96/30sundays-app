// Discover-flow data, assembled from the existing build + destination layers.
// Regions reference real cities in destAreas (so route-gen + activities work).

import { destData, getItinerariesForDest } from "../data";
import { destMeta } from "./buildData";
import { destAreas, areaImg, flatActivities, recommendedRoute, visaShort } from "./buildData";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Cities that are a day-trip, not somewhere you sleep. Honest base/day-trip split.
const DAY_TRIP_CITIES = {
  Bali: ["Nusa Penida", "Uluwatu"],
};
export function isDayTrip(dest, city) {
  return (DAY_TRIP_CITIES[dest] || []).includes(city);
}

// Pros/cons from destData.stayAreas where available, else a light fallback.
function prosCons(dest, city, crowd) {
  const sa = destData[dest]?.stayAreas?.find(a => a.name === city);
  if (sa) return { pros: sa.pros || [], cons: sa.cons || [] };
  return {
    pros: [],
    cons: crowd === "High" ? ["Can get busy in peak season"] : [],
  };
}

// Regions for a destination: real, route-able areas with base/day-trip tag.
export function regionsFor(dest) {
  return (destAreas[dest] || []).map((a, i) => ({
    city: a.city,
    emoji: a.emoji,
    n: a.n,
    crowd: a.crowd,
    blurb: a.blurb,
    img: areaImg(dest, a.city, i),
    dayTrip: isDayTrip(dest, a.city),
    ...prosCons(dest, a.city, a.crowd),
  }));
}
export function regionByCity(dest, city) {
  return regionsFor(dest).find(r => r.city === city) || null;
}

// A deterministic short "video length" label for an activity (no randomness).
function durLabel(name) {
  const secs = 14 + ((name.length * 7) % 16); // 0:14–0:29, stable per name
  return `0:${String(secs).padStart(2, "0")}`;
}

// Saveable experiences across the whole destination, from the activity pool.
export function activitiesFor(dest, limit = 12) {
  const full = recommendedRoute(dest, 60); // long route → covers all areas
  return flatActivities(dest, full).slice(0, limit).map(a => ({
    id: a.id, name: a.name, city: a.city, vibe: a.vibe, img: a.img, dur: durLabel(a.name),
  }));
}
export function activityById(dest, id) {
  return activitiesFor(dest, 999).find(a => a.id === id) || null;
}

// Compress a month-abbrev list into ranges, e.g. ["Feb","Mar","Nov","Dec"] → "Feb–Mar, Nov–Dec".
function monthsToRanges(arr) {
  const idx = arr.map(m => MONTHS.indexOf(m)).filter(i => i >= 0).sort((a, b) => a - b);
  if (!idx.length) return "";
  const runs = [];
  let start = idx[0], prev = idx[0];
  for (let k = 1; k < idx.length; k++) {
    if (idx[k] === prev + 1) { prev = idx[k]; continue; }
    runs.push([start, prev]); start = idx[k]; prev = idx[k];
  }
  runs.push([start, prev]);
  return runs.map(([a, b]) => a === b ? MONTHS[a] : `${MONTHS[a]}–${MONTHS[b]}`).join(", ");
}

// Practical "good to know" facts (visa, flights, best months, ideal nights).
export function goodToKnow(dest) {
  const dd = destData[dest] || {};
  const meta = destMeta[dest] || {};
  return {
    visa: visaShort(dest),
    flights: dd.flights || "",
    bestMonths: monthsToRanges(meta.peak || []),
    idealNights: dd.idealNights || "",
  };
}

// 2–3 curated starter routes (existing itineraries), framed as starting points.
export function starterRoutes(dest, limit = 3) {
  return (getItinerariesForDest(dest) || []).slice(0, limit);
}
