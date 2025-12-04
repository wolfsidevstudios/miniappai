
import React, { useEffect, useRef, useState } from 'react';
import { GeneratedApp } from '../types';
import { RefreshCcw, Smartphone, Monitor, Share2, Wand2, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

interface AppPreviewProps {
  app: GeneratedApp | null;
  onClose: () => void;
  onEditApp: (prompt: string) => void;
}

const AppPreview: React.FC<AppPreviewProps> = ({ app, onClose, onEditApp }) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('desktop');
  const [showEditor, setShowEditor] = useState(true); // Default OPEN so it always shows
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0); // Force re-render of iframe

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [app?.code]);

  const handleShare = () => {
    if (app) {
      navigator.clipboard.writeText(`Check out this app I made: "${app.prompt}"`);
      alert("Prompt copied to clipboard!");
    }
  };

  if (!app) return null;

  const isUpdating = app.status === 'updating';

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 border-l border-zinc-800 relative">
      {/* Header Toolbar */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowEditor(!showEditor)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm
                    ${showEditor 
                        ? 'bg-white text-black shadow-lg shadow-white/10' 
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}
                `}
            >
                <Wand2 size={16} className={showEditor ? "text-purple-600" : ""} />
                <span>AI Editor</span>
            </button>

            <div className="h-6 w-px bg-zinc-800 mx-2 hidden sm:block"></div>

            <div className="flex flex-col">
                <span className="text-sm font-medium text-white truncate max-w-[150px] sm:max-w-xs">
                    {app.prompt}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                   {isUpdating ? 'Updating...' : 'Live Preview'}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-zinc-900 border border-zinc-800 rounded-full p-1 mr-2">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-full transition-all ${
                deviceMode === 'mobile' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-full transition-all ${
                deviceMode === 'desktop' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
          </div>

          <button 
            onClick={handleShare}
            className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            title="Share Prompt"
          >
            <Share2 size={18} />
          </button>
          <button 
             onClick={() => setKey(k => k+1)}
             className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
             title="Restart App"
          >
             <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950">
        
        {/* Floating AI Editor Toolbar */}
        <div className={`
            absolute top-4 left-4 bottom-4 w-[400px] z-30 
            transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1)
            ${showEditor ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0 pointer-events-none'}
        `}>
            <div className="h-full w-full rounded-[2rem] bg-zinc-950/80 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden flex flex-col relative">
                 <ChatPanel 
                    history={app.history || []} 
                    onSendMessage={onEditApp}
                    isUpdating={isUpdating}
                 />
                 {/* Close Button specifically for the floating panel */}
                 <button 
                    onClick={() => setShowEditor(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-transparent rounded-full z-40 md:hidden"
                 >
                    <X size={20} />
                 </button>
            </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
            
            {app.status === 'generating' ? (
            <div className="flex flex-col items-center gap-6 text-zinc-500 animate-pulse">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-zinc-800 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="font-mono text-sm tracking-widest uppercase">Building...</p>
            </div>
            ) : app.status === 'error' ? (
                <div className="text-red-400 bg-red-950/30 p-8 rounded-3xl border border-red-900/50 max-w-md text-center backdrop-blur-sm">
                    <p className="font-semibold mb-2 text-lg">Build Failed</p>
                    <p className="text-sm opacity-80 leading-relaxed">{app.errorMessage || "Something went wrong while generating code."}</p>
                </div>
            ) : (
            <div 
                className={`transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) relative shadow-2xl ${
                deviceMode === 'mobile' 
                    ? 'w-[375px] h-[667px] rounded-[3rem] border-8 border-zinc-800 bg-black' 
                    : 'w-full h-full rounded-2xl border border-zinc-800 bg-white'
                } ${showEditor && deviceMode === 'desktop' ? 'ml-[400px] w-[calc(100%-400px)]' : ''}`}
            >
                {/* Mobile Notch (Visual only) */}
                {deviceMode === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-zinc-800 rounded-b-2xl z-20 pointer-events-none"></div>
                )}
                
                {/* Loading Overlay for Updates */}
                {isUpdating && (
                   <div className="absolute inset-0 bg-black/60 z-30 backdrop-blur-sm flex items-center justify-center rounded-[inherit] transition-all duration-300">
                      <div className="bg-zinc-900 border border-zinc-700/50 p-5 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                         <div className="w-8 h-8 border-2 border-t-purple-500 border-zinc-700 rounded-full animate-spin"></div>
                         <span className="text-sm font-medium text-white">AI is making changes...</span>
                      </div>
                   </div>
                )}

                <iframe
                key={key}
                ref={iframeRef}
                srcDoc={app.code}
                title="Generated App"
                className={`w-full h-full ${deviceMode === 'mobile' ? 'rounded-[2.5rem]' : 'rounded-2xl'}`}
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                />
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
