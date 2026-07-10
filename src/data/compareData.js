// Compare two versions of a plan (prototype data layer).
//
// The deals store keeps versions lean (itineraryId + customizations + price).
// The compare screen needs a full structured snapshot per version - flights,
// hotels, day activities, and a customer-facing price breakdown - mirroring the
// real back-office schema. We synthesize that here, deterministically seeded by
// the version id and anchored to the version's real itinerary (route, cities,
// price). Two versions of one deal differ in believable, controlled ways so the
// diff reads as a story (a hotel swapped, a tour added, flights changed), not
// as random noise.
//
// Money model: the grand total equals the card's total (per-person price x
// travellers), so nothing contradicts My Plans. That total is then decomposed
// into flights / stay / activities / add-ons / taxes that sum back to it.

import { allItineraries } from "../data";

const num = (p) => Number(String(p ?? 0).replace(/,/g, "")) || 0;
const DAY = 86400000;

// ── deterministic seeding ──
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const pickAt = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];

// ── reference pools ──
const DEP_BY_DEST = {
  Bali: "Mumbai (BOM)", Thailand: "Delhi (DEL)", Vietnam: "Mumbai (BOM)",
  Maldives: "Bengaluru (BLR)", "Sri Lanka": "Delhi (DEL)", "New Zealand": "Delhi (DEL)",
  Mauritius: "Mumbai (BOM)",
};
const ARR_AIRPORT = {
  Bali: "DPS", Thailand: "HKT", Vietnam: "PQC", Maldives: "MLE",
  "Sri Lanka": "CMB", "New Zealand": "CHC", Mauritius: "MRU",
};
const AIRLINES = {
  Bali: ["IndiGo", "Singapore Airlines", "Malaysia Airlines"],
  Thailand: ["Air India", "Thai Airways", "IndiGo"],
  Vietnam: ["VietJet Air", "Singapore Airlines", "Thai Airways"],
  Maldives: ["IndiGo", "Air India", "Qatar Airways"],
  "Sri Lanka": ["SriLankan Airlines", "IndiGo", "Air India"],
  "New Zealand": ["Singapore Airlines", "Malaysia Airlines", "Qatar Airways"],
  Mauritius: ["Air Mauritius", "IndiGo", "Emirates"],
};
const VIA = {
  Bali: "MAA", Thailand: "", Vietnam: "SGN", Maldives: "",
  "Sri Lanka": "", "New Zealand": "SIN", Mauritius: "",
};
const FLIGHT_BASE = { // round-trip, party of 2, before per-version jitter
  Bali: 90000, Thailand: 62000, Vietnam: 74000, Maldives: 80000,
  "Sri Lanka": 110000, "New Zealand": 230000, Mauritius: 96000,
};
const HOTEL_PREFIX = ["The", "Royal", "Amara", "Lotus", "Suria", "Anara"];
const HOTEL_SUFFIX = ["Resort & Spa", "Villas", "Grand", "Retreat", "Bay Hotel", "Sanctuary"];
const ROOMS = ["Deluxe Room", "Pool Villa Suite", "Garden View Suite", "Ocean View Room", "Studio Suite", "Premier King"];
const NIGHTLY_BY_STAR = { 3: 9000, 4: 13500, 5: 22000 };
// Real product names as they read in the app, so the day-by-day diff looks like
// the actual catalogue (not generic placeholders).
const TOURS_BY_DEST = {
  Bali: [
    "West Nusa Penida Tour with Kelingking & Top Beaches from Bali",
    "Bali Adventure Essentials Tour Covering My Swing & Tandem ATV",
    "South Bali Beaches, Temple & Kecak Dance with Transfer",
    "West Nusa Penida Tour with Kelingking & Top Beaches with Stay",
    "Uluwatu Cliff Temple and Kecak Dance Tour",
    "Best of West Nusa Penida Tour from Bali",
    "Tandem ATV Adventure",
    "Bali Highlands Icons Tour Covering Ulun Danu Temple & Handara Gate",
    "East Bali Tour Covering Lahangan Sweet, Tukad Cepung, and Tirta Ganga",
  ],
};
const DEFAULT_TOURS = [
  "Guided City Highlights Tour", "Island Day Trip", "Sunset Cruise", "Cultural Heritage Walk",
  "Snorkeling Excursion", "Local Food Trail", "Nature & Waterfalls Tour", "Beach Club Day",
];
// A signature, stable in-property experience used on one unchanged day.
const PROPERTY_EXPERIENCE = { Bali: "Floating Breakfast at the Property" };
const ARRIVAL_TRANSFER = { Bali: "Bali Airport to Hotel Transfer" };
const DEPART_TRANSFER = { Bali: "Simple Transfer: Bali Hotel to Airport" };
const INTER_TRANSFER = { Bali: "Inter Hotel Transfer in Bali" };
const arrivalTransfer = (d) => ARRIVAL_TRANSFER[d] || "Airport to hotel transfer";
const departTransfer = (d) => DEPART_TRANSFER[d] || "Hotel to airport transfer";
const interTransfer = (d) => INTER_TRANSFER[d] || "Inter hotel transfer";

