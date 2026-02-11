
import React, { useState } from 'react';
import { AppMode, Collection, Sentence } from './types';
import { COLLECTIONS } from './constants';
import PracticeSession from './components/PracticeSession';
import AIMode from './components/AIMode';
import AuthScreen from './components/AuthScreen';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
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

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Chargement de votre atelier...</p>
        </div>
      </div>
    );
  }

  // --- AUTH GATE ---
  if (!user) {
    return <AuthScreen />;
  }

  // --- RENDERING LOGIC ---

  if (mode === 'practice' && selectedCollection) {
    return (
      <PracticeSession 
        collection={selectedCollection} 
        onBack={() => {
          setMode('collections');
          setSelectedCollection(null);
        }} 
      />
    );
  }

  if (mode === 'ai') {
    return <AIMode onBack={() => setMode('home')} />;
  }

  if (mode === 'collections') {
    return (
      <div className="min-h-screen bg-[#f1f5f9] pb-20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setMode('home')}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors font-medium"
            >
              <i className="fas fa-arrow-left"></i> Retour à l'accueil
            </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <i className="fas fa-layer-group text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Choisir une Collection</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {allCollections.map(col => (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedCollection(col);
                    setMode('practice');
                  }}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left hover:bg-indigo-50 hover:border-indigo-200 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <i className="fas fa-keyboard text-4xl text-indigo-600"></i>
                  </div>
                  <div className="font-bold text-lg text-slate-700 group-hover:text-indigo-700 mb-1">{col.name}</div>
                  <div className="text-sm text-slate-500">{col.sentences.length} phrases à pratiquer</div>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Importer vos phrases</h3>
                  <p className="text-xs text-slate-500 italic">Format CSV: français, anglais</p>
                </div>
                <label className="cursor-pointer bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors inline-flex items-center gap-2">
                  <i className="fas fa-file-upload"></i>
                  Téléverser un fichier
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
      </div>
    );
  }

  // DEFAULT: HOME SCREEN
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 relative">
      {/* User Bar */}
      <div className="absolute top-6 right-6 flex items-center gap-4 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white shadow-sm">
        <div className="flex items-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-indigo-100" />
          ) : (
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold uppercase">
              {user.email?.charAt(0)}
            </div>
          )}
          <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{user.displayName || user.email?.split('@')[0]}</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-200"></div>
        <button 
          onClick={logout}
          className="text-slate-400 hover:text-rose-500 transition-colors text-sm font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="hidden sm:inline">Quitter</span>
        </button>
      </div>

      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-4">
          L'Atelier <span className="text-indigo-600">d'Écriture</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto">
          Bienvenue, <span className="text-slate-800 font-bold">{user.displayName || 'Apprenant'}</span>. Prêt pour votre session ?
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Practice Mode Button */}
        <button 
          onClick={() => setMode('collections')}
          className="group bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-b-8 border-indigo-600 hover:-translate-y-2 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <i className="fas fa-pen-nib text-4xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Mode Pratique</h2>
            <p className="text-slate-500">Dictées interactives pour améliorer votre orthographe et votre écoute.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
            Commencer <i className="fas fa-chevron-right"></i>
          </span>
        </button>

        {/* AI Mode Button */}
        <button 
          onClick={() => setMode('ai')}
          className="group bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-b-8 border-emerald-600 hover:-translate-y-2 flex flex-col items-center text-center space-y-6 bg-gradient-to-br from-white to-emerald-50/20"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300 relative">
            <i className="fas fa-wand-magic-sparkles text-4xl"></i>
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Bêta</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Mode IA</h2>
            <p className="text-slate-500">Analyses intelligentes et corrections assistées par Gemini.</p>
          </div>
          <span className="inline-flex items-center gap-2 text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
            Découvrir <i className="fas fa-chevron-right"></i>
          </span>
        </button>
      </div>

      <footer className="mt-20 text-slate-400 text-sm font-medium">
        L'Atelier d'Écriture &copy; 2024
      </footer>
    </div>
  );
};

export default App;
