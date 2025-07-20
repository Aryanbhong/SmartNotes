import { useState, useEffect, useRef } from "react";
import API from "../services/API";
import RichTextEditor from "../Components/RichTextEditor";
import { saveNoteOffline } from "../utils/OfflineNotes";
import toast from "react-hot-toast";

const AddEditNoteModal = ({
  note,
  closeModal,
  refreshNotes,
  userId,
  darkMode = false,
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState((note?.tags || []).join(", "));
  const [pinned, setPinned] = useState(Boolean(note?.pinned));
  const [favorite, setFavorite] = useState(Boolean(note?.favorite));
  const [loading, setLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [tagLoading, setTagLoading] = useState(false);



  const notePreviewRef = useRef(null);

  
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags((note.tags || []).join(", "));
      setPinned(Boolean(note.pinned));
      setFavorite(Boolean(note.favorite));
    } else {
      setTitle("");
      setContent("");
      setTags("");
      setPinned(false);
      setFavorite(false);
    }
  }, [note]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      userId,
      title,
      content,
      tags: parsedTags,
      pinned,
      favorite,
      createdAt: new Date().toISOString(),
    };

    try {
      if (!navigator.onLine) {
        await saveNoteOffline(payload);
        toast.success("Saved offline. Will sync later.");
        refreshNotes();
        closeModal();
        return;
      }

      if (note?.id) {
        await API.put(`/notes/${note.id}`, payload);
      } else {
        await API.post("/notes", payload);
      }

      toast.success("Note saved!");
      refreshNotes();
      closeModal();
    } catch (err) {
      console.error("Failed to save note:", err.message);
      toast.error("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  
  const generateShareLink = async () => {
    if (!note?.id) {
      toast.error("Please save the note first before sharing.");
      return;
    }
    try {
      setShareLoading(true);
      const res = await API.post(`/notes/${note.id}/share`);;
      const link = `${window.location.origin}/share/${res.data.shareId}`;
      setShareLink(link);
      await navigator.clipboard.writeText(link);
      toast.success("Share link copied!");
    } catch (err) {
      console.error("Failed to generate share link:", err.message);
      toast.error("Couldn't generate share link.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleSuggestTags = async () => {
     if (!content.trim()) return alert("Please enter content for AI to analyze.");
     try {
       setTagLoading(true);
       const endpoint = note?.id
         ? `/notes/${note.id}/suggest-tags`
        : `/notes/suggest-tags`;

       const res = await API.post(endpoint, { content });
       if (res.data?.tags?.length) {
         setTags(res.data.tags.join(", "));
       }
     } catch (err) {
       console.error("Failed to suggest tags:", err.message);
       alert("Couldn't generate tags. Try again.");
     } finally {
      setTagLoading(false);
     }
   };

  const panelClasses = darkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-white text-gray-900";

  const inputClasses = darkMode
    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  const checkboxLabelText = darkMode ? "text-gray-200" : "text-gray-700";


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      {/* Modal shell */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-lg shadow-lg transition-colors max-h-[90vh] flex flex-col ${panelClasses}`}
      >
        {/* Title */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-2xl font-bold">
            {note?.id ? "Edit Note" : "Add Note"}
          </h2>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 pb-4 space-y-4"
        >
          {/* Wrap preview area for PDF */}
          <div ref={notePreviewRef}>
            {/* Title */}
            <div id="note-preview" >
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 rounded border focus:outline-none focus:ring ${inputClasses}`}
                placeholder="Enter a title..."
                required
              />
            </div>

            {/* Rich Text Content */}
            <div id="note-preview" >
              <label className="block text-sm font-medium mb-1">Content</label>
              <RichTextEditor
                content={content}
                setContent={setContent}
                darkMode={darkMode}
              />
            </div>

            {/* Tags */}
             <div id="note-preview" >
            <label className=" text-sm font-medium mb-1 flex justify-between items-center">
               <span>Tags (comma separated)</span>
               <button
                 type="button"
                className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  onClick={handleSuggestTags}
                   disabled={tagLoading}
                 >
                   {tagLoading ? "Generating..." : "Suggest Tags (AI)"}
                 </button>
               </label>
              <input
                               type="text"
                 value={tags}
                 onChange={(e) => setTags(e.target.value)}
                className={`w-full p-2 sm:p-3 rounded border focus:outline-none focus:ring ${inputClasses}`}
                 placeholder="work, college, ideas"
              />             </div>

            {/* Flags */}
            <div className="flex items-center gap-6 mt-2">
              <label
                className={`flex items-center gap-2 cursor-pointer ${checkboxLabelText}`}
              >
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                Pinned
              </label>

              <label
                className={`flex items-center gap-2 cursor-pointer ${checkboxLabelText}`}
              >
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                />
                Favorite
              </label>
            </div>
          </div>

         
          <div className="h-4" />
        </form>

      
        <div className="px-6 py-4 border-t flex flex-wrap justify-end gap-3 text-sm
                        dark:border-gray-700 border-gray-200">
          <button
            type="button"
            onClick={generateShareLink}
            disabled={shareLoading}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {shareLoading ? "Generating..." : "Share Link"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className={`px-4 py-2 rounded border ${
              darkMode
                ? "border-gray-500 text-gray-200 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="" 
            onClick={(e) => {
            
              const formEl = e.currentTarget.closest("div[role='dialog']")?.querySelector("form");
              if (formEl) formEl.requestSubmit();
            }}
            disabled={loading}
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : note?.id ? "Save" : "Add"}
          </button>
        </div>

        
        {shareLink && (
          <div className="px-6 pb-4 pt-2 text-xs break-all text-blue-500">
            Public link: {shareLink}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditNoteModal;
