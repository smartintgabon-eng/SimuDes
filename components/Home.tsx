
import React from 'react';
import { Screen } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  onOpenSettings: () => void;
  onOpenUpdates: () => void;
  onOpenTutorial: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  onNavigate, 
  onOpenSettings, 
  onOpenUpdates, 
  onOpenTutorial,
  canInstall,
  onInstall
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-white relative overflow-y-auto overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="z-10 text-center max-w-2xl w-full py-10">
        <div className="mb-6 md:mb-10 animate-float">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto rounded-[1.5rem] md:rounded-[2rem] glass flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-4 md:mb-6">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 uppercase">
            SimuDé<span className="text-blue-500">.</span>Pro
          </h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-[10px] md:text-sm">Expérience de lancé de dé nouvelle génération</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4">
          <button 
            onClick={() => onNavigate('game')}
            className="col-span-1 md:col-span-2 py-4 md:py-6 px-8 md:px-10 bg-white text-black font-black text-xl md:text-2xl rounded-2xl md:rounded-[2rem] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-gray-200 transition-all active:scale-[0.98] uppercase flex items-center justify-center gap-4"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            Commencer
          </button>
          
          {canInstall && (
            <button 
              onClick={onInstall}
              className="col-span-1 md:col-span-2 py-4 px-8 bg-blue-600/20 border border-blue-500/30 rounded-2xl md:rounded-3xl font-black text-blue-400 hover:bg-blue-600/30 transition-all flex items-center justify-center gap-3 animate-pulse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Installer l'Application Pro
            </button>
          )}

          <button 
            onClick={onOpenSettings}
            className="py-4 px-6 md:py-5 md:px-8 glass rounded-2xl md:rounded-3xl font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 border border-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Paramètres
          </button>

          <button 
            onClick={onOpenTutorial}
            className="py-4 px-6 md:py-5 md:px-8 glass rounded-2xl md:rounded-3xl font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 border border-white/5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Tutoriel
          </button>

          <button 
            onClick={onOpenUpdates}
            className="col-span-1 md:col-span-2 py-4 text-white/40 font-bold uppercase text-[10px] tracking-widest hover:text-white/80 transition-all"
          >
            v2.3.0 • Mise à jour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
