
import React, { useState, useEffect } from 'react';
import { DieType, AppSettings, Screen } from './types';
import Home from './components/Home';
import Game from './components/Game';
import SettingsModal from './components/SettingsModal';
import UpdatesModal from './components/UpdatesModal';
import TutorialModal from './components/TutorialModal';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<AppSettings>({
    themeColor: '#0f172a',
    dieType: DieType.D6,
  });
  const [activeModal, setActiveModal] = useState<'settings' | 'updates' | 'tutorial' | null>(null);
  
  // PWA Installation
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Empêcher Chrome d'afficher le bandeau par défaut trop vite
      e.preventDefault();
      // Stocker l'événement pour plus tard
      setDeferredPrompt(e);
      console.log('App est installable !');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`L'utilisateur a ${outcome === 'accepted' ? 'accepté' : 'refusé'} l'installation`);
    setDeferredPrompt(null);
  };

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      {currentScreen === 'home' ? (
        <Home 
          onNavigate={handleNavigate} 
          onOpenSettings={() => setActiveModal('settings')}
          onOpenUpdates={() => setActiveModal('updates')}
          onOpenTutorial={() => setActiveModal('tutorial')}
          canInstall={!!deferredPrompt}
          onInstall={installApp}
        />
      ) : (
        <Game 
          settings={settings} 
          onNavigate={handleNavigate}
          onOpenSettings={() => setActiveModal('settings')}
        />
      )}

      {/* Modals */}
      {activeModal === 'settings' && (
        <SettingsModal 
          settings={settings} 
          onSave={setSettings} 
          onClose={() => setActiveModal(null)} 
          canInstall={!!deferredPrompt}
          onInstall={installApp}
        />
      )}

      {activeModal === 'updates' && (
        <UpdatesModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'tutorial' && (
        <TutorialModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default App;
