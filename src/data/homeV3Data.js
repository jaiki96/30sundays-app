// HomeV3 (destination-first home) data + season logic.
// Self-contained so it can run in parallel with HomeV2 until approved.
// Priority: help the couple CHOOSE a destination, season-honestly. We deliberately
// do NOT list itineraries here — that happens on the destination page.

import { destData } from "../data";
import { compareVideos } from "./homeV2Data";

const CDN = "https://cdn.30sundays.club/app_content";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The six marketed countries. Season months drive the live grouping below.
// `badge` is the high-season phrase; the helper appends "· best now" / "begins".
export const SIX = [
  {
    name: "Bali", flag: "🇮🇩", blurb: "Temples, beaches, rice fields",
    img: destData.Bali.card, startPrice: destData.Bali.startPrice, beach: true,
    peak: ["Jun", "Jul", "Aug", "Sep"], shoulder: ["Apr", "May", "Oct"], badge: "Peak & dry",
  },
  {
    name: "Mauritius", flag: "🇲🇺", blurb: "Lagoons, hikes, sega nights",
    img: `${CDN}/hotels/maldives/hero-images/267_hero.webp`, startPrice: "94,998", beach: true,
    peak: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], shoulder: ["Apr", "Dec"], badge: "Cool & dry · winter",
  },
  {
    name: "Maldives", flag: "🇲🇻", blurb: "Overwater calm, clear seas",
    img: destData.Maldives.card, startPrice: destData.Maldives.startPrice, beach: true,
    peak: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"], shoulder: ["May", "Oct"], badge: "Dry season",
  },
  {
    name: "Thailand", flag: "🇹🇭", blurb: "Islands, temples, street food",
    img: destData.Thailand.card, startPrice: destData.Thailand.startPrice, beach: true,
    peak: ["Nov", "Dec", "Jan", "Feb"], shoulder: ["Mar", "Oct"], badge: "Cool & dry",
  },
  {
    name: "Vietnam", flag: "🇻🇳", blurb: "Bays, lanterns, bustling streets",
    img: destData.Vietnam.card, startPrice: destData.Vietnam.startPrice, beach: false,
    peak: ["Nov", "Dec", "Feb", "Mar", "Apr"], shoulder: ["Jan", "May", "Oct"], badge: "Dry & clear",
  },
  {
    name: "New Zealand", flag: "🇳🇿", blurb: "Peaks, fiords, road trips",
    img: destData["New Zealand"].card, startPrice: destData["New Zealand"].startPrice, beach: false,
    peak: ["Dec", "Jan", "Feb"], shoulder: ["Mar", "Apr", "Oct", "Nov"], badge: "Warm summer",
  },
];

// "From ₹49k pp" / "From ₹1.6L pp" from the raw startPrice string.
export function fromPrice(startPrice) {
  const n = Number(String(startPrice).replace(/[^0-9]/g, ""));
  if (!n) return "";
  return n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Math.round(n / 1000)}k`;
}

// Live season groups derived from the current month. Each destination shows up
// in the FIRST upcoming 3-month window where it hits peak season, so groups are
// honest, non-repeating, and shift as the year turns.
export function getSeasonGroups(now = new Date()) {
  const cur = now.getMonth();
  const curMonth = MONTHS[cur];
  const windows = [
    { start: cur + 1, len: 3, sub: "Best of your six for these months. Seasons, told honestly." },
    { start: cur + 4, len: 3, sub: "Shoulder sweet-spots. Seasons just opening up." },
  ];
  const claimed = new Set();
  return windows.map(w => {
    const idxs = Array.from({ length: w.len }, (_, i) => (w.start + i) % 12);
    const monthsInWin = idxs.map(i => MONTHS[i]);
    const label = `${MONTHS[idxs[0]]} to ${MONTHS[idxs[idxs.length - 1]]}`;
    const dests = SIX
      .filter(d => !claimed.has(d.name) && d.peak.some(m => monthsInWin.includes(m)))
      .map(d => {
        claimed.add(d.name);
        const peakNow = d.peak.includes(curMonth);
        let badge = d.badge;
        if (peakNow) badge = d.badge.includes("·") ? d.badge : `${d.badge} · best now`;
        else badge = `${d.badge} begins`;
        return { ...d, badge, peakNow };
      });
    return { label, sub: w.sub, dests };
  }).filter(g => g.dests.length > 0);
}

// Honest head-to-head portrait videos for "Torn between two?".
export const COMPARE_REELS = [
  compareVideos.carouselA[0],     // Bali vs Vietnam
  compareVideos.maldivesVsMauritius,
  compareVideos.baliVsThailand,
  compareVideos.carouselA[1],     // Vietnam vs Thailand
  compareVideos.carouselA[2],     // Vietnam vs Maldives
];
