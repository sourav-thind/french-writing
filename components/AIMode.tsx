
import React from 'react';

const AIMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <button 
        onClick={onBack}
        className="text-slate-500 hover:text-slate-800 mb-8 flex items-center gap-2 transition-colors"
      >
        <i className="fas fa-arrow-left"></i> Retour à l'accueil
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-indigo-500">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <i className="fas fa-robot text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Tâche 1: Analyse d'Écriture</h2>
          <p className="text-slate-600 mb-6">
            L'IA analysera votre texte pour corriger la grammaire et suggérer des améliorations stylistiques en temps réel.
          </p>
          <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed">
            Prochainement
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-emerald-500">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <i className="fas fa-brain text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Tâche 2: Génération de Contexte</h2>
          <p className="text-slate-600 mb-6">
            Créez des scénarios d'écriture personnalisés basés sur vos centres d'intérêt pour une immersion totale.
          </p>
          <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed">
            Prochainement
          </button>
        </div>
      </div>

      <div className="mt-12 bg-indigo-50 rounded-2xl p-8 border border-indigo-100 text-center">
        <h3 className="text-indigo-800 font-bold mb-2 text-xl">Pourquoi le mode IA ?</h3>
        <p className="text-indigo-600">
          Nous travaillons sur l'intégration de Gemini 2.5 pour offrir des retours personnalisés sur votre structure de phrase et votre vocabulaire.
        </p>
      </div>
    </div>
  );
};

export default AIMode;
