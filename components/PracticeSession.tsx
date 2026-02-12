

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sentence, Collection } from '../types';
import { speechService } from '../services/speechService';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection as firestoreCollection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

const storage = getStorage(app);
const db = getFirestore(app);

interface PracticeSessionProps {
  collection: Collection;
  onBack: () => void;
}

type SpeechSpeed = 0.6 | 0.9 | 1.3;

const PracticeSession: React.FC<PracticeSessionProps> = ({ collection, onBack }) => {
  // --- File Upload State ---
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      fetchUserFiles(user.uid);
    } else if (!user) {
      setUploadedFiles([]);
    }
  }, [user, loading]);

  const fetchUserFiles = async (uid: string) => {
    try {
      const filesRef = firestoreCollection(db, 'userFiles');
      const q = query(filesRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const files = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploadedFiles(files);
    } catch (err) {
      setError('Could not fetch files.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    try {
      const storageRef = ref(storage, `user_uploads/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      // Save metadata in Firestore
      await addDoc(firestoreCollection(db, 'userFiles'), {
        uid: user.uid,
        name: file.name,
        url,
        uploadedAt: new Date()
      });
      setFile(null);
      fetchUserFiles(user.uid);
    } catch (err: any) {
      setError('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  // --- Practice Session State ---
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

  const toggleTranslation = () => setShowTranslation(prev => !prev);

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
        // Remove from wrong indices if it was wrong
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.delete(currentCharIdx - 1);
        setWrongIndices(newWrongIndices);
        // Update hasError based on remaining wrong indices
        setHasError(newWrongIndices.size > 0);
      }
      return;
    }
    if (e.key.length === 1) {
      const char = e.key;
      if (currentCharIdx >= target.length) return;
      const targetChar = target[currentCharIdx];
      const isCorrect = char.toLowerCase() === targetChar.toLowerCase();
      
      // Always save the input
      const newInputs = [...userInputs, char];
      setUserInputs(newInputs);
      setCurrentCharIdx(prev => prev + 1);
      
      if (isCorrect) {
        // Remove from wrong indices if correcting a previous wrong
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.delete(currentCharIdx);
        setWrongIndices(newWrongIndices);
        setHasError(newWrongIndices.size > 0);
      } else {
        // Mark this index as wrong
        const newWrongIndices = new Set(wrongIndices);
        newWrongIndices.add(currentCharIdx);
        setWrongIndices(newWrongIndices);
        setHasError(true);
      }
      
      // Check completion
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
    // Remove this index from wrong indices if it was there
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
    <div className="max-w-4xl mx-auto p-4 md:p-8">

      {/* Main Practice UI */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 mb-8 min-h-[320px] max-w-5xl w-full flex flex-col items-center relative overflow-hidden border border-slate-100">
        {/* Back button - top left */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors font-medium z-10"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        {/* Translation toggle - top right */}
        <button 
          onClick={toggleTranslation}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors font-medium z-10 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100"
          title={showTranslation ? "Masquer la traduction" : "Afficher la traduction"}
        >
          <i className={`fas ${showTranslation ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          <span className="text-sm">{showTranslation ? "Cacher" : "Traduire"}</span>
        </button>

        {/* Hidden input to capture keyboard events */}
        <input 
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {/* Central Voice Controls */}
        <div className="flex items-center gap-6 mb-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner mt-0">
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
        <div className="w-full mb-6 flex flex-wrap justify-center gap-x-1.5 gap-y-3 px-4">
            {currentSentence.french.split('').map((char, idx) => {
              const userInput = userInputs[idx];
              const isCurrent = idx === currentCharIdx;
              const isWrong = wrongIndices.has(idx);
              let colorClass = "text-slate-200";
              let displayChar = char === ' ' ? '\u00A0' : '_';
            
              if (hasError) {
                colorClass = "text-rose-500";
                if (isCurrent) {
                  displayChar = '\u00A0';
                } else if (userInput !== undefined) {
                  // Show empty space for wrong characters, correct char for right ones
                  displayChar = isWrong ? (char === ' ' ? '\u00A0' : '_') : char;
                }
              } else if (userInput !== undefined) {
                const isCorrect = userInput.toLowerCase() === char.toLowerCase();
                colorClass = isCorrect ? "text-emerald-500" : "text-rose-500";
                displayChar = char;
              }
            
              return (
                <span 
                  key={idx} 
                  className={`text-4xl md:text-5xl font-bold font-mono border-b-2 transition-all duration-150 min-w-[0.9rem] text-center ${colorClass} ${isCurrent ? 'border-indigo-500 bg-indigo-50/50' : 'border-transparent'}`}
                  onClick={() => inputRef.current?.focus()}
                >
                  {displayChar}
                  {isCurrent && <span className="absolute w-[1.5px] h-5 bg-indigo-500 cursor-blink -mt-1 ml-0.5" />}
                </span>
              );
            })}
        </div>

        {/* French Character Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
          {['é', 'è', 'à', 'ô', 'û', 'î', 'ç', 'ï', '«', '»'].map((char) => (
            <button
              key={char}
              onClick={() => {
                if (isFinished || currentCharIdx >= currentSentence.french.length) return;
                const targetChar = currentSentence.french[currentCharIdx];
                const isCorrect = char.toLowerCase() === targetChar.toLowerCase();
                
                // Always save the input
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
              className="w-10 h-10 bg-white border border-slate-300 rounded-lg text-lg font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
            >
              {char}
            </button>
          ))}
        </div>

        {showTranslation && (
          <div className="mt-auto w-full text-center">
            <div className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-3 font-black">Traduction Anglaise</div>
            <p className="text-xl md:text-xl text-slate-700 italic font-medium leading-relaxed">
              "{currentSentence.english}"
            </p>
          </div>
        )}

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
