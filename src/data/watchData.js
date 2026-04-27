// ─── 30 Sundays Watch — video library ───
// Categories: vs · top-picks · trip-ideas · know-this
// Cross-destination videos (e.g. Bali vs Thailand) only appear on Home,
// never on individual destination Watch sections.

const CDN = "https://cdn.30sundays.club/app_content";

// Re-use destination images as portrait posters for the prototype.
const bali = [
  `${CDN}/bali/bali_swing_experience_1.jpg`,
  `${CDN}/bali/tree_house_nusa_penida_3.jpg`,
  `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
  `${CDN}/bali/banyumala_waterfall_56.jpg`,
  `${CDN}/bali/handara_gate_63.jpg`,
  `${CDN}/bali/kelingking_beach_65.jpg`,
];
const vietnam = [
  `${CDN}/vietnam/sapa_valley_501.jpg`,
  `${CDN}/vietnam/kayaking_halong_bay_500.jpg`,
  `${CDN}/vietnam/hoi_an_memories_show_502.jpg`,
];
const thailand = [
  `${CDN}/thailand/pileh_lagoon_439.jpg`,
  `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
];
const maldives = [
  `${CDN}/hotels/maldives/hero-images/11_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/47_hero.webp`,
];

// Per-category accent. Used by the card chip dot + library chip indicator
// so each kind of video has a small recognisable signal.
export const WATCH_CATEGORIES = [
  { id: "all",        label: "All",         desc: "Everything",                  color: "#535862" },
  { id: "vs",         label: "Compare",     desc: "Side-by-side comparisons",    color: "#9333EA" },
  { id: "top-picks",  label: "Top Picks",   desc: "Ranked & curated",            color: "#B8003A" },
  { id: "trip-ideas", label: "Trip Ideas",  desc: "Ready-made trip shapes",      color: "#0369A1" },
  { id: "know-this",  label: "Travel Tips", desc: "Explainers & quick guides",   color: "#15803D" },
];

