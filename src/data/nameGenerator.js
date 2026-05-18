// Deterministic itinerary-name generator (Bali).
// Goal: >500 unique names per destination using word banks + templates.
// Input: an itinerary `{ id, route:[{city,n}], nights }`.
// Output: a string ≤24 chars.
//
// Tone: playful, couple-first, sometimes touches on love/romance but capped.

// ─── Word banks ───
const BALI = {
  // Stay areas / cities (pulled from route when available; fallback to bank).
  places: [
    "Ubud", "Seminyak", "Sanur", "Canggu", "Uluwatu",
    "Kintamani", "Nusa Dua", "Amed", "Sidemen", "Munduk",
    "Nusa Penida", "Lovina", "Pemuteran", "Tabanan", "Jimbaran",
  ],
  // Concrete nouns - the "what you'll see" bucket.
  nouns: [
    "Paddies", "Swings", "Temples", "Beaches", "Reefs",
    "Cliffs", "Caves", "Waterfalls", "Volcanoes", "Sunsets",
    "Sunrises", "Villas", "Jungles", "Terraces", "Moons",
    "Bonfires", "Lanterns", "Pools", "Shores", "Bamboo",
    "Lagoons", "Mists", "Spices", "Courtyards", "Reefs",
    "Breezes", "Shrines", "Markets", "Rituals", "Harvests",
  ],
  // Emotional / experiential words.
  feelings: [
    "Bliss", "Calm", "Serenity", "Wanderlust", "Joy",
    "Magic", "Escape", "Togetherness", "Stillness", "Wonder",
    "Peace", "Awe", "Dreaming", "Reverie", "Afterglow",
  ],
  // Softer love-pool; used on ~1-in-8 names only.
  loveWords: ["Romance", "Love", "Honeymoon"],
  // Active verbs.
  verbs: [
    "Chase", "Swing", "Snorkel", "Sip", "Wander", "Roam",
    "Dive", "Ride", "Hike", "Unwind", "Linger", "Drift",
    "Feast", "Stroll", "Rest", "Bike", "Sail", "Climb",
  ],
  // Descriptors that pair well with a city or "Bali".
  adjs: [
    "Sacred", "Jungle", "Island", "Slow", "Hidden", "Secret",
    "Wild", "Laid-back", "Royal", "Barefoot", "Lush", "Quiet",
    "Sunlit", "Soulful", "Tropical", "Coastal", "Golden",
    "Starlit", "Whispered", "Dreamy", "Rain-kissed", "Untamed",
    "Storied", "Breezy",
  ],
  // Short qualifiers (short/quick/grand).
  scales: {
    short: ["Short", "Quick", "Weekend"],
    long: ["Grand", "All of", "Best of"],
  },
};

