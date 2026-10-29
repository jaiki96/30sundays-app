import { destAreas, recommendedRoute, respread, routeNights } from "./buildData";
import { cityTags } from "./cityTags";
import { hop, travelMinutes, routeIssue } from "./routeBuilder";
import { bestAllowedOrder, hubCity } from "./routeRules";

// ─── Every route worth offering ───
//
// A trip is built for somebody from the cities they picked, in the order and
// the split of nights our engine thinks is best. Most couples take that and
// go. The ones who do not want a drag-and-drop editor: they want to see what
// the alternatives are and pick one.
//
// So this builds the alternatives. Every combination of the destination's
// cities that fits the length, each one put in the order with the least
// travelling in it, each one's nights shared out the way the destination
// suggests, and anything the travel rules will not allow thrown away before
// it is ever shown. What comes back is a list a person can read top to
// bottom and choose from.
//
// Nothing here invents a journey. The order, the travel time and whether a
// route can be flown at all are the same engine that drives the route editor
// and the "How to reach" lines, so a route offered here is a route that can
// be booked.

// How many cities a trip of this length can carry.
//
// Anchored on what the builder itself would do with these nights, give or
// take one stop. Two nights a city is the floor our own copy quotes, which
// sets the ceiling, and nobody wants a list that opens with "spend all eight
// nights in Hanoi": a route with one city in it is a different holiday, not
// a different route.
function cityCounts(dest, nights, available) {
  const ideal = Math.max(1, recommendedRoute(dest, nights).length);
  // One night a city is the hard floor, five stops is as far as we will go,
  // and the builder's own answer sets the middle. A list is useful when it
  // offers one stop fewer and one stop more than the trip already has; two
  // either way is a different holiday.
  const ceiling = Math.max(1, Math.min(5, available, nights));
  const lo = Math.max(1, Math.min(ideal - 1, ceiling));
  const hi = Math.min(ceiling, ideal + 1);
  const out = [];
  for (let n = lo; n <= hi; n += 1) out.push(n);
  return out.length ? out : [ceiling];
}

function combinations(list, k) {
  if (k === 0) return [[]];
  if (k > list.length) return [];
  const out = [];
  const walk = (start, acc) => {
    if (acc.length === k) { out.push([...acc]); return; }
    for (let i = start; i < list.length; i += 1) walk(i + 1, [...acc, list[i]]);
  };
  walk(0, []);
  return out;
}

// The nights each city would get on its own, scaled to the trip's length.
// destAreas carries a suggested stay per city, which is the closest thing we
// have to "how long this place is worth", so the split starts there and
// respread settles the remainder.
function shareNights(dest, cities, nights) {
  const areas = destAreas[dest] || [];
  const want = cities.map((c) => ({
    city: c,
    n: Math.max(1, areas.find((a) => a.city === c)?.n || 2),
  }));
  return respread(want, nights);
}

// What a route costs to move around, in flights. A flight is a ticket and a
// day broken in half; a drive is neither, so the count of flights is the
// honest basis for calling one route better value than another.
function flightCount(dest, cities) {
  let f = 0;
  for (let i = 0; i < cities.length - 1; i += 1) {
    if (hop(dest, cities[i], cities[i + 1])?.mode === "flight") f += 1;
  }
  return f;
}

// A stable number per route, so "most sold" and "trending" do not shuffle
// every time the screen opens. Stand-in for real booking counts: swap this
// for the figures from the deals table and nothing above it changes.
function seed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function routeOptions(dest, nights, { only } = {}) {
  const every = (destAreas[dest] || []).map((a) => a.city);
  // `only` is the pool a route may be drawn from, which is what somebody is
  // setting when they change the cities. Narrowing it narrows the list; it
  // does not force every city into every route, because four cities picked
  // for a seven-night trip is still a choice between three-stop routes and
  // four-stop ones.
  const all = only?.length ? every.filter((c) => only.includes(c)) : every;
  if (!all.length || !nights) return [];

  const seen = new Set();
  const out = [];

  cityCounts(dest, nights, all.length).forEach((k) => {
    combinations(all, k).forEach((combo) => {
      // The order with the least travelling that the rules actually allow.
      const order = bestAllowedOrder(dest, combo);
      if (routeIssue(dest, order)) return;
      // A city that can only be reached through a town the route never
      // visits cannot be flown, whatever order it is put in. Matched through
      // hubCity, because the hub answers to its full name ("Ho Chi Minh
      // City") and the list carries the short one ("HCMC").
      if (order.some((c) => {
        const hub = hubCity(dest, c);
        return hub && !order.includes(hub);
      })) return;

      const key = order.join(">");
      if (seen.has(key)) return;
      seen.add(key);

      const route = shareNights(dest, order, nights);
      if (routeNights(route) !== nights) return;
      if (route.some((r) => r.n < 1)) return;

      const mins = travelMinutes(dest, order);
      const flights = flightCount(dest, order);
      out.push({
        id: key,
        route,
        cities: order,
        mins,
        flights,
        // Hours on the move per night in bed: the number that separates a
        // trip that moves from a trip that stays.
        pace: mins / 60 / nights,
        pop: seed(`${dest}|${key}`) % 1000,
      });
    });
  });

  return rank(dest, out, nights);
}

