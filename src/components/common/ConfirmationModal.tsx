import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemCount?: number;
  actionLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  itemCount,
  actionLabel = 'Confirm',
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-black border border-black dark:border-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">{title}</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">{description}</p>
        
        {itemCount !== undefined && (
          <div className="mt-3 text-xs font-mono text-black dark:text-white">
            Count: <strong>{itemCount} files</strong>
          </div>
        )}

        {children && <div className="mt-3 max-h-40 overflow-y-auto border-t border-neutral-200 dark:border-neutral-800 pt-2">{children}</div>}

        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
          [100% Local • Reversible Operation]
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="mono-btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="mono-btn-primary"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
