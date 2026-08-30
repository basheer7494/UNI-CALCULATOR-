import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG } from '../lib/calculatorRegistry';
import { CurrencyCode } from '../lib/utils';
import { 
  Calculator, 
  Search, 
  Sun, 
  Moon, 
  Star, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles,
  Layers
} from 'lucide-react';
import { DynamicIcon } from './Icon';

export const Navbar: React.FC = () => {
  const { 
    route, 
    navigateTo, 
    currency, 
    setCurrency, 
    theme, 
    toggleTheme, 
    favorites, 
    setSearchOpen 
  } = useApp();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'INR', label: 'INR - Indian Rupee', symbol: '₹' },
    { code: 'USD', label: 'USD - US Dollar', symbol: '$' },
    { code: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { code: 'GBP', label: 'GBP - British Pound', symbol: '£' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => {
              navigateTo({ view: 'home' });
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Universal Calc
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  Hub
                </span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline -mt-0.5">
                Professional Math & Science Engine
              </span>
            </div>
          </div>

          {/* Search Trigger Bar (Center) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-800 transition-colors shadow-inner"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search 40+ calculators...</span>
              </span>
              <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCategoriesOpen(prev => !prev);
                  setCurrencyOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoriesOpen 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoriesOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      Browse by Category
                    </div>
                    {CATEGORIES_CONFIG.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigateTo({ view: 'category', category: cat.id });
                          setCategoriesOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${cat.bgLight}`}>
                            <DynamicIcon name={cat.iconName} className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {cat.shortName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {cat.count} tools available
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="p-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          navigateTo({ view: 'all' });
                          setCategoriesOpen(false);
                        }}
                        className="w-full text-center py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                      >
                        View All 40+ Calculators →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyOpen(prev => !prev);
                  setCategoriesOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCurrencyOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-20">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Select Currency
                    </div>
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currency === c.code 
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span className="font-mono font-bold text-sm">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Favorites Button */}
            <button
              onClick={() => {
                if (favorites.length > 0) {
                  navigateTo({ view: 'calculator', id: favorites[0] });
                } else {
                  navigateTo({ view: 'all' });
                }
              }}
              title="Saved Favorites"
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Star className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-in zoom-in-75 duration-200" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Search & Menu Triggers */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Calculator Categories
            </div>
            {CATEGORIES_CONFIG.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  navigateTo({ view: 'category', category: cat.id });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-left"
              >
                <div className="flex items-center gap-3">
                  <DynamicIcon name={cat.iconName} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Currency</span>
            <div className="flex gap-1">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    currency === c.code
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
