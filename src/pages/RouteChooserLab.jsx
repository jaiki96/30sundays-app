import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { C } from "../data";
import { useDeals } from "../data/deals";
import { destMeta, recommendedRoute, routeNights, synthesizeItinerary } from "../data/buildData";
import RouteChooser from "../components/route/RouteChooser";

// ─── Choosing a route: the lab ───
//
// The screen the itinerary opens from the route pencil, on a trip of our
// own so it can be reached without building one first. Saving does what the
// real thing does: builds the chosen route as a trip and opens it.
//
// ?dest=Bali and ?nights=9 to try other destinations and lengths.
// Live at: /route-chooser-lab

export default function RouteChooserLab() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { createDeal } = useDeals();
  const dest = params.get("dest") || "Vietnam";
  const nights = Number(params.get("nights")) || destMeta[dest]?.defaultNights || 7;
  const route = useMemo(() => recommendedRoute(dest, nights), [dest, nights]);

  const start = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const save = (next) => {
    const it = synthesizeItinerary({
      dest, nights: routeNights(next), route: next, picksByCity: {}, vibes: [],
      startDate: start, party: { travellers: 2 },
    });
    const { dealId, versionId } = createDeal({
      itineraryId: it.id, dest: it.dest, title: it.name, img: it.img, createdBy: "customer",
      customItinerary: it,
      customizations: { selectedDayOptions: {}, selectedHotels: {}, travelDates: { fromDate: start, nights: it.nights, travelers: 2 }, builtItinerary: it },
      indicativePrice: Number(String(it.price).replace(/,/g, "")) || 0,
    });
    navigate(`/itinerary/${it.id}?dealId=${dealId}&versionId=${versionId}`);
  };

  return (
    <div style={{ height: "100%", background: C.white, position: "relative", overflow: "hidden" }}>
      <RouteChooser
        dest={dest}
        route={route}
        nights={nights}
        onSave={save}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}
