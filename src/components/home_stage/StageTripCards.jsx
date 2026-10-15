import {
  ArrowRight, BedDouble, CalendarClock, CheckCircle2, Download, FileText, Headset, MapPin,
  MessageCircle, Phone, Plane, Receipt, Share2, Sparkles, Sun, Ticket, UserPlus,
  Users, Wallet,
} from "lucide-react";
import { C } from "../../data";
import WhatsAppIcon from "../WhatsAppIcon";
import { TransferSection, LeisureCard, ExploreIdeas } from "../DayWiseExtras";
import {
  Block, CARD_RADIUS, CARD_SHADOW, CardHead, Divider, Fact, Pill, Primary, QuietRow, TapRow,
  dateRange, inr,
} from "./stageCardKit";

// ─── The home card, in the three stages where Home should not be a shop ───
//
// A new user and someone whose trip is over both want the same Home: places to
// go. Everyone in between wants one thing, and it is never the same thing. A
// lead wants their itinerary. Someone who has booked wants to know what they
// owe and when they fly. Someone already there wants today.
//
// So all three are the same card with the middle swapped out, and the middle is
// chosen to answer one question: what is the most useful thing right now?
//
// Every action on the card finishes on the card. Share opens the share sheet,
// PDF downloads, co-travellers and receipts open a sheet in place. None of them
// throw you onto another screen to do one small thing, which was the whole
// reason for putting the card on Home.

function Shell({ children }) {
  return (
    <div style={{
      margin: "0 16px", background: C.white, borderRadius: CARD_RADIUS, overflow: "hidden",
      border: `1px solid ${C.div}`, boxShadow: CARD_SHADOW,
    }}>
      {children}
    </div>
  );
}

function FactLine({ route, travellers }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {route && <Fact icon={MapPin}>{route}</Fact>}
      <Fact icon={Users}>{travellers} travellers</Fact>
    </div>
  );
}

// ─── Who is coming ───
// Named faces, an invite that goes straight to WhatsApp, and a manage icon.
// With nobody added it becomes the prompt to add someone, because a trip for
// two that only one person can see is the commonest thing we have to fix later.
function TravellersStrip({ travellers = [], onManage, onInvite }) {
  const waiting = travellers.filter((t) => !t.joined);
  if (!travellers.length) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
        background: "#FAFAFA", borderTop: `1px solid ${C.div}`,
      }}>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", background: C.p100,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <UserPlus size={15} color={C.p600} strokeWidth={2.2} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.head, lineHeight: "16px" }}>No co-travellers yet</p>
          <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Add them and they see this itinerary too</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onManage?.(); }} style={{
          flexShrink: 0, background: C.p600, color: "#fff", border: "none", borderRadius: 10,
          padding: "8px 13px", fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
        }}>Add</button>
      </div>
    );
  }
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
      background: "#FAFAFA", borderTop: `1px solid ${C.div}`,
    }}>
      <div style={{ display: "flex", flexShrink: 0 }}>
        {travellers.slice(0, 4).map((t, i) => (
          <span key={i} style={{
            width: 30, height: 30, borderRadius: "50%", background: i % 2 ? C.pur100 : C.p100,
            color: i % 2 ? C.purple : C.p600, display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 800, border: "2px solid #FAFAFA", marginLeft: i ? -9 : 0,
          }}>{t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.head, lineHeight: "16px" }}>
          Your {travellers.length} travellers
        </p>
        <p style={{ margin: 0, fontSize: 11, color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {travellers.map((t) => t.name.split(" ")[0]).join(", ")}
        </p>
      </div>
      {waiting.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onInvite?.(); }}
          aria-label="Invite on WhatsApp"
          style={{
            width: 32, height: 32, borderRadius: 10, border: "none", background: "#25D366",
            display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
          }}
        >
          <WhatsAppIcon size={16} color="#fff" />
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onManage?.(); }}
        aria-label="Add or manage co-travellers"
        style={{
          width: 32, height: 32, borderRadius: 10, border: `1px solid ${C.div}`, background: C.white,
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
        }}
      >
        <UserPlus size={15} color={C.p600} strokeWidth={2.2} />
      </button>
    </div>
  );
}

