import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus, Users, ShieldCheck, Info, MessagesSquare, Lock, AlertTriangle, ImagePlus,
  X as XIcon, ChevronRight,
} from "lucide-react";
import { C } from "../data";
import { useCommunity } from "../state/useCommunity";
import {
  getDest, GUIDELINES, PEOPLE, checkPost, ago, track, COHORT_THRESHOLD,
} from "../data/communityData";
import { Screen, Body, Primary, Secondary, Sheet, Field, Input, Textarea } from "../components/Gift/GiftUI";
import {
  PAD, PinnedRow, QuestionCard, Banner, Toast, Hero, GlassPill,
  SectionBar, SectionHead, AvatarStack, ActionBar,
} from "../components/Community/CommunityUI";

// The Q&A feed is where Community starts. Photo first, then the group, then
// the questions, the same shape the itinerary screen uses.

const FACES = [PEOPLE.riya, PEOPLE.neha, PEOPLE.meera, PEOPLE.tara];

export default function CommunityFeed() {
  const { dest = "bali" } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const view = params.get("state");

  const { questionsFor, answersFor, welcomeSeen, seeWelcome } = useCommunity();
  const [ask, setAsk] = useState(false);
  const [toast, setToast] = useState(null);

  const d = getDest(dest);
  const all = questionsFor(dest);
  const questions = view === "empty" ? [] : all;
  const loading = view === "loading";
  const open = d.cohort.state === "open";

  return (
    <Screen>
      <Body>
        <Hero
          image={d.hero}
          kicker="Community"
          title={d.name}
          sub={`You both go in ${d.month}`}
          onBack={() => navigate("/community")}
          pill={open ? (
            <GlassPill icon={Users} onClick={() => navigate(`/community/${dest}/chat`)}>
              {d.cohort.members} couples going with you
            </GlassPill>
          ) : null}
        />

        {loading ? <FeedSkeleton /> : (
          <div style={{ paddingBottom: 24 }}>
            <div style={{ height: 18 }} />

            {!welcomeSeen[dest] && (
              <Banner
                title="Welcome, you two"
                body="Ask anything about your trip. Answers come from our team and from couples who have already been."
                onDismiss={() => seeWelcome(dest)}
              />
            )}

            <div style={{ padding: `0 ${PAD}px` }}>
              <CohortCard d={d} onOpen={() => navigate(`/community/${dest}/chat`)} />
            </div>

            <SectionBar />

            <div style={{ padding: `0 ${PAD}px` }}>
              <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden" }}>
                <PinnedRow
                  icon={ShieldCheck} locked
                  title="Community guidelines"
                  desc={`${GUIDELINES.length} short rules, worth a minute`}
                  onClick={() => navigate(`/community/${dest}/guidelines`)}
                />
                <PinnedRow
                  icon={Info}
                  title={`About ${d.name} questions`}
                  desc={d.about}
                  onClick={() => setToast("Pinned by our team")}
                />
              </div>
            </div>

            <SectionBar />

            <SectionHead right={questions.length ? `${questions.length} in total` : null}>
              Questions
            </SectionHead>

            {questions.length === 0 ? (
              <EmptyFeed name={d.name} onAsk={() => setAsk(true)} />
            ) : (
              <div style={{ padding: `0 ${PAD}px`, display: "flex", flexDirection: "column", gap: 8 }}>
                {questions.map(q => (
                  <QuestionCard
                    key={q.id} q={q}
                    answerCount={answersFor(q).length}
                    solved={!!q.acceptedId}
                    onClick={() => navigate(`/community/${dest}/q/${q.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Body>

      {!loading && (
        <ActionBar
          title={questions.length ? `${questions.length} questions` : "Nothing asked yet"}
          caption={open ? `${d.cohort.members} couples going in ${d.month.split(" ")[0]}` : d.month}
          label="Ask" icon={Plus}
          onClick={() => setAsk(true)}
        />
      )}

      {ask && (
        <AskSheet dest={dest} destName={d.name} onClose={() => setAsk(false)}
          onPosted={(q) => { setAsk(false); navigate(`/community/${dest}/q/${q.id}`); }} />
      )}
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </Screen>
  );
}

/* ─────────────────────── The cohort card ─────────────────────── */

function CohortCard({ d, onOpen }) {
  const { state, members, lastActiveMins, closedOn } = d.cohort;

  // Not enough couples yet. Say so plainly rather than open an empty room.
  if (state === "below") {
    return (
      <div style={{
        border: `1px dashed ${C.div}`, borderRadius: 16, padding: 16, background: C.bg,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, background: C.white, flexShrink: 0,
          display: "grid", placeItems: "center", border: `1px solid ${C.div}`,
        }}><Users size={19} color={C.inact} /></span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.head, margin: 0, letterSpacing: "-0.1px" }}>
            No group for {d.month} yet
          </p>
          <p style={{ fontSize: 13, color: C.sub, margin: "4px 0 0", lineHeight: "19px" }}>
            {members} of you are going that month. We open the group at {COHORT_THRESHOLD}, so it
            is worth looking again. Questions below are answered either way.
          </p>
        </div>
      </div>
    );
  }

  // The month has been and gone. Readable, but nobody is talking any more.
  if (state === "closed") {
    return (
      <button onClick={onOpen} style={{
        width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", minHeight: 48,
        border: `1px solid ${C.div}`, borderRadius: 16, padding: 16, background: C.white,
        display: "flex", gap: 12, alignItems: "center",
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, background: C.bg, flexShrink: 0,
          display: "grid", placeItems: "center",
        }}><Lock size={18} color={C.inact} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: C.head }}>
            {d.name}, {d.month}
          </span>
          <span style={{ display: "block", fontSize: 13, color: C.sub, marginTop: 2 }}>
            Closed on {closedOn}. You can still read it.
          </span>
        </span>
        <ChevronRight size={17} color={C.inact} />
      </button>
    );
  }

  return (
    <button onClick={onOpen} style={{
      width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
      border: `1px solid ${C.p300}`, borderRadius: 16, padding: 16, background: C.white,
      boxShadow: "0 4px 18px rgba(227,27,83,0.09)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <MessagesSquare size={17} color={C.p600} />
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase",
          color: C.p600, flex: 1,
        }}>Your group</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.sub }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#12B76A" }} />
          active {ago(lastActiveMins)} ago
        </span>
      </div>

      <p style={{ fontSize: 18, fontWeight: 700, color: C.head, margin: "10px 0 0", letterSpacing: "-0.3px" }}>
        {d.name}, {d.month}
      </p>
      <p style={{ fontSize: 13, color: C.sub, margin: "4px 0 0", lineHeight: "19px" }}>
        Everyone going the same month as you two, in one place.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <AvatarStack people={FACES} extra={members - FACES.length} />
        <span style={{ flex: 1, fontSize: 12.5, color: C.sub }}>{members} couples</span>
        <span style={{
          flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
          padding: "9px 16px", borderRadius: 999, background: C.p600,
          color: "#fff", fontSize: 13.5, fontWeight: 700,
        }}>Open chat <ChevronRight size={14} /></span>
      </div>
    </button>
  );
}

/* ─────────────────────── Empty and loading ─────────────────────── */

function EmptyFeed({ name, onAsk }) {
  return (
    <div style={{ textAlign: "center", padding: `28px ${PAD}px 12px` }}>
      <span style={{
        width: 56, height: 56, borderRadius: "50%", background: C.p100,
        display: "grid", placeItems: "center", margin: "0 auto 14px",
      }}><MessagesSquare size={25} color={C.p600} /></span>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: C.head, margin: "0 0 6px" }}>
        Nobody has asked yet
      </h3>
      <p style={{ fontSize: 13.5, color: C.sub, margin: "0 0 18px", lineHeight: "19px" }}>
        Be the first. Whatever you two are wondering about {name}, another couple is
        wondering it as well.
      </p>
      <Secondary onClick={onAsk}>Ask the first question</Secondary>
    </div>
  );
}

function FeedSkeleton() {
  const bar = (w, h = 12) => (
    <div style={{ width: w, height: h, borderRadius: 6, background: C.div, animation: "pulse 1.4s ease-in-out infinite" }} />
  );
  return (
    <div style={{ padding: `18px ${PAD}px` }}>
      <div style={{
        border: `1px solid ${C.div}`, borderRadius: 16, padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {bar("38%", 11)}
        {bar("62%", 18)}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.div }} />
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.div, marginLeft: -18 }} />
          {bar("30%")}
        </div>
      </div>
      <div style={{ height: 6, background: C.bg, margin: "20px -16px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            border: `1px solid ${C.div}`, borderRadius: 14, padding: 14,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {bar(i % 2 ? "70%" : "88%", 15)}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.div }} />
              {bar("34%")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Ask a question ─────────────────────── */

export function AskSheet({ dest, destName, onClose, onPosted }) {
  const { askQuestion, addStrike } = useCommunity();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flag, setFlag] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);

  const ready = title.trim().length > 4 && body.trim().length > 4;

  const submit = () => {
    const hit = checkPost(`${title} ${body}`);
    if (hit) {
      const n = addStrike();
      track("community_post_flagged", { rule: hit.id, offence: n });
      if (n >= 2) setBlocked(hit); else setFlag(hit);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      // A failure is one toggle away, so the state can be shown on demand.
      if (window.__communityFailNext) { window.__communityFailNext = false; setFailed(true); return; }
      onPosted(askQuestion({ dest, title, body, image }));
    }, 700);
  };

  if (blocked) return <BlockedSheet rule={blocked} onClose={onClose} />;
  if (flag) return <FlaggedSheet rule={flag} onEdit={() => setFlag(null)} onClose={onClose} />;

  return (
    <Sheet
      title="Ask a question"
      sub={`Everyone going to ${destName}, and everyone who has been, can answer.`}
      onClose={onClose}
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Primary onClick={submit} disabled={!ready || busy}>{busy ? "Posting..." : "Post question"}</Primary>
          <Secondary onClick={onClose}>Cancel</Secondary>
        </div>
      }
    >
      {failed && <FailedNote onRetry={() => { setFailed(false); submit(); }} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
          background: C.bg, borderRadius: 12,
        }}>
          <span style={{ fontSize: 12.5, color: C.sub }}>Destination</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.head, flex: 1 }}>{destName}</span>
          <Lock size={13} color={C.inact} />
        </div>

        <Field label="What do you both want to know">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={90}
            placeholder="How bad is the drive to Ubud in the evening?" />
        </Field>
        <Field label="Any detail that helps" hint="The more you give, the better the answers.">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={500}
            placeholder="We land at 7pm and our first two nights are in Ubud..." />
        </Field>

        <ImageAttach image={image} setImage={setImage} />
      </div>
    </Sheet>
  );
}

/* ─────────────────────── Shared composer bits ─────────────────────── */

export function ImageAttach({ image, setImage }) {
  const [id] = useState(() => `att_${Math.random().toString(36).slice(2, 8)}`);
  if (image) {
    return (
      <div style={{ position: "relative", width: 84 }}>
        <img src={image} alt="" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 12, display: "block" }} />
        <button onClick={() => setImage(null)} aria-label="Remove photo" style={{
          position: "absolute", top: -7, right: -7, width: 24, height: 24, borderRadius: "50%",
          background: C.head, border: "none", cursor: "pointer", display: "grid", placeItems: "center",
        }}><XIcon size={13} color="#fff" /></button>
      </div>
    );
  }
  return (
    <>
      <label htmlFor={id} style={{
        display: "inline-flex", alignItems: "center", gap: 8, minHeight: 48, padding: "0 14px",
        borderRadius: 999, border: `1px dashed ${C.p300}`, cursor: "pointer", alignSelf: "flex-start",
        fontSize: 13, fontWeight: 600, color: C.p600,
      }}>
        <ImagePlus size={16} /> Add a photo
        <span style={{ color: C.inact, fontWeight: 500 }}>optional</span>
      </label>
      <input id={id} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => setImage(r.result);
          r.readAsDataURL(f);
        }} />
    </>
  );
}

export function FailedNote({ onRetry }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "12px 14px", borderRadius: 12, marginBottom: 14,
      background: "#FEF3F2", border: "1px solid #F3C4C0",
    }}>
      <AlertTriangle size={16} color="#B42318" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#B42318", margin: 0 }}>That did not go up</p>
        <p style={{ fontSize: 13, color: "#B42318", margin: "3px 0 0", lineHeight: "18px" }}>
          Your words are still here. Check your connection and try once more.
        </p>
        <button onClick={onRetry} style={{
          marginTop: 8, minHeight: 36, padding: "0 14px", borderRadius: 9, cursor: "pointer",
          fontFamily: "inherit", border: "1px solid #B42318", background: "transparent",
          fontSize: 13, fontWeight: 700, color: "#B42318",
        }}>Try again</button>
      </div>
    </div>
  );
}

/* ─────────────────────── Moderation ─────────────────────── */

// First offence. Firm about the rule, warm about the person, and the way out
// is to edit rather than to start again.
export function FlaggedSheet({ rule, onEdit, onClose }) {
  return (
    <Sheet
      title="One thing before this goes up"
      onClose={onClose}
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Primary onClick={onEdit}>Edit the post</Primary>
          <Secondary onClick={onClose}>Cancel</Secondary>
        </div>
      }
    >
      <div style={{ display: "flex", gap: 12 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, background: "#FFFAEB", flexShrink: 0,
          display: "grid", placeItems: "center",
        }}><AlertTriangle size={19} color="#B54708" /></span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0, lineHeight: "21px" }}>
            {rule.what}
          </p>
          <p style={{ fontSize: 14, color: C.sub, margin: "8px 0 0", lineHeight: "21px" }}>
            {rule.why}
          </p>
          <p style={{ fontSize: 13.5, color: C.sub, margin: "12px 0 0", lineHeight: "20px" }}>
            Take that bit out and it goes straight up. Nothing else you wrote is lost.
          </p>
        </div>
      </div>
    </Sheet>
  );
}

// Second offence. The post does not go up and a person picks it up from here.
export function BlockedSheet({ rule, onClose }) {
  return (
    <Sheet
      title="We have held this one back"
      onClose={onClose}
      footer={<Primary onClick={onClose}>Close</Primary>}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, background: "#FEF3F2", flexShrink: 0,
          display: "grid", placeItems: "center",
        }}><Lock size={19} color="#B42318" /></span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: C.head, margin: 0, lineHeight: "21px" }}>
            {rule.what} This is the second time, so the post has not gone up.
          </p>
          <p style={{ fontSize: 14, color: C.sub, margin: "8px 0 0", lineHeight: "21px" }}>
            Someone on our team will take a look and get back to you both. Nothing else
            about your trip is affected, and you can carry on reading the feed.
          </p>
        </div>
      </div>
    </Sheet>
  );
}
