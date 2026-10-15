import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy, Download, Link2, Mail, MessageSquare, Receipt, Trash2, UserPlus,
} from "lucide-react";
import { C, allItineraries, destData } from "../data";
import { useDeals } from "../data/deals";
import { mockTrips } from "../data/tripData";
import { consultantProfiles } from "../data/consultants";
import { COMPARE_REELS } from "../data/homeV3Data";
import EduMultiCarousel from "../components/home_v2/EduMultiCarousel";
import WhatsAppIcon from "../components/WhatsAppIcon";
import InvitePartnerSection, { normalizeMobile } from "../components/InvitePartnerSection";
import { TravellerMomentsReels, LovedByCouples } from "./HomeV5";
import { LeadCard, UpcomingCard, OnTripCard } from "../components/home_stage/StageTripCards";
import { Sheet, SheetRow, Toast, inr } from "../components/home_stage/stageCardKit";

// ─── Home, by the stage the traveller is in ───
//
// A new user and someone whose trip is over both come to Home to be sold a
// trip, so Home stays exactly as it is for them and they are not in here.
//
// The three stages that are left have a trip already, and for them the current
// Home is a shop they have walked past. Home leads with one card about their
// own trip. Everything that was selling (circles, banner, hero, month strips,
// the six countries) is gone, and what is left under the card is the part worth
// reading even when you have already chosen: Sunday School, traveller moments,
// ratings.

const DAY = 86400000;
const dispDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const madeOn = (t) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const STAGES = [
  { key: "lead", label: "Lead" },
  { key: "pretrip", label: "Pre trip" },
  { key: "ontrip", label: "On trip" },
];

// Co-travellers for the lead demo, in the order they would be added.
const PEOPLE = [
  { name: "Rahul Sharma", phone: "+91 98765 43210", joined: true, lead: true },
  { name: "Priya Sharma", phone: "+91 98765 43211", joined: false },
  { name: "Aman Verma", phone: "+91 99200 45512", joined: true },
  { name: "Ritika Verma", phone: "+91 99200 45513", joined: false },
];
const PARTY = [0, 2, 4];   // how many are on the trip, cycled in the lab

// The cities of a route, without the night counts.
const citiesOf = (str) => (str || "").split(/[•·]/).map((s) => s.replace(/\d+\s*N\s*/i, "").trim()).filter(Boolean).join(" · ");

// Photos for the strip you swipe at the top of the card. Destination scenery
// leads: a hotel bedroom is a fine third photo but a poor first impression of
// a country.
function reelFor(dest, ...extra) {
  const shots = allItineraries.filter((i) => i.dest === dest).map((i) => i.img);
  return [...new Set([destData[dest]?.hero, ...shots, ...extra].filter(Boolean))].slice(0, 5);
}

function StageBar({ stage, setStage }) {
  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.div}`, padding: "10px 0 9px", flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 7, padding: "0 14px" }}>
        {STAGES.map((s) => {
          const on = s.key === stage;
          return (
            <button
              key={s.key}
              data-testid={`stage-${s.key}`}
              onClick={() => setStage(s.key)}
              style={{
                flex: 1, border: `1px solid ${on ? C.p600 : C.div}`, background: on ? C.p600 : C.white,
                color: on ? "#fff" : C.head, borderRadius: 999, padding: "8px 10px", fontSize: 12.5,
                fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
              }}
            >{s.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// A quiet control that belongs to the lab, not the product.
function LabToggle({ children, onClick, testid }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "12px 16px 0" }}>
      <button
        data-testid={testid}
        onClick={onClick}
        style={{
          border: `1px dashed ${C.icon}`, background: C.white, borderRadius: 999,
          padding: "7px 14px", fontSize: 11.5, fontWeight: 700, color: C.inact,
          fontFamily: "inherit", cursor: "pointer",
        }}
      >{children}</button>
    </div>
  );
}

// The lower half of Home, kept for every stage because it is the part that is
// still worth reading once you have a trip.
function BelowTheCard() {
  const lessons = COMPARE_REELS.map((c) => ({
    poster: c.poster, videoUrl: c.videoUrl, duration: c.duration,
    tag: `${c.a} vs ${c.b}`, topics: c.topics,
  }));
  return (
    <>
      <EduMultiCarousel valueTitle="Torn between [two]?" lessons={lessons} />
      <TravellerMomentsReels />
      <LovedByCouples />
      <div style={{ height: 90 }} />
    </>
  );
}

const waLink = (phone, msg) =>
  `https://wa.me/${(phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

