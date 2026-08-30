import React, { useState, useMemo } from 'react';
import { 
  solveKMap, 
  KMapVarCount, 
  KMapResult, 
  KMapCell 
} from '../../lib/education/kmapSolver';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Copy, 
  Check, 
  RotateCcw, 
  CheckCircle2, 
  ListOrdered, 
  Table 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KMapSolverTool: React.FC = () => {
  const { showToast } = useApp();
  const [varCount, setVarCount] = useState<KMapVarCount>(4);
  const [mintermInput, setMintermInput] = useState<string>('0, 2, 5, 7, 8, 10, 13, 15');
  const [dontCareInput, setDontCareInput] = useState<string>('3, 11');
  const [copiedSOP, setCopiedSOP] = useState(false);
  const [copiedPOS, setCopiedPOS] = useState(false);

  // Parse minterms
  const mintermList = useMemo(() => {
    return mintermInput
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s !== '' && !isNaN(Number(s)))
      .map(Number);
  }, [mintermInput]);

  // Parse don't cares
  const dontCareList = useMemo(() => {
    return dontCareInput
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s !== '' && !isNaN(Number(s)))
      .map(Number);
  }, [dontCareInput]);

  // Solve K-Map live
  const result: KMapResult = useMemo(() => {
    return solveKMap(varCount, mintermList, dontCareList);
  }, [varCount, mintermList, dontCareList]);

  // Toggle cell directly by clicking on grid
  const handleCellClick = (mintermIndex: number) => {
    const isMinterm = mintermList.includes(mintermIndex);
    const isDontCare = dontCareList.includes(mintermIndex);

    if (!isMinterm && !isDontCare) {
      // 0 -> 1 (add to minterm)
      const nextMinterms = [...mintermList, mintermIndex].sort((a, b) => a - b);
      setMintermInput(nextMinterms.join(', '));
    } else if (isMinterm) {
      // 1 -> X (remove from minterms, add to dont care)
      const nextMinterms = mintermList.filter(m => m !== mintermIndex);
      const nextDontCares = [...dontCareList, mintermIndex].sort((a, b) => a - b);
      setMintermInput(nextMinterms.join(', '));
      setDontCareInput(nextDontCares.join(', '));
    } else {
      // X -> 0 (remove from dont cares)
      const nextDontCares = dontCareList.filter(d => d !== mintermIndex);
      setDontCareInput(nextDontCares.join(', '));
    }
  };

  const handleCopy = (text: string, isSOP: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSOP) {
      setCopiedSOP(true);
      setTimeout(() => setCopiedSOP(false), 2000);
    } else {
      setCopiedPOS(true);
      setTimeout(() => setCopiedPOS(false), 2000);
    }
    showToast('Expression copied! 📋', 'success');
  };

  // Presets
  const loadPreset = (name: string, vars: KMapVarCount, minterms: string, dontCares: string = '') => {
    setVarCount(vars);
    setMintermInput(minterms);
    setDontCareInput(dontCares);
    showToast(`Loaded preset: ${name}`, 'info');
  };

  return (
    <div className="space-y-8">
      {/* Top Configuration Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              Karnaugh Map (K-Map) Logic Solver
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive 2, 3, and 4-variable Gray-coded simplification engine with essential prime implicant extraction.
            </p>
          </div>

          {/* Variable Count Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Variables:</span>
            {([2, 3, 4] as KMapVarCount[]).map(v => (
              <button
                key={v}
                onClick={() => setVarCount(v)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  varCount === v
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {v} Vars ({v === 2 ? 'A, B' : v === 3 ? 'A, B, C' : 'A, B, C, D'})
              </button>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Standard Presets:
          </span>
          <button
            onClick={() => loadPreset('Full Adder Sum', 3, '1, 2, 4, 7')}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
          >
            Full Adder Sum (3-Var)
          </button>
          <button
            onClick={() => loadPreset('Full Adder Carry', 3, '3, 5, 6, 7')}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
          >
            Full Adder Cout (3-Var)
          </button>
          <button
            onClick={() => loadPreset('BCD Segment A', 4, '0, 2, 3, 5, 6, 7, 8, 9', '10, 11, 12, 13, 14, 15')}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
          >
            7-Segment Display (BCD Segment A)
          </button>
          <button
            onClick={() => loadPreset('4-Var Quad Corners', 4, '0, 2, 8, 10')}
            className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
          >
            4 Corner Minterms
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Minterms Σm (Comma separated: 0 to {Math.pow(2, varCount) - 1})
            </label>
            <input
              type="text"
              value={mintermInput}
              onChange={e => setMintermInput(e.target.value)}
              placeholder="e.g. 0, 2, 5, 7, 8, 10"
              className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Don't Cares d (Optional: 0 to {Math.pow(2, varCount) - 1})
            </label>
            <input
              type="text"
              value={dontCareInput}
              onChange={e => setDontCareInput(e.target.value)}
              placeholder="e.g. 3, 11, 14"
              className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main K-Map Grid & Simplified Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive K-Map Grid (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Interactive Gray-Code Map Grid
              </span>
              <span className="text-[11px] text-slate-400">
                Click cell to toggle: 0 → 1 → X → 0
              </span>
            </div>

            {/* K-Map Table Matrix */}
            <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center">
              <div className="inline-block">
                {/* Header Row labels */}
                <div className="flex items-center">
                  <div className="w-16 h-10 flex items-center justify-center font-mono text-[10px] text-blue-400 font-bold border-b border-r border-slate-800">
                    {varCount === 2 ? 'A \\ B' : varCount === 3 ? 'A \\ BC' : 'AB \\ CD'}
                  </div>
                  {result.colLabels.map((colLbl, cIdx) => (
                    <div
                      key={cIdx}
                      className="w-16 sm:w-20 h-10 flex items-center justify-center font-mono text-xs text-slate-300 font-bold border-b border-slate-800"
                    >
                      {colLbl}
                    </div>
                  ))}
                </div>

                {/* Grid Rows */}
                {result.grid.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center">
                    <div className="w-16 h-16 sm:h-20 flex items-center justify-center font-mono text-xs text-slate-300 font-bold border-r border-slate-800">
                      {result.rowLabels[rIdx]}
                    </div>
                    {row.map(cell => {
                      const isOne = cell.value === 1;
                      const isX = cell.value === 'X';

                      let cellBg = 'bg-slate-900 hover:bg-slate-800 text-slate-500';
                      if (isOne) cellBg = 'bg-blue-600/30 hover:bg-blue-600/40 text-white border-blue-500/50 shadow-inner';
                      if (isX) cellBg = 'bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border-amber-500/50';

                      return (
                        <button
                          key={cell.index}
                          onClick={() => handleCellClick(cell.index)}
                          className={`w-16 sm:w-20 h-16 sm:h-20 flex flex-col items-center justify-between p-2 border border-slate-800 transition-all select-none ${cellBg}`}
                        >
                          <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-500">
                            <span>m{cell.index}</span>
                            <span>{cell.binary}</span>
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono">
                            {cell.value}
                          </div>
                          <div className="text-[8px] text-slate-500">
                            {cell.groupedIn && cell.groupedIn.length > 0 ? `G${cell.groupedIn.join(',')}` : ''}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Formed Groups Badges */}
            {result.groups.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Identified Prime Implicant Groups ({result.groups.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.groups.map(g => (
                    <div
                      key={g.id}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${g.color}`}
                    >
                      <span>Group {g.id} ({g.type}):</span>
                      <span className="text-white font-extrabold">{g.term}</span>
                      <span className="text-[10px] text-slate-400">[{g.cells.map(c => `m${c}`).join(', ')}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right: Minimized Output Expressions & Mathematical Derivation (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Minimized SOP Expression Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-blue-800/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Minimized Sum of Products (SOP)
              </span>
              <button
                onClick={() => handleCopy(result.simplifiedSOP, true)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Copy SOP"
              >
                {copiedSOP ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wide">
              F({result.varNames.join(', ')}) = {result.simplifiedSOP}
            </div>

            <div className="pt-2 border-t border-white/10 text-xs text-blue-100">
              Canonical SOP: <code className="font-mono font-bold text-amber-300">{result.canonicalSOP}</code>
            </div>
          </div>

          {/* Canonical POS Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Canonical Product of Sums (POS)
              </span>
              <button
                onClick={() => handleCopy(result.canonicalPOS, false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copy POS"
              >
                {copiedPOS ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
              F({result.varNames.join(', ')}) = {result.canonicalPOS}
            </div>
          </div>

          {/* Step-by-Step Derivation */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
              Minimization Steps
            </h4>

            <div className="space-y-1.5">
              {result.steps.map((step, idx) => (
                <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Truth Table */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-blue-500" />
              Complete Truth Table ({Math.pow(2, varCount)} States)
            </h4>

            <div className="overflow-x-auto max-h-56 rounded-2xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 text-[10px] uppercase font-bold sticky top-0">
                  <tr>
                    <th className="px-3 py-2">m#</th>
                    {result.varNames.map(v => (
                      <th key={v} className="px-3 py-2 text-center">{v}</th>
                    ))}
                    <th className="px-3 py-2 text-right">Output F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.truthTable.map(row => (
                    <tr 
                      key={row.minterm}
                      className={row.output === 1 ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold' : ''}
                    >
                      <td className="px-3 py-1.5 text-slate-400">m{row.minterm}</td>
                      {result.varNames.map(v => (
                        <td key={v} className="px-3 py-1.5 text-center">{row.inputs[v]}</td>
                      ))}
                      <td className="px-3 py-1.5 text-right font-black text-blue-600 dark:text-blue-400">
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
