import { destAreas, destMeta, routeNights } from "./buildData";
import {
  airportCity, arrivalAirport, hop, hhmm, routeIssue, travelMinutes, bestOrder, transferHub,
} from "./routeBuilder";

// ─── What a route is allowed to be ───
//
// The route step of the wizard chooses cities and we work out the order and
// the nights. This file is for the other direction: somebody who has done
// their research opening the order up and changing it, and the app saying,
// before they commit to anything, what works and what does not.
//
// Two tiers, on purpose. Some things cannot be done at all: Phu Quoc only
// connects through Saigon, so a route with Phu Quoc and no Saigon beside it is
// a route nobody can fly. Those are held at the moment they are tried, and
// held again at Save if they got in some other way (removing Saigon, say).
// Everything else is a cost rather than a wall: a drive at the start of the
// holiday, an order that doubles back. Those are said, once, with a way to
// undo, and then it is the couple's holiday.

export const NEAR_AIRPORT_MINS = 90;
export const nightsWord = (n) => `${n} night${n === 1 ? "" : "s"}`;

const list = (xs) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

// ─── Which cities a trip can start or finish in ───
//
// The ones with an airport of their own, and the ones close enough to one that
// the drive in is the drive you would do anyway: Hoi An is forty-five minutes
// from Da Nang's, and a trip that starts in Hoi An is a perfectly good trip.
// Where a country has no such city at all (Sri Lanka flies through Colombo,
// which is not somewhere we sell), the answer is every city, and the gateway
// is named instead.
export function endpoints(dest) {
  const cities = (destAreas[dest] || []).map((a) => a.city);
  const own = cities.filter((c) => airportCity(dest, c));
  if (!own.length) {
    return { own: [], near: [], eligible: cities, open: true, gateway: arrivalAirport(dest, cities[0]) };
  }
  const near = cities.filter((c) => !own.includes(c) && nearestAirport(dest, c)?.mins <= NEAR_AIRPORT_MINS);
  return { own, near, eligible: [...own, ...near], open: false, gateway: null };
}

// The closest city with its own airport, and the drive to it.
export function nearestAirport(dest, city) {
  if (airportCity(dest, city)) return { city, mins: 0 };
  const own = (destAreas[dest] || []).map((a) => a.city).filter((c) => airportCity(dest, c));
  const found = own
    .map((a) => ({ city: a, mins: hop(dest, city, a)?.mins ?? Infinity }))
    .sort((p, q) => p.mins - q.mins)[0];
  return found && Number.isFinite(found.mins) ? found : null;
}

// What starting or finishing in this city costs, or nothing when it costs
// nothing. `which` is "start" or "end", only for the wording.
export function endCost(dest, city, which) {
  if (!city) return null;
  const ep = endpoints(dest);
  if (ep.open) return null;
  const near = nearestAirport(dest, city);
  if (!near || near.mins === 0) return null;
  const drive = hhmm(near.mins);
  return {
    city, airport: near.city, mins: near.mins,
    eligible: ep.eligible.includes(city),
    text: which === "start"
      ? `${city} has no airport of its own. You land at ${near.city} and drive about ${drive} first.`
      : `${city} has no airport of its own. The last day is about ${drive} by road to ${near.city} for the flight home.`,
  };
}

// ─── Can this city go here ───
//
// The reason it cannot, or nothing. Nights are not part of this answer: being
// out of nights is something we can offer to fix, and a point in the route
// that cannot be flown is not.
export function insertIssue(dest, cities, city, gap, { strictEnds = false } = {}) {
  const trial = [...cities.slice(0, gap), city, ...cities.slice(gap)];
  const issue = routeIssue(dest, trial);
  if (issue) {
    return issue.city === city
      ? `Only connects through ${issue.hubName}, so it has to sit beside ${issue.hub}`
      : `This would strand ${issue.city}, which only connects through ${issue.hubName}`;
  }
  if (strictEnds && (gap === 0 || gap === cities.length)) {
    const cost = endCost(dest, city, gap === 0 ? "start" : "end");
    if (cost && !cost.eligible) {
      return `About ${hhmm(cost.mins)} from the nearest airport, too far to ${gap === 0 ? "start" : "finish"} the trip`;
    }
  }
  return null;
}

// Which gaps have at least one city that could go in them.
export function openGaps(dest, cities, opts) {
  const rest = (destAreas[dest] || []).map((a) => a.city).filter((c) => !cities.includes(c));
  const out = new Set();
  for (let g = 0; g <= cities.length; g += 1) {
    if (rest.some((c) => !insertIssue(dest, cities, c, g, opts))) out.add(g);
  }
  return out;
}

