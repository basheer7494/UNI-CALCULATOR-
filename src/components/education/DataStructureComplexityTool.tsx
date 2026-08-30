import React, { useState } from 'react';
import { DATA_STRUCTURES, DataStructureComplexity } from '../../lib/education/sortingComplexityData';
import { Database, Search, Layers, Box, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const DataStructureComplexityTool: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Linear', 'Tree', 'Hash'];

  const filtered = DATA_STRUCTURES.filter(ds => {
    const matchCat = selectedCategory === 'All' || ds.category === selectedCategory;
    const matchQuery = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || ds.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const getBadgeColor = (val: string) => {
    if (val === 'O(1)' || val === 'O(1) amortized') {
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold';
    }
    if (val.includes('log n')) {
      return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold';
    }
    if (val === 'O(n)') {
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search data structure..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Operations Complexity Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-500" />
          Time & Space Complexity Operations Matrix
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Data Structure</th>
                <th className="px-3 py-3 text-center" colSpan={2}>Access</th>
                <th className="px-3 py-3 text-center" colSpan={2}>Search</th>
                <th className="px-3 py-3 text-center" colSpan={2}>Insertion</th>
                <th className="px-3 py-3 text-center" colSpan={2}>Deletion</th>
                <th className="px-4 py-3">Space</th>
              </tr>
              <tr className="border-t border-slate-200/50 dark:border-slate-700/50 text-[9px] text-slate-400">
                <th className="px-4 py-1.5"></th>
                <th className="px-2 py-1.5 text-center">Avg</th>
                <th className="px-2 py-1.5 text-center">Worst</th>
                <th className="px-2 py-1.5 text-center">Avg</th>
                <th className="px-2 py-1.5 text-center">Worst</th>
                <th className="px-2 py-1.5 text-center">Avg</th>
                <th className="px-2 py-1.5 text-center">Worst</th>
                <th className="px-2 py-1.5 text-center">Avg</th>
                <th className="px-2 py-1.5 text-center">Worst</th>
                <th className="px-4 py-1.5">Worst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map(ds => (
                <tr key={ds.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-sans font-bold text-slate-900 dark:text-white">
                    {ds.name}
                    <span className="block text-[10px] font-normal text-slate-400 font-sans mt-0.5">
                      {ds.category}
                    </span>
                  </td>

                  {/* Access */}
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.accessAvg)}`}>{ds.accessAvg}</span>
                  </td>
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.accessWorst)}`}>{ds.accessWorst}</span>
                  </td>

                  {/* Search */}
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.searchAvg)}`}>{ds.searchAvg}</span>
                  </td>
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.searchWorst)}`}>{ds.searchWorst}</span>
                  </td>

                  {/* Insertion */}
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.insertionAvg)}`}>{ds.insertionAvg}</span>
                  </td>
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.insertionWorst)}`}>{ds.insertionWorst}</span>
                  </td>

                  {/* Deletion */}
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.deletionAvg)}`}>{ds.deletionAvg}</span>
                  </td>
                  <td className="px-2 py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${getBadgeColor(ds.deletionWorst)}`}>{ds.deletionWorst}</span>
                  </td>

                  {/* Space */}
                  <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {ds.spaceWorst}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Memory Diagrams & Architectural Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(ds => (
          <div key={ds.name} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Box className="w-4 h-4 text-blue-500" />
                {ds.name}
              </h4>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {ds.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {ds.description}
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre className="text-[11px]">{ds.memoryDiagram}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
