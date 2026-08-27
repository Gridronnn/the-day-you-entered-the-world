import React from 'react';
import { EmailCategory } from '../../types';

interface CategoryBadgeProps {
  category: EmailCategory;
  confidence?: number;
  explanation?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const CATEGORY_COLORS: Record<
  EmailCategory,
  { bg: string; text: string; border: string; darkBg: string; darkText: string; darkBorder: string }
> = {
  Important: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    darkBg: 'dark:bg-rose-950/70',
    darkText: 'dark:text-rose-300',
    darkBorder: 'dark:border-rose-800'
  },
  Work: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    darkBg: 'dark:bg-indigo-950/70',
    darkText: 'dark:text-indigo-300',
    darkBorder: 'dark:border-indigo-800'
  },
  Academic: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    darkBg: 'dark:bg-emerald-950/70',
    darkText: 'dark:text-emerald-300',
    darkBorder: 'dark:border-emerald-800'
  },
  Personal: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    darkBg: 'dark:bg-purple-950/70',
    darkText: 'dark:text-purple-300',
    darkBorder: 'dark:border-purple-800'
  },
  Finance: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    darkBg: 'dark:bg-amber-950/70',
    darkText: 'dark:text-amber-300',
    darkBorder: 'dark:border-amber-800'
  },
  Shopping: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    darkBg: 'dark:bg-orange-950/70',
    darkText: 'dark:text-orange-300',
    darkBorder: 'dark:border-orange-800'
  },
  Newsletters: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    darkBg: 'dark:bg-cyan-950/70',
    darkText: 'dark:text-cyan-300',
    darkBorder: 'dark:border-cyan-800'
  },
  Promotions: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    darkBg: 'dark:bg-pink-950/70',
    darkText: 'dark:text-pink-300',
    darkBorder: 'dark:border-pink-800'
  },
  Social: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    darkBg: 'dark:bg-sky-950/70',
    darkText: 'dark:text-sky-300',
    darkBorder: 'dark:border-sky-800'
  },
  'Spam Risk': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-300',
    darkBg: 'dark:bg-red-950/90',
    darkText: 'dark:text-red-300',
    darkBorder: 'dark:border-red-800'
  },
  Others: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    darkBg: 'dark:bg-slate-800',
    darkText: 'dark:text-slate-300',
    darkBorder: 'dark:border-slate-700'
  }
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  confidence,
  explanation,
  size = 'sm',
  onClick
}) => {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Others;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-semibold rounded-lg border transition-all ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${color.bg} ${color.text} ${color.border} ${color.darkBg} ${color.darkText} ${color.darkBorder} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      title={explanation ? `${explanation} (${confidence}% confidence)` : `${category}`}
    >
      <span>{category}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-normal text-[10px] ml-0.5">{confidence}%</span>
      )}
    </span>
  );
};
