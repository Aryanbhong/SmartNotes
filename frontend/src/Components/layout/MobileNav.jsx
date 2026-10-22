import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  ScanLine,
  Menu,
  X,
  Star,
  Trash2,
  Folder,
  Tag,
  Settings,
  LogOut,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, Badge, TwoDoLogo } from "../common/Badge";

export const MobileNav = () => {
  const {
    openNewNoteModal,
    setIsOcrOpen,
    setActiveTab,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    folders,
    allTagsWithCount,
    stats,
    trashNotes,
    setIsSettingsOpen,
  } = useNotes();

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
      onClick: () => {
        setActiveTab("all");
        navigate("/dashboard");
      },
    },
    {
      id: "notes",
      label: "Notes",
      icon: BookOpen,
      active: location.pathname === "/notes",
      onClick: () => {
        setActiveTab("all");
        navigate("/notes");
      },
    },
    {
      id: "new",
      label: "New",
      icon: Plus,
      isSpecial: true,
      onClick: () => openNewNoteModal(),
    },
    {
      id: "ocr",
      label: "OCR",
      icon: ScanLine,
      onClick: () => setIsOcrOpen(true),
    },
    {
      id: "menu",
      label: "Menu",
      icon: Menu,
      onClick: () => setIsDrawerOpen(true),
    },
  ];

  const drawerButtonClass =
    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/30";

  const sectionLabelClass =
    "mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]";

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="safe-area-bottom fixed bottom-0 left-0 right-0 z-40 flex h-[68px] items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-2 shadow-lg backdrop-blur-xl lg:hidden transition-colors"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                aria-label="Create new note"
                className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)] shadow-md transition hover:opacity-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </button>
            );
          }

          const isActive = Boolean(item.active);

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-w-[52px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/30 ${
                isActive
                  ? "font-semibold text-[var(--accent-sage)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon
                className={`h-[19px] w-[19px] ${
                  isActive ? "stroke-[2.2]" : "stroke-[1.7]"
                }`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-[3px] h-1 w-1 rounded-full bg-[var(--accent-sage)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 lg:hidden"
          onClick={closeDrawer}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeDrawer();
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="flex h-full w-[85%] max-w-[340px] animate-in slide-in-from-left duration-200 flex-col justify-between overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="mb-5 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-3">
                  <TwoDoLogo size="md" />

                  <div>
                    <span className="block font-caveat text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      SmartNotes
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      A little space for your ideas
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>

              {/* User Overview */}
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5">
                <Avatar name={user?.name || "Student"} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                    {user?.name || "Student User"}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--text-muted)]">
                    {user?.email || "student@smartnotes.app"}
                  </p>
                </div>

                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-sage)]" />
              </div>

              {/* Collections */}
              <div className="mb-6">
                <p className={sectionLabelClass}>Your library</p>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("favorites");
                      closeDrawer();
                      navigate("/notes");
                    }}
                    className={drawerButtonClass}
                  >
                    <Star className="h-4 w-4 text-[var(--accent-gold)]" />
                    <span className="flex-1 text-left">Favorites</span>

                    {stats.favoriteCount > 0 && (
                      <Badge variant="gold" size="xs">
                        {stats.favoriteCount}
                      </Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("trash");
                      closeDrawer();
                      navigate("/notes");
                    }}
                    className={drawerButtonClass}
                  >
                    <Trash2 className="h-4 w-4 text-[var(--color-destructive)]" />
                    <span className="flex-1 text-left">Trash</span>

                    {trashNotes.length > 0 && (
                      <Badge variant="destructive" size="xs">
                        {trashNotes.length}
                      </Badge>
                    )}
                  </button>
                </div>
              </div>

              {/* Folders */}
              <div className="mb-6">
                <p className={sectionLabelClass}>
                  <Folder className="h-3.5 w-3.5 text-[var(--accent-sage)]" />
                  Notebooks
                </p>

                <div className="max-h-40 space-y-1 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolder("All");
                      closeDrawer();
                      navigate("/notes");
                    }}
                    className={`w-full truncate rounded-xl px-3 py-2 text-left text-xs transition ${
                      selectedFolder === "All"
                        ? "bg-[var(--accent-sage)]/15 font-semibold text-[var(--accent-sage)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    All notebooks
                  </button>

                  {folders.map((folder, index) => (
                    <button
                      key={`${folder}-${index}`}
                      type="button"
                      onClick={() => {
                        setSelectedFolder(folder);
                        closeDrawer();
                        navigate("/notes");
                      }}
                      className={`flex w-full items-center gap-2 truncate rounded-xl px-3 py-2 text-left text-xs transition ${
                        selectedFolder === folder
                          ? "bg-[var(--accent-sage)]/15 font-semibold text-[var(--accent-sage)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Folder className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{folder}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {allTagsWithCount.length > 0 && (
                <div className="mb-6">
                  <p className={sectionLabelClass}>
                    <Tag className="h-3.5 w-3.5 text-[var(--accent-sage)]" />
                    Tags
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {allTagsWithCount.slice(0, 8).map(({ tag }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTag(tag);
                          closeDrawer();
                          navigate("/notes");
                        }}
                        className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition ${
                          selectedTag === tag
                            ? "border-[var(--accent-sage)] bg-[var(--accent-sage)]/15 font-semibold text-[var(--accent-sage)]"
                            : "border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-muted)] hover:border-[var(--accent-sage)]/40 hover:text-[var(--text-primary)]"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 space-y-1 border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  setIsSettingsOpen(true);
                }}
                className={drawerButtonClass}
              >
                <Settings className="h-4 w-4 text-[var(--text-muted)]" />
                Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  logout();
                  navigate("/login");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-[var(--color-destructive)] transition hover:bg-[var(--color-destructive)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-destructive)]/30"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>

              <p className="px-3 pt-3 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                SmartNotes · Made for your thoughts
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
