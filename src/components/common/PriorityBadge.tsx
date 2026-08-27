import React from 'react';
import { PriorityLevel } from '../../types';
import { Flame, Clock, AlertCircle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  deadline?: string | null;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, deadline, size = 'sm' }) => {
  let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  let icon = null;

  if (priority === 'High') {
    bg = 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    icon = <Flame className="w-3 h-3 text-rose-500 fill-rose-500/20" />;
  } else if (priority === 'Medium') {
    bg = 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    icon = <AlertCircle className="w-3 h-3 text-amber-500" />;
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        } ${bg}`}
      >
        {icon}
        <span>{priority}</span>
      </span>

      {deadline && (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
          title={`Extracted Deadline: ${deadline}`}
        >
          <Clock className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{deadline}</span>
        </span>
      )}
    </div>
  );
};
