'use client';

import React, { useState } from 'react';
import { AppMode, Collection, Sentence } from '../types';
import { COLLECTIONS } from '../constants';
import PracticeSession from './PracticeSession';
import AIMode from './AIMode';
import AuthScreen from './AuthScreen';
import Header from './Header';
import TEFTaskMode from './TEFTaskMode';
import NormalPracticeMode from './NormalPracticeMode';
import { useAuth } from '../contexts/AuthContext';

export default function AppContent() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<AppMode>('home');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [customCollections, setCustomCollections] = useState<Collection[]>([]);

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const sentences: Sentence[] = [];
        
        lines.forEach(line => {
          const parts = line.split(',');
          if (parts.length >= 2) {
            sentences.push({
              french: parts[0].trim(),
              english: parts[1].trim()
            });
          }
        });

        if (sentences.length > 0) {
          const newCol: Collection = {
            id: `custom-${Date.now()}`,
            name: file.name.replace('.csv', ''),
            description: 'Collection importée depuis un fichier CSV.',
            sentences
          };
          setCustomCollections(prev => [...prev, newCol]);
        }
      };
      reader.readAsText(file);
    }
  };

  const allCollections = [...COLLECTIONS, ...customCollections];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-indigo-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-300 dark:border-indigo-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-stone-500 dark:text-indigo-300 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (mode === 'practice' && selectedCollection) {
    return (
      <>
        <Header />
        <main className="pt-16">
          <PracticeSession
            collection={selectedCollection}
            onBack={() => {
              setMode('collections');
              setSelectedCollection(null);
            }}
          />
        </main>
      </>
    );
  }

  if (mode === 'ai') {
    return (
      <>
        <Header />
        <main className="pt-16">
          <AIMode 
            onBack={() => setMode('home')} 
            onSelectMode={(selectedMode) => setMode(selectedMode)}
          />
        </main>
      </>
    );
  }

  if (mode === 'collections') {
    return (
      <>
        <Header />
        <main className="pt-16">
          <div className="min-h-screen bg-stone-50 dark:bg-indigo-950 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <button 
                  onClick={() => setMode('home')}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <i className="fas fa-arrow-left text-stone-600 dark:text-indigo-300"></i>
                </button>
                <h1 className="text-2xl font-semibold text-stone-800 dark:text-white">Collections</h1>
              </div>

              <div className="grid gap-4 mb-12">
                {allCollections.map((col, index) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedCollection(col);
                      setMode('practice');
                    }}
                    className="group flex items-center justify-between p-5 bg-white dark:bg-indigo-900/20 rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-200 dark:border-indigo-800/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                        index % 3 === 0 ? 'bg-gradient-to-br from-indigo-500 to-violet-600' :
                        index % 3 === 1 ? 'bg-gradient-to-br from-rose-400 to-orange-400' :
                        'bg-gradient-to-br from-teal-500 to-emerald-500'
                      }`}>
                        <i className="fas fa-layer-group"></i>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-stone-800 dark:text-white">{col.name}</div>
                        <div className="text-sm text-stone-500 dark:text-indigo-300">{col.sentences.length} phrases</div>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-stone-300 dark:text-indigo-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"></i>
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-indigo-900/20 rounded-2xl p-6 border border-stone-200 dark:border-indigo-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-stone-800 dark:text-white mb-1">Importer vos phrases</h3>
                    <p className="text-sm text-stone-500 dark:text-indigo-300">Format CSV: français, anglais</p>
                  </div>
                  <label className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
                    <i className="fas fa-upload"></i>
                    Importer
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (mode === 'tef') {
    return (
      <>
        <Header />
        <main className="pt-16">
          <TEFTaskMode onBack={() => setMode('ai')} />
        </main>
      </>
    );
  }

  if (mode === 'normal-practice') {
    return (
      <>
        <Header />
        <main className="pt-16">
          <NormalPracticeMode onBack={() => setMode('ai')} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="min-h-screen bg-stone-50 dark:bg-indigo-950 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-semibold text-stone-800 dark:text-white mb-3">
              L&apos;Atelier d&apos;Écriture
            </h1>
            <p className="text-stone-500 dark:text-indigo-300">
              Bienvenue, {user.displayName || 'Apprenant'}. Prêt pour votre session ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
            <button 
              onClick={() => setMode('collections')}
              className="group relative overflow-hidden bg-white dark:bg-indigo-900/20 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-indigo-800/30 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-indigo-800/20 dark:to-violet-800/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
                <i className="fas fa-pen text-xl"></i>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Mode Pratique</h2>
              <p className="text-stone-500 dark:text-indigo-300 text-sm leading-relaxed">Dictées interactives pour améliorer votre orthographe et votre écoute.</p>
            </button>

            <button 
              onClick={() => setMode('ai')}
              className="group relative overflow-hidden bg-white dark:bg-indigo-900/20 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-indigo-800/30 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-800/20 dark:to-violet-800/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
                <i className="fas fa-sparkles text-xl"></i>
              </div>
              <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Mode IA</h2>
              <p className="text-stone-500 dark:text-indigo-300 text-sm leading-relaxed">Corrections assistées par intelligence artificielle.</p>
            </button>
          </div>

          <footer className="mt-20 text-stone-400 dark:text-indigo-500 text-sm">
            L&apos;Atelier d&apos;Écriture 2024
          </footer>
        </div>
      </main>
    </>
  );
}
