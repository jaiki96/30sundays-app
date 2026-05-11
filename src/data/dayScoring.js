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
