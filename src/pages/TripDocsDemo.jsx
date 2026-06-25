import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, FileText, BookCheck, Plane, Hotel, Stamp, ShieldCheck,
  Receipt, Download, ChevronRight, Upload, Check, CreditCard, BookUser,
} from "lucide-react";
import { C } from "../data";
import { getTripById, mockTrips } from "../data/tripData";

// Traveller-known place names (region over airport city where it reads better)
const FLIGHT_PLACE_NAMES = {
  DPS: "Bali", LBJ: "Labuan Bajo", HKT: "Phuket", USM: "Koh Samui",
  KBV: "Krabi", MLE: "Maldives", SGN: "Ho Chi Minh City",
};
const flightPlace = (pt) => FLIGHT_PLACE_NAMES[pt?.code] || pt?.city || pt?.code;

// ── Deterministic mock identity data (prototype only) ──
const hashNum = (s, len) => {
  let h = 0;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return String(h).padStart(len, "0").slice(0, len);
};
const passportNo = (name) => `Z${hashNum(name, 7)}`;
const passportExpiry = (name) => {
  const yr = 2030 + (Number(hashNum(name, 1)) % 5);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[Number(hashNum(name, 2)) % 12];
  return `${m} ${yr}`;
};
const panNo = (name) => {
  const letters = (String(name).replace(/[^a-z]/gi, "").toUpperCase() + "ABCDE").slice(0, 5);
  return `${letters}${hashNum(name, 4)}F`;
};

