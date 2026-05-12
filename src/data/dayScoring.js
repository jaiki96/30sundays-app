// ─── Day Scoring ───────────────────────────────────────────────────────────
// Derives Pace / Activity time / Travel time / Crowd scores for a given day.
// Threshold defaults are placeholders; tune after validating against real days.

const ACTIVITY_DURATIONS = [2, 3, 1.5, 2.5]; // hrs cycle (matches DURATIONS in DayWiseScreen)
const IDEAL_DURATIONS = { default: 2.5 };    // curated fallback

// Per-activity ideal times (curated – TBD by content team).
const ACT_IDEAL = {
  "Old Quarter": 3,
  "Bay cruise": 4,
  "Caves": 2,
  "Kayaking": 1.5,
  "Cu Chi": 3,
  "Markets": 1.5,
  "Beach": 3,
  "Spa": 1.5,
  "Cooking": 3,
  "Snorkeling": 2,
  "Pagodas": 1.5,
  "Lanterns": 1,
  "Tailoring": 1,
};

// Crowd & queue per activity (LLM/Google Places stub).
const CROWD_TABLE = {
  "Old Quarter":   { crowd: "high",   queue: "short",     wait: "Walk-in" },
  "Bay cruise":    { crowd: "medium", queue: "short",     wait: "Pre-booked" },
  "Caves":         { crowd: "high",   queue: "long",      wait: "Up to 90 min" },
  "Kayaking":      { crowd: "low",    queue: "short",     wait: "Walk-in" },
  "Cu Chi":        { crowd: "medium", queue: "moderate",  wait: "30–45 min" },
  "Markets":       { crowd: "high",   queue: "short",     wait: "No queue" },
  "Beach":         { crowd: "low",    queue: "short",     wait: "No queue" },
  "Spa":           { crowd: "low",    queue: "short",     wait: "Pre-booked" },
  "Cooking":       { crowd: "low",    queue: "short",     wait: "Pre-booked" },
  "Snorkeling":    { crowd: "medium", queue: "short",     wait: "Pre-booked" },
  "Pagodas":       { crowd: "high",   queue: "moderate",  wait: "20–30 min" },
  "Lanterns":      { crowd: "high",   queue: "short",     wait: "No queue" },
  "Tailoring":     { crowd: "low",    queue: "short",     wait: "Walk-in" },
  "Temple":        { crowd: "high",   queue: "moderate",  wait: "20–30 min" },
  "Street food":   { crowd: "high",   queue: "moderate",  wait: "15–25 min" },
  "Rooftop bars":  { crowd: "medium", queue: "short",     wait: "Reservation" },
  "Golden Bridge": { crowd: "high",   queue: "long",      wait: "Up to 60 min" },
  "Lantern Night": { crowd: "high",   queue: "short",     wait: "No queue" },
};

// Travel-leg estimates (stub – will come from routing data).
function buildLegs(day, isFirstDay, isLastDay, prevCity, cityChanged, nextCity) {
  const city = day.city;
  const legs = [];
  if (isFirstDay) {
    legs.push({ from: "Airport", to: `${city} hotel`, time: 1, km: 25, mode: "🚗" });
  } else if (cityChanged) {
    legs.push({ from: `${prevCity}`, to: `${city}`, time: 4, km: 180, mode: "🚐", multi: [
      { from: `${prevCity} hotel`, to: `${prevCity} terminal`, time: 0.5, km: 8, mode: "🚗" },
      { from: `${prevCity} terminal`, to: `${city} terminal`, time: 3, km: 160, mode: "🚐" },
      { from: `${city} terminal`, to: `${city} hotel`, time: 0.5, km: 12, mode: "🚗" },
    ]});
  }
  // Hotel → first activity, between activities, last activity → hotel
  const acts = day.activities || [];
  acts.forEach((a, i) => {
    if (i === 0) {
      legs.push({ from: "Hotel", to: a.name, time: 0.5, km: 6, mode: "🚗" });
    } else {
      legs.push({ from: acts[i - 1].name, to: a.name, time: 0.5, km: 5, mode: "🚗" });
    }
  });
  if (acts.length) legs.push({ from: acts[acts.length - 1].name, to: "Hotel", time: 0.5, km: 6, mode: "🚗" });
  if (isLastDay) {
    legs.push({ from: "Hotel", to: "Airport", time: 1, km: 25, mode: "🚗" });
  }
  return legs;
}

