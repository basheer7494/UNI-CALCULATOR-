import React, { useState, useEffect } from 'react';
import { 
  analyzeCodeComplexity, 
  SAMPLE_PROGRAMS, 
  SupportedLanguage, 
  CodeComplexityResult,
  autoFixCode
} from '../../lib/education/complexityAnalyzer';
import { 
  Code, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Lightbulb, 
  Layers, 
  Clock, 
  HardDrive, 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode2,
  Wrench,
  Cpu,
  ArrowRight,
  Info,
  Sliders
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
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [selectedSample, setSelectedSample] = useState<string>('py-linear-search');
  const [code, setCode] = useState<string>(SAMPLE_PROGRAMS[0].code);
  const [copied, setCopied] = useState(false);
  
  // State for explicit "Proceed to Analyze" workflow
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalyzedCode, setLastAnalyzedCode] = useState<string>(SAMPLE_PROGRAMS[0].code);
  const [lastAnalyzedLanguage, setLastAnalyzedLanguage] = useState<SupportedLanguage>('python');
  const [result, setResult] = useState<CodeComplexityResult>(() => 
    analyzeCodeComplexity(SAMPLE_PROGRAMS[0].code, 'python')
  );

  const isDirty = code !== lastAnalyzedCode || language !== lastAnalyzedLanguage;

  // Execute explicit Proceed calculation
  const handleProceedAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeCodeComplexity(code, language);
      setResult(res);
      setLastAnalyzedCode(code);
      setLastAnalyzedLanguage(language);
      setIsAnalyzing(false);
      showToast('Analysis complete! Big-O derived.', 'success');
    }, 200);
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to Proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleProceedAnalysis();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    // Find first sample for this language
    const firstSample = SAMPLE_PROGRAMS.find(p => p.language === lang);
    if (firstSample) {
      setSelectedSample(firstSample.id);
      setCode(firstSample.code);
      // Auto analyze when switching template
      const res = analyzeCodeComplexity(firstSample.code, lang);
      setResult(res);
      setLastAnalyzedCode(firstSample.code);
      setLastAnalyzedLanguage(lang);
      showToast(`Switched to ${lang.toUpperCase()} • Loaded ${firstSample.name}`, 'info');
    }
  };

  const handleSampleChange = (id: string) => {
    setSelectedSample(id);
    const found = SAMPLE_PROGRAMS.find(p => p.id === id);
    if (found) {
      setCode(found.code);
      setLanguage(found.language);
      const res = analyzeCodeComplexity(found.code, found.language);
      setResult(res);
      setLastAnalyzedCode(found.code);
      setLastAnalyzedLanguage(found.language);
      showToast(`Loaded: ${found.name}`, 'info');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoFix = (diagnosticId: string) => {
    const fixed = autoFixCode(code, language, diagnosticId);
    setCode(fixed);
    const res = analyzeCodeComplexity(fixed, language);
    setResult(res);
    setLastAnalyzedCode(fixed);
    setLastAnalyzedLanguage(language);
    showToast('Applied root cause auto-fix! Code re-analyzed.', 'success');
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

  const languages: { id: SupportedLanguage; label: string; tag: string }[] = [
    { id: 'python', label: 'Python 3', tag: 'PEP 8' },
    { id: 'cpp', label: 'C++', tag: 'std::17' },
    { id: 'java', label: 'Java', tag: 'JVM' },
    { id: 'javascript', label: 'JavaScript', tag: 'ES6+' },
    { id: 'c', label: 'C', tag: 'C11' },
  ];

  const currentLanguageSamples = SAMPLE_PROGRAMS.filter(p => p.language === language);

  return (
    <div className="space-y-8">
      {/* Top Banner: Privacy & Local Engine */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong className="font-bold">100% Client-Side Privacy:</strong> Code is analyzed locally in your browser with full AST control flow mapping. No external API transmission.
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] uppercase">
          Client AST Parser
        </span>
      </div>

      {/* Language Selector Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Target Programming Language
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl+Enter</kbd> to proceed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {languages.map(lang => {
            const isActive = language === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleLanguageSelect(lang.id)}
                className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div className="font-bold text-xs">{lang.label}</div>
                <div className={`text-[10px] mt-1 font-mono uppercase ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {lang.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Code Editor, Presets & Proceed Button (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-4">
            
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {language.toUpperCase()} Source Code
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy code"
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCode('')}
                  title="Clear code"
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Quick Algorithm Templates for Current Language */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Verified {language.toUpperCase()} Algorithms</span>
                <span className="text-blue-400 font-normal">Click to load</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentLanguageSamples.map(sample => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleChange(sample.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedSample === sample.id
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{sample.name.replace(/.*:\s*/, '')}</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/30 text-blue-200">
                      {sample.expectedTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input Area with Line Numbers */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-hidden">
              <div className="flex">
                {/* Line Numbers Gutter */}
                <div className="py-3 px-2.5 bg-slate-900/60 text-slate-600 select-none text-right font-mono text-xs border-r border-slate-800 min-w-[2.5rem]">
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
                  placeholder={`Paste or type your ${language.toUpperCase()} code here, then click "Proceed to Analyze"...`}
                  rows={15}
                  spellCheck={false}
                  className="w-full p-3 bg-transparent text-slate-100 font-mono text-xs leading-6 resize-y focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Status & Prominent PROCEED BUTTON */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
                <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
                {isDirty ? (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Code modified • Click Proceed to get answer
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analysis up to date
                  </span>
                )}
              </div>

              {/* The Requested PROCEED BUTTON */}
              <button
                type="button"
                onClick={handleProceedAnalysis}
                disabled={isAnalyzing || !code.trim()}
                className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] ${
                  isDirty
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 ring-2 ring-blue-400/50'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Parsing AST & Computing Big-O...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>Proceed to Analyze Code & Get Answer</span>
                    <ArrowRight className="w-4 h-4 text-blue-200" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Code Diagnostics & Root Cause Resolver */}
          {result.diagnostics.length > 0 ? (
            <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Code Diagnostics & Root Cause Resolver ({result.diagnostics.length})
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 uppercase">
                  Action Required
                </span>
              </div>

              <div className="space-y-2.5">
                {result.diagnostics.map(diag => (
                  <div
                    key={diag.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold">
                          Line {diag.line}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {diag.title}
                        </h4>
                      </div>

                      {diag.autoFixAvailable && (
                        <button
                          type="button"
                          onClick={() => handleAutoFix(diag.id)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Auto-Fix</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {diag.message}
                    </p>

                    {/* Root Cause Deep Dive */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
                      <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-500" />
                        <span>Root Cause:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {diag.rootCause}
                      </p>
                    </div>

                    {/* Suggested Fix */}
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      💡 <strong>Fix:</strong> {diag.suggestedFix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Code Syntax Verified:</strong> Clean AST structure with no syntax errors or infinite loop hazards detected for {language.toUpperCase()}.
              </span>
            </div>
          )}

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

        {/* Right Column: Computed Answers & Derivation (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Primary Complexity Answer Card */}
          <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white shadow-xl border border-blue-800/40">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
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

          {/* Theoretical Operations Scale Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Theoretical Operations at Scale
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">At n = 100 items</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {result.operationsEstimateAt100 > 1e12 ? '> 10¹² ops' : result.operationsEstimateAt100.toLocaleString() + ' ops'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">At n = 1,000 items</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {result.operationsEstimateAt1000 > 1e12 ? '> 10¹² ops' : result.operationsEstimateAt1000.toLocaleString() + ' ops'}
                </span>
              </div>
            </div>
          </div>

          {/* Space & Depth Grid */}
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
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
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

          {/* Mathematical Derivation */}
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
