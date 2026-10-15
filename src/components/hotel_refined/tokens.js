import { C } from "../../data";

// ─── The hotel page, rebuilt on the app's own design language ───
//
// The first version was correct and flat. Every container was a 1px outline in
// the same grey, every icon was a bare glyph, and five radii and four button
// treatments turned up across one screen. It read as a wireframe that had been
// filled in rather than a screen from this app.
//
// This file is the language the rest of the app already speaks, written down
// so the page can speak it too. Nothing here is invented: the numbers come
// from the transfer cards, the stay cards, the section headers and the stage
// cards that are already shipping.

// ─── Shape ───
// Four radii, not eight. Photos and hero surfaces are the soft ones, content
// cards the middle, and the small wells inside them the tight one.
export const R = {
  well: 10,   // icon tiles, thumbnails, chips inside a card
  card: 14,   // content cards. HotelStayCard and the transfer cards both use 14
  hero: 20,   // photo-led surfaces. The stage cards use 20
  pill: 999,
};

// ─── Depth ───
// The app separates things with light rather than with lines. A card lifts off
// the page; a hairline is for dividing rows inside one card, not for drawing a
// box round everything.
export const SHADOW = {
  card: "0 4px 16px rgba(15,23,42,0.06)",
  raised: "0 10px 30px rgba(16,24,40,0.10)",
  float: "0 6px 22px rgba(16,24,40,0.18)",
};

// ─── Type ───
// One scale. The old page set nine sizes between 10 and 21 with no system, so
// a legal notice and a room name could end up the same weight.
export const T = {
  h1: { fontSize: 22, fontWeight: 700, color: C.head, lineHeight: 1.22, letterSpacing: "-0.4px" },
  h2: { fontSize: 18, fontWeight: 700, color: C.head, lineHeight: 1.25, letterSpacing: "-0.2px" },
  h3: { fontSize: 15, fontWeight: 700, color: C.head, lineHeight: 1.3 },
  lead: { fontSize: 14, fontWeight: 600, color: C.head, lineHeight: 1.35 },
  body: { fontSize: 13.5, fontWeight: 400, color: C.sub, lineHeight: 1.6 },
  meta: { fontSize: 12, fontWeight: 400, color: C.sub, lineHeight: 1.4 },
  micro: { fontSize: 11, fontWeight: 400, color: C.inact, lineHeight: 1.4 },
  money: { fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" },
  // The uppercase label on a photo. Straight off the stage cards.
  eyebrow: {
    fontSize: 10, fontWeight: 800, letterSpacing: "0.9px", textTransform: "uppercase",
  },
};

// ─── Icon wells ───
//
// The single biggest thing the old page was missing. This app never puts a
// bare glyph in a list: an icon sits in a soft tinted square, and the tint says
// what kind of thing it is. The transfer cards have done this since the day
// they shipped (#FFE6ED behind a pink car), and once you copy that one idiom
// the page stops looking like a settings screen.
export const WELL = {
  brand: { bg: "#FFE6ED", fg: "#FD014F" },   // what we give you, and highlights
  lagoon: { bg: "#E5F6F5", fg: "#00857A" },  // facilities, anything included
  gold: { bg: "#FFF4E0", fg: "#B54708" },    // notices you should read
  neutral: { bg: "#F3F4F6", fg: C.sub },     // plain facts
  ocean: { bg: "#EAF2FE", fg: "#1570EF" },   // information, distances, maps
};

// ─── Accents ───
export const A = {
  pink: "#FD014F",
  pinkSoft: "#FFE6ED",
  green: "#027A48",
  greenBg: "#ECFDF3",
  star: "#FBBC05",
  booking: "#003580",
  photoBg: "#F4F2F0",  // warm, not grey. A grey placeholder reads as broken
};

// The gradient the app uses for a highlighted strip, as on the leisure-day
// note. Warm, brand-adjacent, and it does not shout.
export const HIGHLIGHT = {
  background: "linear-gradient(135deg, #FFF0F4 0%, #FEF6E9 100%)",
  border: "1px solid #F8D8E1",
};

// ─── Rhythm ───
// One gutter and one section gap, so the page has a beat instead of alternating
// 22 and 46 depending on whether a divider happened to be in the way.
export const PAD = 16;
export const GAP = 24;
