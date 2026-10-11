// ─── AI Trip Assistant — demo data ───
// Everything here is real: the itinerary is deal 500000016765 v6 (Bali, 6 nights,
// 2 adults + 1 child, ₹2,45,000), the villas and tours are live catalog rows.
// Hotel photos are stock villa/pool imagery (the CDN only carries hotel photos for
// Maldives); tours and destinations use the app CDN.

const CDN = "https://cdn.30sundays.club/app_content";
const U = (id, w = 720) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;

export const IMG = {
  // app CDN
  handara: `${CDN}/bali/handara_gate_63.jpg`,
  kelingking: `${CDN}/bali/kelingking_beach_65.jpg`,
  swing: `${CDN}/bali/bali_swing_experience_1.jpg`,
  tegallalang: `${CDN}/bali/tegallalang_rice_fields_4.jpg`,
  treehouse: `${CDN}/bali/tree_house_nusa_penida_3.jpg`,
  waterfall: `${CDN}/bali/banyumala_waterfall_56.jpg`,
  pileh: `${CDN}/thailand/pileh_lagoon_439.jpg`,
  phiphi: `${CDN}/thailand/long_beach_koh_phi_phi_468.jpg`,
  bigbuddha: `${CDN}/thailand/big_buddha_temple_koh_samui_459.jpg`,
  kissing: `${CDN}/vietnam/kissing_bridge_495.jpg`,
  kayak: `${CDN}/vietnam/kayaking_halong_bay_500.jpg`,
  sapa: `${CDN}/vietnam/sapa_valley_501.jpg`,
  hoian: `${CDN}/vietnam/hoi_an_memories_show_502.jpg`,
  xuong: `${CDN}/vietnam/xuong_island_496.jpg`,
  nz: `${CDN}/new_zealand/moke_lake_NZA00054.jpg`,
  maldives: `${CDN}/hotels/maldives/hero-images/267_hero.webp`,
  // stock villas / pools
  villa_ubud: U("1520250497591-112f2f40a3f4"),
  villa_deck: U("1566073771259-6a8506099945"),
  pool_cliff: U("1540541338287-41700207dee6"),
  pool_dusk: U("1551882547-ff40c63fe5fa"),
  pool_sea: U("1584132967334-10e028bd69f7"),
  pool_resort: U("1596436889106-be35e843f974"),
  deck_sea: U("1582719508461-905c673771fd"),
  pool_night: U("1571896349842-33c89424de2d"),
  room_white: U("1512918728675-ed5a9ecdebfd"),
  room_gold: U("1559599238-308793637427"),
  maldives_aerial: U("1573843981267-be1999ff37cd"),
};

export const TRIP = {
  ver: 6, total: 245000, flights: 142678,
  stays: [
    { id: "H1", name: "Umalas Suites", city: "Seminyak", room: "Deluxe Room", nights: "1–3", pn: 6312, cx: "Non-refundable", nr: true, img: "pool_sea" },
    { id: "H2", name: "D'Ethnic Ubud Joglo View Villas", city: "Ubud", room: "Villa with Private Pool", nights: "4–6", pn: 7371, cx: "Free cancellation", nr: false, img: "pool_resort" },
  ],
  days: [
    { d: 1, dt: "06 Nov", t: "Transfer: airport → hotel, private", h: "0.5h", p: 915, type: "Transfer", sep: true },
    { d: 2, dt: "07 Nov", t: "Tanjung Benoa, Melasti, Pandawa & Pantai beaches", h: "9h", p: 2620, type: "Tour", img: "phiphi" },
    { d: 3, dt: "08 Nov", t: "Relaxed West Nusa Penida + snorkelling (Kelingking)", h: "12h", p: 5477, type: "Tour", img: "kelingking" },
    { d: 4, dt: "09 Nov", t: "Ubud Tour: Bali Swing + ATV tandem ride", h: "5h", p: 4392, type: "Tour", img: "swing" },
    { d: 5, dt: "10 Nov", t: "Kintamani + coffee plantation + Ubud market", h: "10h", p: 4026, type: "Tour", img: "tegallalang" },
    { d: 6, dt: "11 Nov", t: "Floating breakfast at D'Ethnic Ubud", h: "1h", p: 893, type: "Add-on", sep: true, img: "room_white" },
    { d: 7, dt: "12 Nov", t: "Transfer: hotel → airport, private", h: "0.5h", p: 915, type: "Transfer", sep: true },
  ],
};

