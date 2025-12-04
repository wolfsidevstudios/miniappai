import React from 'react';
import { Home, FolderGit2, Zap, LayoutTemplate, Lock, Crown } from 'lucide-react';

interface SidebarProps {
  currentTab: 'create' | 'projects' | 'templates';
  onTabChange: (tab: 'create' | 'projects' | 'templates') => void;
  isPro: boolean;
  onOpenPaywall: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, isPro, onOpenPaywall }) => {
  return (
    <div className="w-20 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-6 h-full z-20 justify-between">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="mb-2 p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl text-white shadow-lg shadow-purple-900/20">
          <Zap size={24} fill="currentColor" />
        </div>

        <div className="flex flex-col gap-6 w-full px-2">
          <button
            onClick={() => onTabChange('create')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all group ${
              currentTab === 'create'
                ? 'bg-zinc-800 text-white shadow-lg shadow-zinc-900/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
            title="Create New"
          >
            <Home size={24} strokeWidth={currentTab === 'create' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Create</span>
          </button>

          <button
            onClick={() => onTabChange('projects')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all group ${
              currentTab === 'projects'
                ? 'bg-zinc-800 text-white shadow-lg shadow-zinc-900/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
            title="My Projects"
          >
            <FolderGit2 size={24} strokeWidth={currentTab === 'projects' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Projects</span>
          </button>

          <button
            onClick={() => onTabChange('templates')}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all group relative ${
              currentTab === 'templates'
                ? 'bg-zinc-800 text-white shadow-lg shadow-zinc-900/50'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
            title="Templates Store"
          >
            <div className="relative">
                <LayoutTemplate size={24} strokeWidth={currentTab === 'templates' ? 2.5 : 2} />
                {!isPro && (
                    <div className="absolute -top-1 -right-1 bg-zinc-950 rounded-full border border-zinc-800 p-0.5">
                        <Lock size={8} className="text-amber-400" fill="currentColor" />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-medium">Store</span>
          </button>
        </div>
      </div>

      <div className="px-2 w-full">
        {!isPro ? (
            <button 
                onClick={onOpenPaywall}
                className="w-full flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 hover:border-amber-500/50 transition-all group cursor-pointer"
            >
                <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Crown size={16} />
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Go Pro</span>
            </button>
        ) : (
            <div className="flex flex-col items-center gap-1 opacity-50">
                <div className="text-[10px] font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">PRO</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;