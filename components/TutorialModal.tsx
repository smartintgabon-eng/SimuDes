
import React, { useState } from 'react';

const TutorialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Bienvenue !", desc: "SimuDé Pro est votre nouvel allié pour tous vos jeux de plateau et décisions aléatoires.", icon: "🎲" },
    { title: "Personnalisation", desc: "Rendez-vous dans les paramètres pour changer le type de dé et la couleur de l'interface. Essayez les codes HEX !", icon: "🎨" },
    { title: "Lancement", desc: "Appuyez sur le bouton principal ou utilisez la touche [ESPACE] pour lancer le dé. La physique est 100% réaliste.", icon: "⚡" },
    { title: "Historique", desc: "Consultez vos 10 derniers résultats en bas de l'écran pour garder une trace de vos parties.", icon: "📜" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div className="glass rounded-[2rem] max-w-md w-full p-10 text-white border border-white/20 text-center animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-6">{steps[step].icon}</div>
        <h2 className="text-3xl font-black mb-4">{steps[step].title}</h2>
        <p className="text-white/70 leading-relaxed mb-10">{steps[step].desc}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}></div>
            ))}
          </div>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200">Suivant</button>
          ) : (
            <button onClick={onClose} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600">Compris !</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