export function getDayScore(day, dayIdx, allDays) {
  const acts = day?.activities || [];
  const isFirstDay = dayIdx === 0;
  const isLastDay = dayIdx === allDays.length - 1;
  const prevDay = !isFirstDay ? allDays[dayIdx - 1] : null;
  const nextDay = !isLastDay ? allDays[dayIdx + 1] : null;
  const cityChanged = prevDay && prevDay.city !== day.city;

  // Per-activity time at place
  const perActivity = acts.map((a, i) => ({
    name: a.name,
    img: a.img,
    time: ACTIVITY_DURATIONS[i % ACTIVITY_DURATIONS.length],
    ideal: ACT_IDEAL[a.name] || IDEAL_DURATIONS.default,
    crowd: (CROWD_TABLE[a.name]?.crowd) || "medium",
    queue: (CROWD_TABLE[a.name]?.queue) || "short",
    wait:  (CROWD_TABLE[a.name]?.wait)  || "Walk-in",
  }));

  // Aggregate Activity time
  const activityHrs = perActivity.reduce((s, a) => s + a.time, 0);

  // Travel legs
  const legs = buildLegs(day, isFirstDay, isLastDay, prevDay?.city, cityChanged, nextDay?.city);
  const travelHrs = legs.reduce((s, l) => s + l.time, 0);

  // Pace from triggers (worst of the three)
  const activityCount = acts.length;
  let pace = "relaxed";
  const activeHrs = activityHrs + travelHrs;
  if (activeHrs > 8 || activityCount >= 4 || travelHrs > 3) pace = "hectic";
  else if (activeHrs > 6 || activityCount >= 3 || travelHrs > 1.5) pace = "neutral";

  // Activity-time band
  let activityBand = "light";
  if (activityHrs > 6) activityBand = "packed";
  else if (activityHrs >= 3) activityBand = "balanced";

  // Travel-time band
  let travelBand = "short";
  if (travelHrs > 3) travelBand = "long";
  else if (travelHrs >= 1.5) travelBand = "moderate";

  // Crowd/queue averages → band
  const crowdScore = perActivity.reduce((s, a) => s + ({ low: 1, medium: 2, high: 3 }[a.crowd] || 2), 0) / Math.max(perActivity.length, 1);
  const queueScore = perActivity.reduce((s, a) => s + ({ short: 1, moderate: 2, long: 3 }[a.queue] || 1), 0) / Math.max(perActivity.length, 1);

  let crowdBand = "low";
  if (crowdScore > 2.5) crowdBand = "high";
  else if (crowdScore >= 1.5) crowdBand = "medium";

  let queueBand = "short";
  if (queueScore > 2.5) queueBand = "long";
  else if (queueScore >= 1.5) queueBand = "moderate";

  return {
    pace,            // relaxed | neutral | hectic
    activityHrs,
    activityBand,    // light | balanced | packed
    travelHrs,
    travelBand,      // short | moderate | long
    crowdBand,       // low | medium | high
    queueBand,       // short | moderate | long
    perActivity,
    legs,
  };
}

// ─── Copy banks (TBD by content team) ─────────────────────────────────────

export const PACE_COPY = {
  hectic: {
    label: "Hectic",
    means: "Lots packed in. You'll be moving most of the day with little downtime.",
    audience: "Most honeymooners prefer Neutral or Relaxed — pick this only if you love a fast pace.",
    tip: "Skip one optional activity to free up an evening for yourselves.",
  },
  neutral: {
    label: "Neutral",
    means: "A balanced day — a few core experiences with breathing room in between.",
    audience: "A safe default for couples who want to see things without rushing.",
    tip: "Save the spa or sunset for after your last activity — you'll have time.",
  },
  relaxed: {
    label: "Relaxed",
    means: "Light schedule. Long mornings, leisurely lunches, room to wander.",
    audience: "Honeymooners and couples who want togetherness over checklists love this.",
    tip: "Use the free hours for a couple's massage or a quiet beach picnic.",
  },
};

