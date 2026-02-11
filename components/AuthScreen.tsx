
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
      setError("Échec de la connexion avec Google. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            L'Atelier <span className="text-indigo-600">d'Écriture</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Votre voyage vers la maîtrise commence ici.</p>
        </div>

        <div className="glass rounded-[2.5rem] shadow-2xl p-10 border border-white">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-200">
              <i className="fas fa-feather-pointed text-3xl"></i>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bienvenue</h2>
            <p className="text-slate-500 text-center mb-8">Connectez-vous pour sauvegarder votre progression et accéder à toutes les collections.</p>

            {error && (
              <div className="w-full bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <i className="fas fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 px-6 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all group shadow-sm active:scale-[0.98]"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  Continuer avec Google
                </>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 w-full text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                Apprentissage Sécurisé
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm">
          En continuant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
