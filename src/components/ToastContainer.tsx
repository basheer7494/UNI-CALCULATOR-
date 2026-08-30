import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 p-3.5 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 rounded-xl shadow-xl backdrop-blur-md border border-slate-800 dark:border-slate-200 text-sm font-medium"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 dark:text-blue-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 dark:text-rose-600 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