export const ACT_TIME_COPY = {
  packed: { label: "Packed",  tip: "Trim 30 min from one activity to enjoy the rest more." },
  balanced:{ label: "Balanced",tip: "Stick to the plan — the timing is well-spaced." },
  light:   { label: "Light",   tip: "Add a long lunch or a slow café stop in between." },
};

export const TRAVEL_COPY = {
  long:     { label: "Long",     tip: "Big transfer day — pack snacks and pre-load music." },
  moderate: { label: "Moderate", tip: "Comfortable transfers. Not draining." },
  short:    { label: "Short",    tip: "Minimal travel — most time spent at places." },
};

export const CROWD_COPY = {
  high:   { label: "High",   tip: "Go early or after 4 PM to avoid the worst crowds." },
  medium: { label: "Medium", tip: "Manageable any time of day." },
  low:    { label: "Low",    tip: "Quiet spots — soak it in." },
};

export const QUEUE_COPY = {
  long:     { label: "Long" },
  moderate: { label: "Moderate" },
  short:    { label: "Short" },
};

// ─── Score palette + scoring API from main (PR #2) ───────────────────────
// Day-level scoring: Pace · Activity time · Travel time · Crowds
// Levels are 0 = green (easy/low), 1 = amber (moderate/mixed), 2 = red (intense/high).

export const SCORE_PALETTE = {
  green: { bg: "#D7EFE4", icon: "#4EAC7E", text: "#2E7D52" },
  amber: { bg: "#FEF5E5", icon: "#FDA201", text: "#A66B00" },
  red:   { bg: "#FFE6ED", icon: "#FD014F", text: "#C8003F" },
};

export const LEVEL_KEYS = ["green", "amber", "red"];

const TIPS = {
  pace: [
    "Soak in slow mornings. Lean into unhurried meals and detours.",
    "A balanced day. Front-load the highlight; you won't feel rushed later.",
    "Pack light, charge phones early. Skip one optional stop if energy dips.",
  ],
  activity: [
    "Stretch the experience. Order a slow lunch in between.",
    "Book key timed entries; keep midday flexible for a long lunch.",
    "Pace yourself. Not every minute needs to be productive.",
  ],
  travel: [
    "All your time is for the destination. Lucky day.",
    "Snacks, charged phones, a playlist. The hours pass quickly.",
    "Treat the transit as part of the trip. Book a window seat.",
  ],
  crowd: [
    "You'll have space to breathe. Enjoy the quiet.",
    "Arrive 15 min before posted opening to skip the rush.",
    "Go early or late. Middle of the day is the worst window.",
  ],
};

// Static metric explainers — one neutral line per metric, used at the top of every modal.
// Generic by design (not level-specific) so they don't require LLM generation.
const METRIC_EXPLAINERS = {
  pace: "How packed your day feels overall, balancing activities, transit time, and breaks.",
  activity: "Total time at curated experiences. Excludes transit and meals.",
  travel: "Total time in transit, including flights, transfers, ferries, and short hops between stops.",
  crowd: "How busy each place is when you visit.",
  queue: "How long you'll typically wait to enter or get tickets.",
};

// Per-level tag definitions — used only inside the "other levels" accordion.
const PACE_DEFS = {
  Relaxed: "Just 1 to 2 stops with plenty of downtime to soak in each place.",
  Neutral: "A balanced mix of stops and breaks. Moves at a comfortable rhythm.",
  Hectic: "4 or more stops back-to-back, often with a transfer in between.",
};

const CROWD_DEFS = {
  Low: "Quiet stops with minimal queues.",
  Mixed: "A blend of busy and quiet stops.",
  High: "Popular stops with regular queues at peak times.",
};

const QUEUE_DEFS = {
  Short: "Walk-in or under 10 minutes wait.",
  Medium: "10 to 30 minutes wait at peak times.",
  Long: "30+ minutes. Book skip-the-line where you can.",
};

