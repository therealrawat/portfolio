/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ViewMode = '2d' | '3d';

interface ViewModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = 'priyanshu_folio_mode';

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    // Always default to standard (2D) portfolio; only enter 3D upfront if explicitly requested via query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramMode = params.get('mode') || params.get('view');
      if (paramMode === '3d') {
        return '3d';
      }
    }
    return '2d';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Clear any previously persisted 3D preference or stale #3d hash so loads always start in standard view
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    if (window.location.hash.toLowerCase() === '#3d') {
      const url = new URL(window.location.href);
      url.hash = '';
      window.history.replaceState(null, '', url.toString());
    }
  }, []);

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined' && newMode === '2d' && window.location.hash.toLowerCase() === '#3d') {
      const url = new URL(window.location.href);
      url.hash = '';
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
