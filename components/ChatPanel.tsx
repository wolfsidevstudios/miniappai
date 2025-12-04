import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, CornerDownLeft } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isUpdating: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ history, onSendMessage, isUpdating }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isUpdating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isUpdating) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-6 pb-2">
        <h3 className="font-bold text-white text-xl tracking-tight mb-1">
          Editor
        </h3>
        <p className="text-xs text-zinc-400 font-medium">Describe changes to modify the app.</p>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6" ref={scrollRef}>
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4 py-10 opacity-60">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={24} className="text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-center max-w-[200px]">Type below to change colors, layout, or functionality.</p>
          </div>
        )}
        
        {history.map((msg, idx) => (
          <div key={idx} className={`flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`
                p-4 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-lg backdrop-blur-md
                ${msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-sm' 
                    : 'bg-zinc-800/80 text-zinc-200 border border-white/5 rounded-tl-sm'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}

        {isUpdating && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center flex-shrink-0 border border-white/5">
                <Bot size={14} className="text-purple-400" />
             </div>
             <div className="bg-zinc-800/40 border border-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-zinc-400 flex items-center gap-2 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                <span>Generating code...</span>
             </div>
          </div>
        )}
      </div>

      {/* Large Input Area */}
      <div className="p-4 pt-2">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="relative flex flex-col bg-black/40 rounded-[2rem] border border-white/10 focus-within:border-white/20 focus-within:bg-black/60 transition-all h-40 shadow-xl backdrop-blur-md">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Make the background blue..."
                className="w-full h-full bg-transparent text-white placeholder-zinc-500 px-6 py-5 text-sm outline-none resize-none font-medium leading-relaxed rounded-[2rem]"
                disabled={isUpdating}
            />
            
            <div className="absolute bottom-3 right-3">
                <button
                    type="submit"
                    disabled={!input.trim() || isUpdating}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        input.trim() && !isUpdating
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-lg transform hover:scale-105'
                        : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                    }`}
                >
                    <CornerDownLeft size={18} />
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;