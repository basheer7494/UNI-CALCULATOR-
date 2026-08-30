import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'sidebar' | 'in-feed';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ format = 'horizontal', className = '' }) => {
  return (
    <div className={`w-full overflow-hidden my-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3 text-center ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500 mb-2 px-1">
        <span>Sponsored / Advertisement</span>
        <span>Ad Space</span>
      </div>
      <div className={`w-full flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-400 font-medium ${
        format === 'horizontal' ? 'h-24 sm:h-28' : format === 'sidebar' ? 'h-64' : 'h-36'
      }`}>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-700 dark:text-slate-400 font-semibold">Responsive AdSense Placement</span>
          <span className="text-[11px] text-slate-600 dark:text-slate-500">Auto-optimized for 728x90, 300x250, and 320x50 mobile formats</span>
        </div>
      </div>
    </div>
  );
};
