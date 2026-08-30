import React, { useState } from 'react';
import { CalculatorCategory } from '../types/calculator';
import { CATEGORIES_CONFIG, getCalculatorsByCategory } from '../lib/calculatorRegistry';
import { useApp } from '../context/AppContext';
import { CalculatorCard } from './CalculatorCard';
import { DynamicIcon } from './Icon';
import { AdBanner } from './AdBanner';
import { ChevronRight, Search } from 'lucide-react';

interface CategoryPageProps {
  category: CalculatorCategory;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { navigateTo } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const catInfo = CATEGORIES_CONFIG.find(c => c.id === category) || CATEGORIES_CONFIG[0];
  const allInCat = getCalculatorsByCategory(category);

  const filteredCalculators = allInCat.filter(c => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
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
        <span className="text-slate-900 dark:text-white font-semibold capitalize">
          {catInfo.shortName} Calculators
        </span>
      </nav>

      {/* Category Hero Banner */}
      <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${catInfo.gradient} text-white shadow-xl shadow-blue-500/10`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/20 shrink-0">
              <DynamicIcon name={catInfo.iconName} className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {catInfo.name}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {allInCat.length} Tools
                </span>
              </div>
              <p className="text-sm text-blue-50/90 leading-relaxed">
                {catInfo.description}
              </p>
            </div>
          </div>

          {/* Quick Filter inside Category */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder={`Filter ${catInfo.shortName} tools...`}
                className="w-full pl-9 pr-3.5 py-2 text-xs text-white placeholder-white/60 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Available Calculators ({filteredCalculators.length})
          </h2>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {filteredCalculators.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No calculators found in this category matching &ldquo;{filterQuery}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCalculators.map(c => (
              <CalculatorCard key={c.id} calculator={c} />
            ))}
          </div>
        )}
      </div>

      {/* AdSense Placement */}
      <AdBanner format="horizontal" />
    </div>
  );
};
