import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
} from "lucide-react";

const RichTextEditor = ({ content, setContent, darkMode = false }) => {
  const palette = darkMode
    ? {
        wrapper: "bg-[#292720] border-[#49463D]",
        toolbar: "border-[#49463D] bg-[#302F27]",
        text: "text-[#F6F2E9]",
        muted: "text-[#B5AE9F]",
        button: "text-[#D6D0C4] hover:bg-[#414035]",
        active: "bg-[#41483A] text-[#D5DFC9]",
        divider: "border-[#49463D]",
      }
    : {
        wrapper: "bg-[#FDFBF6] border-[#E7E0D4]",
        toolbar: "border-[#E7E0D4] bg-[#F6F2E9]",
        text: "text-[#292720]",
        muted: "text-[#817C70]",
        button: "text-[#5F5A50] hover:bg-[#E7E0D4]",
        active: "bg-[#E5E9DE] text-[#4B5C3F]",
        divider: "border-[#E7E0D4]",
      };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your note here...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `tiptap min-h-[170px] px-4 py-4 text-sm leading-7 outline-none ${palette.text}`,
      },
    },
  });

  if (!editor) return null;

  const toolbarButtons = [
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Bullet list",
      icon: List,
      active: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Code block",
      icon: Code,
      active: editor.isActive("codeBlock"),
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${palette.wrapper}`}
    >
      {/* Toolbar */}
      <div
        className={`flex flex-wrap items-center gap-1.5 border-b px-3 py-2.5 ${palette.toolbar} ${palette.divider}`}
        role="toolbar"
        aria-label="Text formatting"
      >
        {toolbarButtons.map(({ label, icon: Icon, active, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5C6E4E]/40 ${
              active
                ? palette.active
                : `${palette.button} ${palette.muted}`
            }`}
          >
            <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
          </button>
        ))}

        <div className={`ml-auto hidden items-center gap-1.5 sm:flex ${palette.muted}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#5C6E4E]" />
          <span className="text-[11px] font-medium">Rich text</span>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
