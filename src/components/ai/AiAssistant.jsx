import { useEffect, useRef, useState, useCallback } from "react";
import { useFrameRect } from "../useFrameRect";
import { Orb } from "./AiAskBar";
import { useNavigate } from "react-router-dom";
import { generateHotelsForCity } from "../../data/hotelData";
import { IMG, TRIP, BEACH, SWING, DEST, ROUTES, SAY, SLOTS, rupee, delta, dcls } from "../../data/aiAssistantData";
const src = (k) => (/^https?:/.test(k) ? k : IMG[k]);

// ─── AI mode: a dark surface over the app. A live "board" behind a draggable
// chat sheet (same shape as ChatScreen's sheet-over-backdrop). Scripted flows:
// new trip from scratch, change a hotel, change a day — all on real data.

const RM = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, RM ? Math.min(ms, 40) : ms));
let _id = 0; const nid = () => ++_id;

const CSS = `
.ai-root{position:fixed;z-index:200;overflow:hidden;background:#0D1514;color:#F2F6F5;font-family:inherit;animation:aiFade .35s ease-out}
.ai-aurora{position:absolute;inset:-30%;background:radial-gradient(40% 35% at 20% 25%,rgba(253,1,79,.35),transparent 60%),radial-gradient(35% 30% at 80% 20%,rgba(113,43,218,.38),transparent 60%),radial-gradient(45% 40% at 50% 85%,rgba(0,168,152,.3),transparent 60%);filter:blur(30px);animation:aiDrift 14s ease-in-out infinite alternate;pointer-events:none}
.ai-bg{position:absolute;inset:0;overflow:hidden}.ai-bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .9s ease,transform 8s ease;transform:scale(1.04)}.ai-bg img.on{opacity:.55;transform:scale(1.12)}
.ai-bg .sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,21,20,.7) 0%,rgba(13,21,20,.15) 35%,rgba(13,21,20,.75) 100%)}
.ai-top{position:absolute;top:48px;left:14px;right:14px;display:flex;align-items:center;gap:10px;z-index:3}
.ai-ic{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);backdrop-filter:blur(10px);display:grid;place-items:center;cursor:pointer;color:#fff;font-size:14px;font-family:inherit}
.ai-focus{position:absolute;left:16px;right:16px;top:100px;z-index:2;transition:opacity .4s,transform .4s}
.ai-eyebrow{font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#FFB3C8;margin-bottom:6px}
.ai-h2{margin:0;font-size:24px;font-weight:800;letter-spacing:-.4px;line-height:1.15;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.ai-sub{font-size:12.5px;color:#D7E1DF;margin-top:4px}
.ai-slots{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap}
.ai-slot{font-size:10.5px;font-weight:700;letter-spacing:.03em;padding:5px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.22);color:rgba(255,255,255,.72);background:rgba(255,255,255,.06);backdrop-filter:blur(6px);transition:.3s}
.ai-slot.on{background:#fff;color:#254342;border-color:#fff}.ai-slot.cur{border-color:#FD014F;color:#fff;box-shadow:0 0 0 3px rgba(253,1,79,.25)}
.ai-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.ai-tl{aspect-ratio:1;border-radius:12px;overflow:hidden;position:relative;background:rgba(255,255,255,.06);animation:aiTin .5s ease-out both}.ai-tl img{width:100%;height:100%;object-fit:cover;display:block}.ai-tl span{position:absolute;left:7px;bottom:6px;font-size:10px;font-weight:800;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.ai-tl.sk{background:linear-gradient(100deg,rgba(255,255,255,.05) 30%,rgba(255,255,255,.14) 50%,rgba(255,255,255,.05) 70%);background-size:200% 100%;animation:aiShimmer 1.3s infinite}
.ai-bigorb{position:absolute;left:50%;top:38%;z-index:5;pointer-events:none;animation:aiOrbIn 1.1s cubic-bezier(.2,.8,.2,1) forwards}
.ai-map{position:absolute;left:50%;transform:translateX(-50%);z-index:4;background:rgba(13,21,20,.8);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:12px;font-weight:600;padding:7px 12px;border-radius:999px;backdrop-filter:blur(10px);cursor:pointer;font-family:inherit}
.ai-sheet{position:absolute;left:0;right:0;bottom:0;background:#152322;border-radius:26px 26px 0 0;box-shadow:0 -12px 40px rgba(0,0,0,.45);display:flex;flex-direction:column;z-index:6;animation:aiSheet .5s cubic-bezier(.2,.8,.2,1)}
.ai-handle{display:flex;justify-content:center;padding:10px 0 4px;cursor:ns-resize;touch-action:none;user-select:none;flex:none}.ai-handle i{width:44px;height:5px;border-radius:3px;background:rgba(255,255,255,.25)}
.ai-thread{flex:1;overflow:auto;padding:6px 14px 12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;scrollbar-width:none}.ai-thread::-webkit-scrollbar{display:none}
.ai-thread>*{flex-shrink:0}
.ai-msg{max-width:88%;padding:10px 13px;border-radius:18px;font-size:13.5px;line-height:1.45;animation:aiRise .28s ease-out both}
.ai-msg.a{align-self:flex-start;background:#223433;border-bottom-left-radius:6px}.ai-msg.u{align-self:flex-end;background:linear-gradient(135deg,#FD014F,#C7013E);color:#fff;border-bottom-right-radius:6px}
.ai-msg b{font-weight:600}.ai-msg .mut{color:#9FB3B0;font-size:12px;display:block;margin-top:4px}
.ai-cur{display:inline-block;width:6px;height:14px;background:#FFB3C8;margin-left:2px;vertical-align:-2px;animation:aiBlink .8s infinite}
.ai-think{align-self:flex-start;display:flex;align-items:center;gap:8px;font-size:12.5px;color:#9FB3B0;padding:4px 2px}
.ai-sp{width:14px;height:14px;position:relative;flex:none}.ai-sp::before,.ai-sp::after{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#FD014F,#712BDA,#00A898,#FD014F);animation:aiSpin2 1.4s linear infinite}.ai-sp::after{inset:3px;background:#152322;animation:none}
.ai-dots i{display:inline-block;width:5px;height:5px;border-radius:50%;background:#FFB3C8;margin-right:3px;animation:aiBd 1.1s infinite}.ai-dots i:nth-child(2){animation-delay:.18s}.ai-dots i:nth-child(3){animation-delay:.36s}
.ai-chips{display:flex;flex-wrap:wrap;gap:7px;max-width:94%;animation:aiRise .3s ease-out both}
.ai-chip{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:7px 13px;font-size:12.5px;font-weight:500;cursor:pointer;transition:.15s;font-family:inherit}
.ai-chip:hover{background:rgba(255,255,255,.14)}.ai-chip.primary{background:#FD014F;border-color:#FD014F;font-weight:600}.ai-chip.on{background:#fff;color:#254342;border-color:#fff}
.ai-chips.done .ai-chip{opacity:.35;pointer-events:none}.ai-chips.done .ai-chip.picked{opacity:1;background:#fff;color:#254342;border-color:#fff}
.ai-card{align-self:stretch;background:#1C2C2B;border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;animation:aiRise .3s ease-out both;transition:opacity .2s}
.ai-card.dim{opacity:.4}.ai-card .ph{position:relative;height:190px;background:#0f1716}.ai-card .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s}.ai-card .ph img.on{opacity:1}
.ai-card .acts{position:absolute;top:10px;right:10px;display:flex;gap:6px}.ai-card .acts button{width:30px;height:30px;border-radius:50%;border:none;background:rgba(0,0,0,.45);color:#fff;cursor:pointer;backdrop-filter:blur(6px);font-family:inherit}
.ai-card .tag{position:absolute;left:10px;top:10px;background:rgba(255,255,255,.94);color:#254342;font-size:10px;font-weight:800;padding:4px 8px;border-radius:999px;letter-spacing:.04em}.ai-card .tag.rec{background:#FD014F;color:#fff}
.ai-card .dots{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:5px}.ai-card .dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.45);cursor:pointer}.ai-card .dots i.on{background:#fff}
.ai-card .bd{padding:11px 13px 13px}.ai-card .hd{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.ai-card .hd b{font-size:14px;line-height:1.25}.ai-card .rt{font-size:12px;font-weight:700;color:#FDA201;white-space:nowrap}
.ai-card .why{font-size:12.5px;color:#D7E1DF;margin-top:4px;line-height:1.4}.ai-card .pr{display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-variant-numeric:tabular-nums}.ai-card .pr b{font-size:15px}.ai-card .pr small{font-weight:500;color:#9FB3B0;font-size:11px}
.ai-d{font-size:11.5px;font-weight:800;padding:3px 8px;border-radius:999px}.ai-d.up{color:#FFD08A;background:rgba(253,162,1,.18)}.ai-d.dn{color:#8FE3D6;background:rgba(0,168,152,.2)}.ai-d.z{color:#9FB3B0;background:rgba(255,255,255,.08)}
.ai-card .ft{display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px}.ai-cx{font-size:10.5px;font-weight:700}.ai-cx.free{color:#8FE3D6}.ai-cx.nr{color:#FFD08A}
.ai-choose{background:#fff;color:#254342;border:none;border-radius:999px;padding:8px 14px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}.ai-card.sel .ai-choose{background:#FD014F;color:#fff}
.ai-sum{align-self:stretch;background:#1C2C2B;border:1px solid rgba(253,1,79,.45);border-radius:18px;padding:12px 14px;animation:aiRise .3s ease-out both}
.ai-sum h4{margin:0 0 8px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#FFB3C8}.ai-sum .row{display:grid;grid-template-columns:1fr 18px 1fr;gap:8px;align-items:center;font-size:12.5px;padding:4px 0}.ai-sum .row .a{color:#9FB3B0;text-decoration:line-through;text-decoration-color:#FD014F}.ai-sum .row .b{font-weight:600}.ai-sum .row .ar{color:#FD014F;text-align:center;font-weight:800}
.ai-sum .tot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,.15);font-variant-numeric:tabular-nums}.ai-sum .tot b{font-size:15px}.ai-sum .was{font-size:12px;color:#9FB3B0}
.ai-sum .lose{margin-top:8px;font-size:12px;color:#FFD08A;background:rgba(253,162,1,.12);border-radius:10px;padding:7px 10px}
.ai-act{display:flex;gap:8px;margin-top:10px}.ai-act button{flex:1;border-radius:12px;padding:10px;font-weight:700;font-size:13px;cursor:pointer;border:1px solid rgba(255,255,255,.18);background:transparent;color:#fff;font-family:inherit}.ai-act .go{background:#FD014F;border-color:#FD014F}
.ai-save label{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.09);font-size:12.5px;cursor:pointer}.ai-save label:last-of-type{border-bottom:none}.ai-save input{width:18px;height:18px;accent-color:#FD014F}.ai-save label span{flex:1}.ai-save label em{font-style:normal;font-weight:800;color:#8FE3D6;font-variant-numeric:tabular-nums}
.ai-save .fixed{display:flex;gap:8px;padding:8px 10px;margin-top:6px;background:rgba(253,162,1,.12);border-radius:10px;font-size:12px;color:#FFD08A}.ai-save .run{display:flex;justify-content:space-between;margin-top:10px;font-size:13px;font-weight:700;font-variant-numeric:tabular-nums}
.ai-itin{align-self:stretch;background:#1C2C2B;border:1px solid rgba(255,255,255,.09);border-radius:18px;overflow:hidden;animation:aiRise .3s ease-out both}
.ai-itin .stay{display:grid;gap:6px;padding:10px 13px;border-bottom:1px solid rgba(255,255,255,.09)}.ai-itin .stay div{display:flex;justify-content:space-between;font-size:12px;color:#9FB3B0;gap:8px}.ai-itin .stay b{color:#fff;font-weight:600;text-align:right}
.ai-day{display:grid;grid-template-columns:44px 1fr auto;gap:9px;padding:8px 13px;align-items:center;border-bottom:1px solid rgba(255,255,255,.09)}.ai-day:last-child{border:none}
.ai-day .im{width:44px;height:44px;border-radius:10px;overflow:hidden;background:#0f1716;display:grid;place-items:center;font-size:10px;font-weight:800;color:#FFB3C8}.ai-day .im img{width:100%;height:100%;object-fit:cover}
.ai-day b{display:block;font-size:12.5px;font-weight:600;line-height:1.25}.ai-day span{font-size:11px;color:#9FB3B0}.ai-day .p{font-size:12px;font-weight:700;font-variant-numeric:tabular-nums}.ai-day.chg b{color:#8FE3D6}
.ai-badge{font-size:9px;font-weight:800;letter-spacing:.05em;padding:2px 6px;border-radius:999px;background:rgba(255,255,255,.1);color:#9FB3B0;margin-left:5px;vertical-align:1px}.ai-badge.sep{background:rgba(0,168,152,.2);color:#8FE3D6}
.ai-itin .total{display:flex;justify-content:space-between;align-items:center;padding:11px 13px;background:rgba(255,255,255,.04);font-variant-numeric:tabular-nums}.ai-itin .total b{font-size:16px}.ai-itin .total span{font-size:11px;color:#9FB3B0}
.ai-fb{display:flex;gap:6px;align-self:flex-start;margin-top:-4px}.ai-fb button{width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:transparent;cursor:pointer;color:#9FB3B0;font-family:inherit}.ai-fb button.on{color:#FD014F;border-color:#FD014F}
.ai-inbar{flex:none;padding:8px 12px 12px;padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}
.ai-box{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 5px 5px 6px;transition:box-shadow .25s,border-color .25s}
.ai-box:focus-within{border-color:rgba(253,1,79,.55);box-shadow:0 0 0 4px rgba(253,1,79,.12),0 0 28px rgba(113,43,218,.25)}
.ai-box input{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#fff;min-width:0;outline:none}.ai-box input::placeholder{color:#9FB3B0}
.ai-box .ic{width:34px;height:34px;border-radius:50%;border:none;background:transparent;display:grid;place-items:center;cursor:pointer;color:#fff;font-family:inherit}.ai-box .send{background:#fff;color:#0D1514;font-weight:800}
.ai-hint{font-size:10.5px;color:#9FB3B0;text-align:center;margin-top:6px}
.ai-listen{display:flex;align-items:center;gap:10px;padding:2px 8px 6px}.ai-wave{display:flex;gap:3px;align-items:center;height:26px}.ai-wave i{width:3px;height:8px;border-radius:2px;background:#FD014F;animation:aiWv .9s ease-in-out infinite}.ai-wave i:nth-child(2){animation-delay:.1s}.ai-wave i:nth-child(3){animation-delay:.2s}.ai-wave i:nth-child(4){animation-delay:.3s}.ai-wave i:nth-child(5){animation-delay:.4s}.ai-wave i:nth-child(6){animation-delay:.5s}
.ai-menu{position:absolute;right:14px;top:94px;background:#1C2C2B;border:1px solid rgba(255,255,255,.09);border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.5);padding:6px;z-index:40;min-width:190px;animation:aiPop .18s ease-out}
.ai-menu button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;padding:10px 12px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;color:#fff;font-family:inherit}.ai-menu button:hover{background:rgba(255,255,255,.08)}.ai-menu .danger{color:#FFB3C8}
.ai-drawer{position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:45;animation:aiFade .25s}.ai-drawer .sh{position:absolute;left:0;right:0;bottom:0;background:#152322;border-radius:24px 24px 0 0;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));max-height:78%;overflow:auto;color:#fff;animation:aiSheet .3s cubic-bezier(.2,.8,.2,1)}
.ai-grab{width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.25);margin:0 auto 12px}.ai-drawer h3{margin:0 0 10px;font-size:15px;display:flex;align-items:center;justify-content:space-between}.ai-drawer h3 button{background:#FD014F;color:#fff;border:none;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
.ai-hrow{display:flex;align-items:center;gap:12px;background:#1C2C2B;border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:11px 12px;margin-bottom:8px;transition:transform .25s,opacity .25s}.ai-hrow.gone{transform:translateX(40px);opacity:0}.ai-hrow.active{border-color:#FD014F}
.ai-hrow .i{width:36px;height:36px;border-radius:10px;overflow:hidden;flex:none}.ai-hrow .i img{width:100%;height:100%;object-fit:cover}.ai-hrow .t{flex:1;min-width:0;cursor:pointer}.ai-hrow b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ai-hrow span{font-size:11.5px;color:#9FB3B0}.ai-hrow .del{background:none;border:none;color:#9FB3B0;cursor:pointer;padding:6px;border-radius:8px;font-family:inherit}
.ai-confirm{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.5);z-index:50}.ai-confirm .box{background:#1C2C2B;color:#fff;border-radius:18px;padding:18px;width:300px;max-width:90%;text-align:center}.ai-confirm b{display:block;font-size:14.5px;margin-bottom:4px}.ai-confirm p{margin:0 0 14px;font-size:12.5px;color:#9FB3B0}
.ai-toast{position:absolute;left:50%;bottom:110px;transform:translateX(-50%);background:#fff;color:#0D1514;font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px;z-index:70;pointer-events:none;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.4);animation:aiRise .25s}
@keyframes aiFade{from{opacity:0}to{opacity:1}}@keyframes aiDrift{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(4%,6%) rotate(8deg)}}
@keyframes aiShimmer{to{background-position:-200% 0}}@keyframes aiTin{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
@keyframes aiOrbIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}35%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.3) translateY(-240px)}}
@keyframes aiSheet{from{transform:translateY(105%)}to{transform:none}}@keyframes aiRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes aiBlink{50%{opacity:0}}@keyframes aiSpin2{to{transform:rotate(360deg)}}@keyframes aiBd{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
@keyframes aiWv{0%,100%{height:6px}50%{height:22px}}@keyframes aiPop{from{opacity:0;transform:scale(.96) translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ai-root *{animation:none!important;transition:none!important}}
`;

