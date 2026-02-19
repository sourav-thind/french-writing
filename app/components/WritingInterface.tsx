'use client';

import React, { useState, useRef, useCallback } from 'react';

interface WritingInterfaceProps {
  question?: string;
  wordCountRange?: { min: number; max: number };
  onSubmit: (content: string, wordCount: number) => void;
  submitButtonText?: string;
  showQuestion?: boolean;
}

const FRENCH_ACCENTS = [
  'à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ö', 'ù', 'û', 'ü', 
  'ç', 'Ç', 'œ', 'æ', '«', '»', "'", '-', '...', '€', '°'
];

const WritingInterface: React.FC<WritingInterfaceProps> = ({
  question,
  wordCountRange,
  onSubmit,
  submitButtonText = 'Soumettre',
  showQuestion = true
}) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(countWords(newContent));
  };

  const insertCharacter = (char: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + char + content.substring(end);
    setContent(newContent);
    setWordCount(countWords(newContent));
    
    // Set cursor position after the inserted character
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + char.length;
      textarea.focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, wordCount);
    }
  };

  const isWithinWordCount = () => {
    if (!wordCountRange) return true;
    return wordCount >= wordCountRange.min && wordCount <= wordCountRange.max;
  };

  const getWordCountColor = () => {
    if (!wordCountRange) return 'text-stone-600 dark:text-indigo-300';
    if (wordCount === 0) return 'text-stone-400 dark:text-indigo-400';
    if (isWithinWordCount()) return 'text-emerald-600 dark:text-emerald-400';
    if (wordCount < wordCountRange.min) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question Section */}
      {showQuestion && question && (
        <div className="bg-white dark:bg-indigo-900/20 rounded-2xl border border-stone-200 dark:border-indigo-800/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-white mb-3">
            <i className="fas fa-question-circle text-indigo-500 mr-2"></i>
            Sujet
          </h2>
          <p className="text-stone-700 dark:text-indigo-200 leading-relaxed">
            {question}
          </p>
        </div>
      )}

      {/* Word Counter */}
      <div className="flex justify-end mb-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-indigo-900/20 rounded-xl border border-stone-200 dark:border-indigo-800/30">
          <i className="fas fa-font text-stone-400 dark:text-indigo-400"></i>
          <span className={`font-medium ${getWordCountColor()}`}>
            {wordCount} mots
          </span>
          {wordCountRange && (
            <span className="text-stone-400 dark:text-indigo-400">
              / {wordCountRange.min}-{wordCountRange.max}
            </span>
          )}
        </div>
      </div>

      {/* Accent Buttons */}
      <div className="mb-4">
        <p className="text-sm text-stone-500 dark:text-indigo-400 mb-2">
          <i className="fas fa-keyboard mr-1"></i>
          Caractères spéciaux
        </p>
        <div className="flex flex-wrap gap-2">
          {FRENCH_ACCENTS.map((char) => (
            <button
              key={char}
              onClick={() => insertCharacter(char)}
              className="w-10 h-10 bg-white dark:bg-indigo-900/40 border border-stone-200 dark:border-indigo-700 rounded-lg text-lg font-medium text-stone-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-800/50 hover:border-indigo-400 dark:hover:border-indigo-400 transition-all shadow-sm"
              title={`Insérer ${char}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Écrivez votre texte ici..."
          className="w-full h-96 p-6 bg-white dark:bg-indigo-900/20 border border-stone-200 dark:border-indigo-800/30 rounded-2xl text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-indigo-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none resize-none transition-all text-lg leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
        >
          <i className="fas fa-paper-plane"></i>
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default WritingInterface;
