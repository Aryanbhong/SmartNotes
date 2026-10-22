import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { AppLayout } from "../components/layout/AppLayout";
import { NoteGrid } from "../Components/notes/NoteGrid";
import { Button } from "../components/common/Badge";
import {
  BookOpen,
  Star,
  Share2,
  Trash2,
  Folder,
  Plus,
} from "lucide-react";

export const NotesPage = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const {
    activeTab,
    setActiveTab,
    selectedFolder,
    selectedTag,
    filteredNotes,
    trashNotes,
    emptyTrash,
    openNewNoteModal,
  } = useNotes();

  useEffect(() => {
    if (filterParam === "favorites") setActiveTab("favorites");
    else if (filterParam === "shared") setActiveTab("shared");
    else if (filterParam === "trash") setActiveTab("trash");
  }, [filterParam, setActiveTab]);

  const getPageTitle = () => {
    if (activeTab === "favorites") return "Favorite Notes";
    if (activeTab === "shared") return "Shared Links";
    if (activeTab === "trash") return "Trash & Deleted Notes";
    if (selectedFolder !== "All") return `${selectedFolder} Notebook`;
    if (selectedTag) return `Notes tagged with #${selectedTag}`;
    return "All Study Notes";
  };

  const getPageIcon = () => {
    if (activeTab === "favorites") return Star;
    if (activeTab === "shared") return Share2;
    if (activeTab === "trash") return Trash2;
    if (selectedFolder !== "All") return Folder;
    return BookOpen;
  };

  const IconComp = getPageIcon();
  const isTrash = activeTab === "trash";

  return (
    <AppLayout>
      <div className="relative isolate space-y-7 animate-in fade-in duration-300">
        {/* Soft ambient lighting */}
        <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-64 w-64 rounded-full bg-[var(--accent-sage)]/10 blur-[100px]" />
        <div className="pointer-events-none absolute top-48 -left-16 -z-10 h-56 w-56 rounded-full bg-[var(--accent-heart)]/[0.07] blur-[90px]" />

        {/* Page heading */}
        <div className="flex flex-col gap-5 border-b border-[var(--border-subtle)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
              isTrash
                ? "border-[var(--color-destructive)]/25 bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]"
                : "border-[var(--accent-sage)]/20 bg-[var(--accent-sage)]/15 text-[var(--accent-sage)]"
            }`}>
              <IconComp className="h-5 w-5" />
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-sage)]">
                SMARTNOTES / YOUR LIBRARY
              </p>
              <h1 className="font-fraunces text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">
                {getPageTitle()}
              </h1>
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                {isTrash
                  ? `${trashNotes.length} item(s) in trash`
                  : `${filteredNotes.length} note(s) found`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:pl-4">
            {isTrash ? (
              trashNotes.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={emptyTrash}
                  icon={Trash2}
                  className="rounded-xl"
                >
                  Empty Trash
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => openNewNoteModal()}
                icon={Plus}
                className="rounded-xl"
              >
                New Note
              </Button>
            )}
          </div>
        </div>

        {/* Notes remain rendered by the existing component */}
        <section className="relative">
          <NoteGrid />
        </section>
      </div>
    </AppLayout>
  );
};

export default NotesPage;
