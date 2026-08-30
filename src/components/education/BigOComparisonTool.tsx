import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
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

export const BigOComparisonTool: React.FC = () => {
  const [nValue, setNValue] = useState<number>(100);
  const [scaleType, setScaleType] = useState<'linear' | 'log'>('linear');

  // Big-O complexities list
  const complexities = [
    {
      name: 'O(1)',
      label: 'Constant',
      color: '#10b981', // green
      rating: 'Excellent',
      ratingClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      calc: (n: number) => 1,
      formatOps: (n: number) => '1 operation',
      timeAt1Ghz: (n: number) => '1 ns',
      example: 'Array index access, Hash map lookup (avg)'
    },
    {
      name: 'O(log n)',
      label: 'Logarithmic',
      color: '#06b6d4', // cyan
      rating: 'Good',
      ratingClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
      calc: (n: number) => Math.log2(Math.max(1, n)),
      formatOps: (n: number) => `${Math.ceil(Math.log2(Math.max(1, n)))} ops`,
      timeAt1Ghz: (n: number) => `${(Math.log2(Math.max(1, n)) * 1).toFixed(1)} ns`,
      example: 'Binary Search, Balanced BST lookup'
    },
    {
      name: 'O(n)',
      label: 'Linear',
      color: '#3b82f6', // blue
      rating: 'Fair',
      ratingClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      calc: (n: number) => n,
      formatOps: (n: number) => `${n.toLocaleString()} ops`,
      timeAt1Ghz: (n: number) => `${n < 1000 ? n + ' ns' : (n / 1000).toFixed(2) + ' µs'}`,
      example: 'Linear search, Array traversal'
    },
    {
      name: 'O(n log n)',
      label: 'Linearithmic',
      color: '#8b5cf6', // purple
      rating: 'Fair to Moderate',
      ratingClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      calc: (n: number) => n * Math.log2(Math.max(1, n)),
      formatOps: (n: number) => `${Math.round(n * Math.log2(Math.max(1, n))).toLocaleString()} ops`,
      timeAt1Ghz: (n: number) => {
        const ops = n * Math.log2(Math.max(1, n));
        return ops < 1e6 ? `${(ops / 1000).toFixed(1)} µs` : `${(ops / 1e6).toFixed(2)} ms`;
      },
      example: 'Merge Sort, Quick Sort (avg), Heap Sort'
    },
    {
      name: 'O(n²)',
      label: 'Quadratic',
      color: '#f59e0b', // amber
      rating: 'Poor',
      ratingClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      calc: (n: number) => n * n,
      formatOps: (n: number) => `${(n * n).toLocaleString()} ops`,
      timeAt1Ghz: (n: number) => {
        const ops = n * n;
        if (ops < 1e6) return `${(ops / 1000).toFixed(1)} µs`;
        if (ops < 1e9) return `${(ops / 1e6).toFixed(2)} ms`;
        return `${(ops / 1e9).toFixed(2)} s`;
      },
      example: 'Bubble Sort, Selection Sort, 2D Matrix traversal'
    },
    {
      name: 'O(n³)',
      label: 'Cubic',
      color: '#f97316', // orange
      rating: 'Very Poor',
      ratingClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
      calc: (n: number) => Math.pow(n, 3),
      formatOps: (n: number) => `${Math.pow(n, 3).toLocaleString()} ops`,
      timeAt1Ghz: (n: number) => {
        const ops = Math.pow(n, 3);
        if (ops < 1e6) return `${(ops / 1000).toFixed(1)} µs`;
        if (ops < 1e9) return `${(ops / 1e6).toFixed(2)} ms`;
        return `${(ops / 1e9).toFixed(2)} s`;
      },
      example: 'Standard 3D Matrix Multiplication, Floyd-Warshall'
    },
    {
      name: 'O(2ⁿ)',
      label: 'Exponential',
      color: '#ef4444', // red
      rating: 'Horrible',
      ratingClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      calc: (n: number) => (n <= 25 ? Math.pow(2, n) : 33554432),
      formatOps: (n: number) => (n <= 30 ? `${Math.pow(2, n).toLocaleString()} ops` : '> 10¹² ops'),
      timeAt1Ghz: (n: number) => {
        if (n <= 10) return `${Math.pow(2, n)} ns`;
        if (n <= 20) return `${(Math.pow(2, n) / 1e6).toFixed(2)} ms`;
        if (n <= 30) return `${(Math.pow(2, n) / 1e9).toFixed(2)} s`;
        return 'Years / Centuries';
      },
      example: 'Recursive Fibonacci, Subset generation, Traveling Salesman (brute force)'
    },
    {
      name: 'O(n!)',
      label: 'Factorial',
      color: '#991b1b', // dark red
      rating: 'Catastrophic',
      ratingClass: 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200',
      calc: (n: number) => (n <= 10 ? factorial(n) : 3628800),
      formatOps: (n: number) => (n <= 12 ? `${factorial(n).toLocaleString()} ops` : 'Astronomical'),
      timeAt1Ghz: (n: number) => {
        if (n <= 5) return '120 ns';
        if (n <= 10) return '3.6 ms';
        if (n <= 15) return '15.1 days';
        return 'Heat death of Universe';
      },
      example: 'All permutations generation, Brute-force Knapsack'
    }
  ];

  function factorial(x: number): number {
    let res = 1;
    for (let i = 2; i <= x; i++) res *= i;
    return res;
  }

  // Generate chart data across n=1..50
  const chartPoints = [1, 2, 4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const chartData = chartPoints.map(n => {
    return {
      n,
      'O(1)': 1,
      'O(log n)': Number(Math.log2(n).toFixed(2)),
      'O(n)': n,
      'O(n log n)': Number((n * Math.log2(n)).toFixed(2)),
      'O(n²)': Math.min(2500, n * n),
      'O(2ⁿ)': n <= 11 ? Math.pow(2, n) : 2048
    };
  });

  return (
    <div className="space-y-8">
      {/* Interactive N Slider Control */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Interactive Input Size (n) Simulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag the slider to test how operation counts scale across each complexity tier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">n =</span>
            <input
              type="number"
              value={nValue}
              min={1}
              max={1000000}
              onChange={e => setNValue(Math.max(1, Number(e.target.value) || 1))}
              className="w-28 px-3 py-1.5 font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-right text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={10000}
          value={nValue}
          onChange={e => setNValue(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>n = 1</span>
          <span>n = 100</span>
          <span>n = 1,000</span>
          <span>n = 10,000</span>
        </div>
      </div>

      {/* Big-O Growth Curves Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Big-O Growth Curves (n = 1 to 50)
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">
            Y-axis: Estimated CPU Operations
          </span>
        </div>

        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="n" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 1000]} />
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
              <Line type="monotone" dataKey="O(1)" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="O(log n)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="O(n)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="O(n log n)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="O(n²)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="O(2ⁿ)" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Complexity Matrix Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          Live Calculations at n = {nValue.toLocaleString()}
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Notation</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Operations @ n={nValue}</th>
                <th className="px-4 py-3">Est. Time @ 1GHz</th>
                <th className="px-4 py-3">Classic Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {complexities.map(c => (
                <tr key={c.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sm text-slate-900 dark:text-white">
                    <span style={{ color: c.color }}>{c.name}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{c.label}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.ratingClass}`}>
                      {c.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {c.formatOps(nValue)}
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {c.timeAt1Ghz(nValue)}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {c.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asymptotic Notation Guide: Big-O vs Big-Omega vs Big-Theta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono font-black text-rose-400">Big-O (O)</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase">
              Upper Bound
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Represents the <strong>worst-case upper bound</strong>. Guarantees that algorithm runtime will not grow faster than f(n) for sufficiently large n: <code className="font-mono text-rose-300">T(n) ≤ c · f(n)</code>.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono font-black text-emerald-400">Big-Theta (Θ)</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
              Tight Bound
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Represents the <strong>exact asymptotically tight bound</strong>. Sandwiching both upper and lower bounds simultaneously: <code className="font-mono text-emerald-300">c₁ · f(n) ≤ T(n) ≤ c₂ · f(n)</code>.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono font-black text-amber-400">Big-Omega (Ω)</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
              Lower Bound
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Represents the <strong>best-case lower bound</strong>. The minimum time the algorithm requires for any input instance: <code className="font-mono text-amber-300">T(n) ≥ c · f(n)</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
