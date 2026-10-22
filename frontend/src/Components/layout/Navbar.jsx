import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  ScanLine,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Command,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Button, TwoDoLogo } from "../common/Badge";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ isSidebarCollapsed, toggleSidebar, toggleMobileMenu }) => {
  const {
    openNewNoteModal,
    setIsOcrOpen,
    setIsCommandPaletteOpen,
    setIsSettingsOpen,
    setIsShortcutsOpen,
    syncStatus,
  } = useNotes();

  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--bg-base)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-200">
      {/* Left: Sidebar toggle, Wordmark with Caveat, Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Wordmark (Shown when sidebar is collapsed or on mobile) */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex lg:hidden items-center gap-2 cursor-pointer select-none"
        >
          <TwoDoLogo size={24} />
          <span className="font-caveat text-2xl font-bold text-[var(--text-primary)] leading-none pt-1">
            SmartNotes
          </span>
        </div>

        {/* Global Search Bar (Trigger for Command Palette) */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex-1 hidden sm:flex items-center justify-between px-4 py-2 rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-default)] transition cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--text-secondary)] transition" />
            <span className="text-xs font-sans text-[var(--text-muted)]">
              Search notes, tags, commands...
            </span>
          </div>
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync Status: Always paired with text label */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          <span
            className={`w-2 h-2 rounded-full ${
              syncStatus === "Offline"
                ? "bg-[var(--color-destructive)]"
                : syncStatus === "Syncing..."
                ? "bg-[var(--accent-gold)] animate-pulse"
                : "bg-[var(--accent-sage)]"
            }`}
          />
          <span className="uppercase tracking-wider text-[10px]">
            {syncStatus === "All Synced" ? "Saved" : syncStatus}
          </span>
        </div>

        {/* OCR Quick Upload Button (Gold for AI) */}
        <button
          type="button"
          onClick={() => setIsOcrOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)] hover:opacity-90 transition active:scale-95"
          title="Scan handwritten note (AI)"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-mono uppercase tracking-wider text-[11px]">
            OCR Scan
          </span>
        </button>

        {/* + New Note Button (Sage for primary brand action) */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => openNewNoteModal()}
          icon={Plus}
          className="font-medium"
        >
          <span className="hidden sm:inline">New Note</span>
        </Button>

        {/* Notifications Bell */}
        <NotificationDropdown />

        {/* Theme Toggle (Evening / Paper) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
          title={isDarkMode ? "Switch to Paper (Light Mode)" : "Switch to Evening (Dark Mode)"}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-[var(--accent-gold)] transition-transform duration-300" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--text-secondary)] transition-transform duration-300" />
          )}
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={avatarDropdownRef}>
          <button
            type="button"
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[var(--bg-surface-hover)] transition outline-none"
            aria-label="User menu"
          >
            <Avatar name={user?.name || "Student"} size="sm" />
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {isAvatarOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[var(--bg-surface)] shadow-2xl z-50 p-3 border border-[var(--border-default)] animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-[var(--border-subtle)] mb-1">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans">
                  {user?.name || "Student User"}
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                  {user?.email || "student@smartnotes.app"}
                </p>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setIsAvatarOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
                >
                  <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Author Profile
                </button>

                <button
                  onClick={() => {
                    setIsAvatarOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Notebook Settings
                </button>

                <button
                  onClick={() => {
                    setIsAvatarOpen(false);
                    setIsShortcutsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
                >
                  <Command className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Keyboard Shortcuts
                </button>
              </div>

              <div className="border-t border-[var(--border-subtle)] mt-1.5 pt-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-destructive)] hover:bg-[var(--color-destructive-bg)] transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
