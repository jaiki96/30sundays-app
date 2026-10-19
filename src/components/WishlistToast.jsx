import { useLocation, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { C } from "../data";
import { useWishlist } from "../data/wishlist";

// High enough to clear the tab bar and the sticky buttons most screens end in,
// so the line is never painted under the thing you were about to press.
const BOTTOM = 96;

// ─── "Saved to your wishlist", once for the whole app ───
//
// Every heart used to be on its own about what happened after you pressed it.
// My Plans put up a line with a link, the itinerary said nothing, the discover
// cards filled the heart and left it there. One line now, raised by the store
// whenever a heart turns on, with the one link that matters: the wishlist,
// opened on the destination you just saved into.
//
// It stays out of the way on the wishlist itself, where the link would point
// at the screen you are on.

export default function WishlistToast() {
  const { toast, dismissToast } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!toast || pathname.startsWith("/saved")) return null;

  const open = () => {
    dismissToast();
    navigate(`/saved?dest=${encodeURIComponent(toast.dest)}`);
  };

  return (
    <div
      key={toast.at}
      role="status"
      style={{
        position: "absolute", left: 16, right: 16, bottom: BOTTOM, zIndex: 1200,
        background: C.head, color: "#fff", borderRadius: 12, padding: "11px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.22)", animation: "toastSlideUp 0.25s ease-out",
      }}
    >
      <Heart size={15} color={C.p300} fill={C.p300} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 13, lineHeight: "18px", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {toast.name} saved to your wishlist.
      </span>
      <button
        onClick={open}
        style={{ flexShrink: 0, background: "none", border: "none", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
      >
        View wishlist
      </button>
    </div>
  );
}
