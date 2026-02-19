'use client';

import React, { useState } from 'react';
import WritingInterface from './WritingInterface';
import { tefService } from '../services/tefService';
import { useAuth } from '../contexts/AuthContext';

interface NormalPracticeModeProps {
  onBack: () => void;
}

const NormalPracticeMode: React.FC<NormalPracticeModeProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (content: string, wordCount: number) => {
    if (!user) return;
    
    try {
      await tefService.saveEssay({
        userId: user.uid,
        taskId: 'practice',
        taskType: 'practice',
        content,
        wordCount,
        submittedAt: new Date(),
        status: 'submitted'
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving essay:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            >
              <i className="fas fa-arrow-left text-stone-600 dark:text-neutral-300"></i>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-stone-800 dark:text-white">Pratique Libre</h1>
              <p className="text-sm text-stone-500 dark:text-neutral-300">
                Écrivez librement sur n&apos;importe quel sujet
              </p>
            </div>
          </div>
          
          {submitted && (
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-redo"></i>
              Nouveau texte
            </button>
          )}
        </div>

        <WritingInterface
          onSubmit={handleSubmit}
          submitButtonText="Sauvegarder mon texte"
          showQuestion={false}
          showTimer={false}
        />
      </div>
    </div>
  );
};

export default NormalPracticeMode;
