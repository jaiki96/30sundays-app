import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CornerUpLeft } from "lucide-react";
import { C } from "../data";
import { useCommunity } from "../state/useCommunity";
import { ME, getDest, checkPost, track } from "../data/communityData";
import { Screen, Body, TopBar, Primary, Secondary, Sheet, Field, Textarea } from "../components/Gift/GiftUI";
import {
  PAD, CARD, AuthorLine, TripStamp, AnswerCard, PostActions, QuoteBlock, Toast,
} from "../components/Community/CommunityUI";
import { ImageAttach, FailedNote, FlaggedSheet, BlockedSheet } from "./CommunityFeed";

// One question, its answers, and a way to add another. The accepted answer is
// lifted to the top so the couple who asked gets the useful bit first.

export default function CommunityQuestion() {
  const { dest = "bali", qid } = useParams();
  const navigate = useNavigate();
  const { findQuestion, answersFor, likes, bookmarks, toggleLike, toggleBookmark } = useCommunity();

  const [compose, setCompose] = useState(null); // null | { quote }
  const [toast, setToast] = useState(null);

  const d = getDest(dest);
  const q = findQuestion(qid);
  const readOnly = d.cohort.state === "closed";

  if (!q) {
    return (
      <Screen>
        <TopBar title="Question" onBack={() => navigate(`/community/${dest}`)} />
        <Body>
          <div style={{ padding: `48px ${PAD}px`, textAlign: "center" }}>
            <p style={{ fontSize: 15, color: C.sub }}>This question is no longer here.</p>
          </div>
        </Body>
      </Screen>
    );
  }

  const answers = answersFor(q);
  const accepted = answers.find(a => a.id === q.acceptedId);
  const rest = answers.filter(a => a.id !== q.acceptedId);
  const ordered = accepted ? [accepted, ...rest] : rest;

  const copy = (label) => {
    try { navigator.clipboard?.writeText(`${window.location.origin}/community/${dest}/q/${q.id}`); } catch { /* noop */ }
    setToast(`${label} link copied`);
  };

  return (
    <Screen>
      <TopBar title="Question" sub={`${d.name}, ${d.month}`} onBack={() => navigate(`/community/${dest}`)} />

      <Body>
        <div style={{ padding: `12px ${PAD}px 24px`, display: "flex", flexDirection: "column", gap: 12 }}>

          {/* The question itself */}
          <div style={{ ...CARD, padding: 16 }}>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: C.head, margin: 0, lineHeight: "26px", letterSpacing: "-0.2px" }}>
              {q.title}
            </h1>
            <p style={{ fontSize: 14.5, color: C.head, margin: "10px 0 0", lineHeight: "22px" }}>{q.body}</p>
            {q.image && <img src={q.image} alt="" style={{ width: "100%", borderRadius: 12, marginTop: 12, display: "block" }} />}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.div}` }}>
              <AuthorLine
                author={q.mine ? { ...q.author, couple: "You both" } : q.author}
                minsAgo={q.minsAgo}
              />
            </div>
            <PostActions
              liked={!!likes[q.id]} likes={likes[q.id] ? 1 : 0} bookmarked={!!bookmarks[q.id]}
              onLike={() => toggleLike(q.id)}
              onCopy={() => copy("Question")}
              onBookmark={() => { toggleBookmark(q.id); setToast(bookmarks[q.id] ? "Removed from saved" : "Saved"); }}
              onReply={() => setCompose({ quote: null })}
            />
          </div>

          {/* Answers */}
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase",
            color: C.sub, margin: "4px 0 0",
          }}>
            {ordered.length === 0 ? "No answers yet" : `${ordered.length} ${ordered.length === 1 ? "answer" : "answers"}`}
          </p>

          {ordered.length === 0 && (
            <div style={{ ...CARD, padding: 20, textAlign: "center", background: C.bg, borderStyle: "dashed" }}>
              <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "20px" }}>
                Nobody has answered this yet. If you two know, say so.
              </p>
            </div>
          )}

          {ordered.map(a => (
            <AnswerCard
              key={a.id} answer={a} accepted={a.id === q.acceptedId}
              liked={!!likes[a.id]} bookmarked={!!bookmarks[a.id]}
              onLike={() => toggleLike(a.id)}
              onCopy={() => copy("Answer")}
              onBookmark={() => { toggleBookmark(a.id); setToast(bookmarks[a.id] ? "Removed from saved" : "Saved"); }}
              onReply={() => setCompose({ quote: { author: a.author, text: firstLine(a.body) } })}
            />
          ))}
        </div>
      </Body>

      {readOnly ? (
        <div style={{
          flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.bg,
          padding: `14px ${PAD}px calc(16px + env(safe-area-inset-bottom))`, textAlign: "center",
        }}>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>
            This destination has wrapped up. You can read it, but replies are closed.
          </p>
        </div>
      ) : (
        <div style={{
          flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.white,
          padding: `10px ${PAD}px calc(12px + env(safe-area-inset-bottom))`,
        }}>
          <button onClick={() => setCompose({ quote: null })} style={{
            width: "100%", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: C.p600, color: "#fff", fontSize: 15.5, fontWeight: 700,
          }}>
            <CornerUpLeft size={17} /> Answer this
          </button>
        </div>
      )}

      {compose && (
        <AnswerSheet
          questionId={q.id} quote={compose.quote}
          onClose={() => setCompose(null)}
          onPosted={() => { setCompose(null); setToast("Your answer is up"); }}
        />
      )}
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </Screen>
  );
}

const firstLine = (s) => {
  const t = String(s || "").trim();
  return t.length > 96 ? `${t.slice(0, 96).trim()}...` : t;
};

/* ─────────────────────── Answer composer ─────────────────────── */

function AnswerSheet({ questionId, quote, onClose, onPosted }) {
  const { postAnswer, addStrike } = useCommunity();
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flag, setFlag] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);

  const ready = body.trim().length > 4;

  const submit = () => {
    const hit = checkPost(body);
    if (hit) {
      const n = addStrike();
      track("community_post_flagged", { rule: hit.id, offence: n });
      if (n >= 2) setBlocked(hit); else setFlag(hit);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (window.__communityFailNext) { window.__communityFailNext = false; setFailed(true); return; }
      postAnswer(questionId, { body, image });
      onPosted();
    }, 700);
  };

  if (blocked) return <BlockedSheet rule={blocked} onClose={onClose} />;
  if (flag) return <FlaggedSheet rule={flag} onEdit={() => setFlag(null)} onClose={onClose} />;

  return (
    <Sheet
      title="Your answer"
      onClose={onClose}
      footer={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Primary onClick={submit} disabled={!ready || busy}>{busy ? "Posting..." : "Post answer"}</Primary>
          <Secondary onClick={onClose}>Cancel</Secondary>
        </div>
      }
    >
      {failed && <FailedNote onRetry={() => { setFailed(false); submit(); }} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* So they can see exactly how they will appear before they write. */}
        <div style={{ background: C.bg, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontSize: 12, color: C.sub, margin: "0 0 8px" }}>You will appear as</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.head }}>{ME.couple}</span>
            <span style={{ fontSize: 12.5, color: C.sub }}>{ME.city}</span>
          </div>
          <TripStamp stamp={ME.stamp} style={{ marginTop: 8 }} />
        </div>

        {quote && (
          <div>
            <p style={{ fontSize: 12, color: C.sub, margin: "0 0 6px" }}>Replying to</p>
            <QuoteBlock quote={quote} />
          </div>
        )}

        <Field label="What would you tell them">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={600}
            placeholder="We went in March and the drive took us..." />
        </Field>

        <ImageAttach image={image} setImage={setImage} />
      </div>
    </Sheet>
  );
}
