import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { C } from "../data";
import { BRAND, RAMP, FONT } from "../data/brand";
import { consultantProfiles } from "../data/consultants";
import { VARIANTS } from "../components/consultant_lab/variants";
import TravelConsultantSection from "../components/TravelConsultantSection";

// ─── Your travel consultant, four ways ───
//
// All four on one scroll, over the same consultant, with the shipped card at
// the top for comparison. Every one of them opens the real team lead sheet, so
// the drawn portrait that replaced the initials can be checked on all of them.
//
// The profile switch is here rather than inside each card: the section has
// always had two states, one for a consultant with a record of their own and
// one for a consultant too new to have one, and a variant only earns its place
// if it holds both.

export default function ConsultantLab() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState("v1");
  const consultant = consultantProfiles[profile];

  const chip = (on) => ({
    padding: "6px 13px", borderRadius: 999, border: `1px solid ${on ? BRAND.sunsetFuchsia : RAMP.coastalMist[600]}`,
    background: on ? RAMP.sunsetFuchsia[50] : C.white,
    color: on ? RAMP.sunsetFuchsia[800] : RAMP.tropicalForest[200],
    fontSize: 12, fontWeight: on ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
  });

  return (
    <div style={{
      position: "absolute", inset: 0, overflowY: "auto",
      background: C.white, fontFamily: FONT.primary,
    }} className="hide-scrollbar">
      <div style={{
        position: "sticky", top: 0, zIndex: 10, background: C.white,
        borderBottom: `1px solid ${RAMP.coastalMist[500]}`, padding: "12px 16px 11px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            style={{ border: "none", background: "none", padding: 0, cursor: "pointer", display: "flex" }}
          >
            <ArrowLeft size={19} color={BRAND.tropicalForest} />
          </button>
          <p style={{ margin: 0, flex: 1, fontSize: 15.5, fontWeight: 700, color: BRAND.tropicalForest }}>
            Travel consultant
          </p>
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
          <button onClick={() => setProfile("v1")} style={chip(profile === "v1")}>2,000 trips</button>
          <button onClick={() => setProfile("v2")} style={chip(profile === "v2")}>42 trips</button>
        </div>
      </div>

      <Block
        title="Shipped today"
        note="Poppins at 600 where the page sets 700, a centred stat band and a tinted quote box that appear nowhere else, 339px tall."
        tone="warn"
      >
        <TravelConsultantSection consultant={consultant} />
      </Block>

      {VARIANTS.map(({ key, title, note, Comp }) => (
        <Block key={key} title={title} note={note}>
          <Comp consultant={consultant} />
        </Block>
      ))}

      <div style={{ height: 40 }} />
    </div>
  );
}

function Block({ title, note, tone, children }) {
  return (
    <div style={{ borderBottom: `6px solid ${RAMP.coastalMist[200]}`, padding: "18px 0 22px" }}>
      <div style={{ padding: "0 16px 14px" }}>
        <p style={{
          margin: 0, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase",
          color: tone === "warn" ? RAMP.goldenHour[800] : RAMP.lagoonBliss[900],
        }}>{title}</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: "17px", color: RAMP.tropicalForest[200] }}>{note}</p>
      </div>
      {children}
    </div>
  );
}
