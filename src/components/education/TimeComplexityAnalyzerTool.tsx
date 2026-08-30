import React, { useState, useMemo } from 'react';
import { 
  analyzeCodeComplexity, 
  SAMPLE_PROGRAMS, 
  SupportedLanguage, 
  CodeComplexityResult 
} from '../../lib/education/complexityAnalyzer';
import { 
  Code, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Lightbulb, 
  Layers, 
  Clock, 
  HardDrive, 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode2,
  Cpu,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const TimeComplexityAnalyzerTool: React.FC = () => {
  const { showToast } = useApp();
  const [language, setLanguage] = useState<SupportedLanguage>('cpp');
  const [selectedSample, setSelectedSample] = useState<string>('linear-search');
  const [code, setCode] = useState<string>(SAMPLE_PROGRAMS[0].code);
  const [copied, setCopied] = useState(false);

  // Compute complexity analysis live
  const result: CodeComplexityResult = useMemo(() => {
    return analyzeCodeComplexity(code, language);
  }, [code, language]);

  const handleSampleChange = (id: string) => {
    setSelectedSample(id);
    const found = SAMPLE_PROGRAMS.find(p => p.id === id);
    if (found) {
      setCode(found.code);
      setLanguage(found.language);
      showToast(`Loaded sample: ${found.name}`, 'info');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getComplexityBadgeColor = (complexity: string) => {
    if (complexity.includes('1') || complexity.includes('log n')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (complexity.includes('n log n') || complexity === 'O(n)') {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
    if (complexity.includes('n^2') || complexity.includes('n²')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="space-y-8">
      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong className="font-bold">100% Client-Side Privacy:</strong> Your code is parsed and analyzed locally in your browser sandbox using AST pattern analysis. Nothing is transmitted to external servers.
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
          Browser Engine
        </span>
      </div>

      {/* Main Analysis Workspace: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Code Editor & Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-4">
            
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Source Code
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as SupportedLanguage)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="cpp">C++ (std::17)</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (ES6)</option>
                </select>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy code"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Load Standard Algorithm Template
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROGRAMS.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleChange(sample.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      selectedSample === sample.id
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input Area with Line Numbers */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-hidden">
              <div className="flex">
                {/* Line Numbers Gutter */}
                <div className="py-3 px-2.5 bg-slate-900/60 text-slate-600 select-none text-right font-mono text-xs border-r border-slate-800">
                  {code.split('\n').map((_, idx) => (
                    <div key={idx} className="leading-6">
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* Textarea Code Input */}
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Paste your function, loop, or recursive algorithm here..."
                  rows={14}
                  spellCheck={false}
                  className="w-full p-3 bg-transparent text-slate-100 font-mono text-xs leading-6 resize-y focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-Time Reactive Static Analysis
              </span>
            </div>

          </div>

          {/* Line-by-Line Code Annotations */}
          {result.lineAnnotations.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Line-by-Line Complexity Breakdown
              </h3>
              
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {result.lineAnnotations.map(line => (
                  <div 
                    key={line.lineNumber}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="font-mono text-slate-400 text-[10px] shrink-0 mt-0.5">
                        L{line.lineNumber}:
                      </span>
                      <div className="min-w-0">
                        <code className="font-mono text-slate-800 dark:text-slate-200 block truncate">
                          {line.code}
                        </code>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {line.description}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase shrink-0 border ${getComplexityBadgeColor(line.complexity)}`}>
                      {line.complexity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Real-Time Results & Mathematical Derivation (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Primary Complexity Highlight Card */}
          <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white shadow-xl border border-blue-800/40">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Asymptotic Time Complexity
                </span>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-full border backdrop-blur-md ${getComplexityBadgeColor(result.timeComplexity)}`}>
                  {result.dominantTerm}
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
                  {result.timeComplexity}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                {result.summary}
              </p>

              {/* Asymptotic Triad: Big-O, Theta, Omega */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-center">
                  <span className="text-[10px] text-blue-200 uppercase font-bold block">Worst Case</span>
                  <span className="text-sm font-mono font-black text-white">{result.timeComplexityNotation.bigO}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-center">
                  <span className="text-[10px] text-blue-200 uppercase font-bold block">Average Case</span>
                  <span className="text-sm font-mono font-black text-emerald-300">{result.timeComplexityNotation.bigTheta}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-center">
                  <span className="text-[10px] text-blue-200 uppercase font-bold block">Best Case</span>
                  <span className="text-sm font-mono font-black text-amber-300">{result.timeComplexityNotation.bigOmega}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Space Complexity Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                <span>Auxiliary Space</span>
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {result.auxiliarySpace}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Additional stack/buffer allocation
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Loop Nesting Depth</span>
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {result.loopDepth} {result.loopDepth === 1 ? 'Level' : 'Levels'}
              </div>
              <span className="text-[11px] text-slate-400 block">
                {result.recursionDetected ? `Recursion: ${result.recursionType}` : 'Iterative block execution'}
              </span>
            </div>
          </div>

          {/* Step-by-Step Mathematical Derivation */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Mathematical Derivation & Reasoning
            </h3>

            <div className="space-y-2">
              {result.explanationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Recharts Growth Rate Curve */}
          {result.chartData.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Growth Rate Comparison vs Asymptotic Classes
                </h3>
                <span className="text-[10px] text-slate-400">n: 1 to 128 elements</span>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="n" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="O(1)" stroke="#94a3b8" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="O(log n)" stroke="#10b981" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="O(n)" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="O(n log n)" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="O(n^2)" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Your Algorithm" stroke="#ec4899" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          {result.optimizationTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Optimization Recommendations</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-amber-800 dark:text-amber-300">
                {result.optimizationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
