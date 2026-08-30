import React from 'react';
import { CalculatorDefinition } from '../types/calculator';
import { useApp } from '../context/AppContext';
import { DynamicIcon } from './Icon';
import { 
  ChevronRight, 
  Star, 
  Share2, 
  RotateCcw, 
  Sparkles,
  Printer
} from 'lucide-react';

interface CalculatorHeaderProps {
  calculator: CalculatorDefinition;
  onReset: () => void;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ calculator, onReset }) => {
  const { navigateTo, isFavorite, toggleFavorite, showToast } = useApp();
  const fav = isFavorite(calculator.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: calculator.name,
          text: calculator.description,
          url
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    
    navigator.clipboard.writeText(url);
    showToast('Direct calculator link copied to clipboard! 📋', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigateTo({ view: 'home' })}
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <button
          onClick={() => navigateTo({ view: 'category', category: calculator.category })}
          className="hover:text-slate-900 dark:hover:text-white capitalize transition-colors font-medium"
        >
          {calculator.category}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-none">
          {calculator.shortName}
        </span>
      </nav>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <DynamicIcon name={calculator.iconName} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {calculator.name}
              </h1>
              {calculator.popular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {calculator.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => toggleFavorite(calculator.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              fav
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${fav ? 'fill-amber-400' : ''}`} />
            <span>{fav ? 'Saved' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Share or Copy Link"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Reset to Default Values"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Print or Export as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