export default function StageHomeLab() {
  const navigate = useNavigate();
  const { deals } = useDeals();
  const [stage, setStage] = useState("lead");
  const [paidOff, setPaidOff] = useState(false);
  const [partyIdx, setPartyIdx] = useState(1);
  const [sheet, setSheet] = useState(null);      // null | "share" | "receipts"
  const [toast, setToast] = useState(null);
  // Bumping this opens the itinerary screen's own co-traveller flow.
  const [inviteKey, setInviteKey] = useState(0);
  const [guests, setGuests] = useState([]);

  const say = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1900); };

  // The lab seeds a party size; from then on the invite flow owns the list and
  // reports every add or removal back, so the strip on the card and the sheet
  // never disagree.
  const seeded = useMemo(() => PEOPLE.slice(1, PARTY[partyIdx]).map((p) => {
    const m = normalizeMobile(p.phone);
    return { name: p.name, national: m.national, display: m.display, wa: m.wa, joined: p.joined };
  }), [partyIdx]);
  const guestList = guests || [];
  const party = guestList.length
    ? [{ ...PEOPLE[0], phone: normalizeMobile(PEOPLE[0].phone).display },
       ...guestList.map((g) => ({ name: g.name, phone: g.display, joined: g.joined }))]
    : [];
  const openInvite = () => setInviteKey((n) => n + 1);

  // ── Lead: the newest priced version of a live deal ──
  const lead = useMemo(() => {
    const deal = deals.find((d) => d.status !== "lost" && (d.versions || []).some((v) => v.status === "quote"))
      || deals.find((d) => d.status !== "lost");
    if (!deal) return null;
    const v = [...(deal.versions || [])].sort((a, b) => b.num - a.num)[0];
    if (!v) return null;
    const itId = v.itineraryId ?? deal.itineraryId;
    const it = allItineraries.find((i) => i.id === Number(itId));
    const td = v.customizations?.travelDates || {};
    const from = td.fromDate ? new Date(td.fromDate) : new Date(Date.now() + 45 * DAY);
    const nights = td.nights || it?.nights || 7;
    return {
      dest: v.destination || deal.dest,
      images: reelFor(v.destination || deal.dest, deal.img),
      from, to: new Date(from.getTime() + nights * DAY),
      nights,
      route: (it?.route || []).map((r) => r.city).join(" · ") || v.title || deal.title,
      version: v.num, generatedOn: madeOn(v.pricedAt || v.createdAt),
      // Deals hold a per-person price; the card shows what the trip costs.
      perPerson: v.livePrice || v.indicativePrice || 0,
      link: `/itinerary/${itId}?dealId=${deal.id}&versionId=${v.id}`,
    };
  }, [deals]);

  // The party size drives both the headcount and the price, so the card never
  // shows a total for a different number of people than it lists.
  const leadHeads = Math.max(2, party.length || 2);
  const leadTrip = lead && { ...lead, travellers: leadHeads, price: lead.perPerson * leadHeads };

  // ── Pre trip: a booked trip that has not started ──
  const upcoming = useMemo(() => {
    const ups = mockTrips.filter((x) => x.status === "upcoming");
    const pending = (x) => x.installments.find((i) => i.status !== "paid");
    // Prefer a trip whose next instalment is genuinely still ahead, so the
    // card is not asking for money on a date that has already passed.
    const t = ups.find((x) => {
      const d = pending(x);
      return d && new Date(d.date).getTime() > Date.now();
    }) || ups[0];
    if (!t) return null;
    const due = pending(t);
    return {
      raw: t, dest: t.destination, images: reelFor(t.destination, ...t.heroImages),
      from: t.startDate, to: t.endDate, nights: t.totalNights,
      travellers: 1 + (t.coTravelers?.length || 0),
      route: citiesOf(t.nightsBreakdown),
      daysToGo: Math.max(0, Math.ceil((new Date(t.startDate) - Date.now()) / DAY)),
      paid: t.amountPaid, total: t.totalPackageValue,
      next: due ? { amount: due.amount, date: madeOn(due.date) } : null,
    };
  }, []);

  // ── On trip: one day of a trip that is happening now ──
  const onTrip = useMemo(() => mockTrips.find((x) => x.status === "ongoing"), []);
  const liveDay = onTrip ? Math.min(onTrip.itineraryDays.length,
    Math.max(1, Math.floor((Date.now() - new Date(onTrip.startDate)) / DAY) + 1)) : 1;
  const [dayNo, setDayNo] = useState(liveDay);

  const today = useMemo(() => {
    if (!onTrip) return null;
    const d = onTrip.itineraryDays[dayNo - 1];
    // The hotel you sleep in tonight: the stay whose range starts on or before
    // today and ends after it. On the last day of a stay you have moved on.
    const hotel = (onTrip.hotels || []).find((h) => {
      const m = (h.dayRange || "").match(/(\d+)\D+(\d+)/);
      return m && dayNo >= Number(m[1]) && dayNo < Number(m[2]);
    }) || null;
    const dayDate = dispDate(new Date(new Date(onTrip.startDate).getTime() + (dayNo - 1) * DAY));
    const flight = (onTrip.flights || []).find((f) => f.date === dayDate) || null;
    return {
      dest: onTrip.destination, images: reelFor(onTrip.destination, ...onTrip.heroImages),
      from: onTrip.startDate, to: onTrip.endDate,
      travellers: 1 + (onTrip.coTravelers?.length || 0),
      dayNo, totalDays: onTrip.itineraryDays.length,
      city: d?.city, activities: d?.activities || [],
      transfers: d?.transfers || [], ideas: d?.ideas || [],
      hotel, flight,
    };
  }, [onTrip, dayNo]);

  const go = (path) => navigate(path);

  // ── Actions the cards hand back ──
  // Share tries the phone's own sheet first and falls back to ours, so the
  // prototype behaves on a desktop and on a handset.
  const shareTrip = async (label) => {
    const text = `Take a look at our ${label} plan on 30 Sundays.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "30 Sundays", text }); return; } catch { /* cancelled */ }
    }
    setSheet("share");
  };
  const download = (file) => say(`Downloading ${file}`);

  const shareOptions = [
    { icon: WhatsAppIcon, label: "WhatsApp", sub: "Send it in a chat", bg: "#E7F9EE", fg: "#25D366", wa: true },
    { icon: MessageSquare, label: "Messages", sub: "As a text", bg: "#E8F1FF", fg: "#1570EF" },
    { icon: Mail, label: "Email", sub: "With the PDF attached", bg: "#FFF1F4", fg: C.p600 },
    { icon: Link2, label: "Copy link", sub: "Anyone with it can view", bg: C.bg, fg: C.head },
  ];

  const receiptsOf = (t) => (t?.installments || []).filter((i) => i.status === "paid");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.white, position: "relative" }}>
      <StageBar stage={stage} setStage={setStage} />

      <div className="hide-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: "auto", background: C.white }}>
        <div style={{ height: 14 }} />

        {stage === "lead" && leadTrip && (
          <>
            <LeadCard
              trip={leadTrip}
              consultant={consultantProfiles.v1}
              travellers={party}
              on={{
                open: () => go(leadTrip.link),
                share: () => shareTrip(leadTrip.dest),
                download: () => download(`${leadTrip.dest}-itinerary-v${leadTrip.version}.pdf`),
                travellers: openInvite,
                invite: () => {
                  const waiting = party.find((x) => !x.joined);
                  if (waiting) window.open(waLink(waiting.phone, `I have started planning our ${leadTrip.dest} trip on 30 Sundays. Get the app and you will see the whole itinerary.`), "_blank");
                },
                call: () => go("/chat"),
                chat: () => go("/chat"),
              }}
            />
            <LabToggle testid="toggle-party" onClick={() => setPartyIdx((i) => (i + 1) % PARTY.length)}>
              {party.length ? `Showing ${party.length} travellers` : "Showing no co-travellers"}
            </LabToggle>
          </>
        )}

        {stage === "pretrip" && upcoming && (
          <>
            <UpcomingCard
              trip={paidOff ? { ...upcoming, paid: upcoming.total, next: null } : upcoming}
              on={{
                open: () => go(`/trips/${upcoming.raw.id}`),
                pay: () => go(`/trips/${upcoming.raw.id}/payments`),
                download: () => download(`${upcoming.dest}-itinerary.pdf`),
                share: () => shareTrip(upcoming.dest),
                docs: () => go(`/trips/${upcoming.raw.id}/documents`),
                receipts: () => setSheet("receipts"),
                travellers: openInvite,
                chat: () => go("/chat"),
              }}
            />
            <LabToggle testid="toggle-paid" onClick={() => setPaidOff((v) => !v)}>
              {paidOff ? "Showing fully paid" : "Showing a payment pending"}
            </LabToggle>
          </>
        )}

        {stage === "ontrip" && today && (
          <>
            <OnTripCard
              trip={today}
              on={{
                open: () => go(`/trips/${onTrip.id}/booked-itinerary`),
                share: () => shareTrip(today.dest),
                download: () => download(`${today.dest}-itinerary.pdf`),
                voucher: () => download(`${today.hotel?.name || "hotel"}-voucher.pdf`),
                ticket: () => download(`${today.flight?.pnr || "flight"}-ticket.pdf`),
                receipts: () => setSheet("receipts"),
                chat: () => go("/chat"),
                whatsapp: () => window.open(waLink(onTrip.consultant?.phone, "Hi, we are on the trip and need some help."), "_blank"),
                call: () => say(`Calling the ground team on ${onTrip.consultant?.phone}`),
              }}
            />
            {/* Step through the week to see the days that have a flight, the
                days that change hotel, and the last day that has neither. */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "12px 16px 0" }}>
              <span style={{ fontSize: 11, color: C.inact, fontWeight: 600 }}>Day</span>
              {onTrip.itineraryDays.map((_, i) => {
                const n = i + 1;
                const on = n === dayNo;
                return (
                  <button
                    key={n}
                    data-testid={`day-${n}`}
                    onClick={() => setDayNo(n)}
                    style={{
                      width: 26, height: 26, borderRadius: 9, cursor: "pointer", fontFamily: "inherit",
                      border: `1px solid ${on ? "#027A48" : C.div}`, background: on ? "#027A48" : C.white,
                      color: on ? "#fff" : C.sub, fontSize: 11.5, fontWeight: 700,
                    }}
                  >{n}</button>
                );
              })}
            </div>
          </>
        )}

        <BelowTheCard />
      </div>

      {/* ── Sheets. Everything the card starts, it finishes here. ── */}
      {sheet === "share" && (
        <Sheet title="Share this trip" sub="Your plan opens read-only for whoever you send it to." onClose={() => setSheet(null)}>
          {shareOptions.map((o) => (
            <SheetRow
              key={o.label}
              icon={o.wa ? () => <WhatsAppIcon size={17} color="#25D366" /> : o.icon}
              iconBg={o.bg}
              iconFg={o.fg}
              title={o.label}
              sub={o.sub}
              onClick={() => { setSheet(null); say(o.label === "Copy link" ? "Link copied" : `Opening ${o.label}`); }}
              right={o.label === "Copy link" ? <Copy size={16} color={C.inact} /> : null}
            />
          ))}
        </Sheet>
      )}

      {sheet === "receipts" && (
        <Sheet
          title="Payment receipts"
          sub={`${receiptsOf(upcoming?.raw).length} payments received so far.`}
          onClose={() => setSheet(null)}
        >
          {receiptsOf(upcoming?.raw).map((i) => (
            <SheetRow
              key={i.id}
              icon={Receipt}
              iconBg="#ECFDF3"
              iconFg="#027A48"
              title={`${inr(i.amount)} · ${i.label}`}
              sub={`Paid on ${i.date}`}
              right={
                <button
                  aria-label={`Download receipt for ${i.label}`}
                  onClick={() => { setSheet(null); download(`receipt-${i.id}.pdf`); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.div}`,
                    background: C.white, borderRadius: 9, padding: "7px 11px", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 11.5, fontWeight: 700, color: C.head,
                  }}
                >
                  <Download size={13} color={C.sub} /> PDF
                </button>
              }
            />
          ))}
        </Sheet>
      )}

      {/* The itinerary screen's co-traveller flow, opened from the card. Same
          manage sheet, same add guest, same contacts picker, same removal. */}
      <InvitePartnerSection
        key={partyIdx}
        destination={stage === "lead" ? (leadTrip?.dest || "trip") : (upcoming?.dest || "trip")}
        hideEntry
        openKey={inviteKey}
        initialPartners={seeded}
        onPartnersChange={setGuests}
      />

      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}
