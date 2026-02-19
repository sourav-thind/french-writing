'use client';

export const getGeminiAPIKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gemini_api_key');
};

export const setGeminiAPIKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gemini_api_key', apiKey);
};

export const clearGeminiAPIKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gemini_api_key');
};
