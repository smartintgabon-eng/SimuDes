
import React from 'react';

const UpdatesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
    <div className="glass rounded-[2rem] max-w-lg w-full p-8 text-white border border-white/20 animate-in fade-in zoom-in duration-300">
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
        <span className="bg-blue-500 w-2 h-8 rounded-full"></span>
        Mises à jour
      </h2>
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
        <div className="border-l-2 border-white/10 pl-4 py-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">v2.1.0 - Aujourd'hui</span>
          <h3 className="text-lg font-bold mt-1">Refonte Graphique "Sombre Pro"</h3>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">
            Interface totalement repensée avec un thème sombre natif, des effets de flou de mouvement et une physique de dé améliorée.
          </p>
        </div>
        <div className="border-l-2 border-white/10 pl-4 py-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">v2.0.0</span>
          <h3 className="text-lg font-bold mt-1">Moteur de Suggestion de Couleurs</h3>
          <p className="text-white/60 text-sm mt-2">
            Ajout de l'autocomplétion intelligente pour les codes hexadécimaux avec aperçus en temps réel.
          </p>
        </div>
        <div className="border-l-2 border-white/10 pl-4 py-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">v1.5.0</span>
          <h3 className="text-lg font-bold mt-1">Dés Multi-Faces</h3>
          <p className="text-white/60 text-sm mt-2">
            Support complet des dés D4, D8, D10, D12 et D20 avec géométrie précise.
          </p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-full mt-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all"
      >
        Fermer
      </button>
    </div>
  </div>
);

export default UpdatesModal;
