'use client';

import ChatUI from '@/components/ChatUI';

export default function ChatbotPage() {
  return (
    <div className="space-y-6 fade-in h-full flex flex-col">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border-l-4 border-cyan-500">
        <h1 className="text-3xl font-bold text-white mb-2">AI Mentor Chatbot</h1>
        <p className="text-gray-400">Chat with your AI assistant for personalized guidance and support</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 min-h-96">
        <ChatUI />
      </div>

      {/* Info */}
      <div className="glass-card-dark p-4 rounded-lg border border-white/10 text-sm text-gray-400">
        <p>💡 Tip: Ask about careers in any field — medical, arts, government, tech, or more. Get personalized guidance anytime!</p>
      </div>
    </div>
  );
}
