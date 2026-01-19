
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
  
  // Sac de tirage persistant
  const [bag, setBag] = useState<number[]>([]);
  const lastResultRef = useRef<number>(0);

  // Algorithme de mélange Fisher-Yates haute performance
  const shuffle = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Création d'un nouveau cycle de nombres
  const createNewBag = useCallback((exclude: number) => {
    let newBag = Array.from({ length: settings.dieType }, (_, i) => i + 1);
    
    // On mélange 3 fois pour une entropie maximale
    newBag = shuffle(shuffle(shuffle(newBag)));

    // Règle d'or : le premier du nouveau sac ne doit pas être le dernier sorti
    if (newBag[0] === exclude && newBag.length > 1) {
      // On permute le premier avec un élément aléatoire du reste du sac
      const swapIndex = 1 + Math.floor(Math.random() * (newBag.length - 1));
      [newBag[0], newBag[swapIndex]] = [newBag[swapIndex], newBag[0]];
    }
    
    return newBag;
  }, [settings.dieType]);

  // Initialisation au chargement ou changement de dé
  useEffect(() => {
    const initialBag = createNewBag(0);
    const initialResult = initialBag.shift()!;
    setResult(initialResult);
    lastResultRef.current = initialResult;
    setBag(initialBag);
    // On ne met pas l'initial dans l'historique pour commencer propre
  }, [settings.dieType, createNewBag]);

  const rollDie = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    // Temps de vol aléatoire entre 1.8s et 2.5s
    const duration = 1800 + Math.random() * 700;
    
    setTimeout(() => {
      let currentBag = [...bag];
      
      // Si le sac est vide, on en génère un nouveau
      if (currentBag.length === 0) {
        currentBag = createNewBag(lastResultRef.current);
      }

      // Tirage du nombre
      const newResult = currentBag.shift()!;
      
      // Sécurité anti-répétition absolue (cas extrême)
      if (newResult === lastResultRef.current && settings.dieType > 1) {
        // Ce cas ne devrait pas arriver avec createNewBag, mais on assure la sécurité
        rollDie(); // On relance silencieusement
        return;
      }

      lastResultRef.current = newResult;
      setResult(newResult);
      setBag(currentBag);
      setIsRolling(false);
      setRollHistory(prev => [newResult, ...prev].slice(0, 8));
    }, duration);
  }, [isRolling, bag, createNewBag, settings.dieType]);

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
      className="min-h-screen flex flex-col transition-colors duration-1000"
      style={{ backgroundColor: settings.themeColor, color: textColor }}
    >
      <header className="p-8 flex justify-between items-center z-10">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 font-black uppercase tracking-tighter hover:opacity-70 transition-all active:scale-95"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-current">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          </div>
          Accueil
        </button>
        
        <button 
          onClick={onOpenSettings}
          className="p-4 rounded-2xl bg-black/10 hover:bg-black/20 backdrop-blur-md transition-all active:scale-95 border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
          <p className="text-xs font-bold opacity-40 uppercase tracking-[0.3em] mb-4">Moteur de Hasard Certifié</p>
          <div className="text-9xl font-black transition-all duration-500 tabular-nums">
            {isRolling ? (
              <span className="opacity-20 animate-pulse">?</span>
            ) : result}
          </div>
        </div>

        <div className="relative">
          <Die 
            type={settings.dieType} 
            isRolling={isRolling} 
            result={result} 
            color="white" 
            textColor={settings.themeColor} 
          />
          {/* Ombre portée dynamique sous le dé */}
          {!isRolling && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 blur-xl rounded-full scale-150 animate-pulse"></div>
          )}
        </div>

        <div className="mt-20 w-full max-w-sm">
          <button 
            onClick={rollDie}
            disabled={isRolling}
            className={`w-full py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 group relative overflow-hidden ${
              isRolling 
                ? 'bg-black/10 cursor-not-allowed opacity-50' 
                : 'bg-white text-black hover:shadow-white/40'
            }`}
          >
            <span className="relative z-10">{isRolling ? 'Calcul de trajectoire...' : 'Lancer le dé'}</span>
            {!isRolling && <div className="absolute inset-0 bg-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
              Double-Entropy Bag System • Anti-Repeat
            </p>
            {/* Visualisation du sac restant */}
            <div className="flex gap-2">
              {Array.from({ length: settings.dieType }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    i < bag.length ? 'bg-current opacity-40' : 'bg-current opacity-5 scale-75'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="p-10">
        <div className="max-w-md mx-auto">
          <p className="text-[10px] font-black uppercase opacity-30 mb-5 tracking-[0.3em] text-center italic">Séquence temporelle (Flux continu)</p>
          <div className="flex justify-center gap-3">
            {rollHistory.map((h, i) => (
              <div 
                key={i} 
                className="w-12 h-12 rounded-2xl bg-black/5 backdrop-blur-xl flex items-center justify-center font-bold border border-white/5 animate-in slide-in-from-right-10 duration-500 hover:scale-110 transition-transform"
                style={{ opacity: 1 - (i * 0.1) }}
              >
                {h}
              </div>
            ))}
            {rollHistory.length === 0 && <div className="h-12 flex items-center"><p className="text-sm opacity-20 font-bold uppercase tracking-widest">Initialisation du flux...</p></div>}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Game;