const BEACH_CITIES = [
  "Phu Quoc","Hoi An","Da Nang","Nha Trang","Sanur","Nusa Dua","Mirissa",
  "Krabi","Koh Samui","Phuket","Trincomalee","Pemuteran","Lovina","Amed","Canggu",
];
const CITY_CITIES = ["Hanoi","HCMC","Bangkok","Colombo","Malé"];

function fmtHrs(h) {
  if (h === 1) return "1 hr";
  if (h % 1 === 0) return `${h} hrs`;
  return `${h.toFixed(1)} hrs`;
}

export function getDayScoring(day, dayIdx, allDays) {
  const acts = day?.activities || [];
  const isFirst = dayIdx === 0;
  const isLast = dayIdx === allDays.length - 1;
  const prevCity = dayIdx > 0 ? allDays[dayIdx - 1].city : null;
  const cityChanged = prevCity && prevCity !== day.city;
  const isBeach = BEACH_CITIES.includes(day.city);
  const isCity = CITY_CITIES.includes(day.city);

  // PACE — based on activity count, transitions, beach/city
  let paceLevel = 1;
  if (acts.length <= 2 || isBeach) paceLevel = 0;
  if (acts.length >= 4 || cityChanged || isFirst || isLast) paceLevel = 2;
  const paceLabels = ["Relaxed", "Neutral", "Hectic"];

  // ACTIVITY TIME — sum of curated activity durations
  const ACT_DURS = [2, 3, 1.5, 2.5];
  const actHrs = acts.reduce((s, _, i) => s + ACT_DURS[i % ACT_DURS.length], 0);
  let actLevel = 1;
  if (actHrs <= 4) actLevel = 0;
  if (actHrs >= 7) actLevel = 2;
  const actLabels = ["Light", "Moderate", "Intense"];

  // TRAVEL TIME — flight days are heavy, normal days light
  let travelHrs = 0.5;
  if (cityChanged) travelHrs = 4;
  if (isFirst) travelHrs = 6;
  if (isLast) travelHrs = 5;
  let travelLevel = 0;
  if (travelHrs > 1) travelLevel = 1;
  if (travelHrs > 4) travelLevel = 2;
  const travelLabels = ["Low", "Moderate", "High"];

  // CROWDS — by city archetype
  let crowdLevel = 1;
  if (isBeach) crowdLevel = 0;
  if (isCity) crowdLevel = 2;
  const crowdLabels = ["Low", "Mixed", "High"];

  // Per-activity rows (used by Activity & Crowd modals)
  const IDEAL = ["2 hrs", "3 hrs", "1.5 hrs", "2 hrs"];
  const CROWD_LEVELS = ["low", "mixed", "high"];
  const QUEUE_LEVELS = ["short", "medium", "long"];
  const CROWD_NOTES = [
    "Open early; quietest before noon.",
    "Steady through the day; arrive between rushes.",
    "Expect ~30 min wait at peak; book skip-the-line.",
  ];

  const activityRows = acts.map((a, i) => ({
    name: a.name,
    img: a.img,
    timeAt: `${ACT_DURS[i % 4]} hr${ACT_DURS[i % 4] === 1 ? "" : "s"}`,
    idealTime: IDEAL[i % IDEAL.length],
    crowd: CROWD_LEVELS[i % 3],
    queue: QUEUE_LEVELS[i % 3],
    crowdNote: CROWD_NOTES[i % 3],
  }));

  // Travel legs
  const legs = [];
  if (isFirst) {
    legs.push({ from: "Mumbai", to: day.city, time: "5 hr 30 min", km: "—", mode: "flight" });
    legs.push({ from: `${day.city} airport`, to: "Hotel", time: "30 min", km: "12 km", mode: "car" });
  } else if (cityChanged) {
    legs.push({ from: prevCity, to: day.city, time: "3 hr 30 min", km: "180 km", mode: "car" });
    legs.push({ from: `${day.city} arrival`, to: "Hotel", time: "30 min", km: "8 km", mode: "car" });
  } else if (isLast) {
    legs.push({ from: "Hotel", to: `${day.city} airport`, time: "45 min", km: "20 km", mode: "car" });
    legs.push({ from: day.city, to: "Mumbai", time: "5 hr 30 min", km: "—", mode: "flight" });
  } else {
    acts.forEach((a, i) => {
      if (i === 0) legs.push({ from: "Hotel", to: a.name, time: "20 min", km: "6 km", mode: "car" });
      else legs.push({ from: acts[i-1].name, to: a.name, time: "15 min", km: "4 km", mode: "car" });
    });
    if (acts.length) legs.push({ from: acts[acts.length-1].name, to: "Hotel", time: "25 min", km: "7 km", mode: "car" });
  }

  // Derived quick-look stats and friendly summaries for design variants.
  const transitions = (cityChanged ? 1 : 0) + (isFirst ? 1 : 0) + (isLast ? 1 : 0);
  const longestLeg = legs.length ? legs.reduce((m, l) => {
    const mins = parseLegMinutes(l.time);
    return mins > m.mins ? { mins, label: l.time } : m;
  }, { mins: 0, label: "—" }).label : "—";
  const totalKm = legs.reduce((s, l) => s + (parseInt(l.km, 10) || 0), 0);

  const paceSummary = paceLevel === 2 ? `${acts.length} stops · ${fmtHrs(travelHrs)} in transit`
                    : paceLevel === 1 ? `${acts.length} stops · ${fmtHrs(travelHrs)} in transit`
                    : `${acts.length} stops · ${fmtHrs(travelHrs)} in transit`;

  const actSummary = actLevel === 2 ? "Long day at curated experiences."
                   : actLevel === 1 ? "Balanced activity mix with breathing room."
                   : "Light on stops, heavy on flexibility.";

  const travSummary = travelLevel === 2 ? "Long transit day, usually a flight or border crossing."
                    : travelLevel === 1 ? "A few short hops between stops."
                    : "Stay-put day with minimal transit.";

  const crowdSummary = crowdLevel === 2 ? "Busy hotspots; expect queues at peaks."
                     : crowdLevel === 1 ? "A mix of busy and quiet stops."
                     : "Peaceful day with minimal queues.";

  // 0-100 numeric scores for the comparison variant.
  const numericScore = (lvl) => lvl === 2 ? 85 : lvl === 1 ? 50 : 20;

  return {
    pace: {
      level: paceLevel,
      label: paceLabels[paceLevel],
      labels: paceLabels,
      summary: paceSummary,
      explainer: METRIC_EXPLAINERS.pace,
      otherTags: paceLabels.map((l, i) => ({ label: l, level: i, definition: PACE_DEFS[l] })).filter(t => t.level !== paceLevel),
      score: numericScore(paceLevel),
      emoji: paceLevel === 2 ? "🎢" : paceLevel === 1 ? "🌤️" : "🧘",
      quickStats: [
        { label: "Activities", value: String(acts.length) },
        { label: "Travel", value: fmtHrs(travelHrs) },
      ],
      breakdown: [
        { label: "Activity", value: actHrs, max: 10 },
        { label: "Travel", value: travelHrs, max: 10 },
      ],
      whyText: "How packed your day feels — based on activities, travel time, and downtime between stops.",
      audienceNote: "Most honeymooners prefer Relaxed or Neutral days.",
      calcText: "Activity hours + travel hours, weighted against daylight time and changeovers.",
      tip: TIPS.pace[paceLevel],
    },
    activity: {
      level: actLevel,
      label: actLabels[actLevel],
      labels: actLabels,
      hours: actHrs,
      hoursText: fmtHrs(actHrs),
      activities: activityRows,
      summary: actSummary,
      explainer: METRIC_EXPLAINERS.activity,
      score: numericScore(actLevel),
      emoji: actLevel === 2 ? "🎯" : actLevel === 1 ? "📍" : "🌴",
      quickStats: [
        { label: "Stops", value: String(acts.length) },
        { label: "Total", value: fmtHrs(actHrs) },
      ],
      whyText: "Total time you'll spend at curated experiences — excluding transit and meals.",
      tip: TIPS.activity[actLevel],
    },
    travel: {
      level: travelLevel,
      label: travelLabels[travelLevel],
      labels: travelLabels,
      hours: travelHrs,
      hoursText: fmtHrs(travelHrs),
      totalKm,
      legs,
      summary: travSummary,
      explainer: METRIC_EXPLAINERS.travel,
      score: numericScore(travelLevel),
      emoji: travelLevel === 2 ? "✈️" : travelLevel === 1 ? "🚗" : "🏨",
      quickStats: [
        { label: "Legs", value: String(legs.length) },
        { label: "Total", value: fmtHrs(travelHrs) },
      ],
      longestLeg,
      whyText: "Total time you'll spend in transit — flights, transfers, ferries, and short hops between stops.",
      tip: TIPS.travel[travelLevel],
    },
    crowd: {
      level: crowdLevel,
      label: crowdLabels[crowdLevel],
      labels: crowdLabels,
      activities: activityRows,
      summary: crowdSummary,
      crowdExplainer: METRIC_EXPLAINERS.crowd,
      queueExplainer: METRIC_EXPLAINERS.queue,
      crowdLevels: crowdLabels.map((l, i) => ({ label: l, level: i, definition: CROWD_DEFS[l] })),
      queueLevels: ["Short", "Medium", "Long"].map((l, i) => ({ label: l, level: i, definition: QUEUE_DEFS[l] })),
      score: numericScore(crowdLevel),
      emoji: crowdLevel === 2 ? "👥" : crowdLevel === 1 ? "🚶" : "🤫",
      quickStats: [
        { label: "Crowd level", value: crowdLabels[crowdLevel] },
        { label: "Best time", value: crowdLevel === 2 ? "Early AM" : crowdLevel === 1 ? "Mid-day" : "Anytime" },
      ],
      whyText: "Crowd = how busy the place is. Queue = how long you'll wait to enter.",
      tip: TIPS.crowd[crowdLevel],
    },
  };
}

