
import React, { useState } from 'react';
import { DieType, AppSettings, Screen } from './types';
import Home from './components/Home';
import Game from './components/Game';
import SettingsModal from './components/SettingsModal';
import UpdatesModal from './components/UpdatesModal';
import TutorialModal from './components/TutorialModal';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<AppSettings>({
    themeColor: '#0f172a', // Original color is dark as requested
    dieType: DieType.D6,
  });
  const [activeModal, setActiveModal] = useState<'settings' | 'updates' | 'tutorial' | null>(null);

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      {currentScreen === 'home' ? (
        <Home 
          onNavigate={handleNavigate} 
          onOpenSettings={() => setActiveModal('settings')}
          onOpenUpdates={() => setActiveModal('updates')}
          onOpenTutorial={() => setActiveModal('tutorial')}
        />
      ) : (
        <Game 
          settings={settings} 
          onNavigate={handleNavigate}
          onOpenSettings={() => setActiveModal('settings')}
        />
      )}

      {/* Modals Management */}
      {activeModal === 'settings' && (
        <SettingsModal 
          settings={settings} 
          onSave={setSettings} 
          onClose={() => setActiveModal(null)} 
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
