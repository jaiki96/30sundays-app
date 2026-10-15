// ─── A drawn face, for anyone with no photo on file ───
//
// Initials were the fallback. Two letters in a grey circle is what a system
// shows when it has given up, and it turned up in the one place on the screen
// whose whole job is to make a stranger feel like a person you can ring.
//
// Drawn in the same flat style and the same brand colours as the consultant
// photo we do have: a Sunset Fuchsia ground, a Lagoon Bliss jacket, a white
// collar. It carries no name and no gender, so it can stand in for anyone on
// the roster without implying anything about them.
export default function AvatarArt({ size = 52, tone = "fuchsia" }) {
  const ground = tone === "lagoon" ? "#33B9AD" : "#FD3472";
  const jacket = tone === "lagoon" ? "#1F3938" : "#00A898";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Consultant"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="100" height="100" fill={ground} />

      {/* shoulders */}
      <path d="M10 100 C12 80 29 71 50 71 C71 71 88 80 90 100 Z" fill={jacket} />
      {/* collar */}
      <path d="M41 72 L50 88 L59 72 L54 68 L46 68 Z" fill="#FFFFFF" />
      {/* neck */}
      <path d="M43 58 h14 v12 c0 4.5 -14 4.5 -14 0 Z" fill="#D9996F" />

      {/* head */}
      <ellipse cx="50" cy="43" rx="17.5" ry="20.5" fill="#EEBC97" />
      <circle cx="32.5" cy="45" r="3.3" fill="#E3AC88" />
      <circle cx="67.5" cy="45" r="3.3" fill="#E3AC88" />

      {/* hair */}
      <path
        d="M31 44 C30 27 39 19 50 19 C61 19 70 27 69 44 C67.5 37 63.5 32 58 31 C52.5 35 45 35 39.5 32 C35 34 32 38.5 31 44 Z"
        fill="#3A2A22"
      />

      {/* eyes and brows */}
      <ellipse cx="43" cy="44.5" rx="2.5" ry="2.9" fill="#1C3232" />
      <ellipse cx="57" cy="44.5" rx="2.5" ry="2.9" fill="#1C3232" />
      <path d="M39 38.5 q4 -2.6 8 0" stroke="#3A2A22" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M53 38.5 q4 -2.6 8 0" stroke="#3A2A22" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* nose and a small smile */}
      <path d="M50 47 v4 q0 1.6 1.7 1.7" stroke="#CE8A66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M44.5 56 q5.5 4.4 11 0" stroke="#B4654A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
