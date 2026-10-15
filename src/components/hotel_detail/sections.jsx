import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Waves, Utensils, Flower2, Wifi, Umbrella, Bus, Bed, Bath, Trees,
  ConciergeBell, Shield, Footprints, Heart, Sparkles, Star, LogIn, LogOut, Info,
  Users, Wallet, PawPrint, Ban, IdCard, MapPin, Navigation, Maximize2,
  ChevronDown, ChevronUp, ChevronRight, Check, Ruler, Eye, Coffee, X, Leaf, Languages, Plug,
  Sunrise, Sunset,
} from "lucide-react";
import { C } from "../../data";
import { placeNearby } from "../../data/hotelDetailData";
import SourceLogo from "./SourceLogo";
import { Section, Sheet, Chip, CheckLine, Clamp, HEAD, PAGE_PAD, RADIUS } from "./kit";

const ICONS = {
  waves: Waves, utensils: Utensils, flower: Flower2, wifi: Wifi, umbrella: Umbrella,
  bus: Bus, bed: Bed, bath: Bath, trees: Trees, concierge: ConciergeBell, shield: Shield,
  footprints: Footprints, heart: Heart, sparkles: Sparkles, star: Star,
  login: LogIn, info: Info, users: Users, wallet: Wallet, paw: PawPrint,
  ban: Ban, idcard: IdCard, leaf: Leaf, languages: Languages, plug: Plug,
};
const Icon = ({ name, ...p }) => {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp {...p} />;
};

// A full-width button that opens a sheet. Every "show me the rest" on this
// page uses it, sitting under the thing it expands rather than floating off to
// the right of a heading, where it reads as a label and not a control.
function MoreButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        width: "100%", marginTop: 12, padding: "12px 0", borderRadius: 12,
        border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
        fontFamily: "inherit", fontSize: 13.5, fontWeight: 700, color: HEAD,
      }}
    >
      {children}
      <ChevronRight size={15} color={C.sub} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// About the stay
