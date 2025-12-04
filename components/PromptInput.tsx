
import React, { useState } from 'react';
import { PromptSuggestion } from '../types';
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

const SUGGESTIONS: PromptSuggestion[] = [
  { text: "A calculator that screams in agony when I press equals", emoji: "😱", category: "Useless" },
  { text: "A button that runs away from the mouse cursor", emoji: "🏃", category: "Prank" },
  { text: "A zen garden where I can rake sand with my mouse", emoji: "🧘", category: "Relaxing" },
  { text: "A to-do list that judges me for adding tasks", emoji: "😒", category: "Productivity" },
];

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSubmit(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles size={12} className="text-purple-400" />
            <span>Powered by Gemini 2.5</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Describe it. <span className="text-zinc-400">Build it.</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
          From useless web toys to functional tools. Just type what you imagine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
        
        <div className="relative flex flex-col bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-2xl overflow-hidden focus-within:border-zinc-700 transition-colors h-48">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Make a timer that explodes visually when it hits zero..."
                className="w-full h-full bg-transparent text-white placeholder-zinc-600 px-6 py-6 text-lg outline-none resize-none font-medium leading-relaxed"
                disabled={isGenerating}
                autoFocus
            />
            
            <div className="absolute bottom-4 right-4 flex items-center justify-between left-6">
                <span className="text-xs text-zinc-600 font-medium hidden sm:block">
                    Press <kbd className="font-sans bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">Enter</kbd> to generate
                </span>
                
                <button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
                        input.trim() && !isGenerating
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-lg scale-100'
                        : 'bg-zinc-800 text-zinc-600 scale-90 cursor-not-allowed'
                    }`}
                >
                    {isGenerating ? (
                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowRight size={20} />
                    )}
                </button>
            </div>
        </div>
      </form>

      <div className="mt-12 w-full max-w-2xl">
        <p className="text-xs text-zinc-600 mb-4 font-semibold uppercase tracking-wider text-center">Inspiration</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSubmit(suggestion.text)}
              disabled={isGenerating}
              className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group"
            >
              <span className="text-xl grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100 group-hover:scale-110 duration-300">{suggestion.emoji}</span>
              <div>
                 <p className="text-sm text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">{suggestion.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
