import { useEffect } from "react";
import { C } from "../data";
import { BuildingView } from "../pages/Generating";

// ─── Building the itinerary again ───
//
// The same wait screen the wizard shows while a trip is first built, laid
// over the itinerary for every change that sends the trip back through the
// builder: the route, the dates, the party. One extra card says what is being
// built again and why, so nobody wonders why their hotel changed when all
// they did was add a night. Everything comes back new except the destination
// and who is going; where the party itself changed, except the destination.
//
// The host decides how long it shows (the real app waits on the API, about
// a minute, which is what the countdown says) and what happens after.

const WHY = {
  route: "New cities and nights mean new hotels, day plans and prices. Your destination and travellers stay as they are.",
  dates: "New dates mean new hotels, day plans and prices for those days. Your cities, destination and travellers stay as they are.",
  travellers: "A different party means new rooms and prices, and a plan built for it. Your cities, dates and destination stay as they are.",
};

export default function BuildingScreen({ dest, cities = [], reason = "route", summary, duration = 6000, onDone, frame, testid = "building-screen" }) {
  useEffect(() => {
    const done = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shell = frame ? { ...frame, zIndex: 320 } : { position: "absolute", inset: 0, zIndex: 320 };

  return (
    <div data-testid={testid} className="hide-scrollbar" style={{ ...shell, background: C.bg, overflowY: "auto" }}>
      <BuildingView dest={dest} cities={cities} change={{ summary, why: WHY[reason] || WHY.route }} />
    </div>
  );
}
