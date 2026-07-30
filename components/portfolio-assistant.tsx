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
        className="pa-launcher"
        aria-label={open ? "Close assistant" : "Chat with Abhinav's assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-robot"}`} aria-hidden="true" />
        {!open && <span className="pa-launcher-label">Ask about Abhinav</span>}
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
.pa-launcher{position:fixed;right:20px;bottom:20px;z-index:1000;display:inline-flex;align-items:center;gap:10px;
  padding:12px 18px;border:none;border-radius:999px;cursor:pointer;font-weight:600;font-size:15px;
  color:#fff;background:linear-gradient(135deg,#0b4f6c,#12b3c9);box-shadow:0 10px 30px rgba(11,79,108,.35);
  transition:transform .15s ease,box-shadow .15s ease;}
.pa-launcher:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(11,79,108,.45);}
.pa-launcher i{font-size:20px;line-height:1;}
.pa-launcher-label{white-space:nowrap;}
@media(max-width:480px){.pa-launcher-label{display:none;}}

.pa-panel{position:fixed;right:20px;bottom:88px;z-index:1000;width:min(400px,calc(100vw - 32px));
  height:min(600px,calc(100vh - 130px));display:flex;flex-direction:column;overflow:hidden;
  background:#fff;color:#1a1a1a;border:1px solid #e3e8ee;border-radius:18px;
  box-shadow:0 24px 60px rgba(16,32,50,.28);opacity:0;transform:translateY(16px) scale(.98);
  pointer-events:none;transition:opacity .18s ease,transform .18s ease;}
.pa-panel.pa-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}

.pa-header{display:flex;align-items:center;gap:12px;padding:14px 16px;color:#fff;
  background:linear-gradient(135deg,#0b4f6c,#12b3c9);}
.pa-header-icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;
  background:rgba(255,255,255,.18);font-size:20px;}
.pa-header-text{display:flex;flex-direction:column;line-height:1.3;flex:1;}
.pa-header-text strong{font-size:15px;}
.pa-header-text span{font-size:12px;opacity:.85;}
.pa-close{background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:.9;}
.pa-close:hover{opacity:1;}

.pa-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;
  background:#f7f9fb;}
.pa-msg{max-width:85%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;
  white-space:pre-wrap;word-wrap:break-word;}
.pa-assistant{align-self:flex-start;background:#fff;border:1px solid #e6ebf1;border-bottom-left-radius:4px;color:#20303f;}
.pa-user{align-self:flex-end;background:linear-gradient(135deg,#0b4f6c,#12b3c9);color:#fff;border-bottom-right-radius:4px;}

.pa-suggestions{display:flex;flex-direction:column;gap:8px;margin-top:6px;}
.pa-suggestions button{text-align:left;padding:9px 12px;border:1px solid #cfe0e8;border-radius:10px;
  background:#fff;color:#0b4f6c;font-size:13px;cursor:pointer;transition:background .12s,border-color .12s;}
.pa-suggestions button:hover:not(:disabled){background:#eef7fa;border-color:#12b3c9;}
.pa-suggestions button:disabled{opacity:.6;cursor:default;}

.pa-typing{display:inline-flex;gap:4px;align-items:center;}
.pa-typing i{width:6px;height:6px;border-radius:50%;background:#9fb3c0;display:inline-block;animation:pa-blink 1.2s infinite;}
.pa-typing i:nth-child(2){animation-delay:.2s;}
.pa-typing i:nth-child(3){animation-delay:.4s;}
@keyframes pa-blink{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}

.pa-input{display:flex;gap:8px;padding:12px;border-top:1px solid #eceff3;background:#fff;}
.pa-input input{flex:1;padding:11px 14px;border:1px solid #d6dde5;border-radius:10px;font-size:14px;outline:none;color:#1a1a1a;background:#fff;}
.pa-input input:focus{border-color:#12b3c9;box-shadow:0 0 0 3px rgba(18,179,201,.15);}
.pa-input button{width:44px;border:none;border-radius:10px;cursor:pointer;color:#fff;font-size:16px;
  background:linear-gradient(135deg,#0b4f6c,#12b3c9);transition:opacity .12s;}
.pa-input button:disabled{opacity:.45;cursor:default;}

.pa-footer{padding:8px 12px;font-size:11px;color:#8aa0b0;text-align:center;background:#fff;border-top:1px solid #f0f3f6;}

@media (prefers-color-scheme: dark){
  .pa-panel{background:#0f1720;color:#e6edf3;border-color:#22303c;}
  .pa-messages{background:#0b1219;}
  .pa-assistant{background:#16212c;border-color:#243441;color:#dbe6ef;}
  .pa-suggestions button{background:#16212c;border-color:#284050;color:#7fd6e6;}
  .pa-suggestions button:hover:not(:disabled){background:#1b2a36;}
  .pa-input{background:#0f1720;border-color:#22303c;}
  .pa-input input{background:#0b1219;border-color:#2a3a47;color:#e6edf3;}
  .pa-footer{background:#0f1720;color:#5f7688;border-color:#1b2732;}
}
`;
