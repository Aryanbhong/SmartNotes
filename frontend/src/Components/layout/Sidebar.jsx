import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Star,
  Folder,
  Tag,
  Share2,
  Trash2,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import { Badge, TwoDoLogo } from "../common/Badge";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const {
    activeTab,
    setActiveTab,
    selectedFolder,
    setSelectedFolder,
    selectedTag,
    setSelectedTag,
    folders,
    addFolder,
    allTagsWithCount,
    stats,
    trashNotes,
    setIsSettingsOpen,
  } = useNotes();

  const navigate = useNavigate();
  const location = useLocation();

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleFolderSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      badge: null,
      onClick: () => {
        setActiveTab("all");
        setSelectedFolder("All");
        setSelectedTag("");
        navigate("/dashboard");
      },
    },
    {
      id: "all",
      label: "All Notes",
      icon: BookOpen,
      path: "/notes",
      badge: stats.totalNotes,
      badgeVariant: "sage",
      onClick: () => {
        setActiveTab("all");
        setSelectedFolder("All");
        setSelectedTag("");
        navigate("/notes");
      },
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Star,
      path: "/notes?filter=favorites",
      badge: stats.favoriteCount,
      badgeVariant: "default",
      onClick: () => {
        setActiveTab("favorites");
        navigate("/notes");
      },
    },
    {
      id: "shared",
      label: "Shared Links",
      icon: Share2,
      path: "/notes?filter=shared",
      badge: null,
      badgeVariant: "peach",
      onClick: () => {
        setActiveTab("shared");
        navigate("/notes");
      },
    },
    {
      id: "trash",
      label: "Trash",
      icon: Trash2,
      path: "/notes?filter=trash",
      badge: trashNotes.length > 0 ? trashNotes.length : null,
      badgeVariant: "danger",
      onClick: () => {
        setActiveTab("trash");
        navigate("/notes");
      },
    },
  ];

  const isCurrentActive = (item) => {
    if (item.id === "dashboard") return location.pathname === "/dashboard" && activeTab === "all";
    if (location.pathname === "/notes" && activeTab === item.id) return true;
    return false;
  };

  return (
    <aside
      className={`relative hidden lg:flex flex-col justify-between h-screen bg-[var(--bg-base)] border-r border-[var(--border-subtle)] select-none transition-all duration-300 z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header with Wordmark (Caveat) and TwoDo Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-subtle)]">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <TwoDoLogo size={28} />
            {!isCollapsed && (
              <span className="font-caveat text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-none pt-1">
                SmartNotes
              </span>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const active = isCurrentActive(item);
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] font-semibold border border-[var(--accent-sage-border)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComp
                    className={`w-4 h-4 shrink-0 ${
                      active
                        ? "text-[var(--accent-sage)]"
                        : item.id === "shared"
                        ? "text-[var(--accent-peach)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate font-sans">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== null && item.badge > 0 && (
                  <Badge variant={item.badgeVariant || "default"} size="xs" mono>
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Folders & Notebooks Section */}
        {!isCollapsed && (
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" /> Notebooks
              </span>
              <button
                onClick={() => setIsAddingFolder(!isAddingFolder)}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--accent-sage)] hover:bg-[var(--bg-surface-hover)] transition"
                title="Add Notebook"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {isAddingFolder && (
              <form onSubmit={handleFolderSubmit} className="mb-2">
                <input
                  type="text"
                  placeholder="Notebook name..."
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-sage)]"
                />
              </form>
            )}

            <div className="space-y-0.5 max-h-36 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedFolder("All");
                  navigate("/notes");
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium truncate flex items-center justify-between transition ${
                  selectedFolder === "All"
                    ? "bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] font-semibold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
                }`}
              >
                <span>All Notebooks</span>
              </button>
              {folders.map((folder, idx) => {
                const isSelected = selectedFolder === folder;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedFolder(folder);
                      navigate("/notes");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium truncate flex items-center gap-2 transition ${
                      isSelected
                        ? "bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        idx % 2 === 0
                          ? "bg-[var(--accent-sage)]"
                          : "bg-[var(--accent-peach)]"
                      }`}
                    />
                    <span className="truncate">{folder}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {!isCollapsed && allTagsWithCount.length > 0 && (
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Tags
              </span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag("")}
                  className="text-[10px] text-[var(--accent-sage)] hover:underline"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {allTagsWithCount.slice(0, 8).map(({ tag, count }) => {
                const isSelected = selectedTag === tag;
                return (
                  <span
                    key={tag}
                    onClick={() => {
                      setSelectedTag(isSelected ? "" : tag);
                      navigate("/notes");
                    }}
                    className={`cursor-pointer text-[11px] px-2.5 py-0.5 rounded-full font-medium transition ${
                      isSelected
                        ? "bg-[#5C6E4E] text-[#F6F2E9]"
                        : "bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-sage-border)]"
                    }`}
                  >
                    #{tag}
                    <span className="ml-1 text-[9px] font-mono opacity-70">{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Settings Button */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Settings & Appearance"
        >
          <Settings className="w-4 h-4 shrink-0 text-[var(--text-muted)]" />
          {!isCollapsed && <span className="font-sans">Settings & Theme</span>}
        </button>
      </div>
    </aside>
  );
};
