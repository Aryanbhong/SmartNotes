
import React from "react";
import {
  Pin,
  Star,
  Eye,
  Edit3,
  Trash2,
  Share2,
  Calendar,
  Folder,
  Sparkles,
} from "lucide-react";
import { formatRelativeTime } from "../../utils/formatters";

export const NoteListRow = ({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onSummarize,
  onShare,
}) => {
  const cleanSnippet = note.content
    ? note.content.replace(/<[^>]*>?/gm, " ").slice(0, 90)
    : "";

  const actionButton =
    "p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]/40";

  return (
    <div
      onClick={() => onView?.(note)}
      className={`group flex items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        note.pinned
          ? "bg-[var(--accent-sage)]/5 border-[var(--accent-sage)]/25 hover:border-[var(--accent-sage)]/40"
          : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--accent-sage)]/25 hover:shadow-[0_5px_18px_rgba(0,0,0,0.06)]"
      }`}
    >
      {/* Favorite, pin, title and snippet */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 pr-1 sm:pr-4">
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onToggleFavorite?.(note)}
            aria-label={
              note.favorite ? "Remove from favorites" : "Add to favorites"
            }
            title={note.favorite ? "Remove favorite" : "Add favorite"}
            className={`p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/40 ${
              note.favorite
                ? "text-[var(--accent-gold)]"
                : "text-[var(--text-muted)] hover:text-[var(--accent-gold)]"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                note.favorite ? "fill-current" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onTogglePin?.(note)}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            title={note.pinned ? "Unpin note" : "Pin note"}
            className={`p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]/40 ${
              note.pinned
                ? "text-[var(--accent-sage)]"
                : "text-[var(--text-muted)] hover:text-[var(--accent-sage)]"
            }`}
          >
            <Pin
              className={`w-3.5 h-3.5 ${
                note.pinned ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="text-sm font-semibold font-sans text-[var(--text-primary)] truncate group-hover:text-[var(--accent-sage)] transition-colors">
              {note.title || "Untitled Note"}
            </h4>

            {note.summary && (
              <span
                className="shrink-0 p-1 rounded-md bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]"
                title="Has AI summary"
              >
                <Sparkles className="w-3 h-3" />
              </span>
            )}

            {note.shareId && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-peach)] shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-peach)]" />
                Shared
              </span>
            )}
          </div>

          <p className="text-xs text-[var(--text-secondary)] truncate mt-1 leading-relaxed font-sans">
            {cleanSnippet}
          </p>
        </div>
      </div>

      {/* Folder and tag metadata */}
      <div className="hidden md:flex items-center gap-3 text-xs shrink-0 max-w-[220px]">
        {note.folder && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] min-w-0">
            <Folder className="w-3.5 h-3.5 text-[var(--accent-sage)] shrink-0" />
            <span className="truncate max-w-[110px]">{note.folder}</span>
          </span>
        )}

        {note.tags?.length > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-[var(--accent-sage)]/10 border border-[var(--accent-sage)]/20 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-sage)] max-w-[100px] truncate">
            #{note.tags[0]}
          </span>
        )}
      </div>

      {/* Date and actions */}
      <div
        className="flex items-center gap-2 sm:gap-3 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="hidden sm:inline-flex font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] items-center gap-1.5 whitespace-nowrap">
          <Calendar className="w-3 h-3" />
          {formatRelativeTime(note.createdAt)}
        </span>

        <div className="flex items-center gap-0.5 sm:gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onView?.(note)}
            aria-label="View note"
            title="View"
            className={`${actionButton} text-[var(--text-muted)] hover:text-[var(--text-primary)]`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onShare?.(note)}
            aria-label="Share note"
            title="Share"
            className={`${actionButton} text-[var(--text-muted)] hover:bg-[var(--accent-peach)]/15 hover:text-[var(--accent-peach)]`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(note)}
            aria-label="Edit note"
            title="Edit"
            className={`${actionButton} text-[var(--text-muted)] hover:bg-[var(--accent-sage)]/15 hover:text-[var(--accent-sage)]`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(note.id)}
            aria-label="Delete note"
            title="Delete"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-destructive)]/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
