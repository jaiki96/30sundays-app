import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { ME, QUESTIONS, CHAT, track } from "../data/communityData";

// Anything the couple does in Community lives here, so a question they ask or
// an answer they write is still there when they come back to the feed.

const KEY = "30s_community_v1";
const Ctx = createContext(null);

const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

function seed() {
  return {
    asked: [],          // questions the couple posted
    answers: {},        // questionId -> answers the couple posted
    messages: [],       // cohort messages the couple sent
    likes: {},          // postId -> true
    bookmarks: {},      // questionId -> true
    welcomeSeen: {},    // destination -> true
    strikes: 0,         // moderation offences this session
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...seed(), ...JSON.parse(raw) } : seed();
  } catch { return seed(); }
}

export function CommunityProvider({ children }) {
  const [state, setState] = useState(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ }
  }, [state]);

  const patch = useCallback((fn) => setState(p => fn(p)), []);

  const askQuestion = useCallback(({ dest, title, body, image }) => {
    const q = {
      id: uid("q"), dest, title: title.trim(), body: body.trim(), image,
      author: { couple: ME.couple, city: ME.city, stamp: ME.stamp }, mine: true,
      postedAt: Date.now(), minsAgo: 0, acceptedId: null, answers: [],
    };
    track("community_question_asked", { dest });
    patch(p => ({ ...p, asked: [q, ...p.asked] }));
    return q;
  }, [patch]);

  const postAnswer = useCallback((questionId, { body, image }) => {
    const a = {
      id: uid("a"), body: body.trim(), image, mine: true,
      author: { couple: ME.couple, city: ME.city, stamp: ME.stamp },
      postedAt: Date.now(), minsAgo: 0, likes: 0,
    };
    track("community_answer_posted", { questionId });
    patch(p => ({ ...p, answers: { ...p.answers, [questionId]: [...(p.answers[questionId] || []), a] } }));
    return a;
  }, [patch]);

  const sendMessage = useCallback(({ dest, text, image }) => {
    const m = {
      id: uid("ch"), dest, text: text.trim(), image, mine: true,
      author: { couple: ME.couple, city: ME.city }, postedAt: Date.now(), minsAgo: 0,
    };
    patch(p => ({ ...p, messages: [...p.messages, m] }));
    return m;
  }, [patch]);

  const toggleLike = useCallback((id) => patch(p => ({
    ...p, likes: { ...p.likes, [id]: !p.likes[id] },
  })), [patch]);

  const toggleBookmark = useCallback((id) => patch(p => ({
    ...p, bookmarks: { ...p.bookmarks, [id]: !p.bookmarks[id] },
  })), [patch]);

  const seeWelcome = useCallback((dest) => patch(p => ({
    ...p, welcomeSeen: { ...p.welcomeSeen, [dest]: true },
  })), [patch]);

  const addStrike = useCallback(() => {
    let next = 0;
    patch(p => { next = p.strikes + 1; return { ...p, strikes: next }; });
    return next;
  }, [patch]);

  const clearStrikes = useCallback(() => patch(p => ({ ...p, strikes: 0 })), [patch]);

  const resetCommunity = useCallback(() => setState(seed()), []);

  // ── Reading ──
  // Anything the couple posted sits alongside the seeded data rather than in a
  // separate list, so the feed reads the same either way.
  const questionsFor = useCallback((dest) => [
    ...state.asked.filter(q => q.dest === dest),
    ...QUESTIONS.filter(q => q.dest === dest),
  ], [state.asked]);

  const findQuestion = useCallback((id) =>
    state.asked.find(q => q.id === id) || QUESTIONS.find(q => q.id === id) || null,
  [state.asked]);

  const answersFor = useCallback((q) => {
    if (!q) return [];
    return [...(q.answers || []), ...(state.answers[q.id] || [])];
  }, [state.answers]);

  const messagesFor = useCallback((dest) => [
    ...(dest === "bali" ? CHAT : []),
    ...state.messages.filter(m => m.dest === dest),
  ], [state.messages]);

  const value = useMemo(() => ({
    ...state,
    askQuestion, postAnswer, sendMessage, toggleLike, toggleBookmark,
    seeWelcome, addStrike, clearStrikes, resetCommunity,
    questionsFor, findQuestion, answersFor, messagesFor,
  }), [state, askQuestion, postAnswer, sendMessage, toggleLike, toggleBookmark,
      seeWelcome, addStrike, clearStrikes, resetCommunity,
      questionsFor, findQuestion, answersFor, messagesFor]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCommunity() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCommunity must be used inside CommunityProvider");
  return v;
}
