'use client';

import React from 'react';
import WritingInterface from './WritingInterface';
import { tefService } from '../services/tefService';
import { useAuth } from '../contexts/AuthContext';

interface NormalPracticeModeProps {
  onBack: () => void;
}

const NormalPracticeMode: React.FC<NormalPracticeModeProps> = ({ onBack }) => {
  const { user } = useAuth();

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
      
      // Show success
      alert('Votre texte a été sauvegardé !');
    } catch (err) {
      console.error('Error saving essay:', err);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-indigo-900/30 transition-colors"
          >
            <i className="fas fa-arrow-left text-stone-600 dark:text-indigo-300"></i>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-stone-800 dark:text-white">Pratique Libre</h1>
            <p className="text-sm text-stone-500 dark:text-indigo-300">
              Écrivez librement sur n&apos;importe quel sujet
            </p>
          </div>
        </div>

        <WritingInterface
          onSubmit={handleSubmit}
          submitButtonText="Sauvegarder mon texte"
          showQuestion={false}
        />
      </div>
    </div>
  );
};

export default NormalPracticeMode;
