"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI financial assistant. I've analyzed your transaction history. Ask me anything about your spending, trends, or specific purchases!",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.response || "Sorry, I couldn't process that."
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      toast.error("Failed to connect to AI. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-zinc-500" />
          Ask AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Chat securely with Gemini about your personal financial data.
        </p>
      </div>

      <Card className="flex-1 border-border/40 shadow-xl overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm">
        <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div className={`flex items-center justify-center rounded-full h-8 w-8 shrink-0 ${msg.role === "assistant" ? "bg-zinc-500/10 text-zinc-500" : "bg-muted"}`}>
                  {msg.role === "assistant" ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div 
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted rounded-tl-sm prose prose-sm dark:prose-invert max-w-none"
                  }`}
                >
                  {/* Basic parsing for line breaks */}
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i !== msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="flex items-center justify-center rounded-full h-8 w-8 shrink-0 bg-zinc-500/10 text-zinc-500">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl px-4 py-3 text-sm bg-muted rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border/40 bg-background/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., How much did I spend on food this month?"
              className="flex-1 rounded-full bg-background"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-gradient-to-r from-violet-600 to-zinc-600 shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </Card>
    </div>
  );
}
