import React, { useState, useEffect, useRef } from 'react';
import { 
  SORTING_ALGORITHMS, 
  SortingAlgorithmInfo 
} from '../../lib/education/sortingComplexityData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Code, 
  Check, 
  Copy, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SortingComplexityTool: React.FC = () => {
  const { showToast } = useApp();
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('bubble-sort');
  const [arraySize, setArraySize] = useState<number>(20);
  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [comparisonsCount, setComparisonsCount] = useState(0);
  const [swapsCount, setSwapsCount] = useState(0);
  const [speed, setSpeed] = useState(50); // ms delay
  const [copied, setCopied] = useState(false);

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  const currentAlgo: SortingAlgorithmInfo = SORTING_ALGORITHMS.find(a => a.id === selectedAlgoId) || SORTING_ALGORITHMS[0];

  // Initialize random array
  const generateRandomArray = () => {
    setIsRunning(false);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisonsCount(0);
    setSwapsCount(0);

    const newArr: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArr.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArr);
  };

  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Sleep utility
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Sorting Animation Routines
  const runBubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let comps = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let swappedAny = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (!isRunningRef.current) return;
        setComparing([j, j + 1]);
        comps++;
        setComparisonsCount(comps);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swaps++;
          setSwapsCount(swaps);
          setArray([...arr]);
          swappedAny = true;
          await sleep(speed);
        }
      }
      setSortedIndices(prev => [...prev, n - 1 - i]);
      if (!swappedAny) break;
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapping([]);
    setIsRunning(false);
    showToast('Bubble Sort finished! 🎉', 'success');
  };

  const runSelectionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let comps = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (!isRunningRef.current) return;
        setComparing([minIdx, j]);
        comps++;
        setComparisonsCount(comps);
        await sleep(speed);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        swaps++;
        setSwapsCount(swaps);
        setArray([...arr]);
        await sleep(speed);
      }
      setSortedIndices(prev => [...prev, i]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapping([]);
    setIsRunning(false);
    showToast('Selection Sort finished! 🎉', 'success');
  };

  const runInsertionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    let comps = 0;
    let swaps = 0;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        if (!isRunningRef.current) return;
        setComparing([j, j + 1]);
        comps++;
        setComparisonsCount(comps);
        await sleep(speed);

        setSwapping([j, j + 1]);
        arr[j + 1] = arr[j];
        swaps++;
        setSwapsCount(swaps);
        setArray([...arr]);
        j--;
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setSwapping([]);
    setIsRunning(false);
    showToast('Insertion Sort finished! 🎉', 'success');
  };

  const handleStartSort = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    if (selectedAlgoId === 'bubble-sort') runBubbleSort();
    else if (selectedAlgoId === 'selection-sort') runSelectionSort();
    else if (selectedAlgoId === 'insertion-sort') runInsertionSort();
    else {
      // Default standard simulation
      runBubbleSort();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentAlgo.codeCpp);
    setCopied(true);
    showToast('C++ implementation copied! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Algorithm Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {SORTING_ALGORITHMS.map(algo => (
          <button
            key={algo.id}
            onClick={() => {
              setSelectedAlgoId(algo.id);
              generateRandomArray();
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedAlgoId === algo.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {algo.name}
          </button>
        ))}
      </div>

      {/* Interactive Visualizer Canvas */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Array Sorting Simulator: {currentAlgo.name}
            </h3>
            <p className="text-xs text-slate-400">
              Watch comparisons and swaps execute in real-time step by step.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleStartSort}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause' : 'Start Sorting'}
            </button>

            <button
              onClick={generateRandomArray}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Shuffle
            </button>
          </div>
        </div>

        {/* Array Bars Visualization Canvas */}
        <div className="h-48 w-full flex items-end justify-between gap-1 px-2 py-4 bg-slate-950 rounded-2xl border border-slate-800/80">
          {array.map((val, idx) => {
            const isComparing = comparing.includes(idx);
            const isSwapping = swapping.includes(idx);
            const isSorted = sortedIndices.includes(idx);

            let barColor = 'bg-blue-500';
            if (isSwapping) barColor = 'bg-rose-500 scale-105';
            else if (isComparing) barColor = 'bg-amber-400';
            else if (isSorted) barColor = 'bg-emerald-500';

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                <div
                  style={{ height: `${val}%` }}
                  className={`w-full rounded-t-md transition-all duration-150 ${barColor}`}
                />
                {arraySize <= 25 && (
                  <span className="text-[9px] font-mono text-slate-500 mt-1 select-none">
                    {val}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Real-Time Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Comparisons</span>
            <span className="text-base font-mono font-bold text-amber-400">{comparisonsCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Swaps / Writes</span>
            <span className="text-base font-mono font-bold text-rose-400">{swapsCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Array Size</span>
            <span className="text-base font-mono font-bold text-blue-400">{arraySize} items</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Anim Speed</span>
            <span className="text-base font-mono font-bold text-emerald-400">{speed}ms</span>
          </div>
        </div>
      </div>

      {/* Algorithm Complexity Cards & Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Performance Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentAlgo.name} Specification
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                {currentAlgo.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentAlgo.description}
            </p>

            {/* Asymptotic Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Time</span>
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{currentAlgo.bestTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Time</span>
                <span className="text-sm font-mono font-black text-blue-600 dark:text-blue-400">{currentAlgo.averageTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Worst Time</span>
                <span className="text-sm font-mono font-black text-rose-600 dark:text-rose-400">{currentAlgo.worstTime}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Aux Space</span>
                <span className="text-sm font-mono font-black text-purple-600 dark:text-purple-400">{currentAlgo.auxiliarySpace}</span>
              </div>
            </div>

            {/* Properties Matrix */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Stability:</span>
                <span className={`font-bold ${currentAlgo.stability === 'Stable' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {currentAlgo.stability}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">In-Place:</span>
                <span className={`font-bold ${currentAlgo.inPlace === 'Yes' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {currentAlgo.inPlace}
                </span>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Advantages</span>
                <ul className="list-disc pl-4 space-y-1 text-emerald-700 dark:text-emerald-400 text-[11px]">
                  {currentAlgo.pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5">
                <span className="font-bold text-rose-800 dark:text-rose-300 block">Disadvantages</span>
                <ul className="list-disc pl-4 space-y-1 text-rose-700 dark:text-rose-400 text-[11px]">
                  {currentAlgo.cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Implementation in C++ (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                C++ Implementation
              </span>

              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-950 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
              <code>{currentAlgo.codeCpp}</code>
            </pre>
          </div>
        </div>

      </div>

      {/* Global Master Sorting Complexity Cheat Sheet Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          Master Sorting Complexity Comparison Matrix
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Best Time</th>
                <th className="px-4 py-3">Average Time</th>
                <th className="px-4 py-3">Worst Time</th>
                <th className="px-4 py-3">Worst Space</th>
                <th className="px-4 py-3">Stability</th>
                <th className="px-4 py-3">In-Place</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {SORTING_ALGORITHMS.map(a => (
                <tr 
                  key={a.id}
                  onClick={() => setSelectedAlgoId(a.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedAlgoId === a.id 
                      ? 'bg-blue-50 dark:bg-blue-950/40 font-bold' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {a.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">{a.bestTime}</td>
                  <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">{a.averageTime}</td>
                  <td className="px-4 py-3 font-mono text-rose-600 dark:text-rose-400">{a.worstTime}</td>
                  <td className="px-4 py-3 font-mono">{a.auxiliarySpace}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.stability === 'Stable' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {a.stability}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{a.inPlace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
