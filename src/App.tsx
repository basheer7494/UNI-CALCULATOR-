import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CalculatorPage } from './components/CalculatorPage';
import { CategoryPage } from './components/CategoryPage';
import { AllCalculatorsPage } from './components/AllCalculatorsPage';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { route } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />
      
      <main className="flex-1">
        {route.view === 'home' && <HomePage />}
        {route.view === 'calculator' && <CalculatorPage idOrSlug={route.id} />}
        {route.view === 'category' && <CategoryPage category={route.category} />}
        {route.view === 'all' && <AllCalculatorsPage />}
      </main>

      <Footer />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