// ─── What a move does ───
//
// Returns the order to show and the note to show with it. "block" means the
// order is unchanged and the note says why. "warn" means it went through and
// the note says what it cost, with the old order to go back to.
export function moveOutcome(dest, cities, next, { strictEnds = false } = {}) {
  const issue = routeIssue(dest, next);
  if (issue) {
    const beside = besideHub(dest, next, issue);
    return {
      kind: "block",
      next: cities,
      text: `${issue.city} only connects through ${issue.hubName}. Away from ${issue.hub} you fly back through it anyway, about ${hhmm(issue.extra)} and another flight on the bill.`,
      move: beside, moveLabel: beside ? `Put it beside ${issue.hub}` : null,
    };
  }
  const first = next[0];
  const last = next[next.length - 1];
  const startCost = first !== cities[0] ? endCost(dest, first, "start") : null;
  const endC = last !== cities[cities.length - 1] ? endCost(dest, last, "end") : null;
  if (strictEnds) {
    const bad = (startCost && !startCost.eligible) ? startCost : (endC && !endC.eligible) ? endC : null;
    if (bad) {
      const ep = endpoints(dest);
      return {
        kind: "block",
        next: cities,
        text: `${bad.city} is about ${hhmm(bad.mins)} from the nearest airport, so the trip cannot ${bad === startCost ? "start" : "finish"} there. It can ${bad === startCost ? "start" : "finish"} in ${list(ep.eligible)}.`,
      };
    }
  }

  const before = travelMinutes(dest, cities);
  const after = travelMinutes(dest, next);
  const notes = [];
  if (after > before) {
    notes.push(`That takes the route back on itself: about ${hhmm(after - before)} more between cities, on the bill as well as the clock.`);
  }
  if (startCost) notes.push(startCost.text);
  if (endC) notes.push(endC.text);
  return notes.length
    ? { kind: "warn", next, text: notes.join(" "), undo: cities }
    : { kind: "ok", next };
}

// The same order with the hub-only city sat next to its hub.
function besideHub(dest, cities, issue) {
  const without = cities.filter((c) => c !== issue.city);
  const j = without.indexOf(issue.hub);
  if (j < 0) return null;
  const a = [...without.slice(0, j + 1), issue.city, ...without.slice(j + 1)];
  const b = [...without.slice(0, j), issue.city, ...without.slice(j)];
  return travelMinutes(dest, a) <= travelMinutes(dest, b) ? a : b;
}

// Where a city costs least to add, and what adding it here costs over that.
export function insertCost(dest, cities, city, gap, opts) {
  const options = [];
  for (let g = 0; g <= cities.length; g += 1) {
    if (!insertIssue(dest, cities, city, g, opts)) {
      options.push({ g, mins: travelMinutes(dest, [...cities.slice(0, g), city, ...cities.slice(g)]) });
    }
  }
  const here = options.find((x) => x.g === gap);
  const cheapest = [...options].sort((a, b) => a.mins - b.mins)[0];
  if (!here || !cheapest || cheapest.g === gap || here.mins - cheapest.mins <= 0) return null;
  const order = [...cities.slice(0, cheapest.g), city, ...cities.slice(cheapest.g)];
  const beside = cheapest.g === 0 ? `before ${cities[0]}` : `after ${cities[cheapest.g - 1]}`;
  return { extra: here.mins - cheapest.mins, order, beside };
}

// ─── Removing a city ───
//
// Allowed, always: it is their route. But taking out a hub strands whatever
// hangs off it, and that is worth saying at the moment it happens rather than
// at Save, when they have forgotten what they did.
export function removeIssue(dest, cities, city) {
  const next = cities.filter((c) => c !== city);
  const stranded = next.filter((c) => {
    const hubName = transferHub(dest, c);
    return hubName && cities.some((x) => sameName(x, hubName)) && !next.some((x) => sameName(x, hubName));
  });
  if (!stranded.length) return null;
  return {
    stranded,
    text: `${list(stranded)} only connect${stranded.length === 1 ? "s" : ""} through ${city}. Without ${city} ${stranded.length === 1 ? "it" : "they"} cannot be flown.`,
    alsoRemove: next.filter((c) => !stranded.includes(c)),
  };
}

// The city on our list that a hub-only city flies through, or nothing. Phu
// Quoc's hub is written as "Ho Chi Minh City"; the region we sell is "HCMC".
export function hubCity(dest, city) {
  const hubName = transferHub(dest, city);
  if (!hubName) return null;
  return (destAreas[dest] || []).map((a) => a.city).find((x) => sameName(x, hubName)) || null;
}

const norm = (x) => String(x).toLowerCase().replace(/[^a-z]/g, "");
const initials = (x) => String(x).split(/\s+/).map((w) => w[0] || "").join("").toLowerCase();
function sameName(a, b) {
  const an = norm(a);
  const bn = norm(b);
  return an === bn || an.includes(bn) || bn.includes(an) || initials(a) === bn || initials(b) === an;
}

