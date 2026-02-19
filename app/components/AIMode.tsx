'use client';

import React from 'react';

const AIMode: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const handleTEFCanada = () => {
    console.log('TEF CANADA mode selected');
  };

  const handleNormalPractice = () => {
    console.log('Normal Practice mode selected');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <i className="fas fa-arrow-left text-neutral-600 dark:text-neutral-400"></i>
          </button>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Mode IA</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button 
            onClick={handleTEFCanada}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-certificate text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">TEF CANADA</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Pratiquez avec des sujets spécifiques à l&apos;examen TEF CANADA.</p>
          </button>

          <button 
            onClick={handleNormalPractice}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-neutral-200 dark:border-neutral-800 text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-pen-fancy text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Pratique Normale</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">Écrivez librement et obtenez des corrections personnalisées.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMode;