// The consultant, as a footer strip rather than a card of their own. A lead
// asks one question and wants one person to ask it to.
function ConsultantStrip({ consultant, onCall, onChat }) {
  if (!consultant) return null;
  const initials = consultant.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
      background: "#FAFAFA", borderTop: `1px solid ${C.div}`,
    }}>
      {consultant.avatar ? (
        <img src={consultant.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
      ) : (
        <span style={{
          width: 32, height: 32, borderRadius: "50%", background: C.p100, color: C.p600,
          display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 800, flexShrink: 0,
        }}>{initials}</span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.head, lineHeight: "16px" }}>{consultant.name}</p>
        <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Your travel consultant</p>
      </div>
      {[{ I: Phone, f: onCall, label: "Call" }, { I: MessageCircle, f: onChat, label: "Chat" }].map((b, i) => (
        <button key={i} aria-label={b.label} onClick={(e) => { e.stopPropagation(); b.f?.(); }} style={{
          width: 32, height: 32, borderRadius: 10, border: `1px solid ${C.div}`, background: C.white,
          display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
        }}>
          <b.I size={15} color={C.p600} strokeWidth={2.2} />
        </button>
      ))}
    </div>
  );
}

// ─── 1. Lead: an itinerary exists, nothing is booked ───
export function LeadCard({ trip, consultant, travellers = [], on = {} }) {
  return (
    <Shell>
      <CardHead
        images={trip.images}
        pill={<Pill tone="green" dot>Itinerary ready</Pill>}
        title={`Your ${trip.dest} trip`}
        sub={`${dateRange(trip.from, trip.to)} · ${trip.nights} nights`}
        onOpen={on.open}
      />
      <div style={{ padding: 14 }}>
        <FactLine route={trip.route} travellers={trip.travellers} />
        <Divider />

        {/* The price, and where it came from. A lead comparing two quotes needs
            to know which version they are looking at and when it was priced. */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.head, letterSpacing: "-0.6px", lineHeight: 1 }}>
              {inr(trip.price)}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11.5, color: C.sub }}>
              for {trip.travellers} · incl. taxes
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span style={{
              display: "inline-block", background: C.bg, color: C.head, borderRadius: 7,
              padding: "3px 8px", fontSize: 11, fontWeight: 800, letterSpacing: "0.3px",
            }}>v{trip.version}</span>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: C.inact }}>Generated {trip.generatedOn}</p>
          </div>
        </div>

        <Primary onClick={on.open}>
          <Sparkles size={16} /> View and customise <ArrowRight size={15} />
        </Primary>
        <div style={{ height: 10 }} />
        <QuietRow actions={[
          { icon: Share2, label: "Share itinerary", onClick: on.share },
          { icon: Download, label: "Download itinerary", onClick: on.download },
        ]} />
      </div>
      <TravellersStrip travellers={travellers} onManage={on.travellers} onInvite={on.invite} />
      <ConsultantStrip consultant={consultant} onCall={on.call} onChat={on.chat} />
    </Shell>
  );
}

