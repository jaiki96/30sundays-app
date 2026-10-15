// ─── The marks that say whose rating you are reading ───
//
// A coloured square with a letter in it was a placeholder, and it read as one.
// A rating is only worth showing next to another rating if you can tell the
// two apart without reading a label, and that is what a real mark does in
// about a tenth of the time a word takes.
//
// Ours is cropped out of the app logo rather than redrawn, so it can never
// drift away from the brand file. The rest are drawn to each platform's own
// colours and shapes, and are used only to attribute a rating to its source.

const LOGO = "/logo.png";

// The palm, the sun and the pink stroke sit in the left quarter of the
// wordmark. These numbers are that crop, expressed as a share of the file, so
// the mark stays correct at any size.
function Sundays({ size }) {
  return (
    <span
      role="img"
      aria-label="30 Sundays"
      style={{
        width: size, height: size, flexShrink: 0, display: "block",
        backgroundImage: `url(${LOGO})`,
        backgroundSize: `${size * 3.571}px auto`,
        backgroundPosition: `${size * -0.067}px ${size * -0.084}px`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

function Google({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Google" style={{ flexShrink: 0, display: "block" }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Booking({ size }) {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Booking.com" style={{ flexShrink: 0, display: "block" }}>
      <rect width="48" height="48" rx={r * (48 / size)} fill="#003580" />
      <path
        fill="#FFFFFF"
        d="M17 12h9.6c4.7 0 7.6 2.3 7.6 6 0 2.3-1.1 3.9-2.9 4.8v.1c2.5.8 4 2.8 4 5.6 0 4.3-3.3 6.9-8.4 6.9H17V12zm8.9 9.6c2 0 3.2-1.1 3.2-2.8s-1.2-2.7-3.2-2.7h-3.8v5.5h3.8zm.5 9.9c2.3 0 3.6-1.2 3.6-3.1 0-1.9-1.4-3-3.7-3h-4.2v6.1h4.3z"
      />
      <circle cx="37.5" cy="33.2" r="3.1" fill="#FFFFFF" />
    </svg>
  );
}

function MakeMyTrip({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="MakeMyTrip" style={{ flexShrink: 0, display: "block" }}>
      <rect width="48" height="48" rx="10" fill="#FFFFFF" stroke="#E9EAEB" strokeWidth="2" />
      {/* Their mark is a pair of leaning figures, red over blue. */}
      <path fill="#EB2226" d="M20.4 10.5c3.4-1.2 6.6.6 7.3 4 .5 2.6-.7 5-3 6.2l-8.6 4.6c-2.3 1.2-3.6 3.3-3.3 5.6l-4.6-1.2c-.8-4.2 1.2-8 5.1-10.1l7.1-3.8c.9-.5 1.3-1.3 1.1-2.2-.2-.9-1-1.4-1.9-1.2l-1.2.3-1.2-4.4 3.2-.8z" />
      <path fill="#0A5EB5" d="M27.6 37.5c-3.4 1.2-6.6-.6-7.3-4-.5-2.6.7-5 3-6.2l8.6-4.6c2.3-1.2 3.6-3.3 3.3-5.6l4.6 1.2c.8 4.2-1.2 8-5.1 10.1l-7.1 3.8c-.9.5-1.3 1.3-1.1 2.2.2.9 1 1.4 1.9 1.2l1.2-.3 1.2 4.4-3.2.8z" />
    </svg>
  );
}

function Tripadvisor({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Tripadvisor" style={{ flexShrink: 0, display: "block" }}>
      <circle cx="24" cy="24" r="24" fill="#34E0A1" />
      {/* The owl: two eyes and a beak between them. */}
      <circle cx="16" cy="25" r="7.4" fill="#FFFFFF" />
      <circle cx="32" cy="25" r="7.4" fill="#FFFFFF" />
      <circle cx="16" cy="25" r="3.1" fill="#000000" />
      <circle cx="32" cy="25" r="3.1" fill="#000000" />
      <path d="M24 13.4c-3.6 0-6.9.9-9.6 2.5h19.2c-2.7-1.6-6-2.5-9.6-2.5z" fill="#000000" />
      <path d="M24 30.4l-2.6 3.9h5.2L24 30.4z" fill="#000000" />
    </svg>
  );
}

const MARKS = {
  sundays: Sundays,
  google: Google,
  booking: Booking,
  mmt: MakeMyTrip,
  tripadvisor: Tripadvisor,
};

export default function SourceLogo({ source, size = 18 }) {
  const Mark = MARKS[source] || MARKS.sundays;
  return <Mark size={size} />;
}
