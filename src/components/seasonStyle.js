import { C } from "../data";
import { RAMP } from "../data/brand";

// ─── How a month is labelled on the dates step ───
//
// This ran two greens and a grey. Two greens at 9.5px are one colour with a
// printing fault, so you could not tell peak from shoulder without reading.
//
// Three colours now, far enough apart to tell at a glance: the brand green for
// the months at their best, blue for the ones in between, warm grey for the
// quiet ones. Grey is the point of the third one. An off-season month is not a
// warning, it is just less busy, which is often the better trip and always the
// cheaper one, so it gets a colour that steps back rather than one that argues.
//
// Every value here clears 4.5:1 on white. These labels are 9.5px, so the
// prettier, paler versions of all three would not survive daylight.

export const SEASON_LABEL = { peak: "Peak season", shoulder: "Shoulder season", off: "Off-season" };

// On the white chip.
// Green is the go-ahead, so it belongs on shoulder season: fewer people and a
// cheaper trip is the recommendation, not the busiest month of the year. Peak
// takes the blue, which reads as a statement of fact rather than a nudge, and
// off-season keeps the grey that steps back.
export const SEASON_COLOR = {
  peak: "#175CD3",             // the blue the hotel page already tags with
  shoulder: RAMP.lagoonBliss[900], // #007E72, the board's green
  off: "#767270",              // Coastal Mist taken down until it can be read
};

// ─── The chip the month sits in ───
//
// Left as it was: the app's pink, a 2px border over a pale pink fill. It is
// what every other chosen thing in the wizard looks like, and the three label
// colours above read cleanly on the tint.
export const monthChip = (on) => ({
  border: on ? `2px solid ${C.p600}` : `1px solid ${C.div}`,
  background: on ? C.p100 : C.white,
});
export const monthChipInk = (on) => (on ? C.p600 : C.head);

// Pale grounds for the same three, so a season can sit in a chip beside the
// month without the chip shouting louder than the month's own name.
export const SEASON_TINT = {
  peak: "#EAF2FE",
  shoulder: "#E5F6F5",
  off: "#F2F0EE",
};

// What the season actually means for a couple standing there. "Peak" is a
// trade term; "Busiest" is the thing it decides.
export const SEASON_MEANING = {
  peak: "Busiest",
  shoulder: "Fewer people, cheaper",
  off: "Quietest, cheapest",
};

// The weather chip. Its own colour, not the neutral grey, so the sky and the
// crowds never read as the same kind of fact: amber is the warmth of a
// forecast, and the icon inside says which sky it actually is.
export const WEATHER_CHIP = { bg: "#FFF4E0", fg: "#B54708" };