// ─── 2. Upcoming: booked, and the money is the live question ───
export function UpcomingCard({ trip, on = {} }) {
  const pct = Math.min(100, Math.round((trip.paid / trip.total) * 100));
  const settled = !trip.next;
  return (
    <Shell>
      <CardHead
        images={trip.images}
        pill={<Pill tone="green" dot>Booked</Pill>}
        badge={
          <span style={{
            display: "inline-flex", alignItems: "baseline", gap: 5, background: "rgba(255,255,255,0.96)",
            borderRadius: 999, padding: "5px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}>
            <b style={{ fontSize: 15, fontWeight: 800, color: C.head, letterSpacing: "-0.3px" }}>{trip.daysToGo}</b>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub }}>days to go</span>
          </span>
        }
        title={`Your ${trip.dest} trip`}
        sub={`${dateRange(trip.from, trip.to)} · ${trip.nights} nights`}
        onOpen={on.open}
      />
      <div style={{ padding: 14 }}>
        <FactLine route={trip.route} travellers={trip.travellers} />
        <Divider />

        {/* Payment. Paid against total first, because that is the number people
            actually hold in their head, then the one instalment that is next.
            Receipts sit here either way: money already paid needs a receipt
            whether or not any is still owed. */}
        <div style={{
          background: settled ? "#F2FBF6" : "#FFF8F0", border: `1px solid ${settled ? "#CDEBDC" : "#FBE3C8"}`,
          borderRadius: 14, padding: "12px 13px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: C.head }}>
              {inr(trip.paid)} <span style={{ fontWeight: 600, color: C.sub, fontSize: 12 }}>of {inr(trip.total)} paid</span>
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: settled ? "#027A48" : "#B54708" }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "rgba(16,24,40,0.08)", margin: "9px 0 10px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: settled ? "#027A48" : C.p600 }} />
          </div>
          {settled ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <CheckCircle2 size={16} color="#027A48" strokeWidth={2.4} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#027A48" }}>Fully paid. Nothing pending.</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.head }}>
                  Next {inr(trip.next.amount)}
                </p>
                <p style={{ margin: "2px 0 0", display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#B54708", fontWeight: 600 }}>
                  <CalendarClock size={12} color="#B54708" /> Due {trip.next.date}
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); on.pay?.(); }} style={{
                flexShrink: 0, background: C.p600, color: "#fff", border: "none", borderRadius: 11,
                padding: "10px 16px", fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(227,27,83,0.26)",
              }}>Pay now</button>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); on.receipts?.(); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
              marginTop: 11, background: C.white, border: `1px solid ${C.div}`, borderRadius: 10,
              padding: "9px 12px", fontSize: 12.5, fontWeight: 700, color: C.head,
              fontFamily: "inherit", cursor: "pointer",
            }}
          >
            <Receipt size={14} color={C.sub} strokeWidth={2} /> Payment receipts
          </button>
        </div>

        <div style={{ height: 12 }} />
        <Primary onClick={on.open}>
          View trip <ArrowRight size={15} />
        </Primary>
        <div style={{ height: 10 }} />
        <QuietRow actions={[
          { icon: Share2, label: "Share itinerary", onClick: on.share },
          { icon: Download, label: "Download itinerary", onClick: on.download },
          { icon: FileText, label: "Trip documents", onClick: on.docs },
          { icon: UserPlus, label: "Co-travellers", onClick: on.travellers },
        ]} />
      </div>
      <TapRow
        icon={Headset}
        title="Chat with your trip manager"
        hint="Visas, hotels, anything before you fly"
        onClick={on.chat}
      />
    </Shell>
  );
}

