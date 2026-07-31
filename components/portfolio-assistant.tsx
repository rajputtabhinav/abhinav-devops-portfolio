"use client";

import { useEffect, useRef, useState } from "react";
import { brandingName } from "@/lib/portfolio-data";
import { SiteLogo } from "@/components/site-logo";

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
  content: "Hi 👋 Ask me anything about Abhinav — his experience, skills, or projects.",
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
        {open ? <i className="bi bi-x-lg" aria-hidden="true" /> : <SiteLogo size={28} className="pa-logo" />}
      </button>

      <div className={`pa-panel ${open ? "pa-open" : ""}`} role="dialog" aria-label="Portfolio assistant" aria-hidden={!open}>
        <div className="pa-header">
          <div className="pa-header-icon"><SiteLogo size={20} /></div>
          <div className="pa-header-text">
            <strong>Ask about {brandingName.split(" / ")[0]}</strong>
          </div>
          <button type="button" className="pa-close" aria-label="Close" onClick={() => setOpen(false)}>
            <i className="bi bi-x-lg" aria-hidden="true" />
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
      </div>

      <style>{paStyles}</style>
    </>
  );
}

const paStyles = `
:root{--pa-accent:#0f766e;--pa-line:#e6e9ec;--pa-bg:#ffffff;--pa-soft:#f4f6f7;--pa-ink:#1f2937;--pa-sub:#6b7280;}

.pa-launcher{position:fixed;right:24px;bottom:24px;z-index:99998;width:54px;height:54px;
  display:grid;place-items:center;border:none;border-radius:50%;cursor:pointer;color:#fff;
  background:var(--pa-accent);box-shadow:0 6px 18px rgba(15,118,110,.28);
  transition:transform .18s ease,box-shadow .18s ease;}
.pa-launcher:hover{transform:translateY(-2px);box-shadow:0 10px 22px rgba(15,118,110,.36);}
.pa-launcher i{font-size:20px;line-height:1;}
.pa-launcher-open{background:#111827;}

.pa-panel{position:fixed;right:24px;bottom:24px;z-index:99998;width:min(380px,calc(100vw - 32px));
  height:min(620px,calc(100vh - 150px));display:flex;flex-direction:column;overflow:hidden;
  background:var(--pa-bg);color:var(--pa-ink);border:1px solid var(--pa-line);border-radius:16px;
  box-shadow:0 16px 48px rgba(17,24,39,.16);opacity:0;transform:translateY(12px);transform-origin:bottom right;
  pointer-events:none;transition:opacity .16s ease,transform .16s ease;}
.pa-panel.pa-open{opacity:1;transform:translateY(0);pointer-events:auto;}

.pa-header{display:flex;align-items:center;gap:12px;padding:20px 18px;border-bottom:1px solid var(--pa-line);
  background:color-mix(in srgb, var(--pa-accent) 10%, transparent);
  backdrop-filter:blur(10px) saturate(140%);-webkit-backdrop-filter:blur(10px) saturate(140%);}
.pa-header-icon{width:36px;height:36px;border-radius:9px;display:grid;place-items:center;
  background:var(--pa-accent);color:#fff;}
.pa-header-text{flex:1;}
.pa-header-text strong{font-size:15.5px;font-weight:600;color:var(--pa-ink);}
.pa-close{background:transparent;border:none;color:var(--pa-sub);width:28px;height:28px;border-radius:7px;font-size:13px;cursor:pointer;display:grid;place-items:center;transition:background .15s,color .15s;}
.pa-close:hover{background:var(--pa-soft);color:var(--pa-ink);}

.pa-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.pa-messages::-webkit-scrollbar{width:6px;}
.pa-messages::-webkit-scrollbar-thumb{background:#d3d8dd;border-radius:6px;}
.pa-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:14px;line-height:1.5;
  white-space:pre-wrap;word-wrap:break-word;}
.pa-assistant{align-self:flex-start;background:var(--pa-soft);color:var(--pa-ink);}
.pa-user{align-self:flex-end;background:var(--pa-accent);color:#fff;}

.pa-suggestions{display:flex;flex-direction:column;gap:8px;margin-top:2px;}
.pa-suggestions button{text-align:left;padding:10px 12px;border:1px solid var(--pa-line);border-radius:10px;
  background:var(--pa-bg);color:var(--pa-ink);font-size:13px;cursor:pointer;transition:background .12s,border-color .12s;}
.pa-suggestions button:hover:not(:disabled){background:var(--pa-soft);border-color:#cfd4d9;}
.pa-suggestions button:disabled{opacity:.55;cursor:default;}

.pa-typing{display:inline-flex;gap:4px;align-items:center;}
.pa-typing i{width:6px;height:6px;border-radius:50%;background:#9aa4ae;display:inline-block;animation:pa-blink 1.3s infinite;}
.pa-typing i:nth-child(2){animation-delay:.18s;}
.pa-typing i:nth-child(3){animation-delay:.36s;}
@keyframes pa-blink{0%,60%,100%{opacity:.3;}30%{opacity:1;}}

.pa-input{display:flex;gap:8px;padding:12px;border-top:1px solid var(--pa-line);}
.pa-input input{flex:1;padding:11px 13px;border:1px solid var(--pa-line);border-radius:10px;font-size:14px;outline:none;color:var(--pa-ink);background:var(--pa-bg);transition:border-color .15s;}
.pa-input input:focus{border-color:var(--pa-accent);}
.pa-input button{width:42px;border:none;border-radius:10px;cursor:pointer;color:#fff;font-size:15px;
  background:var(--pa-accent);transition:opacity .12s;}
.pa-input button:disabled{opacity:.4;cursor:default;}

@media(max-width:480px){
  .pa-panel{right:12px;left:12px;width:auto;bottom:86px;}
  .pa-launcher{right:16px;bottom:16px;}
}

@media (prefers-color-scheme: dark){
  :root{--pa-accent:#2dd4bf;--pa-line:#232c33;--pa-bg:#111a1d;--pa-soft:#182227;--pa-ink:#e6edf0;--pa-sub:#8a97a0;}
  .pa-launcher{color:#04211d;}
  .pa-header-icon{color:#04211d;}
  .pa-user{color:#04211d;}
  .pa-input button{color:#04211d;}
  .pa-panel{box-shadow:0 16px 48px rgba(0,0,0,.5);}
  .pa-messages::-webkit-scrollbar-thumb{background:#2b353c;}
}
`;
