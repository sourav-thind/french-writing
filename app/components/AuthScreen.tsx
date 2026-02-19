'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError("Échec de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-orange-50 dark:from-indigo-950 dark:to-violet-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <i className="fas fa-feather text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-semibold text-stone-800 dark:text-white mb-2">
            L&apos;Atelier d&apos;Écriture
          </h1>
          <p className="text-stone-500 dark:text-neutral-300">Votre voyage vers la maîtrise commence ici.</p>
        </div>

        <div className="bg-white/80 dark:bg-neutral-900 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 dark:border-neutral-700 p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-600 py-3.5 px-4 rounded-xl font-medium text-stone-700 dark:text-neutral-100 hover:border-neutral-600 dark:border-neutral-400 dark:hover:border-white hover:shadow-md transition-all"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continuer avec Google
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-center text-stone-400 dark:text-neutral-500 text-sm">
          En continuant, vous acceptez nos conditions.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
