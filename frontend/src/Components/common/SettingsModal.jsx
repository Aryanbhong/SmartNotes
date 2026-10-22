import React, { useState } from "react";
import { X, User, Moon, Sun, Monitor, RefreshCw, Trash2, Check } from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "./Badge";
import { clearOfflineNotes } from "../../utils/OfflineNotes";
import toast from "react-hot-toast";

export const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen, fetchNotes, viewMode, setViewMode } = useNotes();
  const { theme, setTheme } = useTheme();
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserProfile({ name });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    toast.success("Profile saved");
  };

  const handleClearCache = async () => {
    try {
      await clearOfflineNotes();
      localStorage.removeItem("smartnotes_trash");
      toast.success("Offline storage cleared");
    } catch {
      toast.error("Failed to clear offline storage");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSettingsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-2xl p-6 text-[var(--text-primary)] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsSettingsOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Preferences
          </span>
          <h3 className="text-2xl font-serif font-normal text-[var(--text-primary)] mt-1">
            Notebook Settings
          </h3>
        </div>

        {/* Profile */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-6 pb-6 border-b border-[var(--border-subtle)]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Author Profile
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-sage)] transition"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-[var(--text-muted)] cursor-not-allowed font-mono text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" variant="primary">
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" /> Saved
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>

        {/* Theme */}
        <div className="space-y-4 mb-6 pb-6 border-b border-[var(--border-subtle)]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            Theme (Evening / Paper)
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Evening (Dark)", icon: Moon },
              { id: "light", label: "Paper (Light)", icon: Sun },
              { id: "system", label: "System", icon: Monitor },
            ].map((t) => {
              const IconComp = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition ${
                    isActive
                      ? "border-[var(--accent-sage)] bg-[var(--accent-sage-bg)] text-[var(--accent-sage)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
                  }`}
                >
                  <IconComp className="w-4 h-4 mb-1.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-4 mb-6 pb-6 border-b border-[var(--border-subtle)]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Notes Layout
          </h4>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                viewMode === "grid"
                  ? "bg-[var(--accent-sage)] text-[var(--bg-base)] border-transparent font-semibold"
                  : "bg-[var(--bg-surface-raised)] border-[var(--border-default)] text-[var(--text-secondary)]"
              }`}
            >
              Grid Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                viewMode === "list"
                  ? "bg-[var(--accent-sage)] text-[var(--bg-base)] border-transparent font-semibold"
                  : "bg-[var(--bg-surface-raised)] border-[var(--border-default)] text-[var(--text-secondary)]"
              }`}
            >
              List Rows
            </button>
          </div>
        </div>

        {/* Sync & Storage */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Data & Offline Sync
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => {
                fetchNotes();
                toast.success("Synchronized with backend");
              }}
            >
              Force Sync Notes
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleClearCache}
            >
              Clear Offline Cache
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
