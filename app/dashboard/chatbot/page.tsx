'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Sup! I'm your CareerVibe AI. Ask me anything about your current path or strategies to level up." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeRoadmap } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          new_message: userMessage,
          career_context: activeRoadmap?.career || 'General career advancement'
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
      } else {
        throw new Error(data.error || "Failed to get reply");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I hit a snag. Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col fade-in pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(198,255,0,0.2)]">
              <Bot size={28} className="text-black" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-white">CareerVibe <span className="text-primary font-bold">AI</span></h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Context-aware Career strategist</p>
           </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: "Chat cleared! What's on your mind?" }])}
          className="p-3 text-gray-600 hover:text-red-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="vibe-card flex-1 flex flex-col overflow-hidden bg-black/20">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                m.role === 'assistant' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                {m.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
              </div>
              <div className={`max-w-[80%] space-y-2 ${m.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-black font-bold' 
                    : 'bg-[#1a1a1a] text-gray-100 font-bold border border-white/5'
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="h-12 w-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-black/40 border-t border-white/5">
           <form onSubmit={handleSubmit} className="relative flex gap-4">
             <div className="relative flex-1">
                <MessageSquare size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your career shift..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-primary/40 transition-all font-medium placeholder-gray-700"
                />
             </div>
             <button
               type="submit"
               disabled={isLoading || !input.trim()}
               className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-30 disabled:hover:scale-100"
             >
               <Send size={24} />
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}
