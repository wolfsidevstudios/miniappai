
import React, { useEffect, useState } from 'react';
import { Check, Sparkles, ArrowRight, Crown } from 'lucide-react';

interface SuccessPageProps {
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay for animation sequence
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[110] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950"></div>
      
      {/* Animated Particles/Confetti (CSS based for simplicity) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <div 
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-amber-400 to-purple-500 rounded-full animate-pulse"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0.6
                }}
            ></div>
         ))}
      </div>

      <div className={`relative z-10 flex flex-col items-center text-center p-8 max-w-lg transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-8 shadow-[0_0_50px_-12px_rgba(34,197,94,0.5)] scale-110">
            <Check size={48} className="text-white stroke-[3]" />
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">You're in.</h1>
        <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400 font-bold">Gemini 3.0 Pro</span>. 
            <br />
            Your creative potential just got infinite.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4 w-full mb-10">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2">
                <Crown size={20} className="text-amber-400" />
                <span className="text-sm font-medium text-zinc-300">Premium Templates</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                <span className="text-sm font-medium text-zinc-300">Advanced AI</span>
            </div>
        </div>

        <button 
            onClick={onContinue}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
        >
            <span>Start Building</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
