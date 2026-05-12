import { useNavigate } from "react-router-dom";
import { C } from "../../data";

// Minimal sticky-feeling top bar. Sits above hero. Logo left, "Plan My Trip" pill right.
export default function TopBar() {
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px 10px",
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
    }}>
      {/* Logomark */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.92)", padding: "6px 12px 6px 10px",
        borderRadius: 999, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
      }}>
        <span style={{ fontSize: 16 }}>🌴</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.head, letterSpacing: "-0.2px" }}>30 sundays</span>
      </div>

      {/* Plan My Trip pill */}
      <button
        onClick={() => navigate("/plan")}
        style={{
          background: C.p600, color: "#fff",
          border: "none", padding: "8px 14px", borderRadius: 999,
          fontSize: 13, fontWeight: 700, letterSpacing: "-0.1px",
          cursor: "pointer", boxShadow: "0 4px 12px rgba(227,27,83,0.35)",
        }}
      >
        Plan My Trip
      </button>
    </div>
  );
}
