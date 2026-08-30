import React from 'react';
import { CalculatorDefinition } from '../types/calculator';
import { useApp } from '../context/AppContext';
import { DynamicIcon } from './Icon';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  variant?: 'standard' | 'compact' | 'featured';
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculator, variant = 'standard' }) => {
  const { navigateTo, isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(calculator.id);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'finance':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50';
      case 'education':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50';
      case 'business':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50';
      case 'engineering':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50';
      case 'everyday':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50';
      case 'health':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={() => navigateTo({ view: 'calculator', id: calculator.slug })}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer overflow-hidden"
    >
      <div>
        {/* Top bar with Icon & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className={`p-2.5 rounded-xl border ${getCategoryColor(calculator.category)}`}>
            <DynamicIcon name={calculator.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {calculator.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            
            {/* Star Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(calculator.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                fav
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${fav ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {calculator.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {calculator.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {calculator.category}
        </span>

        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
          Calculate <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
};
