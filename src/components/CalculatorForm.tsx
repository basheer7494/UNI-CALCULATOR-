import React from 'react';
import { CalculatorDefinition, CalculatorInput } from '../types/calculator';
import { useApp } from '../context/AppContext';
import { getCurrencySymbol } from '../lib/utils';
import { Minus, Plus, HelpCircle, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface CalculatorFormProps {
  calculator: CalculatorDefinition;
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ calculator, values, onChange }) => {
  const { currency, showToast } = useApp();
  const currencySymbol = getCurrencySymbol(currency);

  const renderInputField = (input: CalculatorInput) => {
    const currentValue = values[input.id] ?? input.defaultValue;

    // 1. SELECT INPUT
    if (input.type === 'select') {
      return (
        <div key={input.id} className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {input.label}
          </label>
          <div className="relative">
            <select
              value={currentValue}
              onChange={e => onChange(input.id, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              {input.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {input.helpText && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {input.helpText}
            </p>
          )}
        </div>
      );
    }

    // 2. DATE INPUT
    if (input.type === 'date') {
      return (
        <div key={input.id} className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {input.label}
          </label>
          <input
            type="date"
            value={currentValue}
            onChange={e => onChange(input.id, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {input.helpText && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {input.helpText}
            </p>
          )}
        </div>
      );
    }

    // 3. TEXT / CODE / RADIX INPUT
    if (input.type === 'text') {
      const isCodeOrMultiline = 
        input.id.toLowerCase().includes('code') || 
        input.id.toLowerCase().includes('minterm') || 
        (typeof currentValue === 'string' && currentValue.includes('\n'));

      return (
        <div key={input.id} className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {input.label}
          </label>
          {isCodeOrMultiline ? (
            <textarea
              rows={4}
              value={currentValue}
              placeholder={input.placeholder}
              onChange={e => onChange(input.id, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              placeholder={input.placeholder}
              onChange={e => onChange(input.id, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          )}
          {input.helpText && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {input.helpText}
            </p>
          )}
        </div>
      );
    }

    // 4. NUMBER / SLIDER INPUT
    const isSlider = input.type === 'slider';
    const min = input.min ?? 0;
    const max = input.max ?? 1000000;
    const step = input.step ?? 1;
    const prefix = input.prefix === 'currency' ? currencySymbol : input.prefix;
    const suffix = input.suffix || '';

    const prefixLen = prefix ? prefix.trim().length : 0;
    const suffixLen = suffix ? suffix.trim().length : 0;
    const padLeft = prefixLen > 3 ? 'pl-14' : prefixLen > 1 ? 'pl-9' : prefixLen === 1 ? 'pl-6' : 'pl-3';
    const padRight = suffixLen > 5 ? 'pr-16' : suffixLen > 2 ? 'pr-12' : suffixLen > 0 ? 'pr-8' : 'pr-3';

    const handleStep = (delta: number) => {
      const currentNum = isNaN(Number(currentValue)) ? min : Number(currentValue);
      const nextVal = Math.min(max, Math.max(min, Number((currentNum + delta * step).toFixed(4))));
      onChange(input.id, nextVal);
    };

    return (
      <div key={input.id} className="space-y-2.5 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 min-w-0 break-words">
            {input.label}
          </label>

          {/* Numeric Input & Step Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              aria-label="Decrease value"
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="relative flex items-center">
              {prefix && (
                <span className="absolute left-2.5 text-xs font-bold text-slate-400 pointer-events-none select-none">
                  {prefix}
                </span>
              )}
              <input
                type="number"
                value={currentValue ?? ''}
                min={min}
                max={max}
                step={step}
                onChange={e => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  onChange(input.id, val);
                }}
                className={`w-32 sm:w-36 py-1.5 text-right font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${padLeft} ${padRight}`}
              />
              {suffix && (
                <span className="absolute right-2.5 text-xs font-semibold text-slate-400 pointer-events-none select-none">
                  {suffix.trim()}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleStep(1)}
              aria-label="Increase value"
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        {isSlider && (
          <div className="space-y-1 pt-1">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              onChange={e => onChange(input.id, Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              <span>{prefix}{min.toLocaleString()}{suffix}</span>
              <span>{prefix}{max.toLocaleString()}{suffix}</span>
            </div>
          </div>
        )}

        {input.helpText && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 shrink-0" />
            <span>{input.helpText}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Input Parameters
        </h2>
        <span className="text-xs font-semibold text-slate-400">
          Instant Calculation
        </span>
      </div>

      <div className="space-y-3.5">
        {calculator.inputs.map(input => renderInputField(input))}
      </div>

      {/* Explicit Proceed / Compute Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => showToast('Calculation verified and updated!', 'success')}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Proceed to Calculate & Update Results</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
        </button>
      </div>
    </div>
  );
};
