'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Collection } from '../types';
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
  const [hasError, setHasError] = useState(false);
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set());
  const [speed, setSpeed] = useState<SpeechSpeed>(0.9);
  const [showTranslation, setShowTranslation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSentence = collection.sentences[currentIndex];

  const startSentence = useCallback(() => {
    speechService.speak(currentSentence.french, speed);
    setUserInputs([]);
    setCurrentCharIdx(0);
    setIsFinished(false);
    setHasError(false);
    setWrongIndices(new Set());
    if (inputRef.current) inputRef.current.focus();
  }, [currentSentence, speed]);

  useEffect(() => {
    startSentence();
  }, [currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const target = currentSentence.french;
    if (e.key === 'Backspace') {
      if (currentCharIdx > 0) {
        const newInputs = [...userInputs];
        newInputs.pop();
        setUserInputs(newInputs);
        setCurrentCharIdx(prev => prev - 1);
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.delete(currentCharIdx - 1);
        setWrongIndices(newWrongIndices);
        setHasError(newWrongIndices.size > 0);
      }
      return;
    }
    if (e.key.length === 1) {
      const char = e.key;
      if (currentCharIdx >= target.length) return;
      const targetChar = target[currentCharIdx];
      const isCorrect = char.toLowerCase() === targetChar.toLowerCase();
      
      const newInputs = [...userInputs, char];
      setUserInputs(newInputs);
      setCurrentCharIdx(prev => prev + 1);
      
      if (isCorrect) {
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.delete(currentCharIdx);
        setWrongIndices(newWrongIndices);
        setHasError(newWrongIndices.size > 0);
      } else {
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.add(currentCharIdx);
        setWrongIndices(newWrongIndices);
        setHasError(true);
      }
      
      if (currentCharIdx + 1 === target.length && wrongIndices.size === 0 && isCorrect) {
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
    const newWrongIndices = new Set(wrongIndices);
    newWrongIndices.delete(currentCharIdx);
    setWrongIndices(newWrongIndices);
    setHasError(newWrongIndices.size > 0);
    if (currentCharIdx + 1 === currentSentence.french.length && newWrongIndices.size === 0) {
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
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors"
            >
              <i className="fas fa-arrow-left text-neutral-600"></i>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">{collection.name}</h1>
              <p className="text-sm text-neutral-500">Phrase {currentIndex + 1} sur {collection.sentences.length}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTranslation(!showTranslation)}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
          >
            {showTranslation ? 'Masquer' : 'Traduction'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 mb-6">
          <input 
            ref={inputRef}
            type="text"
            className="absolute opacity-0"
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <div className="flex items-center justify-center gap-4 mb-10">
            <button 
              onClick={toggleSpeed}
              className="px-4 py-2.5 bg-neutral-100 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              {speedLabel}
            </button>
            <button 
              onClick={playAgain}
              className="w-20 h-20 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 hover:scale-105 transition-all flex items-center justify-center text-3xl shadow-lg"
            >
              <i className="fas fa-volume-up"></i>
            </button>
            <button 
              onClick={playNextWord}
              className="px-4 py-2.5 bg-neutral-100 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              Mot suivant
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-3 mb-8 text-4xl font-mono">
            {currentSentence.french.split('').map((char, idx) => {
              const userInput = userInputs[idx];
              const isCurrent = idx === currentCharIdx;
              const isWrong = wrongIndices.has(idx);
              let colorClass = "text-neutral-200";
              let displayChar = char === ' ' ? '\u00A0' : '_';
            
              if (hasError) {
                colorClass = "text-red-500";
                if (isCurrent) {
                  displayChar = '\u00A0';
                } else if (userInput !== undefined) {
                  displayChar = isWrong ? (char === ' ' ? '\u00A0' : '_') : char;
                }
              } else if (userInput !== undefined) {
                const isCorrect = userInput.toLowerCase() === char.toLowerCase();
                colorClass = isCorrect ? "text-emerald-600" : "text-red-500";
                displayChar = char;
              }
            
              return (
                <span 
                  key={idx} 
                  className={`border-b-2 min-w-[1rem] text-center ${colorClass} ${isCurrent ? 'border-neutral-900 bg-neutral-50' : 'border-transparent'}`}
                  onClick={() => inputRef.current?.focus()}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['é', 'è', 'à', 'ô', 'û', 'î', 'ç', 'ï'].map((char) => (
              <button
                key={char}
                onClick={() => {
                  if (isFinished || currentCharIdx >= currentSentence.french.length) return;
                  const targetChar = currentSentence.french[currentCharIdx];
                  const isCorrect = char.toLowerCase() === targetChar.toLowerCase();
                  
                  const newInputs = [...userInputs, char];
                  setUserInputs(newInputs);
                  setCurrentCharIdx(prev => prev + 1);
                  
                  if (isCorrect) {
                    const newWrongIndices = new Set(wrongIndices);
                    newWrongIndices.delete(currentCharIdx);
                    setWrongIndices(newWrongIndices);
                    setHasError(newWrongIndices.size > 0);
                  } else {
                    const newWrongIndices = new Set(wrongIndices);
                    newWrongIndices.add(currentCharIdx);
                    setWrongIndices(newWrongIndices);
                    setHasError(true);
                  }
                  
                  if (currentCharIdx + 1 === currentSentence.french.length && wrongIndices.size === 0 && isCorrect) {
                    setIsFinished(true);
                  }
                  inputRef.current?.focus();
                }}
                className="w-12 h-12 bg-white border border-neutral-200 rounded-xl text-lg font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-sm"
              >
                {char}
              </button>
            ))}
          </div>

          {showTranslation && (
            <div className="text-center text-neutral-600 italic mb-8 px-8">
              &quot;{currentSentence.english}&quot;
            </div>
          )}

          <div className="flex justify-center">
            {!isFinished ? (
              <button 
                onClick={getHint}
                className="px-6 py-3 bg-amber-100 text-amber-800 rounded-xl font-medium hover:bg-amber-200 transition-colors"
              >
                <i className="fas fa-lightbulb mr-2"></i>
                Indice
              </button>
            ) : (
              <button 
                onClick={nextSentence}
                className="px-8 py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 hover:scale-105 transition-all shadow-lg"
              >
                Continuer
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-neutral-400 text-sm">
          Utilisez votre clavier pour taper la phrase
        </p>
      </div>
    </div>
  );
};

export default PracticeSession;
