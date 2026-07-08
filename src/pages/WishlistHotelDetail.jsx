import { useParams, useNavigate } from "react-router-dom";
import { C } from "../data";
import { getWishlistHotel } from "../data/wishlistData";
import HotelDetailScreen from "../components/HotelDetailScreen";

// Read-only hotel view for the wishlist: same screen as the booking flow, minus
// dates, availability, prices and the replace bar.
export default function WishlistHotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = getWishlistHotel(id);

  if (!hotel) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: C.bg }}>
        <p style={{ fontSize: 14, color: C.sub, margin: 0 }}>Hotel not found.</p>
        <button onClick={() => navigate(-1)} style={{ border: "none", background: C.p600, color: "#fff", borderRadius: 12, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back</button>
      </div>
    );
  }

  return (
    <HotelDetailScreen
      hotel={hotel}
      cityName={hotel.neighbourhood}
      reviews={hotel.reviews}
      onBack={() => navigate(-1)}
    />
  );
}
