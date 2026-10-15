import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { C } from "../data";
import { CARD_VERSIONS } from "../components/booked_lab/cards";
import { BOOKED_TRIPS } from "../data/bookedTrips";

// ─── Real travellers, real itineraries: four name treatments ───
//
// All four over the same eighteen trips, each with the real filters above it,
// so a version can be judged the way it will actually be used: filtered down
// to one destination, scrolled, and tapped through to the trip.

export default function BookedTripsLab() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.white }} className="hide-scrollbar">
      <div style={{
        position: "sticky", top: 0, zIndex: 10, background: C.white,
        borderBottom: `1px solid ${C.div}`, padding: "12px 16px 11px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={() => navigate(-1)} aria-label="Back" style={{ border: "none", background: "none", padding: 0, cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={19} color={C.head} />
        </button>
        <p style={{ margin: 0, flex: 1, fontSize: 15.5, fontWeight: 700, color: C.head }}>Traveller name, four ways</p>
      </div>

      {CARD_VERSIONS.map(({ key, title, note, Card }) => (
        <div key={key} style={{ borderBottom: `6px solid ${C.bg}`, paddingBottom: 24 }}>
          <div style={{ padding: "18px 18px 0" }}>
            <p style={{ margin: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase", color: C.p600 }}>{title}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: "17px", color: C.sub }}>{note}</p>
          </div>
          <div className="hs" style={{ gap: 13, paddingLeft: 18, paddingRight: 18, alignItems: "stretch", marginTop: 14 }}>
            {BOOKED_TRIPS.slice(0, 6).map((t) => <Card key={t.key} t={t} />)}
          </div>
        </div>
      ))}

      <div style={{ height: 60 }} />
    </div>
  );
}
