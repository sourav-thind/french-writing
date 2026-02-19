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
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Configuration API</h2>
            <p className="text-sm text-neutral-500">Clé API Gemini pour le mode IA</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Clé API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API Gemini..."
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 outline-none text-sm transition-all"
            />
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-2 rounded-lg">
              <i className="fas fa-check-circle"></i>
              <span>Clé API configurée</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sauvegarder
            </button>
            {isSaved && (
              <button
                onClick={handleClear}
                className="px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
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
