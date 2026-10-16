import { cityCoords } from "./buildData";
import { regionsFor } from "./discoverData";
import { regionGuide } from "./regionGuide";
import { arrivalAirport, hhmm, flyMins, carMins } from "./routeBuilder";

// ─── How you actually get to a region ───
//
// The page used to answer this from Delhi, which is the same answer on every
// region screen in a country: the India leg to Denpasar is identical whether
// you are reading about Ubud or Uluwatu, so it belongs on the Bali screen, not
// here. What changes region to region is the last part of the journey.
//
// So the origins are three major cities in the same country, and under each one
// the ways you could actually make that journey. Not one route, all of them:
// Hanoi to Hoi An is a flight and a cab, or a train and a cab, and which one a
// couple wants depends on whether they are counting hours or rupees. The old
// version picked one and hid the rest.
//
//   3 cities       the city whose airport serves this region, then the next
//                  nearest major cities in the country
//   up to 3 ways   per city, quickest first, with the modes as icons rather
//                  than as a paragraph
//
// ─── What is a fact here and what is worked out ───
//
// The note under the arrival city is hand-written in the region guide. The
// times are worked out from straight-line distance at a fixed speed per mode,
// the same way the route step does it, which is why every one of them says
// "about". Road and air hold up that way. Rail does not: track distance is
// nothing like a straight line, so the per-country rail speeds below are
// calibrated against journeys we know rather than assumed, and they are the
// numbers on this screen most worth a check.

// Airports and ferry ports that are not themselves regions we sell, so they
// have no entry in cityCoords. The airports are the airport sites rather than
// the city centres, and the ports are the piers.
const PLACE_COORDS = {
  Denpasar: { lat: -8.7467, lng: 115.1667 },   // DPS, Ngurah Rai
  Colombo: { lat: 7.1808, lng: 79.8841 },      // CMB, Bandaranaike at Katunayake
  Gan: { lat: -0.6933, lng: 73.1556 },         // GAN, Addu atoll
  Donsak: { lat: 9.3086, lng: 99.6500 },       // the Samui ferry pier
  "Ha Tien": { lat: 10.3831, lng: 104.4875 },  // the Phu Quoc ferry pier
  "Ho Chi Minh City": { lat: 10.8188, lng: 106.6520 },  // SGN, Tan Son Nhat
  Singapore: { lat: 1.3644, lng: 103.9915 },   // SIN, the change for Auckland
  // The Indian airports a couple leaves from.
  Delhi: { lat: 28.5562, lng: 77.1000 },       // DEL
  Mumbai: { lat: 19.0896, lng: 72.8656 },      // BOM
  Bengaluru: { lat: 13.1986, lng: 77.7066 },   // BLR
  Chennai: { lat: 12.9941, lng: 80.1709 },     // MAA
  Kolkata: { lat: 22.6547, lng: 88.4467 },     // CCU
};

const coordsOf = (name) => cityCoords[name] || PLACE_COORDS[name] || null;

// ─── One place, written three ways ───
//
// The guides call SGN's city "Ho Chi Minh City" on one page and "Saigon" on
// another, and the region itself is "HCMC". All three are the same place, and
// without this the page offered a chip for one and another for the next and
// called them different origins.
const ALIAS = { Saigon: "Ho Chi Minh City" };
const unalias = (name) => ALIAS[name] || name;

const flat = (x) => String(x).toLowerCase().replace(/[^a-z]/g, "");
const inits = (x) => String(x).split(/\s+/).map((w) => w[0] || "").join("").toLowerCase();
function samePlace(a, b) {
  if (!a || !b) return false;
  const x = flat(unalias(a));
  const y = flat(unalias(b));
  return x === y || x.includes(y) || y.includes(x)
    || inits(unalias(a)) === y || inits(unalias(b)) === x;
}

