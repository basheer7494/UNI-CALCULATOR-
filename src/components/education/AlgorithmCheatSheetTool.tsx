import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Layers, 
  Filter, 
  Sparkles, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CheatSheetItem {
  name: string;
  category: 'Sorting' | 'Searching' | 'Graph' | 'Tree' | 'DP' | 'Array';
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  notes: string;
}

const CHEAT_SHEET_DATA: CheatSheetItem[] = [
  // Searching
  { name: 'Binary Search', category: 'Searching', bestTime: 'O(1)', avgTime: 'O(log n)', worstTime: 'O(log n)', space: 'O(1)', notes: 'Requires sorted collection' },
  { name: 'Linear Search', category: 'Searching', bestTime: 'O(1)', avgTime: 'O(n)', worstTime: 'O(n)', space: 'O(1)', notes: 'Works on unsorted collections' },
  { name: 'Hash Table Lookup', category: 'Searching', bestTime: 'O(1)', avgTime: 'O(1)', worstTime: 'O(n)', space: 'O(n)', notes: 'Worst case on excessive hash collisions' },
  { name: 'BST Search', category: 'Tree', bestTime: 'O(1)', avgTime: 'O(log n)', worstTime: 'O(n)', space: 'O(1)', notes: 'O(n) if unbalanced tree' },
  { name: 'AVL / Red-Black Tree', category: 'Tree', bestTime: 'O(1)', avgTime: 'O(log n)', worstTime: 'O(log n)', space: 'O(1)', notes: 'Guaranteed height balanced' },

  // Sorting
  { name: 'Quick Sort', category: 'Sorting', bestTime: 'O(n log n)', avgTime: 'O(n log n)', worstTime: 'O(n²)', space: 'O(log n)', notes: 'Fastest in practice; in-place' },
  { name: 'Merge Sort', category: 'Sorting', bestTime: 'O(n log n)', avgTime: 'O(n log n)', worstTime: 'O(n log n)', space: 'O(n)', notes: 'Stable sorting; O(n) auxiliary buffer' },
  { name: 'Heap Sort', category: 'Sorting', bestTime: 'O(n log n)', avgTime: 'O(n log n)', worstTime: 'O(n log n)', space: 'O(1)', notes: 'In-place; unstable' },
  { name: 'Bubble Sort', category: 'Sorting', bestTime: 'O(n)', avgTime: 'O(n²)', worstTime: 'O(n²)', space: 'O(1)', notes: 'O(n) best with swapped flag' },
  { name: 'Insertion Sort', category: 'Sorting', bestTime: 'O(n)', avgTime: 'O(n²)', worstTime: 'O(n²)', space: 'O(1)', notes: 'Fast for tiny arrays and nearly sorted data' },
  { name: 'Selection Sort', category: 'Sorting', bestTime: 'O(n²)', avgTime: 'O(n²)', worstTime: 'O(n²)', space: 'O(1)', notes: 'Always O(n²); minimum swaps (at most n)' },
  { name: 'Counting Sort', category: 'Sorting', bestTime: 'O(n+k)', avgTime: 'O(n+k)', worstTime: 'O(n+k)', space: 'O(k)', notes: 'Non-comparison; integer range k' },
  { name: 'Radix Sort', category: 'Sorting', bestTime: 'O(d(n+b))', avgTime: 'O(d(n+b))', worstTime: 'O(d(n+b))', space: 'O(n+b)', notes: 'Digit-by-digit positional sort' },

  // Graph
  { name: 'Breadth-First Search (BFS)', category: 'Graph', bestTime: 'O(V + E)', avgTime: 'O(V + E)', worstTime: 'O(V + E)', space: 'O(V)', notes: 'Shortest path in unweighted graph' },
  { name: 'Depth-First Search (DFS)', category: 'Graph', bestTime: 'O(V + E)', avgTime: 'O(V + E)', worstTime: 'O(V + E)', space: 'O(V)', notes: 'Topological sort, cycle detection' },
  { name: 'Dijkstra (Binary Heap)', category: 'Graph', bestTime: 'O((V + E) log V)', avgTime: 'O((V + E) log V)', worstTime: 'O((V + E) log V)', space: 'O(V)', notes: 'Non-negative edge weights' },
  { name: 'Bellman-Ford', category: 'Graph', bestTime: 'O(V · E)', avgTime: 'O(V · E)', worstTime: 'O(V · E)', space: 'O(V)', notes: 'Detects negative cycles' },
  { name: 'Floyd-Warshall', category: 'Graph', bestTime: 'O(V³)', avgTime: 'O(V³)', worstTime: 'O(V³)', space: 'O(V²)', notes: 'All-pairs shortest paths' },
  { name: 'Kruskal Minimum Spanning Tree', category: 'Graph', bestTime: 'O(E log E)', avgTime: 'O(E log E)', worstTime: 'O(E log E)', space: 'O(V)', notes: 'Disjoint Set Union (DSU)' },
  { name: 'Prim Minimum Spanning Tree', category: 'Graph', bestTime: 'O(E log V)', avgTime: 'O(E log V)', worstTime: 'O(E log V)', space: 'O(V)', notes: 'Priority Queue driven' },

  // Dynamic Programming
  { name: '0/1 Knapsack', category: 'DP', bestTime: 'O(n · W)', avgTime: 'O(n · W)', worstTime: 'O(n · W)', space: 'O(W)', notes: 'Pseudo-polynomial time' },
  { name: 'Longest Common Subsequence', category: 'DP', bestTime: 'O(n · m)', avgTime: 'O(n · m)', worstTime: 'O(n · m)', space: 'O(n · m)', notes: '2D matrix memoization' },
  { name: 'Matrix Chain Multiplication', category: 'DP', bestTime: 'O(n³)', avgTime: 'O(n³)', worstTime: 'O(n³)', space: 'O(n²)', notes: 'Optimal parenthesization' },
  { name: 'Kadane Max Subarray', category: 'Array', bestTime: 'O(n)', avgTime: 'O(n)', worstTime: 'O(n)', space: 'O(1)', notes: 'Single-pass dynamic programming' },
];

export const AlgorithmCheatSheetTool: React.FC = () => {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Sorting', 'Searching', 'Graph', 'Tree', 'DP', 'Array'];

  const filtered = CHEAT_SHEET_DATA.filter(item => {
    const matchCat = selectedCat === 'All' || item.category === selectedCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.notes.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getBadgeClass = (val: string) => {
    if (val === 'O(1)' || val === 'O(1) amortized') return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';
    if (val.includes('log') && !val.includes('²') && !val.includes('³')) return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300';
    if (val === 'O(n)' || val.includes('V + E')) return 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300';
    if (val.includes('n²') || val.includes('V · E')) return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300';
    return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search algorithms, complexities, graph..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cheat Sheet Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            Algorithm & Data Structure Quick Reference Cheat Sheet ({filtered.length} entries)
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Best Time</th>
                <th className="px-3 py-3">Average Time</th>
                <th className="px-3 py-3">Worst Time</th>
                <th className="px-3 py-3">Worst Space</th>
                <th className="px-4 py-3">Key Characteristics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-3 py-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getBadgeClass(item.bestTime)}`}>
                      {item.bestTime}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getBadgeClass(item.avgTime)}`}>
                      {item.avgTime}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getBadgeClass(item.worstTime)}`}>
                      {item.worstTime}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-800 dark:text-slate-200">
                    {item.space}
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
