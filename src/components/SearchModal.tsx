import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { searchCalculators, getPopularCalculators } from '../lib/calculatorRegistry';
import { CalculatorDefinition } from '../types/calculator';
import { DynamicIcon } from './Icon';
import { Search, X, Star, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, navigateTo, isFavorite, toggleFavorite } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculatorDefinition[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    if (query.trim()) {
      const hits = searchCalculators(query);
      setResults(hits);
      setSelectedIndex(0);
    } else {
      setResults(getPopularCalculators().slice(0, 8));
    }
  }, [query]);

  const handleSelect = (calc: CalculatorDefinition) => {
    setSearchOpen(false);
    navigateTo({ view: 'calculator', id: calc.slug });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] z-10"
        >
          {/* Header Search Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search 40+ calculators (e.g. SIP, EMI, CGPA, BMI, Ohm's law, GST)..."
              className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded font-mono border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick Suggestions / Results */}
          <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/50">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              {query ? (
                <>Found {results.length} Calculators</>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Trending & Popular Calculators
                </>
              )}
            </div>

            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No calculators found matching &ldquo;<span className="font-semibold text-slate-700 dark:text-slate-200">{query}</span>&rdquo;.
                <div className="mt-2 text-xs text-slate-400">
                  Try searching for keywords like &ldquo;loan&rdquo;, &ldquo;percentage&rdquo;, &ldquo;tax&rdquo;, or &ldquo;calories&rdquo;.
                </div>
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                {results.map((calc, index) => {
                  const isSelected = index === selectedIndex;
                  const fav = isFavorite(calc.id);

                  return (
                    <div
                      key={calc.id}
                      onClick={() => handleSelect(calc)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          <DynamicIcon name={calc.iconName} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">{calc.name}</span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                              {calc.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-md">
                            {calc.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(calc.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            fav
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
                          }`}
                          title={fav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${fav ? 'fill-amber-400' : ''}`} />
                        </button>
                        <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-700'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                  <CornerDownLeft className="w-2.5 h-2.5 inline" />
                </kbd>
                to open
              </span>
            </div>
            <span>Press ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
