
import { useState } from "react";
import { Pin, Star, Sparkles, Eye, Pencil, Trash2, CloudOff } from "lucide-react";

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onSummarize,
  onView,
  darkMode,
}) => {
  const [showSummary, setShowSummary] = useState(false);

  const safeHTML = note?.content || "";

  const theme = darkMode
    ? {
        card: "bg-[#292720] border-[#5C6E4E] text-[#F6F2E9]",
        title: "text-[#D5DFC9]",
        content: "text-[#D6D0C4]",
        footer: "border-[#49463D]",
        tag: "bg-[#41483A] text-[#D5DFC9]",
        summary: "border-[#5C6E4E] bg-[#353C30] text-[#F6F2E9]",
        muted: "text-[#B5AE9F]",
        hover: "hover:bg-[#3A382F]",
      }
    : {
        card: "bg-[#FDFBF6] border-[#5C6E4E] text-[#292720]",
        title: "text-[#4B5C3F]",
        content: "text-[#5F5A50]",
        footer: "border-[#E7E0D4]",
        tag: "bg-[#E5E9DE] text-[#4B5C3F]",
        summary: "border-[#D7DFCE] bg-[#EEF0E8] text-[#292720]",
        muted: "text-[#817C70]",
        hover: "hover:bg-[#F1EDE3]",
      };

  const handleSummarizeClick = () => {
    if (!navigator.onLine) {
      alert("You're offline. Summarization needs an internet connection.");
      return;
    }

    onSummarize?.(note);
  };

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-l-[4px] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.card} hover:border-l-[#B65F43]`}
    >
      {/* Note content */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2
            className={`min-w-0 break-words font-display text-lg font-semibold leading-snug tracking-tight ${theme.title}`}
          >
            {note.title || "Untitled note"}

            {note.pinned && (
              <Pin
                size={14}
                aria-label="Pinned"
                className="ml-2 inline-block -rotate-45 text-[#B8842A]"
                fill="currentColor"
              />
            )}

            {note.favorite && (
              <Star
                size={14}
                aria-label="Favorite"
                className="ml-1 inline-block text-[#B8842A]"
                fill="currentColor"
              />
            )}
          </h2>

          {note._offline && (
            <span
              title="This note is saved offline and will sync when you're online."
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F4EBDD] px-2.5 py-1 text-[10px] font-semibold text-[#91651F]"
            >
              <CloudOff size={11} />
              Offline
            </span>
          )}
        </div>

        <div
          className={`prose prose-sm max-w-none line-clamp-4 break-words leading-relaxed ${darkMode ? "prose-invert" : ""} ${theme.content}`}
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </div>

      {/* Summary */}
      {note.summary && showSummary && (
        <div
          className={`mx-5 mb-4 rounded-xl border p-4 text-sm leading-relaxed ${theme.summary}`}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C6E4E]">
            <Sparkles size={14} />
            Summary
          </div>

          <div className="whitespace-pre-line break-words">
            {note.summary}
          </div>
        </div>
      )}

      {/* Tags and actions */}
      <div className={`border-t px-5 py-4 ${theme.footer}`}>
        {note.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${theme.tag}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-xs">
          <ActionButton
            icon={<Eye size={14} />}
            label="View"
            onClick={() => onView?.(note)}
            className="text-[#5C6E4E] hover:text-[#4B5C3F]"
          />

          <ActionButton
            icon={
              <Pin
                size={14}
                className={note.pinned ? "-rotate-45" : ""}
                fill={note.pinned ? "currentColor" : "none"}
              />
            }
            label={note.pinned ? "Unpin" : "Pin"}
            onClick={() => onTogglePin?.(note)}
            className={
              note.pinned
                ? "text-[#B8842A]"
                : `${theme.muted} hover:text-[#B8842A]`
            }
          />

          <ActionButton
            icon={
              <Star
                size={14}
                fill={note.favorite ? "currentColor" : "none"}
              />
            }
            label={note.favorite ? "Unfavorite" : "Favorite"}
            onClick={() => onToggleFavorite?.(note)}
            className={
              note.favorite
                ? "text-[#B8842A]"
                : `${theme.muted} hover:text-[#B8842A]`
            }
          />

          {note.summary ? (
            <ActionButton
              icon={<Sparkles size={14} />}
              label={showSummary ? "Hide summary" : "Summary"}
              onClick={() => setShowSummary((value) => !value)}
              className="text-[#5C6E4E] hover:text-[#4B5C3F]"
            />
          ) : (
            <ActionButton
              icon={<Sparkles size={14} />}
              label="Summarize"
              onClick={handleSummarizeClick}
              className="text-[#5C6E4E] hover:text-[#4B5C3F]"
            />
          )}

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => onEdit?.(note)}
              aria-label={`Edit ${note.title || "note"}`}
              className="inline-flex items-center gap-1.5 font-medium text-[#5C6E4E] transition-colors hover:text-[#4B5C3F]"
            >
              <Pencil size={13} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(note.id)}
              aria-label={`Delete ${note.title || "note"}`}
              className="inline-flex items-center gap-1.5 font-medium text-[#B65F43] transition-colors hover:text-[#9E4F37]"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const ActionButton = ({ icon, label, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 whitespace-nowrap font-medium transition-colors ${className}`}
  >
    {icon}
    {label}
  </button>
);

export default NoteCard;
