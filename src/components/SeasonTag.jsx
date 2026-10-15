import { SEASON_LABEL, SEASON_COLOR } from "./seasonStyle";

// One word, one colour, and nothing in front of it.
export default function SeasonTag({ rating, mt = 2 }) {
  return (
    <span style={{
      display: "block", fontSize: 9.5, fontWeight: 700, whiteSpace: "nowrap", marginTop: mt,
      color: SEASON_COLOR[rating],
    }}>{SEASON_LABEL[rating]}</span>
  );
}
