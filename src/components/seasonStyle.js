import { C } from "../data";

// ─── How a month is labelled on the dates step ───
//
// Three unrelated colours, not one colour at three strengths. Peak and
// mid-season are different answers, not degrees of the same one, and two
// shades of a single hue at 9.5px are one colour with a printing fault. So
// peak takes purple, mid-season takes bronze, and they have nothing to do with
// each other or with the four skies they sit beside, which run gold, cyan,
// blue and indigo. Seven labels on that screen, seven colours.
//
// Off-season keeps the grey. It is not a warning, it is just quieter, which is
// often the better trip and always the cheaper one, so it gets the colour that
// steps back rather than one that argues.
//
// No green, and no red. Green reads as a pass mark on a thing that is not a
// test, and red would tell a couple not to go somewhere we are selling them.
//
// Every value here clears 4.5:1 on its own ground. These labels are 9.5px, so
// the prettier, paler versions would not survive daylight.

export const SEASON_LABEL = { peak: "Peak Season", shoulder: "Mid-season", off: "Off Season" };

// On the white chip.
export const SEASON_COLOR = {
  peak: "#8B1FA8",      // purple
  shoulder: "#6B3E0A",  // bronze
  off: "#6B6764",       // steps back
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
  peak: "#F6E6FA",
  shoulder: "#F5EADB",
  off: "#F2F0EE",
};

// What the season actually means for a couple standing there: how many other
// people are going to be there and what it costs. "Peak" on its own is a trade
// term and decides nothing for anybody reading it.
export const SEASON_MEANING = {
  peak: "Highest Demand, Peak Rates",
  shoulder: "Fewer Crowds, Better Rates",
  off: "Quietest Time, Base Rates",
};

// The weather chip, per sky, so the sky and the crowds never read as the same
// kind of fact: the seasons are purples, the skies are their own colours. See
// SKY_CHIP in skyStyle for the grounds and the inks.
