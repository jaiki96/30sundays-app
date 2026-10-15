import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { C } from "../../data";
import MediaHeader from "./MediaHeader";
import GalleryScreen from "../hotel_detail/GalleryScreen";
import SourceLogo from "../hotel_detail/SourceLogo";
import Ratings from "./Ratings";
import {
  About, Facilities, Location, WhyIndians, Rooms, StayBasics, FoodAndDrink,
  Policies, LegalInfo, Questions, SimilarHotels,
} from "./sections";
import { Stars, Rule, LinkText, Card, PAD } from "./kit";
import { R, SHADOW, T, A } from "./tokens";

// ─── The hotel page, on the app's design language ───
//
// Same order, same headings, same words as the first version. What changed is
// everything underneath: one radius scale instead of five, soft elevation
// instead of hairline boxes, every icon in a tinted well the way the transfer
// cards have always drawn them, and one type scale rather than nine sizes
// picked one at a time.

// The score, given the room it needs. The first version put it in a 46px
// booking.com blue tile, which made a borrowed number the loudest object on a
// 30 Sundays page. The number is still prominent, but it is set in booking's
// blue rather than sitting on it, so the page keeps its own voice while the
// rating keeps its attribution.
function HeadlineScore({ hotel, onOpen }) {
  const r = hotel.ratings.booking;
  return (
    <Card pad={14} style={{ marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: 26, fontWeight: 800, color: A.booking,
            letterSpacing: "-0.8px", lineHeight: 1,
          }}>{r.score.toFixed(1)}</p>
          <p style={{ ...T.micro, margin: "3px 0 0", fontSize: 10.5 }}>out of 10</p>
        </div>

        <div style={{ width: 1, alignSelf: "stretch", background: C.div, flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ ...T.h3, margin: 0, fontSize: 15 }}>Loved by couples</p>
          <p style={{ ...T.meta, margin: "4px 0 0", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <SourceLogo source="booking" size={14} />
            <span>Rating on Booking.com</span>
            <span style={{ color: C.icon }}>·</span>
            <LinkText onClick={onOpen}>{r.count.toLocaleString("en-IN")} ratings</LinkText>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function HotelRefined({
  hotel,
  onBack,
  bottomBar = null,
  onPickRoom,
  onOpenSimilar,
  selectedRoomId,
  StayComponent = StayBasics,
  WhyComponent = WhyIndians,
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
        style={{ height: "100%", overflowY: "auto", paddingBottom: bottomBar ? 100 : 30 }}
      >
        <MediaHeader
          hotel={hotel}
          onBack={onBack}
          onGallery={(cat) => setGallery(cat)}
          onShare={() => {}}
        />

        <div style={{ padding: `18px ${PAD}px 0` }}>
          <h1 style={{ ...T.h1, margin: 0 }}>{hotel.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 0", flexWrap: "wrap" }}>
            <Stars n={hotel.stars} size={13} />
            <span style={{ ...T.meta, fontSize: 12.5 }}>
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

        <WhyComponent hotel={hotel} />
        <Rule />
        <Rooms hotel={hotel} onPick={onPickRoom} selectedId={selectedRoomId} />
        <Rule />
        <StayComponent hotel={hotel} />
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

        <div style={{ height: 28 }} />
      </div>

      {bottomBar}

      {gallery && (
        <GalleryScreen hotel={hotel} startCategory={gallery} onClose={() => setGallery(null)} />
      )}
    </div>
  );
}

// ─── The footer ───
// The change-hotel bar, on the same tokens. The price line is set as money
// rather than as body text, and the difference is a chip, so the number you
// are being asked to approve is the thing you see first.
export function ReplaceBar({ hotel, room, onReplace }) {
  const [open, setOpen] = useState(false);
  const cur = hotel.currentStay;
  const newTotal = hotel.total + (room?.priceDelta || 0);
  const delta = newTotal - cur.total;
  const inr = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 120,
      padding: `10px ${PAD}px 14px`,
      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 26%)",
    }}>
      <div style={{
        background: C.white, border: `1px solid ${C.div}`, borderRadius: R.hero,
        boxShadow: SHADOW.raised, overflow: "hidden",
      }}>
        {open && (
          <div style={{ display: "flex", gap: 12, padding: "13px 14px 0" }}>
            <img
              src={cur.image}
              alt=""
              style={{ width: 62, height: 62, borderRadius: R.well, objectFit: "cover", flexShrink: 0, background: A.photoBg }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...T.lead, margin: "0 0 3px", fontSize: 13.5 }}>{cur.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                <Stars n={cur.stars} size={11} />
                <span style={{ ...T.micro }}>{cur.score} rated</span>
              </div>
              <p style={{ ...T.micro, margin: 0 }}>{cur.room} · {cur.mealPlan}</p>
            </div>
          </div>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: open ? "11px 14px 13px" : "13px 14px",
        }}>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none",
              padding: 0, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ ...T.micro, fontSize: 11 }}>Replacing</span>
              <span style={{
                fontSize: 11.5, fontWeight: 700, color: C.sub, minWidth: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{cur.name}</span>
              {open
                ? <ChevronDown size={14} color={C.icon} style={{ flexShrink: 0 }} />
                : <ChevronUp size={14} color={C.icon} style={{ flexShrink: 0 }} />}
            </span>

            <span style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: 3 }}>
              <span style={{ ...T.money }}>{inr(newTotal)}</span>
              {delta !== 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, borderRadius: R.pill, padding: "3px 8px",
                  background: delta > 0 ? "#FEF3F2" : A.greenBg,
                  color: delta > 0 ? "#B42318" : A.green,
                }}>
                  {delta > 0 ? "+" : "-"}{inr(delta)}
                </span>
              )}
            </span>
            <span style={{ ...T.micro, display: "block", marginTop: 2 }}>
              was {inr(cur.total)} · 3 nights
            </span>
          </button>

          <button
            onClick={onReplace}
            style={{
              flexShrink: 0, height: 46, padding: "0 20px", borderRadius: R.card, border: "none",
              background: A.pink, color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 14.5, fontWeight: 700,
              boxShadow: "0 4px 14px rgba(253,1,79,0.3)",
            }}
          >
            Replace hotel
          </button>
        </div>
      </div>
    </div>
  );
}
