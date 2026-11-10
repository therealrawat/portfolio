/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ViewMode = '2d' | '3d';

interface ViewModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const STORAGE_KEY = 'priyanshu_folio_mode';

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    // Check URL parameters or hash first
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const paramMode = params.get('mode') || params.get('view');
      
      if (hash === '#3d' || paramMode === '3d') {
        return '3d';
      }
      if (hash === '#2d' || hash === '#standard' || paramMode === '2d') {
        return '2d';
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
      if (saved === '3d' || saved === '2d') {
        return saved;
      }
    }
    return '2d';
  });

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
      const url = new URL(window.location.href);
      if (newMode === '3d') {
        url.hash = '3d';
      } else {
        url.hash = '';
      }
      window.history.replaceState(null, '', url.toString());
    }
  };

  const toggleMode = () => {
    setMode(mode === '2d' ? '3d' : '2d');
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#3d') {
        setModeState('3d');
      } else if (hash === '#2d' || hash === '#standard') {
        setModeState('2d');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ViewModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