// ─── Everything wrong with a route, before it is saved ───
//
// Blocks stop the save and each one points at the row it is about. Warns are
// read back once and then it is their holiday.
export function checkRoute(dest, route, { strictEnds = false } = {}) {
  const cities = route.map((s) => s.city);
  const blocks = [];
  const warns = [];
  const min = destMeta[dest]?.minNights || 1;
  const nights = routeNights(route);

  if (!cities.length) {
    blocks.push({ key: "empty", text: "Pick at least one city." });
    return { blocks, warns };
  }
  if (nights < min) {
    blocks.push({ key: "short", text: `${dest} trips are at least ${nightsWord(min)}. This one is ${nightsWord(nights)}.` });
  }
  const issue = routeIssue(dest, cities);
  if (issue) {
    blocks.push({
      key: "hub", city: issue.city,
      text: `${issue.city} only connects through ${issue.hubName}. Put it beside ${issue.hub}.`,
      fix: besideHub(dest, cities, issue), fixLabel: `Put it beside ${issue.hub}`,
    });
  }
  // A hub-only city whose hub is not on the trip at all.
  cities.forEach((c) => {
    const hubName = transferHub(dest, c);
    if (hubName && !cities.some((x) => sameName(x, hubName))) {
      const hub = hubCity(dest, c);
      blocks.push({
        key: `orphan-${c}`, city: c,
        text: `${c} only connects through ${hubName}, which is not on the trip. Add ${hub || hubName} beside it, or take ${c} out.`,
        fix: hub ? [...cities.slice(0, cities.indexOf(c)), hub, ...cities.slice(cities.indexOf(c))] : null,
        fixLabel: hub ? `Add ${hub}` : null,
      });
    }
  });

  const startCost = endCost(dest, cities[0], "start");
  const endC = endCost(dest, cities[cities.length - 1], "end");
  const ep = endpoints(dest);
  [startCost, endC].forEach((c, i) => {
    if (!c) return;
    if (strictEnds && !c.eligible) {
      blocks.push({
        key: `end-${i}`, city: c.city,
        text: `${c.text} Trips can ${i === 0 ? "start" : "finish"} in ${list(ep.eligible)}.`,
      });
    } else {
      warns.push({ key: `end-${i}`, city: c.city, text: c.text });
    }
  });

  const best = bestAllowedOrder(dest, cities, { strictEnds });
  const mins = travelMinutes(dest, cities);
  const bestMins = travelMinutes(dest, best);
  if (best.join("|") !== cities.join("|") && mins - bestMins >= 60) {
    warns.push({
      key: "order",
      text: `This order is about ${hhmm(mins)} of travelling. Ours does it in about ${hhmm(bestMins)}.`,
      fix: best, fixLabel: "Use the quicker order",
    });
  }
  return { blocks, warns };
}

// ─── The quickest order we would actually allow ───
//
// bestOrder scores every arrangement on travel time. It will happily start a
// trip in Ha Long, which is quicker overall (land Hanoi, drive out, drive
// back, fly) and which the strict rule does not permit. The suggestion has
// to obey the same rules as the drag, or the screen argues with itself.
export function bestAllowedOrder(dest, cities, { strictEnds = false } = {}) {
  if (cities.length < 2 || cities.length > 7) return [...cities];
  const ok = (order) => {
    if (routeIssue(dest, order)) return false;
    if (!strictEnds) return true;
    const a = endCost(dest, order[0], "start");
    const b = endCost(dest, order[order.length - 1], "end");
    return (!a || a.eligible) && (!b || b.eligible);
  };
  let best = null;
  let bestCost = Infinity;
  const walk = (left, acc) => {
    if (!left.length) {
      if (!ok(acc)) return;
      const c = travelMinutes(dest, acc);
      if (c < bestCost) { bestCost = c; best = [...acc]; }
      return;
    }
    for (let i = 0; i < left.length; i += 1) walk([...left.slice(0, i), ...left.slice(i + 1)], [...acc, left[i]]);
  };
  walk(cities, []);
  return best || bestOrder(dest, cities);
}

// The one line about airports that explains why the order is the order.
export function airportLine(dest, cities) {
  const ep = endpoints(dest);
  if (ep.open) {
    const g = ep.gateway;
    return `Everywhere in ${dest} is reached from ${g ? `${g.name} (${g.code})` : "the airport"}, so you land there and drive, whichever city comes first.`;
  }
  const here = cities.filter((c) => ep.own.includes(c));
  const ownLine = here.length === 0
    ? `None of these cities has an airport of its own, so you land nearby and drive in at both ends.`
    : `${list(here)} ${here.length === 1 ? "has an airport of its own" : "have airports of their own"}.`;
  return `${ownLine} Trips can start or finish in ${list(ep.eligible)}; anywhere else means a long drive at one end.`;
}
