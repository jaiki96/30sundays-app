import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOTEL, variantOf } from "../data/hotelDetailData";
import HotelV3, { ReplaceBar } from "../components/hotel_v3/HotelV3";

// ─── Version three ───
//
// Nothing is chosen when you open a hotel you are considering, so no room is
// selected here either. The footer asks for one, and only once it has one does
// it offer to make the swap.

export default function HotelDetailLabCrisp() {
  const navigate = useNavigate();
  const [alt, setAlt] = useState(null);
  const hotel = useMemo(() => variantOf(HOTEL, alt), [alt]);
  const [room, setRoom] = useState(null);
  const jumpRef = useRef(null);

  const openHotel = useCallback((h) => {
    setAlt(h.id === HOTEL.id ? null : h);
    setRoom(null);
  }, []);

  return (
    <HotelV3
      key={hotel.id}
      hotel={hotel}
      onBack={() => (alt ? setAlt(null) : navigate(-1))}
      onPickRoom={setRoom}
      selectedRoomId={room?.id}
      onOpenSimilar={openHotel}
      jumpRef={jumpRef}
      bottomBar={
        <ReplaceBar
          hotel={hotel}
          room={room}
          onReplace={() => {}}
          onSelectRoom={() => jumpRef.current?.("rooms")}
        />
      }
    />
  );
}
