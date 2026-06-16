"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function ChatPage() {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  const { getToken, isSignedIn } = useAuth();
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      const token = await getToken();
      const t = await api<{ id: string }>("/chat/threads", { method: "POST" }, token ?? undefined);
      setThreadId(t.id);
    })();
  }, [isSignedIn]);

  async function send() {
    if (!input.trim() || !threadId) return;
    const content = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setLoading(true);
    try {
      const token = await getToken();
      const reply = await api<{ content: string }>(`/chat/threads/${threadId}/messages`, {
        method: "POST", body: JSON.stringify({ content }),
      }, token ?? undefined);
      setMessages((m) => [...m, { role: "assistant", content: reply.content }]);
    } finally { setLoading(false); }
  }

  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e9 }); }, [messages]);

  if (!isSignedIn) return <div className="container mx-auto p-8">Sign in to use AI chat.</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 flex flex-col h-[80vh]">
      <h1 className="text-2xl font-semibold">AI Shopping Assistant</h1>
      <div ref={scrollRef} className="mt-4 flex-1 overflow-y-auto space-y-4 rounded-xl border bg-card p-4">
        {messages.length === 0 && <div className="text-muted-foreground">Ask things like "Best laptop under ₹70k for coding".</div>}
        {messages.map((m, i) => (
          <div key={i} className={`whitespace-pre-wrap ${m.role === "user" ? "text-right" : ""}`}>
            <div className={`inline-block rounded-2xl px-4 py-2 ${m.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted"}`}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-muted-foreground text-sm">Thinking…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 h-12 rounded-md border bg-background px-4" placeholder="Type your question…" />
        <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
      </div>
    </div>
  );
}
