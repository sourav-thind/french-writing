'use client';

import React, { useState, useEffect } from 'react';
import { getGeminiAPIKey, setGeminiAPIKey, clearGeminiAPIKey } from '../services/geminiService';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = getGeminiAPIKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setGeminiAPIKey(apiKey.trim());
      setIsSaved(true);
    }
  };

  const handleClear = () => {
    clearGeminiAPIKey();
    setApiKey('');
    setIsSaved(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-indigo-900/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-6 border border-stone-200 dark:border-indigo-800/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 dark:text-white">Configuration API</h2>
            <p className="text-sm text-stone-500 dark:text-indigo-300">Clé API Gemini pour le mode IA</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-indigo-800/50 text-stone-400 hover:text-stone-600 dark:hover:text-indigo-300 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-indigo-200 mb-2">
              Clé API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API Gemini..."
              className="w-full px-4 py-3 bg-stone-50 dark:bg-indigo-950/50 border border-stone-200 dark:border-indigo-700 rounded-xl focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 outline-none text-sm transition-all text-stone-800 dark:text-white"
            />
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <i className="fas fa-check-circle"></i>
              <span>Clé API configurée</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sauvegarder
            </button>
            {isSaved && (
              <button
                onClick={handleClear}
                className="px-4 py-3 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl font-medium transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyModal;
