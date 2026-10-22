import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import API from "../services/API";
import { getOfflineNotes, saveNoteOffline, clearOfflineNotes } from "../utils/OfflineNotes";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { isThisWeek } from "date-fns";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || localStorage.getItem("userId") || 1;

  const [notes, setNotes] = useState([]);
  const [trashNotes, setTrashNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("smartnotes_trash");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("All Synced");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'favorites' | 'shared' | 'trash' | 'folder' | 'tag'
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("smartnotes_view_mode") || "grid");
  const [loadingSummaryId, setLoadingSummaryId] = useState(null);

  // Folders / Notebooks list
  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem("smartnotes_folders");
      return saved ? JSON.parse(saved) : ["General Notes", "Computer Science", "Mathematics", "Biology", "Exam Prep"];
    } catch {
      return ["General Notes", "Computer Science", "Mathematics", "Biology", "Exam Prep"];
    }
  });

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Track stats in local storage for student dashboard
  const [ocrScansCount, setOcrScansCount] = useState(() => {
    return parseInt(localStorage.getItem("smartnotes_ocr_count") || "3", 10);
  });
  const [aiSummariesCount, setAiSummariesCount] = useState(() => {
    return parseInt(localStorage.getItem("smartnotes_ai_count") || "5", 10);
  });

  const incrementOcrCount = useCallback(() => {
    setOcrScansCount((c) => {
      const next = c + 1;
      localStorage.setItem("smartnotes_ocr_count", next.toString());
      return next;
    });
  }, []);

  const incrementAiCount = useCallback(() => {
    setAiSummariesCount((c) => {
      const next = c + 1;
      localStorage.setItem("smartnotes_ai_count", next.toString());
      return next;
    });
  }, []);

  // Save trash to local storage
  useEffect(() => {
    localStorage.setItem("smartnotes_trash", JSON.stringify(trashNotes));
  }, [trashNotes]);

  // Save folders to local storage
  useEffect(() => {
    localStorage.setItem("smartnotes_folders", JSON.stringify(folders));
  }, [folders]);

  // Save viewMode preference
  useEffect(() => {
    localStorage.setItem("smartnotes_view_mode", viewMode);
  }, [viewMode]);

  // Fetch notes with offline synchronization
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      let fetchedNotes = [];

      if (navigator.onLine) {
        setSyncStatus("Syncing...");
        try {
          const res = await API.get(`/notes?userId=${userId}&search=${encodeURIComponent(search)}&tag=${encodeURIComponent(selectedTag)}`);
          fetchedNotes = res.data?.notes || [];

          // Sync any offline notes that were stored while offline
          const offlineNotes = await getOfflineNotes();
          if (offlineNotes.length > 0) {
            for (const note of offlineNotes) {
              const { _offline, ...cleanNote } = note;
              await API.post("/notes", cleanNote);
            }
            await clearOfflineNotes();
            toast.success(`Synced ${offlineNotes.length} offline note(s)!`);
          }
          setSyncStatus("All Synced");
        } catch (apiErr) {
          console.warn("API fetch error, falling back to local:", apiErr.message);
          fetchedNotes = (await getOfflineNotes()) || [];
          setSyncStatus("Offline");
        }
      } else {
        setSyncStatus("Offline");
        fetchedNotes = (await getOfflineNotes()) || [];
      }

      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      toast.error("Could not sync notes with server");
    } finally {
      setLoading(false);
    }
  }, [userId, search, selectedTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus("Syncing...");
      fetchNotes();
    };
    const handleOffline = () => setSyncStatus("Offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchNotes]);

  // Create or Update Note
  const saveNote = async (notePayload) => {
    try {
      let savedNote;
      if (!navigator.onLine) {
        await saveNoteOffline(notePayload);
        savedNote = { ...notePayload, id: Date.now(), _offline: true };
        setNotes((prev) => [savedNote, ...prev]);
        toast.success("Saved offline. Will sync once connected!");
        return savedNote;
      }

      if (notePayload.id) {
        const res = await API.put(`/notes/${notePayload.id}`, notePayload);
        savedNote = res.data.note;
        setNotes((prev) => prev.map((n) => (n.id === savedNote.id ? savedNote : n)));
        toast.success("Note updated successfully");
      } else {
        const res = await API.post("/notes", notePayload);
        savedNote = res.data.note;
        setNotes((prev) => [savedNote, ...prev]);
        toast.success("Note created successfully");
      }
      return savedNote;
    } catch (err) {
      console.error("Save note failed:", err);
      toast.error("Failed to save note");
      throw err;
    }
  };

  // Delete note with 5-second Undo window
  const deleteNoteWithUndo = (noteId) => {
    const noteToDelete = notes.find((n) => n.id === noteId);
    if (!noteToDelete) return;

    // Immediately remove from active view & add to trash
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    setTrashNotes((prev) => [noteToDelete, ...prev]);

    let undone = false;

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>Note moved to Trash</span>
          <button
            onClick={() => {
              undone = true;
              toast.dismiss(t.id);
              // Restore note back to notes
              setNotes((prev) => [noteToDelete, ...prev]);
              setTrashNotes((prev) => prev.filter((n) => n.id !== noteId));
              toast.success("Note restored!");
            }}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000, icon: "🗑️" }
    );

    // After 5.5 seconds, if not undone, call backend delete
    setTimeout(async () => {
      if (!undone && navigator.onLine) {
        try {
          await API.delete(`/notes/${noteId}`);
        } catch (err) {
          console.error("Server delete failed:", err);
        }
      }
    }, 5500);
  };

  // Restore note from Trash
  const restoreNoteFromTrash = async (note) => {
    setTrashNotes((prev) => prev.filter((n) => n.id !== note.id));
    setNotes((prev) => [note, ...prev]);
    toast.success("Note restored from trash");
  };

  // Permanently delete from trash
  const permanentlyDeleteNote = (noteId) => {
    setTrashNotes((prev) => prev.filter((n) => n.id !== noteId));
    toast.success("Permanently removed from trash");
  };

  // Empty entire trash
  const emptyTrash = () => {
    setTrashNotes([]);
    toast.success("Trash emptied");
  };

  // Toggle Pin
  const togglePin = async (note) => {
    try {
      const res = await API.patch(`/notes/${note.id}/pin`);
      const updated = res.data.note;
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      toast.success(updated.pinned ? "Pinned note to top 📌" : "Unpinned note");
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      // Optimistic fallback
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, pinned: !n.pinned } : n))
      );
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (note) => {
    try {
      const res = await API.patch(`/notes/${note.id}/favorite`);
      const updated = res.data.note;
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      toast.success(updated.favorite ? "Added to Favorites ⭐" : "Removed from Favorites");
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, favorite: !n.favorite } : n))
      );
    }
  };

  // Summarize Note
  const summarizeNote = async (note) => {
    if (!navigator.onLine) {
      toast.error("Summarization requires an internet connection");
      return;
    }
    try {
      setLoadingSummaryId(note.id);
      const { data } = await API.post(`/notes/${note.id}/summary`);
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, summary: data.summary } : n))
      );
      incrementAiCount();
      toast.success("AI Summary generated! ✨");
    } catch (err) {
      console.error("Failed to summarize:", err);
      toast.error("Failed to summarize note. Check your API key.");
    } finally {
      setLoadingSummaryId(null);
    }
  };

  // Add folder / notebook
  const addFolder = (folderName) => {
    if (!folderName.trim()) return;
    if (folders.includes(folderName.trim())) {
      toast.error("Folder already exists");
      return;
    }
    const updated = [...folders, folderName.trim()];
    setFolders(updated);
    toast.success(`Created notebook "${folderName.trim()}" 📁`);
  };

  // Compute all unique tags with count
  const allTagsWithCount = useMemo(() => {
    const map = {};
    notes.forEach((n) => {
      (n.tags || []).forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean) map[clean] = (map[clean] || 0) + 1;
      });
    });
    return Object.entries(map).map(([tag, count]) => ({ tag, count }));
  }, [notes]);

  // Compute filtered & sorted notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by Tab
    if (activeTab === "favorites") {
      result = result.filter((n) => n.favorite);
    } else if (activeTab === "shared") {
      result = result.filter((n) => n.shareId);
    } else if (activeTab === "trash") {
      return trashNotes;
    }

    // Filter by Folder
    if (selectedFolder !== "All") {
      result = result.filter((n) => n.folder === selectedFolder);
    }

    // Filter by Tag
    if (selectedTag) {
      result = result.filter((n) => (n.tags || []).includes(selectedTag));
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(q)) ||
          (n.content && n.content.toLowerCase().includes(q)) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Pinned items stay on top
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      if (sortOrder === "asc") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortOrder === "desc") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortOrder === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [notes, trashNotes, activeTab, selectedFolder, selectedTag, search, sortOrder]);

  // Dashboard stats
  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const notesThisWeek = notes.filter((n) => {
      try {
        return isThisWeek(new Date(n.createdAt || Date.now()));
      } catch {
        return false;
      }
    }).length;
    const pinnedCount = notes.filter((n) => n.pinned).length;
    const favoriteCount = notes.filter((n) => n.favorite).length;

    return {
      totalNotes,
      notesThisWeek,
      ocrScans: ocrScansCount,
      aiSummariesUsed: aiSummariesCount,
      pinnedCount,
      favoriteCount,
    };
  }, [notes, ocrScansCount, aiSummariesCount]);

  // Helper to open editor with note
  const openNewNoteModal = (prefill = {}) => {
    setEditingNote(prefill.title || prefill.content ? prefill : null);
    setIsEditorOpen(true);
  };

  const openEditNoteModal = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        trashNotes,
        loading,
        syncStatus,
        search,
        setSearch,
        selectedTag,
        setSelectedTag,
        selectedFolder,
        setSelectedFolder,
        activeTab,
        setActiveTab,
        sortOrder,
        setSortOrder,
        viewMode,
        setViewMode,
        loadingSummaryId,
        folders,
        addFolder,
        allTagsWithCount,
        stats,
        // Actions
        fetchNotes,
        saveNote,
        deleteNoteWithUndo,
        restoreNoteFromTrash,
        permanentlyDeleteNote,
        emptyTrash,
        togglePin,
        toggleFavorite,
        summarizeNote,
        incrementOcrCount,
        incrementAiCount,
        // Modal states & openers
        isEditorOpen,
        setIsEditorOpen,
        editingNote,
        setEditingNote,
        viewingNote,
        setViewingNote,
        sharingNote,
        setSharingNote,
        isOcrOpen,
        setIsOcrOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        openNewNoteModal,
        openEditNoteModal,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

