import React from "react";
import { X } from "lucide-react";


const ViewNoteModal = ({ note, onClose, darkMode }) => {
  if (!note) return null;

  const paperStyle = !darkMode
    ? {
        backgroundImage:
          "repeating-linear-gradient(0deg,#ffffff 0px,#ffffff 31px,rgba(59,130,246,0.15) 32px)",
        backgroundSize: "100% 32px",
      }
    : {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border p-0 overflow-hidden
          ${darkMode ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}
        style={paperStyle}
      >
       
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 border-b
                        dark:border-gray-700 border-blue-200/40">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-blue-600 dark:text-blue-400 break-words">
            {note.title}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={22} />
          </button>
        </div>

    
        <div
          className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-8
                     text-base sm:text-lg leading-7 note-content"
        >
         
          <div
            className="prose dark:prose-invert max-w-none break-words
                       prose-headings:text-blue-600 dark:prose-headings:text-blue-400
                       prose-p:my-2 prose-li:my-1 text-gray-700"
            
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

     
          {note.tags?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide
                             text-gray-600 dark:text-gray-400">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm
                      ${darkMode ? "bg-gray-800 text-gray-200" : "bg-blue-100 text-blue-700"}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

       
        <div
          className={`px-6 py-4 text-right border-t
            ${darkMode ? "border-gray-700" : "border-blue-200/40"}`}
        >
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition transform hover:scale-105
              ${darkMode
                ? "bg-gray-700 text-gray-700 hover:bg-gray-600"
                : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNoteModal;
