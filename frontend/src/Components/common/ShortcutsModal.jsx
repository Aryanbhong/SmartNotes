import React from "react";
import { X, Keyboard } from "lucide-react";
import { useNotes } from "../../context/NotesContext";

export const ShortcutsModal = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useNotes();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: "⌘K / Ctrl+K", desc: "Open Command Palette / Search" },
    { key: "⌘N / Ctrl+N", desc: "Create a new note" },
    { key: "⌘U / Ctrl+U", desc: "Open OCR Image Scanner" },
    { key: "⌘/ / Ctrl+/", desc: "Open keyboard shortcuts guide" },
    { key: "Esc", desc: "Close open dialog or modal" },
    { key: "⌘S / Ctrl+S", desc: "Save note inside editor" },
    { key: "⌘B / Ctrl+B", desc: "Bold selected text" },
    { key: "⌘I / Ctrl+I", desc: "Italicize selected text" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsShortcutsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-2xl p-6 text-[var(--text-primary)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsShortcutsOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] border border-[var(--accent-sage-border)] flex items-center justify-center">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Reference
            </span>
            <h3 className="text-xl font-serif font-normal text-[var(--text-primary)]">
              Keyboard Shortcuts
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]"
            >
              <span className="text-xs font-sans text-[var(--text-secondary)]">{sc.desc}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono font-medium rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
