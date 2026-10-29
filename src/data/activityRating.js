// ─── What travellers made of an activity ───
//
// One hash, one answer, wherever an activity is shown. The wizard's cards, the
// reel behind them and the region pages all asked the same question and each
// had their own copy of this, which meant the same walking tour could be 4.5
// on one screen and 4.8 on the next. It is the same function now, so the same
// id always gives the same figure.
//
// Demo numbers, deliberately in a narrow band: 4.3 to 4.9 with 80 to 479
// ratings behind it, because a prototype that shows a 2.1 invites a question
// about the catalogue rather than the screen.
export function activityRating(id) {
  let h = 0;
  const s = String(id ?? "");
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 10000;
  return { rating: (4.3 + ((h % 7) * 0.1)).toFixed(1), reviews: 80 + (h % 400) };
}
