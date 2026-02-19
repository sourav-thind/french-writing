'use client';

import React, { useState, useEffect } from 'react';
import { tefService, TEFTask } from '../services/tefService';
import WritingInterface from './WritingInterface';
import { TEFEvaluation } from '../services/geminiEvaluation';
import { useAuth } from '../contexts/AuthContext';

interface TEFTaskModeProps {
  onBack: () => void;
}

type TaskView = 'menu' | 'task1' | 'task2';

const TEFTaskMode: React.FC<TEFTaskModeProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<TaskView>('menu');
  const [currentTask, setCurrentTask] = useState<TEFTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<TEFEvaluation | null>(null);
  const { user } = useAuth();

  // Time limits: Tache 1 = 15 minutes, Tache 2 = 30 minutes
  const getTimeLimit = () => {
    if (currentView === 'task1') return 15;
    if (currentView === 'task2') return 30;
    return 30;
  };

  const loadTask = async (type: 'tache1' | 'tache2') => {
    setLoading(true);
    setError(null);
    setEvaluation(null);
    try {
      const task = await tefService.getRandomTask(type);
      if (task) {
        setCurrentTask(task);
        setCurrentView(type === 'tache1' ? 'task1' : 'task2');
      } else {
        setError('Aucune tâche disponible pour le moment.');
      }
    } catch (err) {
      setError('Erreur lors du chargement de la tâche.');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (content: string, wordCount: number) => {
    if (!user || !currentTask) return;
    
    try {
      await tefService.saveEssay({
        userId: user.uid,
        taskId: currentTask.id,
        taskType: currentTask.type,
        content,
        wordCount,
        submittedAt: new Date(),
        status: 'submitted'
      });
    } catch (err) {
      console.error('Error saving essay:', err);
    }
  };

  const handleEvaluationComplete = (evalResult: TEFEvaluation) => {
    setEvaluation(evalResult);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setCurrentTask(null);
    setError(null);
    setEvaluation(null);
  };

  const handleNewTask = () => {
    if (currentView === 'task1') {
      loadTask('tache1');
    } else if (currentView === 'task2') {
      loadTask('tache2');
    }
  };

  if (currentView === 'task1' || currentView === 'task2') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBackToMenu}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              >
                <i className="fas fa-arrow-left text-stone-600 dark:text-neutral-300"></i>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-stone-800 dark:text-white">
                  {currentView === 'task1' ? 'Tâche 1' : 'Tâche 2'}
                </h1>
                {currentTask && (
                  <p className="text-sm text-stone-500 dark:text-neutral-300">
                    {currentTask.title} • {currentTask.wordCount.min}-{currentTask.wordCount.max} mots
                  </p>
                )}
              </div>
            </div>
            
            {/* New Task Button - Show after evaluation */}
            {evaluation && (
              <button
                onClick={handleNewTask}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <i className="fas fa-redo"></i>
                Nouvelle tâche
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-stone-300 dark:border-neutral-600 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-stone-500 dark:text-neutral-300">Chargement...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-6 rounded-2xl">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          ) : currentTask ? (
            <WritingInterface
              question={currentTask.scenario}
              wordCountRange={currentTask.wordCount}
              taskType={currentTask.type === 'tache1' ? 'Tâche 1 - Expression écrite' : 'Tâche 2 - Expression écrite'}
              taskDescription={currentTask.description}
              onSubmit={handleSubmit}
              onEvaluationComplete={handleEvaluationComplete}
              submitButtonText="Soumettre pour évaluation IA"
              showQuestion={true}
              showTimer={true}
              timeLimit={getTimeLimit()}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // Menu View
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            <i className="fas fa-arrow-left text-stone-600 dark:text-neutral-300"></i>
          </button>
          <h1 className="text-2xl font-semibold text-stone-800 dark:text-white">TEF CANADA</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Task 1 Card */}
          <button 
            onClick={() => loadTask('tache1')}
            disabled={loading}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-neutral-700 text-left disabled:opacity-50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-500 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-pen text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Tâche 1</h2>
            <p className="text-stone-500 dark:text-neutral-300 text-sm leading-relaxed mb-4">
              Message, invitation, lettre informelle
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-neutral-400">
              <span><i className="fas fa-font mr-1"></i>60-120 mots</span>
              <span><i className="fas fa-clock mr-1"></i>15 min</span>
              <span><i className="fas fa-star mr-1"></i>15 pts</span>
            </div>
          </button>

          {/* Task 2 Card */}
          <button 
            onClick={() => loadTask('tache2')}
            disabled={loading}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-stone-200 dark:border-neutral-700 text-left disabled:opacity-50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg">
              <i className="fas fa-file-alt text-xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-stone-800 dark:text-white mb-2">Tâche 2</h2>
            <p className="text-stone-500 dark:text-neutral-300 text-sm leading-relaxed mb-4">
              Lettre formelle, opinion, réclamation
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-neutral-400">
              <span><i className="fas fa-font mr-1"></i>120-150 mots</span>
              <span><i className="fas fa-clock mr-1"></i>30 min</span>
              <span><i className="fas fa-star mr-1"></i>15 pts</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TEFTaskMode;
