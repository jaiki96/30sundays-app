import { useLocation } from "react-router-dom";
import { useAiStore, aiStore } from "./aiStore";
import AiAskBar from "./AiAskBar";
import AiAssistant from "./AiAssistant";

// Mounted once inside PhoneFrame, so the assistant stays alive across routes.
// Home shows the full ask bar; the itinerary screens show a compact pill that
// brings the same conversation back.
export default function AiDock() {
  const s = useAiStore();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const onTrip = pathname.startsWith("/itinerary");
  return (
    <>
      {!s.open && onHome && <AiAskBar onOpen={(m) => aiStore.open(m)} />}
      {!s.open && onTrip && s.started && <AiAskBar compact onOpen={() => aiStore.open("resume")} />}
      {s.started && <AiAssistant hidden={!s.open} mode={s.mode} userState={s.userState} trip={s.trip} onClose={() => aiStore.close()} />}
    </>
  );
}
