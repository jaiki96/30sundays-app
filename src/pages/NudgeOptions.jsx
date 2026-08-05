import { Sparkles, ChevronRight, ArrowRight, X as XIcon, Plus, ImagePlus } from "lucide-react";
import { C, customerPhotos, destData } from "../data";
import { COPY } from "../data/aiPhotosData";

// Review page only. Nothing here is wired to the feature and nothing on the
// live prototype changes. Each option is the real size it would be on the
// home screen, so the vertical cost is honest.

const PAD = 18;

const BALI = customerPhotos.Bali || [];
const THAI = customerPhotos.Thailand || [];
const MALD = customerPhotos.Maldives || [];

function Section({ letter, title, blurb, cost, children }) {
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: `0 ${PAD}px` }}>
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: ".5px", color: C.p600,
          background: C.p100, borderRadius: 6, padding: "3px 7px",
        }}>{letter}</span>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.head, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: `6px ${PAD}px 12px` }}>{blurb}</p>

      <div style={{ background: C.bg, padding: "14px 0", borderTop: `1px solid ${C.div}`, borderBottom: `1px solid ${C.div}` }}>
        {children}
      </div>

      <p style={{ fontSize: 11.5, color: C.inact, margin: `8px ${PAD}px 0` }}>Height on the home screen: {cost}</p>
    </div>
  );
}

// Shared card shell so every option sits in the same place on the page.
function Card({ children, style }) {
  return (
    <div style={{
      margin: `0 ${PAD}px`, background: C.white, border: `1px solid ${C.div}`,
      borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 18px rgba(137,18,62,0.07)", ...style,
    }}>
      {children}
    </div>
  );
}

function Dismiss() {
  return (
    <button style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
      <XIcon size={15} color={C.inact} />
    </button>
  );
}

/* ── Current ── */
function Current() {
  return (
    <div style={{ padding: `0 ${PAD}px` }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: `linear-gradient(135deg, ${C.p100} 0%, #fff 100%)`,
        border: `1px solid ${C.p100}`, borderRadius: 16, padding: "12px 12px 12px 14px",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 6px rgba(137,18,62,0.12)" }}>
          <Sparkles size={18} color={C.p600} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 14, fontWeight: 700, color: C.head, margin: 0 }}>
            {COPY.nudgeTitle}<ChevronRight size={16} color={C.p600} />
          </p>
          <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0", lineHeight: "16px" }}>{COPY.nudgeSub}</p>
        </div>
        <Dismiss />
      </div>
    </div>
  );
}

/* ── A. Before and after ── */
function OptionA() {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 10px 12px 12px" }}>
        {/* A tight square reads as something off their camera roll. */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={BALI[9]} alt="" style={{ width: 56, height: 72, borderRadius: 9, objectFit: "cover", objectPosition: "50% 30%", filter: "saturate(0.5)", transform: "scale(1)" }} />
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, fontSize: 8, fontWeight: 700, letterSpacing: ".3px", color: "#fff", background: "rgba(0,0,0,0.6)", textAlign: "center", padding: "2px 0", borderRadius: "0 0 9px 9px" }}>
            YOURS
          </span>
        </div>

        <ArrowRight size={15} color={C.p600} style={{ flexShrink: 0 }} />

        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={BALI[3]} alt="" style={{ width: 56, height: 72, borderRadius: 9, objectFit: "cover" }} />
          <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, fontSize: 8, fontWeight: 700, letterSpacing: ".3px", color: "#fff", background: "rgba(0,0,0,0.6)", textAlign: "center", padding: "2px 0", borderRadius: "0 0 9px 9px" }}>
            IN BALI
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingLeft: 3 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.head, margin: 0, lineHeight: "18px", letterSpacing: "-0.2px" }}>
            See you two there
          </p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 12.5, fontWeight: 700, color: C.p600, marginTop: 5 }}>
            Add a photo <ChevronRight size={13} color={C.p600} />
          </span>
        </div>
        <Dismiss />
      </div>
    </Card>
  );
}

/* ── B. Photo stack ── */
function OptionB() {
  const stack = [
    { src: MALD[1], rot: -9, x: 0, z: 1 },
    { src: THAI[2], rot: 3, x: 27, z: 2 },
    { src: BALI[0], rot: -2, x: 54, z: 3 },
  ];
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 12px" }}>
        <div style={{ position: "relative", width: 116, height: 78, flexShrink: 0 }}>
          {stack.map((s, i) => (
            <img key={i} src={s.src} alt="" style={{
              position: "absolute", top: 4, left: s.x, width: 58, height: 70,
              borderRadius: 9, objectFit: "cover", zIndex: s.z,
              transform: `rotate(${s.rot}deg)`,
              border: "2.5px solid #fff", boxShadow: "0 2px 10px rgba(0,0,0,0.16)",
            }} />
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0, lineHeight: "19px", letterSpacing: "-0.2px" }}>
            You two, somewhere new each day
          </p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 700, color: C.p600, marginTop: 6 }}>
            Add a photo <ChevronRight size={14} color={C.p600} />
          </span>
        </div>
        <Dismiss />
      </div>
    </Card>
  );
}

