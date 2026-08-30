import React, { useState } from 'react';
import { getAllCalculators, CATEGORIES_CONFIG } from '../lib/calculatorRegistry';
import { CalculatorCategory } from '../types/calculator';
import { useApp } from '../context/AppContext';
import { CalculatorCard } from './CalculatorCard';
import { Search, Layers, ChevronRight } from 'lucide-react';

export const AllCalculatorsPage: React.FC = () => {
  const { navigateTo } = useApp();
  const allCalcs = getAllCalculators();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<CalculatorCategory | 'all'>('all');

  const filtered = allCalcs.filter(c => {
    const matchCat = selectedCat === 'all' || c.category === selectedCat;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords?.some(k => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigateTo({ view: 'home' })}
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 dark:text-white font-semibold">
          All 40+ Calculators
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Universal Calculator Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse our complete catalog of {allCalcs.length} verified mathematical and scientific calculators.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all tools..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCat === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All Categories ({allCalcs.length})
        </button>

        {CATEGORIES_CONFIG.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.shortName} ({cat.count})
          </button>
        ))}
      </div>

      {/* Grid of Results */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-4">
          Showing {filtered.length} calculators
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No calculators found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <CalculatorCard key={c.id} calculator={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
