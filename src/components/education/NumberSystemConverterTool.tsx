import React, { useState } from 'react';
import { 
  Binary, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ListOrdered, 
  Cpu, 
  Layers, 
  ArrowRightLeft 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NumberSystemConverterTool: React.FC = () => {
  const { showToast } = useApp();
  const [decVal, setDecVal] = useState<number>(254);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bit representation (8-bit array)
  const bits = Array.from({ length: 8 }, (_, i) => (decVal >> (7 - i)) & 1);

  const binStr = (decVal >>> 0).toString(2);
  const hexStr = (decVal >>> 0).toString(16).toUpperCase();
  const octStr = (decVal >>> 0).toString(8);

  const handleBitToggle = (bitIndex: number) => {
    const bitPos = 7 - bitIndex;
    const newDec = decVal ^ (1 << bitPos);
    setDecVal(Math.max(0, newDec));
  };

  const handleDecChange = (valStr: string) => {
    const val = parseInt(valStr, 10);
    setDecVal(isNaN(val) ? 0 : Math.max(0, val));
  };

  const handleBinChange = (bin: string) => {
    const clean = bin.replace(/[^01]/g, '');
    const val = parseInt(clean, 2);
    setDecVal(isNaN(val) ? 0 : val);
  };

  const handleHexChange = (hex: string) => {
    const clean = hex.replace(/[^0-9A-Fa-f]/g, '');
    const val = parseInt(clean, 16);
    setDecVal(isNaN(val) ? 0 : val);
  };

  const handleOctChange = (oct: string) => {
    const clean = oct.replace(/[^0-7]/g, '');
    const val = parseInt(clean, 8);
    setDecVal(isNaN(val) ? 0 : val);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key}: ${text} 📋`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Division by 2 steps for Decimal -> Binary derivation
  const getDivisionSteps = (num: number, base: number) => {
    const steps: { quotient: number; remainder: number; original: number }[] = [];
    let cur = num;
    if (cur === 0) return [{ original: 0, quotient: 0, remainder: 0 }];

    while (cur > 0) {
      const quotient = Math.floor(cur / base);
      const remainder = cur % base;
      steps.push({ original: cur, quotient, remainder });
      cur = quotient;
    }
    return steps;
  };

  const divSteps2 = getDivisionSteps(decVal, 2);
  const divSteps16 = getDivisionSteps(decVal, 16);

  return (
    <div className="space-y-8">
      {/* 4-Radix Synchronized Inputs Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
            Synchronized Radix Converter
          </h3>
          <button
            onClick={() => setDecVal(0)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Decimal (Base 10) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Decimal (Base 10)</span>
              <button
                onClick={() => handleCopy(String(decVal), 'Decimal')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'Decimal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="number"
              value={decVal}
              onChange={e => handleDecChange(e.target.value)}
              className="w-full font-mono text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Binary (Base 2) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-500 uppercase">Binary (Base 2)</span>
              <button
                onClick={() => handleCopy(binStr, 'Binary')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'Binary' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={binStr}
              onChange={e => handleBinChange(e.target.value)}
              className="w-full font-mono text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hexadecimal (Base 16) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-500 uppercase">Hexadecimal (Base 16)</span>
              <button
                onClick={() => handleCopy(hexStr, 'Hexadecimal')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'Hexadecimal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={hexStr}
              onChange={e => handleHexChange(e.target.value)}
              className="w-full font-mono text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Octal (Base 8) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-500 uppercase">Octal (Base 8)</span>
              <button
                onClick={() => handleCopy(octStr, 'Octal')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {copiedKey === 'Octal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={octStr}
              onChange={e => handleOctChange(e.target.value)}
              className="w-full font-mono text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Interactive 8-Bit Nibble Visualizer & Bit Toggler */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Interactive 8-Bit Byte & Nibbles (Click Bits to Toggle)
          </span>
          <span className="text-[11px] text-slate-400">
            Upper Nibble [b7..b4] | Lower Nibble [b3..b0]
          </span>
        </div>

        <div className="grid grid-cols-8 gap-2">
          {bits.map((bit, idx) => {
            const bitPower = 7 - idx;
            const bitWeight = Math.pow(2, bitPower);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleBitToggle(idx)}
                className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-between border transition-all select-none ${
                  bit === 1
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <span className="text-[9px] font-mono opacity-60">b{bitPower}</span>
                <span className="text-xl sm:text-3xl font-mono font-black my-1">{bit}</span>
                <span className="text-[9px] font-mono opacity-80">{bitWeight}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Division & Remainder Workings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Decimal to Binary Division Steps */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
            Decimal to Binary (Divide-by-2 Method)
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="px-3 py-2">Division</th>
                  <th className="px-3 py-2">Quotient</th>
                  <th className="px-3 py-2 text-right">Remainder (Bit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {divSteps2.map((s, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5">{s.original} ÷ 2</td>
                    <td className="px-3 py-1.5 text-slate-500">{s.quotient}</td>
                    <td className="px-3 py-1.5 text-right font-bold text-blue-600 dark:text-blue-400">
                      {s.remainder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Read remainders bottom-to-top to form binary: <strong className="font-mono text-slate-900 dark:text-white">({binStr})₂</strong>
          </p>
        </div>

        {/* Decimal to Hex Division Steps */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-purple-500" />
            Decimal to Hexadecimal (Divide-by-16 Method)
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="px-3 py-2">Division</th>
                  <th className="px-3 py-2">Quotient</th>
                  <th className="px-3 py-2 text-right">Remainder (Hex)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {divSteps16.map((s, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5">{s.original} ÷ 16</td>
                    <td className="px-3 py-1.5 text-slate-500">{s.quotient}</td>
                    <td className="px-3 py-1.5 text-right font-bold text-purple-600 dark:text-purple-400">
                      {s.remainder.toString(16).toUpperCase()} ({s.remainder})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Hexadecimal representation: <strong className="font-mono text-slate-900 dark:text-white">0x{hexStr}</strong>
          </p>
        </div>

      </div>
    </div>
  );
};
