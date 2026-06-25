import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookUser, CreditCard, Download, Plus } from "lucide-react";
import { C } from "../data";
import { getTripById, mockTrips } from "../data/tripData";

// ── Deterministic mock identity data (prototype only) ──
const hashNum = (s, len) => {
  let h = 0;
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return String(h).padStart(len, "0").slice(0, len);
};
const passportNo = (name) => `Z${hashNum(name, 7)}`;
const passportExpiry = (name) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yr = 2030 + (Number(hashNum(name, 1)) % 5);
  const m = months[Number(hashNum(name, 2)) % 12];
  return `${m} ${yr}`;
};
const panNo = (name) => {
  const letters = (String(name).replace(/[^a-z]/gi, "").toUpperCase() + "ABCDE").slice(0, 5);
  return `${letters}${hashNum(name, 4)}F`;
};

function DocRow({ title, meta, onDownload }) {
  return (
    <button
      onClick={onDownload}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        width: "100%", padding: "12px 0", background: "none", border: "none",
        cursor: "pointer", fontFamily: "inherit", textAlign: "left",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#181E4C", margin: "0 0 2px", lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
        <p style={{ fontSize: 12, color: "#666C99", margin: 0, lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meta}</p>
      </div>
      <Download size={19} color="#FD014F" strokeWidth={1.9} style={{ flexShrink: 0 }} />
    </button>
  );
}

function GroupCard({ Icon, heading, count, children }) {
  return (
    <div style={{ border: "1px solid #E0E2EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9F9FB", borderBottom: "1px solid #E0E2EB" }}>
        <Icon size={16} color="#FD014F" strokeWidth={1.9} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#181E4C" }}>{heading}</span>
        {count > 1 && <span style={{ fontSize: 11, color: "#666C99", marginLeft: "auto" }}>{count}</span>}
      </div>
      <div style={{ padding: "0 14px" }}>{children}</div>
    </div>
  );
}

export default function TravelerDocsDemo() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = getTripById(tripId) || getTripById(mockTrips.find(t => t.combinedVoucher)?.id) || mockTrips[1];
  const [toast, setToast] = useState(null);

  const travelers = [trip?.leadTraveler, ...(trip?.coTravelers || [])].filter(Boolean);
  const fire = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  return (
    <div style={{ minHeight: "100%", background: C.white, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ flexShrink: 0, padding: "44px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #E0E2EB" }}>
        <button onClick={() => navigate(-1)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F5F5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={16} color="#181E4C" />
        </button>
        <div>
          <p style={{ fontSize: 11, color: "#666C99", margin: 0 }}>{trip.tripName}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#181E4C", margin: 0 }}>Traveler Documents</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="hide-scrollbar">
        <p style={{ fontSize: 12, color: "#666C99", margin: "0 0 14px", lineHeight: "17px" }}>
          Documents you've shared with us to process your visa.
        </p>

        {/* Passport — full name, expiry */}
        <GroupCard Icon={BookUser} heading="Passport" count={travelers.length}>
          {travelers.map((t, i) => (
            <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #F0F1F5" }}>
              <DocRow
                title={t.name}
                meta={`Expires ${passportExpiry(t.name)}`}
                onDownload={() => fire(`Downloading passport: ${t.name}`)}
              />
            </div>
          ))}
        </GroupCard>

        {/* PAN — full name, PAN number */}
        <GroupCard Icon={CreditCard} heading="PAN card" count={travelers.length}>
          {travelers.map((t, i) => (
            <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #F0F1F5" }}>
              <DocRow
                title={t.name}
                meta={`PAN ${panNo(t.name)}`}
                onDownload={() => fire(`Downloading PAN: ${t.name}`)}
              />
            </div>
          ))}
        </GroupCard>

        {/* Upload more */}
        <button
          onClick={() => fire("Upload a document")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", marginTop: 4, padding: "13px 16px",
            border: "1.5px dashed #FD014F", borderRadius: 12, background: "#FFF6F9",
            fontSize: 13, fontWeight: 600, color: "#FD014F", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Plus size={16} color="#FD014F" />
          Upload more documents
        </button>

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
