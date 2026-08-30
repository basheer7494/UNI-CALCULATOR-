import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_CONFIG, getPopularCalculators } from '../lib/calculatorRegistry';
import { Calculator, ShieldCheck, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();
  const popularCalcs = getPopularCalculators().slice(0, 8);

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors">
      {/* Top Banner Feature Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Mathematically Verified</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every calculation formula adheres to standard banking (RBI/FED), engineering (IEEE/SI), and health (WHO) standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Instant Real-Time Execution</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero server lag. Client-side computations run in sub-millisecond real time with interactive charts and breakdowns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Free & Privacy First</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                100% free forever. No logins required, no tracking cookies, and no personal financial data stored on remote servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo({ view: 'home' })}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Universal Calculator Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Universal Calculator Hub is a comprehensive platform providing 40+ professional tools spanning Finance, Education, Engineering, Business, Everyday Life, and Health. Built with mathematical rigor, mobile-first design, and interactive data visualization.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} Universal Calculator Hub. All rights reserved.
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES_CONFIG.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo({ view: 'category', category: cat.id })}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.shortName}</span>
                    <span className="text-[10px] text-slate-500">({cat.count})</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigateTo({ view: 'all' })}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1 mt-2"
                >
                  <span>All 40+ Tools</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Popular Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Popular Calculators
            </h4>
            <ul className="space-y-2 text-xs">
              {popularCalcs.slice(0, 5).map(calc => (
                <li key={calc.id}>
                  <button
                    onClick={() => navigateTo({ view: 'calculator', id: calc.slug })}
                    className="text-slate-400 hover:text-white transition-colors truncate block text-left max-w-[200px]"
                  >
                    {calc.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Legal & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
              Compliance & Advice
            </h4>
            <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <p>
                <strong className="text-slate-400">Financial Disclaimer:</strong> Calculations are informational estimations and do not constitute certified financial or investment advice.
              </p>
              <p>
                <strong className="text-slate-400">Health Disclaimer:</strong> Health calculators are informational tools and do not substitute professional medical diagnosis.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
