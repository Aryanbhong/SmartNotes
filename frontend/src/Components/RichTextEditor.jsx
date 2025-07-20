import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Code } from "lucide-react";

const RichTextEditor = ({ content, setContent, darkMode }) => {
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
  });

  if (!editor) return null;

  return (
    <div
      className={`rounded-md border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      {/* Toolbar */}
      <div
        className={`flex gap-2 p-2 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bold")
              ? darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
              : ""
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("italic")
              ? darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
              : ""
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bulletList")
              ? darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
              : ""
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("orderedList")
              ? darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
              : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("codeBlock")
              ? darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
              : ""
          }`}
          title="Code Block"
        >
          <Code size={16} />
        </button>
      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className={`min-h-[150px] p-3 prose max-w-none outline-none ${
          darkMode ? "prose-invert text-gray-200" : "text-gray-800"
        }`}
      />
    </div>
  );
};

export default RichTextEditor;
