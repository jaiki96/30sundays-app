import { LogIn, LogOut, Check } from "lucide-react";
import { C } from "../../data";
import { Section } from "./kit";
import { R, SHADOW, T, A } from "./tokens";

// ─── Check-in and check-out, in one card, with no heading ───
//
// Two changes from the four-row version.
//
// The section heading is gone. The card labels its own columns CHECK-IN and
// CHECK-OUT, so a heading above saying "Check-in and check-out" put the same
// two words on screen twice within 40px. Of the two, the column labels are the
// ones doing work: they say which column is which, and the arrows alone would
// not. The heading only named what the labels already named.
//
// And the card no longer announces what you do not get. "No late check-out"
// was the only negative on it, so the grey dash pulled harder than the green
// tick beside it, and it created a disappointment nobody arrived with. It was
// not even true: late check-out is usually buyable, and the policy sheet says
// so. Absence is now communicated by absence, the way the amenity list already
// works. The band at the bottom lists what is included and disappears when
// nothing is.

function Column({ Ico, label, time }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: "14px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Ico size={13} color={C.inact} strokeWidth={2.2} style={{ flexShrink: 0 }} />
        <span style={{ ...T.eyebrow, color: C.inact }}>{label}</span>
      </div>
      <p style={{
        margin: "7px 0 0", fontSize: 18, fontWeight: 800, color: C.head, letterSpacing: "-0.3px",
      }}>{time}</p>
    </div>
  );
}

export default function StayBasicsCrisp({ hotel }) {
  const b = hotel.stayBasics;
  const included = [
    b.earlyCheckIn.included && "Early check-in included",
    b.lateCheckOut.included && "Late check-out included",
  ].filter(Boolean);

  return (
    <Section>
      <div style={{
        background: C.white, borderRadius: R.card, border: `1px solid ${C.div}`,
        boxShadow: SHADOW.card, overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <Column Ico={LogIn} label="Check-in" time={b.checkIn} />
          <div style={{ width: 1, background: C.div, flexShrink: 0 }} />
          <Column Ico={LogOut} label="Check-out" time={b.checkOut} />
        </div>

        {included.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "4px 16px",
            borderTop: `1px solid ${C.div}`, background: "#FCFCFD", padding: "10px 15px",
          }}>
            {included.map((t) => (
              <span key={t} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, fontWeight: 600, color: A.green,
              }}>
                <Check size={13} strokeWidth={3} style={{ flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
