import { destAreas, cityCoords, monthRating } from "./buildData";
import { regionGuide } from "./regionGuide";
import { generateHotelsForCity } from "./hotelData";
import { monthWeather, SKY_WORD } from "./weatherData";

// ─── What the route step needs to know about a place ───
//
// A couple picking places is deciding on four things at once: is it worth a
// stop, how long for, what will it cost a night, and what is the weather doing
// while they are there. Nothing in the app put those four in one answer, so
// this file works them out from what we already hold.

// ─── Which airport you land at for a region ───
//
// Written into the region guide already, as the code in brackets on the flight
// leg: "Delhi to Da Nang (DAD)". The last flight leg is the one you get off at,
// which matters in the Maldives, where there are two.
export function arrivalAirport(dest, city) {
  const legs = regionGuide(dest, city)?.reach || [];
  let code = null;
  let name = null;
  legs.forEach((l) => {
    if (l.mode !== "flight") return;
    const m = (l.title || "").match(/^(?:.+?)\s+to\s+(.*?)\s*\(([A-Z]{3})\)$/);
    if (m) { name = m[1].trim(); code = m[2]; }
  });
  return code ? { code, name } : null;
}

// ─── How far apart two places are ───
const toRad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const p = cityCoords[a];
  const q = cityCoords[b];
  if (!p || !q) return null;
  const R = 6371;
  const dLat = toRad(q.lat - p.lat);
  const dLng = toRad(q.lng - p.lng);
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p.lat)) * Math.cos(toRad(q.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Places you cannot drive to, whatever the map says the distance is.
const BY_BOAT = new Set(["Nusa Penida"]);
const BY_AIR = new Set(["Labuan Bajo", "Phu Quoc", "Koh Samui"]);

export const hhmm = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// ─── Getting from one stop to the next, honestly ───
//
// This used to answer "Ha Long to Hoi An: about 3h 15m by air", which is a
// flight that does not exist. There is no airport at either end: the day is a
// car to Hanoi, a flight to Da Nang, and a car into Hoi An. So a hop is a list
// of legs now, with the change written down, and the total is the sum of the
// parts rather than a line drawn between two dots.
//
// Every figure is worked out from the distance rather than quoted, which is
// why they all say "about", and the exact transfer is confirmed when we book.
const hopCache = new Map();
export function hop(dest, from, to) {
  const key = `${dest}::${from}>${to}`;
  if (hopCache.has(key)) return hopCache.get(key);
  const out = computeHop(dest, from, to);
  hopCache.set(key, out);
  return out;
}

const carMins = (d) => Math.max(30, Math.round(((d / 55) * 60) / 15) * 15);
const flyMins = (d) => Math.round(((d / 750) * 60 + 150) / 15) * 15;

// The airport that serves a city, and the city that airport sits in. Ha Long
// is served by Hanoi's and Hoi An by Da Nang's, which is the whole reason a
// hop between those two is not one journey but three.
export function hubOf(dest, city) {
  const a = arrivalAirport(dest, city);
  if (!a) return null;
  const areas = destAreas[dest] || [];
  const match = areas.find((x) => sameName(x.city, a.name));
  return { code: a.code, name: a.name, city: match ? match.city : a.name };
}

const leg = (mode, from, to, mins, label) => ({ mode, from, to, mins, label });

function computeHop(dest, from, to) {
  const d = km(from, to);
  if (d == null) return null;
  const one = (mode, mins, label) => ({
    mode, mins, label, steps: [leg(mode, from, to, mins, label)], note: null,
  });

  if (dest === "Maldives") {
    if (d > 200) {
      const mins = Math.round((d / 500) * 60 + 90);
      return one("flight", mins, `About ${hhmm(mins)} by domestic flight`);
    }
    return one("boat", 90, "About 1h 30m by speedboat or seaplane");
  }
  if (BY_BOAT.has(from) || BY_BOAT.has(to)) {
    return one("boat", 60, "About 1h by fast boat, plus the drive to the pier");
  }

  const drivable = d <= 350 && !BY_AIR.has(from) && !BY_AIR.has(to);
  if (drivable) {
    const mins = carMins(d);
    return one("car", mins, `About ${hhmm(mins)} by road`);
  }

  const hf = hubOf(dest, from);
  const ht = hubOf(dest, to);
  const fromHub = hf && cityCoords[hf.city] ? hf : null;
  const toHub = ht && cityCoords[ht.city] ? ht : null;

  // Both ends hang off the same airport: whatever the distance says, this is
  // a drive, not a flight.
  if (fromHub && toHub && fromHub.city === toHub.city) {
    const mins = carMins(d);
    return one("car", mins, `About ${hhmm(mins)} by road`);
  }

  const steps = [];
  if (fromHub && fromHub.city !== from) {
    const m = carMins(km(from, fromHub.city) ?? 0);
    steps.push(leg("car", from, fromHub.city, m, `About ${hhmm(m)} by road to ${fromHub.city}`));
  }
  const airKm = km(fromHub?.city || from, toHub?.city || to) ?? d;
  const fm = flyMins(airKm);
  const codes = fromHub && toHub ? ` (${fromHub.code} to ${toHub.code})` : "";
  steps.push(leg("flight", fromHub?.city || from, toHub?.city || to, fm,
    `About ${hhmm(fm)} by air${codes}, airports included`));
  if (toHub && toHub.city !== to) {
    const m = carMins(km(toHub.city, to) ?? 0);
    steps.push(leg("car", toHub.city, to, m, `About ${hhmm(m)} by road to ${to}`));
  }

  const mins = steps.reduce((t, x) => t + x.mins, 0);
  if (steps.length === 1) {
    return { mode: "flight", mins, label: steps[0].label, steps, note: null };
  }

  const why = [];
  if (fromHub && fromHub.city !== from) why.push(`${from} has no airport, so the day starts with the drive to ${fromHub.city}`);
  if (toHub && toHub.city !== to) why.push(`${to} has none either, so it ends with the drive in from ${toHub.city}`);
  const changes = [...new Set([
    fromHub && fromHub.city !== from ? fromHub.city : null,
    toHub && toHub.city !== to ? toHub.city : null,
  ].filter(Boolean))];

  return {
    mode: "flight",
    mins,
    label: `About ${hhmm(mins)} door to door, changing at ${changes.join(" and ")}`,
    steps,
    note: why.length ? `${why.join(", and ")}.` : null,
  };
}


// ─── Which stops have their own airport ───
//
// The region guide already says which airport you reach a place through, so a
// place whose airport is its own name is one you can fly straight into, and
// everywhere else is a drive from one of those. It decides where a trip can
// sensibly start and finish, which is the part of route order nobody explains.
const norm = (x) => String(x).toLowerCase().replace(/[^a-z]/g, "");
// "HCMC" and "Ho Chi Minh City" are the same place, and the app writes it both
// ways, so initials count as a match.
const initials = (x) => String(x).split(/\s+/).map((w) => w[0] || "").join("").toLowerCase();
export function airportCity(dest, city) {
  const a = arrivalAirport(dest, city);
  if (!a) return null;
  const an = norm(a.name);
  const cn = norm(city);
  const same = an === cn || an.includes(cn) || cn.includes(an)
    || initials(a.name) === cn || initials(city) === an;
  return same ? a : null;
}

// ─── Stops that only connect through somewhere else ───
//
// Phu Quoc is reached by flying to Saigon and changing, and the region guide
// already says so: two flight legs instead of one. A stop like that belongs
// next to its hub in the order, because anywhere else means flying back
// through the hub regardless, which costs a morning and an extra sector.
export function transferHub(dest, city) {
  const flights = (regionGuide(dest, city)?.reach || []).filter((l) => l.mode === "flight");
  if (flights.length < 2) return null;
  const m = (flights[0].title || "").match(/\sto\s(.*?)\s*\([A-Z]{3}\)$/);
  return m ? m[1].trim() : null;
}

const sameName = (a, b) => {
  const an = norm(a);
  const bn = norm(b);
  return an === bn || an.includes(bn) || bn.includes(an)
    || initials(a) === bn || initials(b) === an;
};

// The first real problem with an order, or nothing. Used to turn down a drag
// that cannot be flown, rather than quietly selling a day in an airport.
export function routeIssue(dest, cities) {
  for (let i = 0; i < cities.length; i += 1) {
    const hubName = transferHub(dest, cities[i]);
    if (!hubName) continue;
    const hub = cities.find((c) => sameName(c, hubName));
    if (!hub) continue;
    const j = cities.indexOf(hub);
    if (Math.abs(i - j) === 1) continue;
    return {
      city: cities[i],
      hub,
      hubName,
      extra: hop(dest, cities[i], hub)?.mins || 180,
    };
  }
  return null;
}

// Time spent getting between the stops, in the order given.
export function travelMinutes(dest, cities) {
  let t = 0;
  for (let i = 0; i < cities.length - 1; i += 1) {
    t += hop(dest, cities[i], cities[i + 1])?.mins || 0;
  }
  return t;
}

// Landing somewhere without an airport means a transfer at either end of the
// holiday, so an order that starts and finishes at an airport city is worth
// about an hour and a half of driving.
const END_PENALTY = 90;
function orderCost(dest, cities) {
  let c = travelMinutes(dest, cities);
  if (!airportCity(dest, cities[0])) c += END_PENALTY;
  if (!airportCity(dest, cities[cities.length - 1])) c += END_PENALTY;
  return c;
}

// ─── The order with the least travelling in it ───
//
// Every arrangement of the stops, scored on time between them plus the cost of
// starting or finishing away from an airport. Six or seven places is a few
// thousand arrangements, which is nothing; beyond that we leave the order
// alone rather than hang the screen.
export function bestOrder(dest, cities) {
  if (cities.length < 2 || cities.length > 7) return [...cities];
  let best = null;
  let bestCost = Infinity;
  const walk = (left, acc) => {
    if (!left.length) {
      const c = orderCost(dest, acc);
      if (c < bestCost) { bestCost = c; best = [...acc]; }
      return;
    }
    for (let i = 0; i < left.length; i += 1) {
      walk([...left.slice(0, i), ...left.slice(i + 1)], [...acc, left[i]]);
    }
  };
  walk(cities, []);
  return best || [...cities];
}

// ─── What a night costs here ───
//
// The median of the hotels we would actually show for this region, so the
// figure on the route step and the prices on the region page come from the
// same place. Generated rather than quoted, which is why it is always said as
// "about".
const nightlyCache = new Map();
export function nightlyFrom(dest, city) {
  const key = `${dest}::${city}`;
  if (nightlyCache.has(key)) return nightlyCache.get(key);
  let out = null;
  try {
    const hotels = generateHotelsForCity(city, dest, "2026-11-10", "2026-11-17", 7)
      .filter((h) => Number(h.bookingScore) >= 8)
      .map((h) => Number(h.pricePerNight))
      .filter(Boolean)
      .sort((a, b) => a - b);
    if (hotels.length) {
      const mid = hotels[Math.floor(hotels.length / 2)];
      out = Math.round(mid / 500) * 500;
    }
  } catch {
    out = null;
  }
  nightlyCache.set(key, out);
  return out;
}

// How we choose the hotel once the region is in. Already written per region as
// the stay headline, which is the honest answer: not a brand, a part of town.
export function hotelRule(dest, city) {
  return regionGuide(dest, city)?.stay?.headline || null;
}

const THEMES = [
  [/beach|island|coast|sand|lagoon|seafood/i, "Beach"],
  [/surf|dive|snorkel|kayak|cruise|\bbay\b|boat|reef|manta|whale/i, "On the water"],
  [/temple|old quarter|old town|old city|history|heritage|lantern|\bart\b|museum|ruins|fort/i, "Culture"],
  [/food|market|street|dining|eats|wine|tea/i, "Food and markets"],
  [/nightlife|bars|club|rooftop|party/i, "Nightlife"],
  [/mountain|jungle|rice|cliff|karst|forest|lake|glacier|volcano|hill|valley|desert/i, "Nature"],
  [/spa|yoga|calm|slow|quiet|easy|retreat/i, "Slow days"],
];
function cityTheme(a) {
  const text = `${a.tag || ""} ${a.blurb || ""}`;
  const hit = THEMES.find(([re]) => re.test(text));
  return hit ? hit[1] : "Popular";
}

// ─── The one word that says why this city is on the list ───
//
// Three facts the app already holds, read in order: the first in the curated
// order is the one we build most trips around, a high-crowd region is the one
// everybody goes to, and a low-crowd one is the quiet alternative. Everything
// in between gets the thing it is actually for, read off its own one-liner,
// because a list where every card says "Most recommended" recommends nothing.
// No percentages: "68% chose this" was a number nobody could act on.
export function pickTag(dest, city) {
  const areas = destAreas[dest] || [];
  const i = areas.findIndex((a) => a.city === city);
  if (i < 0) return null;
  if (i === 0) return "Most recommended";
  if (areas[i].crowd === "High") return "Most visited";
  if (areas[i].crowd === "Low") return "Offbeat";
  return cityTheme(areas[i]);
}

// How busy this city is, in the words the dates step already uses. Per city,
// not per month: every card reading "Fewer people, cheaper" was the season
// talking, and the season is the same everywhere in the country.
export function crowdWord(dest, city) {
  const a = (destAreas[dest] || []).find((x) => x.city === city);
  if (!a) return null;
  if (a.crowd === "High") return "Busiest";
  if (a.crowd === "Low") return "Quietest, cheapest";
  return "Fewer people, cheaper";
}

// The weather for the month they are actually travelling, not an average year.
export function monthFor(dest, startDate) {
  const m = startDate ? new Date(startDate).getMonth() : new Date().getMonth();
  const w = monthWeather(dest, m);
  return {
    m,
    name: ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"][m],
    season: monthRating(dest, m),
    sky: w?.sky,
    word: SKY_WORD[w?.sky] || null,
    high: w?.high,
    low: w?.low,
  };
}
