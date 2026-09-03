import React, { useState, useMemo } from 'react';
import { 
  simplifyBooleanExpression, 
  BooleanSimplificationResult 
} from '../../lib/education/booleanSimplifier';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  Table, 
  ListOrdered, 
  CheckCircle2, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BooleanSimplifierTool: React.FC = () => {
  const { showToast } = useApp();
  const [expression, setExpression] = useState<string>("A'B + AB' + AB");
  const [copied, setCopied] = useState(false);

  const result: BooleanSimplificationResult = useMemo(() => {
    return simplifyBooleanExpression(expression);
  }, [expression]);

  const insertSymbol = (sym: string) => {
    setExpression(prev => prev + sym);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.simplifiedExpression);
    setCopied(true);
    showToast('Simplified expression copied! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "A'B + AB' + AB", expr: "A'B + AB' + AB" },
    { label: "A(A + B)", expr: "A(A + B)" },
    { label: "A + A'B", expr: "A + A'B" },
    { label: "(A + B)(A + B')", expr: "(A + B)(A + B')" },
    { label: "A'B'C + A'BC + AB'C", expr: "A'B'C + A'BC + AB'C" }
  ];

  return (
    <div className="space-y-8">
      {/* Expression Input & Quick Operators Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Boolean Expression Simplifier & Truth Table
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter any Boolean algebra expression to apply simplification laws and generate truth tables.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => setExpression(p.expr)}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={e => setExpression(e.target.value)}
              placeholder="e.g. A'B + AB' + AB"
              className="w-full px-4 py-3 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Operator Insert Buttons & Proceed Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Insert:</span>
              {[
                { label: "NOT ( ' )", val: "'" },
                { label: 'AND ( · )', val: ' * ' },
                { label: 'OR ( + )', val: ' + ' },
                { label: 'XOR ( ⊕ )', val: ' ^ ' },
                { label: '( )', val: '()' },
                { label: 'A', val: 'A' },
                { label: 'B', val: 'B' },
                { label: 'C', val: 'C' },
                { label: 'D', val: 'D' },
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => insertSymbol(item.val)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => showToast('Expression evaluated and simplified!', 'success')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Proceed to Simplify</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Simplified Expression Highlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Simplified Output & Laws (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-800/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Minimal Simplified Expression
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy simplified expression"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wide">
              F = {result.simplifiedExpression}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-blue-200 block text-[11px]">Canonical SOP:</span>
                <code className="font-mono font-bold text-amber-300">{result.canonicalSOP}</code>
              </div>
              <div>
                <span className="text-blue-200 block text-[11px]">Canonical POS:</span>
                <code className="font-mono font-bold text-emerald-300">{result.canonicalPOS}</code>
              </div>
            </div>
          </div>

          {/* Logic Gate Reduction Comparison */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Logic Gate Complexity Reduction
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Original Circuit</span>
                <div className="text-2xl font-mono font-black text-slate-800 dark:text-slate-200">
                  {result.gateCountOriginal.total} Gates
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {result.gateCountOriginal.and} AND, {result.gateCountOriginal.or} OR, {result.gateCountOriginal.not} NOT
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Simplified Circuit</span>
                <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {result.gateCountSimplified.total} Gates
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-mono">
                  {result.gateCountSimplified.and} AND, {result.gateCountSimplified.or} OR, {result.gateCountSimplified.not} NOT
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Laws Applied */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
              Boolean Algebraic Reduction Steps
            </h4>

            <div className="space-y-3">
              {result.steps.map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{step.rule}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Step {idx + 1}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {step.after}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Truth Table (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-blue-500" />
              Generated Truth Table ({result.truthTable.length} Rows)
            </h4>

            <div className="overflow-x-auto max-h-96 rounded-2xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] uppercase font-bold sticky top-0">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    {result.variables.map(v => (
                      <th key={v} className="px-3 py-2 text-center">{v}</th>
                    ))}
                    <th className="px-3 py-2 text-right">Output F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.truthTable.map((row, idx) => (
                    <tr 
                      key={idx}
                      className={row.output === 1 ? 'bg-blue-50/60 dark:bg-blue-950/20 font-bold' : ''}
                    >
                      <td className="px-3 py-2 text-slate-400">{idx}</td>
                      {result.variables.map(v => (
                        <td key={v} className="px-3 py-2 text-center">{row.inputs[v]}</td>
                      ))}
                      <td className={`px-3 py-2 text-right font-black ${row.output === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                        {row.output}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
