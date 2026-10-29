import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../data";
import { useDeals } from "../data/deals";
import { destMeta, recommendedRoute, routeNights, synthesizeItinerary } from "../data/buildData";
import RouteEditor from "../components/route/RouteEditor";

// ─── Changing the route: the lab ───
//
// The editor the itinerary screen will open, on our recommended Vietnam trip.
// Saving does what the real thing does: builds the trip for the new route as
// a trip of its own and opens it on the itinerary screen.
// Live at: /route-edit-lab

const DEST = "Vietnam";

// A start a couple of months out, so the dates are real.
const start = (() => { const d = new Date(); d.setDate(d.getDate() + 60); d.setHours(0, 0, 0, 0); return d; })();

export default function RouteEditLab() {
  const navigate = useNavigate();
  const { createDeal } = useDeals();
  const route = useMemo(() => recommendedRoute(DEST, destMeta[DEST]?.defaultNights || 7), []);

  const save = (next) => {
    const startIso = start.toISOString();
    const it = synthesizeItinerary({
      dest: DEST, nights: routeNights(next), route: next, picksByCity: {}, vibes: [],
      startDate: startIso, party: { travellers: 2 },
    });
    const { dealId, versionId } = createDeal({
      itineraryId: it.id, dest: it.dest, title: it.name, img: it.img, createdBy: "customer",
      customItinerary: it,
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: startIso, nights: it.nights, travelers: 2 }, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`);
  };

  return (
    <div style={{ height: "100%", background: C.white, position: "relative", overflow: "hidden" }}>
      <RouteEditor
        dest={DEST}
        route={route}
        startDate={start.toISOString()}
        onSave={save}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}