/* ── C. Wide image card ── */
function OptionC() {
  return (
    <Card style={{ position: "relative" }}>
      <div style={{ position: "relative", height: 168 }}>
        <img src={BALI[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)" }} />

        <button style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <XIcon size={14} color="#fff" />
        </button>

        <div style={{ position: "absolute", left: 14, right: 14, bottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", margin: 0 }}>
            This could be you two
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginTop: 4 }}>
            <h4 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
              Add one photo
            </h4>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.p600, color: "#fff", fontSize: 12.5, fontWeight: 700, borderRadius: 999, padding: "8px 13px", flexShrink: 0 }}>
              <ImagePlus size={14} /> Start
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── D. Inside the hero ── */
function OptionD() {
  return (
    <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
      <img src={BALI[0]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)" }} />

      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 40 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "4px 9px", backdropFilter: "blur(6px)" }}>
          <Sparkles size={11} color="#fff" />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".4px", color: "#fff" }}>THIS COULD BE YOU TWO</span>
        </span>
        <h4 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: "9px 0 0", letterSpacing: "-0.5px", textShadow: "0 2px 14px rgba(0,0,0,0.4)" }}>
          Add one photo of you two
        </h4>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12,
          background: C.p600, color: "#fff", border: "none", borderRadius: 999,
          padding: "11px 18px", fontSize: 14, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
          boxShadow: "0 6px 20px rgba(227,27,83,0.4)",
        }}>
          <Plus size={15} /> Add our photo
        </button>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, display: "flex", justifyContent: "center", gap: 5 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 3, background: i === 0 ? "#fff" : "rgba(255,255,255,0.45)" }} />
        ))}
      </div>
    </div>
  );
}

const NOTES = [
  ["Two floating buttons at once", "The reviewer button and the \"Already in touch with our team?\" banner both sit over the content, and over each other. The reviewer button is ours and goes away in the real build, but the banner still lands on top of the invitation."],
  ["Two persuasion blocks in a row", "The invitation sits directly above \"Couples only / Transparent pricing / No tourist traps\". Both ask for belief at the same moment, so neither gets read."],
  ["The hook starts low", "Destination circles push the hero down. On this screen the hero is the strongest thing we have."],
];

export default function NudgeOptions() {
  return (
    <div className="hide-scrollbar" style={{ height: "100%", overflowY: "auto", background: C.white }}>
      <div style={{ padding: `18px ${PAD}px 4px` }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.head, margin: 0, letterSpacing: "-0.5px" }}>
          Making the invitation image first
        </h1>
        <p style={{ fontSize: 13, color: C.sub, lineHeight: "19px", margin: "8px 0 0" }}>
          Four options, each at its real size. Nothing here is live and the
          prototype is unchanged. Pick one and I'll build it.
        </p>
      </div>

      <div style={{ height: 20 }} />

      <Section
        letter="Now"
        title="What is there today"
        blurb="An icon, a headline and a subline. It explains the feature in words, so it has to be read before it lands."
        cost="about 70px"
      >
        <Current />
      </Section>

      <Section
        letter="A"
        title="Before and after"
        blurb="An ordinary photo, an arrow, then the same couple in Bali. This is what Lensa and Remini lead with, because the whole idea lands in one glance with no reading. Clearest about what we want from them."
        cost="about 100px"
      >
        <OptionA />
      </Section>

      <Section
        letter="B"
        title="Photo stack"
        blurb="Three couples in three places, tilted like prints. Sells the variety and the daily habit better than A, but does not show that they put a photo in."
        cost="about 105px"
      >
        <OptionB />
      </Section>

      <Section
        letter="C"
        title="Wide image card"
        blurb="One big image, text sitting on it, a coral pill to start. Strongest pull of the three cards. Costs the most room and starts to compete with the hero right above it."
        cost="about 170px"
      >
        <OptionC />
      </Section>

      <Section
        letter="D"
        title="Inside the hero, no strip at all"
        blurb="The invitation becomes the first slide of the hero carousel. Adds no height, removes a block from the screen, and puts the idea in the biggest space we have. Their generated image later takes this same slot, so the before and after is the screen itself. My pick."
        cost="zero, it replaces a slide"
      >
        <OptionD />
      </Section>

      <div style={{ padding: `4px ${PAD}px 0` }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: "0 0 4px" }}>What else is crowding this screen</h2>
        <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "0 0 14px" }}>
          Separate from the invitation. Worth deciding on either way.
        </p>
        {NOTES.map(([t, b], i) => (
          <div key={t} style={{ display: "flex", gap: 11, padding: "12px 0", borderTop: i === 0 ? "none" : `1px solid ${C.div}` }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.p100, color: C.p600, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </span>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>{t}</p>
              <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "3px 0 0" }}>{b}</p>
            </div>
          </div>
        ))}

        <div style={{ background: C.p100, borderRadius: 14, padding: "14px 15px", margin: "14px 0 0" }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: C.head, margin: 0 }}>What I would do</p>
          <p style={{ fontSize: 12.5, color: C.sub, lineHeight: "18px", margin: "5px 0 0" }}>
            Take D, so the invitation costs nothing and nothing new sits under
            the hero. Then move the trust row below the first section, so the
            hero and the invitation get the top of the screen to themselves.
          </p>
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}
