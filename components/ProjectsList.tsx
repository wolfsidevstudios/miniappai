
import React from 'react';
import { GeneratedApp } from '../types';
import { Clock, ArrowRight, Trash2, Smartphone } from 'lucide-react';

interface ProjectsListProps {
  apps: GeneratedApp[];
  onSelectApp: (app: GeneratedApp) => void;
  onDeleteApp: (appId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ apps, onSelectApp, onDeleteApp }) => {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
            <Smartphone size={32} className="opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No projects yet</h3>
        <p className="text-sm">Go to the Create tab to build your first app.</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">My Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className="group bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-all flex flex-col h-48 relative overflow-hidden cursor-pointer"
              onClick={() => onSelectApp(app)}
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        app.status === 'ready' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                        app.status === 'error' ? 'bg-red-900/30 text-red-400 border border-red-900/50' :
                        'bg-purple-900/30 text-purple-400 border border-purple-900/50'
                    }`}>
                        {app.status}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteApp(app.id);
                        }}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded-md hover:bg-zinc-900 transition-colors z-10"
                        title="Delete Project"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 line-clamp-2 leading-tight mb-2 group-hover:text-purple-300 transition-colors">
                  {app.prompt}
                </h3>
              </div>
              
              <div className="flex items-end justify-between mt-4 border-t border-zinc-800/50 pt-4">
                 <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock size={12} />
                    {new Date(app.timestamp).toLocaleDateString()}
                 </div>
                 <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowRight size={14} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