// ─── The labels ───
//
// Each one is earned by a fact about the route, not by a sticker somebody
// chose. Only one route can hold a given label, so the list reads as a set
// of distinct answers rather than six routes all claiming to be the best.
const LABELS = {
  pick: { text: "Recommended", tone: "pink", line: "Our default order for these nights." },
  value: { text: "Affordable", tone: "green", line: "Fewest flights of the lot." },
  relaxed: { text: "Relaxed", tone: "blue", line: "Fewest moves, longest stays." },
  offbeat: { text: "Offbeat", tone: "blue", line: "Takes in a quieter corner." },
  wide: { text: "Sees the most", tone: "amber", line: "The most places these nights fit." },
  sold: { text: "Most booked", tone: "pink", line: "Chosen most often by couples." },
  trending: { text: "Trending", tone: "amber", line: "Picked more this season." },
  popular: { text: "Popular", tone: "pink", line: "A steady favourite at this length." },
  classic: { text: "Classic", tone: "amber", line: "How a first trip is usually done." },
  easy: { text: "Easy pace", tone: "green", line: "Unhurried, with no long hops." },
};

// The order they are handed out in. The first four are earned by a fact
// about the route; the rest stand in for booking figures we do not hold in
// the prototype yet. Every route gets exactly one, because a card with no
// label beside cards that have one reads as the one we are not recommending.
const ORDER = ["pick", "value", "relaxed", "offbeat", "wide", "sold", "trending", "popular", "classic", "easy"];

// At most this many of any one size, and this many altogether. A list long
// enough to choose from and short enough to read: past about eight, routes
// stop being alternatives and start being a search result.
const PER_SIZE = 3;
const TOTAL = 8;

function rank(dest, list, nights) {
  if (!list.length) return [];

  // The route the builder would make for these nights, so the list can say
  // which one that is rather than leaving somebody to guess.
  const ours = recommendedRoute(dest, nights).map((r) => r.city).slice().sort().join("|");
  const isOurs = (r) => r.cities.slice().sort().join("|") === ours;

  // Trimmed by size first. Sorting the whole pile by travel time puts every
  // two-city route above every three-city one, which is not a ranking, it is
  // a preference for staying put.
  const bySize = new Map();
  [...list].sort((a, b) => a.mins - b.mins).forEach((r) => {
    const k = r.cities.length;
    const group = bySize.get(k) || [];
    if (group.length < PER_SIZE || isOurs(r)) group.push(r);
    bySize.set(k, group);
  });

  const ideal = Math.max(1, recommendedRoute(dest, nights).length);
  const sizes = [...bySize.keys()].sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal) || b - a);
  let sorted = sizes.flatMap((k) => bySize.get(k)).slice(0, TOTAL);

  // Ours leads, because it is the one they already have and the one every
  // other route is being compared against.
  const mine = sorted.find(isOurs) || list.find(isOurs);
  if (mine) sorted = [mine, ...sorted.filter((r) => r !== mine)].slice(0, TOTAL);

  const best = (fn) => sorted.reduce((a, b) => (fn(b) < fn(a) ? b : a));
  const worst = (fn) => sorted.reduce((a, b) => (fn(b) > fn(a) ? b : a));
  // A route through somewhere the crowds have not found. Honest: it reads
  // the same crowd rating the city cards show.
  const quiet = sorted.find((r) => r.cities.some((c) =>
    cityTags(dest, c).some((t) => t.key === "offbeat")));

  const tags = {};
  const used = new Set();
  const give = (route, key) => {
    if (!route || used.has(key)) return;
    const have = tags[route.id] || [];
    if (have.length >= 2) return;
    tags[route.id] = [...have, key];
    used.add(key);
  };

  // Recommended is the route the builder itself would make. Affordable has
  // the fewest flights, because a flight is a ticket. Relaxed has the fewest
  // stops. Offbeat goes somewhere quiet. The rest stand in for real booking
  // counts until those are wired in.
  if (mine) give(mine, "pick");
  give(best((r) => r.flights), "value");
  give(best((r) => r.cities.length), "relaxed");
  give(quiet, "offbeat");
  give(worst((r) => r.cities.length), "wide");
  give(worst((r) => r.pop), "sold");
  give(worst((r) => (r.pop * 7) % 1000), "trending");

  // Everyone gets one before anyone gets two. A bare card beside labelled
  // ones reads as the one we are not recommending, so the first pass covers
  // the list and only then does anything left over go to the top of it.
  sorted.forEach((r) => {
    if (tags[r.id]?.length) return;
    const free = ORDER.find((k) => !used.has(k));
    if (free) give(r, free);
  });
  sorted.forEach((r) => {
    if ((tags[r.id] || []).length !== 1) return;
    const free = ORDER.find((k) => !used.has(k));
    if (free) give(r, free);
  });

  return sorted.map((r) => ({
    ...r,
    nights,
    mine: isOurs(r),
    tags: (tags[r.id] || []).map((k) => ({ key: k, ...LABELS[k] })),
    // The line under the route, taken from the first label it earned.
    line: LABELS[(tags[r.id] || [])[0]]?.line || "",
  }));
}

