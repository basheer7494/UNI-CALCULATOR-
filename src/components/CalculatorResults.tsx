import React, { useState } from 'react';
import { CalculatorOutput } from '../types/calculator';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ChevronDown, 
  Table as TableIcon,
  PieChart as ChartIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalculatorResultsProps {
  output: CalculatorOutput;
  calculatorName: string;
}

export const CalculatorResults: React.FC<CalculatorResultsProps> = ({ output, calculatorName }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showFullTable, setShowFullTable] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(output.primaryMetric.formattedValue));
    setCopied(true);
    showToast('Result copied to clipboard! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (!output.table && !output.chart) {
      showToast('No table data available to export', 'info');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    if (output.table) {
      const headers = output.table.columns.map(c => `"${c.label}"`).join(",");
      const rows = output.table.data.map(row => 
        output.table!.columns.map(c => `"${row[c.key] ?? ''}"`).join(",")
      ).join("\n");
      csvContent += headers + "\n" + rows;
    } else if (output.chart?.data) {
      const keys = Object.keys(output.chart.data[0] || {});
      const headers = keys.map(k => `"${k}"`).join(",");
      const rows = output.chart.data.map(row => 
        keys.map(k => `"${row[k] ?? ''}"`).join(",")
      ).join("\n");
      csvContent += headers + "\n" + rows;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${calculatorName.toLowerCase().replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV downloaded successfully! 📊', 'success');
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Pie chart data from breakdown if available
  const pieData = output.breakdown?.map(b => ({
    name: b.label,
    value: b.value,
    color: b.color || '#3b82f6'
  })) || [];

  return (
    <div className="space-y-6">
      {/* Primary Metric Highlight Box */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/15">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100/90">
              {output.primaryMetric.label}
            </span>
            {output.primaryMetric.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-extrabold uppercase rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                <Sparkles className="w-3 h-3" />
                {output.primaryMetric.badge}
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-4 min-w-0">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm break-words min-w-0 leading-tight">
              {output.primaryMetric.formattedValue}
            </div>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all shrink-0 active:scale-95"
              title="Copy formatted result"
              aria-label="Copy formatted result"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {output.primaryMetric.subtext && (
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              {output.primaryMetric.subtext}
            </p>
          )}
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      {output.secondaryMetrics && output.secondaryMetrics.length > 0 && (
        <div className={`grid gap-3.5 ${
          output.secondaryMetrics.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
        }`}>
          {output.secondaryMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between min-w-0"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {metric.label}
              </span>
              <div className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white break-words min-w-0 leading-snug">
                {metric.formattedValue}
              </div>
              {metric.subtext && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 break-words">
                  {metric.subtext}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Breakdown Progress Bars & Pie Chart */}
      {output.breakdown && output.breakdown.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ChartIcon className="w-3.5 h-3.5 text-blue-500" />
              Ratio Breakdown
            </h3>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {output.breakdown.map((item, i) => {
              const pct = isNaN(item.percentage) || !isFinite(item.percentage) ? 0 : Math.max(0, Math.min(100, item.percentage));
              return (
                <div
                  key={i}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color || '#3b82f6'
                  }}
                  className="h-full transition-all duration-300 relative group"
                  title={`${item.label}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Breakdown Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {output.breakdown.map((item, i) => {
              const pct = isNaN(item.percentage) || !isFinite(item.percentage) ? 0 : Math.round(item.percentage);
              return (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || '#3b82f6' }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.formattedValue}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5 whitespace-nowrap">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Charts */}
      {output.chart && output.chart.data && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {output.chart.title || 'Growth & Projection Chart'}
            </h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {output.chart.type === 'line' ? (
                <AreaChart data={output.chart.data}>
                  <defs>
                    <linearGradient id="colorGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  {output.chart.series.map((s, idx) => (
                    <Area
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.name}
                      stroke={s.color}
                      fill={idx === 0 ? 'url(#colorGrad1)' : 'url(#colorGrad2)'}
                      strokeWidth={2.5}
                    />
                  ))}
                </AreaChart>
              ) : (
                <BarChart data={output.chart.data}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  {output.chart.series.map(s => (
                    <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[6, 6, 0, 0]} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Schedule Data Table */}
      {output.table && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-blue-500" />
              {output.table.title || 'Detailed Amortization / Breakdown Schedule'}
            </h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {output.table.columns.map(col => (
                    <th key={col.key} className="px-3.5 py-2.5">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(showFullTable ? output.table.data : output.table.data.slice(0, 7)).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {output.table!.columns.map(col => (
                      <td key={col.key} className="px-3.5 py-2 font-medium">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {output.table.data.length > 7 && (
            <button
              onClick={() => setShowFullTable(prev => !prev)}
              className="w-full py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>{showFullTable ? 'Show Fewer Rows' : `Show All ${output.table.data.length} Rows`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullTable ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      {/* AI / Algorithmic Summary Text */}
      {output.summaryText && (
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Summary Takeaway: </span>
            {output.summaryText}
          </div>
        </div>
      )}
    </div>
  );
};