function parseLegMinutes(s) {
  if (!s) return 0;
  const hrMatch = s.match(/(\d+)\s*hr/);
  const mnMatch = s.match(/(\d+)\s*min/);
  return (hrMatch ? parseInt(hrMatch[1]) * 60 : 0) + (mnMatch ? parseInt(mnMatch[1]) : 0);
}

// Get scoring for every day in a trip — used by the comparative variant.
export function getAllDaysScoring(days) {
  return days.map((d, i) => getDayScoring(d, i, days));
}

// Tour-grouped activities for the day-detail timeline.
// Returns [{ heading, intro?, items: [{name, img, desc}] }, ...]
export function getDayTours(day, dayIdx, allDays) {
  const acts = day?.activities || [];
  const isFirst = dayIdx === 0;
  const isLast = dayIdx === allDays.length - 1;
  const prevCity = dayIdx > 0 ? allDays[dayIdx - 1].city : null;
  const cityChanged = prevCity && prevCity !== day.city;

  const intro = isFirst
    ? { label: "Airport transfer", desc: `Transfer from ${day.city} Airport to your hotel.` }
    : cityChanged
      ? { label: "Inter-city transfer", desc: `Scenic transfer from ${prevCity} to ${day.city}.` }
      : isLast
        ? { label: "Departure transfer", desc: `Hotel checkout and transfer to ${day.city} Airport.` }
        : null;

  // Group: roughly half/half. If acts <= 2, single tour.
  const half = Math.ceil(acts.length / 2);
  const morning = acts.slice(0, half);
  const afternoon = acts.slice(half);

  const toItem = (a) => ({
    name: a.name,
    img: a.img,
    desc: `Curated experience in ${day.city}. Includes guide and private transfer.`,
  });

  const tours = [];
  if (acts.length <= 2) {
    tours.push({ heading: "Tour 1: Day plan", intro, items: acts.map(toItem) });
  } else {
    tours.push({ heading: "Tour 1: Morning", intro, items: morning.map(toItem) });
    if (afternoon.length) tours.push({ heading: "Tour 2: Afternoon", intro: null, items: afternoon.map(toItem) });
  }
  return tours;
}
