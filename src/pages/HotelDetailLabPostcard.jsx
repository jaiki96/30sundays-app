import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOTEL, variantOf } from "../data/hotelDetailData";
import HotelV3, { ReplaceBar } from "../components/hotel_v3/HotelV3";

// ─── Version three, honest bit B ───
//
// The same screen as /hotel-lab-3 in every respect but one: the honest bit is
// the postcard rather than the index card. Two routes rather than a toggle, so
// either can be opened cold and read as the finished page.

export default function HotelDetailLabPostcard() {
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
      honestVariant="postcard"
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
