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
  const translations: string[] = [];
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 300;

  for (let i = 0; i < frenchSentences.length; i += BATCH_SIZE) {
    const batch = frenchSentences.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (french) => {
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(french)}&langpair=fr|en`
        );
        const data = await response.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          return data.responseData.translatedText;
        }
        return french;
      } catch (error) {
        console.error('Translation error:', error);
        return french;
      }
    });

    const batchTranslations = await Promise.all(promises);
    translations.push(...batchTranslations);

    if (i + BATCH_SIZE < frenchSentences.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  return translations;
}