export const UBUD = [
  { name: "Van Sheva Ubud Villa", room: "Villa with Private Pool", pn: 8302, cx: "Free cancellation", rec: true, rt: "4.6", why: "Rice-field views and a bigger pool than you have now — the one most couples pick for Ubud.", imgs: ["villa_ubud", "room_white"] },
  { name: "The Forest Villa Ubud", room: "Villa with Private Pool", pn: 7039, cx: "Free cancellation", rt: "4.5", why: "Quieter, deeper in the jungle, and ₹332 a night less than your current villa.", imgs: ["villa_deck", "room_gold"] },
  { name: "Samkhya Villas", room: "Villa with Private Pool", pn: 9107, cx: "Free cancellation", rt: "4.7", why: "The largest private pool of the three, ten minutes from Ubud centre.", imgs: ["pool_night", "room_white"] },
];
export const SEMI = [
  { name: "Alila Seminyak", room: "Deluxe Suite, pool view", pn: 7840, cx: "Free cancellation", rec: true, rt: "4.7", why: "Beachfront, three pools, a short walk to the Seminyak strip.", imgs: ["deck_sea", "room_gold"] },
  { name: "The Haven Suites Berawa", room: "Suite with Private Pool", pn: 6990, cx: "Free cancellation", rt: "4.5", why: "Quieter end of the beach, a private pool at close to your current rate.", imgs: ["pool_dusk", "room_white"] },
  { name: "Anantara Uluwatu", room: "Ocean View Suite", pn: 9600, cx: "Free cancellation", rt: "4.8", why: "Cliff-top and dramatic — a splurge, 40 minutes from Seminyak.", imgs: ["pool_cliff", "room_gold"] },
];
export const BEACH = [
  { name: "Half-Day Tanjung Benoa & Melasti Beach", h: "6h", p: 2359, img: "phiphi", rec: true, why: "Private transfer, two beaches, back by 3pm — easy with a 10-year-old." },
  { name: "Padang Padang Beach Escape", h: "5h", p: 2127, img: "treehouse", why: "A quiet cove under the cliffs, with viewpoints on the way." },
  { name: "Uluwatu: Suluban + Melasti Beach", h: "5h", p: 2577, img: "waterfall", why: "Two beaches and the sunset at Uluwatu temple." },
];
export const SWING = [
  { name: "Bali Swing + Tegallalang + Tirta Empul", h: "6h", p: 3290, img: "swing", rec: true, why: "The swing, the rice terraces and the water temple — no ATV." },
  { name: "Bali Swing + Monkey Forest + Art Market", h: "5h", p: 2980, img: "handara", why: "A lighter day, back at the villa by 3pm." },
];
export const DEST = {
  Bali: { img: "swing", cover: "kelingking", line: "Beaches, rice terraces and temples — the easiest first trip.", from: "48,998" },
  Thailand: { img: "pileh", cover: "bigbuddha", line: "Islands, lagoons and nightlife — best December to March.", from: "55,998" },
  Vietnam: { img: "kayak", cover: "sapa", line: "Ha Long Bay, Hoi An and the best food of the three.", from: "65,098" },
};
export const ROUTES = {
  Bali: [
    { t: "Seminyak 3N · Ubud 3N", s: "Beach first, then the hills", img: "swing", rec: true },
    { t: "Ubud 3N · Seminyak 3N", s: "Calm first, buzz at the end", img: "tegallalang" },
    { t: "Seminyak 2N · Ubud 2N · Nusa Penida 2N", s: "Three stops, island finish", img: "kelingking" },
  ],
  Thailand: [
    { t: "Phuket 3N · Krabi 3N", s: "Beaches and limestone bays", img: "pileh", rec: true },
    { t: "Bangkok 2N · Phuket 4N", s: "City start, beach finish", img: "bigbuddha" },
    { t: "Krabi 3N · Koh Phi Phi 3N", s: "Island-hopping", img: "phiphi" },
  ],
  Vietnam: [
    { t: "Hanoi 2N · Ha Long 1N · Da Nang 3N", s: "North to centre", img: "kayak", rec: true },
    { t: "Da Nang 3N · Hoi An 3N", s: "Beach and old town", img: "hoian" },
    { t: "Ho Chi Minh 2N · Phu Quoc 4N", s: "City then island", img: "xuong" },
  ],
};
// Scripted customer lines — English. (The originals are Hinglish transcript quotes.)
export const SAY = {
  hotel: "I'd like to change a hotel.",
  villa: "I want a private villa with its own pool.",
  day3: "Day 3 feels too long — can you make it lighter?",
  atv: "Remove the ATV on day 4, but keep the swing.",
  freeform: "Bali, mid Nov, 6 nights, honeymoon, beaches",
};
export const SAMPLE_LINES = [
  "Just exploring Bali for now",
  "Bali, mid Nov, 6 nights, honeymoon, beaches",
  "I'd like to change a hotel",
  "Day 3 feels too long — make it lighter",
  "Remove the ATV on day 4, keep the swing",
  "Can you plan Dubai?",
  "Change my flight to the morning",
];
export const SLOTS = [["dest", "Where"], ["who", "Who"], ["when", "When"], ["route", "Route"], ["vibe", "Vibe"]];
export const rupee = (n) => "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");
export const delta = (n) => (n === 0 ? "±₹0" : (n > 0 ? "+" : "−") + rupee(n));
export const dcls = (n) => (n > 0 ? "up" : n < 0 ? "dn" : "z");