// ── itinerary resolution ──
function resolveItin(deal, version) {
  const id = version.itineraryId ?? deal.itineraryId;
  return allItineraries.find((i) => i.id === id)
    || deal.customItinerary
    || version.customizations?.builtItinerary
    || null;
}

function routeOf(itin) {
  if (itin?.route?.length) return itin.route.map((r) => ({ city: r.city, n: r.n }));
  if (itin?.villas?.length) return itin.villas.map((v, i) => ({ city: itin.resort || `Stop ${i + 1}`, n: v.n }));
  return [{ city: itin?.dest || "Trip", n: itin?.nights || 5 }];
}

// ── per-version snapshot ──
export function getVersionSnapshot(deal, version) {
  if (version.demoSnapshot) {
    // Dates round-trip through localStorage as strings; rehydrate them.
    const s = version.demoSnapshot;
    return {
      ...s,
      start: new Date(s.start), end: new Date(s.end),
      hotels: s.hotels.map((h) => ({ ...h, checkIn: new Date(h.checkIn), checkOut: new Date(h.checkOut) })),
      days: s.days.map((d) => ({ ...d, date: new Date(d.date) })),
    };
  }
  const itin = resolveItin(deal, version);
  const dest = version.destination ?? itin?.dest ?? deal.dest;
  const td = version.customizations?.travelDates || {};
  const travelers = td.travelers ?? 2;
  const kids = td.kids ?? 0;
  const route = routeOf(itin);
  const nights = td.nights ?? itin?.nights ?? route.reduce((s, r) => s + r.n, 0);
  const ppPrice = version.livePrice ?? version.indicativePrice ?? num(itin?.price);
  const total = ppPrice * travelers; // matches the My Plans card exactly

  const start = new Date(td.fromDate || Date.now());
  const end = new Date(start.getTime() + nights * DAY);
  const seed = hashStr(version.id || String(version.num));
  const r = rng(seed);
  const vnum = version.num || 1;

  // ── hotels (one per stop), with check-in / check-out dates ──
  // Most stops keep a stable hotel; the LAST stop's hotel changes per version,
  // so iterating a plan tells a clean "you kept tuning the last stay" story.
  let acc = 0;
  const hotels = route.map((stop, i) => {
    const isMaldives = dest === "Maldives" && itin?.resort;
    const variant = i === route.length - 1 ? vnum : 0;
    const cityRng = rng(hashStr(`${stop.city}|${variant}`));
    const star = isMaldives ? 5 : pickAt([4, 5, 4, 3, 5], Math.floor(cityRng() * 5) + variant);
    const name = isMaldives
      ? itin.resort
      : `${pickAt(HOTEL_PREFIX, Math.floor(cityRng() * 6) + variant)} ${stop.city} ${pickAt(HOTEL_SUFFIX, Math.floor(cityRng() * 6) + variant + 1)}`;
    const room = pickAt(ROOMS, Math.floor(cityRng() * 6) + variant);
    const pricePerNight = Math.round(NIGHTLY_BY_STAR[star] * (0.9 + cityRng() * 0.4));
    const checkIn = new Date(start.getTime() + acc * DAY);
    acc += stop.n;
    const checkOut = new Date(start.getTime() + acc * DAY);
    return {
      seq: i, city: stop.city, nights: stop.n, hotel: name, room,
      star, meal: "Breakfast", pricePerNight, provider: "TBO (live)", selfBooked: false,
      checkIn, checkOut,
    };
  });

  // ── day-by-day plan (tours + transfers + leisure) ──
  // One bucket per day so the compare can show each day side by side.
  const days = [];
  const mkAct = (title, category, price) => ({ code: `${dest[0]}${hashStr(title) % 100000}`, title, category, price });
  const dayDate = (n) => new Date(start.getTime() + (n - 1) * DAY);
  const tourPool = TOURS_BY_DEST[dest] || DEFAULT_TOURS;
  // Exactly three days are held identical across versions (arrival, a mid in-property
  // day, and departure); every other day's tour shifts with the version, so two
  // versions read as "3 days the same, the rest changed".
  const dayCount = nights + 1; // last day is the flight home
  const midStable = Math.max(2, Math.min(dayCount - 1, Math.round(dayCount / 2)));
  const stableDay = new Set([1, midStable, dayCount]);
  for (let d = 1; d <= dayCount; d++) {
    const acts = [];
    const stable = stableDay.has(d);
    if (d === dayCount) {
      acts.push(mkAct(departTransfer(dest), "Transfer", 900 + Math.round(r() * 400)));
      days.push({ day: d, date: dayDate(d), activities: acts });
      continue;
    }
    if (d === 1) acts.push(mkAct(arrivalTransfer(dest), "Transfer", 900 + Math.round(r() * 400)));
    else if (!stable && d % 3 === 0) acts.push(mkAct(interTransfer(dest), "Transfer", 1500 + Math.round(r() * 3000)));
    if (stable && d === midStable && PROPERTY_EXPERIENCE[dest]) {
      acts.push(mkAct(PROPERTY_EXPERIENCE[dest], "Tour", 3500 + Math.round(r() * 2500)));
    } else {
      // Stable days pick a version-independent tour; changed days fold in the
      // version number so adjacent versions never land on the same tour.
      const idx = stable ? d * 3 : d * 3 + vnum;
      acts.push(mkAct(pickAt(tourPool, idx), "Tour", 3500 + Math.round(r() * 4000)));
    }
    days.push({ day: d, date: dayDate(d), activities: acts });
  }
  const activities = days.flatMap((d) => d.activities); // flat list for pricing

  // ── flights ──
  const airline = pickAt(AIRLINES[dest] || AIRLINES.Bali, vnum);
  const via = VIA[dest] ?? "";
  const stops = via ? 1 : (vnum % 2); // some versions go non-stop, some 1-stop
  const arr = ARR_AIRPORT[dest] || "DPS";
  const dep = (DEP_BY_DEST[dest] || "Mumbai (BOM)").match(/\(([A-Z]{3})\)/)?.[1] || "BOM";
  const fBase = (FLIGHT_BASE[dest] || 80000) * (0.92 + r() * 0.2) + (stops === 0 ? 8000 : 0);
  const flight = {
    tripType: vnum % 3 === 0 ? "oneway-split" : "roundtrip",
    provider: pickAt(["MMT B2C", "Cleartrip", "TBO", airline], vnum),
    outbound: { airline, stops, via: stops ? via : "", airTime: stops ? "11h 55m" : "8h 30m", sector: `${dep} to ${arr}` },
    inbound: { airline, stops, via: stops ? via : "", airTime: stops ? "12h 10m" : "8h 40m", sector: `${arr} to ${dep}` },
  };

  // ── price decomposition, anchored to the card total ──
  const flightsRaw = Math.round(fBase);
  const hotelsRaw = hotels.reduce((s, h) => s + h.pricePerNight * h.nights, 0);
  const activitiesRaw = activities.reduce((s, a) => s + a.price, 0);
  const addOnsRaw = vnum % 4 === 0 ? 16000 : 0;
  const subRaw = flightsRaw + hotelsRaw + activitiesRaw + addOnsRaw || 1;

  const gst = Math.round(total * 0.04);
  const tcs = Math.round(total * 0.05);
  const subTarget = total - gst - tcs;
  const scale = subTarget / subRaw;
  let flights = Math.round(flightsRaw * scale);
  let hotelsCost = Math.round(hotelsRaw * scale);
  let actsCost = Math.round(activitiesRaw * scale);
  let addOns = Math.round(addOnsRaw * scale);
  // absorb rounding residual into hotels (the largest land component)
  hotelsCost += subTarget - (flights + hotelsCost + actsCost + addOns);
  // reflect the scale back onto displayed nightly rates so they tie out
  hotels.forEach((h) => { h.pricePerNight = Math.round(h.pricePerNight * scale); });
  flight.outbound.price = Math.round(flights / 2);
  flight.inbound.price = flights - flight.outbound.price;

  return {
    versionId: version.id, label: `V${vnum}`, status: version.status, num: vnum,
    destination: dest, nights, travelers, kids, departureCity: DEP_BY_DEST[dest] || "Mumbai (BOM)",
    start, end, route, hotels, activities, days, flight,
    pricing: { total, gst, tcs, flights, hotels: hotelsCost, activities: actsCost, addOns },
  };
}

