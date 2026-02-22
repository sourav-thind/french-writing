'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { evaluateWriting, generateMockEvaluation, TEFEvaluation, getCLBDescription, getCLBColor } from '../services/geminiEvaluation';
import TextCorrections from './TextCorrections';

interface WritingInterfaceProps {
  question?: string;
  wordCountRange?: { min: number; max: number };
  taskType?: string;
  taskDescription?: string;
  onSubmit?: (content: string, wordCount: number) => void;
  submitButtonText?: string;
  showQuestion?: boolean;
  showTimer?: boolean;
  timeLimit?: number; // in minutes
  onEvaluationComplete?: (evaluation: TEFEvaluation) => void;
}

const FRENCH_ACCENTS = [
  'à', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ö', 'ù', 'û', 'ü', 
  'ç', 'Ç', 'œ', 'æ', '«', '»', "'", '-', '...', '€', '°'
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WritingInterface: React.FC<WritingInterfaceProps> = ({
  question,
  wordCountRange,
  taskType,
  taskDescription,
  onSubmit,
  submitButtonText = 'Soumettre',
  showQuestion = true,
  showTimer = true,
  timeLimit = 30, // Default 30 minutes
  onEvaluationComplete
}) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<TEFEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (showTimer && !evaluation) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [showTimer, evaluation]);

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
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + char.length;
      textarea.focus();
    }, 0);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsEvaluating(true);
    setError(null);
    
    try {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const timeSpent = formatTime(elapsedTime);
      
      let result: TEFEvaluation;
      let usedMockEvaluation = false;
      
      try {
        // Try to call Gemini evaluation
        console.log('Calling Gemini API...');
        result = await evaluateWriting(
          content,
          taskType || 'Tâche inconnue',
          taskDescription || question || '',
          wordCountRange?.min || 0,
          wordCountRange?.max || 999,
          wordCount,
          timeSpent
        );
        console.log('Gemini API succeeded');
      } catch (apiError: any) {
        console.warn('API evaluation failed, using mock evaluation:', apiError);
        // Fallback to mock evaluation
        result = generateMockEvaluation(content, wordCount, timeSpent);
        usedMockEvaluation = true;
      }
      
      // Only show demo warning if we actually used mock evaluation
      if (usedMockEvaluation) {
        setError('Mode démonstration: Évaluation simulée utilisée (l\'API Gemini n\'est pas disponible)');
      }
      
      setEvaluation(result);
      
      if (onEvaluationComplete) {
        onEvaluationComplete(result);
      }
      
      if (onSubmit) {
        onSubmit(content, wordCount);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'évaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  const isWithinWordCount = () => {
    if (!wordCountRange) return true;
    return wordCount >= wordCountRange.min && wordCount <= wordCountRange.max;
  };

  const getWordCountColor = () => {
    if (!wordCountRange) return 'text-stone-600 dark:text-neutral-300';
    if (wordCount === 0) return 'text-stone-400 dark:text-neutral-400';
    if (isWithinWordCount()) return 'text-emerald-600 dark:text-emerald-400';
    if (wordCount < wordCountRange.min) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Evaluation Results Panel */}
      {evaluation && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-700 p-6 mb-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-800 dark:text-white flex items-center gap-2">
              <i className="fas fa-award text-neutral-600 dark:text-neutral-400"></i>
              Résultats d'évaluation
            </h2>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getCLBColor(evaluation.overallCLB)}`}>
                CLB {evaluation.overallCLB}
              </div>
              <div className="text-sm text-stone-500 dark:text-neutral-400">
                {getCLBDescription(evaluation.overallCLB)}
              </div>
            </div>
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-stone-50 dark:bg-neutral-950/50 rounded-xl p-4 text-center">
              <div className="text-xs text-stone-500 dark:text-neutral-400 mb-1">Grammaire</div>
              <div className={`text-2xl font-bold ${getCLBColor(evaluation.grammarStructure.clbLevel)}`}>
                {evaluation.grammarStructure.score}/{evaluation.grammarStructure.maxScore}
              </div>
              <div className="text-xs text-stone-400 dark:text-neutral-500">CLB {evaluation.grammarStructure.clbLevel}</div>
            </div>
            
            <div className="bg-stone-50 dark:bg-neutral-950/50 rounded-xl p-4 text-center">
              <div className="text-xs text-stone-500 dark:text-neutral-400 mb-1">Vocabulaire</div>
              <div className={`text-2xl font-bold ${getCLBColor(evaluation.vocabulary.clbLevel)}`}>
                {evaluation.vocabulary.score}/{evaluation.vocabulary.maxScore}
              </div>
              <div className="text-xs text-stone-400 dark:text-neutral-500">CLB {evaluation.vocabulary.clbLevel}</div>
            </div>
            
            <div className="bg-stone-50 dark:bg-neutral-950/50 rounded-xl p-4 text-center">
              <div className="text-xs text-stone-500 dark:text-neutral-400 mb-1">Cohérence</div>
              <div className={`text-2xl font-bold ${getCLBColor(evaluation.coherenceCohesion.clbLevel)}`}>
                {evaluation.coherenceCohesion.score}/{evaluation.coherenceCohesion.maxScore}
              </div>
              <div className="text-xs text-stone-400 dark:text-neutral-500">CLB {evaluation.coherenceCohesion.clbLevel}</div>
            </div>
            
            <div className="bg-stone-50 dark:bg-neutral-950/50 rounded-xl p-4 text-center">
              <div className="text-xs text-stone-500 dark:text-neutral-400 mb-1">Tâche</div>
              <div className={`text-2xl font-bold ${getCLBColor(evaluation.taskCompletion.clbLevel)}`}>
                {evaluation.taskCompletion.score}/{evaluation.taskCompletion.maxScore}
              </div>
              <div className="text-xs text-stone-400 dark:text-neutral-500">CLB {evaluation.taskCompletion.clbLevel}</div>
            </div>
          </div>

          {/* Text Corrections - Shows inline corrections */}
          <TextCorrections 
            originalText={content}
            corrections={evaluation.corrections || []}
          />

          {/* Overall Feedback */}
          <div className="bg-indigo-50 dark:bg-neutral-800 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-stone-800 dark:text-white mb-2">Feedback général</h3>
            <p className="text-stone-700 dark:text-neutral-200 text-sm leading-relaxed">
              {evaluation.overallFeedback}
            </p>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-3 text-sm">
            <div className="border-l-4 border-neutral-600 dark:border-neutral-400 pl-4">
              <span className="font-semibold text-stone-700 dark:text-neutral-300">Grammaire et structure:</span>
              <p className="text-stone-600 dark:text-neutral-400">{evaluation.grammarStructure.feedback}</p>
            </div>
            <div className="border-l-4 border-violet-500 pl-4">
              <span className="font-semibold text-stone-700 dark:text-neutral-300">Vocabulaire:</span>
              <p className="text-stone-600 dark:text-neutral-400">{evaluation.vocabulary.feedback}</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <span className="font-semibold text-stone-700 dark:text-neutral-300">Cohérence et cohésion:</span>
              <p className="text-stone-600 dark:text-neutral-400">{evaluation.coherenceCohesion.feedback}</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <span className="font-semibold text-stone-700 dark:text-neutral-300">Réalisation de la tâche:</span>
              <p className="text-stone-600 dark:text-neutral-400">{evaluation.taskCompletion.feedback}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-stone-200 dark:border-neutral-700 text-sm text-stone-500 dark:text-neutral-400">
            <span><i className="fas fa-font mr-1"></i>{evaluation.wordCount} mots</span>
            <span><i className="fas fa-clock mr-1"></i>{evaluation.timeSpent}</span>
          </div>
        </div>
      )}

      {/* Question Section */}
      {showQuestion && question && !evaluation && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-white mb-3">
            <i className="fas fa-question-circle text-neutral-600 dark:text-neutral-400 mr-2"></i>
            Sujet
          </h2>
          <p className={`leading-relaxed ${question.startsWith('«') ? 'text-xl font-semibold text-stone-800 dark:text-white' : 'text-stone-700 dark:text-neutral-200'}`}>
            {question}
          </p>
        </div>
      )}

      {/* Timer and Word Counter */}
      {!evaluation && (
        <div className="flex justify-between items-center mb-3">
          {showTimer && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              elapsedTime > timeLimit * 60 
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                : 'bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-700'
            }`}>
              <i className="fas fa-clock"></i>
              <span className="font-medium">
                {formatTime(elapsedTime)}
              </span>
              {elapsedTime > timeLimit * 60 && (
                <span className="text-xs">(Temps dépassé)</span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200 dark:border-neutral-700">
            <i className="fas fa-font text-stone-400 dark:text-neutral-400"></i>
            <span className={`font-medium ${getWordCountColor()}`}>
              {wordCount} mots
            </span>
            {wordCountRange && (
              <span className="text-stone-400 dark:text-neutral-400">
                / {wordCountRange.min}-{wordCountRange.max}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Accent Buttons - Only show when not evaluated */}
      {!evaluation && (
        <div className="mb-4">
          <p className="text-sm text-stone-500 dark:text-neutral-400 mb-2">
            <i className="fas fa-keyboard mr-1"></i>
            Caractères spéciaux
          </p>
          <div className="flex flex-wrap gap-2">
            {FRENCH_ACCENTS.map((char) => (
              <button
                key={char}
                onClick={() => insertCharacter(char)}
                className="w-10 h-10 bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-600 rounded-lg text-lg font-medium text-stone-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:bg-neutral-700 hover:border-indigo-400 dark:hover:border-white transition-all shadow-sm"
                title={`Insérer ${char}`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Area - Read only after evaluation */}
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={evaluation ? "Évaluation complétée" : "Écrivez votre texte ici..."}
          readOnly={!!evaluation}
          className={`w-full h-[600px] p-6 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-neutral-500 focus:border-neutral-600 dark:border-neutral-400 dark:focus:border-indigo-400 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700 outline-none resize-none transition-all text-lg leading-relaxed ${
            evaluation ? 'bg-stone-50 dark:bg-neutral-950/50' : ''
          }`}
          spellCheck={false}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {/* Submit Button - Only show when not evaluated */}
      {!evaluation && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isEvaluating}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-neutral-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isEvaluating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Évaluation en cours...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                {submitButtonText}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default WritingInterface;
