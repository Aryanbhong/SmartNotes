import React from "react";
import { Button } from "./Badge";

export const NoteCardSkeleton = () => {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between h-[210px] animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-[var(--bg-surface-raised)] rounded-full w-2/3" />
          <div className="h-3 bg-[var(--bg-surface-raised)] rounded-full w-8" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-[var(--bg-surface-raised)] rounded-full w-full" />
          <div className="h-3 bg-[var(--bg-surface-raised)] rounded-full w-5/6" />
          <div className="h-3 bg-[var(--bg-surface-raised)] rounded-full w-3/4" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-[var(--bg-surface-raised)] rounded-full w-14" />
          <div className="h-4 bg-[var(--bg-surface-raised)] rounded-full w-16" />
        </div>
        <div className="border-t border-[var(--border-subtle)] pt-3 flex justify-between items-center">
          <div className="h-2.5 bg-[var(--bg-surface-raised)] rounded-full w-20" />
          <div className="h-3 bg-[var(--bg-surface-raised)] rounded-full w-12" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="h-2.5 bg-[var(--bg-surface-raised)] rounded-full w-20" />
            <div className="h-6 bg-[var(--bg-surface-raised)] rounded-full w-14" />
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-raised)]" />
        </div>
      ))}
    </div>
  );
};

/**
 * TwoDo Style Calm Empty State:
 * A single calm sentence in Fraunces, one clear action, no heavy illustrations.
 * ("Say the first note." style)
 */
export const EmptyState = ({
  title = "Say the first note.",
  description = "A quiet space waiting for your thoughts, lecture insights, and research.",
  actionLabel = "New Note",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 border border-[var(--border-subtle)] rounded-3xl bg-[var(--bg-surface)]/60 my-6">
      {/* Calm single sentence in Fraunces */}
      <h3 className="text-xl sm:text-2xl font-serif font-normal text-[var(--text-primary)] mb-2 italic tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed font-sans">
          {description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
