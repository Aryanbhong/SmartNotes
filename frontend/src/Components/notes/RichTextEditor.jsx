import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Highlighter,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";
import { getReadingStats } from "../../utils/formatters";

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Capture your thoughts, lecture notes, or study points...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor synced when external content changes.
  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  const stats = getReadingStats(editor.getHTML());

  const ToolbarButton = ({ active, onClick, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`p-2 rounded-lg text-xs transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)]/40 ${
        active
          ? "bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)] shadow-sm"
          : "text-[var(--text-muted)] hover:bg-[var(--accent-sage)]/10 hover:text-[var(--accent-sage)]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight key text"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-[var(--border-subtle)] mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-[var(--border-subtle)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive("taskList")}
          title="Checklist / Todo"
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-[var(--border-subtle)] mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="p-4 sm:p-6 flex-1 min-h-[240px] text-[var(--text-primary)]">
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Status / Word Count */}
      <div className="px-4 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          <span>{stats.wordCount} words</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span>{stats.charCount} chars</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span>~{stats.readingTimeMin} min read</span>
        </div>

        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-heart)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-heart)]" />
          Ready
        </span>
      </div>
    </div>
  );
};
