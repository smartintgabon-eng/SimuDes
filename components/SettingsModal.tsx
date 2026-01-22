
import React, { useState, useEffect } from 'react';
import { DieType, AppSettings } from '../types';
import { isValidHex, getHexSuggestions, COLOR_PALETTE } from '../utils/colorUtils';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  settings, 
  onSave, 
  onClose,
  canInstall,
  onInstall
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [customHex, setCustomHex] = useState(settings.themeColor);
  const [suggestions, setSuggestions] = useState<{name: string, hex: string}[]>([]);

  useEffect(() => {
    if (customHex.startsWith('#')) {
      setSuggestions(getHexSuggestions(customHex));
    } else {
      setSuggestions([]);
    }
  }, [customHex]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const updateColor = (color: string) => {
    setLocalSettings({ ...localSettings, themeColor: color });
    setCustomHex(color);
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white">Laboratoire</h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="space-y-8">
            {/* Die Selection */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Architecture du Dé</label>
              <div className="grid grid-cols-3 gap-3">
                {[DieType.D4, DieType.D6, DieType.D8, DieType.D10, DieType.D12, DieType.D20].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLocalSettings({ ...localSettings, dieType: type })}
                    className={`py-4 rounded-2xl font-black transition-all ${
                      localSettings.dieType === type 
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105 border-transparent' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {type === DieType.D6 ? 'Standard' : `D${type}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="relative">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Énergie du Thème (Hex)</label>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={customHex}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomHex(val);
                      if (isValidHex(val)) setLocalSettings({ ...localSettings, themeColor: val });
                    }}
                    placeholder="Ex: #3b82f6"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[110] overflow-hidden">
                      {suggestions.map((s) => (
                        <button
                          key={s.hex}
                          onClick={() => updateColor(s.hex)}
                          className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/10 text-white transition-colors"
                        >
                          <span className="text-sm font-medium">{s.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono opacity-40">{s.hex}</span>
                            <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: s.hex }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div 
                  className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-inner flex-shrink-0" 
                  style={{ backgroundColor: localSettings.themeColor }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE.slice(0, 5).map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => updateColor(c.hex)}
                    className={`w-12 h-12 rounded-2xl border-2 transition-all hover:scale-110 active:scale-90 ${
                      localSettings.themeColor === c.hex ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Application Section */}
            {canInstall && (
              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Application</label>
                <button 
                  onClick={onInstall}
                  className="w-full py-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl font-bold text-blue-400 hover:bg-blue-600/30 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Installer sur l'appareil
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 p-6 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-4 text-white/60 font-bold hover:bg-white/5 rounded-2xl transition-colors border border-white/10"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-gray-200 transition-all active:scale-95"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
