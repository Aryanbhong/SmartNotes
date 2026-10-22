
import React, { useRef, useEffect } from "react";
import {
  X,
  Edit3,
  Share2,
  Download,
  Calendar,
  Clock,
  Pin,
  Star,
  Sparkles,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";
import { formatNoteDate, getReadingStats } from "../../utils/formatters";
import { exportElementToPdf } from "../../utils/exportUtils";
import { Button, Badge } from "../common/Badge";
import toast from "react-hot-toast";

export const ViewNoteModal = () => {
  const {
    viewingNote,
    setViewingNote,
    openEditNoteModal,
    setSharingNote,
  } = useNotes();

  const { isDarkMode } = useTheme();
  const noteRef = useRef(null);

  useEffect(() => {
    if (!viewingNote) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setViewingNote(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingNote, setViewingNote]);

  if (!viewingNote) return null;

  const stats = getReadingStats(viewingNote.content || "");

  const handleEdit = () => {
    const note = viewingNote;
    setViewingNote(null);
    openEditNoteModal(note);
  };

  const handleShare = () => {
    const note = viewingNote;
    setViewingNote(null);
    setSharingNote(note);
  };

  const handleDownloadPdf = async () => {
    try {
      toast.success("Generating PDF...");
      await exportElementToPdf(
        noteRef.current,
        `${viewingNote.title || "note"}.pdf`
      );
    } catch {
      toast.error("Unable to export PDF");
    }
  };

  const iconButton =
    "p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]/40";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[var(--bg-base)]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setViewingNote(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-note-title"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-[0_24px_80px_rgba(41,39,32,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header and toolbar */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {viewingNote.pinned && (
              <Badge variant="sage" size="xs">
                <Pin className="w-3 h-3" />
                Pinned
              </Badge>
            )}

            {viewingNote.favorite && (
              <Badge variant="ochre" size="xs">
                <Star className="w-3 h-3" />
                Favorite
              </Badge>
            )}

            {viewingNote.folder && (
              <Badge variant="neutral" size="xs">
                {viewingNote.folder}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleEdit}
              className={`${iconButton} hover:text-[var(--accent-sage)]`}
              title="Edit note"
              aria-label="Edit note"
            >
              <Edit3 className="w-4 h-4 text-[var(--accent-sage)]" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className={`${iconButton} hover:text-[var(--accent-peach)]`}
              title="Share note"
              aria-label="Share note"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className={iconButton}
              title="Export PDF"
              aria-label="Export note as PDF"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewingNote(null)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]/40"
              aria-label="Close note"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable note content */}
        <div
          ref={noteRef}
          className={`flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-7 ${
            isDarkMode
              ? "notebook-ruled-dark"
              : "notebook-ruled-light"
          }`}
        >
          {/* Title and metadata */}
          <div>
            <h1
              id="view-note-title"
              className="text-3xl sm:text-4xl font-bold font-fraunces tracking-tight leading-tight mb-4 text-[var(--text-primary)]"
            >
              {viewingNote.title || "Untitled Note"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
                {formatNoteDate(viewingNote.createdAt)}
              </span>

              <span className="hidden sm:inline text-[var(--text-muted)]">•</span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                ~{stats.readingTimeMin} min read
                <span className="opacity-70">
                  ({stats.wordCount} words)
                </span>
              </span>
            </div>
          </div>

          {/* AI summary */}
          {viewingNote.summary && (
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/8">
              <div className="flex items-center gap-2 mb-2 font-mono font-bold uppercase tracking-wider text-[11px] text-[var(--accent-gold)]">
                <Sparkles className="w-4 h-4" />
                AI Generated Summary
              </div>

              <p className="text-sm leading-7 whitespace-pre-line text-[var(--text-secondary)]">
                {viewingNote.summary}
              </p>
            </div>
          )}

          {/* Rich text note body */}
          <div
            className="prose max-w-none break-words text-sm sm:text-base leading-8 prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-a:text-[var(--accent-sage)] prose-blockquote:border-[var(--accent-sage)] prose-blockquote:text-[var(--text-secondary)] prose-code:text-[var(--accent-heart)]"
            dangerouslySetInnerHTML={{
              __html: viewingNote.content || "",
            }}
          />

          {/* Tags */}
          {viewingNote.tags?.length > 0 && (
            <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
              {viewingNote.tags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] border-[var(--accent-sage)]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewingNote(null)}
          >
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleEdit}
            icon={Edit3}
          >
            Edit Note
          </Button>
        </div>
      </div>
    </div>
  );
};
