import React, { useState, useMemo, useEffect } from 'react';
import { getCalculatorById } from '../lib/calculatorRegistry';
import { useApp } from '../context/AppContext';
import { CalculatorHeader } from './CalculatorHeader';
import { CalculatorForm } from './CalculatorForm';
import { CalculatorResults } from './CalculatorResults';
import { CalculatorKnowledge } from './CalculatorKnowledge';
import { AdBanner } from './AdBanner';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface CalculatorPageProps {
  idOrSlug: string;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ idOrSlug }) => {
  const { currency, navigateTo } = useApp();
  const calculator = getCalculatorById(idOrSlug);

  // Initialize input state from default values or URL query params
  const defaultValues = useMemo(() => {
    if (!calculator) return {};
    const initial: Record<string, any> = {};
    calculator.inputs.forEach(input => {
      initial[input.id] = input.defaultValue;
    });
    return initial;
  }, [calculator]);

  const [values, setValues] = useState<Record<string, any>>(defaultValues);

  // Reset values when switching calculators
  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  // Handle Input Changes
  const handleChange = (id: string, val: any) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  // Reset to default values
  const handleReset = () => {
    setValues(defaultValues);
  };

  // Live Reactive Computation
  const output = useMemo(() => {
    if (!calculator) return null;
    try {
      return calculator.calculate(values, currency);
    } catch (e) {
      console.error('Calculation error:', e);
      return null;
    }
  }, [calculator, values, currency]);

  if (!calculator) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Calculator Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We couldn&apos;t find a calculator with ID &ldquo;{idOrSlug}&rdquo;. Please browse our categories or search from the top bar.
        </p>
        <button
          onClick={() => navigateTo({ view: 'home' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header with Title & Action Bar */}
      <CalculatorHeader calculator={calculator} onReset={handleReset} />

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <CalculatorForm
            calculator={calculator}
            values={values}
            onChange={handleChange}
          />
        </div>

        {/* Right Column: Real-Time Results & Visualizations (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {output ? (
            <CalculatorResults
              output={output}
              calculatorName={calculator.name}
            />
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              Calculating results...
            </div>
          )}
        </div>
      </div>

      {/* AdSense Monetization Placement */}
      <AdBanner format="horizontal" className="mt-8" />

      {/* Full-Width Lower Section: Mathematical Knowledge, Formulas, FAQs, Disclaimers */}
      <CalculatorKnowledge calculator={calculator} />
    </div>
  );
};
