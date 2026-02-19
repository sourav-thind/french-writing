'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import APIKeyModal from './APIKeyModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-stone-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-neutral-200 dark:to-neutral-400 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-feather text-white dark:text-neutral-900 text-sm"></i>
            </div>
            <span className="font-semibold text-stone-800 dark:text-white">L&apos;Atelier d&apos;Écriture</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-neutral-700 transition-colors"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>

            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-9 h-9 rounded-full ring-2 ring-stone-200 dark:ring-neutral-600" 
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-rose-400 to-orange-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <button 
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        title="Configurer la clé API Gemini"
      >
        <i className="fas fa-key"></i>
      </button>

      <APIKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
