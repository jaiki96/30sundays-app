import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { C } from "../../data";
import MediaHeader from "./MediaHeader";
import GalleryScreen from "./GalleryScreen";
import Ratings from "./Ratings";
import {
  About, Facilities, StayBasics, Rooms, FoodAndDrink, Location,
  WhyIndians, Policies, LegalInfo, Questions, SimilarHotels,
} from "./sections";
import { Stars, Rule, LinkText, HEAD, PAGE_PAD } from "./kit";

// ─── The hotel page ───
//
// Built to answer the question people were leaving the app to answer on
// booking.com. The order follows how the decision is actually made. First what
// the place is and what it has. Then where it sits, because the area decides
// whether the hotel is worth considering at all. Then what people who stayed
// say about it, and then why an Indian couple in particular says yes. Only
// after all of that does it ask you to pick a room, which is the first
// decision on the page that costs money. The practical things, check-in times
// and food and policies, come after the decision rather than in front of it.
//
// Everything that goes deeper opens a sheet. On a page this long, losing your
// scroll position is the expensive mistake.

// One score at the top, not three. Three numbers on three different scales is
// a comparison exercise, and nobody wants one before they have even read what
// the hotel is. The other two are a scroll away in the ratings block.
function HeadlineScore({ hotel, onOpen }) {
  const r = hotel.ratings.booking;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "13px 0 0" }}>
      <span style={{
        display: "grid", placeItems: "center", flexShrink: 0,
        width: 46, height: 46, borderRadius: 12, background: "#003580",
        color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px",
      }}>{r.score.toFixed(1)}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: HEAD }}>
          Loved by couples
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.sub }}>
          Rating on Booking.com ·{" "}
          <LinkText onClick={onOpen}>{r.count.toLocaleString("en-IN")} ratings</LinkText>
        </p>
      </div>
    </div>
  );
}

export default function HotelDetailV2({
  hotel,
  onBack,
  bottomBar = null,
  onPickRoom,
  onOpenSimilar,
  selectedRoomId,
}) {
  const [gallery, setGallery] = useState(null);
  const scroller = useRef(null);
  const ratingsRef = useRef(null);

  const toRatings = () => {
    const el = ratingsRef.current;
    const box = scroller.current;
    if (!el || !box) return;
    box.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", height: "100%", background: C.white, overflow: "hidden" }}>
      <div
        ref={scroller}
        className="hide-scrollbar"
        style={{ height: "100%", overflowY: "auto", paddingBottom: bottomBar ? 96 : 28 }}
      >
        <MediaHeader
          hotel={hotel}
          onBack={onBack}
          onGallery={(cat) => setGallery(cat)}
          onShare={() => {}}
        />

        <div style={{ padding: `16px ${PAGE_PAD}px 0` }}>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: HEAD, lineHeight: 1.22, letterSpacing: "-0.4px" }}>
            {hotel.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "7px 0 0", flexWrap: "wrap" }}>
            <Stars n={hotel.stars} size={13} />
            <span style={{ fontSize: 12.5, color: C.sub }}>
              {hotel.stars} star {hotel.type.toLowerCase()} · {hotel.neighbourhood}
            </span>
          </div>
          <HeadlineScore hotel={hotel} onOpen={toRatings} />
        </div>
        <Rule />

        <About hotel={hotel} />
        <Rule />

        <Facilities hotel={hotel} />
        <Rule />

        <Location hotel={hotel} />
        <Rule />

        <div ref={ratingsRef}>
          <Ratings hotel={hotel} />
        </div>
        <Rule />

        <WhyIndians hotel={hotel} />
        <Rule />

        <Rooms hotel={hotel} onPick={onPickRoom} selectedId={selectedRoomId} />
        <Rule />

        <StayBasics hotel={hotel} />
        <Rule />

        <FoodAndDrink hotel={hotel} />
        <Rule />

        <Policies hotel={hotel} />
        <Rule />

        <LegalInfo hotel={hotel} />
        <Rule />

        <Questions hotel={hotel} />
        <Rule />

        <SimilarHotels hotel={hotel} onOpen={onOpenSimilar} />
        <div style={{ height: 26 }} />
      </div>

      {bottomBar}

      {gallery && (
        <GalleryScreen hotel={hotel} startCategory={gallery} onClose={() => setGallery(null)} />
      )}
    </div>
  );
}

// ─── The footer ───
//
// The same bar the change-hotel flow already uses, because this page is that
// flow's destination and a different footer on the same journey reads as a
// different product. What you are replacing on the left, expandable so you can
// check it without going back, then the new total with the difference, then
// the one action.
export function ReplaceBar({ hotel, room, onReplace }) {
  const [open, setOpen] = useState(false);
  const cur = hotel.currentStay;
  const newTotal = hotel.total + (room?.priceDelta || 0);
  const delta = newTotal - cur.total;
  const inr = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 120,
      padding: "10px 16px 14px",
      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 26%)",
    }}>
      <div style={{
        background: C.white, border: `1px solid ${C.div}`, borderRadius: 16,
        boxShadow: "0 4px 24px rgba(16,24,40,0.12)", overflow: "hidden",
      }}>
        {open && (
          <div style={{ display: "flex", gap: 12, padding: "12px 14px 0" }}>
            <img
              src={cur.image}
              alt=""
              style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: C.bg }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: HEAD }}>{cur.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ display: "inline-flex", gap: 1 }}>
                  {Array.from({ length: cur.stars }).map((_, i) => (
                    <Star key={i} size={11} color="#FDA201" fill="#FDA201" strokeWidth={0} />
                  ))}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>· {cur.score} rated</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{cur.room} · {cur.mealPlan}</p>
            </div>
          </div>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: open ? "10px 14px 12px" : "12px 14px",
        }}>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none",
              padding: 0, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11, color: C.sub }}>Replacing</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: HEAD, minWidth: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{cur.name}</span>
              {open
                ? <ChevronDown size={14} color={C.sub} style={{ flexShrink: 0 }} />
                : <ChevronUp size={14} color={C.sub} style={{ flexShrink: 0 }} />}
            </span>
            <span style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
              <span style={{ fontSize: 12, color: C.inact, textDecoration: "line-through" }}>{inr(cur.total)}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: HEAD }}>{inr(newTotal)}</span>
              {delta !== 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>
                  {delta > 0 ? "+" : "-"}{inr(delta)}
                </span>
              )}
              <span style={{ fontSize: 11, color: C.sub }}>· 3 nights</span>
            </span>
          </button>

          <button
            onClick={onReplace}
            style={{
              flexShrink: 0, height: 44, padding: "0 18px", borderRadius: 12, border: "none",
              background: "#FD014F", color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 14, fontWeight: 700,
            }}
          >
            Replace hotel
          </button>
        </div>
      </div>
    </div>
  );
}
