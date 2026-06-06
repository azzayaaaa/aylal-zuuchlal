"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Bot, CalendarDays, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lastUserIntent, setLastUserIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Сайн байна уу? Төсөв, хоног, гэр бүл/хос/найзууд эсэх, Fuji, Disneyland, shopping, anime сонирхлоо хэлбэл Tokyo-Fuji itinerary санал болгоё.",
    },
  ]);
  const bookingHref = useMemo(() => `/booking?prefill=${encodeURIComponent(lastUserIntent)}`, [lastUserIntent]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setLastUserIntent(question);
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: question }]);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
        signal: controller.signal,
      });
      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.answer ?? "Хариу авахад алдаа гарлаа." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "Чатбот түр удааширлаа. Дахин оролдоно уу." },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <div id="chat" className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="chat-panel mb-3 flex h-[520px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[8px] bg-white shadow-2xl ring-1 ring-[#d8cebd]">
          <div className="flex items-center justify-between bg-[#10201d] px-4 py-3 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="h-5 w-5 text-[#f4c76b]" />
              Sakura AI туслах
            </div>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10" aria-label="Чат хаах">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbf7ef] p-4">
            <div className="rounded-[8px] border border-[#ead9c4] bg-white px-4 py-3 text-xs text-[#6b716b]">
              <div className="flex items-center gap-2 font-semibold text-[#276457]"><Sparkles className="h-4 w-4" />Жишээ асуулт</div>
              <p className="mt-2">“5 сая төсөвтэй, гэр бүлээрээ Disney + Fuji сонирхож байна”</p>
            </div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-bubble rounded-[8px] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-[#276457] text-white" : "mr-8 bg-white text-[#34443e] ring-1 ring-[#ead9c4]"}`}>
                {message.text}
              </div>
            ))}
            {loading ? (
              <div className="typing-dots mr-8 rounded-[8px] bg-white px-4 py-3 text-sm text-[#6b716b] ring-1 ring-[#ead9c4]">
                <span /> <span /> <span />
              </div>
            ) : null}
          </div>

          {lastUserIntent ? (
            <div className="border-t border-[#ead9c4] bg-[#fffaf0] px-3 py-2">
              <Link href={bookingHref} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#e8b95e] text-sm font-semibold text-[#1c1710]">
                <CalendarDays className="h-4 w-4" />
                Энэ мэдээллээр захиалах
              </Link>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-[#ead9c4] bg-white p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 rounded-full border border-[#d8cebd] px-4 outline-none focus:border-[#276457] focus:ring-2 focus:ring-[#276457]/20" placeholder="Жишээ: 5 сая төсөвтэй бол?" />
            <button disabled={loading} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#276457] text-white disabled:opacity-60" aria-label="Илгээх">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
      <button type="button" onClick={() => setOpen((value) => !value)} className="chat-launcher inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e8b95e] text-[#1c1710] shadow-xl ring-1 ring-black/10 transition hover:bg-[#f6cf7a]" aria-label="Чатбот нээх">
        <Bot className="h-6 w-6" />
      </button>
    </div>
  );
}
