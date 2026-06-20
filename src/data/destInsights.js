// Written-in itinerary insights, keyed by destination. In production these
// qualitative bits (verdict line, photogenic read, trip highlights/heads-up)
// would come from a Gemini call; here they're hand-authored so the scoreboard
// looks final with no backend. Same lookup shape as destAreas/destMeta.
//   photogenic: "Low" | "Medium" | "High"
//   highlights / headsUp: short customer-facing lines (Trip/Region level)

export const destInsights = {
  Bali: {
    title: "Well-balanced trip with cultural depth",
    blurb: "A thoughtful blend of culture, nature and beach time, paced so you can actually enjoy it.",
    photogenic: "High",
    highlights: [
      "Ubud blends rice terraces, temples and a calm arts scene.",
      "Seminyak adds vibrant beach clubs and sunset dining.",
    ],
    headsUp: [
      "Seminyak–Ubud traffic gets heavy at peak hours.",
      "The famous temples are busiest mid-morning.",
    ],
  },
  Vietnam: {
    title: "Rich north-to-south journey",
    blurb: "Old-town charm, a bay cruise and big-city energy, with enough variety to keep every day fresh.",
    photogenic: "High",
    highlights: [
      "Hoi An's lantern-lit old town is magical at dusk.",
      "A Ha Long Bay cruise is a clear trip highlight.",
    ],
    headsUp: [
      "North–south distances mean a couple of longer transfers.",
      "Cities are lively and traffic-heavy.",
    ],
  },
  Thailand: {
    title: "City buzz meets island calm",
    blurb: "Temples and street food balanced with easy beach-and-boat days down south.",
    photogenic: "Medium",
    highlights: [
      "Bangkok's temples and street food are world-class.",
      "Island days are all beaches, boats and sunsets.",
    ],
    headsUp: [
      "Island transfers can take up half a day.",
      "Tourist hotspots get crowded in peak season.",
    ],
  },
  Maldives: {
    title: "Pure rest by the sea",
    blurb: "Overwater living, house-reef snorkelling and slow sunsets — built for switching off.",
    photogenic: "High",
    highlights: [
      "Overwater villas and house-reef snorkelling are unmatched.",
      "It's all about sea, spa and doing very little.",
    ],
    headsUp: [
      "Seaplane transfers add time and cost.",
      "Little to do beyond your resort.",
    ],
  },
  "Sri Lanka": {
    title: "Compact, varied island loop",
    blurb: "Culture, hill-country tea estates, wildlife and coast — a lot packed into a small island.",
    photogenic: "High",
    highlights: [
      "The hill-country train through tea estates is unforgettable.",
      "A compact mix of culture, wildlife and beaches.",
    ],
    headsUp: [
      "Road journeys between regions are slow.",
      "Weather differs a lot between coast and hills.",
    ],
  },
  "New Zealand": {
    title: "Big-landscape adventure",
    blurb: "Lakes, peaks and adventure towns strung along dramatic scenic drives.",
    photogenic: "High",
    highlights: [
      "Queenstown packs lakes, peaks and adventure in one base.",
      "Dramatic landscapes at nearly every turn.",
    ],
    headsUp: [
      "Long scenic drives sit between most stops.",
      "Activities are weather-dependent.",
    ],
  },
};

const DEFAULT_INSIGHT = {
  title: "A well-rounded trip",
  blurb: "A balanced mix of experiences across your days.",
  photogenic: "Medium",
  highlights: ["A good spread of experiences across the trip."],
  headsUp: ["Allow a little buffer for transfers between areas."],
};

export const getDestInsight = (dest) => destInsights[dest] || DEFAULT_INSIGHT;
