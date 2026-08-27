import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-sm">
      <div className="bg-black text-white dark:bg-white dark:text-black px-4 py-3 rounded border border-neutral-700 dark:border-neutral-300 shadow-lg text-xs font-mono">
        {toast.message}
      </div>
    </div>
  );
};
