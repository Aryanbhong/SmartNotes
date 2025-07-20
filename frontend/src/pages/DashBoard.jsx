

// import { useEffect, useState, useMemo } from "react";
// import API from "../services/API";
// import AddEditNoteModal from "../components/AddEditNoteModal";
// import NoteCard from "../Components/NoteCard";
// import OCRUpload from "../Components/OCRUpload";


// import { Grid, List as ListIcon, Moon, Sun, Plus } from "lucide-react";
// import { getOfflineNotes, clearOfflineNotes } from "../utils/OfflineNotes";

// const Dashboard = () => {
//   const [notes, setNotes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [showModal, setShowModal] = useState(false);
//   const [editingNote, setEditingNote] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [syncStatus, setSyncStatus] = useState("All Synced");
//   const [loadingSummaryId, setLoadingSummaryId] = useState(null); // NEW
//   const [viewMode, setViewMode] = useState("grid");

//   const userId = 1; // Replace with real user ID

//   // Fetch notes with offline support
//   const fetchNotes = async () => {
//     try {
//       let fetchedNotes = [];

//       if (navigator.onLine) {
//         setSyncStatus("Syncing...");
//         const res = await API.get(
//           `/notes?userId=${userId}&search=${search}&tag=${selectedTag}`
//         );
//         fetchedNotes = res.data.notes;

//         // Sync any offline notes
//         const offlineNotes = await getOfflineNotes();
//         if (offlineNotes.length > 0) {
//           for (let note of offlineNotes) {
//             await API.post("/notes", note);
//           }
//           await clearOfflineNotes();
//         }
//         setSyncStatus("All Synced");
//       } else {
//         setSyncStatus("Offline");
//         fetchedNotes = await getOfflineNotes();
//       }

//       // Sorting
//       if (sortOrder === "asc") {
//         fetchedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       } else if (sortOrder === "desc") {
//         fetchedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       } else if (sortOrder === "title") {
//         fetchedNotes.sort((a, b) => a.title.localeCompare(b.title));
//       }

//       setNotes(fetchedNotes);
//     } catch (err) {
//       console.error("Failed to fetch notes:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, selectedTag, sortOrder]);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this note?")) {
//       await API.delete(`/notes/${id}`);
//       fetchNotes();
//     }
//   };

//   const handleTogglePin = async (note) => {
//     try {
//       const res = await API.patch(`/notes/${note.id}/pin`);
//       const updated = res.data.note;
//       setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
//     } catch (err) {
//       console.error("Failed to toggle pin:", err.message);
//     }
//   };

//   const handleToggleFavorite = async (note) => {
//     try {
//       const res = await API.patch(`/notes/${note.id}/favorite`);
//       const updatedNote = res.data.note;
//       setNotes((prevNotes) =>
//         prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
//       );
//     } catch (err) {
//       console.error("Failed to toggle favorite:", err.message);
//     }
//   };

//   // NEW: AI Summarize
//   const handleSummarize = async (note) => {
//     if (!navigator.onLine) {
//       alert("You're offline. Summarization requires an internet connection.");
//       return;
//     }
//     try {
//       setLoadingSummaryId(note.id);
//       const { data } = await API.post(`/notes/${note.id}/summary`);
//       setNotes((prev) =>
//         prev.map((n) =>
//           n.id === note.id ? { ...n, summary: data.summary } : n
//         )
//       );
//     } catch (err) {
//       console.error("Failed to summarize:", err.message);
//       alert("Failed to summarize this note.");
//     } finally {
//       setLoadingSummaryId(null);
//     }
//   };

//   const favoriteNotes = notes.filter((note) => note.favorite);
//   const pinnedNotes = notes.filter((note) => note.pinned && !note.favorite);
//   const otherNotes = notes.filter((note) => !note.pinned && !note.favorite);

//   const allTags = useMemo(
//     () => [...new Set(notes.flatMap((note) => note.tags || []))],
//     [notes]
//   );

//   const noteLayoutClasses =
//     viewMode === "grid"
//       ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
//       : "flex flex-col gap-4";

//   return (
//     <div
//       className={`min-h-screen p-6 transition-colors ${
//         darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 select-none">
//             SmartNotes
//           </h1>

//           <div className="flex items-center gap-3">
//             <span
//               className={`px-2 py-1 rounded text-xs ${
//                 syncStatus === "Offline"
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {syncStatus}
//             </span>

