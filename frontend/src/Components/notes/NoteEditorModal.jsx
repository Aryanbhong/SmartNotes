import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Share2,
  Download,
  Pin,
  Star,
  Folder,
  Tag,
  FileDown,
  Cloud,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useAuth } from "../../context/AuthContext";
import { RichTextEditor } from "./RichTextEditor";
import { AiStudyToolsModal } from "./AiStudyToolsModal";
import { Button } from "../common/Badge";
import {
  exportNoteToTxt,
  exportNoteToMd,
  exportElementToPdf,
} from "../../utils/exportUtils";
import toast from "react-hot-toast";

export const NoteEditorModal = () => {
  const {
    isEditorOpen,
    setIsEditorOpen,
    editingNote,
    saveNote,
    folders,
    setSharingNote,
  } = useNotes();

  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("userId") || 1;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("General Notes");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [pinned, setPinned] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const noteContentRef = useRef(null);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || "");
      setContent(editingNote.content || "");
      setFolder(editingNote.folder || "General Notes");
      setTags(Array.isArray(editingNote.tags) ? editingNote.tags : []);
      setPinned(Boolean(editingNote.pinned));
      setFavorite(Boolean(editingNote.favorite));
      setSaveStatus("Saved");
    } else {
      setTitle("");
      setContent("");
      setFolder("General Notes");
      setTags([]);
      setTagInput("");
      setPinned(false);
      setFavorite(false);
      setSaveStatus("Unsaved");
    }

    setIsExportMenuOpen(false);
    setIsAiPanelOpen(false);
  }, [editingNote, isEditorOpen]);

  useEffect(() => {
    if (!isExportMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setIsExportMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isExportMenuOpen]);

  if (!isEditorOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      const val = tagInput.trim().replace(/^#/, "").toLowerCase();

      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
        setSaveStatus("Unsaved");
      }

      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setSaveStatus("Unsaved");
  };

  const handleApplyAiTag = (newTag) => {
    const clean = newTag.trim().replace(/^#/, "").toLowerCase();

    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
      setSaveStatus("Unsaved");
    }
  };

  const handleAppendAiContent = (htmlString) => {
    setContent((prev) => `${prev}<br/>${htmlString}`);
    setSaveStatus("Unsaved");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a note title");
      return;
    }

    setLoading(true);
    setSaveStatus("Saving...");

    try {
      const payload = {
        id: editingNote?.id,
        userId: parseInt(userId, 10),
        title: title.trim(),
        content,
        folder,
        tags,
        pinned,
        favorite,
        createdAt: editingNote?.createdAt || new Date().toISOString(),
      };

      await saveNote(payload);
      setSaveStatus("Saved");
      setIsEditorOpen(false);
    } catch {
      setSaveStatus("Unsaved");
      toast.error("Unable to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeEditor = () => {
    if (loading) return;
    setIsEditorOpen(false);
  };

  const exportPdf = () => {
    exportElementToPdf(
      noteContentRef.current,
      `${title || "note"}.pdf`
    );
    setIsExportMenuOpen(false);
    toast.success("Exporting PDF...");
  };

  const exportMarkdown = () => {
    exportNoteToMd(title, content, tags);
    setIsExportMenuOpen(false);
    toast.success("Downloaded Markdown (.md)");
  };

  const exportText = () => {
    exportNoteToTxt(title, content);
    setIsExportMenuOpen(false);
    toast.success("Downloaded Plain Text (.txt)");
  };

  const iconButtonClass =
    "rounded-xl p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]";

  const saveStatusClass =
    saveStatus === "Saved"
      ? "text-[var(--accent-heart)]"
      : saveStatus === "Saving..."
      ? "animate-pulse text-[var(--accent-gold)]"
      : "text-[var(--text-muted)]";

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-[var(--bg-base)]/60 p-2 backdrop-blur-sm duration-200 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-editor-title"
    >
      <div
        className={`relative flex h-[94vh] max-h-[900px] w-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl shadow-[var(--bg-base)]/15 transition-all duration-300 sm:rounded-3xl ${
          isAiPanelOpen ? "max-w-7xl" : "max-w-5xl"
        }`}
      >
        {/* Top action bar */}
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className={`flex shrink-0 items-center gap-1.5 text-[11px] font-medium sm:text-xs ${saveStatusClass}`}>
              <Cloud
                className={`h-4 w-4 ${saveStatusClass}`}
              />
              <span>{saveStatus}</span>
            </div>

            <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1.5 text-xs text-[var(--text-secondary)] sm:px-3">
              <Folder className="h-3.5 w-3.5 shrink-0 text-[var(--accent-sage)]" />

              <select
                value={folder}
                onChange={(e) => {
                  setFolder(e.target.value);
                  setSaveStatus("Unsaved");
                }}
                aria-label="Note folder"
                className="w-full max-w-[110px] cursor-pointer truncate bg-transparent font-medium outline-none sm:max-w-[160px]"
              >
                {!folders.includes(folder) && (
                  <option value={folder}>{folder}</option>
                )}

                {folders.map((f, i) => (
                  <option key={`${f}-${i}`} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => {
                setPinned((prev) => !prev);
                setSaveStatus("Unsaved");
              }}
              className={`${iconButtonClass} ${
                pinned
                  ? "bg-[var(--accent-sage)]/15 text-[var(--accent-sage)]"
                  : ""
              }`}
              title={pinned ? "Unpin note" : "Pin note"}
              aria-label={pinned ? "Unpin note" : "Pin note"}
              aria-pressed={pinned}
            >
              <Pin className={`h-4 w-4 ${pinned ? "fill-current" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                setFavorite((prev) => !prev);
                setSaveStatus("Unsaved");
              }}
              className={`rounded-xl p-2 transition-colors ${
                favorite
                  ? "bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--accent-gold)]/10 hover:text-[var(--accent-gold)]"
              }`}
              title={favorite ? "Remove favorite" : "Add to favorites"}
              aria-label={favorite ? "Remove favorite" : "Add to favorites"}
              aria-pressed={favorite}
            >
              <Star className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
            </button>

            {editingNote?.id && (
              <button
                type="button"
                onClick={() => setSharingNote(editingNote)}
                className="rounded-xl p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--accent-peach)]/10 hover:text-[var(--accent-peach)]"
                title="Share note"
                aria-label="Share note"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}

            {/* Export menu */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                className={iconButtonClass}
                title="Export options"
                aria-label="Export options"
                aria-expanded={isExportMenuOpen}
              >
                <Download className="h-4 w-4" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-xs shadow-xl shadow-[var(--bg-base)]/10">
                  <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Export note
                  </p>

                  <button
                    type="button"
                    onClick={exportPdf}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  >
                    <FileDown className="h-3.5 w-3.5 text-[var(--color-destructive)]" />
                    Export as PDF
                  </button>

                  <button
                    type="button"
                    onClick={exportMarkdown}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  >
                    <FileDown className="h-3.5 w-3.5 text-[var(--accent-sage)]" />
                    Export Markdown (.md)
                  </button>

                  <button
                    type="button"
                    onClick={exportText}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  >
                    <FileDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    Export Text (.txt)
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAiPanelOpen((prev) => !prev)}
              className={`ml-1 flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors sm:px-3 ${
                isAiPanelOpen
                  ? "bg-[var(--accent-gold)] text-[var(--bg-base)] shadow-sm"
                  : "border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/20"
              }`}
              aria-pressed={isAiPanelOpen}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Tools</span>
              <span className="sm:hidden">AI</span>
            </button>

            <button
              type="button"
              onClick={closeEditor}
              disabled={loading}
              className="ml-1 rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)] disabled:opacity-40"
              title="Close editor"
              aria-label="Close editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Editor and AI panel */}
        <div className="flex flex-1 overflow-hidden">
          <main
            ref={noteContentRef}
            className="flex min-w-0 flex-1 flex-col space-y-4 overflow-y-auto p-4 sm:p-7"
          >
            <div className="mb-1">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {editingNote?.id ? "Edit your thoughts" : "A fresh page"}
              </p>

              <input
                id="note-editor-title"
                type="text"
                placeholder="Give your note a title..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveStatus("Unsaved");
                }}
                className="w-full bg-transparent font-fraunces text-2xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-3xl"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 border-y border-[var(--border-subtle)] py-3">
              <Tag className="mr-1 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />

              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-sage)]/40 bg-[var(--accent-sage)]/10 py-1 pl-2.5 pr-1.5 text-[11px] font-medium text-[var(--accent-sage)]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full px-1 text-[var(--accent-sage)] transition-colors hover:bg-white/20 hover:text-[var(--color-destructive)]"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                aria-label="Add a tag"
                className="min-w-[100px] flex-1 bg-transparent py-1 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>

            {/* Rich text editor */}
            <div className="min-h-[250px] flex-1">
              <RichTextEditor
                content={content}
                onChange={(html) => {
                  setContent(html);
                  setSaveStatus("Unsaved");
                }}
              />
            </div>
          </main>

          {/* AI study tools */}
          {isAiPanelOpen && (
            <aside className="h-full w-72 shrink-0 overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-elevated)] sm:w-80 lg:w-96">
              <AiStudyToolsModal
                noteId={editingNote?.id}
                title={title}
                content={content}
                onApplyTags={handleApplyAiTag}
                onAppendContent={handleAppendAiContent}
                onClose={() => setIsAiPanelOpen(false)}
              />
            </aside>
          )}
        </div>

        {/* Bottom save bar */}
        <footer className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 sm:px-6">
          <div className="hidden items-center gap-2 text-[11px] text-[var(--text-muted)] sm:flex">
            <span>Quick save</span>
            <kbd className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 font-mono text-[10px] text-[var(--text-secondary)]">
              Ctrl + S
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={closeEditor}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleSubmit}
            >
              {editingNote?.id ? "Update Note" : "Save Note"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};
