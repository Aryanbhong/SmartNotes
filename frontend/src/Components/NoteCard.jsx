import { useState } from "react";
import { Pin, Star, Sparkles, Eye } from "lucide-react";

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

  const handleSummarizeClick = () => {
    if (!navigator.onLine) {
      alert("You're offline. Summarization needs an internet connection.");
      return;
    }
    onSummarize?.(note);
  };

  const toggleSummaryView = () => setShowSummary((s) => !s);

  return (
    <div
      className={`rounded-lg shadow-md transition transform hover:scale-[1.02] hover:shadow-lg border-l-4 ${
        darkMode
          ? "bg-gray-900 border-blue-400 text-gray-100"
          : "bg-white border-blue-500 text-gray-900"
      }`}
    >
    
      <div className="p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            {note.title}
            {note.pinned && (
              <span title="Pinned" aria-label="Pinned" className="text-blue-400 text-sm leading-none">
                📌
              </span>
            )}
            {note.favorite && (
              <span title="Favorite" aria-label="Favorite" className="text-yellow-400 text-sm leading-none">
                ★
              </span>
            )}
          </h2>

          {note._offline && (
            <span
              className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded"
              title="This note is saved offline and will sync when you're online."
            >
              Offline
            </span>
          )}
        </div>

    
        <div
          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 line-clamp-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </div>

    
      {note.summary && showSummary && (
        <div
          className={`mx-5 mb-3 p-3 rounded border text-sm leading-relaxed ${
            darkMode
              ? "border-blue-500/40 bg-blue-500/10 text-gray-100"
              : "border-blue-200 bg-blue-50 text-gray-800"
          }`}
        >
          <strong className="block mb-1 text-xs uppercase tracking-wide opacity-80">
            Summary
          </strong>
          <div className="whitespace-pre-line break-words">{note.summary}</div>
        </div>
      )}

     
      <div
        className={`p-4 border-t flex flex-wrap justify-between items-center gap-3 text-xs ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
      
        <div className="flex flex-wrap gap-2">
          {note.tags?.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-full font-medium ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

      
        <div className="w-full flex-nowrap flex items-center justify-end gap-2 text-[11px] sm:text-xs">
          
          <button
            onClick={() => onView?.(note)}
            className="inline-flex items-center gap-1 text-purple-500 hover:text-purple-600"
          >
            <Eye size={12} />
            View
          </button>

          
          <button
            onClick={() => onTogglePin?.(note)}
            className={`inline-flex items-center gap-1 ${
              note.pinned
                ? "text-blue-600 hover:text-blue-800"
                : "text-gray-700 hover:text-blue-500 dark:text-gray-700"
            }`}
          >
            <Pin size={12} />
            {note.pinned ? "Unpin" : "Pin"}
          </button>

          
          <button
            onClick={() => onToggleFavorite?.(note)}
            className={`inline-flex items-center gap-1 ${
              note.favorite
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-700 hover:text-yellow-500 dark:text-gray-700"
            }`}
          >
            <StarIcon active={note.favorite} />
            {note.favorite ? "Unfavorite" : "Favorite"}
          </button>

       
          {note.summary ? (
            <button
              onClick={toggleSummaryView}
              className="inline-flex items-center gap-1 text-green-500 hover:text-green-600"
            >
              <Sparkles size={12} />
              {showSummary ? "Hide" : "Summary"}
            </button>
          ) : (
            <button
              onClick={handleSummarizeClick}
              className="inline-flex items-center gap-1 text-green-500 hover:text-green-600"
            >
              <Sparkles size={12} />
              Summarize
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => onEdit(note)}
            className="text-blue-500 hover:underline font-medium"
          >
            Edit
          </button>

          {/* Delete */}
          <button
            // onClick={() => onDelete(note.id)}
             onClick={() => onDelete(note.id)}
            className="text-red-500 hover:underline font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


const StarIcon = ({ active }) => (
  <Star
    size={12}
    className={active ? "text-yellow-500" : ""}
    fill={active ? "currentColor" : "none"}
  />
);

export default NoteCard;
