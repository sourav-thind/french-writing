'use client';

import React from 'react';

interface AIModeProps {
  onBack: () => void;
  onSelectMode: (mode: 'tef' | 'normal-practice') => void;
}

const AIMode: React.FC<AIModeProps> = ({ onBack, onSelectMode }) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <i className="fas fa-arrow-left text-stone-600 dark:text-neutral-300"></i>
          </button>
          <h1 className="text-2xl font-semibold text-stone-800 dark:text-white">Mode IA</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button 
            onClick={() => onSelectMode('tef')}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-neutral-700 text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-500 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-certificate text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">TEF CANADA</h2>
            <p className="text-stone-500 dark:text-neutral-300 text-sm leading-relaxed">Pratiquez avec des sujets spécifiques à l&apos;examen TEF CANADA.</p>
          </button>

          <button 
            onClick={() => onSelectMode('normal-practice')}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-neutral-700 text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-800/20 dark:to-violet-800/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-pen-fancy text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Pratique Normale</h2>
            <p className="text-stone-500 dark:text-neutral-300 text-sm leading-relaxed">Écrivez librement et obtenez des corrections personnalisées.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMode;
