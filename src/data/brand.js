// ─── 30 Sundays brand board ───
//
// Straight from the brand board: five named colours and three typefaces.
// Named the way the shade card names them, so a design conversation and the
// code use the same words.

export const BRAND = {
  // The pink everything leads with. Buttons, links, the active state.
  sunsetFuchsia: "#FD014F",
  // The deep green we set type in. Headings, names, anything that has to read.
  tropicalForest: "#254342",
  // The trust colour. Proof, reassurance, anything verified.
  lagoonBliss: "#00A898",
  // Warmth and attention, without the alarm of red.
  goldenHour: "#FDA201",
  // The warm off-white behind everything. Cards, wells, avatar circles.
  coastalMist: "#EAE6E3",
  // The softer pink the marketing films tag their titles with (the "Bali" label
  // on a reel cover). Lighter than the CTA pink, so it can fill a chip without
  // competing with the button the screen is actually asking you to press.
  sunsetFuchsiaSoft: "#F8719F",
};

// ─── The shade card, copied off the brand board ───
//
// Four tints and four shades either side of each named colour. These are the
// board's own values, not mixes of mine, so anything built on them is on brand
// by construction rather than by eye. 500 is the named colour itself.
export const RAMP = {
  coastalMist: { 50: "#FBFAF9", 100: "#F7F5F4", 200: "#F2F0EE", 300: "#EEEBE9", 500: "#EAE6E3", 600: "#D3CFCC", 700: "#C7C4C1", 800: "#BBB8B6", 900: "#AFACAA" },
  tropicalForest: { 50: "#D3D9D9", 100: "#A8B4B3", 200: "#7C8E8E", 300: "#516968", 500: "#254342", 600: "#213C3B", 700: "#1F3938", 800: "#1E3635", 900: "#1C3232" },
  lagoonBliss: { 50: "#CCEEEA", 100: "#99DCD6", 200: "#66CBC1", 300: "#33B9AD", 500: "#00A898", 600: "#009789", 700: "#008F81", 800: "#00867A", 900: "#007E72" },
  sunsetFuchsia: { 50: "#FFCCDC", 100: "#FE99B9", 200: "#FE6795", 300: "#FD3472", 500: "#FD014F", 600: "#E40147", 700: "#D70143", 800: "#CA013F", 900: "#BE013B" },
  goldenHour: { 50: "#FFECCC", 100: "#FEDA99", 200: "#FEC767", 300: "#FDB534", 500: "#FDA201", 600: "#E49201", 700: "#D78A01", 800: "#CA8201", 900: "#BE7A01" },
};

// Tints of the brand colours, for backgrounds that sit under brand-coloured
// type. Mixed toward white rather than picked by eye, so they stay on-hue.
// Kept as they are because screens already ship on them; new work should take
// its tints from RAMP above, which are the board's own.
export const BRAND_TINT = {
  lagoonBliss: "#E5F6F5",
  sunsetFuchsia: "#FFE8EF",
  goldenHour: "#FFF4E0",
};

// Type. Poppins is primary, Raleway secondary, PF Reminder tertiary. Only
// Poppins is loaded today; the other two are not in use yet.
export const FONT = {
  primary: "'Poppins', 'Figtree', system-ui, sans-serif",
};

// Muted body text that stays in the green family rather than reverting to a
// neutral grey, which reads as a different design system next to it.
export const BRAND_SUB = "#5B7472";