// ─── 3. On trip: the card stops selling and starts being useful ───
//
// Everything here is scoped to one day. The stay block is the hotel you sleep
// in tonight, not the three on the booking, and the voucher and the ticket only
// appear on the days they are needed. On a day with no flight there is no
// flight row to scroll past.
export function OnTripCard({ trip, on = {} }) {
  return (
    <Shell>
      <CardHead
        images={trip.images}
        height={150}
        pill={<Pill tone="live" dot>On trip</Pill>}
        badge={
          <span style={{
            background: "rgba(255,255,255,0.96)", borderRadius: 999, padding: "5px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)", fontSize: 11.5, fontWeight: 800, color: C.head,
          }}>Day {trip.dayNo} of {trip.totalDays}</span>
        }
        title={trip.dest}
        sub={`${dateRange(trip.from, trip.to)} · ${trip.travellers} travellers`}
        onOpen={on.open}
      />
      <div style={{ padding: 16 }}>
        <Block label={`Today in ${trip.city}`} icon={Sun}>
          {trip.activities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {trip.activities.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%", background: C.p300,
                    marginTop: 6, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: C.head, fontWeight: 600, lineHeight: "18px" }}>{a}</span>
                </div>
              ))}
            </div>
          ) : (
            /* A leisure day, told the way the day screen tells it: the same
               transfer block, the same leisure card, the same unbooked ideas.
               The negative margin only undoes the card's own padding so those
               components sit where they were designed to sit. */
            <div style={{ margin: "-6px -16px 0" }}>
              {trip.transfers?.length > 0 && (
                <TransferSection transfers={trip.transfers} heading="Today's transfer" />
              )}
              <LeisureCard hasTransfer={trip.transfers?.length > 0} />
              <ExploreIdeas ideas={trip.ideas} />
            </div>
          )}
        </Block>

        {trip.hotel && (
          <>
            <Divider />
            <Block label="Tonight's stay" icon={BedDouble}>
              <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                {trip.hotel.photo && (
                  <img src={trip.hotel.photo} alt="" style={{ width: 52, height: 52, borderRadius: 11, objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head, lineHeight: "18px" }}>{trip.hotel.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.sub }}>
                    {trip.hotel.roomType} · {trip.hotel.city}
                  </p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: C.inact }}>
                    Booking {trip.hotel.confirmationNo}
                  </p>
                </div>
              </div>
              <div style={{ height: 9 }} />
              <QuietRow actions={[{ icon: Download, label: "Hotel voucher", onClick: on.voucher }]} />
            </Block>
          </>
        )}

        {trip.flight && (
          <>
            <Divider />
            <Block label="Today's flight" icon={Plane}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 10, background: C.bg, color: C.head,
                  display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 800, flexShrink: 0,
                }}>{trip.flight.airlineLogo}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.head }}>
                    {trip.flight.from.code} {trip.flight.departTime} → {trip.flight.to.code} {trip.flight.arriveTime}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: C.sub }}>
                    {trip.flight.airline} · {trip.flight.stops} · PNR {trip.flight.pnr}
                  </p>
                </div>
              </div>
              <div style={{ height: 9 }} />
              <QuietRow actions={[{ icon: Ticket, label: "Flight ticket", onClick: on.ticket }]} />
            </Block>
          </>
        )}

        <Divider m="14px 0 12px" />
        <Primary tone="green" onClick={on.open}>
          Open today's plan <ArrowRight size={15} />
        </Primary>
        <div style={{ height: 10 }} />
        <QuietRow actions={[
          { icon: Share2, label: "Share itinerary", onClick: on.share },
          { icon: Download, label: "Download itinerary", onClick: on.download },
          { icon: Wallet, label: "Payments", onClick: on.receipts },
        ]} />
      </div>
      {/* On the ground, one tap has to reach a person. Both ways to do it sit on
          the row itself rather than behind another screen. */}
      <TapRow
        icon={Headset}
        tone="green"
        title="Ground team, on call"
        hint="Local help while you are in the country"
        onClick={on.chat}
        right={
          <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
            <button aria-label="Call the ground team" onClick={(e) => { e.stopPropagation(); on.call?.(); }} style={{
              width: 32, height: 32, borderRadius: 10, border: `1px solid ${C.div}`, background: C.white,
              display: "grid", placeItems: "center", cursor: "pointer",
            }}>
              <Phone size={15} color="#027A48" strokeWidth={2.2} />
            </button>
            <button aria-label="WhatsApp the ground team" onClick={(e) => { e.stopPropagation(); on.whatsapp?.(); }} style={{
              width: 32, height: 32, borderRadius: 10, border: "none", background: "#25D366",
              display: "grid", placeItems: "center", cursor: "pointer",
            }}>
              <WhatsAppIcon size={16} color="#fff" />
            </button>
          </div>
        }
      />
    </Shell>
  );
}