// ── facet diff ──
const routeStr = (snap) => snap.route.map((s) => `${s.city} ${s.n}N`).join(" · ");

export function compareVersions(a, b) {
  // Price (totals + a per-component breakdown that sums to the total delta).
  const taxesA = a.pricing.gst + a.pricing.tcs, taxesB = b.pricing.gst + b.pricing.tcs;
  const breakdown = [
    { key: "flights", label: "Flights", a: a.pricing.flights, b: b.pricing.flights, delta: b.pricing.flights - a.pricing.flights },
    { key: "hotels", label: "Stay", a: a.pricing.hotels, b: b.pricing.hotels, delta: b.pricing.hotels - a.pricing.hotels },
    { key: "activities", label: "Activities", a: a.pricing.activities, b: b.pricing.activities, delta: b.pricing.activities - a.pricing.activities },
    { key: "addOns", label: "Add-ons", a: a.pricing.addOns, b: b.pricing.addOns, delta: b.pricing.addOns - a.pricing.addOns },
    { key: "taxes", label: "Taxes & fees", a: taxesA, b: taxesB, delta: taxesB - taxesA },
  ];
  const price = {
    a: a.pricing.total, b: b.pricing.total, delta: b.pricing.total - a.pricing.total,
    breakdown, changed: a.pricing.total !== b.pricing.total,
  };

  // Route (cities + nights), so a route change is obvious up front.
  // "sequenceChanged" = same set of stops + nights, only the ORDER differs.
  const setKey = (arr) => arr.map((s) => `${s.city}${s.n}`).sort().join("|");
  const routeChanged = routeStr(a) !== routeStr(b);
  const sequenceChanged = routeChanged && setKey(a.route) === setKey(b.route);
  const route = { aStr: routeStr(a), bStr: routeStr(b), a: a.route, b: b.route, changed: routeChanged, sequenceChanged };

  // Stay, aligned by city.
  const cities = [];
  a.hotels.forEach((h) => cities.push(h.city));
  b.hotels.forEach((h) => { if (!cities.includes(h.city)) cities.push(h.city); });
  const stayRows = cities.map((city) => {
    const ha = a.hotels.find((h) => h.city === city) || null;
    const hb = b.hotels.find((h) => h.city === city) || null;
    let status = "same";
    if (ha && !hb) status = "removed";
    else if (!ha && hb) status = "added";
    // Same hotel = unchanged, even if the dates or nights shift. Only a different
    // property, room, or star rating counts as a swap.
    else if (ha && hb && (ha.hotel !== hb.hotel || ha.star !== hb.star || ha.room !== hb.room)) status = "swapped";
    return { city, a: ha, b: hb, status };
  });
  // A plain-English headline of what moved between the two stays, so the reader
  // gets the answer before scanning the timeline.
  const listWords = (xs) => xs.length <= 1 ? (xs[0] || "")
    : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
  const removed = stayRows.filter((r) => r.status === "removed").map((r) => r.city);
  const added = stayRows.filter((r) => r.status === "added").map((r) => r.city);
  const parts = [];
  if (removed.length && added.length) parts.push(`Dropped ${listWords(removed)}, added ${listWords(added)}`);
  else if (removed.length) parts.push(`Dropped ${listWords(removed)}`);
  else if (added.length) parts.push(`Added ${listWords(added)}`);
  stayRows.forEach((r) => {
    if (r.status === "swapped" && r.a && r.b) {
      if (r.a.nights !== r.b.nights) parts.push(`${r.city} is now ${r.b.nights} night${r.b.nights !== 1 ? "s" : ""} instead of ${r.a.nights}`);
      else parts.push(`Changed your ${r.city} hotel`);
    }
  });
  const stay = {
    rows: stayRows, aHotels: a.hotels, bHotels: b.hotels,
    summaryText: parts.length ? parts.join(". ") + "." : "",
    changed: stayRows.some((r) => r.status !== "same"),
  };

  // Flights, per direction.
  const dirChanged = (x, y) => x.airline !== y.airline || x.stops !== y.stops || x.via !== y.via;
  const dirs = [
    { dir: "Outbound", a: a.flight.outbound, b: b.flight.outbound, changed: dirChanged(a.flight.outbound, b.flight.outbound) },
    { dir: "Return", a: a.flight.inbound, b: b.flight.inbound, changed: dirChanged(a.flight.inbound, b.flight.inbound) },
  ];
  const flights = {
    dirs, providerA: a.flight.provider, providerB: b.flight.provider,
    tripA: a.flight.tripType, tripB: b.flight.tripType,
    // Only the actual flights matter here — a date shift with the same flights
    // is not a flight change.
    changed: dirs.some((d) => d.changed),
  };

  // Day plans: aligned day by day. A day is "changed" if its activity set differs
  // (or the day exists in only one version). Two columns, day by day.
  const keyOf = (d) => d ? d.activities.map((x) => x.code).sort().join("|") : "";
  const maxDay = Math.max(a.days.length, b.days.length);
  const dayRows = [];
  for (let i = 0; i < maxDay; i++) {
    const da = a.days[i] || null, db = b.days[i] || null;
    dayRows.push({ day: i + 1, a: da, b: db, changed: keyOf(da) !== keyOf(db) });
  }
  // "What changed" only cares about tours/transfers ADDED or REMOVED across the
  // whole trip — a tour simply moving to a different day is not a change.
  const setA = new Set((a.activities || []).map((x) => x.code));
  const setB = new Set((b.activities || []).map((x) => x.code));
  const addedActs = (b.activities || []).filter((x) => !setA.has(x.code));
  const removedActs = (a.activities || []).filter((x) => !setB.has(x.code));
  const dayPlans = {
    rows: dayRows, changedCount: dayRows.filter((r) => r.changed).length,
    added: addedActs, removed: removedActs,
    changed: addedActs.length > 0 || removedActs.length > 0,
  };

  // Dates & logistics.
  const dates = {
    a: { start: a.start, end: a.end, nights: a.nights, dep: a.departureCity, travelers: a.travelers, kids: a.kids },
    b: { start: b.start, end: b.end, nights: b.nights, dep: b.departureCity, travelers: b.travelers, kids: b.kids },
    fields: {
      nights: a.nights !== b.nights,
      dates: a.start.getTime() !== b.start.getTime() || a.end.getTime() !== b.end.getTime(),
      dep: a.departureCity !== b.departureCity,
      pax: a.travelers !== b.travelers || a.kids !== b.kids,
    },
  };
  dates.changed = dates.fields.nights || dates.fields.dates || dates.fields.dep || dates.fields.pax;

  return { price, route, flights, stay, dayPlans, dates };
}

