import React from "react";
import { X } from "lucide-react";
import { Button } from "./Badge";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  confirmVariant = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl p-6 text-[var(--text-primary)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-destructive)]">
            Confirm Action
          </span>
          <h3 className="text-xl font-serif font-normal text-[var(--text-primary)] mt-1">
            {title}
          </h3>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed font-sans">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
