'use client';

import dynamic from 'next/dynamic';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './globals.css';

const AppContent = dynamic(() => import('./components/AppContent'), {
  ssr: false,
});

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
