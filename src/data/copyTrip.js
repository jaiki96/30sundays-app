import { synthesizeItinerary, respread, destAreas } from "./buildData";
import { generateHotelsForCity } from "./hotelData";

// ─── Taking somebody else's trip ───
//
// A real itinerary on the home rail is somebody's booked holiday. Copying it
// means keeping the parts that travel: the route, how the nights are split, and
// the activities each day was built around. The parts that cannot travel are
// the flights, because we cannot promise a seat or a fare on dates nobody has
// picked yet, and the price, which is whatever those dates cost now.
//
// So a copy asks two things, a start date and who is going, and works the rest
// out. The length is not one of the questions: the trip is seven nights because
// that is the trip, and a couple who wants eight can change it afterwards on
// the itinerary screen where everything else is changed.

// The activities a day was built around, read back off the day's own line.
export function picksFromDays(days = []) {
  const out = {};
  days.forEach((d) => {
    const names = String(d.sub || "").split(" · ").map((x) => x.trim()).filter(Boolean);
    if (!names.length) return;
    out[d.city] = [...new Set([...(out[d.city] || []), ...names])];
  });
  return out;
}

// One trip, moved to new dates and a new party.
//
// The length is no longer fixed. A copy taken for five nights instead of seven
// shares the nights out over the same cities, which is what the itinerary
// screen does when the dates change, so the two behave the same way.
export function copyOf(it, { startIso, adults = 2, kids = 0, nights, swaps = [] }) {
  const base = (it.route?.length ? it.route : (it.days || [])).map((r) => ({ city: r.city, n: r.n }));
  const want = nights || it.nights;
  const route = want && want !== it.nights ? respread(base, want) : base;
  const copy = synthesizeItinerary({
    dest: it.dest,
    nights: want || it.nights,
    route,
    picksByCity: picksFromDays(it.days),
    vibes: it._vibes || [],
    startDate: startIso,
    party: { couples: 0, adults, kids },
  });
  // Where it came from, so the new screen can say so and so the same source
  // can be copied again without the two being confused for each other.
  copy.copiedFrom = it.id;
  // A copy arrives without flights. They are not sold in the app, the team
  // books them with the traveller, and a flight section on a plan nobody can
  // act on is a section that only raises the question.
  copy.noFlights = true;
  // The stays that had to move, carried on the trip itself rather than in the
  // address bar: there can be more than one, and each one has a card of its
  // own to explain itself on.
  copy.hotelSwaps = swaps.map(({ index, city, from, to, stars }) => ({ index, city, from, to, stars }));
  return copy;
}

// ─── What is still there on those dates ───
//
// No availability service behind this yet, so it is seeded off the trip and the
// date: the same trip on the same date always answers the same way, and moving
// the date can change the answer, which is the thing worth demonstrating.
//
// A sold-out hotel is never a dead end. The copy is made either way and the
// nearest equivalent in the same city goes in, named, so the first thing the
// traveller sees is what we changed rather than a blank where a hotel was.
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function availabilityOnCopy(it, startIso, nights) {
  const stays = (it.days || []).map((d) => d.city);
  if (!stays.length || !startIso) return { swaps: [] };
  // The day as the traveller picked it. Slicing the ISO string reads it in
  // UTC, which in India is the evening before, so the answer belonged to a
  // date nobody chose.
  const d0 = new Date(startIso);
  const day = `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, "0")}-${String(d0.getDate()).padStart(2, "0")}`;
  const h = hash(`${it.id}|${day}|${nights || it.nights}`);
  // One date in three is clear, one has a single stay gone, and one has two,
  // because a trip through four cities over New Year loses more than one.
  const want = h % 3 === 0 ? 0 : h % 3;
  if (!want) return { swaps: [] };

  const picked = [];
  for (let k = 0; k < want && picked.length < stays.length; k += 1) {
    const i = (h + k * 7) % stays.length;
    if (picked.includes(i)) continue;
    picked.push(i);
  }

  return {
    swaps: picked.map((i) => {
      const city = stays[i];
      const pool = generateHotelsForCity(city, it.dest, day, day, it.days[i].n) || [];
      // Not the first in the list: the one going out is the first, so the one
      // coming in has to be something else. And not one named after a town it
      // is not in, because the stays are drawn from one pool of names for the
      // whole country and "InterContinental Hanoi, Ha Long" is a typo as far
      // as anybody reading the card is concerned.
      const elsewhere = (destAreas[it.dest] || [])
        .map((a) => a.city)
        .filter((c) => c && c !== city);
      const fits = (htl) => htl && !elsewhere.some((c) => htl.name.includes(c));
      const sub = pool.slice(1).find(fits) || pool.find(fits) || pool[1] || pool[0] || null;
      return {
        index: i,
        city,
        // The one going out has to be the one the itinerary card shows, or the
        // swap names a hotel that was never on the trip.
        from: `${city} Grand Resort`,
        to: sub?.name || `${city} Riverside`,
        stars: sub?.stars || 4,
        // The substitute itself, so the copy can be made with it already in
        // place. Telling somebody we changed a hotel and then handing them an
        // itinerary with the old one on it is worse than not telling them.
        hotel: sub,
      };
    }),
  };
}
