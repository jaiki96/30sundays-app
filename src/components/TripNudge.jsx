import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plane, Heart, Star, X } from "lucide-react";
import { C, destData } from "../data";

const bgColors = {
  lead: "rgba(255, 228, 232, 0.65)",
  customer: "rgba(236, 253, 243, 0.65)",
  done: "rgba(235, 233, 254, 0.65)",
};

const borderStyle = {
  lead: "0.5px solid rgba(227, 27, 83, 0.15)",
  customer: "0.5px solid rgba(3, 152, 85, 0.15)",
  done: "0.5px solid rgba(105, 56, 239, 0.15)",
};

export default function TripNudge({ userState }) {
  const [dismissed, setDismissed] = useState(false);

  if (userState === "new" || dismissed) return null;

  const dismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  const bg = bgColors[userState];

  let content = null;

  // ─── Lead ───
  if (userState === "lead") {
    const destImg = destData.Bali?.card;
    content = (
      <>
        <img src={destImg} alt="Bali" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>Your Bali itinerary is ready</p>
          <p style={{ fontSize: 11, color: C.sub, margin: "1px 0 0" }}>7N · Ubud → Seminyak → Sanur</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.p600, margin: "3px 0 0" }}>View Itinerary →</p>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(227,27,83,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ChevronRight size={16} color={C.p600} />
        </div>
      </>
    );
  }

  // ─── Customer ───
  if (userState === "customer") {
    content = (
      <>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(3,152,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Plane size={22} color="#039855" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>Vietnam in 31 days</p>
          <p style={{ fontSize: 11, color: C.sub, margin: "1px 0 0" }}>DEL → HAN · Jun 20 · Air India</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#039855", margin: "3px 0 0" }}>3 of 5 tasks done →</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#039855", lineHeight: 1 }}>31</span>
          <span style={{ fontSize: 9, color: C.sub }}>days</span>
        </div>
      </>
    );
  }

  // ─── Trip Done ───
  if (userState === "done") {
    content = (
      <>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(105,56,239,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Heart size={22} color="#6938EF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.head, margin: 0 }}>How was Vietnam?</p>
          <p style={{ fontSize: 11, color: C.sub, margin: "1px 0 0" }}>Share your experience, help other couples</p>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#6938EF", margin: "3px 0 0" }}>Leave a review →</p>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(105,56,239,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Star size={16} color="#6938EF" />
        </div>
      </>
    );
  }

  if (!content) return null;

  const linkTo = userState === "lead" ? "/detail/1" : userState === "customer" ? "/detail/10" : "/plan";
  return (
    <Link
      to={linkTo}
      style={{
        position: "absolute",
        bottom: 90,
        left: 12,
        right: 12,
        zIndex: 10,
        borderRadius: 16,
        padding: "14px 16px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
        animation: "nudgeIn 0.4s ease-out 0.5s both",
        background: bg,
        border: borderStyle[userState],
      }}
    >
      <DismissBtn onClick={dismiss} />
      {content}
    </Link>
  );
}

function DismissBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute", top: 6, right: 8, zIndex: 2,
        width: 16, height: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}
    >
      <X size={10} color="rgba(0,0,0,0.3)" />
    </button>
  );
}
