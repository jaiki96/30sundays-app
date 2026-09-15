import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Lock } from "lucide-react";
import { C } from "../data";
import { useCommunity } from "../state/useCommunity";
import { getDest, dayLabel } from "../data/communityData";
import { Screen, Body, TopBar } from "../components/Gift/GiftUI";
import { PAD, ChatBubble, DayDivider, Composer, Toast } from "../components/Community/CommunityUI";

// The cohort: everyone going to the same place in the same month. Ops post
// checkpoints into it, which is what makes it worth opening.

export default function CommunityChat() {
  const { dest = "bali" } = useParams();
  const navigate = useNavigate();
  const { messagesFor, sendMessage } = useCommunity();
  const [toast, setToast] = useState(null);

  const d = getDest(dest);
  const closed = d.cohort.state === "closed";
  const messages = messagesFor(dest);

  // The list owns its own scroll. Sending a message is the only thing that
  // moves it, so typing never throws the position away.
  const endRef = useRef(null);
  const count = messages.length;
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [count]);

  let lastDay = null;

  return (
    <Screen>
      <TopBar
        title={`${d.name}, ${d.month}`}
        sub={closed ? `Closed on ${d.cohort.closedOn}` : `${d.cohort.members} couples going`}
        onBack={() => navigate(`/community/${dest}`)}
        right={
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px",
            borderRadius: 999, background: closed ? C.bg : C.p100,
          }}>
            {closed ? <Lock size={13} color={C.inact} /> : <Users size={13} color={C.p600} />}
            <span style={{ fontSize: 12, fontWeight: 700, color: closed ? C.sub : C.p900 }}>
              {d.cohort.members}
            </span>
          </span>
        }
      />

      <Body>
        <div style={{ padding: `4px ${PAD}px 16px` }}>
          {closed && (
            <div style={{
              background: C.bg, borderRadius: 16, padding: "14px 16px", margin: "8px 0 4px",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <Lock size={16} color={C.inact} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: "19px" }}>
                Your month has been and gone, so this group is read only now. Everything
                you both shared stays here for the couples travelling after you.
              </p>
            </div>
          )}

          {messages.map(m => {
            const day = dayLabel(m.minsAgo ?? 0);
            const showDay = day !== lastDay;
            lastDay = day;
            return (
              <div key={m.id}>
                {showDay && <DayDivider label={day} />}
                <ChatBubble msg={m} />
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </Body>

      {closed ? (
        <div style={{
          flexShrink: 0, borderTop: `1px solid ${C.div}`, background: C.bg,
          padding: `14px ${PAD}px calc(16px + env(safe-area-inset-bottom))`, textAlign: "center",
        }}>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>This group has closed</p>
        </div>
      ) : (
        <Composer
          placeholder="Say something to the group"
          onSend={({ text, image }) => {
            if (window.__communityFailNext) {
              window.__communityFailNext = false;
              setToast("That did not send. Try again.");
              return;
            }
            sendMessage({ dest, text, image });
          }}
        />
      )}

      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </Screen>
  );
}
