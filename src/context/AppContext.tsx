import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode } from '../lib/utils';
import { CalculatorCategory } from '../types/calculator';
import { useTheme } from './ThemeContext';

export type Route = 
  | { view: 'home' }
  | { view: 'calculator'; id: string }
  | { view: 'category'; category: CalculatorCategory }
  | { view: 'all' };

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  route: Route;
  navigateTo: (route: Route) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  recents: string[];
  addRecent: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  // Routing with URL hash synchronization
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/calculator/')) {
      const id = hash.replace('/calculator/', '');
      return { view: 'calculator', id };
    }
    if (hash.startsWith('/category/')) {
      const category = hash.replace('/category/', '') as CalculatorCategory;
      return { view: 'category', category };
    }
    if (hash === '/all') {
      return { view: 'all' };
    }
    return { view: 'home' };
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('uch_currency') as CurrencyCode) || 'INR';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('uch_favorites') || '[]');
    } catch {
      return ['sip-calculator', 'bmi-calculator', 'gst-calculator', 'cgpa-to-percentage'];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('uch_recents') || '[]');
    } catch {
      return [];
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync hash when route changes
  const navigateTo = (newRoute: Route) => {
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (newRoute.view === 'home') {
      window.location.hash = '';
    } else if (newRoute.view === 'calculator') {
      window.location.hash = `/calculator/${newRoute.id}`;
      addRecent(newRoute.id);
    } else if (newRoute.view === 'category') {
      window.location.hash = `/category/${newRoute.category}`;
    } else if (newRoute.view === 'all') {
      window.location.hash = '/all';
    }
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/calculator/')) {
        const id = hash.replace('/calculator/', '');
        setRoute({ view: 'calculator', id });
      } else if (hash.startsWith('/category/')) {
        const category = hash.replace('/category/', '') as CalculatorCategory;
        setRoute({ view: 'category', category });
      } else if (hash === '/all') {
        setRoute({ view: 'all' });
      } else {
        setRoute({ view: 'home' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('uch_currency', c);
    showToast(`Currency updated to ${c}`, 'info');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('uch_favorites', JSON.stringify(updated));
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites ⭐', 'success');
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addRecent = (id: string) => {
    setRecents(prev => {
      const filtered = prev.filter(item => item !== id);
      const updated = [id, ...filtered].slice(0, 10);
      localStorage.setItem('uch_recents', JSON.stringify(updated));
      return updated;
    });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        route,
        navigateTo,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        recents,
        addRecent,
        searchOpen,
        setSearchOpen,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
