import React, { useEffect } from "react";
import { X, Tag as TagIcon, FileText } from "lucide-react";

const ViewNoteModal = ({ note, onClose, darkMode = false }) => {
  useEffect(() => {
    if (!note) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [note, onClose]);

  if (!note) return null;

  const theme = darkMode
    ? {
        modal: "bg-[#292720] border-[#49463D] text-[#F6F2E9]",
        header: "border-[#49463D]",
        title: "text-[#D5DFC9]",
        content: "text-[#D6D0C4]",
        muted: "text-[#B5AE9F]",
        tag: "bg-[#41483A] text-[#D5DFC9] border-[#5C6E4E]/50",
        footer: "border-[#49463D] bg-[#302F27]",
        close: "bg-[#5C6E4E] text-white hover:bg-[#4B5C3F]",
        iconButton: "text-[#B5AE9F] hover:bg-[#414035] hover:text-[#F6F2E9]",
      }
    : {
        modal: "bg-[#FDFBF6] border-[#E7E0D4] text-[#292720]",
        header: "border-[#E7E0D4]",
        title: "text-[#4B5C3F]",
        content: "text-[#5F5A50]",
        muted: "text-[#817C70]",
        tag: "bg-[#E5E9DE] text-[#4B5C3F] border-[#D7DFCE]",
        footer: "border-[#E7E0D4] bg-[#F6F2E9]",
        close: "bg-[#5C6E4E] text-white hover:bg-[#4B5C3F]",
        iconButton: "text-[#817C70] hover:bg-[#F1EDE3] hover:text-[#292720]",
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#292720]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-note-title"
        className={`relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-[#292720]/20 animate-in fade-in zoom-in-95 duration-200 ${theme.modal}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-4 border-b px-6 py-5 ${theme.header}`}>
          <div className="min-w-0">
            <div className={`mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest ${theme.muted}`}>
              <FileText size={14} />
              Note details
            </div>

            <h2
              id="view-note-title"
              className={`break-words font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl ${theme.title}`}
            >
              {note.title || "Untitled note"}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close note"
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#5C6E4E]/40 ${theme.iconButton}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Note content */}
        <div className="max-h-[65vh] flex-1 overflow-y-auto px-6 py-6">
          <div
            className={`prose prose-sm max-w-none break-words leading-7 sm:prose-base ${
              darkMode ? "prose-invert" : ""
            } ${theme.content}`}
            dangerouslySetInnerHTML={{
              __html: note.content || "",
            }}
          />

          {/* Tags */}
          {note.tags?.length > 0 && (
            <div className={`mt-8 border-t pt-5 ${theme.header}`}>
              <h3 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${theme.muted}`}>
                <TagIcon size={14} />
                Tags
              </h3>

              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${theme.tag}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {note.summary && (
            <div className={`mt-6 rounded-xl border p-4 ${
              darkMode
                ? "border-[#5C6E4E]/50 bg-[#353C30]"
                : "border-[#D7DFCE] bg-[#EEF0E8]"
            }`}>
              <h3 className={`mb-2 text-xs font-semibold uppercase tracking-widest ${
                darkMode ? "text-[#D5DFC9]" : "text-[#4B5C3F]"
              }`}>
                Summary
              </h3>
              <p className={`whitespace-pre-line break-words text-sm leading-6 ${theme.content}`}>
                {note.summary}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end border-t px-6 py-4 ${theme.footer}`}>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#5C6E4E]/40 focus:ring-offset-2 ${theme.close}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
