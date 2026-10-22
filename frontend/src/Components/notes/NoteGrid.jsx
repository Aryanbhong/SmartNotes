import React from "react";
import {
  Grid,
  List as ListIcon,
  Folder,
  ArrowUpDown,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import NoteCard from "../NoteCard";
import { NoteListRow } from "./NoteListRow";
import {
  NoteCardSkeleton,
  EmptyState,
} from "../common/SkeletonLoader";

export const NoteGrid = () => {
  const {
    filteredNotes,
    loading,
    viewMode,
    setViewMode,
    sortOrder,
    setSortOrder,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    folders,
    setViewingNote,
    openEditNoteModal,
    deleteNoteWithUndo,
    togglePin,
    toggleFavorite,
    summarizeNote,
    setSharingNote,
    loadingSummaryId,
    openNewNoteModal,
    activeTab,
  } = useNotes();

  const filterButtonClass = (isActive) =>
    `inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
      isActive
        ? "border-[#4B5C3F] bg-[#4B5C3F] text-[#FDFBF6] shadow-sm"
        : "border-[#E7E0D4] bg-[#FDFBF6] text-[#817C70] hover:border-[#C4CCB9] hover:bg-[#E5E9DE] hover:text-[#4B5C3F]"
    }`;

  return (
    <div className="space-y-5">
      {/* Filters and controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E7E0D4] bg-[#FDFBF6] p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {/* Folder filters */}
        <div className="scrollbar-none flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedFolder("All")}
            className={filterButtonClass(selectedFolder === "All")}
          >
            All notebooks
          </button>

          {folders.map((folder) => (
            <button
              key={folder}
              type="button"
              onClick={() => setSelectedFolder(folder)}
              className={filterButtonClass(selectedFolder === folder)}
            >
              <Folder
                className={`h-3.5 w-3.5 shrink-0 ${
                  selectedFolder === folder
                    ? "text-[#DCE4D3]"
                    : "text-[#7D8D6D]"
                }`}
              />
              {folder}
            </button>
          ))}
        </div>

        {/* Sorting and view controls */}
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex items-center gap-2 rounded-xl border border-[#E7E0D4] bg-[#F6F2E9] px-2.5 py-2 text-xs text-[#817C70]">
            <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-[#5C6E4E]" />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort notes"
              className="max-w-[130px] cursor-pointer bg-transparent font-medium text-[#5B584F] outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          <div
            className="flex items-center gap-1 rounded-xl border border-[#E7E0D4] bg-[#F1EDE3] p-1"
            aria-label="Note view mode"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#FDFBF6] text-[#4B5C3F] shadow-sm"
                  : "text-[#A09A8D] hover:text-[#4B5C3F]"
              }`}
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#FDFBF6] text-[#4B5C3F] shadow-sm"
                  : "text-[#A09A8D] hover:text-[#4B5C3F]"
              }`}
              title="List view"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active tag filter */}
      {selectedTag && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-[#A09A8D]">
            Filtering by
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#D9DFD0] bg-[#E5E9DE] py-1 pl-3 pr-1.5 text-xs font-medium text-[#4B5C3F]">
            #{selectedTag}

            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className="rounded-full px-1.5 text-[#817C70] transition-colors hover:bg-white/70 hover:text-[#B65F43]"
              aria-label={`Clear tag filter ${selectedTag}`}
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <NoteCardSkeleton key={item} />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty state */
        <EmptyState
          title={
            activeTab === "favorites"
              ? "No favorite notes yet"
              : activeTab === "trash"
              ? "Trash is empty"
              : "No notes match your filters"
          }
          description={
            activeTab === "favorites"
              ? "Click the star on any note to keep it close at hand."
              : activeTab === "trash"
              ? "Items removed from notes will appear here temporarily."
              : "Try clearing your tag or search filters, or create a brand new note."
          }
          actionLabel={activeTab !== "trash" ? "Create Note" : null}
          onAction={openNewNoteModal}
        />
      ) : viewMode === "grid" ? (
        /* Grid view */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onView={setViewingNote}
              onEdit={openEditNoteModal}
              onDelete={deleteNoteWithUndo}
              onTogglePin={togglePin}
              onToggleFavorite={toggleFavorite}
              onSummarize={summarizeNote}
              onShare={setSharingNote}
              loadingSummary={loadingSummaryId === note.id}
              onTagClick={(tag) => setSelectedTag(tag)}
            />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2.5">
          {filteredNotes.map((note) => (
            <NoteListRow
              key={note.id}
              note={note}
              onView={setViewingNote}
              onEdit={openEditNoteModal}
              onDelete={deleteNoteWithUndo}
              onTogglePin={togglePin}
              onToggleFavorite={toggleFavorite}
              onSummarize={summarizeNote}
              onShare={setSharingNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
