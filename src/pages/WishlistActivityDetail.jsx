import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { C } from "../data";
import { getWishlistActivity } from "../data/wishlistData";
import { buildActivityDetail } from "../data/activityData";
import { ActivityDetailScroll } from "./ActivityDetail";

// Saved activity → the same activity screen used elsewhere (planning context:
// no booked-guide video, no dates).
export default function WishlistActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = getWishlistActivity(id);

  if (!activity) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: C.bg }}>
        <p style={{ fontSize: 14, color: C.sub, margin: 0 }}>Activity not found.</p>
        <button onClick={() => navigate(-1)} style={{ border: "none", background: C.p600, color: "#fff", borderRadius: 12, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back</button>
      </div>
    );
  }

  const detail = buildActivityDetail(
    { name: activity.name, img: activity.img },
    { city: activity.city, country: activity.dest, isBooked: false }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: C.white, position: "relative" }}>
      <div style={{ flex: 1, paddingBottom: 24 }}>
        <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} aria-label="Back" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: `1px solid ${C.div}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <ArrowLeft size={18} color="#181E4C" />
          </button>
        </div>
        <ActivityDetailScroll detail={detail} />
      </div>
    </div>
  );
}