// ─── leaf components ───
function AiMsg({ html }) {
  const [shown, setShown] = useState(RM ? html : "");
  const [done, setDone] = useState(RM);
  useEffect(() => {
    if (RM) return;
    const tmp = document.createElement("div"); tmp.innerHTML = html; const text = tmp.textContent;
    let i = 0; let t;
    const step = () => { i += Math.max(1, Math.round(text.length / 90)); setShown(text.slice(0, i)); if (i < text.length) t = setTimeout(step, 14); else setDone(true); };
    step(); return () => clearTimeout(t);
  }, [html]);
  return done ? <div className="ai-msg a" dangerouslySetInnerHTML={{ __html: html }} /> : <div className="ai-msg a">{shown}<span className="ai-cur" /></div>;
}
function Thinking({ label, done }) {
  return <div className="ai-think" style={{ opacity: done ? 0.55 : 1 }}>{done ? <span style={{ color: "#8FE3D6", fontWeight: 800 }}>✓</span> : <span className="ai-sp" />}<span>{label}</span>{!done && <span className="ai-dots"><i /><i /><i /></span>}</div>;
}
function Chips({ items, primary, multi, onPick }) {
  const [picked, setPicked] = useState(null); const [on, setOn] = useState(new Set());
  const done = picked !== null;
  return (
    <div className={"ai-chips" + (done ? " done" : "")}>
      {items.map((l, i) => (
        <button key={l} className={"ai-chip" + (primary === i ? " primary" : "") + (picked === i ? " picked" : "") + (on.has(l) ? " on" : "")}
          onClick={() => { if (done) return;
            if (multi && l !== "Done") { const n = new Set(on); n.has(l) ? n.delete(l) : n.add(l); setOn(n); return; }
            if (multi) { setPicked(i); onPick([...on].join(", ") || "Relaxed pace"); return; }
            setPicked(i); onPick(l, i); }}>{l}</button>
      ))}
    </div>
  );
}
function PhotoCard({ c, selected, dimmed, onChoose, onFocus }) {
  const [k, setK] = useState(0); const imgs = c.imgs || [c.img];
  return (
    <div className={"ai-card" + (selected ? " sel" : "") + (dimmed ? " dim" : "")} onMouseEnter={onFocus} onClick={onFocus}>
      <div className="ph">
        {imgs.map((key, i) => <img key={key} src={src(key)} alt="" className={i === k ? "on" : ""} loading="lazy" />)}
        {c.rec ? <span className="tag rec">RECOMMENDED</span> : c.tag ? <span className="tag">{c.tag}</span> : null}
        <div className="acts"><button aria-label="Save" onClick={(e) => { e.stopPropagation(); c.toast("Saved to wishlist"); }}>♡</button><button aria-label="Add" onClick={(e) => { e.stopPropagation(); c.toast("Added to compare"); }}>＋</button></div>
        {imgs.length > 1 && <div className="dots">{imgs.map((_, i) => <i key={i} className={i === k ? "on" : ""} onClick={(e) => { e.stopPropagation(); setK(i); }} />)}</div>}
      </div>
      <div className="bd">
        <div className="hd"><b>{c.name}</b>{c.rt && <span className="rt">★ {c.rt}</span>}</div>
        {c.why && <div className="why">{c.why}</div>}
        <div className="pr"><b>{c.price}{c.sub && <small> {c.sub}</small>}</b>{c.d !== undefined && <span className={"ai-d " + dcls(c.d)}>{delta(c.d)}</span>}</div>
        <div className="ft">{c.cx ? <span className={"ai-cx " + (c.cx === "Free cancellation" ? "free" : "nr")}>{c.cx}</span> : <span />}<button className="ai-choose" disabled={dimmed} onClick={(e) => { e.stopPropagation(); onChoose(); }}>Choose</button></div>
      </div>
    </div>
  );
}
function CardGroup({ cards, onChoose, onFocus }) {
  const [sel, setSel] = useState(null);
  return <>{cards.map((c, i) => <PhotoCard key={i} c={c} selected={sel === i} dimmed={sel !== null && sel !== i} onFocus={() => onFocus && onFocus(c)} onChoose={() => { if (sel !== null) return; setSel(i); onChoose(c, i); }} />)}</>;
}
function Summary({ title, rows, before, after, lose, onGo, onKeep }) {
  const [st, setSt] = useState(null);
  return (
    <div className="ai-sum"><h4>{title}</h4>
      {rows.map((r, i) => <div className="row" key={i}><span className="a">{r[0]}</span><span className="ar">→</span><span className="b">{r[1]}</span></div>)}
      <div className="tot"><span className="was">{rupee(before)} →</span><b>{rupee(after)} <span className={"ai-d " + dcls(after - before)}>{delta(after - before)}</span></b></div>
      {lose && <div className="lose"><b>You'd lose:</b> {lose}</div>}
      <div className="ai-act">{st === "go" ? <span style={{ fontSize: 12.5, color: "#8FE3D6", fontWeight: 700 }}>✓ Confirmed</span> : st === "keep" ? <span style={{ fontSize: 12.5, color: "#9FB3B0" }}>Kept as it is</span> : <><button onClick={() => { setSt("keep"); onKeep && onKeep(); }}>Keep as it is</button><button className="go" onClick={() => { setSt("go"); onGo(); }}>Confirm change</button></>}</div>
    </div>
  );
}
function Savings({ items, flights, onApply, onFlights }) {
  const [on, setOn] = useState(new Set()); const [st, setSt] = useState(null);
  const v = [...on].reduce((a, i) => a + items[i][1], 0);
  return (
    <div className="ai-sum ai-save" style={{ borderColor: "rgba(255,255,255,.09)" }}><h4 style={{ color: "#fff", textTransform: "none", letterSpacing: 0, fontSize: 13.5 }}>Savings menu</h4>
      {items.map((x, i) => <label key={i}><input type="checkbox" checked={on.has(i)} onChange={() => { const n = new Set(on); n.has(i) ? n.delete(i) : n.add(i); setOn(n); }} /><span>{x[0]}</span><em>−{rupee(x[1])}</em></label>)}
      {flights ? <div className="fixed">✈︎ <span><b>Flights {rupee(flights)}</b> — I can't change these. Mansi can check other dates or airlines, which is usually the bigger saving.</span></div> : null}
      <div className="run"><span>Running total</span><span>−{rupee(v)}</span></div>
      <div className="ai-act">{st ? <span style={{ fontSize: 12.5, color: "#8FE3D6", fontWeight: 700 }}>✓ {st}</span> : <><button onClick={() => { setSt("Sent to Mansi"); onFlights(); }}>Ask Mansi about flights</button><button className="go" onClick={() => { if (!v) return; setSt("Applied"); onApply(v); }}>Apply selected</button></>}</div>
    </div>
  );
}
function ItinCard({ t, changed = [] }) {
  return (
    <div className="ai-itin">
      <div className="stay">{t.stays.map((s) => <div key={s.id}><span>Nights {s.nights} · {s.city}</span><b>{s.name}</b></div>)}</div>
      {t.days.map((d) => <div className={"ai-day" + (changed.includes(d.d) ? " chg" : "")} key={d.d}><div className="im">{d.img ? <img src={src(d.img)} alt="" loading="lazy" /> : "D" + d.d}</div><div><b>{d.t}{d.sep ? <span className="ai-badge sep">separable</span> : d.type === "Tour" ? <span className="ai-badge">bundled</span> : null}</b><span>Day {d.d} · {d.dt} · {d.h}</span></div><span className="p">{d.p ? rupee(d.p) : "—"}</span></div>)}
      <div className="total"><div><b>{rupee(t.total)}</b><br /><span>{t.flights ? "incl. flights " + rupee(t.flights) + " · TCS · GST" : "for two · excludes flights"}</span></div><span>v{t.ver}</span></div>
    </div>
  );
}
function Feedback({ toast }) {
  const [on, setOn] = useState(null);
  return <div className="ai-fb"><button className={on === 1 ? "on" : ""} aria-label="Helpful" onClick={() => { setOn(1); toast("Thanks — this tunes our recommendations"); }}>👍</button><button className={on === 0 ? "on" : ""} aria-label="Not helpful" onClick={() => { setOn(0); toast("Thanks — noted"); }}>👎</button></div>;
}

// ─── the overlay ───
export default function AiAssistant({ mode = "", userState = "new", trip = null, onClose }) {
  const rect = useFrameRect();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [board, setBoard] = useState({ eyebrow: "", h2: "", sub: "", img: "kelingking", slots: null, tiles: null });
  const [bgStack, setBgStack] = useState(["kelingking"]);
  const [title, setTitle] = useState("Trip assistant");
  const [subtitle, setSubtitle] = useState("AI MODE · BALI · THAILAND · VIETNAM");
  const [sheetPct, setSheetPct] = useState(56);
  const [menu, setMenu] = useState(false); const [drawer, setDrawer] = useState(false); const [confirm, setConfirm] = useState(null);
  const [toastMsg, setToastMsg] = useState(""); const [listening, setListening] = useState(false);
  const [chats, setChats] = useState([{ id: 1, title: "Bali honeymoon · November", sub: "Today · 6 nights, Seminyak + Ubud", img: "kelingking", active: true }, { id: 2, title: "Thailand — island ideas", sub: "Yesterday · Phuket vs Krabi", img: "pileh" }, { id: 3, title: "Ubud hotel change", sub: "3 Oct · Pool villa options", img: "villa_ubud" }]);
  const S = useRef({ flow: null, slots: {}, cur: null, trip: JSON.parse(JSON.stringify(TRIP)) }).current;
  const threadRef = useRef(null); const inputRef = useRef(null); const drag = useRef(null);
  const [inp, setInp] = useState("");

  const toast = useCallback((t) => { setToastMsg(t); setTimeout(() => setToastMsg(""), 2200); }, []);
  const scroll = () => requestAnimationFrame(() => { const el = threadRef.current; if (el) el.scrollTop = el.scrollHeight; });
  const push = useCallback((b) => { const id = nid(); setBlocks((x) => [...x, { ...b, id }]); scroll(); return id; }, []);
  const patch = useCallback((id, p) => setBlocks((x) => x.map((b) => (b.id === id ? { ...b, ...p } : b))), []);
  const remove = useCallback((id) => setBlocks((x) => x.filter((b) => b.id !== id)), []);

  // board helpers
  const boardImg = (k) => setBgStack((s) => (s[s.length - 1] === k ? s : [...s.filter((x) => x !== k), k]));
  const boardText = (eyebrow, h2, sub, img) => { setBoard((b) => ({ ...b, eyebrow, h2, sub, slots: null, tiles: null })); if (img) boardImg(img); };
  const boardTrip = () => { const d = S.slots.dest; const n = Object.keys(S.slots).length; setBoard({ eyebrow: d ? d.toUpperCase() + " · NEW TRIP" : "NEW TRIP", h2: d ? (n >= 5 ? "Ready to build." : "Taking shape.") : "Where are we off to?", sub: d ? (DEST[d] || {}).line || "" : "Pick a place, or just ask.", slots: { ...S.slots, _cur: S.cur }, tiles: null }); if (d && DEST[d]) boardImg(DEST[d].img); };
  const boardBuild = async (days) => { const keys = days.map((d) => d.img).filter(Boolean).slice(0, 6); setBoard({ eyebrow: (S.slots.dest || "BALI").toUpperCase() + " · BUILDING", h2: "Putting your days together.", sub: "", slots: null, tiles: keys.map(() => null) }); await wait(400); for (let i = 0; i < keys.length; i++) { await wait(520); setBoard((b) => ({ ...b, tiles: b.tiles ? b.tiles.map((t, j) => (j === i ? keys[i] : t)) : b.tiles })); } };

  // chat primitives
  const user = (t) => push({ type: "user", text: t });
  const ai = async (html, { thinkLabel = "", ms = 700 } = {}) => { if (thinkLabel) { const id = push({ type: "think", label: thinkLabel }); await wait(ms); remove(id); } else await wait(Math.min(ms, 500)); push({ type: "ai", html }); const tmp = document.createElement("div"); tmp.innerHTML = html; await wait(Math.min(tmp.textContent.length * 13, 2600)); };
  const steps = async (list, ms = 650) => { for (const s of list) { const id = push({ type: "think", label: s }); await wait(ms); patch(id, { done: true }); } };
  const chips = (items, onPick, opt = {}) => push({ type: "chips", items, onPick, ...opt });
  const cards = (list, onChoose, onFocus) => push({ type: "cards", cards: list.map((c) => ({ ...c, toast })), onChoose, onFocus });
  const summary = (p) => push({ type: "summary", ...p });
  const itin = (t, changed) => push({ type: "itin", t: JSON.parse(JSON.stringify(t)), changed });
  const feedback = () => push({ type: "feedback" });

  // ─── flows ───
  const welcome = async () => { setBlocks([]); S.flow = null; S.slots = {}; S.cur = null; setTitle("Trip assistant"); setSubtitle("AI MODE");
    if (userState === "lead") return welcomeLead(); if (userState === "customer") return welcomeCustomer(); if (userState === "done") return welcomeDone(); return welcomeNew(); };
  // NEW — no itinerary yet: planning questions, recommendations, never "we only do X".
  const welcomeNew = async () => { boardText("HEY THERE", "Where are we off to?", "Tell me a place, or I can suggest a few.", "swing");
    await ai("Hey 👋 Planning a trip? Do you already have a destination in mind?", { ms: 600 });
    chips(["Yes, I know where", "Help me choose", "Just browsing"], async (l) => { user(l); if (l === "Help me choose") return guide(); if (l === "Just browsing") return explore();
      S.flow = "new"; S.cur = "dest"; boardTrip(); await ai("Where to?", { ms: 400 }); chips(["Bali", "Thailand", "Vietnam", "Somewhere else"], async (d) => { user(d); if (d === "Somewhere else") { await ai("Tell me the place and I'll take it from there.", { ms: 400 }); return; } setDest(d); }); }); };
  // LEAD — the app's own draft itinerary: see it, download it, customise it.
  const welcomeLead = async () => { const t = trip || { dest: "Bali", title: "Swing & Sanur", nights: 7, price: "62,498", img: "swing" }; setTitle(`${t.dest} · ${t.nights} nights`); setSubtitle("YOUR TRIP · DRAFT");
    boardText(t.dest.toUpperCase() + " · YOUR TRIP", t.title || `${t.dest} · ${t.nights} nights`, `${t.nights} nights · ₹${t.price} per person${t.dates ? " · " + t.dates : ""}`, t.img || "swing");
    await ai(`Your ${t.dest} trip is already here — <b>${t.title || t.dest}</b>, ${t.nights} nights, from ₹${t.price} per person. What would you like to do with it?`, { ms: 600 });
    chips(["See the trip", "Download itinerary", "Customise my trip", "Share with partner"], (l) => { user(l);
      if (l === "See the trip") { onClose(); if (t.target) navigate(t.target); return; }
      if (l === "Download itinerary") { toast("Itinerary PDF is on its way"); ai("Sent — the PDF will be in your downloads in a moment.", { ms: 300 }); return; }
      if (l === "Share with partner") { toast("Share link copied"); ai("Copied a link your partner can open without logging in.", { ms: 300 }); return; }
      customiseMenu(); }); };
  const customiseMenu = async () => { await ai("What would you like to change?", { ms: 400 }); chips(["Change a day", "Change a hotel", "Add a day", "Make it cheaper"], (x) => { user(x); x === "Change a day" ? dayFlow() : x === "Change a hotel" ? hotelFlow() : x === "Add a day" ? addDay() : savings(S.trip); }); };
  // CUSTOMER — booked, before the trip: information and documents only.
  const welcomeCustomer = async () => { setTitle("Bali · booked"); setSubtitle("26 DAYS TO GO"); boardText("BOOKED · 26 DAYS TO GO", "Bali, 6–12 Nov", "Vouchers ready · visa approved · tickets issued", "kelingking");
    await ai("Your Bali trip is booked — <b>26 days to go</b> 🎉 What do you need?", { ms: 600 });
    chips(["Download documents", "Download itinerary", "Payment status", "Hotel & transfer details", "Packing checklist"], async (l) => { user(l);
      if (l === "Download documents") { toast("Preparing your documents"); await ai("Hotel vouchers, flight tickets and your visa approval — all three are ready. Sending them to your downloads now.", { ms: 400 }); chips(["Hotel vouchers", "Flight tickets", "Visa"], (x) => { user(x); toast(x + " downloaded"); }); }
      else if (l === "Download itinerary") { toast("Itinerary PDF is on its way"); await ai("Sent — the final itinerary PDF is on its way.", { ms: 300 }); }
      else if (l === "Payment status") { await ai("₹1,80,000 of ₹2,32,000 is paid. The last installment of <b>₹52,000 is due on 12 Oct</b> — five days from now.", { ms: 500 }); chips(["Pay now", "Remind me later"], (x) => { user(x); toast(x === "Pay now" ? "Opening payment link" : "Reminder set for 11 Oct"); }); }
      else if (l === "Hotel & transfer details") { await ai("<b>Umalas Suites, Seminyak</b> nights 1–3 (check-in 2 PM) · <b>D'Ethnic Ubud Joglo Villas</b> nights 4–6. Your driver meets you at arrivals on 6 Nov — the pickup time is confirmed once we have your flight landing time.", { ms: 500 }); feedback(); }
      else { await ai("For Bali in November: light layers, a rain jacket for afternoon showers, reef-safe sunscreen, a universal plug (type C/F), and cash in IDR for small stalls. Your eSIM activates on landing.", { ms: 500 }); feedback(); }
    }); };
  const supportOnly = async () => { await ai("Changes on a booked trip go through our support team, who can check what the hotel and airline allow at this stage. They're on <b>1800-30-SUNDAY</b>, 9am–9pm. Want me to raise it for you?", { ms: 500 }); chips(["Raise it with support", "Not now"], (x) => { user(x); ai(x.startsWith("Raise") ? "Raised — support will call you today." : "Okay."); }); };
  // DONE — after the trip.
  const welcomeDone = async () => { setTitle("Welcome back"); setSubtitle("TRIP COMPLETED"); boardText("WELCOME BACK", "How was Bali?", "Your photos, your review, and the next one.", "tegallalang");
    await ai("Welcome back! How was Bali? 🌴", { ms: 600 });
    chips(["Rate the trip", "Plan my next trip", "Refer a friend", "See my photos"], async (l) => { user(l);
      if (l === "Rate the trip") { await ai("Out of five?", { ms: 300 }); chips(["★★★★★", "★★★★", "★★★", "Less"], (x) => { user(x); ai(x.length >= 4 ? "Thank you — that means a lot to the team. Mansi will see this too." : "Thanks for being honest. Someone from the team will call to hear what went wrong."); }); }
      else if (l === "Plan my next trip") { S.trip = JSON.parse(JSON.stringify(TRIP)); welcomeNew(); }
      else if (l === "Refer a friend") { toast("Referral link copied"); await ai("Copied your referral link — your friend gets ₹2,000 off, and so do you.", { ms: 300 }); }
      else { toast("Opening your trip album"); await ai("Your 42 photos from the trip are in the album — I've picked the eight best for a reel if you want it.", { ms: 300 }); }
    }); };
  const _welcomeOld = async () => { setTitle("Trip assistant");
    boardText("HEY ANANYA", "Where are we off to next?", "Your Bali trip is quoted at v6 — or start something new.", "kelingking");
    await ai("Hey Ananya 👋 Bali's still sitting at version 6. Carry on with it, or start something new?", { ms: 600 });
    chips(["Customise my Bali trip", "Plan a new trip", "Guide me", "Just exploring"], (l) => { user(l); l === "Customise my Bali trip" ? existing() : l === "Plan a new trip" ? startNew() : l === "Guide me" ? guide() : explore(); }); };
  const destCards = (fit) => cards(Object.entries(DEST).map(([n, d]) => ({ imgs: [d.img, d.cover], name: n, rt: "4.6", rec: n === fit, why: d.line, price: "From ₹" + d.from, sub: "for two", _k: n })), (c) => { user(c._k); setDest(c._k); }, (c) => boardImg(c.imgs[0]));
  const explore = async () => { S.flow = "new"; setTitle("Exploring"); boardTrip(); await ai("No pressure. Three places that are at their best right now — tap anything that catches your eye.", { ms: 500 }); destCards(null); chips(["Maldives?", "Somewhere else"], (l) => { user(l); l === "Maldives?" ? maldives() : ai("Tell me the place and I'll say straight away whether we plan it."); }); };
  const guide = async () => { S.flow = "new"; setTitle("New trip"); S.cur = "dest"; boardTrip(); await ai("Two quick things and I'll point you somewhere: <b>which month</b>, and <b>beaches, culture, or both</b>?", { ms: 500 });
    chips(["November · beaches", "December · both", "January · value"], async (l) => { user(l); await ai(`For ${l.split(" ·")[0]}, this is the honest comparison for a couple:`, { thinkLabel: "Comparing seasons", ms: 900 }); destCards(/bea/.test(l) ? "Bali" : /both/.test(l) ? "Thailand" : "Vietnam"); }); };
  const startNew = async () => { S.flow = "new"; setTitle("New trip"); S.slots = {}; S.cur = "dest"; boardTrip(); await ai("Where to? Or tell me everything in one go — <i>“Bali, mid Nov, 6 nights, honeymoon”</i> works.", { ms: 500 }); chips(["Bali", "Thailand", "Vietnam", "Somewhere else", "Not sure yet"], (l) => { user(l); l === "Not sure yet" ? guide() : l === "Somewhere else" ? ai("Tell me the place and I'll take it from there.", { ms: 400 }) : setDest(l); }); };
  const maldives = (place = "Maldives") => leadCapture(place);
  const leadCapture = async (place) => { boardText(place.toUpperCase(), "Our team will plan this one with you.", "A quick call, then a tailored quote.", place === "New Zealand" ? "nz" : "maldives_aerial"); await ai(`${place} trips are put together personally by our sales team — they'll call you to plan it properly. So they're not starting cold: <b>when were you thinking of travelling?</b>`, { ms: 600 });
    chips(["Mid December", "January", "Flexible"], async (l) => { user(l); await ai(`Noted — ${l.toLowerCase()}. Our team will call you today. Anything else I can help with meanwhile?`); chips(["Show me Bali as well", "Show me Thailand as well", "No, that's all"], (x) => { user(x); /Bali/.test(x) ? setDest("Bali") : /Thai/.test(x) ? setDest("Thailand") : ai("Okay — talk soon."); }); }); };
  const unsupported = async (place) => { boardText("COMING SOON", place + " isn't available just yet.", "We're adding destinations through the year.", "nz"); await ai(`<b>${place}</b> isn't available just yet — we're adding new destinations through the year. For now I can plan Bali, Thailand and Vietnam, and our team handles Maldives, Mauritius and New Zealand. Want to see one of those?`, { ms: 600 }); chips(["Show me what's good now", "Tell me when it's added", "Okay"], (l) => { user(l); l.startsWith("Show") ? explore() : l.startsWith("Tell") ? ai("Will do — you'll hear from us the moment it's live.") : ai("Okay."); }); };
  const parseFree = (t) => { const s = t.toLowerCase(); const got = []; if (/maldiv/.test(s)) return leadCapture("Maldives"); if (/mauriti/.test(s)) return leadCapture("Mauritius"); if (/new zealand|\bnz\b/.test(s)) return leadCapture("New Zealand"); const bad = s.match(/\b(dubai|japan|europe|singapore|turkey|paris|london|goa|kashmir|sri lanka|georgia|italy|switzerland|greece)\b/); if (bad) return unsupported(bad[1][0].toUpperCase() + bad[1].slice(1));
    const d = /bali/.test(s) ? "Bali" : /thai|phuket|krabi/.test(s) ? "Thailand" : /viet|hanoi|da nang/.test(s) ? "Vietnam" : null; if (d) { S.slots.dest = d; got.push(d); }
    const n = s.match(/(\d+)\s*(n\b|night|nights)/); const mo = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/); if (n || mo) { S.slots.when = [mo ? mo[0][0].toUpperCase() + mo[0].slice(1, 3) : "", n ? n[1] + " nights" : ""].filter(Boolean).join(" · "); got.push(S.slots.when); }
    if (/honeymoon|couple\b|two of us|just us/.test(s) && !/couples|2 couple/.test(s)) { S.slots.who = "2 adults"; got.push("2 adults"); } if (/couples|2 couple/.test(s)) { S.slots.who = "4 adults · two couples"; got.push("two couples"); } if (/child|kid/.test(s)) { S.slots.who = (S.slots.who || "2 adults") + " + 1 child"; got.push("+1 child"); }
    const v = []; if (/beach/.test(s)) v.push("Beaches"); if (/culture|temple/.test(s) && !/no temple/.test(s)) v.push("Culture"); if (/adventure|atv|raft/.test(s)) v.push("Adventure"); if (/relax|chill|slow/.test(s)) v.push("Relaxed"); if (/honeymoon/.test(s)) v.push("Honeymoon"); if (v.length) { S.slots.vibe = v.join(", "); got.push(S.slots.vibe); }
    boardTrip(); ai(got.length ? `Got it — <b>${got.join("</b>, <b>")}</b>.` : "Which place — Bali, Thailand or Vietnam?", { ms: 500 }).then(nextSlot); };
  const setDest = async (d) => { S.slots.dest = d; S.flow = "new"; setTitle(d + " · new trip"); boardTrip(); await ai(`${d} — ${d === "Bali" ? "great for November: fewer crowds and the terraces at their greenest" : d === "Thailand" ? "the islands are at their best December to March" : "best value of the three, and the food is a holiday on its own"}.`, { ms: 500 }); nextSlot(); };
  const nextSlot = async () => { const k = SLOTS.map((x) => x[0]).find((x) => !S.slots[x]); S.cur = k || null; boardTrip();
    if (!k) { await ai("That's everything I need. Build it now?"); chips(["Build my trip", "Change something first"], (l) => { user(l); l.startsWith("Build") ? generate() : ai("Tell me which to change and I'll update it."); }, { primary: 0 }); return; }
    if (k === "dest") { await ai("<b>Where to?</b>"); chips(["Bali", "Thailand", "Vietnam"], (l) => { user(l); setDest(l); }); }
    if (k === "who") { await ai("One quick thing so I show the right stays — <b>who's coming?</b>"); chips(["Just the two of us", "2 adults + 1 child", "Two couples"], async (l) => { user(l); if (/child/.test(l)) { await ai("How old? A few tours have a minimum age."); chips(["3", "7", "10"], (a) => { user(a); S.slots.who = `2 adults + 1 child (${a})`; nextSlot(); }); } else { S.slots.who = l === "Two couples" ? "4 adults · two couples" : "2 adults"; nextSlot(); } }); }
    if (k === "when") { await ai("<b>When, and roughly how long?</b> Dates can stay flexible."); chips(["Mid Nov · 6 nights", "Early Dec · 5 nights", "Late Jan · 7 nights", "Flexible"], (l) => { user(l); S.slots.when = l === "Flexible" ? "Flexible · 6 nights" : l; nextSlot(); }); }
    if (k === "route") { const r = ROUTES[S.slots.dest] || ROUTES.Bali; await ai("<b>How should the nights split?</b> Three routes we'd recommend:", { thinkLabel: "Mapping routes", ms: 800 }); cards(r.map((x) => ({ imgs: [x.img], name: x.t, why: x.s, rec: x.rec, price: "" })), (c) => { user(c.name); S.slots.route = c.name; nextSlot(); }, (c) => boardImg(c.imgs[0])); }
    if (k === "vibe") { await ai("Last one — <b>what are you after?</b> Pick a few."); chips(["Beaches", "Culture", "Adventure", "Relaxed pace", "Instagram spots", "No temples", "Done"], (v) => { user(v); S.slots.vibe = v; nextSlot(); }, { multi: true, primary: 6 }); } };
  const generate = async () => { const t = JSON.parse(JSON.stringify(TRIP)); t.ver = 1; t.total = 112400; t.flights = 0; if (/No temples/.test(S.slots.vibe || "")) t.days[4] = { d: 5, dt: "10 Nov", t: "Kintamani sunrise + coffee plantation", h: "8h", p: 3640, type: "Tour", img: "tegallalang" };
    const build = boardBuild(t.days); await steps([`Setting the route · ${S.slots.route || "Seminyak 3N · Ubud 3N"}`, "Finding stays for " + (S.slots.who || "2 adults"), `Choosing days for ${(S.slots.vibe || "a relaxed pace").toLowerCase()}`, "Pricing with our rates"], 700); await build;
    boardText((S.slots.dest || "BALI").toUpperCase() + " · VERSION 1", S.slots.route || "Seminyak 3N · Ubud 3N", `${S.slots.who || "2 adults"} · ${S.slots.when || "Mid Nov · 6 nights"} · ₹1,12,400 for two`, S.slots.dest === "Thailand" ? "pileh" : S.slots.dest === "Vietnam" ? "kayak" : "swing");
    await ai("Here's a first version. Everything on it is bookable at these prices — <b>₹1,12,400 for two, excluding flights</b>; Mansi adds live fares from your city.", { ms: 400 }); itin(t);
    chips(["Save as my trip", "Make it cheaper", "Change a day", "Change a hotel"], (l) => { user(l); if (l.startsWith("Save")) { toast("Saved · in My Trips as v1"); ai("Saved as <b>version 1</b>. Mansi can see it and will call about flights.").then(() => chips(["Change a hotel", "Change a day", "Nothing for now"], (x) => { user(x); x === "Change a hotel" ? hotelFlow() : x === "Change a day" ? dayFlow() : ai("Perfect. I'm here when you need me."); })); feedback(); } else if (l === "Make it cheaper") savings(t); else if (l === "Change a day") dayFlow(); else hotelFlow(); }); };
  const savings = async (t) => { boardText("BUDGET", "Where the money sits.", "Tick what works — nothing changes until you confirm.", S.slots.dest ? DEST[S.slots.dest].img : "tegallalang"); await ai("Here's where the money is. Tick what works and I'll reprice.", { thinkLabel: "Finding savings", ms: 900 });
    push({ type: "savings", items: [["Ubud villa → similar pool villa, 5 min further", 2850], ["Day 3 Nusa Penida (12h) → Lembongan half-day", 2297], ["Day 5 Kintamani → half-day Ubud culture", 1900], ["Drop the floating breakfast", 893], ["5 nights instead of 6", 6860]], flights: t.flights, onApply: async (v) => { t.ver++; t.total -= v; await ai(`Done — new total <b>${rupee(t.total)}</b>, down ${rupee(v)}. Saved as version ${t.ver}.`); feedback(); }, onFlights: async () => { user("Ask Mansi about flights"); await ai("Sent to Mansi with your target. She'll call today with flight options."); feedback(); } }); };
  const existing = async () => { S.flow = "existing"; setTitle("Bali · 6 nights · v6"); setSubtitle("QUOTED · 6–12 NOV · 2 ADULTS + 1 CHILD"); boardText("BALI · VERSION 6", "Seminyak 3N + Ubud 3N", "6–12 Nov · 2 adults + 1 child · ₹2,45,000", "kelingking"); await ai("Here it is as it stands. What would you like to change?", { ms: 500 }); itin(S.trip); chips(["Change a hotel", "Change a day", "Add a day", "Make it cheaper"], (l) => { user(l); l === "Change a hotel" ? hotelFlow() : l === "Change a day" ? dayFlow() : l === "Add a day" ? addDay() : savings(S.trip); }); };
  // flow 2
  const hotelFlow = async () => { S.flow = "hotel"; setTitle("Change a hotel"); boardText("YOUR STAYS", "Which one?", "Umalas Suites, nights 1–3 · D'Ethnic Ubud, nights 4–6", "pool_sea"); await ai("<b>Which one?</b> You've got two on this trip.", { ms: 500 });
    cards([{ imgs: ["pool_sea", "room_white"], name: "Umalas Suites · Seminyak", tag: "NIGHTS 1–3", why: "Deluxe Room · breakfast · ₹6,312/night", price: "", cx: "Non-refundable", _k: "S" }, { imgs: ["pool_resort", "room_gold"], name: "D'Ethnic Ubud Joglo Villas", tag: "NIGHTS 4–6", why: "Villa with Private Pool · breakfast · ₹7,371/night", price: "", cx: "Free cancellation", _k: "U" }], (c) => { if (c._k === "S") { user("The Seminyak one"); nonRefundable(); } else { user("The Ubud one"); hotelPref("Ubud"); } }, (c) => boardImg(c.imgs[0])); };
  const nonRefundable = async () => { boardText("HEADS UP", "Umalas is non-refundable.", "About ₹18,900 is already committed for those three nights.", "pool_sea"); await ai("One thing first: <b>Umalas Suites is on a non-refundable rate</b> — changing it means losing the ~₹18,900 already committed. The Ubud villa is free to cancel. Still want Seminyak options?", { ms: 600 });
    chips(["Show Seminyak options anyway", "Change the Ubud one instead", "Ask Mansi for an exception"], async (l) => { user(l); if (/Ubud/.test(l)) hotelPref("Ubud"); else if (/Mansi/.test(l)) { await ai("Sent to Mansi. She'll check with the hotel and call you back today."); feedback(); } else hotelPref("Seminyak", true); }); };
  const hotelPref = async (city, warn) => { await ai(`<b>What would make the ${city} stay better?</b>`, { ms: 400 }); chips(["Private pool villa", "Cheaper", "Closer to the centre", "4-star or above"], (l) => { user(l === "Private pool villa" ? SAY.villa : l); hotelOptions(city, l, warn); }); };
  const realHotels = (city, pref, cur) => { let hs = generateHotelsForCity(city, "Bali", "2026-11-06", "2026-11-12", 3);
    if (pref === "Private pool villa") { const p = hs.filter((h) => h.viewTags.includes("Private pool") || h.rooms.some((r) => r.amenities.includes("Private Pool"))); if (p.length >= 2) hs = p; }
    if (/4-star/.test(pref)) hs = hs.filter((h) => h.stars >= 4);
    if (pref === "Cheaper") hs = hs.filter((h) => h.pricePerNight < cur).length >= 2 ? hs.filter((h) => h.pricePerNight < cur) : hs;
    if (/centre/.test(pref)) hs = [...hs].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
    return hs.slice(0, 3).map((h, i) => ({ name: h.name, room: h.roomType, pn: h.pricePerNight, cx: h.freeCancellation ? "Free cancellation" : "Non-refundable", rec: i === 0, rt: (h.bookingScore / 2).toFixed(1), why: `${h.stars}-star in ${h.neighbourhood} · ${h.distanceFromCenter} km from the centre · ${h.mealPlan || "Breakfast"} · ${h.reviewCount} reviews`, imgs: h.images.slice(0, 3).map((x) => x.url) })); };
  const hotelOptions = async (city, pref, warn) => { const cur = city === "Ubud" ? 7371 : 6312; const sorted = realHotels(city, pref, cur);
    boardText(city.toUpperCase() + " · OPTIONS", "Three that fit.", "Prices per night · tap a card and the board follows", sorted[0].imgs[0]);
    await steps([`Reading your ${city} nights · ${rupee(cur)}/night`, pref === "Cheaper" ? "Searching under your current rate" : `Searching ${pref.toLowerCase()} within ₹2,000 of your rate`, "Checking cancellation terms", "Pricing three options"], 650);
    await ai(`Three that fit${warn ? " — the ₹18,900 is included in every delta" : ""}. Tap the dots to see more photos.`, { ms: 300 });
    cards(sorted.map((h) => ({ ...h, price: rupee(h.pn), sub: "/ night", d: (h.pn - cur) * 3 + (warn ? 18900 : 0), rec: h.rec && pref !== "Cheaper" })), (h) => { const d = h.d; user(h.name);
      summary({ title: "What changes", rows: [[`${city === "Ubud" ? "D'Ethnic Ubud Joglo Villas" : "Umalas Suites"} · ${rupee(cur)}/n`, `${h.name} · ${rupee(h.pn)}/n`], [city === "Ubud" ? "Free cancellation" : "Non-refundable", "Free cancellation"]], before: S.trip.total, after: S.trip.total + d, lose: d <= 0 ? null : warn ? "the ₹18,900 non-refundable amount" : "nothing — same nights, same board",
        onGo: async () => { S.trip.total += d; S.trip.ver++; const i = city === "Ubud" ? 1 : 0; S.trip.stays[i] = { ...S.trip.stays[i], name: h.name, pn: h.pn, img: h.imgs[0] }; toast(`Saved as version ${S.trip.ver}`); boardText("SAVED · V" + S.trip.ver, h.name, "Mansi can see it too", h.imgs[0]); await ai(`Saved as <b>version ${S.trip.ver}</b>. ${d > 0 ? "The extra " + rupee(d) + " goes on your next installment." : "You're " + rupee(d) + " lighter."}<span class="mut">Anything else you want changed, tell me now and I'll do it in one go.</span>`); feedback(); chips(["Change a day too", "Make it cheaper", "That's all"], (x) => { user(x); x === "Change a day too" ? dayFlow() : x === "Make it cheaper" ? savings(S.trip) : ai("Done. Have a lovely trip."); }); },
        onKeep: () => ai("Nothing changed. Want other options, or leave it?") }); }, (h) => { boardImg(h.imgs[0]); boardText(city.toUpperCase(), h.name, h.room + " · " + rupee(h.pn) + "/night · ★ " + h.rt); }); };
  // flow 3
  const dayFlow = async () => { S.flow = "day"; setTitle("Change a day"); boardText("YOUR DAYS", "Which day?", "Tap one — the board shows it", "kelingking"); await ai("Which day?", { ms: 400 });
    cards(S.trip.days.filter((d) => d.type === "Tour").map((d) => ({ imgs: [d.img], name: `Day ${d.d} · ${d.t.split(":")[0].split(" +")[0]}`, tag: d.h, why: d.t, price: rupee(d.p), _d: d })), (c) => { user("Day " + c._d.d); c._d.d === 3 ? day3() : c._d.d === 4 ? day4() : genericDay(c._d); }, (c) => { boardImg(c._d.img); boardText("DAY " + c._d.d + " · " + c._d.dt, c._d.t, c._d.h + " · " + rupee(c._d.p) + " · bundled tour"); }); };
  const day3 = async () => { boardText("DAY 3 · 08 NOV", "Nusa Penida — 12 hours.", "The longest day on the plan, with a 7:30 boat.", "kelingking"); await ai("Day 3 is the <b>West Nusa Penida trip — 12 hours</b> with an early boat. The longest day on the plan. Something gentler?", { ms: 500 });
    chips(["Shorter beach day", "Make it a leisure day", "Keep it, start later"], (l) => { user(l === "Shorter beach day" ? SAY.day3 : l); l === "Shorter beach day" ? day3Options() : l === "Make it a leisure day" ? leisure3() : ai("The boat leaves at 7:30, so a later start isn't possible on this one — but I can swap it for a shorter day.").then(() => chips(["Show shorter days"], (x) => { user(x); day3Options(); })); }); };
  const day3Options = async () => { await steps(["Reading Day 3 · 12h · ₹5,477 · bundled", "Searching beach days under 7 hours", "Checking they work for a 10-year-old", "Pricing three options"], 650); boardText("DAY 3 · OPTIONS", "Half the length.", "All fine for a 10-year-old", "phiphi"); await ai("Three beach days at half the length:", { ms: 300 });
    cards(BEACH.map((t) => ({ ...t, imgs: [t.img], tag: t.h, price: rupee(t.p), d: t.p - 5477 })), (t) => { const d = t.d; user(t.name); summary({ title: "What changes on Day 3", rows: [["West Nusa Penida + snorkelling · 12h", `${t.name} · ${t.h}`]], before: S.trip.total, after: S.trip.total + d, lose: "the Kelingking Beach viewpoint — only on the Nusa Penida day",
      onGo: async () => { S.trip.total += d; S.trip.ver++; S.trip.days[2] = { ...S.trip.days[2], t: t.name, h: t.h, p: t.p, img: t.img }; toast(`Saved as version ${S.trip.ver}`); boardText("SAVED · V" + S.trip.ver, "Day 3 is now " + t.h + ".", "You're " + rupee(d) + " lighter", t.img); await ai(`Saved as <b>version ${S.trip.ver}</b>.`); itin(S.trip, [3]); feedback(); chips(["Remove the ATV on day 4", "Add the Bali Swing", "That's all"], (x) => { user(x); x.startsWith("Remove") ? atv() : x.startsWith("Add") ? swingAlready() : ai("Done."); }); }, onKeep: () => ai("Kept Nusa Penida. The early start is worth it for Kelingking.") }); }, (t) => { boardImg(t.img); boardText("DAY 3 · OPTION", t.name, t.h + " · " + rupee(t.p)); }); };
  const leisure3 = () => summary({ title: "What changes on Day 3", rows: [["West Nusa Penida + snorkelling · 12h", "Leisure day — pool, spa, your own pace"]], before: S.trip.total, after: S.trip.total - 5477, lose: "the whole Nusa Penida day, including Kelingking", onGo: async () => { S.trip.total -= 5477; S.trip.ver++; S.trip.days[2] = { d: 3, dt: "08 Nov", t: "Leisure day at Umalas Suites", h: "—", p: 0, type: "Leisure", sep: true, img: "pool_sea" }; toast(`Saved as version ${S.trip.ver}`); boardText("SAVED · V" + S.trip.ver, "Day 3 is yours.", "Pool, spa, your own pace", "pool_sea"); await ai(`Saved as <b>version ${S.trip.ver}</b>. Want a spa or a candlelight dinner on it?`); chips(["Couples spa · +₹3,400", "Candlelight dinner · +₹4,200", "Leave it free"], (x) => { user(x); ai(/Leave/.test(x) ? "Left free." : "Added — it shows on the next version once you confirm."); }); feedback(); } });
  const day4 = async () => { boardText("DAY 4 · 09 NOV", "Ubud package — 5 hours.", "Bali Swing + ATV · one price", "swing"); await ai("Day 4 is the <b>Ubud package — Bali Swing + ATV, 5 hours</b>. What would you like?", { ms: 400 }); chips(["Remove the ATV, keep the swing", "Something more relaxed", "Keep it"], (l) => { user(l.startsWith("Remove") ? SAY.atv : l); l.startsWith("Remove") ? atv() : l.startsWith("Some") ? day3Options() : ai("Kept."); }); };
  const atv = async () => { boardText("DAY 4", "Sold as one package.", "Swing, ATV, transfers and tickets at one price", "swing"); await ai("Day 4 is sold as <b>one Ubud package</b> — swing, ATV, transfers and tickets together — so I can't drop just the ATV. What I can do is swap the whole day for a swing day without it. Two options, both cheaper:", { ms: 600 });
    cards(SWING.map((t) => ({ ...t, imgs: [t.img], tag: t.h, price: rupee(t.p), d: t.p - 4392 })), (t) => { const d = t.d; user(t.name); summary({ title: "What changes on Day 4", rows: [["Bali Swing + ATV tandem · 5h", `${t.name} · ${t.h}`]], before: S.trip.total, after: S.trip.total + d, lose: "the ATV ride — everything else stays", onGo: async () => { S.trip.total += d; S.trip.ver++; S.trip.days[3] = { ...S.trip.days[3], t: t.name, h: t.h, p: t.p }; toast(`Saved as version ${S.trip.ver}`); await ai(`Saved as <b>version ${S.trip.ver}</b>. Swing stays, ATV goes, ${rupee(d)} lighter.`); feedback(); }, onKeep: () => ai("Kept the ATV day.") }); }, (t) => boardImg(t.img)); };
  const swingAlready = async () => { boardText("DAY 4", "Already has the swing.", "Bali Swing at Ubud, with the ATV", "swing"); await ai("Good news — <b>Day 4 already includes the Bali Swing</b> at Ubud. See the day, or add a second swing stop on Day 5 at the terraces?", { ms: 500 }); chips(["Show Day 4", "Add swing to Day 5", "That's fine"], (l) => { user(l); ai(l === "Show Day 4" ? "Day 4 · 09 Nov · Bali Swing + ATV tandem (70 min) · 5h · ₹4,392 · transfers and tickets included." : l.startsWith("Add") ? "Day 5 would become Kintamani + Tegallalang Swing + coffee plantation — +₹640. Make that change?" : "Okay."); }); };
  const genericDay = async (d) => { await ai(`Day ${d.d} — shorter, different, or a free day?`, { ms: 400 }); chips(["Shorter", "Something different", "Make it a free day"], (x) => { user(x); day3Options(); }); };
  const addDay = async () => { boardText("ADD A DAY", "One more night.", "Seminyak or Ubud?", "tegallalang"); await ai("One more night — <b>Seminyak or Ubud?</b> I'll add the stay and a day to match, priced before anything changes.", { ms: 500 }); chips(["One more night in Ubud", "One more night in Seminyak"], (l) => { user(l); const ub = /Ubud/.test(l); summary({ title: "What changes", rows: [["6 nights · 6–12 Nov", "7 nights · 6–13 Nov"], [ub ? "Ubud 3N" : "Seminyak 3N", ub ? "Ubud 4N + leisure day" : "Seminyak 4N + beach day"]], before: S.trip.total, after: S.trip.total + (ub ? 7371 : 6312) + 2359, lose: "nothing — the return flight date needs Mansi to confirm", onGo: async () => { S.trip.total += (ub ? 7371 : 6312) + 2359; S.trip.ver++; toast(`Saved as version ${S.trip.ver}`); await ai(`Saved as <b>version ${S.trip.ver}</b>. I've flagged the return date to Mansi.`); feedback(); } }); }); };
  // intent matcher
  const handle = async (t) => { const s = t.toLowerCase(); user(t);
    if (userState === "customer" && /change|swap|cancel|add|remove|upgrade|shift|reschedule/.test(s)) return supportOnly();
    if (/female|lady agent|male agent/.test(s)) { await ai("I can't pick your consultant by gender, but I can ask the team to call — Mansi's looking after your trip. Set that up?"); chips(["Yes, ask for a call", "No thanks"], (x) => { user(x); ai(x.startsWith("Yes") ? "Done — someone will call you today." : "Okay."); }); return; }
    if (/discount|offer|deal\b/.test(s)) { await ai("There's already a <b>2.5% discount</b> on this quote — ₹2,385 off. Anything beyond that is Mansi's call. Pass it on, or see where the cost sits?"); chips(["Pass it to Mansi", "Where the cost sits"], (x) => { user(x); x.startsWith("Pass") ? ai("Sent. She'll call today.") : savings(S.trip); }); return; }
    if (/flight|airline/.test(s)) { boardText("FLIGHTS", "That one's Mansi's.", "No live fares in here — anything I said would be out of date.", "sapa"); await ai("Flights I can't touch — no live fares in here, so anything I told you would be stale. <b>Mansi</b> can check real availability. Ask her to call? Everything else I can change now."); chips(["Ask Mansi to call", "Change something else"], (x) => { user(x); x.startsWith("Ask") ? ai("Sent. She'll call today.") : existing(); }); return; }
    if (/weather|rain|temperature|monsoon/.test(s)) { await ai("November in Bali is the start of the wet season — 27–31°C, short heavy showers mostly in the afternoon, mornings usually clear. Quieter and cheaper than July–August.<span class=\"mut\">Approximate — no live forecast.</span>"); if (S.flow === "new" && S.cur) { await ai("Shall we carry on?", { ms: 400 }); nextSlot(); } return; }
    if (/how far|distance|beach.*hotel|hotel.*beach/.test(s)) { boardText("UMALAS SUITES", "1.2 km to Seminyak Beach.", "6 minutes by car · 15 on foot", "pool_sea"); await ai("Seminyak Beach is <b>1.2 km from Umalas Suites</b> — 6 minutes by car, 15 on foot. The Ubud villa is inland, about 1h10 from the nearest beach."); feedback(); return; }
    if (/atv/.test(s) && /remove|drop|without|take out/.test(s)) return atv(); if (/swing/.test(s)) return swingAlready();
    if (/day\s*3|long day|too long|heavy|tiring|lighter/.test(s)) return day3(); if (/day\s*4/.test(s)) return day4();
    if (/day|activity|tour/.test(s) && /change|swap|different/.test(s)) return dayFlow();
    if (/villa|pool/.test(s)) return hotelOptions("Ubud", "Private pool villa"); if (/hotel|stay|resort|room/.test(s)) return hotelFlow();
    if (/cheap|budget|lakh|reduce/.test(s)) return savings(S.trip); if (/add.*day|one more day|extra day/.test(s)) return addDay();
    if (/explor|just looking|browse/.test(s)) return explore();
    if (/maldiv|dubai|japan|europe|singapore|turkey|paris|london|goa|kashmir|bali|thailand|vietnam|honeymoon|trip|plan|night/.test(s)) { if (S.flow !== "new") { S.flow = "new"; S.slots = {}; } return parseFree(t); }
    await ai("I can change hotels, days, add-ons and the budget on your trip, or build a new one. Which?"); chips(["Change a hotel", "Change a day", "Plan a new trip"], (l) => { user(l); l === "Change a hotel" ? hotelFlow() : l === "Change a day" ? dayFlow() : startNew(); }); };
  const listen = () => { setListening(true); const phrase = S.flow === "new" ? SAY.freeform : S.flow === "day" ? SAY.day3 : SAY.hotel; setTimeout(() => { setListening(false); setInp(phrase); setTimeout(() => { setInp(""); handle(phrase); }, 500); }, 1700); };

  // boot
  useEffect(() => { const t = setTimeout(() => { if (mode === "existing") existing(); else if (mode === "hotel") { boardText("BALI · VERSION 6", "Seminyak 3N + Ubud 3N", "₹2,45,000 · 6–12 Nov", "kelingking"); ai("Hey Ananya 👋 Bali's at version 6, ₹2,45,000.", { ms: 400 }).then(() => { user(SAY.hotel); hotelFlow(); }); } else if (mode === "day") { boardText("BALI · VERSION 6", "Seminyak 3N + Ubud 3N", "₹2,45,000 · 6–12 Nov", "kelingking"); ai("Hey Ananya 👋 Bali's at version 6, ₹2,45,000.", { ms: 400 }).then(() => { user(SAY.day3); day3(); }); } else welcome(); if (mode === "voice") setTimeout(listen, 900); }, RM ? 0 : 650); return () => clearTimeout(t); }, []); // eslint-disable-line
  useEffect(() => { scroll(); }, [blocks]);
  useEffect(() => { const h = () => setMenu(false); document.addEventListener("click", h); return () => document.removeEventListener("click", h); }, []);

  // sheet drag
  const onDown = (e) => { drag.current = { y: e.clientY, pct: sheetPct }; e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (!drag.current) return; const dy = drag.current.y - e.clientY; setSheetPct(Math.max(28, Math.min(88, drag.current.pct + (dy / rect.height) * 100))); };
  const onUp = () => { drag.current = null; };

  const send = () => { const v = inp.trim(); if (!v) return; setInp(""); handle(v); };
  const slotsNode = board.slots && <div className="ai-slots">{SLOTS.map(([k, l]) => <span key={k} className={"ai-slot" + (board.slots[k] ? " on" : board.slots._cur === k ? " cur" : "")}>{board.slots[k] ? l + " · " + String(board.slots[k]).split(" ·")[0].split(" +")[0] : l}</span>)}</div>;
  const tilesNode = board.tiles && <div className="ai-tiles">{board.tiles.map((k, i) => <div key={i} className={"ai-tl" + (k ? "" : " sk")}>{k && <><img src={src(k)} alt="" /><span>Day {i + 2}</span></>}</div>)}</div>;

  return (
    <div className="ai-root" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: rect.width < 420 ? 0 : 44 }}>
      <style>{CSS}</style>
      <div className="ai-aurora" />
      <div className="ai-bg">{bgStack.map((k, i) => <img key={k} src={src(k)} alt="" className={i === bgStack.length - 1 ? "on" : ""} />)}<div className="sh" /></div>
      <div className="ai-top">
        <button className="ai-ic" aria-label="Close" onClick={onClose}>✕</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}><Orb size={26} /><div style={{ minWidth: 0 }}><b style={{ fontSize: 13.5, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</b><small style={{ display: "block", fontSize: 10, color: "#9FB3B0", fontWeight: 600, letterSpacing: ".04em" }}>{subtitle}</small></div></div>
        <button className="ai-ic" aria-label="More" onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); }}>⋯</button>
      </div>
      <div className="ai-focus"><div className="ai-eyebrow">{board.eyebrow}</div><h2 className="ai-h2">{board.h2}</h2>{board.sub && <div className="ai-sub">{board.sub}</div>}{slotsNode}{tilesNode}</div>
      <div className="ai-bigorb"><Orb size={120} /></div>
      {menu && <div className="ai-menu" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setChats((c) => [{ id: Date.now(), title: "New chat", sub: "Just now", img: "swing", active: true }, ...c.map((x) => ({ ...x, active: false }))]); S.trip = JSON.parse(JSON.stringify(TRIP)); welcome(); toast("New chat"); setMenu(false); }}>＋ New chat</button>
        <button onClick={() => { setDrawer(true); setMenu(false); }}>🕘 Chat history</button>
        <button className="danger" onClick={() => { setConfirm(chats.find((c) => c.active)); setMenu(false); }}>🗑 Delete this chat</button>
      </div>}
      <div className="ai-sheet" style={{ height: sheetPct + "%" }}>
        <div className="ai-handle" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}><i /></div>
        <div className="ai-thread" ref={threadRef}>
          {blocks.map((b) => {
            switch (b.type) {
              case "ai": return <AiMsg key={b.id} html={b.html} />;
              case "user": return <div key={b.id} className="ai-msg u">{b.text}</div>;
              case "think": return <Thinking key={b.id} label={b.label} done={b.done} />;
              case "chips": return <Chips key={b.id} items={b.items} primary={b.primary} multi={b.multi} onPick={b.onPick} />;
              case "cards": return <CardGroup key={b.id} cards={b.cards} onChoose={b.onChoose} onFocus={b.onFocus} />;
              case "summary": return <Summary key={b.id} {...b} />;
              case "savings": return <Savings key={b.id} {...b} />;
              case "itin": return <ItinCard key={b.id} t={b.t} changed={b.changed} />;
              case "feedback": return <Feedback key={b.id} toast={toast} />;
              default: return null;
            }
          })}
        </div>
        <div className="ai-inbar">
          {listening && <div className="ai-listen"><div className="ai-wave"><i /><i /><i /><i /><i /><i /></div><span style={{ fontSize: 12.5, color: "#9FB3B0" }}>Listening…</span></div>}
          <div className="ai-box" style={{ opacity: listening ? 0.3 : 1 }}>
            <button className="ic" aria-label="Add" style={{ fontSize: 20 }}>＋</button>
            <input ref={inputRef} value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask anything…" autoComplete="off" />
            <button className="ic" aria-label="Speak" onClick={listen}>🎙</button>
            <button className="ic send" aria-label="Send" onClick={send}>↑</button>
          </div>
          <div className="ai-hint">Nothing is saved until you tap Confirm</div>
        </div>
      </div>
      {drawer && <div className="ai-drawer" onClick={(e) => { if (e.target === e.currentTarget) setDrawer(false); }}><div className="sh"><div className="ai-grab" /><h3>Your chats <button onClick={() => { setChats((c) => [{ id: Date.now(), title: "New chat", sub: "Just now", img: "swing", active: true }, ...c.map((x) => ({ ...x, active: false }))]); S.trip = JSON.parse(JSON.stringify(TRIP)); welcome(); setDrawer(false); toast("New chat"); }}>＋ New chat</button></h3>
        {chats.map((c) => <div key={c.id} className={"ai-hrow" + (c.active ? " active" : "")}><div className="i"><img src={src(c.img)} alt="" /></div><div className="t" onClick={() => { setChats((cs) => cs.map((x) => ({ ...x, active: x.id === c.id }))); setTitle(c.title); setDrawer(false); toast("Opened “" + c.title + "”"); }}><b>{c.title}</b><span>{c.sub}</span></div><button className="del" aria-label="Delete" onClick={() => setConfirm(c)}>🗑</button></div>)}
      </div></div>}
      {confirm && <div className="ai-confirm"><div className="box"><b>Delete this chat?</b><p>Saved itinerary versions stay in My Trips.</p><div className="ai-act" style={{ marginTop: 0 }}><button onClick={() => setConfirm(null)}>Keep</button><button className="go" onClick={() => { const c = confirm; setConfirm(null); setChats((cs) => { const n = cs.filter((x) => x.id !== c.id); if (c.active && n[0]) n[0].active = true; return n; }); toast("Chat deleted"); if (c.active) welcome(); }}>Delete</button></div></div></div>}
      {toastMsg && <div className="ai-toast">{toastMsg}</div>}
    </div>
  );
}
