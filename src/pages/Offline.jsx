import { C } from "../data";

export default function Offline() {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 32px",
        background: C.bg,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 4px 16px rgba(16,24,40,0.06)",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 1l22 22"
            stroke={C.inact}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"
            stroke={C.sub}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.head,
          margin: "0 0 10px",
          lineHeight: "28px",
        }}
      >
        You are offline
      </h1>

      <p
        style={{
          fontSize: 15,
          color: C.sub,
          margin: 0,
          lineHeight: "22px",
          maxWidth: 280,
        }}
      >
        Turn on mobile data or connect to Wi-Fi to keep planning your trip.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 32,
          padding: "13px 28px",
          borderRadius: 999,
          border: "none",
          background: C.p600,
          color: C.white,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
