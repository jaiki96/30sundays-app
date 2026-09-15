import { useNavigate } from "react-router-dom";
import {
  Briefcase, BellRing, CheckCircle2, MessagesSquare, MessageCircleQuestion, ShieldCheck,
  Users, Inbox, Loader, WifiOff, ShieldAlert, ChevronRight, RotateCcw,
} from "lucide-react";
import { C } from "../data";
import { useCommunity } from "../state/useCommunity";
import { Screen, Body, TopBar } from "../components/Gift/GiftUI";
import { PAD, SectionBar, SectionHead, Kicker } from "../components/Community/CommunityUI";

// Every screen and state in one place, so the whole thing can be walked
// through in a demo without hunting for a route.

export default function CommunityIndex() {
  const navigate = useNavigate();
  const { resetCommunity, strikes } = useCommunity();

  const go = (to) => () => navigate(to);
  // The next post fails once, so the failure state can be shown on demand.
  const failNext = () => { window.__communityFailNext = true; navigate("/community/bali"); };

  return (
    <Screen>
      <TopBar title="Community" sub="Phase 1 prototype" onBack={() => navigate("/account")} />
      <Body>
        <div style={{ padding: "14px 0 40px" }}>

          <div style={{ padding: `0 ${PAD}px 14px` }}>
            <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: "21px" }}>
              Questions about a destination, answered by our team and by couples who have
              already been. Plus one group for everyone travelling the same month.
            </p>
          </div>

          <SectionBar margin="6px 0 20px" />

          <SectionHead>The three ways in</SectionHead>
          <Group>
            <Row icon={Briefcase} tint={C.p100} title="A card in My Trips"
              desc="The main one. Sits under the trip it belongs to"
              onClick={go("/trips-community")} />
            <Row icon={CheckCircle2} tint="#ECFDF3" iconColor="#027A48" title="Just after a booking"
              desc="The invite on the confirmation screen"
              onClick={go("/community/booking-confirmed?dest=bali")} />
            <Row icon={BellRing} tint="#FFFAEB" iconColor="#B54708" title="A push notification"
              desc="Opens straight to one question. Tile sits on My Trips"
              onClick={go("/trips-community")} last />
          </Group>

          <SectionBar />

          <SectionHead right="Bali, November 2026">The screens</SectionHead>
          <Group>
            <Row icon={MessageCircleQuestion} tint={C.p100} title="Questions"
              desc="The landing surface" onClick={go("/community/bali")} />
            <Row icon={MessagesSquare} tint={C.p100} title="Your group"
              desc="14 couples, two checkpoints from our team" onClick={go("/community/bali/chat")} />
            <Row icon={Users} tint={C.p100} title="A long thread"
              desc="Five answers, one of them a quote reply" onClick={go("/community/bali/q/q2")} />
            <Row icon={CheckCircle2} tint="#ECFDF3" iconColor="#027A48" title="A solved question"
              desc="Accepted answer pinned to the top" onClick={go("/community/bali/q/q1")} />
            <Row icon={ShieldCheck} tint={C.bg} iconColor={C.sub} title="Community guidelines"
              desc="Pinned and locked, no replies" onClick={go("/community/bali/guidelines")} last />
          </Group>

          <SectionBar />

          <SectionHead>Empty and edge states</SectionHead>
          <Group>
            <Row icon={Inbox} tint={C.bg} iconColor={C.sub} title="No questions yet"
              desc="Only the pinned rows" onClick={go("/community/bali?state=empty")} />
            <Row icon={Users} tint={C.bg} iconColor={C.sub} title="No group yet"
              desc="Mauritius, below the threshold of eight" onClick={go("/community/mauritius")} />
            <Row icon={MessagesSquare} tint={C.bg} iconColor={C.sub} title="A closed group"
              desc="Vietnam, the month has passed. Read only" onClick={go("/community/vietnam/chat")} />
            <Row icon={Loader} tint={C.bg} iconColor={C.sub} title="Loading"
              desc="Skeleton feed" onClick={go("/community/bali?state=loading")} />
            <Row icon={WifiOff} tint="#FEF3F2" iconColor="#B42318" title="Failed to post"
              desc="Arms the next post to fail once" onClick={failNext} last />
          </Group>

          <SectionBar />

          <SectionHead>Moderation</SectionHead>
          <div style={{ padding: `0 ${PAD}px` }}>
            <div style={{
              border: `1px solid ${C.div}`, borderRadius: 14, padding: 16, background: C.white,
            }}>
              <Kicker>How to trigger it</Kicker>
              <p style={{ fontSize: 13.5, color: C.head, margin: "8px 0 0", lineHeight: "20px" }}>
                Ask a question or write an answer with a phone number, an email, an @handle,
                or something that reads as selling. The first one offers an edit. The second
                is held back for our team.
              </p>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginTop: 14,
                padding: "10px 12px", borderRadius: 10, background: C.bg,
              }}>
                <ShieldAlert size={15} color={strikes ? "#B54708" : C.inact} />
                <span style={{ flex: 1, fontSize: 12.5, color: C.sub }}>
                  {strikes === 0 ? "No offences yet" : strikes === 1 ? "One offence. The next one is blocked" : "Blocked"}
                </span>
                <button onClick={resetCommunity} style={{
                  display: "inline-flex", alignItems: "center", gap: 5, minHeight: 36, padding: "0 12px",
                  borderRadius: 9, border: `1px solid ${C.div}`, background: C.white, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12.5, fontWeight: 700, color: C.head,
                }}><RotateCcw size={13} /> Reset</button>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </Screen>
  );
}

function Group({ children }) {
  return (
    <div style={{ padding: `0 ${PAD}px` }}>
      <div style={{ border: `1px solid ${C.div}`, borderRadius: 14, overflow: "hidden", background: C.white }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, tint, iconColor = C.p600, title, desc, onClick, last }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 48,
      padding: "13px 14px", background: C.white, border: "none",
      borderBottom: last ? "none" : `1px solid ${C.div}`,
      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, background: tint, flexShrink: 0,
        display: "grid", placeItems: "center",
      }}><Icon size={16} color={iconColor} /></span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: C.head }}>{title}</span>
        <span style={{
          display: "block", fontSize: 12.5, color: C.sub, marginTop: 2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{desc}</span>
      </span>
      <ChevronRight size={17} color={C.inact} />
    </button>
  );
}
