// HomeV2 sample data. Self-contained so we can A/B without touching main data.js.

const CDN = "https://cdn.30sundays.club/app_content";

// Mauritius placeholder images (reuse maldives hero pool until real assets land)
const maImgs = [
  `${CDN}/hotels/maldives/hero-images/47_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/48_hero.webp`,
  `${CDN}/hotels/maldives/hero-images/267_hero.webp`,
];

// Sample Mauritius itineraries (mirrors allItineraries shape)
export const mauritiusItineraries = [
  {
    id: "mu1", dest: "Mauritius", vibe: "Relaxed", name: "North Coast Calm",
    nights: 6, price: "94,998", veg: true, img: maImgs[0],
    route: [{ city: "Grand Baie", n: 3 }, { city: "Trou aux Biches", n: 3 }],
  },
  {
    id: "mu2", dest: "Mauritius", vibe: "Explorer", name: "Peaks & Lagoons",
    nights: 7, price: "1,08,498", veg: false, img: maImgs[1],
    route: [{ city: "Port Louis", n: 2 }, { city: "Chamarel", n: 2 }, { city: "Le Morne", n: 3 }],
  },
  {
    id: "mu3", dest: "Mauritius", vibe: "Offbeat", name: "South Wild Coast",
    nights: 7, price: "98,498", veg: true, img: maImgs[2],
    route: [{ city: "Bel Ombre", n: 3 }, { city: "Mahebourg", n: 2 }, { city: "Île aux Cerfs", n: 2 }],
  },
];

// Six listed countries (used for "Sunday School" + section ordering)
export const HOME_V2_COUNTRIES = [
  { name: "Bali", flag: "🇮🇩", sub: "Temples, rice fields & sunset beaches" },
  { name: "Thailand", flag: "🇹🇭", sub: "Islands, palaces & night markets" },
  { name: "Vietnam", flag: "🇻🇳", sub: "Bays, lanterns & bustling streets" },
  { name: "Maldives", flag: "🇲🇻", sub: "Overwater villas & coral reefs" },
  { name: "Mauritius", flag: "🇲🇺", sub: "Volcanic peaks & turquoise lagoons" },
  { name: "New Zealand", flag: "🇳🇿", sub: "Fiords, peaks & epic road trips" },
];

// Portrait video poster pool (using Bali/Vietnam imagery as placeholders)
const POSTER = {
  seasonal: `${CDN}/bali/handara_gate_63.jpg`,
  baliVsThailand: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
  baliVsVietnam: `${CDN}/vietnam/sapa_valley_501.jpg`,
  vietnamVsThailand: `${CDN}/thailand/pileh_lagoon_439.jpg`,
  vietnamVsMaldives: `${CDN}/hotels/maldives/hero-images/11_hero.webp`,
  maldivesVsMauritius: `${CDN}/hotels/maldives/hero-images/13_hero.webp`,
};

// Seasonal "Sunday School" lesson — June-August picks
export const seasonalLesson = {
  issue: "01",
  title: "Where to go in June–August",
  subtitle: "Skip the monsoon. Two countries are pure gold this season.",
  poster: POSTER.seasonal,
  // Placeholder MP4 (kept blank until real CDN url lands)
  videoUrl: "",
  duration: "2:14",
};

// Comparison videos for Bali ↔ Thailand, etc.
export const compareVideos = {
  baliVsThailand: {
    a: "Bali", b: "Thailand", poster: POSTER.baliVsThailand,
    hook: "Same budget, very different week.",
    videoUrl: "", duration: "1:52",
  },
  carouselA: [
    { a: "Bali", b: "Vietnam", poster: POSTER.baliVsVietnam, hook: "Beaches vs bays — pick your week.", videoUrl: "", duration: "1:44" },
    { a: "Vietnam", b: "Thailand", poster: POSTER.vietnamVsThailand, hook: "Street food capitals, compared.", videoUrl: "", duration: "2:01" },
    { a: "Vietnam", b: "Maldives", poster: POSTER.vietnamVsMaldives, hook: "City buzz vs island silence.", videoUrl: "", duration: "1:38" },
  ],
  maldivesVsMauritius: {
    a: "Maldives", b: "Mauritius", poster: POSTER.maldivesVsMauritius,
    hook: "Two island honeymoons, head-to-head.",
    videoUrl: "", duration: "1:56",
  },
};

// Traveller reels — mix of video + image with name/country/activity
export const travellerReels = [
  { type: "video", name: "Aanya & Rohan", country: "Bali", activity: "Ubud swing", poster: `${CDN}/bali/bali_swing_experience_1.jpg`, mediaUrl: "" },
  { type: "image", name: "Priya & Karan", country: "Thailand", activity: "Phi Phi long-tail", poster: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`, mediaUrl: "" },
  { type: "video", name: "Meera & Arjun", country: "Vietnam", activity: "Ha Long kayaking", poster: `${CDN}/vietnam/kayaking_halong_bay_500.jpg`, mediaUrl: "" },
  { type: "image", name: "Sara & Vivaan", country: "Maldives", activity: "Overwater villa", poster: `${CDN}/hotels/maldives/hero-images/16_hero.webp`, mediaUrl: "" },
  { type: "video", name: "Tara & Dev", country: "New Zealand", activity: "Milford Sound cruise", poster: `${CDN}/new_zealand/te_anau_NZA00060.jpg`, mediaUrl: "" },
  { type: "image", name: "Ishita & Neil", country: "Bali", activity: "Tegallalang terraces", poster: `${CDN}/bali/tegallalang_rice_fields_4.jpg`, mediaUrl: "" },
  { type: "video", name: "Naina & Veer", country: "Mauritius", activity: "Le Morne lagoon", poster: maImgs[2], mediaUrl: "" },
];

// Why we're the perfect match (mockup 2)
export const matchPromises = [
  { icon: "heart",   title: "Made for couples",       body: "Built for two. Never group tours, never solo travellers." },
  { icon: "eye",     title: "The good, the bad, the ugly", body: "Every flaw flagged before you book — even when it costs us the booking." },
  { icon: "shield",  title: "Strict standards",       body: "8+ hotels on Booking. 4+ activities on Tripadvisor. Always." },
  { icon: "rupee",   title: "See every rupee",        body: "The only company that splits hotels, flights and activities. No mystery markup." },
  { icon: "cap",     title: "IIT-IIM team",           body: "Engineers and MBAs who chose travel over consulting." },
];

// We don't ghost after booking (mockup 3)
export const tripPromises = [
  { icon: "chat",   title: "Always on call",          body: "A human is always reachable, 24/7. Average reply: under 10 minutes." },
  { icon: "ticket", title: "Every ticket, in your pocket", body: "Flights, transfers, attractions — all in the app. Offline-ready when WiFi isn't." },
  { icon: "play",   title: "Your guide, in two minutes",   body: "Bite-sized videos at every key spot. So you don't miss the story." },
  { icon: "pin",    title: "Real-time picks",         body: "Restaurant and shop suggestions, updated as you move. Tuned to your location and time." },
];
