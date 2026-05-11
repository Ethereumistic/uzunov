import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image,
  Quote,
  Code2,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface BlogRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const toolbarButtonClass =
  "p-1.5 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors disabled:opacity-30 disabled:pointer-events-none";

const separatorClass = "w-px h-5 bg-stone-300 mx-0.5";

export function BlogRichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
}: BlogRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: true,
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline hover:text-accent-mid",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes into the editor
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter the URL:", "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter the image URL:", "https://");
    if (url === null || url === "") return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-stone-200 rounded-xl bg-background animate-pulse min-h-[360px]" />
    );
  }

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-secondary px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className={separatorClass} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className={separatorClass} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className={separatorClass} />

        <ToolbarButton
          onClick={addLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={addImage}
          active={editor.isActive("image")}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </ToolbarButton>

        <div className={separatorClass} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Block Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <div className={separatorClass} />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* TipTap placeholder & prose styling overrides */}
      <style>{`
        .tiptap {
          outline: none;
          min-height: 300px;
        }
        .tiptap p.is-editor-empty:first-child::before {
          color: var(--ink-ghost);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap h1 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 1.75rem;
          line-height: 1.2;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .tiptap h2 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1.375rem;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .tiptap h3 {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1.125rem;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .tiptap p {
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .tiptap ul > li::marker {
          color: var(--ink-ghost);
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .tiptap ol > li::marker {
          color: var(--ink-ghost);
        }
        .tiptap li {
          margin-bottom: 0.25rem;
          color: var(--foreground);
        }
        .tiptap blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 0.75rem;
          font-style: italic;
          color: var(--ink-soft);
        }
        .tiptap strong {
          color: var(--foreground);
        }
        .tiptap pre {
          background: var(--stone-100);
          border: 1px solid var(--stone-200);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          font-size: 0.875rem;
          color: var(--foreground);
        }
        .tiptap code {
          background: var(--stone-100);
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-size: 0.875em;
          color: var(--accent);
        }
        .tiptap pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        .tiptap hr {
          border: none;
          border-top: 2px solid var(--stone-200);
          margin: 1.5rem 0;
        }
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1rem 0;
        }
        .tiptap a {
          color: var(--accent);
          text-decoration: underline;
        }
        .tiptap a:hover {
          color: var(--accent-mid);
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${toolbarButtonClass} ${active ? "bg-stone-200 text-stone-900" : ""}`}
    >
      {children}
    </button>
  );
}