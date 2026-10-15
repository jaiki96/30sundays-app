import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOTEL, variantOf } from "../data/hotelDetailData";
import HotelRefined, { ReplaceBar } from "../components/hotel_refined/HotelRefined";

// ─── The same hotel page, rebuilt on the app's design language ───
//
// Identical order, headings and words to /hotel-lab. This route exists so the
// two can be put side by side and judged on the design alone.

export default function HotelDetailLabRefined() {
  const navigate = useNavigate();
  const [alt, setAlt] = useState(null);
  const hotel = useMemo(() => variantOf(HOTEL, alt), [alt]);
  const [room, setRoom] = useState(() => HOTEL.rooms.find((r) => r.inItinerary));

  return (
    <HotelRefined
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
