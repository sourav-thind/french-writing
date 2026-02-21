'use client';

import { GoogleGenerativeAI } from '@google/generative-ai';

const STORAGE_KEY = 'gemini_api_key';

export const getGeminiAPIKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

export const setGeminiAPIKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, apiKey);
};

export const clearGeminiAPIKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export async function translateToEnglish(frenchSentences: string[]): Promise<string[]> {
  const apiKey = getGeminiAPIKey();
  
  if (!apiKey) {
    throw new Error('Clé API Gemini non configurée. Veuillez configurer votre clé API.');
  }

  const BATCH_SIZE = 50;
  const DELAY_BETWEEN_BATCHES = 2000;
  const allTranslations: string[] = [];

  for (let i = 0; i < frenchSentences.length; i += BATCH_SIZE) {
    const batch = frenchSentences.slice(i, i + BATCH_SIZE);
    const sentencesText = batch.join('\n');
    const prompt = `Traduisez les phrases françaises suivantes en anglais. Retournez uniquement un tableau JSON avec les traductions, sans autre texte.\n\n${sentencesText}`;

    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemma-3-27b-it',
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10000,
          }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = response.text();

        let cleanedText = generatedText.trim();
        cleanedText = cleanedText.replace(/```json[\r\n]?|```/gi, '');
        
        const translations = JSON.parse(cleanedText);
        
        if (Array.isArray(translations)) {
          allTranslations.push(...translations);
          success = true;
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (error: any) {
        attempts++;
        console.error(`Batch ${Math.floor(i/BATCH_SIZE) + 1} attempt ${attempts} failed:`, error.message);
        
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES * 2));
        } else if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw new Error(`Erreur de traduction: ${error.message}`);
        }
      }
    }

    if (i + BATCH_SIZE < frenchSentences.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  return allTranslations;
}
