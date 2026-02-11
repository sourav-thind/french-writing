
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sentence, Collection } from '../types';
import { speechService } from '../services/speechService';

interface PracticeSessionProps {
  collection: Collection;
  onBack: () => void;
}

type SpeechSpeed = 0.6 | 0.9 | 1.3;

const PracticeSession: React.FC<PracticeSessionProps> = ({ collection, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState<SpeechSpeed>(0.9);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSentence = collection.sentences[currentIndex];

  const startSentence = useCallback(() => {
    speechService.speak(currentSentence.french, speed);
    setUserInputs([]);
    setCurrentCharIdx(0);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  }, [currentSentence, speed]);

  useEffect(() => {
    startSentence();
  }, [currentIndex]); // Only restart when the sentence index changes, speed changes handled by buttons

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const target = currentSentence.french;
    
    if (e.key === 'Backspace') {
      if (currentCharIdx > 0) {
        const newInputs = [...userInputs];
        newInputs.pop();
        setUserInputs(newInputs);
        setCurrentCharIdx(prev => prev - 1);
      }
      return;
    }

    if (e.key.length === 1) {
      const char = e.key;
      if (currentCharIdx >= target.length) return;

      const newInputs = [...userInputs, char];
      setUserInputs(newInputs);
      setCurrentCharIdx(prev => prev + 1);

      if (currentCharIdx + 1 === target.length) {
        setIsFinished(true);
      }
    }
  };

  const getHint = () => {
    if (isFinished || currentCharIdx >= currentSentence.french.length) return;
    const hintChar = currentSentence.french[currentCharIdx];
    const newInputs = [...userInputs, hintChar];
    setUserInputs(newInputs);
    setCurrentCharIdx(prev => prev + 1);
    if (currentCharIdx + 1 === currentSentence.french.length) {
      setIsFinished(true);
    }
  };

  const nextSentence = () => {
    if (currentIndex < collection.sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onBack();
    }
  };

  const playAgain = () => speechService.speak(currentSentence.french, speed);
  const playNextWord = () => speechService.speakWordAt(currentSentence.french, currentCharIdx, speed);

  const toggleSpeed = () => {
    setSpeed(prev => {
      if (prev === 0.6) return 0.9;
      if (prev === 0.9) return 1.3;
      return 0.6;
    });
  };

  const speedLabel = speed === 0.6 ? "Lent" : speed === 0.9 ? "Normal" : "Rapide";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors font-medium"
        >
          <i className="fas fa-arrow-left"></i> Retour aux collections
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 mb-8 min-h-[500px] flex flex-col items-center relative overflow-hidden border border-slate-100">
        {/* Hidden input to capture keyboard events */}
        <input 
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {/* Central Voice Controls */}
        <div className="flex items-center gap-6 mb-16 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
          <button 
            onClick={toggleSpeed}
            className="flex flex-col items-center justify-center w-20 h-20 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all shadow-md border border-slate-200"
            title="Changer la vitesse"
          >
            <i className="fas fa-gauge-high text-xl mb-1"></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{speedLabel}</span>
          </button>

          <button 
            onClick={playAgain}
            className="w-24 h-24 bg-indigo-600 text-white rounded-3xl hover:bg-indigo-700 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Réécouter toute la phrase"
          >
            <i className="fas fa-volume-up text-4xl"></i>
          </button>

          <button 
            onClick={playNextWord}
            className="w-20 h-20 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Écouter le mot suivant"
          >
            <i className="fas fa-forward-step text-2xl"></i>
          </button>
        </div>

        {/* Typing Area */}
        <div className="w-full mb-16 flex flex-wrap justify-center gap-x-1.5 gap-y-3 px-4">
          {currentSentence.french.split('').map((char, idx) => {
            const userInput = userInputs[idx];
            let colorClass = "text-slate-200";
            
            if (userInput !== undefined) {
              const isCorrect = userInput.toLowerCase() === char.toLowerCase();
              colorClass = isCorrect ? "text-emerald-500" : "text-rose-500";
            }

            const isCurrent = idx === currentCharIdx;

            return (
              <span 
                key={idx} 
                className={`text-4xl md:text-6xl font-bold mono-font border-b-4 transition-all duration-150 min-w-[1.2rem] text-center ${colorClass} ${isCurrent ? 'border-indigo-500 bg-indigo-50/50' : 'border-transparent'}`}
                onClick={() => inputRef.current?.focus()}
              >
                {userInput !== undefined ? char : (char === ' ' ? '\u00A0' : '_')}
                {isCurrent && <span className="absolute w-[3px] h-12 bg-indigo-500 cursor-blink -mt-1 ml-0.5" />}
              </span>
            );
          })}
        </div>

        <div className="mt-auto w-full text-center">
          <div className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-3 font-black">Traduction Anglaise</div>
          <p className="text-2xl md:text-3xl text-slate-700 italic font-medium leading-relaxed">
            "{currentSentence.english}"
          </p>
        </div>

        <div className="mt-16 flex gap-4 w-full justify-center">
          {!isFinished ? (
            <button 
              onClick={getHint}
              className="px-10 py-4 bg-amber-500 text-white rounded-2xl font-black text-lg hover:bg-amber-600 transition-all shadow-xl hover:shadow-amber-200 uppercase tracking-wide"
            >
              <i className="fas fa-lightbulb mr-3"></i> Besoin d'aide ?
            </button>
          ) : (
            <button 
              onClick={nextSentence}
              className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl hover:shadow-indigo-300 animate-pulse uppercase tracking-wider"
            >
              Continuer <i className="fas fa-chevron-right ml-3"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center text-slate-400 text-sm font-medium bg-slate-100 py-3 rounded-full border border-slate-200">
        Utilisez votre clavier pour taper la phrase entendue.
      </div>
    </div>
  );
};

export default PracticeSession;
