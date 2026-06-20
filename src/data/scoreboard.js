// Itinerary Scoreboard data. Turns the per-day scores (+ itinerary, flights,
// hotels) into one trip-level summary: an overall /10, six "reads" (each a
// 3-step scale with the active step + a good/ok/weak tone), and a merged
// highlights / heads-up list. The qualitative bits come from destInsights.
import { getAllDaysScoring } from "./dayScoring";
import { airlines } from "./flightData";
import { getDestInsight } from "./destInsights";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const avg = (arr) => (arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0);
// tone from a 0-100 "goodness". Red ("weak") is reserved for genuinely poor;
// middling reads land on amber so the card never shouts on a strong trip.
const toneFor = (g) => (g >= 78 ? "good" : g >= 56 ? "ok" : "weak");

const VEG_TIER = { High: 2, Medium: 1, Low: 0 };
const PHOTO_TIER = { High: 2, Medium: 1, Low: 0 };

// label, the three step labels, which step is active, how good it is (0-100),
// a one-line explainer, and a short meaning for each of the three levels
// (shown in the info modal).
const read = (label, options, activeIndex, goodness, explain, defs) => ({
  label, options, activeIndex, goodness, tone: toneFor(goodness), explain, defs,
});

export function computeScoreboard({ it, days = [], selOut = null, selRet = null, hotelStays = [] }) {
  const insight = getDestInsight(it?.dest);
  const scored = getAllDaysScoring(days);

  // ── Pace: balanced (middle) is best; extremes score lower ──
  const paceLevels = scored.map((s) => s.pace?.paceLevel ?? 1); // 0-3
  const paceAvg = avg(paceLevels);
  const paceIdx = paceAvg < 0.75 ? 0 : paceAvg < 2.25 ? 1 : 2; // Unhurried / Balanced / Packed
  const paceGood = [76, 92, 58][paceIdx];

  // ── Crowds: quiet/mixed are good, busy less so ──
  const crowdAvg = avg(scored.map((s) => s.crowd?.level ?? 1)); // 0-2
  const crowdIdx = crowdAvg < 0.67 ? 0 : crowdAvg < 1.34 ? 1 : 2; // Quiet / Mixed / Busy
  const crowdGood = [86, 76, 58][crowdIdx];

  // ── Variety: more distinct experiences/areas = fresher ──
  const allActs = days.flatMap((d) => d.activities?.map((a) => a.name) || []);
  const distinctActs = new Set(allActs).size;
  const varietyRatio = allActs.length ? distinctActs / allActs.length : 0.5;
  const distinctCities = new Set(days.map((d) => d.city)).size;
  const varietyScore = clamp(varietyRatio * 100 + Math.min(distinctCities, 4) * 4, 0, 100);
  const varietyIdx = varietyScore > 82 ? 2 : varietyScore > 60 ? 1 : 0; // Repetitive / Balanced mix / Fresh daily
  const varietyGood = [56, 78, 92][varietyIdx];

  // ── Planning: less time in transit = smoother ──
  const totalAct = scored.reduce((s, d) => s + (d.activity?.hours || 0), 0);
  const totalTravel = scored.reduce((s, d) => s + (d.travel?.hours || 0), 0);
  const transitShare = totalAct + totalTravel ? totalTravel / (totalAct + totalTravel) : 0.3;
  const planIdx = transitShare < 0.25 ? 2 : transitShare < 0.45 ? 1 : 0; // Tight / Natural / Smooth
  const planGood = [56, 80, 92][planIdx];

  // ── Veg food: from the itinerary's existing rating ──
  const vegIdx = VEG_TIER[it?.vegFood] ?? 1;
  const vegGood = [52, 74, 92][vegIdx];

  // ── Photogenic: written per destination ──
  const photoIdx = PHOTO_TIER[insight.photogenic] ?? 1;
  const photoGood = [56, 76, 92][photoIdx];

  const reads = [
    read("Pace", ["Unhurried", "Balanced", "Packed"], paceIdx, paceGood,
      "How packed your days feel across the trip.",
      ["Light days with lots of downtime.", "A comfortable mix of plans and rest.", "Full days with lots to see."]),
    read("Crowds", ["Quiet", "Mixed", "Busy"], crowdIdx, crowdGood,
      "How busy the places you'll visit tend to be.",
      ["Mostly calm, off-peak spots.", "A blend of busy and quiet places.", "Popular spots that draw crowds."]),
    read("Variety", ["Repetitive", "Mixed", "Fresh"], varietyIdx, varietyGood,
      "How much your days differ from one another.",
      ["Days feel quite similar.", "Some repetition, some variety.", "Each day feels distinct."]),
    read("Planning", ["Tight", "Steady", "Smooth"], planIdx, planGood,
      "How much time is spent travelling vs at places.",
      ["A lot of time on the move.", "A sensible amount of travel.", "Minimal travel, more time at places."]),
    read("Veg food", ["Low", "Medium", "High"], vegIdx, vegGood,
      "How easy good vegetarian food is to find.",
      ["Limited vegetarian options.", "Vegetarian food is available.", "Easy to find great vegetarian food."]),
    read("Photogenic", ["Low", "Medium", "High"], photoIdx, photoGood,
      "How camera-worthy the spots on your trip are.",
      ["Few standout photo spots.", "Some lovely photo spots.", "Loaded with camera-worthy views."]),
  ];

  // ── Overall /10 + a verdict word (capped so the headline never reads
  //    'Exceptional' while a read is flagged as a weak point) ──
  const score = Math.round(
    (avg([paceGood, crowdGood, varietyGood, planGood, vegGood, photoGood]) / 10) * 10
  ) / 10;
  const hasWeak = reads.some((r) => r.tone === "weak");
  let verdictWord =
    score >= 8.3 ? "Exceptional" : score >= 7 ? "Great" : score >= 6 ? "Good" : score >= 5 ? "Fair" : "Basic";
  if (hasWeak && verdictWord === "Exceptional") verdictWord = "Great";

  // ── Highlights & heads-up: trip (written) + live flight/hotel facts ──
  const highlights = insight.highlights.map((text) => ({ area: "Trip", text }));
  const headsUp = insight.headsUp.map((text) => ({ area: "Trip", text }));

  const isFullService = (name) => airlines.find((a) => a.name === name)?.type === "full-service";
  const flights = [selOut, selRet].filter(Boolean);
  if (flights.length) {
    if (flights.every((f) => isFullService(f.airline)))
      highlights.push({ area: "Flights", text: "Full-service carriers, both ways." });
    const maxStops = Math.max(...flights.map((f) => f.stops ?? 0));
    if (maxStops > 0) headsUp.push({ area: "Flights", text: `${maxStops} stop${maxStops > 1 ? "s" : ""} on the way — a longer travel day.` });
  }

  const stays = (hotelStays || []).filter(Boolean);
  if (stays.length) {
    const avgStars = avg(stays.map((s) => s.stars || 0));
    const minScore = Math.min(...stays.map((s) => s.bookingScore || 0));
    if (avgStars >= 4) highlights.push({ area: "Hotel", text: "Hand-picked 4–5★ stays throughout." });
    if (minScore >= 8.3) highlights.push({ area: "Hotel", text: "Every stay is highly rated by guests." });
  }

  return { score, verdictWord, title: insight.title, blurb: insight.blurb, reads, highlights, headsUp };
}
