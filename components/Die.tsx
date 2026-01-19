
import React, { useState, useEffect, useRef } from 'react';
import { DieType, DieProps } from '../types';

const Die: React.FC<DieProps> = ({ type, isRolling, result, color, textColor }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isImpacted, setIsImpacted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRolling) {
      setIsImpacted(false);
      intervalRef.current = window.setInterval(() => {
        // Rotation ultra-rapide et erratique
        setRotation({
          x: Math.random() * 2000 - 1000,
          y: Math.random() * 2000 - 1000,
          z: Math.random() * 2000 - 1000
        });
        // Jitter de position pour simuler les rebonds sur les bords
        setPosition({
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          z: Math.random() * 50
        });
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Phase d'atterrissage
      setPosition({ x: 0, y: 0, z: 0 });
      setIsImpacted(true);
      setTimeout(() => setIsImpacted(false), 500);

      if (type === DieType.D6) {
        // Calcul des angles exacts + un petit facteur de "torsion" aléatoire qui se résorbe (0.8s transition dans CSS)
        const rotations: Record<number, { x: number, y: number }> = {
          1: { x: 0, y: 0 },
          2: { x: 0, y: -90 },
          3: { x: 0, y: -180 },
          4: { x: 0, y: 90 },
          5: { x: -90, y: 0 },
          6: { x: 90, y: 0 }
        };
        // On ajoute des tours complets (720 ou 1080 deg) pour que l'arrêt ne soit pas trop brusque visuellement
        const base = rotations[result] || { x: 0, y: 0 };
        setRotation({ 
          x: base.x + (Math.random() > 0.5 ? 720 : -720), 
          y: base.y + (Math.random() > 0.5 ? 1080 : -1080), 
          z: 0 
        });
      } else {
        setRotation({ x: 0, y: 0, z: 0 });
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, result, type]);

  if (type === DieType.D6) {
    return (
      <div 
        className={`dice-container flex items-center justify-center ${isImpacted ? 'impact-shake' : ''}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)` }}
      >
        <div 
          className={`cube ${!isRolling ? 'glow-active' : ''}`}
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            transition: isRolling ? 'none' : 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div 
              key={num} 
              className={`face face-${num}`}
              style={{ backgroundColor: color, color: textColor }}
            >
              <div className="flex flex-wrap justify-center content-center w-full h-full p-4 pointer-events-none">
                {num}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Polygon dice (D4, D8, etc.) avec animation de rebond simplifiée
  return (
    <div 
      className={`flex flex-col items-center justify-center transition-all duration-300 ${isImpacted ? 'scale-110' : 'scale-100'}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)` }}
    >
      <div 
        className={`w-36 h-36 relative flex items-center justify-center transition-transform duration-700 ${!isRolling ? 'glow-active rounded-full' : ''}`}
        style={{ transform: `rotate(${isRolling ? rotation.x : 0}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <polygon 
            points={getPolygonPoints(type)} 
            fill={color} 
            stroke="rgba(0,0,0,0.1)" 
            strokeWidth="1"
          />
        </svg>
        <span 
          className="absolute text-5xl font-black z-10 select-none" 
          style={{ color: textColor }}
        >
          {isRolling ? '?' : result}
        </span>
      </div>
      <div className="mt-8 opacity-20 font-black tracking-[0.5em] text-xs uppercase" style={{ color: textColor }}>
        D{type} Quantique
      </div>
    </div>
  );
};

const getPolygonPoints = (type: DieType) => {
  switch(type) {
    case DieType.D4: return "50,5 95,90 5,90";
    case DieType.D8: return "50,5 95,50 50,95 5,50";
    case DieType.D10: return "50,5 95,40 75,95 25,95 5,40";
    case DieType.D12: return "50,5 90,30 90,70 50,95 10,70 10,30";
    case DieType.D20: return "50,5 95,25 95,75 50,95 5,75 5,25";
    default: return "5,5 95,5 95,95 5,95";
  }
};

export default Die;
