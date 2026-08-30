import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CATEGORIES_CONFIG, 
  getPopularCalculators, 
  getFeaturedCalculators 
} from '../lib/calculatorRegistry';
import { CalculatorCard } from './CalculatorCard';
import { DynamicIcon } from './Icon';
import { AdBanner } from './AdBanner';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Layers,
  Calculator
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { navigateTo, setSearchOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'popular' | 'featured'>('popular');

  const popularCalcs = getPopularCalculators();
  const featuredCalcs = getFeaturedCalculators();

  const trendingTags = [
    { label: 'SIP Calculator', id: 'sip-calculator' },
    { label: 'CGPA to %', id: 'cgpa-to-percentage' },
    { label: 'BMI Index', id: 'bmi-calculator' },
    { label: 'Ohm’s Law', id: 'ohms-law-calculator' },
    { label: 'GST Tax', id: 'gst-calculator' },
    { label: 'Compound Interest', id: 'compound-interest-calculator' },
    { label: 'Age Milestones', id: 'age-calculator' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-transparent dark:from-slate-900/60 dark:via-slate-950/40 dark:to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-extrabold tracking-wide uppercase border border-blue-200 dark:border-blue-900/80 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>40+ Verified Mathematical & Financial Engines</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Precision Calculators for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Finance, Science & Everyday Life
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Instant, mathematically verified tools with interactive charts, amortization schedules, step-by-step formulas, and zero guesswork.
          </motion.p>

          {/* Large Hero Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto pt-2"
          >
            <div
              onClick={() => setSearchOpen(true)}
              className="group flex items-center justify-between p-2 pl-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm">
                <Search className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span>Search by name, formula, or keyword (e.g. SIP, EMI, BMI, Ohm&apos;s)...</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Trending Search Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-semibold">Trending:</span>
              {trendingTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => navigateTo({ view: 'calculator', id: tag.id })}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-800 font-medium transition-colors shadow-2xs"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CATEGORIES HUB GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Explore by Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Comprehensive Calculator Hubs
            </h2>
          </div>
          <button
            onClick={() => navigateTo({ view: 'all' })}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Browse All 40+ Calculators <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_CONFIG.map(cat => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={() => navigateTo({ view: 'category', category: cat.id })}
              className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Category Gradient Top Accent */}
              <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${cat.gradient}`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`p-3 rounded-2xl ${cat.bgLight} border ${cat.borderColor}`}>
                    <DynamicIcon name={cat.iconName} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {cat.count} Calculators
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Open Category Hub
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR & FEATURED CALCULATORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured & Most Used Calculators
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hand-picked precision tools used daily by students, investors, and engineers.
            </p>
          </div>

          {/* Filter Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-start sm:self-auto border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'popular'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'featured'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Editor&apos;s Picks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(activeTab === 'popular' ? popularCalcs.slice(0, 9) : featuredCalcs.slice(0, 9)).map(c => (
            <CalculatorCard key={c.id} calculator={c} />
          ))}
        </div>
      </section>

      {/* 4. ADSENSE AD BANNER PLACEMENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner format="horizontal" />
      </div>

      {/* 5. WHY UNIVERSAL CALCULATOR HUB? (Trust & Craftsmanship) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                Craftsmanship & Precision
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Engineered for 100% Mathematical Accuracy
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Universal Calculator Hub was built to replace ad-cluttered, inaccurate calculation websites with a modern, fast, and rigorously validated computation platform.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Regulatory Banking Standards</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Uses official bank-grade compound amortization algorithms for EMIs, FD quarterly compounding, and PPF 15-year slabs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Instant Client Computation</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Zero page reloads or waiting spinners. Results, curves, and charts refresh simultaneously as you drag sliders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Interactive Visualizations</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Clear visual area charts, breakdowns, and amortization tables to help you visualize compounding exponential growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Transparent Formulas & FAQs</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Every calculator exposes its raw underlying mathematical equation, variable definitions, and step-by-step example.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
