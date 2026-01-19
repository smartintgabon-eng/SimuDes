
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppSettings, Screen } from '../types';
import { getContrastColor } from '../utils/colorUtils';
import Die from './Die';

interface GameProps {
  settings: AppSettings;
  onNavigate: (screen: Screen) => void;
  onOpenSettings: () => void;
}

const Game: React.FC<GameProps> = ({ settings, onNavigate, onOpenSettings }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number>(0);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [bag, setBag] = useState<number[]>([]);
  const lastResultRef = useRef<number>(0);

  // Générateur de hasard cryptographique
  const getCryptoRandom = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  };

  // Mélange Fisher-Yates boosté par Crypto API
  const secureShuffle = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(getCryptoRandom() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const createNewBag = useCallback((exclude: number) => {
    let newBag = Array.from({ length: settings.dieType }, (_, i) => i + 1);
    
    // Triple mélange cryptographique
    newBag = secureShuffle(secureShuffle(secureShuffle(newBag)));

    // Éviter la répétition immédiate même au changement de sac
    if (newBag[0] === exclude && newBag.length > 1) {
      const swapIndex = 1 + Math.floor(getCryptoRandom() * (newBag.length - 1));
      [newBag[0], newBag[swapIndex]] = [newBag[swapIndex], newBag[0]];
    }
    
    return newBag;
  }, [settings.dieType]);

  useEffect(() => {
    const initialBag = createNewBag(0);
    const initialResult = initialBag.shift()!;
    setResult(initialResult);
    lastResultRef.current = initialResult;
    setBag(initialBag);
  }, [settings.dieType, createNewBag]);

  const rollDie = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    const duration = 1800 + getCryptoRandom() * 700;
    
    setTimeout(() => {
      let currentBag = [...bag];
      if (currentBag.length === 0) {
        currentBag = createNewBag(lastResultRef.current);
      }

      const newResult = currentBag.shift()!;
      
      // Vibration haptique sur mobile si possible
      if ('vibrate' in navigator) {
        navigator.vibrate([30, 10, 30]);
      }

      lastResultRef.current = newResult;
      setResult(newResult);
      setBag(currentBag);
      setIsRolling(false);
      setRollHistory(prev => [newResult, ...prev].slice(0, 8));
    }, duration);
  }, [isRolling, bag, createNewBag]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') rollDie();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollDie]);

  const textColor = getContrastColor(settings.themeColor);

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-1000 select-none"
      style={{ backgroundColor: settings.themeColor, color: textColor }}
    >
      <header className="p-6 md:p-8 flex justify-between items-center z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 font-black uppercase tracking-tighter hover:opacity-70 transition-all active:scale-90"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-current">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          </div>
          <span className="hidden sm:inline">Accueil</span>
        </button>
        
        <button 
          onClick={onOpenSettings}
          className="p-4 rounded-2xl bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all active:scale-90 border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-4">Crypto-Entropy Engine v2</p>
          <div className="text-8xl md:text-9xl font-black tabular-nums h-32 flex items-center justify-center">
            {isRolling ? (
              <span className="opacity-20 animate-pulse">?</span>
            ) : result}
          </div>
        </div>

        <div className="relative transform-gpu">
          <Die 
            type={settings.dieType} 
            isRolling={isRolling} 
            result={result} 
            color="white" 
            textColor={settings.themeColor} 
          />
          {!isRolling && (
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 blur-xl rounded-full scale-150 animate-pulse"></div>
          )}
        </div>

        <div className="mt-20 w-full max-w-sm px-4">
          <button 
            onClick={rollDie}
            disabled={isRolling}
            className={`w-full py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] group relative overflow-hidden ${
              isRolling 
                ? 'bg-black/10 cursor-not-allowed opacity-50' 
                : 'bg-white text-black hover:shadow-white/40'
            }`}
          >
            <span className="relative z-10">{isRolling ? 'Calcul...' : 'Lancer'}</span>
            {!isRolling && <div className="absolute inset-0 bg-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
          
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {Array.from({ length: settings.dieType }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-700 ${
                    i < bag.length ? 'bg-current opacity-40 scale-110' : 'bg-current opacity-5 scale-75'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-center">
              Tous les nombres garantis par cycle
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 md:p-10">
        <div className="max-w-md mx-auto">
          <p className="text-[10px] font-black uppercase opacity-20 mb-4 tracking-[0.3em] text-center">Historique du cycle</p>
          <div className="flex justify-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {rollHistory.map((h, i) => (
              <div 
                key={i} 
                className="min-w-[44px] h-[44px] rounded-xl bg-black/5 backdrop-blur-xl flex items-center justify-center font-bold border border-white/5 animate-in slide-in-from-right-10"
                style={{ opacity: Math.max(0.2, 1 - (i * 0.12)) }}
              >
                {h}
              </div>
            ))}
            {rollHistory.length === 0 && <p className="text-[10px] opacity-10 font-bold uppercase tracking-widest py-4">En attente du premier flux...</p>}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Game;
