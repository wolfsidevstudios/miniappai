
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AppPreview from './components/AppPreview';
import PromptInput from './components/PromptInput';
import ProjectsList from './components/ProjectsList';
import TemplatesGallery from './components/TemplatesGallery';
import PaywallModal from './components/PaywallModal';
import SuccessPage from './components/SuccessPage';
import { GeneratedApp, ChatMessage, Template } from './types';
import { generateAppCode, editAppCode } from './services/geminiService';
import { checkSubscriptionStatus } from './services/subscriptionService';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [apps, setApps] = useState<GeneratedApp[]>([]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'create' | 'projects' | 'templates'>('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load apps from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('micro-apps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validated = parsed.map((app: any) => ({
             ...app, 
             history: app.history || [] 
        }));
        setApps(validated);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    
    // Check subscription
    checkSubscriptionStatus().then(status => setIsPro(status));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('micro-apps', JSON.stringify(apps));
  }, [apps]);

  const handleCreateApp = async (prompt: string) => {
    const newAppId = uuidv4();
    const newApp: GeneratedApp = {
      id: newAppId,
      prompt,
      code: '',
      timestamp: Date.now(),
      status: 'generating',
      history: []
    };

    setApps(prev => [newApp, ...prev]);
    setActiveAppId(newAppId); // Automatically open the new app
    setIsGenerating(true);

    try {
      const code = await generateAppCode(prompt);
      
      setApps(prev => prev.map(app => 
        app.id === newAppId 
          ? { ...app, code, status: 'ready' } 
          : app
      ));
    } catch (error) {
      setApps(prev => prev.map(app => 
        app.id === newAppId 
          ? { ...app, status: 'error', errorMessage: 'Failed to generate code. Please try again.' } 
          : app
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = async (template: Template) => {
    // Clone logic for templates
    const newAppId = uuidv4();
    const newApp: GeneratedApp = {
        id: newAppId,
        prompt: `Template: ${template.title}`,
        code: '',
        timestamp: Date.now(),
        status: 'generating',
        history: [{role: 'user', text: `Init from template: ${template.title}`}]
    };
    
    setApps(prev => [newApp, ...prev]);
    setActiveAppId(newAppId);
    
    try {
        // We generate the template fresh so it's unique to the user
        const code = await generateAppCode(template.prompt);
         setApps(prev => prev.map(app => 
            app.id === newAppId 
              ? { ...app, code, status: 'ready' } 
              : app
          ));
    } catch (error) {
        setApps(prev => prev.map(app => 
            app.id === newAppId 
              ? { ...app, status: 'error', errorMessage: 'Failed to generate template.' } 
              : app
          ));
    }
  };

  const handleEditApp = async (prompt: string) => {
      if (!activeAppId) return;

      const currentApp = apps.find(a => a.id === activeAppId);
      if (!currentApp) return;

      const userMsg: ChatMessage = { role: 'user', text: prompt };
      
      setApps(prev => prev.map(app => 
          app.id === activeAppId 
          ? { 
              ...app, 
              status: 'updating', 
              history: [...app.history, userMsg]
            } 
          : app
      ));

      try {
          // Pass the existing history (before this new prompt) + the new prompt
          const newCode = await editAppCode(currentApp.code, currentApp.history, prompt);
          const aiMsg: ChatMessage = { role: 'model', text: 'I have updated the app based on your request.' };

          setApps(prev => prev.map(app => 
            app.id === activeAppId 
            ? { 
                ...app, 
                code: newCode, 
                status: 'ready',
                history: [...app.history, aiMsg]
              } 
            : app
        ));
      } catch (error) {
        const errorMsg: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error while updating the app.' };
        setApps(prev => prev.map(app => 
            app.id === activeAppId 
            ? { 
                ...app, 
                status: 'ready', 
                history: [...app.history, errorMsg]
              } 
            : app
        ));
      }
  };

  const handleDeleteApp = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
        setApps(prev => prev.filter(app => app.id !== id));
        if (activeAppId === id) setActiveAppId(null);
    }
  };

  const activeApp = apps.find(a => a.id === activeAppId) || null;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Navigation Rail */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
            setCurrentTab(tab);
            setActiveAppId(null); 
        }}
        isPro={isPro}
        onOpenPaywall={() => setShowPaywall(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        {activeApp ? (
          <AppPreview 
            app={activeApp} 
            onClose={() => setActiveAppId(null)}
            onEditApp={handleEditApp}
          />
        ) : (
          <>
            {currentTab === 'create' && (
                <PromptInput 
                    onSubmit={handleCreateApp} 
                    isGenerating={isGenerating}
                />
            )}
            {currentTab === 'projects' && (
                <ProjectsList 
                    apps={apps} 
                    onSelectApp={(app) => setActiveAppId(app.id)}
                    onDeleteApp={handleDeleteApp}
                />
            )}
            {currentTab === 'templates' && (
                <TemplatesGallery 
                    isPro={isPro}
                    onUseTemplate={handleUseTemplate}
                    onOpenPaywall={() => setShowPaywall(true)}
                />
            )}
          </>
        )}
      </div>

      {showPaywall && (
          <PaywallModal 
            onClose={() => setShowPaywall(false)}
            onSuccess={() => {
                setIsPro(true);
                setShowPaywall(false);
                setShowSuccess(true);
            }}
          />
      )}

      {showSuccess && (
          <SuccessPage onContinue={() => setShowSuccess(false)} />
      )}
    </div>
  );
};

export default App;
