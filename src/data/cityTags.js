import { allItineraries } from "../data";
import { destAreas, areaImg } from "./buildData";
import { cityVibes } from "./dayOptions";
import { activityKind, KIND_TONE } from "./activityKind";
import { isDayTrip } from "./discoverData";

// ─── What a city is, beside what it is like ───
//
// The cities step carries two things under each name now. A one line theme,
// which is the city itself: "Overnight bay cruise", "Old Quarter, lakes and
// food". And a chip or two for the things a sentence cannot say, which is
// where this file comes in.
//
// Everything here is read off data we already hold, so a chip cannot say
// something the rest of the app disagrees with:
//
//   trending       the most of our itineraries stop there
//   often booked   at or above the middle of its country
//   offbeat        the area carries a low crowd level
//   gets busy      a high one
//   day trip       somewhere you go and come back from
//
// Nothing here is a star rating, a price or a sales count. We hold none of
// them per city, and a made-up one on the step somebody is choosing from is
// one a consultant has to walk back on a call.

// A kind is the right word for an activity and sometimes the wrong one for a
// place. "On the water" is what a bay cruise is; "Cruise and boats" is what
// Ha Long is.
const THEME_LABEL = {
  "On the water": "Cruise and boats",
  "On foot": "Walkable",
  "After dark": "Nightlife",
};

// ─── Three colours, no grey ───
//
// Gold for how booked a place is, teal for the quiet ones, violet for the
// busy ones. The set used to lean on a neutral grey, which on a card that is
// already mostly white reads as a disabled control rather than a fact worth
// knowing. Every ink clears 4.5:1 on its own ground: 6.4, 6.0 and 6.1.
const TONE = {
  booked: { bg: "#FFF7E0", fg: "#7A5300" },
  quiet: { bg: "#E3F4F3", fg: "#0B6474" },
  busy: { bg: "#F2EAFA", fg: "#6D28D9" },
};

// ─── The theme ───
//
// Counted across the city's own day plans, so it is the same answer the day
// planner would give. One chip where a city has one clear character, two where
// it genuinely has two: Hanoi is culture and food in equal measure, Ha Long is
// the bay and nothing else, and padding Ha Long out to two would mean printing
// the one adventure day as though it were half the city.
export function cityThemes(city) {
  const counts = new Map();
  for (const v of cityVibes[city] || []) {
    for (const name of v.activities || []) {
      const k = activityKind(name);
      if (k) counts.set(k, (counts.get(k) || 0) + 1);
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return [];
  const top = ranked[0][1];
  // Within one of the leader and worth more than a single mention. A city
  // whose kinds are all ones has no theme to speak of, so it shows its first.
  const strong = ranked.filter(([, n]) => n >= 2 && n >= top - 1).slice(0, 2);
  return (strong.length ? strong : ranked.slice(0, 1)).map(([k]) => k);
}

// How many of our itineraries stop in each city of a destination.
function tripCounts(dest) {
  const out = {};
  for (const a of destAreas[dest] || []) {
    out[a.city] = allItineraries.filter(
      (it) => it.dest === dest && (it.route || []).some((s) => s.city === a.city)
    ).length;
  }
  return out;
}

// ─── Every chip a city can wear ───
//
// Two at most, and one on most cities. The line above them already says what
// the place is, so these say what a sentence cannot: how booked it is and how
// busy it gets. A theme chip is the fallback for a city none of that is true
// of, so no card is ever bare.
//
// "Paired with Hanoi" was here and is gone: on a step where somebody is
// choosing several cities, naming another one on the card is an answer to a
// question they have not been asked yet.
export function cityTags(dest, city, max = 2) {
  const area = (destAreas[dest] || []).find((a) => a.city === city) || {};
  const counts = tripCounts(dest);
  const mine = counts[city] || 0;
  const all = Object.values(counts).filter((n) => n > 0).sort((a, b) => b - a);
  const top = all[0] || 0;
  const median = all.length ? all[Math.floor((all.length - 1) / 2)] : 0;

  const out = [];
  // Most booked of its country. The word rather than a count, because the
  // count is itineraries and a number would read as sales.
  if (mine > 0 && mine === top) out.push({ key: "trending", label: "Trending", ...TONE.booked });
  else if (mine > 0 && mine >= median) out.push({ key: "often", label: "Often booked", ...TONE.booked });

  if (area.crowd === "Low") out.push({ key: "offbeat", label: "Offbeat", ...TONE.quiet });
  else if (area.crowd === "High") out.push({ key: "busy", label: "Gets busy", ...TONE.busy });

  if (isDayTrip(dest, city)) out.push({ key: "daytrip", label: "Day trip", ...TONE.quiet });

  // Nothing true of it yet, so say what it is.
  if (!out.length) {
    for (const k of cityThemes(city)) {
      const t = KIND_TONE[k] || TONE.quiet;
      out.push({ key: `theme-${k}`, label: THEME_LABEL[k] || k, bg: t.bg, fg: t.fg });
    }
  }

  return out.slice(0, max);
}

// ─── The pictures of a place ───
//
// The card shows one photograph and a couple can swipe for more, so it needs
// a few per city rather than one. They are assembled from the city's own
// stay-area shot where we hold one, then the destination's activity pool.
//
// Which is the honest limit of this: outside Bali we hold no photography per
// city, so the extra frames are the country's, and a swipe through Hanoi and
// a swipe through Ha Long pass some of the same pictures. One frame hid that;
// a reel does not. It is the right shape for the photography we should have,
// and the fix is the photographs, not the component.
const PHOTOS = new Map();
export function cityPhotos(dest, city, limit = 4) {
  const key = `${dest}|${city}|${limit}`;
  if (PHOTOS.has(key)) return PHOTOS.get(key);
  const areas = destAreas[dest] || [];
  const i = Math.max(0, areas.findIndex((a) => a.city === city));
  const pool = [];
  for (let k = 0; k < limit; k += 1) pool.push(areaImg(dest, city, i + k));
  const out = [...new Set(pool.filter(Boolean))].slice(0, limit);
  PHOTOS.set(key, out);
  return out;
}