const toRad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const p = coordsOf(a);
  const q = coordsOf(b);
  if (!p || !q) return null;
  const dLat = toRad(q.lat - p.lat);
  const dLng = toRad(q.lng - p.lng);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p.lat)) * Math.cos(toRad(q.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Every airport the guides in this country reference, deduped by code.
function airportsIn(dest) {
  const seen = new Map();
  regionsFor(dest).forEach((r) => {
    const a = arrivalAirport(dest, r.city);
    if (a && !seen.has(a.code)) seen.set(a.code, { code: a.code, name: a.name });
  });
  return [...seen.values()];
}

// The airport city a place flies through, which for most regions is somewhere
// else: Hoi An flies through Da Nang, Ubud through Denpasar.
function hubFor(dest, place) {
  const air = airportsIn(dest).find((a) => samePlace(a.name, place));
  if (air) return { name: air.name, code: air.code, own: true };
  const region = regionsFor(dest).find((r) => samePlace(r.city, place));
  const gate = region ? arrivalAirport(dest, region.city) : null;
  return gate ? { name: gate.name, code: gate.code, own: samePlace(gate.name, place) } : null;
}

// ─── Rail ───
//
// Which cities are on a usable intercity line, and how fast that line covers
// ground as the crow flies. The speeds are calibrated against journeys whose
// real duration we know, because track distance and straight-line distance are
// not the same thing anywhere and are wildly different in the hills.
//
//   Sri Lanka   Kandy to Ella is 66 km in a straight line and takes six hours
//   Vietnam     Hanoi to Da Nang is 630 km and takes about sixteen
//   Thailand    Bangkok to Chiang Mai is 582 km and takes about twelve
//
// New Zealand's one scenic line does not join two regions we sell, and neither
// Bali nor the Maldives has rail at all, so they are not here.
//
// `sleeper` is whether the long runs are actually overnight services. Vietnam
// and Thailand sell berths; Sri Lanka's hill line is a day train people ride
// for the view, so calling an eleven-hour ride on it a sleeper was wrong.
const RAIL = {
  Vietnam: { cities: ["Hanoi", "Da Nang", "Ho Chi Minh City"], kmh: 39, sleeper: true },
  Thailand: { cities: ["Bangkok", "Chiang Mai"], kmh: 48, sleeper: true },
  "Sri Lanka": { cities: ["Colombo", "Kandy", "Ella", "Galle"], kmh: 12, sleeper: false },
};
// How far a cab to the nearest station is still worth it. Hoi An is 24 km from
// Da Nang's, which is normal; nobody drives two hours to catch a train.
const TO_STATION_KM = 80;

function railhead(dest, place) {
  const line = RAIL[dest];
  if (!line) return null;
  if (line.cities.some((c) => samePlace(c, place))) return { at: place, extra: 0 };
  const near = line.cities
    .map((c) => ({ at: c, extra: km(c, place) }))
    .filter((x) => x.extra != null && x.extra <= TO_STATION_KM)
    .sort((a, b) => a.extra - b.extra)[0];
  return near || null;
}

// ─── Ferries ───
//
// Where a crossing is a real alternative to flying rather than a technicality.
// Each one names the port you leave from and how long the crossing takes, both
// of which are fixed facts about the route; the drive to the port is worked out
// from the distance like everything else.
//
// Phu Quoc's ferry from Ha Tien exists and almost nobody on a honeymoon takes
// it, so it is in: a couple should be able to see that it is an option and that
// it costs them most of a day.
const FERRY = {
  "Nusa Penida": { port: "Sanur", crossing: 45, note: "Fast boat from Sanur" },
  "Koh Samui": { port: "Donsak", crossing: 105, note: "Ferry from Donsak, on the mainland" },
  "Phu Quoc": { port: "Ha Tien", crossing: 150, note: "Ferry from Ha Tien, down near the border" },
};
// Past this a ferry stops being a cheaper way of getting somewhere and starts
// being two days of your holiday. Chiang Mai to Samui by road and boat is a
// real journey and not an option anybody on a honeymoon wants offered.
const MAX_FERRY_MINS = 16 * 60;
// And the same judgement for any way at all. The Reunification Express between
// Hanoi and Saigon is a famous thirty hours and a real thing people do; it is
// not an answer to "how do we get there" next to a four-hour flight.
const MAX_WAY_MINS = 20 * 60;

// ─── Metro ───
//
// Two of these cities have one, and in both it is the sensible way in from the
// airport rather than a cab. Nowhere else on the list has rail inside the city
// at all, so nowhere else offers it.
const METRO = {
  Bangkok: "Airport Rail Link, then the BTS",
  "Ho Chi Minh City": "Metro line 1 into the centre",
};

// Places you cannot drive to, whatever the map says the distance is.
const BY_BOAT = new Set(["Nusa Penida"]);
const BY_AIR = new Set(["Labuan Bajo", "Phu Quoc", "Koh Samui"]);
// Past this, a cab stops being something anyone would book.
const MAX_DRIVE_KM = 400;
// Under this, flying is slower than driving once the airport is counted.
const MIN_FLY_KM = 150;

// Nothing here is known to the minute, so nothing here is shown to the minute.
// "About 16h 2m" reads like a timetable; it is a straight line divided by a
// speed, and the quarter hour is as fine as that deserves.
const quarter = (mins) => Math.max(15, Math.round(mins / 15) * 15);

// ─── A journey is its legs ───
//
// Every way is built out of legs now rather than summarised into a label and a
// stack of icons. "Flight and cab" told a couple there were two of something;
// it did not say they fly to Da Nang and then drive the half hour down the
// coast. The summary is still there, because the list of ways has to be
// comparable at a glance, but the legs are what the chosen one draws.
const leg = (mode, from, to, mins, extra = {}) => ({
  mode, from, to, mins: quarter(mins), ...extra,
});

const wayOf = (legs, label, hint = null) => {
  const mins = legs.reduce((t, l) => t + l.mins, 0);
  // Just the duration. Saying it is approximate is the screen's job, and it
  // does it with one sign rather than a word.
  return { modes: legs.map((l) => l.mode), label, mins, time: hhmm(mins), hint, legs };
};

// ─── Every way of making one journey ───
export function waysTo(dest, from, to) {
  const d = km(from, to);
  if (d == null) return [];
  const out = [];

  // The Maldives has no roads between islands and no railway. Everything is a
  // boat or a seaplane, so it gets its own answer rather than a filtered one.
  if (dest === "Maldives") {
    if (d > 200) {
      out.push(wayOf(
        [leg("flight", from, to, (d / 500) * 60 + 90, { how: "Domestic flight" })],
        "Domestic flight",
      ));
    } else {
      out.push(
        wayOf([leg("flight", from, to, 45, { how: "Seaplane", note: "Daylight hours only" })],
          "Seaplane", "Daylight hours only"),
        wayOf([leg("boat", from, to, 90, { how: "Speedboat" })], "Speedboat"),
      );
    }
    return out;
  }

  const islandHop = BY_BOAT.has(from) || BY_BOAT.has(to);
  const airOnly = BY_AIR.has(from) || BY_AIR.has(to);

  // ─── Ferry ───
  //
  // Only from somewhere you can actually reach the pier from. You cannot drive
  // off Flores to catch the Sanur boat, and the origins in BY_AIR are islands
  // for exactly that reason.
  const ferry = FERRY[to];
  if (ferry && !samePlace(from, to) && !BY_AIR.has(from)) {
    const drive = samePlace(from, ferry.port) ? 0 : carMins(km(from, ferry.port) ?? 0);
    const total = ferry.crossing + drive;
    if (total <= MAX_FERRY_MINS) {
      const legs = [];
      if (drive) legs.push(leg("car", from, ferry.port, drive));
      legs.push(leg("boat", ferry.port, to, ferry.crossing, { note: ferry.note }));
      out.push(wayOf(legs, drive ? "Cab and ferry" : "Ferry", ferry.note));
    }
  }

  // ─── Road ───
  if (!islandHop && !airOnly && d <= MAX_DRIVE_KM) {
    out.push(wayOf([leg("car", from, to, carMins(d))], "Cab"));
  }

  // ─── Air ───
  const hf = hubFor(dest, from);
  const ht = hubFor(dest, to);
  if (hf && ht && !samePlace(hf.name, ht.name)) {
    const sector = km(hf.name, ht.name) ?? d;
    if (sector >= MIN_FLY_KM) {
      const pre = hf.own ? 0 : carMins(km(from, hf.name) ?? 0);
      const post = ht.own ? 0 : carMins(km(ht.name, to) ?? 0);
      const extra = pre || post;
      const air = flyMins(sector);
      const toAir = pre ? [leg("car", from, hf.name, pre)] : [];
      const flight = leg("flight", hf.name, ht.name, air, { fromCode: hf.code, toCode: ht.code });
      out.push(wayOf(
        [...toAir, flight, ...(post ? [leg("car", ht.name, to, post)] : [])],
        extra ? "Flight and cab" : "Flight",
        `${hf.code} to ${ht.code}`,
      ));

      // Same flight, different way out of the airport. In Bangkok and Saigon
      // that is a train rather than a cab, and it is both cheaper and, in
      // Bangkok's traffic, usually quicker.
      const line = METRO[ht.name] || METRO[to];
      if (line) {
        out.push(wayOf(
          [...toAir, flight, leg("metro", ht.name, to, 30, { note: line })],
          "Flight and metro", line,
        ));
      }
    }
  }

  // ─── Rail ───
  const rf = railhead(dest, from);
  const rt = railhead(dest, to);
  if (rf && rt && !samePlace(rf.at, rt.at)) {
    const ride = Math.round(((km(rf.at, rt.at) ?? d) / RAIL[dest].kmh) * 60);
    const pre = rf.extra ? carMins(rf.extra) : 0;
    const post = rt.extra ? carMins(rt.extra) : 0;
    const extra = pre || post;
    const long = ride > 8 * 60;
    const overnight = long ? (RAIL[dest].sleeper ? "Overnight sleeper" : "A full day of it, and the point") : null;
    const legs = [];
    if (pre) legs.push(leg("car", from, rf.at, pre));
    legs.push(leg("train", rf.at, rt.at, ride, overnight ? { note: overnight } : {}));
    if (post) legs.push(leg("car", rt.at, to, post));
    out.push(wayOf(legs, extra ? "Train and cab" : "Train", overnight));
  }

  // Quickest first. All of them, because the whole point of the list is that a
  // couple counting hours and a couple counting rupees pick differently.
  return out
    .filter((w) => w.mins <= MAX_WAY_MINS)
    .sort((a, b) => a.mins - b.mins)
    .slice(0, 5);
}

// ─── Getting into the country in the first place ───
//
// This screen used to start inside the country, on the grounds that the India
// leg is the same on every region screen in Vietnam. True, and it still missed
// the first question anybody asks about a place they have never been: can I
// fly there, and from where. Somebody reading about Hoi An does not know that
// Hoi An has no airport, that Da Nang's is half an hour up the road, or that
// nothing from India lands at either.
//
// So the row starts in India. Each one is a real journey: the flight out, the
// airport it lands at, and then whatever gets you the rest of the way, which is
// the same set of ways the in-country origins use.
//
// Their coordinates are up with the other airports, because the flight time is
// measured between airport sites and not city centres.
const INDIA = [
  { city: "Delhi", code: "DEL" },
  { city: "Mumbai", code: "BOM" },
  { city: "Bengaluru", code: "BLR" },
  { city: "Chennai", code: "MAA" },
  { city: "Kolkata", code: "CCU" },
];
const INDIA_BY_CODE = Object.fromEntries(INDIA.map((c) => [c.code, c]));

// ─── What actually flies non-stop ───
//
// Keyed by the arrival airport, listing the Indian airports it has a non-stop
// from. This is the one table on this screen that is neither computed nor
// hand-written prose, and it is the one worth re-checking: routes open and
// close every season, and a couple reading "direct" is reading a promise.
//
// Everything not listed is a change of plane, which is why Auckland is not
// here at all: nothing flies to New Zealand from India without one.
const DIRECT = {
  Bali: { DPS: ["DEL", "BOM"] },
  Vietnam: { HAN: ["DEL", "BOM"], SGN: ["DEL", "BOM"] },
  Thailand: { BKK: ["DEL", "BOM", "BLR", "MAA", "CCU"], HKT: ["DEL", "BOM"] },
  Maldives: { MLE: ["DEL", "BOM", "BLR", "MAA", "CCU"] },
  "Sri Lanka": { CMB: ["DEL", "BOM", "BLR", "MAA"] },
  "New Zealand": {},
};

// Where you change when nothing is non-stop, and the gate you change on to.
const VIA = {
  "New Zealand": { at: "Singapore", code: "SIN", gate: "Auckland", gateCode: "AKL" },
};

// The airport city behind a code, as this country's guides name it.
function airportCity(dest, code) {
  const hit = airportsIn(dest).find((a) => a.code === code);
  return hit ? hit.name : null;
}

// ─── One journey from India ───
//
// The non-stop that gets closest wins: the region's own gate if it has one,
// otherwise whichever gate leaves the shortest journey on the far side. The
// onward part is not invented here, it is the quickest of the ways already
// worked out between that airport's city and the region.
function fromIndia(dest, origin, city) {
  const gates = DIRECT[dest] || {};
  const reachable = Object.keys(gates)
    .filter((code) => gates[code].includes(origin.code))
    .map((code) => ({ code, at: airportCity(dest, code) }))
    .filter((g) => g.at && coordsOf(g.at));

  // Non-stop, if anything is.
  if (reachable.length) {
    const scored = reachable.map((g) => {
      const here = samePlace(g.at, city);
      const onward = here ? [] : waysTo(dest, g.at, city);
      const rest = here ? 0 : (onward[0]?.mins ?? Infinity);
      return { ...g, here, onward: onward[0] || null, rest };
    }).sort((a, b) => a.rest - b.rest);

    const best = scored[0];
    if (best.rest === Infinity) return null;

    const hop = leg("flight", origin.city, best.at, flyMins(km(origin.city, best.at) ?? 0), {
      fromCode: origin.code, toCode: best.code, note: "Non-stop",
    });
    const legs = [hop, ...(best.onward ? best.onward.legs : [])];
    return wayOf(
      legs,
      `Non-stop to ${best.at}`,
      best.here
        ? `Lands at ${best.code}, in the city itself`
        : `${origin.code} to ${best.code}, then ${best.onward.label.toLowerCase()}`,
    );
  }

  // Otherwise, one change.
  const via = VIA[dest];
  if (!via) return null;
  const gateAt = airportCity(dest, via.gateCode) || via.gate;
  if (!coordsOf(via.at) || !coordsOf(gateAt)) return null;
  const here = samePlace(gateAt, city);
  const onward = here ? null : waysTo(dest, gateAt, city)[0];
  if (!here && !onward) return null;

  const legs = [
    leg("flight", origin.city, via.at, flyMins(km(origin.city, via.at) ?? 0), {
      fromCode: origin.code, toCode: via.code, note: `Change at ${via.at}`,
    }),
    leg("flight", via.at, gateAt, flyMins(km(via.at, gateAt) ?? 0), {
      fromCode: via.code, toCode: via.gateCode,
    }),
    ...(onward ? onward.legs : []),
  ];
  return wayOf(legs, `One stop, via ${via.at}`, "Nothing flies non-stop from India");
}

// ─── One chip, not three ───
//
// Delhi, Mumbai and Bengaluru were three chips carrying the same answer: the
// same gateway, the same onward legs, and twenty minutes between them on a ten
// hour journey. Nobody is choosing a region by which of those they fly out of.
//
// So it is one chip saying India, built from whichever of them makes the
// shortest journey, and the airports that fly it are named on the first stop.
// That way collapsing the three does not lose the thing they were actually
// telling you, which is where in India this leaves from.
function indiaOrigin(dest, city) {
  const gates = DIRECT[dest] || {};
  const served = new Set(Object.values(gates).flat());
  const pool = served.size
    ? INDIA.filter((c) => served.has(c.code))
    : [INDIA_BY_CODE.DEL, INDIA_BY_CODE.BOM];

  const found = pool
    .map((origin) => ({ origin, way: fromIndia(dest, origin, city) }))
    .filter((x) => x.way)
    .sort((a, b) => a.way.mins - b.way.mins);
  if (!found.length) return null;

  const best = found[0];
  const first = best.way.legs[0];
  // Every Indian airport with a non-stop to the airport this journey leaves
  // for, not merely the ones whose own shortest route happens to go that way.
  // Delhi flies to Bangkok whether or not Delhi's quickest way to Samui does,
  // and a list that left it out would read as "no flight from Delhi".
  //
  // In the order they are written above, which is the order anybody would say
  // them in, and three of them: the chip is a stop on a line, not a timetable.
  const direct = (DIRECT[dest] || {})[first.toCode] || pool.map((c) => c.code);
  const codes = INDIA
    .filter((c) => direct.includes(c.code))
    .map((c) => c.code)
    .slice(0, 3);

  const legs = [{ ...first, from: "India", fromCode: codes.join(" · ") }, ...best.way.legs.slice(1)];
  return {
    id: "IN",
    label: "India",
    group: "india",
    note: null,
    isGateway: false,
    code: null,
    km: null,
    ways: [wayOf(legs, best.way.label, best.way.hint)],
  };
}

// ─── The cities a couple would be coming from ───
//
// The one whose airport serves this region first, because that is where the
// trip into the country lands, then the next nearest major places. Where a
// country has fewer airports than that, the nearest regions fill in, which is
// the honest answer in Bali: you are arriving from Seminyak, not from a city.
const MAX_CITIES = 5;

export function regionReach(dest, city) {
  if (!coordsOf(city)) return [];
  const guide = regionGuide(dest, city)?.reach || [];
  const note = guide[1]?.detail || null;
  const gate = arrivalAirport(dest, city);

  const picked = [];
  const add = (name) => {
    if (!name || samePlace(name, city) || !coordsOf(name)) return;
    if (picked.some((c) => samePlace(c, name))) return;
    picked.push(name);
  };

  if (gate) add(gate.name);
  airportsIn(dest)
    .map((a) => ({ name: a.name, d: km(a.name, city) }))
    .filter((a) => a.d != null)
    .sort((a, b) => a.d - b.d)
    .forEach((a) => add(a.name));
  regionsFor(dest)
    .map((r) => ({ name: r.city, d: km(r.city, city) }))
    .filter((r) => r.d != null)
    .sort((a, b) => a.d - b.d)
    .forEach((r) => add(r.name));

  // A few more candidates than needed, because an origin with no way of
  // reaching here at all gets dropped below and the row should still be five.
  const local = picked.slice(0, MAX_CITIES + 3).map((name) => {
    const hub = hubFor(dest, name);
    const isGateway = !!(gate && samePlace(gate.name, name));
    return {
      id: name,
      label: name,
      group: "local",
      // Only the arrival city carries the hand-written note, because that is
      // the leg it was written about.
      note: isGateway ? note : null,
      isGateway,
      code: hub?.own ? hub.code : null,
      km: km(name, city),
      ways: waysTo(dest, name, city),
    };
  }).filter((o) => o.ways.length).slice(0, MAX_CITIES);

  // India first. Somebody who has never been asks how to get into the country
  // before they ask how to get across it.
  const india = indiaOrigin(dest, city);
  return india ? [india, ...local] : local;
}
