
import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Sparkles,
  Pin,
  Star,
  Share2,
  Tag,
  Check,
  Loader2,
} from "lucide-react";
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

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags((note?.tags || []).join(", "));
    setPinned(Boolean(note?.pinned));
    setFavorite(Boolean(note?.favorite));
    setShareLink("");
  }, [note]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading && !shareLoading) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, loading, shareLoading]);

  const panelClasses = darkMode
    ? "bg-[#292B25] text-[#F6F2E9] border-[#45483D]"
    : "bg-[#FDFBF6] text-[#292720] border-[#E7E0D4]";

  const inputClasses = darkMode
    ? "bg-[#35372F] border-[#55594B] text-[#F6F2E9] placeholder-[#A49B8B] focus:border-[#8C9B7D] focus:ring-[#5C6E4E]/20"
    : "bg-[#FDFBF6] border-[#E7E0D4] text-[#292720] placeholder-[#A49B8B] focus:border-[#9EAD8F] focus:ring-[#5C6E4E]/15";

  const mutedText = darkMode ? "text-[#C0BBAE]" : "text-[#817C70]";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const parsedTags = [
      ...new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ];

    const payload = {
      userId,
      title: title.trim(),
      content,
      tags: parsedTags,
      pinned,
      favorite,
      createdAt: note?.createdAt || new Date().toISOString(),
    };

    try {
      if (!navigator.onLine) {
        await saveNoteOffline(payload);
        toast.success("Saved offline. Will sync later.");
        await refreshNotes();
        closeModal();
        return;
      }

      if (note?.id) {
        await API.put(`/notes/${note.id}`, payload);
      } else {
        await API.post("/notes", payload);
      }

      toast.success("Note saved!");
      await refreshNotes();
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

    if (shareLoading) return;

    try {
      setShareLoading(true);

      const res = await API.post(`/notes/${note.id}/share`);
      const link = `${window.location.origin}/share/${res.data.shareId}`;

      setShareLink(link);

      try {
        await navigator.clipboard.writeText(link);
        toast.success("Share link copied!");
      } catch {
        toast.success("Share link generated. Copy it from below.");
      }
    } catch (err) {
      console.error("Failed to generate share link:", err.message);
      toast.error("Couldn't generate share link.");
    } finally {
      setShareLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!content.trim()) {
      toast.error("Please enter content for AI to analyze.");
      return;
    }

    if (tagLoading) return;

    try {
      setTagLoading(true);

      const endpoint = note?.id
        ? `/notes/${note.id}/suggest-tags`
        : "/notes/suggest-tags";

      const res = await API.post(endpoint, { content });

      if (res.data?.tags?.length) {
        setTags(res.data.tags.join(", "));
        toast.success("Tags suggested!");
      } else {
        toast.error("No tags were suggested. Try adding more content.");
      }
    } catch (err) {
      console.error("Failed to suggest tags:", err.message);
      toast.error("Couldn't generate tags. Try again.");
    } finally {
      setTagLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292720]/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) closeModal();
      }}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[92vh] rounded-3xl border shadow-[0_24px_80px_rgba(41,39,32,0.2)] flex flex-col overflow-hidden ${panelClasses}`}
      >
        {/* Header */}
        <div
          className={`px-5 sm:px-7 py-5 border-b flex items-center justify-between gap-4 ${
            darkMode
              ? "border-[#45483D] bg-[#303229]"
              : "border-[#E7E0D4] bg-[#F6F2E9]/80"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-[#424737] text-[#C7D0BD]"
                  : "bg-[#E5E9DE] text-[#5C6E4E]"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="note-modal-title"
                className="text-xl sm:text-2xl font-bold font-display tracking-tight"
              >
                {note?.id ? "Edit Note" : "Create a Note"}
              </h2>
              <p className={`text-xs mt-1 ${mutedText}`}>
                {note?.id
                  ? "Refine your thoughts and keep them organized."
                  : "Capture an idea before it slips away."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            aria-label="Close note editor"
            className={`p-2 rounded-xl transition disabled:opacity-40 ${
              darkMode
                ? "text-[#A49B8B] hover:bg-[#45483D] hover:text-[#F6F2E9]"
                : "text-[#A49B8B] hover:bg-[#E7E0D4] hover:text-[#292720]"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          id="add-edit-note-form"
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 py-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="note-title"
              className="block text-sm font-semibold mb-2"
            >
              Note title
            </label>

            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-4 transition ${inputClasses}`}
              placeholder="Give your thoughts a title..."
              required
              maxLength={200}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label className="text-sm font-semibold">Your content</label>
              <span className={`text-[11px] ${mutedText}`}>
                Write freely. Organize later.
              </span>
            </div>

            <div
              className={`rounded-2xl border overflow-hidden ${
                darkMode ? "border-[#55594B]" : "border-[#E7E0D4]"
              }`}
            >
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your notes..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <label
                htmlFor="note-tags"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Tag className="w-4 h-4 text-[#5C6E4E]" />
                Tags
              </label>

              <button
                type="button"
                onClick={handleSuggestTags}
                disabled={tagLoading || !content.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F4EBDD] text-[#8D6826] border border-[#E9D9B9] hover:bg-[#EFE2C9] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tagLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {tagLoading ? "Generating..." : "Suggest Tags with AI"}
              </button>
            </div>

            <input
              id="note-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-4 transition ${inputClasses}`}
              placeholder="college, ideas, revision"
            />

            <p className={`mt-2 text-[11px] ${mutedText}`}>
              Separate tags with commas to keep your notes searchable.
            </p>

            {tags.trim() && (
              <div className="flex flex-wrap gap-2 mt-3">
                {[...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))].map(
                  (tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`px-2.5 py-1 rounded-full text-xs border ${
                        darkMode
                          ? "bg-[#383A2E] text-[#D5DDCC] border-[#626C50]"
                          : "bg-[#E5E9DE] text-[#4B5C3F] border-[#D5DDCC]"
                      }`}
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Note options */}
          <div
            className={`p-4 rounded-2xl border ${
              darkMode
                ? "bg-[#303229] border-[#45483D]"
                : "bg-[#F6F2E9] border-[#E7E0D4]"
            }`}
          >
            <p className="text-xs font-semibold mb-3">Note preferences</p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <label
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition ${
                  pinned
                    ? darkMode
                      ? "bg-[#424737] border-[#626C50] text-[#D5DDCC]"
                      : "bg-[#E5E9DE] border-[#C7D0BD] text-[#4B5C3F]"
                    : darkMode
                      ? "border-[#45483D] hover:bg-[#383A2E]"
                      : "border-[#E7E0D4] hover:bg-[#FDFBF6]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="accent-[#5C6E4E]"
                />
                <Pin className="w-4 h-4" />
                <span className="text-sm font-medium">Pinned</span>
              </label>

              <label
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition ${
                  favorite
                    ? darkMode
                      ? "bg-[#49402D] border-[#897143] text-[#E6C78A]"
                      : "bg-[#F4EBDD] border-[#E9D9B9] text-[#8D6826]"
                    : darkMode
                      ? "border-[#45483D] hover:bg-[#383A2E]"
                      : "border-[#E7E0D4] hover:bg-[#FDFBF6]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  className="accent-[#B8842A]"
                />
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Favorite</span>
              </label>
            </div>
          </div>

          {/* Existing note sharing */}
          {note?.id && (
            <div
              className={`p-4 rounded-2xl border ${
                darkMode
                  ? "border-[#45483D] bg-[#303229]"
                  : "border-[#E7E0D4] bg-[#FDFBF6]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E5E9DE] text-[#5C6E4E] flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Share this note</p>
                  <p className={`text-xs mt-1 ${mutedText}`}>
                    Generate a link to share your saved note.
                  </p>

                  {shareLink && (
                    <div className="mt-3">
                      <input
                        type="text"
                        readOnly
                        value={shareLink}
                        onFocus={(e) => e.target.select()}
                        aria-label="Generated share link"
                        className={`w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none ${inputClasses}`}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={generateShareLink}
                    disabled={shareLoading}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#E5E9DE] text-[#4B5C3F] hover:bg-[#D9E1D0] transition disabled:opacity-50"
                  >
                    {shareLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    {shareLoading ? "Generating..." : "Generate Share Link"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div
          className={`px-5 sm:px-7 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
            darkMode
              ? "border-[#45483D] bg-[#303229]"
              : "border-[#E7E0D4] bg-[#F6F2E9]/80"
          }`}
        >
          <p className={`hidden sm:block text-xs ${mutedText}`}>
            {note?.id ? "Your changes stay organized." : "An idea worth keeping."}
          </p>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition disabled:opacity-50 ${
                darkMode
                  ? "border-[#55594B] text-[#E3DDCF] hover:bg-[#45483D]"
                  : "border-[#E0D8CB] text-[#655F53] hover:bg-[#E7E0D4]"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="add-edit-note-form"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C6E4E] text-[#FDFBF6] text-sm font-semibold hover:bg-[#4B5C3F] shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {loading ? "Saving..." : note?.id ? "Save Changes" : "Create Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditNoteModal;
