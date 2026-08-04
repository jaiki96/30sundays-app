import { useState } from "react";
import { Phone } from "lucide-react";
import { C } from "../../data";
import Sheet, { PrimaryButton } from "./Sheet";
import { useAIPhotos } from "../../state/useAIPhotos";

// Stand-in for the real phone and OTP flow. It exists only to prove the intent
// is preserved: finishing here lands on the upload sheet, not back on home.
export default function MockLoginSheet() {
  const { sheet, setSheet, onLoginCompleted } = useAIPhotos();
  const open = sheet === "login";
  const [phone, setPhone] = useState("");
  const ready = phone.replace(/\D/g, "").length >= 10;

  return (
    <Sheet
      open={open}
      onClose={() => setSheet(null)}
      title="First, who are you?"
      sub="We'll keep your photo tied to your account, private to you two."
      footer={
        <PrimaryButton disabled={!ready} onClick={() => { setPhone(""); onLoginCompleted(); }}>
          Continue
        </PrimaryButton>
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${C.div}`, borderRadius: 12, padding: "0 14px", minHeight: 52 }}>
        <Phone size={16} color={C.sub} />
        <span style={{ fontSize: 15, fontWeight: 600, color: C.head }}>+91</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="numeric"
          placeholder="Phone number"
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", color: C.head, background: "transparent" }}
        />
      </div>
      <p style={{ fontSize: 11.5, color: C.inact, margin: "10px 2px 0", lineHeight: "16px" }}>
        Prototype only. Any 10 digit number works and no code is sent.
      </p>
    </Sheet>
  );
}
