import { useEffect } from "react";

/**
 * Custom hook to register global keyboard shortcuts
 * Example:
 * useKeyboardShortcut([
 *   { key: 'k', ctrlOrCmd: true, handler: () => setOpen(true) }
 * ])
 */
export const useKeyboardShortcut = (shortcuts = []) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is actively typing in an input/textarea/editor unless it's Escape or Cmd+K
      const target = e.target;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.classList.contains("ProseMirror");

      for (const sc of shortcuts) {
        const matchesKey = e.key.toLowerCase() === sc.key.toLowerCase();
        const matchesCtrlOrCmd = sc.ctrlOrCmd ? (e.metaKey || e.ctrlKey) : true;
        const matchesShift = sc.shift ? e.shiftKey : !sc.shift ? true : true;

        if (matchesKey && matchesCtrlOrCmd) {
          // Allow Cmd+K or Escape even inside inputs
          if (isInput && sc.key !== "Escape" && !(sc.ctrlOrCmd && sc.key.toLowerCase() === "k")) {
            continue;
          }

          if (sc.preventDefault !== false) {
            e.preventDefault();
          }
          sc.handler(e);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};

