// Turn a wishlist (saved regions + activities) into a few honest routes.
// Reuses the build layer for nights, pricing and the itinerary handoff.

import { routeNights, estimatePerPerson, formatINR } from "./buildData";
import { isDayTrip, regionByCity, activityById } from "./discoverData";

const typ = (dest, city) => regionByCity(dest, city)?.n || 2;

// Distribute `nights` across an ordered set of base cities. Each wants its
// typical nights; overflow drops from the end, leftover lands on the last stop.
function packBases(dest, cities, nights) {
  const segs = []; let rem = nights; const leftOut = [];
  for (const c of cities) {
    if (rem <= 0) { leftOut.push(c); continue; }
    const n = Math.min(typ(dest, c), rem);
    segs.push({ city: c, n }); rem -= n;
  }
  if (rem > 0 && segs.length) segs[segs.length - 1].n += rem;
  return { segs, leftOut };
}

// Pick which bases to use for a given pace.
function basesForPace(dest, bases, nights, pace) {
  if (pace === "chill") {
    const maxBases = Math.max(1, Math.min(bases.length, Math.floor(nights / 3) || 1));
    return bases.slice(0, maxBases);
  }
  if (pace === "packed") return bases.slice(0, Math.min(bases.length, nights));
  // balanced: as many as fit at a typical pace
  let sum = 0; const out = [];
  for (const c of bases) { sum += typ(dest, c); out.push(c); if (sum >= nights) break; }
  return out;
}

function sumTyp(dest, cities) { return cities.reduce((s, c) => s + typ(dest, c), 0); }

// Build one route option from a chosen base set.
function makeRoute(dest, { key, title, recommended, paceLabel, cities, nights, dayTrips, activities, allBases, noteOverride }) {
  const { segs } = packBases(dest, cities, nights);
  const segCities = segs.map(s => s.city);
  const covered = new Set([...segCities, ...dayTrips]);
  // Coverage across all saves (regions + day trips + activities).
  const coveredActs = activities.filter(a => covered.has(a.city));
  const total = allBases.length + dayTrips.length + activities.length;
  const coveredCount = segCities.length + dayTrips.length + coveredActs.length;
  const leftOutBases = allBases.filter(c => !covered.has(c));
  const leftOutActs = activities.filter(a => !covered.has(a.city)).map(a => a.name);
  const inItems = [...segCities, ...dayTrips, ...coveredActs.map(a => a.name)];
  const leftOutNames = [...leftOutBases, ...leftOutActs];
  const n = routeNights(segs);
  return {
    key, title, recommended, paceLabel,
    nights: n,
    segs, dayTrips,
    covered: coveredCount, total,
    inItems, leftOutNames,
    note: noteOverride || (leftOutBases.length ? `Leaves out: ${leftOutBases.join(", ")}` : "Fits everything you saved."),
    perPerson: estimatePerPerson(dest, n),
  };
}

const sig = (r) => r.segs.map(s => `${s.city}${s.n}`).join("|");

// Main entry: returns { empty, needsBase, bases, dayTrips, total, routes }.
export function generateRoutes({ dest, savedRegions = [], savedActivities = [], nights = 7, pace = "balanced" }) {
  const bases = savedRegions.filter(c => !isDayTrip(dest, c));
  const dayTrips = savedRegions.filter(c => isDayTrip(dest, c));
  const activities = savedActivities.map(id => activityById(dest, id)).filter(Boolean);
  const total = savedRegions.length + savedActivities.length;

  if (bases.length === 0) {
    return { empty: total === 0, needsBase: total > 0, bases, dayTrips, total, routes: [] };
  }

  const routes = [];

  // 1. Recommended — best fit into the requested nights at the chosen pace.
  const chosen = basesForPace(dest, bases, nights, pace);
  routes.push(makeRoute(dest, {
    key: "best", title: "Best of your saves", recommended: true, paceLabel: pace,
    cities: chosen, nights, dayTrips, activities, allBases: bases,
  }));

  // 2. All your places — only if everything doesn't already fit comfortably.
  const nightsAll = sumTyp(dest, bases);
  if (bases.length >= 2 && nightsAll > nights) {
    routes.push(makeRoute(dest, {
      key: "all", title: "All your places", recommended: false, paceLabel: "balanced",
      cities: bases, nights: nightsAll, dayTrips, activities, allBases: bases,
      noteOverride: `Fitting all your bases comfortably needs ${nightsAll} nights, not ${nights}. We won't cram it into less.`,
    }));
  }

  // 3. Slow & easy — fewer places, more time (only if it differs).
  if (bases.length > 2 || pace !== "chill") {
    const slowCities = bases.slice(0, Math.min(2, bases.length));
    routes.push(makeRoute(dest, {
      key: "slow", title: "Slow & easy", recommended: false, paceLabel: "chill",
      cities: slowCities, nights, dayTrips, activities, allBases: bases,
      noteOverride: bases.length > 2
        ? `Fewer places, more time. Leaves out: ${bases.slice(2).join(", ")}`
        : "Fewer places, more time.",
    }));
  }

  // De-dupe identical routes (e.g. when ≤2 bases collapse the variants).
  const seen = new Set();
  const unique = routes.filter(r => { const s = sig(r); if (seen.has(s)) return false; seen.add(s); return true; });

  return { empty: false, needsBase: false, bases, dayTrips, total, routes: unique };
}

export { formatINR };
