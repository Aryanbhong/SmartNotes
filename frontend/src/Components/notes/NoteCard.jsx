import React, { useState } from "react";
import {
  Pin,
  Star,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Calendar,
  Folder,
  Loader2,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/formatters";
import { Badge } from "../common/Badge";

export const NoteCard = ({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onSummarize,
  onShare,
  loadingSummary,
  onTagClick,
}) => {
  const [showSummary, setShowSummary] = useState(false);

  const cleanTextPreview = note.content
    ? note.content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()
    : "No text preview available.";

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
        note.pinned
          ? "border-[var(--accent-sage)]/30 bg-[var(--accent-sage)]/5 shadow-sm"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:-translate-y-0.5 hover:border-[var(--accent-sage)]/30 hover:shadow-lg hover:shadow-black/5"
      }`}
    >
      {/* Folder and quick actions */}
      <div className="p-4 pb-2 sm:p-5 sm:pb-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {note.folder && (
              <span className="inline-flex min-w-0 items-center gap-1.5 truncate font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                <Folder className="h-3.5 w-3.5 shrink-0 text-[var(--accent-sage)]" />
                <span className="truncate">{note.folder}</span>
              </span>
            )}

            {note._offline && (
              <Badge variant="warning" size="xs">
                Offline
              </Badge>
            )}

            {note.shareId && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-peach)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-peach)]" />
                Shared
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.(note);
              }}
              className={`rounded-lg p-1.5 transition-colors ${
                note.pinned
                  ? "bg-[var(--accent-sage)]/20 text-[var(--accent-sage)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--accent-sage)]/10 hover:text-[var(--accent-sage)]"
              }`}
              title={note.pinned ? "Unpin note" : "Pin note to top"}
              aria-label={note.pinned ? "Unpin note" : "Pin note to top"}
            >
              <Pin
                className={`h-3.5 w-3.5 ${
                  note.pinned ? "fill-current" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(note);
              }}
              className={`rounded-lg p-1.5 transition-colors ${
                note.favorite
                  ? "bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--accent-gold)]/10 hover:text-[var(--accent-gold)]"
              }`}
              title={note.favorite ? "Remove from favorites" : "Add to favorites"}
              aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  note.favorite ? "fill-current" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Note title */}
        <h3
          onClick={() => onView?.(note)}
          className="mb-2 line-clamp-2 cursor-pointer font-fraunces text-base font-semibold leading-snug tracking-tight text-[var(--text-primary)] transition-colors hover:text-[var(--accent-sage)]"
        >
          {note.title || "Untitled Note"}
        </h3>

        {/* Content preview */}
        <p
          onClick={() => onView?.(note)}
          className="line-clamp-3 cursor-pointer font-sans text-xs leading-relaxed text-[var(--text-secondary)]"
        >
          {cleanTextPreview}
        </p>
      </div>

      {/* AI summary */}
      {note.summary && (
        <div className="my-1 px-4 sm:px-5">
          {showSummary ? (
            <div className="rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 p-3 text-xs text-[var(--text-secondary)]">
              <div className="mb-1.5 flex items-center justify-between gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  AI Summary
                </span>

                <button
                  type="button"
                  onClick={() => setShowSummary(false)}
                  className="rounded-md px-1.5 py-0.5 font-sans normal-case tracking-normal text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                >
                  Hide
                </button>
              </div>

              <p className="line-clamp-3 leading-relaxed">{note.summary}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="inline-flex items-center gap-1.5 rounded-md py-1 font-sans text-[11px] font-medium text-[var(--accent-gold)] transition-colors hover:text-[var(--accent-gold)]/80"
            >
              <Sparkles className="h-3 w-3" />
              Show summary
            </button>
          )}
        </div>
      )}

      {/* Tags and footer */}
      <div className="p-4 pt-2 sm:p-5 sm:pt-2">
        {note.tags && note.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((tag, i) => (
              <button
                key={`${tag}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="rounded-full border border-[var(--accent-sage)]/20 bg-[var(--accent-sage)]/10 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--accent-sage)] transition-colors hover:border-[var(--accent-sage)]/40 hover:bg-[var(--accent-sage)]/15"
              >
                #{tag}
              </button>
            ))}

            {note.tags.length > 3 && (
              <span className="self-center px-1 font-mono text-[10px] text-[var(--text-muted)]">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata and actions */}
        <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-muted)]">
          <span className="flex min-w-0 items-center gap-1.5 font-mono uppercase tracking-wider">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {formatRelativeTime(note.createdAt)}
            </span>
          </span>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => onView?.(note)}
              className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              title="View full note"
              aria-label="View full note"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>

            {!note.summary && (
              <button
                type="button"
                disabled={loadingSummary}
                onClick={() => onSummarize?.(note)}
                className="rounded-lg p-1.5 text-[var(--accent-gold)] transition-colors hover:bg-[var(--accent-gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
                title="Generate AI summary"
                aria-label="Generate AI summary"
              >
                {loadingSummary ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onShare?.(note)}
              className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-peach)]/15 hover:text-[var(--accent-peach)]"
              title="Share"
              aria-label="Share note"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(note)}
              className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-sage)]/15 hover:text-[var(--accent-sage)]"
              title="Edit"
              aria-label="Edit note"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(note.id)}
              className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)]"
              title="Delete note"
              aria-label="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
