import { C } from "../data";

const states = [
  { key: "new", label: "New User" },
  { key: "lead", label: "Lead" },
  { key: "customer", label: "Customer" },
  { key: "done", label: "Trip Done" },
];

export default function UserToggle({ userState, setUserState }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", background: C.bg, borderBottom: `1px solid ${C.div}` }}>
      <span style={{ fontSize: 9, color: C.inact, fontWeight: 600, letterSpacing: 0.5 }}>DEMO</span>
      {states.map(s => (
        <button
          key={s.key}
          onClick={() => setUserState(s.key)}
          style={{
            fontSize: 9, fontWeight: 600, border: "none", borderRadius: 20, padding: "3px 10px", cursor: "pointer",
            background: userState === s.key ? C.p600 : "#E9EAEB",
            color: userState === s.key ? "#fff" : C.sub,
          }}
        >{s.label}</button>
      ))}
    </div>
  );
}
