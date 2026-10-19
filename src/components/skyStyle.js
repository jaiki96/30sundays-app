import { Sun, CloudSun, CloudDrizzle, CloudRain } from "lucide-react";

// ─── One sky, one colour, one word ───
//
// Seven things get labelled on the dates screen: four skies here and three
// seasons in seasonStyle. All seven are different colours, far enough apart in
// hue that none of them is another one in a different shade. The skies run
// gold, cyan, blue, indigo, which also happens to be the order they get wetter
// in; the seasons take purple, bronze and a grey, well clear of these.
//
// Nothing here is red. A month with rain in it is not a warning, it is a
// month, and a red chip tells a couple not to go somewhere we are selling
// them.
//
// The states themselves come from monthSky in weatherData.
export const SKY_STYLE = {
  sunny:  { Icon: Sun,          color: "#D99A00" },  // gold
  cloudy: { Icon: CloudSun,     color: "#0E8C9E" },  // cyan
  rainy:  { Icon: CloudDrizzle, color: "#2B6FD4" },  // blue
  heavy:  { Icon: CloudRain,    color: "#5B4BD6" },  // indigo
};

// ─── The chip a sky sits in ───
//
// It used to be one amber chip for every month of the year, with only the icon
// saying which sky it was, so a rainy month and a sunny one were the same
// colour at a glance. Each sky now carries its own, pale enough to sit beside
// the season chip without shouting, and every ink clears 4.5:1 on its own
// ground.
export const SKY_CHIP = {
  sunny:  { bg: "#FFF5E0", fg: "#8A6100" },  // gold
  cloudy: { bg: "#DFF1F5", fg: "#0B6474" },  // cyan
  rainy:  { bg: "#E4EBFD", fg: "#1E4FA8" },  // blue
  heavy:  { bg: "#EAE7FA", fg: "#4B35A8" },  // indigo
};

// The word for each sky, so a chip can say what the weather is rather than
// leaving the icon to carry it alone. "Heavy rain" is gone: it is the wettest
// of four, which "Rainy" says perfectly well, and the louder word only ever
// talked a couple out of a month we had just recommended to them.
export const SKY_LABEL = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Light rain",
  heavy: "Rainy",
};