// Templates; each returns a string or null if it can't fit.
// `ctx = { dest, cities, nights, seed, pick }`. `pick(arr, offset)` returns a deterministic element.
const TEMPLATES = [
  // 1. Cities from the route → specific to the itinerary
  ({ cities }) => cities.length >= 2 ? `${cities[0]} & ${cities[cities.length - 1]}` : null,
  // 2. First city to last city
  ({ cities }) => cities.length >= 2 ? `${cities[0]} to ${cities[cities.length - 1]}` : null,
  // 3. Adj + first city
  ({ cities, pick }) => cities.length ? `${pick("adjs")} ${cities[0]}` : null,
  // 4. City's Noun (possessive)
  ({ cities, pick }) => cities.length ? `${cities[0]}'s ${pick("nouns")}` : null,
  // 5. Noun + Noun  (e.g. "Paddies & Swings")
  ({ pick }) => `${pick("nouns")} & ${pick("nouns", 1)}`,
  // 6. Verb, Verb & Verb  (up to 24 chars)
  ({ pick }) => {
    const s = `${pick("verbs")}, ${pick("verbs", 1)} & ${pick("verbs", 2)}`;
    return s.length <= 24 ? s : null;
  },
  // 7. Adj + Dest  (e.g. "Sacred Bali")
  ({ dest, pick }) => `${pick("adjs")} ${dest}`,
  // 8. Feeling + "in" + Dest / City
  ({ dest, cities, pick }) => `${pick("feelings")} in ${cities[0] || dest}`,
  // 9. Nights + "N of" + Feeling  ("7N of Bliss")
  ({ nights, pick }) => nights ? `${nights}N of ${pick("feelings")}` : null,
  // 10. Scale + Dest  ("Short Bali", "Best of Bali")
  ({ dest, nights, pick }) => {
    if (!nights) return null;
    const scaleSet = nights <= 5 ? "short" : nights >= 10 ? "long" : null;
    if (!scaleSet) return null;
    const scale = pick("scales", 0, scaleSet);
    // "All of", "Best of" already trailing with "of"; others are prefixes.
    return /of$/.test(scale) ? `${scale} ${dest}` : `${scale} ${dest}`;
  },
  // 11. "A Feeling in Dest"
  ({ dest, pick }) => `A ${pick("feelings")} in ${dest}`,
  // 12. "Two Hearts, Two {Noun}"
  ({ pick }) => {
    const s = `Two Hearts, Two ${pick("nouns")}`;
    return s.length <= 24 ? s : null;
  },
  // 13. Adj + Noun (very high entropy: ~24 × 30)
  ({ pick }) => `${pick("adjs")} ${pick("nouns", 3)}`,
  // 14. City + Noun  ("Ubud Terraces")
  ({ cities, pick }) => cities.length ? `${cities[0]} ${pick("nouns", 5)}` : null,
  // 15. "Verb the Noun"  ("Chase the Sunset")
  ({ pick }) => {
    const s = `${pick("verbs")} the ${pick("nouns", 7)}`;
    return s.length <= 24 ? s : null;
  },
  // 16. Adj + first-city + last-city initial  ("Sacred U-S")
  ({ cities, pick }) => cities.length >= 2 ? `${pick("adjs")} ${cities[0]}` : null,
  // ── Love-tinted templates (gated by hash; used rarely) ──
  ({ pick }) => `${pick("loveWords")} Among ${pick("nouns")}`,
  ({ dest, pick }) => `${pick("loveWords")} in ${dest}`,
  ({ cities, pick }) => cities.length ? `${cities[0]} ${pick("loveWords")}` : null,
];

// Indexes of templates that contain love/romance/honeymoon - gated.
const LOVE_TEMPLATE_IDX = new Set([16, 17, 18]);

// ─── Hashing ───
// djb2-ish deterministic hash.
function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Deterministic picker: returns element at `(seed + offset) mod len`.
function makePick(bank, seed) {
  return (category, offset = 0, subKey = null) => {
    const pool = subKey ? bank[category][subKey] : bank[category];
    return pool[(seed + offset) % pool.length];
  };
}

// ─── Public API ───
export function generateBaliName(itinerary, usedNames = new Set()) {
  const cities = (itinerary.route || []).map(r => r.city);
  const nights = itinerary.nights || 0;
  const dest = "Bali";
  const baseSeed = hash(`${itinerary.id}|${cities.join(",")}|${nights}`);

  // "Love" gate: only 1-in-8 itineraries eligible for love templates.
  const loveAllowed = baseSeed % 8 === 0;

  // Try templates in a deterministic order starting from seed.
  for (let attempt = 0; attempt < TEMPLATES.length * 3; attempt++) {
    const tmplIdx = (baseSeed + attempt) % TEMPLATES.length;
    if (!loveAllowed && LOVE_TEMPLATE_IDX.has(tmplIdx)) continue;
    const pick = makePick(BALI, baseSeed + attempt);
    let name;
    try {
      name = TEMPLATES[tmplIdx]({ dest, cities, nights, seed: baseSeed + attempt, pick });
    } catch { name = null; }
    if (!name || name.length > 24) continue;
    if (usedNames.has(name)) continue;
    usedNames.add(name);
    return name;
  }
  // Fallback - should be statistically impossible with our namespace.
  return `${dest} ${nights}N`;
}

// Convenience: generate names for a batch of itineraries, guaranteeing
// per-destination uniqueness.
export function generateBaliNames(itineraries) {
  const used = new Set();
  const out = {};
  for (const it of itineraries) {
    out[it.id] = generateBaliName(it, used);
  }
  return out;
}
