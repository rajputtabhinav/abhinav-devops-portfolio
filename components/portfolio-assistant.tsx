"use client";

import { useEffect, useRef, useState } from "react";
import { brandingName } from "@/lib/portfolio-data";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Give me a 30-second overview of Abhinav.",
  "What's his experience with LLMs and AI agents?",
  "Is he a good fit for an AI Engineer role?",
  "What has he built at Netweb?",
  "What's his strongest tech stack?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! 👋 I'm Abhinav's portfolio assistant. Ask me anything about his experience, skills, or projects — I'm happy to help you figure out if he's a fit for your team.",
};

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setInput("");

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Something went wrong.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I didn't catch that — could you rephrase?",
          };
          return copy;
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "The assistant is unavailable right now.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `${message} You can reach Abhinav directly via the Contact section.`,
        };
        return copy;
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        className={`pa-launcher ${open ? "pa-launcher-open" : ""}`}
        aria-label={open ? "Close assistant" : "Chat with Abhinav's assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Ask about Abhinav"
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-robot"}`} aria-hidden="true" />
        {!open && <span className="pa-dot" aria-hidden="true" />}
      </button>

      <div className={`pa-panel ${open ? "pa-open" : ""}`} role="dialog" aria-label="Portfolio assistant" aria-hidden={!open}>
        <div className="pa-header">
          <div className="pa-header-icon"><i className="bi bi-robot" aria-hidden="true" /></div>
          <div className="pa-header-text">
            <strong>Portfolio Assistant</strong>
            <span>Ask anything about {brandingName}</span>
          </div>
          <button type="button" className="pa-close" aria-label="Close" onClick={() => setOpen(false)}>
            <i className="bi bi-dash-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="pa-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`pa-msg pa-${m.role}`}>
              {m.content || (busy && i === messages.length - 1 ? <span className="pa-typing"><i /><i /><i /></span> : "")}
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="pa-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="pa-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about his experience, skills, projects…"
            aria-label="Message"
            disabled={busy}
          />
          <button type="submit" aria-label="Send" disabled={busy || !input.trim()}>
            <i className="bi bi-send-fill" aria-hidden="true" />
          </button>
        </form>
        <div className="pa-footer">AI assistant · answers may be imperfect · verify key details with Abhinav</div>
      </div>

      <style>{paStyles}</style>
    </>
  );
}

