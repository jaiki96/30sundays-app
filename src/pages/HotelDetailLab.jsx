import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOTEL, variantOf } from "../data/hotelDetailData";
import HotelDetailV2, { ReplaceBar } from "../components/hotel_detail/HotelDetailV2";

// ─── The new hotel page, on its own route ───
//
// The old screen is shared by the change-hotel flow, the booked trip and the
// wishlist, so it is not something to swap out mid-review. This route runs the
// new one on its own with a fully populated hotel, which is the only honest way
// to judge whether the depth reads as useful or as clutter.

export default function HotelDetailLab() {
  const navigate = useNavigate();
  // Which hotel is on screen. Tapping a similar one opens that hotel here
  // rather than leaving the page, which is what the real route would do.
  const [alt, setAlt] = useState(null);
  const hotel = useMemo(() => variantOf(HOTEL, alt), [alt]);

  // The room the itinerary currently holds, until someone picks another one.
  const [room, setRoom] = useState(() => HOTEL.rooms.find((r) => r.inItinerary));

  return (
    <HotelDetailV2
      key={hotel.id}
      hotel={hotel}
      onBack={() => (alt ? setAlt(null) : navigate(-1))}
      onPickRoom={setRoom}
      selectedRoomId={room?.id}
      onOpenSimilar={(h) => {
        setAlt(h.id === HOTEL.id ? null : h);
        setRoom(HOTEL.rooms.find((r) => r.inItinerary));
      }}
      bottomBar={<ReplaceBar hotel={hotel} room={room} onReplace={() => {}} />}
    />
  );
}