// Compute a check-in date string from the trip start + day offset
const addDaysDisp = (startDisp, n) => {
  const d = new Date(startDisp);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
const firstDay = (range) => parseInt(String(range).match(/\d+/)?.[0] || "1", 10);

function buildHubGroups(trip) {
  const start = trip?.startDateDisplay || trip?.startDate;
  const end = trip?.endDateDisplay || trip?.endDate;
  const travelers = [trip?.leadTraveler, ...(trip?.coTravelers || [])].filter(Boolean);

  // Flights: City (CODE) → City (CODE) / travel date · airline
  const flights = (trip?.flights || []).map((f) => ({
    id: f.id,
    title: `${flightPlace(f.from)} (${f.from?.code}) → ${flightPlace(f.to)} (${f.to?.code})`,
    meta: [f.date, f.airline].filter(Boolean).join(" · "),
    action: "download",
  }));

  // Hotels: hotel name / check-in date · city
  const hotels = (trip?.hotels || []).map((h) => {
    const checkIn = addDaysDisp(start, firstDay(h.dayRange) - 1);
    return {
      id: h.id,
      title: h.name,
      meta: [checkIn || h.dayRange, h.city].filter(Boolean).join(" · "),
      action: "download",
    };
  });

  const visa = trip?.addOns?.visa;
  const insurance = trip?.addOns?.insurance;

  // Visa: one row per person (name)
  const visaItems = visa?.purchased
    ? travelers.map((t, i) => ({ id: `visa-${i}`, title: t.name, meta: "e-Visa document", action: "download" }))
    : [];

  // Insurance: single combined row covering all travellers
  const insuranceItems = insurance?.purchased
    ? [{
        id: "insurance",
        title: "Travel insurance policy",
        meta: travelers.map((t) => t.name).join(", "),
        action: "download",
      }]
    : [];

  const combined = trip?.combinedVoucher
    ? [{ id: "combined", title: "Combined hotel & activity voucher", meta: "Hotels + activities in one file", action: "download" }]
    : [];

  // Uploads — Passport + PAN per traveller
  const passportItems = travelers.map((t, i) => ({
    id: `pass-${i}`,
    title: t.name,
    meta: `No. ${passportNo(t.name)} · Exp ${passportExpiry(t.name)}`,
    action: i === 0 ? "uploaded" : "upload",
  }));
  const panItems = travelers.map((t, i) => ({
    id: `pan-${i}`,
    title: t.name,
    meta: `PAN ${panNo(t.name)}`,
    action: i === 0 ? "uploaded" : "upload",
  }));

  return {
    provided: [
      { key: "itinerary", heading: "Itinerary", Icon: FileText, items: [
        { id: "itinerary-pdf", title: "Trip itinerary PDF", meta: "Day-by-day plan", action: "download" },
      ]},
      { key: "activity", heading: "Activity voucher", Icon: BookCheck, items: [
        { id: "trip-voucher", title: "Complete trip voucher", meta: `${start} → ${end}`, action: "download" },
        ...combined,
      ]},
      { key: "flights", heading: "Flights", Icon: Plane, items: flights },
      { key: "hotels", heading: "Hotels", Icon: Hotel, items: hotels },
      ...(visaItems.length ? [{ key: "visa", heading: "Visa", Icon: Stamp, items: visaItems }] : []),
      ...(insuranceItems.length ? [{ key: "insurance", heading: "Insurance", Icon: ShieldCheck, items: insuranceItems }] : []),
      { key: "receipts", heading: "Payment receipts", Icon: Receipt, items: [
        { id: "receipts", title: "View all payment receipts", meta: "Invoices & installment receipts", action: "navigate" },
      ]},
    ].filter((g) => g.items.length > 0),
    uploads: [
      { key: "passport", heading: "Passport", Icon: BookUser, items: passportItems },
      { key: "pan", heading: "PAN card", Icon: CreditCard, items: panItems },
    ],
  };
}

function Row({ item, onAct }) {
  const right = {
    download: <Download size={19} color="#FD014F" strokeWidth={1.9} />,
    navigate: <ChevronRight size={19} color="#FD014F" strokeWidth={1.9} />,
    upload: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#FD014F" }}>
        <Upload size={14} color="#FD014F" /> Upload
      </span>
    ),
    uploaded: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#039855" }}>
        <Check size={14} color="#039855" /> Uploaded
      </span>
    ),
  }[item.action];

  return (
    <button
      onClick={() => onAct(item)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        width: "100%", padding: "12px 0", background: "none", border: "none",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", margin: item.meta ? "0 0 2px" : 0, lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
        {item.meta && <p style={{ fontSize: 12, color: "#666C99", margin: 0, lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.meta}</p>}
      </div>
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{right}</span>
    </button>
  );
}

function GroupCard({ g, onAct }) {
  return (
    <div style={{ border: "1px solid #E0E2EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9F9FB", borderBottom: "1px solid #E0E2EB" }}>
        <g.Icon size={16} color="#FD014F" strokeWidth={1.9} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#181E4C" }}>{g.heading}</span>
        {g.items.length > 1 && <span style={{ fontSize: 11, color: "#666C99", marginLeft: "auto" }}>{g.items.length}</span>}
      </div>
      <div style={{ padding: "0 14px" }}>
        {g.items.map((item, i) => (
          <div key={item.id} style={{ borderTop: i === 0 ? "none" : "1px solid #F0F1F5" }}>
            <Row item={item} onAct={onAct} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripDocsDemo() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = getTripById(tripId) || getTripById(mockTrips.find(t => t.combinedVoucher)?.id) || mockTrips[1];
  const [toast, setToast] = useState(null);

  const { provided, uploads } = buildHubGroups(trip);

  const onAct = (item) => {
    if (item.action === "navigate") { navigate(`/trips/${trip.id}/payments`); return; }
    if (item.action === "upload") setToast(`Upload ${item.title}`);
    else if (item.action === "uploaded") setToast(`${item.title} already uploaded`);
    else setToast(`Downloading: ${item.title}`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div style={{ minHeight: "100%", background: C.white, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ flexShrink: 0, padding: "44px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #E0E2EB" }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F5F5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={16} color="#181E4C" />
        </button>
        <div>
          <p style={{ fontSize: 11, color: "#666C99", margin: 0 }}>{trip.tripName}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#181E4C", margin: 0 }}>Trip Documents</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="hide-scrollbar">
        <p style={{ fontSize: 12, fontWeight: 600, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 10px" }}>Your travel documents</p>
        {provided.map((g) => <GroupCard key={g.key} g={g} onAct={onAct} />)}

        <div style={{ height: 1, background: "#E0E2EB", margin: "18px 0" }} />
        <p style={{ fontSize: 12, fontWeight: 600, color: "#666C99", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 4px" }}>Documents you've shared</p>
        <p style={{ fontSize: 12, color: "#666C99", margin: "0 0 10px", lineHeight: "17px" }}>Passport & PAN, used to process your visa.</p>
        {uploads.map((g) => <GroupCard key={g.key} g={g} onAct={onAct} />)}

        <div style={{ height: 24 }} />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "absolute", bottom: 28, left: 16, right: 16, background: "rgba(24,30,76,0.95)", color: "#fff", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