const paStyles = `
:root{--pa-accent:var(--accent-color,#34b7a7);--pa-accent-deep:#0f766e;}

/* Launcher: logo-only round button, stacked ABOVE the scroll-top arrow */
.pa-launcher{position:fixed;right:15px;bottom:70px;z-index:99998;width:58px;height:58px;
  display:grid;place-items:center;border:none;border-radius:50%;cursor:pointer;color:#fff;
  background:radial-gradient(circle at 30% 25%,#5fd0c0,var(--pa-accent) 55%,var(--pa-accent-deep));
  box-shadow:0 8px 22px rgba(15,118,110,.42),0 0 0 6px rgba(52,183,167,.14);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease;}
.pa-launcher::after{content:"";position:absolute;inset:-6px;border-radius:50%;
  border:2px solid rgba(52,183,167,.35);animation:pa-pulse 2.6s ease-out infinite;}
.pa-launcher-open::after{display:none;}
.pa-launcher:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 30px rgba(15,118,110,.55),0 0 0 8px rgba(52,183,167,.18);}
.pa-launcher i{font-size:24px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.2));}
.pa-launcher-open{background:linear-gradient(135deg,#0f766e,#115e59);}
.pa-dot{position:absolute;top:11px;right:11px;width:11px;height:11px;border-radius:50%;
  background:#37e6a0;border:2px solid #fff;box-shadow:0 0 8px rgba(55,230,160,.9);}
@keyframes pa-pulse{0%{transform:scale(.85);opacity:.7}70%{transform:scale(1.25);opacity:0}100%{opacity:0}}

/* Panel: modern glass card */
.pa-panel{position:fixed;right:15px;bottom:140px;z-index:99998;width:min(390px,calc(100vw - 30px));
  height:min(590px,calc(100vh - 170px));display:flex;flex-direction:column;overflow:hidden;
  background:rgba(255,255,255,.86);backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);
  color:#0f2b28;border:1px solid rgba(52,183,167,.28);border-radius:22px;
  box-shadow:0 24px 70px rgba(15,60,52,.28);opacity:0;transform:translateY(18px) scale(.96);transform-origin:bottom right;
  pointer-events:none;transition:opacity .22s ease,transform .28s cubic-bezier(.34,1.3,.5,1);}
.pa-panel.pa-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}

.pa-header{display:flex;align-items:center;gap:12px;padding:15px 16px;color:#fff;position:relative;
  background:linear-gradient(120deg,var(--pa-accent-deep),var(--pa-accent) 70%,#5fd0c0);}
.pa-header-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;
  background:rgba(255,255,255,.2);font-size:21px;backdrop-filter:blur(4px);}
.pa-header-text{display:flex;flex-direction:column;line-height:1.35;flex:1;}
.pa-header-text strong{font-size:15px;letter-spacing:.2px;}
.pa-header-text span{font-size:11.5px;opacity:.9;display:inline-flex;align-items:center;gap:6px;}
.pa-header-text span::before{content:"";width:7px;height:7px;border-radius:50%;background:#37e6a0;box-shadow:0 0 6px #37e6a0;}
.pa-close{background:rgba(255,255,255,.15);border:none;color:#fff;width:30px;height:30px;border-radius:9px;font-size:15px;cursor:pointer;display:grid;place-items:center;transition:background .15s;}
.pa-close:hover{background:rgba(255,255,255,.28);}

.pa-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;
  background:linear-gradient(180deg,rgba(240,251,249,.6),rgba(235,248,246,.35));}
.pa-messages::-webkit-scrollbar{width:6px;}
.pa-messages::-webkit-scrollbar-thumb{background:rgba(52,183,167,.35);border-radius:6px;}
.pa-msg{max-width:86%;padding:11px 14px;border-radius:16px;font-size:14px;line-height:1.55;
  white-space:pre-wrap;word-wrap:break-word;animation:pa-in .25s ease;}
@keyframes pa-in{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
.pa-assistant{align-self:flex-start;background:#fff;border:1px solid rgba(52,183,167,.22);
  border-bottom-left-radius:5px;color:#12352f;box-shadow:0 2px 8px rgba(15,118,110,.06);}
.pa-user{align-self:flex-end;color:#fff;border-bottom-right-radius:5px;
  background:linear-gradient(135deg,var(--pa-accent-deep),var(--pa-accent));box-shadow:0 3px 10px rgba(15,118,110,.25);}

.pa-suggestions{display:flex;flex-direction:column;gap:8px;margin-top:4px;}
.pa-suggestions button{text-align:left;padding:10px 13px;border:1px solid rgba(52,183,167,.35);border-radius:12px;
  background:rgba(255,255,255,.7);color:var(--pa-accent-deep);font-size:13px;font-weight:500;cursor:pointer;
  transition:transform .12s,background .15s,border-color .15s;}
.pa-suggestions button:hover:not(:disabled){background:#fff;border-color:var(--pa-accent);transform:translateX(3px);}
.pa-suggestions button:disabled{opacity:.55;cursor:default;}

.pa-typing{display:inline-flex;gap:5px;align-items:center;padding:2px 0;}
.pa-typing i{width:7px;height:7px;border-radius:50%;background:var(--pa-accent);display:inline-block;animation:pa-blink 1.2s infinite;}
.pa-typing i:nth-child(2){animation-delay:.2s;}
.pa-typing i:nth-child(3){animation-delay:.4s;}
@keyframes pa-blink{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-4px);}}

.pa-input{display:flex;gap:9px;padding:12px;border-top:1px solid rgba(52,183,167,.18);background:rgba(255,255,255,.8);}
.pa-input input{flex:1;padding:12px 15px;border:1px solid rgba(52,183,167,.3);border-radius:12px;font-size:14px;outline:none;color:#12352f;background:#fff;transition:border-color .15s,box-shadow .15s;}
.pa-input input:focus{border-color:var(--pa-accent);box-shadow:0 0 0 3px rgba(52,183,167,.18);}
.pa-input button{width:46px;border:none;border-radius:12px;cursor:pointer;color:#fff;font-size:16px;
  background:linear-gradient(135deg,var(--pa-accent-deep),var(--pa-accent));transition:opacity .12s,transform .12s;}
.pa-input button:not(:disabled):hover{transform:scale(1.05);}
.pa-input button:disabled{opacity:.4;cursor:default;}

.pa-footer{padding:8px 12px;font-size:10.5px;color:#6b8f88;text-align:center;background:rgba(255,255,255,.8);}

@media(max-width:480px){
  .pa-panel{right:10px;left:10px;width:auto;bottom:135px;}
  .pa-launcher{right:14px;bottom:66px;}
}

@media (prefers-color-scheme: dark){
  :root{--pa-accent:#2dd4bf;}
  .pa-panel{background:rgba(13,26,24,.9);color:#dcefe9;border-color:rgba(45,212,191,.25);box-shadow:0 24px 70px rgba(0,0,0,.55);}
  .pa-messages{background:linear-gradient(180deg,rgba(9,20,18,.7),rgba(11,25,22,.5));}
  .pa-assistant{background:#122421;border-color:rgba(45,212,191,.2);color:#cfeae3;box-shadow:none;}
  .pa-suggestions button{background:rgba(18,36,33,.8);border-color:rgba(45,212,191,.3);color:#7fe6d6;}
  .pa-suggestions button:hover:not(:disabled){background:#16302b;}
  .pa-input{background:rgba(13,26,24,.9);border-color:rgba(45,212,191,.18);}
  .pa-input input{background:#0c1a18;border-color:rgba(45,212,191,.28);color:#dcefe9;}
  .pa-footer{background:rgba(13,26,24,.9);color:#5b7f78;}
}
`;
