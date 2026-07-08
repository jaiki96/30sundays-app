// Indicative monthly weather by destination, Jan..Dec.
// temp = typical daytime high (°C), rain = average rainfall (mm).
// Rough climate averages, good enough to guide when to go.
export const weatherData = {
  Bali:          { temp: [30, 30, 31, 31, 31, 30, 29, 29, 30, 31, 31, 30], rain: [345, 274, 235, 83, 76, 64, 50, 26, 44, 64, 150, 271] },
  Maldives:      { temp: [30, 30, 31, 32, 31, 30, 30, 30, 30, 30, 30, 30], rain: [75, 50, 55, 120, 220, 175, 150, 175, 200, 195, 205, 215] },
  Thailand:      { temp: [32, 33, 34, 35, 34, 33, 32, 32, 32, 31, 31, 31], rain: [10, 20, 30, 65, 190, 150, 155, 200, 300, 230, 55, 10] },
  Vietnam:       { temp: [22, 23, 27, 31, 33, 33, 33, 32, 31, 29, 26, 23], rain: [18, 26, 44, 90, 190, 240, 290, 320, 265, 130, 45, 22] },
  Mauritius:     { temp: [30, 30, 30, 29, 27, 25, 24, 24, 25, 27, 28, 29], rain: [215, 220, 180, 110, 95, 75, 65, 55, 45, 40, 70, 145] },
  "New Zealand": { temp: [23, 23, 21, 18, 15, 12, 11, 13, 15, 17, 19, 21], rain: [75, 65, 85, 95, 115, 135, 145, 120, 95, 105, 90, 85] },
  "Sri Lanka":   { temp: [31, 31, 32, 32, 31, 30, 30, 30, 30, 30, 30, 30], rain: [60, 70, 110, 230, 340, 210, 130, 110, 160, 350, 320, 175] },
};

// Simple rain descriptor for a month's rainfall in mm.
export function seasonLabel(rainMm) {
  if (rainMm >= 200) return "wet";
  if (rainMm >= 100) return "some rain";
  return "dry";
}
