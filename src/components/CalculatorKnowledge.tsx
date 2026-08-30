import React, { useState } from 'react';
import { CalculatorDefinition } from '../types/calculator';
import { getCalculatorById } from '../lib/calculatorRegistry';
import { CalculatorCard } from './CalculatorCard';
import { 
  BookOpen, 
  HelpCircle, 
  AlertTriangle, 
  ChevronDown, 
  CheckCircle2, 
  Binary, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CalculatorKnowledgeProps {
  calculator: CalculatorDefinition;
}

export const CalculatorKnowledge: React.FC<CalculatorKnowledgeProps> = ({ calculator }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedCalculators = (calculator.relatedIds || [])
    .map(id => getCalculatorById(id))
    .filter((c): c is CalculatorDefinition => Boolean(c))
    .slice(0, 3);

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      
      {/* 1. Mathematical Formula & Variables */}
      {calculator.formula && (
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <Binary className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2>Mathematical Formula & Calculation Method</h2>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 dark:bg-slate-950 font-mono text-sm sm:text-base border border-slate-800 shadow-inner overflow-x-auto text-center font-bold tracking-wide">
            {calculator.formula.expression}
          </div>

          {calculator.formula.explanation && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {calculator.formula.explanation}
            </p>
          )}

          {calculator.formula.variables && calculator.formula.variables.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Variable Definitions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {calculator.formula.variables.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 mr-2 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                      {v.symbol}
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{v.name}: </strong>
                    <span className="text-slate-600 dark:text-slate-400">{v.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 2. Step-by-Step Practical Example */}
      {calculator.example && (
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2>Step-by-Step Calculation Example</h2>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              {calculator.example.scenario}
            </h4>
            <div className="space-y-1.5 pt-1">
              {calculator.example.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            {calculator.example.result && (
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                Final Result: {calculator.example.result}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Deep Educational Guide Sections */}
      {calculator.explanationSections && calculator.explanationSections.length > 0 && (
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          {calculator.explanationSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {sec.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* 4. Frequently Asked Questions (FAQ) */}
      {calculator.faqs && calculator.faqs.length > 0 && (
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h2>Frequently Asked Questions (FAQ)</h2>
          </div>

          <div className="space-y-2.5">
            {calculator.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Legal / Advisory Compliance Disclaimer */}
      <section className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-3">
        {calculator.disclaimerType === 'health' ? (
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h4 className="font-bold">
            {calculator.disclaimerType === 'health'
              ? 'Medical & Health Information Advisory'
              : calculator.disclaimerType === 'finance'
              ? 'Financial & Regulatory Disclaimer'
              : 'Accuracy & Estimation Notice'}
          </h4>
          <p className="text-amber-800 dark:text-amber-400 text-[11px]">
            {calculator.customDisclaimer ||
              (calculator.disclaimerType === 'health'
                ? 'This calculator provides mathematical approximations for informational and educational purposes only. It is not a medical diagnosis or treatment plan. Always consult a certified medical practitioner for health advice.'
                : calculator.disclaimerType === 'finance'
                ? 'Calculations are estimates based on standard compounding math. Actual mutual fund returns, loan amortization, or tax obligations may vary due to changing market conditions, fees, and government tax regulations.'
                : 'Results generated by this calculator are mathematically modeled estimates intended for practical planning and reference.')}
          </p>
        </div>
      </section>

      {/* 6. Related Calculators Grid */}
      {relatedCalculators.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Related Calculators
            </h2>
            <span className="text-xs text-slate-400 font-medium">Explore more tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCalculators.map(c => (
              <CalculatorCard key={c.id} calculator={c} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
