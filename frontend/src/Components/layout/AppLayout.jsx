import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "../common/CommandPalette";
import { ShortcutsModal } from "../common/ShortcutsModal";
import { SettingsModal } from "../common/SettingsModal";
import { NoteEditorModal } from "../notes/NoteEditorModal";
import { ViewNoteModal } from "../notes/ViewNoteModal";
import { ShareModal } from "../notes/ShareModal";
import { OCRScannerModal } from "../ocr/OCRScannerModal";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { useNotes } from "../../context/NotesContext";

export const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    openNewNoteModal,
    setIsOcrOpen,
    setIsShortcutsOpen,
    isEditorOpen,
    setIsEditorOpen,
    viewingNote,
    setViewingNote,
    sharingNote,
    setSharingNote,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useNotes();

  // Register global shortcuts
  useKeyboardShortcut([
    {
      key: "k",
      ctrlOrCmd: true,
      handler: () => setIsCommandPaletteOpen((prev) => !prev),
    },
    {
      key: "n",
      ctrlOrCmd: true,
      handler: () => openNewNoteModal(),
    },
    {
      key: "u",
      ctrlOrCmd: true,
      handler: () => setIsOcrOpen((prev) => !prev),
    },
    {
      key: "/",
      ctrlOrCmd: true,
      handler: () => setIsShortcutsOpen((prev) => !prev),
    },
    {
      key: "Escape",
      ctrlOrCmd: false,
      handler: () => {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        else if (isEditorOpen) setIsEditorOpen(false);
        else if (viewingNote) setViewingNote(null);
        else if (sharingNote) setSharingNote(null);
        else if (isSettingsOpen) setIsSettingsOpen(false);
      },
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#F6F2E9] text-[#292720] transition-colors duration-200">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() =>
          setIsSidebarCollapsed((prev) => !prev)
        }
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={() =>
            setIsSidebarCollapsed((prev) => !prev)
          }
          toggleMobileMenu={() =>
            setIsMobileMenuOpen((prev) => !prev)
          }
        />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-9 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

        {/* Subtle footer accent */}
        <div className="hidden px-8 pb-5 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-[#E7E0D4]/80 pt-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A39B8D]">
              SmartNotes
            </span>
            <span className="flex items-center gap-2 text-[10px] text-[#817C70]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8C9B78]" />
              A little space for your ideas
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <CommandPalette />
      <NoteEditorModal />
      <ViewNoteModal />
      <ShareModal />
      <OCRScannerModal />
      <ShortcutsModal />
      <SettingsModal />
    </div>
  );
};
