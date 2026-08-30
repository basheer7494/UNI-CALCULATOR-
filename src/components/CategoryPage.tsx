import React, { useState } from 'react';
import { CalculatorCategory, CalculatorDefinition } from '../types/calculator';
import { CATEGORIES_CONFIG, getCalculatorsByCategory } from '../lib/calculatorRegistry';
import { useApp } from '../context/AppContext';
import { CalculatorCard } from './CalculatorCard';
import { DynamicIcon } from './Icon';
import { AdBanner } from './AdBanner';
import { 
  ChevronRight, 
  Search, 
  Code2, 
  Cpu, 
  GraduationCap, 
  ArrowRightLeft, 
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';

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

  // Grouping for Education Category
  const isEducation = category === 'education';

  const programmingIds = [
    'time-complexity-analyzer',
    'big-o-comparison',
    'sorting-complexity',
    'data-structure-complexity',
    'recursion-master-theorem',
    'algorithm-cheat-sheet'
  ];

  const digitalLogicIds = [
    'kmap-solver',
    'boolean-simplifier',
    'number-system-converter'
  ];

  const academicIds = [
    'cgpa-calculator',
    'sgpa-calculator',
    'attendance-calculator',
    'required-marks-calculator'
  ];

  const conversionIds = [
    'cgpa-to-percentage-converter',
    'percentage-to-cgpa-converter',
    'percentage-calculator',
    'marks-percentage-calculator'
  ];

  const getGroupedCalculators = (ids: string[]) => {
    return filteredCalculators.filter(c => ids.includes(c.id));
  };

  const programmingTools = getGroupedCalculators(programmingIds);
  const digitalLogicTools = getGroupedCalculators(digitalLogicIds);
  const academicTools = getGroupedCalculators(academicIds);
  const conversionTools = getGroupedCalculators(conversionIds);

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
          {catInfo.shortName} Toolkit
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
                  {isEducation ? 'Student Calculation & Programming Analysis Toolkit' : catInfo.name}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {allInCat.length} Tools
                </span>
              </div>
              <p className="text-sm text-blue-50/90 leading-relaxed">
                {isEducation 
                  ? 'Advanced code complexity analysis, Big-O visualizers, K-Map solvers, Boolean logic simplifiers, and semester CGPA academic planners.'
                  : catInfo.description}
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

      {/* Featured Flagship Card for Education (When in Education view without active filter) */}
      {isEducation && !filterQuery && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white border border-indigo-800/40 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Flagship Feature
                </span>
                <span className="text-xs text-slate-400">100% In-Browser AST Parser</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                AI Time & Space Complexity Analyzer
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Paste any Python, C++, Java, or JavaScript algorithm to automatically compute Big-O bounds, loop nesting depths, recursive branching factor, and memory overhead with actionable optimization feedback.
              </p>
            </div>

            <button
              onClick={() => navigateTo({ view: 'calculator', id: 'time-complexity-analyzer' })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 shrink-0"
            >
              <Code2 className="w-4 h-4" />
              Open Code Analyzer
            </button>
          </div>
        </div>
      )}

      {/* Categorized Layout for Education or Standard Grid */}
      {isEducation ? (
        <div className="space-y-10">
          {/* Section 1: Programming & Complexity Analysis */}
          {programmingTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Programming & Algorithm Complexity Tools ({programmingTools.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {programmingTools.map(c => (
                  <CalculatorCard key={c.id} calculator={c} />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Digital Logic & Computer Architecture */}
          {digitalLogicTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Digital Logic & Computer Systems ({digitalLogicTools.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {digitalLogicTools.map(c => (
                  <CalculatorCard key={c.id} calculator={c} />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Academic & Grade Planners */}
          {academicTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Academic Grade & Attendance Planners ({academicTools.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {academicTools.map(c => (
                  <CalculatorCard key={c.id} calculator={c} />
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Score & Unit Converters */}
          {conversionTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Score, Percentage & Radix Converters ({conversionTools.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {conversionTools.map(c => (
                  <CalculatorCard key={c.id} calculator={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Standard Category Grid for other non-education categories */
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
              No calculators found matching &ldquo;{filterQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCalculators.map(c => (
                <CalculatorCard key={c.id} calculator={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* AdSense Placement */}
      <AdBanner format="horizontal" />
    </div>
  );
};