// All versions for a card, newest first. Maldives cards pass the property name
// so we read that property's own versions from the raw deal.
export function versionsForCard(deal, prop) {
  const list = prop
    ? (deal.properties?.find((p) => p.property === prop)?.versions || [])
    : (deal.versions || []);
  return [...list].sort((x, y) => y.num - x.num);
}

// ── demo comparisons ──
// Two hand-authored pairs so the "Sequence changed" and "different-nights → dash"
// states can always be shown. Deterministic generation can't make a
// "same-everything, only-order-differs" pair, so we author the snapshots directly.
const DEMO_HOTELS = {
  Ubud: { hotel: "Royal Ubud Bay Hotel", room: "Deluxe Room", star: 5, pricePerNight: 19000 },
  Seminyak: { hotel: "Amara Seminyak Grand", room: "Pool Villa Suite", star: 5, pricePerNight: 24000 },
  Sanur: { hotel: "Lotus Sanur Villas", room: "Garden View Suite", star: 4, pricePerNight: 12000 },
};
const DEMO_TOURS = [
  "Uluwatu Cliff Temple and Kecak Dance Tour",
  "South Bali Beaches, Temple & Kecak Dance with Transfer",
  "Bali Highlands Icons Tour Covering Ulun Danu Temple & Handara Gate",
  "West Nusa Penida Tour with Kelingking & Top Beaches from Bali",
  "Tandem ATV Adventure",
];
const demoAct = (title, category = "Tour", price = 4500) => ({ code: `D${hashStr(title) % 100000}`, title, category, price });