//             <button
//               type="button"
//               aria-pressed={darkMode}
//               className={`flex items-center gap-1 px-3 py-2 rounded shadow transition ${
//                 darkMode
//                   ? "bg-yellow-500 text-white hover:bg-yellow-600"
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? (
//                 <>
//                   <Sun size={16} /> Light
//                 </>
//               ) : (
//                 <>
//                   <Moon size={16} /> Dark
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//               onClick={() => {
//                 setEditingNote(null);
//                 setShowModal(true);
//               }}
//             >
//               <Plus size={18} /> Add Note
//             </button>
//               <OCRUpload
//               onExtractedText={(text) => {
//                 setEditingNote({ title: "OCR Note", content: text });
//                 setShowModal(true);
//               }}
//             />
//           </div>
//         </div>

//         {/* Search / Sort / View Toggle */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//           <input
//             id="dashboard-search"
//             type="text"
//             placeholder="Search notes..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className={`w-full sm:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               darkMode
//                 ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
//                 : "bg-white placeholder-gray-500"
//             }`}
//           />

//           <div className="flex items-center gap-2">
//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className={`p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 darkMode
//                   ? "bg-gray-800 text-gray-100 border-gray-700"
//                   : "bg-white"
//               }`}
//             >
//               <option value="desc">Newest First</option>
//               <option value="asc">Oldest First</option>
//               <option value="title">Sort by Title</option>
//             </select>

//             {/* View Toggle */}
//             <div className="flex items-center gap-1" role="group" aria-label="View mode">
//               <button
//                 type="button"
//                 aria-pressed={viewMode === "grid"}
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded border transition ${
//                   viewMode === "grid"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : darkMode
//                     ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
//                     : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
//                 }`}
//                 title="Grid view"
//               >
//                 <Grid size={16} />
//               </button>
//               <button
//                 type="button"
//                 aria-pressed={viewMode === "list"}
//                 onClick={() => setViewMode("list")}
//                 className={`p-2 rounded border transition ${
//                   viewMode === "list"
//                     ? "bg-blue-500 text-white border-blue-500"
//                     : darkMode
//                     ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
//                     : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
//                 }`}
//                 title="List view"
//               >
//                 <ListIcon size={16} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tag Filter */}
//         {allTags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             <button
//               type="button"
//               className={`px-3 py-1 rounded text-sm transition ${
//                 selectedTag === ""
//                   ? "bg-blue-500 text-white"
//                   : darkMode
//                   ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
//                   : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//               }`}
//               onClick={() => setSelectedTag("")}
//             >
//               All
//             </button>
//             {allTags.map((tag, i) => (
//               <button
//                 type="button"
//                 key={i}
//                 className={`px-3 py-1 rounded text-sm transition ${
//                   selectedTag === tag
//                     ? "bg-blue-500 text-white"
//                     : darkMode
//                     ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
//                     : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                 }`}
//                 onClick={() => setSelectedTag(tag)}
//               >
//                 #{tag}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Favorites */}
//         {favoriteNotes.length > 0 && (
//           <div className="mb-6">
//             <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
//               Favorites
//             </h2>
//             <div className={noteLayoutClasses}>
//               {favoriteNotes.map((note) => (
//                 <NoteCard
//                   key={note.id}
//                   note={note}
//                   onEdit={(n) => {
//                     setEditingNote(n);
//                     setShowModal(true);
//                   }}
//                   onDelete={handleDelete}
//                   onTogglePin={handleTogglePin}
//                   onToggleFavorite={handleToggleFavorite}
//                   onSummarize={handleSummarize} // NEW
//                   loadingSummary={loadingSummaryId === note.id}
//                   darkMode={darkMode}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Pinned Notes */}
//         {pinnedNotes.length > 0 && (
//           <div className="mb-6">
//             <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
//               Pinned
//             </h2>
//             <div className={noteLayoutClasses}>
//               {pinnedNotes.map((note) => (
//                 <NoteCard
//                   key={note.id}
//                   note={note}
//                   onEdit={(n) => {
//                     setEditingNote(n);
//                     setShowModal(true);
//                   }}
//                   onDelete={handleDelete}
//                   onTogglePin={handleTogglePin}
//                   onToggleFavorite={handleToggleFavorite}
//                   onSummarize={handleSummarize} // NEW
//                   loadingSummary={loadingSummaryId === note.id}
//                   darkMode={darkMode}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Other Notes */}
//         <div className="mb-2 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
//             Others
//           </h2>
//           <span className="text-xs text-gray-500 dark:text-gray-400">
//             {otherNotes.length} note{otherNotes.length !== 1 ? "s" : ""}
//           </span>
//         </div>
//         <div className={noteLayoutClasses}>
//           {otherNotes.length === 0 ? (
//             <p className="text-gray-500 dark:text-gray-300">No notes found.</p>
//           ) : (
//             otherNotes.map((note) => (
//               <NoteCard
//                 key={note.id}
//                 note={note}
//                 onEdit={(n) => {
//                   setEditingNote(n);
//                   setShowModal(true);
//                 }}
//                 onDelete={handleDelete}
//                 onTogglePin={handleTogglePin}
//                 onToggleFavorite={handleToggleFavorite}
//                 onSummarize={handleSummarize} // NEW
//                 loadingSummary={loadingSummaryId === note.id}
//                 darkMode={darkMode}
//               />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <AddEditNoteModal
//           note={editingNote}
//           closeModal={() => setShowModal(false)}
//           refreshNotes={fetchNotes}
//           userId={userId}
//           darkMode={darkMode}
//         />
//       )}
//     </div>
//   );
//  };
// export default Dashboard;


import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";            // NEW
import API from "../services/API";
import AddEditNoteModal from "../components/AddEditNoteModal";
import NoteCard from "../Components/NoteCard";
import OCRUpload from "../Components/OCRUpload";
import ViewNoteModal from "../Components/viewNoteModal"; 
import DeleteModal from "../Components/DeleteModal";
import { Grid, List as ListIcon, Moon, Sun, Plus, LogOut, NotebookPenIcon } from "lucide-react";  // NEW
import { getOfflineNotes, clearOfflineNotes } from "../utils/OfflineNotes";

const Dashboard = () => {
  const navigate = useNavigate();                           // NEW

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [syncStatus, setSyncStatus] = useState("All Synced");
  const [loadingSummaryId, setLoadingSummaryId] = useState(null); // NEW
  const [viewMode, setViewMode] = useState("grid");
  const [viewingNote, setViewingNote] = useState(null); // NEW STATE

  



  const userId = localStorage.getItem("userId");

  // --- Logout ---------------------------------------------------- NEW
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Clear any in-memory state if desired
    setNotes([]);
    navigate("/login");
  };
  // ---------------------------------------------------------------
  const handleViewNote = (note) => {
    setViewingNote(note);
  };

  const handleDeleteClick = (noteId) => {
  setNoteToDelete(noteId);
  setShowDeleteModal(true);
};

const confirmDelete = () => {
  handleDelete(noteToDelete); 
  setShowDeleteModal(false);
  setNoteToDelete(null);
};
  // Fetch notes with offline support
  const fetchNotes = async () => {
    try {
      let fetchedNotes = [];

      if (navigator.onLine) {
        setSyncStatus("Syncing...");
        const res = await API.get(
          `/notes?userId=${userId}&search=${search}&tag=${selectedTag}`
        );
        fetchedNotes = res.data.notes;

        // Sync any offline notes
        const offlineNotes = await getOfflineNotes();
        if (offlineNotes.length > 0) {
          for (let note of offlineNotes) {
            await API.post("/notes", note);
          }
          await clearOfflineNotes();
        }
        setSyncStatus("All Synced");
      } else {
        setSyncStatus("Offline");
        fetchedNotes = await getOfflineNotes();
      }

      // Sorting
      if (sortOrder === "asc") {
        fetchedNotes.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (sortOrder === "desc") {
        fetchedNotes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sortOrder === "title") {
        fetchedNotes.sort((a, b) => a.title.localeCompare(b.title));
      }

      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed to fetch notes:", err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  localStorage.setItem("darkMode", darkMode);
  }, [search, selectedTag, sortOrder, darkMode]);

  const handleDelete = async (id) => {
   
      await API.delete(`/notes/${id}`);
      fetchNotes();
  
  };

  const handleTogglePin = async (note) => {
    try {
      const res = await API.patch(`/notes/${note.id}/pin`);
      const updated = res.data.note;
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (err) {
      console.error("Failed to toggle pin:", err.message);
    }
  };

  const handleToggleFavorite = async (note) => {
    try {
      const res = await API.patch(`/notes/${note.id}/favorite`);
      const updatedNote = res.data.note;
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
    }
  };

  // NEW: AI Summarize
  const handleSummarize = async (note) => {
    if (!navigator.onLine) {
      alert("You're offline. Summarization requires an internet connection.");
      return;
    }
    try {
      setLoadingSummaryId(note.id);
      const { data } = await API.post(`/notes/${note.id}/summary`);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === note.id ? { ...n, summary: data.summary } : n
        )
      );
    } catch (err) {
      console.error("Failed to summarize:", err.message);
      alert("Failed to summarize this note.");
    } finally {
      setLoadingSummaryId(null);
    }
  };

  const favoriteNotes = notes.filter((note) => note.favorite);
  const pinnedNotes = notes.filter((note) => note.pinned && !note.favorite);
  const otherNotes = notes.filter((note) => !note.pinned && !note.favorite);

  const allTags = useMemo(
    () => [...new Set(notes.flatMap((note) => note.tags || []))],
    [notes]
  );

  const noteLayoutClasses =
    viewMode === "grid"
      ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "flex flex-col gap-4";

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        
<h1
  className={`
    text-4xl sm:text-5xl font-extrabold select-none tracking-tight
    ${darkMode ? "text-gray-100" : "text-gray-900"}
  `}
>
  <span
    className={`border-b-4 pb-1 ${
      darkMode ? "border-blue-400" : "border-blue-500"
    }`}
  >
    SmartNotes
  </span>
</h1>
 <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
           
            <span
              className={`px-2 py-1 rounded text-xs ${
                syncStatus === "Offline"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {syncStatus}
            </span>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              aria-pressed={darkMode}
              className={`flex items-center gap-1 px-3 py-2 rounded shadow transition ${
                darkMode
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <>
                  <Sun size={16} /> Light
                </>
              ) : (
                <>
                  <Moon size={16} /> Dark
                </>
              )}
            </button>

            {/* Add Note */}
            <button
              type="button"
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              onClick={() => {
                setEditingNote(null);
                setShowModal(true);
              }}
            >
              <Plus size={18} /> Add Note
            </button>

            {/* OCR Upload */}
            <OCRUpload
              onExtractedText={(text) => {
                setEditingNote({ title: "OCR Note", content: text });
                setShowModal(true);
              }}
            />

            {/* Logout ------------------------------------------------- NEW */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded shadow hover:bg-red-700"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            {/* ------------------------------------------------------- */}
          </div>
        </div>

        {/* Search / Sort / View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full sm:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
                : "bg-white placeholder-gray-800"
            }`}
          />

          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-gray-800 text-gray-100 border-gray-700"
                  : "bg-white"
              }`}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* View Toggle */}
            <div
              className="flex items-center gap-1"
              role="group"
              aria-label="View mode"
            >
              <button
                type="button"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded border transition ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white border-blue-500"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded border transition ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white border-blue-500"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                }`}
                title="List view"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              className={`px-3 py-1 rounded text-sm transition ${
                selectedTag === ""
                  ? "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTag("")}
            >
              All
            </button>
            {allTags.map((tag, i) => (
              <button
                type="button"
                key={i}
                className={`px-3 py-1 rounded text-sm transition ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Favorites */}
        {favoriteNotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-600 mb-2">
              Favorites
            </h2>
            <div className={noteLayoutClasses}>
              {favoriteNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => {
                    setEditingNote(n);
                    setShowModal(true);
                  }}
                  onDelete={handleDeleteClick}
                  onTogglePin={handleTogglePin}
                  onToggleFavorite={handleToggleFavorite}
                  onSummarize={handleSummarize} // NEW
                  loadingSummary={loadingSummaryId === note.id}
                  onView={handleViewNote}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-600 mb-2">
              Pinned
            </h2>
            <div className={noteLayoutClasses}>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => {
                    setEditingNote(n);
                    setShowModal(true);
                  }}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                  onToggleFavorite={handleToggleFavorite}
                  onSummarize={handleSummarize} // NEW
                  loadingSummary={loadingSummaryId === note.id}
                   onView={handleViewNote}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Notes */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-600">
            Others
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {otherNotes.length} note{otherNotes.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className={noteLayoutClasses}>
          {otherNotes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No notes found.</p>
          ) : (
            otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(n) => {
                  setEditingNote(n);
                  setShowModal(true);
                }}
                onDelete={handleDeleteClick}
                onTogglePin={handleTogglePin}
                onToggleFavorite={handleToggleFavorite}
                onSummarize={handleSummarize} // NEW
                loadingSummary={loadingSummaryId === note.id}
                 onView={handleViewNote}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddEditNoteModal
          note={editingNote}
          closeModal={() => setShowModal(false)}
          refreshNotes={fetchNotes}
          userId={localStorage.getItem("userId")}
          darkMode={darkMode}
        />
      )}

      {viewingNote && (
        <ViewNoteModal
          note={viewingNote}
          darkMode={darkMode}
          onClose={() => setViewingNote(null)}
        />
      )}
      <DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDelete}
/>
    </div>
  );
};

export default Dashboard;
