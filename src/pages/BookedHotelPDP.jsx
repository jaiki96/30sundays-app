import { useParams, useNavigate } from "react-router-dom";
import { CalendarCheck, Download } from "lucide-react";
import { C } from "../data";
import { getTripById } from "../data/tripData";
import { generateHotelsForCity } from "../data/hotelData";
import { getMauritiusInclusionsByName } from "../data/mauritiusData";
import InclusionsSection from "../components/InclusionsSection";
import HotelV3 from "../components/hotel_v3/HotelV3";
import { detailFromHotel } from "../data/hotelDetailAdapter";

// Booked hotel = the SAME central hotel screen used in the booking flow and the
// wishlist, in read-only mode: no prices, no room picker, just the single room
// the customer booked, plus a booking-confirmation card in place of the stay
// summary.
function buildBookedHotel(tripHotel, trip) {
  const checkIn = trip.startDate || new Date().toISOString().split("T")[0];
  const checkOut = trip.endDate || checkIn;
  const generated = generateHotelsForCity(tripHotel.city, trip.destination, checkIn, checkOut, 1);
  // Deterministic pick so the same booked hotel keeps the same rich stand-in.
  const hash = [...tripHotel.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const standIn = generated[hash % generated.length] || generated[0];
  if (!standIn) return null;

  // Lock rooms to just the one the customer booked (name from the trip).
  const bookedRoom = { ...standIn.rooms[0], name: tripHotel.roomType || standIn.rooms[0].name };

  return {
    ...standIn,
    name: tripHotel.name,
    stars: tripHotel.stars ?? standIn.stars,
    bookingScore: tripHotel.bookingRating ?? standIn.bookingScore,
    city: tripHotel.city,
    rooms: [bookedRoom],
    confirmationNo: tripHotel.confirmationNo,
    voucherReady: tripHotel.voucherReady ?? (hash % 3 !== 0),
  };
}

// Booking-confirmation card shown where the booking flow shows its stay summary.
function BookingCard({ hotel, trip }) {
  return (
    <div style={{ margin: "20px 16px 0", borderRadius: 14, border: "1px solid #8FD0AB", background: "#F2FBF6", padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <CalendarCheck size={16} color="#2E9E63" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#2E7D50" }}>Booking confirmed</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.sub }}>Check-in</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{trip.startDateDisplay}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: hotel.confirmationNo ? 6 : 0 }}>
        <span style={{ fontSize: 12, color: C.sub }}>Check-out</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{trip.endDateDisplay}</span>
      </div>
      {hotel.confirmationNo && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: C.sub }}>Confirmation</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.head }}>{hotel.confirmationNo}</span>
        </div>
      )}
      {hotel.voucherReady && (
        <button
          onClick={() => alert(`Hotel voucher\n\n${hotel.name}\n${hotel.rooms[0].name}\nCheck-in: ${trip.startDateDisplay}\nCheck-out: ${trip.endDateDisplay}\n\nDownloading PDF…`)}
          style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 42, borderRadius: 10, border: "1px solid #8FD0AB", background: C.white, color: "#2E7D50", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          <Download size={15} color="#2E7D50" /> Download voucher
        </button>
      )}
    </div>
  );
}

export default function BookedHotelPDP() {
  const { tripId, hotelIdx } = useParams();
  const navigate = useNavigate();

  const trip = getTripById(tripId);
  const tripHotel = trip?.hotels?.[Number(hotelIdx)];

  if (!trip || !tripHotel) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: C.sub }}>Hotel not found</p>
        <button onClick={() => navigate(`/trips/${tripId}`)} style={{ marginTop: 16, color: "#FD014F", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Back to trip
        </button>
      </div>
    );
  }

  const hotel = buildBookedHotel(tripHotel, trip);
  if (!hotel) {
    return <div style={{ padding: 40, textAlign: "center", color: C.sub }}>Hotel not found</div>;
  }

  const detail = detailFromHotel(hotel, { nights: 1 });
  const inclusions = getMauritiusInclusionsByName(hotel.name);
  const addOns = tripHotel.addOns;

  // Read only: nothing here is for sale, so the room prices and the picker come
  // off and the booking card takes the place of the stay summary.
  return (
    <HotelV3
      hotel={detail}
      onBack={() => navigate(`/trips/${tripId}`)}
      readOnly
      nights={1}
      stay={<BookingCard hotel={hotel} trip={trip} />}
      extras={(
        <>
          <InclusionsSection inclusions={inclusions} />
          {addOns?.length > 0 && (
            <div style={{ margin: "24px 16px 0" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#181E4C", margin: 0 }}>
                {addOns.length} add-ons included
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#535862", lineHeight: "20px" }}>
                {addOns.map((a) => a.title || a).join(", ")}
              </p>
            </div>
          )}
        </>
      )}
    />
  );
}