function buildDemoSnapshot({ id, num, route, total }) {
  const dest = "Bali";
  const start = new Date(2026, 7, 15); // 15 Aug 2026 (app runtime; not a workflow)
  const nights = route.reduce((s, r) => s + r.n, 0);
  const end = new Date(start.getTime() + nights * DAY);
  let acc = 0;
  const hotels = route.map((s, i) => {
    const h = DEMO_HOTELS[s.city] || { hotel: `${s.city} Stay`, room: "Room", star: 4, pricePerNight: 12000 };
    const checkIn = new Date(start.getTime() + acc * DAY); acc += s.n;
    const checkOut = new Date(start.getTime() + acc * DAY);
    return { seq: i, city: s.city, nights: s.n, ...h, meal: "Breakfast", provider: "TBO (live)", selfBooked: false, checkIn, checkOut };
  });
  // Same tour per day-index across versions (so a reorder adds/removes nothing).
  const dayCount = nights + 1;
  const days = [];
  for (let d = 1; d <= dayCount; d++) {
    const acts = [];
    if (d === 1) acts.push(demoAct("Bali Airport to Hotel Transfer", "Transfer", 1200));
    else if (d === dayCount) acts.push(demoAct("Simple Transfer: Bali Hotel to Airport", "Transfer", 1200));
    else acts.push(demoAct(DEMO_TOURS[(d - 2) % DEMO_TOURS.length]));
    days.push({ day: d, date: new Date(start.getTime() + (d - 1) * DAY), activities: acts });
  }
  const activities = days.flatMap((d) => d.activities);
  const gst = Math.round(total * 0.04), tcs = Math.round(total * 0.05);
  const sub = total - gst - tcs;
  const flights = 60000, hotelsCost = Math.round(sub * 0.42), actsCost = Math.round(sub * 0.14);
  const addOns = sub - flights - hotelsCost - actsCost;
  const flight = {
    tripType: "roundtrip", provider: "MMT B2C",
    outbound: { airline: "IndiGo", stops: 1, via: "MAA", airTime: "11h 55m", sector: "BOM to DPS", price: 30000 },
    inbound: { airline: "IndiGo", stops: 1, via: "MAA", airTime: "12h 10m", sector: "DPS to BOM", price: 30000 },
  };
  return {
    versionId: id, label: `V${num}`, status: "quote", num, destination: dest,
    nights, travelers: 2, kids: 0, departureCity: "Mumbai (BOM)", start, end,
    route, hotels, activities, days, flight,
    pricing: { total, gst, tcs, flights, hotels: hotelsCost, activities: actsCost, addOns },
  };
}

