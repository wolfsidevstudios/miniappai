import React from 'react';
import { Template } from '../types';
import { Lock, Crown, Download, Star } from 'lucide-react';

interface TemplatesGalleryProps {
  isPro: boolean;
  onUseTemplate: (template: Template) => void;
  onOpenPaywall: () => void;
}

const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Retro Arcade Game',
    description: 'A fully functional Snake game with 8-bit sound effects and CRT screen shader.',
    emoji: '👾',
    tags: ['Game', 'Retro'],
    previewColor: 'from-pink-500 to-purple-600',
    prompt: 'Create a retro snake game with a CRT monitor effect, scanlines, and 8-bit beep sounds when eating food. Use a neon green and black color scheme.'
  },
  {
    id: '2',
    title: 'DeFi Dashboard',
    description: 'Modern cryptocurrency dashboard with live-simulated charts and glassmorphism UI.',
    emoji: '📊',
    tags: ['Finance', 'UI Kit'],
    previewColor: 'from-emerald-400 to-cyan-500',
    prompt: 'Build a modern crypto dashboard with a sidebar, a main chart area showing Bitcoin price simulation, and a recent transactions list. Use a dark theme with frosted glass cards.'
  },
  {
    id: '3',
    title: 'Zen Focus Timer',
    description: 'Minimalist Pomodoro timer with ambient rain sounds and breathing animations.',
    emoji: '🌸',
    tags: ['Productivity', 'Audio'],
    previewColor: 'from-orange-300 to-rose-400',
    prompt: 'Make a minimalist Pomodoro timer. The background should gently pulse with a breathing animation. Include a button to toggle ambient rain sounds.'
  },
  {
    id: '4',
    title: 'AI Chat Interface',
    description: 'A clone of a popular AI chat interface with message bubbles and code highlighting.',
    emoji: '🤖',
    tags: ['Social', 'Layout'],
    previewColor: 'from-blue-500 to-indigo-600',
    prompt: 'Create a chat interface that looks like ChatGPT. Left sidebar for history, main chat area, and a bottom input box. Use a clean gray and white theme.'
  },
  {
    id: '5',
    title: 'Interactive Resume',
    description: 'A personal portfolio site where sections slide in as you scroll.',
    emoji: '👨‍💻',
    tags: ['Portfolio', 'Animation'],
    previewColor: 'from-slate-500 to-slate-800',
    prompt: 'Build an interactive resume website. Sections (About, Skills, Experience) should slide in from the sides as the user scrolls down. Use a sleek, professional typography.'
  },
  {
    id: '6',
    title: 'Neo-Brutalist Blog',
    description: 'High contrast, bold borders, and aggressive shadows for a trendy blog layout.',
    emoji: '🗞️',
    tags: ['Blog', 'Design'],
    previewColor: 'from-yellow-400 to-red-500',
    prompt: 'Create a blog homepage in Neo-Brutalism style. Use thick black borders, hard shadows, and bright popping colors like neon yellow and pink. Make the buttons rectangular and sharp.'
  }
];

const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ isPro, onUseTemplate, onOpenPaywall }) => {
  return (
    <div className="h-full overflow-y-auto bg-zinc-950 relative">
      {/* Header */}
      <div className="p-8 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">App Store</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 uppercase tracking-wide">
                Premium
            </span>
        </div>
        <p className="text-zinc-400 max-w-2xl">Start with professional templates. Exclusive to Gemini 3.0 Pro users.</p>
      </div>

      <div className="p-8 pt-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        
        {TEMPLATES.map((template) => (
            <div key={template.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                {/* Preview Banner */}
                <div className={`h-32 bg-gradient-to-br ${template.previewColor} opacity-80 group-hover:opacity-100 transition-opacity p-6 flex items-start justify-between`}>
                    <span className="text-4xl shadow-sm">{template.emoji}</span>
                    {isPro && (
                        <button 
                            onClick={() => onUseTemplate(template)}
                            className="bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black p-2 rounded-full transition-all"
                            title="Use Template"
                        >
                            <Download size={18} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex gap-2 mb-3">
                        {template.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{template.description}</p>
                </div>
            </div>
        ))}

        {/* Lock Overlay for Non-Pro Users */}
        {!isPro && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-20">
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md z-0 from-transparent via-zinc-950/80 to-zinc-950"></div>
                
                <div className="relative z-10 text-center max-w-md p-8 glass-card rounded-[2.5rem] border border-amber-500/20 shadow-2xl shadow-amber-900/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 transform group-hover:rotate-6 transition-transform">
                        <Crown size={32} className="text-white" fill="currentColor" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Unlock the App Store</h3>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        Get unlimited access to professional templates, advanced AI models (Gemini 3.0 Pro), and priority generation speed.
                    </p>
                    
                    <button 
                        onClick={onOpenPaywall}
                        className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <span>Upgrade to Pro</span>
                        <Star size={18} className="text-amber-500" fill="currentColor" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesGallery;