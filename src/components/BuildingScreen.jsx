import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { C } from "../data";

// ─── Building the itinerary again ───
//
// One screen for every change that sends the trip back through the builder:
// the route, the dates, the party. It says what is being built and why, so
// nobody wonders why their hotel changed when all they did was add a night.
// Everything comes back new except the destination and who is going; where
// the party itself changed, except the destination.
//
// The host decides how long it shows (the real app waits on the API) and what
// happens after; this only draws it.

const WHY = {
  route: "New cities and nights mean new hotels, day plans and prices. Your destination and travellers stay as they are.",
  dates: "New dates mean new hotels, day plans and prices for those days. Your cities, destination and travellers stay as they are.",
  travellers: "A different party means new rooms and prices, and a plan built for it. Your cities, dates and destination stay as they are.",
};

const STEPS = [
  "Mapping the route",
  "Picking the stays",
  "Planning the days",
  "Pricing it up",
];

export default function BuildingScreen({ dest, reason = "route", summary, duration = 2600, onDone, frame, testid = "building-screen" }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const each = Math.max(300, Math.floor(duration / STEPS.length));
    const t = setInterval(() => setStep((s) => Math.min(STEPS.length, s + 1)), each);
    const done = setTimeout(() => { clearInterval(t); onDone?.(); }, duration);
    return () => { clearInterval(t); clearTimeout(done); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shell = frame ? { ...frame, zIndex: 320 } : { position: "absolute", inset: 0, zIndex: 320 };

  return (
    <div data-testid={testid} style={{ ...shell, background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 28px" }}>
      <div style={{ position: "relative", width: 70, height: 70 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${C.p100}`, borderTopColor: C.p600, animation: "spin 0.8s linear infinite" }} />
        <Sparkles size={28} color={C.p600} style={{ position: "absolute", top: 21, left: 21 }} />
      </div>
      <p style={{ margin: "22px 0 0", fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.3px", textAlign: "center" }}>Building your {dest} trip</p>
      {summary && <p style={{ margin: "5px 0 0", fontSize: 13, fontWeight: 700, color: C.p600, textAlign: "center" }}>{summary}</p>}
      <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: "19px", color: C.sub, textAlign: "center", maxWidth: 300 }}>{WHY[reason] || WHY.route}</p>

      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 240 }}>
        {STEPS.map((s, i) => {
          const done = i < step;
          const now = i === step;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done || now ? 1 : 0.45, transition: "opacity .25s" }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center",
                background: done ? "#ECFDF3" : C.white, border: `1.5px solid ${done ? "#6CE9A6" : now ? C.p600 : C.div}`,
              }}>
                {done && <Check size={12} color="#027A48" strokeWidth={3} />}
                {now && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.p600, animation: "pulse 1s ease-in-out infinite" }} />}
              </span>
              <span style={{ fontSize: 13, fontWeight: now ? 700 : 500, color: done || now ? C.head : C.sub }}>{s}{now ? "…" : ""}</span>
            </div>
          );
        })}
      </div>

      <p style={{ position: "absolute", left: 0, right: 0, bottom: "calc(20px + env(safe-area-inset-bottom))", margin: 0, fontSize: 11.5, color: C.inact, textAlign: "center" }}>
        Your previous version stays saved in My Plans.
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.6);opacity:.5}}`}</style>
    </div>
  );
}