const mkDemoVer = (snap) => ({
  id: snap.versionId, num: snap.num, status: "quote", createdBy: "customer",
  destination: "Bali", itineraryId: 1, title: snap.route.map((s) => s.city).join(" · "),
  livePrice: snap.pricing.total / 2, indicativePrice: snap.pricing.total / 2, pricedAt: Date.now(),
  createdAt: Date.now(), customizations: { travelDates: { nights: snap.nights, travelers: 2 } },
  demoSnapshot: snap,
});

export function demoCompareDeals() {
  const img = allItineraries.find((i) => i.id === 1)?.img;
  // 1) Sequence only: same places + nights, order flipped.
  const seqA = buildDemoSnapshot({ id: "demo_seq_v1", num: 1, total: 146000, route: [{ city: "Seminyak", n: 2 }, { city: "Ubud", n: 2 }, { city: "Sanur", n: 3 }] });
  const seqB = buildDemoSnapshot({ id: "demo_seq_v2", num: 2, total: 146000, route: [{ city: "Ubud", n: 2 }, { city: "Seminyak", n: 2 }, { city: "Sanur", n: 3 }] });
  // 2) Different nights: one has an extra night/day.
  const ntA = buildDemoSnapshot({ id: "demo_nights_v1", num: 1, total: 138000, route: [{ city: "Ubud", n: 2 }, { city: "Seminyak", n: 2 }, { city: "Sanur", n: 2 }] });
  const ntB = buildDemoSnapshot({ id: "demo_nights_v2", num: 2, total: 152000, route: [{ city: "Ubud", n: 2 }, { city: "Seminyak", n: 2 }, { city: "Sanur", n: 3 }] });
  return [
    { id: "demo_seq", status: "active", itineraryId: 1, dest: "Bali", title: "Bali · order compare", img, createdAt: Date.now(), versions: [mkDemoVer(seqA), mkDemoVer(seqB)] },
    { id: "demo_nights", status: "active", itineraryId: 1, dest: "Bali", title: "Bali · nights compare", img, createdAt: Date.now(), versions: [mkDemoVer(ntA), mkDemoVer(ntB)] },
  ];
}