// ═══════════════════════════════════════════════════════════
export function About({ hotel }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="About the stay" flush>
        <div style={{ padding: `0 ${PAGE_PAD}px` }}>
          <Clamp lines={4}>{hotel.aboutShort}</Clamp>
        </div>
        <div className="hs" style={{ gap: 9, padding: `13px ${PAGE_PAD}px 0` }}>
          {hotel.aboutCards.map((cd, i) => (
            <div key={i} style={{
              position: "relative", width: 184, height: 124, flexShrink: 0,
              borderRadius: 13, overflow: "hidden", background: C.bg,
            }}>
              <img src={cd.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)",
              }} />
              <p style={{
                position: "absolute", left: 11, right: 11, bottom: 10, margin: 0,
                fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.3,
              }}>{cd.caption}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: `0 ${PAGE_PAD}px` }}>
          <MoreButton onClick={() => setOpen(true)}>View details</MoreButton>
        </div>
      </Section>

      <Sheet open={open} title="About the stay" onClose={() => setOpen(false)}>
        <div style={{ padding: "16px 16px 24px" }}>
          <h4 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: HEAD, lineHeight: 1.25 }}>
            {hotel.name}
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: C.sub }}>
            {hotel.stars} star {hotel.type.toLowerCase()} · {hotel.neighbourhood}
          </p>
          {hotel.aboutSections.map((s) => (
            <div key={s.title} style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 13.5, fontWeight: 700, color: HEAD }}>{s.title}</p>
              <p style={{ margin: 0, fontSize: 13.5, color: C.sub, lineHeight: 1.55 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// What this place offers
// ═══════════════════════════════════════════════════════════
// Six on the page as a plain list, then everything in a sheet, grouped, with
// photos on the groups that have them. "Spa" as a word tells you nothing and a
// picture of the spa tells you whether it is worth the walk.
export function Facilities({ hotel }) {
  const [open, setOpen] = useState(false);
  const total = hotel.facilityGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <Section title="What this place offers">
        <div>
          {hotel.facilityTop.map((f, i) => (
            <div
              key={f.label}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
                borderBottom: i === hotel.facilityTop.length - 1 ? "none" : `1px solid ${C.div}`,
              }}
            >
              <Icon name={f.icon} size={17} color={C.sub} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: HEAD, lineHeight: 1.3 }}>{f.label}</p>
                {f.note && <p style={{ margin: "2px 0 0", fontSize: 11, color: C.sub }}>{f.note}</p>}
              </div>
            </div>
          ))}
        </div>
        <MoreButton onClick={() => setOpen(true)}>View all {total} amenities</MoreButton>
      </Section>

      <Sheet open={open} title="What this place offers" onClose={() => setOpen(false)} full>
        <div style={{ padding: "4px 16px 24px" }}>
          {hotel.facilityGroups.map((g) => (
            <div key={g.key} style={{ paddingTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon name={g.icon} size={16} color={C.sub} strokeWidth={2} />
                <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: HEAD }}>{g.title}</h4>
                <span style={{ fontSize: 11.5, color: C.inact }}>{g.items.length}</span>
              </div>

              {g.photos.length > 0 && (
                <div className="hs" style={{ gap: 7, marginBottom: 8 }}>
                  {g.photos.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt=""
                      style={{
                        width: 168, height: 108, flexShrink: 0, borderRadius: 11,
                        objectFit: "cover", display: "block", background: C.bg,
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 }}>
                {g.items.map((it) => <CheckLine key={it.label} label={it.label} note={it.note} />)}
              </div>
            </div>
          ))}
        </div>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Check-in, check-out and how you get there
// ═══════════════════════════════════════════════════════════
// These four lines used to be buried in the policy sheet, which is the wrong
// place for the things people scroll back up to check. Whether early check-in
// is on your rate changes what time you book a flight for.
export function StayBasics({ hotel }) {
  const b = hotel.stayBasics;
  const rows = [
    { Ico: LogIn, k: "Check-in", v: `From ${b.checkIn}` },
    { Ico: LogOut, k: "Check-out", v: `Until ${b.checkOut}` },
    { Ico: Sunrise, k: "Early check-in", v: b.earlyCheckIn.included ? "Included" : "Not included", good: b.earlyCheckIn.included },
    { Ico: Sunset, k: "Late check-out", v: b.lateCheckOut.included ? "Included" : "Not included", good: b.lateCheckOut.included },
  ];

  return (
    <Section title="Check-in and check-out">
      <div style={{ border: `1px solid ${C.div}`, borderRadius: RADIUS, overflow: "hidden" }}>
        {rows.map((r, i) => (
          <div
            key={r.k}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.div}`,
            }}
          >
            <r.Ico size={17} color={C.sub} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13.5, color: C.sub }}>{r.k}</span>
            <span style={{
              fontSize: 13.5, fontWeight: 700, flexShrink: 0,
              color: r.good ? "#027A48" : HEAD,
            }}>{r.v}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════
// Where you'll sleep
// ═══════════════════════════════════════════════════════════
function RoomSheet({ room, chosen, onClose, onPick }) {
  return (
    <Sheet
      open={!!room}
      title={room?.name || ""}
      onClose={onClose}
      full
      footer={room && !chosen ? (
        <button
          onClick={() => { onPick?.(room); onClose(); }}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
            background: "#FD014F", color: "#fff", cursor: "pointer",
            fontFamily: "inherit", fontSize: 15, fontWeight: 700,
          }}
        >
          Choose this room
          {room.priceDelta > 0 && ` · + ₹${room.priceDelta.toLocaleString("en-IN")}`}
        </button>
      ) : null}
    >
      {room && (
        <div style={{ paddingBottom: 24 }}>
          <div className="hs" style={{ gap: 6, padding: "14px 16px 0" }}>
            {room.images.map((im, i) => (
              <img
                key={i}
                src={im}
                alt=""
                style={{
                  width: 244, height: 164, flexShrink: 0, borderRadius: 13,
                  objectFit: "cover", display: "block", background: C.bg,
                }}
              />
            ))}
          </div>

          <div style={{ padding: "16px 16px 0" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: C.sub, lineHeight: 1.55 }}>{room.description}</p>

            <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, margin: "16px 0 0", overflow: "hidden" }}>
              {[
                { i: Ruler, k: "Room size", v: `${room.size} m²` },
                { i: Bed, k: "Beds", v: room.beds },
                { i: Users, k: "Sleeps", v: `${room.sleeps} adults` },
                { i: Eye, k: "View", v: room.view },
                { i: Coffee, k: "Meals", v: room.mealPlan },
                { i: Info, k: "Cancellation", v: room.refundable ? "Free cancellation" : "Non-refundable" },
              ].map((x, i, arr) => (
                <div
                  key={x.k}
                  style={{
                    display: "flex", alignItems: "center", gap: 11, padding: "11px 13px",
                    borderBottom: i === arr.length - 1 ? "none" : `1px solid ${C.div}`,
                  }}
                >
                  <x.i size={16} color={C.sub} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: C.sub }}>{x.k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: HEAD }}>{x.v}</span>
                </div>
              ))}
            </div>

            {room.sizeTip && (
              <p style={{
                margin: "11px 0 0", fontSize: 12.5, fontWeight: 600, color: "#027A48",
                background: "#ECFDF3", borderRadius: 10, padding: "9px 12px",
              }}>{room.sizeTip}</p>
            )}

            <h4 style={{ margin: "20px 0 4px", fontSize: 14.5, fontWeight: 700, color: HEAD }}>In this room</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 }}>
              {room.amenities.map((a) => <CheckLine key={a} label={a} />)}
            </div>

          </div>
        </div>
      )}
    </Sheet>
  );
}

// Full width, stacked, and the whole card is the tap target. Side-scrolling
// room cards hide the third option behind a swipe, and the third option is
// often the one someone wanted.
export function Rooms({ hotel, onPick, selectedId }) {
  const [detail, setDetail] = useState(null);

  return (
    <>
      <Section title="Select your room" sub={`${hotel.rooms.length} room types. The one in your itinerary is marked.`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {hotel.rooms.map((r) => {
            const chosen = r.id === selectedId;
            return (
            <button
              key={r.id}
              onClick={() => setDetail(r)}
              style={{
                display: "flex", gap: 12, width: "100%", padding: 11, textAlign: "left",
                border: `1px solid ${chosen ? "#FD014F" : C.div}`,
                background: chosen ? "#FFF8FA" : C.white,
                borderRadius: RADIUS, cursor: "pointer", fontFamily: "inherit",
                alignItems: "stretch",
              }}
            >
              <div style={{ position: "relative", width: 104, flexShrink: 0 }}>
                <img
                  src={r.images[0]}
                  alt=""
                  style={{
                    width: "100%", height: "100%", minHeight: 104, borderRadius: 11,
                    objectFit: "cover", display: "block", background: C.bg,
                  }}
                />
                <span style={{
                  position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.6)",
                  color: "#fff", fontSize: 9.5, fontWeight: 600, borderRadius: 5, padding: "2px 6px",
                }}>{r.images.length} photos</span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {chosen && (
                  <span style={{
                    display: "inline-block", marginBottom: 5, background: "#FD014F", color: "#fff",
                    fontSize: 9.5, fontWeight: 700, borderRadius: 999, padding: "3px 8px",
                    letterSpacing: "0.3px",
                  }}>SELECTED</span>
                )}

                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: HEAD, lineHeight: 1.3 }}>
                  {r.name}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, margin: "7px 0 0" }}>
                  {[`${r.size} m²`, r.beds, r.view].map((t) => (
                    <span key={t} style={{
                      fontSize: 10.5, fontWeight: 600, color: C.sub, background: C.bg,
                      borderRadius: 5, padding: "3px 6px",
                    }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 12px", margin: "8px 0 0" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: "#027A48" }}>
                    <Check size={12} strokeWidth={3} /> {r.mealPlan}
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600,
                    color: r.refundable ? "#027A48" : C.sub,
                  }}>
                    {r.refundable
                      ? <Check size={12} strokeWidth={3} />
                      : <Info size={12} strokeWidth={2.4} />}
                    {r.refundable ? "Free cancellation" : "Non-refundable"}
                  </span>
                </div>

                <p style={{ margin: "9px 0 0", fontSize: 12.5, fontWeight: 700, color: r.priceDelta ? HEAD : C.sub }}>
                  {r.priceDelta
                    ? `+ ₹${r.priceDelta.toLocaleString("en-IN")} for 3 nights`
                    : "No extra cost"}
                </p>
              </div>
            </button>
            );
          })}
        </div>
      </Section>

      <RoomSheet
        room={detail}
        chosen={detail?.id === selectedId}
        onClose={() => setDetail(null)}
        onPick={onPick}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Where you'll be
// ═══════════════════════════════════════════════════════════
const pin = (colour, filled = true) => L.divIcon({
  className: "",
  html: `<div style="width:${filled ? 15 : 12}px;height:${filled ? 15 : 12}px;border-radius:50%;
      background:${filled ? colour : "#fff"};border:${filled ? 2.5 : 3}px solid ${filled ? "#fff" : colour};
      box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [15, 15],
  iconAnchor: [7.5, 7.5],
});

function Recentre({ at }) {
  const map = useMap();
  useEffect(() => { if (at) map.panTo(at, { animate: true }); }, [at, map]);
  return null;
}

export function NearbyMap({ hotel, places, selected, onSelect, onClose, title }) {
  const active = selected || places[0];

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 850, background: C.white }}>
      <MapContainer
        center={[active.lat, active.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%", background: "#AADAFF" }}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recentre at={[active.lat, active.lng]} />
        <Marker position={[hotel.coords.lat, hotel.coords.lng]} icon={pin("#FD014F")} />
        {places.map((p) => (
          <Marker
            key={p.name}
            position={[p.lat, p.lng]}
            icon={pin("#1570EF", p.name === active.name)}
            zIndexOffset={p.name === active.name ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(p) }}
          />
        ))}
      </MapContainer>

      <button
        onClick={onClose}
        aria-label="Close map"
        style={{
          position: "absolute", top: 12, left: 12, zIndex: 600,
          width: 36, height: 36, borderRadius: "50%", border: "none", background: C.white,
          boxShadow: "0 2px 10px rgba(16,24,40,0.24)", display: "grid", placeItems: "center", cursor: "pointer",
        }}
      >
        <X size={18} color={C.head} />
      </button>

      <span style={{
        position: "absolute", top: 12, left: 58, right: 12, zIndex: 600,
        display: "inline-flex", alignItems: "center", background: C.white, borderRadius: 999,
        padding: "9px 14px", boxShadow: "0 2px 10px rgba(16,24,40,0.18)",
        fontSize: 12.5, fontWeight: 700, color: HEAD,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {title} · {places.length} nearby
      </span>

      <div className="hs" style={{
        position: "absolute", left: 0, right: 0, bottom: 14, zIndex: 600, gap: 10, padding: "0 12px",
      }}>
        {places.map((p) => {
          const on = p.name === active.name;
          return (
            <button
              key={p.name}
              onClick={() => onSelect(p)}
              style={{
                width: 244, flexShrink: 0, display: "flex", gap: 10, textAlign: "left",
                background: C.white, borderRadius: 14, padding: 10, cursor: "pointer",
                fontFamily: "inherit",
                border: on ? "1.5px solid #1570EF" : `1.5px solid ${C.white}`,
                boxShadow: "0 6px 22px rgba(16,24,40,0.22)",
              }}
            >
              <img
                src={p.image}
                alt=""
                style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: C.bg }}
              />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: "block", fontSize: 13, fontWeight: 700, color: HEAD, lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{p.name}</span>
                {p.rating != null && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 3 }}>
                    <Star size={10} color="#FDA201" fill="#FDA201" strokeWidth={0} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: HEAD }}>{p.rating}</span>
                    <span style={{ fontSize: 10, color: C.inact }}>({p.count.toLocaleString("en-IN")})</span>
                  </span>
                )}
                <span style={{ display: "block", marginTop: 3, fontSize: 10.5, color: C.sub }}>
                  {p.distance} · {p.time} from the hotel
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Location({ hotel }) {
  const places = useMemo(() => placeNearby(hotel), [hotel]);
  const tabs = Object.keys(places);
  const [tab, setTab] = useState(tabs[0]);
  const [open, setOpen] = useState(null); // the place the map opens on
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.address}`)}`;

  return (
    <>
      <Section title="Where you'll be" flush>
        <div style={{ padding: `0 ${PAGE_PAD}px` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 11 }}>
            <MapPin size={15} color={C.sub} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.45 }}>{hotel.address}</p>
          </div>

          {/* position + zIndex give Leaflet its own stacking context. Without
              it its panes sit at 400 in the page's context and draw straight
              through any sheet opened over them. */}
          <div style={{
            position: "relative", zIndex: 0, height: 160, borderRadius: 14,
            overflow: "hidden", border: `1px solid ${C.div}`,
          }}>
            <MapContainer
              center={[hotel.coords.lat, hotel.coords.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%", background: "#AADAFF" }}
              attributionControl={false}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[hotel.coords.lat, hotel.coords.lng]} icon={pin("#FD014F")} />
            </MapContainer>
            <button
              onClick={() => setOpen(places[tab][0])}
              aria-label="Expand map"
              style={{
                position: "absolute", top: 10, right: 10, zIndex: 500,
                width: 32, height: 32, borderRadius: 9, border: "none", background: C.white,
                boxShadow: "0 2px 8px rgba(16,24,40,0.2)", display: "grid", placeItems: "center", cursor: "pointer",
              }}
            >
              <Maximize2 size={15} color={C.head} />
            </button>
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              style={{
                position: "absolute", left: 10, bottom: 10, zIndex: 500,
                display: "inline-flex", alignItems: "center", gap: 5,
                background: C.white, borderRadius: 999, padding: "7px 12px",
                boxShadow: "0 2px 8px rgba(16,24,40,0.2)", textDecoration: "none",
                fontSize: 12, fontWeight: 700, color: HEAD,
              }}
            >
              <Navigation size={12} color="#FD014F" /> Open in Maps
            </a>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 12.5, fontWeight: 600, color: "#027A48" }}>
            {hotel.distanceLine}
          </p>
        </div>

        <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", padding: `14px ${PAGE_PAD}px 0` }}>
          {tabs.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>
          ))}
        </div>

        <div className="hs" style={{ gap: 9, padding: `11px ${PAGE_PAD}px 0` }}>
          {places[tab].map((n) => (
            <button
              key={n.name}
              onClick={() => setOpen(n)}
              style={{
                width: 200, flexShrink: 0, display: "flex", gap: 10, textAlign: "left",
                border: `1px solid ${C.div}`, borderRadius: 13, padding: 9, background: C.white,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <img
                src={n.image}
                alt=""
                style={{ width: 54, height: 54, borderRadius: 9, objectFit: "cover", flexShrink: 0, background: C.bg }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: 12.5, fontWeight: 700, color: HEAD, lineHeight: 1.3,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{n.name}</p>
                {n.rating != null && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 3 }}>
                    <Star size={10} color="#FDA201" fill="#FDA201" strokeWidth={0} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: HEAD }}>{n.rating}</span>
                    <span style={{ fontSize: 10, color: C.inact }}>({n.count.toLocaleString("en-IN")})</span>
                  </span>
                )}
                <p style={{ margin: "3px 0 0", fontSize: 10.5, color: C.sub }}>{n.distance} · {n.time}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {open && (
        <NearbyMap
          hotel={hotel}
          places={places[tab]}
          selected={open}
          onSelect={setOpen}
          onClose={() => setOpen(null)}
          title={tab}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Food and drink
// ═══════════════════════════════════════════════════════════
export function FoodAndDrink({ hotel }) {
  // On site and nearby are two different decisions, so they are two tabs
  // rather than one long row. "Where do we eat tonight without leaving" and
  // "where do we eat if we walk out" are not the same question.
  const [tab, setTab] = useState("onsite");
  const [open, setOpen] = useState(null);
  const nearby = useMemo(() => placeNearby(hotel)["Food and drink"] || [], [hotel]);

  return (
    <>
      <Section title="Food and drink" flush>
        <div style={{ display: "flex", gap: 7, padding: `0 ${PAGE_PAD}px 11px` }}>
          <Chip active={tab === "onsite"} onClick={() => setTab("onsite")} count={hotel.restaurants.length}>
            On site
          </Chip>
          <Chip active={tab === "nearby"} onClick={() => setTab("nearby")} count={nearby.length}>
            Nearby
          </Chip>
        </div>

        {tab === "onsite" ? (
          <div className="hs" style={{ gap: 10, padding: `0 ${PAGE_PAD}px` }}>
            {hotel.restaurants.map((r) => (
              <div key={r.name} style={{
                width: 212, flexShrink: 0, border: `1px solid ${C.div}`, borderRadius: 14,
                overflow: "hidden", background: C.white,
              }}>
                <img src={r.image} alt="" style={{ width: "100%", height: 106, objectFit: "cover", display: "block", background: C.bg }} />
                <div style={{ padding: 12 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: HEAD }}>{r.name}</p>
                  <p style={{ margin: "2px 0 7px", fontSize: 11.5, color: C.sub }}>{r.cuisine}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                    {r.openFor.map((o) => (
                      <span key={o} style={{
                        fontSize: 10.5, fontWeight: 600, color: C.sub, background: C.bg,
                        borderRadius: 5, padding: "3px 7px",
                      }}>{o}</span>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: C.sub, lineHeight: 1.4 }}>{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hs" style={{ gap: 10, padding: `0 ${PAGE_PAD}px` }}>
            {nearby.map((n) => (
              <button
                key={n.name}
                onClick={() => setOpen(n)}
                style={{
                  width: 212, flexShrink: 0, border: `1px solid ${C.div}`, borderRadius: 14,
                  overflow: "hidden", background: C.white, padding: 0, cursor: "pointer",
                  fontFamily: "inherit", textAlign: "left",
                }}
              >
                <img src={n.image} alt="" style={{ width: "100%", height: 106, objectFit: "cover", display: "block", background: C.bg }} />
                <div style={{ padding: 12 }}>
                  <p style={{
                    margin: 0, fontSize: 13.5, fontWeight: 700, color: HEAD,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{n.name}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, margin: "4px 0 0" }}>
                    <Star size={11} color="#FDA201" fill="#FDA201" strokeWidth={0} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: HEAD }}>{n.rating}</span>
                    <span style={{ fontSize: 10.5, color: C.inact }}>({n.count.toLocaleString("en-IN")})</span>
                  </span>
                  <p style={{ margin: "5px 0 0", fontSize: 11.5, color: C.sub }}>{n.distance} · {n.time}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {open && (
        <NearbyMap
          hotel={hotel}
          places={nearby}
          selected={open}
          onSelect={setOpen}
          onClose={() => setOpen(null)}
          title="Food and drink"
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Why Indian couples pick this stay
// ═══════════════════════════════════════════════════════════
// Sits after the ratings, where it answers the question a rating raises: it is
// clearly a good hotel, but is it a good hotel for us. Food, language and the
// small practical things, which is what our customers actually ask about.
export function WhyIndians({ hotel }) {
  return (
    <Section title="Why Indian couples pick this stay">
      <div style={{
        border: "1px solid #FFD6E3", borderRadius: RADIUS, background: "#FFF8FA", padding: "4px 14px",
      }}>
        {hotel.whyIndians.map((w, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 11, alignItems: "flex-start", padding: "11px 0",
              borderBottom: i === hotel.whyIndians.length - 1 ? "none" : "1px solid #FFE4EC",
            }}
          >
            <span style={{
              width: 26, height: 26, borderRadius: 8, background: "#FFE1EB",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Icon name={w.icon} size={14} color="#C00840" strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 13.5, color: HEAD, lineHeight: 1.45, paddingTop: 3 }}>{w.text}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════
// Hotel policies
// ═══════════════════════════════════════════════════════════
// The three policies that change a decision, then the rest behind one button
// underneath them. Check-in and check-out are not here any more: they live up
// the page with the transfers, where people go looking for them.
export function Policies({ hotel }) {
  const [open, setOpen] = useState(false);
  const key = hotel.policies.filter((p) => ["cancel", "children", "payment"].includes(p.key));

  return (
    <>
      <Section title="Hotel policies">
        <div style={{ border: `1px solid ${C.div}`, borderRadius: RADIUS, overflow: "hidden" }}>
          {key.map((p, i) => (
            <div
              key={p.key}
              style={{
                display: "flex", gap: 12, padding: "13px 14px",
                borderBottom: i === key.length - 1 ? "none" : `1px solid ${C.div}`,
              }}
            >
              <Icon name={p.icon} size={17} color={C.sub} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: HEAD }}>{p.title}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: C.sub, lineHeight: 1.45 }}>{p.lines[0]}</p>
              </div>
            </div>
          ))}
        </div>
        <MoreButton onClick={() => setOpen(true)}>See all policies</MoreButton>
      </Section>

      <Sheet open={open} title="Hotel policies" onClose={() => setOpen(false)} full>
        <div style={{ padding: "6px 16px 24px" }}>
          {hotel.policies.map((p) => (
            <div key={p.key} style={{ paddingTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <Icon name={p.icon} size={16} color={C.sub} strokeWidth={2} />
                <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: HEAD }}>{p.title}</h4>
              </div>
              {p.lines.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "3px 0" }}>
                  <span style={{ color: C.inact, fontSize: 13, lineHeight: 1.5 }}>·</span>
                  <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{l}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Important and legal info
// ═══════════════════════════════════════════════════════════
// What the property is obliged to tell you. It is not a policy you agree to,
// so it does not belong in the policy sheet, and it is the sort of thing
// people are annoyed to discover after they arrive.
export function LegalInfo({ hotel }) {
  const [open, setOpen] = useState(false);
  const key = hotel.legal.slice(0, 3);

  return (
    <>
      <Section title="Important and legal info">
        <div style={{ border: `1px solid ${C.div}`, borderRadius: RADIUS, overflow: "hidden" }}>
          {key.map((l, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: 12, padding: "13px 14px",
                borderBottom: i === key.length - 1 ? "none" : `1px solid ${C.div}`,
              }}
            >
              <Info size={17} color={C.sub} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>{l}</p>
            </div>
          ))}
        </div>
        <MoreButton onClick={() => setOpen(true)}>See all information</MoreButton>
      </Section>

      <Sheet open={open} title="Important and legal info" onClose={() => setOpen(false)} full>
        <div style={{ padding: "8px 16px 24px" }}>
          {hotel.legal.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "11px 0", borderBottom: i === hotel.legal.length - 1 ? "none" : `1px solid ${C.div}` }}>
              <Info size={15} color={C.inact} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.55 }}>{l}</p>
            </div>
          ))}
        </div>
      </Sheet>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// Frequently asked questions
// ═══════════════════════════════════════════════════════════
export function Questions({ hotel }) {
  const [open, setOpen] = useState(null);
  return (
    <Section title="Frequently asked questions">
      <div>
        {hotel.faqs.map((f, i) => {
          const on = open === i;
          return (
            <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.div}` : "none" }}>
              <button
                onClick={() => setOpen(on ? null : i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "13px 0", border: "none", background: "none", cursor: "pointer",
                  fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: HEAD, lineHeight: 1.4 }}>
                  {f.q}
                </span>
                {on
                  ? <ChevronUp size={18} color={C.sub} style={{ flexShrink: 0 }} />
                  : <ChevronDown size={18} color={C.sub} style={{ flexShrink: 0 }} />}
              </button>
              {on && (
                <p style={{ margin: "0 0 14px", fontSize: 13, color: C.sub, lineHeight: 1.55 }}>{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════
// Similar hotels
// ═══════════════════════════════════════════════════════════
// The page should not end in a full stop. If this one is not right, the next
// question is "what else", and the answer to that is money, so the difference
// to this hotel is what each card leads with. Tapping one opens it, the same
// way tapping a hotel anywhere else in the app does.
export function SimilarHotels({ hotel, onOpen }) {
  return (
    <Section title="Similar hotels" flush>
      <div className="hs" style={{ gap: 10, padding: `0 ${PAGE_PAD}px` }}>
        {hotel.similar.map((h) => {
          const cheaper = h.delta < 0;
          return (
            <button
              key={h.id}
              onClick={() => onOpen?.(h)}
              style={{
                width: 208, flexShrink: 0, border: `1px solid ${C.div}`, borderRadius: 14,
                overflow: "hidden", background: C.white, padding: 0, cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <img src={h.image} alt="" style={{ width: "100%", height: 112, objectFit: "cover", display: "block", background: C.bg }} />
              <div style={{ padding: 11 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 700, color: HEAD, lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{h.name}</p>

                <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "5px 0 0" }}>
                  <span style={{ display: "inline-flex", gap: 1 }}>
                    {Array.from({ length: h.stars }).map((_, i) => (
                      <Star key={i} size={9} color="#FDA201" fill="#FDA201" strokeWidth={0} />
                    ))}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <SourceLogo source={h.source} size={12} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: HEAD }}>{h.score.toFixed(1)}</span>
                  </span>
                </div>

                <p style={{ margin: "5px 0 0", fontSize: 11, color: C.sub, lineHeight: 1.35 }}>{h.why}</p>

                <span style={{
                  display: "inline-block", marginTop: 8, borderRadius: 999, padding: "4px 9px",
                  fontSize: 11.5, fontWeight: 700,
                  background: cheaper ? "#ECFDF3" : "#FEF3F2",
                  color: cheaper ? "#027A48" : "#B42318",
                }}>
                  {cheaper ? "Lesser by" : "More by"} ₹{Math.abs(h.delta).toLocaleString("en-IN")}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
