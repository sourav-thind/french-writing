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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);

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
      setTestResult(null);
    }
  };

  const handleClear = () => {
    clearGeminiAPIKey();
    setApiKey('');
    setIsSaved(false);
    setTestResult(null);
  };

  const testAPIKey = async () => {
    if (!apiKey.trim()) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say "API key is working" in French'
            }]
          }]
        })
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: '✓ Clé API valide ! L\'évaluation fonctionnera correctement.'
        });
      } else if (response.status === 400) {
        setTestResult({
          success: false,
          message: '✗ Clé API invalide. Vérifiez que vous avez copié la clé correctement.'
        });
      } else if (response.status === 401) {
        setTestResult({
          success: false,
          message: '✗ Clé API non autorisée. Vérifiez que la clé est active dans Google AI Studio.'
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestResult({
          success: false,
          message: `✗ Erreur: ${errorData.error?.message || 'Problème inconnu'}`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: '✗ Erreur de connexion. Vérifiez votre connexion internet.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-indigo-900/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-6 border border-stone-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 dark:text-white">Configuration API</h2>
            <p className="text-sm text-stone-500 dark:text-neutral-300">Clé API Gemini pour le mode IA</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-neutral-700 text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-neutral-200 mb-2">
              Clé API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Entrez votre clé API Gemini..."
              className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-950/50 border border-stone-200 dark:border-neutral-600 rounded-xl focus:border-neutral-600 dark:border-neutral-400 dark:focus:border-indigo-400 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 dark:focus:ring-neutral-800 outline-none text-sm transition-all text-stone-800 dark:text-white"
            />
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 text-indigo-600 dark:text-neutral-400 text-sm bg-indigo-50 dark:bg-neutral-800 px-4 py-2 rounded-lg">
              <i className="fas fa-check-circle"></i>
              <span>Clé API configurée</span>
            </div>
          )}

          {testResult && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${
              testResult.success 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' 
                : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
            }`}>
              <i className={`fas ${testResult.success ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <span>{testResult.message}</span>
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
            {apiKey.trim() && (
              <button
                onClick={testAPIKey}
                disabled={isTesting}
                className="px-4 py-3 bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-200 rounded-xl font-medium hover:bg-stone-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {isTesting ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <><i className="fas fa-vial mr-1"></i>Tester</>
                )}
              </button>
            )}
            {isSaved && (
              <button
                onClick={handleClear}
                className="px-4 py-3 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-xl font-medium transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>

          <div className="text-xs text-stone-400 dark:text-neutral-500 mt-4">
            <i className="fas fa-info-circle mr-1"></i>
            Obtenez une clé API gratuite sur{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-white underline"
            >
              Google AI Studio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyModal;
