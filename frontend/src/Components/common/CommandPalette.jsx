import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  ScanLine,
  Star,
  Trash2,
  Moon,
  Sun,
  BookOpen,
  LogOut,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    notes,
    openNewNoteModal,
    setIsOcrOpen,
    setActiveTab,
    setViewingNote,
    setIsShortcutsOpen,
  } = useNotes();

  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Static actions role-mapped
  const defaultActions = [
    {
      id: "new-note",
      title: "New Note",
      category: "CREATE",
      icon: Plus,
      color: "text-[var(--accent-sage)]",
      shortcut: "⌘N",
      run: () => {
        setIsCommandPaletteOpen(false);
        openNewNoteModal();
      },
    },
    {
      id: "ocr-scan",
      title: "OCR Scan Handwritten Note",
      category: "AI",
      icon: ScanLine,
      color: "text-[var(--accent-gold)]",
      shortcut: "⌘U",
      run: () => {
        setIsCommandPaletteOpen(false);
        setIsOcrOpen(true);
      },
    },
    {
      id: "all-notes",
      title: "All Notes",
      category: "NAVIGATE",
      icon: BookOpen,
      color: "text-[var(--text-secondary)]",
      run: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab("all");
        navigate("/notes");
      },
    },
    {
      id: "favorites",
      title: "Favorites",
      category: "NAVIGATE",
      icon: Star,
      color: "text-[var(--accent-peach)]",
      run: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab("favorites");
        navigate("/notes");
      },
    },
    {
      id: "trash",
      title: "Trash & Deleted",
      category: "NAVIGATE",
      icon: Trash2,
      color: "text-[var(--color-destructive)]",
      run: () => {
        setIsCommandPaletteOpen(false);
        setActiveTab("trash");
        navigate("/notes");
      },
    },
    {
      id: "theme",
      title: isDarkMode ? "Switch to Paper (Light Mode)" : "Switch to Evening (Dark Mode)",
      category: "PREFERENCE",
      icon: isDarkMode ? Sun : Moon,
      color: "text-[var(--accent-sage)]",
      run: () => {
        toggleTheme();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      category: "HELP",
      icon: Command,
      color: "text-[var(--text-muted)]",
      shortcut: "⌘/",
      run: () => {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(true);
      },
    },
    {
      id: "logout",
      title: "Sign out",
      category: "ACCOUNT",
      icon: LogOut,
      color: "text-[var(--color-destructive)]",
      run: () => {
        setIsCommandPaletteOpen(false);
        logout();
        navigate("/login");
      },
    },
  ];

  const matchedNotes = query.trim()
    ? notes
        .filter(
          (n) =>
            (n.title && n.title.toLowerCase().includes(query.toLowerCase())) ||
            (n.content && n.content.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
        .map((n) => ({
          id: `note-${n.id}`,
          title: n.title || "Untitled Note",
          subtitle: n.content ? n.content.replace(/<[^>]*>?/gm, " ").slice(0, 50) : "",
          category: "NOTE",
          icon: BookOpen,
          color: "text-[var(--text-secondary)]",
          run: () => {
            setIsCommandPaletteOpen(false);
            setViewingNote(n);
          },
        }))
    : [];

  const filteredActions = query.trim()
    ? defaultActions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : defaultActions;

  const allItems = [...matchedNotes, ...filteredActions];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].run();
      }
    } else if (e.key === "Escape") {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="relative flex items-center px-5 py-4 border-b border-[var(--border-subtle)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, jump to folders, trigger actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-faint)] text-sm font-sans outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface-raised)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
              NO MATCHING COMMANDS
            </div>
          ) : (
            allItems.map((item, index) => {
              const IconComponent = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.run}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl cursor-pointer transition ${
                    isSelected
                      ? "bg-[var(--bg-surface-hover)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComponent className={`w-4 h-4 shrink-0 ${item.color}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium font-sans truncate">
                        {item.title}
                      </p>
                      {item.subtitle ? (
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {item.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)]">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-raised)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[var(--bg-surface-raised)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span>↑↓ NAVIGATE</span>
            <span>↵ SELECT</span>
          </div>
          <span>SMARTNOTES COMMAND</span>
        </div>
      </div>
    </div>
  );
};
