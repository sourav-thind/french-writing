'use client';

import React from 'react';
import { TextCorrection } from '../services/geminiEvaluation';

interface TextCorrectionsProps {
  originalText: string;
  corrections: TextCorrection[];
}

const TextCorrections: React.FC<TextCorrectionsProps> = ({ 
  originalText, 
  corrections 
}) => {
  if (!corrections || corrections.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 mb-4">
        <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">
          <i className="fas fa-check-circle text-emerald-500 mr-2"></i>
          Votre texte corrigé
        </h3>
        <div className="bg-white dark:bg-neutral-950 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
          <p className="text-neutral-700 dark:text-neutral-300">{originalText}</p>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-2">
          Aucune correction nécessaire. Excellent travail !
        </p>
      </div>
    );
  }

  // Build the text with inline corrections
  const renderCorrectedParagraph = () => {
    const segments: JSX.Element[] = [];
    let lastIndex = 0;
    let keyIndex = 0;
    
    // Create a copy of corrections sorted by position in original text
    const sortedCorrections = corrections
      .map((c, idx) => ({
        ...c,
        position: originalText.toLowerCase().indexOf(c.original.toLowerCase(), lastIndex)
      }))
      .filter(c => c.position !== -1)
      .sort((a, b) => a.position - b.position);
    
    // Remove duplicates (same position)
    const uniqueCorrections = sortedCorrections.filter((item, index, self) =>
      index === self.findIndex((t) => t.position === item.position)
    );
    
    uniqueCorrections.forEach((correction) => {
      const pos = correction.position;
      
      // Add text before this correction
      if (pos > lastIndex) {
        segments.push(
          <span key={`text-${keyIndex++}`}>
            {originalText.substring(lastIndex, pos)}
          </span>
        );
      }
      
      // Add the error in red with strikethrough
      segments.push(
        <span 
          key={`error-${keyIndex++}`}
          className="text-rose-600 dark:text-rose-400 line-through decoration-2 px-0.5"
          title={correction.explanation}
        >
          {originalText.substring(pos, pos + correction.original.length)}
        </span>
      );
      
      // Add the correction in green right after
      segments.push(
        <span 
          key={`correct-${keyIndex++}`}
          className="text-emerald-600 dark:text-emerald-400 font-medium px-0.5"
          title={correction.explanation}
        >
          {correction.corrected}
        </span>
      );
      
      lastIndex = pos + correction.original.length;
    });
    
    // Add remaining text after last correction
    if (lastIndex < originalText.length) {
      segments.push(
        <span key={`end-${keyIndex}`}>{originalText.substring(lastIndex)}</span>
      );
    }
    
    return segments;
  };

  return (
    <div className="bg-neutral-50 dark:bg-white/10 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 mb-4">
      <h3 className="font-semibold text-neutral-800 dark:text-white mb-3 flex items-center gap-2">
        <i className="fas fa-spell-check text-neutral-500"></i>
        Votre texte avec corrections
      </h3>
      
      {/* Single paragraph with inline corrections */}
      <div className="bg-white dark:bg-white/20 rounded-lg p-4 text-base leading-relaxed whitespace-pre-wrap">
        {renderCorrectedParagraph()}
      </div>
      
      {/* Simple legend */}
      <div className="flex items-center gap-4 text-xs mt-3 text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="text-rose-600 dark:text-rose-400 line-through">erreur</span>
          <span>→</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">correction</span>
        </span>
      </div>
    </div>
  );
};

export default TextCorrections;
