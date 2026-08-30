import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  HelpCircle, 
  Copy, 
  Check, 
  Calculator,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecursionMasterTheoremTool: React.FC = () => {
  const { showToast } = useApp();
  const [a, setA] = useState<number>(2);
  const [b, setB] = useState<number>(2);
  const [c, setC] = useState<number>(1); // exponent of n in f(n) = n^c * log^k(n)
  const [k, setK] = useState<number>(0); // exponent of log n
  const [copied, setCopied] = useState(false);

  const solution = useMemo(() => {
    if (a < 1 || b <= 1) {
      return {
        valid: false,
        error: 'Master Theorem requires a ≥ 1 and b > 1.',
        complexity: 'N/A',
        caseNum: 0,
        explanation: []
      };
    }

    const logba = Math.log(a) / Math.log(b);
    const logbaRounded = Number(logba.toFixed(3));
    const eps = 0.0001;

    let caseNum = 1;
    let complexity = '';
    const explanation: string[] = [];

    explanation.push(`1. Given recurrence: T(n) = ${a}T(n/${b}) + n^${c}${k > 0 ? `·log^${k}(n)` : ''}`);
    explanation.push(`2. Calculate critical exponent: log_b(a) = log_${b}(${a}) = ${logbaRounded}`);
    explanation.push(`3. Compare f(n) polynomial degree c = ${c} with log_b(a) = ${logbaRounded}:`);

    if (c < logba - eps) {
      caseNum = 1;
      complexity = logbaRounded === 1 ? 'Θ(n)' : logbaRounded === 0 ? 'Θ(1)' : `Θ(n^${logbaRounded})`;
      explanation.push(`   • Since c (${c}) < log_b(a) (${logbaRounded}), the work at the leaves dominates the tree.`);
      explanation.push(`   • By Master Theorem Case 1: T(n) = Θ(n^(log_b a)) = ${complexity}`);
    } else if (Math.abs(c - logba) <= eps) {
      caseNum = 2;
      const logPower = k + 1;
      const logTerm = logPower === 1 ? 'log n' : `log^${logPower}(n)`;
      complexity = c === 0 ? `Θ(${logTerm})` : c === 1 ? `Θ(n ${logTerm})` : `Θ(n^${c} ${logTerm})`;
      explanation.push(`   • Since c (${c}) = log_b(a) (${logbaRounded}), the work is evenly distributed across all levels.`);
      explanation.push(`   • By Master Theorem Case 2: T(n) = Θ(n^(log_b a) · log^(k+1)(n)) = ${complexity}`);
    } else {
      caseNum = 3;
      complexity = k > 0 ? `Θ(n^${c} log^${k} n)` : `Θ(n^${c})`;
      explanation.push(`   • Since c (${c}) > log_b(a) (${logbaRounded}), the work at the root dominates.`);
      explanation.push(`   • Checking regularity condition: a · f(n/b) ≤ d · f(n) for d < 1.`);
      explanation.push(`   • ${a} · (n/${b})^${c} = (${a}/${Math.pow(b, c).toFixed(2)}) · n^${c} < n^${c} (Holds).`);
      explanation.push(`   • By Master Theorem Case 3: T(n) = Θ(f(n)) = ${complexity}`);
    }

    return {
      valid: true,
      complexity,
      caseNum,
      logbaRounded,
      explanation
    };
  }, [a, b, c, k]);

  const loadPreset = (name: string, pA: number, pB: number, pC: number, pK: number) => {
    setA(pA);
    setB(pB);
    setC(pC);
    setK(pK);
    showToast(`Loaded: ${name}`, 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(solution.complexity);
    setCopied(true);
    showToast('Complexity copied! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Standard Algorithm Presets */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-500" />
            Master Theorem & Divide-and-Conquer Solver
          </h3>
          <span className="text-xs text-slate-500">
            Form: <code className="font-mono font-bold text-blue-600 dark:text-blue-400">T(n) = aT(n/b) + Θ(n^c · log^k n)</code>
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
          <button
            onClick={() => loadPreset('Merge Sort', 2, 2, 1, 0)}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Merge Sort: 2T(n/2) + O(n)
          </button>
          <button
            onClick={() => loadPreset('Binary Search', 1, 2, 0, 0)}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Binary Search: T(n/2) + O(1)
          </button>
          <button
            onClick={() => loadPreset('Strassen Matrix', 7, 2, 2, 0)}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Strassen Matrix: 7T(n/2) + O(n²)
          </button>
          <button
            onClick={() => loadPreset('Karatsuba Mult', 3, 2, 1, 0)}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold"
          >
            Karatsuba: 3T(n/2) + O(n)
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subproblems (a ≥ 1)
            </label>
            <input
              type="number"
              min={1}
              value={a}
              onChange={e => setA(Math.max(1, Number(e.target.value)))}
              className="w-full font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Divisor (b &gt; 1)
            </label>
            <input
              type="number"
              min={2}
              value={b}
              onChange={e => setB(Math.max(2, Number(e.target.value)))}
              className="w-full font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Exponent c in n^c
            </label>
            <input
              type="number"
              step={0.1}
              min={0}
              value={c}
              onChange={e => setC(Math.max(0, Number(e.target.value)))}
              className="w-full font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Exponent k in log^k(n)
            </label>
            <input
              type="number"
              min={0}
              value={k}
              onChange={e => setK(Math.max(0, Number(e.target.value)))}
              className="w-full font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Primary Result & Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Solution Card (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-800/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Master Theorem Solution
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy complexity"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-wide">
              {solution.complexity}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <span>Applied Case: <strong>Case {solution.caseNum}</strong></span>
              <span>log_{b}({a}) = <strong className="text-amber-300">{solution.logbaRounded}</strong></span>
            </div>
          </div>

          {/* Recursion Tree Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tree Depth</span>
              <span className="text-sm font-mono font-black text-slate-800 dark:text-slate-200">log_{b}(n)</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Leaf Nodes</span>
              <span className="text-sm font-mono font-black text-slate-800 dark:text-slate-200">n^{solution.logbaRounded}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Work / Level</span>
              <span className="text-sm font-mono font-black text-slate-800 dark:text-slate-200">O(n^{c})</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Mathematical Explanation (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
              Step-by-Step Mathematical Derivation
            </h4>

            <div className="space-y-2">
              {solution.explanation.map((step, idx) => (
                <div key={idx} className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
