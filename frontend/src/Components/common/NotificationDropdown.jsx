import React, { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Badge } from "./Badge";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "AI summary ready",
      desc: "Summary generated for Machine Learning Notes.",
      time: "Just now",
      role: "gold",
      unread: true,
    },
    {
      id: "n-2",
      title: "Notes synced",
      desc: "All local offline drafts safely stored in database.",
      time: "10m ago",
      role: "sage",
      unread: true,
    },
    {
      id: "n-3",
      title: "Shared link active",
      desc: "Study group can now view Biology Lecture 4.",
      time: "1h ago",
      role: "peach",
      unread: false,
    },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getRoleDot = (role) => {
    if (role === "gold") return "bg-[var(--accent-gold)]";
    if (role === "peach") return "bg-[var(--accent-peach)]";
    return "bg-[var(--accent-sage)]";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-peach)] rounded-full ring-2 ring-[var(--bg-base)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[var(--bg-surface)] shadow-xl z-50 p-4 border border-[var(--border-default)] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                Activity
              </h4>
              {unreadCount > 0 && (
                <Badge variant="sage" size="xs" mono>
                  {unreadCount} NEW
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-mono text-[var(--accent-sage)] hover:underline"
              >
                MARK ALL READ
              </button>
            )}
          </div>

          <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto my-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)]">
                NO RECENT UPDATES
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`py-3 px-2 flex items-start gap-3 rounded-2xl hover:bg-[var(--bg-surface-hover)] transition cursor-pointer relative group ${
                    n.unread ? "bg-[var(--bg-surface-raised)]/60" : ""
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getRoleDot(n.role)}`}
                  />
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans">
                        {n.title}
                      </p>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                      {n.desc}
                    </p>
                  </div>
                  <button
                    onClick={(e) => removeNotification(n.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