// Each video:
//   id, title, category, dest (or crossDest[]), tags[], poster, duration
//   crossDest videos are excluded from per-destination Watch sections.
export const watchVideos = [
  // ─── Bali — vs ───
  { id: "v01", title: "Nusa Penida vs Seminyak",      category: "vs",         dest: "Bali", tags: ["nusa-penida","seminyak"],          poster: bali[5], duration: "0:48" },
  { id: "v02", title: "Kuta vs Mount Batur",          category: "vs",         dest: "Bali", tags: ["kuta","mount-batur"],               poster: bali[2], duration: "1:12" },
  { id: "v03", title: "Lempuyang vs Jatiluwih",       category: "vs",         dest: "Bali", tags: ["lempuyang","jatiluwih","temples"],  poster: bali[4], duration: "0:56" },
  { id: "v04", title: "Lempuyang vs Uluwatu",         category: "vs",         dest: "Bali", tags: ["lempuyang","uluwatu","temples"],    poster: bali[4], duration: "1:04" },
  { id: "v05", title: "Lovina vs Water Sports",       category: "vs",         dest: "Bali", tags: ["lovina","water-sports"],            poster: bali[3], duration: "0:42" },
  { id: "v06", title: "Water Sports vs ATV Ride",     category: "vs",         dest: "Bali", tags: ["water-sports","atv"],               poster: bali[1], duration: "0:38" },
  { id: "v07", title: "Mountains vs Beaches",         category: "vs",         dest: "Bali", tags: ["mountains","beaches"],              poster: bali[2], duration: "1:20" },
  { id: "v08", title: "Nightlife vs Daytime",         category: "vs",         dest: "Bali", tags: ["nightlife","seminyak"],             poster: bali[0], duration: "1:01" },
  { id: "v09", title: "Hidden Gems vs Famous Spots",  category: "vs",         dest: "Bali", tags: ["hidden-gems"],                      poster: bali[3], duration: "1:15" },
  { id: "v10", title: "Relaxed Bali vs Adventure",    category: "vs",         dest: "Bali", tags: ["relaxed","adventure"],              poster: bali[1], duration: "0:52" },

  // ─── Bali — top-picks ───
  { id: "v11", title: "Top 5 Beaches in Bali",        category: "top-picks",  dest: "Bali", tags: ["beaches"],                          poster: bali[5], duration: "1:30" },
  { id: "v12", title: "Top 5 Cafés",                  category: "top-picks",  dest: "Bali", tags: ["cafes","food"],                     poster: bali[0], duration: "1:08" },
  { id: "v13", title: "Top 3 Bali Experiences",       category: "top-picks",  dest: "Bali", tags: ["experiences"],                      poster: bali[2], duration: "0:55" },
  { id: "v14", title: "Beach Club Ranking",           category: "top-picks",  dest: "Bali", tags: ["beach-clubs","seminyak"],           poster: bali[0], duration: "1:18" },
  { id: "v15", title: "Best Places to Stay in Bali",  category: "top-picks",  dest: "Bali", tags: ["stay","places-to-stay"],            poster: bali[1], duration: "1:25" },

  // ─── Bali — trip-ideas ───
  { id: "v16", title: "Bali for Relaxed Couples",     category: "trip-ideas", dest: "Bali", tags: ["relaxed","couples"],                poster: bali[3], duration: "1:40" },
  { id: "v17", title: "Bali + Lombok: 10 Days",       category: "trip-ideas", dest: "Bali", tags: ["lombok","combo"],                   poster: bali[1], duration: "1:55" },
  { id: "v18", title: "Bali's Twin: Komodo Island",   category: "trip-ideas", dest: "Bali", tags: ["komodo","twin"],                    poster: bali[2], duration: "1:22" },
  { id: "v19", title: "Lombok: Bali's Lesser-Known Twin", category: "trip-ideas", dest: "Bali", tags: ["lombok","twin"],               poster: bali[3], duration: "1:35" },

  // ─── Bali — know-this ───
  { id: "v20", title: "Things to Do in Ubud",         category: "know-this",  dest: "Bali", tags: ["ubud"],                             poster: bali[2], duration: "1:10" },
  { id: "v21", title: "5 Things to Do in Bali",       category: "know-this",  dest: "Bali", tags: ["things-to-do"],                     poster: bali[0], duration: "1:28" },
  { id: "v22", title: "Mount Ijen Explainer",         category: "know-this",  dest: "Bali", tags: ["mount-ijen"],                       poster: bali[4], duration: "1:05" },
  { id: "v23", title: "Komodo Island Explainer",      category: "know-this",  dest: "Bali", tags: ["komodo"],                           poster: bali[5], duration: "1:12" },
  { id: "v24", title: "What to Skip & Where to Stay", category: "know-this",  dest: "Bali", tags: ["planning","stay"],                  poster: bali[1], duration: "1:42" },

  // ─── Cross-destination (Home only) ───
  { id: "v25", title: "Bali vs Thailand",             category: "vs", crossDest: ["Bali","Thailand"],   tags: ["compare"], poster: thailand[0], duration: "1:35" },
  { id: "v26", title: "Bali vs Maldives",             category: "vs", crossDest: ["Bali","Maldives"],   tags: ["compare"], poster: maldives[0], duration: "1:28" },
  { id: "v27", title: "Bali vs Philippines",          category: "vs", crossDest: ["Bali","Philippines"],tags: ["compare"], poster: bali[5],     duration: "1:18" },

  // ─── A few seeds for other destinations so Home row mixes ───
  { id: "v28", title: "Top 5 Things to Do in Vietnam", category: "top-picks", dest: "Vietnam",  tags: ["things-to-do"], poster: vietnam[0], duration: "1:14" },
  { id: "v29", title: "Phi Phi vs Phuket",             category: "vs",        dest: "Thailand", tags: ["phi-phi","phuket"], poster: thailand[1], duration: "0:58" },
  { id: "v30", title: "Maldives Resort Picking 101",   category: "know-this", dest: "Maldives", tags: ["resort","planning"], poster: maldives[1], duration: "1:48" },
];

// ─── Helpers ───

// Videos for a destination's Watch section (excludes cross-destination videos).
export function videosForDest(dest) {
  return watchVideos.filter(v => v.dest === dest && !v.crossDest);
}

// Videos available globally for the Home row — mixes cross-dest comparisons
// with a few editorial picks per destination. Curated by hand for now.
export function videosForHome() {
  const ids = ["v25", "v11", "v26", "v28", "v17", "v27", "v29", "v18", "v30", "v22"];
  return ids.map(id => watchVideos.find(v => v.id === id)).filter(Boolean);
}

// Tag-matched videos for an itinerary day (used by "Before you go" rail).
export function videosForDay(dest, dayActivities = []) {
  const dayTags = dayActivities
    .map(a => (typeof a === "string" ? a : a.name || ""))
    .join(" ")
    .toLowerCase();
  return videosForDest(dest)
    .map(v => ({ v, score: v.tags.filter(t => dayTags.includes(t.replace(/-/g, " "))).length }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.v);
}

export function findVideo(id) {
  return watchVideos.find(v => v.id === id);
}
